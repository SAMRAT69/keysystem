// When the document is ready, decide which section to display
document.addEventListener("DOMContentLoaded", function() {
  // If the URL path is "/generate", show the key generation section.
  if (window.location.pathname === "/generate") {
    document.getElementById("generate-section").style.display = "block";
    document.getElementById("start-section").style.display = "none";
  } else {
    // Otherwise, show the start section.
    document.getElementById("start-section").style.display = "block";
    document.getElementById("generate-section").style.display = "none";
  }
});

// Redirect the user to the first checkpoint.
function startProcess() {
  window.location.href = "/CHECKPOINT_1";
}

// Call the server to generate a new key and display it.
function fetchKey() {
  fetch("/KEY")
    .then(response => response.json())
    .then(data => {
      document.getElementById("keyDisplay").innerText = data.key;
    })
    .catch(error => {
      console.error("Error fetching key:", error);
    });
}
