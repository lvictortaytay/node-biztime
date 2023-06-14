const express = require("express");
const ExpressError = require("./expressError")
const compt_routes = require("./routes/routes_companies")
const invoice_routes = require("./routes/routes_invoices")
const path = require("path")
const bodyParser = require('body-parser');
const slugify = require("slugify");
const expbs = require("express-handlebars")
const db = require("./db");


//initiation
const app = express();
// nunjucks.configure('views', {
//   autoescape: true,
//   express: app
// });
//middleware and routes
app.engine("handlebars" , expbs.engine({ extname: 'handlebars', defaultLayout: "editComp"}))

app.set("view engine" , "handlebars")
app.use(express.json());
app.use("/companies" , compt_routes)
app.use("/invoices" , invoice_routes)
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))








app.get("/" , function(req , res){
  return res.sendFile(path.join(__dirname,`./templates/addcompany.html`))
  
})
/** general error handler */


app.post("/" , async function(req, res){
  let compCode = slugify((req.body.compCode))
  let compName = (req.body.compName)
  let descrp = (req.body.description)
  
  try{
    await db.query(`INSERT INTO companies (code , name , description) VALUES ($1,$2,$3)` , [compCode , compName , descrp])
    let newComp = await db.query(`SELECT * FROM companies WHERE code = $1`, [compCode])
    return res.json({company : newComp.rows}).send
    // nunjucks.render('index.html', { foo: 'bar' });
  }
  catch{
      return res.send("it doesnt work")
    }
  
})



app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});


app.listen(3000, function () {
  console.log("Listening on 3000");
});


module.exports = app;
