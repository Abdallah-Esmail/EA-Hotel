import express from "express";
import roomController from "../controllers/room.controller.js";
import * as authController from "../controllers/auth.controller.js";
import bookingRoute from "./booking.route.js";

const router = express.Router();

router.use("/:id/bookings", bookingRoute);

router.get("/:id/check-availability", roomController.checkAvailability);

router
  .route("/")
  .get(roomController.getAllRooms)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    roomController.uploadRoomImage,
    roomController.resizeRoomImage,
    roomController.createRoom,
  );

router
  .route("/:id")
  .get(roomController.getRoom)
  .patch(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    roomController.uploadRoomImage,
    roomController.resizeRoomImage,
    roomController.updateRoom,
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    roomController.deleteRoom,
  );

export default router;
