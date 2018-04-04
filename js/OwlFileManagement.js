//全局变量
var owlFilesInJson;       //当前已有的owl文件
var selectedFile;         //当前选择的文件

$(function () {	
	//Display loading information	 
	
	$("#loading").ajaxStart(function(){ $(this).show(); });
	
	//同步的方式取得当前数据库中的数据表
	$.ajax({ url: "ListOwlsServlet", async: false, type: "post", data: { action: "post"} }).done(function (msg) {
		owlFilesInJson = jQuery.parseJSON(msg);
		//alert(msg);
	});
	
	$("#loading").ajaxStop(function(){  $(this).hide(); });	
	
    $('#owlManagement').datagrid({
        toolbar: [ {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {
		            	var row = $('#owlManagement').datagrid('getSelected');
		                if (row) {
		                	$.messager.confirm('提示','确定要删除'+row.text,function(r){   
		                		if (r){ 		                			    
		                			   //Jquery编码转换
		                			    selectedFile = encodeURIComponent(row.text);
		                			   //远程删除
			                			$.ajax({
			    		                    url:'OwlOperServlet',       
			    		                    data:{action:"delete",
			    		                    	 owlfile:selectedFile},
			    		                    success:function(msg){
			    		                    	if(msg=="success"){
			    		                    		//$.messager.alert('提示', '删除成功','info');	
			    		                    		$.messager.show({
			    				         				title:'友情提示',
			    				         				msg:'删除成功.',
			    				         				timeout:3000,
			    				         				showType:'slide'
			    				         			});
			    		                    		var index = $('#owlManagement').datagrid('getRowIndex', row);
													$('#owlManagement').datagrid('deleteRow', index); 
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
		        }, '-', {
		            text: '重载',
		            iconCls: 'icon-reload',
		            handler: function () {
		                $('#owlManagement').datagrid('loadData', owlFilesInJson);
		            }
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	    $('#owlManagement').datagrid('loadData', owlFilesInJson);
});

function showLoading(){
	 $("#loading-mask").show();
	 $("#loading").show();
}
function hideLoading(){
	$("#loading-mask").fadeOut("normal");
   $("#loading").fadeOut("normal");
}