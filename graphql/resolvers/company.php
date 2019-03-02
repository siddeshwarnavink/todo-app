<?php

use Siddeshrocks\Models\Company;
use Siddeshrocks\Models\User;

return [
    'companyStaics' => function($root, $args) {
        AuthRequired($root);

        $user = $root['isAuth']->user;
        $user = User::find($user->id);

        $company = $user->company();

        return transformCompany($company);
    }
];