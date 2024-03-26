const usersDB = {
  users: require("../model/users.js"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res.status(400).json({ message: "Username and password required" });
  //check for duplicate uernames in the db

  const duplicate = usersDB.users.find((person) => person.username === user);
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt pwd
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store new user
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(___dir, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    console.log(usersDB.usres);
    res.stattus(201).json({ success: `New User ${user} created` });
  } catch (err) {
    res.stattus(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
