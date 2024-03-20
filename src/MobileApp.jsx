import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MobileUser from "./mobileComponents/MobileUser";
import MobileNav from "./mobileComponents/MobileNav";
import MobileConversation from "./mobileComponents/MobileConversation";
import "./mobileStyles/mobileApp.css"


const MobileApp = ({userInfo, setUserInfo, conversations, setSpecificConversation, showSettings, setShowSettings, currentConversation, setCurrentConversation, setConversation, conversation}) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MobileUser setUserInfo={setUserInfo} />} />
        <Route path="/home" element={
          <div className="mobileApp">
          <MobileNav/>
          <MobileConversation/>
          </div>
          } />
      </Routes>
    </Router>
  );
};

export default MobileApp