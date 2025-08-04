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
const db_1 = __importDefault(require("../src/db"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.availableTriggers.create({
            data: {
                name: "Web Hook",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXGQWBgPLNmjfNp-yvEt92o40TQiuoe4Iojw&s"
            }
        });
        yield db_1.default.availableAction.create({
            data: {
                name: "Email",
                image: "https://media.istockphoto.com/id/2052093189/vector/blue-mail-icon-mail-button-vector.jpg?s=612x612&w=0&k=20&c=nUYbs8zEExhLHw2yYD7sX59KdFPoXMsTUyX5qbgeIVU=",
            }
        });
        yield db_1.default.availableAction.create({
            data: {
                name: "Solana",
                image: "https://cdn-icons-png.flaticon.com/512/6001/6001527.png"
            }
        });
    });
}
main();
