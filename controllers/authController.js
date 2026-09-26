const User = require("../models/User");
const bcrypt = require("bcrypt");
const transporter = require("../config/mailer");
// =========================
// SIGNUP
// =========================
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.send("All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Signup failed");
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid email or password");
    }

    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.role = user.role;

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Login failed");
  }
};

// =========================
// LOGOUT
// =========================
exports.logout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send("Logout failed");
    }

    res.redirect("/");
  });
};

// =========================
// FORGOT PASSWORD
// =========================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("No account found with this email");
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 10 minutes
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send email
    await transporter.sendMail({
      from: `"My Blog Website" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset</h2>

          <p>Hello ${user.name},</p>

          <p>Your OTP for resetting your password is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>This OTP is valid for <b>10 minutes</b>.</p>

          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `
    });

    res.send("OTP sent to your email");
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).send("Unable to send OTP");
  }
};
// =========================
// RESET PASSWORD
// =========================
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User not found");
    }

    if (user.resetOTP !== otp) {
      return res.send("Invalid OTP");
    }

    if (user.resetOTPExpiry < Date.now()) {
      return res.send("OTP expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;

    await user.save();

    res.send("Password reset successful. You can login now.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Password reset failed");
  }
};