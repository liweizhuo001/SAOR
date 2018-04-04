function showTree(owlFileName, containerID){
	
	var CLS = "Classes";
	var OP = "ObjectProperties";
	var DP = "DataProperies";
	var DT = "Datatype";
	var NS = "http://www.project.com/d2o_owl";
	var htmlElementField = "<fieldset><legend>URI</legend><div>{0}</div></fieldset>";
	var allClassInJson;     //当前owl文件中所有的类
	var allObjPropInJson;   //当前owl文件中所有的对象属性
	var allDataPropInJson;  //当前owl文件中所有的数据属性	
	
	var objType;           //当前选定的节点类型，类、对象属性、数据属性
	var objURI="";         //当前选定的节点URI
	var objText;           //当前选定节点的文字
	var editable=false;    //是否为可编辑节点
	var addable = false;   //判断是否为可添加节点，即作为父类
	var owlInUrl = encodeURI(encodeURI(owlFileName));
	var posturl = ("OwlTreeServlet?owlfile={0}&random={1}").format(owlInUrl,(new Date()).getTime());
	//alert(owlFileName+"**"+encodeURI(owlFileName)+"**"+owlInUrl);
	$("#"+containerID).tree({
		url: posturl,
		cache:false,
		lines:true,
		onClick:function(node){
			//$(this).tree('toggle', node.target);			
			var nodeURI = node.id.split("@@@");  //说明：node.id的结构--type@@@URI
			if(nodeURI.length==1&&nodeURI[0]=="root")	
				addable = false;  //除了最顶级节点外，其他都可以添加子类
			else{
				addable = true;
				if(nodeURI.length==1) //表示为次顶节点
					objURI = "ROOT";
			}
			
			if(nodeURI.length>1){
				//loadUriInfo(nodeURI[1]);	
				objURI = nodeURI[1];
				objText = node.text;				
				editable = true;
			}
			else{
				editable = false;
			}
			if(nodeURI.length>1){  //如果是顶层和次层节点，不响应事件
				if(nodeURI[0]==CLS){//当前类型是class				
					//loadAccordionOfCls(owlFileName,nodeURI[1]);
					//objType = CLS;
					objType="OntClass";
				}			
				else if(nodeURI[0]==OP){ //当前类型是对象属性
					//loadAccordionOfProperty("OP",nodeURI[1],owlFileName);
					//objType= OP;
					objType="ObjectProperty";
				}			
				else if(nodeURI[0]==DP){ //当前类型是数据属性
					//loadAccordionOfProperty("DP",nodeURI[1],owlFileName);
					//objType = DP;
					objType="DatatypeProperty";
				}		
				
				$(".editTable tr").on("mouseover",function(){
					$(this).addClass("over");	
				});			
				$(".editTable tr").on("mouseout",function(){
					$(this).removeClass("over");	
				});	
			}
		}
	});
}


/**
 * 本体编辑函数
 */
//打开添加窗口
function ontOperation(method,owlFile){	
	if(method=="add"){
		ontAdd(owlFile);
	}
	else if(method=="edit"){
		if(editable){
			$('#nodeType').html(objType);
			$('#nodeText').val(objText);			
			$('#editWin').window('open');			
		}
		else{
			$.messager.alert('友情提示','请选择可编辑节点','warning');		
		}
	}
}

//添加新节点函数
function ontAdd(owlFile){
	if(addable){
		$('#addWin').window('open');
		$("#ddlNodeType").combobox("select","NULL");
		$("#addNodeURIText").attr("value","");
		$("#addNodePareentURI").val(objURI);		
	}
	else{
		$.messager.alert('友情提示','请选择可做父类节点','warning');
	}
}

//删除本体节点
function ontDelete(){
	if(editable){
		$.messager.confirm('确定删除','确定要删除当前节点，一旦删除无法恢复?',function(r){  
		    if (r){  
		    	$.ajax({ url: "OwlEditServlet", async: false, type: "post", 
					 data: {owlfile:encodeURIComponent(owlFileName),type:objType, content:encodeURIComponent(objURI),method:"delete"} }).done(function (msg){       
		    	//selectedTableField = jQuery.parseJSON(msg);				
				if(msg=="success"){
					var node = $('#owlTree').tree('getSelected');
					$('#owlTree').tree('remove', node.target);
					$.messager.alert("友情提示","删除成功","info");
				}
				else if(msg=="fail"){
					$.messager.alert("友情提示","删除错误","warning");
				}
		    }); 
		  }  
		});			
	}
	else{
		$.messager.alert('友情提示','请选择可编辑节点','warning');		
	}	
}

