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
    }
}
const edificiosRoutes = new EdificiosRoutes();
export default edificiosRoutes.router;