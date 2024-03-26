import React from "react";
import "../mobileStyles/mobileFooter.css";
import { useState } from "react";

const baseUrl = process.env.REACT_APP_API_URL || "";

const MobileFooter = ({ 
  conversation, 
  setConversation, 
  setCurrentConversationTitle,
  userInfo, 
  conversationTitles,
  setConversationTitles,
  currentConversationTitle, 
  showMobileNav }) => {

  const [newConvoTitle, setNewConvoTitle] = useState("");

  const conversationUpdate = async (e) => {

    let input = document.getElementById("mobileInput").value.trim();
    const latestUserMessage = input;
    document.getElementsByClassName("footerInput")[0].value = ""
    e.preventDefault();

    if (currentConversationTitle.length === 0) {
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
      setCurrentConversationTitle(newConvoTitle);
    }

    const gptResponse = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ newMessage: latestUserMessage })
    });

    const gptResult = await gptResponse.json();
    const latestBotMessage = gptResult.answer;

    if (!conversation || conversation.length === 0) {
      setConversation({
        user: [],
        bot: []
      });
    } else {
      setConversation({
        user: [...conversation.user, latestUserMessage],
        bot: [...conversation.bot, latestBotMessage]
      });
    }

    const username = userInfo[0];

    console.log("this is the newConvoTitle: ", newConvoTitle)
    const response = await fetch(`${baseUrl}/api/updateConvos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentConversation: currentConversationTitle.length < 1 ? newConvoTitle : currentConversationTitle,
        conversationMessage: { user: latestUserMessage, bot: latestBotMessage },
        username: username
      })
    });

    const result = await response.json()
    console.log("this is response from updateConvos: ", result.conversations[0].conversation)
    const updatedConversations = conversationTitles.slice();

    if (!updatedConversations.some(conversation => conversation.title === currentConversationTitle)) {
      updatedConversations.push({
        title: latestUserMessage,
        isSelected: true
      });
    }
    setConversationTitles(updatedConversations);
    setConversation(result.conversations[0].conversation);
    setNewConvoTitle("");
    document.getElementsByClassName("footerInput")[0].value = "";
  };

  if (!showMobileNav) {
    return (
      <div className="mobileFooter">
        <input className="footerInput" id="mobileInput" placeholder="Ask away..." 
        value={newConvoTitle} 
        onChange={(e) => setNewConvoTitle(e.target.value)}/>
        <button className="mobileButton" onClick={conversationUpdate}>&#8593;</button>
      </div>
    );
  }
};

export default MobileFooter;
