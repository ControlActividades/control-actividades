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
        this.router.get('/imprimir/:idReserva', reservasControllers.getReservaImprimir) //imprimir la reserva
        this.router.post('/',reservasControllers.create);
        this.router.post('/check', reservasControllers.checkReserva); //reserva disponible
        this.router.delete('/:idReserva',reservasControllers.delete);
        this.router.put('/:idReserva', reservasControllers.updateReserva); 
    }
}
const reservasRoutes = new ReservasRoutes(); 
export default reservasRoutes.router;