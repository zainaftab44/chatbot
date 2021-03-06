const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://www.stage02.zengtest6.us",
    methods: ["GET", "POST"],
  },
});

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost/chatbot";
const mongo = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});






app.get("/messages", (req, res) => {
  mongo.connect((err, db) => {
    let coll = undefined;
    try {
      coll = mongo.collection("messages");
    } catch (e) {
      coll = mongo.db("chatbot").collection("messages");
    } finally {
      coll.find({}).limit(20).toArray((err, rs)=> {
        if (err) throw err;
        res.json(rs);
      });
    }
  });
});









/**
 * Reading rules from json file - start
 */
const fs = require("fs");
const { exit } = require("process");

let data = fs.readFileSync("rules.json");
let rules = JSON.parse(data);
/**
 * Reading rules from json file - end
 */

/**
 * Loading UI - start
 */
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});
/**
 * Loading UI - end
 */


io.on("connection", (socket) => {
  let messages = [];
  console.log(`Socket connected: ${socket.id}`);
  let url="";
  socket.emit("rules", { id: socket.id, rules: rules });

  socket.on("message", (data) => {
    messages.push(data);
  });
  socket.on('url',(data)=>{
    url=data.message
  })

  socket.on("reply", (data) => {
    messages.push(data);
  });
  socket.on("disconnect", () => {
    mongo.connect((err, db) => {
      let coll = undefined;
      try {
        coll = mongo.collection("messages");
      } catch (e) {
        coll = mongo.db("chatbot").collection("messages");
      } finally {
        coll.insertOne({
          sessionId: socket.id,
          url:url,
          messages: messages,
        });
      }
    });
  });
});


server.listen(808);
