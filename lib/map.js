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
              color: '#585858',
              weight: 3,
              fill: false,
              clickable: false
          },
          onEachFeature: function (feature, layer){
            cntySearch.push({
            name: layer.feature.properties.namelsad,
            source: "DVRPC",
            id: L.stamp(layer),
            bounds: layer.getBounds()
            });
          }
      });
   //   $.getJSON("https://opendata.arcgis.com/datasets/418897de5e97478eb70da54bc1912f32_1.geojson", function(data) {
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
            name: layer.feature.properties.namelsad,
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

      // No Data Tracts
      var NODATA = L.geoJson(null, {
          style: {
              color: 'rgb(140,140,140)',
              fillColor: 'rgb(110,110,110)',
              weight: 0,
              fill: true,
              clickable: true
          },
          onEachFeature: function (feature, layer){
            layer.bindLabel( 'No data for <B>Census Tract</B>: ' + feature.properties.namelsad   +'<br><B>Municipality</B>: '+ feature.properties.mun1 , {className: "leaflet-label" });   
            layer.on({
              'mouseover': function(e){
                hoverNO(e.target);
              },
              'mouseout': function(e){
                mouseOutNO(e.target);
              }
            });
          }
      });

      function hoverNO(target){
        if (selected !== target._leaflet_id){
          target.setStyle({
            weight: 2.5,
            color: 'blue',
            fillOpacity: fillOpacityValue
          })
          target.bringToFront();
        }
      }

      function mouseOutNO(target){
        if (selected !== target._leaflet_id){
          NODATA.resetStyle(target);
          target.bringToBack();
        }
      }

      $.getJSON("https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2020/FeatureServer/0/query?where=u_tpopest+%3C+0&outFields=*&returnGeometry=true&outSR=4326&&f=geojson", function(data) {
            NODATA.addData(data);
      });   

      var getParameterByName = function(name) {
            var match = RegExp('[?&]' + name + '=([^&]*)')
              .exec(window.location.search);
            return match ?
              decodeURIComponent(match[1].replace(/\+/g, ' '))
              : null;
      }

      currentLayer = getParameterByName("l") || "ipd_score";
        var getIMDColor = function(value) {
            layer = currentLayer || "ipd_score";
            var series = {
              "ipd_score": {
                "breaks": [34,30,27,24,21,19,17,15,13,9],
                "colors": ['#00000','#081d58','#253494','#225ea8','#1d91c0','#41b6c4','#7fcdbb','#c7e9b4','#edf8b1','#ffffd9']
              },
              "y_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "oa_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "f_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "rm_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "em_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "fb_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "lep_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "d_score": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "li_score": {
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
                if (feature.properties.mun2 == " "  ){ var mcd2 = '<br><B>Municipality</B>: '+ feature.properties.mun1 ;}
                else { var mcd2 ='<br><B>Municipalities</B>: '+ feature.properties.mun1 + ',<br>' + feature.properties.mun2;}
                if (feature.properties.mun3 == " "  ){ var mcd3 = '';}
                else { var mcd3 = ',<br>' + feature.properties.mun3;}

                layer.bindLabel( '<B>Census Tract</B>: ' + feature.properties.namelsad   + mcd2 + mcd3 , {className: "leaflet-label" });   
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

      $.getJSON("https://arcgis.dvrpc.org/portal/rest/services/Demographics/IPD_2020/FeatureServer/0/query?where=u_tpopest+%3E+0&outFields=*&returnGeometry=true&outSR=4326&&f=geojson", function(data) {
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
          layers: [CartoDB_Positron, DVRPC,MCD, NODATA, IPD]
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
        let lookupCounty = {
          '017': "Bucks",
          '029':"Chester",
          '045': "Delaware",
          '091': "Montgomery",
          '101': "Philadelphia",
          '005': "Burlington",
          '007': "Camden",
          '015': "Gloucester",
          '021': "Mercer"
        };

        let county = lookupCounty[props.countyfp20];
        var locationinfo = "<div class='location-list'>"+(props.mun1)+", "+ county +" County <br><p style='font-size:16px'>Census Tract :<a href='https://data.census.gov/cedsci/table?g=1400000US" + (props.geoid20) + "&hidePreview=true&tid=ACSDP5Y2020.DP05&table=DP05' target='_blank' rel='noopener' class='location-list-link'> "+(props.namelsad)+"</a></p></div>"
                   
        var score = props.ipd_score 

        var tractuniverse ="<div>"+ props.u_tpopest +" estimated total population<span class='ipd-stat-moe'>+/-  " + props.u_tpopmoe +"</span><br>"+"</div>"
 
        if (props.y_score == 4 ){ var callout_colorY = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>';}
        else if (props.y_score == 3 ){ var callout_colorY = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.y_score == 2 ){ var callout_colorY = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.y_score == 1 ){ var callout_colorY = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorY = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.oa_score == 4 ){ var callout_colorOA = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.oa_score == 3 ){ var callout_colorOA = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.oa_score == 2 ){ var callout_colorOA = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.oa_score == 1 ){ var callout_colorOA = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorOA = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.f_score == 4 ){ var callout_colorF = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.f_score == 3 ){ var callout_colorF = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.f_score == 2 ){ var callout_colorF = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.f_score == 1 ){ var callout_colorF = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorF = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.rm_score == 4 ){ var callout_colorRM = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.rm_score == 3 ){ var callout_colorRM = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.rm_score == 2 ){ var callout_colorRM = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.rm_score == 1 ){ var callout_colorRM = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorRM = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.em_score == 4 ){ var callout_colorEM = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.em_score == 3 ){ var callout_colorEM = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.em_score == 2 ){ var callout_colorEM = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.em_score == 1 ){ var callout_colorEM = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorEM = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.fb_score == 4 ){ var callout_colorFB = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.fb_score == 3 ){ var callout_colorFB = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.fb_score == 2 ){ var callout_colorFB = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.fb_score == 1 ){ var callout_colorFB = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorFB = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.lep_score == 4 ){ var callout_colorLEP = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.lep_score == 3 ){ var callout_colorLEP = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.lep_score == 2 ){ var callout_colorLEP = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.lep_score == 1 ){ var callout_colorLEP = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorLEP = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.d_score == 4 ){ var callout_colorD = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.d_score == 3 ){ var callout_colorD = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.d_score == 2 ){ var callout_colorD = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.d_score == 1 ){ var callout_colorD = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorD = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        if (props.li_score== 4 ){ var callout_colorLI = '<div class="ipd-stat-score">well above average<div style="background-color:#253494;color:#fff"></div></div>'  ;}
        else if (props.li_score== 3 ){ var callout_colorLI = '<div class="ipd-stat-score">above average<div style="background-color:#2c7fb8;color:#fff"></div></div>'  ;}
        else if (props.li_score== 2 ){ var callout_colorLI = '<div class="ipd-stat-score">average<div style="background-color:#41b6c4;color:#fff"></div></div>'  ;}
        else if (props.li_score== 1 ){ var callout_colorLI = '<div class="ipd-stat-score">below average<div style="background-color:#a1dab4;color:#fff"></div></div>'  ;}
        else { var callout_colorLI = '<div class="ipd-stat-score">well below average<div style="background-color:#ffffcc;color:#1a2a2a;"></div></div>';}

        var tractdata =  "<div><h3 style='text-align: center;'><i aria-hidden='true' class='far fa-address-card fa-2x'></i>&nbsp;&nbsp;IPD Indicators&nbsp;&nbsp;<i class='glyphicon glyphicon-info-sign' id='sup-info-icon'data-id='IPD1' onClick='myHandler()'></i></h3></div>"
                   +"<div class='ipd-chart-info'>The information below provides the estimated percentages, Margin of Error (MOE), and IPD Score Classification of our nine indicators. Click the i icon <i class='glyphicon glyphicon-info-sign'></i> to explore more information about this indicator.</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Youth1' onClick='myHandler()'><span> Youth <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + numeral(props.y_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.y_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents are under 18 years old</span>"+ callout_colorY +"</div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Older1' onClick='myHandler()'><span> Older Adults <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ numeral(props.oa_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.oa_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents are 65 years or older </span>"+ callout_colorOA +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Female1' onClick='myHandler()'><span> Female <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ numeral(props.f_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.f_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> residents are female</span>"+ callout_colorF +"</div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Racial1' onClick='myHandler()'><span> Racial Minority <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + numeral(props.rm_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.rm_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents identify as one or more racial minority</span>"+ callout_colorRM +" </div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Ethnic1' onClick='myHandler()'><span> Ethnic Minority <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ numeral(props.em_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.em_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'>  of residents identified themselves as being of Hispanic or Spanish origin. </span>"+ callout_colorEM +"</div></div>"
                    +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Foreign1' onClick='myHandler()'><span> Foreign-Born <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator</span></div>"
                   +"<div class='indicator-callout' ><span class='ipd-stat'>"+ numeral(props.fb_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.fb_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents were born outside of the United States</span>"+ callout_colorFB +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='LEP1' onClick='myHandler()'><span> Limited English Proficiency <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>" + numeral(props.lep_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.lep_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents report having English proficiency below “very well”</span>"+ callout_colorLEP +" </div></div>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info-top' data-id='Disabled1' onClick='myHandler()'><span> Disabled <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-top-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ numeral(props.d_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.d_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents with one or more physical and/or mental disabilities</span>"+ callout_colorD +"</div></div>"
                   +"</div>"
                   +"<div class='row'>"
                   +"<div class='col-md-6'>"
                   +"<div class='tooltip-IPD-info' data-id='Low-Income1' onClick='myHandler()'><span > Low-Income <i class='glyphicon glyphicon-info-sign' id='sup-info-icon'></i></span><span class='tooltip-IPD-info-text'>Learn more about this indicator </span></div>"
                   +"<div class='indicator-callout'><span class='ipd-stat'>"+ numeral(props.li_pctest).format('0,0.0') +"%</span><span class='ipd-stat-moe'>+/-  " + numeral(props.li_pctmoe).format('0,0.0') +"%</span><br><span class='ipd-stat-footer'> of residents live in households with an income below 200% of the national poverty level</span>"+ callout_colorLI +"</div></div>"
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
      if (currentLayer == 'ipd_score') {
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
      //Youth
      var xAxisLabels  = {categories: ['0.0% to 11.3%','11.4% to 17.9%', '18.0% to 24.4%', '24.5% to 31.1%', '31.2% to 100.0%']};
      //Older Adults
      var xAxisLabels2 = {categories: ['0.0% to 4.9%','5.0% to 12.5%', '12.6% to 20.1%', '20.2% to 27.7%', '27.8% to 100.0%']};
      //Female
      var xAxisLabels3 = {categories: ['0.0% to 45.3%','45.4% to 49.6%', '49.7% to 53.9%', '54.0% to 58.2%', '58.3% to 100.0%']};
      //RM
      var xAxisLabels4 = {categories: ['0.0% to 0.1%','0.2% to 20.7%', '20.8% to 49.7%', '49.8% to 78.8%', '78.9% to 100.0%']};
      //EM
      var xAxisLabels5 = {categories: ['0.0% to 0.1%','0.2% to 3.0%', '3.1% to 16.5%', '16.6% to 29.9%', '30.0% to 100.0%']};
      //FB
      var xAxisLabels6 = {categories: ['0.0% to 0.1%','0.2% to 6.9%', '7.0% to 16.1%', '16.2% to 25.3%', '25.4% to 100.0%']};
      //LEP
      var xAxisLabels7 = {categories: ['0.0% to 0.1%','0.2% to 2.5%', '2.6% to 10.4%', '10.5% to 18.3%', '18.4% to 100.0%']};
      //Disabled
      var xAxisLabels8 = {categories: ['0.0% to 3.6%','3.7% to 9.8%', '9.9% to 15.8%', '15.9% to 22.0%', '22.1% to 100.0%']};
      //Low Income
      var xAxisLabels9 = {categories: ['0.0% to 0.1%','0.2% to 16.0%', '16.1% to 35.2%', '35.3% to 54.4%', '54.5% to 100.0%']};

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
                  text: 'Number of Census Tracts'
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
         chart.series[0].setData([{y:96,color:'#ffffcc'},   {y:270,color:'#a1dab4'},   {y:642,color:'#41b6c4'},   {y:268,color:'#2c7fb8'},   {y:92,color:'#253494'}] );
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
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              },
              tickInterval: 100,
              xAxis: xAxisLabels
          });
      });
      
      $('#layer-change li:eq(2)').click(function() {
          chart.series[0].setData([{y:36,color:'#ffffcc'},   {y:383,color:'#a1dab4'},   {y:623,color:'#41b6c4'},   {y:243,color:'#2c7fb8'},   {y:83,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
              },
              xAxis: xAxisLabels2,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(3)').click(function() {
          chart.series[0].setData([{y:44,color:'#ffffcc'},   {y:265,color:'#a1dab4'},   {y:715,color:'#41b6c4'},   {y:291,color:'#2c7fb8'},  {y:53,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels3,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

       $('#layer-change li:eq(4)').click(function() {
          chart.series[0].setData([{y:1,color:'#ffffcc'},    {y:611,color:'#a1dab4'},   {y:393,color:'#41b6c4'},   {y:177,color:'#2c7fb8'},  {y:186,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels4,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(5)').click(function() {
          chart.series[0].setData([{y:16,color:'#ffffcc'},   {y:393,color:'#a1dab4'},   {y:759,color:'#41b6c4'},   {y:100,color:'#2c7fb8'},   {y:100,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels5,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(6)').click(function() {
          chart.series[0].setData([{y:2,color:'#ffffcc'},    {y:512,color:'#a1dab4'},   {y:568,color:'#41b6c4'},   {y:167,color:'#2c7fb8'},  {y:119,color:'#253494'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels6,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              }
          });
      });

      $('#layer-change li:eq(7)').click(function() {
          chart.series[0].setData([{y:28,color:'#ffffcc'},   {y:459,color:'#a1dab4'},  {y:647,color:'#41b6c4'},  {y:118,color:'#2c7fb8'},  {y:116,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels7,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              } 
          });
      });

      $('#layer-change li:eq(8)').click(function() {
          chart.series[0].setData([{y:27,color:'#ffffcc'},   {y:451,color:'#a1dab4'},  {y:527,color:'#41b6c4'},  {y:253,color:'#2c7fb8'},  {y:110,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {
              tickInterval: 100
               },
              xAxis: xAxisLabels8,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
              verticalAlign: 'bottom',
              floating: true
              },   
          });
      });

      $('#layer-change li:eq(9)').click(function() {
          chart.series[0].setData([{y:2,color:'#ffffcc'},{y:578,color:'#a1dab4'},  {y:428,color:'#41b6c4'},  {y:202,color:'#2c7fb8'},  {y:158,color:'#253594'}] );
          chart.yAxis[0].setExtremes(0,900);
          chart.update({
             tooltip: {
                  enabled: true,
              formatter: function () {
              return 'There are <b>' + this.y +
                  '</b> census tracts with this score</b>';
              }
              }, 
              yAxis: {  
              tickInterval: 100
               },
              xAxis: xAxisLabels9,
              title: {
              text: 'Percent of Population',
              y: 23,
              align: 'center',
              style: {
                fontSize: '12px'
              },
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

          ExistingTOD = [props.y_score,props.oa_score,props.f_score,props.rm_score,props.em_score,props.fb_score,props.lep_score,props.d_score,props.li_score];
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

            legend_body.innerHTML += '<div id="legend-content">'+'<div class="ipd-legend"><img src="lib/images/ipd-legend.png" id="ipd-legend" alt="IPD Legend"/></br><div class="legend-row"><div class="legend-item-box" id="ipd-f"></div><p class="legend-item-text">No Data</p></div></div>'

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

        if ($(this.children).attr('data-value') == 'ipd_score') {
          var newLayer = $(this).text();
          $("#legend-title-content").text("IPD Composite Value");
          document.getElementById("legend-content").innerHTML =
          '<div class="ipd-legend"><img src="lib/images/ipd-legend.png" id="ipd-legend" alt="IPD Legend"/></br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-f"></div><p class="legend-item-text">No Data</p></div>'
        }
        else {
          var newLayer = $(this).text();
          $("#legend-title-content").text(newLayer+" Classification");
          document.getElementById("legend-content").innerHTML =
          '<div class="legend-row"><div class="legend-item-box" id="ipd-e"></div><p class="legend-item-text">Well Above Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-d"></div><p class="legend-item-text">Above Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-c"></div><p class="legend-item-text">Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-b"></div><p class="legend-item-text">Below Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-a"></div><p class="legend-item-text">Well Below Average</p></div><br>'+
          '<div class="legend-row"><div class="legend-item-box" id="ipd-f"></div><p class="legend-item-text">No Data</p></div><br>'
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
