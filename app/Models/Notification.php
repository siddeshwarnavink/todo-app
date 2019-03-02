<?php

namespace Siddeshrocks\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'icon',
        'message',
        'link',
        'created_at',
        'user_id'
    ];
}