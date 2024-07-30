"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const edificiosControllers_1 = require("../controllers/edificiosControllers");
class EdificiosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', edificiosControllers_1.edificiosControllers.index);
        this.router.post('/', edificiosControllers_1.edificiosControllers.create);
        this.router.delete('/:idEdificio', edificiosControllers_1.edificiosControllers.delete);
        this.router.put('/:idEdificio', edificiosControllers_1.edificiosControllers.updateEdificio);
        this.router.get('/:idEdificio', edificiosControllers_1.edificiosControllers.getEdificio);
    }
}
const edificiosRoutes = new EdificiosRoutes();
exports.default = edificiosRoutes.router;
