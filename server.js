const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Ticket = require("./model");
const bodyParser = require("body-parser");

const router = express.Router();
const PORT = process.env.PORT || 4000;
const jsonParser = bodyParser.json();
const urencodedParser = bodyParser.urlencoded({ extended: false });

// middleware or some shit
app.use("/tickets", router);

// CORS handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET,POST, DELETE");
    return res.status(200).json({});
  }

  next();
});

Ticket.router // handle requests to routes
  .get("/", (_, res) => {
    Ticket.find()
      .exec()
      .then((doc) => {
        console.log(doc);
        res.status(200).json(doc);
      });
  });

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  Ticket.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    });
});

// change category
router.patch("/:id", (req, res) => {
  Ticket.update({ _id: id }, { $set: { category: req.body.newCategory } }).then(
    (result) => {
      res.status(200).json({
        message: "ticket updated.",
      });
    }
  );
});
// post a new ticket..
router.post("/", jsonParser, (req, res) => {
  const ticket = new Ticket({
    _id: mongoose.Types.ObjectId(),
    text: req.body.text,
    category: req.body.category,
  });
  ticket.save().then((res) => {
    console.log(res);
  });

  res.status(200).json({
    message: "ticket posting successful",
    createdTicket: ticket,
  });
});

mongoose.connect(
  "mongodb+srv://kb-user:kosonen95@kb-cluster.gc0bz.mongodb.net/kanban-db?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true },
  async () => {
    console.log("Database connection established.");
  }
);

app.listen(PORT, () => {
  console.log("server running on port " + PORT);
});
