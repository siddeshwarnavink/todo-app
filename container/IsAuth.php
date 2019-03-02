<?php

use \Firebase\JWT\JWT;

if(isset($_GET['token'])) {
    $key = require('./shared/JWTKey.php');

    $decoded = JWT::decode($_GET['token'], $key, array('HS256'));
    
    if($decoded) {
        return $decoded;
    }
}

return false;