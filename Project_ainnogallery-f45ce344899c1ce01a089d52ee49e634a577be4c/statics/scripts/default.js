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