(function(window) {
	if (typeof window.ExhibitionMain === "undefined"){
		window.ExhibitionMain = new ExhibitionMain;
		/* WorkDetail 객체 선언 */
		function ExhibitionMain(){
			// 객체에서 필요한 변수나 자료는 여기에 선언
			this.user_hash = '';
			this.exhibit_inner_div = '';
			this.exhibition = [];
			this.profile = {};
			this.analytics = {};
			this.guestbook = [];
			this.comment = [];
			this.banner = [];
			this.width = document.body.clientWidth;
			this.height = document.body.clientHeight;
			this.exhibitionCardSize = 255;
			this.max_exhibit_num = Math.floor((this.width-5) / this.exhibitionCardSize);
			this.exhibit_num = Math.floor((this.width - 5) / this.exhibitionCardSize);
			this.left_exhibit = 1;
			this.right_exhibit;
			this.rollingWidth = 0;
			this.pre_exhibit_num = this.exhibit_num;
			this.widthPercent = 100;
			this.rightwidth = this.width-30;
			this.artistBannerHeight;
			this.mainBannerIdx = 2;
			this.mainBannerIndicator = 0;
			this.focusStatement = 0;
			this.exCardWidth;
			return null;
		}

		ExhibitionMain.prototype.init = function(params){
			this.user_hash = params.user_hash;

			var url = "/user/profileSourceLoad";
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'html',
				context: window.ExhibitionMain,
				success: function(result){
					Common.appendSource(result, '#artistPageUpperContentWrapper');
					this.loadProfile();
				}
			});

			url = "/user/utilitySourceLoad";
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'html',
				context: window.ExhibitionMain,
				success: function(result){
					var self = this;
					Common.appendSource(result, '#artistPageUpperContentWrapper');
					this.loadComment();
					this.loadAnalytics();
					this.loadGuestbook();
					this.loadBanner();
					this.artistBannerHeight = $('#artistPageUpperContentWrapper').height();
					//this.maxComment = Math.floor(this.artistBannerHeight * 0.63 / 120);
					$('.bannerNumHighlighted').hide();
					$('.editIndicatorHighlighted').hide();
					$('#editBannerWrapper').css('height', this.artistBannerHeight).css('overflow', 'hidden');
					$('#editBannerWrapper').hide();
					$('#interactionCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('left', $('#profileCardWrapper').width()).css('width', $('#artistPageUpperContentWrapper').width()*0.16);
					$('#analyticsCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('width', $('#artistPageUpperContentWrapper').width()*0.13).css('left', $('#profileCardWrapper').width()+$('#interactionCardWrapper').width());
					$('#artistBannerCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('width', $('#artistPageUpperContentWrapper').width()-$('#profileCardWrapper').width()-$('#interactionCardWrapper').width()-$('#analyticsCardWrapper').width()).css('left', $("#interactionCardWrapper").width() + $('#profileCardWrapper').width() + $('#analyticsCardWrapper').width() + "px");
					$('.bannerContent').css('width', $('#artistBannerCardWrapper').width());
					$('#visitors').css('top', $('#artistBannerCardWrapper').height()/2-25);
					$('.editBannerContentWrapper').css('top', $('#artistBannerCardWrapper').height()/2-30-75);
					$('#bannerMoveLeft').css('top', $('#artistBannerCardWrapper').height()/2-30-50);
					$('#bannerMoveRight').css('top', $('#artistBannerCardWrapper').height()/2-30-50);
					//$('#artistBanner').css('height', this.artistBannerHeight/2);
				}
			});

			url = "/user/exhibitionSourceLoad";
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'html',
				context: window.ExhibitionMain,
				success: function(result){
					Common.appendSource(result, '#artistPageUnderWrapper');
					this.loadExhibitions();
					$('#exhibitionMoveRight').css('left', this.rightwidth + 'px');
					$('#artistPageUnderWrapper').css('padding-left', '0px');
					$('#artistExCardWrapper').css('margin', '0 30px');
					$('#artistPageUnderWrapper').css('width', this.width +'px');
					$("#artistPageUnderWrapper").css("height", document.body.clientHeight-$('#artistPageUpperContentWrapper').height());
				}
			});
			if(this.exhibit_num > this.exhibition.len)		this.exhibit_num = this.exhibition.len;
			if(this.width < this.exhibitionCardSize)		this.rollingWidth = this.exhibitionCardSize;
			else						this.rollingWidth = Math.floor(this.width / this.exhibitionCardSize) * this.exhibitionCardSize;
			$("body").css("overflow", "hidden");
			if(this.right_exhibit > this.exhibition.len)	this.right_exhibit = this.exhibition.len;
			$(window).resize(this.onResize);
		}
		ExhibitionMain.prototype.loadProfile = function(){
			var url = '/user/profile';
			var params = {user_hash: this.user_hash};
			this.profile = {
				name: "",
				profile_photo: ""
			};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					this.profile.name = result.name;
					this.profile.profile_photo = result.profile_photo;
					var source = '<div id="profileDetailBtn" onclick="ExhibitionMain.enterProfile()"></div>' + 
								 '<div id="artistTagWrapper">' + 
								 	'<div class="artistTag">' + 
								 		'<p>#designer</p>' + 
								 	'</div>' + 
								 	'<div class="artistTag">' + 
								 		'<p>#photographer</p>' + 
								 	'</div>' + 
								 	'<div class="artistTag">' + 
								 		'<p>#artist</p>' + 
								 	'</div>' + 
								 '</div>' + 
								 '<div id = "profilePhoto" style="background-image: url(\'/images/artist/' + this.profile.profile_photo + '.png\');">' + 
								 '</div>' + 
								 '<div id="artistName">' + 
								    '<p>' + this.profile.name + '</p>' + 
								 '</div>';
					  Common.appendSource(source, '#profileInfoWrapper');
					$('#profileCardWrapper').css('height', $('#artistPageUpperContentWrapper').height());
				}
			})
		}
		ExhibitionMain.prototype.loadAnalytics = function(){
			var url = '/user/analytics';
			var params = {user_hash: this.user_hash};
			this.analytics = {
				total_artwork: 0,
				total_exhibition: 0,
				total_view: 0
			};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					this.analytics.total_artwork = result.total_artwork;
					this.analytics.total_exhibition = result.total_exhibition;
					this.analytics.total_view = result.total_view;
					var view = Common.convertNumberUnit(this.analytics.total_view);
					var source = '<div class = "analyticData">' + 
					  	  '<div class="data">' + 
					  	  	   '<p>' + this.analytics.total_artwork + '</p>' + 
					  	  '</div>' + 
					  	  '<div class="title">' + 
					  	  	   '<p>Artworks</p>' + 
					  	  '</div>' + 
					  '</div>' + 
					  '<div class = "analyticData">' + 
					  	  '<div class="data">' + 
					  	  	   '<p>' + this.analytics.total_exhibition + '</p>' + 
					  	  '</div>' + 
					  	  '<div class="title">' + 
					  	  	   '<p>Exhibitions</p>' + 
					  	  '</div>' + 
					  '</div>' + 
					  '<div class = "analyticData" style = "border: none;">' + 
					  	  '<div class="data">' + 
					  	  	   '<p>' + view + '</p>' + 
					  	  '</div>' + 
					  	  '<div class="title">' + 
					  	  	   '<p>Visits</p>' + 
					  	  '</div>' + 
					  '</div>';
					  Common.appendSource(source, '#analyticDataWrapper');
				}
			})
		}
		ExhibitionMain.prototype.loadComment = function(){
			var url = '/user/comment';
			var params = {user_hash: this.user_hash};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					this.comment = result;
					for(var i = 0; i < this.comment.length; i++){
						var from;
						var comment = Common.stringSkip(this.comment[i].comment, 60);
						if(this.comment[i].exhibition_title == '')
							from = '@ ' + this.comment[i].work_title;
						else
							from = '@ ' + this.comment[i].exhibition_title + ' @ ' + this.comment[i].work_title;
						var term = Common.getRegTime(this.comment[i].reg_date);
						$('<div class = "replyWrapper">' + 
						  	  '<div class="replyFrom">' + 
						  	  	   '<p>' + from + '</p>' + 
						  	  '</div>' + 
						  	  '<div class="replyContent">' + 
						  	  	   '<p>' + comment + '</p>' + 
						  	  '</div>' + 
						  	  '<div class="replyTime">' + 
						  	  	   '<p>' + term + '</p>' + 
						  	  '</div>' + 
						  '</div>'
						  ).appendTo('#socialReply');
					}
				}
			})
		}
		ExhibitionMain.prototype.loadBanner = function(){
			var url = '/user/banner';
			var params = {user_hash: this.user_hash};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					self = this;
					this.banner = result;
					for(var i = 0; i < this.banner.length; i++){
						var source = '<div class="bannerContentWrapper" id="bannerContentWrapper' + this.banner[i].banner_idx + '">' +
										'<div class="bannerContent">' + 
											'<div class="bannerTitle">' + 
												'<p>' + this.banner[i].title + '</p>' + 
											'</div>' + 
											'<div class="bannerSubtitle">' + 
												'<p>' + this.banner[i].subtitle + '</p>' + 
											'</div>' + 
										'</div>' + 
									  '</div>';
						Common.appendSource(source, '#bannerWrapper');
					}

					for(var i = 0; i < this.banner.length; i++){
						$("#bannerTitle" + this.banner[i].banner_idx).val(this.banner[i].title);
						$("#bannerSubtitle" + this.banner[i].banner_idx).val(this.banner[i].subtitle);
						$("#bannerLink" + this.banner[i].banner_idx).val(this.banner[i].link);
					}

					$('.bannerContentWrapper').css('width', $('#artistBannerCardWrapper').width());
					$('#bannerMoveLeft').click(this.moveClickBannerLeft.bind(this));
					$('#bannerMoveRight').click(this.moveClickBannerRight.bind(this));

					//Banner Edit Initialize
					$(".banner2").css('color', '#3ad7ff');

					//BAnner Index Indicator
					$(".bannerNum").bind('click', function(){
						var divs = $(".bannerNum");
						var i = divs.index($(this))+1;
						$(".banner" + self.mainBannerIdx).css('color', '#bcbcbc');
						$(".banner" + i).css('color', '#3ad7ff');
						self.moveClickBanner(i);
					});

					//Banner Edit Indicator
					/*$("#photoIndicator").bind('click', function(){
						$("#photoIndicator").css("background-image", "url('/images/artist/artist_photo_indicator_highlighted.png')");
						if(self.mainBannerIndicator == 1) $("#textIndicator").css("background-image", "url('/images/artist/artist_text_indicator.png')");
						if(self.mainBannerIndicator == 2) $("#linkIndicator").css("background-image", "url('/images/artist/artist_link_indicator.png')");
						if(self.mainBannerIndicator == 1) $("input[name=bannerTitle" + self.mainBannerIdx + "]").blur();
						if(self.mainBannerIndicator == 1) $("input[name=bannerSubtitle" + self.mainBannerIdx + "]").blur();
						if(self.mainBannerIndicator == 2) $("input[name=bannerLink" + self.mainBannerIdx + "]").blur();
						self.mainBannerIndicator = 0;
					});*/
					Common.bannerClickEventBind("#photoIndicator", 0);
					Common.bannerClickEventBind("#textIndicator", 1);
					Common.bannerClickEventBind("#linkIndicator", 2);
					Common.bannerFocusEventBind(".inputBannerTitle", 1);
					Common.bannerFocusEventBind(".inputBannerSubtitle", 1);
					Common.bannerFocusEventBind(".inputBannerLink", 2);
					//Common.bannerBlurEventBind(".inputBannerTitle", 1);
					//Common.bannerBlurEventBind(".inputBannerSubtitle", 1);
					//Common.bannerBlurEventBind(".inputBannerLink", 2);

					// Banner Edit <-> Banner Page
					$('#editBanner').click(function() {
						$('#guestBook').css('display', 'none');
						$('.bannerBackground').css('display', 'none');
						$('#links').css('display', 'none');
						$('#artistBanner').css('border', 'none').css('height', '100%');		
						$('#editBanner').css('display', 'none');
						$('#editBannerWrapper').show();
					});

					$('#closeEditBanner').click(function() {
						$('#editBannerWrapper').hide();		
						$('#guestBook').show();
						$('.bannerBackground').show();
						$('#links').show();
						$('#artistBanner').css('border-top', '#c6c4c4 1px solid').css('height', (window).ExhibitionMain.artistBannerHeight/2);
						$('#editBanner').show();
					});	

					$('#bannerEditComplete').click(function () {
						self.insertBanner();
						$('#editBannerWrapper').hide();		
						$('#guestBook').show();
						$('.bannerBackground').show();
						$('#links').show();
						$('#artistBanner').css('border-top', '#c6c4c4 1px solid').css('height', (window).ExhibitionMain.artistBannerHeight/2);
						$('#editBanner').show();
					});
				}
			})
		}
		ExhibitionMain.prototype.insertBanner = function(){
			var url = '/user/banner/register';
			var params = [];
			var count = 0;
			for(var i=1; i<=3; i++){
				var matched = -1;
				for(var j=0; j<this.banner.length; j++){
					if(i == this.banner[j].banner_idx) matched = j;
				}
				if(matched == -1){
					if($("#bannerTitle" + i).val() != '' || 
					   $("#bannerSubtitle" + i).val() != '' || 
					   $("#bannerLink" + i).val() != ''){
						var input = {};
						input.title = $("#bannerTitle" + i).val();
						input.subtitle = $("#bannerSubtitle" + i).val();
						input.link = $("#bannerLink" + i).val();
						//input.banner_image = this.banner[0].banner_image;
						input.banner_image = '';
						input.banner_idx = i;
						input.user_hash = this.user_hash;
						params.push(input);
						count++;
						var source = '<div class="bannerContentWrapper" id="bannerContentWrapper' + this.banner[i].banner_idx + '">' +
										'<div class="bannerContent">' + 
											'<div class="bannerTitle">' + 
												'<p>' + input.title + '</p>' + 
											'</div>' + 
											'<div class="bannerSubtitle">' + 
												'<p>' + input.subtitle + '</p>' + 
											'</div>' + 
										'</div>' + 
									  '</div>';
						Common.appendSource(source, '#bannerWrapper');
					}
				}
				else{
					if($("#bannerTitle" + i).val() != this.banner[matched].title || 
					   $("#bannerSubtitle" + i).val() != this.banner[matched].subtitle || 
					   $("#bannerLink" + i).val() != this.banner[matched].link){
						var input = {};
						input.title = $("#bannerTitle" + i).val();
						input.subtitle = $("#bannerSubtitle" + i).val();
						input.link = $("#bannerLink" + i).val();
						//input.banner_image = this.banner[0].banner_image;
						input.banner_image = '';
						input.banner_idx = i;
						input.user_hash = this.user_hash;
						params.push(input);
						count++;
					}
				}	
			}
			if(count != 0){
				$.ajax({
					url: url,
					data: {params: params},
					type: 'POST',
					dataType: 'json',
					context: window.ExhibitionMain,
					success: function(result){
					}
				});
			}
		}
		ExhibitionMain.prototype.loadGuestbook = function(){
			var url = '/user/guestbook';
			var params = {user_hash: this.user_hash};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					self = this;
					this.guestbook = result;
					for(var i=0; i<this.guestbook.length; i++){
						var term = Common.getRegTime(this.guestbook[i].reg_date);
						var source = '<div class="visitorsContent">' +
										'<div class="guestProfilePhoto"></div>' + 
										'<div class="visitorNameAndTime">' + 
											'<p class="visitorName">' + this.guestbook[i].guest_name + '</p>' + 
											'<p class="visitorTime">' + term + '</p>' + 
										'</div>' + 
										'<div class="guestBookText"><p>' + this.guestbook[i].comment + '</p></div>' + 
									'</div>';
						Common.appendSource(source, '#visitorsContentWrapper');
					}
					for(var i=0; i<2; i++){
						var source = '<div class="visitorsContent">' +
								'<div class="visitorNameAndTime">' + 
									'<p class="visitorName"></p>' + 
									'<p class="visitorTime"></p>' + 
								'</div>' + 
								'<div class="guestBookText"><p></p></div>' + 
							'</div>';
						Common.appendSource(source, '#visitorsContentWrapper');
					}
					if(this.guestbook.length == 0){
						$('<div class="guestBookContent" id="guestBookContentFront">' +
							'<div class="guestProfilePhoto"></div>' + 
							'<div class="guestBookText">' + 
								'<p class="visitorName"></p>' + 
							'</div>' + 
						'</div>'
						).appendTo('#guestBook');
					}
					else{
						$('<div class="guestBookContent" id="guestBookContentFront">' +
							'<div class="guestProfilePhoto"></div>' + 
							'<div class="guestBookText">' + 
								'<p class="visitorName">' + this.guestbook[0].comment + '</p>' + 
							'</div>' + 
						'</div>'
						).appendTo('#guestBook');
					}
					$('#guestBook').click(function() {
						$(this).hide();
						$('#artistBanner').hide();
						$('#visitorsHighlighted').show();
						$('#visitorsHighlighted').css('height', $('#artistPageUpperContentWrapper').height());
					});

					$('#textEditComplete').click(function() {
						self.insertGuestbook();
						$('#visitorsHighlighted').hide();
						$('#guestBook').show();
						$('#artistBanner').show();
					});
					$('#closeVisitors').click(function() {
						$('#guestbookComment').val('');
						$('#visitorsHighlighted').hide();
						$('#guestBook').show();
						$('#artistBanner').show();						
					});					
				}
			})
		}
		ExhibitionMain.prototype.insertGuestbook = function(){
			var url = '/user/guestbook/register';
			var params = [];
			var input = {
				comment: '',
				guest_idx: 6,
				user_hash: this.user_hash
			};
			if($("#guestbookComment").val() != ''){
				input.comment = $("#guestbookComment").val();
				$("#guestbookComment").val('');
				params.push(input);
				$.ajax({
					url: url,
					data: {params: params},
					type: 'POST',
					dataType: 'JSON',
					context: window.ExhibitionMain,
					success: function(result){
						var term = Common.getRegTime(result.reg_date);
						$("#guestBookContentFront").empty();
						var source = '<div class="guestProfilePhoto"></div>' + 
							'<div class="guestBookText">' + 
								'<p class="visitorName">' + input.comment + '</p>' + 
							'</div>';
						Common.appendSource(source, '#guestBookContentFront');
						source = '<div class="visitorsContent">' +
							'<div class="guestProfilePhoto"></div>' + 
							'<div class="visitorNameAndTime">' + 
								'<p class="visitorName">' + result.guest_name + '</p>' + 
								'<p class="visitorTime">' + term + '</p>' + 
							'</div>' + 
							'<div class="guestBookText"><p>' + input.comment + '</p></div>' + 
						'</div>';
						Common.prependSource(source, '#visitorsContentWrapper');
					}
				});
			}
		}
		ExhibitionMain.prototype.loadExhibitions = function () {
			var url = '/user/exhibition';
			var params = {user_hash: this.user_hash};
			$.ajax({
				url: url,
				data: params,
				type: 'POST',
				dataType: 'json',
				context: window.ExhibitionMain,
				success: function(result){
					var self = this;
					this.exhibition = result;
					this.right_exhibit = Common.lessThanValue(this.exhibition.length, 5);
					$('#artistExCardWrapper').css('width', this.exhibitionCardSize*Common.moreThanValue(this.max_exhibit_num, this.exhibition.length) + 'px');
					for(var i=0; i<this.exhibition.length; i++){
						this.exhibition[i].term = Common.getScheduleTime(this.exhibition[i].schedule_start, this.exhibition[i].schedule_end);
						var source = '<div class="artistExCard" id="artistExCard' + i + '">' +
								'<div class="artistExImage" id="artistExImage' + i + '" style="background-image: url(\'/images/exhibit/' + this.exhibition[i].exhibit + '.png\');"></div>' + 
								'<div class="hoverArtistExImage" id="hoverArtistExImage' + i + '" style="background-image: black; display: none"><div class="artistExAnalytics"><div class="analyticDataWrapper"><div class="analyticData"><div class="data">' + 
									'<p>'+this.exhibition[i].works_count +'</p></div><div class="title"><p>Artworks</p></div></div><div class="analyticData"><div class="data">' + 
									'<p>'+this.exhibition[i].works_count +'</p></div><div class="title"><p>Opinions</p></div></div><div class="analyticData"><div class="data">' + 
									'<p>'+this.exhibition[i].works_count +'</p></div><div class="title"><p>Works</p></div></div></div></div></div>' +
								'<div class="artistExDetails">' + 
									'<div class="beforeHoverWrapper" id="beforeHoverWrapper' + i + '">' + 
										'<div class="artistExTitle">' + 
											'<h6><p>' + this.exhibition[i].title + '</p></h6>' + 
										'</div>' + 
										'<div class="artistExSchedule">' + 
											'<p>' + this.exhibition[i].term + '</p>' + 
										'</div>' +
									'</div>' + 
									'<div class="hoverWrapper" id="hoverWrapper' + i + '">' + 
										'<div class="moveEx" onclick="ExhibitionMain.enterExhibition(\'' + this.exhibition[i].user_url + '\', \'' + this.exhibition[i].exhibition_url + '\')"></div>' + 
									'</div>' + 
								'</div>' +
							'</div>';
							Common.appendSource(source, '#artistExCardCover');
					}
					if(this.exhibition.length < this.max_exhibit_num){
						for(var i=this.exhibition.length; i<5; i++){
							var source = '<div class="artistCommingSoonCard" id="artistExCard' + i + '">' +
								'<div class="artistCommingSoonImage" id="artistExImage' + i + '");"></div>' + 
								'<div class="hoverArtistExImage" id="hoverArtistExImage' + i + '" style="background-image: black; display: none"><p>' + i + '</p></div>' +
								'<div class="artistExDetails">' + 
									'<div class="beforeHoverWrapper" id="beforeHoverWrapper' + i + '">' + 
										'<div class="artistExTitle">' + 
											'<h4><p>Coming Soon</p></h4>' + 
											'<h6><p>전시가 준비중입니다.</p></h6>' + 
										'</div>' + 
										'<div class="artistExSchedule">' + 
										'</div>' +
									'</div>' + 
								'</div>' +
							'</div>';
							Common.appendSource(source, '#artistExCardCover');
						}
					}
					$('.artistExCard').css('height', document.body.clientHeight*0.43);
					$('.artistExDetails').css('width', $('.artistExCard').width());
					$('.artistExDetails').css('width', $('.artistCommingSoonImage').width());	
					$('.artistExDetails>.hoverWrapper').css('top', $('.artistExCard').height()*0.1+'%');	
					$('.hoverArtistExImage').css('top', '-' + $('.artistExCard').height()/2);
					$('.artistCommingSoonCard').css('height', document.body.clientHeight*0.43);
					//$('.artistExDetails').css('width', document.body.clientWidth*0.15 + 'px');
					
					$(".artistExCard").bind('mouseenter', function(){
						var divs = $(".artistExCard");
						var i = divs.index($(this));
						$("#hoverArtistExImage" + i).fadeIn(300);
					});
					$(".artistExCard").bind('mouseleave', function(){
						var divs = $(".artistExCard");
						var i = divs.index($(this));
						$('#hoverArtistExImage' + i).fadeOut(100);
					});	
					$('#exhibitionMoveLeft').click(this.moveClickExhibitLeft.bind(this));
					$('#exhibitionMoveRight').click(this.moveClickExhibitRight.bind(this));
					this.exhibitionCardSize = $('.artistExCard').height();
				}
			});
		}
		ExhibitionMain.prototype.moveAnimation = function(node, direct, width, time, done_callback){
			var done_callback = done_callback || null;
			node.animate({
				left: direct + '=' + width},
				{duration: time,
				done: done_callback
			});
		}
		ExhibitionMain.prototype.moveClickBannerLeft = function(){
			if(this.mainBannerIdx > 1){
				var self = this;
				$(Common.indicator_id[this.mainBannerIndicator]).css("background-image", "url('/images/artist/" + Common.indicator_image[this.mainBannerIndicator] + ".png')");
				this.mainBannerIndicator = 0;
				$(".banner" + this.mainBannerIdx).css('color', '#bcbcbc');
				this.mainBannerIdx--;
				$(".banner" + this.mainBannerIdx).css('color', '#3ad7ff');
				$("#bannerTitle" + this.mainBannerIdx).removeAttr('disabled');
				$("#bannerSubtitle" + this.mainBannerIdx).removeAttr('disabled');
				$("#bannerLink" + this.mainBannerIdx).removeAttr('disabled');
				this.moveAnimation($('#editBannerMoveWrapper'), '+', 563, 500, function(){
					$("#bannerTitle" + (self.mainBannerIdx + 1)).attr('disabled', 'disabled');
					$("#bannerSubtitle" + (self.mainBannerIdx + 1)).attr('disabled', 'disabled');
					$("#bannerLink" + (self.mainBannerIdx + 1)).attr('disabled', 'disabled');
				});
			}
				
		}
		ExhibitionMain.prototype.moveClickBannerRight = function(){
			if(this.mainBannerIdx < 3){
				var self = this;
				$(Common.indicator_id[this.mainBannerIndicator]).css("background-image", "url('/images/artist/" + Common.indicator_image[this.mainBannerIndicator] + ".png')");
				this.mainBannerIndicator = 0;
				$(".banner" + this.mainBannerIdx).css('color', '#bcbcbc');
				this.mainBannerIdx++;
				$(".banner" + this.mainBannerIdx).css('color', '#3ad7ff');
				$("#bannerTitle" + this.mainBannerIdx).removeAttr('disabled');
				$("#bannerSubtitle" + this.mainBannerIdx).removeAttr('disabled');
				$("#bannerLink" + this.mainBannerIdx).removeAttr('disabled');
				this.moveAnimation($('#editBannerMoveWrapper'), '-', 563, 500, function(){
					$("#bannerTitle" + (self.mainBannerIdx-1)).attr('disabled', 'disabled');
					$("#bannerSubtitle" + (self.mainBannerIdx-1)).attr('disabled', 'disabled');
					$("#bannerLink" + (self.mainBannerIdx-1)).attr('disabled', 'disabled');
				});
			}
				
		}
		ExhibitionMain.prototype.moveClickBanner = function(bannerIdx){
			var moveWidth = Math.abs(563*(bannerIdx-this.mainBannerIdx));
			$("#bannerTitle" + this.mainBannerIdx).attr('disabled', 'disabled');
			$("#bannerSubtitle" + this.mainBannerIdx).attr('disabled', 'disabled');
			$("#bannerLink" + this.mainBannerIdx).attr('disabled', 'disabled');
			$("#bannerTitle" + bannerIdx).removeAttr('disabled');
			$("#bannerSubtitle" + bannerIdx).removeAttr('disabled');
			$("#bannerLink" + bannerIdx).removeAttr('disabled');
			if(bannerIdx > this.mainBannerIdx){
				this.mainBannerIdx = bannerIdx;
				this.moveAnimation($('#editBannerMoveWrapper'), '-', moveWidth, 500);
			}
			else if(bannerIdx < this.mainBannerIdx){
				this.mainBannerIdx = bannerIdx;
				this.moveAnimation($('#editBannerMoveWrapper'), '+', moveWidth, 500);
			}
		}
		ExhibitionMain.prototype.moveClickExhibitLeft = function(){
			if(this.left_exhibit - this.exhibit_num <= 0){
				this.moveAnimation($('#artistExCardWrapper'), '+', (this.left_exhibit - 1)*this.exhibitionCardSize, 500);
				this.right_exhibit -= this.left_exhibit - 1;
				this.left_exhibit = 1;
			}
			else{
				this.moveAnimation($('#artistExCardWrapper'), '+', this.rollingWidth, 500);
				this.left_exhibit -= this.exhibit_num;
				this.right_exhibit -= this.exhibit_num;
			}
		}
		ExhibitionMain.prototype.moveClickExhibitRight = function(){
			if(this.right_exhibit + this.exhibit_num > this.exhibition.length){
				this.moveAnimation($('#artistExCardWrapper'), '-', (this.exhibition.length - this.right_exhibit)*this.exhibitionCardSize, 500);
				this.left_exhibit += this.exhibition.length - this.right_exhibit;
				this.right_exhibit = this.exhibition.length;
			}
			else{
				this.moveAnimation($('#artistExCardWrapper'), '-', this.rollingWidth, 500);
				this.right_exhibit += this.exhibit_num;
				this.left_exhibit += this.exhibit_num;
			}
		}
		ExhibitionMain.prototype.onResize = function(){
			$('.artistExCard').css('height', document.body.clientHeight*0.43).css('width', document.body.clientWidth*0.15);
			this.exhibitionCardSize = $('.artistExCard').height();
			this.ExhibitionMain.pre_exhibit_num = this.ExhibitionMain.exhibit_num;
			this.ExhibitionMain.exhibit_num = Math.floor((document.body.clientWidth-5) / this.ExhibitionMain.exhibitionCardSize);
			this.ExhibitionMain.max_exhibit_num = Math.floor((document.body.clientWidth-5) / this.ExhibitionMain.exhibitionCardSize);
			if(this.ExhibitionMain.exhibit_num > this.ExhibitionMain.exhibition.length)	this.ExhibitionMain.exhibit_num = this.ExhibitionMain.exhibition.length;
			if(this.ExhibitionMain.width - document.body.clientWidth < 0){
				if((this.ExhibitionMain.exhibit_num != this.ExhibitionMain.pre_exhibit_num) && (this.ExhibitionMain.right_exhibit == this.ExhibitionMain.exhibition.length)){
					if(this.ExhibitionMain.left_exhibit - (this.ExhibitionMain.exhibit_num - this.ExhibitionMain.pre_exhibit_num) >= 1)
						this.ExhibitionMain.prototype.moveAnimation($('#artistExCardWrapper'), '+', (this.ExhibitionMain.exhibit_num - this.ExhibitionMain.pre_exhibit_num) * this.ExhibitionMain.exhibitionCardSize, 500);	//TODO : ExhibitionMain.prototype이 아니고 ExhibitionMain
					if(this.ExhibitionMain.left_exhibit - (this.ExhibitionMain.exhibit_num - this.ExhibitionMain.pre_exhibit_num) < 1)
						this.ExhibitionMain.left_exhibit = 1;
					else												
						this.ExhibitionMain.left_exhibit -= this.ExhibitionMain.exhibit_num - this.ExhibitionMain.pre_exhibit_num;
				}
			}
			this.ExhibitionMain.artistBannerHeight = $('#artistPageUpperContentWrapper').height();
			this.ExhibitionMain.width = document.body.clientWidth;
			this.ExhibitionMain.height = document.body.clientHeight;
			this.ExhibitionMain.rightwidth = this.ExhibitionMain.width-30;
			this.ExhibitionMain.widthPercent = 100 * (this.ExhibitionMain.width)/document.body.clientWidth;
			this.ExhibitionMain.right_exhibit = this.ExhibitionMain.left_exhibit + this.ExhibitionMain.exhibit_num - 1;
			if(this.ExhibitionMain.right_exhibit > this.ExhibitionMain.exhibition.length)	this.ExhibitionMain.right_exhibit = this.ExhibitionMain.exhibition.length;
			if(this.ExhibitionMain.width < this.ExhibitionMain.exhibitionCardSize)		this.ExhibitionMain.rollingWidth = this.ExhibitionMain.exhibitionCardSize;
			else				this.ExhibitionMain.rollingWidth = this.ExhibitionMain.exhibit_num * this.ExhibitionMain.exhibitionCardSize;
			$('#artistPageUnderWrapper').css('padding-left', '0px');
			$('#artistExCardWrapper').css('margin', '0 30px');
			$('#artistBannerCardWrapper').css("width", this.ExhibitionMain.widthPercent*0.4+"%").css("left", $("#interactionCardWrapper").width() + $('#profileCardWrapper').width() + $('#analyticsCardWrapper').width() + "px");
			$('#artistPageUnderWrapper').css('width', this.ExhibitionMain.width +'px');
			$('#exhibitionMoveRight').css('left', this.ExhibitionMain.rightwidth + 'px');
			$('#artistPageUnderWrapper').css('width', this.ExhibitionMain.width +'px');
			$("#artistPageUnderWrapper").css("height", document.body.clientHeight-$('#artistPageUpperContentWrapper').height());
			$('#profileCardWrapper').css('height', $('#artistPageUpperContentWrapper').height());
			$('#interactionCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('left', $('#profileCardWrapper').width());
			$('#analyticsCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('width', $('#artistPageUpperContentWrapper').width()*0.13).css('left', $('#profileCardWrapper').width()+$('#interactionCardWrapper').width());	
			$('#artistBannerCardWrapper').css('height', $('#artistPageUpperContentWrapper').height()).css('width', $('#artistPageUpperContentWrapper').width()-$('#profileCardWrapper').width()-$('#interactionCardWrapper').width()-$('#analyticsCardWrapper').width()).css('left', $("#interactionCardWrapper").width() + $('#profileCardWrapper').width() + $('#analyticsCardWrapper').width() + "px");
			$('.bannerContentWrapper').css('width', $('#artistBannerCardWrapper').width());
			$('.bannerContent').css('width', $('#artistBannerCardWrapper').width());
			$('#visitors').css('top', $('#artistBannerCardWrapper').height()/2-25);
			$('.editBannerContentWrapper').css('top', $('#artistBannerCardWrapper').height()/2-30-75);
			$('#bannerMoveLeft').css('top', $('#artistBannerCardWrapper').height()/2-30-48);
			$('#bannerMoveRight').css('top', $('#artistBannerCardWrapper').height()/2-30-48);
			$('.artistExDetails').css('width', $('.artistExCard').width());
			$('.artistExDetails').css('width', $('.artistCommingSoonImage').width());	
			$('.artistCommingSoonCard').css('height', document.body.clientHeight*0.43).css('width', document.body.clientWidth*0.15);
			$('#editBannerWrapper').css('height', this.ExhibitionMain.artistBannerHeight);
			$('#visitorsHighlighted').css('height', $('#artistPageUpperContentWrapper').height());
			//$('#artistBanner').css('height', this.ExhibitionMain.artistBannerHeight/2);
		}
		ExhibitionMain.prototype.enterExhibition = function(user_url, exhibition_url){
			var url;
			url = "/" + user_url + "/" + exhibition_url;
			location.href = url;
		}
		ExhibitionMain.prototype.enterIndexPage = function(){
			var url = '/';
			//location.href  = url;
			 document.location.replace=("www.naver.com");
		}
		ExhibitionMain.prototype.enterProfile = function(){
			var url = '/4/works';
			location.href  = url;
		}
		ExhibitionMain.prototype.enterExhibitionNew = function(user_url){
			var url;
			url = "/" + user_url + "/newExhibition";
			location.href = url;
		}
	}
})(window);