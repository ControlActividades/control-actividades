import { Router } from "express";
import { responsablesControllers } from "../controllers/responsablesControllers";


class ResponsablesRoutes {
    public router : Router = Router();

    constructor(){
        this.config();
    }
    config() : void{
        this.router.get('/',responsablesControllers.index);
        this.router.get('/id/:nombUsuario',responsablesControllers.getIdByUsername);
        this.router.get('/:idResp', responsablesControllers.getResponsable);
        this.router.post('/',responsablesControllers.create);
        this.router.post('/validate', responsablesControllers.validateUser);
        this.router.post('/buscar', responsablesControllers.buscarResponsable); // Nueva ruta para buscar responsable

        this.router.delete('/:idResp',responsablesControllers.delete);
        this.router.put('/:idResp', responsablesControllers.updateResponsable);
        this.router.put('/contrasenia/:idResp', responsablesControllers.updateContrasenia); // Nueva ruta para actualizar contraseña}
        
    }
}
const responsableRoutes = new ResponsablesRoutes();
export default responsableRoutes.router;