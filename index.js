require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000 ;
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js"); 

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));

main()
    .then(()=>{
        console.log("connection successfull")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');

}

//index route
app.get("/chats",async (req,res) =>{
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs",{ chats });
});


app.get("/",(req,res) =>{
    res.send("get rootworking")
})









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
