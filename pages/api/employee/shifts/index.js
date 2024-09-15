import dbConnect from '../../../../utils/dbConnect';
import Shift from '../../../../model/Shift';
import User from '../../../../model/User';
import jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userEmail = decoded.email;

      
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      
      const shifts = await Shift.find({ employee: user._id })
        .populate('admin', '-password')
        .populate('employee', '-password');

      return res.status(200).json(shifts);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
