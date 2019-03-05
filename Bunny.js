var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
cube = null,
waves = null,
directionalLight = null;
var numObjects =300;
var duration = 10, // sec
crateAnimator = null,
waveAnimator = null,
lightAnimator = null,
waterAnimator = null,
animateCrate = true,
animateWaves = true,
animateLight = true,
animateWater = true,
loopAnimation = false;
var positions = [];
var llave = [];
var rotations  = [];
var objLoader = null
var waterMapUrl = "images/grass.png";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
function run()
{
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Update the animations
        KF.update();
        // Update the camera controller
        orbitControls.update();
}
function loadObj()
{
    if(!objLoader)
        objLoader = new THREE.OBJLoader();
    
    objLoader.load(
        'models/20180310_KickAir8P_UVUnwrapped_Stanford_Bunny.obj',

        function(object)
        {
            var normalMap = new THREE.TextureLoader().load('models/bunnystanford_res1_UVmapping3072_TerraCotta_g001c.jpg');
            var texture = new THREE.TextureLoader().load('models/bunnystanford_res1_UVmapping3072_g005c.jpg');

            object.traverse( function ( child ) 
            {
                if ( child instanceof THREE.Mesh ) 
                {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.material.map = texture;
                    child.material.normalMap = normalMap;
                }
            } );
                    
            gun = object;
            gun.position.z = 0;
            gun.position.y = -1;
            gun.position.x = 0;
            gun.scale.set(50,50,50);
            group.add(object);
        },
        function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
        },
        // called when loading has errors
        function ( error ) {
    
            console.log( 'An error happened' );
    
        });
}
function createScene(canvas) 
{
  
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

     // Turn on shadows
     renderer.shadowMap.enabled = true;
    
     // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    //camera.position.set(0, 80, 190);
    camera.position.set(0, 300, 0);
    scene.add(camera);
    
    // Create a group to hold all the objects
    root = new THREE.Object3D;
        
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 1);

    // Create and add all the lights
    // Directional light
    directionalLight.position.set(0, 1, 6);
    root.add(directionalLight);

    // Spotlight
    spotLight = new THREE.SpotLight (0x000000);
    spotLight.position.set(2, 8, 15);
    spotLight.target.position.set(-2, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 85;

    spotLight.shadow.mapSize.width = 2048;
    spotLight.shadow.mapSize.height = 2048;

    // Ambient light
    ambientLight = new THREE.AmbientLight ( 0x303030 );
    root.add(ambientLight);

    // Point light
    pointLight = new THREE.PointLight(0xffffff, 1.5, 0);
    pointLight.position.set(0,18,15);

    pointLight.castShadow = true;

    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 150;
    pointLight.shadow.camera.fov = 85;

    pointLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    pointLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    // Point light helper
    var pointLightHelper = new THREE.PointLightHelper( pointLight, 1.1 );
    root.add(pointLight);

    root.add(pointLightHelper);

    // Create the objects
    loadObj();

    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var grassMap = new THREE.TextureLoader().load(waterMapUrl);
    grassMap.wrapS = grassMap.wrapT = THREE.RepeatWrapping;
    grassMap.repeat.set(4, 4);

    var color = 0xffffff;
    
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    waves = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:grassMap, side:THREE.DoubleSide}));
    waves.rotation.x = -Math.PI / 2;
    waves.position.y = -4.7;
    
    waves.castShadow = false;
    waves.receiveShadow = true;
    // Add the waves to our group
    root.add( waves );
        
    // Now add the group to our scene
    scene.add( root );
}
function keys()
{   
    var inc = 360 / numObjects;
    var faltante = numObjects/4;
    var radius = 20;
    var salto = 0 ;
    var y= 0; 
    var flag=false; 
    for (i=faltante;i<numObjects+faltante-1;i++) 
    {   
        if (flag)
        {
            y = y-0.22
            salto += 1
        if (salto >  18)
        {
          flag = false;
        }
      }
     if (!flag )
     {
        y = y+0.2222
            salto -= 1
       if (salto  <=  0)
       {
         flag = true;
       }
     }
       var x = ((Math.cos(((inc * i)) * Math.PI / 180)) * (radius * 3));
       var z = ((Math.sin(((inc * i)) * Math.PI / 90)) * radius);
       positions.push({'x':x,'y':y,'z': z });
       llave.push(i*.00264);
    }
    positions.push({'x':0,'y':-4,'z': 0 });
    llave.push(375*.00264);
    return [positions,llave];
}
function rota()
{
    var faltante = numObjects/4;
    var theta = 0;
    for (i=0;i<numObjects;i++) 
    {
        x1 = positions[i]['x'];
    	y1 = positions[i]['z'];
        x2 = positions[(i + 1) % numObjects]['x'];
        y2 = positions[(i + 1) % numObjects]['z'];
        theta = (Math.atan2(x2 ,y2 ));
        rotations.push({ y : theta });
    }
    return rotations
}
function playAnimations()
{
   var key = keys();
  var direction = rota()
   // position animation
    if (crateAnimator)
        crateAnimator.stop();
    
    group.position.set(0, -4, 0);
    group.rotation.set(0, 0, 0);

    if (animateCrate)
    {
        crateAnimator = new KF.KeyFrameAnimator;
        crateAnimator.init({ 
            interps:
                [
                    { 
                    keys:key[1], 
                        values:key[0]    
                    ,
                        target:group.position
                    }
                    ,
                    { 
                        keys:key[1], 
                        values:direction,
                        target:group.rotation
                    },
                ],
            loop: loopAnimation,
            duration:duration * 1000,
            //easing:TWEEN.Easing.Bounce.InOut,
        });
        crateAnimator.start();
        
    }
}