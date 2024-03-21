import React, { useEffect, useRef } from "react";
import "../mobileStyles/mobileConversation.css";

const baseUrl = process.env.REACT_APP_API_URL || ""

const MobileConversation = ({showMobileNav, setShowMobileNav, conversation}) => {

  useEffect(() => {
    let viewportmeta = document.querySelector('meta[name="viewport"]');
    if(viewportmeta===null){
    viewportmeta = document.createElement("meta");
    viewportmeta.setAttribute("name","viewport");
    document.head.appendChild(viewportmeta);
  
    viewportmeta = document.querySelector('meta[name="viewport"]');
  }
  viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
  // console.log("this is viewport: ", document.querySelector('meta[name="viewport"]'));
  }, []);

  const showNavClickHandler = () => {
    if (showMobileNav) {
      setShowMobileNav(false);
    }
  };

  const showNavButtonClickHandler = () => {
    setShowMobileNav(true);
    return
  };

  const conversationClass = showMobileNav ? "mobileConversationWithNav" : "mobileConversationFullWidth";


  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log("scroll to bottom useEffect triggered")
    scrollToBottom();
  }, [conversation]);

  const getInterleavedMessages = () => {
    if (!conversation.user && !conversation.bot) {
      return [];
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

  const interleavedMessages = getInterleavedMessages();

  return (
    <div className={conversationClass} onClick={showNavClickHandler}>
  <button onClick={showNavButtonClickHandler}>show nav</button>
  {/* This inner div now uses the specific "mobileConversation" class for styling, not for width control */}
  <div className="mobileConversation">
    {interleavedMessages.length > 0 ? (
      interleavedMessages.map((message, index) => (
        <div key={index} className="mobileMessagePair">
          {message.user && <div className="mobileUserMessage">{message.user}</div>}
          {message.bot && <div className="mobileBotMessage">{message.bot}</div>}
        </div>
      ))
    ) : (
      <div className="noMessages">No messages</div>
    )}
    <div ref={endOfMessagesRef} />
  </div>
</div>
  );
};

export default MobileConversation;
