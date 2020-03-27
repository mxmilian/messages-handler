const consoleHandle = (req, res, next) => {
  console.clear();
  console.log(`I'am really happy that you use my app!💜`);
  next();
};

module.exports = {
  consoleHandle
};
