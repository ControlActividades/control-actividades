"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edificiosControllers = void 0;
const database_1 = __importDefault(require("../database"));
class EdificiosControllers {
    index(req, resp) {
        database_1.default.query('describe edificio');
        resp.json('edificio');
    }
    create(req, resp) {
        resp.json({ text: 'Creando un edificio' });
    }
}
exports.edificiosControllers = new EdificiosControllers();
