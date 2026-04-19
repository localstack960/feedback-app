const API = "http://localhost:3000/api";

// Create user
async function createUser() {
  const username = document.getElementById("username").value;

  const res = await fetch(API + "/create-user", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username })
  });

  const data = await res.json();

  if (data.error) {
    document.getElementById("result").innerText = data.error;
  } else {
    document.getElementById("result").innerHTML =
      `Send Link: ${data.link} <br> Dashboard: ${data.dashboard}`;
  }
}


// Send message
async function sendMessage() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");

  const message = document.getElementById("msg").value;

  await fetch(API + "/send-message", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ user, message })
  });

  alert("Message sent!");
}


// Load messages
async function loadMessages() {
  const params = new URLSearchParams(window.location.search);
  const user = params.get("user");

  const res = await fetch(API + "/messages/" + user);
  const data = await res.json();

  const container = document.getElementById("messages");

  if (container) {
    container.innerHTML = "";

    data.forEach(msg => {
      const div = document.createElement("div");
      div.className = "message";
      div.innerText = msg.message;
      container.appendChild(div);
    });
  }
}

loadMessages();