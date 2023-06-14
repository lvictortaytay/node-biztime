const express = require("express");
const router = new express.Router();
const db = require("../db.js")
const bodyParser = require('body-parser');
const path = require("path")
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static("public"))

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


router.get("/edit/comp" , async function(req, res){
    return res.render(path.join(__dirname,`../views/editComp.handlebars`))

})


router.put(`/:code` , async function(req , res){
    let newEdit = await db.query(`
    UPDATE  companies SET name = $1 ,  
    description = $2 WHERE code = $3 
    RETURNING code , name , description` , 
    [req.body.name  , req.body.description , req.params.code])
    return res.send(newEdit)
})
// router.put("/:id", async function (req, res, next) {
//     try {
//       let {amt, paid} = req.body;
//       let id = req.params.id;
//       let paidDate = null;
  
//       const currResult = await db.query(
//             `SELECT paid
//              FROM invoices
//              WHERE id = $1`,
//           [id]);
  
//       if (currResult.rows.length === 0) {
//         throw new ExpressError(`No such invoice: ${id}`, 404);
//       }
  
//       const currPaidDate = currResult.rows[0].paid_date;
  
//       if (!currPaidDate && paid) {
//         paidDate = new Date();
//       } else if (!paid) {
//         paidDate = null
//       } else {
//         paidDate = currPaidDate;
//       }
  
//       const result = await db.query(
//             `UPDATE invoices
//              SET amt=$1, paid=$2, paid_date=$3
//              WHERE id=$4
//              RETURNING id, comp_code, amt, paid, add_date, paid_date`,
//           [amt, paid, paidDate, id]);
  
//       return res.json({"invoice": result.rows[0]});
//     }
  
//     catch (err) {
//       return next(err);
//     }
  
//   });
router.delete("/:code" , async function(req , res){
    try{
        let deleteComp = await db.query(`DELETE FROM companies WHERE code = $1` , [req.params.code])
        res.send("deleted")
    }catch{
        return res.send("404 error")
    }
    
})
console.log("hello")
module.exports = router;