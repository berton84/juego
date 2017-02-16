var app={
	inicio: function(){
		DIAMETRO_BOLA = 50;

		velocidadX=0;
		velocidadY=0;
		puntuacion = 0;

		//para descubrir las diemnsiones del dispositivo para saber
		//tamaño de la superficie del juego
		alto = document.documentElement.clientHeight;
		ancho = document.documentElement.clientWidth;

		//vigilancia de los sensores
		app.vigilaSensores();

		app.iniciaJuego();		

	},

	iniciaJuego: function(){

		//Arrancamos el motor de fisica(mover cosas, tener gravedad)
		function preload(){
			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.stage.backgroundColor = '#f27d0c';
			game.load.image('bola', 'assets/bola.png');
			game.load.image('objetivo', 'assets/objetivo.png');
		}

		//crea el juego
		function create(){
			//pone puntucacion
			scoreText = game.add.text(16, 16, puntuacion, { fontSize: '100px', fill: '#757676' });

			//convierte el objetivo en un sprite
			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');

			//creara de manera aleatoria dos puntos en la que aparecera la bola cada vez que se carga
			bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');

			//en el motor de fisica arcade ponga en marcha bola, que actue las leyes de la fisica ARCADE
			game.physics.arcade.enable(bola);

			//sobre el objetivo tb ley de la fisicA
			game.physics.arcade.enable(objetivo);

			//que detecte la colision
			bola.body.collideWorldBounds = true;
			//cada vez que suseda genera una señal
      		bola.body.onWorldBounds = new Phaser.Signal();
      		//manejador señal, decrementa puntuacion
      		bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
		}

		//mapea la velocidad
		function update(){
			bola.body.velocity.y = (velocidadY * 300);
			bola.body.velocity.x = (velocidadX * -300);

			//detecta el overlap del la bola con el objetivo cuado estos se crucen y lance el incrementa puntuacion
			game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
		}

		//hash
		var estados = { preload: preload, create: create, update: update };
		//aqui se crea el juego realmente
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
	},

	//baja en 1 la variable puntuacion y le dice al scoretext que cambie su texto 
	decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  	},

  	//sube en 1 la variable puntuacion y le dice al scoretext que cambie su texto 
	incrementaPuntuacion: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;
  	},


	inicioX: function(){
		return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
	},

	inicioY: function(){
		return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
	},

	numeroAleatorioHasta: function(limite){
		return Math.floor(Math.random() * limite);
	},

	vigilaSensores: function(){

		function onError(){
			console.log('onError!');
		}

		function onSuccess(datosAceleracion){
      		app.detectaAgitacion(datosAceleracion);
      		app.registraDireccion(datosAceleracion);
    	}

    	navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  	},

 	 detectaAgitacion: function(datosAceleracion){
    	var agitacionX = datosAceleracion.x > 10;
    	var agitacionY = datosAceleracion.y > 10;

    	if (agitacionX || agitacionY){
      	setTimeout(app.recomienza, 1000);
    	}
  	},

  	recomienza: function(){
    	document.location.reload(true);
  	},

  	//guarda el estado del acelerometro
  	registraDireccion: function(datosAceleracion){
    	velocidadX = datosAceleracion.x ;
    	velocidadY = datosAceleracion.y ;
  	}
	
};

if ('addEventListener' in document) {	
	document.addEventListener('deviceready', function() {	
		app.inicio();
	}, false);
}
