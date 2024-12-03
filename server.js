const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

let books = [
    {
        "_id": 0,
        "title": "Hera",
        "imagePath": "images/Hera.jpg",
        "description": "Hera, immortal goddess and daughter of the ancient Titan Cronos, helped her brother Zeus to overthrow their tyrannical father so that they could rule the world. But, as they establish their reign on Mount Olympus, Hera suspects that Zeus might be just as ruthless and cruel as their father was, and she begins to question her role at his side. She was born to rule, but does that mean perpetuating a cycle of violence and cruelty that has existed since the dawn of time? Will assuming her power mean that Hera loses herself, or can she find a way to forge a better world?",
        "genre": "Mythology",
        "rating": 3.75
    },
    {
        "_id": 1,
        "title": "Happy Place",
        "imagePath": "images/happy-place.jpg",
        "description": "Harriet and Wyn have been the perfect couple since they met in college—they go together like salt and pepper, honey and tea, lobster and rolls. Except, now—for reasons they’re still not discussing—they don’t. They broke up six months ago. And still haven’t told their best friends. Which is how they find themselves sharing the largest bedroom at the Maine cottage that has been their friend group’s yearly getaway for the last decade. Their annual respite from the world, where for one vibrant, blue week they leave behind their daily lives; have copious amounts of cheese, wine, and seafood; and soak up the salty coastal air with the people who understand them most. Only this year, Harriet and Wyn are lying through their teeth while trying not to notice how desperately they still want each other. Because the cottage is for sale and this is the last week they’ll all have together in this place. They can’t stand to break their friends’ hearts, and so they’ll play their parts. Harriet will be the driven surgical resident who never starts a fight, and Wyn will be the laid-back charmer who never lets the cracks show. It’s a flawless plan (if you look at it from a great distance and through a pair of sunscreen-smeared sunglasses). After years of being in love, how hard can it be to fake it for one week… in front of those who know you best?",
        "genre": "Literary Fiction",
        "rating": 4.25
    },
    {
        "_id": 2,
        "title": "A Game of Thrones",
        "imagePath": "images/A Game of Thrones.jpg",
        "description": "Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister forces are massing beyond the kingdom’s protective Wall. To the south, the king’s powers are failing—his most trusted adviser dead under mysterious circumstances and his enemies emerging from the shadows of the throne. At the center of the conflict lie the Starks of Winterfell, a family as harsh and unyielding as the frozen land they were born to. Now Lord Eddard Stark is reluctantly summoned to serve as the king’s new Hand, an appointment that threatens to sunder not only his family but the kingdom itself.",
        "genre": "Fantasy",
        "rating": 3
    },
    {
        "_id": 3,
        "title": "Powerless",
        "imagePath": "images/Powerless.jpg",
        "description": "The powers these Elites have possessed for decades were graciously gifted to them by the Plague, though not all were fortunate enough to both survive the sickness and reap the reward. Those born Ordinary are just that—ordinary. And when the king decreed that all Ordinaries be banished in order to preserve his Elite society, lacking an ability suddenly became a crime—making Paedyn Gray a felon by fate and a thief by necessity.",
        "genre": "Fantasy",
        "rating": 3.75
    },
    {
        "_id": 4,
        "title": "Hench",
        "imagePath": "images/hench.jpg",
        "description": "Anna does boring things for terrible people because even criminals need office help and she needs a job. Working for a monster lurking beneath the surface of the world isn’t glamorous. But is it really worse than working for an oil conglomerate or an insurance company? In this economy?",
        "genre": "Comedy",
        "rating": 2.79
    },
    {
        "_id": 5,
        "title": "Lightlark",
        "imagePath": "images/Lightlark.jpg",
        "description": "Every 100 years, the island of Lightlark appears to host the Centennial, a deadly game that only the rulers of six realms are invited to play. The invitation is a summons—a call to embrace victory and ruin, baubles and blood. The Centennial offers the six rulers one final chance to break the curses that have plagued their realms for centuries. Each ruler has something to hide. Each realm’s curse is uniquely wicked. To destroy the curses, one ruler must die.",
        "genre": "Fantasy",
        "rating": 2.25
    },
    {
        "_id": 6,
        "title": "Bloom",
        "imagePath": "images/bloom.jpg",
        "description": "Rosemary meets Ash at the farmers’ market. Ash—precise, pretty, and practically perfect—sells bars of soap in delicate pastel colors, sprinkle-spackled cupcakes stacked on scalloped stands, beeswax candles, jelly jars of honey, and glossy green plants. Ro has never felt this way about another woman; with Ash, she wants to be her and have her in equal measure. But as her obsession with Ash consumes her, she may find she’s not the one doing the devouring…",
        "genre": "Horror",
        "rating": 3
    },
    {
        "_id": 7,
        "title": "None of This Is True",
        "imagePath": "images/none-of-this-is-true.jpg",
        "description": "But, as quickly as she arrived, Josie disappears. Only then does Alix discover that Josie has left a terrible and terrifying legacy in her wake, and that Alix has become the subject of her own true crime podcast, with her life and her family’s lives under mortal threat.",
        "genre": "Thriller",
        "rating": 3.78
    },
    {
        "_id": 8,
        "title": "Just For the Summer",
        "imagePath": "images/just-for-the-summer.jpg",
        "description": "Justin has a curse, and thanks to a Reddit thread, it's now all over the internet. Every woman he dates goes on to find their soul mate the second they break up. When a woman slides into his DMs with the same problem, they come up with a plan: They'll date each other and break up. Their curses will cancel each other’s out, and they’ll both go on to find the love of their lives. It’s a bonkers idea… and it just might work.",
        "genre": "Romance",
        "rating": 4.56
    }
];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
  
app.get("/api/books", (req, res) => {
    res.send(books);
});

app.post("/api/books", upload.single("img"), (req, res) => {
    const result = validateBook(req.body);
  
    if (result.error) {
      console.log(result.error);
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    const book = {
      _id: books.length,
      title: req.body.name,
      description: req.body.description,
      genre: req.body.genre,
      rating: req.body.rating,
    };
  
    if (req.file) {
      console.log("file found");
      book.imagePath = "images/" + req.file.filename;
    }
    console.log(book);
    books.push(book);
    console.log(books);
    console.log("completed");
    res.status(200).send(book);
});

app.put("/api/books/:id", upload.single("img"), (req, res) => {
    const book = books.find((h) => h._id === parseInt(req.params.id));
    console.log(req.params.id)
    console.log(book);
    if (!book){
      res.status(404).send("Book with given id was not found");
      return;
    } 
  
    const result = validateBook(req.body);
  
    if (result.error) {
      res.status(400).send(result.error.details[0].message);
      return;
    }
    book.title = req.body.name;
    book.description = req.body.description;
    book.genre = req.body.genre;
    book.rating = req.body.rating;
  
    if (req.file) {
      book.imagePath = "images/" + req.file.filename;
    }
  
    res.send(book);
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