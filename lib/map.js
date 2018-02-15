      // required variables DO NOT REMOVE
      var props, header, content, titleName, headerClass;
      var map;
      //define search groups for each layer that will be searchable
      var cntySearch = [];
      var mcdSearch = [];
      //declare boundary of region
      var oLat = 39.97, oLng = -75.16, zLevel = 9;  

      $(document).ready(function() {
      //hack to resolve layerOrder add after layers added
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
         //   e.preventDefault()
        // event.preventDefault()
        $("#EXTODModal").modal("show");
      } 
      // this is Map Legend modal
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
            name: layer.feature.properties.MCD,
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

      currentLayer = getParameterByName("l") || "NewScoreMe";
        var getIMDColor = function(value) {
            layer = currentLayer || "NewScoreMe";
            var series = {
              "NewScoreMe": {
                "breaks": [34,30,27,24,21,19,17,15,13,9],
                "colors": ['#00000','#081d58','#253494','#225ea8','#1d91c0','#41b6c4','#7fcdbb','#c7e9b4','#edf8b1','#ffffd9']
              },
              "AgeYouth_7": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "AgeOlder_7": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "SexFem_S_1": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "RaceMin_11": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "EthnMin_11": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "FornBorn_7": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LEP_StdB_1": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "Disabled_7": {
                "breaks": [4,3,2,1,0],
                "colors": ['#00000','#253494','#2c7fb8','#41b6c4','#a1dab4']
              },
              "LowInc_S_1": {
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
            opacity: .3,
            fillOpacity: .65,
            color: (feature.properties) ?getIMDColor(feature.properties[currentLayer]) :null,
            fillColor: (feature.properties) ?getIMDColor(feature.properties[currentLayer]) :null}
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
              //  layer.on({click: selecthighlight});
              //  layer.on({mouseover: hover, mouseout: resetHighlight});
              layer.on({
          'mouseover': function (e) {
            highlight(e.target);
          },
          'mouseout': function (e) {
            dehighlight(e.target);
          },
          'click': function (e) {
            selecthighlight(e.target);
          }
        });
            } 
          }
      });

      $.getJSON("data/IPD15.js", function(data) {
            IPD.addData(data);
      });  

   function highlight (layer) {
      layer.setStyle({
      weight: 2,
          color: 'red',
          opacity:.8
      });
      if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
      }
    }

    function dehighlight (layer) {

      if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
        IPD.resetStyle(layer);
      }
    }

    function selecthighlight (layer) {
      if (selected !== null) {
        var previous = selected;
      }
   //   map.fitBounds(layer.getBounds());
      selected = layer;
      if (previous) {
        dehighlight(previous);
         layer.bringToFront();
         layer.setStyle({
      weight: 2,
          color: 'blue',
          opacity:.8
      });
      }
    }

    var selected = null;
  
   /*   function hover(e) {
        var layer = e.target;
        layer.setStyle({
          weight: 2,
          color: 'red',
          opacity:.8
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
      */

      // Basemap Layers
      // var mapbox = L.tileLayer.provider('MapBox.crvanpollard.hghkafl4');
  //    var mapbox = L.tileLayer(
  //        'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY3J2YW5wb2xsYXJkIiwiYSI6Ii00ZklVS28ifQ.Ht4KwAM3ZUjo1dT2Erskgg', {
  //         attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  //        });
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
        var layer = e.target;
        var props = layer.feature.properties;

        var score = props.NewScoreMe
        var stationinfo = "<div><h3><i aria-hidden='true' class='fa fa-bar-chart'>&nbsp;&nbsp;IPD Indicators&nbsp;&nbsp;</i><sup><i class='glyphicon glyphicon-info-sign' id='info-icon' onclick='legendraw()'></i></sup></div>"
                          +"<div class='ipd-chart-info'>The information below provides tract-level IPD scores and percentages for our nine indicators. The entire set of indicators may be downloaded from our Open Data Portal for further analysis.</div>"
                          +"<div> Census Tract: <b>"+(props.NAME10)+"</b></div>"

        var existingOVinfo = "<div><b>IPD Scoring by Census Tract</b></div>"
          
        var existinginfo ="<div class='tooltip_info'>Youth<span class='tooltip_info_text'>Youth Gone Wild represent those that have lots of young kids in the house</span></div>:&nbsp;" + numeral(props.AgeYouth_P).format('0.00%') +" </div>"
                         +"<div><b>Older Adults:</b>&nbsp;" + numeral(props.AgeOlder_4).format('0.00%')  +"</div>"
                         +"<div><b>Female:</b>&nbsp; "+ numeral(props.SexFem_Per).format('0.00%') +"</div>"
                         +"<div><b>Racial Minority:</b>&nbsp; "+ numeral(props.RaceMino_3).format('0.00%') +"</div>"
                         +"<div><b>Ethnic Minority:</b>&nbsp; "+numeral(props.EthnMino_3).format('0.00%') +"</div>"
                         +"<div><b>Foreign Born:</b>&nbsp; "+ numeral(props.FornBorn_P).format('0.00%') +"</div>"
                         +"<div><b>LEP:</b>&nbsp; "+ numeral(props.LEP_PercEs).format('0.00%') +"</div>"
                         +"<div><b>Disabled:</b>&nbsp; "+ numeral(props.Disabled_P).format('0.00%')  +"</div>"
                         +"<div><b>Low-Income:</b>&nbsp; "+  numeral(props.LowInc_Per).format('0.00%') +"</div>"
                         
        document.getElementById('odometer').innerHTML = score;  
        document.getElementById('stationinfo_all').innerHTML = stationinfo;  
        document.getElementById('existingOV-data').innerHTML = existingOVinfo;  
        document.getElementById('existing-data').innerHTML = existinginfo;  

        $('#cardbikepanel').show();
        $('#cardpedpanel').show();
     //   $('#mapcard').show();
        $('#odometer').show();
        $('#Map-layers').show();
        $('#stationinfo_all').show();
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
     //    e.preventDefault();
        }
      }
    });

    $('.dropdown-menu a').on('click', function (e) {
      currentLayer = $(this).data("value");
      if (currentLayer == 'NewScoreMe') {
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
          labels: {
              formatter: function () {
                  return '<a href="' + categoryLinks[this.value] + '">' +
                      this.value + '</a>';
              }
          },  
          series: [{
              data: [34]        
          }]
        });

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
              height:280,
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
              height: 230,
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

