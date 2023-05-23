const express = require("express");
const { signup, login, verifyToken, getUser, refreshToken,logout} = require("../controllers/user-controller");
const { contactus } = require("../controllers/contact-controller");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user", verifyToken,getUser);
 router.get("/refresh", refreshToken, verifyToken, getUser);
router.post("/logout", verifyToken, logout)
router.post("/contactus",contactus);

////  Verify Token

module.exports = router;