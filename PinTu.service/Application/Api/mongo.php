<?php
//echo phpinfo();
$con     = new MongoDB\Driver\Manager('mongodb://127.0.0.1:27017');
$manager = new MongoDB\Driver\Manager("mongodb://localhost:27017");  

// 插入数据
$bulk = new MongoDB\Driver\BulkWrite;

$document = array(
	"title" => "MongoDB", 
	"description" => "database", 
	"likes" => 100,
	"url" => "http://www.runoob.com/mongodb/",
	"by", "菜鸟教程",
	'child'=>array(
		"title" => "MongoDB", 
	"description" => "database", 
	"likes" => 100,
	"url" => "http://www.runoob.com/mongodb/",
	"by", "菜鸟教程",
	'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),
'child'=>array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        ),

	),
);
$document2 = array(
                "title" => "MongoDB",
        "description" => "database",
        "likes" => 100,
        "url" => "http://www.runoob.com/mongodb/",
        "by", "菜鸟教程"
        );
$bulk->insert($document);
for($i=0;$i<100;$i++){
	$bulk->insert($document);
}
$manager->executeBulkWrite('cds.cds', $bulk);
echo "数据插入成功";

?>
