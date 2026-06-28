const axios = require("axios");

const mahmud = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "anicdp",
                aliases: ["animecdp"],
                version: "1.7",
                author: "MahMUD",
                countDown: 10,
                role: 0,
                description: {
                        bn: "র‍্যান্ডম এনিমে কাপল প্রোফাইল পিকচার পান",
                },
                category: "media",
                guide: {
                        bn: '   {pn}: র‍্যান্ডম এনিমে সিডিপি পেতে ব্যবহার করুন',
                        
                }
        },

        langs: {
                bn: {
                        wait: "⌛ | বেবি, তোমার জন্য এনিমে সিডিপি খুঁজছি...!!",
                        noResult: "× কোনো ছবি খুঁজে পাওয়া যায়নি!",
                        success: "🎀 | 𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐫𝐚𝐧𝐝𝐨𝐦 𝐚𝐧𝐢𝐦𝐞 𝐜𝐝𝐩 𝐛𝐚𝐛𝐲",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
              
        },

        onStart: async function ({ api, event, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        api.setMessageReaction("⌛", event.messageID, () => {}, true);

                        const apiBase = await mahmud();
                        const baseUrl = `${apiBase}/api/cdpvip2`;

                        const res = await axios.get(`${baseUrl}?category=anime`);
                        const groupImages = res.data?.group || [];

                        if (!groupImages.length) {
                                api.setMessageReaction("🥹", event.messageID, () => {}, true);
                                return message.reply(getLang("noResult"));
                        }

                        const streamAttachments = [];
                        for (const url of groupImages) {
                                try {
                                        const imgRes = await axios({
                                                url,
                                                method: "GET",
                                                responseType: "stream",
                                                headers: { "User-Agent": "Mozilla/5.0" }
                                        });
                                        streamAttachments.push(imgRes.data);
                                } catch (e) {
                                        console.warn(`Failed to load image: ${url}`);
                                }
                        }

                        if (!streamAttachments.length) throw new Error("All images failed to stream.");

                        api.setMessageReaction("✅", event.messageID, () => {}, true);
                        return message.reply({
                                body: getLang("success"),
                                attachment: streamAttachments
                        });

                } catch (err) {
                        console.error("AniCDP Error:", err);
                        api.setMessageReaction("❌", event.messageID, () => {}, true);
                        return message.reply(getLang("error", err.message));
                }
        }
};
