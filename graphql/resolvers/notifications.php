<?php

use Siddeshrocks\Models\Notification;

return [
    'notifications' => function ($root, $args) {
        AuthRequired($root);

        return Notification::where('user_id', $root['isAuth']->user->id)->get();
    },

    'clearNotifications' => function ($root, $args) {
        AuthRequired($root);

        Notification::where('user_id', $root['isAuth']->user->id)->delete();

        return true;
    }
];