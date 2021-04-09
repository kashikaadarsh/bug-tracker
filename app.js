const express = require('express');
const app = express();
const dbService = require('./dbService');
//const passport = require("passport");
const session = require("express-session");
//const flash = require("express-flash");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(
  session({
    // Key we want to keep secret which will encrypt all of our information
    secret: 'Cat',
    // Should we resave our session variables if nothing has changes which we dont
    resave: false,
    // Save empty value if there is no vaue which we do not want to do
    saveUninitialized: false
  })
);
// const initializePassport = require("./passportConfig");
// initializePassport(passport);
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());
app.use(express.json());
//app.set("view engine", "ejs");
//app.use(express.static(__dirname + '/views'));

app.post('/user/login',(request,response) => {
    const db = dbService.getDbServiceInstance();
    console.log(request.body);
    const {email,password}= request.body;
    console.log(email,password);
    const result = db.authUser(email,password);
    result.then(data => {
            response.json({data : data})
        })
    .catch(err => console.log(err));
  })
app.get('/getuser',(req,res)=>{
  const db = dbService.getDbServiceInstance();
  const {id,isDev}=req.body;
  const result = db.getUserById(id,isDev);
  result.then(data=>{
    res.json({data:data})
  })
  .catch(err=>{
    res.json({error:err.message});
  })
})
app.post('/register',(req,res)=>{
  const db=dbService.getDbServiceInstance();
  const {name,email,password,isDev}=req.body;
  const result = db.registerUser(name,email,password,isDev);
  result.then(data=>{
    res.json({data:data})
  })
  .catch(err=> {
    res.json({error:err.message})
  })
});
  app.get('/getbug',(req,res)=>{
    const db=dbService.getDbServiceInstance();
    const {bug_id}=req.body;
    const result=db.getBug(bug_id);
    result.then(data=>{
      res.json({data:data})
    })
    .catch(err=>{
      return {error:err};

    })
  });
  app.get('/getstatusbugs',(req,res)=>{
    const db = dbService.getDbServiceInstance();
    const {status}=req.body;
    const result = db.getStatusBugs(status);
    result.then(data=>{
      res.json({data:data})
    })
    .catch(err=>{
      return {error:err};

    })

  });
  app.get('/getseveritybugs',(req,res)=>{
    const db = dbService.getDbServiceInstance();
    const {severity}=req.body;
    const result = db.getSeverityBugs(severity);
    result.then(data=>{
      res.json({data:data})
    })
    .catch(err=>{
      return {error:err};

    })

  })

app.get("/", (req, res) => {
  res.json({name : "Kashika"})
});

const port = process.env.PORT || '5000';
app.listen(port, () => console.log(`Server started on Port ${port}`));