/*--另開視窗------------------------------------------------------------------------------------------*/
function MM_openBrWindow(theURL,winName,features) {
window.open(theURL,winName,features);
}
/*--跳出訊息------------------------------------------------------------------------------------------*/
function MM_popupMsg(msg) { //v1.0
  alert(msg);
}
/*--帶參數轉向用------------------------------------------------------------------------------------------*/
function chgLink(strLink,PKey){
    document.form1.PKey.value=PKey;
    document.form1.action= strLink;
    document.form1.submit();
}

function itemLink(strLink,Class1,Class2){
    document.form1.Class1.value=Class1;
    document.form1.Class2.value=Class2;
    document.form1.action= strLink;
    document.form1.submit();
}

function GotoPage(tPage,theForm){
    theForm.Page.value=tPage;
	//alert(tPage);
	theForm.submit();
}
function GotoPage2(tPage,theForm){
	theForm.Page2.value=tPage;
	//alert(tPage);
	theForm.submit();
}

function bookmark()
{
	if ( document.all )
		window.external.AddFavorite(document.location, "ProLeda");
}

function bookmark() 
{ 
	if ( document.all ) 
		window.external.AddFavorite(document.location, "oec space"); 
} 
function bookmarksite(title, url){ 
	if (document.all) 
		window.external.AddFavorite(url, title); 
	else if (window.sidebar) 
		window.sidebar.addPanel(title, url, "") 
}
/*--圖層顯示及隱藏-------------------------------------------------------------------------------------*/
function view_ans(num) { 
if(document.getElementById("ans" + num).style.display == "none") { 
document.getElementById("ans" + num).style.display = "block"; 
} else if(document.getElementById("ans" + num).style.display == "block") { 
document.getElementById("ans" + num).style.display = "none"; 
} 
} 


function close_ans(num) {
if(document.getElementById("ans" + num).style.display == "block")
{
document.getElementById("ans" + num).style.display = "none";
}
}
/*--圖片切換--------------------------------------------------------------------------------------*/
function swapImg(photo, title, slink, tmpImg, nw, nh){
	var myImg = document.getElementById("main");
	myImg.setAttribute("src",photo);
	myImg.setAttribute("title",title);
	
	/*var imglink = document.getElementById("imglink");
	imglink.setAttribute("href",slink);*/
	
	/*if (title.length > 0){
	var oLi = document.getElementById("tx1");
	oLi.innerHTML =title+"";}*/
	
	/*
	var oLi = document.getElementById("main");
	oLi.src="../DB/Upload/"+photo;
	oLi.alt=title;*/
	
	AlumbImg(tmpImg, nw, nh);
}
/*--縮圖----------------------------------------------------------------------------------------*/
function AlumbImg(tmpImg, sw, sh) {
	var boxWidth = sw; //縮圖寬度--大圖的高度
	var boxHeight = sh; //縮圖高度

	var screenImage = $("#" + tmpImg);
	var theImage = new Image();
	theImage.src = screenImage.attr("src");
	var imgWidth = theImage.width;
	var imgHeight = theImage.height;

	var t = "tmpImg = " + tmpImg + "\n";
	t += "範圍 w = " + boxWidth + " | h = " + boxHeight + "\n";
	t += "原圖 w = " + imgWidth + " | h = " + imgHeight + "\n";
	
	var NimgWidth = 0;
	var NimgHeight = 0;
	
	screenImage.removeAttr('width');
	screenImage.removeAttr('height');

	if (imgWidth > boxWidth || imgHeight > boxHeight)
	{
        if((boxWidth/boxHeight)>=(imgWidth/imgHeight))
        {
			NimgWidth = Math.ceil((boxHeight*imgWidth)/imgHeight);
			NimgHeight = boxHeight;
        }
        else
        {
			NimgWidth = boxWidth;
			NimgHeight = Math.ceil((boxWidth*imgHeight)/imgWidth);
        }
	}
	else
	{
		NimgWidth = imgWidth;
		NimgHeight = imgHeight;
	}
	
	screenImage.css({height:NimgHeight, width:NimgWidth});
	
	t += "新圖 w = " + NimgWidth + " | h = " + NimgHeight + "\n";
	//alert(t);
}



/*-------------------table tr td hover
$(document).ready(function(){   
    $(".tables tr").mouseover(function(){    
      $(this).addClass("over");}).mouseout(function(){    
            $(this).removeClass("over");})   
  $(".tables tr:even").addClass("even");    
});   
------------------------------*/
	
/*--------------gotop-------------------*/
$(document).ready(function(){
	//Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 500) {
			$('#goTop').fadeIn();
		} else {
			$('#goTop').fadeOut();
		}
	});
	//Click event to scroll to top
	$('#goTop').click(function(){
		$('html, body').animate({scrollTop : 0},500);
		return false;
	});
});



/*<!------------sidebar---------------->*/
$(document).ready(function(){
	  if ($(window).width() >= 750 && !$('.sidebar .collapse').hasClass('in')) {
		  $('#sidenav').collapse('show');
	  } else if ($(window).width() < 750 && $('.sidebar .collapse').hasClass('in')) {
		  $('#sidenav').collapse('hide');
	  }
});