//提交修改结果
function ontEditSubmit(){	
	var newNodeText = $("#nodeText").val();	
	if(newNodeText==""){
		$.messager.alert('友情提示','节点标签值不能为空','warning');
	}
	else{
		$.ajax({ url: "OwlEditServlet", async: false, type: "post", 
			     data: {owlfile:encodeURIComponent(owlFileName),type:objType, content:encodeURIComponent(objURI),newcontent:encodeURIComponent(NS+"#"+newNodeText),method:"modify"} 
		      }).done(function (msg) {       
				if(msg=="success"){
					var node = $('#owlTree').tree('getSelected');	
					//alert(newNodeText);
					if (node){
						node.text = newNodeText;
						node.id = (node.id.split("#"))[0]+"#"+newNodeText;
						$('#owlTree').tree('update', node);
						$("#objectUri").html(htmlElementField.format(NS+"#"+newNodeText));
						$.messager.alert("友情提示","修改成功","info");
					}
				}
				else if(msg=="fail"){
					$.messager.alert("友情提示","修改错误","warning");
				}
	    });
		closeWin($("#editWin"));
	}
}

//提交节点添加结果
function ontAddSubmit(){	
	var newNodeType = $("#ddlNodeType").combobox("getValue");   //节点类型，OntClass,ObjectProperty,DatatypeProperty
	var newNodeURI = $("#addNodeURIPre").val()+"#"+$("#addNodeURIText").val();  //新URI
	//var nodeParentURI = $("#ddladdNodeParentText").combobox("getValue");        //父节点URI
	var nodeParentURI = $("#addNodePareentURI").val();
	var nodePre;
	if(newNodeType=="NULL"){
		$.messager.alert("友情提示","请选择节点类型","warning");
	}else if($("#addNodeURIText").val()==""){
		$.messager.alert("友情提示","请输入新节点标签值","warning");
	}
	else{		
		//alert(newNodeType+"*"+newNodeURI+"*"+nodeParentURI);	
		//提交数据做URI编码转义
		$.ajax({ url: "OwlEditServlet", async: false, type: "post", 
				 data: {owlfile:encodeURIComponent(owlFileName),type:newNodeType, content:encodeURIComponent(newNodeURI),supercontent:encodeURIComponent(nodeParentURI),method:"add"} 
		      }).done(function (msg){   
		    	     var iconcls;
					 if(msg=="success"){
						 if(newNodeType=="OntClass"){
							 nodePre = CLS;	
							 iconcls = "icon-classes";
						 }
						 else if(newNodeType=="ObjectProperty"){
							 nodePre = OP;
							 iconcls = "icon-op";
						 }
						 else if(newNodeType=="DatatypeProperty"){
							 nodePre= DP;	
							 iconcls = "icon-dp";
						 }
						 var node = $('#owlTree').tree('getSelected');  //找到当前选定的节点，在树节点上添加新的子节点
						 if(node){							 
							 $('#owlTree').tree('append', {
								 	parent: node.target,								 	
								 	data: [{
								 		iconCls:iconcls,  //根据节点类别提供相应的icon
								 		id: nodePre+"@@@"+newNodeURI,
								 		text: $("#addNodeURIText").val()
								 	}]
								 });
							 $.messager.alert("友情提示","节点添加成功","info");
							 //更新响应的集合，因为集合是全局变量
							 if(newNodeType=="OntClass"){
								 loadAllResource(owlFileName,"getClasses");
							 }
							 else if(newNodeType=="ObjectProperty"){
								 loadAllResource(owlFileName,"getObjProp");
							 }
							 else if(newNodeType=="DatatypeProperty"){
								 loadAllResource(owlFileName,"getDataProp");
							 }
							 
					 	 }
						 else
							 $.messager.alert("友情提示","请选择一个节点","warning");												
					 }
					 else if(msg=="fail"){
						$.messager.alert("友情提示","添加错误","warning");
					}
	    });
		closeWin($("#addWin"));
	}
}

//关闭编辑窗口
function closeWin(targetWin){
	targetWin.window('close');
}

function loadUriInfo(uri){
	//$("#objectUri").empty();
	$("#editRegion").layout('expand','east');
	$("#objectUri").html(htmlElementField.format(uri));
}

