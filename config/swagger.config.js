import swaggerJsdoc from "swagger-jsdoc";
import authDocs from "../swagger/auth.docs.js";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Admin Dashboard API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },

    components: {
      securitySchemes: {
        jwtAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },

    tags: [
      {
        name: "Auth",
        description: "Authentication routes",
      },
    ],

    paths: { ...authDocs },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(options);
