
 var type = "";//achor or mappingset


function getOwlFiles(n) {
	var postUrl = "ListOwlsServlet";
	$.post(postUrl,function(msg) {
						showWaiting();
						var menulist = "";
						var listModel = "";
						menulist += '<ul id="nav">';
						// alert("msg:"+msg+'\n'+"Json:"+jQuery.parseJSON(msg).owlFiles);
						$.each(jQuery.parseJSON(msg).owlFiles,
										function(i, n) {
											if (n.text != '') {
												listModel = '<li><div style="width:300px"><input name="r" type="radio" value={0}><span class="icon {1}" ></span>{2}</input></div></li>';
												menulist += listModel.format(n.text, 'icon-owls',n.text);
											}
										});
						menulist += '</ul>';
						$('#' + 'owlPanel' + n).html(menulist);
						hideWaiting();
					});
}

function deleteRow(id){
	
	var filePath1=$('#content1').val();
	var filePath2=$('#content2').val();
	var row = $('#'+id).datagrid('getSelected');
		
    if (row) {
    	$.messager.confirm('提示','确定要删除匹配信息'+row.name1+' '+row.name2+"?",function(r){   
    		if (r){ 		                			    

    			   // 远程删除
        			$.ajax({
	                    url:'MappingSetEditServlet',       
	                    data:{edittype:"edit",
        				      source:type,//锚匹配中的删除，或者本体匹配中的删除，用type标识
        				      file1:encodeURIComponent(filePath1),
        				      file2:encodeURIComponent(filePath2),
	                    	 name1:encodeURIComponent(row.name1),
	                    	 name2:encodeURIComponent(row.name2)},
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		// $.messager.alert('提示', '删除成功','info');
	                    		$.messager.show({
			         				title:'友情提示',
			         				msg:'删除成功.',
			         				timeout:3000,
			         				showType:'slide'
			         			});
	                    		var index = $('#'+id).datagrid('getRowIndex', row);
								$('#'+id).datagrid('deleteRow', index); 
	                    	}
	                    	else
	                    		$.messager.alert('Warning', '删除失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('Warning', '出错了，操作失败!!!','error');
	                    }
	                });
    		    }   
    		}); 
    }
    else {
        $.messager.alert('友情提示', '请选择要删除的匹配行！！！','info');
    }
   
}


function deleteConflictRow(id){//冲突检测中的删除
	
	var filePath1=$('#content1').val();
	var filePath2=$('#content2').val();
	
	var row = $('#'+id).datagrid('getSelected');
	var type = row.confictType;
	var selectedRow = row.name1;
	
	////alert("type:"+type+"&&&"+"row:"+selectedRow+"filePath1:"+filePath1+"filePath2:"+filePath2);
	if(type!=null&&selectedRow =="")
	{
		$.messager.show({
				title:'友情提示',
				msg:'该行为冲突类型，无法删除。',
				timeout:3000,
				showType:'slide'
			});
	}
	else if(type =="" && selectedRow != null){
    	$.messager.confirm('提示','确定要删除匹配信息'+row.name1+' '+row.name2+"?",function(r){   
    		if (r){ 		                			    
    			   // 远程删除
        			$.ajax({
	                    url:'MappingSetEditServlet',       
	                    data:{edittype:"edit",
        				      source:"conflictset",
        				      file1:encodeURIComponent(filePath1),
        				      file2:encodeURIComponent(filePath2),
	                    	 name1:encodeURIComponent(row.name1),
	                    	 name2:encodeURIComponent(row.name2)
	                    	 },
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		// $.messager.alert('提示', '删除成功','info');
	                    		$.messager.show({
			         				title:'友情提示',
			         				msg:'删除成功.',
			         				timeout:3000,
			         				showType:'slide'
			         			});
	                    		var index = $('#'+id).datagrid('getRowIndex', row);
								$('#'+id).datagrid('deleteRow', index); 
	                    	}
	                    	else
	                    		$.messager.alert('Warning', '删除失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('Warning', '出错了，操作失败!!!','error');
	                    }
	                });
    			    
    		    }   
    		}); 
    }
    else {
        $.messager.alert('友情提示', '请选择要删除的文件！！！','info');
    }
   
}

