	
	/** 系统框架**/
	
	var layer;
    layui.use('layer', function(){
    	layer = layui.layer;
    });
	
	var seledOwls = new Array(2);
	$(function () {
		$("#loading").ajaxStart(function(){ $(this).show(); });
	    tabClose();
	    tabCloseEven();
	    //Menu Event
	    $('#subm1').menu({  
	        onClick:function(item){  
	        	if(item.text=='Upload'){
	        		 addTab(item.text, 'FileUpload.htm');
	        	}
	        	else if(item.text=='SemiAutoRepair'){
	        		if(seledOwls[0]==null || seledOwls[1] == null){
	        			layer.alert("Please select ontology", {icon:2});
	        		}
	        		else{
	        			var params = "owl1={0}&owl2={1}".format(seledOwls[0], seledOwls[1]);
	        			addTab('SemiAutoRepair', 'SemiRep.jsp?'+params);
	        		}
	        	}
	        	else if("Owl Manage" == item.text){
	        		addTab(item.text, 'OwlFileManagement.jsp');
	        	}
	        }  
	    }); 
	  
	    $('#btnOFCancel').on('click',function(){
	    	$('#openOwlFile').window('close');    	
	    });
	    $('#btnDBCancel').on('click',function(){
	    	$('#selectDB').window('close');
	    });
	    $('#btnOFOk').on('click',function(){
	        var checkval=document.getElementsByName("c");    	
	    	for(var i=0;i<checkval.length;i++)
	    	{    	   		
	    		if(checkval[i].checked)
	    			{    			
		    			if($.inArray(checkval[i].value,checkedval)==-1)
		    			{
		    				checkedval.push(checkval[i].value);	
		    			}
	    			}
	    	}
	    	checkedval.sort();
	    	getOwlsFiles();
	    	$('#openOwlFile').window('close');
	    });   
	    $("#loading").ajaxStop(function() { $(this).hide(); });
	    hideWaiting();    
});

/***
 * Open the window for link database
 */
function openDbLink(){
  //if($("#dbOfAccordion").length>0){
	//$("#dbOfAccordion").panel("expand");
 // }else{
	$('#linkdb').window('open');
	initLinkDB();
 // }
}
/**
* 
* Close the database link window
 */
function closeDbLink(){
	$('#linkdb').window('close');
}
 
/**
* user choose the owl files ,and then the selected files show in the left
* 用户选择本体文件时执行下列4个函数
*/

function getOwlFiles(){
	var postUrl = "ListOwlsServlet";
	   $.post(postUrl,function(msg){
	   	//showWaiting(); 
	   	loadFiles($("#openOwlFile"),jQuery.parseJSON(msg).owlFiles,'icon-owls'); 
	   // hideWaiting();
	  });
}

function loadFiles(target,remoteJson,iconcls){
	//target.empty(); //clear target element 	
	var menulist = "";  
	var listModel = "";
	menulist += '<ul id="nav">';
	$.each(remoteJson, function(i, n) {
		if(n.text!=''){
			listModel ='<li><div style="width:300px"><input name="c" type="checkbox" value={0}><span class="icon {1}" ></span>{2}</input></div></li>';
			menulist += listModel.format(n.text,iconcls,n.text);
		}
	});
	menulist += '</ul>';		
	$('#owlPanel').html(menulist);
}

function getOwlsFiles(){		
		if($("#owlOfAccordion").length>0){
			$('#left-nav').accordion('remove','打开本体');
		}
		loadOwlTree($("#left-nav"),checkedval,'icon-owls','OwlShow.jsp','owlfile','owlOfAccordion','打开本体','icon-edit3');	
}


