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
exports.edificiosControllers = void 0;
const database_1 = __importDefault(require("../database"));
class EdificiosControllers {
    index(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const edificios = yield database_1.default.query('SELECT * FROM edificio');
            resp.json(edificios);
        });
    }
    getEdificio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEdificio } = req.params;
            try {
                const result = yield database_1.default.query('SELECT * FROM edificio WHERE idEdificio = ?', [idEdificio]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Edificio no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el edificio', error });
            }
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                yield database_1.default.query('INSERT INTO edificio set ?', [req.body]);
                resp.json({ message: 'Edificio guardado' });
            }
            catch (error) {
                if (error.code === 'ER_SIGNAL_EXCEPTION' && typeof error.sqlMessage === 'string') {
                    const messages = error.sqlMessage.split('. ');
                    resp.status(400).json({ message: messages.filter((msg) => msg !== '').join('. ') });
                }
                else {
                    resp.status(500).json({ message: 'Error al guardar el edificio', error });
                }
            }
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEdificio } = req.params;
            yield database_1.default.query('DELETE FROM edificio WHERE idEdificio = ?', [idEdificio]);
            resp.json({ message: 'Edificio eliminado' });
        });
    }
    updateEdificio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idEdificio } = req.params;
            const updateData = req.body;
            try {
                const result = yield database_1.default.query('UPDATE edificio SET ? WHERE idEdificio = ?', [updateData, idEdificio]);
                if (result.affectedRows > 0) {
                    res.json({ message: 'Edificio actualizado' });
                }
                else {
                    res.status(404).json({ message: 'Edificio no encontrado para actualizar' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar el edificio', error });
            }
        });
    }
}
exports.edificiosControllers = new EdificiosControllers();
