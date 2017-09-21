// This Controller handles all the mailing functionality

var nodemailer = require("nodemailer");

// mailTransporter credentials for GMAIL and AWS

/*var mailTransporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'infraguardmail@gmail.com',
        pass: 'Infr@Gu@rd'
    }
});*/

/*var mailTransporter = nodemailer.createTransport({
        host: "email-smtp.us-east-1.amazonaws.com",
        port:465,
        auth: {
            user: "AKIAJF5TWSLFHRDRLAFQ",
            pass: "AiZuYJqpWHHv1baeYIGV6GSqDcGNUvVf6dwpSCiVr4sA"
        }
    });*/

module.exports = function(app){

app.post("/mailUserCredentialsUrl", function(req, res){
    
    var url = req.body.url;
    var password = req.body.passw;
    var email = req.body.email;
        
    var mail = {
        from: "infraguardmail@gmail.com",
        to: email,
        subject: "InfraGuard Console Credentials",
        html: "Welcome to Infraguard.Please find your credentials below and keep it safe.<br><br>InfraGuard Console Credentials : <br><br> URL : "+url+"<br> Username : "+email+"<br> Password :  "+password+" <br><br>  Thanks <br> Infraguard Team"
    }
    var mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infraguardmail@gmail.com',
            pass: 'Infr@Gu@rd'
        }
    });

    mailTransporter.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
        res.status(200).json(response.message);
    }
    mailTransporter.close();
    });
    
    
});

app.post("/mailMFAResetCredentialsUrl", function(req, res){

    
    var backupCode = req.body.backupCode;
    var email = req.body.email;
    
    var mail = {
        from: "infraguardmail@gmail.com",
        to: email,
        subject: "InfraGuard MFA Credentials",
        html : "<p>Hi,</p><br><p>Your request to reset MFA Authentication token has been processed.Below is your one-time use backup password.</p><br><br>"+
                "<p> Backup Password : "+backupCode+"</p><br><br> <p>Also scan the below QR Code in any authenticator app.</p><br><br><div>"+
                "<img src='cid:"+email+"' style='width:250px;height:250px'></div><br><br><p>  Thanks</p><br><p> Infraguard Team</p>",
        attachments: [{
            filename: email+'.png',
            path: './angular/images/qrcode/'+email+'.png',
            cid: email //same cid value as in the html img src
        }]
    }
    var mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infraguardmail@gmail.com',
            pass: 'Infr@Gu@rd'
        }
    });

    mailTransporter.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    mailTransporter.close();
    });
    
    
});

app.post("/pwdResetCredentialsUrl", function(req, res){
    
    var psswdResetUrl = req.body.psswdResetUrl;
    var email = req.body.email;
        
    var mail = {
        from: "infraguardmail@gmail.com",
        to: email,
        subject: "InfraGuard Password Reset",
        html: "<p>Hi,</p><br><p>Below is your password reset link. The will expire in 24 hrs. </p><br><br> <div><a href='"+psswdResetUrl+"'> Password Reset Link </a></div><br><br><p>  Thanks</p></br><p> Infraguard Team</p>"
    }
    var mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infraguardmail@gmail.com',
            pass: 'Infr@Gu@rd'
        }
    });

    mailTransporter.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
        res.status(200).json(response.message);
    }
    mailTransporter.close();
    });
    
    
});

app.post("/mailUpdatedKey", function(req, res){
    
    var type = req.body.type;
    var serverIP = req.body.serverIp;
    var privateKey = req.body.privateKey;
    var email = req.body.email;
    var mssg = '';
    var mailHeader='';

    if(type=='keyRotation'){
        mssg = " Please find credentials for server default user which has been changed due to Server Key Rotation Policy";
        mailHeader = " Server Key Rotation Credentials";
    }else if(type=='requestAccess'){
        mssg = " Please find your credentials for server access which has been generated by on-request-server-access Policy";
        mailHeader = " On Request Server Access Credentials";
    }

    var mail = {
        from: "infraguardmail@gmail.com",
        to: email,
        subject: mailHeader,
        html: mssg+"<br> Keep it safe.<br><br> ServerIP : "+serverIP+" <br><br> Your private key for SSH Login : <br><br> "+privateKey+"<br><br>  Thanks <br> Infraguard Team"
    }
    var mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infraguardmail@gmail.com',
            pass: 'Infr@Gu@rd'
        }
    });

    mailTransporter.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
        res.status(200).json(response.message);
    }
    mailTransporter.close();
    });
    
    
});

app.get("/changePrivilegeEmail", function(req, res){
    
    var serverIp = req.query.serverIp;
    var email = req.query.email;
    var password = req.query.password;

    var mail = {
        from: "infraguardmail@gmail.com",
        to: email,
        subject: "Server root Credentials",
        html: "Welcome to Infraguard.Below is your password for server sudo access, keep it safe.<br><br> ServerIp : "+serverIp+"<br> Password :  "+password+" <br><br> Thanks <br> Infraguard Team"
    }
    
    var mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'infraguardmail@gmail.com',
            pass: 'Infr@Gu@rd'
        }
    });

    mailTransporter.sendMail(mail, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
        res.status(200).json(response.message);
    }
    mailTransporter.close();
    });
});

}
