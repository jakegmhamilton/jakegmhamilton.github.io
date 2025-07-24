let map;
let markers = [];

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function initMap() {
  const defaultCenter = { lat: 43.6532, lng: -79.3832 }; // Toronto
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 13
  });

  setupEventListeners();
}

function setupEventListeners() {
  // Geolocation Button
  document.getElementById("locateBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(userPos);
          map.setZoom(15);
          searchNearby(userPos);
        },
        () => alert("Geolocation failed.")
      );
    } else {
      alert("Geolocation not supported.");
    }
  });

  // Smart Search Button
  document.getElementById("searchBtn").addEventListener("click", () => {
    let input = document.getElementById("locationInput").value.trim().toLowerCase();

    // Smart fallback: search Toronto if input is just "hotdog" or similar
    const isGenericQuery = ["hotdog", "hotdogs", "sausage", "vendor"].includes(input);
    const locationToSearch = isGenericQuery ? "Toronto, ON" : input;

    if (!locationToSearch) {
      alert("Please enter a location!");
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationToSearch }, (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);
        searchNearby(location);
      } else {
        alert("No results found. Try entering a city or full address.");
      }
    });
  });
}

function searchNearby(location) {
  clearMarkers();

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: location,
      radius: 5000,
      keyword: "hotdog"
    },
    (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach(place => {
          const marker = new google.maps.Marker({
            map,
            position: place.geometry.location,
            title: place.name
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `<strong>${place.name}</strong><br>${place.vicinity}`
          });

          marker.addListener("click", () => infoWindow.open(map, marker));
          markers.push(marker);
        });

        if (results.length === 0) {
          alert("No hotdog places found nearby.");
        }
      } else {
        alert("Places search failed: " + status);
      }
    }
  );
}
