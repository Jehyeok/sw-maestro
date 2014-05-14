/* ExhibitionWorkDetail 객체 선언 */
function ExhibitionWorkDetail(exhibition, work_order, work_thumbprint)
{
	// 객체에서 필요한 변수나 자료는 여기에 선언
	this.exhibition = exhibition;
	this.work_order = work_order;
	this.work_thumbprint = this.exhibition.works_list[this.work_order].thumbprint;

	// 초기화 실행 코드는 여기에 선언
	return null;
}

/* ExhibitionWorkDetail의 메소드는 여기에 선언 */

/*
	setHighImageForImageview()
	: 이미지뷰에 이미지를 출력
*/
ExhibitionWorkDetail.prototype.setHighImageForImageview = function() {
	downloadImageByWorkThumbprint(this.work_thumbprint, 'high', function(url, size) {
		$('.popup_work_detail .section_imageview .work_image')
			.css('background-image', 'url("' + url + '")')
			.css('width', size.width)
			.css('height', size.height);
	}, null);
};

/*
	printWorkDetailByThumbprint()
	: 기존 출력 정보를 초기하고 작품의 Thumbprint에 따라 작품 정보 출력
*/
ExhibitionWorkDetail.prototype.printWorkDetailByThumbprint = function() {
	// 초기화
	this.clearWorkDetail();

	// 출력
	this.setHighImageForImageview();

};

/*
	clearWorkDetail()
	: 현재 작품 상세보기 화면을 전부 초기화
*/
ExhibitionWorkDetail.prototype.clearWorkDetail = function() {

};

/*
	changeWorkThumbprintByOrder(work_order)
	: 전시의 작품 순서를 인자로 하여 Thumbprint를 먹임

	- work_order : 작품 순서의 정수값(제일 처음이 0), "next"는 다음 작품 순서, "prev"는 이전 작품 순서
*/
ExhibitionWorkDetail.prototype.changeWorkThumbprintByOrder = function(work_order) {
	if (work_order == 'next') {
		this.work_order++;
		if (this.work_order == this.exhibition.works_count)
			this.work_order == 0;
	} else if (work_order == 'prev') {
		this.work_order--;
		if (this.work_order < 0)
			this.work_order = this.exhibition.works_count - 1;
	}
	this.work_thumbprint = this.exhibition.works_list[this.work_order].thumbprint;
};

/*
	showWorkDetailByOrder()
	: 다음 작품의 작품 상세 정보 출력

	- work_order : 작품 순서의 정수값(제일 처음이 0), "next"는 다음 작품 순서, "prev"는 이전 작품 순서
*/
ExhibitionWorkDetail.prototype.showWorkDetailByOrder = function(work_order) {
	changeWorkThumbprintByOrder(work_order);
	printWorkDetailByThumbprint();
};