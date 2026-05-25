import { systemState } from './state.js';
import { logApiEvent, renderApp } from './uiService.js';

// Hämta utomhustemperatur och vindhastighet från Netlify Serverless Function
export async function fetchWeatherData() {
    try {
        logApiEvent("Anropar väder-API via Netlify Function (/api/get-weather)...");
        const response = await fetch('/.netlify/functions/get-weather');
        if (response.ok) {
            const data = await response.json();
            systemState.airTemp = data.airTemp;
            systemState.windSpeed = data.windSpeed;
            logApiEvent(`Väder hämtat: Lufttemp ${systemState.airTemp}°C, Vind ${systemState.windSpeed} m/s.`);
            renderApp();
        } else {
            throw new Error(`Server svarade med ${response.status}`);
        }
    } catch (err) {
        logApiEvent("Kunde inte hämta väderdata från funktionen.");
        console.error("Kunde inte hämta väderdata:", err);
    }
}

// Hämta vattentemperatur från Netlify Serverless Proxy
export async function fetchWaterTemperature() {
    const infoLabel = document.getElementById('live-indicator');
    const pingInd = document.getElementById('ping-indicator');
    const apiStatusDot = document.getElementById('api-status-dot');
    const resourceArea = document.getElementById('resource-raw');

    try {
        logApiEvent(`Anropar vattentemperatur för ${systemState.selectedBathName}...`);
        const response = await fetch(`/.netlify/functions/get-water-temp?uuid=${encodeURIComponent(systemState.selectedBathUuid)}`);
        
        if (response.ok) {
            const data = await response.json();
            if(resourceArea) resourceArea.value = JSON.stringify(data, null, 2);
            logApiEvent(`Resurs hämtad! Rådata läst via proxy.`);
            
            if (data.offline) {
                systemState.isOffline = true;
                systemState.waterTemp = null;
                systemState.waterDepth = null;
                systemState.waterTime = null;
                if(infoLabel) infoLabel.innerText = "Sensor Offline";
                if(pingInd) pingInd.className = "w-2 h-2 rounded-full bg-red-500";
                if(apiStatusDot) apiStatusDot.className = "w-2.5 h-2.5 rounded-full bg-red-500";
                logApiEvent(`Sensorn på ${systemState.selectedBathName} är offline.`);
                renderApp();
                return;
            }

            let parsedTemp = findValInObject(data, ['temp', 'temperature', 'value', 'vattentemp', 'vattentemperatur']);
            
            if (parsedTemp !== null && !isNaN(parsedTemp)) {
                systemState.isOffline = false;
                systemState.waterTemp = parsedTemp;
                systemState.waterDepth = data.depth ?? null;
                systemState.waterTime = data.time ?? null;
                if(infoLabel) infoLabel.innerText = "Sensor online";
                if(pingInd) pingInd.className = "w-2 h-2 rounded-full bg-emerald-400 animate-ping";
                if(apiStatusDot) apiStatusDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
                logApiEvent(`Framgångsrik tolkning av vattentemp via proxy: ${parsedTemp}°C`);
                renderApp();
                return;
            } else {
                 throw new Error("Kunde inte hitta temperaturvärde i JSON.");
            }
        }
        throw new Error("Ogiltig eller saknad data från proxyn.");
    } catch (err) {
        logApiEvent(`Proxy-anslutning misslyckades.`);
        if(resourceArea) resourceArea.value = "// Serverless-funktion ej tillgänglig.\n// Kan inte hämta temperatur.";
        
        systemState.isOffline = true;
        systemState.waterTemp = null;
        systemState.waterDepth = null;
        systemState.waterTime = null;
        if(infoLabel) infoLabel.innerText = "Anslutningsfel";
        if(pingInd) pingInd.className = "w-2 h-2 rounded-full bg-red-500";
        if(apiStatusDot) apiStatusDot.className = "w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse";
        
        renderApp();
    }
}

// Sök efter nycklar i nestat objekt
function findValInObject(obj, keys) {
    if (typeof obj !== 'object' || obj === null) return null;
    for (let key in obj) {
        if (keys.includes(key.toLowerCase()) && typeof obj[key] === 'number') {
            return obj[key];
        }
        if (typeof obj[key] === 'object') {
            const res = findValInObject(obj[key], keys);
            if (res !== null) return res;
        }
    }
    return null;
}
