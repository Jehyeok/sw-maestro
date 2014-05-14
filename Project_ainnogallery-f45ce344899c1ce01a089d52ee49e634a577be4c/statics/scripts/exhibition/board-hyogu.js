function getAbs(num) {
	if (num > 0)
		return num;
	else
		return num * (-1);
}

/* Board 객체 선언 */
function Board() {
	this.work_inners_div = '';
	this.work_thumbs_div = '';
	this.main_id = 1;
	this.pre_window_width = window.innerWidth
	this.rolling_width = $('#rolling').width();
}

/**
 * 작품을 서버에서 로드
 * 
 * @param {Number} length 작품 개수
 * @param {String} fileName
 */
Board.prototype.loadWorks = function (length, fileName) {
	for (var i = 0; i < length; i++) {
		$('<div class="work">' +
				'<div class="inner">' +
					'<div class="workLabel">' +
					'</div>' +
					'<img class="workImg" src=' + '"/images/work/' + fileName[i] + '.png" />' +
					'<div class="imgShadow1"></div>' +
					'<div class="imgShadow2"></div>' +
				'</div>' +
			'</div>').appendTo('#workWrapper');
	}

	for (var i = 0; i < length; i++) {
		$('<div class="work_thumb">' +
				'<div class="inner">' +
					'<img src=' + '"/images/work/' + fileName[i] + '.png" />' +
				'</div>' +
			'</div>').appendTo('#navWrapper');
	}
};

/**
 * 작품의 인덱스를 받음
 *
 * @param {Array} thumbs 헤더바 작품 리스트
 * @param {Object} thumb_div 헤더바 작품 중 클릭한 작품
 */
Board.prototype.getWorkIdx = function (thumbs, thumb_div) {
	for (i in thumbs) {
		if (thumbs[i] === thumb_div) return i;
	}
};

/**
 * 모든 작품을 Board 객체의 프로퍼티에 초기화
 */
Board.prototype.setWorksAndThumbs = function () {
	this.work_inners_div = $('.work .inner');
	this.work_thumbs_div = $('.work_thumb');
};

/**
 * 작품을 width 만큼 direction 으로 이동
 *
 * @param {Object} node 이동시킬 작품
 * @param {String} direction '-' or '+' 로 방향 결정
 * @param {Number} width 이동시킬 길이
 */
Board.prototype.moveWithAni = function (node, direction, width) {
	node.animate({
		left : direction + '=' + width
	}, 500)
};

/**
 * 오른쪽이나 왼쪽 작품을 클릭하면
 * 그 방향으로 작품 이동
 */
Board.prototype.moveByClickWork = function (e) {
	var clickedWorkIdx;
	// e.target은 img태그 work태그를 선택하기 위해 parentNode접근 
	var clickedWork = e.currentTarget.parentNode;
					
	$('#mainWork').removeAttr('id');
	$('#main_thumb').removeAttr('id');
	$(clickedWork).attr('id', 'mainWork');

	windowWidth = $(window).width();
	if (e.pageX > windowWidth/2) {
		// 왼쪽으로 이동
		// this.moveWithAni($('#workWrapper'), '-', this.rolling_width);
		this.moveWithAni($('#workWrapper'), '-', "100%")
	} else if (e.pageX < windowWidth/2) {
		// 오른쪽으로 이동
		// this.moveWithAni($('#workWrapper'), '+', this.rolling_width);
		this.moveWithAni($('#workWrapper'), '+', "100%")
	}
	
	clickedWorkIdx = this.getWorkIdx(this.work_inners_div, clickedWork.childNodes[0]);
	this.main_id = clickedWorkIdx;
	indicatorMove(clickedWorkIdx);
	this.work_thumbs_div[clickedWorkIdx].id = 'main_thumb';
};

/**
 * 헤더바에 작품을 클릭하면
 * 클릭한 작품으로 이동
 */
