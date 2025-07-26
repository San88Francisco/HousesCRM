import express from "express";
import {
  createHouse,
  getHouses,
  deleteHouse,
} from "../controllers/houses/houses";
import { authenticate } from "../middleware/authenticate";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth/auth";
import {
  createRenter,
  getRenters,
  getRenterById,
  updateRenter,
  deleteRenter,
} from "../controllers/renters/renters";
import {
  createContract,
  getContracts,
  getContractById,
  updateContract,
  deleteContract,
  getContractsByRenter,
} from "../controllers/contracts/contracts";

const router = express.Router();

// ========== AUTH ROUTES ==========
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/refresh-token", authenticate, refreshAccessToken);

// ========== HOUSES ROUTES ==========
router.post("/houses/apartment", authenticate, createHouse);
router.get("/houses/apartments", authenticate, getHouses);
router.delete("/houses/apartment/:id", authenticate, deleteHouse);

// ========== RENTERS ROUTES ==========
router.post("/renters/tenant", authenticate, createRenter);
router.get("/renters/tenants", authenticate, getRenters);
router.get("/renters/tenant/:id", authenticate, getRenterById);
router.patch("/renters/tenant/:id", authenticate, updateRenter);
router.delete("/renters/tenant/:id", authenticate, deleteRenter);

// ========== CONTRACTS ROUTES ==========
router.post("/contracts/deals", authenticate, createContract);
router.get("/contracts/deals", authenticate, getContracts);
router.get("/contracts/deals/:id", authenticate, getContractById);
router.patch("/contracts/deals/:id", authenticate, updateContract);
router.delete("/contracts/deals/:id", authenticate, deleteContract);
router.get("/contracts/renter/:renterId", authenticate, getContractsByRenter);

export default router;
