import express, {Application} from 'express';
import edificiosRoutes from './routes/edificiosRoutes';
import indexRoutes from './routes/indexRoutes';
import morgan from 'morgan';
import cors from 'cors';

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
    }
    start():void{
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
        
    }
}
const server = new Server();//ejecuta y devuelve un objeto
server.start();