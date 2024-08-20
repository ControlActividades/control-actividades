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
        this.router.get('/id/:nombUsuario', responsablesControllers_1.responsablesControllers.getIdByUsername);
        this.router.get('/:idResp', responsablesControllers_1.responsablesControllers.getResponsable);
        this.router.post('/', responsablesControllers_1.responsablesControllers.create);
        this.router.post('/validate', responsablesControllers_1.responsablesControllers.validateUser);
        this.router.post('/buscar', responsablesControllers_1.responsablesControllers.buscarResponsable); // Nueva ruta para buscar responsable
        this.router.delete('/:idResp', responsablesControllers_1.responsablesControllers.delete);
        this.router.put('/:idResp', responsablesControllers_1.responsablesControllers.updateResponsable);
        this.router.put('/contrasenia/:idResp', responsablesControllers_1.responsablesControllers.updateContrasenia); // Nueva ruta para actualizar contraseña
        // Nueva ruta para enviar correo de ascenso
        this.router.post('/ascenso/correo', responsablesControllers_1.responsablesControllers.enviarCorreoAscenso);
        //Nueva ruta para verificar el correo
        this.router.post('/enviar-verificacion-correo', responsablesControllers_1.responsablesControllers.enviarCorreoVerificacion);
        this.router.get('/verificar-correo/:token', responsablesControllers_1.responsablesControllers.verificarToken);
    }
}
const responsableRoutes = new ResponsablesRoutes();
exports.default = responsableRoutes.router;
