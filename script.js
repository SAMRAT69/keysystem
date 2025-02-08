let currentKey = '';
let currentCheckpoint = 0;

document.getElementById('validateBtn').addEventListener('click', async () => {
  const key = document.getElementById('keyInput').value;
  currentKey = key;

  const response = await fetch(`http://localhost:3000/validate-key?key=${key}`);
  const data = await response.json();

  if (!data.valid) {
    showMessage('Invalid key!', 'red');
    return;
  }

  if (data.completed) {
    showMessage('Key already redeemed!', 'red');
    return;
  }

  startCheckpointFlow(data.checkpoints);
});

async function startCheckpointFlow(checkpoints) {
  const checkpointContainer = document.getElementById('checkpointContainer');
  checkpointContainer.innerHTML = '';

  for (let i = currentCheckpoint; i < 3; i++) {
    const checkpoint = document.createElement('div');
    checkpoint.className = 'checkpoint';
    checkpoint.innerHTML = `
      <p>Checkpoint ${i + 1}:</p>
      <a href="${checkpoints[i]}" target="_blank">Complete this offer</a>
      <button onclick="markCheckpointComplete(${i})">I've completed this</button>
    `;
    checkpointContainer.appendChild(checkpoint);
    await waitForCheckpointCompletion(i);
  }

  showMessage('All checkpoints completed! Key activated!', 'green');
}

async function markCheckpointComplete(index) {
  const response = await fetch('http://localhost:3000/complete-checkpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: currentKey, checkpointIndex: index })
  });

  if (response.ok) {
    currentCheckpoint++;
  }
}

function waitForCheckpointCompletion(index) {
  return new Promise(resolve => {
    const checkInterval = setInterval(async () => {
      const response = await fetch(`http://localhost:3000/validate-key?key=${currentKey}`);
      const data = await response.json();
      if (data.currentStep > index) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 1000);
  });
}

function showMessage(msg, color) {
  const msgDiv = document.getElementById('message');
  msgDiv.textContent = msg;
  msgDiv.style.color = color;
}
