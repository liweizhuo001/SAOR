<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>半自动修复</title>
    <link rel="stylesheet" type="text/css" href="css/default.css" />
    <link rel="stylesheet" type="text/css" href="css/loading.css" />
    <link rel="stylesheet" type="text/css" href="css/ajaxLoading.css" />
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.5.4/themes/default/easyui.css" />
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.3.1/themes/icon.css" />
    <link rel="stylesheet" type="text/css" href="js/layer-3.1.1/theme/default/layer.css" />
    <script type="text/javascript" src="js/jquery-easyui-1.3.1/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-easyui-1.5.4/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="js/layer-3.1.1/layer.js"></script>
    <script type="text/javascript" src="js/tools.js"></script>
  </head>
  <body  onload="startWebSocket()">
		<div class="easyui-layout" id="editRegion" style="width:700px;height:690px;" fit="true" border="false">		
		<div region="center" style="background:#fafafa;overflow-x:hidden;overflow-y:hidden;" border="false">			
			<div class="easyui-panel" border="false" 
			     style="margin-top:5px;overflow:auto"
			     title="Interactive Ontology Mapping Repair" iconCls="icon-ontofusion2" fit="true" >
			     <div style="padding:0 5px 0 0;">
				     	<blockquote class="layui-elem-quote" style="height:25px; margin-right:5px; padding:8px 8px 8px 0;">
				     		<a href="#" id="owl1-name" class="easyui-linkbutton"></a>
				     		<a href="#" id="owl2-name" class="easyui-linkbutton"></a>
				            Align: 
				           	 <select class="easyui-combobox" id="align" name="align" style="width:110px;"
								data-options="
									url:'ListOwlsServlet?type=.rdf',
									method:'get',
									valueField:'text',
									textField:'text',
									panelHeight:'auto'" >
									<option value="graph">Please Choose...</option>
				            </select>
				            
				            Refer: 
				           	 <select class="easyui-combobox" id="refer" name="refer" style="width:110px;"
								data-options="
									url:'ListOwlsServlet?type=.rdf',
									method:'get',
									valueField:'text',
									textField:'text',
									panelHeight:'auto'" >
									<option value="graph">Please Choose...</option>
				            </select>
				            
				            Output: 
				           	 <input type="text" class="easyui-textbox" id="txt-output" style="width:65px; height:25px"
				           	 	data-options="required:true" />
				            
				            Tools:
				            <select class="easyui-combobox" name="state" style="width:120px;"
				            	data-options="panelHeight:'auto' ">
								<option value="graph">Our Method</option>
								<option value="cm">ContentMap</option>
								<option value="al">Alcomo</option>
							</select>
							<a href="javascript:;" class="easyui-linkbutton" 
								data-options="iconCls:'icon-convert'" 
								style="width:60px"
								id="btn-repair">Run</a>
				        </blockquote>
			     </div>
			      <div style="padding:0;">
			      		<!-- 结果展示 -->
			      		 <table  title="Candidate Data" style="width:100%;height:auto" id="owlManagement" 
			      		 			  class="easyui-datagrid"
			      		 			  data-options="iconCls:'icon-db', toolbar:toolbar" >
				            <thead>
				                <tr align="center">
				                    <th data-options="field:'id', width:10, align:'center'"  checkbox="true" ></th>
				                    <th data-options="field:'mapping', width:560, align:'center'" id="mapping">CandidateMapping</th>
				                 </tr>
				            </thead>
				        </table>
			      </div>
			</div>	
			
			<!-- 编辑工具栏 -->		
			<div id="tool">
				<a href="#" title="增加" class="icon-add"    id="tool_add"></a>			
				<a href="#" title="编辑" class="icon-edit"   id="tool_edit"></a>
				<a href="#" title="删除" class="icon-remove" id="tool_delete"></a>
				<a href="#" title="本体" class="icon-owl"    id="tool_show"></a>
			</div>			
		</div>
		<!-- End Center -->

	    <!-- 底部 放修复记录 -->
		<div region="south" id="south" split="true" collapsed="false" title="修复记录"  iconcls="icon-eye"  
				style="width:360px; height:200px;" border="false">		
			
			<div class="easyui-layout" data-options="fit:true" border="false">
				<div data-options="region:'west',split:true" style="width:50%;padding:5px" border="false">
					<table  title="The entailed mappings" style="width:100%;height:auto"  iconCls='icon-ok'  
				      		 		id="entailed"	  class="easyui-datagrid">
			            <thead>
			                <tr align="center">
			                    <th field="id"  checkbox="true"></th>
			                    <th data-options="field:'mapping', width:420, align:'center' ">Entailed Record</th>
			                </tr>
			            </thead>
			        </table>
				</div>
			
				<div data-options="region:'center'" style="width:50%;padding:5px" border="false">
					<table  title="The rejected mappings" style="width:100%; height:auto"   iconCls='icon-cancel'
			      		 			id="rejected"  class="easyui-datagrid">
			            <thead>
			                <tr align="center">
			                    <th field="id"  checkbox="true"></th>
			                    <th data-options="field:'mapping', width:420, align:'center' ">Rejected Record</th>
			                 </tr>
			            </thead>
			        </table>
				</div>
			</div>
		</div>		
	</div>
	
	<div id="loading" style="display:none">
        <div class="loading-indicator">
            <img src="images/loading2.gif" alt=""  style="margin-right: 2px;" align="absmiddle" />
            Loading......
        </div>
    </div>
	<script>
		var ws = null;    // web socket;
		var currentMsg ="";
		var owl1 = decodeURI(request.QueryString("owl1"));
		var owl2 = decodeURI(request.QueryString("owl2"));
		var serverPath = "<%= request.getServletContext().getRealPath("/owls").replaceAll("\\\\", "/")  %>";
		//alert(serverPath);
		if(owl1 == 'null' || owl1 == "") owl1 = 'cmt.owl';
		if(owl2 == 'null' || owl2 == "") owl2 = 'Conference.owl';
		$("#owl1-name").html(owl1);
		$("#owl2-name").html(owl2);
		//alert(owl1+"**"+owl2);		
		
		function startWebSocket() {  
		    if ('WebSocket' in window){  
		        ws = new WebSocket("ws://localhost:8080/SAOR/MyWebSocketServlet.ws");  
		        layer.msg("Web socket connecting...");
		    }
			else if ('MozWebSocket' in window){  
			    ws = new MozWebSocket("ws://localhost:8080/SAOR/MyWebSocketServlet.ws");  
			    layer.msg("Moz web socket connecting...");
			}
			else {
				 layer.msg("Not support web socket.");  
			} 
			 ws.onmessage = function(evt) {  
			       //alert(evt.data);  
			       var msg = evt.data;
			       if(msg.indexOf("http:")==0){  //mapping数据
			       		currentMsg = msg;
			       		$('#owlManagement').datagrid('insertRow',{
						    //index: 0,  // 索引从0开始
						    row: {
						        id: '1',
						        mapping: currentMsg
						    }
						});
						$("#owlManagement").datagrid("selectRow", 0); 
			       }
			       else if(msg.indexOf("AutoReject") == 0){ //自动拒绝的公理
			       		//alert(msg);
			       		var _axiom = msg.split("$")[1];
			       		$('#rejected').datagrid('insertRow',{
						    //index: 0,  // 索引从0开始
						    row: {
						        id: '1',
						        mapping: _axiom
						    }
						});
			       }
			       else if(msg.indexOf("AutoAccept") == 0){ //自动接受的公理
			       		//alert(msg);
			       		var _axiom = msg.split("$")[1];
			       		$('#entailed').datagrid('insertRow',{
						    //index: 0,  // 索引从0开始
						    row: {
						        id: '1',
						        mapping: _axiom
						    }
						});
			       }
			       
			       else if(msg == "success"){
			       		layer.msg("Repair has been completed，O(∩_∩)O~!!!", {icon:1});
			       }
			       else if(msg =="0"){
			       		layer.msg("System Error!", {icon:2});
			       }
			       disLoad();
			 };  
				      
			ws.onclose = function(evt) {  
			      layer.msg("Close web socket.");  
			      disLoad();
			};  
		}
		
		$("#btn-repair").click(function(){
			
			var alignRDF = $('#align').combobox('getValue');
			var referRDF = $('#refer').combobox('getValue');
			var output = $("#txt-output").textbox('getValue');
			//layer.msg(alignRDF+"*"+referRDF + "*"+output);
			if(alignRDF=="Please Choose..."){
				layer.msg("please choose align file!", {icon:2, anim:6});
				return;
			}
			else if(referRDF == "Please Choose..."){
				layer.msg("please choose refer red file!", {icon:2, anim:6});
				return;
			}
			if(output == ""){
				layer.msg("please input the RDF name for output!", {icon:2, anim:6});
			}
			else{
				load() ;
				var msg =serverPath+"#"+owl1+"#"+owl2+"#"+ alignRDF+"#"+referRDF + "#"+output+".rdf";
				ws.send(msg);  
			}
		});
	
		//以前的异步方式，一次短连接
		function ajaxSend(){
			var alignRDF = $('#align').combobox('getValue');
			var referRDF = $('#refer').combobox('getValue');
			var output = $("#txt-output").textbox('getValue');
			//layer.msg(alignRDF+"*"+referRDF + "*"+output);
			if(output == ""){
				layer.msg("please input the RDF name for output!", {icon:2, anim:6});
			}
			else{
				$.ajax({
	                url: "RepairingServlet",
	                type: "post",
	               // async: false,
	                data: {
	                    owl1: encodeURI(owl1),
	                    owl2:encodeURI(owl2),
	                    align:encodeURI(alignRDF),
	                    refer:encodeURI(referRDF),
	                    output:encodeURI(output),
	                },
	                beforeSend:function(){
	                	load() ;
	                },
	                complete: function(){
	                	disLoad();
	                },
	                /* beforeSend: function () {
				    　　$.messager.progress({ 
				       　　title: '提示', 
				       　　msg: '系统加载中……', 
				       　　text: '' 
				    　　});
				    }, */
				   /*  complete: function () {
				         $.messager.progress('close');
				    }, */
	                
	                success: function (msg) {
	                	disLoad();
	                	 //$.messager.progress('close');
	                	alert(msg);
	                    if (msg == "0") {                       
	                       layer.msg(msg, {icon:2});
	                    }
	                    else if (msg == "1") {
	                        layer.msg(msg, {icon:1});
	                    }                   
	                },
	                error: function () {
	                    alert("系统忙...");
	                }
            	});
			}
		}
		
		var toolbar = [{
			text:'Keep',
			iconCls:'icon-ok',
			handler:function(){
					//alert('keep')
					//添加到接受栏
					load() ;
					if(currentMsg != ""){
						$('#entailed').datagrid('insertRow',{
						    //index: 0,  // 索引从0开始
						    row: {
						        id: '1',
						        mapping: currentMsg
						    }
						});
						var row = $('#owlManagement').datagrid('getSelected');
						if (row) {
						         var rowIndex = $('#owlManagement').datagrid('getRowIndex', row);
						         $('#owlManagement').datagrid('deleteRow', rowIndex);  
						 }
						currentMsg ="";
					}
					else{
						layer.msg("本次操作已经结束", {icon:2});
					}
					ws.send("Y");  //发送接受操作
				}
			},'-', {
				text:'Reject',
				iconCls:'icon-cancel',
				handler:function(){
					//alert('remove')
					load() ;
					if(currentMsg != ""){
						$('#rejected').datagrid('insertRow',{
						    //index: 0,  // 索引从0开始
						    row: {
						        id: '1',
						        mapping: currentMsg
						    }
						});
						var row = $('#owlManagement').datagrid('getSelected');
						if (row) {
						         var rowIndex = $('#owlManagement').datagrid('getRowIndex', row);
						         $('#owlManagement').datagrid('deleteRow', rowIndex);  
						 }
						currentMsg ="";
					}
					else{
						layer.msg("本次操作已经结束", {icon:2});
					}
					ws.send("N");  //发送拒绝操作
				}
			}
			/* ,'-',{
				text:'Select',
				iconCls:'icon-edit',
				handler:function(){alert('select')}
			}
			,'-',{
				text:'Save',
				iconCls:'icon-save',
				handler:function(){alert('save')}
			} */
		];	
		
		//弹出加载层
		function load() {  
		    $("<div class='datagrid-mask'></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");  
		    $("<div class='datagrid-mask-msg'></div>").html("Running now, Please waiting...").appendTo("body").css({ display: "block", left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2 });  
		}
		//取消加载层  
		function disLoad() {  
		    $(".datagrid-mask").remove();  
		    $(".datagrid-mask-msg").remove();  
		}
	</script>
  </body>
</html>
