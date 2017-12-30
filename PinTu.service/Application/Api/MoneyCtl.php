<?php

class Money extends Ctl{
	
        
    /* 从mysql获得数据 */
    public function select(){
        
        $this->load->mysqlDB('mysql0');
	if(empty($this->input['openid'])){
                ajaxJson(['code'=>444,'msg'=>'[openid is needed] union_id没传','data'=>'']);
        }

        $openid= $this->input['openid'];
        if(!$openid){
		ajaxJson(['code'=>4,'msg'=>'openid没传','data'=>'']);
	}
        /*测试数据*/
        $data =  [
            'wx_id' =>'dfd44',// 微信id,
        ];
        
        $data = $this->mysql0-> getOne(array(
            
            'table'=>'t_user_money',
            'field'=>'*',
            'where'=>'AND openid="'.$openid.'"'
        ));
        
        
        $out = array(
            'code'  =>'200',
            'msg'=>"成功",
            'data'=>[
                'info'=>$data
            ]
        );
        
        ajaxJson($out);
    }
    
    
    //插入用户资金记录 修改用户余额
    public function insertUserMoney(){
        
        try{
            $this->load->MysqlDB('mysql0');
            $data = $this->input['_DATA'];
            
            /*测试数据*/
            $data =  [
                'user_id'=>'2',//用户id
                'wx_id' =>'dfd44',// 微信id,
                'type' =>'IN',// 活动id
                'money' =>2,//金额
                'add_time' =>333,// 时间
            ];
            
            $this->mysql0->begin();
            
            /* 获得用户余额 */
            $user_money = $this->mysql0->getOne([
                'table'=>'t_user_money',
                'field'=>'*',
                'where'=>"AND wx_id='".$data['wx_id']."'",
            ]);
            
            /* 如果没有则插入数据 */
            if(!$user_money){
                
                /* 插入资金记录 */
                $this->mysql0->insert([
                    'table'=>'t_user_money',
                    'data'=>[
                        'user_id'=>$data['user_id'],//用户id
                        'wx_id' =>$data['wx_id'],// 微信id,
                        'money' =>0,//金额,
                    ]
                ]);
                
                /* 获得用户余额 */
                $user_money = $this->mysql0->getOne([
                    'table'=>'t_user_money',
                    'field'=>'*',
                    'where'=>"AND wx_id='".$data['wx_id']."'",
                ]);
            }
            
            /* 得到更新后的余额 */
            $trans_money = 0;
            if($data['type'] == 'OUT'){
                $trans_money = $user_money['money'] - $data['money'];
            }else{
                $trans_money = $user_money['money'] + $data['money'];
            }
            
            /* 修改用户余额 */
            $this->mysql0->update([
                'table'=>'t_user_money',
                'data'=>['money'=>$trans_money],
                'where'=>"AND wx_id='".$data['wx_id']."'",
            ]);
            
            /* 插入资金记录 */
            $return = $this->mysql0->insert([
                'table'=>'t_user_moneylog',
                'data'=>$data,
                'is_return_id'=>true,
            ]);
            
            $this->mysql0->commit();
            
            $out = [
                'code'=>'200',
                'msg'=>'成功',
                'data'=>$return
            ];
            
            ajaxJson($out);
        } catch (Exception $e){
            $this->mysql0->rollBack();
            print_r('异常信息：'.$e);exit;
        }

    }
    
}
