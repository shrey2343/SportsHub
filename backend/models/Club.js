import mongoose from "mongoose";

const clubSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      unique: true 
    },
    location: { 
      type: String, 
      required: true, 
      trim: true 
    },
    registrationFee: { 
      type: Number, 
      default: 0, 
      min: 0 
    },
    sport: { 
      type: String, 
      enum: ["Football", "Basketball", "Tennis", "Cricket", "Swimming", "Athletics", "Badminton", "Table Tennis", "Volleyball", "Hockey"], 
      required: true 
    },
    coach: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Coach", 
      required: true 
    },
    players: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Player" 
    }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'inactive'],
      default: 'pending'
    },
    description: {
      type: String,
      trim: true
    },
    maxPlayers: {
      type: Number,
      min: 1
    },
    facilities: {
      type: String,
      trim: true
    },
  },
  { timestamps: true }
);

// Custom static method
clubSchema.statics.findWithRelations = function (id) {
  return this.findById(id).populate("coach").populate("players");
};

// Index for faster queries
clubSchema.index({ sport: 1, location: 1 });

export default mongoose.model("Club", clubSchema);
