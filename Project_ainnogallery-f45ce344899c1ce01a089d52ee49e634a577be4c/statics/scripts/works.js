// 작품 목록 페이지
(function() {
	
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

	// profileContainer 레이아웃 설정
	setCSS(profileContainer, 'width', WINDOW_WIDTH * PROFILE_CONTAINER_WIDTH_RATIO, 'px');

	// content(작품목록) 레이아웃 설정
	setCSS(content, 'width', WINDOW_WIDTH * CONTENT_WIDTH_RATIO, 'px');

	// profileDataWrapper 레이아웃 설정
	setCSS(profileDataWrapper, 'width', WINDOW_WIDTH * PROFILE_CONTAINER_WIDTH_RATIO, 'px');
	setCSS(profileDataWrapper, 'top', profileContainerHeight, 'px');

	// artistSocialData 레이아웃 설정
	setCSS(artistSocialData, 'width', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100, '%');

	// resume 레이아웃 설정
	setCSS(resume, 'width', (1 - ARTIST_SOCIAL_DATA_WIDTH_RATIO) * 100, '%');
	setCSS(resume, 'left', ARTIST_SOCIAL_DATA_WIDTH_RATIO * 100 , '%');

	// mapWrapper 레이아웃 설정
	setCSS(mapWrapper, 'top', artistSocialData[0].clientHeight, 'px');
	setCSS(mapWrapper, 'width', MAP_WRAPPER_WIDTH_RATIO * 100, '%');

	// careersWrapper 레이아웃 설정
	// careersWrapper.css('top', artistSocialData[0].clientHeight);
	setCSS(careersWrapper, 'top', artistSocialData[0].clientHeight ,'px');
	setCSS(careersWrapper, 'width', CAREERS_WRAPPER_WIDTH_RATIO * 100, '%');
	setCSS(careersWrapper, 'left', MAP_WRAPPER_WIDTH_RATIO * 100, '%');

    // section 위치
    setCSS(section, 'left', profileContainer[0].clientWidth, 'px');
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

	for (var i = 0; i < 10; i++) {
		$('<div class="work" style="height:' + height_arr[i] + 'px">' +
				'<img src=' + '"/temp/' + work_hash[i] + '.png" style="width:100%; height:100%;"/>' +
		  '</div>').appendTo('#content');
	}
	var loaded_works_num = i;

	// var works_div = document.querySelectorAll('.work img');
	var worksToCompare = [height_arr[0], height_arr[1], height_arr[2]];
	var works_div = document.querySelectorAll('.work');

	// 작품 위치 초기화
	function initPos() {
		$(works_div[1]).css('left', WORK_WIDTH);
		$(works_div[2]).css('left', WORK_WIDTH * 2);
	}
	initPos();
	
	function getMinHeightIndex(heightArr) {
		var temp = heightArr[0];
		var idx = 0;
		for (var i = 1; i < heightArr.length; i++) {
			if (temp > heightArr[i]) {
				temp = heightArr;
				idx = i
			}
		}
		return idx;
	}

	function setPos(start_work_num, works_div) {
		for (var i = start_work_num; i < works_div.length; i++) {
			var idx = getMinHeightIndex(worksToCompare);
			console.log(worksToCompare);
			$(works_div[i]).css({
				left: WORK_WIDTH * idx,
				top: worksToCompare[idx] + MARGIN_BOTTOM
			})
			worksToCompare[idx] += height_arr[i] + MARGIN_BOTTOM;
		};
	}

	setPos(3, works_div);

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
				for (var i = loaded_works_num; i < loaded_works_num + 10; i++) {
					$('<div class="work" style="height:' + height_arr[i] + 'px">' +
							'<img src=' + '"/temp/' + work_hash[i] + '.png" style="width:100%; height:100%;"/>' +
					  '</div>').hide().appendTo('#content').fadeIn(1000);
				}	
				var works_div = document.querySelectorAll('.work');
				console.log("loaded_works_num: " + loaded_works_num);
				setPos(loaded_works_num, works_div);
				loaded_works_num = i;
			}
		}
	)
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

	

	// 파일 업로드 & 애니메이션
	$('#addContentBtn').click(function() {
		// $('#addContentDiv').slideToggle("slow", function() {

		// });
		console.log("content.value: " + addContentDiv.attr('value'));		

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
	// file thumnail
	$('#input_file_hidden').change(function() {
		console.log('works.ect > input_file_hidden.change() call');
		
		// $('#fileUploadContainer').append(
		// 	'<img src="' + URL.createObjectURL(this.files[0]) + '"' + 'style="width:100%; height:100%";' + '/>'
		// );
		$('#fileUploadContainer img').attr('src', URL.createObjectURL(this.files[0]));
		$('#fileUpload').css('visibility', 'hidden');
	});
})();