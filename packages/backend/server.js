/* eslint-env node */


// Questo handler gestisce la richiesta di interpretazione del sogno.
// Non serve importare alcuna libreria specifica per Hugging Face perché utilizziamo fetch che è disponibile in ambiente Node (Next.js).

// server.js (Backend)

import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + "/.env.development" });

console.log("Loaded .env file from:", __dirname + "/.env.development");



import express from "express";
import cors from "cors";


import { fromEnv } from "@aws-sdk/credential-providers"; // eslint-disable-line no-unused-vars
// const { fromEnv } = require("@aws-sdk/credential-providers"); // CommonJS import

// Sezione creazione testo
import { getllama } from "./server/api/llama-3.js"; 

// Sezione creazione audio
import { getAudioBase64, main } from "./server/api/pollyModule.js"; // eslint-disable-line no-unused-vars

// Sezione traduzione in inglese del testo digitato dall'utente 
import { getTranslation } from "./server/api/translateModule.js";  
import { Translate } from "@aws-sdk/client-translate"; // eslint-disable-line no-unused-vars

// Sezione generazione immagine dal testo digitato dall'utente 
import { generateImage } from "./server/api/generateImage.js";  


const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());

// export default async function handler(req, res) {
app.post("/api/chain-request", async (req, res) => {
  // Verifica che il metodo della richiesta sia POST.
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Metodo non permesso" });
  }

  console.log("Elaborazione della richiesta di interpretazione del sogno");

  try {
    // Validazione e preparazione 
    // Estrazione del testo del sogno dal corpo della richiesta
    const { dreamText } = req.body;

    // Validazione dei dati della richiesta
    if (!dreamText || typeof dreamText !== "string" || dreamText.trim() === "") {
      console.log("Validazione della richiesta fallita: Testo del sogno mancante o non valido");
      return res.status(400).json({ 
        success: false,
        error: "Testo del sogno mancante o non valido"
      });
    }
        
    // Log del testo del sogno (troncato per privacy/brevità se lungo)
    const truncatedText = dreamText.length > 50 
      ? `${dreamText.substring(0, 50)}...` 
      : dreamText;
    console.log(`Elaborazione del testo del sogno: "${truncatedText}"`);
    
    // Chiamata all'API llama-3.3-70b-instruct di META tramite Openrouter
    // Estrazione dei dati in base al formato della risposta.
    const result = await getllama(dreamText);
    const dreamAnalysis = result && result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content 
      : "Nessuna risposta generata dall'API.";
    
    const testo = result.choices[0].message.content;
    console.log("Analisi del sogno ricevuta con successo");
  
    // Chiamata alla TTS API Polly di AWS
    // Richiama main() e attendi il risultato
    const audioBase64 = await main(testo);
    console.log("Restituisco il JSON con audioData:", audioBase64.substring(0, 50));
    
    // Chiamata alla API Translate di AWS
    // Richiama getTranslation() e attendi il risultato
    const textEnglish = await getTranslation(testo, "it-IT");
    console.log("Restituisco il testo tradotto in inglese:", textEnglish);

// Chiamata alla API di generazione delle immagini di POLLINATIONS.AI
    // Richiama generateImage() e attendi il risultato
    const imageUrl = await generateImage(textEnglish);
    console.log("Restituisco il percorso per recuperare l'immagine generata", imageUrl);

    // Invia la risposta finale al client
    return res.status(200).json({
      success: true,
      dreamAnalysis,
      audioData: audioBase64,
      imageUrl: imageUrl
    });
  } 
  catch (error) {
    console.error("Errore durante l'elaborazione della richiesta:", error);
      return res.status(500).json({
      success: false,
      error: error.message || "Errore sconosciuto"
    });
  }
});

// Avvia il server in ascolto sulla porta definita

app.get("/health", (req, res) => {
  res.status(200).send("✔️ Backend online");
});

app.get("/", (req, res) => {
  res.status(200).send("🎯 Benvenuto nel backend Riccardo!");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
