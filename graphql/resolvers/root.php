<?php

$authResolvers = require('./graphql/resolvers/auth.php');
$groupsResolvers = require('./graphql/resolvers/groups.php');
$taskResolvers = require('./graphql/resolvers/tasks.php');
$userResolvers = require('./graphql/resolvers/users.php');
$companyResolvers = require('./graphql/resolvers/company.php');
$notificationResolver = require('./graphql/resolvers/notifications.php');
$commentsResolver = require('./graphql/resolvers/comments.php');

$Resolvers = array_merge(
    $authResolvers,
    $groupsResolvers,
    $taskResolvers,
    $userResolvers,
    $companyResolvers,
    $notificationResolver,
    $commentsResolver
);

return $Resolvers;
