const works = require('../models/worksModel');
const users = require('../models/usersModel');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const allWorks = async (req, res) => {
  try {
    const allWorks = await works.find().populate("registeredBy", "name");
    res.status(200).json(allWorks);
  } catch (error) {
    res.status(500).json(error.message);
  };
};

const addWork = async (req, res) => {
  try {
    const newWork = new works(req.body);

    const savedWork = await newWork.save();

    res.status(201).json({ message: "New work successfully added", savedWork });
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  };
};

const favorite = async (req, res) => {
  try {
    const { isFavorite } = req.body;

    const updateWork = await works.findByIdAndUpdate(req.params.id, {
      isFavorite: isFavorite
    });
    res.status(200).json({ message: "Update successful", updateWork });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

const removeWork = async (req,res) => {
  try {
    if(!req.get('authorization')){
      return res.status(401).send('Unauthorized request.')
    }

    const token = req.get('authorization').split('Bearer ')[1];
    console.log(token);

    if (!token) {
      return res.status(401).send(`Header error.`);
    }

    const err = jwt.verify(token, SECRET, function (error) {
      if (error) return res.status(403).send("Unauthorized access.")
    })

    if (err) return res.status(401).send(`Not authorized.`)

    const { id } = req.params;
    const removeWork = await works.findByIdAndDelete(id);
    const message = `Work ${removeWork.title} was successfully removed.`;
    res.status(200).json({ message })
  } catch (error) {

  }
}

module.exports = {
    addWork,
    allWorks,
    favorite,
    removeWork,
}