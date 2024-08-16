import { Request, Response } from 'express';
import pool from '../database';

class EdificiosControllers {
    public async index(req : Request, resp : Response) {

        const edificios = await pool.query('SELECT * FROM edificio');
        resp.json(edificios);
    }
    
    public async getEdificio(req: Request, res: Response): Promise<void> {
        const { idEdificio } = req.params;
        try {
            const result = await pool.query('SELECT * FROM edificio WHERE idEdificio = ?', [idEdificio]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Edificio no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el edificio', error });
        }
    }
    
    public async create(req : Request, resp : Response):Promise<void>{
        console.log(req.body);
        try {
            await pool.query('INSERT INTO edificio set ?',[req.body]);
            resp.json({ message: 'Edificio guardado' });
        } catch (error:any) {
            if (error.code === 'ER_SIGNAL_EXCEPTION' && typeof error.sqlMessage === 'string') {
                const messages = error.sqlMessage.split('. ');
                resp.status(400).json({ message: messages.filter((msg: string) => msg !== '').join('. ') });
            } else {
                resp.status(500).json({ message: 'Error al guardar el edificio', error });
            }
        }
    }

    public async delete(req : Request, resp : Response){
        const { idEdificio } = req.params;
        await pool.query('DELETE FROM edificio WHERE idEdificio = ?', [idEdificio]);
        resp.json({message : 'Edificio eliminado'});
    }

    public async updateEdificio(req: Request, res: Response): Promise<void> {
        const { idEdificio } = req.params;
        const updateData = req.body;
        try {
            const result = await pool.query('UPDATE edificio SET ? WHERE idEdificio = ?', [updateData, idEdificio]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Edificio actualizado' });
            } else {
                res.status(404).json({ message: 'Edificio no encontrado para actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el edificio', error });
        }
    }
    

}
export const edificiosControllers = new EdificiosControllers();
