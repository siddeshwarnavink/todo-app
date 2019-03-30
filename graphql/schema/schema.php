<?php

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Utils\BuildSchema;

use Illuminate\Database\Capsule\Manager as DB;

use Siddeshrocks\Models\Notification;
use Siddeshrocks\Models\User;
use Siddeshrocks\Models\Group;

function taskMember($id) {
    $currentTaskMembers = DB::table('task_user')
        ->where('task_id', $id)
        ->pluck('user_id');

    $currentTaskMembers_array = [];

    foreach($currentTaskMembers as $key => $memberId) {
        $currentTaskMembers_array[$key] = $memberId;
    }

    return $currentTaskMembers_array;
}

function transformGroup($group) {
    $group['creator'] = $group->creator();
    $group['members'] = $group->members();

    return $group;
}

function transformTask($task, $userId) {
    $task['creator'] = $task->creator();
    if($task['groupId'] !== 0) {
        $group = Group::where('id', $task['groupId'])->first();
        $task['group'] = transformGroup($group);
    } else {
        $task['group'] = $task['groupId'];
    }
    unset($task['groupId']);

    $task['members'] = $task->members();
    $task['completed'] = $task->isCompleted($userId);
    $task['taskDone'] = $task->isDone();

    return $task;
}

function transformCompany($company) {
    $members = User::where('company', $company->id);
    $groups = Group::where('company', $company->id);

    $company['members'] = $members->get();
    $company['membersCount'] = $members->count();
    $company['groupsCount'] = $groups->count();

    $groups = $groups->get();
    foreach($groups as $index => $group) {
        $groups[$index] = transformGroup($group);
    }

    $company['groups'] = $groups;

    return $company;
}

function transformComment($comment)  {
  $returnComment = (array) $comment;
  $returnComment['creator'] = User::find($comment->user_id);
  return $returnComment;
}

function notify($icon, $content, $link, $userId) {
    $newNotify = new Notification();

    $newNotify->icon = $icon;
    $newNotify->message  = $content;
    $newNotify->link = $link;
    $newNotify->user_id = $userId;

    $newNotify->save();
}

$contents = file_get_contents('./graphql/schema/schema.graphql');
$schema = BuildSchema::build($contents);

return $schema;
