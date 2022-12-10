const controller = require('../controller/usersController');
const express = require('express');
const router = express.Router();

router.post("/register", controller.registerUser);
router.post("/login", controller.login);
router.get("/all", controller.findUsers);
router.get("/:id", controller.findUserByID);
router.patch("/update/:id", controller.updateUser);
router.delete("/delete/:id", controller.deleteUser);

module.exports = router; 