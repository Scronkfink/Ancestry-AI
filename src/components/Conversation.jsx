import React, { useEffect, useRef } from "react";
import "../styles/conversation.css";

const baseUrl = process.env.REACT_APP_API_URL

const Conversation = ({ conversation, currentConversation }) => {
  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("scroll to bottom useEffect triggered")
    scrollToBottom();
  }, [conversation]);

  // Function to interleave user and bot messages
  const getInterleavedMessages = () => {
    // Check for empty or undefined conversation arrays
    if (!conversation.user && !conversation.bot) {
      return []; // Return early for empty conversation
    }

    const userMessages = conversation.user || [];
    const botMessages = conversation.bot || [];
    const interleaved = [];
    const maxLength = Math.max(userMessages.length, botMessages.length);

    for (let i = 0; i < maxLength; i++) {
      if (userMessages[i]) {
        interleaved.push({ user: userMessages[i] });
      }
      if (botMessages[i]) {
        interleaved.push({ bot: botMessages[i] });
      }
    }

    return interleaved;
  };

  // Generate the interleaved messages
  const interleavedMessages = getInterleavedMessages();

  return (
    <div className="conversation">
      {interleavedMessages.length > 0 ? (
        interleavedMessages.map((message, index) => (
          <div key={index} className="messagePair">
            {message.user && <div className="userMessage">{message.user}</div>}
            {message.bot && <div className="botMessage">{message.bot}</div>}
          </div>
        ))
      ) : (
        <div className="noMessages"></div> // Placeholder text for empty conversation
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Conversation;

