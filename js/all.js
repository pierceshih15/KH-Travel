let data = [];
let URL = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';

const zoneSelect = document.getElementById('zoneSelect');
const hotZone = document.getElementById('hotZone');
const zoneTitle = document.getElementById('zoneTitle');
const resultList = document.getElementById('resultList');

// Paginaton 
const paginaton = document.querySelector('.pagination');
const ITEM_PER_PAGE = 4; // 每頁呈現 4 筆資料
let targetPage = 1; // 預設為第一頁
let paginatonData = []; // 共用變數，供分頁使用

// 共用變數 - 行政區資料
let selectZone = '三民區'; // 預設為 三民區
let targetZoneData = [];

// 初始化 
getAPIData()


// ==================== 事件 ==================== // 

// 選擇行政區按鈕 監聽事件
zoneSelect.addEventListener('change', e => {
	// Step 1：鎖定行政區
	selectZone = e.target.value;
	// Step 2：取出該行政區的資料
	filterDataByZone(selectZone);
	// Step 3：從中判斷分頁數量
	getTotalPage()
	// Step 4：顯示資料，起始頁為第一頁
	getPageData(1, targetZoneData)
});

// 熱門行政區按鈕 監聽事件
hotZone.addEventListener('click', e => {
	// console.log(e.target.nodeName)
	if (e.target.nodeName === "BUTTON") {
		// Step 1：依照點擊之行政區，並取出該行政區的資料
		filterDataByZone(e.target.textContent);
		// Step 2：從中判斷分頁數量
		getTotalPage();
		// Step 3：顯示資料，起始頁為第一頁
		getPageData(1, targetZoneData);
	}
});

// 分頁 監聽事件
paginaton.addEventListener('click', e => {
	e.preventDefault(); // 移除預設事件
	// 以 dataset 取出特定的 page 值
	targetPage = e.target.dataset.page;

	// 若點擊的 HTML 標籤為 a 連結
	if (e.target.tagName === "A") {
		// 則代入 targetPage 和 targetZoneData，顯示該頁所需呈現的資料
		getPageData(targetPage, targetZoneData);
	}
})


// ==================== API函式 ==================== // 

// 取得API資料
function getAPIData() {
	axios.get(URL).then((response) => {
		data = response.data.result.records;
		// 取出行政區資料，讓 select button 有內容可點擊
		getZoneData();

		// Step 1：取出該行政區的資料，預設為 三民區
		filterDataByZone(selectZone);
		// Step 2：從中判斷分頁數量
		getTotalPage();
		// Step 3：顯示資料，起始頁為第一頁
		getPageData(1, targetZoneData);

	}).catch((err) => {
		console.log(err);
	});
}

// ==================== 資料呈現函式 ==================== // 

// 取出行政區資料
function getZoneData() {
	// Step1：取出 data 行政區資料，逐一放進 ZoneList 陣列
	let zoneList = [];
	for (let i = 0; i < data.length; i++) {
		zoneList.push(data[i].Zone);
	}

	// Step2：比對 ZoneList 陣列判斷陣列裡面所有值
	let Zone = [];
	zoneList.forEach(function (value) {
		// 若不重複，則將資料取出，逐一放進 Zone 陣列
		if (Zone.indexOf(value) == -1) {
			Zone.push(value);
		}
	});

	// Step3：透過迴圈方式取得 Zone 陣列當中的行政區資料
	for (let i = 0; i < Zone.length; i++) {
		// 創建 option
		let option = document.createElement('option');
		option.textContent = Zone[i];
		option.value = Zone[i];

		// 逐一加入資料
		zoneSelect.appendChild(option);
	}
}

// 依照選擇的行政區取出該區的所有資料
function filterDataByZone(selectZone) {
	// 回傳符合所選定之行政區的資料
	targetZoneData = data.filter(item => item.Zone == selectZone);
	// console.log(targetZoneData)
	// 更新行政區的標題名稱
	zoneTitle.textContent = selectZone;
}

// 依照所選擇的頁面資料更新內容
function updatelist(pageData) {
	let str = '';
	for (let i = 0; i < pageData.length; i++) {
		str += `
			<div class="col-md-6 py-2 px-2">
				<div class="card">
					<div class="card bg-dark text-white text-left">
						<img class="card-img-top" bg-cover height="250px" src="${pageData[i].Picture1}">
						<div class="card-img-overlay d-flex justify-content-between align-items-end">
							<h5 class="card-img-title-lg">${pageData[i].Name}</h5>
							<h5 class="card-img-title-sm"><i class="fas fa-bookmark mr-2"></i>${pageData[i].Zone}</h5>
						</div>
					</div>

					<div class="card-footer text-left">
						<p class="card-p-text"><i class="far fa-clock fa-clock-time"></i>&emsp;${pageData[i].Opentime}</p>
						<p class="card-p-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&emsp;${pageData[i].Add}</p>
						<div class="d-flex justify-content-between align-items-end">
							<p class="card-p-text"><i class="fas fa-mobile-alt fa-mobile"></i>&emsp;${pageData[i].Tel}</p>
							<p class="card-p-text"><i class="fas fa-tags text-warning"></i>&emsp;${pageData[i].Ticketinfo}</p>
						</div>
					</div>
				</div>
			</div>`

	}
	resultList.innerHTML = str;
}

// ==================== 分頁函式 ==================== // 

// 印出分頁數量
function getTotalPage() {
	let totalPages = Math.ceil(targetZoneData.length / ITEM_PER_PAGE) || 1;
	let pageContent = '';

	for (let i = 0; i < totalPages; i++) {
		pageContent += `
		<li class="page-item">
			<a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
		</li>
		`
	}
	paginaton.innerHTML = pageContent;
}

// 取得分頁資料
function getPageData(pageNum, targetZoneData) {
	paginatonData = targetZoneData;
	// console.log(paginatonData);
	// console.log(pageNum);

	// 宣告 offset 為 每頁要顯示的內容 從 paginatonData index 排序
	let offset = (pageNum - 1) * ITEM_PER_PAGE;
	// 以 slice()語法 從 paginatonData 中取出相符的資料，並賦予 pageData
	// 每次都從 offset 為起點開始取出，每次 4 筆資料
	let pageData = paginatonData.slice(offset, offset + ITEM_PER_PAGE);
	// console.log(pageData);

	// 將 pageData 參數代入，顯示該分頁需呈現的資料
	updatelist(pageData);
}

// ==================== jQuery 特效 ==================== // 

// 使用ready function來確保網頁資料已讀取完畢再執行其他 goTop 事件
$(document).ready(function () {
	// 上滑至Top
	$('.scroll_top').click(function () {
		$('html,body').animate({
			scrollTop: 0
		}, 333);
	});
	// 限制範圍
	$(window).scroll(function () {
		if ($(this).scrollTop() > 200) {
			$('.scroll_top').fadeIn(333);
		} else {
			$('.scroll_top').stop().fadeOut(333);
		}
	}).scroll();
});