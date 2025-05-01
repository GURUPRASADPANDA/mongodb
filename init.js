const mongoose = require('mongoose');
const Chat = require("./models/chat.js"); 


main()
    .then(()=>{
        console.log("connection successfull")
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let sampleChats = [
    { from: "Krishna", to: "Guru Prasad", msg: "You are doing well Guru, Keep it up", created_at: new Date() },
    { from: "Arjun", to: "Krishna", msg: "Guide me through this battle", created_at: new Date() },
    { from: "Radha", to: "Krishna", msg: "Why did you leave me?", created_at: new Date() },
    { from: "Guru Prasad", to: "Krishna", msg: "Thanks for your support!", created_at: new Date() },
    { from: "Subhadra", to: "Arjun", msg: "Dinner is ready", created_at: new Date() },
    { from: "Bheem", to: "Duryodhan", msg: "Prepare to lose!", created_at: new Date() },
    { from: "Draupadi", to: "Krishna", msg: "You saved me that day", created_at: new Date() },
    { from: "Yudhishthir", to: "Krishna", msg: "Dharma is hard to follow", created_at: new Date() },
    { from: "Karna", to: "Duryodhan", msg: "I will stand by your side", created_at: new Date() },
    { from: "Krishna", to: "Arjun", msg: "Do your duty, not the result", created_at: new Date() }
  ];

Chat.insertMany(sampleChats);
  