function loadOwlTree(target,array,iconcls,url,param,panelId,panelTitle,panelIconCls){
	//target.empty(); //clear target element 	
	var menulist = "";  
	var listModel = "";
	menulist += '<ul id="nav">';
	$.each(array, function(i, n) {
		if(n!=''){
			listModel = '<li><div><a target="mainFrame" href={0}?{1}={2} ><span class="icon {3}" ></span>{4}</a></div></li> ';				
			menulist += listModel.format(url,param,n,iconcls,n);
		}
	});
	menulist += '</ul>';	
	//target.append(menulist);
	$('#left-nav').accordion('add',{
		id:panelId,	
		title:panelTitle,
		iconCls:panelIconCls,
		content:menulist			
	});
	
	var deleteHtml = "<a id='delete' href='javascript:void(0)' onclick=alert('delete') style='margin-left:5px' >删除</a>";
	$('#nav li div a').click(function(){
		var tabTitle = $(this).text();
		var url = $(this).attr("href");
		addTab(tabTitle,url);
		$('#nav li div').removeClass("selected");
		$(this).parent().addClass("selected");
	}).hover(function(){
		$(this).parent().addClass("hover");
		},function(){
			$(this).parent().removeClass("hover");
		});
}
/**
* Get owl files in the server --eval('('+msg+')').owlFiles
*/
function getOwls(action){	
	if(action == "reload"||$("#owlOfAccordion").length==0){
		if($("#owlOfAccordion").length>0){
			$('#left-nav').accordion('remove','本体文件');
		}
		var postUrl = "ListOwlsServlet";
		   $.post(postUrl,function(msg){
		   	showWaiting(); 
		   	loadTree($("#left-nav"),jQuery.parseJSON(msg).owlFiles,'icon-owls','OwlShow.jsp','owlfile','owlOfAccordion','本体文件','icon-edit3'); 
		    hideWaiting();
		  });
	}
	else if($("#owlOfAccordion").length>0){
		$("#owlOfAccordion").panel("expand");
	}
}
        
/**
 * Load tree from json data
 */
       //loadTree($("#west"),eval('('+msg+')').tables,'icon-data','TableSchema.html','table',showId,showName,'icon-db');
function loadTree(target,remoteJson,iconcls,url,param,panelId,panelTitle,panelIconCls){
	//target.empty(); //clear target element 	
	var menulist = "";  
	var listModel = "";
	menulist += '<ul id="nav">';
	$.each(remoteJson, function(i, n) {
		if(n.text!=''){
			listModel = '<li><div><a target="mainFrame" href={0}?{1}={2} ><span class="icon {3}" ></span>{4}</a></div></li> ';				
			//menulist += listModel.format(url,param,encodeURI(encodeURI(n.text)),iconcls,n.text);  //文件名做了编码转换
			menulist += listModel.format(url,param,n.text,iconcls,n.text);  
		}
	});
	menulist += '</ul>';	
	//target.append(menulist);
	$('#left-nav').accordion('add',{
		id:panelId,	
		title:panelTitle,
		iconCls:panelIconCls,
		content:menulist			
	});
	//Add delete button
	var deleteHtml = "<a id='delete' href='javascript:void(0)' onclick=alert('delete') style='margin-left:5px' >删除</a>";
	$('#nav li div a').click(function(){
		var tabTitle = $(this).text();
		var url = $(this).attr("href");
		addTab(tabTitle,url);
		$('#nav li div').removeClass("selected");
		$(this).parent().addClass("selected");
	}).hover(function(){
		$(this).parent().addClass("hover");
		},function(){
			$(this).parent().removeClass("hover");
		});
}
/*
 * 重载后的loadtree，用于记录数据库类型和数据库名
 * */
