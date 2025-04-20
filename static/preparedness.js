const API_BASE = "https://your-backend-api-url/api"; // <- Update this to your backend API URL

const stateDropdown = document.getElementById("state");
const disasterDropdown = document.getElementById("disaster_type");
const checklistContainer = document.getElementById("checklistContainer");
const form = document.getElementById("prepForm");
const resultBox = document.getElementById("result");

let currentChecklist = [];

// Populate states
fetch(`${API_BASE}/states`)
  .then(res => res.json())
  .then(data => {
    data.states.forEach(state => {
      const opt = document.createElement("option");
      opt.value = state;
      opt.textContent = state;
      stateDropdown.appendChild(opt);
    });
  });

// Load disasters when state changes
stateDropdown.addEventListener("change", () => {
  const state = stateDropdown.value;
  disasterDropdown.innerHTML = "";
  checklistContainer.innerHTML = "";
  resultBox.innerHTML = "";

  fetch(`${API_BASE}/disasters?state=${encodeURIComponent(state)}`)
    .then(res => res.json())
    .then(data => {
      data.disasters.forEach(disaster => {
        const opt = document.createElement("option");
        opt.value = disaster;
        opt.textContent = disaster;
        disasterDropdown.appendChild(opt);
      });
    });
});

// Load checklist when disaster type changes
disasterDropdown.addEventListener("change", () => {
  const disasterType = disasterDropdown.value;
  checklistContainer.innerHTML = "";
  resultBox.innerHTML = "";

  fetch(`${API_BASE}/checklist?disaster_type=${encodeURIComponent(disasterType)}`)
    .then(res => res.json())
    .then(data => {
      currentChecklist = data.checklist;
      currentChecklist.forEach(item => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = item;
        checkbox.value = "true";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + item));
        checklistContainer.appendChild(label);
      });
    });
});

// Submit prediction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const checklistResponses = {};
  currentChecklist.forEach(item => {
    const checked = form.querySelector(`input[name="${item}"]`)?.checked || false;
    checklistResponses[item] = checked;
  });

  const payload = {
    state: stateDropdown.value,
    disaster_type: disasterDropdown.value,
    household_size: parseInt(document.getElementById("household_size").value),
    has_kit: document.getElementById("has_kit").checked,
    checklist_responses: checklistResponses
  };

  fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      resultBox.innerHTML = `<strong>Error:</strong> ${data.error}`;
      resultBox.style.background = "#ffebee";
      resultBox.style.color = "#b71c1c";
    } else {
      resultBox.innerHTML = `
        <h3>🚦 Preparedness Level: ${data.preparedness_level}</h3>
        <p><strong>Completion:</strong> ${data.completion_percentage.toFixed(2)}%</p>
        <p><strong>Awareness Score:</strong> ${data.awareness_score}</p>
        <h4>📌 Tips:</h4>
        <ul>${data.improvement_tips.map(t => `<li>${t}</li>`).join("")}</ul>
        <h4>✅ Recommended Actions:</h4>
        <ul>${data.recommendations.map(t => `<li>${t}</li>`).join("")}</ul>
      `;
    }
  })
  .catch(err => {
    console.error(err);
    resultBox.innerHTML = `<strong>Error:</strong> Could not connect to API.`;
    resultBox.style.background = "#ffebee";
    resultBox.style.color = "#b71c1c";
  });

  // 
  fetch('/api/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      state: selectedState,
      disaster_type: selectedDisaster,
      household_size: parseInt(householdSize),
      has_kit: hasKit === 'yes',
      checklist_responses: checklistResponses  // must be an object like { item1: true, item2: false }
    })
  })
  .then(res => res.json())
  .then(data => {
    // Handle the response: update DOM with preparedness level, etc.
    console.log(data);
  })
  
  
});
