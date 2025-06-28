/* eslint-env node */


import { SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import { PollyClient } from "@aws-sdk/client-polly";

const pollyClient = new PollyClient({ region: "eu-central-1" });

export async function getAudioBase64(trimmedText) {
  try {

    // Parametri per Polly
    const params = {
      OutputFormat: "mp3", // Usa "pcm" se vuoi passarlo direttamente a Speaker
      Text: trimmedText,
      TextType: "text",
      VoiceId: "Carla",
      LanguageCode: "it-IT"
    };

    // Invoca Polly per sintetizzare l'audio
    const data = await pollyClient.send(new SynthesizeSpeechCommand(params));

    if (!data.AudioStream) {
      throw new Error("AudioStream non è stato restituito.");
    }

    // Converte lo stream in un Buffer
    const chunks = [];
    for await (const chunk of data.AudioStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // Converte l'audio in base64 e lo restituisce
    const audioBase64 = audioBuffer.toString("base64");
    console.log("Audio ricevuto con successo dalla TTS API.");
    //console.log("Primi 50 caratteri generati dalla TTS API: ", audioBase64.substring(0, 50));
    return audioBase64;

  } catch (error) {
    console.error("Errore nella sintesi vocale con AWS Polly:", error);
    return null;
  }
}
export async function main(responseText) {
  // Limita la lunghezza del testo per evitare errori di Pollyconst e rimuove **;
  const testoSanificato = responseText.replace(/\*\*/g, "");
  const trimmedText = testoSanificato.substring(0, 4000);
  console.log(trimmedText.substring(0, 50));
  const risultatoAudio = await getAudioBase64(trimmedText);

  if (risultatoAudio) {
    console.log("Restituito file audio in Base64");
    console.log("Primi 50 caratteri ricevuti dalla TTS API: ", risultatoAudio.substring(0, 50));
    return risultatoAudio;
  } 
  else {
    console.log("Errore durante la generazione dell'audio.");
    return null;
    }
  }
  
