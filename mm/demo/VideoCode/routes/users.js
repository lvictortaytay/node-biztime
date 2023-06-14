

const db = require("../db");
const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");




router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
      `SELECT id, name, type FROM users`);

    return res.json(results.rows);
  }
  catch (err) {
    return next(err);
  }
});



//create a route , that takes in a user id as a query , and by that user id , get the user and all of that users messages 


router.get('/:id' , async function(req , res){
  const {id}  = request.params
  try{
    const userRes = await db.query(`SELECT * FROM users WHERE id = $1`, [id])
    const messagesRes = await db.query(`SELECT id , msg FROM messages WHERE user_id = $1`, [id])
    const user = userRes.rows[0];
    user.messages = messagesRes.rows;
    return res.send(user)
  }catch(e){
    return next(e)
  }
})

/** Get user: {name, type, messages: [{msg, msg}]} */

module.exports = router;