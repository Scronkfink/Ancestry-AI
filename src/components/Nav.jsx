import React, { useState, useEffect } from "react";
import "../styles/nav.css";
import notepad from "../imgs/notepad.png";
import roberto from "../imgs/roberto.png";
import deletePic from "../imgs/delete.png";
import { useNavigate } from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL

const Nav = ({ userInfo = [], conversations, setSpecificConversation, setCurrentConversation, setConversation }) => {

  const navigate = useNavigate()
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [showNewConvoPrompt, setShowNewConvoPrompt] = useState(false);
  const [newConvoTitle, setNewConvoTitle] = useState("");

  useEffect(() => {

    const getUserConversations = async () => {
      if(userInfo.length === 0){
        setSpecificConversation([]);
        return
      }
      const username = userInfo[0];
      try {
        const response = await fetch(`${baseUrl}/getConvos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });
        const result = await response.json();
        console.log("IN NAV; this is result from getUserConversations", result);
        setSpecificConversation(result);
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
        const response = await fetch(`${baseUrl}/createNewConvo`, {
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
          setSpecificConversation(conversations.concat(newConvo));
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
    setSpecificConversation(updatedConversations);
    console.log("this is the title: ", conversations[index].title)
    setCurrentConversation(conversations[index].title);

    const response = await fetch(`${baseUrl}/getconversation`, {
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

      const titleToDelete = conversations[indexToDelete].title;
      const updatedConversations = conversations.filter(
            (_, index) => index !== indexToDelete
        );
      setSpecificConversation(updatedConversations);
      
      const response = await fetch(`${baseUrl}/deleteConvos`, {
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
      console.log("IN NAV; this is response from delete conversation", result);
  
      handleHideConfirmation();
    }
    setConversation([])
  };
  

  const ConfirmationDialog = ({ onCancel, onConfirm }) => (
    <div className="confirmationDialog">
      <p>Are you sure you want to delete this conversation?</p>
      <button onClick={onConfirm}>Delete the conversation</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );

  const logoutClickHandler = () => {
    localStorage.clear();
    navigate("/")
  };

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
      <button className="logout" onClick={logoutClickHandler}>Logout</button>
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
