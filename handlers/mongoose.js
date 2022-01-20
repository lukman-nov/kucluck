const mongoose = require('mongoose');
const {
  mongodb
} = require('../botconfig/config.json');

module.exports = (client) => {
  mongoose.connect(mongodb.connect, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    autoIndex: false,
    connectTimeoutMS: 10000,
    family: 4
  });
  mongoose.set('strictQuery', false);
  mongoose.Promise = global.Promise;
  mongoose.connection.on('connected', () => {
    setTimeout(() => {
      client.logger(`Mongo connected :: ${String(mongodb.connect).brightBlue.underline}`);
    }, 1500)
  });
  mongoose.connection.on('disconnected', () => {
    client.logger(`Mongo disconnected :: ${String(mongodb.connect).brightBlue.underline}`);
    setTimeout(() => {
      mongoose.connect(mongodb.connect, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4
      });
    }, 1000);
  });
  mongoose.connection.on('err', (err) => {
    client.logger(`Mongo errored ::  ${String(mongodb.connect).brightBlue.underline}`);
  });
};
