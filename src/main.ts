import './style.css'
import *  as THREE from 'three';
import { WebGL, OrbitControls } from 'three/examples/jsm/Addons.js';

const GROUND_LABEL = 'Ground';

const createStage = () => {

  const scene = new THREE.Scene();

  let _camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  let _pause = false;
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  // const cube = new THREE.Mesh(geometry, material );
  // scene.add(cube);
  
  _camera.position.set(10, 15, -10);

  new OrbitControls( _camera, document.body );

  const mousePosition = new THREE.Vector2();
  const rayCaster = new THREE.Raycaster();

  let intersects;

  const geometry = new THREE.PlaneGeometry( 1, 1 );
  const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, visible: false } );
  const tile = new THREE.Mesh(geometry, material);
  tile.rotateX(-Math.PI / 2 );
  scene.add(tile);

  window.addEventListener('mousemove', (e: MouseEvent) => {
    mousePosition.x = (e.clientX/ window.innerWidth) * 2 - 1;
    mousePosition.y = -(e.clientY/window.innerHeight) * 2 + 1;
    rayCaster.setFromCamera(mousePosition, _camera);
    intersects = rayCaster.intersectObjects(scene.children);
    intersects.forEach(( intersect ) => {
      if ( intersect.object.name === GROUND_LABEL ) {
        tile.material.visible = true;
        const highlightPos = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);
        tile.position.set(highlightPos.x, 0, highlightPos.z);
      }
    })
  });

  const generateSceneFloor = () => {

    const grid = new THREE.GridHelper(100, 100);
    grid.name = GROUND_LABEL;
    scene.add(grid);
  }

  generateSceneFloor();
  
  const animate = () => {
    if (_pause) {
      return;
    }
    requestAnimationFrame( animate );
    renderer.render( scene, _camera );
    // cube.rotation.x += .01;
    // cube.rotation.y += .01;
  }
  animate();

  window.addEventListener('resize', () => {
    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const pause = () => _pause = true;
  const resume = () => _pause = false;
  const add = (object: THREE.Object3D<THREE.Object3DEventMap>[]) => scene.add(...object);
  const remove = (object: THREE.Object3D<THREE.Object3DEventMap>) => scene.remove(object);

  const changeCamera = (camera: THREE.PerspectiveCamera) => _camera = camera;

  return {
    pause, resume, add, remove, changeCamera
  }
}

if ( WebGL.isWebGLAvailable() ) {
  createStage();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById('app')?.appendChild(warning);
}