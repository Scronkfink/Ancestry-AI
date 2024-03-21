import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileUser from "./mobileComponents/MobileUser";
import MobileNav from "./mobileComponents/MobileNav";
import MobileConversation from "./mobileComponents/MobileConversation";
import "./mobileStyles/mobileApp.css";

// Other imports and code remain unchanged

const MobileApp = ({ userInfo, setUserInfo, conversations, setSpecificConversation, showSettings, setShowSettings, currentConversation, setCurrentConversation, setConversation, conversation }) => {
  
  const [showMobileNav, setShowMobileNav] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileUser setUserInfo={setUserInfo} />} />
        <Route path="/home" element={
          <div className="mobileAppContainer"> {/* Updated class name */}
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
            <MobileConversation setShowMobileNav={setShowMobileNav} showMobileNav={showMobileNav}/>
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default MobileApp;
