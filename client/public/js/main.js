document.getElementById('url-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get the values from the form inputs
    const longUrl = document.getElementById('longUrl').value;
    const password = document.getElementById('password').value;
    const expirationDate = document.getElementById('expirationDate').value;

    // Clear previous results
    document.getElementById('result').innerHTML = '';

    // Check if the long URL is provided
    if (!longUrl) {
        document.getElementById('result').innerHTML = `<p style="color: red;">Please provide a URL to shorten.</p>`;
        return;
    }

    // Make the POST request to the server
    try {
        const res = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl, password, expirationDate })
        });

        const data = await res.json();

        // Display the result
        if (res.ok) {
            document.getElementById('result').innerHTML = `
                <p><strong>Short URL:</strong> <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
                <p><strong>QR Code:</strong><br> <img src="${data.qrCode}" alt="QR Code"></p>
            `;
        } else {
            // Handle error response
            document.getElementById('result').innerHTML = `<p style="color: red;">Error: ${data.message}</p>`;
        }
    } catch (err) {
        // Handle any unexpected errors
        document.getElementById('result').innerHTML = `<p style="color: red;">An error occurred. Please try again later.</p>`;
    }
});

// Track URL button event listener
document.getElementById('trackButton').addEventListener('click', async () => {
    const fullShortUrl = document.getElementById('trackCode').value; // The full short URL input

    // Check if the short URL is provided
    if (!fullShortUrl) {
        alert('Please provide a short URL to track.');
        return;
    }

    const shortCode = fullShortUrl.split('/').pop(); // Extract the short code from the URL

    // Make the GET request to fetch tracking data
    try {
        const response = await fetch(`/api/tracking/${shortCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            const clicksList = data.clicks.map(click => `- ${click}`).join('\n'); // Prepare the clicks list

            // Display the tracking data in a modal
            document.getElementById('trackingData').innerHTML = `
                <strong>Long URL:</strong> ${data.longUrl}<br>
                <strong>Total Clicks:</strong> ${data.clickCount}<br>
                <strong>Click Timestamps:</strong><br>${clicksList}
            `;

            // Show the modal
            document.getElementById('trackingModal').style.display = 'block';
        } else {
            alert('Error: Could not fetch tracking data');
        }
    } catch (err) {
        alert('An error occurred while fetching tracking data. Please try again later.');
    }
});

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').onclick = function() {
    document.getElementById('trackingModal').style.display = 'none';
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    const modal = document.getElementById('trackingModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
