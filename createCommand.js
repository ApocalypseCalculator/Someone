//standalone script for registering a command

const discord = require('discord.js');
const token = require('./data/token');
const client = new discord.Client();

if (process.argv[2] === '-s') {
    if (process.argv[3]) {
        client.login(token);
        client.on("ready", () => {
            client.api.applications(client.user.id).guilds(process.argv[3]).commands.post({
                data: {
                    name: `${process.argv[4]}`,
                    description: `${process.argv[5]}`
                }
            }).then(() => {
                console.log("Done");
                process.exit(0);
            })
        })
    }
    else {
        console.log('Please include guild id for server slash registration');
    }
}
else if (process.argv[2] === '-g') {
    client.login(token);
    client.on('ready', () => {
        client.api.applications(client.user.id).commands.post({
            data: {
                name: `${process.argv[3]}`,
                description: `${process.argv[4]}`
            }
        }).then(() => {
            console.log("Done");
            process.exit(0);
        })
    })
}
else {
    console.log('Please specify global or server using g or s as the first argument, if server, include the server id as second arg, then include name and description as next arguments');
}