<?php
defined('BASE_PATH') OR exit('No direct script access allowed');


/*********************************
 **********   各种定义    ***********
 *********************************/


/***************
 * 跨域请求
 ***************/

header("Access-Control-Allow-Origin: *");


/***************
 * 定义开发模式  TEST或ONLINE
 ***************/

define('DATACONFIG_PATH', APP_PATH.'Config/Database/');

define('ENVIRONMENT', 'TEST');

$GLOBALS['KEY'] = [
    'TENCENT'=>[
        'WX_XCX'=>[
            'appid'=>'wx3d00770652053edd',
            'secret'=>'e51701c63f8f80a4a715f15282eb925e',
        ],
    ]
];
?>