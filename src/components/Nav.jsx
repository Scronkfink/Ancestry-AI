import React, { useState, useEffect } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import deletePic from "../imgs/delete.png";

const Nav = ({ userInfo = [] }) => {
  const [conversations, setConversations] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [showNewConvoPrompt, setShowNewConvoPrompt] = useState(false);
  const [newConvoTitle, setNewConvoTitle] = useState("");

  useEffect(() => {
    const getUserConversations = async () => {
      console.log("this is userInfo", userInfo);
      if(userInfo.length === 0){
        setConversations([])
        return
      }
      const username = userInfo[0];
      const password = userInfo[1];

      try {
        const response = await fetch("/getConvos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        });
        const result = await response.json();
        console.log("this is result from getUserConversations", result);
        setConversations(result);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    getUserConversations();
  }, [userInfo]);

  const handleNewConvoClick = () => {
    setShowNewConvoPrompt(true);
  };

  const handleAddNewConvo = () => {
      const newConvo = {
        title: newConvoTitle,
        isSelected: false,
      };
      console.log("these are the User's conversations: ", conversations);
      setConversations([...conversations, newConvo]);
      setNewConvoTitle("");
      setShowNewConvoPrompt(false);
  };

  const handleConvoClick = (index) => {
    const updatedConversations = conversations.map((convo, i) => ({
      ...convo,
      isSelected: i === index,
    }));
    setConversations(updatedConversations);
  };

  const handleShowConfirmation = (index) => {
    setShowConfirmation(true);
    setIndexToDelete(index);
  };

  const handleHideConfirmation = () => {
    setShowConfirmation(false);
    setIndexToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (indexToDelete !== null) {
      const updatedConversations = conversations.filter(
        (_, index) => index !== indexToDelete
      );
      setConversations(updatedConversations);
      handleHideConfirmation();
    }
  };

  const ConfirmationDialog = ({ onCancel, onConfirm }) => (
    <div className="confirmationDialog">
      <p>Are you sure you want to delete this conversation?</p>
      <button onClick={onConfirm}>Delete the conversation</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );

  return (
    <div className="nav">
      <div className="newPrompt">
        <img src={roberto} alt="Roberto" className="roberto" />
        <p>King of Camelot LLM</p>
        <button className="notepadButton" onClick={handleNewConvoClick}>
          <img src={notepad} alt="Notepad" className="notepad" />
        </button>
      </div>
      <p className="convoHeader">Past Conversations:</p>
      <div className="conversations">
        {conversations.length > 0 &&
          conversations.map((convo, index) => (
            <div
              className="convo"
              key={index}
              onClick={() => handleConvoClick(index)}
              style={{
                backgroundColor: convo.isSelected ? "grey" : "transparent",
              }}
            >
              <p className="convoTitle">{convo.title}</p>
              {convo.isSelected && (
                <button
                  className="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowConfirmation(index);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <img src={deletePic} alt="Delete" className="deletePic" />
                </button>
              )}
            </div>
          ))}
      </div>
      {showConfirmation && (
        <div className="confirmationBackdrop">
          <ConfirmationDialog
            onCancel={handleHideConfirmation}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
      {showNewConvoPrompt && (
        <div className="newConvoPrompt">
          <input
            type="text"
            value={newConvoTitle}
            onChange={(e) => setNewConvoTitle(e.target.value)}
            placeholder="Enter conversation title..."
          />
          <button onClick={handleAddNewConvo}>Add Conversation</button>
          <button onClick={() => setShowNewConvoPrompt(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Nav;