function loadAccordionOfCls(owlFileName,currentCls){	
	clearAccordion();	
	$("#editAccordion").accordion("add",{
		id:"restrictions",	
		title:"子类关系",
		iconCls:"icon-select-onto"					
	});
	
	$("#editAccordion").accordion("add",{
		id:"equRestrictions",	
		title:"等价关系",
		iconCls:"icon-table-multiple"					
	});
	
	$("#editAccordion").accordion("add",{
		id:"dataPropsOfCls",	
		title:"类别属性",
		iconCls:"icon-sum"					
	});	
	
	
	//子类等价类管理
	//initial subclass drop down list
	loadAllResource(owlFileName,"getClasses");             //加载当前owl中的所有类别
	$("#restrictions").html(getEditTableofCls());		   //加载子类关系	
	$("#equRestrictions").html(getEditTableofEquCls());    //加载等价关系	
	
	$("#ddlSubclasses").combobox({
		required:true,
        data: allClassInJson,
        valueField: "id",
        textField: "text"
    });		
	
	//当前类的子类
	var subClsInJson = loadSubResource("SubClass",objURI);
	$("#ddlSubclsOfCurrent").combobox({
		required:true,
        data: subClsInJson,
        valueField: "id",
        textField: "text"
    });		
	
	
	//添加等价类的下拉类别
	$("#ddlEquclasses").combobox({
		required:true,
        data: allClassInJson,
        valueField: "id",
        textField: "text"
    });	
	
	//当前类的等价类
	/**
	 * "<td align='left'>" +
						"<a class='linkDelete' id='restrictDeleteEqu' href='javascript:void(0)'>删除</a>" +
					"</td>" +
	 * id='modifyEqu'
	 */	
	var equivalentClsInJson = loadSubResource("Equivalence",objURI);
	$("#modifyEqu").html(appendEquHtml(equivalentClsInJson));
	
	//添加子类或者等价类操作
	//响应保存操作，参数约束类别和对象URI	
	$("#restrictSave").on("click",function(){  //响应子类添加操作	
		//var restrictType = $('input:radio[name="restrictType"]:checked').val();
		var restrictType = "SubClass";
		var uri = $("#ddlSubclasses").combobox("getValue");		
		var nodeText = $("#ddlSubclasses").combobox("getText");		
	    if(uri=="")
	    	$.messager.alert("友情提示","请选择一个类别","warning");	
	    else	
	    	manageSubEquivalentCls(restrictType,uri,nodeText,"add");		
	});
	
	$("#restrictEquSave").on("click",function(){  //响应等价类添加操作	
		//var restrictType = $('input:radio[name="restrictType"]:checked').val();
		var restrictType = "Equivalence";
		var uri = $("#ddlEquclasses").combobox("getValue");		
		var nodeText = $("#ddlEquclasses").combobox("getText");		
	    if(uri=="")
	    	$.messager.alert("友情提示","请选择一个类别","warning");	
	    else	
	    	manageSubEquivalentCls(restrictType,uri,nodeText,"add");		
	});
	
	//响应子类删除操作
	$("#restrictDeleteSub").on("click",function(){  
		var uri = $("#ddlSubclsOfCurrent").combobox("getValue");  //这个uri格式  xxx@@@uri	
		var nodeText = $("#ddlSubclsOfCurrent").combobox("getText");
		//alert(uri);
		if(uri=="")
			$.messager.alert("友情提示","请选择一个类别","warning");	
	    else	    	
	    	manageSubEquivalentCls("SubClass",uri,nodeText,"delete");		
	});
	
	//等价类删除操作	
	$(".deleteEqu").on("click",function(){
		var equCls = $('input:radio[name="equCls"]:checked').val();
		if(equCls)
			manageSubEquivalentCls("Equivalence",equCls,"","delete");	
		else{
			$.messager.alert("友情提示","请选择一个类别","warning");	
		}
	});
	
	$("#restrictUndo").on("click",function(){		
		$("#ddlSubclasses").combobox("setValue","");
	});	
	$("#restrictUndo2").on("click",function(){		
		$("#ddlSubclsOfCurrent").combobox("setValue","");
	});	
	$("#restrictUndo3").on("click",function(){		
		$("#ddlEquSubclasses").combobox("setValue","");
	});	
	
	//list data properties	
	//get the domain and range of current class
	var propertyJson;
	$.ajax({ url: "OwlParseServlet", 
		 async: false, type: "post", 
		 data: { owlfile: owlFileName,clsUri:currentCls} }).done(function (msg) {			
			 propertyJson = jQuery.parseJSON(msg);;
		 });
	
	//display the domain and range of current class		
	//$("#dataPropsOfCls").html(propertyJson);	
	loadClassProperties($("#dataPropsOfCls"),propertyJson.properties);
}

//类别操作，关于子类和等价类，文件名owlFileName和当前节点URI：objURI是全局变量，restrictType:SubClass,Equivalence
function manageSubEquivalentCls(restrictType,uri,nodeText,method){ 
	var message;    //提示信息	
	if(method=='delete'){
		message= "删除";
		$.messager.confirm('确定删除','确定要删除当前关系，一旦删除无法恢复?',function(r){ 
			if(r){
				submitModify(restrictType,uri,nodeText,method,message);
			}				
		});
	}
	else if(method=='add'){
		message = "添加";	
		submitModify(restrictType,uri,nodeText,method,message);
	}
}

