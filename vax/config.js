const { KAFKA_PORT, KAFKA_BROKER } = process.env;

module.exports = {
  topics: [
    {
      topic: "Shipments",
    },
  ],
  kafkaRetryPolicy: {
      initialRetryTime: 5000,
      maxRetryTime: 5000,
      retries: 10
  },
  kafkaBrokersAddress: [KAFKA_BROKER],
  listenToEvents: {
    manufacturer: [],
    authority: ["ShipmentCreated"],
    customer: ["ShipmentCreated"],
  },
};
