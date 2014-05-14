// 작품 목록 페이지
(function() {
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

	/* WorkList: 작품 목록 페이지 관련 객체 */
	/**
	 * 생성자
	 *
	 * @param {Array} 작품들 넓이 배열
	 * @param {Array} 작품들 높이 배열
	 */

	// 파일 업로드 & 애니메이션
	// $('#addContentBtn').click(function() {
	// 	// $('#addContentDiv').slideToggle("slow", function() {

	// 	// });
	// 	console.log("content.value: " + addContentDiv.attr('value'));		

	// 	if (addContentDiv.attr('value') === 'up') {
	// 		addContentDiv.attr('value', 'down');
	// 		addContentDiv.animate({
	// 			top: 0
	// 		}, 300)
	// 		content.animate({
	// 			top: 0
	// 		}, 300)
	// 	} else if (addContentDiv.attr('value') === 'down') {
	// 		addContentDiv.attr('value', 'up');
	// 		addContentDiv.animate({
	// 			top: addContentDiv[0].clientHeight * 0.9 * (-1)
	// 		}, 300)
	// 		content.animate({
	// 			top: addContentDiv[0].clientHeight * 0.9 * (-1)
	// 		}, 300)
	// 	}
	// })
	

	/* 레이아웃 시작 */
	// 전역 변수
	var PROFILE_DATA_WRAPPER_TOP_POS_RATIO = 0.45;
	var PROFILE_CONTAINER_WIDTH_RATIO = 0.4;
	var CONTENT_WIDTH_RATIO = 1 - PROFILE_CONTAINER_WIDTH_RATIO;
	var ARTIST_SOCIAL_DATA_WIDTH_RATIO = 0.5;
	var MAP_WRAPPER_WIDTH_RATIO = 0.3;
	var CAREERS_WRAPPER_WIDTH_RATIO = 1 - MAP_WRAPPER_WIDTH_RATIO;
	var CAMERA_BTN_WIDTH_RATIO = 0.2;

	var WINDOW_WIDTH = document.body.clientWidth;
	var WINDOW_HEIGHT = document.body.clientHeight;

	// 작품 페이지 레이아웃
	var exInfoContainer = $('#exInfoContainer');
	var exInfoDataWrapper = $('#exInfoDataWrapper');
	var exTitleInfo = $('#exTitleInfo');
	var exScheduleInfo = $('#exScheduleInfo');
	var mapWrapper = $('#mapWrapper');
	var exArtWorksWrapper = $('#exArtWorksWrapper');
	var section = $('#section');
	var content = $('#content');

	var exInfoContainerHeight = WINDOW_HEIGHT * PROFILE_DATA_WRAPPER_TOP_POS_RATIO;

	// content(작품목록) 레이아웃 설정
	setCSS(content, 'width', WINDOW_WIDTH * CONTENT_WIDTH_RATIO, 'px');

	// exTitleInfo 레이아웃 설정
	setCSS(exTitleInfo, 'width', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100, '%');

	// exScheduleInfo 레이아웃 설정
	setCSS(exScheduleInfo, 'width', (1 - ARTIST_SOCIAL_DATA_WIDTH_RATIO) * 100, '%');
	setCSS(exScheduleInfo, 'left', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100 , '%');


////////////////////////////////여기부터
	// mapWrapper 레이아웃 설정
//	setCSS(mapWrapper, 'top', exTitleInfo[0].clientHeight, 'px');
//	setCSS(mapWrapper, 'width', MAP_WRAPPER_WIDTH_RATIO * 100, '%');
////////////////////////////////여기까지


	// exArtWorksWrapper 레이아웃 설정
	setCSS(exArtWorksWrapper, 'top', exTitleInfo[0].clientHeight ,'px');


////////////////////////////////여기부터
//	setCSS(exArtWorksWrapper, 'left', MAP_WRAPPER_WIDTH_RATIO * 100, '%');
////////////////////////////////여기까지


    // section 위치
    setCSS(section, 'left', exInfoContainer[0].clientWidth, 'px');
    setCSS(section, 'width', WINDOW_WIDTH * (1 - PROFILE_CONTAINER_WIDTH_RATIO), 'px');
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
	
	// var length = <%= @length%>;
	// var fileName = <%- @fileName%>;
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
	var WORK_WIDTH = 230

	var work_hash = [];
	for (var i = 5; i < 30; i++) {
		work_hash.push('8_' + i);
	}
	console.log(work_hash);

	var height_arr = [100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 150, 280, 230, 240, 400];

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

	// for (var i = 0; i < 10; i++) {
	// 	// $('<div class="work" style="height:' + file[i].height + 'px">' +
	// 	// 		'<img src=' + '"/images/work/' + fileName[i] + '.png" />' +
	// 	//   '</div>').appendTo('#content');
	// 	// $('<div class="work">' +
	// 	// 		'<img src=' + '"/temp/8_' + work_idx[i] + '.png" />' +
	// 	//   '</div>').appendTo('#content');
	// }

	// var works_div = document.querySelectorAll('.work img');
	// // var worksToCompare = [file[0].height, file[1].height, file[2].height];
	// // var works_div = document.querySelectorAll('.work');
	// var worksToCompare = [];

	// // for (var i = 0; i < 3; i++) {
	// // 	works_div[i].addEventListener('load', function() {
	// // 		worksToCompare.push(this.height);
	// // 		// console.log('this: ' + this);
	// // 		// console.log('this.height: ' + this.height);
	// // 		// console.log('this.style.height: ' + this.style.height);
	// // 	})
	// // }

	// // 작품 위치 초기화
	// function initPos() {
	// 	$(works_div[1]).css('left', 280);
	// 	$(works_div[2]).css('left', 280 * 2);
	// }
	// // initPos();
	
	// function getMinHeightIndex(heightArr) {
	// 	var temp = heightArr[0];
	// 	var idx = 0;
	// 	for (var i = 1; i < heightArr.length; i++) {
	// 		if (temp > heightArr[i]) {
	// 			temp = heightArr;
	// 			idx = i
	// 		}
	// 	}
	// 	return idx;
	// }

	// function setPos() {
	// 	for (var i = 3; i < works_div.length; i++) {
	// 		var idx = getMinHeightIndex(worksToCompare);
	// 		$(works_div[i]).css({
	// 			left: 280 * idx,
	// 			top: worksToCompare[idx]
	// 		})
	// 		worksToCompare[idx] += file[i].height;
	// 	};
	// }
	// setPos();

	// $(document).scroll(function() {
	// 	console.log('while scrolling...');
	// 	if ($(window).scrollTop() + $(window).height() == $(document).height()) {
	// 		$.ajax({
	// 			type: 'POST',
	// 			url: 'load_additional_works',
	// 			data: {
	// 				currentLoadedWorkIdx : currentLoadedWorkIdx,
	// 				testId : 2
	// 			},
	// 			success: function(data) {
	// 				console.log("hi");
	// 				console.log(data);
	// 			}
	// 		})
	// 	}
	// })

	// // 파일 업로드 & 애니메이션
	// $('#addContentBtn').click(function() {
	// 	// $('#addContentDiv').slideToggle("slow", function() {

	// 	// });
	// 	console.log("content.value: " + addContentDiv.attr('value'));		

	// 	if (addContentDiv.attr('value') === 'up') {
	// 		addContentDiv.attr('value', 'down');
	// 		addContentDiv.animate({
	// 			top: 0
	// 		}, 300)
	// 		content.animate({
	// 			top: 0
	// 		}, 300)
	// 	} else if (addContentDiv.attr('value') === 'down') {
	// 		addContentDiv.attr('value', 'up');
	// 		addContentDiv.animate({
	// 			top: addContentDiv[0].clientHeight * 0.9 * (-1)
	// 		}, 300)
	// 		content.animate({
	// 			top: addContentDiv[0].clientHeight * 0.9 * (-1)
	// 		}, 300)
	// 	}
	// })
	// // file thumnail
	// $('#input_file_hidden').change(function() {
	// 	console.log('works.ect > input_file_hidden.change() call');
		
	// 	// $('#fileUploadContainer').append(
	// 	// 	'<img src="' + URL.createObjectURL(this.files[0]) + '"' + 'style="width:100%; height:100%";' + '/>'
	// 	// );
	// 	$('#fileUploadContainer img').attr('src', URL.createObjectURL(this.files[0]));
	// 	$('#fileUpload').css('visibility', 'hidden');
	// });

	var WorkList = function(work_height_arr) {
		// 로드한 작품 갯수
		this.loaded_works_num = 0;
		this.work_height_arr = work_height_arr;
		this.add_content_btn = $('#addContentBtn');
		this.input_file_hidden = $('#input_file_hidden');
		this.worksToCompare;
		this.works;
	}

	WorkList.prototype.initWorks = function() {
		var height_arr = [100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 100, 200, 300, 200, 300, 200, 250, 230, 340, 120, 150, 280, 230, 240, 400];

		for (var i = 0; i < 10; i++) {
			$('<div class="work" style="height:' + height_arr[i] + 'px">' +
					'<img src=' + '"/temp/' + work_hash[i] + '.png" style="width:100%; height:100%;"/>' +
			  '</div>').appendTo('#content');
		}
		this.loaded_works_num = i;
		this.works = document.querySelectorAll('.work');
	}

	WorkList.prototype.initPos = function() {
		$(this.works[1]).css('left', WORK_WIDTH);
		$(this.works[2]).css('left', WORK_WIDTH * 2);
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
			// console.log(this.worksToCompare);
			$(works_div[i]).css({
				left: WORK_WIDTH * idx,
				top: this.worksToCompare[idx] + MARGIN_BOTTOM
			})
			this.worksToCompare[idx] += this.work_height_arr[i] + MARGIN_BOTTOM;
		};
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
		if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
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
				for (var i = this.loaded_works_num; i < this.loaded_works_num + 10; i++) {
					$('<div class="work" style="height:' + this.work_height_arr[i] + 'px">' +
							'<img src=' + '"/temp/' + work_hash[i] + '.png" style="width:100%; height:100%;"/>' +
					  '</div>').hide().appendTo('#content').fadeIn(1000);
				}	
				this.works = document.querySelectorAll('.work');
				console.log("WorkList.loaded_works_num: " + this.loaded_works_num);
				this.setPos(this.loaded_works_num, this.works);
				this.loaded_works_num = i;
			}
		}.bind(this));
	}

	WorkList.prototype.init = function() {
		// 비교할 세 작품의 높이 저장
		this.worksToCompare = [this.work_height_arr[0], 
								this.work_height_arr[1], 
								this.work_height_arr[2]];

		this.initWorks();
		this.initPos();
		this.setPos(3, this.works);
		
		// 작품 더하기 이밴트
		this.addWorkEvent();
		// 파일 업로드 시 썸네일 보이는 이벤트
		this.addThumnailEvent();
		// 스크롤이 끝에 갔을 때 작품 로드하는 이벤트
		this.addAdditionalWorksEvent();
	}

	var workList = new WorkList(height_arr);
	workList.init();
})();