import React from "react";
import "./styles/app.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Conversation from "./components/Conversation";
import { useState } from "react";

const App = () => {
  const [conversation, setConversation] = useState([]);

  return (
    <div className="app">
      <Nav />
      <Footer conversation={conversation} setConversation={setConversation} />
      <Conversation conversation={conversation} setConversation={setConversation} />
      {/* <p className="creator">Enjoy</p> */}
    </div>
  );
};

export default App;
