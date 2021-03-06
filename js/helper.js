$( document ).ready(function() {
	//kickoff map logic
	// var activeTab = $('.election-navigation-a').hasClass('active');
  // $.ajax("php/classify.php?active="+activeTab.geography, {
  //     success: function(results){      
  //     classifyData(results);
  //   }, 
  //   error: function(){
  //     console.log('error');
  //   }
  // });
  // document.getElementById("spanDate").innerHTML = today.getMonth()+1 + "/" + today.getDate()+ "/" + today.getFullYear();
    
   initialize();
    $('.mapboxgl-ctrl-top-right, #legend').affix({
      offset: {
      top: 210
      }
    })
   //mousemove is too slow, need to create a new layer at street level for mouseover
  map.on('click', function (e) {
       // console.log(e.point)
       var features = map.queryRenderedFeatures(e.point,{ layers: layersArray }); //queryRenderedFeatures returns an array
       // var feature = features[0];
       var feature = (features.length) ? features[0] : '';
       // console.log(feature.properties);
       removeLayers('pushpin');
       showResults(activeTab, feature.properties);
       mapResults(feature); 
       
  });


  //show pointer cursor
   map.on('mousemove', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: layersArray });
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
   //show grab cursor
   map.on('dragstart', function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: layersArray });
    map.getCanvas().style.cursor = (features.length) ? 'grab' : '';
  });

   map.on('zoom', function() {
    if( activeTab.geography == 'cty' ){
      if (map.getZoom() > zoomThreshold) {
          popLegendEl.style.display = 'none';
          pctLegendEl.style.display = 'block';
      } else {
          popLegendEl.style.display = 'block';
          pctLegendEl.style.display = 'none';
      }
     }
});

   $('#search').click(function(e){
      e.preventDefault();
      geoCodeAddress(geocoder);
    });

    // enter key event
    $("#address").bind("keypress", {},  keypressInBox);

    $('#home').on('click', function(){
    	window.open("http://www.gis.leg.mn")
    })

    $('.election-navigation-a').on('click', function(e){
    	e.preventDefault();
      //remove previous layers
      document.getElementById('precinct-results').innerHTML = "";
      map.removeLayer("2012results-"+ activeTab.geography);
      map.removeLayer("2012results-"+ activeTab.geography+"-hover");
      spliceArray("2012results-"+ activeTab.geography);
      spliceArray("2012results-"+ activeTab.geography+"-hover");
      map.setLayoutProperty(activeTab.geography + '-symbols', 'visibility', 'none');
      map.setLayoutProperty(activeTab.geography + '-lines', 'visibility', 'none');
      //remove any vtd selection
      map.setFilter("2012results-vtd", ['all', ['==', 'UNIT', 'vtd'], ["!=", "VTD",'any']]);
      map.setFilter("2012results-vtd-hover", ['all', ['==', 'UNIT', 'vtd'], ["==", "VTD",'all']]);

    	$('.election-navigation-a').removeClass('active');
      
      //add new selections
    	$(this).addClass('active');
    	activeTab.selection = $(this).data('district');
      activeTab.geography = $(this).data('geography');
      activeTab.name = $(this).data('name');
    	changeData(activeTab);
    })



 });