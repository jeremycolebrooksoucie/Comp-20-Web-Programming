function init()
{
        // When initiaing the map, default to Medford
        var init_pos = new google.maps.LatLng(42.4089325, -71.1196015);
        myOptions = {
                zoom : 14,
                center : init_pos,
                mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"),
        myOptions);
        get_location();
}

function get_location()
{
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                        myLat = pos.coords.latitude;
                        myLng = pos.coords.longitude;
                        request = new XMLHttpRequest();
                        request.open("POST",
                        "https://fathomless-anchorage-58913.herokuapp.com/sendLocation",
                        true);
                        request.setRequestHeader("Content-type",
                        "application/x-www-form-urlencoded");
                        request.onreadystatechange = function() {
                                if (request.readyState == 4 && request.status ==
                                    200) {
                                            raw = request.responseText;
                                            data = JSON.parse(raw);
                                            render_map();
                                    }
                        };
                        request.send("login=KAYE_SCHMIDT&lat=" +
                        myLat + "&lng=" + myLng);
                });
        } else {
                alert("Geolocation is not supported by your web browser.");
        }
}

function render_map()
{
        infowindow = new google.maps.InfoWindow();
        mypos = new google.maps.LatLng(myLat, myLng);
        map.panTo(mypos);
        closet_dist = 100;      // default to 100 miles

        for (i = 0; i < (data["landmarks"]).length; i++)
        {
                var lat = data["landmarks"][i]["geometry"]["coordinates"][1];
                var lng = data["landmarks"][i]["geometry"]["coordinates"][0];
                var pos = new google.maps.LatLng(lat, lng);
                marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: data["landmarks"][i]["properties"]["Details"],
                        icon: 'hist_icon.jpg'
                });
                var tmp_dist =
                haversineDistance(
                        [data["landmarks"][i]["geometry"]["coordinates"][0],
                         data["landmarks"][i]["geometry"]["coordinates"][1]],
                         [myLng, myLat], true);
                if (tmp_dist < closet_dist) {
                        closet_dist = tmp_dist;
                        closest_landmark = i;
                }
                showInfoWindow(marker, map, infowindow);
        }

        for (i = 0; i < (data["people"]).length; i++)
        {
                var lat = data["people"][i]["lat"];
                var lng = data["people"][i]["lng"];
                var pos = new google.maps.LatLng(lat, lng);
                var info = data["people"][i]["login"] + "<br/> Distance away: "
                           + haversineDistance([lng, lat], [myLng, myLat], true)
                           + " miles";
                marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: info,
                        icon: 'ppl_icon.png'
                });
                showInfoWindow(marker, map, infowindow);
        }

        cl = closest_landmark;       // done to shorten function calls below
        closest_dist =
        haversineDistance([data["landmarks"][cl]["geometry"]["coordinates"][0],
        data["landmarks"][cl]["geometry"]["coordinates"][1]], [myLng, myLat],
        true);
        my_marker = new google.maps.Marker({
                position: mypos,
                map: map,
                title: "Login: KAYE_SCHMIDT",
                icon: 'me_icon.png'
        });
        infowindow.setContent(my_marker.title);
        infowindow.open(map, my_marker);
        google.maps.event.addListener(my_marker, 'click', function() {
            infowindow.setContent("Login: KAYE_SCHMIDT <br/> Closet landmark: "
                + data["landmarks"][cl]["properties"]["Location_Name"] +
                "<br/>Distance away: " + closest_dist);
            infowindow.open(map, my_marker);
            path = new google.maps.Polyline({
                    path: [{lat: myLat, lng: myLng}, {lat: data["landmarks"][cl]["geometry"]["coordinates"][1],
                    lng: data["landmarks"][cl]["geometry"]["coordinates"][0]}],
                    geodesic: true,
                    strokeColor: '#1CAC78',
                    strokeOpacity: 1.0,
                    strokeWeight: 6
            });
            path.setMap(map);
        });
        marker.setMap(map);
}

function showInfoWindow(marker, map, infowindow)
{
    marker.addListener('click', function() {
        infowindow.setContent(marker.title);
        infowindow.open(map, this);
    });
}

// distance function copied from stackoverflow
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
  var dLon = toRad(x2);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) { d /= 1.60934 };

  return d.toFixed(3);
}