//提交类别操作
function submitModify(restrictType,uri,nodeText,method,message){
	var nodePre,iconcls;
	$.ajax({ url: "OwlEditServlet", async: false, type: "post", 
		 data: {owlfile:encodeURIComponent(owlFileName),type:restrictType, content:encodeURIComponent(objURI),newcontent:encodeURIComponent(uri),method:method} 
     }).done(function (msg){   
   	     var iconcls;
			 if(msg=="success"){
				 var node = $('#owlTree').tree('getSelected');  //找到当前选定的节点
				 if(restrictType=="SubClass"){  //添加子类
					 nodePre = CLS;	
					 iconcls = "icon-classes";					 
					 if(node&&method=="add"){							
						 $('#owlTree').tree('append', {
							 	parent: node.target,								 	
							 	data: [{
							 		iconCls:iconcls,  //根据节点类别提供相应的icon
							 		id: nodePre+"@@@"+uri,
							 		text:nodeText,
							 		state: 'closed'
							 	}]
							 });
						 $.messager.alert("友情提示","子类"+message+"成功","info");	
				 	 }
					 else if(node&&method=="delete"){							
						var children;
						if(node){
							children = $('#owlTree').tree('getChildren', node.target);
						} else {
							children = $('#owlTree').tree('getChildren');
						}						
						for(var i=0; i<children.length; i++){
							if(children[i].text==nodeText){
								$('#owlTree').tree('remove', children[i].target);	
								break;
							}							
						}
						$.messager.alert("友情提示","子类"+message+"成功","info");	
					 }
				 }
				 else if(restrictType=="Equivalence"){
					 $.messager.alert("友情提示","等价类"+message+"成功","info");	
					 if(method=="add"){//更新等价类的显示
						 $("#modifyEqu").html(appendEquHtml(loadSubResource("Equivalence",objURI)));
						 $(".deleteEqu").on("click",function(){
								var equCls = $('input:radio[name="equCls"]:checked').val();
								if(equCls)
									manageSubEquivalentCls("Equivalence",equCls,"","delete");	
								else{
									$.messager.alert("友情提示","请选择一个类别","warning");	
								}
							});
					 }
					 else if(method=="delete"){
						 //删除等价类的显示
						 var currentRadio = $('input:radio[name="equCls"]:checked');
						 currentRadio.parent().parent().remove(); 
					 }
				 }
			 }
			 else if(msg=="fail"){
				$.messager.alert("友情提示","操作错误","warning");
			}
     });
}

//加载等价类编辑界面，equivalentClsInJson：某类或属性的等价类的json形式，成员：id和text
function appendEquHtml(equivalentClsInJson){
	var modifyEquHtml = "<table class='listEquCls'>";
	if(equivalentClsInJson.length==0)
		modifyEquHtml += "<tr><td style='color:red'>暂无等价关系.</td></tr>";
	else{
		for(equcls in equivalentClsInJson){
			modifyEquHtml += "<tr><td><input name='equCls' type='radio' value='"+equivalentClsInJson[equcls].id+"'/>"+
							 equivalentClsInJson[equcls].id+"</td>"+
							 "<td align='center' width='80px'>" +
							 	"<a class='linkDelete deleteEqu' href='javascript:void(0)'>删除</a>" +
							 "</td>" +
							 "</tr>";
		}
	}
	modifyEquHtml += "</table>";
	return modifyEquHtml;
}

//加载特定类的对象属性和数据属性
function loadClassProperties(target,properties){
	var htmlTemp = "<tr><td><img src='js/themes/icons/onto_{0}.png'></td><td>{1}</td><td>{2}</td></tr>";
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
		contentHtml += "<tr><td  width='8%'>类型</td><td width='12%'>属性名</td><td width='80%'>属性值</td></tr>";
		$.each(properties, function (i, n) {		
			contentHtml += htmlTemp.format(n.proptype,n.name,n.uri);		 
		});
		contentHtml += "</table>";
	target.html(contentHtml);
}

function loadAllResource(owlFileName,resourceType){
	$.ajax({ url: "OwlTreeServlet", 
			 async: false, type: "post", 
			 data: { owlfile: owlFileName,action:resourceType} }).done(function (msg) {				 
				 if(resourceType=="getClasses")
					 allClassInJson = jQuery.parseJSON(msg);
				 else if(resourceType=="getObjProp")
					 allObjPropInJson = jQuery.parseJSON(msg);
				 else if(resourceType=="getDataProp")
					 allDataPropInJson = jQuery.parseJSON(msg);
    });
}

//属性操作，关于子属性和等价属性，文件名owlFileName和当前节点URI：objURI是全局变量，
//restrictType:SubProperty,EquivalenceProperty。type表示节点类型：OP,DP
function manageProperites(restrictType,type,uri,nodeText,method){ 
	var message;    //提示信息	
	if(method=='delete'){  
		message= "删除";		
	}
	else if(method=='add'){
		message = "添加";		
	}
	submitPropModify(restrictType,type,uri,nodeText,method,message);
}

