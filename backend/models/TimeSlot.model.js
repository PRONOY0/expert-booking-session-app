import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expert",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);
