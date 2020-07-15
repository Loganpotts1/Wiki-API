const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true,useUnifiedTopology:true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("article", articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find(function(err, foundArticles){
    if (!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})
.post(function(req,res){
  Article.create({
    title: req.body.title,
    content: req.body.content
  }, function(err){if (err) throw err;});
  res.send("okay :)");
})
.delete(function(req,res){
  Article.delete(function(err){
    if (!err){
      res.send("Deleted entire collection.")
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:thisArticle")
.get(function(req,res){
  let thisArticle = req.params.thisArticle;
  Article.findOne({title: thisArticle}, function(err, article){
    if (!err){
      res.send(article);
    } else throw err;
  })
})
.put(function(req,res){
  let thisArticle = req.params.thisArticle;
  Article.update(
    {title: thisArticle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else throw err;
    }
  );
})
.patch(function(req,res){
  let thisArticle = req.params.thisArticle;
  Article.update(
    {title: thisArticle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else throw (err);
    }
  );
})
.delete(function(req,res){
  let thisArticle = req.params.thisArticle;
  Article.deleteOne(
    {title: thisArticle},
    function(err){
      if (!err){
        res.send("Successfully deleted article.");
      } else throw err;
    }
  );
});

app.listen(3000, function (){
  console.log("Firing all cannons on port 3000!");
})
