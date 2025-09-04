// routes/tournamentRoutes.js
import express from "express";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  registerTeam,
  withdrawTeam,
  generateBrackets,
  updateTournamentStatus,
  getTournamentStandings,
  getUpcomingTournaments,
  updateTournament,
  deleteTournament
} from "../controllers/tournamentController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getTournaments);
router.get("/upcoming", getUpcomingTournaments);
router.get("/:id", getTournamentById);
router.get("/:id/standings", getTournamentStandings);

// Protected routes
router.use(protect);

// Tournament management (coaches and admins only)
router.post("/", requireRole('coach', 'admin'), createTournament);
router.post("/:tournamentId/register", requireRole('coach', 'admin'), registerTeam);
router.post("/:tournamentId/withdraw", requireRole('coach', 'admin'), withdrawTeam);
router.post("/:tournamentId/brackets", requireRole('coach', 'admin'), generateBrackets);
router.put("/:tournamentId/status", requireRole('coach', 'admin'), updateTournamentStatus);
router.put("/:tournamentId", requireRole('coach', 'admin'), updateTournament);
router.delete("/:tournamentId", requireRole('coach', 'admin'), deleteTournament);

export default router;
