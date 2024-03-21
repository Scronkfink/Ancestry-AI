import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileUser from "./mobileComponents/MobileUser";
import MobileNav from "./mobileComponents/MobileNav";
import MobileConversation from "./mobileComponents/MobileConversation";
import MobileFooter from "./mobileComponents/MobileFooter";
import "./mobileStyles/mobileApp.css";

// Other imports and code remain unchanged

const MobileApp = ({ userInfo, setUserInfo, conversations, setSpecificConversation, showSettings, setShowSettings, currentConversation, setCurrentConversation, setConversation, conversation }) => {
  
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileUser setUserInfo={setUserInfo} />} />
        <Route path="/home" element={
          <div className="mobileAppContainer">
            {showMobileNav && (
              <MobileNav
                userInfo={userInfo}
                conversations={conversations}
                setSpecificConversation={setSpecificConversation}
                setCurrentConversation={setCurrentConversation}
                setConversation={setConversation}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                setShowMobileNav={setShowMobileNav}
              />
            )}
            <MobileConversation setShowMobileNav={setShowMobileNav} showMobileNav={showMobileNav} conversation={conversation}/>
            {!showMobileNav && (
              <MobileFooter conversation={conversation} setConversation={setConversation} userInfo={userInfo} conversations={conversations} currentConversation={currentConversation}/>
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default MobileApp;
