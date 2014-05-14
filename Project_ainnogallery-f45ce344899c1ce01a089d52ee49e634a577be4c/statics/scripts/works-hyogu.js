/**
 * 작품 목록 페이지 관련 객체
 */

if (window.workList === undefined) {
	// 작품 목록 페이지
	window.workList = (function() {
		/* util */
		/**
		 * CSS 속성 설정
		 * 
		 * @param {Object} HTML element 요소
		 * @param {String} 변경하려는 HTML element 속성
		 * @param {Nubmer} 변경하려는 속성 px값
		 * @param {String} 변경하려는 값 단위
		 */
		function setCSS(node, attr, value, unit) {
			node.css(attr, value + unit);
		}

		/* 레이아웃 시작 */
		// 전역 변수
		var PROFILE_DATA_WRAPPER_TOP_POS_RATIO = 0.45;
		var PROFILE_CONTAINER_WIDTH_RATIO = 0.4;
		var CONTENT_WIDTH_RATIO = 1 - PROFILE_CONTAINER_WIDTH_RATIO;
		var ARTIST_SOCIAL_DATA_WIDTH_RATIO = 0.6;
		var MAP_WRAPPER_WIDTH_RATIO = 0.3;
		var CAREERS_WRAPPER_WIDTH_RATIO = 1 - MAP_WRAPPER_WIDTH_RATIO;
		var CAMERA_BTN_WIDTH_RATIO = 0.2;

		var WINDOW_WIDTH = document.body.clientWidth;
		var WINDOW_HEIGHT = document.body.clientHeight;

		// 작품 페이지 레이아웃
		var profileContainer = $('#profileContainer');
		var profileDataWrapper = $('#profileDataWrapper');
		var artistSocialData = $('#artistSocialData');
		var resume = $('#resume');
		var mapWrapper = $('#mapWrapper');
		var careersWrapper = $('#careersWrapper');
		var section = $('#section');
		var content = $('#content');

		var profileContainerHeight = WINDOW_HEIGHT * PROFILE_DATA_WRAPPER_TOP_POS_RATIO;

		// content(작품목록) 레이아웃 설정
		setCSS(content, 'width', 100, '%');

		// artistSocialData 레이아웃 설정
		setCSS(artistSocialData, 'width', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100, '%');

		// resume 레이아웃 설정
		setCSS(resume, 'width', (1 - ARTIST_SOCIAL_DATA_WIDTH_RATIO) * 100, '%');
		setCSS(resume, 'left', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100 , '%');

		// mapWrapper 레이아웃 설정
		// setCSS(mapWrapper, 'top', artistSocialData[0].clientHeight, 'px');
		// setCSS(mapWrapper, 'width', MAP_WRAPPER_WIDTH_RATIO * 100, '%');

		// careersWrapper 레이아웃 설정
		setCSS(careersWrapper, 'top', artistSocialData[0].clientHeight ,'px');
		// setCSS(careersWrapper, 'left', MAP_WRAPPER_WIDTH_RATIO * 100, '%');

	    // section 위치
	    setCSS(section, 'left', profileContainer[0].clientWidth, 'px');
	    setCSS(section, 'width', (1 - PROFILE_CONTAINER_WIDTH_RATIO) * 100, '%');
	    /* 레이아웃 끝 */

	    /* 파일 업로드 시작 */
	    // addContentDiv div 설정
	    var addContentDiv = $('#addContentDiv');
	    setCSS(addContentDiv, 'height', 150, 'px');
	    setCSS(addContentDiv, 'top', addContentDiv[0].clientHeight * 0.9 * (-1), 'px');

	    // fileUpload div 설정
	    var fileUploadContainer = $('#fileUploadContainer');
	    var fileUpload = $('#fileUpload');

	    setCSS(fileUpload, 'width', CAMERA_BTN_WIDTH_RATIO * 100, '%');
	   	setCSS(fileUpload, 'height', CAMERA_BTN_WIDTH_RATIO * 100, '%');
	    setCSS(fileUpload, 'top', (fileUploadContainer[0].clientHeight - fileUpload[0].clientHeight)/2, 'px');
	    setCSS(fileUpload, 'left', (fileUploadContainer[0].clientWidth - fileUpload[0].clientWidth)/2, 'px');
		setCSS(content, 'top', addContentDiv[0].clientHeight * 0.9 * (-1), 'px');
		
		// var length = <%= @length %>;
		// var work_idx = <%- @work_idx%>;
		// var file = <%- @file %>;
		// var currentLoadedWorkIdx;

		// for (var i = 0; i < file.length; i++) {
		// 	console.log(file[i].height);
		// 	$('<div class="work" style="height:' + file[i].height + 'px">' +
		// 			'<img src=' + '"/images/work/' + fileName[i] + '.png" />' +
		// 	  '</div>').appendTo('#contents');
		// }
		// currentLoadedWorkIdx = file.length;

		// var work_idx = <%- @work_idx %>;
		// console.log("work_idx: " + work_idx);

		/* 하드코딩 시작*/

		// 작품관련 상수
		var MARGIN_BOTTOM = 15

		// var height_arr = [100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 150, 280, 230, 240, 400];
		var height_arr = [];

		// for (var i = 0; i < 10; i++) {
		// 	$('<div class="work" style="height:' + height_arr[i] + 'px">' +
		// 			'<img src=' + '"/temp/' + work_hash[i] + '.png" style="width:100%; height:100%;"/>' +
		// 	  '</div>').appendTo('#content');
		// }
		// var loaded_works_num = i;

		// var works_div = document.querySelectorAll('.work img');
		// var worksToCompare = [height_arr[0], height_arr[1], height_arr[2]];
		// var works_div = document.querySelectorAll('.work');

		// 작품 위치 초기화
		/* 하드코딩 끝 */

		var WorkList = function(total_works_num) {
			// 로드한 작품 갯수
			this.loaded_works_num = 0;
			// 전체 작품 갯수
			this.total_works_num = total_works_num;
			// 추가된 작품 갯수
			this.added_works_num = 0;
			this.add_content_btn = $('#addContentBtn');
			this.input_file_hidden = $('#input_file_hidden');
			this.worksToCompare;
			this.works;
			this.work_covers;
		}

		WorkList.prototype.initWorks = function(total_works_num) {
			var length = this.total_works_num < 10 ? this.total_works_num : 10;
			console.log('length:' + length);
			for (var i = 0; i < 5; i++) {
				// $('<div class="work" style="height:' + this.work_height_arr[i] + 'px">' +
				$('<div class="work">' +
						'<img src=' + '"/temp/' + work_hash[i] + '"' + '/>' +
						'<div class="cover"></div>' + 
				  '</div>').appendTo('#content');
			}
			this.loaded_works_num = i;
			this.works = document.querySelectorAll('.work');
			this.work_covers = document.querySelectorAll('.work .cover');
			for (var i = 0; i < this.works.length; i++) {
				// console.log($(this.works[i]).width());
				// console.log(work_width_height_ratio[i]);
				$(this.works[i]).css('height', $(this.works[i]).width() * work_width_height_ratio[i]);
			};
			this.setWorksToCompare();
		}

		WorkList.prototype.initPos = function() {
			$(this.works[1]).css('left', '33%');
			$(this.works[2]).css('left', '66%');
		}
		
		
		WorkList.prototype.getMinHeightIndex = function(height_arr) {
			var temp = height_arr[0];
			var idx = 0;
			for (var i = 1; i < height_arr.length; i++) {
				if (temp > height_arr[i]) {
					temp = height_arr;
					idx = i
				}
			}
			return idx;
		}

		WorkList.prototype.setPos = function(start_work_num, works_div) {
			for (var i = start_work_num; i < works_div.length; i++) {
				var idx = this.getMinHeightIndex(this.worksToCompare);
				// console.log('idx: ' + idx);
				console.log(this.worksToCompare);
				$(works_div[i]).css({
					left: 33 * idx + '%',
					top: this.worksToCompare[idx] + MARGIN_BOTTOM
				})
				this.worksToCompare[idx] += $(this.works[i]).height() + MARGIN_BOTTOM;
			};
			this.setProfileContainerHeight();
		}

		
		WorkList.prototype.addWorkEvent = function() {
			this.add_content_btn.click(function() {
				// console.log("content.value: " + addContentDiv.attr('value'));		
				if (addContentDiv.attr('value') === 'up') {
					addContentDiv.attr('value', 'down');
					addContentDiv.animate({
						top: 0
					}, 300)
					content.animate({
						top: 0
					}, 300)
				} else if (addContentDiv.attr('value') === 'down') {
					addContentDiv.attr('value', 'up');
					addContentDiv.animate({
						top: addContentDiv[0].clientHeight * 0.9 * (-1)
					}, 300)
					content.animate({
						top: addContentDiv[0].clientHeight * 0.9 * (-1)
					}, 300)
				}
			})
		}
		
		WorkList.prototype.addThumnailEvent = function() {
			this.input_file_hidden.change(function() {
				// console.log('works.ect > input_file_hidden.change() call');
				$('#fileUploadContainer img').attr('src', URL.createObjectURL(this.files[0]));
				$('#fileUpload').css('visibility', 'hidden');
			});
		}

		WorkList.prototype.addAdditionalWorksEvent = function() {
			$(document).scroll(function() {
			console.log('while scrolling...');

			if ($(window).scrollTop() + $(window).height() >= $(document).height() &&
				this.total_works_num > this.loaded_works_num) {
				// $.ajax({
				// 	type: 'POST',
				// 	url: 'load_additional_works',
				// 	data: {
				// 		currentLoadedWorkIdx : currentLoadedWorkIdx,
				// 		testId : 2
				// 	},
				// 	success: function(data) {
				// 		console.log("hi");
				// 		console.log(data);
				// 	}
					var length = this.loaded_works_num + 10 < this.total_works_num 
									? this.loaded_works_num
									: this.total_works_num;
					for (var i = this.loaded_works_num; i < this.loaded_works_num + 10; i++) {
						$('<div class="work" style="height:' + this.work_height_arr[i] + 'px">' +
								'<img src=' + '"/temp/' + work_hash[i] + '" style="width:100%; height:100%;"/>' +
								'<div class="cover"></div>' + 
						  '</div>').hide().appendTo('#content').fadeIn(1000);
					}	
					this.works = document.querySelectorAll('.work');
					this.work_covers = document.querySelectorAll('.work .cover');
					for (var i = this.loaded_works_num; i < this.loaded_works_num + 10; i++) {
						// console.log($(this.works[i]).width());
						// console.log(work_width_height_ratio[i]);
						$(this.works[i]).css('height', $(this.works[i]).width() * work_width_height_ratio[i]);
					};
					console.log("WorkList.loaded_works_num: " + this.loaded_works_num);
					this.setPos(this.loaded_works_num + this.added_works_num, this.works);
					this.addMouseOverEventToWorks(this.loaded_works_num, this.works);
					this.loaded_works_num = i;
				}
			}.bind(this));
		}

		WorkList.prototype.addMouseOverEventToWorks = function(start_work_num, works_div) {
			for (var i = start_work_num; i < works_div.length; i++) {
				$(this.work_covers[i]).mouseover(function() {
					$(this).fadeTo('fast', 0.75);
				});

				$(this.work_covers[i]).mouseout(function() {
					$(this).stop();
					$(this).css('opacity', 0);
				});				
			};
		}

		WorkList.prototype.setProfileContainerHeight = function() {
			$('#profileContainer').stop().animate({height: document.body.scrollHeight}, 1000);
		}

		WorkList.prototype.onAddWork = function(work_height) {
			this.added_works_num += 1;
			this.works = $('.work');
			this.work_covers = $('.work .cover');
			this.worksToCompare[2] = $(this.works[2]).height();
			this.worksToCompare[1] = $(this.works[1]).height();
			this.worksToCompare[0] = work_height;
			this.initPos();
			this.setPos(3, this.works);
			this.addMouseOverEventToWorks(0, this.works);
		}

		WorkList.prototype.setWorksToCompare = function() {
			// 비교할 세 작품의 높이 저장
			this.worksToCompare = [$(this.works[0]).height(), 
									$(this.works[1]).height(), 
									$(this.works[2]).height()];
		}

		WorkList.prototype.init = function() {
			this.initWorks();
			this.initPos();
			this.setPos(3, this.works);

			// 작품 마우스 오버 시, 커버 오버레이
			this.addMouseOverEventToWorks(0, this.works);
			// 작품 더하기 이밴트
			this.addWorkEvent();
			// 파일 업로드 시 썸네일 보이는 이벤트
			this.addThumnailEvent();
			// 스크롤이 끝에 갔을 때 작품 로드하는 이벤트
			this.addAdditionalWorksEvent();
			
		}

		var workList = new WorkList(length);
		workList.init();

		return workList;
	})();
}
