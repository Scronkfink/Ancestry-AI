import React from "react";
import "../mobileStyles/mobileConversation.css"

const MobileConversation = ({showMobileNav, setShowMobileNav}) => {
  const showNavClickHandler = () => {
    setShowMobileNav(true);
    return
  }
  
  const conversationClass = showMobileNav ? "mobileConversationWithNav" : "mobileConversationFullWidth";

  return(
    <div className={conversationClass}>
      mobileConversation
      <button onClick={showNavClickHandler}>Show Nav</button>
    </div>
  )
}

export default MobileConversation;
