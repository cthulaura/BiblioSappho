const controller = require('../controller/worksController');
const express = require('express');
const router = express.Router();

router.post("/new", controller.addWork);
router.get("/all", controller.allWorks);
router.patch("/:id/", controller.favorite);
router.delete("/remove/:id", controller.removeWork);

module.exports = router; 