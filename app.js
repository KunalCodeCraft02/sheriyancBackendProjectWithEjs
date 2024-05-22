const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const userModel = require("./model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dbCon = require("./config/connection")
const isloggedIn = require("./middleware/authntication")
const postModel = require("./model/post");

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/updatepass", isloggedIn, (req, res) => {
    res.render("updatepass");
    console.log(req.user);
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});
app.get("/edit/:id",isloggedIn,async(req,res)=>{
    try{
        let usr = await postModel.findOne({_id:req.params.id});
        res.render("edit",{usr:usr});
    }
    catch(e){
        res.send("somthing error");
    }
})

app.get("/locked", isloggedIn, async (req, res) => {
    try {
        let findusr = await userModel.findOne({ email: req.user.email }).populate('post');
        if (!findusr) {
            return res.status(404).send("User not found");
        }
        res.render("locked", { user: findusr });
    } catch (e) {
        console.error("Error retrieving user data:", e);
        res.status(500).send("Error retrieving user data");
    }
});


app.post("/register", async (req, res) => {
    const { name, age, email, password } = req.body;

    // Check if any field is missing
    if (!name || !age || !email || !password) {
        return res.status(400).send("All fields are required");
    }

    try {
        const user = await userModel.findOne({ email });

        if (user) {
            return res.status(409).send("Email already exists");
        }

        const hashpassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            age,
            email,
            password: hashpassword
        });

        await newUser.save();

        const token = jwt.sign({ email: email, userid: newUser._id }, "thenameiskunal022");
        res.cookie("token", token);

        return res.status(201).redirect("/locked");
    } catch (e) {
        return res.status(500).send("Server error");
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if any field is missing
    if (!email || !password) {
        return res.status(400).send("Both email and password are required");
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send("Invalid credentials");
        }

        const token = jwt.sign({ email: user.email, userid: user._id }, "thenameiskunal022");
        res.cookie("token", token);

        console.log(user)
        return res.redirect("/locked");
    } catch (e) {
        return res.status(500).send("Internal error");
    }
});

app.post("/edit", isloggedIn, async (req, res) => {
    const { email, password, cpassword } = req.body;

    // Check if any field is missing
    if (!email || !password || !cpassword) {
        return res.status(400).send("Email, password and confirm password are required");
    }

    let usr = await userModel.findOne({ email });

    // Check if the passwords match
    if (password !== cpassword) {
        return res.status(400).send("Passwords do not match");
    }

    try {
        // Hash the new password
        const hashpassword = await bcrypt.hash(password, 10);

        // Update the user password in the database
        const user = await userModel.findByIdAndUpdate(usr._id, { password: hashpassword });

        if (!user) {
            return res.status(404).send("User not found");
        }

        return res.redirect("/locked");
    } catch (e) {
        return res.status(500).send("Internal error");
    }
});

app.post("/makepost", isloggedIn, async (req, res) => {
    try {
        console.log("Form Data:", req.body); // Log form data
        let user = await userModel.findOne({ email: req.user.email });
        const { content } = req.body;

        const postdata = await postModel.create({
            user: user._id,
            content: content
        });

        user.post.push(postdata._id);
        await user.save();
        res.redirect("/locked");
    } catch (e) {
        console.error("Error creating post:", e);
        res.status(500).send("Error creating post");
    }
});


app.post("/edit/:id",isloggedIn,async(req,res)=>{
    try{
        const {contentEdit} = req.body;

        await postModel.findOneAndUpdate({_id:req.params.id},{content:contentEdit})
        res.redirect("/locked");
    }
    catch(e){
        res.send("server error");
    }
});

app.get("/delete/:id", isloggedIn, async (req, res) => {
    try {
        await postModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/locked");
    } catch (e) {
        console.error("Error deleting post:", e);
        res.status(500).send("Error deleting post");
    }
});


app.post("/delete/:id", isloggedIn, async (req, res) => {
    try {
        await postModel.findOneAndDelete({ _id: req.params.id });
        res.redirect("/locked");
    } catch (e) {
        console.error("Error deleting post:", e);
        res.status(500).send("Error deleting post");
    }
});






// Start the server
app.listen(3000, () => {
    console.log("SERVER STARTED on port 3000");
});
