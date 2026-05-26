export async function handler(event, context) {
    const DEFAULT_LAT = 59.3811;
    const DEFAULT_LON = 16.7945;

    const lat = parseFloat(event.queryStringParameters?.lat) || DEFAULT_LAT;
    const lon = parseFloat(event.queryStringParameters?.lon) || DEFAULT_LON;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch weather data' })
            };
        }
        
        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                airTemp: data.current.temperature_2m,
                windSpeed: data.current.wind_speed_10m
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
}
