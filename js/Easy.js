/*console.log(THREE.REVISION); prints three.js version
var map = [ // 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 1
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 2
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 3
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 4
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 5
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 6
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 7
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 9
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 10
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], //11
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 12
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 13
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 14
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 15
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 16
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], //17
          ], mapW = map.length, mapH = map[0].length;
          */
var scene, camera, renderer, mesh, clock, controls;
var bullets = [];
var canShoot = 0;
var keyboard = {};
var enemy5;
var pun = 0;
var tempo = 10;
var UNITSIZE = 20,
    MOVESPEED = 30,
    LOOKSPEED = 1,
    BULLETMOVESPEED = MOVESPEED * 5,
    NUMAI = 100,
    DURATIONTIME = 92000; //in millisec
var width = window.innerWidth;
var height = window.innerHeight;

var mouse = {
    x: 0,
    y: 0
};
var ai = [];
var updateFcts = [];

var loadingScreen = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(45, width / height, 0.3, 100),
    box: new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({
        color: 0x4444ff
    }))
};

var player = {
    height: 1.8,
    speed: 0.2,
    turnSpeed: Math.PI * 0.02
};
var meshes = {};
var loadingManager = null;
var RESOURCES_LOADED = false;

var models = {
    uzi: {
        obj: "models/uziGold.obj",
        mtl: "models/uziGold.mtl",
        mesh: null,
        castShadow: false
    }
    /*
        city: {
          //obj:"models/city1/Street environment_V01.obj",
          //mtl:"models/city1/Street environment_V01.mtl",
          obj:"models/city5/sehir.obj",
          mtl:"models/city5/sehir.mtl",
          mesh: null,
          castShadow: false
        }*/
};

window.onload = init();

