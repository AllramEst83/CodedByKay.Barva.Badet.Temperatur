import { systemState, BATH_PLACES, getAutoSeason, getAutoTimeOfDay } from './state.js';
import { fetchWeatherData, fetchWaterTemperature } from './apiService.js';
import { renderApp } from './uiService.js';

// Initiera och starta applikationen
window.onload = function() {
    updateLiveTimeAndSeason();
    fetchWeatherData();
    fetchWaterTemperature();
    
    // Refresh data every 5 minutes
    setInterval(() => {
        if (!systemState.isOverride) {
            updateLiveTimeAndSeason();
            fetchWeatherData();
            fetchWaterTemperature();
        }
    }, 300000); 

    // Populate bath place selector
    setupBathSelect();

    // Setup Side Panel toggles
    setupSidePanel();
    
    // Expose override functions to window for demo buttons
    window.setOverrideSeason = setOverrideSeason;
    window.setOverrideTime = setOverrideTime;
    window.setOverrideTemp = setOverrideTemp;
    window.resetOverrides = resetOverrides;
};

// Uppdatera realtidsegenskaper
function updateLiveTimeAndSeason() {
    if (!systemState.isOverride) {
        systemState.season = getAutoSeason();
        systemState.timeOfDay = getAutoTimeOfDay();
    }
    renderApp();
}

function setupBathSelect() {
    const select = document.getElementById('bath-select');
    const subtitle = document.getElementById('bath-name-subtitle');
    if (!select) return;

    BATH_PLACES.forEach(place => {
        const option = document.createElement('option');
        option.value = place.uuid;
        option.textContent = place.name;
        if (place.uuid === systemState.selectedBathUuid) option.selected = true;
        select.appendChild(option);
    });

    select.addEventListener('change', () => {
        const selected = BATH_PLACES.find(p => p.uuid === select.value);
        if (!selected) return;

        systemState.selectedBathUuid = selected.uuid;
        systemState.selectedBathName = selected.name;
        systemState.waterTemp = null;
        systemState.isOffline = false;

        if (subtitle) subtitle.textContent = selected.name;

        const tempEl = document.getElementById('water-temp');
        const badge = document.getElementById('badge-container');
        if (tempEl) tempEl.innerText = '--.-';
        if (badge) badge.innerText = 'Hämtar data...';

        fetchWaterTemperature();
    });
}

function setupSidePanel() {
    const toggleBtn = document.getElementById('debug-toggle-btn');
    const sidePanel = document.getElementById('debug-side-panel');
    const overlay = document.getElementById('debug-overlay');
    const closeBtn = document.getElementById('debug-close-btn');

    if (!toggleBtn || !sidePanel || !overlay || !closeBtn) return;

    const togglePanel = () => {
        sidePanel.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    toggleBtn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', togglePanel);
    overlay.addEventListener('click', togglePanel);
}

// Demoläge override
function setOverrideSeason(season) {
    systemState.isOverride = true;
    systemState.overrideSeason = season;
    if (!systemState.overrideTime) systemState.overrideTime = 'day';
    renderApp();
}

function setOverrideTime(time) {
    systemState.isOverride = true;
    systemState.overrideTime = time;
    if (!systemState.overrideSeason) systemState.overrideSeason = 'summer';
    renderApp();
}

function setOverrideTemp(val) {
    systemState.isOverride = true;
    systemState.overrideTemp = parseFloat(val);
    const sliderVal = document.getElementById('slider-val');
    if (sliderVal) sliderVal.innerText = val + '°C';
    renderApp();
}

function resetOverrides() {
    systemState.isOverride = false;
    systemState.overrideSeason = null;
    systemState.overrideTime = null;
    systemState.overrideTemp = null;
    const tempSlider = document.getElementById('temp-slider');
    const sliderVal = document.getElementById('slider-val');
    
    if (tempSlider) tempSlider.value = 18.8;
    if (sliderVal) sliderVal.innerText = 'Standard';
    
    updateLiveTimeAndSeason();
    fetchWeatherData();
    fetchWaterTemperature();
}
