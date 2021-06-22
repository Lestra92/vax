const express = require("express");
const morgan = require("morgan");
const startConsuming = require("./libs/kafka-consumer");
const shipmentRoutes = require("./routers/shipmentRoutes");

const app = express();

// middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

if (process.env.ACTOR === "manufacturer") {
  const initKafkaTopics = require("./libs/kafka-topics-init");
  setTimeout(
    () => initKafkaTopics(process.env.ACTOR).then(() => startConsuming()),
    5 * 1000
  );
} else {
  setTimeout(() => startConsuming(), process.env.KAFKA_CONNECTION_TIMEOUT * 1000);
}
app.use("/api/v1/shipments", shipmentRoutes);

module.exports = app;
