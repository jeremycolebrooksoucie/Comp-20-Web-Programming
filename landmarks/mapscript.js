// initiates the map
function init() {
    var myLat = 0;
    var myLng = 0;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
                myLat = position.coords.latitude;
                myLng = position.coords.longitude;

                initMap(myLat, myLng);
            });
    }
    else {
        alert("Geolocation is not supported by your web browser.");
    }
}

function initMap(lat, lng) {
    var userLoc = new google.maps.LatLng(lat, lng);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: userLoc,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    var username = "DEVIN_WALTERS";

    makeAndParseRequest(lat, lng, map, username);


}

// makes request to serve for username and displays all info on map
function makeAndParseRequest(lat, lng, map, username) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://thepowerfulsunblindsme.herokuapp.com/sendLocation",
             true);
    var data = "login="+username+"&lat="+lat+"&lng="+lng;

    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText);
            landmarks = data.landmarks;
            people = data.people;

            //parse landmarks and select best, also check vs null
            var bestDistance = 999999;
            var bestPlace = {geometry   : {coordinates  : [lng, lat]}, 
                             properties : {Location_Name: "No loc found"}};
            if(landmarks) {
                landmarks.forEach(function (cur, i, arr) {
                    var d = addLandmark(cur, map, lat, lng);
                    if (d < bestDistance)
                    {
                        bestPlace = cur;
                        bestDistance = d;
                    }
                }, (map, bestPlace, bestDistance));
            }

            // parse people/check for null
            if(people) {
                people.forEach(function (cur, i, arr) {
                    addPerson(cur, map, lat, lng);
                }, map);
            }

            /* add user's icon */
            var userLoc = new google.maps.LatLng(lat, lng);

            var marker = new google.maps.Marker({
                position: userLoc,
                title: username + "<BR> Closest Location: " + 
                       bestPlace.properties.Location_Name,
                icon: new google.maps.MarkerImage(
                            "user.png",
                            new google.maps.Size(40, 40),
                            new google.maps.Point(0, 0),
                            new google.maps.Point(20, 20))
            });
            marker.setMap(map);
            // bring user icon to the front
            marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);

            var infowindow = new google.maps.InfoWindow();
            
            //listerner for click on user
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(marker.title);
                infowindow.open(map, marker);
                var line = new google.maps.Polyline({
                        path: [{lat: lat, lng: lng},
                               {lat: bestPlace.geometry.coordinates[1],
                                lng: bestPlace.geometry.coordinates[0]}],
                        strokeColor: '#FF0000',
                        strokeOpacity: 1.0,
                        strokeWeight: 3
                })
                line.setMap(map);
                
            });

            // add user start window
            var startwindow = new google.maps.InfoWindow();
            startwindow.setContent(username);
            startwindow.open(map, marker);
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    alert("server request failed");
                }
        // if not nearest location was calculated
        
    }
    xhr.send(data);

}

// adds a landmark to map if under 1 mile away from user
// returns distance of that landmark to user
function addLandmark(landmark, map, userLat, userLng)
{
    var loc = new google.maps.LatLng(landmark.geometry.coordinates[1], 
                                     landmark.geometry.coordinates[0]);
    var distance = Math.round(haversineDistance([userLng, userLat], 
                                                [loc.lng(), loc.lat()], true)
                              * 100) / 100;
    if (distance >= 1)
        return distance;
    else {


        var marker = new google.maps.Marker({
            position: loc,
            title: landmark.properties.Details,
            icon: new google.maps.MarkerImage(
                        "place.png",
                        new google.maps.Size(40, 40),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(20, 20))
        });
        marker.setMap(map);
        
        var infowindow = new google.maps.InfoWindow();
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(marker.title);
            infowindow.open(map, marker);
        });
        return distance;
    }
}

// adds a person in json format to map. Distance calculated with userLat/Lng
function addPerson(person, map, userLat, userLng)
{
    var loc = new google.maps.LatLng(person.lat, 
                                     person.lng);

    var distance = Math.round(haversineDistance([userLng, userLat], 
                                                [person.lng, person.lat], true)
                              * 100) / 100;

    var text = person.login + "<BR>Distance : " + distance + " miles";

    var marker = new google.maps.Marker({
        position: loc,
        title: text,
        icon: new google.maps.MarkerImage(
                        "otherperson.png",
                        new google.maps.Size(40, 40),
                        new google.maps.Point(0, 0),
                        new google.maps.Point(20, 20))
    });
    marker.setMap(map);
    
    var infowindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, marker);
    });
}

// calculates haversine distance between coord1 and 2, 
// coords is [lng, lat] format
// taken from http://stackoverflow.com/questions/14560999/ ...
//                     using-the-haversine-formula-in-javascript
function haversineDistance(coords1, coords2, isMiles) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

     var lon1 = coords1[0];
    var lat1 = coords1[1];

    var lon2 = coords2[0];
    var lat2 = coords2[1];

    var R = 6371; // km

    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}