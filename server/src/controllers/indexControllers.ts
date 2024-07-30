import { Request, Response } from 'express';

class IndexControllers {
    public index(req : Request, resp : Response) {
        resp.send('Quiubule Raza!!!');
        
    }
}
export const indexControllers = new IndexControllers();
