const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyEmail = require('../middlewares/verifyEmail');

router.post('/create',[verifyEmail.checkDuplicateUsernameOrEmail], userController.create);

router.post('/signin', userController.signin);

router.patch('/passwordchange/:id', userController.passwordchange);

module.exports = router;