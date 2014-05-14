(function(window) {
if (typeof window.Common === "undefined")
{
	window.Common = new Common;

	/* Common 객체 선언 */
	function Common()
	{
		// 객체에서 필요한 변수나 자료는 여기에 선언
		this.ids = [];	// 중복 처리 검사를 위한 id 값들 저장

		return null;
	}

	/* Common의 메소드는 여기에 선언 */

	/******************************************************************/
	/*
	/*	동적 파일 로드 관련
	/*
	/******************************************************************/	

	/*
		init()
		: 초기화
	*/
	Common.prototype.init = function() {
		// 전역 라이브러리 동적 로드
		window.Common.loadJSFile('/scripts/lib/cookies.js', 'body', 'js_cookies');

		// 전역함수 초기화
		window.Common.addEventGoAinnogalleryHome();
	};


	/******************************************************************/
	/*
	/*	동적 파일 로드 관련
	/*
	/******************************************************************/

	/*
		downloadImageByUrl(image_url, success, error)
		: Url로 이미지 다운로드
		
		- image_url : 다운 받을 이미지의 url
		- success(url, size{width, height, depth}) : 이미지가 다운 됐을 때 호출할 콜백 함수 참조 (url: 경로, size{x, y}: 사이즈 정보)
		- error() : 오류가 났을 경우 호출할 콜백 함수 참조
	*/
	Common.prototype.downloadImageByUrl = function(image_url, success, error) {
		var tempImage = new Image();
	    tempImage.src = image_url;

	    tempImage.onload = function() {
			if (!success) success(url, size);
		};
		tempImage.onerror = function() {
			if (!error) error();
		};
	};

	/*
		downloadImageByWorkThumbprint(work_thumbprint, quality, success, error)
		: Thumbprint로 이미지 다운로드

		- work_thumbprint : 다운 받을 작품의 Thumbprint
		- quality : 이미지의 퀄리티 ("thumbnail", "high", "raw")
		- success(url, size{width, height, depth}) : 이미지가 다운 됐을 때 호출할 콜백 함수 참조 (url: 경로, size{width, height, depth}: 사이즈 정보)
		- error() : 오류가 났을 경우 호출할 콜백 함수 참조
	*/
	Common.prototype.downloadImageByWorkThumbprint = function(work_thumbprint, quality, success, error) {
		$.ajax({
			url: '/common/downloadImageByWorkThumb',
			data: {
				work_thumbprint: work_thumbprint,
				quality: quality
			},
			dataType: 'json',
			success: function(result) {
				downloadImageByUrl(result.image_url, success, error);
			}
		});
	};

	/*
		loadJSFile(file_path, target_parent, id)
		: Javascript 파일을 동적으로 페이지에 로드

		- file_path : Javascript 파일의 위치
		- target_parent : 파일이 추가될 부모 태그("body", "head")
		- id : 중복처리 검사를 위한 id 값
	*/
	Common.prototype.loadJSFile = function(file_path, target_parent, id) {
		if (this.ids.indexOf(id) != -1) return;
		else this.ids.push(id);

		var attached_source = '<script src="'+ file_path +'"></script>';
		if (target_parent == "head")
			$("head").append(attached_source);
		else if (target_parent == "body")
			$("body").append(attached_source);
	};


	/*
		loadCSSFile(file_path, id)
		: StyleSheet 파일을 동적으로 페이지에 로드

		- file_path : StyleSheet 파일의 위치
		- id : 중복처리 검사를 위한 id 값
	*/
	Common.prototype.loadCSSFile = function(file_path, id) {
		if (this.ids.indexOf(id) != -1) return;
		else this.ids.push(id);

		var attached_source = $('<link rel="stylesheet" href="'+ file_path +'" />');
     	$("head").append(attached_source);
	};


	/******************************************************************/
	/*
	/*	공유 관련 기능
	/*
	/******************************************************************/

	/*
		shareLinkToFacebook(url)
		: 페이스북으로 링크 공유하기
	*/
	Common.prototype.shareLinkToFacebook = function(url) {
		//https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fparse.com
		//javascript:var%20d=document,f='https://www.facebook.com/share',l=d.location,e=encodeURIComponent,p='.php?src=bm&v=4&i=1339881106&u='+e(l.href)+'&t='+e(d.title);1;try{if%20(!/^(.*.)?facebook.[^.]*$/.test(l.host))throw(0);share_internal_bookmarklet(p)}catch(z)%20{a=function()%20{if%20(!window.open(f+'r'+p,'sharer','toolbar=0,status=0,resizable=1,width=626,height=436'))l.href=f+p};if%20(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else{a()}}void(0)
	};

	/*
		shareLinkToTwitter(url)
		: 트위터로 링크 공유하기
	*/
	Common.prototype.shareLinkToTwitter = function(url, text) {
		/*<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://aurumplanet.com" data-text="테스트테스트" data-via="ainnogallery" data-lang="ko" data-size="large" data-related="ainnogallery" data-count="none" data-hashtags="ainnogallery">트윗하기</a>*/

		//javascript:(function(){window.twttr=window.twttr||{};var%20D=550,A=450,C=screen.height,B=screen.width,H=Math.round((B/2)-(D/2)),G=0,F=document,E;if(C>A){G=Math.round((C/2)-(A/2))}window.twttr.shareWin=window.open('http://twitter.com/share','','left='+H+',top='+G+',width='+D+',height='+A+',personalbar=0,toolbar=0,scrollbars=1,resizable=1');E=F.createElement('script');E.src='http://platform.twitter.com/bookmarklets/share.js?v=1';F.getElementsByTagName('head')[0].appendChild(E)}());
	};

	/******************************************************************/
	/*
	/*	공통 이동 기능
	/*
	/******************************************************************/

	/*
		addEventGoAinnogalleryHome
		: 아이노갤러리로 이동
	*/
	Common.prototype.addEventGoAinnogalleryHome = function() {
		$('.btn_go_ainnogallery').on('click', function() {
			if (confirm("감상을 멈추고 아이노갤러리로 이동하시겠습니까?"))
				location.href = "/";
		});
	};

	/*
		addEventGoUserHome(user_url)
		: 작가홈으로 이동

		- user_url : 작가의 url
	*/
	Common.prototype.addEventGoUserHome = function(user_url) {
		$('.btn_go_artist').on('click', function() {
			if (confirm("감상을 멈추고 작가홈으로 이동하시겠습니까?"))
				location.href = "/" + user_url;
		});
	};

	/******************************************************************/
	/*
	/*	기타 함수
	/*
	/******************************************************************/

	/*
		getPad2
		: 한 자리 숫자면 0을 붙여 두 자리 수로 만들어내는 함수
	*/
	Common.prototype.getPad2 = function(number) {  
	    var str = '' + number;
	    while (str.length < 2)
	        str = '0' + str;
	    return str;
	};
}
})(window);