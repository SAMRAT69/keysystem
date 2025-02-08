document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("generate_key.html")) {
        fetch("http://localhost:5000/generate")
            .then(res => res.json())
            .then(data => window.location.href = `key.html?key=${data.key}`);
    }

    if (window.location.pathname.includes("key.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        document.getElementById("key-display").textContent = urlParams.get("key") || "No Key Available";
    }
});
