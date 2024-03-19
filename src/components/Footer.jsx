import React from "react";
import "../styles/footer.css";


const baseUrl = process.env.REACT_APP_API_URL


const Footer = ({ conversation, setConversation, userInfo, conversations, currentConversation }) => {

  const conversationUpdate = async (e) => {
    e.preventDefault();
    let input = document.getElementById("input").value;
    document.getElementById("input").value = ''; // Clear input after sending

    // Prepare the latest messages to send
    const latestUserMessage = input;
    const latestBotMessage = "roger"; // Assuming this is determined somehow

    // Update the local state to reflect this new message (optional, depending on your app's logic)
    setConversation({
      user: [...conversation.user, latestUserMessage],
      bot: [...conversation.bot, latestBotMessage]
    });

    console.log("IN FOOTER; This is the username: ", userInfo[0]);
    console.log("IN FOOTER; This is the currentConversation: ", currentConversation);

    const username = userInfo[0];
    const response = await fetch(`${baseUrl}/api/updateConvos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        currentConversation: currentConversation,
        conversationMessage: {
          user: latestUserMessage,
          bot: latestBotMessage
        },
        username: username
      })
    });
    const result = await response.json();
    console.log("This is response from updateConvos: ", result);
  };

  return (
    <div className="footer">
      <input id="input" placeholder="Ask away..."></input>
      <button className="button" onClick={conversationUpdate}>&#8593;</button>
    </div>
  );
};

export default Footer;
