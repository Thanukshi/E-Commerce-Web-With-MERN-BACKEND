const USER = require("../model/user.model");
const utils = require("../lib/util");

exports.registerUser = async function (req, res, next) {
  const saltHash = utils.genPassword(req.body.user_password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const { user_email, user_first_name, user_last_name, user_phone } = req.body;
  console.log("data", req.body);
  try {
    if (!req.body) {
      return res.status(400).json({
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
        return res.status(200).json({
          code: 400,
          success: false,
          status: "Bad Request",
          message: "This email is already in use.",
        });
      } else if (userFirstName && userLastName) {
        return res.status(200).json({
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
        return res.status(200).json({
          code: 200,
          status: "Success",
          Success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          sub: tokenObject.sub,
          UserDetails: newUser,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({
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

  const userEmail = await USER.findOne({ user_email });
  if (!userEmail) {
    return res.status(200).json({
      code: 400,
      success: false,
      status: "Bad Request",
      message: "You are not a registerd user. Please register before login.",
    });
  } else {
    const isValid = utils.validPassword(
      user_password,
      userEmail.hash,
      userEmail.salt
    );

    if (isValid) {
      const tokenObject = utils.issueJWT(userEmail);

      res.status(200).json({
        success: true,
        status: "Login Success",
        token: tokenObject.token,
        expiresIn: tokenObject.expires,
        sub: tokenObject.sub,
      });
    } else {
      res.status(400).json({
        code: 400,
        success: false,
        status: "Password Error",
        msg: "You entered the wrong password",
      });
    }
  }
};
