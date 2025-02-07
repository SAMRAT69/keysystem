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

const checkpoints = [
  { url: "https://linkvertise.com/your-link-1", next: "/CHECKPOINT_2" },
  { url: "https://linkvertise.com/your-link-2", next: "/CHECKPOINT_3" },
  { url: "https://lootlink.com/your-link", next: "/GENERATE_KEY" }
];

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

checkpoints.forEach((checkpoint, index) => {
  app.get(`/CHECKPOINT_${index + 1}`, (req, res) => {
    req.session[`checkpoint_${index + 1}`] = true;
    res.redirect(checkpoint.url);
  });
  
  app.get(`/REDIRECT_${index + 1}`, (req, res) => {
    if (!req.session[`checkpoint_${index + 1}`]) {
      return res.redirect("/");
    }
    res.redirect(checkpoint.next);
  });
});

app.get("/GENERATE_KEY", (req, res) => {
  if (!req.session.checkpoint_3) return res.redirect("/");
  res.sendFile(path.join(__dirname, "public", "generate_key.html"));
});

app.get("/KEY", (req, res) => {
  if (!req.session.checkpoint_3) return res.redirect("/");
  const key = `key-${Math.random().toString(36).substr(2, 12)}`;
  validKeys.add(key);
  res.json({ key });
});

app.get("/check", (req, res) => {
  const key = req.query.key;
  res.json({ result: validKeys.has(key) ? "key is valid" : "key is not valid" });
});

app.listen(PORT, () => {
  console.log(`Key system running on port ${PORT}`);
});
