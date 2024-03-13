import React, { useEffect, useRef, useState } from "react";
import "../styles/conversation.css";

const Conversation = () => {
  
  const [conversation, setConversation] = useState([
  {
    user: "Howdy",
    bot: "hello Dave"
  },
  {
  user: "how did you know my name!",
  bot: "I have a good memory"
  }]);

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  return (
    <div className="conversation">
      {conversation.map((message, index) => (
        <div key={index} className="messagePair">
          <div className="userMessage">{message.user}</div>
          {message.bot && (
            <div className="botMessage">{message.bot}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Conversation;
