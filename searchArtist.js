const artist_form = document.getElementById('search-artist');

function no_results_tag(){
	var no_results_div = document.createElement("div");
	no_results_div.className = "no-results"

	var no_results_text = document.createElement("p");
	no_results_text.innerHTML = "No results found."

	no_results_div.appendChild(no_results_text)

	return no_results_div;
}

function search_input_focusin(){
	var search_div = document.getElementById("search-artist")
	search_div.style.borderColor = "orange";
}

function search_input_focusout(){
	var search_div = document.getElementById("search-artist")
	search_div.style.borderColor = "black";
}

function changeColor(target) {
	console.log("Changing target for", target);
}

function loading_gif_div(e){
	crossbrowser_stopPropagation(e);
	var loading_div = document.createElement("div")
	loading_div.className = "loading";
	loading_div.id = "loadingGIF";
	loading_div.width = "100px"
	loading_div.backgroundColor = "black";
	var loading_gif = document.createElement("img")
	loading_gif.src = "static/loading.gif";
	loading_gif.style.width = "40px";
	loading_div.appendChild(loading_gif);
	return loading_div;
}

function crossbrowser_stopPropagation(e){
    if (!e) {
       e = window.event; 
    }

    e.cancelBubble = true;      

    if (e.stopPropagation) {
       e.stopPropagation(); 
    }       
}

artist_form.addEventListener('submit', (event) => {
	var main_div = document.getElementById("artists");
	main_div.appendChild(loading_gif_div());
	var id=0;

	event.preventDefault();
	var artist_search_text = document.getElementById("artist-search-text").value;
	
	var xhttp = new XMLHttpRequest();

	var url = 'https://csci-571-hw-5-1.wl.r.appspot.com/artistfetch?artist_name=' + artist_search_text;

	xhttp.open("GET", url, true);

	xhttp.onreadystatechange = function () {
		if ( this.readyState == 4 && this.status == 200 ){
			const json_response = this.responseText;
			const artists = JSON.parse(json_response);
			main_div.innerHTML = "";
			const div2 = document.getElementsByClassName("info_to_display")[0];
			div2.innerHTML = "";
			var inner_div = document.createElement("div");

			if ( artists.length == 0 ){
				main_div.appendChild(no_results_tag())
			}
			else {
				for(var artist in artists) {
					let artist_id = artists[artist]["_links"]["self"]["href"].match('([^\/]+$)')[1];

					var image_url = artists[artist]["_links"]["thumbnail"]["href"];
					if (image_url == "/assets/shared/missing_image.png"){
						image_url = 'static/artsy_logo.svg';
					}

					var title = artists[artist]["title"];

					const div = document.createElement("div");
					div.className = "individual-artist";
					div.id = 'card'+id;
					div.onclick = function(){
						const allArtists = document.getElementById("artists").childNodes[0]?.childNodes;
						allArtists.forEach(artist => {
							artist.style.backgroundColor = '#205375';
							artist.style.pointerEvents = "none";
						})
						document.getElementById(div.id).style.backgroundColor = "#112B3C";
					}
					id++;

					div.addEventListener('click', e => {

						main_div.appendChild(loading_gif_div(e));
						var xhttp2 = new XMLHttpRequest();

						var url2 = 'https://csci-571-hw-5-1.wl.r.appspot.com/getartistinfo?id=' + artist_id;
						//console.log("Artist URL:" + url2)

						xhttp2.open("GET", url2, true);

						const div2 = document.getElementsByClassName("info_to_display")[0];

						div2.innerHTML = "";

						xhttp2.onreadystatechange = function () {
							if ( this.readyState == 4 && this.status == 200 ){
								document.getElementById("loadingGIF").remove();
								const json_response2 = this.responseText;
								//console.log(json_response2);

								const artists_info = JSON.parse(json_response2);

								var name = artists_info ['name']
								var birthday = artists_info ['birthday']
								var deathday = artists_info ['deathday']
								var nationality = artists_info ['nationality']
								var biography = artists_info ['biography']

								
								
								const p1 = document.createElement("p");
								p1.className = "first_line";
								const node1 = document.createTextNode(name + " (" + birthday + "-" + deathday + ")");
								//console.log(node1);
								p1.appendChild(node1);

								const p2 = document.createElement("p");
								p2.className = "nationality";
								const node2 = document.createTextNode(nationality);
								p2.appendChild(node2);

								const p3 = document.createElement("p");
								p3.className = "biography";
								const node3 = document.createTextNode(biography);
								p3.appendChild(node3);

								div2.appendChild(p1);
								div2.appendChild(p2);
								div2.appendChild(p3);

								const allArtists = document.getElementById("artists").childNodes[0]?.childNodes;
								allArtists.forEach(artist => {
								artist.style.pointerEvents = "all";
								})

								
								
							}
						}
						// console.log(e.target.id);


						xhttp2.send();

					})


					const img = document.createElement("img")
					img.src = image_url;
					img.width= "30px"

					const p = document.createElement("p")
					p.innerHTML = title

					
					div.appendChild(img)
					div.appendChild(p)
					inner_div.appendChild(div);
				}
				main_div.appendChild(inner_div)
			}
		}

	}

	//console.log("Request Object formed! Sending request!");
	xhttp.send();
} );


