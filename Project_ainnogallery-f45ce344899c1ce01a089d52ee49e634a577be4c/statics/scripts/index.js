// jQuery로 만들었으니 알아서 고쳐주셈

$(function(){
	$("#filterOpener").click(function () {
		$(this).toggleClass("selected");
		if($(this).hasClass("selected")) {
			$("#nav-filter").show();
		} else {
			$("#nav-filter").hide();
		}
		return false;
	});

	$("#openArtists").click(function(){
		if($("#artists").css("display")=="none") {
			$("#openExhibitions").removeClass("selected");
			$(this).addClass("selected");
			$("#exhibitions").hide();
			$("#artists").show();
		}
		return false;
	});

	$("#openExhibitions").click(function(){
		if($("#exhibitions").css("display")=="none") {
			$("#openArtists").removeClass("selected");
			$(this).addClass("selected");
			$("#exhibitions").show();
			$("#artists").hide();
		}
		return false;
	});

	if($(window).height() < $(document).height())
		$("#modalWrapper").height($(document).height());

	$("#modalMargin").height($(window).height()/2);
	$(window).resize(function(){
		$("#modalMargin").height($(window).height()/2);
	});

	$("#accountSignUp").click(function(){
		$("#modalWrapper").show();
		$("#modalBox").append();
	});

	$("#modalCloser").click(function(){
		$("#modalWrapper").hide();
	});

	getArtists();
});

function getArtists() {
	console.log("DB연결은말야");
	var url = "/loadArtists";
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'json',
		success: function(result){
			var end=6;
			if(result.length < 6) end = result.length;

			displayArtists(result,0,end);
		},
		error: function(result){
			console.log("에러났어");
		}
	});
}

function displayArtists(dataArray,start,end) {
	for(i=start;i<end;i++) {
		var addText = '<li><a href="/'+ dataArray[i].user_url+'" class="user">'
			+ '<span class="user-icon"><img src="/images/index/user_profile_pic_sample.jpg" alt="user profile"></span>'
			+ '<span class="user-name">' + dataArray[i].user_name + '</span>'
			+ '<span class="user-desc">#design 외 2개</span></a>';
		if(dataArray[i].exhibition_url != '') {
			var startDate = new Date(dataArray[i].exhibition_schedule_start.split(' ')[0]);
			var endDate = new Date(dataArray[i].exhibition_schedule_end.split(' ')[0]);
			addText = addText + '<div class="recentExhibition" style="background-image:url(/images/exhibit/2.png);">'
			+ '<a href="'+ dataArray[i].user_url + '/' + dataArray[i].exhibition_url +'">'
			+ '<span class="exhibitionTitle">' + dataArray[i].exhibition_title + '</span>'
			+ '<span class="schedule">'+ startDate.getFullYear() + '.' + (startDate.getMonth() + 1) + '.' + startDate.getDate() + ' - ' + endDate.getFullYear() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getDate() + '</span>'
			+ '</a>'
			+'</div></li>'
		} else {
			addText = addText + '<div class="recentExhibition comingsoon">'
			+ '<span class="exhibitionTitle">Coming soon!</span>'
			+'</div></li>'
		}
		console.log(dataArray[i]);
		$("#artistBrowseContents").append(addText);
	}
}