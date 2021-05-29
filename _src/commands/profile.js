import { User } from '../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../config/config';
import { currency } from '../utils/format';

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const addBadgeEmote = badgeType => {
    switch (badgeType) {
        case `owner`: return `white_check_mark`;
        case `admin`: return `hammer`;
        case `developer`: return `man_technologist`;
        case `logo Creator`: return `art`;
        case `tester`: return `test_tube`;
        case `donor`: return `moneybag`;
    }
};

const addBadges = badges => {
    let badgeMsg = ``;
    Object.entries(badges).forEach(badge => {
        const badgeType = badge[0];
        const hasRole = badge[1];
        if (hasRole) {
            badgeMsg += `\n:${addBadgeEmote(badgeType)}: ${capitalize(badgeType)}`;
        }
    });
    return badgeMsg;
};

export default async (msg, client, args) => {
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, ``) : msg.author.id;

    const isNotId = (isNaN(parseInt(userId)));
    const userData = (isNotId) ? { name: args.join(` `).trim() } : { discordId: userId };
    const user = await User.findOne(userData);

    const profileEmbed = new MessageEmbed()
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`);

    if (user) {
        const {
            name, nitroTypeLink, balance,
            dailyStreak, highestBet, owner,
            admin, dev, tester, donor,
            logoCreator, donations,
            coinflipBestStreak
        } = user;

        const badges = {
            owner: owner,
            admin: admin,
            developer: dev,
            tester: tester,
            donor: donor,
            'logo Creator': logoCreator
        };

        const userAvatar = client.users.cache.get((isNotId) ? user.discordId : userId);
        const userBadges = addBadges(badges);
        if (userBadges) {
            profileEmbed.addField(`Contributions`, `${userBadges}`);
        }

        const coinflipChance = Math.round((100 / (2 ** coinflipBestStreak)) * 100) / 100;
        let coinflipEarnings = Math.round((100 * (3 ** (coinflipBestStreak - 2))) + ((coinflipBestStreak - 1) * 150));

        if (!coinflipBestStreak) {
            coinflipEarnings = 0;
        }

        profileEmbed
            .setColor(colors.green)
            .setAuthor(`${name}'s Profile`, userAvatar ? userAvatar.avatarURL() : msg.author.avatarURL())
            .setDescription(`[**${name}'s NitroType**](${nitroTypeLink})`)
            .addField(`Balance`, `$**${currency(balance)}**`, true)
            .addField(`\u200b`, `\u200b`, true)
            .addField(`Donations`, `$**${currency(donations || 0)}**`, true)
            .addField(`Daily Streak`, `**${dailyStreak}** day${dailyStreak === 1 ? `s` : ``}`)
            .addField(`Coinflip Record`, `**${coinflipBestStreak}** streak, $**${currency(coinflipEarnings)}**`, true)
            .addField(`\u200b`, `\u200b`, true)
            .addField(`Chance`, `**${coinflipChance}**%`, true)
            .addField(`Highest Bet`, `$**${currency(highestBet.amount)}**`, true)
            .addField(`\u200b`, `\u200b`, true)
            .addField(`Chance`, `**${Math.round(highestBet.chance * 100) / 100}**%`, true);
    } else {
        profileEmbed
            .setColor(colors.red)
            .setAuthor(`Unknown Profile`, msg.author.avatarURL)
            .setDescription(`This user does not have an account!`);
    }

    return msg.channel.send(profileEmbed);
};
