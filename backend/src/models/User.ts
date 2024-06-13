import mongoose, { Schema, Document } from 'mongoose';

interface IBacklogItem {
  id: number;
  status: string;
  category: number | null;
  nextGoal?: string;
}

interface INoteItem {
  id: number;
  title: string;
  content: string;
}

interface IGoalItem {
  id: number;
  content: string;
  description?: string;
  completed: boolean;
  priority: string;
}

interface IUser extends Document {
  username: string;
  password: string; // This is for future security implementation
  backlog: IBacklogItem[];
  notes: INoteItem[];
  goals: IGoalItem[];
}

const BacklogItemSchema = new Schema<IBacklogItem>({
  id: { type: Number, required: true },
  status: { type: String, required: true },
  category: { type: Number, required: false },
  nextGoal: { type: String, required: false },
});

const NoteItemSchema = new Schema<INoteItem>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const GoalItemSchema = new Schema<IGoalItem>({
  id: { type: Number, required: true },
  content: { type: String, required: true },
  description: { type: String, required: false },
  completed: { type: Boolean, required: true },
  priority: { type: String, required: true },
});

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // TODO: future security implementation
  backlog: { type: [BacklogItemSchema], required: false, default: [] },
  notes: { type: [NoteItemSchema], required: false, default: [] },
  goals: { type: [GoalItemSchema], required: false, default: [] },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
