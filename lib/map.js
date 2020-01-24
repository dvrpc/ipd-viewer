      // required variables DO NOT REMOVE
      var props, header, content, titleName, headerClass;
      var map;
      //define search groups for each layer that will be searchable
      var cntySearch = [];
      var mcdSearch = [];
      //declare boundary of region
      var oLat = 39.97, oLng = -75.16, zLevel = 9;  

      // variables to use in click/mouseover/mouseout functions
      var selected;
      var opacity_layer;
      var fillOpacityValue = .9;

      $(document).ready(function() {
      //  $("#disModal").modal("show");
      });
        
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

      $('.nav-tabs li a').click( function(e) {
          history.pushState( null, null, $(this).attr('href') );
      });

      function legendraw(element) {
        $("#EXTODModal").modal("show");
      } 

      // this is the Method Modal CalL
      function methodinfo(element) {
        $("#MethodModal").modal("show");
      } 

    // this is the Survey Modal Call
      function surveylaunch(element) {
     //   $("#SurveyModal").modal("show");
        window.open("https://docs.google.com/forms/d/1Xdi1d-1h9hN8HDO6MtqoxMwrONsLfTm4kKjc1Ui6guo/viewform?edit_requested=true");
      } 

      function myHandler(){
     //   console.log(myHandler.caller.arguments)
        EXTODdraw(myHandler.caller.arguments[0].target.offsetParent.dataset.id);
      }

      function EXTODdraw(value) {
            $('#EXTODModal').one('shown.bs.modal', function() {
            $('#EXTODTabs a[data-value="#' + value + '"]').tab('show'); }).modal('show');
      } 
      
      var DVRPC = L.geoJson(null, {
          style: {
              color: 'rgb(140,140,140)',
              weight: 3,
              fill: false,
              clickable: false
          },
          onEachFeature: function (feature, layer){
            cntySearch.push({
            name: layer.feature.properties.CO_NAME,
            source: "DVRPC",
            id: L.stamp(layer),
            bounds: layer.getBounds()
            });
          }
      });
   //   $.getJSON("https://opendata.arcgis.com/datasets/418897de5e97478eb70da54bc1912f32_1.geojson", function(data) {
      $.getJSON("data/dvrpc.js", function(data) {
            DVRPC.addData(data);
      });   

      var MCD = L.geoJson(null, {
          style: {
              color: '#939393',
              weight: 1.5,
              opacity:.85,
              fill: false,
              clickable: false
          },
          onEachFeature: function (feature, layer){
            mcdSearch.push({
            name: layer.feature.properties.MUN_NAME,
            source: "MCD",
            id: L.stamp(layer),
            bounds: layer.getBounds()
            });
          }
      });
 //     $.getJSON("https://opendata.arcgis.com/datasets/418897de5e97478eb70da54bc1912f32_2.geojson", function(data) {
      $.getJSON("data/MCD.js", function(data) {
            MCD.addData(data);
      });  

      var getParameterByName = function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
              .exec(window.location.search);
            return match ?
              decodeURIComponent(match[1].replace(/\+/g, ' '))
              : null;
      }

      currentLayer = getParameterByName("l") || "IPD_SCORE";
        var getIMDColor = function(value) {
            layer = currentLayer || "IPD_SCORE";
            var series = {
              "IPD_SCORE": {
                "breaks": [34,30,27,24,21,19,17,15,13,9],
                "colors": ['#00000','#081d58','#253494','#225ea8','#1d91c0','#41b6c4','#7fcdbb','#c7e9b4','#edf8b1','#ffffd9']
              },
              "Y_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "OA_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "F_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "RM_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "EM_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "FB_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LEP_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "D_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LI_SCORE": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              }
            }
            for (var i=0; i < series[layer]["breaks"].length; i++){
              if (value > series[layer]["breaks"][i]){
                return series[layer]["colors"][i];
              }
            }
            return "#ffffcc";
      }
      var getIMDStyle = function(feature) {
          return {
            weight: 1,
            opacity: .5,
            fillOpacity: fillOpacityValue,
            color: (feature.properties) ?getIMDColor(feature.properties[currentLayer]) :null,
            fillColor: (feature.properties) ?getIMDColor(feature.properties[currentLayer]) :null}
      };

      var IPD = L.geoJson(null, {
         style: getIMDStyle,
          onEachFeature: function (feature, layer) {
            feature.id = L.stamp(layer);
              if (feature.properties) {
             //   var mcd2 = ;
                if (feature.properties.MUN2 == " "  ){ var mcd2 = '<br><B>Municipality</B>: '+ feature.properties.MUN1 ;}
                else { var mcd2 ='<br><B>Municipalities</B>: '+ feature.properties.MUN1 + ',<br>' + feature.properties.MUN2;}
                if (feature.properties.MUN3 == " "  ){ var mcd3 = '';}
                else { var mcd3 = ',<br>' + feature.properties.MUN3;}

                layer.bindLabel( '<B>Census Tract</B>: ' + feature.properties.TRACT_NUMB  + mcd2 + mcd3 , {className: "leaflet-label" });   
                layer.on({click: identify});
                layer.on({click: populatebarchart});
                layer.on({
                  'click': function (e) {
                    selectHighlight(e.target);
                  },
                  'mouseover': function(e){
                    hover(e.target);
                  },
                  'mouseout': function(e){
                    mouseOut(e.target);
                  }
                });
              } 
          }
      });
 
      $.getJSON("https://services1.arcgis.com/LWtWv6q6BJyKidj8/arcgis/rest/services/DVRPC_IPD/FeatureServer/0/query?where=0=0&outFields=*&returnGeometry=true&outSR=4326&&f=pgeojson", function(data) {
            IPD.addData(data);
      });  

      function selectHighlight(target){
        if (selected == target._leaflet_id){
          IPD.resetStyle(target);
          target.bringToBack();
          selected = 0;
        }
        else{
          selected = target._leaflet_id;
          for (lyr in IPD._layers){
            if (IPD._layers[lyr]._leaflet_id !== selected){
              IPD.resetStyle(IPD._layers[lyr]);
            }
            else{
              target.setStyle({
                weight: 2.5,
                color: 'red',
                fillOpacity: fillOpacityValue
              })
            }
          }
          MCD.bringToFront();
          target.bringToFront();
        }
      };

      function hover(target){
        if (selected !== target._leaflet_id){
          target.setStyle({
            weight: 2.5,
            color: 'blue',
            fillOpacity: fillOpacityValue
          })
          target.bringToFront();
        }
      }

      function mouseOut(target){
        if (selected !== target._leaflet_id){
          IPD.resetStyle(target);
          target.bringToBack();
        }
      }

  //Basemap Layers
  //  var mapbox = L.tileLayer.provider('MapBox.crvanpollard.hghkafl4');
  //  var mapbox = L.tileLayer(
  //    'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
  //     attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //     });
      var CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://cartodb.com/attributions">CartoDB</a>',
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
          layers: [CartoDB_Positron, DVRPC,MCD, IPD]
      }).setView([oLat, oLng],zLevel);

      //add Layer Control to map
      var baseLayers = {
          "Satellite": Mapbox_Imagery, 
          "Street Map": CartoDB_Positron
        //  "Street Map (Dark)": mapbox
      };
      L.control.layers(baseLayers).addTo(map);

      function identify(e) {
        // alert(fillOpacityValue);

        var layer = e.target;
        var props = layer.feature.properties;
 //     console.log(layer.feature.properties.MUN1);
        var locationinfo = "<div class='location-list'>"+(props.MUN1)+", "+(props.CNTY_NAME)+" County <br><p style='font-size:16px'>Census Tract :<a href='https://factfinder.census.gov/bkmk/table/1.0/en/ACS/16_5YR/DP05/1400000US" + (props.GEOID10) + "' target='_blank' rel='noopener' class='location-list-link'> "+(props.TRACT_NUMB)+"</a></p></div>"
//      var locationinfo = "<div class='location-list'><p style='font-size:16px'>Census Tract: <a href='https://factfinder.census.gov/bkmk/table/1.0/en/ACS/16_5YR/DP05/1400000US" + (props.GEOID10) + "' target='_blank' rel='noopener' class='location-list-link'>"+(props.NAME10)+"</a></p></div>"
                   
        var score = props.IPD_SCORE 

        var tractuniverse ="<div>"+ props.U_TPopEst +" estimated total population<span class='ipd-stat-moe'>+/-  " + props.U_TPopMOE +"</span><br>"+"</div>"
 
        if (props.Y_SCORE == 4 ){ var callout_colorY = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>';}
        else if (props.Y_SCORE == 3 ){ var callout_colorY = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.Y_SCORE == 2 ){ var callout_colorY = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.Y_SCORE == 1 ){ var callout_colorY = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorY = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.OA_SCORE == 4 ){ var callout_colorOA = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.OA_SCORE == 3 ){ var callout_colorOA = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.OA_SCORE == 2 ){ var callout_colorOA = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.OA_SCORE == 1 ){ var callout_colorOA = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorOA = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.F_SCORE == 4 ){ var callout_colorF = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.F_SCORE == 3 ){ var callout_colorF = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.F_SCORE == 2 ){ var callout_colorF = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.F_SCORE == 1 ){ var callout_colorF = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorF = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.RM_SCORE == 4 ){ var callout_colorRM = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.RM_SCORE == 3 ){ var callout_colorRM = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.RM_SCORE == 2 ){ var callout_colorRM = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.RM_SCORE == 1 ){ var callout_colorRM = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorRM = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.EM_SCORE == 4 ){ var callout_colorEM = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.EM_SCORE == 3 ){ var callout_colorEM = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.EM_SCORE == 2 ){ var callout_colorEM = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.EM_SCORE == 1 ){ var callout_colorEM = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorEM = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.FB_SCORE == 4 ){ var callout_colorFB = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.FB_SCORE == 3 ){ var callout_colorFB = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.FB_SCORE == 2 ){ var callout_colorFB = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.FB_SCORE == 1 ){ var callout_colorFB = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorFB = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.LEP_SCORE == 4 ){ var callout_colorLEP = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.LEP_SCORE == 3 ){ var callout_colorLEP = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.LEP_SCORE == 2 ){ var callout_colorLEP = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.LEP_SCORE == 1 ){ var callout_colorLEP = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorLEP = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.D_SCORE == 4 ){ var callout_colorD = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.D_SCORE == 3 ){ var callout_colorD = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.D_SCORE == 2 ){ var callout_colorD = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.D_SCORE == 1 ){ var callout_colorD = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorD = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.LI_SCORE == 4 ){ var callout_colorLI = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.LI_SCORE == 3 ){ var callout_colorLI = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.LI_SCORE == 2 ){ var callout_colorLI = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.LI_SCORE == 1 ){ var callout_colorLI = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorLI = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        var tractdata =  "<div><h3 style='text-align: center;'><i aria-hidden='true' class='far fa-address-card fa-2x'></i>&nbsp;&nbsp;IPD Indicators&nbsp;&nbsp;<i class='glyphicon glyphicon-info-sign' id='sup-info-icon'data-id='IPD1' onClick='myHandler()'></i></h3></div>"
                   +"<div class='ipd-chart-info'>The information below provides the estimated percentages, Margin of Error (MOE), and IPD Score Classification of our nine indicators. Click the i icon <i class='glyphicon glyphicon-info-sign'></i> to explore more information about this indicator.</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Youth1' onClick='myHandler()'><span> Youth <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + props.Y_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.Y_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents are under 18 years old</span>"+ callout_colorY +"</div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Older1' onClick='myHandler()'><span> Older Adults <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ props.OA_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.OA_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents are 65 years or older </span>"+ callout_colorOA +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Female1' onClick='myHandler()'><span> Female <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ props.F_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.F_PCTMOE +"%</span><br><span class='ipd-stat-footer'> residents are female</span>"+ callout_colorF +"</div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Racial1' onClick='myHandler()'><span> Racial Minority <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + props.RM_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.RM_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents identify as one or more racial minority</span>"+ callout_colorRM +" </div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Ethnic1' onClick='myHandler()'><span> Ethnic Minority <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ props.EM_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.EM_PCTMOE +"%</span><br><span class='ipd-stat-footer'>  of residents identified themselves as being of Hispanic or Spanish origin. </span>"+ callout_colorEM +"</div></div>"
                    +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Foreign1' onClick='myHandler()'><span> Foreign-Born <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout' ><span class='ipd-stat'>"+ props.FB_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.FB_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents were born outside of the United States</span>"+ callout_colorFB +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='LEP1' onClick='myHandler()'><span> Limited English Proficiency <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + props.LEP_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.LEP_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents report having English proficiency below “very well”</span>"+ callout_colorLEP +" </div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Disabled1' onClick='myHandler()'><span> Disabled <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ props.D_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.D_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents with one or more physical and/or mental disabilities</span>"+ callout_colorD +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Low-Income1' onClick='myHandler()'><span > Low-Income <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ props.LI_PCTEST +"%</span><span class='ipd-stat-moe'>+/-  " + props.LI_PCTMOE +"%</span><br><span class='ipd-stat-footer'> of residents live in households with an income below 200% of the national poverty level</span>"+ callout_colorLI +"</div></div>"
                   +"</div>"
                         
        document.getElementById('location_info').innerHTML = locationinfo; 
        document.getElementById('odometer').innerHTML = score;  
        // document.getElementById('tractuniverse-data').innerHTML = tractuniverse;  
        document.getElementById('tract-data').innerHTML = tractdata;  

        $('#location_info').show();
        $('#odometer').show();
        $('#tractuniverse-data').show();
        $('#tractinfo_panel').show();

        $('#Map-layers').show();
        $('#MapButtons').show();
        $('#MapButtons-title').show();
        $('#cardclick').hide();
    };

    $('#layer-change a').on('click', function (e) {
      currentLayer = $(this).data("value");
      if (currentLayer == 'none') {
        map.removeLayer(IPD);
      } else {
        if (!map.hasLayer(IPD)) {
          map.addLayer(IPD);
        } else {
          IPD.setStyle(getIMDStyle);
          L.DomEvent.preventDefault(e);
        }
      }
    });

    $('#layer-change a').on('click', function (e) {
      currentLayer = $(this).data("value");
      if (currentLayer == 'IPD_SCORE') {
        $("#container_ipd").show('slow');
        $("#container_ipdg").hide('slow'); 
      } else {
       $("#container_ipd").hide('slow');
       $("#container_ipdg").show('slow');
      }
    });

    $('#layer-change a').on('click', function (e) {
      var selText = $(this).text();
      $(this).parents('.btn-group').find('.dropdown-toggle').html(selText +'<span class="caret"></span>');
    });

// IPD Group Histogram Chart  
    $(function () {
      var xAxisLabels  = {categories: ['0.0% to 12.4%','12.5% to 18.6%', '18.7% to 24.8%', '24.9% to 31.0%', '31.1% to 100.0%']};
      var xAxisLabels2 = {categories: ['0.0% to 4.7%','4.8% to 11.5%', '11.6% to 18.2%', '18.3% to 24.9%', '25.0% to 100.0%']};
      var xAxisLabels3 = {categories: ['0.0% to 44.6%','44.7% to 49.3%', '49.4% to 53.9%', '54.0% to 58.6%', '58.7% to 100.0%']};
      var xAxisLabels4 = {categories: ['0.0% to 0.0%','0.1% to 18.5%', '18.6% to 48.3%', '48.4% to 78.0%', '78.1% to 100.0%']};
      var xAxisLabels5 = {categories: ['0.0% to 0.0%','0.1% to 2.4%', '2.5% to 15.4%', '15.5% to 28.3%', '28.4% to 100.0%']};
      var xAxisLabels6 = {categories: ['0.0% to 0.0%','0.1% to 6.2%', '6.3% to 14.9%', '15.0% to 23.6%', '23.7% to 100.0%']};
      var xAxisLabels7 = {categories: ['0.0% to 0.0%','0.1% to 2.4%', '2.5% to 10.1%', '10.2% to 17.8%', '17.9% to 100.0%']};
      var xAxisLabels8 = {categories: ['0.0% to 4.0%','4.1% to 9.7%', '9.8% to 15.4%', '15.5% to 21.1%', '21.2% to 100.0%']};
      
      var xAxisLabels9 = {categories: ['0.0% to 0.0%','0.1% to 18.3%', '18.4% to 38.8%', '38.9% to 59.2%', '59.3% to 100.0%']};

      var chart = new Highcharts.Chart({
          chart: {
              renderTo: 'container_ipdg',
              backgroundColor: null,
              type: 'column'
          },
          title:{
              text:''
          },
          yAxis: {
              allowDecimals: false,
              title: {
                  text: 'Regional Distribution<br> of Census Tracts'
              },
              tickInterval: 100, 
              labels: {
              step: 2
              },
              min: 0,
              max: 900
          },
          colors: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
          plotOptions: {
              bar: {
                  colorByPoint: true
              }
          },
          tooltip: { enabled: false },
          legend: {
              enabled: false
          },
          credits: {
              enabled: false
          },    
          series: [{
              data: [{y:84,color:'#ffffcc'},   {y:272,color:'#a1dab4'},   {y:648,color:'#41b6c4'},   {y:277,color:'#2c7fb8'},   {y:88,color:'#253494'}]        
          }]
      });
   
      $('#layer-change li:eq(1)').click(function(){
         chart.series[0].setData([{y:84,color:'#ffffcc'},   {y:272,color:'#a1dab4'},   {y:648,color:'#41b6c4'},   {y:277,color:'#2c7fb8'},   {y:88,color:'#253494'}] );
         chart.yAxis[0].setExtremes(0,900);
         chart.update({
              tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              },   
              title: {
              text: 'Youth',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              },
              tickInterval: 100,
              xAxis: xAxisLabels
          });
      });
      
      $('#layer-change li:eq(2)').click(function() {
          chart.series[0].setData([{y:33,color:'#ffffcc'},   {y:390,color:'#a1dab4'},   {y:643,color:'#41b6c4'},   {y:219,color:'#2c7fb8'},   {y:84,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              },
              xAxis: xAxisLabels2,
              title: {
              text: 'Older Adults',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(3)').click(function() {
          chart.series[0].setData([{y:37,color:'#ffffcc'},   {y:292,color:'#a1dab4'},   {y:704,color:'#41b6c4'},   {y:280,color:'#2c7fb8'},  {y:56,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels3,
              title: {
              text: 'Female',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

       $('#layer-change li:eq(4)').click(function() {
          chart.series[0].setData([{y:2,color:'#ffffcc'},    {y:602,color:'#a1dab4'},   {y:414,color:'#41b6c4'},   {y:148,color:'#2c7fb8'},  {y:203,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels4,
              title: {
              text: 'Racial Minority',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(5)').click(function() {
          chart.series[0].setData([{y:25,color:'#ffffcc'},   {y:343,color:'#a1dab4'},   {y:810,color:'#41b6c4'},   {y:97,color:'#2c7fb8'},   {y:94,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels5,
              title: {
              text: 'Ethnic Minority',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(6)').click(function() {
          chart.series[0].setData([{y:1,color:'#ffffcc'},    {y:509,color:'#a1dab4'},   {y:566,color:'#41b6c4'},   {y:177,color:'#2c7fb8'},  {y:116,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels6,
              title: {
              text: 'Foreign-Born',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(7)').click(function() {
          chart.series[0].setData([{y:19,color:'#ffffcc'},   {y:480,color:'#a1dab4'},  {y:636,color:'#41b6c4'},  {y:114,color:'#2c7fb8'},  {y:120,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels7,
              title: {
              text: 'Limited English Proficiency',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              } 
          });
      });

      $('#layer-change li:eq(8)').click(function() {
          chart.series[0].setData([{y:21,color:'#ffffcc'},   {y:434,color:'#a1dab4'},  {y:555,color:'#41b6c4'},  {y:270,color:'#2c7fb8'},  {y:88,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels8,
              title: {
              text: 'Disabled',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              },   
          });
      });

      $('#layer-change li:eq(9)').click(function() {
          chart.series[0].setData([{y:2,color:'#ffffcc'},{y:569,color:'#a1dab4'},  {y:434,color:'#41b6c4'},  {y:203,color:'#2c7fb8'},  {y:160,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {  
              tickInterval: 100
               },
              xAxis: xAxisLabels9,
              title: {
              text: 'Low-Income',
              align: 'center',
              verticalAlign: 'bottom',
              floating: true
              }
          });
        });
      });
  
// Main IPD Chart  
      $(function () {
        var yAxisLabels = [9,35];
        var chart = new Highcharts.Chart({
          chart: {
              renderTo: 'container_ipd',
              backgroundColor: null,
              type: 'bar'
          },
          title:{
              text:''
          },
          xAxis: {
            title: {
                text: null
            },
            labels: {
             enabled:false //default is true
           },
           lineWidth: 0,
           minorGridLineWidth: 0,
           lineColor: 'transparent',
           minorTickLength: 0,
           tickLength: 0
          },
          yAxis: {
              allowDecimals: false,
              startOnTick: false,
              title: {
                  text: 'Composite Value by Census Tract'
              },
              labels: {
        enabled: true,
        distance: 25,
        formatter: function() {
          var value = this.value, string;
          if (value < 10) {
            string = 'Lower (0)'
          } else if (value < 34) {
            string = 'heavy'
          } else if (value < 100) {
            string = 'Higher (36)'
          } else string = 'critical';
          
          return string;
        }
      },
      tickPosition: 'outside',
      tickPositions: [9, 35],
              min: 9,
              max: 34
          },
          colors: [{
           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
              stops: [
                  [0, '#253494'],
                  [.25,'#2c7fb8'],
                  [.5,'#41b6c4'],
                  [.75,'#a1dab4'],
                  [1, '#ffffcc']
                  ]
              },
              
          ],
        //  colors: ["#ffffcc", "#a1dab4", "#41b6c4", "#2c7fb8", "#253494"],
          plotOptions: {
              bar: {
                  colorByPoint: true
              }
          },
          tooltip: { enabled: false },
          legend: {
              enabled: false
          },
          credits: {
              enabled: false
          }, 
          series: [{
              data: [35]        
          }]
        });

      });


      function populatebarchart(e) {
          var layer = e.target;
          var props = layer.feature.properties,

          ExistingTOD = [props.Y_SCORE,props.OA_SCORE,props.F_SCORE,props.RM_SCORE,props.EM_SCORE,props.FB_SCORE,props.LEP_SCORE,props.D_SCORE,props.LI_SCORE];
          updatebarchart(ExistingTOD);
      }

      function updatebarchart(Values) {
      var options = {
          chart: {
              renderTo: 'ipd-barchart',
              type:'bar',
              plotBackgroundColor: null,
              plotBorderWidth: 0,//null,
              plotShadow: false,
             //height:280;
              height:220,
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
              categories: [ 'Youth','Older Adults','Female','Racial Minority','Ethnic Minority','Foreign-Born','LEP','Disabled','Low-Income'],
              tickColor: 'transparent',
              lineColor: 'transparent',
              labels: {useHTML: true}
          },
          yAxis: {
              min: 0,
              max: 4,
       //       height: 230,
              height:170,
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
                 color: '#582267',
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
            position: 'bottomright',
        },
        onAdd: function (map) {
            //TODO: Probably should throw all this data in a class and just loop through it all
            var legendDiv = L.DomUtil.create('div', 'map-legend legend-control leaflet-bar');

            legendDiv.innerHTML += '<div id="legend-icon" title="Toggle Legend"><i class="glyphicon glyphicon-minus"></i><span class="legend-label" style="display:none;">&nbsp;&nbsp;Legend</span></div>';
        
            var legend_top = L.DomUtil.create('div', 'map-legend-items legend-top', legendDiv),
                legend_body = L.DomUtil.create('div', 'map-legend-items legend-body', legendDiv),
                legend_bottom = L.DomUtil.create('div', 'map-legend-items legend-bottom', legendDiv);

            legend_body.innerHTML += '<div id="legend-content">'+'<div class="ipd-legend"><img src="lib/images/ipd-legend.png" id="ipd-legend" alt="IPD Legend"/></div>'

            '</div>'
          
            legend_top.innerHTML += '<p id="legend-title-content"><b>IPD Composite Value</b></p>'

          
            legendDiv.setAttribute('data-status', 'open');

            return legendDiv;
        }
      });

      var mapLegend = new L.Control.MapLegend();
      map.addControl(mapLegend);

      // after interacting with the layer list dropdown...
      $("#layer-change").children().on('click', function(){
        console.log($(this.children).attr('data-value'));

        if ($(this.children).attr('data-value') == 'IPD_SCORE') {
          var newLayer = $(this).text();
          $("#legend-title-content").text("IPD Composite Value");
          document.getElementById("legend-content").innerHTML =
          '<div class="ipd-legend"><img src="lib/images/ipd-legend.png" id="ipd-legend" alt="IPD Legend"/></div>'
        }
        else {
          var newLayer = $(this).text();
          $("#legend-title-content").text(newLayer+" Classification");
          document.getElementById("legend-content").innerHTML =
          '<div class="legend-row"><div class="legend-item-box" id="ipd-e"></div><p class="legend-item-text">Well Above Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-d"></div><p class="legend-item-text">Above Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-c"></div><p class="legend-item-text">Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-b"></div><p class="legend-item-text">Below Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-a"></div><p class="legend-item-text">Well Below Average</p></div><br>'
        }
      });
      /*
      Leaflet.OpacityControls, a plugin for adjusting the opacity of a Leaflet map.
      (c) 2013, Jared Dominguez
      (c) 2013, LizardTech

      https://github.com/lizardtechblog/Leaflet.OpacityControls
      */

      //Create a control to increase the opacity value. This makes the image more opaque.
      L.Control.higherOpacity = L.Control.extend({
        options: {
            position: 'topright'
        },
        setOpacityLayer: function (layer) {
                opacity_layer = layer;
        },
        onAdd: function () {
            
            var higher_opacity_div = L.DomUtil.create('div', 'higher_opacity_control');

            L.DomEvent.addListener(higher_opacity_div, 'click', L.DomEvent.stopPropagation)
                .addListener(higher_opacity_div, 'click', L.DomEvent.preventDefault)
                .addListener(higher_opacity_div, 'click', function () { onClickHigherOpacity() });
            
            return higher_opacity_div;
        }
      });

      //Create a control to decrease the opacity value. This makes the image more transparent.
      L.Control.lowerOpacity = L.Control.extend({
        options: {
            position: 'topright'
        },
        setOpacityLayer: function (layer) {
                opacity_layer = layer;
        },
        onAdd: function (map) {
            
            var lower_opacity_div = L.DomUtil.create('div', 'lower_opacity_control');

            L.DomEvent.addListener(lower_opacity_div, 'click', L.DomEvent.stopPropagation)
                .addListener(lower_opacity_div, 'click', L.DomEvent.preventDefault)
                .addListener(lower_opacity_div, 'click', function () { onClickLowerOpacity() });
            
            return lower_opacity_div;
        }
      });

      //Create a jquery-ui slider with values from 0 to 100. Match the opacity value to the slider value divided by 100.
      L.Control.opacitySlider = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        setOpacityLayer: function (layer) {
                opacity_layer = layer;
        },
        onAdd: function (map) {
            var opacity_slider_div = L.DomUtil.create('div', 'opacity-slider-control');
            
            $(opacity_slider_div).slider({
              orientation: "vertical",
              range: "min",
              min: 0,
              max: 100,
              value: 70,
              step: 10,
              start: function ( event, ui) {
                //When moving the slider, disable panning.
                map.dragging.disable();
                map.once('mousedown', function (e) { 
                map.dragging.enable();
                });
              },
              slide: function (event, ui) {
                fillOpacityValue = ui.value / 100;
                var slider_value = ui.value / 100;
                opacity_layer.setStyle({
                    fillOpacity: slider_value
                })
               // alert(slider_value);
            }
        });
           $('.opacity-slider-control').css("margin-left", "18px");        
            return opacity_slider_div;
        }
      });


      function onClickHigherOpacity() {
        var opacity_value = opacity_layer.options.opacity;
        
        if (opacity_value > 1) {
            return;
        } else {
            opacity_layer.setOpacity(opacity_value + 0.2);
            //When you double-click on the control, do not zoom.
            map.doubleClickZoom.disable();
            map.once('click', function (e) { 
                map.doubleClickZoom.enable();
            });
        }

      }

      function onClickLowerOpacity() {
        var opacity_value = opacity_layer.options.opacity;
        
        if (opacity_value < 0) {
            return;
        } else {
            opacity_layer.setOpacity(opacity_value - 0.2);
            //When you double-click on the control, do not zoom.
            map.doubleClickZoom.disable();
            map.once('click', function (e) { 
                map.doubleClickZoom.enable();
            });
        }
          
      }
//------------------------------------------- //
// ------ Opacity Slider Functionality ------ //
//------------------------------------------- //

    // Opacity Slider sourced from lizardtechblog | github.com/lizardtechblog

    var opacitySlider = new L.Control.opacitySlider();
    map.addControl(opacitySlider);
    opacitySlider.setOpacityLayer(IPD);
    IPD.setStyle({
        fillOpacity: fillOpacityValue
    });
    // Prevent map dragging when slider is active //
    $('#slide').on('mouseover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.dragging.disable();
    });

    $('#slide').on('mouseout', function() {
        map.dragging.enable();
    });

    $('#slide').slider({
        reversed: false
    }).on('slide', function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.dragging.disable();
        fillOpacityValue = e.value / 100;
        var sliderVal = e.value;
        IPD.setStyle({
            fillOpacity: sliderVal / 100
        });   
    });

    $('#slide').slider({
        reversed: false
    }).on('slideStop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        map.dragging.enable();
    });

//////////////////////////////////////////////////////
//  Create search functionality using Typeahead   ////
//////////////////////////////////////////////////////
 
$("#searchbox").click(function () {
    $(this).select();
});
$("#searchbox2").click(function () {
    $(this).select();
});

// Typeahead search functionality
$(document).one("ajaxStop", function() {
    $("#loading").hide();
    //tokenize each search array using Bloodhound
    var cntyBH = new Bloodhound({
        name: "DVRPC",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: cntySearch,
        limit: 10
    });
    var mcdBH = new Bloodhound({
        name: "MCD",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: mcdSearch,
        limit: 10
    });
   //initialize 
    cntyBH.initialize();
    mcdBH.initialize();
    //activate Typeahead on Searchbox DOM element
    $("#searchbox").typeahead({
      //define options (see Typeahead documentation)
      minLength: 2,
        highlight: true,
        hint: false
    },
    {
      name: "DVRPC",
        displayKey: "name",
        source: cntyBH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>County</h5>"
        }
    },
     {
      name: "MCD",
        displayKey: "name",
        source: mcdBH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Municipality</h5>"
        }
    }
    ).on("typeahead:selected", function (obj, datum) {   //define action on selection of a search result
           if (datum.source === "DVRPC") {               //action based on result source layer
            map.fitBounds(datum.bounds);                 //zoom to selection based on poly bounds (for polygon results)
            if (map._layers[datum.id]) {                 //Apply action to selected result to fire a click event 
             map._layers[datum.id].fire("click");        // (this will fire the onClick event established for the layer and stored as a function in actions.js)
            }; 
        };
          if (datum.source === "MCD") {                  //action based on result source layer
            map.fitBounds(datum.bounds);                 //zoom to selection based on poly bounds (for polygon results)
            if (map._layers[datum.id]) {                 //Apply action to selected result to fire a click event 
             map._layers[datum.id].fire("click");        // (this will fire the onClick event established for the layer and stored as a function in actions.js)
            }; 
        };
       
    }).on("typeahead:opened", function () {
            $(".navbar-collapse.in").css("max-height", $(document).height()-$(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height()-$(".navbar-header").height());
        }).on("typeahead:closed", function () {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });
      // Typeahead search functionality
$(document).one("ajaxStop", function() {
    $("#loading").hide();
    //tokenize each search array using Bloodhound
    var cntyBH = new Bloodhound({
        name: "DVRPC",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: cntySearch,
        limit: 10
    });
    var mcdBH = new Bloodhound({
        name: "MCD",
        datumTokenizer: function (d) {
            return Bloodhound.tokenizers.whitespace(d.name);
        },
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: mcdSearch,
        limit: 10
    });
   //initialize 
    cntyBH.initialize();
    mcdBH.initialize();
    //activate Typeahead on Searchbox DOM element
    $("#searchbox2").typeahead({
      //define options (see Typeahead documentation)
      minLength: 2,
        highlight: true,
        hint: false
    },
    {
      name: "DVRPC",
        displayKey: "name",
        source: cntyBH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>County</h5>"
        }
    },
     {
      name: "MCD",
        displayKey: "name",
        source: mcdBH.ttAdapter(),
        templates: {
            header: "<h5 class='typeahead-header'>Municipality</h5>"
        }
    }
    ).on("typeahead:selected", function (obj, datum) {   //define action on selection of a search result
           if (datum.source === "DVRPC") {                       //action based on result source layer
            map.fitBounds(datum.bounds);                        //zoom to selection based on poly bounds (for polygon results)
            if (map._layers[datum.id]) {                        //Apply action to selected result to fire a click event 
             map._layers[datum.id].fire("click");                // (this will fire the onClick event established for the layer and stored as a function in actions.js)
            }; 
        };
          if (datum.source === "MCD") {                       //action based on result source layer
            map.fitBounds(datum.bounds);                        //zoom to selection based on poly bounds (for polygon results)
            if (map._layers[datum.id]) {                        //Apply action to selected result to fire a click event 
             map._layers[datum.id].fire("click");                // (this will fire the onClick event established for the layer and stored as a function in actions.js)
            }; 
        };
       
    }).on("typeahead:opened", function () {
            $(".navbar-collapse.in").css("max-height", $(document).height()-$(".navbar-header").height());
            $(".navbar-collapse.in").css("height", $(document).height()-$(".navbar-header").height());
        }).on("typeahead:closed", function () {
            $(".navbar-collapse.in").css("max-height", "");
            $(".navbar-collapse.in").css("height", "");
        });
        $(".twitter-typeahead").css("position", "static");
        $(".twitter-typeahead").css("display", "block");
    });

     $(document).one("ajaxStop", function() {
          $("#loading").hide();
            MCD.bringToFront();
            DVRPC.bringToFront();
          });
