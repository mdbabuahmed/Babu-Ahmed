const axios = require("axios");

const baseApiUrl = async () => {
        const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
        return base.data.mahmud;
};

module.exports = {
        config: {
                name: "caption",
                aliases: ["cp", "ক্যাপশন"],
                version: "1.7",
                author: "MahMUD",
                countDown: 5,
                role: 0,
                description: {
                        bn: "বিভিন্ন ক্যাটাগরির ক্যাপশন পান অথবা নতুন ক্যাপশন যোগ করুন",
                        
                },
                category: "love",
                guide: {
                        bn: '   {pn} <category> <lang>: ক্যাপশন পান (Default: bn)'
                                + '\n   {pn} list: সব ক্যাটাগরি দেখুন'
                                + '\n   {pn} add <cat> <lang> <text>: নতুন ক্যাপশন যোগ করুন',
                        
                }
        },

        langs: {
                bn: {
                        noInput: "× বেবি, একটি ক্যাটাগরি দাও! উদাহরণ: {pn} love",
                        listTitle: ">🎀 সহজলভ্য ক্যাটাগরি সমূহ:\n\n",
                        addUsage: "⚠ সঠিক নিয়ম: {pn} add <category> <bn/en> <text>",
                        success: "✅| এই নাও তোমার %1 ক্যাপশন:\n\n%2",
                        error: "× সমস্যা হয়েছে: %1। প্রয়োজনে Contact MahMUD।"
                },
             
        },

        onStart: async function ({ api, event, args, message, getLang }) {
                const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
                if (this.config.author !== authorName) {
                        return api.sendMessage("You are not authorized to change the author name.", event.threadID, event.messageID);
                }

                try {
                        const baseUrl = await baseApiUrl();

                        if (args[0] === "list") {
                                const res = await axios.get(`${baseUrl}/api/caption/list`);
                                const categories = res.data.categories.map(cat => `• ${cat}`).join("\n");
                                return message.reply(getLang("listTitle") + categories);
                        }

                        if (args[0] === "add") {
                                if (args.length < 4) return message.reply(getLang("addUsage"));
                                const category = args[1];
                                const language = args[2];
                                const captionText = args.slice(3).join(" ");
                                
                                const res = await axios.post(`${baseUrl}/api/caption/add`, { 
                                        category, 
                                        language, 
                                        caption: captionText 
                                });
                                return message.reply(res.data.message);
                        }

                        if (!args[0]) return message.reply(getLang("noInput"));

                        const category = args[0];
                        const language = args[1] || "bn";

                        const res = await axios.get(`${baseUrl}/api/caption`, { 
                                params: { category, language } 
                        });

                        return message.reply(getLang("success", category, res.data.caption));

                } catch (err) {
                        console.error("Caption Error:", err);
                        return message.reply(getLang("error", err.message));
                }
        }
};
