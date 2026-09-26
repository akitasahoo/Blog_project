// =========================
// CHECK LOGIN
// =========================

exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect("/login");
  }
};


// =========================
// CHECK ADMIN
// =========================

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.role === "admin") {
    next();
  } else {
    res.status(403).send("Access denied. Admin only.");
  }
};