//提交对属性的操作
function submitPropModify(restrictType,type,uri,nodeText,method,message){
	var nodePre,iconcls;
	$.ajax({ url: "OwlEditServlet", async: false, type: "post", 
		 data: {owlfile:encodeURIComponent(owlFileName),type:restrictType, content:encodeURIComponent(objURI),newcontent:encodeURIComponent(uri),method:method} 
     }).done(function (msg){   
   	     var iconcls;
			 if(msg=="success"){
				 var node = $('#owlTree').tree('getSelected');  //找到当前选定的节点
				 if(restrictType=="SubProperty"){  //添加子属性						
					 if(type=="OP"){
						 iconcls = "icon-op";
						 nodePre = OP;
					 }
					 else if(type=="DP"){
						 iconcls = "icon-dp";
						 nodePre = DP;
					 }
					 if(node&&method=="add"){							
						 $('#owlTree').tree('append', {
							 	parent: node.target,								 	
							 	data: [{
							 		iconCls:iconcls,  //根据节点类别提供相应的icon
							 		id: nodePre+"@@@"+uri,
							 		text:nodeText,
							 		state: 'closed'
							 	}]
							 });
						 $.messager.alert("友情提示","子属性"+message+"成功","info");	
				 	 }
					 else if(node&&method=="delete"){							
						var children;
						if(node){
							children = $('#owlTree').tree('getChildren', node.target);
						} else {
							children = $('#owlTree').tree('getChildren');
						}						
						for(var i=0; i<children.length; i++){
							if(children[i].text==nodeText){
								$('#owlTree').tree('remove', children[i].target);	
								break;
							}							
						}
						$.messager.alert("友情提示","子属性"+message+"成功","info");	
					 }
				 }
				 else if(restrictType=="EquivalenceProperty"){  //操作等价属性					
					 if(method=="add"){//更新等价类的显示
						$("#modifyPropEqu").html(appendEquHtml(loadSubResource("EquProp",objURI)));
						//删除等价属性
						$(".deleteEqu").on("click",function(){
							var equProp = $('input:radio[name="equCls"]:checked').val();
							if(equProp)			
							    manageProperites("EquivalenceProperty","Equ",equProp,"","delete");
							else{
								$.messager.alert("友情提示","请选择一个属性","warning");	
							}
						});
					 }
					 else if(method=="delete"){
						 //删除等价类的显示
						 var currentRadio = $('input:radio[name="equCls"]:checked');
						 currentRadio.parent().parent().remove(); 
					 }
					 $.messager.alert("友情提示","等价属性"+message+"成功","info");	
				 }
			 }
			 else if(msg=="fail"){
				$.messager.alert("友情提示","操作错误","warning");
			}
     });
}

//获取某个类的子类或者等价类.owlFileName是全局变量。resourceType:SubClass,Equivalence,SubProp,EquProp
function loadSubResource(resourceType,nodeURI) {  
	var resourceInJson;
	$.ajax({ url: "OwlParseServlet", 
		 async: false, type: "post", 
		 data: { owlfile: encodeURIComponent(owlFileName),resourceType:resourceType,nodeURI:encodeURIComponent(nodeURI)}}).done(function (msg) {			  
			  resourceInJson = jQuery.parseJSON(msg);			
		 });
	return resourceInJson;
}



