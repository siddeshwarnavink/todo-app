<?php

namespace Siddeshrocks\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

class Group extends Model {
    public $timestamps = false;
    protected $table = 'groups';

    protected $fillable = [
        'title',
        'description'
    ];

    public function creator()
    {
        return User::where('id', $this->creator)->first();
    }

    public function members()
    {       
        $members = DB::table('user_group')
            ->where('groupid', $this->id)
            ->join('users', 'user_group.userid', '=','users.id')
            ->get();


        return $members;
    }
}