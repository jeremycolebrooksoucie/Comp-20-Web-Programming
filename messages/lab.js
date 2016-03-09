// Jeremy Colebrook-Soucie, lab 6
function parse() 
{
	var request = new XMLHttpRequest();

	request.open("GET", "http://messagehub.herokuapp.com/messages.json", true);
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
				elem.innerHTML = "<p>Something went wrong";
		}
	};

		request.send(null); // null means no data nec to send


}