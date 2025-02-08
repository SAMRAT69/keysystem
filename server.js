const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database (in-memory for now)
const keysDB = new Set(); // Stores valid keys
const ipCheckpoints = {}; // Tracks IP progress

// Generate a random key
function generateKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Generate Key Endpoint
app.get('/generate-key', (req, res) => {
  const key = generateKey();
  keysDB.add(key); // Store the key as valid
  res.json({ key });
});

// Check Key Validity
app.get('/key-check', (req, res) => {
  const key = req.query.key;
  if (keysDB.has(key)) {
    res.json({ result: 'key is valid' });
  } else {
    res.json({ result: 'key is not valid' });
  }
});

// Track Checkpoint Progress
app.post('/track-checkpoint', (req, res) => {
  const { ip, checkpoint } = req.body;
  if (!ipCheckpoints[ip]) {
    ipCheckpoints[ip] = new Set();
  }
  ipCheckpoints[ip].add(checkpoint); // Track completed checkpoint
  res.json({ success: true });
});

// Validate Key After Checkpoints
app.post('/validate-key', (req, res) => {
  const { key, ip } = req.body;
  if (!keysDB.has(key)) {
    return res.json({ valid: false, message: 'Invalid key' });
  }

  if (!ipCheckpoints[ip] || ipCheckpoints[ip].size < 3) {
    return res.json({ valid: false, message: 'Complete all checkpoints first' });
  }

  res.json({ valid: true, message: 'Key validated successfully!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
