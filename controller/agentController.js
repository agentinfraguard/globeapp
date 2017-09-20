// This controller deals with Agent communication with the application

var db = require(process.cwd() + "/config/db");
var con = null;

module.exports = function(app){

app.get("/test", function(req, res){
	var data = req.query.id;
console.log(" param Id value = : "+data);
        var data = {
		serverName : "req.query.serverName",
		serverIP : "req.query.serverIp",
		hostname : "req.query.hostName",
		project_id : req.query.id,
		userList : "req.query.userList"
	};
	if(con == null)
	con = db.openCon(con);
	con.query('insert into servers set ?', data, function(err, result){
		console.log(" Server Registration Successful !");
		res.status(200).json(result);
	});
});

app.get("/getInstructionsForAgent", function(req, res){
	var serverIp = req.query.serverIp;
	if(con == null)
    con = db.openCon(con);
	Promise.all([
		new Promise((resolve, reject) => {
			con.query("select activityName,requiredData,convert(id,char(10)) as id from agentActivities where serverIp = ? and status = ?",[serverIp,0], function(err, result) {
				if(err)console.log(err.stack);
				if(result.length > 0){
					resolve(result);
				}
				resolve(null);
			});
		})
	])
	.then((results) => {
		res.status(200).json(results[0]);
	});
});

app.get("/serverRegistration", function(req, res){
	
   var data = {
		serverName : req.query.serverName,
		serverIP : req.query.serverIp,
		hostname : req.query.hostName,
		project_id : req.query.projectId,
		userList : req.query.userList
	};
	if(con == null)
	con = db.openCon(con);
	con.query('insert into servers set ?', data, function(err, result){
		console.log(" Server Registration Successful !");
		res.status(200).json(result);
	});
});

app.get("/addedUserByAgent", function(req, res){
		
	var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	var userName = req.query.userName;
	var userList ="";

	if(con == null)
	con = db.openCon(con);
	if(status==0){
	Promise.all([
		new Promise((resolve, reject) => {
			con.query("select userList from servers where serverIp = ? ",serverIp, function(err, result) {
				if(err)console.log(err.stack);
				if(result.length > 0){
	                 userList=result[0].userList;
					 userList=userList+","+userName;
					 console.log("1016. userList = : "+userList);
					con.query("update servers set userList = ? where serverIp = ? ",[userList,serverIp], function(err, result) {
						if(err)console.log(err.stack);
						});
					}
				resolve(null);
			});
		}),
	      new Promise((resolve, reject) => {
	             con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
						if(err)console.log(err.stack);
						resolve(null);
						});
		})
	])
	.then((results) => {
			res.status(200).json({"status":"userAdded and activity updated"});
		});
	}
});

app.get("/deletedUserByAgent", function(req, res){
		
	var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	var userName = req.query.userName;
	var userList ="";
	function removeValue(userList, value) {
	  var userArray = userList.split(",");
	  var index = userArray.indexOf(value);
		if (index > -1) {
		    userArray.splice(index, 1);
		}
	return userArray.toString();
	};

	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
				con.query("select userList from servers where serverIp = ? ",serverIp, function(err, result) {
					if(err)console.log(err.stack);
					if(result.length > 0){
		                userList=result[0].userList;
						userList = removeValue(userList, userName);
						console.log("10555. userList = : "+userList);
						con.query("update servers set userList = ? where serverIp = ? ",[userList,serverIp], function(err, result) {
							if(err)console.log(err.stack);
						});
					}
					resolve(null);
				});
			}),
		    new Promise((resolve, reject) => {
	         con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
		])
		.then((results) => {
			res.status(200).json({"status":"userDeleted and activity updated"});
		});
    }
});

app.get("/onRequestServerAccessGranted", function(req, res){
	
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	var userName = req.query.userName;
	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
				con.query("insert into userServerAccessStatus (serverIP,userName,accessStatus) values (?,?,1) ON DUPLICATE KEY UPDATE accessStatus = 1 ",[serverIp,userName], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			}),
		    new Promise((resolve, reject) => {
		        con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
		])
		.then((results) => {
			res.status(200).json({"status":"accessGranted  and activity updated"});
		});
    }
});

app.get("/privilegeChangedByAgent", function(req, res){
	// A separate method will be written for mailing
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	//var serverIp = req.query.serverIp;
	var userName = req.query.userName;
	//var privilege = req.query.privilege;
	
	if(con == null)
	con = db.openCon(con);
	if(status==0){
	Promise.all([
		new Promise((resolve, reject) => {
            con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
				if(err)console.log(err.stack);
				resolve(null);
			});
		})
	])
	.then((results) => {
		//send email
		res.status(200).json({"status":" agentActivities updated "});
		});
	} 
});

app.get("/serverAccessRevoked", function(req, res){
	
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	var userName = req.query.userName;
	
	
	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
				con.query("insert into userServerAccessStatus (serverIP,userName,accessStatus) values (?,?,0) ON DUPLICATE KEY UPDATE accessStatus = 0 ",[serverIp,userName], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			}),
		    new Promise((resolve, reject) => {
		        con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
	    ])
		.then((results) => {
			res.status(200).json({"status":" accessGranted  and activity updated "});
	    });
	} 
});

app.get("/serverKeyUpdated", function(req, res){
	// mail updated key to server owner
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	
	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
		        con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
	    ])
		.then((results) => {
			res.status(200).json({"status":" serverKeyUpdated  and activity updated "});
	    });
	} 
});

app.get("/serverLockedDown", function(req, res){
	
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
			con.query("update servers set lockedDown = ? where serverIp = ? ",[1,serverIp], function(err, result) {
				if(err)console.log(err.stack);
				 resolve(null);
				});
		    }),
			new Promise((resolve, reject) => {
		        con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
	    ])
		.then((results) => {
			res.status(200).json({"status":" serverLockedDown  and activity updated "});
	    });
	}
});

app.get("/serverUnlocked", function(req, res){
	
    var id = parseInt(req.query.id);
	var status = parseInt(req.query.status);
	var serverIp = req.query.serverIp;
	if(con == null)
	con = db.openCon(con);
	if(status==0){
		Promise.all([
			new Promise((resolve, reject) => {
			con.query("update servers set lockedDown = ? where serverIp = ? ",[0,serverIp], function(err, result) {
				if(err)console.log(err.stack);
				 resolve(null);
				});
		    }),
			new Promise((resolve, reject) => {
		        con.query("update agentActivities set status = ? where id = ? ",[1,id], function(err, result) {
					if(err)console.log(err.stack);
					resolve(null);
				});
			})
	    ])
		.then((results) => {
			res.status(200).json({"status":" serverUnlocked  and activity updated "});
	    });
	}
});

}