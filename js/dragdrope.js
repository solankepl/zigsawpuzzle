// v2 28-11-2014 created by pavan solane
var  zindex =2,
	 imgPath ="imgs/pavan.jpg",
	 gamelevel = "easy", 
	 gamelevelObj = {"easy":"3-3","medium":"6-4","hard":"8-6"},
	 globalTimer,
	 totalSeconds=0;
	 
$(document).ready(function() {	
	$(".popup .btn").on("click", startGame);
	
});

function startGame(){
	gamelevel = $(this).html();
	loadGame(imgPath,gamelevel);	
	$(".startGame").hide(); 
	$("#startOverBtn").on("click", reloadgameClick);
	$("#gridBtn").on("click", showGridBtnClick);
	$("#hintBtn").on("click", hintBtnClick);
	$("#showHidetimerBtn").on("click", showHideTimerClick);
	$("#playPauseBtn").on("click", playPauseBtnClick);
}

function loadGame(pathImg, levelOFGame){	
	$("#arayGigswaPuzzle").find(".sourceImg").load(function() { 
	    var mainImg = $(this);
		var r = Number(gamelevelObj[levelOFGame].split("-")[0]);
		var c = Number(gamelevelObj[levelOFGame].split("-")[1]);
		$(".jigswaPuzzle").css({"background-color":"rgba(255,255,255,0)"});	
		$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"block","opacity":"1"});
		setTimeout(function(){
			initGame(mainImg,r,c);	
		}, 1000);		 
	}).attr("src",pathImg);
}

function showGridBtnClick(){
	if(!$(".dropzone").hasClass("showGried"))
		$(".dropzone").addClass("showGried");
	else	
		$(".dropzone").removeClass("showGried");
}

function hintBtnClick(){
	if($("#arayGigswaPuzzle").find(".sourceImg").css("display") == "block"){
		$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"none","opacity":"1"});
		$(".dropzone").css("opacity",1);
		$(".jigswaPuzzle").css({"background-color":"rgba(255,255,255,1)"});	
	}else{
		$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"block","opacity":"0.4"});
		$(".dropzone").css("opacity",0);
		$(".jigswaPuzzle").css({"background-color":"rgba(255,255,255,0)"});		
	}	
}

function showHideTimerClick(){
	if($("#timerGame").css("display")=== "block"){
		$("#timerGame").css({"display":"none"});		
	}else{
		$("#timerGame").css({"display":"block"});			
	}
}


function reloadgameClick(){	
	totalSeconds=0;
	$(".spanTxt").html(" 00:00 ")
	$("#timerGame").css({"display":"block"});
	$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"none","opacity":"1"});	
	$("#arayGigswaPuzzle").find(".sourceImg").attr("src","");
	loadGame(imgPath,gamelevel);
}

function playPauseBtnClick(){
	var srcPath = $(this).find("img").attr("src");
	if(srcPath === "imgs/pause.png"){
		$(this).find("img").attr("src","imgs/play.png")
	}else{
		$(this).find("img").attr("src","imgs/pause.png")
	}
}

function timerStop(){
	clearInterval(globalTimer);
}

function timerStart(){
	timerStop();
	globalTimer = setInterval(addTime, 1000);
}

function addTime() {
	totalSeconds++;
	var seconds = addZero(totalSeconds % 60);
	var minute= addZero(parseInt(totalSeconds / 60));
	var hours = addZero(parseInt(totalSeconds / 3600));	
	var curTime = seconds +":"+ minute +" ";
	$(".spanTxt").html(curTime)
}
  
function addZero(val) {
	var valString = val + "";
	if (valString.length < 2) {
	  return "0" + valString;
	} else {
	  return valString;
	}
}

function initGame(obj,row, column){	
	var imgWidth =  obj.width();
	var imgHeight = obj.height();		
	var columnWidth = imgWidth/row;
	var columnHeigh = imgHeight/column;	
	var bgPath = obj.attr("src");	
	
	var addJigswaContainer = "<div class='jigswaPuzzle'></div>";
	
	$("#arayGigswaPuzzle").append(addJigswaContainer);	
	$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"none","opacity":"1"});
	$(".jigswaPuzzle").css({"width":imgWidth+"px", "height":imgHeight+"px","background-color":"rgba(255,255,255,1)"});
	$("#arayGigswaPuzzle").css({"width":columnWidth*(row+2.3)+"px", "height":columnHeigh*(column+1.2)+"px"});
	setSquare(columnWidth,columnHeigh,row,column,bgPath);	
}

