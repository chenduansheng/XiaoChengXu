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
	
	/* 从mysql获得数据 */
	public function selectOne(){
	    
	    $this->load->mysqlDB('mysql0');
	    
	    $id = $this->input['id'];
	    $data = $this->mysql0-> getOne(array(
	        
	        'table'=>'t_act',
	        'field'=>'*',
	        'where'=>"AND id=$id"
	    ));
	    
	    if($this->input['group_id']){
	        $group_id = $this->input['group_id'];
	        $user_data_one_group= $this->mysql0-> getAll(array(
	            
	            'table'=>'t_act_user',
	            'field'=>'*',
	            'where'=>"AND act_id=$id AND group_id=$group_id"
	        ));
	    }
	    
	    $out = array(
	        'code'  =>'200',
	        'msg'=>"成功",
	        'data'=>[
	            'info'=>$data,
	            'user_data_one_group'=>['list'=>$user_data_one_group],
	        ]
	    );
	    
	    ajaxJson($out);
	}
	
	
	public function insertOne(){
	    
        $this->load->mysqlDB('mysql0');
	    
	    $data = $this->input['_DATA'];
	   
        $this->mysql0->begin();
	    
        $data['add_time'] = time();
        $data['end_time'] = 3600*3 + time();
        
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
