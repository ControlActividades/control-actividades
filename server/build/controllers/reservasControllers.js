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
exports.reservasControllers = void 0;
const database_1 = __importDefault(require("../database"));
class ReservasControllers {
    index(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservas = yield database_1.default.query('SELECT * FROM reservas');
            resp.json(reservas);
        });
    }
    getReserva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idReserva } = req.params;
            try {
                const result = yield database_1.default.query('SELECT * FROM reservas WHERE idReserva = ?', [idReserva]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Reserva no encontrada' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener la reserva', error });
            }
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO reservas set ?', [req.body]);
            resp.json({ message: 'Reserva guardada' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idReserva } = req.params;
            yield database_1.default.query('DELETE FROM reservas WHERE idReserva = ?', [idReserva]);
            resp.json({ message: 'Reserva eliminada' });
        });
    }
    updateReserva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idReserva } = req.params;
            const updateData = req.body;
            try {
                const result = yield database_1.default.query('UPDATE reservas SET ? WHERE idReserva = ?', [updateData, idReserva]);
                if (result.affectedRows > 0) {
                    res.json({ message: 'Reserva actualizada' });
                }
                else {
                    res.status(404).json({ message: 'Reserva no encontrada para actualizar' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al actualizar la reserva', error });
            }
        });
    }
    //oficios de reservas
    getReservaImprimir(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idReserva } = req.params;
            try {
                const result = yield database_1.default.query(`SELECT res.horaInicio, res.horaFin, res.areaUsar, res.fecha, res.razon, resp.idResp,CONCAT(resp.appPaterno, ' ', resp.appMaterno,' ',resp.nombres) AS nombCompleto, resp.telefono, resp.correoElec, resp.numControl, resp.grupo FROM reservas AS res INNER JOIN responsable AS resp ON res.idResp = resp.idResp WHERE idReserva = ?`, [idReserva]);
                if (result.length > 0) {
                    res.json(result[0]);
                }
                else {
                    res.status(404).json({ message: 'Reserva a imprimir no encontrada' });
                }
            }
            catch (error) {
                res.status(500).json({ message: 'Error al obtener la reserva para imprimir', error });
            }
        });
    }
    //reserva disponible
    checkReserva(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { horaInicio, horaFin, fecha } = req.body;
            try {
                const result = yield database_1.default.query(`SELECT * FROM reservas WHERE fecha = ? 
            AND ((horaInicio < ? AND horaFin > ?) 
            OR (horaInicio < ? AND horaFin > ?)
            OR (horaInicio >= ? AND horaFin <= ?))`, [fecha, horaFin, horaInicio, horaInicio, horaFin, horaInicio, horaFin]);
                let hasAcceptedReserva = false;
                let hasNonAcceptedReserva = false;
                for (const reserva of result) {
                    if (reserva.estado === 'Aceptado') {
                        hasAcceptedReserva = true;
                        break;
                    }
                    else if (reserva.estado !== 'Aceptado') {
                        hasNonAcceptedReserva = true;
                    }
                }
                res.status(hasAcceptedReserva ? 409 : 200).json({
                    hasAcceptedReserva,
                    hasNonAcceptedReserva
                });
            }
            catch (error) {
                res.status(500).json({ message: 'Error al verificar la reserva', error });
            }
        });
    }
}
exports.reservasControllers = new ReservasControllers();
