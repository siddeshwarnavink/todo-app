import * as actionTypes from "../actions/actionTypes";
import updateObject from "../../utility/updateObject";

const initialState = {
  groupTasksLoading: false,
  groupTasks: [],
  taskLoading: false,
  task: {},
  taskMembersLoading: false,
  taskMembers: []
};

const groupTaskStart = (state, action) => {
  return updateObject(state, {
    groupTasksLoading: true
  });
};

const groupTaskSuccess = (state, action) => {
  return updateObject(state, {
    groupTasksLoading: false,
    groupTasks: action.groupTasks
  });
};

const taskStart = (state, action) => {
  return updateObject(state, {
    taskLoading: true
  });
};

const taskSuccess = (state, action) => {
  return updateObject(state, {
    taskLoading: false,
    task: action.task
  });
};

const taskMembersStart = (state, action) => {
  return updateObject(state, {
    taskMembersLoading: true
  });
};

const taskMembersSuccess = (state, action) => {
  return updateObject(state, {
    taskMembersLoading: false,
    taskMembers: action.taskMembers
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GROUP_TASKS_START:
      return groupTaskStart(state, action);

    case actionTypes.GROUP_TASKS_SUCCESS:
      return groupTaskSuccess(state, action);

    case actionTypes.TASK_START:
      return taskStart(state, action);

    case actionTypes.TASK_SUCCESS:
      return taskSuccess(state, action);

    case actionTypes.TASK_MEMBERS_START:
      return taskMembersStart(state, action);

    case actionTypes.TASK_MEMBERS_SUCCESS:
      return taskMembersSuccess(state, action);

    default:
      return state;
  }
};

export default reducer;
