/* eslint-env node */


import { Resolver } from "dns";
import util from "util";
import https from "https";

    // Risoluzione DNS e configurazione dell'agent HTTPS personalizzato
    const resolver = new Resolver();
    resolver.setServers(["1.1.1.1", "1.0.0.1"]); // Cloudflare DNS
    const resolve4Async = util.promisify(resolver.resolve4.bind(resolver));
    const addresses = await resolve4Async("api.deepseek.com");
    console.log("Indirizzi IP risolti:", addresses);
  
    const customAgent = new https.Agent({
      lookup: (hostname, options, callback) => {
        resolver.resolve4(hostname, (err, addresses) => {
        err ? callback(err) : callback(null, addresses[0], 4);
        });
      },
      timeout: 10000
    });

export async function getllama(dreamText) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.KEY_OPEN}`,
          "Content-Type": "application/json",
          "max_tokens": 1000
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [{
            role: "user",
            content: `Ciao, devi rispondermi in italiano. Crea una storia sulla base delle seguenti informazioni: ${dreamText}. Mi piacerebbe che tu provassi ad interpretarlo`
          }]
        }),
        agent: customAgent
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
      
    const responseText = await response.text();
    if (!responseText) {
        throw new Error("La risposta dell'API LLAMA è vuota");
    }
    let result;
    try {
        result = JSON.parse(responseText);
    } 
    catch (parseError) {
        console.error("Errore nel parsing JSON:", responseText);
        throw parseError;
    }
    return result;
}  

