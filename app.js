// NPM MODULES ----------------------------------------------------------->

let express = require("express");
let ejs = require("ejs"); // for injected java script
let mongoose = require("mongoose");
const _ = require("lodash");

// USING MODULES---------------------------------------------------------->

let app = express();
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

const listSchema = { name: String, items: [itemsSchema] };
const List = mongoose.model(" List", listSchema);

// LISTENING TO SERVER----------------------------------------------------------------->

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started at port 3000.");
});

// GET REQUESTS---------------------------------------------------------------->

app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItem: foundItems,
      });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const listName = req.params.customListName;
  List.findOne(
    {
      name: listName,
    },
    function (err, foundList) {
      if (!err) {
        if (foundList) {
          // show a that list
          res.render("list", {
            listTitle: foundList.name,
            newListItem: foundList.items,
          });
        } else {
          // make a new list indb
          const list = new List({ name: listName, newListItem: foundList });
          list.save();
          res.redirect("/" + listName);
        }
      } else {
        console.log(err);
      }
    }
  );
});

// POST REQUESTS------------------------------------------------------------------>

app.post("/", (req, res) => {
  const listName = req.body.list;
  const itemName = req.body.newItem;

  if (req.body.newItem == "") {
    return;
  }
  const item = new Item({ name: itemName });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      if (!err) {
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", (req, res) => {
  //   console.log(req.body);
  const itemId = req.body.completed;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(itemId, (err) => {
      if (err) {
        console.log("oh no xD");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: itemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        } else {
          console.log(err);
        }
      }
    );
  }
});
