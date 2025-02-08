import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedSender, setSelectedSender] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));

      if (!userData) {
        console.error("User not authenticated");
        return;
      }

      const userId = userData.userId;

      const response = await axios.get(
        `https://localhost:44327/api/chat/GetMessages?userId=${userId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Fetched messages:", response.data);

      const messages = response.data.$values;

      if (Array.isArray(messages) && messages.length > 0) {
        messages.forEach((msg) => {
          console.log("Message object:", msg); // Log the whole message object
        });
        setMessages(messages);
      } else {
        console.error("No messages found or data is not in expected format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchChatHistory = async (senderId) => {
    try {
      if (!senderId) {
        console.error("Invalid senderId:", senderId);
        return; // Prevent sending a request with an undefined senderId
      }

      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData.userId;

      console.log("Fetching chat history for user:", userId, "and sender:", senderId);

      const response = await axios.get(
        `https://localhost:44327/api/chat/history/${userId}/${senderId}`,
        {
          withCredentials: true,
        }
      );

      console.log("Chat history:", response.data);

      const chatHistory = response.data.$values;
      if (Array.isArray(chatHistory) && chatHistory.length > 0) {
        setChatHistory(chatHistory);
        setSelectedSender(senderId);
      } else {
        console.error("No chat history found for this sender:", response.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const sendMessage = async () => {
    try {
      if (!messageText.trim()) {
        console.error("Message text cannot be empty.");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData.userId;

      const message = {
        senderId: userId,
        receiverId: selectedSender,
        messageText: messageText,
      };

      const response = await axios.post(
        "https://localhost:44327/api/chat/send",
        message,
        {
          withCredentials: true,
        }
      );

      console.log("Message sent:", response.data);
      setMessageText(""); // Clear the message input after sending

      // Optionally, you can update the chat history after sending the message:
      fetchChatHistory(selectedSender); // Fetch updated chat history
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Messages</h2>

      {!selectedSender ? (
        <div className="list-group">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="list-group-item"
              style={{ cursor: "pointer" }}
              onClick={() => fetchChatHistory(msg.senderId)} // Pass senderId to the function
            >
              <strong>{msg.senderName}</strong> {/* Sender's Name */}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="btn btn-primary mb-3"
            onClick={() => setSelectedSender(null)}
          >
            Back to Messages
          </button>
          <h4>
            Chat with{" "}
            {messages.find((msg) => msg.senderId === selectedSender)?.senderName}
          </h4>
          <div className="list-group">
            {chatHistory.map((msg) => (
              <div key={msg.id} className="list-group-item">
                {/* Check if it's the current user or the selected sender */}
                <strong>
                  {msg.senderId === selectedSender
                    ? msg.senderName
                    : "You"}:
                </strong>{" "}
                {msg.messageText}
                <br />
                <small className="text-muted">
                  {new Date(msg.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </div>

          <div className="input-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
