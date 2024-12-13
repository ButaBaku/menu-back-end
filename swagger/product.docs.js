const productDocs = {
  "/api/v1/product": {
    get: {
      summary: "Get all products",
      security: [],
      tags: ["Product"],
      description: "Get all products",
      responses: {
        200: {
          description: "All products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                    },
                    titleEN: {
                      type: "string",
                    },
                    titleAZ: {
                      type: "string",
                    },
                    descEN: {
                      type: "string",
                    },
                    descAZ: {
                      type: "string",
                    },
                    gram: {
                      type: "string",
                    },
                    price: {
                      type: "number",
                    },
                    ingridientsAZ: {
                      type: "array",
                      properties: {
                        type: "string",
                      },
                    },
                    ingridientsEN: {
                      type: "array",
                      properties: {
                        type: "string",
                      },
                    },
                    isCombo: { type: "boolean" },
                    image: { type: "string" },
                    subCategoryId: { type: "number" },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" },

                    subCategory: {
                      type: "object",
                      properties: {
                        id: {
                          type: "number",
                        },
                        titleEN: {
                          type: "string",
                        },
                        titleAZ: {
                          type: "string",
                        },
                        categoryId: {
                          type: "number",
                        },
                        createdAt: {
                          type: "string",
                        },
                        updatedAt: {
                          type: "string",
                        },
                        category: {
                          type: "object",
                          properties: {
                            id: {
                              type: "number",
                            },
                            titleEN: {
                              type: "string",
                            },
                            titleAZ: {
                              type: "string",
                            },
                            image: {
                              type: "string",
                            },
                            createdAt: {
                              type: "string",
                            },
                            updatedAt: {
                              type: "string",
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Some server error",
        },
      },
    },
    post: {
      summary: "Create new product",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Product"],
      description: "Create new product",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "titleEN",
                "titleAZ",
                "descEN",
                "descAZ",
                "image",
                "gram",
                "subCategoryId",
              ],
              properties: {
                titleEN: {
                  type: "string",
                  description: "Product title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Product title in Azerbaijani",
                },
                descEN: {
                  type: "string",
                  description: "Product description in English",
                },
                descAZ: {
                  type: "string",
                  description: "Product description in Azerbaijani",
                },
                price: {
                  type: "number",
                  description: "Product price",
                },
                image: {
                  type: "file",
                  description: "Product image",
                },
                gram: {
                  type: "string",
                  description: "Product gram",
                },
                isCombo: {
                  type: "boolean",
                  description: "Is combo product",
                },
                ingridientsAZ: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Ingridients in Azerbaijani",
                },
                ingridientsEN: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Ingridients in English",
                },
                subCategoryId: {
                  type: "number",
                  description: "Sub category id",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "New product created",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  descEN: {
                    type: "string",
                  },
                  descAZ: {
                    type: "string",
                  },
                  gram: {
                    type: "string",
                  },
                  price: {
                    type: "number",
                  },
                  ingridientsAZ: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  ingridientsEN: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  isCombo: { type: "boolean" },
                  image: { type: "string" },
                  subCategoryId: { type: "number" },
                  createdAt: {
                    type: "string",
                  },
                  updatedAt: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
  "/api/v1/product/{id}": {
    get: {
      summary: "Get product by id",
      security: [],
      tags: ["Product"],
      description: "Get product by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        200: {
          description: "Product by id",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  descEN: {
                    type: "string",
                  },
                  descAZ: {
                    type: "string",
                  },
                  gram: {
                    type: "string",
                  },
                  price: {
                    type: "number",
                  },
                  ingridientsAZ: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  ingridientsEN: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  isCombo: { type: "boolean" },
                  image: { type: "string" },
                  subCategoryId: { type: "number" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },

                  subCategory: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                      },
                      titleEN: {
                        type: "string",
                      },
                      titleAZ: {
                        type: "string",
                      },
                      categoryId: {
                        type: "number",
                      },
                      createdAt: {
                        type: "string",
                      },
                      updatedAt: {
                        type: "string",
                      },
                      category: {
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                          },
                          titleEN: {
                            type: "string",
                          },
                          titleAZ: {
                            type: "string",
                          },
                          image: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                          },
                          updatedAt: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    put: {
      summary: "Update product by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Product"],
      description: "Update product by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                titleEN: {
                  type: "string",
                  description: "Product title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Product title in Azerbaijani",
                },
                descEN: {
                  type: "string",
                  description: "Product description in English",
                },
                descAZ: {
                  type: "string",
                  description: "Product description in Azerbaijani",
                },
                price: {
                  type: "number",
                  description: "Product price",
                },
                gram: {
                  type: "string",
                  description: "Product gram",
                },
                isCombo: {
                  type: "boolean",
                  description: "Is combo product",
                },
                ingridientsAZ: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Ingridients in Azerbaijani",
                },
                ingridientsEN: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  description: "Ingridients in English",
                },
                subCategoryId: {
                  type: "number",
                  description: "Sub category id",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  descEN: {
                    type: "string",
                  },
                  descAZ: {
                    type: "string",
                  },
                  gram: {
                    type: "string",
                  },
                  price: {
                    type: "number",
                  },
                  ingridientsAZ: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  ingridientsEN: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  isCombo: { type: "boolean" },
                  image: { type: "string" },
                  subCategoryId: { type: "number" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },

                  subCategory: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                      },
                      titleEN: {
                        type: "string",
                      },
                      titleAZ: {
                        type: "string",
                      },
                      categoryId: {
                        type: "number",
                      },
                      createdAt: {
                        type: "string",
                      },
                      updatedAt: {
                        type: "string",
                      },
                      category: {
                        type: "object",
                        properties: {
                          id: {
                            type: "number",
                          },
                          titleEN: {
                            type: "string",
                          },
                          titleAZ: {
                            type: "string",
                          },
                          image: {
                            type: "string",
                          },
                          createdAt: {
                            type: "string",
                          },
                          updatedAt: {
                            type: "string",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    delete: {
      summary: "Delete product by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Product"],
      description: "Delete product by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      responses: {
        204: {
          description: "Product deleted",
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
  "/api/v1/product/{id}/update-image": {
    post: {
      summary: "Update product image by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Product"],
      description: "Update product image by id",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "number",
          },
        },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["image"],
              properties: {
                image: {
                  type: "file",
                  description: "Product image",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product image updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "number",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  descEN: {
                    type: "string",
                  },
                  descAZ: {
                    type: "string",
                  },
                  gram: {
                    type: "string",
                  },
                  price: {
                    type: "number",
                  },
                  ingridientsAZ: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  ingridientsEN: {
                    type: "array",
                    properties: {
                      type: "string",
                    },
                  },
                  isCombo: { type: "boolean" },
                  image: { type: "string" },
                  subCategoryId: { type: "number" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" },
                },
              },
            },
          },
        },
        404: {
          description: "Product not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
};

export default productDocs;
