import type { NextApiRequest, NextApiResponse } from 'next';
import brycpt from "bcryptjs";
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }
    const { name, email, password } =req.body; 

    if(!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        await connectToDatabase();

        const existingUser = await User.findOne({ email})

        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });

        }

        const hashedPassword = await brycpt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}