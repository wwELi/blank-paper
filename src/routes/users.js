const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { getUsers, uploadAvatar, getAvatar } = require('../services/user');


router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

router.post('/:id/upload', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await uploadAvatar(req);
    res.send('success');
  } catch (err) {
    res.status(500).json({ msg: '上传失败', err })
  }
});

router.get('/:name/avatar', async (req, res) => {
  try {
    const { data, filename} = await getAvatar(req.params.name);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', data.length);
    res.setHeader('Content-Disposition', `filename="${filename}"`)
    res.end(data);
  } catch(err) {
    res.status(500).end();
  }

})

module.exports = router;
