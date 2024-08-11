const axios = require('axios');
const cheerio = require('cheerio');


async function fetchFeralPlayers() {

    const url = `https://xunamate.gg/leaderboard/3v3?region=us&specs=druid%3Aferal-combat`;

    try {
        const {data } = await axios.get(url);
        const $ = cheerio.load(data);
    
        const players = [];
    
        // figure out selector for player elements
        $('selector-for-player-elements').each((ind, ele) => {
            const rating = $(ele).find('Rating').text().trim();
            const name = $(ele).find('Name').text().trim();
            const realm = $(ele).find("Realm").text().trim();
    
            if(parseInt(rating) > 2500) {
                players.push({name, rating, realm})
    
            }
        });
        console.log("Players return: ", players)
    } catch(error) {
        console.log("Error fetching ferals over 2500 CR on xunamate ", error)
    }
}


async function fetchSingleFeral(name, realm) {

    const url = `https://xunamate.gg/character/us/${realm}/${name}?region=us`;


    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
    
        let resilience;
        $('selector-for-player-elements').each((ind, ele) => {
            resilience = $(ele).find('Resilience').text().trim();
        });
        console.log(`${name} has a total of ${resilience}`);
        return { name, resilience };
    } catch(error) {
        console.log(`Error feral ${name} on realm ${realm}`)
    }

}


async function fetchAndProcessFerals() {
    const players = await fetchFeralPlayers();
    const playerResilienceList = [];

    // Process each player
    for (const player of players) {
        const result = await fetchSingleFeral(player.name, player.realm);
        playerResilienceList.push(result);
    }

    console.log("Final list of players with resilience: ", playerResilienceList);
    return playerResilienceList;
}