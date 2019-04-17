const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      port = 3000,
      app = express();

 mongoose.connect("mongodb://localhost:27018/restful_blog_app",
                  {useNewUrlParser: true});

// APP CONFIG
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));

// MONGOOSE/MODEL_CONFIG
 let blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
 });
 var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES
 app.get('/', (req,res) => {
   res.redirect("/blogs")
 });

 // INDEX
 app.get('/blogs', (req,res) => {
   //res.send("this is where all blogs will be displayed");
   Blog.find({}, (err, blogs) => {
     if (err) {
       console.log("ERROR!");
     } else {
        res.render("index", {blogs: blogs});
     }
   });

 });


 app.listen(port, ()=> {
   console.log("Blog Site server has started.")
 });
