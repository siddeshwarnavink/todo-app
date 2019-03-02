<?php

function AuthRequired($root, $adminRequired = false) {
    if(isset($root['isAuth']) && $root['isAuth']) {
        if($adminRequired && !$root['isAuth']->user->isAdmin) {
            throw new Exception('Admin Authentication is required');
        }

        return;
    }

    throw new Exception('Authentication is required');
}