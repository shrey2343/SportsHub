import mongoose from "mongoose";

const coachSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true 
    },
    expertise: { 
      type: [String], // allow multiple expertise areas (e.g. "Cricket", "Football") 
      required: true 
    },
    bio: { 
      type: String, 
      trim: true 
    },
    experience: { 
      type: Number, // years of experience 
      default: 0 
    },
    certifications: [{ 
      type: String, // list of certifications 
      trim: true 
    }],
    availability: { 
      days: [{ type: String }], // e.g. ["Mon", "Wed", "Fri"] 
      timeSlots: [{ type: String }] // e.g. ["10am-12pm", "4pm-6pm"]
    },
    rating: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 5 
    },
    totalReviews: { 
      type: Number, 
      default: 0 
    },
    socialLinks: {
      linkedin: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Coach", coachSchema);
