import React from "react";
import "../styles/footer.css"

const Footer = ({conversation, setConversation}) => {

  const fetcher = async(e) => {

    e.preventDefault();

    let input = document.getElementById("input").value
    console.log(input)

    let clone = conversation.splice()
    clone.push({
      user: input,
      bot: "roger"
    })
    setConversation(clone)
  }

  return(
    <div className="footer">
      <input id="input" placeholder="Message the King of Camelot...">
      </input>
      <button className="button" onClick={fetcher}>Send</button>
    </div>
  )
}

export default Footer