(function(window) {
	if (typeof window.Common === "undefined")
	{
		window.Common = new Common;

		function Common()
		{
			this.file_id = [];
			this.indicator_image = ["artist_photo_indicator", "artist_text_indicator", "artist_link_indicator"];
			this.indicator_id = ["#photoIndicator", "#textIndicator", "#linkIndicator"];
			this.indicator_name = ["", "bannerTitle", "bannerLink"];
			return null;
		}
		Common.prototype.getRegTime = function(register_date){
			var reg_date = new Date(register_date);
			var current_date = new Date();
			var term = Math.floor((current_date.getTime() - reg_date.getTime()) / 60000);
			if(term >= 60){
				if(term >= 1440){
					if(term >= 43200){
						if(term >= 518400){
							term = Math.floor(term / 518400) + " years ago";
						}
						else
							term = Math.floor(term / 43200) + " months ago";
					}
					else
						term = Math.floor(term / 1440) + " days ago";
				}
				else
					term = Math.floor(term / 60) + " hours ago";
			}
			else{
				if(term == 0)	term = "just before";
				else			term = term + " minutes ago";
			}
			return term;
		};
		Common.prototype.getScheduleTime = function(schedule_start, schedule_end){
			var terms;
			var date1 = new Date(schedule_start);
			date1 = date1.getUTCFullYear() + '-' +
			    ('00' + (date1.getUTCMonth()+1)).slice(-2) + '-' +
			    ('00' + date1.getUTCDate()).slice(-2) + ' ' + 
			    ('00' + date1.getUTCHours()).slice(-2) + ':' + 
			    ('00' + date1.getUTCMinutes()).slice(-2) + ':' + 
			    ('00' + date1.getUTCSeconds()).slice(-2);
			date1 = date1.split(' ');
			var date2 = new Date(schedule_end);
			date2 = date2.getUTCFullYear() + '-' +
			    ('00' + (date2.getUTCMonth()+1)).slice(-2) + '-' +
			    ('00' + date2.getUTCDate()).slice(-2) + ' ' + 
			    ('00' + date2.getUTCHours()).slice(-2) + ':' + 
			    ('00' + date2.getUTCMinutes()).slice(-2) + ':' + 
			    ('00' + date2.getUTCSeconds()).slice(-2);
			date2 = date2.split(' ');
			terms = date1[0] + " ~ " + date2[0];
			return terms;
		}
		Common.prototype.moreThanValue = function(left_val, right_val){
			if(left_val > right_val)	return left_val;
			else						return right_val;
		}
		Common.prototype.lessThanValue = function(left_val, right_val){
			if(left_val < right_val)	return left_val;
			else						return right_val;
		}
		Common.prototype.stringSkip = function(string, count){
			if(string > count)		string = string.substring(0, count) + "‥‥‥";
			return string;
		}
		Common.prototype.convertNumberUnit = function(number){
			if(number >= 1000){
				if(number >= 1000000){
					if(number >= 1000000000){
						number = Math.floor(number / 100000000);
						number = number / 10;
						number = number + "G";
					}
					else{
						number = Math.floor(number / 100000);
						number = number / 10;
						number = number + "M";
					}
				}
				else{
					number = Math.floor(number / 100);
					number = number / 10;
					number = number + "k";
				}
			}
			return number;
		}
		Common.prototype.loadJSFile = function(file_path, target_parent, file_id) {
			if (this.file_id.indexOf(file_id) != -1) return;
			else this.file_id.push(file_id);

			var attached_source = $('<script src="'+ file_path +'"></script>');
			if (target_parent == "head")
				$("head").append(attached_source);
			else if (target_parent == "body")
				$("body").append(attached_source);
		};
		Common.prototype.loadCSSFile = function(file_path, file_id) {
			if (this.file_id.indexOf(file_id) != -1) return;
			else this.file_id.push(file_id);

			var attached_source = $('<link rel="stylesheet" href="'+ file_path +'" />');
	     	$("head").append(attached_source);
		};
		Common.prototype.appendSource = function(source, target_space){
			$(source).appendTo(target_space);
		}
		Common.prototype.prependSource = function(source, target_space){
			$(source).prependTo(target_space);
		}
		/*Common.prototype.bannerBlurEventBind = function(source, blurIndicator){
			var common = this;
			$(source).bind('blur', function(){
				$(common.indicator_id[blurIndicator]).css("background-image", "url('/images/artist/" + common.indicator_image[blurIndicator] + ".png')");
				self.mainBannerIndicator = blurIndicator;
			});
		}*/
		Common.prototype.bannerFocusEventBind = function(source, focusIndicator){
			var common = this;
			$(source).bind('focus', function(){
				if(focusIndicator != self.mainBannerIndicator){
					$(common.indicator_id[self.mainBannerIndicator]).css("background-image", "url('/images/artist/" + common.indicator_image[self.mainBannerIndicator] + ".png')");
					$(common.indicator_id[focusIndicator]).css("background-image", "url('/images/artist/" + common.indicator_image[focusIndicator] + "_highlighted.png')");
					self.mainBannerIndicator = focusIndicator;
				}
			});
		}
		Common.prototype.bannerClickEventBind = function(source, clickIndicator){
			var common = this;
			$(source).bind('click', function(){
				if(clickIndicator != self.mainBannerIndicator){
					$(common.indicator_id[self.mainBannerIndicator]).css("background-image", "url('/images/artist/" + common.indicator_image[self.mainBannerIndicator] + ".png')");
					$(common.indicator_id[clickIndicator]).css("background-image", "url('/images/artist/" + common.indicator_image[clickIndicator] + "_highlighted.png')");
					if(clickIndicator != 0) 	$("input[name=" + common.indicator_name[clickIndicator] + self.mainBannerIdx + "]").focus();
					self.mainBannerIndicator = clickIndicator;
				}
			});
		}
	}
})(window);