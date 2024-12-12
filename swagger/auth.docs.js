const authDocs = {
  "/api/v1/auth/signup": {
    post: {
      summary: "Create a new user",
      security: [],
      tags: ["Auth"],
      description: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "User email",
                },
                password: {
                  type: "string",
                  format: "password",
                  description: "User password",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "The created user.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accessToken"],
                properties: {
                  message: {
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
  "/api/v1/auth/login": {
    post: {
      summary: "Login to the application",
      security: [],
      tags: ["Auth"],
      description: "Get access token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "User email",
                },
                password: {
                  type: "string",
                  format: "password",
                  description: "User password",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "The created user.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["accessToken"],
                properties: {
                  message: {
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

export default authDocs;
