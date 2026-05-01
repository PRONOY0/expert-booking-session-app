import mongoose from "mongoose";
import { Booking } from "../models/Booking.model.js";
import { TimeSlot } from "../models/TimeSlot.model.js";

export const createBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, expertId, slotId, notes } = req.body;

    if (!name || !email || !phone || !expertId || !slotId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "name, email, phone, expertId and slotId are required",
      });
    }

    const slot = await TimeSlot.findById(slotId).session(session);
    if (!slot) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Time slot not found" });
    }

    if (slot.isBooked) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(409)
        .json({ success: false, message: "This slot is already booked" });
    }

    slot.isBooked = true;
    await slot.save({ session });

    const booking = await Booking.create(
      [{ name, email, phone, expertId, slotId, notes }],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    const io = req.app.get("io");
    io.emit("slot-booked", { slotId, expertId: slot.expertId });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: booking[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This slot was just booked by someone else",
      });
    }

    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const bookings = await Booking.find({ email })
      .populate("expertId", "name category")
      .populate("slotId", "date startTime endTime")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PENDING", "CONFIRMED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be PENDING, CONFIRMED or COMPLETED",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
