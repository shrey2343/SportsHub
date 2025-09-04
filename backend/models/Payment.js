import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "INR",
    enum: ["INR", "USD", "EUR"]
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "cancelled", "refunded"],
    default: "pending"
  },
  type: {
    type: String,
    enum: ["club_enrollment", "tournament_fee", "subscription", "training_fee"],
    default: "club_enrollment"
  },
  receipt: {
    type: String,
    required: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  metadata: {
    clubName: String,
    clubLocation: String,
    clubSport: String,
    verifiedAt: Date,
    razorpayOrderId: String,
    verificationError: String,
    razorpayError: String,
    cancelledAt: Date,
    refundedAt: Date,
    refundReason: String
  },
  // Razorpay specific fields
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ user: 1, club: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });
// Note: orderId has unique: true in schema, so an index is already created by Mongoose
// Avoid re-declaring to prevent duplicate index warnings
paymentSchema.index({ paymentId: 1 }, { sparse: true });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} ${this.amount}`;
});

// Virtual for payment status with color
paymentSchema.virtual('statusColor').get(function() {
  const statusColors = {
    pending: 'yellow',
    completed: 'green',
    failed: 'red',
    cancelled: 'gray',
    refunded: 'blue'
  };
  return statusColors[this.status] || 'gray';
});

// Method to check if payment can be cancelled
paymentSchema.methods.canCancel = function() {
  return this.status === 'pending';
};

// Method to check if payment can be refunded
paymentSchema.methods.canRefund = function() {
  return this.status === 'completed';
};

// Pre-save middleware to update timestamps
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

export default mongoose.model("Payment", paymentSchema);
