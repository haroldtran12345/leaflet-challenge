var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";


d3.json(URL).then(function (data) {
    createFeatures(data.features);
});

  function createFeatures(earthquakeData) {
  
    function onEachFeature(feature, marker) {
        marker.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Depthe Reached: ${feature.geometry.coordinates[2]}</p>`);
    }

    function pointToLayer(feature,latlng){
        var color = feature.geometry.coordinates[2]
        if (color < 10){
          fill="yellowgreen"
        } else if (color< 15){
          fill="yellow"
        } else if (color< 25){
          fill="gold"
        }else if (color< 35){
          fill="orange"
        }else if (color< 60){
          fill="darkorange"
        }else if (color< 80){
          fill="orangered"
        }else if (color< 100){
          fill="red"
        }else if (color<135){
          fill="firebrick"
        }else {
            fill="maroon"
        }
        
        var MarkerOptions = {
          radius: feature.properties.mag*10,
          fillColor: fill,
          weight: .2,
          fillOpacity: 0.65
        };
        return L.circleMarker(latlng, MarkerOptions)
    }

  
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer:pointToLayer,
        onEachFeature: onEachFeature
    });
  
    createMap(earthquakes);

    L.geoJSON(someGeojsonFeature, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, MarkerOptions);
        }
    }).addTo(myMap);
  }

  function createMap(earthquakes) {

    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    var baseMaps = {
      "Street Map": streetmap,
      "Topographic Map": topo
    };
  
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    var myMap = L.map("map", {
      center: [39.8283, -98.5795],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
    L.geoJSON({
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, MarkerOptions);
        }
    }).addTo(myMap);

    L.control({position: 'bottomright'}).addTo(myMap)
  }