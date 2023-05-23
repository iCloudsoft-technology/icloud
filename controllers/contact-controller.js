const Contact = require("../model/contact")
// console.log(contact);


const contactus = async (req, res, next) => {

    const { fullName, email, number, massage } = req.body;

    const user = new Contact({
        fullName,
        email,
        number,
        massage
    })

    try{
        await user.save();
        console.log(user);
    }
    catch(err){
        console.log(err);
        return res.status(444).json({massage: err})
    }

    return res.status(201).json({massage: "Successfully ContactUs Data Save:"})
};

exports.contactus = contactus;