var scene    = null,
    camara   = null,
    render   = null,
    controls = null;

var cube = null;

function start() {
    window.onresize = onWindowResize;
    initScene();
    animate();
}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0d1 );

    camera = new THREE.PerspectiveCamera( 
        75,                                     // Ángulo "grabación" - De abaja -> Arriba 
        window.innerWidth / window.innerHeight, // Relación de aspecto 16:9
        0.1,                                    // Mas cerca (no renderiza) 
        1000                                    // Mas lejos (no renderiza)
    );

    // renderer = new THREE.WebGLRenderer();
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#app") });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set( 0, 1, 2 );
    controls.update();

    // Grid Creation 
    var size = 50;
    var divisions = 50;

    var gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    var axesHelper = new THREE.AxesHelper( 1 );
    scene.add( axesHelper );
}

function animate() {
    requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function getBuildingData() {

    // corregir esto

    var message = 'Ingresate los edificios: ';
    var numBuildings = parseInt(prompt(message,"3"));

    for(var i = 0; i < numBuildings; i++){

        var message2 = 'Ingresate cuantos, color(hex) y wireframe del edificio #' + (i+1);
        var datas2 = prompt(message2,"3,ff0000,false");

        var values = datas2.split(',');

        var pisos = parseInt(values[0]);
        var color = parseInt(values[1],16);
        var wireframe = (values[2] === "true");

        drawElement(pisos, color, wireframe, i);

    }

}

function drawElement(pisos, color, wireframe, index) {

    var ancho = 2;
    var alto = 1;
    var profundidad = 2;

    var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe
    });

    for(var i = 0; i < pisos; i++){

        // Piso del edificio
        var geometry = new THREE.BoxGeometry(ancho, alto, profundidad);
        var piso = new THREE.Mesh(geometry, material);

        piso.position.y = i * alto;
        piso.position.x = index * 4;

        scene.add(piso);


        // Ventanas (detalle)
        var ventanaGeo = new THREE.PlaneGeometry(0.5,0.5);
        var ventanaMat = new THREE.MeshBasicMaterial({
            color: 0x87ceeb,
            side: THREE.DoubleSide
        });

        var ventana = new THREE.Mesh(ventanaGeo, ventanaMat);

        ventana.position.y = i * alto;
        ventana.position.x = index * 4;
        ventana.position.z = 1.01;

        scene.add(ventana);

    }

}

function cleanParamsUI(datos, marker) {
    value = datos.split(marker);
    for(var i=0; i<value.length; i++){
        value[i] = parseFloat(value[i]);
    }
    return value;
}