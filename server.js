const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Ensure 'assets/images/' directory exists
const uploadDir = "src/assets/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save in 'assets/images'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload endpoint to save images
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imagePath = `/assets/images/${req.file.filename}`;
  res.json({ imageUrl: imagePath });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`✅ Image Upload Server running on http://localhost:${PORT}`);
});
