const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "animeinfo",
                aliases: ["aniinfo"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "যেকোনো এনিমে সম্পর্কে বিস্তারিত তথ্য জানুন",
                        
                },
                category: "anime",
                guide: {
                        bn: '   {pn} <এনিমে নাম>: বিস্তারিত জানতে নাম লিখুন',
                       
                }
        },

        langs: {
                bn: {
                        noInput: "⚠️ বেবি, একটি এনিমে এর নাম তো দাও!",
                        notFound: "❌ দুঃখিত বেবি, এই এনিমে তথ্য খুঁজে পাওয়া যায়নি।",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
              
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                if (!args[0]) return message.reply(getLang("noInput"));

                try {
                        const baseUrl = await mahmud();
                        const animeName = args.join(" ");
                        const url = `${baseUrl}/api/animeinfo?animeName=${encodeURIComponent(animeName)}`;
                        
                        const res = await axios.get(url);
                        const { formatted_message, data } = res.data;

                        if (!res.data || !data) return message.reply(getLang("notFound"));

                        const attachment = await global.utils.getStreamFromURL(data.image_url);

                        return message.reply({
                                body: formatted_message,
                                attachment: attachment
                        });

                } catch (err) {
                        console.error("Anime Info Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
