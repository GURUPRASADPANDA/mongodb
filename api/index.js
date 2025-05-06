require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("../models/chat.js"); 
const methodOverride = require('method-override');
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// MongoDB Connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected successfully on port ${port}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

// Connect to MongoDB
connectDB();

// API Routes
app.get("/api/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ error: "Error fetching chats" });
    }
});

app.post("/api/chats", async (req, res) => {
    try {
        const { from, to, msg } = req.body;
        const newChat = new Chat({
            from,
            to,
            msg,
            created_at: new Date()
        });
        await newChat.save();
        res.status(201).json(newChat);
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ error: "Error creating chat" });
    }
});

app.get("/api/chats/:id", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json(chat);
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).json({ error: "Error fetching chat" });
    }
});

app.put("/api/chats/:id", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const chat = await Chat.findById(req.params.id);
        
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        chat.from = from;
        chat.to = to;
        chat.msg = message;
        chat.updated_at = new Date();

        await chat.save();
        res.json(chat);
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({ error: 'Error updating chat' });
    }
});

app.delete("/api/chats/:id", async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Error deleting chat' });
    }
});

// Export the Express API
module.exports = app; 