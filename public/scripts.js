//
// Copyright (c) 2015 Giovortu
// Released under the MIT license
// Permission is hereby granted, free of charge, to any person obtaining a 
// copy of this software and associated documentation files (the 
// "Software"), to deal in the Software without restriction, including 
// without limitation the rights to use, copy, modify, merge, publish, 
// distribute, sublicense, and/or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to 
// the following conditions:
// 
// The above copyright notice and this permission notice shall be 
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

var _brightness = 4;
var _on = "on";
var _color = "ff0000";

var _brightness2 = 4;
var _on2 = "on";
var _color2 = "ff0000";

var _temperature = new Map( [
  ["1000K" , "#ff3800"],
  ["1300K" , "#ff5d00"],
  ["1500K" , "#ff6d00"],
  ["1800K" , "#ff7e00"],
  ["2000K" , "#ff8912"],
  ["2300K" , "#ff9836"],
  ["2500K" , "#ffa148"],
  ["2800K" , "#ffad5e"],
  ["3000K" , "#ffb46b"],
  ["3500K" , "#ffc987"],
  ["4000K" , "#ffd1a3"],
  ["4500K" , "#ffdbba"],
  ["5000K" , "#ffe4ce"],
  ["5500K" , "#ffece0"],
  ["6000K" , "#fff3ef"],
  ["6500K" , "#fff9fd"],
  ["7000K" , "#f5f3ff"],
  ["8000K" , "#e3e9ff"],
  ["9000K" , "#d6e1ff"],
  ["10000K" , "#ccdbff"]
]);



