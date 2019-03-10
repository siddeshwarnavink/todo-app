<?php

require_once './vendor/autoload.php';

use GraphQL\Utils\BuildSchema;
use GraphQL\GraphQL;
use GraphQL\Error\Debug;

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
$query = $input['query'];

$capsule = require('./container/Capsule.php');
$isAuth = require('./container/IsAuth.php');

$schema = require('./graphql/schema/schema.php');

$variableValues = isset($input['variables']) ? $input['variables'] : null;

require_once './shared/AuthRequired.php';

try {
    $rootValue = [
        'validator' => function() {
            return new \Siddeshrocks\Validation\Validator;
        },
        'isAuth' => $isAuth
    ];

    $resolvers = require('./graphql/resolvers/root.php');
    $rootValue = array_merge($rootValue, $resolvers);

    set_error_handler(function($severity, $message, $file, $line) use (&$phpErrors) {
        throw new ErrorException($message, 0, $severity, $file, $line);
    });

    $debug = Debug::INCLUDE_DEBUG_MESSAGE | Debug::RETHROW_INTERNAL_EXCEPTIONS;

    $result = GraphQL::executeQuery($schema, $query, $rootValue, null, $variableValues);
    $output = $result->toArray($debug);

    $status = 200;
} catch (Exception $e) {
    $output = [
        'errors' => [
            [
                'message' => $e->getMessage()
            ]
        ]
    ];

    $status = 500;
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json', true, $status);

echo json_encode($output);