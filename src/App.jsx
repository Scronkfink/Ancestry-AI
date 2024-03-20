import React, { useState, useEffect } from "react";
import "./styles/app.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Conversation from "./components/Conversation";
import User from "./components/User";
import MobileApp from "./MobileApp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  const [conversation, setConversation] = useState([]);
  const [specificConversation, setSpecificConversation] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const [userInfo, setUserInfo] = useState(() => {
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : [];
  });

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return(
    <MobileApp setUserInfo={setUserInfo} userInfo={userInfo} conversations={specificConversation} setSpecificConversation={setSpecificConversation} showSettings={showSettings} setShowSettings={setShowSettings} currentConversation={currentConversation} setCurrentConversation={setCurrentConversation} setConversation={setConversation}conversation={conversation}/>
  )
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<User setUserInfo={setUserInfo}/>}/>
        <Route path="/home" element={ 
          <div className="app">
            <Nav userInfo={userInfo} conversations={specificConversation} setSpecificConversation={setSpecificConversation} setCurrentConversation={setCurrentConversation} setConversation={setConversation} showSettings={showSettings} setShowSettings={setShowSettings}/>
            <Footer conversation={conversation} setConversation={setConversation} userInfo={userInfo} conversations={specificConversation} currentConversation={currentConversation}/>
            <Conversation conversation={conversation} setConversation={setConversation} userInfo={userInfo} currentConversation={currentConversation}/>
          </div>}
         />
      </Routes>
    </Router>
  );
};

export default App;

