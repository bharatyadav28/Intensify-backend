const pageNotFound = (req, res) => {
  res.status(404).json({ msg: "Page not found" });
};

export default pageNotFound;
