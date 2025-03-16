import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Send message to Flask API
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();
    setMessages([...messages, { text: input, user: true }, { text: data.response, user: false }]);
    setInput(""); // Clear input
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid gray", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.user ? "right" : "left" }}>
            <b>{msg.user ? "You" : "Bot"}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type a message..." 
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
