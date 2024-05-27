
import { exec } from "child_process";
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

const emailAddress = process.env.EMAIL_ADDRESS

const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASSWORD,
    },
});

const sendEmail = async(text) =>  {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"${emailAddress}" <${emailAddress}>`, // sender address
        to: emailAddress, // list of receivers
        subject: `Appointment available\n${text}`, // Subject line
        text: `Appointment available\n${text}`, // plain text body
        html: `<b>Appointment available\n${text}</b>`.replaceAll('\n','<br />'), // html body
    });

    console.log("Message sent: %s", info.messageId);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const checkAppointment = async () => await new Promise((resolve) => {
    return exec(process.env.MEDIHUNTER_RUN_COMMAND, (error, stdout, stderr) => {
        if(stdout.includes('(iteration: 1)') && !stdout.includes('No results found')){
            return resolve(stdout);
        }
        if (stderr) {
            console.log(stderr);
        }
        return resolve(undefined);
    });
});


(async ()=>{
    let appointments;
    while(true){
        appointments = await checkAppointment();
        if(appointments){
            break;
        }
        console.log('no appointments available')
        await sleep(1000 * 90)
    }
    await sendEmail(appointments).catch(console.error);
    console.log('appointment found, app closed');
    await sleep(1000 * 60 * 60)
})()

