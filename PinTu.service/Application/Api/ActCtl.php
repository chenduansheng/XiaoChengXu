<?php

class Act extends Ctl{
	
	
        
	
	/* 从mysql获得数据 */
	public function select(){
	    
	    $this->load->mysqlDB('mysql0');
	    
	    $data = $this->mysql0-> getAll(array(
	        
	        'table'=>'t_act',
	        'field'=>'*',
	        'limit'=>$this->input['_LIMIT']
	    ));
	    
	    
	    $out = array(
	        'code'  =>'200',
	        'msg'=>"成功",
	        'data'=>[
	            'list'=>$data,
	            'num'=>count($data),
	        ]
	    );
	    
	    ajaxJson($out);
	}

	public function insert(){
	    
            $this->load->mysqlDB('mysql0');
	    
	    $data = $this->input['_DATA'];

	    /* 测试数据
	    $data =  [
                          'type'=>'COMMON', // '类型【common普通；poster海报】',
                          'degree_type' =>'3*3',// '拼图难度',
                          'pay_total' =>20,// '发起人支付金额',
                          'pay_fee' =>1,//'发起人支付费用',
                          'award_first' =>2,// '冠军奖励',
                          'award_two' =>2,//'亚军奖励',
                          'award_third' =>2,//'季军奖励',
                          'award_all' =>1,// '参与奖励',
                          'num_group' =>2,// '参与组数',
                          'num_person' =>20,// '参与人数',
                          'add_time' =>1111,// '添加时间（时间戳）',
                          'end_time' =>22222222222222,// '结束时间',
                          'limit_sex' =>1,// '限制性别【1男，2女】',
                          'limit_distance'=>1000,//'限制距离【单位米】',
	                      'pic'=>'http://dfdj.com/edf.png',
	    ];*/
	    
	   
        $this->mysql0->begin();
 
        //插入活动图片 
	    $this->mysql0->insert([
	        'table'=>'t_act_pic',
	        'data'=>[
	            'pic'=>$data['pic']
	        ],
	    ]);
	    unset($data['pic']);
	    
	    //插入活动
        $return = $this->mysql0->insert([
            'table'=>'t_act',
            'data'=>$data,
	        'is_return_id'=>true,
        ]);


	    //插入活动分组
        for($i=0; $i<$data['num_group']; $i++){
            $this->mysql0->insert([
                'table'=>'t_act_group',
                'data'=>[
                    'act_id'=>$return['id'],
                    'person_need'=>( $data['num_person'] / $data['num_group'] ),
                ]
            ]);         
        }

	    $this->mysql0->commit();

	    $out = [
	        'code'  =>'200',
            'msg'=>"成功",
            'data'=>$return,
	    ];

       ajaxJson($out);

	}
        
	//插入用户拼图成绩
	public function insertUser(){
	    
	    $this->load->MysqlDB('mysql0');
	    $data = $this->input['_DATA'];
	    
	    /*测试数据
	     $data =  [
	     'user_id'=>'2',//用户id
	     'wx_id' =>'dfd44',// 微信id,
	     'act_id' =>20,// 活动id
	     'group_id' =>1,//分组id
	     'use_time' =>333,// 用时
	     ];
	     */
	    
	    $return = $this->mysql0->insert([
	        'table'=>'t_act_user',
	        'data'=>$data,
	        'is_return_id'=>true,
	    ]);
	    
	    $out = [
	        'code'=>'200',
	        'msg'=>'成功',
	        'data'=>$return
	    ];
	    
	    ajaxJson($out);
	}	
}
