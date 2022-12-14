const works = require('../models/worksModel');
const users = require('../models/usersModel');
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');

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

const allWorks = async (req, res) => {
  try {
    const allWorks = await works.find().select("-isFavorite").populate("registeredBy", "name");
    res.status(200).json(allWorks);

  } catch (error) {
    res.status(500).json(error.message);
  };
};

const findWorkByID = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      const findWork = await works.findById(id).select("-isFavorite").populate("registeredBy", "name");
      res.status(200).json(findWork);
    }

    else {
      res.status(404).json({ message: "User not found." })
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchGenre = async (req, res) => {
  try {
    const findByGenre = await works.find({ genre: {"$regex": req.params.genre, "$options": "i"} }).select("-isFavorite").populate("registeredBy", "name");
    
    if (findByGenre.length == 0) {
      return res.status(404).json({message: `No works with genre matching search: ${req.params.genre}. Help expand the database by registering something!`});
    }

    res.status(200).json(findByGenre)

  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  };
};

const searchMedium = async (req, res) => {
  try {
    const findByMedium = await works.find({ medium: {"$regex": req.params.medium, "$options": "i"} }).select("-isFavorite").populate("registeredBy", "name");
    
    if (findByMedium.length == 0) {
      return res.status(404).json({message: `No works with medium matching search: ${req.params.medium}. Help expand the database by registering something!`});
    }

    res.status(200).json(findByMedium)

  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  };
};

const updateWork = async (req, res) => {
  try {
    //Auth process
    if (!req.get('authorization')) { return res.status(401).send('Unauthorized request.') }

    const token = req.get('authorization').split('Bearer ')[1];
    if (!token) { return res.status(401).send(`Header error.`); }

    const err = jwt.verify(token, SECRET, function (error) {
      if (error) return error
    })

    if (err) { return res.status(403).send("Unauthorized access.") }
    //Auth process /end

    const {
      comments
    } = req.body

    const updateWork = await works.findByIdAndUpdate(req.params.id, {
      comments
    })

    res.status(200).json({ message: "Work successfully updated", updateWork });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

const favorite = async (req, res) => {
  try {
    //Auth process
    if (!req.get('authorization')) { return res.status(401).send('Unauthorized request.') };

    const token = req.get('authorization').split('Bearer ')[1];
    
    if (!token) { return res.status(401).send(`Header error.`); }

    const err = jwt.verify(token, SECRET, function (error) {
      if (error) return error
    });

    if (err) { return res.status(403).send("Unauthorized access.") };
    //Auth process /end

    const {
      isFavorite
    } = req.body;

    const workID  = req.query.workID;
    const userID = req.query.userID;
    
    const updateWork = await works.findByIdAndUpdate(workID, {
      isFavorite: isFavorite
    });

    let updateUser

    if (isFavorite == true) {
      updateUser = await users.findByIdAndUpdate(userID, {
        "$addToSet": { favorites: workID }
      })
    }

    else {
      updateUser = await users.findByIdAndUpdate(userID, {
        "$pull": { favorites: workID }
      })
    }

    res.status(200).json({ message: `Successfully updated favorite to ${isFavorite} for ${updateWork.title}:`, updateWork, updateUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};

const removeWork = async (req, res) => {
  try {
    //Auth process
    if (!req.get('authorization')) { return res.status(401).send('Unauthorized request.') }

    const token = req.get('authorization').split('Bearer ')[1];
    if (!token) { return res.status(401).send(`Header error.`); }

    const err = jwt.verify(token, SECRET, function (error) {
      if (error) return error
    })

    if (err) { return res.status(403).send("Unauthorized access.") }
    //Auth process /end

    const { id } = req.params;

    const removeWork = await works.findByIdAndDelete(id);

    const message = `Work ${removeWork.title} was successfully removed.`;
    res.status(200).json({ message })

  } catch (error) {
    res.status(500).json({ message: error.message });
  };
};


module.exports = {
    addWork,
    allWorks,
    findWorkByID,
    searchGenre,
    searchMedium,
    updateWork,
    favorite,
    removeWork
}