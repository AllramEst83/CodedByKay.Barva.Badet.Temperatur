import { systemState, themes } from './state.js';

// Loggfunktion för gränssnittet
export function logApiEvent(msg) {
    const container = document.getElementById('api-log-container');
    if (!container) return;
    const time = new Date().toLocaleTimeString('sv-SE');
    const newLog = document.createElement('div');
    newLog.innerHTML = `<span class="text-white/40">[${time}]</span> ${msg}`;
    container.appendChild(newLog);
    container.scrollTop = container.scrollHeight;
}

// Renderings-motor för gränssnittet
export function renderApp() {
    const season = systemState.isOverride ? systemState.overrideSeason : systemState.season;
    const timeOfDay = systemState.isOverride ? systemState.overrideTime : systemState.timeOfDay;
    const temp = systemState.isOverride && systemState.overrideTemp !== null ? systemState.overrideTemp : systemState.waterTemp;

    if (!season || !timeOfDay) return;

    const theme = themes[season];
    
    // Bakgrund
    document.body.style.background = theme.bg[timeOfDay];

    // Miljö-overlays
    const overlay = document.getElementById('ambient-overlay');
    if (overlay) {
        if (timeOfDay === 'night') {
            overlay.style.backgroundColor = 'rgba(0, 0, 30, 0.4)';
        } else if (timeOfDay === 'morning') {
            overlay.style.backgroundColor = 'rgba(255, 100, 100, 0.15)';
        } else if (timeOfDay === 'evening') {
            overlay.style.backgroundColor = 'rgba(255, 150, 50, 0.2)';
        } else {
            overlay.style.backgroundColor = 'transparent';
        }
    }

    // Statustexter
    const seasonEl = document.getElementById('season-name');
    if (seasonEl) seasonEl.innerText = theme.name;
    const timeLabels = { morning: 'Morgon 🌅', day: 'Dag ☀️', evening: 'Kväll 🌇', night: 'Natt 🌙' };
    const dayStatusEl = document.getElementById('day-status');
    if (dayStatusEl) dayStatusEl.innerText = timeLabels[timeOfDay];

    // Luft & vind
    const airEl = document.getElementById('air-temp');
    if (airEl) airEl.innerText = systemState.airTemp !== null ? `${systemState.airTemp} °C` : '--.- °C';
    const windEl = document.getElementById('wind-speed');
    if (windEl) windEl.innerText = systemState.windSpeed !== null ? `${systemState.windSpeed} m/s` : '-- m/s';

    // Mättidpunkt & mätdjup
    const timeEl = document.getElementById('measurement-time');
    const depthEl = document.getElementById('measurement-depth');
    if (timeEl) timeEl.innerText = systemState.waterTime ? formatMeasurementTime(systemState.waterTime) : '--';
    if (depthEl) depthEl.innerText = systemState.waterDepth !== null ? `${systemState.waterDepth} cm` : '--';

    // Badbetyg & råd
    const tempEl = document.getElementById('water-temp');
    const badge = document.getElementById('badge-container');
    const advice = document.getElementById('temp-advice');

    if (systemState.isOffline) {
        if (tempEl) tempEl.innerText = '--.-';
        if (badge) {
            badge.className = 'bg-red-900/90 text-red-100 border border-red-500 mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-md inline-block theme-transition';
            badge.innerText = 'Temperature device offline 🔴';
        }
        if (advice) advice.innerText = `Temperatursensorn vid ${systemState.selectedBathName} verkar vara nedkopplad för tillfället.`;
        if (timeEl) timeEl.innerText = '--';
        if (depthEl) depthEl.innerText = '--';
    } else if (temp !== null) {
        if (tempEl) tempEl.innerText = parseFloat(temp).toFixed(1);

        let badgeText = '';
        let badgeClass = '';
        let adviceText = '';

        if (temp < 6) {
            badgeText = 'Isande Kallt! ❄️';
            badgeClass = 'bg-blue-900/90 text-blue-100 border border-blue-500'; // Increased contrast background opacity
            adviceText = 'Bara för härdade ishavssimmare och snabba bastubadare.';
        } else if (temp >= 6 && temp < 13) {
            badgeText = 'Vikingadopp 🥶';
            badgeClass = 'bg-sky-800/90 text-sky-100 border border-sky-400';
            adviceText = 'Riktigt uppfriskande! Snabba dopp rekommenderas starkt.';
        } else if (temp >= 13 && temp < 18) {
            badgeText = 'Friskt Bad 🏊';
            badgeClass = 'bg-teal-800/90 text-teal-100 border border-teal-300';
            adviceText = 'Helt okej temperatur för ett aktivt simpass.';
        } else if (temp >= 18 && temp < 22) {
            badgeText = 'Härligt & Skönt! 😎';
            badgeClass = 'bg-emerald-800/90 text-emerald-100 border border-emerald-300';
            adviceText = `Riktigt behagligt! Perfekt för ett familjedopp i ${systemState.selectedBathName}.`;
        } else {
            badgeText = 'Helt Magiskt! 🔥';
            badgeClass = 'bg-amber-900/90 text-amber-100 border border-amber-500';
            adviceText = 'Underbar temperatur! Det blir inte mycket bättre i svenskt sötvatten.';
        }

        if (badge) {
            badge.className = `mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-md inline-block theme-transition ${badgeClass}`;
            badge.innerText = badgeText;
        }
        if (advice) advice.innerText = adviceText;
    } else {
        if (tempEl) tempEl.innerText = '--.-';
        if (badge) {
            badge.className = 'bg-gray-800 text-gray-200 mt-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-md inline-block';
            badge.innerText = 'Laddar...';
        }
    }

    generateParticles(theme.particles);
}

// Formatera mättidpunkt från "YYYY-MM-DD HH:MM:SS" till "DD MMM HH:MM"
function formatMeasurementTime(tidStr) {
    if (!tidStr) return '--';
    const d = new Date(tidStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return tidStr;
    return d.toLocaleString('sv-SE', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Generera partiklar
function generateParticles(particleList) {
    const container = document.getElementById('particle-container');
    if (!container) return;
    container.innerHTML = '';
    const density = 15;
    for (let i = 0; i < density; i++) {
        const el = document.createElement('div');
        el.className = 'particle';
        el.innerText = particleList[Math.floor(Math.random() * particleList.length)];
        el.style.left = `${Math.random() * 100}vw`;
        el.style.fontSize = `${10 + Math.random() * 20}px`;
        el.style.animationDuration = `${5 + Math.random() * 12}s`;
        el.style.animationDelay = `${-Math.random() * 10}s`;
        container.appendChild(el);
    }
}
