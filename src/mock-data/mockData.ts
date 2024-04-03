import { BacklogItemState } from "../types/gameTypes"

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