import React, { useState, useEffect } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import dna from "../imgs/dna.jpg";
import deletePic from "../imgs/delete.png";
import { useNavigate } from "react-router-dom";
import Settings from "./Settings";

const baseUrl = process.env.REACT_APP_API_URL || ""

const Nav = ({ userInfo = [], conversationTitles, setConversationTitles, setCurrentConversation, setConversation, setShowSettings, showSettings }) => {

  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [showNewConvoPrompt, setShowNewConvoPrompt] = useState(false);
  const [newConvoTitle, setNewConvoTitle] = useState("");

  useEffect(() => {

    const getUserConversations = async () => {
      if(userInfo.length === 0){
        setConversationTitles([]);
        return
      }
      const username = userInfo[0];
      try {
        const response = await fetch(`${baseUrl}/api/getConvos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
        const result = await response.json();
        console.log("These are the conversationTitles: ", result);
        setConversationTitles(result);
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
    if (newConvoTitle.trim()) {
      try {
        const response = await fetch(`${baseUrl}/api/createNewConvo`, {
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
          setConversationTitles(conversationTitles.concat(newConvo));
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
    const updatedConversations = conversationTitles.map((convo, i) => ({
      ...convo,
      isSelected: i === index,
    }));
    setConversationTitles(updatedConversations);
    setCurrentConversation(conversationTitles[index].title);

    const response = await fetch(`${baseUrl}/api/getconversation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: conversationTitles[index].title,
        username: userInfo[0]
      })
    })
    const result = await response.json()
    let newConvo = result.conversation
    setConversation(newConvo);
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

      const titleToDelete = conversationTitles[indexToDelete].title;
      const updatedConversations = conversationTitles.filter(
            (_, index) => index !== indexToDelete
        );
        setConversationTitles(updatedConversations);
      const response = await fetch(`${baseUrl}/api/deleteConvos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: titleToDelete,
          username: userInfo[0]
        })
      });
  
      const result = await response.json();
  
      handleHideConfirmation();
    }
    setConversation([])
  };
  
  const settingsClickHandler = () => {
    setShowSettings(true);
  }

  const ConfirmationDialog = ({ onCancel, onConfirm }) => (
    <div className="confirmationDialog">
      <p>Are you sure you want to delete this conversation?</p>
      <button onClick={onConfirm}>Delete the conversation</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );

  const logoutClickHandler = () => {
    setConversation([]);
    localStorage.clear();
    navigate("/")
  };

  return (
    <div className="nav">
      <div className="newPrompt">
        <img src={dna} className="roberto" />
        <p>Ancestry AI</p>
        <button className="notepadButton" onClick={handleNewConvoClick}>
          <img src={notepad} className="notepad" />
        </button>
      </div>
      <p className="convoHeader">Past Conversations:</p>
      <div className="conversations">
        {conversationTitles.length > 0 &&
          conversationTitles.map((convo, index) => (
            <div className="convo" key={index} onClick={() => handleConvoClick(index)}
              style={{
                backgroundColor: convo.isSelected ? "grey" : "transparent",
              }}
            >
              <p className="convoTitle">{convo.title}</p>
              {convo.isSelected && (
                <button className="delete" onClick={(e) => {handleShowConfirmation(index)}}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                <img src={deletePic} className="deletePic" />
                </button>
              )}
            </div>
          ))}
      </div>
      <div className="bottom-footer">
      <button className="settings" onClick={settingsClickHandler}>Settings</button>
      <button className="logout" onClick={logoutClickHandler}>Logout</button>
      </div>
      {showSettings && (
        <Settings setShowSettings={setShowSettings}/>
      )}
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
          <input type="text" value={newConvoTitle} onChange={(e) => setNewConvoTitle(e.target.value)}
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
