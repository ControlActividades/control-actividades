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
    }
}
const responsableRoutes = new ResponsablesRoutes();
exports.default = responsableRoutes.router;
