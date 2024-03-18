import React from "react";
import "./styles/app.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Conversation from "./components/Conversation";
import User from "./components/User";
import { useState, useEffect } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import { Route, Routes} from "react-router-dom";

const App = () => {
  const [conversation, setConversation] = useState([]);
  const [specificConversation, setSpecificConversation] = useState([]);
  //formerly [setConversations, conversations]
  const [currentConversation, setCurrentConversation] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    // Load userInfo from localStorage when the component mounts
    const savedUserInfo = localStorage.getItem('userInfo');
    return savedUserInfo ? JSON.parse(savedUserInfo) : [];
  });

  useEffect(() => {
    // Save userInfo to localStorage whenever it changes
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);


  return (
    <Router>
      <Routes>

      <Route path="/" element={<User setUserInfo={setUserInfo} userInfo={userInfo}/>}/>

      <Route path="/home" element={ 
        <div className="app">
          <Nav userInfo={userInfo} conversations={specificConversation} setSpecificConversation={setSpecificConversation} setCurrentConversation = {setCurrentConversation} setConversation= {setConversation}/>
          <Footer conversation={conversation} setConversation={setConversation} userInfo={userInfo} conversations={specificConversation} currentConversation={currentConversation}/>
          <Conversation conversation={conversation} setConversation={setConversation} userInfo={userInfo} currentConversation={currentConversation}/>
        </div>}
       />

      </Routes>
    </Router>
  );
};

export default App;
