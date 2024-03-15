import React, { useState, useEffect } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import deletePic from "../imgs/delete.png";

const Nav = ({ userInfo = [], conversations, setConversations, setCurrentConversation, setConversation }) => {
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
        console.log("IN NAV; this is result from getUserConversations", result);
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

  const handleAddNewConvo = async () => {
    // Only proceed if newConvoTitle is not empty
    if (newConvoTitle.trim()) {
      try {
        const response = await fetch("/createNewConvo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userInfo[0],
            title: newConvoTitle,
          }),
        });
  
        if (response.ok) {
          const newConvo = {
            title: newConvoTitle,
            isSelected: false,
            conversation: { user: [], bot: [] }
          };
          console.log("These are the conversations prior to concat: ", conversations)
          setConversations(conversations.concat(newConvo));
        } else {
          console.error("Failed to create new conversation");
        }
      } catch (error) {
        console.error("Error creating new conversation:", error);
      }
    }
    setNewConvoTitle("");
    setShowNewConvoPrompt(false);
  };

  const handleConvoClick = async(index) => {
    const updatedConversations = conversations.map((convo, i) => ({
      ...convo,
      isSelected: i === index,
    }));
    setConversations(updatedConversations);
    setCurrentConversation(conversations[index].title);

    const response = await fetch("/getconversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: conversations[index].title,
        username: userInfo[0]
      })
    })
    const result = await response.json()
    console.log("IN NAV; this is the specific conversation", result)
    setConversation([]);
  };

  const handleShowConfirmation = (index) => {
    setShowConfirmation(true);
    setIndexToDelete(index);
  };

  const handleHideConfirmation = () => {
    setShowConfirmation(false);
    setIndexToDelete(null);
  };

  const handleConfirmDelete = async() => {
    if (indexToDelete !== null) {
      const updatedConversations = conversations.filter(
        (_, index) => index !== indexToDelete
      );
      setConversations(updatedConversations);

        const response = await fetch("/deleteConvos",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            updatedConversations: updatedConversations,
            username: userInfo[0]
          })
        })

        const result = await response.json()
        console.log("IN NAV; this is response from delete conversation")
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
