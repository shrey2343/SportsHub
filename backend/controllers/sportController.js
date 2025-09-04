// controllers/sportController.js
import Sport from "../models/Sport.js";

export const createSport = async (req, res) => {
  try {
    const sport = await Sport.create(req.body);
    res.status(201).json(sport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    res.json(sports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSportById = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json(sport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findByIdAndDelete(req.params.id);
    if (!sport) return res.status(404).json({ message: "Sport not found" });
    res.json({ message: "Sport deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
