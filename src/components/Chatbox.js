import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import "../styles/Chatbox.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)

Modal.setAppElement("#root");

function Chatbox({
  handleSendMessage_chat,
  messages,
  setInputValue,
  inputValue,
  handleClearChat,
  isWaitingForResponse,
}) {
  const messageBoxRef = useRef(null);

  // Declare the state variables
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    // Scroll to the bottom of the message box
    messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chatbox-container">
      <div className="chatbox">
        <div className="message-box" ref={messageBoxRef}>
          {messages.map((message, index) => (
            <div
              className={`message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
              key={index}
            >
              <div className="message-id">{message.id}</div>
              <pre
                style={{ whiteSpace: "pre-wrap" }}
                className={message.id.startsWith("Q") ? "question" : "answer"}
              >
                {message.text}
              </pre>
            </div>
          ))}
        </div>
        <div className="toolpane-container">
          <div className="toolpane-left">
            <button
              className="toolpane-button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to clear the chat history?"
                  )
                ) {
                  handleClearChat();
                }
              }}
            >
              Clear chat
            </button>
          </div>
          <div className="toolpane-right"></div>
        </div>

        <div className="input-box">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message..."
            rows="3"
          />
          <button
            key={isWaitingForResponse}
            className={`send-button ${
              isWaitingForResponse ? "button-disabled" : "button-enabled"
            }`}
            onClick={() => handleSendMessage_chat(inputValue)}
            disabled={isWaitingForResponse}
          >
            {" "}
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
