const express = require("express");
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getAll, getCurrent, getById, updateSchema, update, delete: _delete } = require('../controllers/userController');

// router.get('/', authorize, getAll);
router.get('/current', authorize, getCurrent);
router.get('/:id', authorize, getById);
router.put('/:id', authorize, updateSchema, update);
router.delete('/:id', authorize, _delete);

module.exports = router;