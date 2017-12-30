<?php

/***************
 * 定义应用路径
 ***************/
if(!empty($_GET['phpinfo'])){
	phpinfo();
}
$appPath = 'Application/';
if (($_temp = realpath($appPath)))
{
    $appPath = $_temp.'/';
    $appPath = str_replace('\\', '/', $appPath);
}
else
{
    die('noAppPath!');
}
define('APP_PATH', $appPath);
define('API_PATH', APP_PATH.'Api/');
define('LOG_PATH', APP_PATH.'Runtime/Logs/');


/***************
 * 定义框架底层路径
 ***************/

$systemPath = '../ServiceFrame';
if (($_temp = realpath($systemPath)))
{
    $systemPath = $_temp.'/';
    $systemPath = str_replace('\\', '/', $systemPath);
}
else
{
    die('noSysPath!');
}
define('BASE_PATH', $systemPath);


/***************
 * 加载底层框架
 ***************/

require_once BASE_PATH.'Core/ServiceFrame.php';


/***************
 * 程序能够执行完毕的标志
 ***************/

die( ' serviceFrameEnd! 服务执行完毕! ' );
