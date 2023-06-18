import asyncHandler from 'express-async-handler';

import user from '../models/user.js'

export const signin = asyncHandler(async (req, res) => {
    res.send("This is a signin object");
});

export const signup = asyncHandler(async (req, res) => {
    res.send("This is a signup object");
});

export default signin;