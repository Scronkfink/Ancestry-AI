import React, { useEffect } from "react";
import "../mobileStyles/mobileConversation.css";

const MobileConversation = ({showMobileNav, setShowMobileNav}) => {

  const resetZoom = () => {
    document.activeElement.blur();
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    resetZoom();
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

  return (
    <div className={conversationClass} onClick={showNavClickHandler}>
      <button onClick={showNavButtonClickHandler}>show nav</button>
    </div>
  );
};

export default MobileConversation;
