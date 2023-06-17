import asyncHandler from 'express-async-handler';

import user from '../models/user.js'

export const signin = asyncHandler(async (req, res) => {
    res.send("This is a user object");
});


export default signin;