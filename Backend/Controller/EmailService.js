import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOTPEmail = async (req, res) => {
    // console(req.body); // Check request body
    const { name, email, otp } = req.body;

    if (!otp) {
        return res.status(400).json({ error: "OTP is missing in request body" });
    }

    // console(typeof otp, otp); // Check OTP value

    const Otp = typeof otp === "string" ? otp.split("") : [];

    const templatePath = path.join(__dirname, "../views", "SignupOTP.hbs");
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ name, email, Otp });

    // console(htmlContent); // Ensure OTP is rendering correctly

    const mailOptions = {
        from: `CodeVerse <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your OTP Verification Code",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};


export const sendSignUpSuccessfulEmail = async (req, res) => {
    // console(req.body);
    const { name, email, username } = req.body;
    const templatePath = path.join(__dirname, "../views", 'SignupSuccess.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ name, username });

    const mailOptions = {
        from: `CodeVerse <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Welcome to Our Platform",
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        // console("OTP email sent successfully.");
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};


export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `https://admin-codeverse.vercel.app/verify?token=${token}`;

    const templatePath = path.join(__dirname, "../views", 'Verification.hbs');
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(templateSource);
    let htmlContent = template({ verificationUrl });

    await transporter.sendMail({
        from: `CodeVerse Admin <${process.env.MAIL_USER}`,
        to: email,
        subject: 'Complete Your Registration',
        html: htmlContent
    });
};
