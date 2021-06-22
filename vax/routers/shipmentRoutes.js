const express = require("express");
const shipmentController = require("../controllers/shipmentController");

const router = express.Router();

router.route("/").get(shipmentController.getAllShipments);
if (process.env.ACTOR === "manufacturer") {
  router
    .route("/")
    .post(shipmentController.checkBody, shipmentController.createShipment);
}

router.route("/:id").get(shipmentController.getShipmentById);

module.exports = router;
