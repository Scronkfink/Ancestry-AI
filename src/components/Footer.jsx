import React from "react";
import { useState } from "react";
import "../styles/footer.css";

const baseUrl = process.env.REACT_APP_API_URL || ""

const Footer = ({ conversation, setConversation, userInfo, conversations, currentConversation, setCurrentConversation, setSpecificConversation }) => {

  const [newConvoTitle, setNewConvoTitle] = useState("");

  const conversationUpdate = async (e) => {

    let input = document.getElementById("input").value.trim();
    const latestUserMessage = input;
    document.getElementById("input").value=""

    e.preventDefault();
    if(currentConversation.length === 0){
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
        // console.log("this is the title: ", conversations[index].title)
        setCurrentConversation(newConvoTitle);
        setNewConvoTitle("");
    }

    const gptResponse = await fetch("/api/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ newMessage: latestUserMessage })
    });

    const gptResult = await gptResponse.json();
    // console.log("This is LLM response: ", gptResult);

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
    // console.log("this is newConvoTitle: ", newConvoTitle)
    // console.log("this is currentConversation: ", currentConversation)
    // console.log("this is conversationMessage: ", { user: latestUserMessage, bot: latestBotMessage })

    const response = await fetch(`${baseUrl}/api/updateConvos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentConversation: newConvoTitle,
        conversationMessage: { user: latestUserMessage, bot: latestBotMessage },
        username: username
      })
    });

    // const result = await response.json();
    // console.log("This is response from updateConvos: ", result);
    console.log(`this is the "specificConversation" aka conversations: `, conversations)
    const updatedConversations = conversations.slice()
    updatedConversations.push({
      title: currentConversation,
      isSelected: true
    });
    console.log("this is updated conversations: ", updatedConversations)
    setSpecificConversation(updatedConversations);
    setCurrentConversation(currentConversation);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      conversationUpdate(event);
    }
  };

  return (
    <div className="footer">
      <input id="input" type="text" placeholder="Ask away..." onKeyDown={handleKeyDown}
      value={newConvoTitle} onChange={(e) => setNewConvoTitle(e.target.value)}></input>
      <button className="button" onClick={conversationUpdate}>&#8593;</button>
    </div>
  );
};

export default Footer;
