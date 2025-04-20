document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const toggleBtn = document.getElementById("chatbot-toggle");
    const chatbox = document.getElementById("chatbot-box");
    const closeBtn = document.getElementById("close-chat");
    const chatWindow = document.getElementById("chat-window");
    const chatInput = document.getElementById("chat-input");
    const sendBtn = document.getElementById("send-btn");
  
    // Ensure initial hidden state
    chatbox.classList.add('hidden');
  
    // Toggle chatbox visibility
    toggleBtn.addEventListener("click", () => {
      chatbox.classList.toggle("hidden");
      if (!chatbox.classList.contains('hidden')) {
        setTimeout(() => chatInput.focus(), 300);
      }
    });
  
    // Close chatbox
    closeBtn.addEventListener("click", () => {
      chatbox.classList.add("hidden");
    });
  
    // Q&A Pairs
    const qaPairs = {
        "what is earthquake": "🌍 An earthquake is the shaking of Earth's surface caused by sudden energy release in the crust.",
       "what to do during earthquake": "🛑 Drop, Cover, and Hold On. Stay indoors and away from windows.",
       "what is flood": "🌊 A flood is excess water that submerges land. It can result from heavy rains or dam breaks.",
       "how to prepare for flood": "✅ Keep emergency kits ready. Know your evacuation routes. Don't walk or drive through floodwaters.",
       "what is tsunami": "🌊 A tsunami is a series of ocean waves caused by underwater disturbances like earthquakes.",
       "what to do during tsunami": "🏃‍♂️ Move to higher ground immediately. Stay away from coastlines.",
       "what is wildfire": "🔥 Wildfires are uncontrolled fires in forests or wildland caused by heat, lightning, or human activity.",
       "how to prevent wildfire": "🚫 Avoid campfires in dry areas. Do not discard lit cigarettes outdoors.",
       "what is cyclone": "🌀 A cyclone is a rotating storm system with strong winds and heavy rain.",
       "cyclone safety tips": "💨 Stay indoors. Secure loose items. Evacuate if told to do so by authorities.",
       "what is drought": "🌵 A drought is a prolonged period of low rainfall, leading to water shortage.",
       "how to conserve water during drought": "💧 Fix leaks. Use water-efficient appliances. Avoid overwatering plants.",
       "what is pandemic": "🦠 A pandemic is a global outbreak of disease affecting large populations.",
       "pandemic precautions": "😷 Wear masks. Maintain distance. Get vaccinated. Follow health authority guidelines.",
       "what is severe storm": "🌩️ Severe storms include strong winds, hail, and lightning that can cause damage.",
       "storm safety tips": "🏠 Stay indoors. Unplug electronics. Avoid water activities during lightning." 
    };
  
    // Add messages to chat
    function addMessage(message, sender = "user") {
      const msgDiv = document.createElement("div");
      msgDiv.textContent = message;
      msgDiv.className = `${sender}-msg fade-in`;
      chatWindow.appendChild(msgDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    // Normalize user input
    function normalizeInput(input) {
      return input.toLowerCase().replace(/[?.!]/g, "").trim();
    }
  
    // Send message functionality
    sendBtn.addEventListener("click", () => {
      const userInput = chatInput.value.trim();
      if (!userInput) return;
      
      addMessage(userInput, "user");
      const cleaned = normalizeInput(userInput);
      const response = qaPairs[cleaned] || "Sorry, I don't have an answer for that yet.";
      
      setTimeout(() => addMessage(response, "bot"), 500);
      chatInput.value = "";
    });
  
    // Enter key support
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });
  });