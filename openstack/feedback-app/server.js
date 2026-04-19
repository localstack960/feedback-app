const express = require("express");
const cors = require("cors");
const db = require("./firebase");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API running...");
});


// ✅ Create User
app.post("/api/create-user", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.length < 3) {
      return res.status(400).json({ error: "Username too short" });
    }

    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();

    if (doc.exists) {
      return res.status(400).json({ error: "Username already exists" });
    }

    await userRef.set({
      createdAt: new Date()
    });

    res.json({
      success: true,
      link: `/send.html?user=${username}`,
      dashboard: `/dashboard.html?user=${username}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Send Message
app.post("/api/send-message", async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Empty message" });
    }

    await db.collection("messages").add({
      user,
      message,
      createdAt: new Date()
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get Messages
app.get("/api/messages/:user", async (req, res) => {
  try {
    const user = req.params.user;

    const snapshot = await db.collection("messages")
      .where("user", "==", user)
      .orderBy("createdAt", "desc")
      .get();

    let messages = [];
    snapshot.forEach(doc => {
      messages.push(doc.data());
    });

    res.json(messages);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));