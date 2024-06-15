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

// Login a user
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.cookie('username', username, { httpOnly: true });
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
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

// Add game to backlog
router.post('/:username/backlog', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { game } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.backlog.push(game);
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding game to backlog:', error);
    res.status(500).json({ error: 'Error adding game to backlog' });
  }
});

// Remove game from backlog
router.delete('/:username/backlog/:gameId', async (req: Request, res: Response) => {
  const { username, gameId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.backlog = user.backlog.filter(game => game.id !== parseInt(gameId, 10));
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing game from backlog:', error);
    res.status(500).json({ error: 'Error removing game from backlog' });
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
