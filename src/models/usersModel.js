const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: mongoose.Types.ObjectId
        },
        name: { type: String, required: true },
        genderIdentity: { type: String, required: true },
        sexualOrientation: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        bio: { type: String, default: "Empty." },
        favorites: [{
          type: mongoose.Schema.Types.ObjectId,
          default: "",
          ref: "Work"
      }]
    },
    { versionKey: false, }
)

userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      next(new Error('This e-mail is already registered.'));

    } else {
      next();
    }
  });

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;