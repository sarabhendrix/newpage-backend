const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

mongoose
  .connect("mongodb+srv://sarabhendrix:EFp620WTrQCh73wA@newpage.r09zp.mongodb.net/?retryWrites=true&w=majority&appName=NewPage")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const bookSchema = new mongoose.Schema({
  title:String,
  imagePath:String,
  description:String,
  genre:String,
  rating:Number
});


const Book = mongoose.model("Book", bookSchema);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/books", async(req, res) => {
  const books = await Book.find();
  res.send(books);
});


app.post("/api/books", upload.single("img"), async(req, res) => {
    const result = validateBook(req.body);
    console.log(result);
  
    if (result.error) {
      console.log(result.error);
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    const book = {
      title: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      rating: req.body.rating,
    }
  
    if (req.file) {
      console.log("file found");
      book.imagePath = req.file.filename;
    }
    const newBook = await book.save();
    res.status(200).send(newBook);
});

app.put("/api/books/:id", upload.single("img"), async(req, res) => {
    const result = validateBook(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
    const fieldsToUpdate = {
      title:req.body.name,
      description:req.body.description,
      genre:req.body.genre,
      rating:req.body.rating,
    }
  
    if (req.file) {
      fieldsToUpdate.imagePath = "./" + req.file.filename;
    }
    const wentThrough = await Book.updateOne({_id:req.params.id}, fieldsToUpdate);

    const book = await House.findOne({_id:req.params.id});
    res.status(200).send(book);
});
  
app.delete("/api/books/:id", async(req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.status(200).send(book);
});

const validateBook = (book) => {
    const schema = Joi.object({
      _id: Joi.allow(""),
      name: Joi.string().required(),
      description: Joi.string().required(),
      genre: Joi.allow(""),
      rating: Joi.number().required(),
    });

    return schema.validate(book);
};
  

app.listen(3001, () => {
    console.log("Server Active");
});
