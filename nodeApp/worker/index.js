// import packages
const amqplib = require("amqplib");
const mysql = require("mysql");

// RabbitMQ url, queue & DB configs
const rabbitmq_url =
  "amqps://ijtpwtvb:JkFwvSCm2osHPLlMX1YVG8HjPXuxtkHA@chinook.rmq.cloudamqp.com/ijtpwtvb";
const queue_name = "user-messages";
const dbConfig = {
  host: "remotemysql.com",
  user: "oet5BBhDiS",
  password: "B3Fx6F4MS8",
  database: "oet5BBhDiS",
};

// worker function
start_worker = async () => {
  // create connection
  const connection = await amqplib.connect(rabbitmq_url);
  // create channel
  const channel = await connection.createChannel();

  // create a consumer
  channel.consume(queue_name, (msg) => {
    // parse the queue data
    const user = JSON.parse(msg.content.toString());
    console.log({ user });

    // create DB connection
    const db = mysql.createConnection(dbConfig);
    db.connect();
    const sql = "INSERT INTO users SET ?";

    // query the DB to insert the data
    db.query(sql, user, (error, results, fields) => {
      db.destroy();
      if (error) {
        console.log("DB error");
      } else {
        console.log("DB insertion done");
      }
    });
  });
};

// start the worker
start_worker();
