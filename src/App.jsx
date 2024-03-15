import React from "react";
import "./styles/app.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Conversation from "./components/Conversation";
import User from "./components/User";
import { useState } from "react";
import { BrowserRouter as Router} from "react-router-dom";
import { Route, Routes} from "react-router-dom";

const App = () => {
  const [conversation, setConversation] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  return (
    <Router>
      <Routes>

      <Route path="/" element={<User setUserInfo={setUserInfo} userInfo={userInfo}/>}/>

      <Route path="/home" element={ 
        <div className="app">
          <Nav userInfo={userInfo} conversations={conversations} setConversations={setConversations} setCurrentConversation = {setCurrentConversation} setConversation= {setConversation}/>
          <Footer conversation={conversation} setConversation={setConversation} userInfo={userInfo} conversations={conversations} currentConversation={currentConversation}/>
          <Conversation conversation={conversation} setConversation={setConversation} userInfo={userInfo} />
        </div>}
       />

      </Routes>
    </Router>
  );
};

export default App;
