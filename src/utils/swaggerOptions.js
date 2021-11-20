const PORT = process.env.PORT || 3001;
const swaggerOptions = {
    definition: {
        openapi : "3.0.0",
        info: {
            title: "API - SPRINT PROJECT 2",
            version: "1.0.0",
            description: "SPRINT PROJECT 2 - ACAMICA"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "SERVER API"
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./src/route/*.js"]
};

module.exports = swaggerOptions;