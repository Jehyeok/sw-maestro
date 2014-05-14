(function(window) {
if (typeof window.WorkDetail === "undefined")
{
	window.WorkDetail = new WorkDetail;

	/* WorkDetail 객체 선언 */
	function WorkDetail()
	{
		// 객체에서 필요한 변수나 자료는 여기에 선언
		this.work_hash = '';	// 작품의 hash값
		this.call_where = '';	// 작품 상세보기 창이 불려진 위치를 저장
		this.exhibition_hash = '';	// 전시관의 hash값
		this.callback_for_end = '';	// 작품 상세보기 창이 닫히면 실행할 함수의 레퍼런스를 저장
		this.work_order = '';	// 전시 페이지에서 열릴 경우 작품의 전시 순서를 저장
		this.reply_list = {};	// 댓글 목록
		this.is_reply_post_ready = false;	// 댓글을 등록할 준비가 되었는지 저장할 변수

		// // <테스트 구간>
		// this.user_url = 'test1url';
		// this.exhibition = 1;
		// this.work = 1;
		// this.work_hash = '7259b7d4ce13d5029ce7b2720e3f59165cf9701ba23ce2db6fc84e51a5d4eea8';
		// // </테스트 구간>

		return null;
	}

	/* WorkDetail의 메소드는 여기에 선언 */

	/******************************************************************/
	/*
	/*	초기화
	/*
	/******************************************************************/

	WorkDetail.prototype.show = function(options) {	
		// Javascript, Stylesheet 동적 로드
		Common.loadCSSFile('/stylesheets/work_detail.css', 'css_workdetail');

		var work_hash = options.work_hash || "승현이";//null;
		var call_where = options.call_where || null;
		var exhibition_hash = options.exhibition_hash || null;
		var user_hash = options.user_hash || null;
		var callback_for_end = options.callback_for_end || null;

		// 정보 변경
		this.call_where = call_where;
		this.work_hash = work_hash;
		this.exhibition_hash = exhibition_hash;
		this.user_hash = user_hash;
		this.callback_for_end = callback_for_end;

		/* TODO
		if (this.call_where == 'exhibition')
			this.work_order = window.Exhibition.work_order;	// TODO
		else if (this.call_where = 'works')
			this.work_order = window.Exhibition.work_order;	// TODO
		*/

		var target_url = '/workDetail/getSourceWorkDetailWindow';
		$.ajax({
			url: target_url,
			type: 'GET',
			dataType: 'html',
			context: window.WorkDetail,
			success: function(res) {
				// 소스 추가
				var window_source = res;
				$('body').append(window_source);

				// 댓글 쓰기 창 아래에 시간 표시 타이머 시작:
				this.startReplyPostTimer();

				// 출력 함수 실행:
				this.printWorkDetailByHash();
				this.clearReplyList(); // 댓글 데이터, 뷰 초기화
				this.getReplyList();

				/********************************************************************
					이벤트 추가 시작
				********************************************************************/
				var area_post = $('.work_detail_window .section_detail .article_reply .area_post');
				var area_before_post = $('.work_detail_window .section_detail .article_reply .area_before_post');
				area_post.find('.btn_register_reply').on('click', { context: this }, this.registerReply); // .work_detail_window .section_detail .article_reply .area_post .area_register .btn_register_reply
				// 작품 상세보기 창 닫기:
				$('.work_detail_window .btn_close').on('click', this.closeWindow);
				// 댓글 부분 클릭하면 댓글창 보임:
				area_before_post.on('click', this.expandReplyPost);
				// 댓글 쓰기 중에 ESC 누르면 댓글창 줄임:
				area_post.find('#comment').on('keyup', function(e) { 
				    if (e.keyCode == 27)
				        window.WorkDetail.shrinkReplyPost();

				    // 댓글 쓰기에 입력이 존재하면 확인 버튼 클릭할 수 있게 바뀜:
				    if ($(this).val() == "")
					{
						is_reply_post_ready = false;
				    	area_post.find('.btn_register_reply').css('background-position', '0 0');
				    	area_post.find('.btn_register_reply').css('cursor', 'default');
				    }
				    else
				    {
				    	is_reply_post_ready = true;
				    	area_post.find('.btn_register_reply').css('background-position', '0 31px');
				    	area_post.find('.btn_register_reply').css('cursor', 'pointer');
				    }
				});
				// 댓글 쓰기에 내용 아무 것도 입력 안 하고 포커스 잃으면 댓글창 줄임:
				area_post.find('#comment').on('focusout', function(e) {
					if ($('#comment').val() == '')
						window.WorkDetail.shrinkReplyPost();
				});
				// 댓글 삭제:
				var btn_remove_reply = '.work_detail_window .section_detail .article_reply .list_reply .item_reply .area_comment .area_topline .btn_remove_reply';
				$(document).on('click', btn_remove_reply, function(e) {
					var work_reply_hash = e.target.parentElement.parentElement.parentElement.getAttribute('data-hash');	//$(this).parent().parent().parent().data('hash');
					window.WorkDetail.removeReply(work_reply_hash);
				});	
				/********************************************************************
					이벤트 추가 끝
				********************************************************************/
			}
		});
	}


	/******************************************************************/
	/*
	/*	작품 및 정보 출력 관련
	/*
	/******************************************************************/

	// /*
	// 	setHighImageForImageview()
	// 	: 이미지뷰에 이미지를 출력
	// */
	// WorkDetail.prototype.setHighImageForImageview = function() {
	// 	Common.downloadImageByWorkHash(this.work_hash, 'high', function(url, size) {
	// 		$('.work_detail_window .section_imageview .work_image')
	// 			.css('background-image', 'url("' + url + '")')
	// 			.css('width', size.width)
	// 			.css('height', size.height);
	// 	}, null);
	// };

	/*
		printWorkDetailByHash()
		: 기존 출력 정보를 초기하고 작품의 Hash에 따라 작품 정보 출력
	*/
	WorkDetail.prototype.printWorkDetailByHash = function() {
		var target_url = '/workDetail/getWorkDetail';
		var request_data = {
							work_hash: this.work_hash
							};
		$.ajax({
			url: target_url,
			data: request_data,
			type: 'GET',
			dataType: 'json',
			context: window.WorkDetail,
			success: function(result) {
				console.log(result);
				var title = result.title;
				var artist = result.artist;
				var description = result.description;
				var production_date = result.production_date;
					var production_year = (production_date != null) ? (new Date(production_date)).getFullYear() : null;

				var width = result.width;
				var height = result.height;
				var depth = result.depth;
				var size_unit = result.size_unit;
					var size = width + "×" + height;
					 	if (depth > 0) size += ("×" + depth)
					 	size += size_unit;

				var extra_info = "";
					if (production_year != null) extra_info += production_year;
						if (extra_info.length > 0) extra_info += ", ";
					extra_info += size;
					if (artist != "NULL") extra_info += ", " + artist;

				var keywords = []; //JSON.parse(result.keywords);
				var material = result.material;

				var article_header = $('.work_detail_window .section_detail .article_header');
				article_header.find('.title').html(title);
				article_header.find('.extra_info').html(extra_info);
				
				var article_more_info = $('.work_detail_window .section_detail .article_more_info');
				article_more_info.find('.item_description').html(description);
				for (var i = 0; i < keywords.length; i++)
				{
					var keyword_source = "<li>" + keywords[i] + "</li>";
					article_more_info.find('.item_keywords .list_keywords').append(keyword_source); // TODO: 키워드에 링크 추가
				}

				//this.setHighImageForImageview();
				//this.printReplyList(0, 10, 'popular');
			},
			error: function(error) {
				// TODO: 오류 처리 추가
				console.log(error);
			}
		});
	};


	/*
		printWorkDetailByOrder()
		: 다음 작품의 작품 상세 정보 출력

		- work_order : 작품 순서의 정수값(제일 처음이 0), "next"는 다음 작품 순서, "prev"는 이전 작품 순서
	*/
	WorkDetail.prototype.printWorkDetailByOrder = function(work_order) {
		this.changeWorkHashByOrder(work_order);
		this.printWorkDetailByHash();
	};

	/*
		clearWorkDetail()
		: 현재 작품 상세보기 화면을 전부 초기화
	*/
	WorkDetail.prototype.clearWorkDetail = function() {
		this.clearReplyList();

		// work_detail 화면 초기화
		var article_header = $('.work_detail_window .section_detail .article_header');
			article_header.find('.title').html('');
			article_header.find('.extra_info').html('');
		var article_more_info = $('.work_detail_window .section_detail .article_more_info');
			article_more_info.find('.item_keywords .list_keywords li').remove();

		// work_detail 변수 초기화
		this.work_hash = '';
		this.call_where = '';
		this.exhibition_hash = '';
		this.callback_for_end = '';
		this.work_order = '';
		this.reply_list = {};	
	};

	/*
		changeWorkHashByOrder(work_order)
		: 전시의 작품 순서를 인자로 하여 Hash를 먹임

		- work_order : 작품 순서의 정수값(제일 처음이 0), "next"는 다음 작품 순서, "prev"는 이전 작품 순서
	*/
	WorkDetail.prototype.changeWorkHashByOrder = function(work_order) {
		if (work_order == 'next') {
			this.work_order++;
			if (this.work_order == this.exhibition.works_count)
				this.work_order == 0;
		} else if (work_order == 'prev') {
			this.work_order--;
			if (this.work_order < 0)
				this.work_order = this.exhibition.works_count - 1;
		}
		this.work_hash = this.exhibition.works_list[this.work_order].hash;
	};


	/******************************************************************/
	/*
	/*	창(work_detail_window) 관련
	/*
	/******************************************************************/

	/*
		showWindow()
		: 작품 상세보기 창 보이기
	*/
	WorkDetail.prototype.showWindow = function() {
		//this.clearWorkDetail();
		$('.work_detail_window').show();
	};

	/*
		closeWindow()
		: 작품 상세보기 창 숨기기
	*/
	WorkDetail.prototype.closeWindow = function() {
		window.WorkDetail.clearWorkDetail();
		window.WorkDetail.callback_for_end();
		console.log("cloaseWindow 실행됨");
		$('.work_detail_window').hide();
	};


	/******************************************************************/
	/*
	/*	댓글 관련 기능
	/*
	/******************************************************************/

	/*
		addReplyItem(item)
		: 댓글 항목 하나를 페이지에 있는 댓글 목록 안에 삽입함

		- item : 댓글에 대한 정보가 들어있는 JSON
				item = { hash, post_time, comment, vote_count, user_hash, user_name, user_url, user_profile_photo }
		- insert_at : 'prepend'이면 리스트 앞에 추가. 'append'이면 리스트 뒤에 추가 아무것도 안 쓰면 'prepend'가 기본값.
	*/	
	WorkDetail.prototype.addReplyItem = function(item, insert_at) {
		var insert_at = insert_at || 'prepend';
		var cookie_user_hash = 'a87d3107bb0167e960465a0dcf691879c6ec1992' // TODO: docCookies.getItem('user_hash');
		var is_post_of_now_user = (cookie_user_hash == item['user_hash']);

		var list_reply = $('.work_detail_window .section_detail .article_reply .list_reply');

		var item_source = '<li class="item_reply" data-hash="'+ item['hash'] +'">';
				item_source += '<a href="/'+ item['user_url'] +'" target="_blank">';
				item_source += '<div class="img_user_profile_photo lfloat" data-hash="'+ item['user_hash'] +'" style="background-image: url(\''+ item['user_profile_photo'] +'\')"></div>';
				item_source += '</a>';
				item_source += '<div class="area_comment lfloat">';
					item_source += '<div class="area_topline">';
						item_source += '<span class="txt_name" data-hash="'+ item['user_hash'] +'">';
							item_source += '<a href="/'+ item['user_url'] +'" target="_blank">'+ item['user_name'] +'</a>';
						item_source += '</span>';
						item_source += '<span class="txt_datetime">'+ item['post_time'] +'</span>';
						item_source += '<span class="txt_bar">|</span>';
						item_source += '<div class="button inlineblock">';
							item_source += '<span class="txt_vote">like</span>';
							item_source += '<span class="txt_vote_count">'+ item['vote_count'] +'</span>';	
						item_source += '</div>';
					if (is_post_of_now_user)
					{
						item_source += '<span class="btn_remove_reply button rfloat">삭제</span>';
						item_source += '<span class="btn_modify_reply button rfloat">수정</span>';
					}
				item_source += '</div>';
				item_source += '<div class="comment">'+ item['comment'] +'</div>';
				item_source += '</div>';
			item_source += '</li>';
		if (insert_at == 'prepend') list_reply.prepend(item_source);
		else if (insert_at == 'append') list_reply.append(item_source);
	};

	/*
		getReplyList(need_count, sort_type, success_callback)
		: 댓글 목록 및 이전 댓글 보기 여부 가져와서 변수에 저장하기

		- need_count : 가져올 리스트의 개수
		- sort_type : 정렬 기준("popular", "latest")
		- options : 추가 옵션을 수동으로 집어넣을 떄 쓰는 객체
			- loaded_count : 지금까지 불러온 댓글의 수 혹은 댓글을 불러올 시작점 (기본값은 WorkDetail 인스턴스의 reply_list 객체에 있는 loaded_count)
			- success_callback : 댓글 정보를 성공적으로 가져오고 실행할 콜백 함수 (기본값은 printReplyList)
	*/
	WorkDetail.prototype.getReplyList = function(need_count, sort_type, options) {
		var need_count = need_count || 10;	// TODO: 기본으로 불러올 개수를 전역이나 따로 변수 라이브러리에 저장할 지 설정
		var options = options || {loaded_count: undefined, success_callback: undefined};
		// console.group("options in getReplyList");
		// console.log(options);
		// console.groupEnd("options in getReplyList");
		var loaded_count = (options.loaded_count != undefined) ? options.loaded_count : this.reply_list.loaded_count;
		// console.group("loaded_count in getReplyList");
		// console.log(loaded_count);
		// console.groupEnd("loaded_count in getReplyList");
		var success_callback = options.success_callback || this.printReplyList;
		var target_url = '/workDetail/getReplyList';
		var request_data = {
							work_hash: this.work_hash,
							loaded_count: loaded_count,
							need_count: need_count,
							sort_type: sort_type
							};
		// console.group("getReplyList에서 request_data");
		// console.log(request_data);
		// console.groupEnd("getReplyList에서 request_data");

		$.ajax({
			url: target_url,
			data: request_data,
			type: 'POST',
			dataType: 'json',
			context: window.WorkDetail,
			success: function(result) {
				/*
				reply_list = {
								all_count: N,	// 해당 작품에 달린 총 댓글 수
								loaded_count: N,	// 현재까지 로드 완료된 전체 댓글 수
								is_more: true,	// 더 불러올 댓글이 있는지 여부
								all_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_profile_photo}, ...]	// 현재까지 로드 완료된 전체 댓글들
								last_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_url, user_profile_photo}, ...]	// 마지막에 로드된 댓글들
							}
				*/

				/*
				서버에서 날아옴
							{
								status: 'success',
								all_count: N,	// 해당 작품에 달린 총 댓글 수
								count: N,	// 서버에서 막 가져온 댓글 수
								is_more: true,	// 더 불러올 댓글이 있는지 여부
								items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_url, user_profile_photo}, ...]	// 서버에서 막 가져온 댓글들
							}
				*/
				if (result.status == 'success')
				{
					console.group("getReplyList에서 값을 받아옴");
					console.log(result);
					console.groupEnd("getReplyList에서 값을 받아옴");

					this.reply_list.all_count = result.all_count;
					this.reply_list.loaded_count += result.count;
					this.reply_list.is_more = result.is_more;
					
					this.reply_list.last_items = [];
					for (var index in result.items)
					{
						this.reply_list.all_items.push(result.items[index]);
						this.reply_list.last_items.push(result.items[index]);
					}

					console.group("getReplyList에서 success 수신 완료");
					console.log(this.reply_list);
					console.groupEnd("getReplyList에서 success 수신 완료");

					success_callback();
				}
				else if (result.status == 'no_more')
				{
					// TODO: 오류 처리 추가
					alert("이미 모든 댓글을 불러왔습니다.");
				}
				else
				{
					// TODO: 오류 처리 추가
					alert("댓글 목록을 불러오지 못 했습니다. 다시 시도해주세요.");
				}
			},
			error: function(error) {
				// TODO: 오류 처리 추가
				alert("댓글 목록을 불러오지 못 했습니다. 다시 시도해주세요.");
				console.log(error);
			}
		});
	};

	/*
		printReplyList(list_index, item_count, sort_type)
		: 댓글 목록 출력 및 이전 댓글 보기 출력
	*/
	WorkDetail.prototype.printReplyList = function() {
		var context = window.WorkDetail;
		/*
			reply_list = {
							all_count: N,	// 해당 작품에 달린 총 댓글 수
							loaded_count: N,	// 현재까지 로드 완료된 전체 댓글 수
							is_more: true,	// 더 불러올 댓글이 있는지 여부
							all_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_url, user_profile_photo}, ...]	// 현재까지 로드 완료된 전체 댓글들
							last_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_profile_photo}, ...]	// 마지막에 로드된 댓글들
						}
		*/

		$.each(context.reply_list.last_items, function(index, item) {
			context.addReplyItem(item);
		});

		// TODO: 남은 항목이 있나 여부로 <댓글 더보기> 버튼 숨기기에 대해 결정
		// var btn_more_replies = ;
		// if (context.reply_list.is_more == 'true')
		// 	list.parent().find('.btn_more_replies').show();
		// else
		// 	list.parent().find('.btn_more_replies').hide();
	};

	/*
		clearReplyList()
		: 댓글 목록 변수와 출력 결과 지우기
	*/
	WorkDetail.prototype.clearReplyList = function() {
		/*
			reply_list = {
							all_count: N,	// 해당 작품에 달린 총 댓글 수
							loaded_count: N,	// 현재까지 로드 완료된 전체 댓글 수
							is_more: true,	// 더 불러올 댓글이 있는지 여부
							all_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_url, user_profile_photo}, ...]	// 현재까지 로드 완료된 전체 댓글들
							last_items: [{hash, comment, post_time, vote_count, user_hash, user_name, user_profile_photo}, ...]	// 마지막에 로드된 댓글들
						}
		*/
		this.reply_list = {
							all_count: 0,
							loaded_count: 0,
							is_more: null,
							all_items: [],
							last_items: []
							};
return; // TODO
		$('.work_detail_window .section_detail .article_reply .list_reply .item_reply').remove();

		console.group("clearReplyList 실행 완료");
		console.log(this.reply_list);
		console.groupEnd("clearReplyList 실행 완료");
	};


	/*
		registerReply()
		: 댓글 등록
	*/
	WorkDetail.prototype.registerReply = function() {
		if (!is_reply_post_ready) {
			alert('댓글을 올리려면 내용을 써주세요.');
			return;
		}

		var self = window.WorkDetail;
		var target_url = '/workDetail/registerReply';
		var work_hash = self.work_hash;
		var exhibition_hash = self.exhibition_hash || null;
		var comment = $('.work_detail_window .section_detail .article_reply .area_post #comment').val();
		var request_data = {
							exhibition_hash: exhibition_hash,
							work_hash: work_hash,
							comment: comment
							};

		$.ajax({
			url: target_url,
			data: request_data,
			type: 'POST',
			dataType: 'json',
			context: window.WorkDetail,
			success: function(result) {
				console.log(result);
				if (result.status == 'registered')
				{
					// TODO: 등록 완료 -> 모든 댓글 목록을 초기화하고 최신순으로 새로 불러오기
					// this.clearReplyList();
					// this.printReplyList(0, 10, 'latest');
					$('.work_detail_window .section_detail .article_reply .area_post #comment').val('');	// 입력 했으니 내용 비우가

					// TODO: 일단은 입력한 대로 추가
					/*item = { hash, post_time, comment, vote_count, user_hash, user_name, user_url, user_profile_photo }*/
					this.getReplyList(1, 'latest', {
						success_callback: function() {
							var item = window.WorkDetail.reply_list.last_items[0];
							window.WorkDetail.addReplyItem(item, 'append');
							window.WorkDetail.scrollSectionDetailToBottom();	// 스크롤을 제일 아래로 옮김
						},
						loaded_count: 0
					});

					this.shrinkReplyPost();	// 댓글 창을 줄임
				}
				else if (result.status == 'not_authurized')
				{
					// TODO: 미 인증 상태 -> 로그인 시도
				}
				else
				{
					// TODO: 오류 처리 추가
					alert("잘못된 접근입니다. 의견을 남기지 못 했습니다.");
				}
			},
			error: function(error) {
				// TODO: 오류 처리 추가
				console.log(error);
				alert("의견을 남기지 못 했습니다. 다시 시도해주세요.");
			}
		});
	};

	/*
		modifyReply()
		: 댓글 수정
	*/
	WorkDetail.prototype.modifyReply = function(reply_hash) {
		// 기존 온에디팅을 모두 닫고 해당 위치에 새 에디팅 삽입
	};

	/*
		removeReply()
		: 댓글 삭제
	*/
	WorkDetail.prototype.removeReply = function(work_reply_hash) {
		var target_url = '/workDetail/removeReply';
		var request_data = {
							hash: work_reply_hash
							};

		if (confirm("정말 댓글을 지우시겠습니까?") == true)
		{
			$.ajax({
				url: target_url,
				data: request_data,
				type: 'POST',
				dataType: 'json',
				context: window.WorkDetail,
				success: function(result) {
					if (result.status == 'removed')
					{
						this.reply_list.all_count--;
						this.reply_list.loaded_count--;
						this.reply_list.all_items = $.grep(this.reply_list.all_items, function(n, i) {
							return n.hash != work_reply_hash;
						});
						this.reply_list.last_items = $.grep(this.reply_list.last_items, function(n, i) {
							return n.hash != work_reply_hash;
						});
						// console.group('Find removing object');
						// 	console.log($('.work_detail_window .section_detail .article_reply .list_reply').find('[data-hash="' + work_reply_hash + '"]'));
						// console.groupEnd('Find removing object');

						var target_item_reply = $('.work_detail_window .section_detail .article_reply .list_reply').find('[data-hash="' + work_reply_hash + '"]');
						target_item_reply.animate({
							'margin-left': '-500px',
							'opacity': '0.0' }, {
								duration: 500,
								ease: 'swing',
								done: function() {
									target_item_reply.remove();
								}
							});
					}
					else if (result.status == 'not_authurized')
					{
						// TODO: 미 인증 상태 -> 로그인 시도
					}
					else if (result.status == 'not_exist')
					{
						// TODO: 없는 댓글 처리
						alert("존재하지 않는 댓글입니다.");
					}
					else
					{
						// TODO: 오류 처리 추가
						alert("댓글을 삭제하지 못 했습니다. 다시 시도해주세요.");
					}
				},
				error: function(error) {
					// TODO: 오류 처리 추가
					alert("의견을 남기지 못 했습니다. 다시 시도해주세요.");
				}
			});
		}
		else
		{
			return false;
		}
	};

	/*
		applyVoteReply()
		: 댓글 추천 적용
	*/
	WorkDetail.prototype.applyVoteReply = function(work_reply_hash) {
		// TODO: callback이 flag를 되돌려줄 때까지 중복 작동 못 하게 하는 기능 추가해야 함
		var target_url = '/workDetail/applyVoteReply';
		var request_data = {
							hash: hash
							};

		$.ajax({
			url: target_url,
			data: request_data,
			type: 'POST',
			dataType: 'json',
			success: function(result) {
				if (result.status == 'voted')
				{
					// TODO: 추천 처리
					var vote_count = result.vote_count;
					
				}
				else if (result.status == 'not_authurized')
				{
					// TODO: 미 인증 상태 -> 로그인 시도
				}
				else if (result.status == 'not_exist')
				{
					// TODO: 없는 댓글 처리
					alert("존재하지 않는 댓글입니다.");
				}
				else if (result.status == 'already_voted')
				{
					// TODO: 오류 처리 추가
					alert("이미 추천하신 댓글입니다.");
				}
			},
			error: function(error) {
				// TODO: 오류 처리 추가
				alert("댓글을 추천하지 못 했습니다. 다시 시도해주세요.");
			}
		});
	};

	/*
		cancelVoteReply()
		: 댓글 추천 취소
	*/
	WorkDetail.prototype.cancelVoteReply = function(reply_hash) {
		// TODO: callback이 flag를 되돌려줄 때까지 중복 작동 못 하게 하는 기능 추가해야 함
		var target_url = '/' + user_url + '/' + exhibition + '/' + work + '/reply/cancel_vote';
		var request_data = {
							reply_hash: reply_hash
							};

		$.ajax({
			url: target_url,
			data: request_data,
			type: 'POST',
			dataType: 'json',
			success: function(result) {
				if (result.status == 'voted')
				{
					// TODO: 추천 취소 처리
					var vote_count = result.vote_count;
					
				}
				else if (result.status == 'not_authurized')
				{
					// TODO: 미 인증 상태 -> 로그인 시도
				}
				else if (result.status == 'not_exist')
				{
					// TODO: 없는 댓글 처리
					alert("존재하지 않는 댓글입니다.");
				}
				else if (result.status == 'already_voted')
				{
					// TODO: 오류 처리 추가
					alert("이미 추천하신 댓글입니다.");
				}
			},
			error: function(error) {
				// TODO: 오류 처리 추가
				alert("댓글을 추천하지 못 했습니다. 다시 시도해주세요.");
			}
		});
	};

	/*
		expandReplyPost()
		: 댓글 등록 펼쳐 올리기
	*/
	WorkDetail.prototype.expandReplyPost = function() {
		$('.work_detail_window .section_detail .article_reply .area_before_post').animate({height: "120px"}, 200);
		$('.work_detail_window .section_detail .article_reply .area_before_post .wrapper').animate({padding: "30px 20px 0 30px"}, 200, function() {
			$('.work_detail_window .section_detail .article_reply .area_before_post').hide();
			$('.work_detail_window .section_detail .article_reply .area_post').show();
			$('.work_detail_window .section_detail .article_reply .area_post #comment').focus();
		});
		$('.work_detail_window .wrapper').animate({'margin-bottom': "171px"}, 200);
		$('.work_detail_window .section_detail .article_reply .area_before_post .area_fake_register .btn_fake_register_reply').animate({'margin-top': "25px"}, 200);
	};

	/*
		shrinkReplyPost()
		: 댓글 등록 펼쳐 내리기
	*/
	WorkDetail.prototype.shrinkReplyPost = function() {
		$('.work_detail_window .section_detail .article_reply .area_before_post').show();
		$('.work_detail_window .section_detail .article_reply .area_post').hide();
		$('.work_detail_window .section_detail .article_reply .area_before_post').animate({height: "67px"}, 200);
		$('.work_detail_window .section_detail .article_reply .area_before_post .wrapper').animate({padding: "8.5px 20px 0 30px"}, 200);
		$('.work_detail_window .wrapper').animate({'margin-bottom': "118px"}, 200);
		$('.work_detail_window .section_detail .article_reply .area_before_post .area_fake_register .btn_fake_register_reply').animate({'margin-top': "9px"}, 200);
	};

	/*
		startReplyPostTimer()
		: 댓글 달기 창 아래 시계 작동
	*/
	WorkDetail.prototype.startReplyPostTimer = function() {
		setInterval(function() {
			var date = new Date();
			var result = (date.getYear() - 100)
				+ '.' + Common.getPad2(date.getMonth()+1)
				+ '.' + Common.getPad2(date.getDate())
				+ ' ' + Common.getPad2(date.getHours())
				+ ':' + Common.getPad2(date.getMinutes())
				//+ ':' + Common.getPad2(date.getSeconds());
			$('.work_detail_window .section_detail .article_reply .area_post .area_register .txt_datetime').text(result);
		}, 1000);
	};

	/*
		scrollSectionDetailToBottom()
		: 상세보기 패널(오른쪽 패널)에서 스크롤을 제일 아래로 이동
	*/
	WorkDetail.prototype.scrollSectionDetailToBottom = function() {
		var scroll_height = $('.section_detail')[0].scrollHeight;
		$('.section_detail').scrollTop(scroll_height);
	};
}
})(window);