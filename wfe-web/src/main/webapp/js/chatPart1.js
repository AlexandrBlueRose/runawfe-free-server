$(document).ready(function() {
	var attachedPosts=[];
	var switchCheak=0;
	var chatForm=document.getElementById('ChatForm');
	var btn = document.getElementById("openChatButton");
	var btn2 = document.getElementById("btnSend");
	var btnOp=document.getElementById("btnOp");
	var imgButton=document.getElementById("imgButton");
	var flag=1;
	var span = document.getElementById("close");
	//var message = document.getElementById("message").value;
	//тест сокет
	var chatSocket = new WebSocket("ws://localhost:8080/wfe/actions");
	chatSocket.onmessage = onMessage;
	chatSocket.onclose = function(){
		$(".modal-body").append("<table ><td>" + "потерянно соединение с чатом сервера"+ "</td></table >");
	}
//-----------
	btn.onclick = function() {
		if(chatForm!=null){
			chatForm.style.display = "block";
			switchCheak=1;
		
		}
	}

	span.onclick = function() {
		chatForm.style.display = "none";
		switchCheak=0;
	}
      	     
   $('#btnCl').hide();
   var inputH=document.getElementById("message");
   var heightModalC=$('.modal-content').height();
   var widthModalC=$('.modal-content').width();
   inputH.style.width = "250px";
   inputH.style.height = "25px";
   btnSend.onclick=function send() { 
	   
	   //сокет тест
	   chatSocket.send("startSoket");
	   
   var message = document.getElementById("message").value;
   var idHierarchyMessage="";
   for(var i=0;i<attachedPosts.length;i++){
	   idHierarchyMessage+=attachedPosts[i]+":";
   }
   let urlString = "/wfe/ajaxcmd?command=SendChatMessage&message="+message+"&chatId="+$('#ChatForm').attr('chatId')+"&idHierarchyMessage="+idHierarchyMessage;
   var today = new Date();
   var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
   var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   var dateTime = date+' '+time;   
   var shipmentСounter=0;
   function ajaxSendMessage(urlString,counter){
	   $.ajax({
			type: "POST",
			url: urlString,
			dataType: "json",
			contentType: "application/json; charset=UTF-8",
			processData: false,
			success: function(data) {
				if(data.text !=null){
					if(data.text!=0){
						counter++;
						if(counter<3){
							ajaxSendMessage(urlString,counter);
						}else {
							$(".modal-body").append("<table ><td>Error id:" + data.text+ "</td><tr><td>"+ dateTime + "</td></tr></table >");
							
						}
					}
					else{
						attachedPosts=[];
					}
				}
			}
		});
   }
   ajaxSendMessage(urlString,shipmentСounter);
   }
  
   btnOp.onclick=function(){
	   if(flag==1){
		flag=0;
	   	$('.modal-content').css({
	   		width: widthModalC+300,
	   	    height: heightModalC+300,
	   	});
	   	
	   	$('.modal-body').css({
	   		height:'630px',
	   	    width: '590px',
	   	});
		$('.modal-header').css({
	   		
	   	    width: '600px',
	   	});
		$('.modal-header-dragg').css({
	   		
	   	    width: '530px',
	   	});
		
		inputH.style.width = "600px";
		inputH.style.height = "70px";
		imgButton.src="/wfe/images/chat_roll_up.png";
	   	//$('#btnOp').
	   	//$('#btnCl').show();
	   }else if(flag==0){
		   imgButton.src="/wfe/images/chat_expand.png";
		   flag=1;
		   $('.modal-content').css({
				 width: '346px',
				 height: '506px',
		   	});
			$('.modal-body').css({
				width: '304px',
		   	    height: '396px',
		   	});
			$('.modal-header').css({
		   		
		   	    width: '316px',
		   	});
			$('.modal-header-dragg').css({
		   		
		   	    width: '220px',
		   	});
			inputH.style.width = "250px";
			inputH.style.height = "25px";
			//$('#btnOp').show();
		   	//$('#btnCl').hide();
	   }
	   	}
   //btnCl.onclick=function(){}
   
   function chatCheckCycle(){
	   var promise = new Promise(function(resolve, reject) {
		   //var urlString = "/wfe/ajaxcmd?command=GettingChatMessage&chatId="+$('#ChatForm').attr('chatId')+"&lastMessageId="+0;
		   var lastMessageId=0;
	
		   //for(;;)
		   setInterval(() => {
			
		
		   {
			   if(switchCheak==1){
			   let urlString = "/wfe/ajaxcmd?command=GettingChatMessage&chatId="+$('#ChatForm').attr('chatId')+"&lastMessageId="+lastMessageId;
				//$(".modal-body").append("<table ><tr><td>"+ lastMessageId + "</td></tr><tr><td>"+ /*dateTime +*/ "</td><td><a> Ответить</a></td></tr></table >");
			   $.ajax({
					type: "POST",
					url: urlString,
					dataType: "json",
					contentType: "application/json; charset=UTF-8",
					processData: false,
					success: function(data) {
						if(data.newMessage==0){
							for(let mes=0;mes<data.messages.length;mes++){
								if(data.messages[mes].text !=null){
									var messageBody="<table><tr><td>"+ data.messages[mes].text ;
									var hierarhyMass="";
									//тут получаем id вложенных
									if(data.messages[mes].hierarchyMessageFlag==1){
										hierarhyMass+="<tr><td><a class=\"openHierarchy\" mesNumber=\""+data.messages[mes].id+"\" loadFlag=\"0\" openFlag=\"0\">Развернуть</a><div class=\"loadedHierarchy\"></div></td></tr>";
									}
									messageBody+="</td></tr>" + hierarhyMass;
									messageBody+= "<tr><td>"+ data.messages[mes].dateTime + "</td><td><a id=\"messReply"+(lastMessageId+mes)+"\" mesNumber=\""+data.messages[mes].id+"\"> Ответить</a></td></tr></table >";
									$(".modal-body").append(messageBody);
									document.getElementById("messReply"+(lastMessageId+mes)).onclick=function(){
										attachedPosts.push($(this).attr("mesNumber"));
									}
								
									addOnClickHierarchyOpen();
									
								}
						}
						if(data.lastMessageId!=null)
							lastMessageId=data.lastMessageId;
					}//if(data.newMessage==0) конец
				}
				});  
			   }else if(switchCheak==10){
				   let urlString = "/wfe/ajaxcmd?command=CheckChatMessageIndicator";
				  
					//$(".modal-body").append("<table ><tr><td>"+ lastMessageId + "</td></tr><tr><td>"+ /*dateTime +*/ "</td><td><a> Ответить</a></td></tr></table >");
				   $.ajax({
						type: "POST",
						url: urlString,
						dataType: "json",
						contentType: "application/json; charset=UTF-8",
						processData: false,
						success: function(data) {
							if(data.newMessageCount>0){
								 document.getElementById("indicateNewMessage").append("<td>ok</td>");
							}
						}
					}); 
			   }
		   }}, 1000);
		   //resolve(0);
		 });
   }
   
   function hierarhyCheak(messageId){
	 let urlString = "/wfe/ajaxcmd?command=GetHierarhyLevel&chatId="+$('#ChatForm').attr('chatId')+"&messageId="+messageId;
	 //var ajaxRet="";		
	 return $.ajax({
			type: "POST",
			url: urlString,
			dataType: "json",
			contentType: "application/json; charset=UTF-8",
			processData: false,
			success: function(data) {
				let ajaxRet="";
				if(data.newMessage==0){
					for(let mes=0;mes<data.messages.length;mes++){
						if(data.messages[mes].text !=null){
							let messageBody="<table><tr class=\"quote\"><td>"+ data.messages[mes].text ;
							let hierarhyMass="";
							//тут получаем id вложенных
							if(data.messages[mes].hierarchyMessageFlag==1){
								hierarhyMass+="<tr class=\"quote\"><td><a class=\"openHierarchy\" mesNumber=\""+data.messages[mes].id+"\" loadFlag=\"0\" openFlag=\"0\">Развернуть</a><div class=\"loadedHierarchy\"></div></td></tr>";
							}
							messageBody+="</td></tr>" + hierarhyMass;
							messageBody+= "</table >";
							
							ajaxRet=ajaxRet+messageBody;
							
						}
				}
					return ajaxRet;
			}//if(data.newMessage==0) конец
			}
	 });
   }
   
   function addOnClickHierarchyOpen(){
	  // let elements = document.getElementsByClassName("openHierarchy");
	   let elements = $(".openHierarchy");
	   //for(let i=0;i<elements.lenght;i++)
	   //{
		   elements.off().on( "click", function(event){
			   if($(this).attr("openFlag")==1){
				   let thisElem=$(".openHierarchy")[0];
				   $(this).next(".loadedHierarchy")[0].style.display="none";
					$(this).attr("openFlag","0");
					//thisElem.innerHTML="Развернуть";
					return 0;
			   }
			   else{
				   let thisElem=$(".openHierarchy")[0];
					if($(this).attr("loadFlag")==1){
						$(this).next(".loadedHierarchy")[0].style.display="block";
						$(this).attr("openFlag","1");
						//thisElem.innerHTML="Свернуть";
						return 0;
					}else{
						let thisElem=$(".openHierarchy")[0];
						let element=this;
						//$(this).next(".loadedHierarchy")[0].append(hierarhyCheak($(this).attr("mesNumber")));
						hierarhyCheak($(element).attr("mesNumber")).then(ajaxRet=>{
							$(this).next(".loadedHierarchy").append(getMessagesText(ajaxRet));						
							addOnClickHierarchyOpen();
							$(element).attr("loadFlag", "1");
							$(this).attr("openFlag","1");
							//thisElem.innerHTML="Свернуть";
							return 0;
						});
					}
				}
			});
	   //}
   }
	chatCheckCycle();
	function getMessagesText(data) {
		let ajaxRet="";
		if(data.newMessage==0){
			for(let mes=0;mes<data.messages.length;mes++){
				if(data.messages[mes].text !=null){
					let messageBody="<table><tr class=\"quote\"><td>"+ data.messages[mes].text ;
					let hierarhyMass="";
					//тут получаем id вложенных
					if(data.messages[mes].hierarchyMessageFlag==1){
						hierarhyMass+="<tr class=\"quote\"><td><a class=\"openHierarchy\" mesNumber=\""+data.messages[mes].id+"\" loadFlag=\"0\" openFlag=\"0\">Развернуть</a><div class=\"loadedHierarchy\"></div></td></tr>";
					}
					messageBody+="</td></tr>" + hierarhyMass;
					messageBody+= "</table >";
					ajaxRet=ajaxRet+messageBody;
					
				}
		}
			return ajaxRet;
	}//if(data.newMessage==0) конец
	}
	//тест сокет
	function onMessage(event) {
		//let device = JSON.parse(event.data);
		$(".modal-body").append("<table ><td>" + "URA! SOKET RUN!"+ "</td></table >");
	}
	
   });



        

       