//loadTree($("#west"),eval('('+msg+')').tables,'icon-data','TableSchema.html',DatabaseType,DBName,'table',showId,showName,'icon-db'); 
function loadTree(target,remoteJson,iconcls,url,DBType,DBName,param,panelId,panelTitle,panelIconCls){
	//target.empty(); //clear target element 	
	var menulist = "";  
	var listModel = "";
	menulist += '<ul id="nav">';
	$.each(remoteJson, function(i, n) {
		if(n.text!=''){
			listModel = '<li><div><a target="mainFrame" href={0}?dbtype={1}&database={2}&{3}={4} ><span class="icon {5}" ></span>{6}</a></div></li> ';				
			//menulist += listModel.format(url,param,encodeURI(encodeURI(n.text)),iconcls,n.text);  //文件名做了编码转换
			menulist += listModel.format(url,DBType,DBName,param,n.text,iconcls,n.text);  
		}
	});
	menulist += '</ul>';	
	//target.append(menulist);
	$('#left-nav').accordion('add',{
		id:panelId,	
		title:panelTitle,
		iconCls:panelIconCls,
		content:menulist			
	});
	//Add delete button
	var deleteHtml = "<a id='delete' href='javascript:void(0)' onclick=alert('delete') style='margin-left:5px' >删除</a>";
	$('#nav li div a').click(function(){
		var tabTitle = $(this).text();
		var url = $(this).attr("href");
		addTab(tabTitle,url);
		$('#nav li div').removeClass("selected");
		$(this).parent().addClass("selected");
	}).hover(function(){
		$(this).parent().addClass("hover");
		},function(){
			$(this).parent().removeClass("hover");
		});
}

/*
 * 采用同步的方式取得数据,_method:get post
 */
function getSyncData(_url,_method,_param){
	var result;
    $.ajax({url:url,async:false,type:_param,data:{param:_param}}).done(function(msg){
    	result =  eval("("+msg+")");
    });
    return result;
}



function addTab(subtitle, url,iconcls) {
    if (!$('#tabs').tabs('exists', subtitle)) {
        $('#tabs').tabs('add', {
            title: subtitle,
            content: createFrame(url),
            iconCls:iconcls,
            closable: true,
            width: $('#mainPanle').width() - 10,
            height: $('#mainPanle').height() - 26
        });
    } else {
        $('#tabs').tabs('select', subtitle);
    }
    tabClose();
}

function createFrame(url) {
    var s = '<iframe name="mainFrame" scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>';
    return s;
}

function tabClose() {
    //Double click close tab    
    $(".tabs-inner").dblclick(function () {
        var subtitle = $(this).children("span").text();
        $('#tabs').tabs('close', subtitle);
    });
    $(".tabs-inner").bind('contextmenu', function (e) {
        $('#mm').menu('show', {
            left: e.pageX,
            top: e.pageY
        });
        var subtitle = $(this).children("span").text();
        $('#mm').data("currtab", subtitle);
        return false;
    });
}
/**
 * Bind right menu event
 */
function tabCloseEven() {
    //Close current tab
    $('#mm-tabclose').click(function () {
        var currtab_title = $('#mm').data("currtab");
        $('#tabs').tabs('close', currtab_title);
    });
    //close all tabs
    $('#mm-tabcloseall').click(function () {
        $('.tabs-inner span').each(function (i, n) {
            var t = $(n).text();
            $('#tabs').tabs('close', t);
        });
    });
    //Close all tabs except current
    $('#mm-tabcloseother').click(function () {
        var currtab_title = $('#mm').data("currtab");
        $('.tabs-inner span').each(function (i, n) {
            var t = $(n).text();
            if (t != currtab_title)
                $('#tabs').tabs('close', t);
        });
    });
    //Close the right tabs of current tab
    $('#mm-tabcloseright').click(function () {
        var nextall = $('.tabs-selected').nextAll();
        if (nextall.length == 0) {
            //msgShow('系统提示','后边没有啦~~','error');
            alert('后边没有啦~~');
            return false;
        }
        nextall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });
    //Close the left tabs of current tab
    $('#mm-tabcloseleft').click(function () {
        var prevall = $('.tabs-selected').prevAll();
        if (prevall.length == 0) {
            alert('到头了，前边没有啦~~');
            return false;
        }
        prevall.each(function (i, n) {
            var t = $('a:eq(0) span', $(n)).text();
            $('#tabs').tabs('close', t);
        });
        return false;
    });
    //exit
    $("#mm-exit").click(function () {
        $('#mm').menu('hide');
    });
}



