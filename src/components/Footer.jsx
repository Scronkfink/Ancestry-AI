import React from "react";
import "../styles/footer.css"
import { useEffect } from "react";

const Footer = ({conversation, setConversation, userInfo, conversations, currentConversation}) => {

  const conversationUpdate = async(e) => {

    e.preventDefault();
    let input = document.getElementById("input").value

    let clone = conversation.slice()
    clone.push({
      user: input,
      bot: "roger"
    })
    setConversation(clone)
  }

  useEffect(() => {

    const updateConvos = async() => {

      const username = userInfo[0];
      
      console.log("IN FOOTER; This is the username: ", username)
      console.log("IN FOOTER; These are the complete conversations: ", conversations)
      console.log("IN FOOTER; This is the convo: ", conversation)
      console.log("IN FOOTER; This is the currentConversation: ", currentConversation)

      const response = await fetch("/updateConvos", {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          conversations: conversations,
          currentConversation: currentConversation,
          conversationMessage: conversation,
          username: username
        })
      });
      const result = await response.json()
      console.log("This is response from updateConvos: ", result)
    }

    updateConvos()
  }, [conversation, conversations])

  return(
    <div className="footer">
      <input id="input" placeholder="Message the King of Camelot...">
      </input>
      <button className="button" onClick={conversationUpdate}>Send</button>
    </div>
  )
}

export default Footer