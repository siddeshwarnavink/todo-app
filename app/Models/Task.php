<?php

namespace Siddeshrocks\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'title',
        'description',
        'creator',
        'starts_at',
        'ends_at',
        'groupId'
    ];

    public function members()
    {
        $users = [];
        $relations = DB::table('task_user')->where('task_id', $this->id)->get();

        foreach($relations as $relation) {
            $user = User::where('id', $relation->user_id)->first();
            $isCompleted = (bool) DB::table('task_user')
                            ->where('task_id', $this->id)
                            ->where('user_id', $user->id)
                            ->first()
                            ->completed;

            $users[] = [
                'user' => $user,
                'completed' => $isCompleted
            ];
        }

        return $users;
    }

    public function isDone()
    {
        $currentDate = date_create();

        $start = date_create($this->starts_at);
        $ends = date_create($this->ends_at);

        return (bool) ($ends < $currentDate && $start < $currentDate);
    }

    public function creator()
    {
        return User::where('id', $this->creator)->first();
    }

    public function isCompleted($userId)
    {
        return (bool) DB::table('task_user')
        ->where('task_id', $this->id)
        ->where('user_id', $userId)
        ->first()
        ->completed;

    }
}
