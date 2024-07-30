import { Router } from "express";
import { edificiosControllers } from "../controllers/edificiosControllers";

class EdificiosRoutes {
    public router : Router = Router();

    constructor(){
        this.config();
    }
    config() : void{
        this.router.get('/',edificiosControllers.index);
        this.router.post('/',edificiosControllers.create);
        this.router.delete('/:idEdificio',edificiosControllers.delete);
        this.router.put('/:idEdificio', edificiosControllers.updateEdificio);
        this.router.get('/:idEdificio', edificiosControllers.getEdificio);

    }
}
const edificiosRoutes = new EdificiosRoutes();
export default edificiosRoutes.router;