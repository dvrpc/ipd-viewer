      // required variables DO NOT REMOVE
      var props, header, content, titleName, headerClass;
      var map;
      //declare boundary of region
      var oLat = 39.97, oLng = -75.16, zLevel = 9;  

      $(document).ready(function() {
      //hack to resolve layerOrder add after layers added
      //  $("#disModal").modal("show");
      });

      function highlightRow(e){
          $("tr").css('background-color', 'white');
          $(this).css('background-color','rgba(0, 255, 255, 0.6)');
      }
        
      $('#mapdata-btn').click(function (e) {
        e.preventDefault()
        $('.cat-desc').hide();
        $('.btn-group a[href="#mapdata-main"]').tab('show') // Select tab by name
      });

      $('#mapchart-btn').click(function (e) {
        e.preventDefault()
        $('.cat-desc').show();
        $('.btn-group a[href="#mapchart-main"]').tab('show') // Select tab by name
      });

      $('#mapdata2-btn').click(function (e) {
        e.preventDefault()
        $('.btn-group a[href="#mapdata2-main"]').tab('show') // Select tab by name
      });

      $('#mapchart2-btn').click(function (e) {
        e.preventDefault()
        $('.btn-group a[href="#mapchart2-main"]').tab('show') // Select tab by name
      });

      $('#chart2-btn').click(function (e) {
        e.preventDefault()
        $('.btn-group a[href="#chart-station"]').tab('show') // Select tab by name
      });

      $('#chart1-btn').click(function (e) {
        e.preventDefault()
        $('.btn-group a[href="#chart-transit"]').tab('show') // Select tab by name
      });

      $('#radio1').click(function (e) {
        $('.btn-group a[href="#chart-transit"]').tab('show') // Select tab by name
      });

      $('#radio2').click(function (e) {
        $('.btn-group a[href="#chart-station"]').tab('show') // Select tab by name
      });

      $('.nav-tabs li a').click( function(e) {
          history.pushState( null, null, $(this).attr('href') );
      });

      function legendraw(element) {
         //   e.preventDefault()
        // event.preventDefault()
        $("#EXTODModal").modal("show");
      } 

      function legendraw2(element) {
         //   e.preventDefault()
        // event.preventDefault()
        $("#FTODPModal").modal("show");
      } 

      function legendraw3(element) {
         //   e.preventDefault()
        // event.preventDefault()
        $("#SATModal").modal("show");
      } 

      function legendraw4(element) {
         //   e.preventDefault()
        // event.preventDefault()
        $("#PACModal").modal("show");
      } 

      function legendraw5(element) {
         //   e.preventDefault()
        // event.preventDefault()
        $("#rateModal").modal("show");
      } 
      
        var DVRPC = L.geoJson(null, {
            style: {
                color: 'rgb(140,140,140)',
                weight: 3,
                fill: false,
                clickable: false
            }
        });
        $.getJSON("data/cnty.js", function(data) {
            DVRPC.addData(data);
        });   

        var getParameterByName = function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
                                .exec(window.location.search);
            return match ?
                   decodeURIComponent(match[1].replace(/\+/g, ' '))
                   : null;
            }

          currentLayer = getParameterByName("l") || "NewScoreMe";
          var getIMDColor = function(value) {
            layer = currentLayer || "NewScoreMe";
            var series = {
              "NewScoreMe": {
                "breaks": [23,19,17,15,9],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "AgeYouth_7": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "AgeOlder_7": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "SexFem_S_1": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "RaceMin_11": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "EthnMin_11": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "FornBorn_7": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "LEP_StdB_1": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
              "Disabled_7": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              },
                "LowInc_S_1": {
                "breaks": [4, 3, 2, 1, 0],
                "colors": ['#253494','#2c7fb8','#41b6c4','#a1dab4','#ffffcc']
              }
          }
            for (var i=0; i < series[layer]["breaks"].length; i++){
              if (value > series[layer]["breaks"][i]){
                return series[layer]["colors"][i];
              }
            }
            return "#FFFFFF";
          }

          var getIMDStyle = function(feature) {
            return {
              color: '#939393',
              weight: 1,
              opacity: 1,
              fillOpacity: .75,
              fillColor: (feature.properties) ?
                getIMDColor(feature.properties[currentLayer]) :
                null
            }
          };


        var IPD = L.geoJson(null, {
           style: getIMDStyle,
            onEachFeature: function (feature, layer) {
              feature.id = L.stamp(layer);
                 if (feature.properties) {
                      layer.bindLabel('IPD Score:&nbsp'+ feature.properties.NewScoreMe , {
                          className: 'leaflet-label'
                     });
                  layer.on({click: identify});
                  layer.on({click: populatebarchart});
                  layer.on({mouseover: hover, mouseout: resetHighlight});
              } 
            }
           });

        $.getJSON("data/IPD15.js", function(data) {
            IPD.addData(data);
        });   

        function hover(e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: 'red',
          opacity:1
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      }

      function resetHighlight(e) {
        //return layer to back of map
        if (!L.Browser.ie && !L.Browser.opera) {
          e.target.bringToBack();
        }
        IPD.resetStyle(e.target);
      }

      // Basemap Layers
      // var mapbox = L.tileLayer.provider('MapBox.crvanpollard.hghkafl4');
      var mapbox = L.tileLayer(
          'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
          attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          });
      var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
      });

      var Mapbox_Imagery = L.tileLayer(
          'https://api.mapbox.com/styles/v1/crvanpollard/cimpi6q3l00geahm71yhzxjek/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
          tileSize: 512,
          zoomOffset: -1,
          attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          });

      //create map instance
      var map = L.map("mapDIV", {
          minZoom: zLevel,
          zoomControl: false,
          layers: [CartoDB_Positron, DVRPC, IPD]
      }).setView([oLat, oLng],zLevel);


      //add Layer Control to map
      var baseLayers = {
          "Satellite": Mapbox_Imagery, 
          "Street Map": CartoDB_Positron
        //  "Street Map (Dark)": mapbox
      };
      L.control.layers(baseLayers).addTo(map);

    function identify(e) {
        var layer = e.target;
        var props = layer.feature.properties;

        var content = "<div style='margin-left: 25px;'> Census Tract: <b>"+(props.GEOID10)+"</b></div>"

        var stationinfo = "<div style='margin-left: 25px;'> Census Tract: <b>"+(props.GEOID10)+"</b></div>"
                    //     +"<div><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw3()'></i> Station Area Type: <b>"+(props.Type_1)+"</b></div>"
                    //     +"<div><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw4()'></i> Planning Area Context: <b>"+(props.LUContext)+"</b></div>"

        var existingOVinfo = "<div><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw()'></i><b>Census Tract IPD Category Scoring</b></div>"
          
        var existinginfo ="<div><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw()'></i><b <b style='font-size: 14px;'>IPD Indicators</b></div>"
                         +"<br><div><b>Youth:</b>&nbsp; "+(props.TCI_Data)+" <i>TCI Score</i></div>"
                         +"<div><b>Older Adults:</b>&nbsp;" + numeral(props.Job_Data).format('0,0') +" <i> jobs accessible within 30 minute transit ride</i></div>"
                         +"<div><b>Female:</b>&nbsp; "+ numeral(props.Int_Data).format('0,0')+" <i> residents and workers within a half-mile of the station</i></div>"
                         +"<div><b>Racial Minority:</b>&nbsp; "+(props.Car_Data)+"% <i>housing units with zero or one vehicle</i></div>"
                         +"<div><b>Ethnic Minority:</b>&nbsp; "+(props.Com_Data)+"%<i> residents who commute to work by public transportation, bicycle, or walking</i></div>"
                         +"<div><b>Foreign Born:</b>&nbsp; "+(props.Walk_data)+"</div>"

        document.getElementById('mapcard').innerHTML = content;
        document.getElementById('stationinfo_all').innerHTML = stationinfo;  
        document.getElementById('existingOV-data').innerHTML = existingOVinfo;  
        document.getElementById('existing-data').innerHTML = existinginfo;  

        $('#cardbikepanel').show();
        $('#cardpedpanel').show();
        $('#mapcard').show();
        $('#Map-layers').show();
        $('#stationinfo_all').show();
        $('#MapButtons').show();
        $('#MapButtons-title').show();
        $('#cardclick').hide();
        
        highlightRow.call(document.getElementById(L.stamp(layer)))   
    };

        $('.dropdown-menu a').on('click', function (e) {
    currentLayer = $(this).data("value");
    if (currentLayer == 'none') {
      map.removeLayer(IPD);
    } else {
      if (!map.hasLayer(IPD)) {
        map.addLayer(IPD);
      } else {
        IPD.setStyle(getIMDStyle);
    L.DomEvent.preventDefault(e);
   //    e.preventDefault();
      }
    }
  });

    function EXTODdraw(value) {
          $('#EXTODModal').one('shown.bs.modal', function() {
          $('#EXTODTabs a[data-target="#' + value + '"]').tab('show'); }).modal('show');
      } 

    function populatebarchart(e) {
        var layer = e.target;
        var props = layer.feature.properties,

        ExistingTOD = [props.AgeYouth_7,props.AgeOlder_7,props.SexFem_S_1,props.RaceMin_11,props.FornBorn_7,props.EthnMin_11,props.LEP_StdB_1,props.Disabled_7,props.LowInc_S_1];
        updatebarchart(ExistingTOD);
    }

    function updatebarchart(Values) {
    var options = {
        chart: {
            renderTo: 'existing',
            type:'bar',
            plotBackgroundColor: null,
            plotBorderWidth: 0,//null,
            plotShadow: false,
            height:230,
            spacingLeft: 10,
//            spacingRight: 60,
            backgroundColor: '#EFEFEF'
        },
   //     colors: ['#bca6c2']
   //    ,
        credits: {
            enabled: false
        },
        title: {
          //  text: 'Bicycle Volume by Month',
          text: null,
            x: -20 //center
        },
        xAxis: {
            categories: [ 'Youth','Older Adults','Female','Racial Minority','Ethnic Minority','Foreign Born','LEP','Disabled','Low-Income'],
            tickColor: 'transparent',
            lineColor: 'transparent',
            labels: {useHTML: true}
        },
        yAxis: {
            min: 0,
            max: 4,
            height: 200,
            allowDecimals: false,
         //   categories: ['A', 'B', 'C','D','E'],
            labels: {useHTML: true},
         //   gridLineColor: "red",
            tickmarkPlacement: 'on',
            title: {
                text: ''
            }
        },
        legend: {
            enabled: false
        },
  /*      credits: {
            position: {
                align: 'left',
                x: 5,
                y: -5 // position of credits
            },
            text: 'click category name for description',
            href: null
        },
 */      tooltip: {
            enabled: false
        },

        series: [{
               name:'Total',
               id: 'Values',
               data: []
            }]
    };

    var Labels = [],
    counData = [];
    for (var i = 0; i < Values.length; i++){
    counData.push({
    name: Labels[i],
    y: Values[i]})
    }
    options.series[0].data = counData;

    chart = new Highcharts.Chart(options)

    $('.highcharts-xaxis-labels text, .highcharts-xaxis-labels span').click(function () {
       // console.log(this.textContent.split(' ')[0]);
         EXTODdraw(this.textContent.split(' ')[0]);
    });
 //    console.log(bikeindata);
    }

    // Legend
    L.Control.MapLegend = L.Control.extend({
      options: {
          position: 'bottomleft',
      },
      onAdd: function (map) {
          //TODO: Probably should throw all this data in a class and just loop through it all
          var legendDiv = L.DomUtil.create('div', 'map-legend legend-control leaflet-bar');

          legendDiv.innerHTML += '<div id="legend-icon" title="Toggle Legend"><i class="glyphicon glyphicon-minus"></i><span class="legend-label" style="display:none;">&nbsp;&nbsp;Legend</span></div>';
      
          var legend_top = L.DomUtil.create('div', 'map-legend-items legend-top', legendDiv),
              legend_body = L.DomUtil.create('div', 'map-legend-items legend-body', legendDiv),
              legend_bottom = L.DomUtil.create('div', 'map-legend-items legend-bottom', legendDiv);

          legend_body.innerHTML += '<div id="legend-content" class="row">'+
          '<div class="col-xs-2 col-sm-2">'+
          '<div class="row" id="legend-row"><i class="fa fa-square ipd-e"></i></div>'+
          '<div class="row" id="legend-row"><i class="fa fa-square ipd-d"></i></div>'+
          '<div class="row" id="legend-row"><i class="fa fa-square ipd-c"></i></div>'+
          '<div class="row"id="legend-row"><i class="fa fa-square ipd-b"></i></div>'+
          '<div class="row"id="legend-row"><i class="fa fa-square ipd-a"></i></div>'+
          '</div>'+
          '<div class="col-xs-8 col-sm-8">'+
           '<div class="row" id="legend-row"><span class="nav-text">E - well above average</span></div>'+
          '<div class="row" id="legend-row"><span class="nav-text">D - above average</span></div>'+
          '<div class="row" id="legend-row"><span class="nav-text">C - average</span></div>'+
          '<div class="row" id="legend-row"><span class="nav-text">B - below average</span></div>'+
          '<div class="row" id="legend-row"><span class="nav-text">A - well below average</span></div></div>';
        
         legend_top.innerHTML += '<p><b>IPD Score Analysis</b><span id="legend-definition" class="nav-item" data-modal="#rateModal" onclick="legendraw5()"><i class="glyphicon glyphicon-info-sign"></i></span></p>'
          
         legendDiv.setAttribute('data-status', 'open');

          return legendDiv;
      }
    });

    var mapLegend = new L.Control.MapLegend();
    map.addControl(mapLegend);
    

     // Typeahead search functionality
 //   $(document).one("ajaxStop", function() {
 //       $("#loading").hide();
 //         stations.bringToFront();
 //       });

