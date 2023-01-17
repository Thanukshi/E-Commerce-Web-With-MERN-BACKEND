const Mongoose = require("mongoose");

var validateEmail = function (user_email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(user_email);
};

const UserSchema = Mongoose.Schema(
  {
    user_name: {
      type: String,
      unique: true,
    },

    user_email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    user_first_name: {
      type: String,
      unique: true,
      required: true,
    },
    user_last_name: {
      type: String,
      unique: true,
      required: true,
    },
    user_phone: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
    },
    salt: {
      type: String,
    },
    user_image: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png",
    },
  },
  {
    timestamps: {
      type: Date,
      default: Date.now,
    },
  }
);

module.exports = Mongoose.model("User", UserSchema);
