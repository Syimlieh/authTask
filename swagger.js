require("dotenv").config();

const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes"];

const doc = {
  info: {
    title: "Voosh Backend Application",
    description: "Backend application",
  },
  securityDefinitions: {
    jwtToken: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Auth token generated after login',
    },
    jwtRefreshToken: {
      type: 'apiKey',
      in: 'header',
      name: 'refresh',
      description: 'Auth token generated after login',
    },
  },
  host: "localhost:4000",
  schemes: ["http", "https"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server");
});