//加载属性的定义域和值域
function loadAccordionOfProperty(type,propUri,owlFileName){		
	clearAccordion();	
	$("#editAccordion").accordion("add",{
		id:"domainA",	
		title:"定义域",
		iconCls:"icon-atool"
	});	
	$("#editAccordion").accordion("add",{
		id:"rangeA",	
		title:"值域",
		iconCls:"icon-tools"		
	});	
	$("#editAccordion").accordion("add",{
		id:"subProperties",	
		title:"继承关系",
		iconCls:"icon-select-onto"
	});	
	$("#editAccordion").accordion("add",{
		id:"equProperties",	
		title:"等价关系",
		iconCls:"icon-table-multiple"
	});
	
	//加载属性的定义域和值域
	var domainInJson;
	var rangeInJson;
	$.ajax({ url: "OwlParseServlet", 
		 async: false, type: "post", 
		 data: { owlfile: owlFileName,propUri:propUri,propType:'domain'} }).done(function (msg) {			 
			 domainInJson = jQuery.parseJSON(msg).classes;			
		 });
	$.ajax({ url: "OwlParseServlet", 
		 async: false, type: "post", 
		 data: { owlfile: owlFileName,propUri:propUri,propType:'range'} }).done(function (msg) {			 
			 rangeInJson = jQuery.parseJSON(msg).classes;			
		 });
	
	$("#domainA").html(getEditTableofProp("domain",""));     //初始化定义域编辑界面	 
	$("#rangeA").html(getEditTableofProp("range",""));	     //初始化值域编辑界面 
	$("#subProperties").html(getEditTableofPropRelation());   //初始化属性继承关系编辑界面
	$("#equProperties").html(getEditTableofEquPropRelation());  //初始化属性等价关系编辑界面
	
	//读取当前已有的类别信息，存入变量allClassInJson	
	if(!allClassInJson)
		loadAllResource(owlFileName,"getClasses");		
	
	//初始化已有属性和类别下拉列表	
	$("#ddldomain").combobox({
		required:true,
        data: domainInJson,
        valueField: "id",
        textField: "text"
    });
	$("#ddlrange").combobox({
		required:true,
        data: rangeInJson,
        valueField: "id",
        textField: "text"
    });		
	//初始化类别下拉列表	
	$("#ddldomainclasses").combobox({
		required:true,
        data: allClassInJson,
        valueField: "id",
        textField: "text"
    });
	$("#ddlrangeclasses").combobox({
		required:true,
        data: allClassInJson,
        valueField: "id",
        textField: "text"
    });
	
	//读出当前所有的属性,以及当前节点的子属性	
	var subPropInJson = loadSubResource("SubProp",objURI);   //当前属性的子属性
	if(type=='OP'){//读取对象属性
		if(!allObjPropInJson){
			 loadAllResource(owlFileName,"getObjProp"); //将所有对象属性读入allObjPropInJson
		}
		$("#ddlSubProps").combobox({  //新建子对象属性下拉
			required:true,
	        data: allObjPropInJson,
	        valueField: "id",
	        textField: "text"
		});		
		$("#ddlEquProp").combobox({  //新建等价对象属性下拉
			required:true,
	        data: allObjPropInJson,
	        valueField: "id",
	        textField: "text"
		});
	}
	else if(type=='DP'){ //读取数据属性相关
		if(!allDataPropInJson){
			loadAllResource(owlFileName,"getDataProp"); //将所有数据属性读入allDataPropInJson
		}
		$("#ddlSubProps").combobox({   //新建子数据属性下拉
			required:true,
	        data: allDataPropInJson,
	        valueField: "id",
	        textField: "text"
		});
		$("#ddlEquProp").combobox({    //新建等价数据属性下拉
			required:true,
	        data: allDataPropInJson,
	        valueField: "id",
	        textField: "text"
		});
	}	
	$("#ddlSubPropsOfCurrent").combobox({  //当前子对象属性下拉，这个是全局的，不用分DP和OP
		required:true,
        data: subPropInJson,
        valueField: "id",
        textField: "text"
	});	
	
	//属性关系操作时处理
	$("#subPropUndo").on("click",function(){
		$("#ddlSubProps").combobox("setValue","");
	});
	
	$("#subPropUndo2").on("click",function(){
		$("#ddlSubPropsOfCurrent").combobox("setValue","");
	});
	
	$("#EquPropUndo").on("click",function(){
		$("#ddlEquProp").combobox("setValue","");
	});
	
	 
	$("#subPropSave").on("click",function(){  //添加子属性		
		var uri = $("#ddlSubProps").combobox("getValue");		
		var nodeText = $("#ddlSubProps").combobox("getText");		
	    if(uri=="")
	    	$.messager.alert("友情提示","请选择一个属性","warning");	
	    else	
	    	manageProperites("SubProperty",type,uri,nodeText,"add");			
	});
	
	$("#subPropDelete").on("click",function(){  //删除子属性
		var uri = $("#ddlSubPropsOfCurrent").combobox("getValue");  //这个uri格式  xxx@@@uri	
		var nodeText = $("#ddlSubPropsOfCurrent").combobox("getText");
		//alert(uri);
		if(uri=="")
			$.messager.alert("友情提示","请选择一个类别","warning");	
	    else{	    	
	    	$.messager.confirm('提示','确定要删除该子属性吗?',function(r){   
	    		if(r)
	    			manageProperites("SubProperty",type,uri,nodeText,"delete");
	    	});
	    }
	});
	
	//添加等价属性	
	$("#EquPropSave").on("click",function(){  	
		var uri = $("#ddlEquProp").combobox("getValue");		
		var nodeText = $("#ddlEquProp").combobox("getText");		
	    if(uri=="")
	    	$.messager.alert("友情提示","请选择一个属性","warning");	
	    else	
	    	manageProperites("EquivalenceProperty",type,uri,nodeText,"add");			
	});
	//modifyPropEqu
	var equivalentPropInJson = loadSubResource("EquProp",objURI);
	$("#modifyPropEqu").html(appendEquHtml(equivalentPropInJson));
	
	//删除等价属性
	$(".deleteEqu").on("click",function(){
		var equProp = $('input:radio[name="equCls"]:checked').val();
		if(equProp)			
		    manageProperites("EquivalenceProperty","Equ",equProp,"","delete");
		else{
			$.messager.alert("友情提示","请选择一个属性","warning");	
		}
	});
	
	//删除定义域
	$("#domain_remove").on("click",function(){		
		$.messager.confirm('提示','确定要删除吗',function(r){   
    		if (r){     			   
        			$.ajax({
	                    url:'OwlEditServlet',  
	                    async: false, type: "post",
	                    data:{owlfile: owlFileName,
	                    	  method:"edit",
	                    	  content:objURI,
	                    	  supertype:"domain",
	                    	  supercontent:"delete",
	                    	  newcontent:$("#ddldomain").combobox("getValue")},
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		$.messager.alert('提示', '删除定义域成功','info');	
	                    		$("#ddldomain").combobox("setValue","");
	                    	}
	                    	else
	                    		$.messager.alert('警告', '删除定义域失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('警告', '出错了，操作失败!!!','error');
	                    }
	                });
    		    }   
    		}); 		
	});	
	
	//增加定义域
	$("#domain_save").on("click",function(){
		//alert($("#ddldomainclasses").combobox("getValue"));
		$.messager.confirm('提示','确定要添加定义域吗',function(r){   
    		if (r){     			   
        			$.ajax({
	                    url:'OwlEditServlet',  
	                    async: false, type: "post",
	                    data:{owlfile: owlFileName,
	                    	  method:"edit",
	                    	  content:objURI,
	                    	  supertype:"domain",
	                    	  supercontent:"add",
	                    	  newcontent:$("#ddldomainclasses").combobox("getValue")},
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		$.messager.alert('提示', '定义域添加成功','info');			    		                    		
	                    	}
	                    	else
	                    		$.messager.alert('警告', '定义域添加失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('警告', '出错，操作失败!!!','error');
	                    }
	                });
    		    }   
    		}); 		
	});	
		
	//删除值域
	$("#range_remove").on("click",function(){		
		$.messager.confirm('提示','确定要删除该值域吗',function(r){   
    		if (r){     			   
        			$.ajax({
	                    url:'OwlEditServlet',  
	                    async: false, type: "post",
	                    data:{owlfile: owlFileName,
	                    	  method:"edit",
	                    	  content:objURI,
	                    	  supertype:"range",
	                    	  supercontent:"delete",
	                    	  newcontent:$("#ddlrange").combobox("getValue")},
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		$.messager.alert('提示', '值域删除成功','info');	
	                    		$("#ddlrange").combobox("setValue","");
	                    	}
	                    	else
	                    		$.messager.alert('警告', '操作失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('警告', '出错了，操作失败!!!','error');
	                    }
	                });
    		    }   
    		}); 		
	});	
	
	//添加值域
	$("#range_save").on("click",function(){		
		$.messager.confirm('提示','确定要添加值域吗',function(r){   
    		if (r){     			   
        			$.ajax({
	                    url:'OwlEditServlet',  
	                    async: false, type: "post",
	                    data:{owlfile: owlFileName,
	                    	  method:"edit",
	                    	  content:objURI,
	                    	  supertype:"range",
	                    	  supercontent:"add",
	                    	  newcontent:$("#ddlrangeclasses").combobox("getValue")},
	                    success:function(msg){
	                    	if(msg=="success"){
	                    		$.messager.alert('提示', '值域添加成功','info');			    		                    		
	                    	}
	                    	else
	                    		$.messager.alert('警告', '操作失败','error');
	                    },
	                    error:function(msg){
	                    	 $.messager.alert('警告', '出错了，操作失败!!!','error');
	                    }
	                });
    		    }   
    		}); 		
	});	
	
	$("#range_undo").on("click",function(){		
		$("#rangecontentNew").attr("value","");		
	});	
		
	/*if(type=="OP"){
		$("#editAccordion").accordion("add",{
			id:"characterA",	
			title:"Characteristics",
			iconCls:"icon-gear"		
		});
		$("#characterA").html(getEditofOPCharacter());
	}*/
}
function clearAccordion(){
	if($("#restrictions").length>0){
		$("#editAccordion").accordion("remove","子类关系");
	}
	if($("#equRestrictions").length>0){
		$("#editAccordion").accordion("remove","等价关系");
	}
	if($("#domainA").length>0){
		$("#editAccordion").accordion("remove","定义域");
	}
	if($("#rangeA").length>0){
		$("#editAccordion").accordion("remove","值域");
	}
	if($("#dataPropsOfCls").length>0){
		$("#editAccordion").accordion("remove","类别属性");
	}
	if($("#subProperties").length>0){
		$("#editAccordion").accordion("remove","继承关系");
	}
	if($("#equProperties").length>0){
		$("#editAccordion").accordion("remove","等价关系");
	}
	/*if($("#characterA").length>0){
		$("#editAccordion").accordion("remove","Characteristics");
	}*/
}

