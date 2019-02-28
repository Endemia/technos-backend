const nodemailer = require('nodemailer');
const config = require('../config.json');

class EmailProcess {

	constructor() {
		this.transporter = nodemailer.createTransport(config.smtp);
	}

	sendRegisterKeyEmail(login, toAdress, registerKey) {
		const mailOptions = {
  			from: config.fromEmail,
  			to: toAdress,
	  		subject: config.registerEmailSubject,
  			text: `Cliquez sur ce lien pour activer votre compte : ${config.urlApplication}/activate/login/${login}/key/${registerKey}.`
		};

		return this.transporter.sendMail(mailOptions);
	}

}

module.exports = EmailProcess;