export async function handler(event, context) {
    const url = "https://eskilstuna.entryscape.net/store/1/resource/121";
    
    // Accept ?uuid= query param; default to Barva Badplats
    const BARVA_UUID = '5173C073-5277-4428-A11F-B7043B286C57';
    const TARGET_UUID = (event.queryStringParameters?.uuid || BARVA_UUID).toUpperCase();

    try {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: 'Failed to fetch water temp data' })
            };
        }

        const dataArray = await response.json();

        const filteredData = dataArray.filter(
            d => d.uuid && d.uuid.toUpperCase().includes(TARGET_UUID)
        );

        if (filteredData.length > 0) {
            const latestEntry = filteredData[filteredData.length - 1];
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    temp: parseFloat(latestEntry.temp),
                    time: latestEntry.tid,
                    depth: parseInt(latestEntry.djup, 10),
                    offline: false
                })
            };
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    offline: true
                })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
}
