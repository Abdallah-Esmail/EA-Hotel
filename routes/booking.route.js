import express from "express";
import bookingController from "../controllers/booking.controller.js";
import { protect, allowedTo } from "../controllers/auth.controller.js";
import {
  createBookingValidator,
  getBookingValidator,
} from "../utils/validators/bookingValidator.js";
import {
  cancelValidator,
  checkoutValidator,
} from "../utils/validatorSchemas/bookingSchema.js";

const router = express.Router();

router.use(protect);

router.get("/", allowedTo("admin", "manager"), (req, res, next) => {
  if (req.params.id) {
    return bookingController.getRoomBookings(req, res, next);
  }
  return bookingController.getAllBookings(req, res, next);
});

router.post("/", createBookingValidator, bookingController.createBooking);

router.route("/:id").get(getBookingValidator, bookingController.getBooking);

router.patch("/:id/cancel", cancelValidator, bookingController.cancelBooking);

router.post(
  "/:id/checkout-session",
  checkoutValidator,
  bookingController.checkoutSession,
);

export default router;
