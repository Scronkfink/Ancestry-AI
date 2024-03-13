import React, { useState } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import deletePic from "../imgs/delete.png"; // Ensure this path is correct

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);

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
      const updatedConversations = conversations.filter((_, index) => index !== indexToDelete);
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
        <img src={notepad} alt="Notepad" className="notepad" />
      </div>
      <p className="convoHeader">Past Conversations:</p>
      <div className="conversations">
        {conversations.map((convo, index) => (
          <div
            className="convo"
            key={index}
            onClick={() => handleConvoClick(index)}
            style={{ backgroundColor: convo.isSelected ? 'grey' : 'transparent' }}
          >
            <p className="convoTitle">{convo.title}</p>
            {convo.isSelected && (
              <button
                className="delete"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent handleConvoClick
                  handleShowConfirmation(index);
                }}
                style={{ background: 'transparent', border: 'none', padding: 0 }}
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
