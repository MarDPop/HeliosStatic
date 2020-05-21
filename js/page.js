function load_page(page_name) {
	
}

$("#modal-container").click(function() {
	$(this).hide();
});

function changeTime() {
	var d = new Date();
	$("#time").text(d.toUTCString());
	setTimeout(function() {
		changeTime();
	},1000);
}

changeTime();