//Get the HTML UI for subclass restriction，子类关系编辑界面
function getEditTableofCls(){
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
	contentHtml+="<tr><td colspan='4'>新建子类关系</td>"+				    				     
				  "</tr>";
	contentHtml+="<tr>"+
					"<td>选择类别:</td>"+
					"<td><select id='ddlSubclasses'></select></td>"+
					"<td>" +
						"<a class='linkAdd' id='restrictSave' href='javascript:void(0)'>添加</a>" +
					"</td>" +					
					"<td>" +
						"<a class='linkUndo' id='restrictUndo'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				"</tr>";
	contentHtml+="<tr>"+
					"<td colspan='4'>当前子类</td>"+
				 "</tr>";
	contentHtml+="<tr>"+
					"<td>类别属性:</td>"+
					"<td><select id='ddlSubclsOfCurrent'></select></td>"+
					"<td align='left'>" +
						"<a class='linkDelete' id='restrictDeleteSub' href='javascript:void(0)'>删除</a>" +
					"</td>" +
					"<td>" +
						"<a class='linkUndo' id='restrictUndo2'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				 "</tr>";
	contentHtml+="</table>";	
	return contentHtml;
}

function getEditTableofEquCls(){  //等价关系编辑界面,current当前类，equURIs等价类集合
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
	contentHtml+="<tr><td colspan='4'>新建等价关系</td>"+				   			     
				  "</tr>";
	contentHtml+="<tr>"+
					"<td>选择类别:</td>"+
					"<td><select id='ddlEquclasses'></select></td>"+
					"<td>" +
						"<a class='linkAdd' id='restrictEquSave' href='javascript:void(0)'>添加</a>" +
					"</td>" +					
					"<td>" +
						"<a class='linkUndo' id='restrictUndo3'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				"</tr>";
	contentHtml+="<tr>"+
					"<td colspan='4'>当前等价类</td>"+
				 "</tr>";
	//循环输出等价类
	contentHtml+="<tr>"+					
					"<td colspan='4' id='modifyEqu'></td>"+									
				 "</tr>";
	contentHtml+="</table>";	
	return contentHtml;
}

