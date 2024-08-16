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
exports.rolesControllers = void 0;
const database_1 = __importDefault(require("../database"));
class RolesControllers {
    index(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield database_1.default.query('SELECT * FROM rol');
            resp.json(roles);
        });
    }
    getRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRoles } = req.params;
            try {
                const result = yield database_1.default.query('SELECT * FROM rol WHERE idRoles = ?', [idRoles]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Rol no encontrado' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener el rol', error });
            }
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            try {
                yield database_1.default.query('INSERT INTO rol set ?', [req.body]);
                resp.json({ message: 'Rol guardado' });
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
            const { idRoles } = req.params;
            yield database_1.default.query('DELETE FROM rol WHERE idRoles = ?', [idRoles]);
            resp.json({ message: 'Rol eliminado' });
        });
    }
    updateRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idRoles } = req.params;
            const updateData = req.body;
            try {
                const result = yield database_1.default.query('UPDATE rol SET ? WHERE idRoles = ?', [updateData, idRoles]);
                if (result.affectedRows > 0) {
                    res.json({ message: 'Rol actualizado' });
                }
                else {
                    res.status(404).json({ message: 'Rol no encontrado para actualizar' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar el rol', error });
            }
        });
    }
}
exports.rolesControllers = new RolesControllers();
