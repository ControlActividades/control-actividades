import { Router } from "express";
import { reservasControllers } from "../controllers/reservasControllers";

class ReservasRoutes {
    public router : Router = Router();

    constructor(){
        this.config();
    }
    config() : void{
        this.router.get('/',reservasControllers.index);
        this.router.get('/:idReserva', reservasControllers.getReserva);
        this.router.post('/',reservasControllers.create);
        this.router.delete('/:idReserva',reservasControllers.delete);
        this.router.put('/:idReserva', reservasControllers.updateReserva);
        this.router.get('/imprimir/:idReserva', reservasControllers.getReservaImprimir)

    }
}
const reservasRoutes = new ReservasRoutes(); 
export default reservasRoutes.router;