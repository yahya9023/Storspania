import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: "customer", // just in case
    });

    res.status(201).json({ msg: "User created", user });
  } catch (err) {
    res.status(500).json({ msg: "Register failed", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👇 هنا كنأكد أنني نجيب حتى role
    const user = await User.findOne({ email });
    console.log("✅ USER FOUND:", user); // 👈 هادي جديدة
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid password" });
console.log("✅ ROLE:", user.role); // 👈 هنا

    const token = jwt.sign(
      { userId: user._id, role: user.role }, // 👈 هذا مهم
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 باش تشوفو في response
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
