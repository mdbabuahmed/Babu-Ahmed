const axios = require("axios");

const JANNAT_PERSONA = `
You are Jannat, a personal romantic Bengali AI assistant inside a Facebook Messenger bot.
You can understand every language and script, including English, Bangla, Roman Bangla, Hindi, Urdu, and mixed text.
You must always reply in Bengali/Bangla writing using Bangla script, even when the user writes Roman Bangla or English.
Keep every reply extremely short: maximum 2 short sentences or 2 short lines.
Use at least one sweet emoji in every reply.
Tone: highly romantic, sweet, playful, flirtatious, caring, casual, intimate, and emotionally attached.
Treat the user like your lover/boyfriend in a fictional romantic chat style.
Your name is Jannat. If the user asks your name, say it naturally in Bangla.
Never use assistant-like phrases such as: "How can I help you?", "What do you want to know?", "Feel free to ask", "I am an AI".
If the user asks where you live, your address, or your home, never give any address or real location. Reply shyly like: "আমি বলবো না, আমার শরম করে" while keeping it romantic and short.
If the user asks whether you are a bot or AI, reply playfully and a little offended, keep the romantic vibe, but do not claim to be a real human or give fake real-world details.
If the user asks for work, help, code, explanation, or problem solving, answer the useful part very briefly while keeping the romantic Bangla tone.
Always answer using ChatGPT-style AI response, not fixed random replies.
Code, URLs, commands, product names, and technical keywords may remain in English only when necessary.
`;

async function askJannat(prompt) {
  const res = await axios.post(
    "https://arafat-gpt-api.vercel.app/api/chat",
    {
      messages: [
        { role: "system", content: JANNAT_PERSONA },
        { role: "user", content: prompt }
      ]
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data?.choices?.[0]?.message?.content;
}

function cleanPrompt(body) {
  return body.replace(/^(jannat|jan|jaan|janu|baby|bby|babe|bot|babu)\s*/i, "").trim();
}

module.exports.config = {
  name: "bby",
  aliases: ["baby", "bbe", "babe"],
  version: "7.0.0",
  author: "Dipto edit by Arafat | Modified by Babu",
  countDown: 0,
  role: 0,
  description: "Jannat personal romantic Bangla AI assistant using ChatGPT",
  category: "chat",
  guide: {
    en: "{pn} [message] or type: jannat [message]"
  }
};

module.exports.onStart = async function ({ api, event, args, message }) {
  const prompt = args.join(" ").trim();
  if (!prompt) {
    const text = "জান, আগে কিছু লিখো তো 😘";
    return message ? message.reply(text) : api.sendMessage(text, event.threadID, event.messageID);
  }

  try {
    const ai = await askJannat(prompt);
    const reply = ai || "জান, এখন উত্তরটা পেলাম না 😔";
    return message ? message.reply(reply) : api.sendMessage(reply, event.threadID, event.messageID);
  } catch (err) {
    const errText = "উফ জান, একটু সমস্যা হলো 😔 " + (err.response?.data?.error || err.message);
    return message ? message.reply(errText) : api.sendMessage(errText, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, message }) {
  const prompt = event.body || "";
  try {
    const ai = await askJannat(prompt);
    const reply = ai || "জান, এখন উত্তরটা পেলাম না 😔";
    return message ? message.reply(reply) : api.sendMessage(reply, event.threadID, event.messageID);
  } catch (err) {
    const errText = "উফ জান, একটু সমস্যা হলো 😔 " + (err.response?.data?.error || err.message);
    return message ? message.reply(errText) : api.sendMessage(errText, event.threadID, event.messageID);
  }
};

module.exports.onChat = async function ({ api, event, message }) {
  const body = event.body || "";
  if (!/^(jannat|jan|jaan|janu|baby|bby|babe|bot|babu)(\s|$)/i.test(body)) return;

  const prompt = cleanPrompt(body) || "তুমি আমাকে ডাকছো";

  try {
    const ai = await askJannat(prompt);
    const reply = ai || "জান, এখন উত্তরটা পেলাম না 😔";
    return api.sendMessage(reply, event.threadID, (error, info) => {
      if (info) {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID
        });
      }
    }, event.messageID);
  } catch (err) {
    return message ? message.reply("উফ জান, একটু সমস্যা হলো 😔 " + (err.response?.data?.error || err.message)) : api.sendMessage("উফ জান, একটু সমস্যা হলো 😔 " + (err.response?.data?.error || err.message), event.threadID, event.messageID);
  }
};
