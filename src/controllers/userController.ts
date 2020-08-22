import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import express from "express";

class userController {
  /**
   * Registers the user
   * @param {request} req
   * @param {response} res
   */
  registerUser = async (req: express.Request, res: express.Response) => {
    let { email, password, passwordCheck, displayName } = req.body;

    // Validation
    if (!email || !password || !passwordCheck) {
      return res.status(400).json({
        message: "Not all fields have been filled in",
      });
    }
    if (password.length < 5) {
      return res.status(400).json({
        message: "Password is not long enough!",
      });
    }
    if (password !== passwordCheck) {
      return res.status(400).json({
        message: "Enter the same password twice!",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        message: `Account with email ${email} already exists`,
      });
    }
    // If no display name is given, use the email
    if (!displayName) {
      displayName = email;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in database, return all data
    const newUser = new User({
      email,
      password: passwordHash,
      displayName,
    });
    const savedUser = await newUser.save();
    res.json(savedUser);
  };

  /**
   * Login the user, return the user object and a JWT token containing the ID and role(s)
   */
  loginUser = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Not all fields have been entered",
      });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        message: "No account with these credentials have been found",
      });
    }

    // Match passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Invalid credentials",
      });
    }

    // Sign the userID for JWT authentication and respond
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as any
    );
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
      },
    });
  };

  /**
   * Get all users
   */
  getAllUsers = async (req: express.Request, res: express.Response) => {
    const user = await User.find();
    res.json(user);
  };

  /**
   * Override any existing roles and assign a new one
   * @param req.body.role must not be empty
   */
  assignRoleToUser = async (req: express.Request, res: express.Response) => {
    let { role } = req.body;
    if (!role) {
      return res.status(400).json({
        message: "No role provided",
      });
    }
    try {
      await User.findByIdAndUpdate(req.params.id, { role: role });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong, please try again",
      });
    }
    res.status(200).json({ message: "Role assigned succesfully" });
  };
}

export default new userController();
