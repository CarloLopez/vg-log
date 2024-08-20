import mongoose, { Schema, Document } from 'mongoose';

interface INoteItem {
  id: number;
  title: string;
  content: string;
  lastEdited: Date;
}

interface IGoalItem {
  id: number;
  content: string;
  description?: string;
  completed: boolean;
  priority: string;
}

interface IBacklogItem {
  id: number;
  status: string;
  category: number | null;
  notes: INoteItem[];
  goals: IGoalItem[];
}

interface ICategoryItem {
  id: number;
  name: string;
}

interface IUser extends Document {
  username: string;
  password: string;
  backlog: IBacklogItem[];
  categories: ICategoryItem[];
}

const NoteItemSchema = new Schema<INoteItem>({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  lastEdited: { type: Date, default: Date.now, required: true },
});

const GoalItemSchema = new Schema<IGoalItem>({
  id: { type: Number, required: true },
  content: { type: String, required: true },
  description: { type: String, required: false },
  completed: { type: Boolean, required: true },
  priority: { type: String, required: true },
});

const BacklogItemSchema = new Schema<IBacklogItem>({
  id: { type: Number, required: true },
  status: { type: String, required: true },
  category: { type: Number, required: false, default: null },
  notes: { type: [NoteItemSchema], required: false, default: [] },
  goals: { type: [GoalItemSchema], required: false, default: [] },
});

const CategoryItemSchema = new Schema<ICategoryItem>({
  id: {type: Number, required: true},
  name: {type: String, required: true}
})

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  backlog: { type: [BacklogItemSchema], required: false, default: [] },
  categories: { type: [CategoryItemSchema], required: false, default: [] },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
