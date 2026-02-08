import crypto from "crypto";
import { ValidationError } from "../../../../packages/error-handler";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction, Request, Response } from "express";
import prisma from "../../../../packages/libs/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required fields`);
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError(`Invalid email format`);
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError(
        "OTP recently sent! Please wait a minute before requesting again."
      )
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");

  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // Lock for 1 hour
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before requesting again."
      )
    );
  }
  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); // Increment request count and set expiration to 1 hour
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify Your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300); // Store OTP for 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // Set cooldown for 1 minute
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new ValidationError(
      "OTP expired or not found. Please request a new one."
    );
  }

  if (storedOtp !== otp) {
    // Increment failed attempts
    const failedAttemptsKey = `otp_failed_attempts:${email}`;
    let failedAttempts =
      parseInt((await redis.get(failedAttemptsKey)) || "0") + 1;

    if (failedAttempts >= 3) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // Lock for 30 minutes
      await redis.del(failedAttemptsKey); // Reset failed attempts
      throw new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes"
      );
    } else {
      await redis.set(failedAttemptsKey, failedAttempts.toString(), "EX", 1800); // Set expiration to 30 minutes
      throw new ValidationError(
        `Invalid OTP. You have ${3 - failedAttempts} attempts left.`
      );
    }
  }

  // OTP is valid, clear it and any failed attempts
  await redis.del(`otp:${email}`);
  await redis.del(`otp_failed_attempts:${email}`);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError("Email is required");
    const user =
      userType === "user" &&
      (await prisma.users.findUnique({ where: { email } }));
    if (!user) {
      throw new ValidationError("No account found with this email");
    }
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(user.name, email, "password-reset-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    return next(error);
  }
};


export const verifyForgotPasswordOtp = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ValidationError("Email and OTP are required");
    }

    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: "OTP verified. You can now reset your password.",
    });
  }
  catch (error) {
    return next(error);
  }
};
