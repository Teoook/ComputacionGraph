// island.js - Carga la isla con posición y escala fijas (ajustables)
(function() {
  'use strict';

  function loadIsland() {
    if (typeof scene === 'undefined' || scene === null) {
      setTimeout(loadIsland, 50);
      return;
    }
    if (typeof THREE === 'undefined' || typeof THREE.MTLLoader === 'undefined') {
      setTimeout(loadIsland, 100);
      return;
    }

    const mtlLoader = new THREE.MTLLoader();
    const basePath = './modelos/island/';
    const mtlFile = 'littleisle.mtl';

    mtlLoader.setResourcePath(basePath);
    mtlLoader.setPath(basePath);

    mtlLoader.load(mtlFile, function(materials) {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath(basePath);

      objLoader.load('littleisle.obj', function(object) {

        // --- AJUSTES MANUALES (modificá estos valores) ---
        const posX = 5;        // centro del mapa (5 es el centro de la frontera)
        const posY = -2.10;       // altura: negativo = más abajo, positivo = más arriba
        const posZ = 0;
        const scale = 0.5;       // escala: 1 = tamaño original, 0.5 = mitad, etc.
        // ------------------------------------------------

        object.position.set(posX, posY, posZ);
        object.scale.set(scale, scale, scale);

        scene.add(object);

        // Mostrar información para depurar
        const box = new THREE.Box3().setFromObject(object);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        console.log('🏝️ Isla cargada en:', object.position.toArray());
        console.log('   Tamaño:', size.toArray());
        console.log('   Centro geométrico (relativo al objeto):', center.toArray());
        console.log('   mover camara o ajustar posY/posX/posZ y recarga.');
      });
    });
  }

  window.addEventListener('load', function() {
    setTimeout(loadIsland, 100);
  });
})();