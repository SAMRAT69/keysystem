const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Serve static files (index.html, script.js, style.css)
app.use(express.static(path.join(__dirname, "public")));

// In-memory store for valid keys
const validKeys = new Set();

// Checkpoint configuration with the updated Linkvertise URL for checkpoint 1
const checkpoints = [
  { 
    url: "https://linkvertise.com/1223791/checkpoint-1-chronicle?o=sharing", 
    next: "/generate" 
  }
];

/*  
  Route Flow:
  1. User visits "/" and sees the start page.
  2. Clicking "Get Key" calls startProcess(), which redirects to "/CHECKPOINT_1".
  3. The "/CHECKPOINT_1" route sets a session flag and redirects to the external Linkvertise URL.
  4. After completing the external steps, the external service redirects the user to "/REDIRECT_1".
  5. "/REDIRECT_1" checks the session flag and then redirects the user to "/generate" (key-generation page).
  6. On "/generate", the client-side script displays the key-generation UI.
*/

// Home page route (start page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Checkpoint route: sets a session flag and sends the user to the external Linkvertise URL.
app.get("/CHECKPOINT_1", (req, res) => {
  req.session.checkpoint_1 = true;
  res.redirect(checkpoints[0].url);
});

// Redirect route: should be set as the external redirect URL in your Linkvertise settings.
app.get("/REDIRECT_1", (req, res) => {
  if (!req.session.checkpoint_1) {
    return res.redirect("/");
  }
  res.redirect(checkpoints[0].next);
});

// Key-generation page route (serves the same index.html file)
app.get("/generate", (req, res) => {
  if (!req.session.checkpoint_1) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API endpoint to generate a key
app.get("/KEY", (req, res) => {
  if (!req.session.checkpoint_1) {
    return res.redirect("/");
  }
  const key = `key-${Math.random().toString(36).substr(2, 12)}`;
  validKeys.add(key);
  res.json({ key });
});

// API endpoint to check key validity
app.get("/check", (req, res) => {
  const key = req.query.key;
  res.json({ result: validKeys.has(key) ? "key is valid" : "key is not valid" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
