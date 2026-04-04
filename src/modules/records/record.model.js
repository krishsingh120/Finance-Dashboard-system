const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// indexes for faster filtering queries
recordSchema.index({ type: 1 });
recordSchema.index({ category: 1 });
recordSchema.index({ date: -1 });
recordSchema.index({ userId: 1 });

module.exports = mongoose.model("Record", recordSchema);
