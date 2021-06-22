const { generateId } = require("../utils/helpers");

class Event {
  constructor(nonce, timestamp, hash, eventType, actorId, shipment) {
    this.id = generateId();
    this.nonce = nonce;
    this.timestamp = timestamp;
    this.payload = new EventPayload(eventType, actorId, shipment);
    this.hash = hash;
    this.signature = null;
  }

  getEvent() {
    return {
      id: this.id,
      nonce: this.nonce,
      timestamp: this.timestamp,
      payload: this.payload.getEventPayload(),
      hash: this.hash,
      signature: this.signature,
    };
  }
}

class EventPayload {
  constructor(eventType, actorId, shipment) {
    this.eventType = eventType;
    this.actorId = actorId;
    this.shipment = shipment;
  }
  getEventPayload() {
    return {
      eventType: this.eventType,
      actorId: this.actorId,
      shipment: this.shipment,
    };
  }
}

module.exports = Event;
