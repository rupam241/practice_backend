import User from "../models/user.model.js"; // Ensure the model is imported correctly
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate the input fields
    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" }); // Use 201 for resource creation
    } catch (error) {
        // Check for duplicate username/email
        if (error.code === 11000) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        // Handle other possible errors
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    // Validate the input fields
    if (!email || !password || email === "" || password === "") {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const validPassword = await bcrypt.compare(password, validUser.password); // Use compare() for async comparison
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Successful signin without generating a token
        return res.status(200).json({ message: "Signin successful", user: { username: validUser.username, email: validUser.email } });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
