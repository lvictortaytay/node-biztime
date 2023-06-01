const express = require("express");
const router = new express.Router();
const db = require("../db.js")


// router.get("/" , function(req , res){
//     return res.send("hello this is the BIZTIME application")
// });



router.get("/" , async function(req , res){

    let companies = await db.query(`SELECT * FROM companies; `)
    let list = ({companies:companies.rows})
    return res.json(list).send
})


router.get("/:code" , async function(req , res ){
    console.log(req.params)
    try{
        let companies = await db.query(`SELECT * FROM companies WHERE code = $1` , [req.params.code])
        return res.json({company: companies.rows}).send
    }catch(err){
        return console.log("doesnt work")
    }
    
})


router.put(`/:code` , async function(req , res){
    let newEdit = await db.query(`
    UPDATE  companies SET name = $1 ,  
    description = $2 WHERE code = $3 
    RETURNING code , name , description` , 
    [req.body.name  , req.body.description , req.params.code])
    return res.send(newEdit)
})

router.delete("/:code" , async function(req , res){
    try{
        let deleteComp = await db.query(`DELETE FROM companies WHERE code = $1` , [req.params.code])
        res.send("deleted")
    }catch{
        return res.send("404 error")
    }
    
})

module.exports = router;