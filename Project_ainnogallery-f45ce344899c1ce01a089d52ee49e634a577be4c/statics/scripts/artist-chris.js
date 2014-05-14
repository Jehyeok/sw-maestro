(function(window) {
	if (typeof window.ExhibitionMain === "undefined")
	{
		window.ExhibitionMain = new ExhibitionMain;
		var flag = 0;

		/* WorkDetail 객체 선언 */
		function ExhibitionMain()
		{
			// 객체에서 필요한 변수나 자료는 여기에 선언
			exhibit_inner_div = '';
			return null;
		}

		ExhibitionMain.prototype.loadArtistPageLayout = function(){
			var widthPercent = 100*(width-581)/width;
			$("#interactionCardWrapper").css("width", widthPercent*0.28+"%");
			$('#artistBannerCardWrapper').css("width", widthPercent*0.72+"%").css("left", $("#interactionCardWrapper").width() + 581 + "px");
			$("#artistPageContentWrapper").css("height", height - $("#artistPageUpperWrapper").height());
		}

		ExhibitionMain.prototype.loadExhibitions = function (len, exhibit) {
			for(var i=0; i<len; i++){
				$('<div class="artistExCard" id="artistExCard' + i + '">' +
						'<div class="artistExImage" id="artistExImage' + i + '" style="background-image: url(\'/images/exhibit/' + exhibit[i] + '.png\');"></div>' + 
						'<div class="hoverArtistExImage" id="hoverArtistExImage' + i + '" style="background-image: black; display: none"><p>' + i + '</p></div>' +
						'<div class="artistExDetails">' + 
							'<div class="beforeHoverWrapper" id="beforeHoverWrapper' + i + '">' + 
								'<div class="artistExTitle">' + 
									'<p>' + title[i] + '</p>' + 
								'</div>' + 
								'<div class="artistExSchedule">' + 
									'<p>' + term[i] + '</p>' + 
								'</div>' +
							'</div>' + 
							'<div class="hoverWrapper" id="HoverWrapper' + i + '">' + 
								'<div class="moveEx" onclick="enterExhibition(' + i + ')"></div>' + 
							'</div>' + 
						'</div>' +
					'</div>').appendTo('#artistExCardCover');
			}
		}
		ExhibitionMain.prototype.setExhibit = function(){
			this.exhibit_inner_div = $('.artistExCard');
			this.exhibit_moving_left_div = $('#exhibitionMoveLeft');
			this.exhibit_moving_right_div = $('#exhibitionMoveRight');
		}
		ExhibitionMain.prototype.moveAnimation = function(node, direct, width){
			node.animate({
				left: direct + '=' + width,
			}, 500);
		}
		ExhibitionMain.prototype.moveClickExhibitLeft = function(){
		//	console.log("Left click before left : " + left_exhibit);
		//	console.log("Left click before right : " + right_exhibit);
			if(left_exhibit - exhibit_num <= 0){
				this.moveAnimation($('#artistExCardWrapper'), '+', (left_exhibit - 1)*255);
				right_exhibit -= left_exhibit - 1;
				left_exhibit = 1;
			}
			else{
				this.moveAnimation($('#artistExCardWrapper'), '+', rollingWidth);
				left_exhibit -= exhibit_num;
				right_exhibit -= exhibit_num;
			}
		//	console.log("Left click after left : " + left_exhibit);
		//	console.log("Left click after right : " + right_exhibit);
		}
		ExhibitionMain.prototype.moveClickExhibitRight = function(){
		//	console.log("Right click before left : " + left_exhibit);
		//	console.log("Right click before right : " + right_exhibit);
			if(right_exhibit + exhibit_num > len){
				this.moveAnimation($('#artistExCardWrapper'), '-', (len - right_exhibit)*255);
				left_exhibit += len - right_exhibit;
				right_exhibit = len;
			}
			else{
				this.moveAnimation($('#artistExCardWrapper'), '-', rollingWidth);
				right_exhibit += exhibit_num;
				left_exhibit += exhibit_num;
			}
		//	console.log("Right click after left : " + left_exhibit);
		//	console.log("Right click after right : " + right_exhibit);
		}
		ExhibitionMain.prototype.init = function(){
			this.loadExhibitions(len, exhibit);
			this.loadArtistPageLayout();
			this.setExhibit();
			$(this.exhibit_moving_left_div).click(this.moveClickExhibitLeft.bind(this));
			$(this.exhibit_moving_right_div).click(this.moveClickExhibitRight.bind(this));
		}
	}
})(window);
ExhibitionMain.init();

function enterExhibition(idx){
	var url;
	url = "/sema/exhibitions/" + idx;
	location.href = url;
}

$(window).resize(function() {
	pre_exhibit_num = exhibit_num;
	exhibit_num = Math.floor((document.body.clientWidth-5) / 255);
	if(exhibit_num > len)	exhibit_num = len;
	if(width - document.body.clientWidth < 0){
		if((exhibit_num != pre_exhibit_num) && (right_exhibit == len)){
			if(left_exhibit - (exhibit_num - pre_exhibit_num) >= 1)	ExhibitionMain.moveAnimation($('#artistExCardWrapper'), '+', (exhibit_num - pre_exhibit_num) * 255);
			if(left_exhibit - (exhibit_num - pre_exhibit_num) < 1)	left_exhibit = 1;
			else													left_exhibit -= exhibit_num - pre_exhibit_num;
		}
	}
	width = document.body.clientWidth;
	rightwidth = width-30;
	widthPercent = 100 * (width-581)/document.body.clientWidth;
	right_exhibit = left_exhibit + exhibit_num - 1;
	if(right_exhibit > len)	right_exhibit = len;
	if(width < 255)		rollingWidth = 255;
	else				rollingWidth = exhibit_num * 255;
	if(width - 60 - (len * 255) < 0){
		$('#artistPageContentWrapper').css('padding-left', '30px');
		$('#artistExCardWrapper').css('margin', '0 0');
	}
	else if(left_exhibit == 1){
		$('#artistPageContentWrapper').css('padding-left', '0px');
		$('#artistExCardWrapper').css('margin', '0 auto');
	}
	$('#artistBannerCardWrapper').css("width", widthPercent*0.72+"%").css("left", $("#interactionCardWrapper").width() + 581 + "px");
	$('#artistPageContentWrapper').css('width', width +'px');
	$('#exhibitionMoveRight').css('left', rightwidth + 'px');
})

$(".artistExCard").bind('mouseenter', function(){
	var divs = $(".artistExCard");
	var i = divs.index($(this));
	$("#beforeHoverWrapper" + i).fadeOut(100);
	$("#hoverArtistExImage" + i).fadeIn(300);
	$("#HoverWrapper" + i).fadeIn(300);
});

$(".artistExCard").bind('mouseleave', function(){
	var divs = $(".artistExCard");
	var i = divs.index($(this));
	$("#HoverWrapper" + i).fadeOut(100);
	$('#hoverArtistExImage' + i).fadeOut(100);
	$("#beforeHoverWrapper" + i).fadeIn(300);
});

