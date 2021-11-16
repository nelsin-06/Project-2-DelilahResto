const PORT = process.env.PORT || 3001;
const swaggerOptions = {
    definition: {
        openapi : "3.0.0",
        info: {
            title: "Mi primera API - SPRINT PROJECT 1",
            version: "1.0.0",
            description: "SPRINT PROJECT 1 - ACAMICA"
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: "SERVER API"
            }
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type: "http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {
                basicAuth: []
            }
        ]
    },
    apis: ["../src/route/*.js"]
};

module.exports = swaggerOptions;