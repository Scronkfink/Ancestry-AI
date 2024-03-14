import React, { useState, useEffect } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import deletePic from "../imgs/delete.png";

const Nav = ({ userInfo = [] }) => {

  const [conversations, setConversations] = useState([]);

  useEffect(() => {

    const getUserConversations = async () => {

      console.log("this is userInfo", userInfo)
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
          console.log("this is result from getUserConversations", result)
          setConversations(result);
      }
      catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    getUserConversations();
  }, [userInfo]);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

  const handleNewConvoClick = () => {
    const clone = conversations.slice();
    clone.push({
      title: "Silver",
      isSelected: false,
    });
    setConversations(clone);
  };

  const handleConvoClick = (index) => {
    const updatedConversations = conversations.map((convo, i) => {
      return { ...convo, isSelected: i === index };
    });
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
          {conversations.map((convo, index) => (
            <div className="convo" key={index}
              onClick={() => handleConvoClick(index)}
              style={{
                backgroundColor: convo.isSelected ? "grey" : "transparent",
              }}
            >
              <p className="convoTitle">{convo.title}</p>
              {convo.isSelected && (
                <button className="delete"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent handleConvoClick
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
    </div>
  );
};

export default Nav;
