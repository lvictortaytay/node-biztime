let express = require("express")
const router = new express.Router()
const db = require("../db.js")


router.get(`/` , async function(req , res){
    let allInvoices = await db.query(`SELECT * FROM invoices;`)
    return res.json({invoices: allInvoices.rows}).send
})

router.get(`/:id`, async function(req , res){
    let invoice = await db.query(`SELECT * FROM invoices WHERE id = $1` ,[req.params.id] )
    return res.json({response: invoice}).send
})

router.post(`/`, async function(req,res){
    let newInvoice = await db.query(`INSERT INTO invoices (comp_code , amt) VALUES ($1 , $2)` , [req.body.comp_code , req.body.amt])
    return res.json(newInvoice).send
})

router.put(`/:id` , async function(req , res){
    let updatedInvoice = await db.query(`
    UPDATE invoices SET amt = $1 
    WHERE id  = $2 RETURNING (comp_code , amt , paid , add_date , paid_date)`
    , [req.body.amt , req.params.id])
    return res.json(updatedInvoice).send
})

router.delete(`/:id` , async function(req , res){
    let invoice = await db.query(`DELETE FROM invoices WHERE id = $1` , [req.params.id])
    return res.json({status:"deleted"}).send
})















module.exports = router;