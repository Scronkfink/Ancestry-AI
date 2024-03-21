import React, { useEffect } from "react";
import "../mobileStyles/mobileConversation.css";

const MobileConversation = ({showMobileNav, setShowMobileNav}) => {

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

  return (
    <div className={conversationClass} onClick={showNavClickHandler}>
      <button onClick={showNavButtonClickHandler}>show nav</button>
    </div>
  );
};

export default MobileConversation;
