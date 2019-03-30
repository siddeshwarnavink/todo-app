<?php

use Siddeshrocks\Models\Comment;
use Siddeshrocks\Models\Task;

return [
  'comments' => function ($root, $args) {
    AuthRequired($root);

    $comments = [];
    $raw_comments = Comment::of($args['type'], $args['payload'])->orderBy('created_at', 'DESC')->get();

    foreach($raw_comments as $comment) {
      $comments[] = transformComment($comment);
    }

    return $comments;
  },

  'postComment' => function ($root, $args) {
    $newComment = new Comment;
    $newComment->user_id = $root['isAuth']->user->id;
    $newComment->message = $args['message'];
    $newComment->type = $args['type'];
    $newComment->payload = $args['payload'];

    $newComment->save();

    switch($args['type']) {
      case 'task':
        $task = Task::find($args['payload']);

        if($task->creator !== $root['isAuth']->user->id)
          notify('add_comment', $root['isAuth']->user->username . ' commented on your task', "/task/" . $task->id , $task->creator);
        break;
    }

    return true;
  }
];
