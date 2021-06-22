const { generateId } = require("../utils/helpers");
const produceMessage = require("../libs/kafka-producer");
const Event = require("./Event");
const Message = require("./Message");

class Shipment {
  constructor(vaccineName, quantity, manufacturingDate) {
    this.id = generateId();
    this.vaccineName = vaccineName;
    this.quantity = quantity;
    this.manufacturingDate = manufacturingDate || new Date();
    this.manufacturerId = "manufacturer";
    this.authorityId = null;
    this.customerId = null;
    this.events = [];
    this.messagesSent = [];
    this.messagesReceived = [];
  }

  getShipment() {
    return {
      id: this.id,
      vaccineName: this.vaccineName,
      quantity: this.quantity,
      manufacturingDate: this.manufacturingDate,
      manufacturerId: this.manufacturerId,
      authorityId: this.authorityId,
      customerId: this.customerId,
    };
  }

  addNewEvent(eventType, obj, timestamp, hash) {
    const event = new Event(
      this.events.length,
      timestamp,
      hash,
      eventType,
      process.env.ACTOR,
      obj
    );
    this.events.push(event);
    return eventType;
  }

  sendMessage(topic, eventType, messageType, obj, timestamp, hash) {
    const message = new Message(
      this.events.length,
      timestamp,
      hash,
      messageType,
      process.env.ACTOR,
      eventType,
      obj
    );
    produceMessage(topic, message.getMessage());
    this.messagesSent.push(message);
  }
  sendAckMessage(topic, msg) {
    this.messagesReceived.push(msg);
    const ackMessage = {
      ...msg,
      payload: {
        ...msg.payload,
        actorId: process.env.ACTOR,
        messageType: "MessageAcknowledgement",
      },
    };
    produceMessage(topic, ackMessage);
    this.messagesSent.push(ackMessage);
  }

  handleReceivedAckMessage(ackMessage) {
    this.messagesReceived.push(ackMessage);
  }
}

module.exports = Shipment;
