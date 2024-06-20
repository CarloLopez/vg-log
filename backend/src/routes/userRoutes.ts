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
      res.cookie('username', username, { httpOnly: true, path: '/' });
      res.json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Check if user is logged in
router.get('/check-auth', async (req: Request, res: Response) => {
  const username = req.cookies.username;

  if (!username) {
    return res.status(401).json({ error: 'Not authenticated' }); // unauthorised if no username cookie
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    return res.status(200).json({ username });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return res.status(500).json({ error: 'Error checking authentication' });
  }
});

// Logout and clear the cookie
router.post('/logout', (req: Request, res: Response) => {
  res.cookie('username', '', { maxAge: 0, path: '/' });
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get user data
router.get('/me', async (req: Request, res: Response) => {
  const username = req.cookies.username;

  if (!username) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

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
      user.backlog = user.backlog.filter(game => game.id !== Number(gameId));
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

// Update Game Status
router.put('/:username/backlog/:gameId/status', async (req: Request, res: Response) => {
  const { username, gameId } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findOne({ username });
    const whitelist = ['notStarted', 'inProgress', 'completed', 'dropped'];

    if (!whitelist.includes(status)) {
      res.status(404).json({ error: 'Status Not Valid.' });
    }

    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {
        game.status = status;
        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating game status:', error);
    res.status(500).json({ error: 'Error updating game status' });
  }
});

// Add a note to a backlog game
router.post('/:username/backlog/:gameId/notes', async (req: Request, res: Response) => {
  const { username, gameId } = req.params;
  const { note } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {

        const newNote = {
          ...note,
          id: game.notes.length,
          lastEdited: new Date(),
        }

        game.notes.push(newNote);
        await user.save();
        res.json(newNote);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding note to game:', error);
    res.status(500).json({ error: 'Error adding note to game' });
  }
});

// Remove a note from a backlog game
router.delete('/:username/backlog/:gameId/notes/:noteId', async (req: Request, res: Response) => {
  const { username, gameId, noteId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {
        game.notes = game.notes.filter(note => note.id !== Number(noteId));
        
        const threshold = Number(noteId);
        game.notes.forEach(note => {
          if (note.id > threshold) {
            note.id--;
          }
        })
        
        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing note from game:', error);
    res.status(500).json({ error: 'Error removing note from game' });
  }
});

// Edit a note in a backlog game
router.put('/:username/backlog/:gameId/notes/:noteId', async (req: Request, res: Response) => {
  const { username, gameId, noteId } = req.params;
  const { title, content } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {
        const note = game.notes.find(note => note.id === Number(noteId));
        if (note) {
          note.title = title;
          note.content = content;
          note.lastEdited = new Date();
          await user.save();
          res.json(note);
        } else {
          res.status(404).json({ error: 'Note not found' });
        }
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing note:', error);
    res.status(500).json({ error: 'Error editing note' });
  }
});

// Add a goal to a backlog game
router.post('/:username/backlog/:gameId/goals', async (req: Request, res: Response) => {
  const { username, gameId } = req.params;
  const { goal } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {

        const newGoal = {
          ...goal,
          id: game.goals.length,
        }
        
        game.goals.push(newGoal);
        await user.save();
        res.json(newGoal);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding goal to game:', error);
    res.status(500).json({ error: 'Error adding goal to game' });
  }
});

// Remove a goal from a backlog game
router.delete('/:username/backlog/:gameId/goals/:goalId', async (req: Request, res: Response) => {
  const { username, gameId, goalId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {
        game.goals = game.goals.filter(goal => goal.id !== Number(goalId));
        
        // shift remaining goals' IDs to fill in ID gap
        const threshold = Number(goalId);
        game.goals.forEach(goal => {
          if (goal.id > threshold) {
            goal.id--;
          }
        })

        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error removing goal from game:', error);
    res.status(500).json({ error: 'Error removing goal from game' });
  }
});

// Edit a goal in a backlog game
router.put('/:username/backlog/:gameId/goals/:goalId', async (req: Request, res: Response) => {
  const { username, gameId, goalId } = req.params;
  const { content, description, completed, priority } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(game => game.id === Number(gameId));
      if (game) {
        const goal = game.goals.find(goal => goal.id === Number(goalId));
        if (goal) {
          goal.content = content;
          goal.description = description;
          goal.completed = completed;
          goal.priority = priority;
          await user.save();
          res.json(user);
        } else {
          res.status(404).json({ error: 'Goal not found' });
        }
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing goal:', error);
    res.status(500).json({ error: 'Error editing goal' });
  }
});

// Add a new category
router.post('/:username/categories', async (req: Request, res: Response) => {
  const { username } = req.params;
  const { categoryName } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {

      const category = {
        id: user.categories.length,
        name: categoryName,
      }

      user.categories.push(category);
      await user.save();
      res.json(category);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Error adding category' });
  }
});

// Edit a category
router.put('/:username/categories/:categoryId', async (req: Request, res: Response) => {
  const { username, categoryId } = req.params;
  const { name } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const category = user.categories.find(cat => cat.id === parseInt(categoryId, 10));
      if (category) {
        category.name = name;
        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error editing category:', error);
    res.status(500).json({ error: 'Error editing category' });
  }
});

// Delete a category and update backlog items
router.delete('/:username/categories/:categoryId', async (req: Request, res: Response) => {
  const { username, categoryId } = req.params;

  try {
    const user = await User.findOne({ username });
    if (user) {
      user.categories = user.categories.filter(cat => cat.id !== parseInt(categoryId, 10));
      user.backlog = user.backlog.map(item => {
        if (item.category === Number(categoryId)) {
          item.category = null;
        }
        return item;
      });
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Error deleting category' });
  }
});

// Update the category of a backlog game
router.put('/:username/backlog/:gameId/category', async (req: Request, res: Response) => {
  const { username, gameId } = req.params;
  const { categoryId } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) {
      const game = user.backlog.find(item => item.id === parseInt(gameId, 10));
      if (game) {

        if (game.category === categoryId) {
          game.category = null;
        } else {
          game.category = categoryId;
        }

        await user.save();
        res.json(user);
      } else {
        res.status(404).json({ error: 'Game not found in backlog' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating game category:', error);
    res.status(500).json({ error: 'Error updating game category' });
  }
});

export default router;
