import { Router, Request, Response } from 'express';
import User from '../models/User';

const router = Router();

// Create a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// Get user data
router.get('/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// Update user backlog
router.put('/:username/backlog', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { backlog } = req.body;

  try {
    const user = await User.findOneAndUpdate({ username }, { backlog }, { new: true });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user backlog:', error);
    res.status(500).json({ error: 'Error updating user backlog' });
  }
});

export default router;
