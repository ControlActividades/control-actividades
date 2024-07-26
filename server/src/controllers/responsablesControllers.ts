import { Request, Response } from 'express';
import pool from '../database';

class ResponsablesControllers {
    public async index(req : Request, resp : Response) {

        const responsables = await pool.query('SELECT * FROM responsable INNER JOIN rol ON rol.idRoles = responsable.idRoles');
        resp.json(responsables);
    }
    
    public async getResponsable(req: Request, res: Response): Promise<void> {
        const { idResp } = req.params;
        try {
            const result = await pool.query('SELECT * FROM responsable WHERE idResp = ?', [idResp]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Responsable no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el responsable', error });
        }
    }
    
    public async create(req : Request, resp : Response):Promise<void>{
        console.log(req.body);
        await pool.query('INSERT INTO responsable set ?',[req.body]);
        resp.json({message: 'Responsable guardado'})
    }

    public async delete(req : Request, resp : Response){
        const { idResp} = req.params;
        await pool.query('DELETE FROM responsable WHERE idResp = ?', [idResp]);
        resp.json({message : 'Responsable eliminado'});
    }

    public async updateResponsable(req: Request, res: Response): Promise<void> {
        const { idResp } = req.params;
        const updateData = req.body;
        try {
            const result = await pool.query('UPDATE responsable SET ? WHERE idResp = ?', [updateData, idResp]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Responsable actualizado' });
            } else {
                res.status(404).json({ message: 'Responsable no encontrado para actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el responsable', error });
        }
    }
    

}
export const responsablesControllers = new ResponsablesControllers();
