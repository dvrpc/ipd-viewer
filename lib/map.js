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
      // this is Map Legend modal
      function legendraw5(element) {
        $("#rateModal").modal("show");
      } 

      function myHandler(){
        EXTODdraw(myHandler.caller.arguments[0].target.id);
        //  alert(myHandler.caller.arguments[0].target.id)
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
            name: layer.feature.properties.NAME,
            source: "DVRPC",
            id: L.stamp(layer),
            bounds: layer.getBounds()
            });
          }
      });
      $.getJSON("data/cnty.js", function(data) {
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
      $.getJSON("data/mcd.js", function(data) {
            MCD.addData(data);
      });  

      var getParameterByName = function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
              .exec(window.location.search);
            return match ?
              decodeURIComponent(match[1].replace(/\+/g, ' '))
              : null;
      }

      currentLayer = getParameterByName("l") || "IPD_Score";
        var getIMDColor = function(value) {
            layer = currentLayer || "IPD_Score";
            var series = {
              "IPD_Score": {
                "breaks": [34,30,27,24,21,19,17,15,13,9],
                "colors": ['#00000','#081d58','#253494','#225ea8','#1d91c0','#41b6c4','#7fcdbb','#c7e9b4','#edf8b1','#ffffd9']
              },
              "Y_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "OA_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "F_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "RM_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "EM_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "FB_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LEP_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "D_Score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LI_Score": {
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
              //  layer.bindLabel('IPD Score:&nbsp'+ feature.properties.IPD_Score , {
              //          className: 'leaflet-label'
              //     });
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

      $.getJSON("data/IPD16.js", function(data) {
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

        var locationinfo = "<div class='location-list'>"+(props.MUN1)+", "+(props.CNTY_NAME)+" County <br><p style='font-size:16px'>Census Tract :<a href='https://factfinder.census.gov/bkmk/table/1.0/en/ACS/16_5YR/DP05/1400000US" + (props.GEOID10) + "' target='_blank' style='color:#ADD8E6'> "+(props.NAME10)+"</p></div>"
                         
        var score = props.IPD_Score 

        var tractuniverse ="<div> Population: " + (props.NAME10) +" total people<br>"
                          +" Population (over 5): " + (props.NAME10) +" total people over the age of 5<br>"
                          +"</div>"
       
        if (props.Y_Score == 4 ){ var callout_colorY = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>';}
        else if (props.Y_Score == 3 ){ var callout_colorY = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.Y_Score == 2 ){ var callout_colorY = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.Y_Score == 1 ){ var callout_colorY = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorY = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.OA_Score == 4 ){ var callout_colorOA = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.OA_Score == 3 ){ var callout_colorOA = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.OA_Score == 2 ){ var callout_colorOA = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.OA_Score == 1 ){ var callout_colorOA = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorOA = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.F_Score == 4 ){ var callout_colorF = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.F_Score == 3 ){ var callout_colorF = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.F_Score == 2 ){ var callout_colorF = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.F_Score == 1 ){ var callout_colorF = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorF = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.RM_Score == 4 ){ var callout_colorRM = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.RM_Score == 3 ){ var callout_colorRM = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.RM_Score == 2 ){ var callout_colorRM = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.RM_Score == 1 ){ var callout_colorRM = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorRM = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.EM_Score == 4 ){ var callout_colorEM = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.EM_Score == 3 ){ var callout_colorEM = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.EM_Score == 2 ){ var callout_colorEM = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.EM_Score == 1 ){ var callout_colorEM = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorEM = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.FB_Score == 4 ){ var callout_colorFB = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.FB_Score == 3 ){ var callout_colorFB = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.FB_Score == 2 ){ var callout_colorFB = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.FB_Score == 1 ){ var callout_colorFB = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorFB = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.LEP_Score == 4 ){ var callout_colorLEP = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.LEP_Score == 3 ){ var callout_colorLEP = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.LEP_Score == 2 ){ var callout_colorLEP = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.LEP_Score == 1 ){ var callout_colorLEP = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorLEP = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.D_Score == 4 ){ var callout_colorD = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.D_Score == 3 ){ var callout_colorD = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.D_Score == 2 ){ var callout_colorD = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.D_Score == 1 ){ var callout_colorD = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorD = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}

        if (props.LI_Score == 4 ){ var callout_colorLI = '<div class="ipd-stat-score" style="background-color:#253494;color:#fff"> well above average</div>'  ;}
        else if (props.LI_Score == 3 ){ var callout_colorLI = '<div class="ipd-stat-score" style="background-color:#2c7fb8;color:#fff"> above average</div>'  ;}
        else if (props.LI_Score == 2 ){ var callout_colorLI = '<div class="ipd-stat-score" style="background-color:#41b6c4;color:#fff"> average</div>'  ;}
        else if (props.LI_Score == 1 ){ var callout_colorLI = '<div class="ipd-stat-score" style="background-color:#a1dab4;color:#fff"> below average</div>'  ;}
        else { var callout_colorLI = '<div class="ipd-stat-score" style="background-color:#ffffcc;color:#1a2a2a;"> well below average</div>';}
             
        var tractdata =  "<div><h3><i aria-hidden='true' class='far fa-address-card fa-2x'></i>&nbsp;&nbsp;IPD Indicators&nbsp;&nbsp;<sup><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw()'></i></sup></h3></div>"
                         +"<div class='ipd-chart-info'>The information below provides tract-level IPD scores and percentages for our nine indicators. The entire set of indicators may be downloaded from our Open Data Portal for further analysis.</div>"
                         +"<div class='row'>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info' id='Youth1' onClick=myHandler() >Youth <sup><i class='glyphicon glyphicon-info-sign' id='Youth1'></i></sup></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>" + numeral(props.Y_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.Y_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents are under the age of 18</span>"+ callout_colorY +"</div></div>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info' id='Older1' onClick=myHandler()>Older Adults <sup><i class='glyphicon glyphicon-info-sign' id='Older1'></i></sup></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>"+numeral(props.OA_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.OA_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents are over the age of 65 </span>"+ callout_colorOA +"</div></div>"
                         +"</div>"
                         +"<div class='row'>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'>Female<span class='tooltip-IPD-info-text'>Percent population that are female</span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>"+numeral(props.F_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.F_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents are female</span>"+ callout_colorF +"</div></div>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'>Racial Minority<span class='tooltip-IPD-info-text'>percentage of residents self-identify as one or more of the following races: Black or African American, American Indian, Alaskan Native, Asian Indian, Japanese, Native Hawaiian, Chinese, Korean, Guamanian or Chamorro, Filipino, Vietnamese, Samoan, Other Asian, and/or Other Pacific Islander. </span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>" + numeral(props.RM_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.RM_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents self-identify as one or more of the following races</span>"+ callout_colorRM +" </div></div>"
                         +"</div>"
                         +"<div class='row'>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'>Ethnic Minority<span class='tooltip-IPD-info-text'>persons in the region who identified themselves as being of Hispanic, Latino, Spanish, Mexican, Chicano, Cuban, Puerto Rican, or Other Hispanic origin. </span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>"+numeral(props.EM_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.EM_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents identified themselves as being of Hispanic, Latino, Spanish, Mexican, Chicano, Cuban, Puerto Rican, or Other Hispanic origin. </span>"+ callout_colorEM +"</div></div>"
                          +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'>Foreign Born<span class='tooltip-IPD-info-text'>Percent population that were born outside of the United States</span></div>"
                         +"<div id='indicator-callout' ><span class='ipd-stat'>"+numeral(props.FB_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.FB_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents self-identify as born outside of the United States</span>"+ callout_colorFB +"</div></div>"
                         +"</div>"
                         +"<div class='row'>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'> Limited English Proficiency <span class='tooltip-IPD-info-text'>residents self-identify as having limited English proficiency </span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>" + numeral(props.LEP_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.LEP_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents self-identify as having limited English proficiency</span>"+ callout_colorLEP +" </div></div>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'> Disabled <span class='tooltip-IPD-info-text'>persons in the region with one or more physical and/or mental disabilities </span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>"+numeral(props.D_PctEst).format('0.0%') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.D_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents with one or more physical and/or mental disabilities</span>"+ callout_colorD +"</div></div>"
                         +"</div>"
                         +"<div class='row'>"
                         +"<div class='col-md-6'>"
                         +"<div class='tooltip-IPD-info'>Low-Income<span class='tooltip-IPD-info-text'>Percent population of residents have incomes below the poverty threshold. </span></div>"
                         +"<div id='indicator-callout'><span class='ipd-stat'>"+numeral(props.LI_PctEst).format('0.0 %') +"</span><span class='ipd-stat-moe'>+/-  " + numeral(props.LI_PctMOE).format('0.0%') +"</span><br><span class='ipd-stat-footer'> of residents with incomes below the poverty threshold</span>"+ callout_colorLI +"</div></div>"
                         +"</div>"
                         
        document.getElementById('location_info').innerHTML = locationinfo; 
        document.getElementById('odometer').innerHTML = score;  
        document.getElementById('tractuniverse-data').innerHTML = tractuniverse;  
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
        }
      }
    });

    $('.dropdown-menu a').on('click', function (e) {
      currentLayer = $(this).data("value");
      if (currentLayer == 'IPD_Score') {
        $("#container_ipd").show('slow');
        $("#container_ipdg").hide('slow'); 
      } else {
       $("#container_ipd").hide('slow');
       $("#container_ipdg").show('slow');
      }
    });

    $('.dropdown-menu a').on('click', function (e) {
      var selText = $(this).text();
      $(this).parents('.btn-group').find('.dropdown-toggle').html(selText +'<span class="caret"></span>');
    });

// IPD Group Histogram Chart  
    $(function () {
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
                  text: 'Distribution of Census Tracts'
              },
              tickInterval: 100, 
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
              data: [{y:93,color:'#ffffcc'},   {y:263,color:'#a1dab4'},   {y:640,color:'#41b6c4'},   {y:294,color:'#2c7fb8'},   {y:79,color:'#253494'}]        
          }]
      });

      $('.dropdown-menu li:eq(1)').click(function(){
         chart.series[0].setData([{y:93,color:'#ffffcc'},   {y:263,color:'#a1dab4'},   {y:640,color:'#41b6c4'},   {y:294,color:'#2c7fb8'},   {y:79,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts in this score</b>';
              }
              },   
              yAxis: {
              title: {
                  text: 'Distribution of Census Tracts'
              },    
              tickInterval: 100
              }
          });
      });
      
      $('.dropdown-menu li:eq(2)').click(function() {
          chart.series[0].setData([{y:37,color:'#ffffcc'},   {y:371,color:'#a1dab4'},   {y:673,color:'#41b6c4'},   {y:200,color:'#2c7fb8'},   {y:88,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(3)').click(function() {
          chart.series[0].setData([{y:29,color:'#ffffcc'},   {y:304,color:'#a1dab4'},   {y:703,color:'#41b6c4'},   {y:277,color:'#2c7fb8'},  {y:56,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

       $('.dropdown-menu li:eq(4)').click(function() {
          chart.series[0].setData([{y:2,color:'#ffffcc'},    {y:612,color:'#a1dab4'},   {y:402,color:'#41b6c4'},   {y:152,color:'#2c7fb8'},  {y:201,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(5)').click(function() {
          chart.series[0].setData([{y:28,color:'#ffffcc'},   {y:323,color:'#a1dab4'},   {y:827,color:'#41b6c4'},   {y:99,color:'#2c7fb8'},   {y:92,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(6)').click(function() {
          chart.series[0].setData([{y:4,color:'#ffffcc'},    {y:513,color:'#a1dab4'},   {y:553,color:'#41b6c4'},   {y:181,color:'#2c7fb8'},  {y:118,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(7)').click(function() {
          chart.series[0].setData([{y:24,color:'#ffffcc'},   {y:477,color:'#a1dab4'},  {y:629,color:'#41b6c4'},  {y:114,color:'#2c7fb8'},  {y:125,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(8)').click(function() {
          chart.series[0].setData([{y:25,color:'#ffffcc'},   {y:424,color:'#a1dab4'},  {y:574,color:'#41b6c4'},  {y:251,color:'#2c7fb8'},  {y:95,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
      });

      $('.dropdown-menu li:eq(9)').click(function() {
          chart.series[0].setData([{y:3,color:'#ffffcc'},    {y:563,color:'#a1dab4'},  {y:444,color:'#41b6c4'},  {y:199,color:'#2c7fb8'},  {y:160,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
              yAxis: {
              tickInterval: 100
              }
          });
        });
      });
  
// Main IPD Chart  
      $(function () {
            var yAxisLabels = [9, 34];
        var change = {
          10: 'Very Low',
          25: 'Very High',
          34:'super high'
            };
var yourLabels = ["Very Low",  "Very High"];
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
              tickPositioner: function() {
                    return yAxisLabels;
                },
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
     //     labels: {
    //          formatter: function () {
    //              return '<a href="' + categoryLinks[this.value] + '">' +
    //                  this.value + '</a>';
    //          }
    //      },  
          series: [{
              data: [35]        
          }]
        });

      });


      function populatebarchart(e) {
          var layer = e.target;
          var props = layer.feature.properties,

          ExistingTOD = [props.Y_Score,props.OA_Score,props.F_Score,props.RM_Score,props.FB_Score,props.EM_Score,props.LEP_Score,props.D_Score,props.LI_Score];
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
              categories: [ 'Youth','Older Adults','Female','Racial Minority','Ethnic Minority','Foreign Born','LEP','Disabled','Low-Income'],
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

            legend_body.innerHTML += '<div id="legend-content" class="row">'+
            '<div class="col-xs-2 col-sm-2">'+
            '<div class="row" id="legend-row"><i class="fa fa-square ipd-e"></i></div>'+
            '<div class="row" id="legend-row"><i class="fa fa-square ipd-d"></i></div>'+
            '<div class="row" id="legend-row"><i class="fa fa-square ipd-c"></i></div>'+
            '<div class="row"id="legend-row"><i class="fa fa-square ipd-b"></i></div>'+
            '<div class="row"id="legend-row"><i class="fa fa-square ipd-a"></i></div>'+
            '</div>'+
            '<div class="col-xs-8 col-sm-8">'+
            '<div class="row" id="legend-row"><span class="nav-text">well above average</span></div>'+
            '<div class="row" id="legend-row"><span class="nav-text">above average</span></div>'+
            '<div class="row" id="legend-row"><span class="nav-text">average</span></div>'+
            '<div class="row" id="legend-row"><span class="nav-text">below average</span></div>'+
            '<div class="row" id="legend-row"><span class="nav-text">well below average</span></div></div>';
          
           legend_top.innerHTML += '<p><b>IPD Score Analysis</b><span id="legend-definition" class="nav-item" data-modal="#rateModal" onclick="legendraw5()"><i class="glyphicon glyphicon-info-sign"></i></span></p>'
            
           legendDiv.setAttribute('data-status', 'open');

            return legendDiv;
        }
      });

      var mapLegend = new L.Control.MapLegend();
      map.addControl(mapLegend);
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
            header: "<h5 class='typeahead-header'>Municiaplity</h5>"
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
            header: "<h5 class='typeahead-header'>Municiaplity</h5>"
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


