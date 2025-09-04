// controllers/performanceStatsController.js
import PerformanceStats from "../models/Performance.js";

// Create a new performance record
export const createPerformance = async (req, res) => {
  try {
    const performance = await PerformanceStats.create(req.body);
    res.status(201).json({ success: true, performance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all performance records
export const getPerformances = async (req, res) => {
  try {
    const performances = await PerformanceStats.find();
    res.status(200).json({ success: true, performances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single performance record by ID
export const getPerformanceById = async (req, res) => {
  try {
    const performance = await PerformanceStats.findById(req.params.id);
    if (!performance)
      return res.status(404).json({ success: false, message: "Performance not found" });
    res.status(200).json({ success: true, performance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a performance record
export const updatePerformance = async (req, res) => {
  try {
    const performance = await PerformanceStats.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!performance)
      return res.status(404).json({ success: false, message: "Performance not found" });
    res.status(200).json({ success: true, performance });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete a performance record
export const deletePerformance = async (req, res) => {
  try {
    const performance = await PerformanceStats.findByIdAndDelete(req.params.id);
    if (!performance)
      return res.status(404).json({ success: false, message: "Performance not found" });
    res.status(200).json({ success: true, message: "Performance deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