window.onload = function () {

  /*

  const slider = $('#temperature-slider');
  const tooltip = $('#tooltip');
  
  slider.on('change', function() {
    const value = slider.val();
    let color;
    if (value < 3000) {
      color = 'Warm White';
    } else if (value < 5000) {
      color = 'Neutral White';
    } else {
      color = 'Cool White';
    }
    console.log("kkk")
    tooltip.textContent = `Color: ${color} (${value}K)`;
  });
  $("#temperature-slider-ambi").on("change", function (event) {
    console.log("temperature-slider-ambi")
    
    var temp = $("#temperature-slider-ambi").val();
    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ temperature: temp })
    );
  });
  */



  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  /*const websocket = new WebSocket('ws://localhost:8765');

  websocket.onmessage = (event) => {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + event.data;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
  };*/

  $("#tabs").tabs( "option", "active", 0 ); 
  $("#tabs2").tabs( "option", "active", 0 ); 

  var count = 0;
  _temperature.forEach (function(value, key) {
    var optTempl = '<option style="background-color:' + value + ';" value="' +count+ '">'+key+'</span></option>';  
    $("#temp-main").append( optTempl );
    $("#temp-ambi").append( optTempl );
    count++;
  })

  $("#slider-main").slider("option", { min: 0, max: 100 });
  $("#slider-ambi").slider("option", { min: 0, max: 100 });
  $("#onoff-main").flipswitch();
  $("#onoff-ambi").flipswitch();

  $("#refresh_page").button();

  $( "#refresh_page" ).on( "click", function( event ) {
    event.preventDefault();
    window.location.reload();
  } );



  $("#temp-main").selectmenu({position: { my : "left+100 center", at: "right center" } });
  $("#temp-ambi").selectmenu({position: { my : "left+10 center", at: "right center" } });

  var clientID = "clientId" + new Date().getTime();

  var client = new Paho.Client("10.0.128.128", 9001, clientID);

  var fromStatus = false;

  client.onMessageArrived = onMessage;
  client.onConnectionLost = onConnectionLost;

  client.connect({ onSuccess: onConnect });

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) 
    {
      console.log("onConnectionLost:" + responseObject.errorMessage);
    }
    //reconnect
    client.connect({ onSuccess: onConnect });
  }

  function onConnect() {
    console.log("connection successful " + clientID);

    client.subscribe("/ufficio28/acquario/mainlight/status/+");
    client.subscribe("/ufficio28/acquario/ambilight/status/+");

    client.subscribe("/ufficio28/acquario/sensors/+");

  }

  function onMessage(message) {

    if ( message.topic.startsWith("/ufficio28/acquario/sensors") ) 
    {
      var obj = JSON.parse(message.payloadString);

      if (message.topic.endsWith("/luminosity")) {
        $("#lumGauge").val( obj.value );
        $("#lumGauge-label").html(obj.value + "lum");
        console.log( obj.value);
      }

      if (message.topic.endsWith("/temperature")) {
        $("#tempGauge").val( obj.value );
        $("#tempGauge-label").html( obj.value + "&deg;C");
        console.log( "Temperature " + obj.value);
      }

      if (message.topic.endsWith("/humidity")) {
        $("#humidityGauge").val( obj.value );
        $("#humidityGauge-label").html(obj.value + "%");
        console.log( "Humidity " + obj.value);
      }

      if (message.topic.endsWith("/watertemperature")) {
        $("#waterGauge").val( obj.value );
        $("#waterGauge-label").html(obj.value + "&deg;C");
      }

    }
    else
    if ( message.topic.startsWith("/ufficio28/acquario/mainlight/status") ) 
    {
      var obj = JSON.parse(message.payloadString);
      fromStatus = true;

      if (message.topic.endsWith("/state")) {
        $("#onoff-main").flipswitch("disable");
        $("#onoff-main").prop("checked", obj.value == "on");
        $("#onoff-main").flipswitch("refresh");
        $("#onoff-main").flipswitch("enable");
      }


      if (message.topic.endsWith("/brightness")) {
        $("#slider-main").slider("disable");
        $("#slider-main").val(obj.value);
        $("#slider-main").slider("refresh");
        $("#slider-main").slider("enable");
      }
      
      
      if (message.topic.endsWith("/temperature")) {
        var myselect = $("#temp-main")
        myselect.selectmenu("disable");
        myselect[0].selectedIndex = obj.value;
        myselect.selectmenu("refresh");
        myselect.selectmenu("enable");
      }

      if (message.topic.endsWith("/color")) {
        var view = document.getElementById("view-color-main");
        view.style.backgroundColor = "#" + obj.value;
        view.style.color = shouldBeWhite(view) ? "#ffffff" : "#000000";
        view.innerHTML = "#" + obj.value;
      }

      fromStatus = false;
    }
    else
    if ( message.topic.startsWith("/ufficio28/acquario/ambilight/status") )
    {
      fromStatus = true;

      var obj = JSON.parse(message.payloadString);

      if (message.topic.endsWith("/state")) {
        $("#onoff-ambi").flipswitch("disable");
        $("#onoff-ambi").prop("checked", obj.value == "on");
        $("#onoff-ambi").flipswitch("refresh");
        $("#onoff-ambi").flipswitch("enable");
      }

            
      if (message.topic.endsWith("/temperature")) {

          
        var myselect = $("#temp-ambi")
        myselect.selectmenu("disable");
        myselect[0].selectedIndex = obj.value;
        myselect.selectmenu("refresh");
        myselect.selectmenu("enable");
        
      }



      if (message.topic.endsWith("/brightness")) {
        $("#slider-ambi").slider("disable");
        $("#slider-ambi").val(obj.value);
        $("#slider-ambi").slider("refresh");
        $("#slider-ambi").slider("enable");
      }



      if (message.topic.endsWith("/color")) {
        var view = document.getElementById("view-color-ambi");
        view.style.backgroundColor = "#" + obj.value;
        view.style.color = shouldBeWhite(view) ? "#ffffff" : "#000000";
        view.innerHTML = "#" + obj.value;
      }

      fromStatus = false;
    }
  }

  $("#temp-main").on("change", function (event) {

    if ( fromStatus )
    return;
    var temp = $("#temp-main").prop("selectedIndex");
    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ temperature: temp })
    );
  });


  



  $("#temp-ambi").on("change", function (event) {
    if ( fromStatus )
      return;
    var temp = $("#temp-ambi").prop("selectedIndex");
    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ temperature: temp })
    );
  });


  $("#abinsula-main").on("click", function (event) {
    
    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ abinsula: true })
    );
  });

  $("#abinsula-ambi").on("click", function (event) {
    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ abinsula: true })
    );
  });


  $("#random-main").on("click", function (event) {
    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ random: true })
    );
  });

  $("#rainbow-main").on("click", function (event) {
    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ rainbow: true })
    );
  });

  $("#random-ambi").on("click", function (event) {
    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ random: true })
    );
  });

  $("#rainbow-ambi").on("click", function (event) {
    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ rainbow: true })
    );
  });

  $("#onoff-main").on("change", function (event) {
    if ( fromStatus )
    return;
    _on = $("#onoff-main").is(":checked") ? "on" : "off";

    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ state: _on })
    );
  });

  $("#slider-main").on("slidestop", function (event, ui) {
    if ( fromStatus )
    return;
    _brightness = $("#slider-main").val();

    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ brightness: _brightness })
    );
  });

  $("#onoff-ambi").on("change", function (event) {
    if ( fromStatus )
    return;
    _on2 = $("#onoff-ambi").is(":checked") ? "on" : "off";

    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ state: _on2 })
    );
  });

  $("#slider-ambi").on("slidestop", function (event, ui) {
    if ( fromStatus )
    return;
    _brightness2 = $("#slider-ambi").val();

    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ brightness: _brightness2 })
    );
  });

  function shouldBeWhite(ele) {
    var style = window.getComputedStyle(ele, null);
    var color = style.backgroundColor;
    var rgb = color.match(/[0-9]+/g).map(function (n) {
      return Number(n);
    });
    return rgb[0] + rgb[1] + rgb[2] < (255 * 3) / 2 ? true : false;
  }




  var div = document.getElementById("main");
  Beehive.Picker(div);
  div.addEventListener("click", function (e) {
    var color = Beehive.getColorCode(e.target);
    if (!color) {
      return;
    }
    var view = document.getElementById("view-color-main");
    view.style.backgroundColor = color;
    view.style.color = shouldBeWhite(e.target) ? "#ffffff" : "#000000";
    view.innerHTML = color;

    _color = color.slice(1);

    client.send(
      "/ufficio28/acquario/mainlight/command",
      JSON.stringify({ color: _color })
    );
  });

  var div2 = document.getElementById("ambient");
  Beehive.Picker(div2);
  div2.addEventListener("click", function (e) {
    var color = Beehive.getColorCode(e.target);
    if (!color) {
      return;
    }
    var view = document.getElementById("view-color-ambi");
    view.style.backgroundColor = color;
    view.style.color = shouldBeWhite(e.target) ? "#ffffff" : "#000000";
    view.innerHTML = color;

    _color2 = color.slice(1);

    client.send(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ color: _color2 })
    );
  });


  $('#tempGauge').jqxLinearGauge({
    max:60,
    min:0,
    ranges: [{ startValue: 0, endValue: 15, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
                { startValue: 15, endValue: 35, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 },
                { startValue: 35, endValue: 40, style: { fill: '#FCA76A', stroke: '#FCA76A' }, endWidth: 5, startWidth: 1},
                { startValue: 40, endValue: 60, style: { fill: '#FC6A6A', stroke: '#FC6A6A' }, endWidth: 5, startWidth: 1}],
    ticksMinor: { interval: 1, size: '5%' },
    ticksMajor: { interval: 15, size: '9%' },
    pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
    value: 30,
    colorScheme: 'scheme03',
    animationDuration: 1200
});

$('#lumGauge').jqxLinearGauge({
  max:100,
  min:0,
  ranges: [{ startValue: 0, endValue: 50, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
              { startValue: 50, endValue: 100, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 }],
  ticksMinor: { interval: 1, size: '5%' },
  ticksMajor: { interval: 15, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 30,
  colorScheme: 'scheme03',
  animationDuration: 1200
});

$('#humidityGauge').jqxLinearGauge({
  max:100,
  min:0,
  ranges: [{ startValue: 0, endValue: 50, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
              { startValue: 50, endValue: 100, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 }],
  ticksMinor: { interval: 1, size: '5%' },
  ticksMajor: { interval: 15, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 30,
  colorScheme: 'scheme03',
  animationDuration: 1200
});

$('#waterGauge').jqxLinearGauge({
  max:60,
  min:0,
  ranges: [{ startValue: 0, endValue: 15, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
  { startValue: 15, endValue: 35, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 },
  { startValue: 35, endValue: 40, style: { fill: '#FCA76A', stroke: '#FCA76A' }, endWidth: 5, startWidth: 1},
  { startValue: 40, endValue: 60, style: { fill: '#FC6A6A', stroke: '#FC6A6A' }, endWidth: 5, startWidth: 1}],
  ticksMinor: { interval: 1, size: '5%' },
  ticksMajor: { interval: 15, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 30,
  colorScheme: 'scheme03',
  animationDuration: 1200
});

$('#maintabs').jqxTabs({ theme: 'material' });



};
