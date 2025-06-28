/* eslint-env node */


// Invoca Translate per la traduzione in inglese
import {
    TranslateClient,
    TranslateTextCommand,
} from "@aws-sdk/client-translate";
      
      /**
       * Translate the extracted text to English.
       *
       * @param {{ extracted_text: string, source_language_code: string}}
       */
  
      export async function getTranslation(extracted_text, source_language_code) {
        try {
          // Inizializza il client con configurazione opzionale
          const translateClient = new TranslateClient({ region: "eu-central-1" });
      
          const translateCommand = new TranslateTextCommand({
            Text: extracted_text,
            SourceLanguageCode: source_language_code,
            TargetLanguageCode: "en"
          });
          
          console.log(source_language_code);
          console.log(extracted_text);

          const { TranslatedText } = await translateClient.send(translateCommand);
      
          return TranslatedText ;
        } catch (error) {
          console.error("Errore nella traduzione con AWS Translate:", error);
          return { error: error.message };
        }
      }

