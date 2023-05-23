const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const signup = async (req, res, next) => { ////// Signup post

    const { name, email, password } = req.body;
    // console.log(req.body);
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        console.log(err);
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists ! Login Instead" })
    }

    const hashedPassword = await bcrypt.hashSync(password);

    const user = new User(
        {
            name,        // name: name,
            email,       // email: email,
            password: hashedPassword   //password: password
        });

    try {
        await user.save();
        console.log(user);

    } catch (err) {
        console.log(err);
    }

    return res.status(201).json({ message: user })
};

const login = async (req, res, next) => { ///////// login post
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        return new Error(err);
    }

    if (!existingUser) {
        return res.status(400).json({ message: "User not Found. Signup Please" })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid Email / Password" })
    }
    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1hr",
    });


    // console.log("Generated Token\n", token);

    if (req.cookies[`${existingUser._id}`]) {
        req.cookies[`${existingUser._id}`] = ""

    }

    res.cookie(String(existingUser._id), token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 30),   // 30 seconds
        httpOnly: true,
        sameSite: "lax"
    })
    // console.log(res, "222");

    return res.status(200).json({ message: "Successfully Logged In", token })
};

const verifyToken = async (req, res, next) => { /////// JWT TOKEN VERIFY
    const cookies = await req.headers.cookie;
    //  console.log(req.headers.cookie ,"23");
    const token = cookies.split("=")[1];
    //  console.log("data",token);

    if (!token) {
        res.status(404).json({ message: "No Token Found" });
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" })
        }
        console.log(user.id);
        req.id = user.id;
    });
    next();
};

const getUser = async (req, res, next) => {  //// GET USER
    const userId = req.id;
    let user;

    try {
        user = await User.findById(userId, "-password");
        console.log(user)
    }
    catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(404).json({ message: "User Not Found" })
    }
    return res.status(200).json({message:"Login", user })
};

const refreshToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];

    if (!prevToken) {
        return res.status(400).json({ message: "Coludn't find token" })
    }
    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication failed" })
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1hr",
        })


        res.cookie(String(user.id), token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 30),   // 30 seconds
            httpOnly: true,
            sameSite: "lax"
        });

        req.id = user.id;
        next();

    })
};

const logout = (req, res, next) => {
    const cookies = req.headers.cookie;
    const prevToken = cookies.split("=")[1];

    if (!prevToken) {
        return res.status(400).json({ message: "Couldn't Find token" })
    }

    jwt.verify(String(prevToken), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: "Authentication Failed" })
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`] = "";
        return res.status(200).json({ message: "Successfully Logged Out" })


    });
};





exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;