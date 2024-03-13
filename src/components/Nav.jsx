import React from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import { useState } from "react";

const Nav = () => {

  const [conversations, setConversations] = useState([
    {
      title: "Words of Wisdom",
      isSelected: false,
    },
    {
      title: "Coffee Chat",
      isSelected: false,
    },
  ]);

  const handleConvoClick = (index) => {
    const updatedConversations = conversations.map((convo, i) => {
      return { ...convo, isSelected: i === index };
    });
    setConversations(updatedConversations);
  };

  return(
    <div className="nav">
      <div className="newPrompt">
        <img src={roberto} className="roberto"></img>
        <p>King of Camelot LLM</p>
        <img src={notepad} className="notepad"></img>
      </div>
      <p className="convoHeader">Past Conversations:</p>
      <div className="conversations">
  {conversations.map((convo, index) => {
    return (
      <div className="convo" key={index} onClick={() => handleConvoClick(index)}
        style={{ backgroundColor: convo.isSelected ? 'grey' : 'transparent' }}
      >
        <p className="convoTitle">{convo.title}</p>
      </div>
        )
    })}
  </div>
  </div>
  )
}

export default Nav