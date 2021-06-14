import * as dotenv from 'dotenv';
import { log } from './utils/log';
const Discord = require(`discord.js`);
const mongoose = require(`mongoose`);

const client = new Discord.Client({
    disableEveryone: true,
    ws: {
        intents: [`GUILDS`, `GUILD_MESSAGES`]
    },
    partials: [`MESSAGE`, `REACTION`]
});

dotenv.config();

client.config = require(`./config/config.js`);
client.loader = require(`./modules/Loader`);
client.msgCooldowns = [];
client.total = 0;

const URI = process.env.URI;
const URIParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const initDatabase = () => {
    mongoose.connect(URI, URIParams, err => {
        if (err) log(`error`, err, client);
        else client.logger.log(`Successfully connected to database.`, `ready`);
    });
};

const init = async () => {
    const {
        registerModules,
        registerEvents,
        checkDiscordStatus
    } = client.loader;

    console.clear();
    await registerModules(client);
    await registerEvents(client);
    await checkDiscordStatus(client);
    await client.login(process.env.TOKEN);

    return initDatabase();
};

init();
