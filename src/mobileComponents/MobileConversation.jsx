import React from "react";
import "../mobileStyles/mobileConversation.css"

const MobileConversation = ({showMobileNav, setShowMobileNav}) => {

  const showNavClickHandler = () => {
    if (showMobileNav) {
      setShowMobileNav(false); // This will hide the MobileNav
    }
  };

  const showNavButtonClickHandler = () => {
    setShowMobileNav(true);
    return
  }
  
  const conversationClass = showMobileNav ? "mobileConversationWithNav" : "mobileConversationFullWidth";

  return(
    <div className={conversationClass} onClick={showNavClickHandler}>
      <button onClick={showNavButtonClickHandler}>show nav</button>
    </div>
  )
}

export default MobileConversation;
