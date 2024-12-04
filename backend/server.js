const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes"); // Переименовано из api на index

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/api", routes);

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB подключен!"))
  .catch((err) => console.error("Ошибка подключения к MongoDB:", err));

// Проверка работы сервера
app.get("/", (req, res) => res.send("Сервер работает!"));

// Запуск сервера
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
