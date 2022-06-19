// NPM MODULES ----------------------------------------------------------->

let express = require("express");
let app = express();
let ejs = require("ejs"); // for injected java script

// USING MODULES---------------------------------------------------------->

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // for body parsing    // USE not set USE!
app.use(express.static("public")); // to make a public folder with all the files accesssible when deploy on cloud

// LISTENING TO SERVER--------------------------------------------------------------->

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started at port 3000.");
});

// GLOBAL SCOPE VARIABLES ------------------------------------------------------------->

let items = [];
let workItems = [];

// GET AND POST REQUESTS--------------------------------------------------------------->

app.get("/", (req, res) => {
    let today = new Date();

    var day = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric", // can be passed as a js object
        month: "long",
    });

    res.render("list", {
        listTitle: day,
        newListItem: items,
        listType: "/",
    }); // needs to have view dir
});

app.get("/work", (req, res) => {
    res.render("list", {
        listTitle: "Work List",
        newListItem: workItems,
        listType: "/work",
    });
});

app.get("/clean", (req, res) => {
    items.length = 0;
    workItems.length = 0;
    res.render("list", {
        listTitle: "Work List",
        newListItem: workItems,
        listType: "/work",
    });
});

app.post("/", (req, res) => {
    if (req.body.newItem == "") {
        return;
    }
    items.push(req.body.newItem);

    // res.render("list", { newListItem: item });
    res.redirect("/");
});

app.post("/work", (req, res) => {
    if (req.body.newItem == "") {
        return;
    }
    workItems.push(req.body.newItem);
    res.redirect("/work");
});
