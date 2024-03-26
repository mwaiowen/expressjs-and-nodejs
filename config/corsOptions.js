const whitelist = [
  "https://www.yourdomain.com",
  "https://127.0.0.1:5500",
  "https://localhost:3500",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("NOt Allowed By Cors"));
    }
  },
  optionsSucccessStatus: 200,
};

module.exports = corsOptions;
