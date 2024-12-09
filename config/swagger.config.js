import swaggerJsdoc from "swagger-jsdoc";
import authDocs from "../swagger/auth.docs.js";
import categoryDocs from "../swagger/category.docs.js";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Admin Dashboard API",
      version: "0.1.0",
      description: "CRUD API made with Express and documented with Swagger",
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
      {
        name: "Category",
        description: "Category routes",
      },
    ],

    paths: { ...authDocs, ...categoryDocs },

    servers: [],
  },

  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(options);
