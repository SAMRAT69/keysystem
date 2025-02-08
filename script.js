// Function to generate a random key
function generateRandomKey() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 10; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
}

// Generate key button
document.getElementById("generateKeyButton").addEventListener("click", () => {
    const key = generateRandomKey();
    document.getElementById("generatedKey").textContent = `Generated Key: ${key}`;
});

// Validate key button
document.getElementById("validateButton").addEventListener("click", async () => {
    const key = document.getElementById("keyInput").value;
    const responseMessage = document.getElementById("responseMessage");

    if (!key) {
        responseMessage.textContent = "Please enter a key.";
        responseMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/validate-key", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
        });

        const data = await response.json();

        if (data.valid) {
            responseMessage.textContent = "Key is valid!";
            responseMessage.style.color = "green";
        } else {
            responseMessage.textContent = data.message || "Invalid key.";
            responseMessage.style.color = "red";
        }
    } catch (error) {
        responseMessage.textContent = "An error occurred. Please try again.";
        responseMessage.style.color = "red";
        console.error(error);
    }
});
