require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js"); 
const methodOverride = require('method-override');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://guru:guru@whatsapp.jfnuhbx.mongodb.net/?retryWrites=true&w=majority&appName=whatsapp');
}

// Root route
app.get("/", (req, res) => {
    res.redirect("/chats");
});

// Chat routes
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).send("Error fetching chats");
    }
});

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.get("/chats/:id", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        res.render("chat.ejs", { chat });
    } catch (error) {
        console.error("Error fetching chat:", error);
        res.status(500).send("Error fetching chat");
    }
});

app.get("/chats/:id/edit", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).send('Chat not found');
        }
        res.render('edit', { chat });
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).send('Error fetching chat');
    }
});

app.post("/chats", async (req, res) => {
    try {
        const { from, to, msg } = req.body;
        const newChat = new Chat({
            from,
            to,
            msg,
            created_at: new Date()
        });
        await newChat.save();
        res.redirect("/chats");
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).send("Error creating chat");
    }
});

app.post("/chats/:id/reply", async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).send("Chat not found");
        }
        
        const newReply = new Chat({
            from: chat.to, // Reply from the original recipient
            to: chat.from, // Reply to the original sender
            msg: req.body.message,
            created_at: new Date()
        });
        
        await newReply.save();
        res.redirect(`/chats/${req.params.id}`);
    } catch (error) {
        console.error("Error sending reply:", error);
        res.status(500).send("Error sending reply");
    }
});

app.post("/chats/:id/edit", async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const chat = await Chat.findById(req.params.id);
        
        if (!chat) {
            return res.status(404).send('Chat not found');
        }

        chat.from = from;
        chat.to = to;
        chat.msg = message;
        chat.updated_at = new Date();

        await chat.save();
        res.redirect(`/chats/${chat._id}`);
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).send('Error updating chat');
    }
});

// Route to handle message deletion
app.delete('/chats/:id', async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).send('Chat not found');
        }
        res.redirect('/chats');
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).send('Error deleting chat');
    }
});

// let chat1 = new Chat({
//     from:"Krishna",
//     to:"Guru Prasad",
//     msg:"You are doing well Guru, Keep it up",
//     created_at:new Date()
// })


// chat1.save().then((res)=>{
//     console.log(res);
// })

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
    console.log('Error starting server:', err);
});
