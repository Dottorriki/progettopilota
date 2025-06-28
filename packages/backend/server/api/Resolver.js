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
