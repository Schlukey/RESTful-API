const express = require("express");
const app = express();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 4200;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/wikiDB");

const schema = {
  title: String,
  content: String,
};
const Collection = mongoose.model("Article", schema);

//for targeting all items
app
  .route("/articles")

  .get(async (req, res) => {
    await Collection.find({})
      .then((foundArticles) => {
        res.send(foundArticles);
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .post(async (req, res) => {
    const newArticle = new Collection({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle
      .save()
      .then(() => {
        console.log("saved successfully");
        res.send(newArticle)
      })
      .catch((err) => {
        console.log(err);
      });
  })

  .delete(async (req, res) => {
    Collection.deleteMany({})
      .then(() => {
        res.send("deleted all items");
      })
      .catch((err) => {
        res.send(err);
      });
  });

//for targetting a specific item
app
  .route("/articles/:articleID")

  .get(async (req, res) => {
    const searchParams = { title: req.params.articleID };

    const response = await Collection.findOne(searchParams)
      .then((searchItem) => {
        res.send(searchItem);
        console.log(searchItem);
      })
      .catch((err) => {
        console.log(err);
        res.send("Something went wrong there");
      });

    return response;
  })

  .put(async (req, res) => {
    //define search params
    const searchParams = { title: req.params.articleID };
    const updateParams = {
      title: req.body.title,
      content: req.body.content
    }
    //find the document matching the params
    const response = await Collection.findOneAndUpdate(searchParams, updateParams).then((item) => {
      res.send(item);
    }).catch(err => {
      res.send(err);
      console.log(err)
    })
    
    return response
  })

  .patch(async(req, res)=>{
    const searchParams = { title: req.body.title };
    const updateParams = req.body
    const response = await Collection.findOneAndUpdate(searchParams, updateParams).then((item)=> {
      res.send(item);
    }).catch((err)=>{
      console.log(err);
      res.send('something went wrong there');
    });
    return response;
  })

  .delete(async (req, res) => {
    const response = await Collection.findOneAndDelete({ title: req.params.articleID })
      .then(() => {
        res.send("item was deleted sucessfully");
      })
      .catch((err) => {
        console.log(err);
      });
      return response;
  });

app.listen(port, () => {
  console.log("wikiAPI on port 4200");
});
