import './style.css'
import *  as THREE from 'three';
import { WebGL, OrbitControls } from 'three/examples/jsm/Addons.js';

const createStage = () => {

  const scene = new THREE.Scene();

  let _camera: THREE.Camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  let _pause = false;
  
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  
  const geometry = new THREE.BoxGeometry( 1, 1, 1 );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh(geometry, material );
  scene.add(cube);
  
  _camera.position.set(10, 15, -10);

  new OrbitControls( _camera, document.body );

  const generateSceneFloor = () => {
    const geometry = new THREE.PlaneGeometry( 100, 100 );
    const material = new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, visible: false } );
    const floor = new THREE.Mesh(geometry, material);
    floor.rotateX(-Math.PI / 2 );
    scene.add(floor);

    const grid = new THREE.GridHelper(100, 100);
    scene.add(grid);
  }

  generateSceneFloor();
  
  const animate = () => {
    if (_pause) {
      return;
    }
    requestAnimationFrame( animate );
    renderer.render( scene, _camera );
    cube.rotation.x += .01;
    cube.rotation.y += .01;
  }
  animate();

  const pause = () => _pause = true;
  const resume = () => _pause = false;
  const add = (object: THREE.Object3D<THREE.Object3DEventMap>[]) => scene.add(...object);
  const remove = (object: THREE.Object3D<THREE.Object3DEventMap>) => scene.remove(object);

  const changeCamera = (camera: THREE.Camera) => _camera = camera;

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