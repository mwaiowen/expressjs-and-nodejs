const User = require("../model/User");

const handleLogout = async (req, res) => {
  //on client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //successful but no content hence error code 204
  const refreshToken = cookies.jwt;

  //is refreshToken in db
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  //delete the refreshToken in the db
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(results);

  res.clearCookies("jwt", { httpOnly: true });
  res.sendStatus(204);
};
module.exports = { handleLogout };
