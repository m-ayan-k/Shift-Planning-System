import dbConnect from '../../../../utils/dbConnect';
import Availability from '../../../../model/Availability';
import User from '../../../../model/User';
import jwt from 'jsonwebtoken';



export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
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

      const availabilityEntries = req.body;

      
      for (const entry of availabilityEntries) {
        const { date, startTime, endTime, timezone } = entry;

        if (!date || !startTime || !endTime || !timezone) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        const start = new Date(`${date}T${startTime}`);
        const end = new Date(`${date}T${endTime}`);

        if (end - start < 4 * 60 * 60 * 1000) {
          return res.status(400).json({ error: 'Availability must be for at least four hours' });
        }
        entry.user=user._id;
      }

      const savedEntries = await Availability.insertMany(availabilityEntries);

      return res.status(201).json({ message: 'Availability added successfully',data:savedEntries });
    } catch (error) {
      console.error('Error saving availability:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  else if (req.method === 'GET') {
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

      const avaList = await Availability.find({ user: user._id });

      return res.status(200).json(avaList);
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } 
  else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
