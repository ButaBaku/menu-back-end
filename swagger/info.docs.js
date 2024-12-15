const infoDocs = {
  "/api/v1/info": {
    get: {
      summary: "Get info",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Info"],
      description: "Get info",
      responses: {
        200: {
          description: "Info found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  logo: {
                    type: "string",
                  },
                  backgroundImage: {
                    type: "string",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  phoneNumbers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  email: {
                    type: "string",
                  },
                  addressEN: {
                    type: "string",
                  },
                  addressAZ: {
                    type: "string",
                  },
                  instagram: {
                    type: "string",
                  },
                  facebook: {
                    type: "string",
                  },
                  whatsapp: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Info not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
    put: {
      summary: "Update info",
      security: [
        {
          jwtAuth: [],
        },
      ],
      tags: ["Info"],
      description: "Update info",
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                logo: {
                  type: "file",
                },
                backgroundImage: {
                  type: "file",
                },
                titleEN: {
                  type: "string",
                },
                titleAZ: {
                  type: "string",
                },
                phoneNumbers: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                email: {
                  type: "string",
                },
                addressEN: {
                  type: "string",
                },
                addressAZ: {
                  type: "string",
                },
                instagram: {
                  type: "string",
                },
                facebook: {
                  type: "string",
                },
                whatsapp: {
                  type: "string",
                },
              },
            },
          },
        },
      },

      responses: {
        200: {
          description: "Info updated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: {
                    type: "integer",
                  },
                  logo: {
                    type: "string",
                  },
                  backgroundImage: {
                    type: "string",
                  },
                  titleEN: {
                    type: "string",
                  },
                  titleAZ: {
                    type: "string",
                  },
                  phoneNumbers: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                  email: {
                    type: "string",
                  },
                  addressEN: {
                    type: "string",
                  },
                  addressAZ: {
                    type: "string",
                  },
                  instagram: {
                    type: "string",
                  },
                  facebook: {
                    type: "string",
                  },
                  whatsapp: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Info not found",
        },
        500: {
          description: "Some server error",
        },
      },
    },
  },
};

export default infoDocs;
