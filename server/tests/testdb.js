const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongod = new MongoMemoryServer();

module.exports.connect = async () => {
  const uri = await mongod.getConnectionString();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};

module.exports.clearDB = async (clear = true) => {
  if (clear) {
    await mongoose.connection.dropDatabase();
  }
};

module.exports.disconnect = async (clear = true) => {
  this.clearDB(clear);
  await mongoose.connection.close();
  await mongod.stop();
};
