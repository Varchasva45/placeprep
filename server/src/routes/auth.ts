import express from 'express'
import passport from 'passport'
import { validateData } from '../middlewares/validateData'
import { loginSchema, signupSchema } from '../validations/auth'
import { googleLogin, login, signup } from '../controllers/auth'

const router = express.Router();

router.post('/signup', validateData(signupSchema), signup);
router.post('/login', validateData(loginSchema), login);

router.get('/login/failed', (req, res) => { 
    res.status(401).json({ message: 'Login failed' });
});

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: req.user,
        });
    } 
    res.status(401).json({ message: 'Login failed' });
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { 
            return next(err); 
        }
        res.redirect('http://localhost:5173/');
    });
});

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
    passport.authenticate('google', {
        successRedirect: 'http://localhost:5173/login',
        failureRedirect: '/login/failed',
    }),
    googleLogin
);

export { router as authRouter };