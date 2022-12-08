// static/js/fixedsearch/fixedsearch.js
/*--------------------------------------------------------------
fixedsearch — Super fast, client side search for Hugo.io with Fusejs.io
based on https://gist.github.com/Arty2/8b0c43581013753438a3d35c15091a9f
and adapted to living in a dedicated search page in the clean-blog theme
--------------------------------------------------------------*/

fixedsearch = function(){
	var search_form = document.getElementById('search-form'); // search form
	var search_input = document.getElementById('search-input'); // input box for search
	var search_results = document.getElementById('search-results'); // targets the <ul>
	var fuse; // holds our search engine
	var results_available = false; // did we get any search results?
	var first_run = true; // allow us to delay loading json data unless search activated
	var first = search_results.firstChild; // first child of search list
	var last = search_results.lastChild; // last child of search list
	var navbar = document.getElementById('mainNav');

	/*--------------------------------------------------------------
	Load our json data and build fuse.js search index
	Focus on search input
	--------------------------------------------------------------*/
	search_init();
	search_input.focus();

	/*--------------------------------------------------------------
	The main keyboard event listener running the show
	--------------------------------------------------------------*/
	search_form.addEventListener('keydown', function(e) {
		// DOWN (40) arrow
		if (e.keyCode == 40) {
			if (results_available) {
				if ( document.activeElement == search_input) {
					first.parentElement.classList.add("highlighted_search_result");
					first.focus(); // if the currently focused element is the main input --> focus the first <li>
				}
				else if ( document.activeElement == last ) {
					last.parentElement.classList.remove("highlighted_search_result");
					first.parentElement.classList.add("highlighted_search_result");
					//first.focus(); // if we're at the bottom, loop to the start
				}
				else {
					document.activeElement.parentElement.classList.remove("highlighted_search_result");
					document.activeElement.parentElement.nextElementSibling.classList.add("highlighted_search_result");
					document.activeElement.parentElement.nextElementSibling.firstElementChild.focus(); // otherwise select the next search result
				}
			}
		}

		// UP (38) arrow
		if (e.keyCode == 38) {
			if (results_available) {
				if ( document.activeElement == search_input) {
					search_input.focus(); // If we're in the input box, do nothing
				}
				else if ( document.activeElement == first) {
					search_input.focus(); // If we're at the first item, go to input box
				}
				else {
					document.activeElement.parentElement.classList.remove("highlighted_search_result");
					document.activeElement.parentElement.previousSibling.classList.add("highlighted_search_result");
					document.activeElement.parentElement.previousSibling.firstElementChild.focus(); // Otherwise, select the search result above the current active one
					navbar.classList.remove("is-fixed"); // Prevent navbar from sliding in when scrolling up in the page; can get in the way of the search bar and currently selected result
				}
			}
		}

		// Use Enter (13) to move to the first result
		if (e.keyCode == 13) {
			if (results_available && document.activeElement == search_input) {
				e.preventDefault(); // stop form from being submitted
				first.focus();
			}
		}

		// Use Backspace (8) to switch back to the search input
		if (e.keyCode == 8) {
			if (document.activeElement != search_input) {
				e.preventDefault(); // stop browser from going back in history
				search_input.focus();
			}
		}
	});

	/*--------------------------------------------------------------
	Load our json data and builds fuse.js search index
	--------------------------------------------------------------*/
	//search_form.addEventListener('focusin', function(e) {
	//	search_init(); // try to load the search index
	//});

	/*--------------------------------------------------------------
	Fetch some json without jquery
	--------------------------------------------------------------*/
	function fetch_JSON(path, callback) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					var data = JSON.parse(httpRequest.responseText);
						if (callback) callback(data);
				}
			}
		};
		httpRequest.open('GET', path);
		httpRequest.send();
	}

	/*--------------------------------------------------------------
	Load script
	based on https://stackoverflow.com/a/55451823
	--------------------------------------------------------------*/
	function load_script(url) {
		return new Promise(function(resolve, reject) {
			let script = document.createElement("script");
			script.onerror = reject;
			script.onload = resolve;
			if (document.currentScript) {
				document.currentScript.parentNode.insertBefore(script, document.currentScript);
			}
			else {
				document.head.appendChild(script)
			}
			script.src = url;
		});
	}

	/*--------------------------------------------------------------
	Load our search index, only executed once
	on first call of search box (Ctrl + /)
	--------------------------------------------------------------*/
	function search_init() {
		if (first_run) {
			load_script(window.location.origin + '/js/fixedsearch/fuse.js').then(() => {
				search_input.value = ""; // reset default value
				first_run = false; // let's never do this again
				fetch_JSON('/index.json', function(data){
					var options = { // fuse.js options; check fuse.js website for details
						shouldSort: true,
						location: 0,
						distance: 100,
						threshold: 0.4,
						minMatchCharLength: 2,
						keys: [
							'permalink',
							'title',
							'date',
							'tags'
							]
					};

					fuse = new Fuse(data, options); // build the index from the json file

					search_input.addEventListener('keyup', function(e) { // execute search as each character is typed
						search_exec(this.value);
					});
					// console.log("index.json loaded"); // DEBUG
				});
			}).catch((error) => { console.log('fixedsearch failed to load: ' + error); });
		}
	}

	/*--------------------------------------------------------------
	Using the index we loaded on Ctrl + /, run
	a search query (for "term") every time a letter is typed
	in the search box
	--------------------------------------------------------------*/
	function search_exec(term) {
		let results = fuse.search(term); // the actual query being run using fuse.js
		let search_items = ''; // our results bucket

		if (results.length === 0) { // no results based on what was typed into the input box
			results_available = false;
			search_items = '';
		} else { // build our html
			for (let item in results.slice(0,100)) { // only show first 5 results
				// console.log(results[item].item.tags.join(', '))
				search_items = search_items + '<li class="post-preview"><a href="' + results[item].item.permalink + '" tabindex="0">' +
					'<h3 class="post-subtitle">' + results[item].item.title + '</h3></a>' +
					'<p class="post-meta">' + 'Posted on ' + results[item].item.date + '<br>' + '<span class="fa fa-tag"></span>' + ' ' + results[item].item.tags.join(', ') + '</p>' +
				'<hr class="my-4" /></li>';
			}
			results_available = true;
		}

		search_results.innerHTML = search_items;
		if (results.length > 0) {
			first = search_results.firstChild.firstElementChild; // first result container — used for checking against keyboard up/down location
			last = search_results.lastChild.firstElementChild; // last result container — used for checking against keyboard up/down location
		}
	}
}();