import * as actionTypes from "./actionTypes";
import axios from "../../axios";

import * as actions from "./";

// Sync
const groupTaskStart = () => ({
  type: actionTypes.GROUP_TASKS_START
});

const groupTaskSuccess = groupTasks => ({
  type: actionTypes.GROUP_TASKS_SUCCESS,
  groupTasks
});

const taskStart = () => ({
  type: actionTypes.TASK_START
});

const taskSuccess = task => ({
  type: actionTypes.TASK_SUCCESS,
  task
});

const taskMembersStart = () => ({
  type: actionTypes.TASK_MEMBERS_START
});

const taskMembersSuccess = taskMembers => ({
  type: actionTypes.TASK_MEMBERS_SUCCESS,
  taskMembers
});

const tasksStart = () => ({
  type: actionTypes.TASKS_START
});

const tasksSuccess = tasks => ({
  type: actionTypes.TASKS_SUCCESS,
  tasks
});

const removeTask = taskId => ({
  type: actionTypes.REMOVE_TASK,
  taskId
});

// Async
export const initGroupTasks = groupId => dispatch => {
  dispatch(groupTaskStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          groupTask(groupId: ${groupId}) {
            id,
            title,
            description
            creator {
              id
            }
            completed
          }
        }
        `
      })
    )
    .then(({ data }) => {
      dispatch(groupTaskSuccess(data.data.groupTask));
    });
};

export const initTask = taskId => dispatch => {
  dispatch(taskStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
          {
            task(taskId: ${taskId}) {
              title,
              description,
              completed,
              taskDone,
              creator {
                id
                username
              }
              members {
                user {
                  id,
                  username,
                }
              }
              group {
                id
              },
              starts_at,
              ends_at
            }
          }
        `
      })
    )
    .then(({ data }) => {
      dispatch(taskSuccess(data.data.task));
    })
    .catch(() => {
      alert("Task failed to load / does not exist!");
      window.location.assign("/");
    });
};

export const initTaskMembers = taskId => dispatch => {
  dispatch(taskMembersStart());
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          task(taskId: ${taskId}) {
            members {
              user {
                id
                username
                isAdmin
              },
              completed
            }
          }
        }
        `
      })
    )
    .then(({ data }) => {
      dispatch(taskMembersSuccess(data.data.task.members));
    });
};

export const createTask = (task, goFunc) => dispatch => {
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        mutation {
          createTask(title: "${task.title}", description: "${
          task.description
        }", starts_at: "${task.starts_at}", ends_at: "${
          task.ends_at
        }", groupId: ${task.groupId}, members: "[${task.members}]")
        }
        `
      })
    )
    .then(() => {
      dispatch(
        actions.notify({
          message: "Task created!"
        })
      );

      goFunc("/group/" + task.groupId);
    });
};

export const completeTask = (taskId, goFunc) => dispatch => {
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
    mutation {
      completeTask(taskId: ${taskId})
    }
    `
      })
    )
    .then(() => {
      dispatch(
        actions.notify({
          message: "Task Completed"
        })
      );
      goFunc("/task/" + taskId);
      dispatch(initTask(taskId));
      dispatch(removeTask(taskId));
    });
};

export const initTasks = () => dispatch => {
  dispatch(tasksStart());

  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
        {
          tasks {
            id
            title
            description
            creator {
              id
            }
            completed
          }
        }
        `
      })
    )
    .then(({ data }) => {
      dispatch(tasksSuccess(data.data.tasks));
    });
};

export const editTask = (task, taskId, goFunc) => dispatch => {
  axios
    .post(
      `/?token=${localStorage.getItem("token")}`,
      JSON.stringify({
        query: `
          mutation {
            editTask(id: ${taskId}, title: "${task.title}", description: "${
          task.description
        }", starts_at: "${new Date(task.starts_at)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}", ends_at: "${new Date(task.ends_at)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}", groupId: ${task.groupId}, members: "[${
          task.members
        }]")
          }
        `
      })
    )
    .then(() => {
      dispatch(
        actions.notify({
          message: "Task Updated"
        })
      );
      goFunc("/task/" + taskId);
      dispatch(initTask(taskId));
    });
};
