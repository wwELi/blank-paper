const express = require('express');
const router = express.Router();
const { login, signUp } = require('../services/auth')

router.post('/login', async function (req, res) {
    try {
        const info = await login(req.body);
        res.json(info);
    } catch(err) {
        res.status(400).json({ msg: '登录失败' });
    }
});

router.post('/sign-up', async function(req, res) {
    try {
        const info = await signUp(req.body);
        res.json(info);
    } catch(err) {
        res.status(400).json(err);
    }
})

module.exports = router;