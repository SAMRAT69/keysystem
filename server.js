const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory "database" of valid keys
const validKeys = new Set();

// Endpoint to validate keys
app.post("/validate-key", (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ valid: false, message: "No key provided." });
    }

    if (validKeys.has(key)) {
        validKeys.delete(key); // Mark key as used
        return res.json({ valid: true });
    } else {
        return res.json({ valid: false, message: "Invalid or already used key." });
    }
});

// Endpoint to generate and store a valid key
app.post("/generate-key", (req, res) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    validKeys.add(key); // Store the key as valid
    res.json({ key });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
