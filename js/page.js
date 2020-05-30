function load_page(page_name) {
	
	$.get( "content/"+page_name+".html", function( data ) {
		$("#target").html(data);
	}, "html" );
	
}

$("#modal-container").click(function() {
	$(this).hide();
});

$("#pane > .title > a").click(function() {
	$("#pane").hide();
});

$(".menu-bodies").click(function() {
	$("#pane").show();
});

/*
$('#pane .title').on("mousedown", function(e) {
	var xstart = e.clientX;
	var ystart = e.clientY;
	var el = this;
	
	var initialLeft = parseInt(this.style.left);
	var initialTop = parseInt(this.style.top);
	
	function dragpane(event) {
		var deltax = event.clientX - xstart;
		var deltay = event.clinetY - ystart;
		
		el.style.left = (initialLeft+deltax)+"px";
		el.style.top = (initialTop+deltay)+"px";
	}
	
	window.addEventListener("mousemove",dragpane(e));
	
	$(this).mouseup(function(e) {
		window.removeEventListener("mousemove", dragpane);
	});
	
})
*/

function changeTime() {
	var d = new Date();
	$("#time > span").text(d.toUTCString());
	$("#time > input").val(d.getTime());
	setTimeout(function() {
		changeTime();
	},250);
}



function populateBodyList( db ) {
	var div = "<div class='body-list'>";
	for(var planet in db["Planets"]) {
		div += "<a href='#body-"+planet+"' data-planet="+planet+">"+planet+"</a>";
	}
	div += "</div><a href='#body-add' class='add-body'>Add Body</a>";
	$("#pane .target").html(div);
}

changeTime();

