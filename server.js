import express from 'express';
import cors from "cors";
import mysql from "mysql2/promise";
import {attendance} from './routes/viewAttendance.js';
import dotenv from "dotenv"

//change the variable name of rows

//imitialize some consts and global variables
const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
const maxCachedRadiusEnteries = 50;
let cachedLoggedRows = [];
//create the connection pool
//still testing


const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: 'wifi_attendance_tracking'
});

//intialize the cached mac addresses(refer to Desing_Descisions.txt line 1)
let apMacAddresses = await getMacAddresses()

//set up the middlewares 
app.use(cors());
app.use(express.json());
app.use('/attendance',attendance)

//set up the checkAttendance function
await checkAttendance()
setInterval(checkAttendance, 60*1000)


// an endpoint that recieves the sessionEnd logs from the RADIUS server
// and decides wether to save it or not 
app.post('/wifi-sessions', async (req,res) => {
    //check if the ap exists on the db 
    try{
        const apMacAdd = req.body.Called-Station-Id;
        if (!apMacAddresses[apMacAdd]){
            console.log("this mac address is not of a lecture room ap")
        }
        else{

            const studentId = req.body.User-Name
            const sessionDuration = req.body.Acct-Session-Time
            
            if (cachedLoggedRows.length == maxCachedRadiusEnteries){

                pool.query(`
                    INSERT INTO Wifi_sessions (student_id,duration,access_point_id)
                    VALUES ?
                    `,[cachedLoggedRows])
                    cachedLoggedRows = []
            }
            else {
                cachedLoggedRows.push([studentId,sessionDuration,apMacAdd])}
            }
    }
        catch(err){
            console.log(err,err.message)
            res.code(500)
        }       
})


//a function that checks after the end of every period which students should've attended 
async function  checkAttendance(){
    try {
        const now = new Date()
        let today = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][now.getDay()]
        
        const [ checkAttendanceRows ]= await pool.query(`
            SELECT 
                c.id AS class_id,
                c.group_id,
                c.name,
                c.access_point_id,
                c.type,
                c.duration AS class_duration,
                s.id AS student_id,
                SUM(w.duration) AS total_wifi_duration
            FROM Classes c
            JOIN Students s 
                ON s.group_id = c.group_id
            JOIN Wifi_sessions w 
                ON w.student_id = s.id
                AND w.access_point_id = c.access_point_id
                -- WHERE c.end_time <= NOW()
                WHERE c.day = ?
            GROUP BY 
                c.id, c.group_id, c.access_point_id, c.duration, s.id
            ORDER BY 
                c.id, s.id;
            `, [today]);
        //calculate his percentage 
        checkAttendanceRows.forEach(row => {
            let duration = row.type == "lecture"? 60*3 : 60*2 //if it's a lecture then 2 hours and 40 minutes and if it's a section then 1 hour and 40 minutes
            row.percentage = (row.class_duration/duration)*100
            let attended = row.percentage >= 40 ? true : false 
            });

        //convert the array of object into an array of arrays to insert them into the table 
        //enter it into the db
        //don't add {} around the function
        const insertRows = checkAttendanceRows.map(row =>[row.student_id,row.class_id,row.percentage,row.group_id,])
        if(insertRows == []){
            console.log("i shouldn't be here")
        await pool.query(`
            INSERT INTO Attendance (student_id,class_id,percentage,group_id,attended)
            VALUES ?
            `,newRows)
            }
        else{
            console.log("no data to enter")
        }
    }//new rows is already an array of arrays 
        catch(err){
            console.log(err,err.message)
        }
}

// a function to get the mac addresses that are going to be cached on the server 
async function getMacAddresses(){
    try{
        let [macAddresses] = await pool.query(`
            SELECT id FROM Access_points
            `)
            let output = []
            macAddresses.forEach((row)=>output.push(row.id))
            return output 
        }
        catch(err){
            console.log(err,err.message)

        }
}

app.listen(port, () => {
  console.log(`server has started on port:${port}`);
});

export {pool}