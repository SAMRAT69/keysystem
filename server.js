const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());

const keys = new Set();

app.get("/generate", (req, res) => {
    const key = Math.random().toString(36).substr(2, 10);
    keys.add(key);
    res.json({ key });
});

app.get("/check", (req, res) => {
    const { key } = req.query;
    res.json({ valid: keys.has(key) });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
