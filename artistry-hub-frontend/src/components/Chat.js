import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get route params
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { Container, Row, Col, Card, Button, Form, InputGroup } from "react-bootstrap";

const Chat = () => {
    const { artistId } = useParams(); // Get artistId from URL
    const [connection, setConnection] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Get userId from localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId; // Extract userId

    useEffect(() => {
        if (!userId || !artistId) {
            console.error("User ID or Artist ID not found");
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://51.20.56.125:44327/chatHub")
            .withAutomaticReconnect()
            .build();

        newConnection.start()
            .then(() => console.log("Connected to SignalR"))
            .catch(err => console.error("SignalR Connection Error: ", err));

        newConnection.on("ReceiveMessage", (sender, msg) => {
            setMessages(prevMessages => [...prevMessages, { sender, text: msg }]);
        });

        setConnection(newConnection);

        // Load chat history
        axios.get(`http://51.20.56.125:44327/api/chat/history/${userId}/${artistId}`)
            .then(response => setMessages(response.data))
            .catch(error => console.error(error));

        return () => {
            newConnection.stop();
        };
    }, [userId, artistId]);

    const sendMessage = async () => {
        if (message.trim() === "") return;

        const newMessage = { senderId: userId, receiverId: artistId, messageText: message };

        // Save message to DB
        await axios.post("http://51.20.56.125:44327/api/chat/send", newMessage);

        setMessage("");
    };

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="py-2">
                            <h4 className="m-0">Chat with Artist {artistId}</h4>
                        </Card.Header>
                        {/* <Card.Body className="p-2">
                            <div
                                style={{
                                    height: "300px",
                                    overflowY: "scroll",
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                    borderRadius: "5px",
                                }}
                            >
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            textAlign: msg.sender === userId ? "right" : "left",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        <Card
                                            style={{
                                                backgroundColor: msg.sender === userId ? "#007bff" : "#f8f9fa",
                                                color: msg.sender === userId ? "white" : "black",
                                                maxWidth: "70%",
                                                margin: "5px auto",
                                                borderRadius: "20px",
                                                padding: "10px",
                                            }}
                                        >
                                            <Card.Body>{msg.text}</Card.Body>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </Card.Body> */}
                        <Card.Footer className="p-2">
                            <InputGroup>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message"
                                    style={{ borderRadius: "20px" }}
                                />
                                <Button
                                    variant="primary"
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    style={{
                                        borderRadius: "20px",
                                        padding: "10px 20px",
                                    }}
                                >
                                    Send
                                </Button>
                            </InputGroup>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
