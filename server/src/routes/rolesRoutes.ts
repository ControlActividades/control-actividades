import { Router } from "express";
import { rolesControllers } from "../controllers/rolesControllers";
rolesControllers

class RolesRoutes {
    public router : Router = Router();

    constructor(){
        this.config();
    }
    config() : void{
        this.router.get('/',rolesControllers.index);
        this.router.post('/',rolesControllers.create);
        this.router.delete('/:idRoles',rolesControllers.delete);
        this.router.put('/:idRoles', rolesControllers.updateRol);
        this.router.get('/:idRoles', rolesControllers.getRol);

    }
}
const rolesRoutes = new RolesRoutes();
export default rolesRoutes.router;