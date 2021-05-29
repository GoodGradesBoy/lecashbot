interface Leaderboard {
    username: string;
    discordID: string;
}

interface Balance extends Leaderboard {
    balance: number;
}

interface Bet extends Leaderboard {
    bet: number;
}

interface Coinflip extends Leaderboard {
    coinflip: number;
}

interface Streak extends Leaderboard {
    streak: number;
}

export {
    Balance,
    Bet,
    Coinflip,
    Streak
};