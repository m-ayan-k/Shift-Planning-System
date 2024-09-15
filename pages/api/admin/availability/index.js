import dbConnect from '../../../../utils/dbConnect';
import Availability from '../../../../model/Availability';
import jwt from 'jsonwebtoken';
import User from '@/model/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const { role, email } = req.query;

    try {
      if (role === 'employee') {
        const employees = await User.find({ role: 'employee' });
        return res.status(200).json(employees);
      }

      if (email) {
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({ message: 'Employee not found' });
        }

        const availability = await Availability.find({ user: user._id });

        return res.status(200).json({
          employee: user,
          availability,
        });
      }

      return res.status(400).json({ message: 'Invalid request parameters' });

    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
