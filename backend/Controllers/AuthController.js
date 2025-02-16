const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

const signup = async (req, res) => {

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email});
        const errorMsg = 'Auth failed email or password is wrong';
        if (!user) {
            return res.json({ message: errorMsg, success: false });
        }
        const isPassEqual=await UserModel.findOne({email:email,password:password});
        if (!isPassEqual) {
            return res.json({ message:"Email and Password did not match!", success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                     admin_data: user
            })
    } catch (err) {
        console.log(err)
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
}

const profile_update = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if(user){
            const hash_password=await bcrypt.hash(password,10)
            UserModel.findByIdAndUpdate({_id:user._id},{email:email,password:hash_password})
        }
        console.log(user)
        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                admin_data:user
            })
    } catch (err) {
        console.log(err)
        res.status(500)
            .json({
                message: err,
                success: false
            })
    }
}
module.exports = {
    signup,
    login,
    profile_update
}