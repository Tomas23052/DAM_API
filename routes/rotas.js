const express = require('express');

const router = express.Router();

router.get('/getall', (req, res) => {
    res.send('Hello World');
})


router.post('/create', (req, res) => {
    res.send('Hello World');
})

module.exports = router;

