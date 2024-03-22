import React, { useState, useEffect } from "react";
import "../mobileStyles/mobileNav.css"
import dna from "../imgs/dna.jpg";
import notepad from "../imgs/notepad.png";
import deletePic from "../imgs/delete.png";
import settings from "../imgs/settings.png"
import { useNavigate } from "react-router-dom";
import MobileSettings from "./MobileSettings";

const MobileNav = ({ userInfo = [], conversations, setSpecificConversation, setCurrentConversation, setConversation, setShowMobileNav, setShowMobileSettings, showMobileSettings, setShowMobileConversation, showMobileNav, showMobileConversation}) => {

  const baseUrl = process.env.REACT_APP_API_URL || ""
  const navigate = useNavigate();
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
      // console.log("This is userInfo: ", userInfo)

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
        // console.log("IN NAV; this is result from getUserConversations", result);
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
    // console.log("this is the title: ", conversations[index].title)
    setCurrentConversation(conversations[index].title);

    const response = await fetch(`${baseUrl}/api/getconversation`, {
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
    // console.log("IN NAV; this is the specific conversation", result)
    let newConvo = result.conversation

    setTimeout(() => {
      setShowMobileNav(false)
    }, 500)

    setTimeout(() => {
      setConversation(newConvo);
    }, 600)
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
      // console.log("IN NAV; this is response from delete conversation", result);
  
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
    // setConversation([]);
    // localStorage.clear();
    // navigate("/")
  };

  const showMobileSettingsClickHandler = () => {
    setShowMobileSettings(true);
    return
  }

  return(
    <div className="mobileNav">
      <div className="mobileHeader">
        <img src={dna} className="mobileDNA"></img>
        <h1>Ancestry AI</h1>
        <button className="notepadButton" onClick={handleNewConvoClick}>
          <img src={notepad} className="notepad" />
        </button>
      </div>
      <div className="mobileConversations">
      <p className="convoHeader">Past Conversations:</p>
      <div className="conversations">
        {conversations.length > 0 &&
          conversations.map((convo, index) => (
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
      {showConfirmation && (
        <div className="confirmationBackdrop">
          <ConfirmationDialog
            onCancel={handleHideConfirmation}
            onConfirm={handleConfirmDelete}
          />
        </div>
      )}
      {showNewConvoPrompt && (
        <div className="mobileNewConvoPrompt">
          <input type="text" value={newConvoTitle} onChange={(e) => setNewConvoTitle(e.target.value)}
            placeholder="Enter title..."
          />
          <button onClick={handleAddNewConvo}>Add Conversation</button>
          <button onClick={() => setShowNewConvoPrompt(false)}>Cancel</button>
        </div>
      )}
      {showMobileSettings && (
        <MobileSettings setShowMobileSettings={setShowMobileSettings} showMobileSettings={showMobileSettings} setShowMobileConversation={setShowMobileConversation}/>
      )}
      </div>
      <div className="mobileNavSettings" onClick={logoutClickHandler}>
        <p>{userInfo[0]}</p>
        <img src={settings} onClick={showMobileSettingsClickHandler}></img>
      </div>
    </div>
  )
}

export default MobileNav;