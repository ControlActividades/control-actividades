"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservasControllers_1 = require("../controllers/reservasControllers");
class ReservasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', reservasControllers_1.reservasControllers.index);
        this.router.get('/:idReserva', reservasControllers_1.reservasControllers.getReserva);
        this.router.post('/', reservasControllers_1.reservasControllers.create);
        this.router.delete('/:idReserva', reservasControllers_1.reservasControllers.delete);
        this.router.put('/:idReserva', reservasControllers_1.reservasControllers.updateReserva);
        this.router.get('/imprimir/:idReserva', reservasControllers_1.reservasControllers.getReservaImprimir);
    }
}
const reservasRoutes = new ReservasRoutes();
exports.default = reservasRoutes.router;
