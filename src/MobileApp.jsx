import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileUser from "./mobileComponents/MobileUser";
import MobileNav from "./mobileComponents/MobileNav";
import MobileConversation from "./mobileComponents/MobileConversation";
import MobileFooter from "./mobileComponents/MobileFooter";
import MobileSettings from "./mobileComponents/MobileSettings"; 
import "./mobileStyles/mobileApp.css";

const MobileApp = ({
  userInfo,
  setUserInfo,
  conversations,
  setSpecificConversation,
  currentConversation,
  setCurrentConversation,
  setConversation,
  conversation
}) => {
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileUser setUserInfo={setUserInfo} />} />
        <Route
          path="/home"
          element={
            <div className="mobileAppContainer">
              {!showMobileSettings && showMobileNav && (
                <MobileNav
                  userInfo={userInfo}
                  conversations={conversations}
                  setSpecificConversation={setSpecificConversation}
                  setCurrentConversation={setCurrentConversation}
                  setConversation={setConversation}
                  setShowMobileSettings={setShowMobileSettings}
                  setShowMobileNav={setShowMobileNav}
                />
              )}
              {!showMobileSettings && (
                <MobileConversation
                  setShowMobileNav={setShowMobileNav}
                  showMobileNav={showMobileNav}
                  conversation={conversation}
                />
              )}
              {!showMobileSettings && !showMobileNav && (
                <MobileFooter
                  conversation={conversation}
                  setConversation={setConversation}
                  userInfo={userInfo}
                  conversations={conversations}
                  currentConversation={currentConversation}
                />
              )}
              {showMobileSettings && (
                <MobileSettings
                  setShowMobileSettings={setShowMobileSettings}
                />
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default MobileApp;
