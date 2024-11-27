import express from "express";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";


const routes = express();

routes.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(401).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    const user = new User({ name, email, password: passwordHashed });
    await user.save();

    console.log(user);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("Registration failed", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

routes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(405).json({ message: "Invalid credentials" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(408).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    console.log("Login failed", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


routes.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);  
  } catch (error) {
    console.log("Error fetching users", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


routes.get("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user); 
  } catch (error) {
    console.log("Error fetching user", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

routes.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(id);  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

   
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save(); 

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log("Error updating user", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  routes.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.deleteOne();  
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("Error deleting user", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default routes;
