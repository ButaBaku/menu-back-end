const categoryDocs = {
  "/api/v1/category": {
    get: {
      summary: "Get all categories",
      security: [],
      tags: ["Category"],
      description: "Get all categories",
      responses: {
        200: {
          description: "All categories",
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
                    image: {
                      type: "string",
                    },
                    position: {
                      type: "number",
                    },
                    createdAt: {
                      type: "string",
                    },
                    updatedAt: {
                      type: "string",
                    },
                    subCategories: {
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
        500: {
          description: "Some server error",
        },
      },
    },
    post: {
      summary: "Create new category",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Category"],
      description: "Create new category",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["titleEN", "titleAZ", "position", "image"],
              properties: {
                titleEN: {
                  type: "string",
                  description: "Category title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Category title in Azerbaijani",
                },
                position: {
                  type: "number",
                  description: "Category position",
                },
                image: {
                  type: "file",
                  description: "Category image",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "New category created",
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
                  position: {
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
  "/api/v1/category/{id}": {
    get: {
      summary: "Get category by id",
      security: [],
      tags: ["Category"],
      description: "Get category by id",
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
          description: "Category by id",
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
                  position: {
                    type: "number",
                  },
                  createdAt: {
                    type: "string",
                  },
                  updatedAt: {
                    type: "string",
                  },
                  subCategories: {
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
        404: {
          description: "Category not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    put: {
      summary: "Update category by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Category"],
      description: "Update category by id",
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
              properties: {
                titleEN: {
                  type: "string",
                  description: "Category title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Category title in Azerbaijani",
                },
                position: {
                  type: "number",
                  description: "Category position",
                },
                image: {
                  type: "file",
                  description: "Category image",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Category updated",
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
                  position: {
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
        404: {
          description: "Category not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    delete: {
      summary: "Delete category by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Category"],
      description: "Delete category by id",
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
          description: "Category deleted",
        },
        404: {
          description: "Category not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
};

export default categoryDocs;
