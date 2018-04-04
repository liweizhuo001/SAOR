
function getxmlFiles(){
	$.ajax({url:'ListXMLServlet',
			async:false,
			type:'post',
			data:{
		action:'list'},
	}).done(function(msg){
		showWaiting();
		var menulist = "";
		var listModel = "";
		menulist += '<ul id="nav">';
		
		$.each(jQuery.parseJSON(msg).xmlFiles,
						function(i, n) {
							if (n.text != '') {
								listModel = '<li><div style="width:300px"><input name="x" type="radio" value={0}><span class="icon {1}" ></span>{2}</input></div></li>';
								menulist += listModel.format(n.text, 'icon-owls',n.text);
							}
						});
		menulist += '</ul>';
		$('#XMLPanel').html(menulist);
		hideWaiting();
	});
}


function extractXML(){
	var file=$('#xmlfileinput').val();
	if(file)
	{
	$.ajax({
		url:'ListXMLServlet',
		async:false,
		type:'post',
		data:{
		fileName:file,
		action:'extract'},
		}).done(function(msg){
			
			if(msg=="ok")
				$.messager.alert('恭喜你', 'XML抽取成功！','success');
			else
				$.messager.alert('很遗憾', 'XML抽取失败！','error');
		});
	}
	else{
		$.messager.alert('错误','请先选择XML文件','error');
	}
}

$(function(){	
	$('#brxml').click(function(){
		$('#openXMLFile').window('open');
		getxmlFiles();
	});
	
	$('#btnxml2Onto').click(function(){
		extractXML();
	});
	
	$('#btnOpXMLOk').click(function(){
		var selectedxmlFile='';
		  var radioval=document.getElementsByName("x");    	
	    	for(var i=0;i<radioval.length;i++)
	    	{    	   		
	    		if(radioval[i].checked)
	    			{    			
		    			selectedxmlFile = radioval[i].value;
		    			break;
	    			}
	    	}
	    	if(selectedxmlFile)
	    	{
	    	$('#xmlfileinput').val(selectedxmlFile);
	    	}
		$('#openXMLFile').window('close');
	});
	
	$('#btnOpXMLCancel').click(function(){
		$('#openXMLFile').window('close');
	});
});