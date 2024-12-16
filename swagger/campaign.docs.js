const campaigndocs = {
  "/api/v1/campaign": {
    get: {
      summary: "Get all campaigns",
      security: [],
      tags: ["Campaign"],
      description: "Get all campaigns",
      responses: {
        200: {
          description: "All campaigns",
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
                    textEN: {
                      type: "string",
                    },
                    textAZ: {
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
        500: {
          description: "Some server error",
        },
      },
    },
    post: {
      summary: "Create new campaign",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Campaign"],
      description: "Create new campaign",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["titleEN", "titleAZ", "image"],
              properties: {
                titleEN: {
                  type: "string",
                  description: "Campaign title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Campaign title in Azerbaijani",
                },
                textEN: {
                  type: "string",
                  description: "Campaign text in English",
                },
                textAZ: {
                  type: "string",
                  description: "Campaign text in Azerbaijani",
                },
                image: {
                  type: "file",
                  description: "Campaign image",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "New campaign created",
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
                  textEN: {
                    type: "string",
                  },
                  textAZ: {
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
  "/api/v1/campaign/{id}": {
    get: {
      summary: "Get campaign by id",
      security: [],
      tags: ["Campaign"],
      description: "Get campaign by id",
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
          description: "Campaign by id",
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
                  textEN: {
                    type: "string",
                  },
                  textAZ: {
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
          description: "Campaign not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    put: {
      summary: "Update campaign by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Campaign"],
      description: "Update campaign by id",
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
                  description: "Campaign title in English",
                },
                titleAZ: {
                  type: "string",
                  description: "Campaign title in Azerbaijani",
                },
                textEN: {
                  type: "string",
                  description: "Campaign text in English",
                },
                textAZ: {
                  type: "string",
                  description: "Campaign text in Azerbaijani",
                },
                image: {
                  type: "file",
                  description: "Campaign image",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Campaign updated",
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
                  textEN: {
                    type: "string",
                  },
                  textAZ: {
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
          description: "Campaign not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    delete: {
      summary: "Delete campaign by id",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Campaign"],
      description: "Delete campaign by id",
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
          description: "Campaign deleted",
        },
        404: {
          description: "Campaign not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
};

export default campaigndocs;
