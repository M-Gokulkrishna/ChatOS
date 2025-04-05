const nodeMailer = require('nodemailer');
// 
const mailTransporter = nodeMailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
        user: process.env.NODEMAILER_SERVICE_EMAIL,
        pass: process.env.NODEMAILER_SERVICE_PASSWORD
    }
});
// 
module.exports = { mailTransporter };