//生成属性继承关系编辑界面  type为属性的类别 ，"OP"：对象属性，"DP"：数据属性
function getEditTableofPropRelation(){
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
	contentHtml+="<tr><td colspan='4'>新建继承关系</td>"+				    				     
				  "</tr>";
	contentHtml+="<tr>"+
					"<td>选择属性:</td>"+
					"<td><select id='ddlSubProps'></select></td>"+
					"<td>" +
						"<a class='linkAdd' id='subPropSave' href='javascript:void(0)'>添加</a>" +
					"</td>" +					
					"<td>" +
						"<a class='linkUndo' id='subPropUndo'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				"</tr>";
	contentHtml+="<tr>"+
					"<td colspan='4'>当前子属性</td>"+
				 "</tr>";
	contentHtml+="<tr>"+
					"<td>选择属性:</td>"+
					"<td><select id='ddlSubPropsOfCurrent'></select></td>"+
					"<td align='left'>" +
						"<a class='linkDelete' id='subPropDelete' href='javascript:void(0)'>删除</a>" +
					"</td>" +
					"<td>" +
						"<a class='linkUndo' id='subPropUndo2'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				 "</tr>";
	contentHtml+="</table>";	
	return contentHtml;
}
//生成属性等价关系编辑界面
function getEditTableofEquPropRelation(){  
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
	contentHtml+="<tr><td colspan='4'>新建等价关系</td>"+				   			     
				  "</tr>";
	contentHtml+="<tr>"+
					"<td>选择属性:</td>"+
					"<td><select id='ddlEquProp'></select></td>"+
					"<td>" +
						"<a class='linkAdd' id='EquPropSave' href='javascript:void(0)'>添加</a>" +
					"</td>" +					
					"<td>" +
						"<a class='linkUndo' id='EquPropUndo'  href='javascript:void(0)'>重置</a>" +
					"</td>"+
				"</tr>";
	contentHtml+="<tr>"+
					"<td colspan='4'>当前等价属性</td>"+
				 "</tr>";
	//循环输出等价类
	contentHtml+="<tr>"+					
					"<td colspan='4' id='modifyPropEqu'></td>"+									
				 "</tr>";
	contentHtml+="</table>";	
	return contentHtml;
}

//属性定义域和值域
function getEditTableofProp(type,content){
	var contentHtml = "<table class='editTable' cellpadding='0' cellspacing='0'>";
	var currentContent;
	var typeName;	

	//修改定义域和值域，加载已有的定义域和值域
	if(type=="domain"){
		currentContent = "<td width='280px'><select style='width:320px' id='ddl"+type+"'></select></td>";
		typeName = "定义域";
	}
	else{
		currentContent = "<td width='280px'><select style='width:320px' id='ddl"+type+"'></select></td>";
		typeName = "值域";
	}
		
	contentHtml+="<tr><td  colspan='3'><b>当前"+typeName+"：</b></td></tr>";
	contentHtml+="<tr align='left'>" +
					currentContent   +
					"<td width='60px' align='left'>" +
						"<a href='javascript:void(0)' class='linkRemove' id='"+type+"_remove'>删除</a>" +
					"</td>" +
				"</tr>";
	contentHtml+="</table>";
	
	contentHtml+= "<table class='editTable' cellpadding='0' cellspacing='0'>";
	contentHtml+= "<tr><td colspan='3'><b>新建"+typeName+"：</b></td></tr>";
	contentHtml+= "<tr  align='left'>" +
					"<td  width='280px'><select style='width:320px' id='ddl"+type+"classes'></select></td>"+
					"<td  width='60px' align='left'>" +
						"<a href='javascript:void(0)' class='linkAdd' id='"+type+"_save'>添加</a>" +
					"</td>" +
				"</tr>";
	contentHtml+="</table>";
	return contentHtml;
}

