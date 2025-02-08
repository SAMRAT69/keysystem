const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Database (in-memory for now)
const keysDB = {
  'ABC123': { 
    valid: true, 
    checkpointsCompleted: 0 // Track progress
  }
};

// Validate Key & Check Checkpoints
app.get('/validate-key', (req, res) => {
  const key = req.query.key;
  
  if (!keysDB[key]) {
    return res.json({ valid: false, message: 'Invalid key' });
  }

  if (keysDB[key].checkpointsCompleted >= 3) {
    return res.json({ 
      valid: true, 
      completed: true,
      message: 'All checkpoints completed!' 
    });
  }

  // Return checkpoint URLs (replace with your actual URLs later)
  res.json({
    valid: true,
    completed: false,
    checkpoints: [
      'https://linkvertise.com/checkpoint1',
      'https://loot.link/checkpoint2',
      'https://example.com/checkpoint3'
    ],
    currentStep: keysDB[key].checkpointsCompleted
  });
});

// Update Checkpoint Progress
app.post('/complete-checkpoint', (req, res) => {
  const { key, checkpointIndex } = req.body;
  
  if (!keysDB[key] || checkpointIndex > 2) {
    return res.status(400).json({ success: false });
  }

  keysDB[key].checkpointsCompleted = checkpointIndex + 1;
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
