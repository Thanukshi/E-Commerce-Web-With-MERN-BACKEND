const USER = require("../model/user.model");
const utils = require("../lib/util");

const Token = require("../model/token.model");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async function (req, res, next) {
  const saltHash = utils.genPassword(req.body.user_password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const { user_email, user_first_name, user_last_name, user_phone } = req.body;
  console.log("data", req.body);
  try {
    if (!req.body) {
      return res.status(400).send({
        code: 400,
        status: "Bad Request",
        Success: false,
        message: "All field must be entered.",
      });
    } else {
      const userEmail = await USER.findOne({ user_email });
      const userFirstName = await USER.findOne({ user_first_name });
      const userLastName = await USER.findOne({ user_last_name });
      if (userEmail) {
        return res.status(200).send({
          code: 400,
          success: false,
          status: "Bad Request",
          message: "This email is already in use.",
        });
      } else if (userFirstName && userLastName) {
        return res.status(200).send({
          code: 400,
          success: false,
          status: "Bad Request",
          message: "This name is already in use.",
        });
      } else {
        const newUser = new USER({
          user_name: user_first_name + "_123",
          user_email,
          user_first_name,
          user_last_name,
          user_phone,
          hash: hash,
          salt: salt,
        });
        const tokenObject = utils.issueJWT(newUser);
        await newUser.save();

        const token = await new Token({
          userID: newUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}/users/${newUser._id}/verify/${token.token}`;
        await sendEmail(newUser.user_email, "Verify Your Email", url);

        return res.status(200).send({
          code: 200,
          status: "Success",
          Success: true,
          message: "An Email sent to your account, please verify your email.",
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          sub: tokenObject.sub,
          UserDetails: newUser,
        });
      }
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: error.message,
    });
  }
};

exports.verifyEmailToken = async function (req, res, next) {
  try {
    const user = await USER.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({
        message: "Invalid Link",
      });
    } else {
      const token = await Token.findOne({
        userID: user._id,
        token: req.params.token,
      });

      if (!token) {
        return res.status(400).send({
          message: "Invalid Link",
        });
      } else {
        await USER.updateOne({ _id: user._id, verifyEmailToken: true });
        await Token.remove();

        return res.status(200).send({
          code: 200,
          status: "Success",
          Success: true,
          message: "Email verified successfully.",
          UserDetails: user,
        });
      }
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: error.message,
    });
  }
};

exports.loginUser = async function (req, res, next) {
  const user_email = req.body.user_email;
  const user_password = req.body.user_password;

  try {
    const userEmail = await USER.findOne({ user_email });

    if (!userEmail) {
      return res.status(200).send({
        code: 400,
        success: false,
        status: "Bad Request",
        message: "You are not a registerd user. Please register before login.",
      });
    } else if (!userEmail.verifyEmailToken) {
      let token = await Token.findOne({ userID: userEmail._id });
      if (!token) {
        const token = await new Token({
          userID: newUser._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.BASE_URL}/users/${newUser._id}/verify/${token.token}`;
        await sendEmail(userEmail.user_email, "Verify Your Email", url);
      } else {
        return res.status(400).send({
          message: "An Email sent to your account, please verify your email.",
        });
      }
    } else {
      const isValid = utils.validPassword(
        user_password,
        userEmail.hash,
        userEmail.salt
      );

      if (isValid) {
        const tokenObject = utils.issueJWT(userEmail);

        res.status(200).send({
          success: true,
          status: "Login Success",
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          sub: tokenObject.sub,
          userDetails: userEmail,
        });
      } else {
        res.status(400).send({
          code: 400,
          success: false,
          status: "Password Error",
          msg: "You entered the wrong password",
        });
      }
    }
  } catch (error) {
    return res.status(400).send({
      code: 400,
      status: "Bad Request",
      Success: false,
      message: error.message,
    });
  }
};
