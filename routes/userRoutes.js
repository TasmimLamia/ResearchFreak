const express = require("express");
const asyncHandler = require('express-async-handler');
const router = express.Router();

const authorize = require('../middleware/authorize');
const { getProfile, getResearcher } = require('../controllers/profileController');
const { getAll, getCurrent, getById, updateSchema, update, delete: _delete, search } = require('../controllers/userController');

// router.get('/', authorize, getAll);
router.get('/current', authorize, getCurrent);
router.get('/:id', authorize, getById);
router.put('/:id', authorize, updateSchema, update);
router.delete('/:id', authorize, _delete);

router.post('/search', authorize, getProfile, getResearcher, search, asyncHandler(async (req, res) => {
    res.render('search.ejs', { user: req.user, researcher: req.researcher, search: req.search });
}));

module.exports = router;