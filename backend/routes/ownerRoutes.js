const express = require('express');
const router = express.Router();
const {
  getOwners,
  createOwner,
  updateOwner,
  deleteOwner
} = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getOwners)
  .post(createOwner);

router.route('/:id')
  .put(updateOwner)
  .delete(deleteOwner);

module.exports = router;
