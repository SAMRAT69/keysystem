let userKey = '';
let userIP = '';

// Get user IP (simplified for demo)
fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    userIP = data.ip;
  });

// Generate Key
document.getElementById('generateKeyBtn').addEventListener('click', async () => {
  const response = await fetch('/generate-key');
  const data = await response.json();
  userKey = data.key;
  document.getElementById('generatedKey').textContent = `Generated Key: ${userKey}`;
});

// Validate Key
document.getElementById('validateBtn').addEventListener('click', async () => {
  const key = document.getElementById('keyInput').value;
  if (!key) {
    showMessage('Please enter a key!', 'red');
    return;
  }

  const response = await fetch(`/key-check?key=${key}`);
  const data = await response.json();

  if (data.result === 'key is not valid') {
    showMessage('Invalid key!', 'red');
    return;
  }

  // Show checkpoints link
  document.getElementById('checkpointsLink').style.display = 'block';
  showMessage('Complete checkpoints to validate your key!', 'blue');
});

function showMessage(msg, color) {
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = msg;
  msgDiv.style.color = color;
}
async function completeCheckpoint(checkpointNumber) {
  const response = await fetch('/track-checkpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip: userIP, checkpoint: checkpointNumber })
  });

  if (response.ok) {
    if (checkpointNumber === 3) {
      window.location.href = '/validate-key';
    } else {
      window.location.href = `/checkpoint_${checkpointNumber + 1}`;
    }
  }
}
