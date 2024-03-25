const apiController = {}

apiController.voice = (async (req, res, next) => {

  const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/{voice_id}", {
  method: "POST",
  headers: 
    {'Content-Type': 'application/json'},
  body: `{"model_id":"<string>","pronunciation_dictionary_locators":[{"pronunciation_dictionary_id":"<string>","version_id":"<string>"}],"text":${input},"voice_settings":{"similarity_boost":123,"stability":123,"style":123,"use_speaker_boost":true}}`
  })


});

apiController.text = (async (req, res, next) => {

  // const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/{voice_id}", {
  // method: "POST",
  // headers: 
  //   {'Content-Type': 'application/json'},
  // body: `{"model_id":"<string>","pronunciation_dictionary_locators":[{"pronunciation_dictionary_id":"<string>","version_id":"<string>"}],"text":${input},"voice_settings":{"similarity_boost":123,"stability":123,"style":123,"use_speaker_boost":true}}`
  // })


});

module.exports = apiController