"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const queryProcessor_1 = __importDefault(require("@util/queryProcessor"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
let localToken;
const botProc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const msg = req.body;
        if (!msg || !msg.update_id) {
            return res.sendStatus(200);
        }
        let chatID;
        let userID;
        let messageID;
        let rawQuery;
        let isQuery = false;
        if (msg.message) {
            chatID = msg.message.chat.id;
            userID = (_a = msg.message.from) === null || _a === void 0 ? void 0 : _a.id;
            messageID = msg.message.message_id;
            rawQuery = msg.message.text;
        }
        else if (msg.callback_query) {
            chatID = msg.callback_query.from.id;
            userID = msg.callback_query.from.id;
            messageID = (_b = msg.callback_query.message) === null || _b === void 0 ? void 0 : _b.message_id;
            rawQuery = msg.callback_query.data;
            isQuery = true;
        }
        else {
            return res.sendStatus(200);
        }
        const query = rawQuery === null || rawQuery === void 0 ? void 0 : rawQuery.split(' ');
        if (!query) {
            return res.sendStatus(200);
        }
        if (typeof userID !== 'number' || typeof chatID !== 'number' || typeof messageID !== 'number') {
            return res.sendStatus(200);
        }
        yield (0, queryProcessor_1.default)(localToken, query, userID, chatID, messageID, isQuery);
        return res.sendStatus(200);
    }
    catch (e) {
        console.log(e, req);
        return res.sendStatus(200);
    }
});
module.exports = (botToken, port, url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!botToken || !port || !url) {
            throw new Error('Bot error: missing data');
        }
        localToken = botToken;
        app.listen(port, () => {
            console.log(`Bot: listening to port ${port}`);
        });
        app.post(`/bot${botToken}`, botProc);
        yield axios_1.default.post(`https://api.telegram.org/bot${botToken}/setWebhook`, { url: `${url}/bot${botToken}` });
        console.log(`Bot: webhook set to url: ${url}/bot${botToken}`);
    }
    catch (e) {
        console.log(e);
    }
});
