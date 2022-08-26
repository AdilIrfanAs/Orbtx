const sgMail = require('@sendgrid/mail');
const DOMAIN = "sandbox6d79c72bea37497cacec9ff8908ae65b.mailgun.org";
var API_KEY = '97daf69379239c50cb1f3ca1db632604-b2f5ed24-d671f57c';
var mailgun = require('mailgun-js')({ apiKey: API_KEY, domain: DOMAIN });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(mailOptions) {
    return new Promise((resolve, reject) => {
        const data = {
            to: mailOptions.to,
            from: mailOptions.from,
            subject: mailOptions.subject,
            text: mailOptions.html
        };
        mailgun.messages().send(data, (error, body) => {
            if (error) {
                console.log("I am in error: ", error);
                // reject(error)
            } else {
                console.log("I am in resolve: ", body);
                // resolve(body);
            }
        });
    });
}


module.exports = { sendEmail };

