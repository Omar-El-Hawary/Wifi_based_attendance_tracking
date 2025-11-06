import {pool} from '../server.js';
import express from 'express';


const router = express.Router()
//an endpoint that gets the data from the database and gets the attendance percentage of each lecture to each student 
router.get('/', async (req,res)=>{
    //get the attendance from today 
    try{
        const [attendendanceStudentsRows] = await pool.query(`
            SELECT
            a.percentage,
            s.id,
            s.name AS student_name,
            c.name AS class_name
            FROM Attendance a 
            JOIN Students s 
            ON a.student_id = s.id
            JOIN Classes c 
            ON a.class_id = c.id
            WHERE a.entry_date = CURRENT_DATE
            `)
            res.json(attendendanceStudentsRows)
        }
        catch(err){
            console.log(err,err.message)
            res.status(500)
        }
})

router.get('/:studentId', async (req,res)=>{
    
    //get the attendance from today 
    try{
    const [attendedStudentRow]= await pool.query(`
        SELECT
         a.percentage,
         s.id,
         s.name AS student_name,
         c.name AS class_name
         FROM Attendance a 
         JOIN Students s 
         ON a.student_id = s.id
         JOIN Classes c 
         ON a.class_id = c.id
         WHERE a.entry_date = CURRENT_DATE
         AND s.id = ?
        `,[req.params.studentId])
        res.json(attendedStudentRow)
    }
        catch(err){
            console.log(err,err.message);
            res.status(500)   
        }
});
export {router as attendance }