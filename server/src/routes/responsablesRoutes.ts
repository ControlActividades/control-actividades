import { Router } from "express";
import { responsablesControllers } from "../controllers/responsablesControllers";


class ResponsablesRoutes {
    public router : Router = Router();

    constructor(){
        this.config();
    }
    config() : void{
        this.router.get('/',responsablesControllers.index);
        this.router.post('/',responsablesControllers.create);
        this.router.delete('/:idResp',responsablesControllers.delete);
        this.router.put('/:idResp', responsablesControllers.updateResponsable);
        this.router.get('/:idResp', responsablesControllers.getResponsable);

    }
}
const responsableRoutes = new ResponsablesRoutes();
export default responsableRoutes.router;