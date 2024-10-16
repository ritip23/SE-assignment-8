document.getElementById("dataForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(this);
    const data = {};

    // Convert FormData to a regular object
    formData.forEach((value, key) => {
        data[key] = value;
    });

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert("Data submitted successfully: " + data.message);
        this.reset(); // Clear the form
    })
    .catch(error => {
        console.error("Error:", error);
    });
});
