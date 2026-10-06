import express from "express";
import roomController from "../controllers/room.controller.js";
import bookingController from "../controllers/booking.controller.js";
import * as authController from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/:id/bookings", bookingController.getRoomBookings);

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
