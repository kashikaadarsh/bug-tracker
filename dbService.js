const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

// const connection = mysql.createConnection({
//     host: 'bemvgo8nokzzatzk1jik-mysql.services.clever-cloud.com',
//     user: 'u2jnj1s64todnegn',
//     password: 'oF2UhdcDwSfqp6dIxbmC',
//     database: 'bemvgo8nokzzatzk1jik'
// });

// connection.connect((err) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.log('db ' + connection.state);
// });

var db_config = {
    host: 'b8rcs00irv3k6mphmfte-mysql.services.clever-cloud.com',
    user: 'utbp135gid0b691w',
    password: 'RaoG02eY2Ktc5tdyEViY',
    database: 'b8rcs00irv3k6mphmfte'
  };
  
  var connection;
  
  function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                    // the old one cannot be reused.
  
    connection.connect(function(err) {              // The server is either down
      if(err) {                                     // or restarting (takes a while sometimes).
        console.log('error when connecting to db:', err);
        setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
      }  
      else
      {
          console.log('Connected');
      }                                   // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
                                            // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        handleDisconnect();                         // lost due to either server restart, or a
      } else { 
        handleDisconnect();   
                                              // connnection idle timeout (the wait_timeout
        // throw err;                                  // server variable configures this)
      }
    });
  }
  
  handleDisconnect();


class DbService {

    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }
    async getUserById(id,isDev){
      try{
        var query;
        
        const user = await new Promise((resolve,reject)=>{
        if(isDev)
         query = "SELECT * FROM developer WHERE id=?";
        else
         query = "SELECT * FROM tester WHERE id=?";
        connection.query(query,[id],(err,result)=>{
            if(err) reject(new Error(err.message));
            resolve(result);
          })
        });
        if(user.length == 0){
          return {
            userFound:false,
            error:false
          };
        }
        return {
          userFound:true,
          name:user[0].name,
          email:user[0].email,
          error:false
        }

      }
      catch{
        return{
          error:true
        };
      }
    }
    async registerUser(name,email,password,isDev){
      try{
        var query;                     //userExists=false;
        
        const user = await new Promise((resolve,reject)=>{
          if(isDev)
          query = "INSERT INTO developer (name,email,password) VALUES (?,?,?)";
          else
          query = "INSERT INTO tester (name,email,password) VALUES (?,?,?)";
        connection.query(query,[name,email,password],(err,result)=>{
            if(err) reject(new Error(err.message));
            resolve(result);
          })
        });
        console.log(user);
        return{
          name:name,
          registered:true,
          error:false

        };
      }
      catch{
        return {
          error:true
      };
      }
    }
    async getUser(id){
      try{
        const user = await new Promise((resolve, reject) => {
          const query = "SELECT * FROM users WHERE email = ? AND password=?";
          connection.query(query, [email,password] , (err, result) => {
              if (err) reject(new Error(err.message));
              resolve(result);
          })
      });
      if(user.length==0)
      {
          return {
              userFound : false,
              error:false

          };
      }
      return {
          userFound : true,
          username : user[0].username,
         // password : user[0].password,
          id : user[0].id,
          error:false
      };

      }
      catch (error) {
              return {
                  error:true
              };
          }
    }
    async authUser(email,password) {
      console.log(email,password);
          try {
              const user = await new Promise((resolve, reject) => {
                  const query = "SELECT * FROM users WHERE email = ? AND password=?";
                  connection.query(query, [email,password] , (err, result) => {
                      if (err) reject(new Error(err.message));
                      resolve(result);
                  })
              });
              if(user.length==0)
              {
                  return {
                      userFound : false,
                      error:false

                  };
              }
              return {
                  userFound : true,
                  username : user[0].username,
                 // password : user[0].password,
                  id : user[0].id,
                  error:false
              };
          } 
          catch (error) {
              return {
                  error:true
              };
          }
    }
    async getStatusBugs(status){
      console.log(status);
      try{
        const bugs = await new Promise((resolve,reject)=>{
          const query = 'SELECT * FROM bug where status= ?;';
          connection.query(query,[status],(err,result)=>{
            if(err) reject(new Error(err.message));
            resolve(result);
          });
        });
        console.log(bugs);
        if(bugs.length==0){
          return{
            bugFound:false,
            
            error:false
          };
        }

        return{
          bugFound:true,
          details:bugs,
          error:false
        }
      }
      catch{
        return{
          error:true
        };

      }
    }
    async getSeverityBugs(severity){
      console.log(severity);
      try{
        const bugs = await new Promise((resolve,reject)=>{
          const query = 'SELECT * FROM bug where severity= ?;';
          connection.query(query,[severity],(err,result)=>{
            if(err) reject(new Error(err.message));
            resolve(result);
          });
        });
        console.log(bugs);
        if(bugs.length==0){
          return{
            bugFound:false,
            
            error:false
          };
        }

        return{
          bugFound:true,
          details:bugs,
          error:false
        }
      }
      catch{
        return{
          error:true
        };

      }
    }
    async getBug(bug_id){
      console.log(bug_id);
      try{
        const bug = await new Promise((resolve,reject)=>{
          const query = 'SELECT * FROM bug where id= ?;';
          connection.query(query,[bug_id],(err,result)=>{
            if(err) reject(new Error(err.message));
            resolve(result);
          });
        });
        console.log(bug);
        if(bug.length==0)
        return{
          bugFound:false,
          
          error:false
        };
        return{
          bugFound:true,
          name:bug[0].name,
          createdBy:bug[0].createdBy,
          createdAt:bug[0].createdAt,
          status: bug[0].status,
          severity:bug[0].severity,
          description:bug[0].description,
          assignedTo: bug[0].assignedTo,
          testedBy: bug[0].testedBy,
          sprintId: bug[0].sprintId,
          error:false
        }
      }
      catch{
        return{
          error:true
        };

      }
    }


  };

    
module.exports = DbService;

