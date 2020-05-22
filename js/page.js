function load_page(page_name) {
	
	$.get( "content/"+page_name+".html", function( data ) {
		$("#target").html(data);
	}, "html" );
	
}

$("#modal-container").click(function() {
	$(this).hide();
});

function changeTime() {
	var d = new Date();
	$("#time > span").val(d.toUTCString());
	$("#time > input").val(d.
	setTimeout(function() {
		changeTime();
	},100);
}

changeTime();

