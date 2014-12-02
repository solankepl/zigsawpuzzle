// v3 1-12-2014 created by pavan solanke

var  zindex = 2,
	 imgPath = "imgs/pavan.jpg",
	 gamelevel = "easy", 
	 gamelevelObj = {"easy":"5-3","medium":"6-4","hard":"8-6"},
	 globalTimer,
	 totalSeconds=0,
	 shuffleRandon=true;
var  useragent = navigator.userAgent,
				isIphone = !!useragent.match(/iPhone/i),
				isIpad = !!useragent.match(/iPad/i),
				isWinDskp = !!useragent.match(/NT/i);
				androidPhone = !!useragent.match(/Android/i);	 
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
	//$("#playPauseBtn").on("click", playPauseBtnClick);
}

function loadGame(pathImg, levelOFGame){	
	$("#arayGigswaPuzzle").find(".sourceImg").load(function() { 
	    var mainImg = $(this);
		var r = Number(gamelevelObj[levelOFGame].split("-")[0]);
		var c = Number(gamelevelObj[levelOFGame].split("-")[1]);
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
	if($(".jigswaPuzzle").css("background-image") == "none"){
		$(".jigswaPuzzle").css("background-image","url("+imgPath+")");		
	}else{
		$(".jigswaPuzzle").css("background-image","none");
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
	timerStop();
	$("#timerGame").css({"display":"block"});
	$("#arayGigswaPuzzle").find(".sourceImg").css({"display":"none","opacity":"1"});	
	$(".dropzone").removeClass("showGried");
	$(".jigswaPuzzle").css("background-image","none");	
	//$("#arayGigswaPuzzle").find(".sourceImg").attr("src","");
	shuffleDraggableItem();	
	$(".spanTxt").html(" 00:00 ");
	//loadGame(imgPath,gamelevel);
}

function playPauseBtnClick(){
	var srcPath = $(this).find("img").attr("src");
	if(srcPath === "imgs/pause.png"){
		$(this).find("img").attr("src","imgs/play.png");
		alert("timer stop");
		timerStop();		
	}else{
		$(this).find("img").attr("src","imgs/pause.png");
		alert("timer start");
		timerStart();
	}
}

function timerStop(){
	clearInterval(globalTimer);
	globalTimer =null;
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
	var curTime =  minute +":"+ seconds+" ";
	$(".spanTxt").html(curTime);
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
	$(".jigswaPuzzle").css({"width":imgWidth+"px", "height":imgHeight+"px"});
	$("#arayGigswaPuzzle").css({"width":columnWidth*(row+2.3)+"px", "height":columnHeigh*(column+1.3)+"px"});
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
	//removeDuplicate();
	setTimeout(function(){
		shuffleDraggableItem();	
	}, 1000);
	
}

function shuffleDraggableItem(){	
	var dragElements = document.querySelectorAll('.draggable');
	
	var maxL = $(".jigswaPuzzle").width()+($(".column").width()*0.5);
	var minL =  $(".column").width()*0.5;	
	var maxT = $(".jigswaPuzzle").height()//+$(".column").width();
	var minT = 0//$(".column").width();
	
	
	var setX = - ($(".column").width()+20);
	var setY = 0;
	var r = Number(gamelevelObj[gamelevel].split("-")[0]);
	var c = Number(gamelevelObj[gamelevel].split("-")[1]);
	
	var setLevelWiseWidth =2.7;
	var setLevelWiseHeight = 6;
	
	if(gamelevel=="medium"){
		setLevelWiseWidth = 3.9;
		setLevelWiseHeight = 4;
	}if(gamelevel=="hard"){
		setLevelWiseWidth = 6.5;
		setLevelWiseHeight = 2;
	}	
	
	var vWidth = dragElements.length-((c*2)+setLevelWiseWidth);		
	var horzantolX = $(".jigswaPuzzle").width()/vWidth;
	
	//shuffleRandon
		
	for (var i=0; i < dragElements.length; i++) {
			var drag = dragElements[i];		
			//$(drag).css({"left":randomX+"px","top":randomY+"px"});
			$(drag).draggable({
				containment: '#arayGigswaPuzzle',				
				start: function(event, ui) { $(this).css("z-index", zindex++); }								
			});
			
			if(shuffleRandon){
				setAnimation($(drag),setX,setY);			
				if(i<c){
					setY += $(".column").height()+setLevelWiseHeight;
				}else if(i<=(dragElements.length-r)){
					setX += horzantolX;
				}else{
					setY -= $(".column").height()+setLevelWiseHeight;
				}
			}else{
				var randomX = randomN = Math.floor(Math.random() * maxL) - minL;
				var randomY = randomN = Math.floor(Math.random() * maxT) - minT;
				setAnimation($(drag),randomX,randomY);	
			}			
			$(drag).draggable('enable'); 
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

function setAnimation(obj,xPos, yPos){
	obj.animate({
		left: xPos,
		top: yPos
	 }, 1000, 'easeInOutElastic',function() {
		// Animation complete.
		timerStart();
	 });	
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
				$(this).css("z-index","1");
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
	   cheackWin();	
	}	
}


function cheackWin(){
	var setMaddle= "loss"
	if(!$(".dropzone").hasClass("showGried")){
		if(gamelevel == "easy"){
			if(totalSeconds<=50){
				setMaddle = "Win";
			}					
		}else
		if(gamelevel == "medium"){
			if(totalSeconds<=90){
				setMaddle = "Win";						
			}			
			
		}else 
		if(gamelevel = "hard"){
			if(totalSeconds<=180){
				setMaddle = "Win"	;		
			}			
		}				
	} else{
		if(gamelevel == "easy"){
			if(totalSeconds<30){
				setMaddle = "Win";							
			}					
		}else
		if(gamelevel == "medium"){
			if(totalSeconds <=70){
				setMaddle = "Win";					
			}					
		}else 
		if(gamelevel == "hard"){
			if(totalSeconds<=180){
				setMaddle = "Win";							
			}			
		}		
	}
	alert("You "+setMaddle +" game");
	$(".popup .btn").on("click", startGame);
}

