import express from "express";
import {
  createBooking,
  getBookingsByEmail,
  updateBookingStatus,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookingsByEmail);
router.patch("/:id/status", updateBookingStatus);

export default router;