import express from "express";
import Sequelize from "sequelize";
import bodyParser from "body-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize(process.env.DB_URI);

// O R M
// ORM stands for Object Relational Mapping.
// It is a technique for converting data between relational databases and object oriented programming languages such as JavaScript, Python etc.

// TABLE = excel sheet that you can talk to with SQL
// RECORD = row in a table

// SCHEMA = a general term for the structure/shape/plan of a database tables

// MODEL = a class that represents a table in a database

// Message model definition
const Message = sequelize.define("message", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Create a new message
app.post("/messages", async (req, res) => {
  try {
    const message = await Message.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Read all messages
app.get("/", async (req, res) => {
  try {
    res.json({ message: "hi!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a message by ID
app.put("/messages/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message) {
      await message.update(req.body);
      res.json(message);
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a message by ID
app.delete("/messages/:id", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (message) {
      await message.destroy();
      res.json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const startApp = async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log("Server is running on http://localhost:" + process.env.PORT);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

startApp();
