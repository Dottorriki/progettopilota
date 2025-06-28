// Importazioni e Setup di Base

import { useState } from 'react';
// useState: Viene importato da React per gestire gli state interni del componente. 
// Qui verrà utilizzato per tenere traccia della descrizione del sogno, 
// dei dati di risposta (analisi, immagine, audio), e per gestire lo stato di caricamento ed eventuali errori.

import Head from 'next/head';
// Head: Importato da Next.js per inserire meta tag, titolo e altre informazioni nell'elemento <head> della pagina, 
// migliorando la SEO e la configurazione della pagina.

import styles from '../styles/Home.module.css';
// styles: Viene importato un modulo CSS (Home.module.css) che contiene gli stili specifici per questo componente. 
// Utilizzando i CSS modules, si garantisce l’isolamento degli stili.

import React, { useEffect } from "react";

// Definizione del Componente Principale
export default function Home() {
  // Il componente funzionale Home è il punto di ingresso della pagina. 
  // Esso contiene la logica e la presentazione per inserire la descrizione di un sogno e mostrare i risultati elaborati.

  //Gestione degli State
  const [dreamDescription, setDreamDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dreamAnalysis, setDreamAnalysis] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [audioData, setAudioData] = useState('');
  const [error, setError] = useState('');
  // dreamDescription: Memorizza la descrizione del sogno inserita dall'utente.
  // isLoading: Stato booleano che indica se la richiesta è in corso; viene usato per disabilitare il pulsante di submit e mostrare un indicatore di attesa.
  // dreamAnalysis: Qui verrà salvata l'interpretazione testuale del sogno ottenuta dall'API.
  // imageUrl: Memorizza l'URL dell'immagine generata dall'API per visualizzare il sogno.
  // audioData: Memorizza i dati audio (in formato Data URI) per riprodurre l'interpretazione tramite un player audio.
  // error: Contiene eventuali messaggi di errore da mostrare all'utente se la richiesta API fallisse o se l'input non fosse valido.

  //useEffect(() => {
  //  if (audioData) {
  //    console.log("Valore aggiornato di audioData:", audioData);
  //  }
 // }, [audioData]); // Questo effetto viene eseguito ogni volta che audioData cambia
  
  // Funzione di Gestione del Submit (handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
  // e.preventDefault(): Previene il comportamento predefinito del form (il ricaricamento della pagina) per permettere la gestione asincrona della submit.
  // Quando definisci una funzione come async, questa funzione ritorna sempre una Promise. 
  // Ciò vuol dire che il suo risultato verrà "promesso" in futuro e potrà essere gestito con .then() o await altrove nel codice.


    // validazione dell'input
    if (!dreamDescription.trim()) {
      setError('Per favore, inserisci la descrizione del tuo sogno.');
      return;
    }

    // Inizializzazione degli State Prima della Richiesta
    setIsLoading(true);
    setError('');
    setDreamAnalysis('');
    setImageUrl('');
    setAudioData('');
    
    // old Chiamata alle API (chiama il file dream.js)
    // Chiamata al backend

    try {
      //const response = await fetch('/api/dream', {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chain-request`;
      console.log("Chiamata a:", url, );
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ dreamText: dreamDescription })
				body: JSON.stringify({ testo: dreamDescription })
      });

      // La risposta viene controllata tramite response.ok: se è false significa che il server ha restituito uno status diverso da 2xx.
      // In caso di errore, si estrae il messaggio d'errore (eventualmente presente nel JSON) e viene lanciata una eccezione,
      // che verrà gestita nel blocco catch.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Errore: ${response.status}`);
      }
      // Elaborazione dei Dati di Risposta
      const data = await response.json();
      //console.log("Risposta API:", data);
      setDreamAnalysis(data.dreamAnalysis);
      setImageUrl(data.imageUrl);
      setAudioData(data.audioData); 
      // Se la risposta è OK, viene convertita in JSON e i dati vengono salvati nei rispettivi state:
      // - dreamAnalysis: contiene l’interpretazione testuale.
      // - imageUrl: contiene l’URL dell’immagine generata.
      // - audioData: contiene una stringa Data URI per riprodurre l’audio.
      // Gestione degli Errori in Generale
    } catch (err) {
      console.error('Si è verificato un errore:', err);
      setError('Si è verificato un errore durante l\'elaborazione della richiesta: ' + err.message);
    } finally {
      setIsLoading(false);
    }
    // - catch: Se si verifica un errore durante l’operazione asincrona, l’errore viene loggato sulla console e
    //   viene aggiornato lo stato error con un messaggio significativo.
    // - finally: Indipendentemente dal risultato (successo o errore), lo stato isLoading viene riportato a false, 
    //   in modo che l’utente possa nuovamente interagire con la pagina.
  };
  // Nel contesto della funzione handleSubmit, definirla come asincrona significa che possiamo:
  // - Prevenire il comportamento di default del form usando e.preventDefault().  
  // - Eseguire una chiamata API che potrebbe richiedere del tempo, senza bloccare l'interfaccia utente.
  // - Attendere il risultato della chiamata senza appesantire il flusso principale di esecuzione, grazie all'uso di await.
  // - Gestire errori in maniera chiara con try/catch, migliorando la robustezza dell'app.

  // Render della Pagina
  return (
    
    <div className={styles.container}>
    {/*  Il componente restituisce un JSX che include:  */}

      <Head>                                       {/*  Header e Meta Informazioni  */}
        <title>DreamWeaver - Interpreta i tuoi sogni con l'AI</title>
        <meta name="description" content="Un'applicazione per interpretare i sogni utilizzando l'intelligenza artificiale" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={styles.main}>                {/*  Sezione Principale (Main Content)  */}   
        
        <h1 className={styles.title}>               {/*  Viene mostrato il titolo dell'applicazione e una breve descrizione che invita l’utente a interagire.  */}
          DreamWeaver
        </h1>
        <p className={styles.description}>
          Racconta il tuo sogno e lascia che l'AI lo interpreti, lo visualizzi e lo racconti
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>        {/*  Form di input  */}

          {/*  Textarea: L'utente inserisce la descrizione del sogno. 
               Il valore del campo è associato allo state dreamDescription e viene aggiornato ad ogni cambiamento.  */}
          <textarea
            className={styles.textarea}
            value={dreamDescription}
            onChange={(e) => setDreamDescription(e.target.value)}
            placeholder="Descrivi il tuo sogno..."
            rows={6}
            required
          />

          {/*  Pulsante Submit: Il bottone invia il form. È disabilitato se isLoading è true, impedendo richieste multiple durante l'elaborazione. 
               Il testo sul bottone cambia per indicare lo stato del caricamento.  */}
          <button             
            type="submit" 
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Elaborazione in corso...' : 'Interpreta il sogno'}
          </button>
        </form>
        <>
        {/*  Visualizzazione di errori  
             Se lo state error contiene un messaggio, viene visualizzato un paragrafo con lo stile dedicato.  */}
        {error && <p className={styles.error}>{error}</p>}
        </>
        <>
        {/*  Visualizzazione di stato di caricamento
             Se isLoading è true, viene mostrata una sezione con un'animazione (spinner) e un messaggio per informare l'utente che l'elaborazione è in corso.  */}
        {isLoading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Sto interpretando il tuo sogno...</p>
          </div>
        )}
        </>
        <>
        {/*  Visualizzazione dei Risultati  */}
        {dreamAnalysis && (
          <div className={styles.resultContainer}>
          {/*  Interpretazione Testuale e Audio  */}
            {/* Sezione per il testo 
                Se è presente dell'analisi testuale (dreamAnalysis), viene mostrata in un contenitore dedicato.*/}
            <h2 className={styles.resultTitle}>Interpretazione del sogno</h2>
            <div className={styles.analysisText}>{dreamAnalysis}</div>
            
            {/* Sezione per l'audio 
                Se esistono dati audio (audioData), viene resa disponibile una sezione con un player <audio> che consente all'utente di ascoltare l'interpretazione. */}
            {audioData && (
              <div className={styles.audioSection}>
                <h3 className={styles.audioTitle}>Ascolta l'interpretazione</h3>
                <audio 
                  controls
                  src={`data:audio/mp3;base64,${audioData}`}
                  className={styles.dreamAudio}
                >
                  Il tuo browser non supporta l'elemento audio.
                </audio>
              </div>
            )}
          </div>
        )}
        </>
        <>
        {/* Visualizzazione dell'Immagine 
            Se lo state imageUrl contiene un URL, viene mostrata una sezione con un tag <img> che visualizza l'immagine generata in base alla descrizione del sogno. */}
        {imageUrl && (
          <div className={styles.imageContainer}>
            <h2 className={styles.resultTitle}>Visualizzazione del sogno</h2>
            <img 
              src={imageUrl} 
              alt="Visualizzazione del sogno" 
              className={styles.dreamImage} 
            />
          </div>
        )}
        </>
      </main>

      <>
      {/* Footer
          Il footer informa che l'app è stata creata utilizzando Next.js e le API di OpenAI */}
      <footer className={styles.footer}>
        <p>Creato con Next.js e OpenAI</p>
      </footer>
      </>
    </div>
  );
}
