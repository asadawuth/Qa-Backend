module.exports = (req, res, next) => {
  //throw new Error("text error middleware");
  res.status(404).json({ message: "resource not found on this server" });
};
// http ผิด path ผิด หาไม่เจอ ประมาณนี้
