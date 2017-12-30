<?php
/*
 * This file is for get some keys and some ids
 * ADD BY ChenDuanSheng 2017-12-28
 * */
class Key extends Ctl{
	
    /*
     * @param $code varchar
     * @return JSON {
          "code": "200", 
          "msg": "成功", 
          "data": {
            "info": {
              "session_key": "EgTBLNE7RdvzxcR/MeIe5A==", 
              "openid": "oeDcV0W0lW2u-WnondVku8uZZo4k"
            }
          }
        }
    */
    public function getWxId(){
        
        /* receive code */
        $code = $this->input['code'];
        
        /* get config from Config.php */
        $key = $GLOBALS['KEY']['TENCENT']['WX_XCX'];
        $appid = $key['appid'];
        $secret= $key['secret'];
        
        /* send request to weixin's remote server */
        $weixin =  file_get_contents("https://api.weixin.qq.com/sns/jscode2session?appid=$appid&secret=$secret&js_code=$code&grant_type=authorization_code");
        $jsondecode = json_decode($weixin);
        $data = get_object_vars($jsondecode);
        
        /* 
        $open_id = $data['openid'];
        $weixin =  file_get_contents("https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=$open_id&lang=zh_CN");
        $jsondecode = json_decode($weixin);
        $data = get_object_vars($jsondecode); */
        
        /* print the return */
        $out = array(
            'code'  =>'200',
            'msg'=>"成功",
            'data'=>[
                'info'=>$data
            ]
        );
        ajaxJson($out);
    }
    
}
