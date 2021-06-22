const Shipment = require("../models/Shipment");
const crypto = require("crypto");
const shipments = [];

exports.getAllShipments = (req, res) => {
  res.status(200).json({
    status: "success",
    results: shipments.length,
    data: { shipments },
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.vaccineName || !req.body.quantity) {
    return res.status(400).json({
      status: "fail",
      message: "Missing vaccineName or quantity",
    });
  }
  next();
};

exports.getShipmentById = (req, res) => {
  const id = +req.params.id;
  const shipment = shipments.find((el) => el.id === id);
  if (!shipment) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  res.status(200).json({
    status: "success",
    data: { shipment },
  });
};

exports.createShipment = (req, res) => {
  const { vaccineName, quantity } = req.body;
  const newShipment = new Shipment(vaccineName, quantity);
  const shipmentObj = newShipment.getShipment();
  const timestamp = new Date().toISOString();
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(shipmentObj))
    .digest("hex");
  const eventType = newShipment.addNewEvent(
    "ShipmentCreated",

    shipmentObj,
    timestamp,
    hash
  );
  newShipment.sendMessage(
    "Shipments",
    eventType,
    "EventNotification",
    shipmentObj,
    timestamp,
    hash
  );

  shipments.push(newShipment);
  res.status(201).json({
    status: "success",
    data: {
      newShipment,
    },
  });
};

exports.handleShipmentCreatedMessage = (
  msg,
  vaccineName,
  quantity,
  manufacturingDate
) => {
  const newShipment = new Shipment(vaccineName, quantity, manufacturingDate);
  newShipment.sendAckMessage("Shipments", msg);
  shipments.push(newShipment);
};

exports.handleMessageAck = (msg, shipmentId) => {
  const shipment = shipments.find((el) => el.id === shipmentId);
  if (shipment) {
    shipment.handleReceivedAckMessage(msg)
  }
}
