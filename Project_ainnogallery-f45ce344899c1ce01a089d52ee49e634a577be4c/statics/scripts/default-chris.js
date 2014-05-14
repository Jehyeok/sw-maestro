/*********** 전시 커버 애니메이션 ***********/

// 전시 커버 카드 마우스오버 애니메이션
$("#beforeHoverWrapper").mouseenter(
  	function() {
   		$("#beforeHoverWrapper").fadeOut(100);
    	$("#hoverWrapper").fadeIn(300);
  	}
); 

$("#hoverWrapper").mouseleave(
	function () {
  		$("#hoverWrapper").fadeOut(100);
  		$("#beforeHoverWrapper").fadeIn(300);
  	}
);

// 작가 노트 관련 애니메이션
$("#statementBtn").click(function() {
	$('#statementWrapper').fadeIn(50);
	$('#statementWrapper').animate({
		left : '-=' + 945 + 'px'
	}, 300);
	$('#noteClickedWrapper').fadeIn(300);
});

$("#coverBtn").click(function() {
	$('#statementWrapper').animate({
		left : '+=' + 945 + 'px'
	}, 300);
	$("#hoverWrapper").fadeIn(100);
	$('#noteClickedWrapper').fadeOut(300);
	$('#beforeHoverWrapper').hide();
	$('#statementWrapper').fadeOut(50);	
});

// 전시관 입장
$('.enterEx').click(function(e) {
	$('#coverWrapper').animate({
		left : '-=' + $('#coverWrapper').width()*10,
	}, 1500);
	$('#coverCard').animate({
		left : '-=' + $('#coverWrapper').width()*10,
	}, 1500);
});


/******* 헤더 애니메이션 *******/
$(".headerWrapper")
	.hide()
	.mouseleave(function() {
	$(".headerWrapper").slideUp();
});

$(".headerHoverBox").mouseenter(function() {
	$(".headerWrapper").slideDown();
});

/*********** 네비게이터 애니메이션 ***********/
var navRollingWidth = $('.navRolling').width()/3;

$('#navMoveRight').click(function(e) {
	$('#navWrapper').animate({
			left : '-=' + navRollingWidth
	}, 500); 
});

$('#navMoveLeft').click(function(e) {
	$('#navWrapper').animate({
			left : '+=' + navRollingWidth
	}, 500); 
});

/*********** 인디케이터 관련 애니메이션 ***********/
$('#indicator').css('width', 100/length+'%');

var indicatorMove = function(number) {
	console.log('now Shoing: '+number);
	$('#indicator').css('margin-left', number*100*$('#indicator').width()/$(window).width()+'%');
};

$("body").css("overflow", "hidden");