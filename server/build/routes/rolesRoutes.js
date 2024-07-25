"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rolesControllers_1 = require("../controllers/rolesControllers");
rolesControllers_1.rolesControllers;
class RolesRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', rolesControllers_1.rolesControllers.index);
        this.router.post('/', rolesControllers_1.rolesControllers.create);
        this.router.delete('/:idRoles', rolesControllers_1.rolesControllers.delete);
        this.router.put('/:idRoles', rolesControllers_1.rolesControllers.updateRol);
        this.router.get('/:idRoles', rolesControllers_1.rolesControllers.getRol);
    }
}
const rolesRoutes = new RolesRoutes();
exports.default = rolesRoutes.router;
