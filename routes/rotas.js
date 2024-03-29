const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const verifyEmail = require('../middlewares/verifyEmail');

router.post('/create',[verifyEmail.checkDuplicateUsernameOrEmail], userController.create);

router.post('/signin', userController.signin);

router.post('/addwaypoint', userController.addWaypoint);

router.get('/getmarkers/:username', userController.getMarkers);

router.patch('/passwordchange/:id', userController.passwordchange);

router.delete('/deletemarker/:username/:id', userController.deleteMarker);

router.patch('/updatemarker/:username/:id', userController.updateMarker);

router.get('/', userController.get);



module.exports = router;