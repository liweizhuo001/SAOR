String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

//get the querystring
var request = {
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
};

//全局变量

var tableInJson;       //数据库中的数据表
var tableFieldInJson;  //当前数据表的模式信息
var fkRelationInJson;  //外键关联数据
var currentTableName;  //当前数据表名
var selectedRow = 0;   //选定的行号
var method;            //new or edit
var thisDBType;
var thisDBName;

//同步的方式取得当前数据库中的数据表
/*$.ajax({ url: "ConnDBServlet", async: false, type: "post", data: { useSession: ""} }).done(function (msg) {
    //tableInJson = eval("(" + msg + ")").tables;
    tableInJson = jQuery.parseJSON(msg).tables;
});*/

//打开外键关联编辑窗口
function openForeignKeyModify(method,keys) {	 
	 $("#tableName").html(currentTableName);
	 if(method=="edit"){
		 $("#ddlkeys").combobox({
             //data: keys,             //if use keys as data,user can't modify primary key
			 //valueField: "PrimaryKey",
             //textField: "PrimaryKey"
             data:tableFieldInJson,
             valueField: "Attribute",
             textField: "Attribute"
         });	
		 if(keys[0].IsPrimaryKey=="Y")
			 $("#chkIsPKey").attr("checked","true");
		 else
			 $("#chkIsPKey").removeAttr("checked");
	 }
	 else{
		 $("#ddlkeys").combobox({
             data: tableFieldInJson,
             valueField: "Attribute",
             textField: "Attribute"
         });
	 }	 
	
     //初始化下拉列表
     $("#ddlTables").combobox({
        data: tableInJson,
        valueField: "text",
        textField: "text",
        //当选定了某个数据表时，字段下拉框动态响应选定的数据表的字段
        onSelect: function () {
            var selectTable = $("#ddlTables").combobox("getValue");
            var selectedTableField;
            $.ajax({ url: "TableSchemaServlet", async: false, type: "post", data: { table: selectTable,dbtype:thisDBType,database:thisDBName} }).done(function (msg) {
                //selectedTableField = eval("(" + msg + ")");
            	selectedTableField = jQuery.parseJSON(msg);
            });
            $("#ddlFields").combobox({
                data: selectedTableField.rows,
                valueField: "Attribute",
                textField: "Attribute"
            });
        }
    });
    $('#foreignKeyModify').window('open');
}



//保存在外键关联窗口中做的修改,有edit和new两种方式
function saveForeignKeyModify() {		
	//Get current parameters
    var relation = $("#ddlTables").combobox("getValue");   //关联数据库库名    
    var attribute="";   
    // If add new row,should modify the attribute combination
    var inputKeys = $("input[name='keys']");
    if((method=="new"||method=="edit") && inputKeys.length>0){
    	inputKeys.each(function (i, v) {
           	if(i==0)
           		attribute += v.value;
           	else
           		attribute += ","+v.value;
        });
    }
    var isPrimaryKey;  
    if($("#chkIsPKey").attr("checked")){
    	isPrimaryKey = "Y";
    }
    else
    	isPrimaryKey="N";
    
    var isForeignKey;
    var foreighKeys="";   
    if(relation=="") {
    	relation="NULL";   
    	foreighKeys="NULL";
    	isForeignKey="N";
    }
    else{
    	isForeignKey = "Y";  
    	$("input[name='fields']").each(function (i, v) {
           	if(i==0)
           		foreighKeys += v.value;
           	else
           		foreighKeys += ","+v.value;
        });
    }  
    
    if(method=="edit"){	  
    	fkRelationInJson[selectedRow].PrimaryKey = attribute;
		fkRelationInJson[selectedRow].Relation = relation;
		fkRelationInJson[selectedRow].IsForeignKey = isForeignKey;
		fkRelationInJson[selectedRow].ForeighKeys = foreighKeys;
		fkRelationInJson[selectedRow].IsPrimaryKey = isPrimaryKey;
    }
    else if(method=="new"){
		var newRow = {};
		newRow.PrimaryKey = attribute;
		newRow.IsPrimaryKey = isPrimaryKey;
		newRow.Relation = relation;
		newRow.IsForeignKey = isForeignKey;
		newRow.ForeighKeys = foreighKeys;
		fkRelationInJson.push(newRow);
	}
    $('#FKRelation').datagrid('loadData', fkRelationInJson);
    if(method=="new"){
    	selectedRow = $('#FKRelation').datagrid('getRows').length-1; 
    }
    $('#FKRelation').datagrid('selectRow', selectedRow);    
    closeForeignKeyModify();
}

function closeForeignKeyModify() {
    $('#foreignKeyModify').window('close');
}

function showLoading(){
	 $("#loading-mask").show();
	 $("#loading").show();
}
function hideLoading(){
	$("#loading-mask").fadeOut("normal");
    $("#loading").fadeOut("normal");
}

