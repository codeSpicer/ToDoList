// NPM MODULES ----------------------------------------------------------->

let express = require("express");
let app = express();
let ejs = require("ejs"); // for injected java script
let mongoose = require("mongoose");

// USING MODULES---------------------------------------------------------->

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // for body parsing    // USE not set USE!
app.use(express.static("public")); // to make a public folder with all the files accesssible when deploy on cloud
mongoose.connect(
  "mongodb+srv://akshat123:akshat123@cluster0.zeuj48k.mongodb.net/todolist?retryWrites=true&w=majority",
  { useNewUrlParser: true }
); // connecting to mongo db

//      LIST ITEM MONGO STRUCT ------------------------------------------->
const itemsSchema = { name: String };
const Item = mongoose.model("Item", itemsSchema);

// LISTENING TO SERVER----------------------------------------------------------------->

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000.");
});

// TASK ITEMS INSERTION IN MONGO ------------------------------------------------------------->

// const item1 = new Item({
//   name: "task1",
// });
// const item2 = new Item({
//   name: "task2",
// });
// const defaultItems = [item1, item2];

// Item.insertMany(defaultItems, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("sucess");
//   }
// });

// GET AND POST REQUESTS---------------------------------------------------------------->

app.get("/", (req, res) => {
  let today = new Date();

  var day = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric", // can be passed as a js object
    month: "long",
  });

  Item.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: day,
        newListItem: foundItems,
        listType: "/",
      }); // needs to have view dir
    }
  });
});

app.post("/", (req, res) => {
  if (req.body.newItem == "") {
    return;
  }
  const item = new Item({
    name: req.body.newItem,
  });

  item.save();

  res.redirect("/");
});

app.post("/delete", (req, res) => {
  //   console.log(req.body);
  Item.findByIdAndRemove(req.body.completed, (err) => {
    if (err) {
      console.log("oh no xD");
    }
  });
  res.redirect("/");
});

// app.get("/work", (req, res) => {
//   res.render("list", {
//     listTitle: "Work List",
//     newListItem: workItems,
//     listType: "/work",
//   });
// });

// app.post("/work", (req, res) => {
//   if (req.body.newItem == "") {
//     return;
//   }
//   workItems.push(req.body.newItem);
//   res.redirect("/work");
// });
