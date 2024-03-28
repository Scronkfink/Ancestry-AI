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
    e.preventDefault();

    let input = document.getElementById("mobileInput").value.trim();
    if(input.length === 0){
      alert("Put a message in...we have error handling, Tino.")
      return 
    }
    const latestUserMessage = input;
    let latestBotMessage = "";

    
    if (!conversation || conversation.length === 0) {
      setConversation({
        user: [input],
        bot: []
      });
    }
    else{
      setConversation({
        user: [...conversation.user, input],
        bot: [...conversation.bot]
      });
    } 

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
            setCurrentConversationTitle(newConvoTitle);
          } else {
            console.error("Failed to create new conversation");
          }
        } catch (error) {
          console.error("Error creating new conversation:", error);
        }
      }
      setCurrentConversationTitle(newConvoTitle);
    }
    setNewConvoTitle("");
    document.getElementsByClassName("footerInput")[0].value = "";

    console.log("good before llm fetch ")
    const gptResponse = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ newMessage: latestUserMessage })
    });

       if (gptResponse.ok) {
      const gptResult = await gptResponse.json();
      latestBotMessage = gptResult.answer;
      // Update conversation with bot's message
      setConversation(current => ({
        user: [...current.user], // already includes the user's latest message
        bot: [...current.bot, latestBotMessage]
      }));
    }
     else {
      console.error("Failed to fetch bot's response");
    }

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
