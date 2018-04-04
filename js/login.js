$(function(){
	$('#loginOk').on('click',function(){
		var usercur=$('#UserName').val();
		var passwordcur=$('#Password').val();
		//alert(usercur+'  '+passwordcur);
		
		$.ajax({
			url:"LoginServlet",
			async:false,
			type:"post",
			data:{
				username:usercur,
				password:passwordcur,
		    }
		}).done(function(msg){
	          //alert(msg);
		    	if(msg=="successadmin")
		    	{
		    		//alert("连接成功");
				     window.open('search.jsp','_self');
		    	}
		    	else if(msg=="successnormal")
		    	{
		    		
		    		window.open('search.jsp','_self');
		    		
		    	}
		    	else if(msg=="error")
		    	{
		    		alert("用户名或用户密码有误，请检查您的账号！");
		    		$('#loginCa').click();
		    	}
		    });
	});
	
	
	$('#loginCa').on('click',function(){
		$('#UserName').attr("value","");
		$('#Password').attr("value","");
		$('#UserName').focus();
	})
	
})



