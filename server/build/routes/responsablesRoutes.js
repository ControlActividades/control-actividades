"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const responsablesControllers_1 = require("../controllers/responsablesControllers");
class ResponsablesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', responsablesControllers_1.responsablesControllers.index);
        this.router.post('/', responsablesControllers_1.responsablesControllers.create);
        this.router.delete('/:idResp', responsablesControllers_1.responsablesControllers.delete);
        this.router.put('/:idResp', responsablesControllers_1.responsablesControllers.updateResponsable);
        this.router.get('/:idResp', responsablesControllers_1.responsablesControllers.getResponsable);
        this.router.get('/id/:nombUsuario', responsablesControllers_1.responsablesControllers.getIdByUsername);
        this.router.post('/validate', responsablesControllers_1.responsablesControllers.validateUser);
        this.router.post('/buscar', responsablesControllers_1.responsablesControllers.buscarResponsable); // Nueva ruta para buscar responsable
        this.router.put('/contrasenia/:idResp', responsablesControllers_1.responsablesControllers.updateContrasenia); // Nueva ruta para actualizar contraseña
    }
}
const responsableRoutes = new ResponsablesRoutes();
exports.default = responsableRoutes.router;
