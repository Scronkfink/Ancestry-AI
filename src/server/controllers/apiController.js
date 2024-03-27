const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({apiKey: process.env.OPENAI_KEY});

const apiController = {}

apiController.text = (async (req, res, next) => {

  const newMessage = req.body.newMessage
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "The King of Camelot is a chatbot designed to be a virtual representation of Roberto Riva, the man who these writings are based off of." },
        { role: "user", content: `${newMessage}` }
      ],
      model: "ft:gpt-3.5-turbo-1106:personal:roberto8:976PzZbh",
      // max_tokens: 50, // Length of response
      temperature: .8, // Lower for more deterministic responses
    });
   const answer = completion.choices[0].message.content

  res.status(200).json({answer})
}

catch(err){
  console.log(err)
}

});

apiController.voice = (async (req, res, next) => {


  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/{voice_id}", {
  method: "POST",
  headers: 
    {'Content-Type': 'application/json'},
  body: `{"model_id":"<string>","pronunciation_dictionary_locators":[{"pronunciation_dictionary_id":"<string>","version_id":"<string>"}],"text":${input},"voice_settings":{"similarity_boost":123,"stability":123,"style":123,"use_speaker_boost":true}}`
  })


});

module.exports = apiController