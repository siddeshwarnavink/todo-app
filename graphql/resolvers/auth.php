<?php

use Siddeshrocks\Models\User;

use \Firebase\JWT\JWT;
use Respect\Validation\Validator as v;

return [
    'createUser' => function($root, $args) {
        $userData = [
            'username' => $args['username'],
            'email' => $args['email'],
            'password' => $args['password']
        ];

        $validation = $root['validator']()->validate($userData, [
            'username' => v::notEmpty(),
            'email' => v::noWhitespace()->notEmpty(),
            'password' => v::noWhitespace()->notEmpty(),
        ]);

        if($validation->failed()) {
            throw new Exception('Invalid user input!');
        }

        if(!User::where('username', $args['username'])->first()) {
            $userData['password'] = password_hash($args['password'], PASSWORD_DEFAULT);
            $user = User::create($userData);
        } else {
            throw new Exception('User already exists!');
        }

        return User::where('username', $args['username'])
                    ->where('email', $args['email'])
                    ->first();
    },

    'login' => function($root, $args) {
        $user = User::where('email', $args['email'])->first();

        if($user) {
            if(password_verify($args['password'], $user->password)) {
                $key = require('./shared/JWTKey.php');

                $jwt = JWT::encode([
                    'user' => $user
                ], $key);

                return [
                    'userId' => $user->id,
                    'token' => $jwt
                ];
            } else {
                throw new Exception('Invalid password!');
            }
        } else {
            throw new Exception('User dosen`t exists!');
        }
    },


    'validToken' => function($root, $args) {
        $key = require('./shared/JWTKey.php');
        $decoded = JWT::decode($args['token'], $key, array('HS256'));
        
        if($decoded) {
            $user = User::where('id', $decoded->user->id)->first();

            $jwt = JWT::encode([
                'user' => $user
            ], $key);

            return [
                'newToken' => $jwt,
                'user' => $user
            ];
        }

        return false;
    }
];