<?php

use Illuminate\Database\Capsule\Manager as DB;

use Siddeshrocks\Models\User;

return [
    'user' => function ($root, $args) {
        $user = User::where('id', $args['id'])->first();

        return $user;
    },

    'editUser' => function($root, $args) {
        $user = User::where('id', $args['userId']);
        
        $user->update([
            'username' => $args['username'],
            'isAdmin' => (int) $args['isAdmin']
        ]);

        return $user->first();
    },

    'addUser' => function($root, $args) {
        AuthRequired($root, true);

        $addingUser = User::where('id', $root['isAuth']->user->id)->first();
        $newUser = new User;

        $newUser->username = $args['username'];
        $newUser->email = $args['email'];
        $newUser->password = password_hash($args['password'], PASSWORD_BCRYPT);
        $newUser->isAdmin = (int) $args['isAdmin'];
        $newUser->company = $addingUser['company'];

        $newUser->save();

        return true;
    },

    'deleteUser' => function($root, $args) {
        AuthRequired($root, true);

        User::where('id', $args['id'])->delete();

        DB::table('user_group')->where('userid', $args['id'])->delete();
        DB::table('task_user')->where('user_id', $args['id'])->delete();
        DB::table('notifications')->where('user_id', $args['id'])->delete();

        return true;
    }
];