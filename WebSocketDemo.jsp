<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>WebSocketDemo</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body onload="startWebSocket();">  
	<input type="text" id="writeMsg"></input>  
	<input type="button" value="send" onclick="sendMsg()"></input> 
  
  
</body>

<script type="text/javascript">  
	var ws = null;  
	function startWebSocket() {  
	    if ('WebSocket' in window){  
	        ws = new WebSocket("ws://localhost:8080/SAOR/MyWebSocketServlet.ws");  
	        alert("web socket");
	    }
		else if ('MozWebSocket' in window){  
		    ws = new MozWebSocket("ws://localhost:8080/SAOR/MyWebSocketServlet.ws");  
		    alert("moz socket");
		}
		else {
			 alert("not support");  
		} 
		 ws.onmessage = function(evt) {  
		       alert(evt.data);  
		 };  
			      
		ws.onclose = function(evt) {  
		     alert("close");  
		};  
			      
		ws.onopen = function(evt) {  
		     alert("open");  
		};      
	}
	    
    function sendMsg() {  
	    ws.send(document.getElementById('writeMsg').value);  
	}  
</script>

</html>
