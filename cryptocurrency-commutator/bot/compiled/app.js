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
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const config_1 = __importDefault(require("config"));
const tgBot_1 = __importDefault(require("@util/tgBot"));
const PORT = Number(process.env.PORT) || config_1.default.get('server.PORT') || 3000;
const url = config_1.default.get('server.URL');
const botToken = config_1.default.get('tg.bot');
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, tgBot_1.default)(botToken, PORT, url);
    }
    catch (e) {
        console.log(e);
    }
});
start();
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason, '\n', promise);
});
process.on('uncaughtException', (e, o) => {
    console.log('UNCAUGHT:', e, '\n', o);
});
//TO-DO
//Get rid of old code - DONE
//Copy tgbot lib's types - DONE
//Reconfigure tsconfig for "@" imports - DONE
//Connect to api
//Implement + Connect db on server side
