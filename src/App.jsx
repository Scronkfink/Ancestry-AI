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
  const [specificConversation, setSpecificConversation] = useState([]);
  //formerly [setConversations, conversations]
  const [currentConversation, setCurrentConversation] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  return (
    <Router>
      <Routes>

      <Route path="/" element={<User setUserInfo={setUserInfo} userInfo={userInfo}/>}/>

      <Route path="/home" element={ 
        <div className="app">
          <Nav userInfo={userInfo} conversations={specificConversation} setSpecificConversation={setSpecificConversation} setCurrentConversation = {setCurrentConversation} setConversation= {setConversation}/>
          <Footer conversation={conversation} setConversation={setConversation} userInfo={userInfo} conversations={specificConversation} currentConversation={currentConversation}/>
          <Conversation conversation={conversation} setConversation={setConversation} userInfo={userInfo} />
        </div>}
       />

      </Routes>
    </Router>
  );
};

export default App;
