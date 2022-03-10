import sgMail from "@sendgrid/mail"

sgMail.setApiKey(process.env.SENDGRID_KEY)

export const sendRegistrationEmail = async recipientAddress => {
    const msg = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "THIS IS OUR FIRST EMAIL WITH SENDGRID",
        text: "bla bla bla",
        html: "<strong>bla bla bla</strong>",
    }

    await sgMail.send(msg)
}