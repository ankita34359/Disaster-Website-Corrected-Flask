// JavaScript for Mitigation Page

// Function to check the risk based on selected state
async function checkRisk() {
    // Get the selected state
    const state = document.getElementById("state").value;
    const outputBox = document.getElementById("riskOutput");

    // Coordinates of each state (latitude and longitude)
    const stateCoordinates = {
        "Andhra Pradesh": { lat: 15.9129, lon: 79.7400 },
        "Arunachal Pradesh": { lat: 28.2180, lon: 94.7278 },
        "Assam": { lat: 26.2006, lon: 92.9376 },
        "Bihar": { lat: 25.0961, lon: 85.3131 },
        "Chhattisgarh": { lat: 21.2787, lon: 81.8661 },
        "Goa": { lat: 15.2993, lon: 74.1240 },
        "Gujarat": { lat: 22.2587, lon: 71.1924 },
        "Haryana": { lat: 29.0588, lon: 76.0856 },
        "Himachal Pradesh": { lat: 31.1048, lon: 77.1734 },
        "Jharkhand": { lat: 23.6102, lon: 85.2799 },
        "Karnataka": { lat: 15.3173, lon: 75.7139 },
        "Kerala": { lat: 10.8505, lon: 76.2711 },
        "Madhya Pradesh": { lat: 22.9734, lon: 78.6569 },
        "Maharashtra": { lat: 19.7515, lon: 75.7139 },
        "Manipur": { lat: 24.6637, lon: 93.9063 },
        "Meghalaya": { lat: 25.4670, lon: 91.3662 },
        "Mizoram": { lat: 23.1645, lon: 92.9376 },
        "Nagaland": { lat: 26.1584, lon: 94.5624 },
        "Odisha": { lat: 20.9517, lon: 85.0985 },
        "Punjab": { lat: 31.1471, lon: 75.3412 },
        "Rajasthan": { lat: 27.0238, lon: 74.2179 },
        "Sikkim": { lat: 27.5330, lon: 88.5122 },
        "Tamil Nadu": { lat: 11.1271, lon: 78.6569 },
        "Telangana": { lat: 18.1124, lon: 79.0193 },
        "Tripura": { lat: 23.9408, lon: 91.9882 },
        "Uttar Pradesh": { lat: 26.8467, lon: 80.9462 },
        "Uttarakhand": { lat: 30.0668, lon: 79.0193 },
        "West Bengal": { lat: 22.9868, lon: 87.8550 }
    };

    // API key and base URL for OpenWeatherMap
    const apiKey = "7e255630562345c7f0b88ecacaa325db";  // Replace with your actual API key

    // Check if the state exists in the coordinates object
    if (!stateCoordinates[state]) {
        outputBox.innerText = "Risk data not available for this state.";
        outputBox.style.display = "block";
        return;
    }

    const { lat, lon } = stateCoordinates[state];

    // API URL to fetch risk data
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${apiKey}`;

    // Fetch data from the API
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.alerts && data.alerts.length > 0) {
            // If there are alerts, show them
            let alerts = data.alerts.map(alert => `
                ⚠️ <strong>${alert.event}</strong><br>
                <em>${alert.description}</em><br><br>
            `).join("");

            outputBox.innerHTML = `
                <h3>🌩 Disaster Risk Alerts for ${state}:</h3>
                <div>${alerts}</div>
            `;
        } else {
            // If no alerts, show that everything is okay
            outputBox.innerHTML = `<h3>✅ No active disaster alerts for ${state}</h3>`;
        }
    } catch (error) {
        console.error("Error fetching risk data:", error);
        outputBox.innerText = "Error fetching data. Please try again later.";
    }

    // Show the output box
    outputBox.style.display = "block";
}

// 🚨 ML Model 1: Disaster-Prone Area Classification
document.getElementById("riskForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const res = await fetch("http://localhost:5000/predict-risk-area", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      const output = document.getElementById("riskResult");
      output.innerText = `🌍 Predicted Risk Level: ${result.risk}`;
      output.style.display = "block";
    } catch (err) {
      console.error("Model 1 fetch error:", err);
      alert("Error fetching model prediction.");
    }
});
  
// 🏗️ ML Model 2: Infrastructure Vulnerability Detection
document.getElementById("infraForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
  
    try {
      const res = await fetch("http://localhost:5000/predict-infra-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const result = await res.json();
      const output = document.getElementById("infraResult");
      output.innerText = `🏚️ Vulnerability: ${result.vulnerability}`;
      output.style.display = "block";
    } catch (err) {
      console.error("Model 2 fetch error:", err);
      alert("Error fetching vulnerability result.");
    }
});
