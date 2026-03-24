const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (name.length < 3) {
            return res.status(400).json({ message: "Name must be at least 3 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const [existing] = await db.query("SELECT id FROM users WHERE email=?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);
r
        await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashed]
        );

        res.json({ message: "User registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);

        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } 
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};