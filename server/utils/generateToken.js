import jwt from 'jsonwebtoken'

export const genToken = (Id)=>{
    return jwt.sign({id: Id} , process.env.JWT_SECRET , {expiresIn : "15d"})
}