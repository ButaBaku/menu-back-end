import swaggerJsdoc from "swagger-jsdoc";
import authDocs from "../swagger/auth.docs.js";
import categoryDocs from "../swagger/category.docs.js";
import subCategoryDocs from "../swagger/subcategory.docs.js";
import productDocs from "../swagger/product.docs.js";
import infoDocs from "../swagger/info.docs.js";
import campaigndocs from "../swagger/campaign.docs.js";

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
      {
        name: "Subcategory",
        description: "Subcategory routes",
      },
      {
        name: "Product",
        description: "Product routes",
      },
      {
        name: "Info",
        description: "Info routes",
      },
      {
        name: "Campaign",
        description: "Campaign routes",
      },
    ],

    paths: {
      ...authDocs,
      ...categoryDocs,
      ...subCategoryDocs,
      ...productDocs,
      ...infoDocs,
      ...campaigndocs,
    },

    servers: [],
  },

  apis: ["./routes/*.js"],
};

export const specs = swaggerJsdoc(options);
