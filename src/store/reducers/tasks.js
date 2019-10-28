import * as actionTypes from '../actions/actionTypes';
import updateObject from '../../utility/updateObject';

const initialState = {
     groupTasksLoading: false,
     groupTasks: [],
     taskLoading: false,
     task: {},
     taskMembersLoading: false,
     taskMembers: [],
     tasks: [],
     tasksLoading: false,
     todos: [],
};

const groupTaskStart = (state, action) => {
     return updateObject(state, {
          groupTasksLoading: true,
     });
};

const groupTaskSuccess = (state, action) => {
     return updateObject(state, {
          groupTasksLoading: false,
          groupTasks: action.groupTasks,
     });
};

const taskStart = (state, action) => {
     return updateObject(state, {
          taskLoading: true,
     });
};

const taskSuccess = (state, action) => {
     return updateObject(state, {
          taskLoading: false,
          task: action.task,
     });
};

const taskMembersStart = (state, action) => {
     return updateObject(state, {
          taskMembersLoading: true,
     });
};

const taskMembersSuccess = (state, action) => {
     return updateObject(state, {
          taskMembersLoading: false,
          taskMembers: action.taskMembers,
     });
};

const tasksStart = (state, action) => {
     return updateObject(state, {
          tasksLoading: true,
          tasks: [],
     });
};

const tasksSuccess = (state, action) => {
     return updateObject(state, {
          tasksLoading: false,
          tasks: action.tasks,
     });
};

const removeTask = (state, action) => {
     let updatedTasks = [...state.tasks].filter(
          task => task.id !== action.taskId,
     );

     return updateObject(state, {
          tasks: updatedTasks,
     });
};

const setTodos = (state, action) => {
     return updateObject(state, {
          loading: false,
          todos: action.todos,
     });
};

const deleteTask = (state, action) => {
     return updateObject(state, {
          tasks: state.tasks.filter(t => t.id !== action.id),
          groupTasks: state.groupTasks.filter(t => t.id !== action.id),
     });
}

const deleteTodo = (state, action) => {
     return updateObject(state, {
          todos: state.todos.filter(t => t.id !== action.id)
     });
}

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

          case actionTypes.TASKS_START:
               return tasksStart(state, action);

          case actionTypes.TASKS_SUCCESS:
               return tasksSuccess(state, action);

          case actionTypes.REMOVE_TASK:
               return removeTask(state, action);

          case actionTypes.SET_TODOS:
               return setTodos(state, action);

          case actionTypes.DELETE_TASK:
               return deleteTask(state, action);
          
          case actionTypes.DELETE_TODO:
               return deleteTodo(state, action);

          case actionTypes.COMPLETE_TASK_FROM_LST:
               return deleteTask(state, action);

          case actionTypes.COMPLETE_TODO_FROM_LST:
               return deleteTodo(state, action);

          default:
               return state;
     }
};

export default reducer;
