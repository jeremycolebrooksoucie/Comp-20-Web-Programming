function parse() 
{
	var request = new XMLHttpRequest();

	request.open("GET", "data.json", true);
	request.onreadystatechange = function () 
	{
		elem = document.getElementById("messages");
		if (request.readyState == 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			for (i = 0; i < data.length; i++) {
				elem.innerHTML += "<p>  <span class=\"line\"> <span class=\"message\">" + 
				                  data[i].content + "</span> <span class=\"username\">" + 
				                  data[i].username + "</span></span></p>"
			}
		} else if (request.readyState == 4 && request.status != 200) {
				document.getElementById("list").innerHTML = "<p>Something went wrong";
		}
	};

		// Step 3: Fire off the request
		request.send(null); // null means no data nec to send


}