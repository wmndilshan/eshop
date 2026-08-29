import express, { Router } from "express";
import {
  createShop,
  createStripeConnectLink,
  getSeller,
  getUser,
  loginSeller,
  loginUser,
  refreshToken,
  registerSeller,
  resetUserPassword,
  userForgotPassword,
  userRegistration,
  verifySeller,
  verifyUser,
  verifyUsersForgotPassword,
} from "../controller/auth.controller";
import isAuthenticated from "../../../../packages/middleware/isAuthenticated";
import { isSeller } from "../../../../packages/middleware/authorizedRoles";

const router: Router = express.Router();

router.post("/user-registration", userRegistration);
router.post("/verify-user", verifyUser);
router.post("/login-user", loginUser);
router.post("/login", loginUser); // Alias for frontend
router.post("/refresh-token-user", refreshToken);
router.get("/loged-in-user", isAuthenticated, getUser);
router.post("/forgot-password-user", userForgotPassword);
router.post("/forgot-password", userForgotPassword); // Alias for frontend
router.post("/reset-password-user", resetUserPassword);
router.post("/reset-password", resetUserPassword); // Alias for frontend
router.post("/verify-forgot-password-otp", verifyUsersForgotPassword);
router.post("/resend-otp", userRegistration); // Alias to send OTP again
router.post("/seller-registration", registerSeller);
router.post("/verify-seller", verifySeller);
router.post("/create-shop", createShop);
router.post("/create-stripe-link", createStripeConnectLink);
router.post("/login-seller", loginSeller);
router.get("/logged-in-seller", isAuthenticated, isSeller, getSeller);

export default router;
