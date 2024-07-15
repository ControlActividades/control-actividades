import { Request, Response } from 'express';
import pool from '../database';

class EdificiosControllers {
    public index(req : Request, resp : Response) {

        pool.query('describe edificio');
        resp.json('edificio');

    }
    public create(req : Request, resp : Response){
        resp.json({text : 'Creando un edificio'});
    }
}
export const edificiosControllers = new EdificiosControllers();
