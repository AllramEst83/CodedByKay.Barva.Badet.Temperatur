// Alla badplatser i Eskilstuna kommun (Källa: Eskilstuna Öppna Data)
// Koordinater (lat/lon) från OpenStreetMap / Nominatim
export const BATH_PLACES = [
    { name: 'Barva badplats',                     uuid: '5173C073-5277-4428-A11F-B7043B286C57', lat: 59.3811, lon: 16.7945 },
    { name: 'Borsökna badplats',                  uuid: '0CD5FE80-8C37-46CA-B509-20838EA11DF0', lat: 59.3415, lon: 16.4326 },
    { name: 'Borsökna lilla badplats',            uuid: '6914F306-8D8D-4268-A6B1-F48ECAF5C37D', lat: 59.3363, lon: 16.4290 },
    { name: 'Borsökna Vipvägen badplats',         uuid: '3884D7BA-276D-4286-8D03-E353B6E9F251', lat: 59.3386, lon: 16.4249 },
    { name: 'Bårsten badplats',                   uuid: '28FE4BE2-42EE-4F39-8EB6-85D669FC6A53', lat: 59.2516, lon: 16.5586 },
    { name: 'Eklången badplats',                  uuid: '5DB447B3-2BCB-4218-9749-C0DC1CBA2D1A', lat: 59.2380, lon: 16.7618 },
    { name: 'Gillberganäs badplats',              uuid: '62A70DDB-A571-49BB-A21B-51158A838817', lat: 59.2949, lon: 16.3907 },
    { name: 'Hållsta badplats',                   uuid: '2600F44E-E112-4484-971F-1C49A8AD9824', lat: 59.2911, lon: 16.4612 },
    { name: 'Mora badplats',                      uuid: '18BD8DF3-02CD-4523-A58D-2B558D0ECCEE', lat: 59.4503, lon: 16.6386 },
    { name: 'Mälarbaden badplats',                uuid: '51FCF7A4-8312-4E2C-AE38-C0AFEC76E91D', lat: 59.4506, lon: 16.4335 },
    { name: 'Näshulta camping badplats',          uuid: '94375063-DC3C-4684-B4E9-1E72C5353D43', lat: 59.2322, lon: 16.3698 },
    { name: 'Näshulta fritidsby badplats',        uuid: '30210E37-9821-4ADC-8BA7-7D0DEE2D6571', lat: 59.2371, lon: 16.3899 },
    { name: 'Näshulta kyrkbad badplats',          uuid: '30210E37-9821-4ADC-8BA7-7D0DEE2D6571', lat: 59.2263, lon: 16.3469 },
    { name: 'Pottskär badplats',                  uuid: '7768E339-6911-4CCE-BFCF-07A75069603E', lat: 59.4515, lon: 16.3095 },
    { name: 'Sandviken badplats',                 uuid: '1FDEAC33-FC34-4484-B3C5-3F542F613FFA', lat: 59.4659, lon: 16.6866 },
    { name: 'Skjulsta badplats',                  uuid: '9F44C5BE-C156-46A0-BF38-F43B59A511EC', lat: 59.3397, lon: 16.4913 },
    { name: 'Skogstorp Engelska parken badplats', uuid: '051ADB66-9EC5-4F4C-83A1-870BD541EE1A', lat: 59.3195, lon: 16.4886 },
    { name: 'Skogstorp Sommarhemmet badplats',    uuid: '0B173AE7-8B16-41DA-85E4-E09D16F6298A', lat: 59.3165, lon: 16.4867 },
    { name: 'Sundbyholm badplats',                uuid: '27FB2072-31F9-427D-9905-C22306DF47B5', lat: 59.4487, lon: 16.6237 },
    { name: 'Slätviken badplats',                 uuid: 'C08B7AE4-9F5E-40CA-9F48-886784A812BD', lat: 59.4446, lon: 16.5302 },
    { name: 'Viboö badplats',                     uuid: '1F4496BB-762A-4477-9509-F1A799B3F6C1', lat: 59.2759, lon: 16.0161 },
    { name: 'Vilsta badplats',                    uuid: '110A650E-DBCC-483F-83DA-B6BF9BDB8241', lat: 59.3503, lon: 16.5050 },
    { name: 'Ängsholmen badplats',                uuid: '04556C28-7A5C-4953-81F5-62DD6C86039F', lat: 59.4551, lon: 16.4712 },
    { name: 'Ärla badplats',                      uuid: '6521DA49-A826-41FC-9AC0-7FF7CF0271B3', lat: 59.2769, lon: 16.6951 },
];

const DEFAULT_BATH = BATH_PLACES[0];

// Tillståndsvariabler och systemkonfiguration
export const systemState = {
    waterTemp: null,
    airTemp: null,
    windSpeed: null,
    season: null,
    timeOfDay: null,
    isOverride: false,
    isOffline: false,
    overrideSeason: null,
    overrideTime: null,
    overrideTemp: null,
    selectedBathUuid: DEFAULT_BATH.uuid,
    selectedBathName: DEFAULT_BATH.name,
    selectedBathLat: DEFAULT_BATH.lat,
    selectedBathLon: DEFAULT_BATH.lon,
    waterDepth: null,
    waterTime: null,
};

// Inställningar för Säsonger och Teman
export const themes = {
    spring: {
        name: 'Vår 🌱',
        bg: {
            morning: 'linear-gradient(to bottom, #74ebd5, #acb6e5)',
            day: 'linear-gradient(to bottom, #9dE7a8, #56ab2f)',
            evening: 'linear-gradient(to bottom, #e1eec3, #f05053)',
            night: 'linear-gradient(to bottom, #0B3C5D, #1D2731)'
        },
        particles: ['🌱', '🌸', '✨']
    },
    summer: {
        name: 'Sommar ☀️',
        bg: {
            morning: 'linear-gradient(to bottom, #ff9966, #ff5e62)',
            day: 'linear-gradient(to bottom, #2980b9, #2c3e50)',
            evening: 'linear-gradient(to bottom, #f12711, #f5af19)',
            night: 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)'
        },
        particles: ['☀️', '✨', '💧']
    },
    autumn: {
        name: 'Höst 🍁',
        bg: {
            morning: 'linear-gradient(to bottom, #E65C00, #F9D423)',
            day: 'linear-gradient(to bottom, #b91c1c, #f97316)',
            evening: 'linear-gradient(to bottom, #31112c, #7d0633)',
            night: 'linear-gradient(to bottom, #111827, #1f2937)'
        },
        particles: ['🍁', '🍂', '💨']
    },
    winter: {
        name: 'Vinter ❄️',
        bg: {
            morning: 'linear-gradient(to bottom, #859398, #283048)',
            day: 'linear-gradient(to bottom, #EAEF9F, #11998e)',
            evening: 'linear-gradient(to bottom, #141E30, #243B55)',
            night: 'linear-gradient(to bottom, #020024, #090979, #00d4ff)'
        },
        particles: ['❄️', '⛄', '✨']
    }
};

// Bestäm automatisk säsong baserat på kalendermånad
export function getAutoSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring'; 
    if (month >= 5 && month <= 7) return 'summer'; 
    if (month >= 8 && month <= 10) return 'autumn'; 
    return 'winter'; 
}

// Bestäm automatisk tid på dygnet baserat på klockslag
export function getAutoTimeOfDay() {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 9) return 'morning';
    if (hours >= 9 && hours < 18) return 'day';
    if (hours >= 18 && hours < 22) return 'evening';
    return 'night';
}
