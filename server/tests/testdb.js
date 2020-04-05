const mongoose = require("mongoose");
const container = require("typedi").Container;
const { MongoMemoryServer } = require("mongodb-memory-server");
const logger = require("./logger");

const mongod = new MongoMemoryServer();
container.set("logger", logger);

module.exports.connect = async () => {
  try {
    const uri = await mongod.getConnectionString();

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  } catch (err) {
    logger.error(err);
  }
};

module.exports.clearDB = async (clear = true) => {
  if (clear) {
    try {
      await mongoose.connection.dropDatabase();
    } catch (err) {
      logger.error(err);
    }
  }
};

module.exports.disconnect = async (clear = true) => {
  this.clearDB(clear);
  try {
    await mongoose.connection.close();
    await mongod.stop();
  } catch (err) {
    logger.error(err);
  }
};
