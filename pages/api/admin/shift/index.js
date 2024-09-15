import dbConnect from '../../../../utils/dbConnect';
import Availability from '../../../../model/Availability';
import Shift from '@/model/Shift';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const availabilities = await Availability.find().populate('user', 'email');
    //   console.log(availabilities);
      return res.status(200).json(availabilities);
    } catch (error) {
      console.error('Error fetching availability:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }else if(req.method=='POST'){
    const { date, startTime, endTime,timezone, admin,employee } = req.body;
    try {
      const overlappingShift = await Shift.findOne({
        date,
        employee: { $in: employee },
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },  
          { endTime: { $gt: startTime, $lte: endTime } },    
          { startTime: { $lte: startTime }, endTime: { $gte: endTime } }  
        ]
      });

      if (overlappingShift) {
        return res.status(400).json({ error: 'New Shift Should not over lap with existing shifts' });
      }

      
      const newShift = new Shift({
        date,
        startTime,
        endTime,
        employee,
        timezone,
        admin,
      });

      await newShift.save();
      return res.status(201).json(newShift);
    } catch (error) {
      console.error('Error creating shift:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
