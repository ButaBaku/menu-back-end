const categoryDocs = {
  "/api/v1/category": {
    get: {
      summary: "Get all categories",
      security: [
        {
          jwtAuth: [],
        },
      ],
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
              required: ["titleEN", "titleAZ", "image"],
              properties: {
                titleEN: {
                  type: "string",
                  description: "Category title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Category title in Azerbaijani",
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
};

export default categoryDocs;
