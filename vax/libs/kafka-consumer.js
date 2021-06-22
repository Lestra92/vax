const { Kafka } = require("kafkajs");
const {
  listenToEvents,
  kafkaBrokersAddress,
  kafkaRetryPolicy,
} = require("../config");
const {
  handleShipmentCreatedMessage,
  handleMessageAck,
} = require("../controllers/shipmentController");
const { generateId } = require("../utils/helpers");

const actorEvents = listenToEvents[process.env.ACTOR];

async function startConsuming() {
  try {
    const { ACTOR: groupId } = process.env;
    const kafka = new Kafka({
      clientId: `${groupId}-${generateId()}`,
      brokers: kafkaBrokersAddress,
      retry: kafkaRetryPolicy,
    });
    const consumer = kafka.consumer({ groupId });
    console.log("Connecting consumer...");
    await consumer.connect();
    console.log("Connected! consumer");

    await consumer.subscribe({ topic: "Shipments", fromBeginning: true });

    await consumer.run({
      eachMessage: async (result) => {
        const msg = JSON.parse(result.message.value.toString());
        handleMessage(msg);
      },
    });
  } catch (error) {
    console.log("Error happened:", error);
  }
}

function handleMessage(msg) {
  if (msg?.payload?.messageType === "EventNotification") {
    if (actorEvents.indexOf(msg?.payload?.messageContent) > -1) {
      console.log("I am interested in this EventNotification");
      console.log(msg);
      if (msg?.payload?.messageContent === "ShipmentCreated") {
        const { vaccineName, quantity, manufacturingDat } =
          msg.payload.shipment;
        handleShipmentCreatedMessage(
          msg,
          vaccineName,
          quantity,
          manufacturingDat
        );
      }
    }
  }
  if (msg?.payload?.messageType === "MessageAcknowledgement") {
    console.log("I am interested in this MessageAcknowledgement");
    console.log(msg);

    handleMessageAck(msg, msg.payload.shipment.id);
  }
}

module.exports = startConsuming;