function imgFormatter(value) {
    var imgSrc = "<img src=images/{0}.png />";
    return imgSrc.format(value);
}

$(function () {	
	//Display loading information	 
	$("#loading").ajaxStart(function(){ $(this).show(); });
	$("#loading").ajaxStop(function(){  $(this).hide(); });
	
    $("#btnReject").click(function () { closeForeignKeyModify(); });
    $('#btnSave').click(function () { saveForeignKeyModify(); });
      //alert("some"); 
    var targetTable = request.QueryString("table");
    var targetDBType = request.QueryString("dbtype");
    var targetDBName = request.QueryString("database");
    thisDBType = request.QueryString("dbtype");
    thisDBName = request.QueryString("database");
    //alert(targetDBType+targetDBName);
    
    $.ajax({ url: "ConnDBServlet", async: false, type: "post", data: { useSession: "true",table:targetTable,dbtype:targetDBType,database:targetDBName }}).done(function (msg) {
        //tableInJson = eval("(" + msg + ")").tables;
        tableInJson = jQuery.parseJSON(msg).tables;
        //alert("tableInJson"+tableInJson);
    });
   
    //采用同步的方式取得数据
    $.ajax({ url: "TableSchemaServlet",async: false, type: "post", data: { table:targetTable,dbtype:targetDBType,database:targetDBName}}).done(function (msg) {
		        currentData = eval("(" + msg + ")");
    			//currentData = jQuery.parseJSON(msg);
		        //alert("here");
		    	tableFieldInJson = currentData.rows;
		    	fkRelationInJson = currentData.references;
		        currentTableName = currentData.tableName;
    });  
    
   
    
    $('#tableschema').datagrid({});    
    $('#tableschema').datagrid('loadData', tableFieldInJson);
    
    $('#FKRelation').datagrid({
        //url:'TableSchema',
        //data:tableFieldInJson,
        toolbar: [{
			    text: '新建',
			    iconCls: 'icon-add',
			    handler: function () {	
			    	method = "new";
			    	openForeignKeyModify("new",[{PrimaryKey:"null"}]); 
			      }
				}, '-', {
		            text: '修改',
		            iconCls: 'icon-edit',
		            handler: function () {
		                var row = $('#FKRelation').datagrid('getSelected');
		                if (row) {
		                	method = "edit";
		                    selectedRow = $('#FKRelation').datagrid('getRowIndex', row);
		                    //openForeignKeyModify(fkRelationInJson[selectedRow].Attribute);
		                    openForeignKeyModify("edit",[{PrimaryKey:row.PrimaryKey,selected:true,IsPrimaryKey:row.IsPrimaryKey}]);
		                }
		                else {
		                    $.messager.alert('友情提示', '请选择要编辑的字段组合！！！','info');
		                }
		            }
		        }, '-', {
		            text: '保存',
		            iconCls: 'icon-save',
		            handler: function () {
		            	/**
		                 * Send new data to server
		                 */    
		            	var tableNameInUtf=encodeURIComponent(currentTableName);
		            	var fkRelationJsonInUtf = encodeURIComponent(JSON.stringify(fkRelationInJson));
		            	//var fkRelationJsonInUtf = JSON.stringify(fkRelationInJson);
		                $.ajax({
		                    url:'TableRelationServlet',       
		                    data:{tableName:tableNameInUtf,
		                    	  tableSchema:fkRelationJsonInUtf},
		                    success:function(msg){
		                    	if(msg=="success")
		                    		//$.messager.alert('Warning', '操作成功','info');
		                    		$.messager.show({
		                				title:'友情提示',
		                				msg:'数据保存成功.',
		                				timeout:3000,
		                				showType:'slide'
		                			});
		                    	else
		                    		$.messager.alert('Warning', '操作失败','error');
		                    },
		                    error:function(msg){
		                    	 $.messager.alert('Warning', '操作失败!!!','error');
		                    }
		                });
		            }
		        }, '-', {
		            text: '删除',
		            iconCls: 'icon-cancel',
		            handler: function () {
		            	var row = $('#FKRelation').datagrid('getSelected');
						if (row){
							$.messager.confirm('提示','确定要删除？',function(r){   
		                		if (r){   
			                			var index = $('#FKRelation').datagrid('getRowIndex', row);
										$('#FKRelation').datagrid('deleteRow', index);   
		                		    }   
		                		}); 
						}
						else {
		                    $.messager.alert('友情提示', '请选择要删除的字段组合！！！','info');
		                }
					}
		        }, '-', {
		            text: '重载',
		            iconCls: 'icon-reload',
		            handler: function () {
		                $('#FKRelation').datagrid('loadData', fkRelationInJson);
		            }
		        }],
		        onBeforeLoad: function () {
		            $(this).datagrid('rejectChanges');
		        }
	    });
	    $('#FKRelation').datagrid('loadData', fkRelationInJson);
	    
	   
	    
});