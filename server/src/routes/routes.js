const express = require('express');
const { createHouse, getHouses, deleteHouse } = require('../controllers/houses/houses');
const { authenticate } = require('../middleware/authenticate');
const { loginUser, refreshAccessToken, registerUser } = require('../controllers/auth/auth');
const { createRenter, getRenters, getRenterById, updateRenter, deleteRenter } = require('../controllers/renters/renters');
const { createContract, getContracts, getContractById, updateContract, deleteContract, getContractsByRenter } = require('../controllers/contracts/contracts');

const router = express.Router();

// ========== AUTH ROUTES ==========
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh-token', authenticate, refreshAccessToken);

// ========== HOUSES ROUTES ==========
router.post('/houses/apartment', authenticate, createHouse);
router.get('/houses/apartments', authenticate, getHouses);
router.delete('/houses/apartment/:id', authenticate, deleteHouse);

// ========== RENTERS ROUTES ==========
router.post('/renters/tenant', authenticate, createRenter);
router.get('/renters/tenants', authenticate, getRenters);
router.get('/renters/tenant/:id', authenticate, getRenterById);
router.patch('/renters/tenant/:id', authenticate, updateRenter);
router.delete('/renters/tenant/:id', authenticate, deleteRenter);

// ========== CONTRACTS ROUTES ==========
router.post('/contracts/deals', authenticate, createContract);
router.get('/contracts/deals', authenticate, getContracts);
router.get('/contracts/deals/:id', authenticate, getContractById);
router.patch('/contracts/deals/:id', authenticate, updateContract);
router.delete('/contracts/deals/:id', authenticate, deleteContract);
router.get('/contracts/renter/:renterId', authenticate, getContractsByRenter);

module.exports = router;