<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<head>
    <title>Interactive Mapping Revision</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <link rel="stylesheet" type="text/css" href="css/loading.css" />
    <link rel="stylesheet" type="text/css" href="css/ajaxLoading.css" />
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.5.4/themes/default/easyui.css" />
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.3.1/themes/icon.css" />
    <link rel="stylesheet" type="text/css" href="js/layui-2.2/css/layui.css" />
    
    <script type="text/javascript" src="js/jquery-easyui-1.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-easyui-1.5.4/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="js/layui-2.2/layui.js"></script>
    <script type="text/javascript" src="js/tools.js"></script>
    <script type="text/javascript" src='js/frame.js'> </script>
    <script type="text/javascript" src='js/owlshow.js' charset="utf-8"> </script>
    
</head>
<body class="easyui-layout" style="overflow-y: hidden" scroll="no">
    <div id="loading-mask" style=""></div>
    <div id="loading">
        <div class="loading-indicator">
            <img src="images/loading.gif" width="32" height="32" style="margin-right: 8px; float: left;
                vertical-align: top;" />
           		 系统正在打开，请等待......
            <br />
            <span id="loading-msg">Please Waiting...</span>
        </div>
    </div>
    <noscript>
        <div style="position: absolute; z-index: 100000; height: 2046px; top: 0px; left: 0px;
            width: 100%; background: white; text-align: center;">
            <img src="images/noscript.gif" alt='抱歉，请开启脚本支持！' />
        </div>
    </noscript>
    
    <!-- 顶部 -->
    <div region="north" split="true" border="false" style="overflow: hidden; height: 65px;
        background: #E0ECFF repeat-x center 50%; line-height: 20px; color: #fff; font-family: Verdana,Microsoft YaHei">
        <div id="viewport">
            <div id="hd1" style="float: left; 
            						width: 800px; 
            						padding-top:10px; >
                <a href='#' id="logo"><img src="images/logo.png" border="0" height="52" /></a>
            </div>
            <!-- Tool menu -->
            <div id="toolBar" style="padding: 5px; width: 200px; float: right; height: 52px; margin-top: 12px;">
            	<a href="javascript:void(0)" id="mm1" class="easyui-menubutton" menu="#subm1" iconCls="icon-tip">Operation</a>
            </div>  
            <!-- Sub Menu -->         
            <div id="subm1" style="width:122px;">            	
             	<div iconCls="icon-ontoopen">Upload</div>
             	<div class="menu-sep"></div>
				<div iconCls="icon-convert">SemiAutoRepair</div>
				<div class="menu-sep"></div>
				<div iconCls="icon-file">Owl Manage</div>
            </div>                
        </div>       
        <!-- End viewport -->
    </div>
    <!-- End North -->
    
    
    <!-- Left Nav Menu -->
    <div region="west" split="true" title="Ontology-1" style="width: 250px;" id="west">
       	<div style="padding:5px;">
	    	 Onto 1: 
			<input class="easyui-combobox" id="owl1" name="owl1"
						data-options="
							url:'ListOwlsServlet?type=.owl',
							method:'get',
							valueField:'text',
							textField:'text',
							width:100,
							panelHeight:'auto'" />
				
				<a href="javascript:;" class="easyui-linkbutton" 
					data-options="iconCls:'icon-ok'" 
					style="width:65px"
					id="show1">Select</a>				
       		 </div>
       		 <!-- 本体视图 -->
       		 <!-- data-options="selected:'false'" 让手风琴全部折叠 -->
       		 <div class="easyui-accordion" style="width:100% ;height:auto;"  border="false">
				<div title="OwlTree" data-options="iconCls:'icon-owl'" style="overflow:auto;" >
						<ul id="owlTree1"></ul>
				</div>	
			</div>
    </div>
    <!-- Left Nav Menu End-->
    
    <!-- Main -->
    <div id="mainPanle" region="center" style="background: #eee; overflow-y: hidden">
        <div id="tabs" class="easyui-tabs" fit="true" border="false">
            <div title="Welcome" 
            						style="padding: 20px; 
            						overflow: hidden; 
            						display: table-cell;
							        vertical-align: middle;
							        text-align: center;">
							        
                <img src="images/front.png"/>
            </div>
        </div>
    </div>
    
    <!-- begin right -->
    <div region="east" split="true" collapsed="false" title="Ontology-2"  
			 style="width:260px;padding:5px;">
			 
		<div style="padding:5px;">
	       		 Onto 2: 
				<input class="easyui-combobox"  name="owl2" id="owl2"
					data-options="
							url:'ListOwlsServlet?type=.owl',
							method:'get',
							valueField:'text',
							textField:'text',
							width:100,
							panelHeight:'auto'" />
				
				<a href="javascript:;" class="easyui-linkbutton" 
						data-options="iconCls:'icon-ok'" 
						style="width:65px"
						id="show2">Select</a>
			</div>	
						
			<div class="easyui-accordion" style="width:100%; height:auto;"  border="false">
				<div title="OwlTree" data-options="iconCls:'icon-owl'"  style="overflow:auto;" >
						<ul id="owlTree2"></ul>
					</div>	
			</div>
	</div>
    <!-- end right -->   		 

    <div region="south" split="true" style="height: 0px; background: #D2E0F2;">
        <div class="footer">
           	 <span id="footer"></span>
        </div>
    </div>   


    <!-- Tab right menu -->
    <div id="mm" class="easyui-menu" style="width: 150px;">
        <div id="mm-tabclose">关闭</div>
        <div id="mm-tabcloseall"> 全部关闭</div>
        <div id="mm-tabcloseother">除此之外全部关闭 </div>
        <div class="menu-sep"></div>
        <div id="mm-tabcloseright"> 当前页右侧全部关闭 </div>
        <div id="mm-tabcloseleft">当前页左侧全部关闭 </div>
        <div class="menu-sep"></div>
        <div id="mm-exit">退出</div>
    </div>
    <!-- End tab right menu -->
    
    <script>
    	
    	seledOwls = [];
    	$("#show1").click(function(){
    		show(1);
    	})
    	$("#show2").click(function(){
    		show(2);
    	})
    	
    	function show(index){
    		if(index<1){
    			alert("Error!!!");
    			return false;
    		}
    		var seledOwl = $('#owl'+index).combobox('getValue'); 
    		if(seledOwl == ""){
    			layer.msg("Please select an OWL file!", {icon:2, anim:6});
    		}
    		else{
    			seledOwls[index-1] = seledOwl;
    			showTree(seledOwl, "owlTree"+index);
    		}
    		//alert(seledOwl);
    	}
    </script>
</body>
</html>
