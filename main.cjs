const fetch = require('node-fetch');

let tokens = [];
let channel_ids = [];

let msg = "javascript v3";

async function fetchMessage(token, channel_id, message) {
    let response = await
    fetch(`https://discord.com/api/v9/channels/${channel_id}/messages`, {
        "method": "POST",
        "headers": {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify({
            'content': message
        })
    });
    return response;
}

async function cycleChannel(channel_id) {
    while (true) {
        for (let token of tokens) {
            let response = await fetchMessage(token, channel_id, msg);

            if (response.status === 429) {
                let reset = response.headers.get('retry-after');
                let timeMs = parseFloat(reset) * 1000;
                await new Promise((resolve, reject) => setTimeout(resolve, timeMs))
            }
            console.log(response.status);
        }
    }
}


async function spam() {
    for (let channel_id of channel_ids) {
        cycleChannel(channel_id);
    }
}

spam();
