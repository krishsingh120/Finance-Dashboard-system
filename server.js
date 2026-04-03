const app = require("./src/app");
const connectDB = require("./src/config/dbConfig");
const { connectRedis } = require("./src/config/redisConfig");
const { PORT, NODE_ENV } = require("./src/config/serverConfig");

const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  });
};

startServer();
