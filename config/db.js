var mysql = require("mysql");

module.exports = {

openCon : function(con){
con = mysql.createConnection({
host: "infraguarddb.cvfgxhprsmji.us-west-2.rds.amazonaws.com",
user: "avignadev",
password: "avIgnaDev3",
database: "InfraDB"
});
con.connect(function(err){
if(err){
console.log("connection problem: ", err.stack);
return null;
}
});
return con;
},

closeCon : function(con){
if(con != null){
con.end(function(err){
if(err) console.log(err.stack);
});
}
}


};
