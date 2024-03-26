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
  conversationTitles,
  setConversationTitles,
  currentConversationTitle,
  setCurrentConversationTitle,
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
                  conversationTitles={conversationTitles}
                  setConversationTitles={setConversationTitles}
                  setCurrentConversation={setCurrentConversationTitle}
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
                  setConversationTitles={setConversationTitles}
                  conversationTitles={conversationTitles}
                  userInfo={userInfo}
                  currentConversationTitle={currentConversationTitle}
                  setCurrentConversationTitle={setCurrentConversationTitle}
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
