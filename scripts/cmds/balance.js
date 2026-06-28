module.exports = {
        config: {
                name: "balance",
                aliases: ["bal", "টাকা"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "আপনার বা ট্যাগ করা ইউজারের ব্যালেন্স দেখুন (Short Form)",
                        
                },
                category: "economy",
                guide: {
                        bn: '   {pn}: নিজের ব্যালেন্স দেখতে\n   {pn} @tag: কারো ব্যালেন্স দেখতে',
                      
                }
        },

        langs: {
                bn: {
                        money: "বেবি, তোমার কাছে মোট %1$ আছে।",
                        moneyOf: "%1 এর কাছে মোট %2$ আছে।"
                },
               
        },

        onStart: async function ({ message, usersData, event, getLang }) {
                const { mentions, senderID } = event;

                 const formatNumber = (num) => {
                        if (!num) return "0";
                        let n = typeof num !== "number" ? parseInt(num) || 0 : num;
                        const units = ["", "K", "M", "B", "T"];
                        let unit = 0;
                        while (n >= 1000 && ++unit < units.length) n /= 1000;
                        return n.toFixed(1).replace(/\.0$/, "") + units[unit];
                };

                if (Object.keys(mentions).length > 0) {
                        const uids = Object.keys(mentions);
                        let msg = "";
                        for (const uid of uids) {
                                const userMoney = await usersData.get(uid, "money");
                                const name = mentions[uid].replace("@", "");
                                msg += getLang("moneyOf", name, formatNumber(userMoney)) + '\n';
                        }
                        return message.reply(msg);
                } else {
                        const userMoney = await usersData.get(senderID, "money");
                        return message.reply(getLang("money", formatNumber(userMoney)));
                }
        }
};
