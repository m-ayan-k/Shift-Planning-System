import dbConnect from '../../../utils/dbConnect';
import User from '../../../model/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await dbConnect();

    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      {
        email: user.email,
        role: user.role,
        timezone: user.timezone,
        id:user._id,
      },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: 'Login successful',
      token, 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
