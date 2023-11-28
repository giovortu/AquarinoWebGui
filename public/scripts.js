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

var temperatureArray = Array.from(_temperature);

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
    sendMQTT(
      "/ufficio28/acquario/ambilight/command",
      JSON.stringify({ temperature: temp })
    );
  });
  */

  /*

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
const websocket = new WebSocket('ws://localhost:8765');

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

  $("#slider-main").slider("option", { min: 0, max: 100 });
  $("#slider-ambi").slider("option", { min: 0, max: 100 });

  $("#temp-main").slider("option", { min: 0, max: 21 });
  $("#temp-main").hide();
  $("#temp-ambi").slider("option", { min: 0, max: 21 });
  $("#temp-ambi").hide();
  
  $("#onoff-main").flipswitch();
  $("#onoff-ambi").flipswitch();

  $("#refresh_page").button();

  $( "#refresh_page" ).on( "click", function( event ) {
    event.preventDefault();
    window.location.reload();
  } );


function sendMQTT( topic, payload )
{
  payload.clientID = clientID;
  client.publish( topic, JSON.stringify(payload) );
}


  var clientID = "clientId" + new Date().getTime();

  var client = new Paho.Client("10.0.128.128", 9001, clientID);


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

    client.subscribe("/ufficio28/acquario/sensors/#");
    client.subscribe("/ufficio28/acquario/gui/command");

  }

  function onMessage(message) {

    var obj = JSON.parse(message.payloadString);

    if ( obj.clientID == clientID )
    {
      console.log("SELF!", obj.clientID, clientID );
      return;
    }

    if ( message.topic.startsWith("/ufficio28/acquario/gui/command") ) 
    {
      console.log("onMessage:" + message.payloadString )
      var obj = JSON.parse(message.payloadString);
      if ( obj.what == "refresh" )
      {
        window.location.reload();
      }
    }
    else
    if ( message.topic.startsWith("/ufficio28/acquario/sensors/2548731") ) 
    {
      var obj = JSON.parse(message.payloadString);

      if (message.topic.endsWith("/luminosity")) {
        $("#lumGauge").val( obj.value );
        $("#lumGauge-label").html(obj.value + "lum");
        console.log( obj.value);
      }

      if (message.topic.endsWith("/temperature")) {
        $("#tempGauge").val( obj.value );
        $("#tempGauge-label").html( obj.value.toFixed(2) + "&deg;C");
        console.log( "Temperature " + obj.value);
      }

      if (message.topic.endsWith("/humidity")) {
        $("#humidityGauge").val( obj.value );
        $("#humidityGauge-label").html(obj.value.toFixed(2) + "%");
        console.log( "Humidity " + obj.value);
      }

      if (message.topic.endsWith("/battery_level")) {
        $("#batteryGauge").val( obj.value );
        $("#batteryGauge-label").html(obj.value.toFixed(2) + "%");
        console.log( "Battery " + obj.value);
      }

      if (message.topic.endsWith("/watertemperature")) {
        $("#waterGauge").val( obj.value );
        $("#waterGauge-label").html(obj.value.toFixed(2) + "&deg;C");
      }


    }
    else
    if ( message.topic.startsWith("/ufficio28/acquario/mainlight/status") ) 
    {

      var obj = JSON.parse(message.payloadString);

      if (message.topic.endsWith("/status")) {
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
        $("#temp-main").slider("disable");
        $("#temp-main").val(obj.value);
        $("#temp-main").slider("refresh");
        $("#temp-main-label").css("background-color", temperatureArray[ obj.value ][1]  );
        $("#temp-main").slider("enable");     
      }

      if (message.topic.endsWith("/color")) {
        var view = document.getElementById("view-color-main");
        view.style.backgroundColor = "#" + obj.value;
        view.style.color = shouldBeWhite(view) ? "#ffffff" : "#000000";
        view.innerHTML = "#" + obj.value;
      }


    }
    else
    if ( message.topic.startsWith("/ufficio28/acquario/ambilight/status") )
    {

      var obj = JSON.parse(message.payloadString);

      if (message.topic.endsWith("/status")) {
        $("#onoff-ambi").flipswitch("disable");
        $("#onoff-ambi").prop("checked", obj.value == "on");
        $("#onoff-ambi").flipswitch("refresh");
        $("#onoff-ambi").flipswitch("enable");
      }

            
      if (message.topic.endsWith("/temperature")) {
        $("#temp-ambi").slider("disable");
        $("#temp-ambi").val(obj.value);
        $("#temp-ambi").slider("refresh");
        $("#temp-ambi").slider("enable");   
        $("#temp-ambi-label").css("background-color", temperatureArray[ obj.value ][1]  );    
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

    }
  }

  $("#temp-main").on("change", function (event) {

    var temp = $("#temp-main").prop("value");

    $("#temp-main-label").html( temperatureArray[ temp][0]  );
    $("#temp-main-label").css("background-color", temperatureArray[ temp][1]  );

    sendMQTT( "/ufficio28/acquario/mainlight/command",{ temperature: temp })
  });




  $("#temp-ambi").on("slidestop", function (event, ui) {

    var temp = $("#temp-ambi").prop("value");
    
    $("#temp-ambi-label").html( _tempetemperatureArrayrature[ temp ][0] );
    $("#temp-ambi-label").css("background-color", temperatureArray[ temp][1]  );

    sendMQTT( "/ufficio28/acquario/ambilight/command",{ temperature: temp } );
  });


  $("#abinsula-main").on("slidestop", function (event, ui) {
    
    sendMQTT( "/ufficio28/acquario/mainlight/command", { abinsula: true });
  });

  $("#abinsula-ambi").on("click", function (event) {

    sendMQTT( "/ufficio28/acquario/ambilight/command", { abinsula: true } );
  });


  $("#random-main").on("click", function (event) {
    sendMQTT( "/ufficio28/acquario/mainlight/command", { random: true });
  });

  $("#rainbow-main").on("click", function (event) {
    sendMQTT( "/ufficio28/acquario/mainlight/command",{ rainbow: true });
  });

  $("#random-ambi").on("click", function (event) {
    sendMQTT( "/ufficio28/acquario/ambilight/command",{ random: true } );
  });

  $("#rainbow-ambi").on("click", function (event) {
    sendMQTT( "/ufficio28/acquario/ambilight/command",{ rainbow: true });
  });

  $("#onoff-main").on("change", function (event) {

    _on = $("#onoff-main").is(":checked") ? "on" : "off";

    sendMQTT( "/ufficio28/acquario/mainlight/command", { status: _on } );
  });

  $("#slider-main").on("slidestop", function (event, ui) {

    _brightness = $("#slider-main").val();

    sendMQTT( "/ufficio28/acquario/mainlight/command", { brightness: _brightness });
  });

  $("#onoff-ambi").on("change", function (event) {

    _on2 = $("#onoff-ambi").is(":checked") ? "on" : "off";

    sendMQTT( "/ufficio28/acquario/ambilight/command", { status: _on2 });
  });

  $("#slider-ambi").on("slidestop", function (event, ui) {

    _brightness2 = $("#slider-ambi").val();
 
    sendMQTT( "/ufficio28/acquario/ambilight/command", { brightness: _brightness2 });
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
 
    sendMQTT( "/ufficio28/acquario/mainlight/command", { color: _color } );
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

    sendMQTT( "/ufficio28/acquario/ambilight/command",{ color: _color2 } );
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
    value: 0,
    colorScheme: 'scheme03',
    animationDuration: 1200
});

$('#lumGauge').jqxLinearGauge({
  max:200,
  min:0,
  ranges: [ { startValue:   0, endValue:  50, style: { fill: '#99C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
            { startValue:  50, endValue: 100, style: { fill: '#B9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
            { startValue: 100, endValue: 150, style: { fill: '#D9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
            { startValue: 150, endValue: 200, style: { fill: '#E0F06A', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 }

          ],
  ticksMinor: { interval: 50, size: '5%' },
  ticksMajor: { interval: 100, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 0,

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
  value: 0,
  colorScheme: 'scheme03',
  animationDuration: 1200
});

/*
$('#soilGauge').jqxLinearGauge({
  max:100,
  min:0,
  ranges: [{ startValue: 0, endValue: 100, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
              { startValue: 50, endValue: 100, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 }],
  ticksMinor: { interval: 1, size: '5%' },
  ticksMajor: { interval: 15, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 0,
  colorScheme: 'scheme03',
  animationDuration: 1200
});
*/

$('#batteryGauge').jqxLinearGauge({
  max:100,
  min:0,
  ranges: [{ startValue: 0, endValue: 100, style: { fill: '#C9C9C9', stroke: '#C9C9C9' }, endWidth: 5, startWidth: 1 },
              { startValue: 50, endValue: 100, style: { fill: '#FCF06A', stroke: '#FCF06A' }, endWidth: 5, startWidth: 1 }],
  ticksMinor: { interval: 1, size: '5%' },
  ticksMajor: { interval: 15, size: '9%' },
  pointer: { size: '5%', style: { fill: '#00ff00', stroke: '#000' }, size: '7%', visible: true, offset: -12 },
  value: 0,
  colorScheme: 'scheme03',
  animationDuration: 1200
});



//$("#is_battery_charging").jqxCheckBox({ theme: 'shinyblack',width: 25, height: 25, disabled: true});


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
  value: 0,
  colorScheme: 'scheme03',
  animationDuration: 1200
});

$('#maintabs').jqxTabs({ theme: 'material' });



};
