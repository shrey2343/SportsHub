import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
  date: { type: Date, required: true },
  location: String,
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
