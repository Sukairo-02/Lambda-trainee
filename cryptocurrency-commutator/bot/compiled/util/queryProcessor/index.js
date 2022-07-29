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
const config_1 = __importDefault(require("config"));
const apiUrl = config_1.default.get('api.URL');
const respond = (token, chatID, text, markup) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield axios_1.default.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatID,
            parse_mode: 'HTML',
            text,
            reply_markup: JSON.stringify(markup)
        });
    }
    catch (e) {
        console.log(e);
    }
});
const invalidCurrencyResponse = (token, chatID, symbolList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!symbolList || !symbolList.length) {
            console.log(symbolList);
            throw new Error(`Api error: request rejected, but no invalid symbols specified.`);
        }
        const resMsg = `Invalid currency(-ies): ${symbolList.join(', ')}.\nRefer to /listrecent to get list of supported currencies.`;
        yield respond(token, chatID, resMsg);
    }
    catch (e) {
        console.log(e);
    }
});
const getAvgFromApis = (source) => {
    const isPrice = new RegExp(/Price$/);
    return source.reduce((p, e) => {
        let accum = 0;
        let amt = 0;
        for (const [key, value] of Object.entries(e)) {
            if (isPrice.test(key) && !isNaN(Number(value))) {
                amt++;
                accum += Number(value);
            }
        }
        p.push({ symbol: e.symbol, price: accum / amt });
        return p;
    }, []);
};
const listToBoard = (list) => {
    return {
        inline_keyboard: list.reduce((p, e) => {
            p.push([
                {
                    text: e,
                    callback_data: `/${e}`
                },
                {
                    text: '❌',
                    callback_data: `/deletefavorite ${e}`
                }
            ]);
            return p;
        }, [])
    };
};
module.exports = (token, query, userID, chatID, messageID, isQuery) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        if (!query[0] || query[0][0] !== '/') {
            return;
        } //ignore non-command messages
        switch (query[0]) {
            case '/start':
                return yield respond(token, chatID, 'Welcome to the world of crypto! Send /help to see your options...');
            case '/help': {
                return yield respond(token, chatID, "Here's what you can do:\n/listrecent - Latest data of supported currencies\n/{*currency_name} - Get detailed info about crypto of your choice ex: <code>/BTC</code>\n/addfavorite {*currency_name} - Add crypto to favorites\n/deletefavorite {*currency_name} - Delete crypto from favorites\n/listfavorite - Look at your favorites\n\n<i>* - supports comma-separated list\nex: <code>/addfavorite BTC,ETH,ETC</code></i>");
            }
            case '/listrecent': {
                try {
                    const recent = (yield axios_1.default.get(`${apiUrl}/api/period`)).data.result;
                    if (!recent) {
                        throw new Error('Api error: empty response');
                    }
                    const packed = getAvgFromApis(recent);
                    const resMsg = packed.reduce((p, e) => {
                        return p + `\n/${e.symbol} - <code>$${e.price}</code>`;
                    }, 'Here are latest stored values of supported currencies:');
                    return yield respond(token, chatID, resMsg);
                }
                catch (e) {
                    console.log(e);
                    return yield respond(token, chatID, 'Data api error. Try again later...');
                }
            }
            case '/addfavorite': {
                if (!query[1]) {
                    return yield respond(token, chatID, 'You must specify currency!');
                }
                const response = yield axios_1.default.post(`${apiUrl}/bot/favorites`, {
                    user: String(userID),
                    symbols: query[1]
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                let resMsg = `Succesfully added currency(-ies) to favorites!${((_b = (_a = response.data.symbols) === null || _a === void 0 ? void 0 : _a.dismissed) === null || _b === void 0 ? void 0 : _b.length)
                    ? `\nInvalid currency(-ies) skipped: ${response.data.symbols.dismissed.join(', ')}`
                    : ''}`;
                return yield respond(token, chatID, resMsg);
            }
            case '/deletefavorite': {
                if (!query[1]) {
                    return yield respond(token, chatID, 'You must specify currency!');
                }
                const response = yield axios_1.default.delete(`${apiUrl}/bot/favorites`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        user: String(userID),
                        symbols: query[1]
                    }
                });
                if (isQuery) {
                    if ((_c = response.data.favorites) === null || _c === void 0 ? void 0 : _c.length) {
                        return yield axios_1.default.post(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                            chat_id: chatID,
                            message_id: messageID,
                            reply_markup: JSON.stringify(listToBoard(response.data.favorites.split(',')))
                        });
                    }
                    else {
                        return yield axios_1.default.post(`https://api.telegram.org/bot${token}/deleteMessage`, {
                            chat_id: chatID,
                            message_id: messageID
                        });
                    }
                }
                else {
                    let resMsg = `Succesfully deleted currency(-ies) from favorites!${((_e = (_d = response.data.symbols) === null || _d === void 0 ? void 0 : _d.dismissed) === null || _e === void 0 ? void 0 : _e.length)
                        ? `\nInvalid currency(-ies) skipped: ${response.data.symbols.dismissed.join(', ')}`
                        : ''}`;
                    return yield respond(token, chatID, resMsg);
                }
            }
            case '/listfavorite': {
                const favorites = yield ((_f = (yield axios_1.default.get(`${apiUrl}/bot/favorites?user=${userID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })).data.favorites) === null || _f === void 0 ? void 0 : _f.split(','));
                if (!favorites || !favorites.length) {
                    return yield respond(token, chatID, `Your favorites are currently empty`);
                }
                const keyboard = listToBoard(favorites);
                return yield respond(token, chatID, `Here's the list of your favorites:`, keyboard);
            }
            default: {
                const symbols = query[0].substring(1).split(',');
                const nowJSON = new Date().toJSON();
                const JSONDates = [
                    new Date(Date.now() - 1800000).toJSON(),
                    new Date(Date.now() - 3600000).toJSON(),
                    new Date(Date.now() - 10800000).toJSON(),
                    new Date(Date.now() - 21600000).toJSON(),
                    new Date(Date.now() - 43200000).toJSON(),
                    new Date(Date.now() - 86400000).toJSON()
                ];
                const timeStrings = ['30m', '1h', '3h', '6h', '12h', '24h'];
                for (let i = 0; i < symbols.length; ++i) {
                    const symbol = symbols[i];
                    try {
                        const apiResponse = [
                            axios_1.default.get(`${apiUrl}/api/period?symbols=${symbol}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[0]}&periodEnd=${nowJSON}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[1]}&periodEnd=${nowJSON}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[2]}&periodEnd=${nowJSON}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[3]}&periodEnd=${nowJSON}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[4]}&periodEnd=${nowJSON}`),
                            axios_1.default.get(`${apiUrl}/api/average?symbols=${symbol}&periodBegin=${JSONDates[5]}&periodEnd=${nowJSON}`)
                        ];
                        const awaited = []; //Aware of incorrect type usage, can't init empty array with [AxiosResponse<apiPeriod> | AxiosResponse<apiAverage>]
                        for (const e of apiResponse) {
                            try {
                                awaited.push(yield e);
                            }
                            catch (er) {
                                console.log(er);
                            }
                        }
                        if (!awaited.every((e) => { var _a; return (_a = e.data.result) === null || _a === void 0 ? void 0 : _a.length; })) {
                            yield respond(token, chatID, `/${symbol}: no data yet, try again later...`);
                        }
                        const warning = awaited.some((e) => e.data.warning);
                        const mapped = awaited.map((e) => getAvgFromApis(e.data.result));
                        const resMsg = `${mapped.reduce((p, e, i) => {
                            return p + `\n\t/${timeStrings[i]} - <code>$${e[0].price}</code>`;
                        }, `/${symbol} - <code>${mapped.shift()[0].price}$</code>\nAverage values:`)}${warning ? `\nWarning: missing some data during 24h period, values may be incorrect.` : ''}`;
                        yield respond(token, chatID, resMsg);
                    }
                    catch (e) {
                        if (((_g = e === null || e === void 0 ? void 0 : e.response) === null || _g === void 0 ? void 0 : _g.status) !== 403) {
                            console.log(e);
                            yield respond(token, chatID, `${symbol}: internal server error. Try again later...`);
                        }
                        const dismissedList = (_j = (_h = e === null || e === void 0 ? void 0 : e.response) === null || _h === void 0 ? void 0 : _h.data.symbols) === null || _j === void 0 ? void 0 : _j.dismissed;
                        yield invalidCurrencyResponse(token, chatID, dismissedList);
                    }
                    return;
                }
            }
        }
    }
    catch (e) {
        if (((_k = e === null || e === void 0 ? void 0 : e.response) === null || _k === void 0 ? void 0 : _k.status) !== 403) {
            console.log(e);
            return yield respond(token, chatID, 'Internal server error. Try again later...');
        }
        const dismissedList = (_m = (_l = e === null || e === void 0 ? void 0 : e.response) === null || _l === void 0 ? void 0 : _l.data.symbols) === null || _m === void 0 ? void 0 : _m.dismissed;
        return yield invalidCurrencyResponse(token, chatID, dismissedList);
    }
});
