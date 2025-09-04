import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/Payment.js";
import Club from "../models/Club.js";
import Player from "../models/Player.js";

// Lazy initialization of Razorpay
let razorpay = null;

const getRazorpayInstance = () => {
  if (!razorpay) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay environment variables are not configured');
    }
    
    console.log(`🔍 Initializing Razorpay in ${process.env.NODE_ENV || 'development'} mode`);
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay instance created successfully');
  }
  return razorpay;
};

// Create payment order for club enrollment
const createPaymentOrder = async (req, res) => {
  try {
    console.log('🔍 createPaymentOrder called with:', req.body);
    console.log('🔍 User ID:', req.user?.id);
    console.log('🔍 Environment variables check:');
    console.log('  - RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set');
    console.log('  - RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set');
    console.log('  - NODE_ENV:', process.env.NODE_ENV);
    
    const { clubId, amount, currency = "INR" } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!clubId || !amount) {
      console.log('❌ Validation failed: clubId or amount missing');
      return res.status(400).json({ 
        success: false,
        message: "Club ID and amount are required" 
      });
    }

    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      console.log('❌ Validation failed: invalid amount:', amount);
      return res.status(400).json({ 
        success: false,
        message: "Invalid amount provided" 
      });
    }

    console.log('✅ Input validation passed');
    console.log('✅ Club ID:', clubId);
    console.log('✅ Amount:', numAmount);
    console.log('✅ User ID:', userId);

    // Validate club exists
    const club = await Club.findById(clubId);
    if (!club) {
      console.log('❌ Club not found:', clubId);
      return res.status(404).json({ 
        success: false,
        message: "Club not found" 
      });
    }
    console.log('✅ Club found:', club.name);

    // Check if user is already enrolled
    const existingPlayer = await Player.findOne({ user: userId, club: clubId });
    if (existingPlayer) {
      console.log('❌ User already enrolled');
      return res.status(400).json({ 
        success: false,
        message: "Already enrolled in this club" 
      });
    }
    console.log('✅ User not already enrolled');

    // Create Razorpay order
    const orderOptions = {
      amount: numAmount * 100, // Razorpay expects amount in paise
      currency: currency.toUpperCase(),
      receipt: `enroll_${clubId.slice(-8)}_${Date.now().toString().slice(-8)}`,
      notes: {
        clubId: clubId,
        userId: userId,
        type: "club_enrollment",
        clubName: club.name
      }
    };

    console.log('✅ Creating Razorpay order with options:', orderOptions);

    const razorpayInstance = getRazorpayInstance();
    const order = await razorpayInstance.orders.create(orderOptions);

    console.log('✅ Razorpay order created:', order.id);

    // Save payment record
    const payment = new Payment({
      user: userId,
      club: clubId,
      orderId: order.id,
      amount: numAmount,
      currency: currency.toUpperCase(),
      status: "pending",
      type: "club_enrollment",
      receipt: order.receipt
    });

    await payment.save();
    console.log('✅ Payment record saved to database');

    console.log(`💰 Payment order created: ${order.id} for user ${userId} in club ${clubId}`);

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      paymentId: payment._id,
      message: "Payment order created successfully"
    });

  } catch (error) {
    console.error("❌ Payment order creation error:", error);
    console.error("❌ Error stack:", error.stack);
    
    if (error.message.includes('Razorpay')) {
      return res.status(500).json({ 
        success: false,
        message: "Payment gateway error. Please try again." 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to create payment order" 
    });
  }
};

// Verify payment and complete enrollment
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      paymentId 
    } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required payment verification parameters" 
      });
    }

    // Find payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Payment record not found" 
      });
    }

    // Verify user ownership
    if (payment.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to payment" 
      });
    }

    // Check if payment is already completed
    if (payment.status === "completed") {
      return res.status(200).json({
        success: true,
        message: "Payment already completed",
        payment: payment
      });
    }

    // Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error(`❌ Invalid signature for payment ${paymentId}`);
      payment.status = "failed";
      await payment.save();
      
      return res.status(400).json({ 
        success: false,
        message: "Payment verification failed - Invalid signature" 
      });
    }

    // Update payment record
    payment.status = "completed";
    payment.paymentId = razorpay_payment_id;
    payment.completedAt = new Date();
    await payment.save();

    // Check if player already exists for this user
    let player = await Player.findOne({ user: userId });
    
    if (player) {
      // Update existing player's club
      player.club = payment.club;
      await player.save();
    } else {
      // Create new player profile
      player = new Player({
        user: userId,
        club: payment.club,
        position: "Forward" // Default position
      });
      await player.save();
    }

    console.log(`✅ Payment verified and enrollment completed for user ${userId} in club ${payment.club}`);

    res.json({
      success: true,
      message: "Payment verified and enrollment completed successfully",
      payment: {
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        completedAt: payment.completedAt
      },
      player: {
        id: player._id,
        club: player.club,
        position: player.position
      }
    });

  } catch (error) {
    console.error("❌ Payment verification error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to verify payment. Please contact support." 
    });
  }
};

// Get payment history for user
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ user: userId })
      .populate("club", "name sport location")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error("❌ Get payment history error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch payment history" 
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    const payment = await Payment.findById(paymentId)
      .populate("club", "name sport location");

    if (!payment) {
      return res.status(404).json({ 
        success: false,
        message: "Payment not found" 
      });
    }

    if (payment.user.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized access to payment" 
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error("❌ Get payment status error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch payment status" 
    });
  }
};

export {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
  getPaymentStatus
};
