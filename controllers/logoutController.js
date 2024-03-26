const usersDB = {
  users: require("../model/users.js"),
  setUsers: function (data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  //on client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //successful but no content
  const refreshToken = cookies.jwt;

  //is refreshToken in db
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  //delete the refreshToken in the db
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.js"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookies("jwt", { httpOnly: true });
  res.sendStatus(204);
};
module.exports = { handleLogout };
