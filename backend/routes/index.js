const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const User = require("../models/User");
const File = require("../models/File");

const router = express.Router();

// Настройка Multer для загрузки файлов
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера 5 МБ
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Разрешены только PDF файлы!"));
    }
  },
});

// Получить всех пользователей
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().populate("files"); // Подгружаем связанные файлы
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Создать нового пользователя
router.post("/users", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Проверяем, что username уникален
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = new User({ username });
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Загрузка файла
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Поле userId обязательно." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    const filePath = path.join(__dirname, "../", req.file.path);
    const fileData = await pdfParse(fs.readFileSync(filePath));

    const newFile = new File({
      name: req.file.originalname,
      size: req.file.size,
      format: path.extname(req.file.originalname),
      pages: fileData.numpages || 0,
      user: userId,
    });

    const savedFile = await newFile.save();

    user.files.push(savedFile._id);
    await user.save();

    res.status(201).json(savedFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка загрузки файла." });
  }
});

// Получить пользователя с файлами
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("files");
    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден." });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения данных пользователя." });
  }
});

// Получить информацию о файле
router.get("/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate("user");
    if (!file) {
      return res.status(404).json({ error: "Файл не найден." });
    }

    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка получения данных файла." });
  }
});

module.exports = router;
