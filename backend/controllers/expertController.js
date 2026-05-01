import { Expert } from "../models/Expert.model.js";
import { TimeSlot } from "../models/TimeSlot.model.js";

export const getExperts = async (req, res) => {
  try {
    const { name, category, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (name) filter.name = { $regex: name, $options: "i" };
    if (category) filter.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [experts, total] = await Promise.all([
      Expert.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Expert.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      experts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getExpertById = async (req, res) => {
  try {
    const { id } = req.params;

    const expert = await Expert.findById(id);
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: "Expert not found",
      });
    }

    const timeSlots = await TimeSlot.find({ expertId: id }).sort({
      date: 1,
      startTime: 1,
    });

    const groupedSlots = timeSlots.reduce((acc, slot) => {
      const dateKey = slot.date.toISOString().split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(slot);
      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      expert,
      slots: groupedSlots,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
