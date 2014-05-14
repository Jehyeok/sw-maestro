var Board = {
	work_inners_div: '',
	work_thumbs_div: '',
	loadWorks: function (length, fileName) {
		for (var i = 0; i < length; i++) {
			$('<div class="work">' +
					'<div class="inner">' +
						'<div class="workLabel1">' +
							'<div class="workLabel2">' +
								'<div class="workLabel3"></div>' +
							'</div>' +
						'</div>' +
						'<img src=' + '"/images/work/' + fileName[i] + '.png" />' +
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
	},
	getWorkIdx: function (thumbs, thumb_div) {
		for (i in thumbs) {
			if (thumbs[i] === thumb_div) return i;
		}
	},
	setWorksAndThumbs: function () {
		this.work_inners_div = $('.work .inner');
		this.work_thumbs_div = $('.work_thumb');
	},
	moveWithAni: function (node, direction, width) {
		node.animate({
			left : direction + '=' + width
		}, 500)
	},
	moveByClickWork: function (e) {
		var clickedWorkIdx;
		// e.target은 img태그 work태그를 선택하기 위해 parentNode접근 
		var clickedWork = e.currentTarget.parentNode;
		console.log(e.currentTarget.parentNode);
						
		$('#mainWork').removeAttr('id');
		$('#main_thumb').removeAttr('id');

		$(clickedWork).attr('id', 'mainWork');

		windowWidth = $(window).width();
		if (e.pageX > windowWidth/2) {
			// 왼쪽으로 이동
			this.moveWithAni($('#workWrapper'), '-', rollingWidth);
		} else if (e.pageX < windowWidth/2) {
			// 오른쪽으로 이동
			this.moveWithAni($('#workWrapper'), '+', rollingWidth);
		}
		
		clickedWorkIdx = this.getWorkIdx(this.work_inners_div, clickedWork.childNodes[0]);
		console.log(clickedWorkIdx);
		indicatorMove(clickedWorkIdx);
		this.work_thumbs_div[clickedWorkIdx].id = 'main_thumb';
	},
	moveByClickThumb: function (e) {
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
			this.moveWithAni($('#workWrapper'), '-', Math.abs(distance) * rollingWidth);
		} else {
			// 오른쪽으로 이동
			this.moveWithAni($('#workWrapper'), '+', Math.abs(distance) * rollingWidth);
		}

		this.work_thumbs_div[this_idx].id = 'main_thumb';
		this.work_inners_div[this_idx].id = 'mainWork';

		indicatorMove(this_idx);
	},
	setMainWorkAndThumb: function () {
		this.work_inners_div[0].parentNode.id = 'mainWork';
		this.work_thumbs_div[0].id = 'main_thumb';
	},
	init: function () {
		this.loadWorks(length, fileName);
		this.setWorksAndThumbs();
		this.setMainWorkAndThumb();

		$(this.work_thumbs_div).click(this.moveByClickThumb.bind(this));
		$(this.work_inners_div).click(this.moveByClickWork.bind(this));
	}
}

Board.init();
// 작품 사이즈 조절
var workSize = rollingWidth/$('#workWrapper').width()*100 + '%';
$('.work').css('width', workSize);

$(window).resize(function() {
	rollingWidth = $('#rolling').width();
})