import { Request, Response } from 'express';
import pool from '../database';

class RolesControllers {
    public async index(req : Request, resp : Response) {

        const roles = await pool.query('SELECT * FROM rol');
        resp.json(roles);
    }
    
    public async getRol(req: Request, res: Response): Promise<void> {
        const { idRoles } = req.params;
        try {
            const result = await pool.query('SELECT * FROM rol WHERE idRoles = ?', [idRoles]);
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).json({ message: 'Rol no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el rol', error });
        }
    }
    
    public async create(req : Request, resp : Response):Promise<void>{
        console.log(req.body);
        try {
            await pool.query('INSERT INTO rol set ?',[req.body]);
            resp.json({message: 'Rol guardado'})
        } catch (error : any) {
            if (error.code === 'ER_SIGNAL_EXCEPTION' && typeof error.sqlMessage === 'string') {
                const messages = error.sqlMessage.split('. ');
                resp.status(400).json({ message: messages.filter((msg: string) => msg !== '').join('. ') });
            } else {
                resp.status(500).json({ message: 'Error al guardar el edificio', error });
            }
        }
    }

    public async delete(req : Request, resp : Response){
        const { idRoles} = req.params;
        await pool.query('DELETE FROM rol WHERE idRoles = ?', [idRoles]);
        resp.json({message : 'Rol eliminado'});
    }

    public async updateRol(req: Request, res: Response): Promise<void> {
        const { idRoles } = req.params;
        const updateData = req.body;
        try {
            const result = await pool.query('UPDATE rol SET ? WHERE idRoles = ?', [updateData, idRoles]);
            if (result.affectedRows > 0) {
                res.json({ message: 'Rol actualizado' });
            } else {
                res.status(404).json({ message: 'Rol no encontrado para actualizar' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el rol', error });
        }
    }
    

}
export const rolesControllers = new RolesControllers();
