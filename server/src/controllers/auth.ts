import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'samplejwtsecret';

export const signup = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if(user) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            email,
            password: hash,
        });

        const payload = {
            id: newUser._id,
            email: newUser.email,
        };

        res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error while signing up user, please try again.',
        });
    }
}


export const login = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        console.log({
            user,
            email,
            password
        })

        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isValid = bcrypt.compareSync(password, user.password);

        if(!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log(isValid);

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            user,
            message: 'User logged in successfully',
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error while logging in user, please try again.',
        });
    }
}

export const googleLogin = async (req: Request, res: Response) => {

    try {
        const user = req.user;

        if(!user) {
            return res.status(401).json({ message: 'Login failed' });
        }

        console.log('user', user);
        res.status(200).redirect('http://localhost:5173/playground');
    } catch (error) {
        res.status(500).redirect('http://localhost:5173/');
    }
}
