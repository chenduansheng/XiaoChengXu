<?php

class Pay extends Ctl{
    
    public function get(){
        
        include_once(LIB_PATH."WxpayAPI_php_v3.0.1/lib/WxPay.Data.php");
        include_once(LIB_PATH."WxpayAPI_php_v3.0.1/lib/WxPay.Api.php");
        
        $openid=$this->input['openid'];
        $money=$this->input['money'];
        if(!$money) die('we need money');
        
        $input = new WxPayUnifiedOrder();
        
        $input->SetBody("test");
        $input->SetAttach("test");
        $input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));
        $input->SetTotal_fee("1");
        $input->SetTime_start(date("YmdHis"));
        $input->SetTime_expire(date("YmdHis", time() + 600));
        $input->SetGoods_tag("test");
        $input->SetNotify_url("https://pintu.xizai.com/nt.php");
        $input->SetTrade_type("JSAPI");
        $input->SetOpenid($openid);
        
        /* 
        Array
        (
            [appid] => wx3d00770652053edd
            [mch_id] => 1418910502
            [nonce_str] => 2ENnzsfydtmQWvgB
            [prepay_id] => wx2017123116382255906df98d0675899092
            [result_code] => SUCCESS
            [return_code] => SUCCESS
            [return_msg] => OK
            [sign] => 3C92C8502AECCE99BDC3CF6368C9977B
            [trade_type] => JSAPI
            ) */
        $order = WxPayApi::unifiedOrder($input);
        
        $order['timeStamp'] = time();
        $order['package'] = "prepay_id=".$order["prepay_id"];
        $order['signType'] = 'MD5';
        $order['nonceStr'] = $order['nonce_str'];
        
        $str = 'appId='.$order['appid'].'&nonceStr='.$order['nonce_str'].'&package='.$order['package'].'&signType=MD5&timeStamp='.$order['timeStamp']."&key=t9RRtRNYJkL2Dfe6CwiKO27f128AsERs";
        $order['paySign'] = md5($str);
        
        unset($order['appid']);
        unset($order['key']);
        
        $out = [
            'code'=>'200',
            'msg'=>'success',
            'data'=>[
                'info'=>$order
            ],
        ];
        
        ajaxJson($out);
    }
    
    public function nt(){
        
        $content = implode('-|-', $_REQUEST);
        addLog([
            'content'=>$content,
            'file_name'=>'wx_money_notify',
        ]);
    }
}
