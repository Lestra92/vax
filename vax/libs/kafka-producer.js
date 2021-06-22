const { Kafka } = require("kafkajs");
const { kafkaBrokersAddress, kafkaRetryPolicy } = require("../config.js");
const { generateId } = require("../utils/helpers");

async function produceMessage(topic, message) {
  try {
    const { ACTOR: clientId } = process.env;
    const kafka = new Kafka({
      clientId: `${clientId}-${generateId()}`,
      brokers: kafkaBrokersAddress,
      retry: kafkaRetryPolicy
    });

    const producer = kafka.producer();
    console.log("Connecting producer...");
    await producer.connect();
    console.log("Connected! producer");
    const result = await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
    console.log("Done!");
    await producer.disconnect();
  } catch (error) {
    console.log("Error happened:", error);
  }
}

module.exports = produceMessage;
