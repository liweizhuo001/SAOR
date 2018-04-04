function getOwlFiles() {
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
												listModel = '<li><div style="width:300px"><input name="owl" type="radio" value={0}><span class="icon {1}" ></span>{2}</input></div></li>';
												menulist += listModel.format(n.text, 'icon-owls',n.text);
											}
										});
						menulist += '</ul>';
						$('#OWLPanels').html(menulist);
						hideWaiting();
					});
}



$(function(){
	
	$('#btnOntoView').click(function(){
		var owlFileName=$('#ontofileinput').val();
		if(owlFileName)
		window.open ('OntVisual.html?owlFile='+owlFileName,'OntVisual','height=550,width=800,top=100,left=100,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');
		else{
			msgShow("友情提示", "请先选择本体", "warning");
		}
	});
	
	$('#btnselFiles').click(function(){
		$('#openOWL').window('open');
		getOwlFiles();
	});
	
	$('#btnOpOWLOk').click(function(){
		var selectedowlFile='';
		  var radioval=document.getElementsByName("owl");    	
	    	for(var i=0;i<radioval.length;i++)
	    	{    	   		
	    		if(radioval[i].checked)
	    			{    			
		    			selectedowlFile = radioval[i].value;
		    			break;
	    			}
	    	}
	    	if(selectedowlFile)
	    	{
	    	$('#ontofileinput').val(selectedowlFile);
	    	}
		$('#openOWL').window('close');
	});
	
	$('#btnOpOWLCancel').click(function(){
		$('#openOWL').window('close');
	});
	
	
});