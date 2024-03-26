import React, { useState } from "react";
import "../styles/footer.css";

const baseUrl = process.env.REACT_APP_API_URL || "";

const Footer = ({ 
  conversation, 
  setConversation, 
  userInfo, 
  conversationTitles, 
  currentConversationTitle, 
  setCurrentConversationTitle, 
  setConversationTitles 
}) => {

  const [newConvoTitle, setNewConvoTitle] = useState("");

  const conversationUpdate = async (e) => {
    let latestBotMessage = ""
    e.preventDefault();
    let input = document.getElementById("input").value.trim();

    // console.log("In Footer, this is currentConversation: ", currentConversationTitle);

    // Immediately update conversation with the user's input
    setConversation({
      user: [...conversation.user, input],
      bot: [...conversation.bot]
    });

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
            setConversationTitles([...conversationTitles, newConvo]);
            setCurrentConversationTitle(newConvoTitle);
          } else {
            console.error("Failed to create new conversation");
          }
        } catch (error) {
          console.error("Error creating new conversation:", error);
        }
      }
    }
setNewConvoTitle("");
document.getElementsByClassName("footerInput")[0].value = "";
    // Fetch the bot's response
    const gptResponse = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newMessage: input })
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
    const username = userInfo[0];
    const response = await fetch(`${baseUrl}/api/updateConvos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentConversation: currentConversationTitle.length < 1 ? newConvoTitle : currentConversationTitle,
        conversationMessage: { user: input, bot: latestBotMessage },
        username: username
      })
    });

    const result = await response.json()
    // console.log("this is response from updateConvos: ", result.conversations[0].conversation)
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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      conversationUpdate(event);
    }
  }
  return (
    <div className="footer">
      <input 
        id="input" 
        type="text"
        className="footerInput" 
        placeholder="Ask away..." 
        onKeyDown={handleKeyDown}
        value={newConvoTitle} 
        onChange={(e) => setNewConvoTitle(e.target.value)}
      />
      <button className="button" onClick={conversationUpdate}>&#8593;</button>
    </div>
  );
};

export default Footer;
