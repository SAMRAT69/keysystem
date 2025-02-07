const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const validKeys = new Set();
const activeSessions = new Map();

// Middleware to check if the user has completed checkpoints
const verifyCheckpoints = (req, res, next) => {
  if (req.session.completedCheckpoints !== 3) {
    return res.status(403).json({ result: "Complete all checkpoints first!" });
  }
  next();
};

// Serve the frontend
app.use(express.static(path.join(__dirname, "public")));

// Simulated checkpoint completion
app.get("/checkpoint", (req, res) => {
  req.session.completedCheckpoints = (req.session.completedCheckpoints || 0) + 1;
  res.json({ result: `Checkpoint ${req.session.completedCheckpoints} completed` });
});

// Generate key after completing checkpoints
app.get("/getkey", verifyCheckpoints, (req, res) => {
  const key = `key-${Math.random().toString(36).substr(2, 12)}`;
  validKeys.add(key);
  activeSessions.set(req.sessionID, key);
  res.json({ key });
});

// Check if key is valid
app.get("/check", (req, res) => {
  const key = req.query.key;
  if (validKeys.has(key)) {
    res.json({ result: "key is valid" });
  } else {
    res.json({ result: "key is not valid" });
  }
});

app.listen(PORT, () => {
  console.log(`Key system running on port ${PORT}`);
});
