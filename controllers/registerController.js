const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "Username and password required" });
  //check for duplicate usernames in the db

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.sendStatus(409);

  try {
    //encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store new user
    const result = await User.create({
      username: user,
      " password": hashedPwd,
    });

    const newUser = new User({
      username: user,
      " password": hashedPwd,
    });

    console.log(result);

    res.stattus(201).json({ success: `New User ${user} created` });
  } catch (err) {
    res.stattus(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