function init() {
    //____________________________SCENE & CAMERA_______________________________________
    scene = new THREE.Scene();
    var texture_scene = new THREE.TextureLoader().load('resources/cielo_rosso.jpg', function(texture) {
        scene.background = texture
    });

    //scene.background = new THREE.Color(0xff4500);
    camera = new THREE.PerspectiveCamera(45, width / height, 0.3, 1000);
    scene.fog = new THREE.FogExp2(0xd0e0f0, 0.0025);

    loadingScreen.box.position.set(0, 0, 5);
    loadingScreen.camera.lookAt(loadingScreen.box.position);
    loadingScreen.scene.add(loadingScreen.box);

    loadingManager = new THREE.LoadingManager();
    //loadingManager.onProgress = function(item, loaded, total){console.log(item, loaded, total);};
    loadingManager.onLoad = function() {
        //console.log("loaded all resources");
        RESOURCES_LOADED = true;
        onResourcesLoaded();
    };

    //camera.position.z = 45;
    //camera.position.x = 45;
    //scene.add(camera);

    //___________________________PROCEDURAL CITY_______________________________________
    //Basically we have 2 cities: createSquareCity() and createMrDoobCity();
    var proceduralCity = new THREEx.ProceduralCity().createSquareCity();
    scene.add(proceduralCity);

    //_____________________________________LIGHT________________________________________
    var light = new THREE.HemisphereLight(0xfffff0, 0x101020, 1.25);
    light.position.set(1, 1, 0.25);
    scene.add(light);

    for (var _key in models) {
        (function(key) {

            var mtlLoader = new THREE.MTLLoader(loadingManager);
            mtlLoader.load(models[key].mtl, function(materials) {
                materials.preload();

                var objLoader = new THREE.OBJLoader(loadingManager);

                objLoader.setMaterials(materials);
                objLoader.load(models[key].obj, function(mesh) {

                    mesh.traverse(function(node) {
                        if (node instanceof THREE.Mesh) {
                            if ('castShadow' in models[key])
                                node.castShadow = models[key].castShadow;
                            else
                                node.castShadow = true;

                            if ('receiveShadow' in models[key])
                                node.receiveShadow = models[key].receiveShadow;
                            else
                                node.receiveShadow = true;
                        }
                    });
                    models[key].mesh = mesh;

                });
            });

        })(_key);
    }

    camera.position.set(0, player.height, -5);
    camera.lookAt(new THREE.Vector3(0, player.height, 0));

    renderer = new THREE.WebGLRenderer({
        antialiasing: true
    });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    document.body.appendChild(renderer.domElement);

    //projector = new THREE.Raycaster();
    var vector = new THREE.Vector3();

    //camera.position.y = 1.85;
    //camera.position.z = 200;
    var distance = 1;
    clock = new THREE.Clock();
    controls = new THREE.FirstPersonControls(camera);
    document.addEventListener('click', function() {
        if (distance > 0) {
            controls.lock();
        }
        overlay_off();
    }, false);
    document.addEventListener('pointerlockchange', function() {
        //controls.unlock();
        if (document.pointerLockElement == null && distance > 0) {
            overlay_on();
        }
    }, false);
    controls.movementSpeed = MOVESPEED;
    controls.lookSpeed = LOOKSPEED;
    controls.lookVertical = false; // Temporary solution; play on flat surfaces only
    controls.noFly = true;

    // Track mouse position so we know where to shoot
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Set the date we're counting down to
    var date = new Date().getTime();
    var countDownDate = date + DURATIONTIME;

    // Update the count down every 1 second
    var x = setInterval(function() {
        tempo -= 1;
        // Get the "now" date
        var now1 = new Date().getTime();

        if (overlayIsOn) {
            countDownDate += 1000;
        }

        // Find the distance between now an the count down date
        distance = countDownDate - now1;

        var sec = Math.floor(distance / 1000);
        document.getElementById("time").innerHTML = "<span style='font-family: Impact; font-size: 15px; color:#00FF00'>  Remaining time: " + sec + " sec" + "&nbsp&nbsp&nbsp Score: " + pun + "</span>";

        // If the count down is finished, write some text
        if (distance < 0) {
            overlay_off();
            document.exitPointerLock();
            document.removeEventListener('click', function() {
                controls.lock();
            }, false);
            clearInterval(x);
            document.getElementById("time").innerHTML = "<br /><span style='font-family: Impact; font-size: 60px; color:#00FF00'>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp <h1>TIME OUT!</h1></span>";
            document.getElementById("ris").innerHTML = "<span style='font-family: Impact; font-size: 60px; color:#00FF00'><h1> Score:  " + pun + "</span>" + "<br /><span style='font-family: Impact; font-size: 60px; color:#00FF00'>" + "<a href='index.html'> Restart</a>" + "</h1></span>";
            $(renderer.domElement).fadeOut();
        }
    }, 1000);

    animate();
}


function onResourcesLoaded() {
    //_________________________________CITY SETTINGS____________________________
    //meshes["city"] = models.city.mesh.clone();
    ///meshes["city"].position.set(-5, 10, 4);
    //scene.add(meshes["city"]);
    //_________________________________WEAPONG SETTINGS_________________________
    meshes["playerweapon"] = models.uzi.mesh.clone();
    meshes["playerweapon"].position.set(0, 2, 0);
    meshes["playerweapon"].scale.set(10, 10, 10);
    scene.add(meshes["playerweapon"]);
    overlay_on();
}

/*
function getMapSector(v){
  var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
  var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW/2);
  return {x: x, z: z};
}
*/

function getRandBetween(lo, hi) {
    return parseInt(Math.floor(Math.random() * (hi - lo + 1)) + lo, 10);
}


