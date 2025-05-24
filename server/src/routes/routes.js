const express = require('express');
const { createHouse, getHouses, deleteHouse } = require('../controllers/houses/houses');
const { authenticate } = require('../middleware/authenticate');
const { loginUser, refreshAccessToken, registerUser } = require('../controllers/auth/auth');
const { createTenant, getTenants, getTenantById, updateTenant, deleteTenant } = require('../controllers/renters/renters');
const { createContract, getContracts, getContractById, updateContract, deleteContract, getContractsByTenant } = require('../controllers/contracts/contracts');

const router = express.Router();

// ========== AUTH ROUTES ==========
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/refresh-token', authenticate, refreshAccessToken);

// ========== HOUSES ROUTES ==========
router.post('/houses/apartment', authenticate, createHouse);
router.get('/houses/apartments', authenticate, getHouses);
router.delete('/houses/apartment/:id', authenticate, deleteHouse);

// ========== TENANTS ROUTES ==========
router.post('/renters/tenant', authenticate, createTenant);
router.get('/renters/tenants', authenticate, getTenants);
router.get('/renters/tenant/:id', authenticate, getTenantById);
router.patch('/renters/tenant/:id', authenticate, updateTenant);
router.delete('/renters/tenant/:id', authenticate, deleteTenant);

// ========== CONTRACTS ROUTES ==========
router.post('/contracts/contract', authenticate, createContract);
router.get('/contracts/contracts', authenticate, getContracts);
router.get('/contracts/contract/:id', authenticate, getContractById);
router.patch('/contracts/contract/:id', authenticate, updateContract);
router.delete('/contracts/contract/:id', authenticate, deleteContract);
router.get('/contracts/tenant/:tenantId', authenticate, getContractsByTenant);

module.exports = router;