function showMappingRe(remoteJson){
	//alert(remoteJson);
	//showWaiting(); 
	$('#DPMapping').datagrid('loadData', jQuery.parseJSON(remoteJson).resultsofdp);
	$('#OPMapping').datagrid('loadData', jQuery.parseJSON(remoteJson).resultsofop);
	$('#CLMapping').datagrid('loadData', jQuery.parseJSON(remoteJson).resultsofclass);
	//hideWaiting();
	
	
	$('#DPMapping').datagrid({
        toolbar: [ {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            id:'DPDelbtn',
		            handler: function () {
		            deleteRow('DPMapping');						
					}
		        },'-',
		        {
		        	text:'提示：双击某一行可直接删除',
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	
	$('#OPMapping').datagrid({
        toolbar: [ {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {
		           deleteRow('OPMapping');
                  }
		        },'-',
		        {
		        text:'提示：双击某一行可直接删除',
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	$('#CLMapping').datagrid({
        toolbar: [ {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {
				           deleteRow('CLMapping');
		                  }
		        },'-',{
		        	text:'提示：双击某一行可直接删除',
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	
	$('#CLMapping').datagrid({
		onDblClickCell:function(){	
               deleteRow('CLMapping');    
	}
	});
	
	$('#OPMapping').datagrid({
		onDblClickCell:function(){
               deleteRow('OPMapping');     
	}
	});
	
	$('#DPMapping').datagrid({
		onDblClickCell:function(){		
               deleteRow('DPMapping');
	}
	});	

}


function showConflictCheckRe(remoteJson){

	$('#conflictCheckTable').datagrid('loadData', jQuery.parseJSON(remoteJson).result);
	$('#conflictCheckTable').datagrid({
        toolbar: [ {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {
        	        deleteConflictRow('conflictCheckTable');
                  }
		        },'-',
		        {
		        text:'提示：双击某一行可直接删除',
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	
	$('#conflictCheckTable').datagrid({
		onDblClickCell:function(){		
		deleteConflictRow('conflictCheckTable');
	}
	});	
}

$(function() {
	
	
	$('#content1').attr('value','\\选课.owl');
	$('#content2').attr('value','\\选课2.owl');
	
		
	$('#brOn1').click(function() {
		$('#openMapOwlFile1').window('open');
		getOwlFiles(1);
		$('#btnMapOk1').click(function() {
			var selectedFile='';
			  var radioval=document.getElementsByName("r");    	
		    	for(var i=0;i<radioval.length;i++)
		    	{    	   		
		    		if(radioval[i].checked)
		    			{    			
			    			selectedFile = radioval[i].value;
		    			}
		    	}
		    	if(selectedFile)
		    	{
		    	$('#content1' ).val('\\' + selectedFile);
		    	}	
			$('#openMapOwlFile1').window('close');
		});
		$('#btnMapCancel1').click(function() {
			$('#openMapOwlFile1').window('close');
		});
	});

	$('#brOn2').click(function() {
		$('#openMapOwlFile2').window('open');
		getOwlFiles(2);
		$('#btnMapOk2').click(function() {
			var selectedFile='';
			
			  var radioval=document.getElementsByName("r");    	
		    	for(var i=0;i<radioval.length;i++)
		    	{    	   		
		    		if(radioval[i].checked)
		    			{    			
			    			selectedFile = radioval[i].value;
			    			break;
		    			}
		    	}
		    	if(selectedFile)
		    	{
		    	$('#content2' ).val('\\' + selectedFile);
		    	}
			$('#openMapOwlFile2').window('close');
		});
		$('#btnMapCancel2').click(function() {
			$('#openMapOwlFile2').window('close');
		});
	});
	
	$('#btnOntoMerging').click(function(){
		var filePath1=$('#content1').val();
		var filePath2=$('#content2').val();
		//MessageBox.prompt("请输入融合后的本体名：",function(e,text){
		
		var newName = window.prompt("请输入融合后的本体文件名：","");
		   
			if(newName)
			{
				//alert(newName);
				$.ajax({
						url:"OntologyMergeServlet",
						async:false,
						type:"post",
						data:
						{
					     owl1name:encodeURIComponent(encodeURIComponent(encodeURIComponent(filePath1))),
					     owl2name:encodeURIComponent(encodeURIComponent(encodeURIComponent(filePath2))),
					     name:newName					 
						}
						
				}).done(function(msg){
					if(msg=="success")
					$.messager.alert('恭喜您！', '融合成功！','success');
					else
						$.messager.alert('Warning', '融合失败！','error');
					
				});
			}
	});
	
	$('#btnConflictCheck').click(function(){
		var filePath1=$('#content1').val();
		var filePath2=$('#content2').val();
		
		$.ajax({
			url:'MappingSetEditServlet',
			async:false,
		    type:"post",
		    data:{
			file1:encodeURIComponent(filePath1),
			file2:encodeURIComponent(filePath2),
			edittype:"confirm",
			source:"mappingset"}
		}).done(function(msg){
			if(msg=="success")
			{
				$.messager.alert('恭喜你', '没有检测到冲突，可以进行融合了！','success');
				$('#ontoMergingPanel').show();
				$('#conflictCheckPanel2').hide();
				$("#eastconflictCheckRegion").layout('expand','east');
			}
			else
			{	
			showConflictCheckRe(msg);
			$('#conflictCheckPanel2').show();
			$("#eastconflictCheckRegion").layout('expand','east');
			}
		});
	});
	
	$('#btnconflictCheck2').click(function(){
		$('#btnConflictCheck').click();
		
	});
	
	
	$('#btnOntoMap').click(function(){
		var filePath1=$('#content1').val();
		var filePath2=$('#content2').val();
		
		$.ajax({
            url:'MappingSetEditServlet', 
            async:false,
		    type:"post",
            data:{
			      file1:encodeURIComponent(filePath1),
			      file2:encodeURIComponent(filePath2),
			      edittype:"confirm",
			      source:"anchor"
			    	  }
		}).done(function(msg){		
			showMappingRe(msg); 
			$("#conflictCheckPanel").show();// 显示隐藏的按钮
			$("#OntoMapconfirmPanel").hide();
			type ="mappingset";//删除时是对本体删除
			$("#mapeditRegion").layout('expand','east');
	   });		        		
	});
	
	
	$('#btnAnchorMap').click(function(){	
		var filePath1=$('#content1').val();
		var filePath2=$('#content2').val();
		
		if(filePath1 == ''||filePath2 == '')
		{
			$.messager.alert('Warning', 'Please select ontology！','error');
			return;
		}
		if(filePath1 == filePath2)
		{
			$.messager.alert('Warning', 'Please select different ontologies！','error');
				$('#content2').attr("value","");
				return;	
		}
		
		var mappingResult;
		$.ajax({
			url:"SearchAnchorServlet",
			async:false,
		    type:"post",
		    data:{
			file1:filePath1,
			file2:filePath2}
		}).done(function(msg){
			showMappingRe(msg);
			$("#OntoMapconfirmPanel").show();// 显示隐藏的按钮	
			$("#conflictCheckPanel").hide();
			type = "anchor";//删除时，是对锚删除
			$("#mapeditRegion").layout('expand','east');			
		});	
	});
	

});