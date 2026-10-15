import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import { genToken } from "../utils/generateToken.js"

const cookieOptions = {
    httpOnly : true ,
    secure : true
}

export const registerCustomer = async (req, res) => {
    try {
        const { name, uname, email, password } = req.body 

        if (!name || !uname || !email || !password) {
            return res.status(400).json({ message: "All fields required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password length is less than six" })
        }

        const unameExists = await Customer.findOne({ uname })
        if (unameExists) {
            return res.status(409).json({ message: "Username already exists" })
        }

        const emailExists = await Customer.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt) 

        const newCustomer = await Customer.create({
            name,
            uname,
            email,
            password: hashedPass,
        })

        const token = genToken(newCustomer._id)
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({ message: "Customer Created", customerData: newCustomer })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

export const loginCustomer = async (req, res) => {
    try {
        const { email, password } = req.body 
        const customer = await Customer.findOne({ email }) 

        if (!customer) {
            return res.status(404).json({ message: "Customer not Found" })
        }

        const passwordCheck = await bcrypt.compare(password, customer.password)

        if (!passwordCheck) {
            return res.status(400).json({ message: "Wrong Password" })
        }

        const token = genToken(customer._id) 
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({ message: "Customer logged in", customerData: customer })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

export const logoutCustomer = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions) 
        return res.status(200).json({ message: "Logged out successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message })
    }
}

export const getCustomer = (req, res) => {
    return res.status(200).json({ message: "Customer found", customerData: req.customer })
}