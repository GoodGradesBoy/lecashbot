import { User } from '../../models/user.model';
import { MessageEmbed } from 'discord.js';
import { colors, version } from '../../config/config';

export default async ({ author, channel }, client, args) => {
    const err = `This user does not have an account!`;
    const userId = args[0] ? args[0].replace(/<|@|!|>/g, ``) : author.id;
    const id = { discordId: userId };
    const user = await User.findOne(id);
    let result = (user && !user.dev) ? `${user.name} has been banned.` : err;

    client.logger.ready(`${user.name} has been banned. (Moderator: ${author.id})`);

    if (!user.dev && !user.admin) {
        User.update(id, { banned: true });
    } else result = `You can't ban a developer/admin!`;

    const banEmbed = new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(`Ban`, author.avatarURL())
        .setTimestamp(new Date())
        .setFooter(`LeCashBot v${version}`)
        .setDescription(result);

    return channel.send(banEmbed);
};
