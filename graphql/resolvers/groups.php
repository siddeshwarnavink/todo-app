<?php

use Siddeshrocks\Models\Group;
use Siddeshrocks\Models\User;

use Illuminate\Database\Capsule\Manager as DB;

return [
    'groups' => function ($root, $args) {
        AuthRequired($root);
        $groups = [];

        if(!$root['isAuth']->user->isAdmin) {
            $relationGroups = DB::table('user_group')->where('userid', $root['isAuth']->user->id)->get();
            
            foreach($relationGroups as $relationGroup) {
                $groups[] = Group::where('id', $relationGroup->groupid)->first();
            }
        } else {
            $groups = Group::where('company', $root['isAuth']->user->company )->get();
        }

        foreach($groups as $key => $group) {
            $groups[$key] = transformGroup($group);
        }

        return $groups;
    },

    'group' => function ($root, $args) {
        AuthRequired($root);

        $isMember = DB::table('user_group')
                    ->where('groupid', $args['id'])
                    ->where('userid', $root['isAuth']->user->id)
                    ->first();

        if(!$root['isAuth']->user->isAdmin && !$isMember) {
            throw new Exception('You must be a member of this group to access it!');
        }

        $group = Group::where('id', $args['id'])->first();
        transformGroup($group);

        return $group;
    },

    'addGroup' => function ($root, $args) {
        $newGroup = new Group;
        $addingUser = User::where('id', $root['isAuth']->user->id)->first();

        $newGroup->title = $args['title'];
        $newGroup->description = $args['description'];
        $newGroup->creator = $addingUser->id;
        $newGroup->company = $addingUser->company;

        $newGroup->save();

        $members = json_decode($args['members']);

        $insertList = [];
        foreach($members as $newMemberId) {
            $insertList[] = [
                'userid' => $newMemberId,
                'groupid' => $newGroup->id,
                'isAdmin' => 0
            ];

            notify('group_add', 'You have been added to a group', "/group/{$newGroup->id}" , $newMemberId);
        }

        DB::table('user_group')->insert($insertList);

        return true;
    },

    'editGroup' =>  function ($root, $args) {
        AuthRequired($root);

        /**
         * Editing group date
         */

        Group::where('id', $args['id'])
                ->update([
                    'title' => $args['title'],
                    'description' => $args['description'],
                ]);

        
        /**
         * Editing group members
         */
        
        $currentTaskMembers_object = DB::table('user_group')
            ->where('groupid', $args['id'])
            ->pluck('userid');

        $currentGroupMembers = [];

        foreach($currentTaskMembers_object as $key => $memberId) {
            $currentGroupMembers[$key] = $memberId;
        }
        
        $insertList = [];
        $members = json_decode($args['members']);

        foreach($members as $newMemberId) {
            if(!in_array($newMemberId, $currentGroupMembers)) {
                $insertList[] = [
                    'groupid' => $args['id'],
                    'userid' => $newMemberId,
                    'isAdmin' => 0
                ];

                notify('group_add', 'You have been added to a group', "/group/{$args['id']}" , $newMemberId);
            }
        }

        DB::table('user_group')->insert($insertList);

        foreach($currentGroupMembers as $memberId) {
            if(!in_array($memberId, $members)) {
                DB::table('user_group')
                    ->where('groupid', $args['id'])
                    ->where('userid', $memberId)
                    ->delete();

                notify('person_add_disabled', 'You have been removed to a group', "/group/{$args['id']}" , $memberId);
            }
        }

        return true;    
    },

    'deleteGroup' => function ($root, $args) {
        AuthRequired($root);

        Group::where('id', $args['id'])->delete();
        DB::table('user_group')->where('id', $args['id'])->delete();

        return true;
    }
];
