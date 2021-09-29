import jwt from 'jsonwebtoken';

type userTypes = {
    name: string,
    username: string,
    email: string,
    password: string,
    id: string
}

//generation of token
const secret: string = process.env.JWT_SECRETKEY as string;
const days: string = process.env.JWT_SIGNIN_EXPIRES as string
export const generateJwtToken = (user : userTypes) => {
    const { id, username, password , email, name} = user;
    return jwt.sign({ id, username, password , email, name}, secret, {
        expiresIn: days,
    });
}

