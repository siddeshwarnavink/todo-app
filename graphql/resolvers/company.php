<?php

use Siddeshrocks\Models\Company;
use Siddeshrocks\Models\User;

use Illuminate\Database\Capsule\Manager as DB;

return [
    'companyStaics' => function($root, $args) {
        AuthRequired($root);

        $user = $root['isAuth']->user;
        $user = User::find($user->id);

        $company = $user->company();

        return transformCompany($company);
    },

    'companyReport' => function($root, $args) {
        AuthRequired($root, true);

        $table = 'tasks';
        $condition = 'created_at BETWEEN  date_sub(now(), interval 1 week) and now()';
        $Yvalues = [];

        switch($args['type']) {
            case 0:
                // Tasks
                $table = 'tasks';
                break;
            case 1:
                // Groups
                $table = 'groups';
                break;
            case 2:
                // Users
                $table = 'users';
                break;
        }

        switch($args['duration']) {
            case 0:
                // Weekly
                $condition = 'created_at BETWEEN date_sub(now(), interval 1 week) and now()';
                break;
            case 1:
                // Monthly
                $condition = 'MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())';
                break;
            case 2:
                // Yearly
                $condition = 'year(created_at) = year(now())';
                break;
        }

        $reports = DB::select("SELECT * FROM {$table} WHERE {$condition};"); 

        switch($args['duration']) {
            case 0:
                // Weekly
                for ($x = 0; $x <= 6; $x++) {
                    $Yvalues[$x] = 0;
                }
                foreach($reports as $key => $report) {
                    $taskDay = DB::select("SELECT EXTRACT(DAY FROM '{$report->created_at}') as day;")[0]->day;
                    $monday = (int) date("d", strtotime('monday this week'));

                    $index = $taskDay - $monday;
                    $Yvalues[$index] += 1;
                }
                break;
            case 1:
                // Monthly
                $year = (int) date("y", strtotime('monday this week'));
                $month = (int) date("m", strtotime('monday this week'));
                $days = (int) cal_days_in_month(CAL_GREGORIAN, $month, $year);

                for ($x = 0; $x <= $days - 1; $x++) {
                    $Yvalues[$x] = 0;
                }
                foreach($reports as $key => $report) {
                    $taskDay = DB::select("SELECT EXTRACT(DAY FROM '{$report->created_at}') - 1 as day;")[0]->day;
                    $Yvalues[$taskDay] += 1;
                }
                break;
                
            case 2:
                // Yearly
                for ($x = 0; $x <= 11; $x++) {
                    $Yvalues[$x] = 0;
                }
                foreach($reports as $key => $report) {
                    $taskMonth = DB::select("SELECT EXTRACT(MONTH FROM '{$report->created_at}') as month;")[0]->month;
                    $Yvalues[$taskMonth] += 1;
                }
                break;
        }

        return [
            'Ydata' => json_encode($Yvalues)
        ];
    }
];