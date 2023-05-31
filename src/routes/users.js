const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { getUsers } = require('../services/user');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const users = await getUsers();
  res.json(users);
})

module.exports = router;
