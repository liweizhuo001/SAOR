
var allUserInJson;

$.ajax({//以同步方式取得所有的用户信息
	url:"LoginServlet",
	async:false,
	type:"post",
	data:{action:"getAllUsers"}
    
}).done(function(msg){
	
	allUserInJson=msg;/*eval("("+msg+")");*/
	//allUserInJson = jQuery.parseJSON(msg).allUsers;
	//alert(jQuery.parseJSON(allUserInJson).result);
}); 




$(function(){
	$("#loading").ajaxStart(function(){$(this).show();});
	$("#loading").ajacStop(function(){$(this).hide();});


	
	$('#showAllUsers').datagrid('loadData',jQuery.parseJSON(allUserInJson).result);
	$('#showAllUsers').datagrid({
        toolbar: [ {
            text: '添加',
            iconCls: 'icon-add',
            handler: function () {}
        }, '-',
                   {
            text: '修改',
            iconCls: 'icon-edit',
            handler: function () {}
        }, '-',{
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {}
	   }, '-', {
		            text: '重载',
		            iconCls: 'icon-reload',
                    handler: function () {
					 $('#showAllUsers').datagrid('loadData', jQuery.parseJSON(allUserInJson).result);}
		        }]
                    ,onBeforeLoad: function () {
					 $(this).datagrid('rejectChanges');}
	    });

	
});


function showLoading(){
	 $("#loading-mask").show();
	 $("#loading").show();
}

function hideLoading(){
	$("#loading-mask").fadeOut("normal");
  $("#loading").fadeOut("normal");
}
