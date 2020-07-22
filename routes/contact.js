const {Router} = require('express');
const router = Router();
const nodemailer = require('nodemailer');
const keys = require('../keys/index');
const contactEmail = require('../emails/contactEmail');
const {validationResult} = require('express-validator');
const {sendContactEmailValidators} = require('../utils/validators');


const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 587,
    secure: false,
    auth: {
        user: keys.MAIL_USER,
        pass: keys.MAIL_PASS,
    }
});


router.post('/', sendContactEmailValidators, async (req, res) => {

    try {
        const {email, name, message} = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('sendContactEmailError', errors.array()[0].msg);
            res.status(422).redirect('/');
        }

        res.redirect('/');
        await transporter.sendMail(contactEmail(email, name, message));
    } catch (e) {
        console.log(e);
    }

})

module.exports = router;