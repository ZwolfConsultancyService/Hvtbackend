const express = require("express");
const adminmodel = require("../Model/adminschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../Model/adminschema");
require("dotenv").config();
const nodemailer = require("nodemailer")
// Controller to create a new admin
const createadmin = async (req, res) => {
    const data = req.body;  // Added this line to properly capture the body data
    const newadmin = new adminmodel(data);

    try {
        const emailExist = await adminmodel.findOne({ email: data.email });
        if (emailExist) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        newadmin.password = hashedPassword;
        await newadmin.save();

        return res.status(201).json({ message: "Admin created successfully", result: newadmin });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body); // For debugging purposes

    try {
        const admin = await adminmodel.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: "Email is incorrect!" });
        }

        const result = await bcrypt.compare(password, admin.password);
        if (!result) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Payload should contain only non-sensitive data
        const payload = { id: admin._id, email: admin.email, role: admin.role }; // Example payload
        const token = jwt.sign(payload, process.env.secret_key, { expiresIn: '1h' }); // Add expiration

        console.log("Generated JWT Token:", token); // Debugging log

        return res.status(200).json({
            success: true,
            message: "Admin Logged in Successfully",
            token: token,
            result: admin
        });
    } catch (error) {
        console.error("Error during login:", error); // Debugging log
        return res.status(500).json({ message: error.message });
    }
};

// Controller to handle password reset request
const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        // Find the admin by email
        const checkadmin = await adminmodel.findOne({ email });  // Use correct model instance
        if (!checkadmin) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        checkadmin.otp = otp;

        // Set OTP expiry time (10 minutes from now)
        checkadmin.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiration

        // Save the OTP to the database
        await checkadmin.save();  // Save using the instance

        // Send OTP to user's email
        await sendOTPEmail(checkadmin);  // Pass the instance to the function

        return res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Step 2: Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Find the admin by email
        const admin = await adminmodel.findOne({ email }); // Correct model usage
        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP matches and is not expired
        if (admin.otp == otp && admin.otpExpiresAt > new Date()) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            admin.password = hashedPassword;
            admin.otp = null;
            admin.otpExpiresAt = null;

            await admin.save();  // Save using the instance

            return res.status(200).json({ message: "Password reset successfully" });
        } else {
            console.log("OTP validation failed");
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to send OTP email
const sendOTPEmail = async (admin) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.mail,
            pass: process.env.password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: 'Reset your password',
        text: `Your OTP is: ${admin.otp}`  // Corrected to use instance
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error.message);
    }

    // After generating OTP
    console.log("Generated OTP:", admin.otp);
    console.log("OTP Expiry Time:", admin.otpExpiresAt);
};

// OTP Verification Controller
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const admin = await adminmodel.findOne({ email }); // Correct model usage
        console.log(admin); // Log the user's document to see if OTP is being saved correctly

        if (!admin) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!admin.otp || Number(admin.otp) !== Number(otp)) { // Ensure both are numbers for comparison
            console.log("Invalid OTP");
            console.log(admin.otp); // Log the user's OTP to see if it matches the entered OTP
            console.log(otp); // Log the entered OTP to see if it matches the user's OTP
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Update user's verified status
        admin.verified = true;
        await admin.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createadmin,
    login,
    requestPasswordReset,
    resetPassword,
    verifyOTP
};


