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

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'User signed up successfully',
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                isSubscribed: newUser.isSubscribed,
            }
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
            message: 'User logged in successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                isSubscribed: user.isSubscribed,
            }
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
        const user: any = req.user;
        if(!user || !user.emails || !user.emails[0].value) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const email = user.emails[0].value;
        const name = user.displayName;
        const userExists = await User.findOne({ email });

        if(userExists) {
            const payload = {
                id: userExists._id,
                email: userExists.email,
            };

            const userDetails = {
                id: userExists._id,
                email: userExists.email,
                isSubscribed: userExists.isSubscribed,
            }
    
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token);
            res.cookie('user', JSON.stringify(userDetails));
            res.redirect(`http://localhost:5173/u/${userExists._id}`);

        } else {
            const newUser = await User.create({
                email,
                name,
            });

            const payload = {
                id: newUser._id,
                email: newUser.email,
            };

            const userDetails = {
                id: newUser._id,
                email: newUser.email,
                isSubscribed: newUser.isSubscribed,
            }

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token);
            res.cookie('user', JSON.stringify(userDetails));
            res.redirect(`http://localhost:5173/u/${newUser._id}`);
        }        
    } catch (error) {
        res.status(500).redirect('http://localhost:5173/login');
    }
}

export const githubLogin = async (req: Request, res: Response) => {
    try {
        const user: any = req.user;
        
        if(!user) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const githubAccount = user.profileUrl;
        const userName = user.username;

        const userExists = await User.findOne({ githubAccount });

        if(userExists) {
            const payload = {
                id: userExists._id,
                githubAccount: userExists.githubAccount,
            };

            const userDetails = {
                id: userExists._id,
                githubAccount: userExists.githubAccount,
                isSubscribed: userExists.isSubscribed,
            }

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token);
            res.cookie('user', JSON.stringify(userDetails));
            res.redirect(`http://localhost:5173/u/${userExists._id}`);
        } else {
            const newUser = await User.create({
                githubAccount,
                name: userName,
            });

            const payload = {
                id: newUser._id,
                githubAccount: newUser.githubAccount,
            };

            const userDetails = {
                id: newUser._id,
                githubAccount: newUser.githubAccount,
                isSubscribed: newUser.isSubscribed,
            }

            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token);
            res.cookie('user', JSON.stringify(userDetails));
            res.redirect(`http://localhost:5173/u/${newUser._id}`);
        }
    } catch (error) {
        res.redirect('http://localhost:5173/login');
    }
}
