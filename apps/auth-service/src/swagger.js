const swaggerAutogen = require("swagger-autogen");

const doc = {
  info: {
    title: "Eshop Auth Service API",
    description: "Authentication service for Eshop",
    version: "1.0.0",
  },
  host: "localhost:6001",
  basePath: "/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/auth.router.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
