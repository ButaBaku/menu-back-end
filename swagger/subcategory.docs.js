const subCategoryDocs = {
  "/api/v1/subcategory": {
    get: {
      summary: "Get all subcategories",
      security: [],
      tags: ["Subcategory"],
      description: "Get all subcategories",
      responses: {
        200: {
          description: "All subcategories",
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
                    products: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          titleEN: { type: "string" },
                          titleAZ: { type: "string" },
                          descEN: { type: "string" },
                          descAZ: { type: "string" },
                          gram: { type: "string" },
                          price: { type: "number" },
                          ingridientsAZ: {
                            type: "array",
                            items: {
                              type: "string",
                            },
                          },
                          ingridientsEN: {
                            type: "array",
                            items: {
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
      summary: "Create new subcategory",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Subcategory"],
      description: "Create new subcategory",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["titleEN", "titleAZ", "categoryId"],
              properties: {
                titleEN: {
                  type: "string",
                  description: "Subcategory title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Subcategory title in Azerbaijani",
                },
                categoryId: {
                  type: "number",
                  description: "Category id",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "New subcategory created",
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
                  categoryId: {
                    type: "number",
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
        500: {
          description: "Some server error",
        },
      },
    },
  },
  "/api/v1/subcategory/{id}": {
    get: {
      summary: "Get subcategory by id",
      security: [],
      tags: ["Subcategory"],
      description: "Get subcategory by id",
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
          description: "Subcategory by id",
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
                  products: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number" },
                        titleEN: { type: "string" },
                        titleAZ: { type: "string" },
                        descEN: { type: "string" },
                        descAZ: { type: "string" },
                        gram: { type: "string" },
                        price: { type: "number" },
                        ingridientsAZ: {
                          type: "array",
                          items: {
                            type: "string",
                          },
                        },
                        ingridientsEN: {
                          type: "array",
                          items: {
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
            },
          },
        },
        404: {
          description: "Subcategory not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    put: {
      summary: "Update subcategory by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Subcategory"],
      description: "Update subcategory by id",
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
                  description: "Subcategory title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Subcategory title in Azerbaijani",
                },
                categoryId: {
                  type: "number",
                  description: "Category id",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Subcategory updated",
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
        404: {
          description: "Subcategory not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    delete: {
      summary: "Delete subcategory by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Subcategory"],
      description: "Delete subcategory by id",
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
          description: "Subcategory deleted",
        },
        404: {
          description: "Subcategory not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
};

export default subCategoryDocs;
