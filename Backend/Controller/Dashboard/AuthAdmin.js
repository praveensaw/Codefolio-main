import { sendVerificationEmail } from "../EmailService.js";
import PendingAdmin from "../../Models/Admin/PendingAdmin.js";
import Admin from "../../Models/Admin/Admin.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
export const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, company } = req.body;

        // Check if already exists in pending or registered users (optional)
        const existing = await PendingAdmin.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Verification already sent. Please check your email.' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists.' });
        }

        // Generate secure token
        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save pending user to DB
        const pendingAdmin = new PendingAdmin({
            firstName,
            lastName,
            email,
            company,
            token,
            tokenExpires
        });

        await pendingAdmin.save();

        // Send email
        await sendVerificationEmail(email, token);

        res.status(200).json({ success: true, message: 'Verification email sent. Please check your inbox.' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


export const verifyAndRegisterAdmin = async (req, res) => {
    try {
        const { token } = req.query;
        const { password } = req.body;

        // Find pending user by token
        const pendingAdmin = await PendingAdmin.findOne({ token });

        if (!pendingAdmin || pendingAdmin.tokenExpires < new Date()) {
            await PendingAdmin?.deleteOne({ _id: pendingAdmin._id });
            return res.status(400).json({ message: 'Token is invalid or has expired.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to User collection
        const newAdmin = new Admin({
            firstName: pendingAdmin.firstName,
            lastName: pendingAdmin.lastName,
            email: pendingAdmin.email,
            company: pendingAdmin.company,
            password: hashedPassword
        });

        await newAdmin.save();

        // Remove from PendingUser collection
        await PendingAdmin.deleteOne({ _id: pendingAdmin._id });

        res.status(200).json({ success: true, message: 'Registration complete. You can now log in.' });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
};


// GET /api/admin/verify-token?token=...
export const checkTokenValidity = async (req, res) => {
    const { token } = req.query;

    try {
        const pendingAdmin = await PendingAdmin.findOne({
            token,
            tokenExpires: { $gt: new Date() },
        });

        if (!pendingAdmin) {
            return res.json({ valid: false });
        }

        console.log(true);

        res.json({ valid: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ valid: false });
    }
};

export const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        // Find user by email
        let user = await Admin.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(403).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Check if user is admin and verified
        if (!user.isVerified || user.isVerified === false) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin not verified.",
            });
        }

        // Password is valid, create JWT token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h",
        });

        user = user.toObject();
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Admin logged in successfully",
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
};


export const getAdmins = async (req, res) => {
    try {

        const admins = await Admin.find({})

        if (!admins) {
            return res.status(404).json({ message: "No admins found" })
        }


        res.status(200).json(admins)
    } catch (error) {
        // Log the error and return a 500 response
        console.error("Error fetching admins:", error)
        res.status(500).json({ error: "An error occurred while fetching admins." })
    }
}

export const changeAdminStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const admins = await Admin.findById(id)

        if (!admins) {
            return res.status(404).json({ message: "No admins found" })
        }

        admins.isVerified = !admins.isVerified;
        await admins.save()

        res.status(200).json({
            success: true
        })
    } catch (error) {
        // Log the error and return a 500 response
        console.error("Error fetching admins:", error)
        res.status(500).json({ error: "An error occurred while fetching admins." })
    }
}

