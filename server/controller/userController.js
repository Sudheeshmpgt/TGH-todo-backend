const UserModel = require("../model/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.status(409).send({ error: "User already exists" });
    } else {
      const hashedPw = await bcrypt.hash(password, 12);
      const registerUser = new UserModel({
        name: name,
        email: email,
        password: hashedPw,
      });
      const user = await registerUser.save();
      res
        .status(201)
        .send({ message: "User Registered Successfully", user: user });
    }
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        let token = jwt.sign(
          { _id: this._id, role: "user" },
          process.env.SECRET_KEY
        );
        res.cookie("jwtoken", token, {
          expiresIn: "1h",
          httpOnly: true,
        });
        res
          .status(200)
          .send({ token, user, message: "Logged in successfully" });
      } else {
        res.status(401).send({ error: "Invalid login details" });
      }
    } else {
      res.status(401).send({ error: "Invalid login details" });
    }
  } catch (error) {
    res.status(500).send({error: error.message});
  }
};

module.exports = { registration, login };
