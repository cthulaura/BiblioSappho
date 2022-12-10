const controller = require('../controller/worksController');
const express = require('express');
const router = express.Router();

router.post("/new", controller.addWork);
router.get("/all", controller.allWorks);
router.get("/:id", controller.findWorkByID);
router.patch("/update/:id", controller.updateWork);
router.patch("/favorite/", controller.favorite);
router.delete("/remove/:id", controller.removeWork);

module.exports = router; 