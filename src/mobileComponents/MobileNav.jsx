import React, { useState, useEffect } from "react";
import "../mobileStyles/mobileNav.css"
import dna from "../imgs/dna.jpg";

const MobileNav = ({ userInfo = [], conversations, setSpecificConversation, setCurrentConversation, setConversation, setShowMobileNav }) => {

  const closeNavClickHandler = () => {
    setShowMobileNav(false);
    return
  }

  return(
    <div className="mobileNav">
      <div className="mobileHeader">
        <img src={dna} className="mobileDNA"></img>
        <h1>Ancestry AI</h1>
        <button onClick={closeNavClickHandler}>X</button>
      </div>
      <div className="mobileConversations"></div>
      <div className="mobileFooter"></div>
    </div>
  )
}

export default MobileNav;