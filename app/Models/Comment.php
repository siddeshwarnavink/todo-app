<?php

namespace Siddeshrocks\Models;

use Illuminate\Database\Capsule\Manager as DB;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';

    protected $fillable = [
        'user_id',
        'message',
        'type',
        'payload'
    ];

    public static function of($type, $payload) {
      return DB::table('comments')->where('type', $type)->where('payload', $payload);
    }
}
