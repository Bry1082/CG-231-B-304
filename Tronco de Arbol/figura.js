//Bryam Barreto 
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
camera.position.z = 4.5;
camera.position.x = -5.2;
camera.position.y = 2;

camera.rotation.set(0, -0.5, 0);
scene.add(camera);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
//luz
const luzDireccional = new THREE.DirectionalLight(0xffffff, 1);
luzDireccional.position.set(20, 30, 30);
luzDireccional.target.position.set(1, 1, 1); // Posición del objetivo de la luz (centro de la escena)
scene.add(luzDireccional);
scene.add(luzDireccional.target);


//escenario
const size = 150;
const divisions = 160;
const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

function troncoPiramide(nlados, apotema, escala, altura) { // me ayude de CHATGPT para el indice el buffer 

  const vertices1 = [];
  const vertices2 = [];
  const factor = 1 + (escala / 100);

  const ang = (2 * Math.PI) / nlados;
  for (let i = 0; i < nlados; i++) {
    let x1 = apotema * Math.cos(i * ang);
    let z1 = apotema * Math.sin(i * ang);
    vertices1.push(x1, 0, z1);

    let x2 = apotema * factor * Math.cos(i * ang);
    let z2 = apotema * factor * Math.sin(i * ang);
    vertices2.push(x2, altura, z2);
  }

  const numVertices1 = vertices1.length / 3; // Número de vértices en vertices1
  const numVertices2 = vertices2.length / 3; // Número de vértices en vertices2

  const vertices = vertices1.concat(vertices2);

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  // Calcular el número de vértices y caras
  const numCaras = Math.min(numVertices1, numVertices2) - 1;

  // Crear los índices para formar las caras
  const indices = [];
// Crear las caras laterales
for (let i = 0; i < numVertices1 - 1; i++) {
  const currentVertex1 = i;
  const currentVertex2 = i + numVertices1;
  const nextVertex1 = (i + 1) % numVertices1;
  const nextVertex2 = (i + 1) % numVertices2;

  for (let j = 0; j < nlados; j++) {
    const lateralVertex1 = currentVertex1 + j * numVertices1;
    const lateralVertex2 = currentVertex2 + j * numVertices1;
    const lateralNextVertex1 = nextVertex1 + j * numVertices1;
    const lateralNextVertex2 = nextVertex2 + j * numVertices1;

    // Primer triángulo de la cara lateral
    indices.push(lateralVertex1);
    indices.push(lateralVertex2);
    indices.push(lateralNextVertex1);

    // Segundo triángulo de la cara lateral
    indices.push(lateralVertex2);
    indices.push(lateralNextVertex2);
    indices.push(lateralNextVertex1);
  }
}

// Última cara lateral que conecta el primer y último vértice
const currentVertex1 = numVertices1 - 1;
const currentVertex2 = numVertices1 + numVertices2 - 1;
const nextVertex1 = 0;
const nextVertex2 = numVertices1;

for (let j = 0; j < nlados; j++) {
  const lateralVertex1 = currentVertex1 + j * numVertices1;
  const lateralVertex2 = currentVertex2 + j * numVertices1;
  const lateralNextVertex1 = nextVertex1 + j * numVertices1;
  const lateralNextVertex2 = nextVertex2 + j * numVertices1;

  // Primer triángulo de la cara lateral
  indices.push(lateralVertex1);
  indices.push(lateralVertex2);
  indices.push(lateralNextVertex1);

  // Segundo triángulo de la cara lateral
  indices.push(lateralVertex2);
  indices.push(lateralNextVertex2);
  indices.push(lateralNextVertex1);
}

// Unir los vértices de la base con la tapa
for (let i = 0; i < nlados; i++) {
  const baseVertex1 = i;
  const baseVertex2 = (i + 1) % nlados;
  const tapaVertex1 = baseVertex1 + numVertices1;
  const tapaVertex2 = baseVertex2 + numVertices1;

  // Triángulo que une la base con la tapa
  indices.push(baseVertex1);
  indices.push(tapaVertex1);
  indices.push(baseVertex2);

  indices.push(baseVertex2);
  indices.push(tapaVertex1);
  indices.push(tapaVertex2);
}

  // Caras de la base
  for (let i = 0; i < nlados; i++) {
    const baseVertex1 = i;
    const baseVertex2 = (i + 1) % nlados;
    const baseVertex3 = numVertices1 - 1; // Último vértice de la base

    indices.push(baseVertex1);
    indices.push(baseVertex2);
    indices.push(baseVertex3);
  }

  // Caras de la tapa
  for (let i = 0; i < nlados; i++) {
    const tapaVertex1 = i + numVertices1;
    const tapaVertex2 = (i + 1) % nlados + numVertices1;
    const tapaVertex3 = numVertices2 - 1; // Último vértice de la tapa

    indices.push(tapaVertex1);
    indices.push(tapaVertex2);
    indices.push(tapaVertex3);
  }

  geometria.setIndex(indices);

  const color = new THREE.Color("rgb(51, 206, 218)"); // Color
  const material = new THREE.MeshBasicMaterial({
    color: color // Color del material
  });
  const mesh = new THREE.Mesh(geometria, material);
  scene.add(mesh);
}
troncoPiramide(5,3,-50,3); //Profe podriamos revisar el codigo en clase es que la luz no me funciona y la lelvo rato intentandolo
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();