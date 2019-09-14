const bodyParser = require('body-parser')
const port = 8080
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var os = require('os-utils');
var fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));


var porcentajeRAM = [0];
var porcentajeCPU = [0];
var totaldeprocesos = 0;
var procesosejecucion= 0;
var procesosslepping= 0;
var procesosidle = 0;
var procesoszombie = 0;
var listadoprocesos = [];
var listadoprocesoshijos = [];

	var archivo = fs.readFileSync("/home/sopes2/Desktop/cpu_201313982222","utf8");
	var lineasprocesos = archivo.split("\n");
//	totaldeprocesos = lineasprocesos.length-1;

	var valores = {};

	for(var i=0; i<lineasprocesos.length; i++){
		var aux = lineasprocesos[i];
		var ar = aux.split("&");

		if(ar.length==4){

			

			ar[ar.length-2] = trunc((((ar[ar.length-2])/1024)/1024)/1024,2);
			listadoprocesos.push(ar);
			totaldeprocesos = totaldeprocesos + 1;
			if(ar[ar.length-1] == 0){
				ar[ar.length-1] = "Ejecucion";
				procesosejecucion = procesosejecucion + 1;
			}else if(ar[ar.length-1] == 1){
				ar[ar.length-1] = "Suspendido";
				procesosslepping = procesosslepping + 1;
			}else if(ar[ar.length-1] == 1026){
				procesosidle = procesosidle + 1;
				ar[ar.length-1] = "Idle";
			}else{
				procesoszombie = procesoszombie + 1;
				ar[ar.length-1] = "Zombie";
			}
		}else{
			listadoprocesoshijos.push(ar);
		}
	}
	console.log("Procesos en ejecucion : " + procesosejecucion);
	console.log("Procesos en slepping : " + procesosslepping);

setInterval( function(){
    
	




//	var bnf = fs.readFileSync("/proc/meminfo","utf8");
	var bnf = fs.readFileSync("/home/sopes2/Desktop/memo_201313982","utf8");
	var lineas = bnf.split("\n");

	var numProcesos = 0;
	for(var i=0; i<numProcesos; i++){
		try{

		}catch(e){

		}
	}

	
	var valores = {};

	for(var i=0; i<lineas.length; i++){
		var aux = lineas[i];
		var ar = aux.split(":");
		if(ar.length!=2){
			continue;
		}

		valores[ar[0]] = ar[1].trim();
	}

	var find = ' kB';
    var re = new RegExp(find,'g');
    var tex = valores.MemTotal;
	var letra = tex.replace(re,'');
	var tex2 = valores.MemFree;
	var letra2 = tex2.replace(re,'');
            
    var porc = ((letra2-letra)/letra)*100;
    porc = 100 - (100 + porc);

    var ramtotal = trunc((letra/1000),2);
    var ramconsumida = ramtotal - trunc((letra2)/1000,2);
    var ramconsumidaporcentaje = trunc(porc,2);
	console.log("Memoria RAM Total: "+ramtotal);
	console.log("Memoria RAM Consumida: "+ramconsumida);
	console.log("Porcentaje de consumo de RAM: "+ ramconsumidaporcentaje);

    io.sockets.emit('graph', porcentajeRAM, porcentajeCPU, ramtotal, ramconsumida, ramconsumidaporcentaje, totaldeprocesos, procesosejecucion,procesosslepping,procesosidle,procesoszombie,listadoprocesos,listadoprocesoshijos);
    os.cpuUsage(function(v){
        var porCPU = trunc((v*100),2);
        console.log("% DE USO CPU : "+ porCPU);
        porcentajeCPU.push(porCPU);
        porcentajeRAM.push(ramconsumidaporcentaje);
    });

  }, 5000);

server.listen(port, () => console.log(`Example app listening on port ${port}!`));

function trunc (x, posiciones = 0) {
	var s = x.toString()
	var l = s.length
	var decimalLength = s.indexOf('.') + 1
  
	if (l - decimalLength <= posiciones){
	  return x
	}
	// Parte decimal del número
	var isNeg  = x < 0
	var decimal =  x % 1
	var entera  = isNeg ? Math.ceil(x) : Math.floor(x)
	var decimalFormated = Math.floor(
	  Math.abs(decimal) * Math.pow(10, posiciones)
	)
	
	var finalNum = entera + 
	  ((decimalFormated / Math.pow(10, posiciones))*(isNeg ? -1 : 1))
	
	return finalNum
  }
