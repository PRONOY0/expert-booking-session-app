import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    
    email: {
      type: String,
      required: true,
    },
    
    phone: {
      type: String,
      required: true,
    },
    
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },
    
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TimeSlot",
      required: true,
      unique: true,
    },
    
    notes: {
      type: String,
    },
    
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
