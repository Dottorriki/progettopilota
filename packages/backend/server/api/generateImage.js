/* eslint-env node */


import fetch from "node-fetch";

/**
 * Generates an image URL from a given text prompt using Pollinations.AI.
 *
 * @param {string} prompt - Text description of the image to generate.
 * @param {number} width - Width of the generated image (default: 1024).
 * @param {number} height - Height of the generated image (default: 1024).
 * @param {number} seed - Seed for reproducibility (default: 42).
 * @param {string} model - Pollinations model (default: 'flux').
 * @param {boolean} enhance - Imposta su true per migliorare il prompt utilizzando un LLM.
 * @returns {Promise<string>} - URL of the generated image.
 */
export async function generateImage(promptText, width = 1024, height = 1024, seed = 1, model = "turbo", nologo = true, enhance = true) {
    try {
      // Assicurati che promptText sia una stringa
      if (typeof promptText !== "string") {
        throw new Error("Il parametro 'promptText' deve essere una stringa.");
      }
   
      // Encode il prompt correttamente
      const encodedPrompt = encodeURIComponent(promptText);
  
      // Genera l'URL corretto
      const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=${model}&nologo=${nologo}&enhance=${enhance}`;
  
      console.log("Sto generando un'immagine con il prompt:", promptText);
      console.log("Sto fornendo all'API il prompt encoded:", encodedPrompt);
      return imageUrl;
    } catch (error) {
      console.error("Errore durante la richiesta dell'immagine:", error);
      return null;
    }
  }
  