const { generateId } = require("../utils/helpers");

class Message {
  constructor(
    nonce,
    timestamp,
    hash,
    messageType,
    actorId,
    messageContent,
    shipment
  ) {
    this.id = generateId();
    this.nonce = nonce;
    this.timestamp = timestamp;
    this.payload = new MessagePayload(
      messageType,
      actorId,
      messageContent,
      shipment
    );
    this.hash = hash;
    this.signature = null;
  }

  getMessage() {
    return {
      id: this.id,
      nonce: this.nonce,
      timestamp: this.timestamp,
      payload: this.payload.getMessagePayload(),
      hash: this.hash,
      signature: this.signature,
    };
  }
}

class MessagePayload {
  constructor(messageType, actorId, messageContent, shipment) {
    this.messageType = messageType;
    this.actorId = actorId;
    this.shipment = shipment;
    this.messageContent = messageContent;
  }

  getMessagePayload() {
    return {
      messageType: this.messageType,
      actorId: this.actorId,
      messageContent: this.messageContent,
      shipment: this.shipment,
    };
  }
}

module.exports = Message;
