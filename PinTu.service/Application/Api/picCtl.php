<?php

class Money extends Ctl{
    
    
    public function GrabImage($url, $name = "") {
        
        $url = $param['url'];
        $name = $param['name'];
        
        if ($url == ""):return false;
        endif;
        //如果$url地址为空，直接退出
        if ($name == "") {
            //如果没有指定新的文件名
            $ext = strrchr($url, ".");
            //得到$url的图片格式
            if (!in_array($ext, [".png", ".jpg"])):return false;
            endif;
            //如果图片格式不为.gif或者.jpg，直接退出
            $name = date("dMYHis") . $ext;
            //用天月面时分秒来命名新的文件名
        }
        ob_start();//打开输出
        readfile($url);//输出图片文件
        $img = ob_get_contents();//得到浏览器输出
        ob_end_clean();//清除输出并关闭
        $size = strlen($img);//得到图片大小
        $fp2 = @fopen($name, "a");
        fwrite($fp2, $img);//向当前目录写入图片文件，并重新命名
        fclose($fp2);

        
        return ['name'=>$name];//返回新的文件名
    }
    
    public function picUpload(){
        
        
        $this->mysql0->insert([
            'table'=>'t_user_contact',
            'data'=>$data,
            'is_return_id'=>true,
        ]);
        
        $img = GrabImage("http://imgsrc.baidu.com/baike/abpic/item/6648d73db0edd1e89f3d62f7.jpg", "");
        if ($img):echo '<pre>< img src="' . $img . '"></pre>';
        
        //如果返回值为真，这显示已经采集到服务器上的图片
        else:echo "false";
        endif;
    }
}