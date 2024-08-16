//funcionalidad
import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';

//rutas
import indexRoutes from './routes/indexRoutes';
import edificiosRoutes from './routes/edificiosRoutes';
import rolesRoutes from './routes/rolesRoutes';
import responsablesRoutes from './routes/responsablesRoutes';
import reservasRoutes from './routes/reservasRoutes';

class Server {
    public app:Application;
    constructor(){
        this.app = express();
        this.config(); 
        this.routes();
    }
    config(): void{
        this.app.set('port',process.env.PORT||3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
    }
    routes():void{
        this.app.use('/',indexRoutes);
        this.app.use('/edificios',edificiosRoutes);
        this.app.use('/roles',rolesRoutes);
        this.app.use('/responsables',responsablesRoutes);
        this.app.use('/reservas',reservasRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
        
    }
}
const server = new Server();//ejecuta y devuelve un objeto
server.start();