function setSquare(colW,colH,row,column,bgPath){
	var leftPos=0;
	var topPos=0;
	for(var i=0;i<column;i++){
		for(var j =0;j<row;j++){
			var dropDiv = "<div class='column dropzone' style='width:"+colW +"px;height:"+colH +"px; left:"+leftPos+"px; top:"+topPos+"px;' data-cr='"+i+"_"+j+"'></div>";		
			var strDrag = "<div class='column draggable' style='width:"+colW +"px;height:"+colH +"px; left:"+leftPos+"px; top:"+topPos+"px; background-image:url("+bgPath+");background-position:"+-1*leftPos+"px"+" "+-1*topPos+"px"+";'data-cr='"+i+"_"+j+"'data-orgX='"+ leftPos +"'data-orgY='"+ topPos +"'></div>";				
			strDrag += dropDiv
			$(".jigswaPuzzle").append(strDrag);
			leftPos +=colW; 
		}
		leftPos = 0;
		topPos +=colH;
	}	
	removeDuplicate();
	shuffleDraggableItem();	
	timerStart();
}

function shuffleDraggableItem(){	
	var dragElements = document.querySelectorAll('.draggable');
	var maxL = $(".jigswaPuzzle").width()+($(".column").width()*2);
	var minL =  $(".column").width()*2;	
	var maxT = $(".jigswaPuzzle").height()//+$(".column").width();
	var minT = 0//$(".column").width();
		
	for (var i=0; i < dragElements.length; i++) {
			var drag = dragElements[i];
			var randomX = randomN = Math.floor(Math.random() * maxL) - minL;
			var randomY = randomN = Math.floor(Math.random() * maxT) - minT;
			$(drag).css({"left":randomX+"px","top":randomY+"px"});
			$(drag).draggable({
				containment: '#arayGigswaPuzzle',				
				start: function(event, ui) { $(this).css("z-index", zindex++); }								
			});
	}
	
	var dropElements = document.querySelectorAll('.dropzone');
	for (var i=0; i < dropElements.length; i++) {
		var drop = dropElements[i];
		$(drop).droppable({
            accept: '.jigswaPuzzle div',
            drop: handleDrop,	
			//out: handleOut	
        });
	}		
}

function removeDuplicate(){
	var $div = $("#arayGigswaPuzzle").find(".jigswaPuzzle");
	if ($div.length > 1) {
	   $div.not(':last').remove();
	}
}

function handleDrop( event, ui) {
   var dropNumber = $(this).attr('data-cr');
   var dragNumber = ui.draggable.attr('data-cr');   
   var dragL = $(this).css("left");
   var dragT = $(this).css("top");   
   var dropL = ui.draggable.css("left");
   var dropT = ui.draggable.css("top");
	
	 $(ui.draggable).draggable({		 
		 revert: function (event, ui) {
			 if ( dragNumber === dropNumber ) {
				$(this).css({"left":dragL,"top":dragT});
				$(this).draggable('disable'); 
				/*if(dragL == (dropL-5)){
					console.log(ui.draggable);  
				 }*/
				 checkAns();
			  } 		  
		 }
		 
	 })
}

function setBoxPostion(className, posLeft, posTop){
	var leftPos = posLeft;
	var topPos = posTop;
	var totalObj = $("."+className).length;
	for(var i=0; i<totalObj;i++){
		var curItem = $("."+className+":eq("+i+")");
			curItem.css({"left":leftPos+"px","top":topPos+"px"});
			curItem.attr("dtat-org-Left",leftPos);
			curItem.attr("dtat-org-Top",topPos);
			topPos +=100;
									
	}	
}

function checkAns(){
	var dragElements = document.querySelectorAll('.draggable');
	var showAns = false;
	for (var i=0; i < dragElements.length; i++) {
		var drag = dragElements[i];
		if($(drag).hasClass("ui-draggable-disabled")){
			showAns = true;		
		}else{
			showAns = false;
			break;
		}
	}
	
	if(showAns){
	   timerStop();
	   alert("You Are Win");	
	}	
}


	
	
