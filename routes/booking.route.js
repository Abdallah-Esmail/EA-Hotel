import express from "express";
import bookingController from "../controllers/booking.controller.js";
import { protect, allowedTo } from "../controllers/auth.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", allowedTo("admin", "manager"), (req, res, next) => {
  if (req.params.id) {
    return bookingController.getRoomBookings(req, res, next);
  }
  return bookingController.getAllBookings(req, res, next);
});

router.post("/", bookingController.createBooking);

router.route("/:id").get(bookingController.getBooking);

router.patch("/:id/cancel", bookingController.cancelBooking);

router.post("/:id/checkout-session", bookingController.checkoutSession);

export default router;
