<?php

namespace Siddeshrocks\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model {
    protected $table = 'users';

    protected $fillable = [
        'username',
        'email',
        'password',
        'company',
        'isAdmin'
    ];

    public function company()
    {
        return Company::find($this->company);
    }
}