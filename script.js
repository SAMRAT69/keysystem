document.getElementById("getKey").addEventListener("click", async () => {
    try {
        let response = await fetch("/getkey");
        let data = await response.json();
        document.getElementById("keyDisplay").innerText = "Your Key: " + data.key;
    } catch (error) {
        document.getElementById("status").innerText = "Error generating key!";
    }
});
