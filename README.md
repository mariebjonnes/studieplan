# Studieplan

En enkel webapp där man ska kunna lägga in studiepass/planering för veckan, och bocka av dem när man är klar. Det finns två sidor: Veckoplan och om.
Listan sparas i webbläsaren med localStorage.

Driftsatt app: https://studieplan-onsq.onrender.com

## Ramverk

Jag använder Next.js i detta projektet. Sidorna och /health ligger i samma projekt. 
server.js startar appen och skriver loggen när servern går igång. 

## Starta lokalt

Installera beroenden: 
npm install
npm run dev

Öppna http://localhost:3000/

Om man vill köra som i produktion: 
npm run build
npm start

## Docker
docker build -t studieplan .
docker run --rm -p 3000:3000 studieplan

Dockerfile är i två steg. Först byggs appen, sen körs bara det som behövs. Render bygger imagen själv från Dockerfile. Jag har inte lagt upp den på Docker Hub.

## Miljövariabler och hemligheter
Jag använder APP_ENV. Den styr om det står development eller production på sidan.
- npm run dev läser .env.development
- npm start, Docker och Render använder production

.env.example visar vilka variabler som ska finnas .env och .env.local är med i .gitignore så hemligheter inte åker upp på GitHub.

På Render har jag satt APP_ENV=production.

Deploy Hook-URLen ligger som secret i GitHub med namnet RENDER_DEPLOY_HOOK_URL. Den står inte i koden. APP_ENV är inte hemlig, den visas med flit. Riktiga API-nycklar hade jag inte skickat till webbläsaren. 

## Loggning och health check
När servern startar skriv INFO: Server started (kommer från server.js).
Om man går till /healt svarar den att server funkar och det loggas INFO: Health check ok.

Om man går till /api/error-demo loggas ERROR: Something went wrong. Den sidan är till bara för att kunna visa ett fel i Render logs. 

Så felsöker jag: om /health inte svarar har servern inte startat eller lyssnat på fel port. Om /health funkar men sidan ser konstig ut är det mer Frontend. Loggarna i Render visar vad som hände vid start och efter en deploy. 

Om npm run build eller docker build failar i GitHub Actions körs inte sista steget. Då ringer den inte Render och den gamla versionen ligger kvar.

## GitHub Actions
Filen ligger i .github/workflows/deploy.yml.

När jag pushar till main händer det här i ordning: 
1. koden hämtas
2. Node installeras
3. npm ci
4. npm run build
5. docker build
6. POST mot Render Deploy Hook

Inga tester och ingen Docker Hub som det stod i uppgiften. 

## Render
Det är en Web Service med Docker, kopplad till main. Auto-Deploy är av, så Render deployar inte av sig själv när jag pushar. 
GitHub actions skicar iväg Deploy Hook när bygget har lyckats. 

Appen lyssnar på 0.0.0.0 och den port Render ger i PORT. Free-planen kan somna, då tar första klicket ett tag. 

## Arkitektur
```mermaid
flowchart LR
  A[Webbläsare] --> B[Render]
  B --> C[server.js]
  C --> D[Next.js]
  D --> E[Sidor]
  D --> F[/health]
  G[Push till main] --> H[GitHub Actions]
  H --> I[npm run build]
  H --> J[docker build]
  I --> K[Deploy Hook]
  J --> K
  K --> B
```

Webbläsaren pratar bara med Render. Actions bygger först och säger sen åt Render att köra ut. Jag stängde av auto-deploy så en trasig build in ska gå live.

## Kostnadsmedveten drift
- Vilken Render plan använder du?
Free

- Varför har du valt den? 
Appen är liten och det räcker till uppgiften.

- Vilka faktorer påverkar kostnaden för att driva applikationen? 
Vilken instans man tar, om den ska vara vaken hela tiden, hur lång tid byggen tar, minne och CPU.

- Hur kan du minska applikationens resursanvändning? 
Dockerfile i två steg så imagen inte blir onödigt stor, ingen databas, listan i localStorage, auto-deploy är av så Render inte bygger vid varje push. Free stänger ner när ingen använder appen. 

- Vilka begränsningar har din nuvarande driftlösning? 
Den somnar, första laddningen kan vara långsam, bara en instans, lite minne, ingen databas. Om Actions är nere blir det ingen deploy. 

- Vad skulle du behöva förändra om applikationen fick betydligt fler användare? 
Byta till en betald plan som alltid är på, mer minne, kanske fler instanser och spara datan i en databas istället för localStorare.

## Säkerhet och vad jag hade gjort mer
Hemligheter ligger i GitHub Secrets och på Render, inte i git. Deploy Hook ska inte klistras in i README för den kan starta en deploy. 

Om det blev en riktig app hade jag velat ha databas och inloggning. Nu är fokus drift och CI/CD så jag har hållit appen liten. 