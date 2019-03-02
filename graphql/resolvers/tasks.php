<?php

use Siddeshrocks\Models\Task;

use Illuminate\Database\Capsule\Manager as DB;

use Respect\Validation\Validator as v;

return [
    'createTask' => function($root, $args) {
        AuthRequired($root);

        $taskData = [
            'title' => $args['title'],
            'description' => $args['description'],
            'creator' => $root['isAuth']->user->id,
            'starts_at' => $args['starts_at'],
            'ends_at' => $args['ends_at'],
            'groupId' => $args['groupId'],
        ];

        $validation = $root['validator']()->validate($taskData, [
            'title' => v::notEmpty(),
            'description' => v::notEmpty(),
            'starts_at' => v::notEmpty(),
            'ends_at' => v::notEmpty(),
            'groupId' => v::notEmpty()->numeric(),
        ]);

        if($validation->failed()) {
            throw new Exception('Invalid user input!');
        }

        Task::create($taskData);
        $currentTask = Task::orderBy('created_at', 'desc')->first();

        $updateMember = [];

        foreach(json_decode($args['members']) as $memberId) {
            $updateMember[] = [
                'task_id' => $currentTask->id,
                'user_id' => $memberId,
                'completed' => 0
            ];

            notify('notes', 'You have been assigned a task', "/task/{$currentTask->id}" , $memberId);
        }

        DB::table('task_user')->insert($updateMember);

        return true;
    },

    'groupTask' => function($root, $args) {
        AuthRequired($root);
        $tasks = Task::where('groupId', $args['groupId'])->get();

        foreach($tasks as $key => $task) {
            $tasks[$key] = transformTask($tasks[$key], $root['isAuth']->user->id);
        }

        return $tasks;
    },

    'task' => function($root, $args) {
        AuthRequired($root);

        $isMember = DB::table('task_user')
            ->where('task_id', $args['taskId'])
            ->where('user_id', $root['isAuth']->user->id)
            ->first();

        if(!$root['isAuth']->user->isAdmin && !$isMember) {
            throw new Exception('You must be a member of this task to access it!');
        }

        $task = Task::where('id', $args['taskId'])->first();

        return transformTask($task, $root['isAuth']->user->id);
    },

    'completeTask' => function($root, $args) {
        $taskRelation = DB::table('task_user')
                        ->where('task_id', $args['taskId'])
                        ->where('user_id', $root['isAuth']->user->id)
                        ->first();

        DB::table('task_user')
            ->where('id', $taskRelation->id)
            ->update(['completed' => 1]);

        return true;
    },

    'editTask' => function($root, $args) {
        AuthRequired($root);
        
        $taskData = [
            'title' => $args['title'],
            'description' => $args['description'],
            'starts_at' => $args['starts_at'],
            'ends_at' => $args['ends_at'],
            'groupId' => $args['groupId'],
        ];

        $validation = $root['validator']()->validate($taskData, [
            'title' => v::notEmpty(),
            'description' => v::notEmpty(),
            'starts_at' => v::notEmpty(),
            'ends_at' => v::notEmpty(),
            'groupId' => v::notEmpty()->numeric(),
        ]);

        if($validation->failed()) {
            throw new Exception('Invalid user input!');
        }

        $task = Task::where('id', $args['id']);
        $task->update($taskData);
        
        $currentTaskMembers = taskMember($args['id']);

        $insertList = [];
        $removeList = [];

        $members = json_decode($args['members']);

        foreach($members as $newMemberId) {
            if(!in_array($newMemberId, $currentTaskMembers)) {
                $insertList[] = [
                    'task_id' => $args['id'],
                    'user_id' => $newMemberId,
                    'completed' => 0
                ];

                notify('notes', 'You have been assigned a task', "/task/{$args['id']}" , $newMemberId);
            }
        }

        DB::table('task_user')->insert($insertList);

        foreach($currentTaskMembers as $memberId) {
            if(!in_array($memberId, $members)) {
                $removeList[] = $memberId;
            }
        }

        foreach($removeList as $removeUID) {
            DB::table('task_user')
                ->where('task_id', $args['id'])
                ->where('user_id', $removeUID)
                ->delete();

            notify('remove_circle_outline', 'You have been removed from a task', "/task/{$args['id']}" , $removeUID);
        }

        return true;
    },

    'deleteTask' => function ($root, $args) {
        AuthRequired($root);

        Task::where('id', $args['id'])->delete();
        DB::table('task_user')->where('task_id', $args['id'])->delete();

        return true;
    }
];
