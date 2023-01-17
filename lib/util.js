const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const pathToPubKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");
const PUB_KEY = fs.readFileSync(pathToPubKey, "utf8");

function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function issueJWT(user) {
  console.log("USER++++>>>", user);
  const expiresIn = "2w";

  const payload = {
    sub: {
      id: user.id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_phone: user.user_phone,
      user_image: user.user_image,
    },
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
    sub: {
      id: user.id,
      user_name: user.user_name,
      user_email: user.user_email,
      user_first_name: user.user_first_name,
      user_last_name: user.user_last_name,
      user_phone: user.user_phone,
      user_image: user.user_image,
    },
  };
}

function authMiddleware(req, res, next) {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization.split(" ");
    if (
      tokenParts[0] === "Bearer" &&
      tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
    ) {
      try {
        const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
          algorithms: ["RS256"],
        });
        req.jwt = verification;
        next();
      } catch (err) {
        res.status(401).json({
          success: false,
          status: "Unauthorized",
          msg: "You are not authorized to visit this route catch",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        status: "Unauthorized",
        msg: "You are not authorized to visit this route",
      });
    }
  } else {
    res.status(401).json({
      success: false,
      status: "TokenError",
      msg: "You are not authorized to visit this route",
    });
  }
}

function decodeToken(token) {
  var authorization = token.split(" ")[1];
  var decodedVal = jsonwebtoken.verify(authorization, PUB_KEY, {
    algorithms: ["RS256"],
  });
  console.log("decodedVal", decodedVal);
  return decodedVal;
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.authMiddleware = authMiddleware;
module.exports.decodeToken = decodeToken;
