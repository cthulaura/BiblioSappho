const users = require('../models/usersModel');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const registerUser = async (req, res) => {
    try {
      const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
      req.body.password = encryptedPassword;
      const newUser = new users(req.body);

      const savedUser = await newUser.save();

      res.status(201).json({ message: "New user successfully registered", savedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    };
  };

const findUsers = async (req, res) => {
    try {
      const allUsers = await users.find().select('name genderIdentity sexualOrientation bio');
      res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    };
}

const findUserByID = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const findUser = await users.findById(id).select("name genderIdentity sexualOrientation bio");
    res.status(200).json(findUser);
    }
    else {
      res.status(404).json({ message: "User not found." })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateUser = async (req, res) => {
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
      if (error) return error
    })

    if (err) return res.status(401).send(`Not authorized.`)

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = encryptedPassword;
    const {
        name,
        genderIdentity,
        sexualOrientation,
        email,
        password,
        bio
      } = req.body;
      const updateUser = await users.findByIdAndUpdate(req.params.id, {
        name,
        genderIdentity,
        sexualOrientation,
        email,
        password,
        bio
      });

      res.status(200).json({ message: "User successfully updated", updateUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    };
  };

const login = async (req, res) => {
  try {
    users.findOne({ email: req.body.email }, function (error, user) {
      if (!user) {
        return res.status(404).send(`User registered with e-mail ${req.body.email} can't be found.`)
      }

      const verifytePassword = bcrypt.compareSync(req.body.password, user.password)
      if (!verifytePassword) {
        return res.status(403).send(`Password is incorrect. Please try again.`)
      }

      const token = jwt.sign({ email: req.body.email }, SECRET);
      return res.status(200).send(token);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

const deleteUser = async (req, res) => {
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
    const deleteUser = await users.findByIdAndDelete(id);
    const message = `User ${deleteUser.name} was successfully deleted.`;
    res.status(200).json({ message })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  registerUser,
  findUsers,
  findUserByID,
  updateUser,
  login,
  deleteUser,
}