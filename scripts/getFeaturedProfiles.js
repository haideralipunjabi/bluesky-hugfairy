const { Agent, CredentialSession } = require('@atproto/api');
const fs = require("fs");
const session = new CredentialSession(new URL("https://bsky.social"));
const agent = new Agent(session)

async function getProfile(handle) {
    const profileData = (await agent.getProfile({
        "actor": handle
    })).data
    return {
        name: profileData.displayName,
        handle: profileData.handle,
        avatar: profileData.avatar,
        description: profileData.description
    }
}
session.login({
    identifier: process.env.IDENTIFIER,
    password: process.env.PASSWORD,
}).then(() => {
    fs.readFile("data/subscribers.json", "utf-8", async (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            const subscriberData = [];
            const subscribers = JSON.parse(data);
            console.log(subscribers)
            for (const subscriber of subscribers) {
                subscriberData.push(
                    await getProfile(subscriber)
                )
            }
            const json = JSON.stringify(subscriberData);
            fs.writeFile('data/subscriberData.json', json, () => { });
        }
    })
});