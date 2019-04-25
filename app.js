const express = require('express'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      port = 3000,
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer')
      app = express();

 mongoose.connect("mongodb://localhost:27017/restful_blog_app",
                  {useNewUrlParser: true});

// APP CONFIG
 app.set("view engine", "ejs");
 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(expressSanitizer());
 app.use(methodOverride("_method"));

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

// NEW
 app.get('/blogs/new', (req,res)=>{
   res.render("new")
 })

// CREATE
app.post('/blogs',(req,res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,(err, newBlog) => {
    if (err) {
      console.log("ERROR");
    } else {
      res.redirect("/blogs")
    }
  })
});

// SHOW ROUTES
app.get("/blogs/:id", (req,res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      //console.log(foundBlog);
      console.log(err);
      res.redirect("/blogs");
    } else {
      //console.log(foundBlog);
      res.render("show", {blog: foundBlog});
    }
  })
});

// EDIT
app.get("/blogs/:id/edit", (req,res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      //console.log(foundBlog);
      console.log(err);
      res.redirect("/blogs");
    } else {
      //console.log(foundBlog);
      res.render("edit", {blog: foundBlog});
    }
  })
});

// UPDATE
app.put("/blogs/:id", (req,res) =>{
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  })
});

// DESTROY
app.delete("/blogs/:id", (req,res) => {
  Blog.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });

});


 app.listen(port, ()=> {
   console.log("Blog Site server has started.")
 });
