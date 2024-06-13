import { BacklogItemState, NoteItem, GoalItem } from "../types/gameTypes"

export const MOCK_CATEGORIES = [
  {id: 1, name: 'category example 1'},
  {id: 2, name: 'category example 2'},
]

export const MOCK_BACKLOG: BacklogItemState[] = [
  {id: 186725, status: 'notStarted', category: 1},
  {id: 191692, status: 'notStarted', category: null},
  {id: 36926, status: 'inProgress', category: 1, nextGoal:'placeholder'},
  {id: 1164, status: 'notStarted', category: null},
  {id: 17000, status: 'dropped', category: 2},
  {id: 11208, status: 'inProgress', category: null, nextGoal:'placeholder'},
  {id: 174558, status: 'notStarted', category: 1},
  {id: 1942, status: 'inProgress', category: null, nextGoal:'placeholder'},
  {id: 119171, status: 'notStarted', category: null},
  {id: 40477, status: 'dropped', category: 2},
  {id: 386, status: 'notStarted', category: null, nextGoal:'placeholder'},
  {id: 132181, status: 'completed', category: 2},
]

export const MOCK_NOTES: NoteItem[] = [
  {id: 1, title: "Note 1", content: "Content 1"},
  {id: 45, title: "Note 2", content: "Content 2"},
  {id: 35, title: "Note 3", content: "Content 3"},
  {id: 2, title: "Note 4", content: "Content 4"},
]

export const MOCK_GOALS: GoalItem[] = [
  {id: 1, content: "Goal 1", description: "description 1", completed: false, priority: 'critical'},
  {id: 45, content: "Goal 2", completed: false, priority: 'high'},
  {id: 35, content: "Goal 3", completed: false, priority: 'medium'},
  {id: 2, content: "Goal 4", description: "description 4", completed: false, priority: 'low'},
]