function animate() {

    window.addEventListener('resize', onWindowResize, false);

    var time = Date.now() * 0.0005;
    var delta = clock.getDelta(),
        speed = delta * BULLETMOVESPEED;
    var aispeed = delta * MOVESPEED * 0.1;

    // Play the loading screen until resources are loaded.
    if (RESOURCES_LOADED == false) {
        requestAnimationFrame(animate);

        loadingScreen.box.position.x -= 0.05;
        if (loadingScreen.box.position.x < -10) loadingScreen.box.position.x = 10;
        loadingScreen.box.position.y = Math.sin(loadingScreen.box.position.x);

        renderer.render(loadingScreen.scene, loadingScreen.camera);
        return;
    }

    requestAnimationFrame(animate);

    castRays();

    // SHOOT BULLET
    for (var index = 0; index < bullets.length; index += 1) {
        if (bullets[index] === undefined) continue;
        if (bullets[index].alive == false) {
            bullets.splice(index, 1);
            continue;
        }

        bullets[index].position.add(bullets[index].velocity);
    }

    //________________________________WEAPON ZOOM___________________________
    var handGunRightPos = Math.PI / 6;
    var bulletRightPos = 0.5;
    if (meshes["playerweapon"] != undefined) {
        if (controls.zoom) {
            handGunRightPos = 0;
            meshes["playerweapon"].scale.set(11.5, 11.5, 11.5);
            bulletRightPos = 0;
        } else {
            handGunRightPos = Math.PI / 6;
            meshes["playerweapon"].scale.set(10, 10, 10);
            bulletRightPos = 0.5;
        }
    }

    var camerarotation_y;
    if (camera.rotation.z == 0)
        camerarotation_y = Math.PI - camera.rotation.y;
    else
        camerarotation_y = camera.rotation.y;

    //__________________________________________BULLET CREATION_____________________________________________
    if (controls.shoot && canShoot <= 0 && !overlayIsOn) {
        // creates a bullet as a Mesh object
        var bullet = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({
            color: 0xAF9B60
        }));
        // must change to weapon position later
        bullet.position.set(meshes["playerweapon"].position.x - bulletRightPos, meshes["playerweapon"].position.y, meshes["playerweapon"].position.z);
        // set the velocity of the bullet
        bullet.velocity = new THREE.Vector3(-Math.sin(camerarotation_y), 0, Math.cos(camerarotation_y)); //.normalize();
        //console.log(bullet.velocity)
        //console.log(camera.rotation)
        bullet.alive = true;
        setTimeout(function() {
            bullet.alive = false;
            scene.remove(bullet);
        }, 1000);
        // add to scene, array, and set the delay to 10 frames
        bullets.push(bullet);
        scene.add(bullet);
        canShoot = 10;
    }
    if (canShoot > 0) canShoot -= 1;

    if (!overlayIsOn)
        controls.update(clock.getDelta()); // only if control is FirstPersonControls

    // Set gun in front of camera
    meshes["playerweapon"].position.set(
        camera.position.x - Math.sin(camerarotation_y + handGunRightPos) * 0.75,
        camera.position.y - 0.3 + Math.sin(time * 4 + camera.position.x + camera.position.z) * 0.01,
        camera.position.z + Math.cos(camerarotation_y + handGunRightPos) * 0.75);
    meshes["playerweapon"].rotation.set(camera.rotation.x, camera.rotation.y - Math.PI, camera.rotation.z);
    renderer.render(scene, camera);
}

function castRays() {
    var direction = new THREE.Vector3(1000, 5500, 1000);
    var startPoint = camera.position.clone();
    var directionVector = direction.sub(startPoint);
    var ray = new THREE.Raycaster(startPoint, directionVector.clone().normalize());
    scene.updateMatrixWorld(); // required, since you haven't rendered yet
    var rayIntersects = ray.intersectObjects(scene.children, true);
    if (rayIntersects.length > 0) {
        camera.position.z = camera.position.z - 5;
        camera.position.x = camera.position.x - 5;
    }
}

function onDocumentMouseMove(e) {
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function keyDown(event) {
    keyboard[event.keyCode] = true;
}

function keyUp(event) {
    keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
