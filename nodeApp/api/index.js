// import packages
const express = require("express");
const cors = require("cors");
const amqplib = require("amqplib");
const app = express();

// initialize request body parsing and cors
app.use(express.json());
app.use(cors());

// RabbitMQ url and queue
const rabbitmq_url =
  "amqps://ijtpwtvb:JkFwvSCm2osHPLlMX1YVG8HjPXuxtkHA@chinook.rmq.cloudamqp.com/ijtpwtvb";
const queue_name = "user-messages";

// simple GET API endpoint to check if API is working
app.get("/", (req, res) => res.json({ message: "Node.js API is working" }));

// POST API endpoint to save the data
app.post("/", async (req, res) => {
  const { body, headers } = req;
  console.log({ body });

  if (headers.token !== 'faebcffa-713c-4282-b51d-d4d4716d7efc') { 
    res.status(403).json({message: 'unauth'});
  }

  // create connection
  const connection = await amqplib.connect(rabbitmq_url);
  // create chanel
  const channel = await connection.createChannel();
  // send the request body into queue
  channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(body)));

  // send 201 as response code
  res.status(201).json();
});

// listen to a PORT
const server = app.listen(process.env.PORT || 4001, () => {
  console.log("API running @", server.address().port);
});
