const mongoose = require("mongoose");
const container = require("typedi").Container;
const logger = require("./logger");

container.set("logger", logger);

module.exports.connect = async () => {
  try {
    const uri = "mongodb://mongo:27017";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
  } catch (err) {
    logger.error(`testdb connect(): ${err}`);
  }
};

module.exports.clearDB = async (clear = true) => {
  if (clear) {
    try {
      await mongoose.connection.dropDatabase();
    } catch (err) {
      logger.error(`testdb clearDB(): ${err}`);
    }
  }
};

module.exports.disconnect = async (clear = true) => {
  await this.clearDB(clear);
  try {
    await mongoose.connection.close();
  } catch (err) {
    logger.error(`testdb disconnect(): ${err}`);
  }
};
