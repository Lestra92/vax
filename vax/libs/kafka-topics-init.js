const { Kafka } = require("kafkajs");
const {
  topics,
  kafkaBrokersAddress,
  kafkaRetryPolicy,
} = require("../config.js");
const { generateId } = require("../utils/helpers");

async function initKafkaTopics(clientId) {
  try {
    const kafka = new Kafka({
      clientId: `${clientId}-${generateId()}`,
      brokers: kafkaBrokersAddress,
      retry: kafkaRetryPolicy,
    });

    const admin = kafka.admin();
    console.log("Connecting...");
    await admin.connect();
    console.log("Connected!");
    console.log("Creating topics ---->");
    await admin.createTopics({ topics });

    console.log("Created topics");
    console.log("Done!");
    await admin.disconnect();
    return { topicCreated: true };
  } catch (error) {
    console.log("Error happened:", error);
  }
}

module.exports = initKafkaTopics;