Board.prototype.moveByClickThumb = function (e) {
	var main_thumb_idx;
	var this_idx;
	// e.target은 img태그 thumb태그를 선택하기 위해 grandParentNode접근
	var clickedThumb = e.target.parentNode.parentNode;
	var distance;

	main_thumb_idx = this.getWorkIdx(this.work_thumbs_div, $('#main_thumb')[0]);
	this_idx = this.getWorkIdx(this.work_thumbs_div, clickedThumb);

	// 기존 #main_thumb & #mainWork 지우고 갱신
	$('#main_thumb').removeAttr('id');
	$('#mainWork').removeAttr('id');

	distance = this_idx - main_thumb_idx;
	
	if (distance > 0) {
		// 왼쪽으로 이동
		// this.moveWithAni($('#workWrapper'), '-', Math.abs(distance) * this.rolling_width);
		this.moveWithAni($('#workWrapper'), '-', Math.abs(distance) * 100 + '%');
	} else {
		// 오른쪽으로 이동
		// this.moveWithAni($('#workWrapper'), '+', Math.abs(distance) * this.rolling_width);
		this.moveWithAni($('#workWrapper'), '+', Math.abs(distance) * 100 + '%');
	}

	this.work_thumbs_div[this_idx].id = 'main_thumb';
	this.work_inners_div[this_idx].id = 'mainWork';

	indicatorMove(this_idx);

	this.main_id = this_idx;
};

/**
 * 보고있는 작품에 main id를 부여
 * 
 * mainWork는 전시관에 있는 그림
 * main_thumb는 헤더바에 있는 그림
 */
Board.prototype.setMainWorkAndThumb = function () {
	this.work_inners_div[0].parentNode.id = 'mainWork';
	this.work_thumbs_div[0].id = 'main_thumb';
};

/**
 * 이미지 및 그림자 크기/위치 조절
 */
Board.prototype.setImageSizeAndPos = function () {
	var imgs = $('.workImg');
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].addEventListener('load', function() {
			var workInnerDivWidth = rollingWidth * 0.6;
			var workInnerDivHeight = rollingHeihgt * 0.8;
			var imageRatio = this.width / this.height;

			if (this.height > rollingHeihgt * 0.8) {
				this.style.height = rollingHeihgt * 0.8 + 'px';
				this.style.width = this.height * imageRatio + 'px';
			} else {
				this.style.height = this.height + 'px';
				this.style.width = this.width + 'px';
			}
			
			// 세로 가운데 정렬
			var top = (workInnerDivHeight/2 - this.height/2) / workInnerDivHeight * 100 + '%';
			// 가로 가운데 정렬
			var left = (workInnerDivWidth/2 - this.width/2) / workInnerDivWidth * 100 + '%';

			var imgHeigh_px = this.height * 0.97;
			var imgWidth_px = this.width * 0.94;
			var imgHeight = imgHeigh_px / workInnerDivHeight * 100 + '%';
			var imgWidth = imgWidth_px / workInnerDivWidth * 100 + '%';
			
			// 그림자 가운데 정렬	
			var shadowLeft = (workInnerDivWidth/2 - imgWidth_px/2 + 2) / workInnerDivWidth * 100 + '%';
			// 작가노트 정렬
			var workLabelLeft = (workInnerDivWidth/2 + imgWidth_px/2 + 30) / workInnerDivWidth * 100 + '%';
			var workLabelTop = (workInnerDivHeight/2 + imgHeigh_px/2 - 60) / workInnerDivHeight * 100 + '%';

			this.style.top = top;
			this.nextSibling.style.top = top;
			this.nextSibling.nextSibling.style.top = top;
			this.style.left = left;

			this.nextSibling.style.height = imgHeight;
			this.nextSibling.nextSibling.style.height = imgHeight;

			this.nextSibling.style.width = imgWidth;
			this.nextSibling.nextSibling.style.width = imgWidth;

			this.nextSibling.style.left = shadowLeft;
			this.nextSibling.nextSibling.style.left = shadowLeft;

			this.previousSibling.style.left = workLabelLeft;
			this.previousSibling.style.top = workLabelTop;

		}, false);
	};
}

/**
 * Board 초기화
 * 작품 움직이는 클릭 이벤트 등록
 */
Board.prototype.init = function () {
	// 작품 서버에서 로드
	this.loadWorks(length, fileName);
	// Board객체 프로퍼티에 작품 등록
	this.setWorksAndThumbs();
	// 보고있는 작품에 main id 등록
	this.setMainWorkAndThumb();
	// #workWrapper 참조
	var work_wrapper = this.work_wrapper;
	this.work_wrapper = document.querySelector('#workWrapper');
	// 클릭 이벤트 등록
	$(this.work_thumbs_div).click(this.moveByClickThumb.bind(this));
	$(this.work_inners_div).click(this.moveByClickWork.bind(this));
	this.setImageSizeAndPos();
};

var board = new Board();
board.init();

// 작품 사이즈 조절
var workSize = rollingWidth/$('#workWrapper').width()*99 + '%';
$('.work').css('width', workSize);

var workInner = $('.workInner');
