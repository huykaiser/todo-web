const PORT = process.env.PORT ?? 8000;
const express = require('express');
const {v4:uuidv4} = require('uuid');
const app = express();
const cors = require('cors');
let pool = require('./db');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());


// get all todos
app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params;

    try {
        const todos = await pool.query("SELECT * FROM todos WHERE user_email = $1", [userEmail]);
        res.json(todos.rows);
    } catch (error) {
        console.error("error", error);
    }
})

// create a new todo
app.post("/todos", async (req, res) => { 
    const { user_email, title, progress, date } = req.body;
    // console.log("user_email, title, progress, date: ", user_email, title, progress, date);
    const id = uuidv4();

    try {
        const newTodo = await pool.query("INSERT INTO todos (id, user_email, title, progress, date) VALUES ($1, $2, $3, $4, $5)", [id, user_email, title, progress, date]);

        // console.log("newTodo: ", newTodo);
        res.json(newTodo);
    } catch (error) {
        console.error("error", error);
    }
})

// edit todo
app.put("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const { user_email, title, progress, date } = req.body;
    // console.log("user_email, title, progress, date: ", user_email, title, progress, date);

    try {
        const editTodo = await pool.query("UPDATE todos SET user_email=$1, title=$2, progress=$3, date = $4 WHERE id = $5;", [user_email, title, progress, date, id]);

        // console.log("editTodo: ", editTodo);
        res.json(editTodo);
    } catch (error) {
        console.error("error", error);
    }
})

// delete
app.delete("/todos/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleteTodo = await pool.query("DELETE FROM todos WHERE id = $1;", [id]);

        // console.log("deleteTodo with id: ", id);
        res.json(deleteTodo);
    } catch (error) {
        console.error("error", error);
    }
})

// sign up
app.post("/signup", async (req, res) => { 
    const { email, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    try {
        const signUp = await pool.query("INSERT INTO users (email, hashed_password) VALUES ($1, $2)", [email, hashedPassword]);

        const token = jwt.sign({email}, "secret", {expiresIn:"1hr"});

        // console.log("signUp: ", signUp);
        res.json({email, token});
    } catch (error) {
        if(error){
            res.json({detail:error.detail});
        }
    }
})

// login
app.post("/login", async (req, res) => { 
    const { email, password } = req.body;

    try {
        const users = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        // console.log("users.rows[0]: ", users.rows[0]);

        if(!users.rows.length){ 
            return res.json({detail:"User does not exist"});
        }


        const success = await bcrypt.compare(password, users.rows[0].hashed_password);
        const token = jwt.sign({email}, "secret", {expiresIn:"1hr"});

        if(success) {
            console.log("success");
            res.json({"email":users.rows[0].email, token});
        }else{
            res.json({detail:"login failed!!"});
        }
    } catch (error) {
        console.error("error: ", error);
    }
})



app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}`));

