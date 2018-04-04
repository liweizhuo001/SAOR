<%@ page language="java" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Owl File Management</title>
    <link rel="stylesheet" type="text/css" href="css/ajaxLoading.css">
	<link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.5.4/themes/default/easyui.css" />
    <link rel="stylesheet" type="text/css" href="js/jquery-easyui-1.3.1/themes/icon.css" />
    
    <script type="text/javascript" src="js/jquery-easyui-1.5.4/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery-easyui-1.5.4/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="js/json2.js"></script>
     <script type="text/javascript" src="js/tools.js"></script>
    <script type="text/javascript" src="js/OwlFileManagement.js" charset="utf-8"></script>
     <script type="text/javascript" src="js/owlshow.js" charset="utf-8"></script>
     
  </head>
  <body>
        <div>
        <!-- <table id="owlManagement" 
        			style="width: 99%; height: auto" title="本体文件管理" 
        			iconcls="icon-tools"
        			data-options="singleSelect:true,collapsible:true"> -->
        			
       <table  title="Ontologies and alignmenies Management" style="width:99%;height:auto" id="owlManagement">
        			
            <thead>
                <tr align="center">
                    <th field="id"  checkbox="true"></th>
                    <th data-options="field:'text', width:380, align:'center' ">OWL Files</th>
                </tr>
            </thead>
        </table>
    </div>
  </body>
</html>
