var camera, scene, renderer;
var keyState = {};
var map, player1, player2, ball;
var x_map, y_map;
var x_mile;
var y_mile;
var ball_radius;
var ball_speed = 0.05;
var player1_score = 0;
var player2_score = 0;


function setRenderer() {

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


function setCamera() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 5;
}


function setScene() {

    scene = new THREE.Scene();
}

function setWorld() {
    x_map = 5;
    y_map = 4;
    x_mile = 0.2;
    y_mile = 1;


    /* ezafe kardane map */
    var geometry = new THREE.BoxGeometry(x_map, y_map, 0.01);
    var material = new THREE.MeshPhongMaterial({color: 0xFFC77C, side: THREE.DoubleSide});
    map = new THREE.Mesh(geometry, material);
    scene.add(map);

    var surfaceGeometry = new THREE.PlaneGeometry(300,350);
    var surfaceMaterial = new THREE.MeshBasicMaterial({color: 0x828282, side: THREE.DoubleSide});
    var surfaceMesh = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    scene.add(surfaceMesh);


    /* ezafe kardane  mile player 1 */
    var geometry = new THREE.BoxGeometry(x_mile, y_mile, 0.1);
    var material = new THREE.MeshPhongMaterial({color: 0x005000});
    player_1 = new THREE.Mesh(geometry, material);
    player_1.position.x = -x_map / 2;
    scene.add(player_1);

    /* ezafe kardane mile player 2 */
    var geometry = new THREE.BoxGeometry(x_mile, y_mile, 0.1);
    var material = new THREE.MeshPhongMaterial({color: 0xff0000});
    player_2 = new THREE.Mesh(geometry, material);
    player_2.position.x = x_map / 2;
    scene.add(player_2);


    /* ezafe kardane toop */
    ball_radius = 0.2;
    var geometry = new THREE.SphereGeometry(ball_radius, 32, 32);
    var material = new THREE.MeshPhongMaterial({color: 0xFF8C00});
    ball = new THREE.Mesh(geometry, material);
    ball.position.z += 0.1;
    scene.add(ball);


}


var s = 0;

function recovery_on_player1(recover_speed) {
    ball.position.copy(player_1.position);
    console.log(recover_speed)
    ball_speed = -recover_speed;
    s = 0;
}

function recovery_on_player2(recover_speed) {
    ball.position.copy(player_2.position);
    console.log(recover_speed)
    console.log(player_1.position)
    console.log(player_2.position)
    console.log(ball.position)
    ball_speed = -recover_speed;
    s = 0;
}

function get_random_angle(minimum, maximum) {

    var randomnumber = Math.random() * ( maximum - minimum ) + minimum;

    return randomnumber;
}

var ball_angle = Math.PI;
var player2_speed = 0.05;

function animate() {

    requestAnimationFrame(animate);

    ball.position.x += ball_speed * Math.cos(ball_angle);
    ball.position.y += ball_speed * Math.sin(ball_angle);


    /* barkhord player 1 */
    if (( ball.position.x < player_1.position.x + (x_mile / 2) ) &&
        ( ball.position.y < ( player_1.position.y + y_mile / 2  ) ) &&
        ( ball.position.y > ( player_1.position.y - y_mile / 2  ) )) {
        var snd = new Audio("sounds/ding.wav");
        snd.play();
        if (s == 0) {
            ball.position.x = player_1.position.x + (x_mile / 2);
            ball_speed = -ball_speed;
            ball_angle = get_random_angle(-Math.PI / 4, Math.PI / 4);
        }
    }

    /* barkhord player 2 */
    if (( ball.position.x > player_2.position.x - (x_mile / 2) ) &&
        ( ball.position.y < ( player_2.position.y + y_mile / 2  ) ) &&
        ( ball.position.y > ( player_2.position.y - y_mile / 2  ) )) {
        var snd = new Audio("sounds/ding.wav");
        snd.play();
        if (s == 0) {
            ball.position.x = player_2.position.x - (x_mile / 2);
            ball_speed = -ball_speed;
            ball_angle = get_random_angle(-Math.PI / 4, Math.PI / 4);
        }
    }

    /* barkhord ba labeye bala */
    if (ball.position.y >= (y_map / 2)) {
        ball_angle = -ball_angle;
    }

    /* barkhord ba labeye paein */
    if (ball.position.y <= -(y_map / 2)) {
        ball_angle = -ball_angle;
    }


    /* Goal on player_1 side */
    if (ball.position.x < -x_map / 2 - 2 * ball_radius) {

        if (s == 0) {
            var snd = new Audio("sounds/punch.wav");
            snd.play();
            player2_score += 1;

         /*   if(player2_score==40){
                var loader1 = new THREE.FontLoader();

                loader1.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

                        var geometry1 = new THREE.TextGeometry( 'GAME OVER!', {
                        font: font,
                        size: 80,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 10,
                        bevelSize: 8,
                        bevelOffset: 0,
                        bevelSegments: 5

                    } );
                    scene.add( geometry1 );
                    var tMaterial1= new THREE.MeshStandardMaterial({color : 0x00ffff});
                    var sText1= new  THREE.Mesh(geometry1,tMaterial1);
                    sText1.rotation.y=Math.PI;
                    sText1.castShadow=true;
                    sText1.position.x=0;
                    sText1.position.y=3;
                    scene.add(sText1);
                } );
            } */
            document.getElementById("player2_score").innerHTML = player2_score;
            setTimeout(recovery_on_player1, 1000, ball_speed);
            s = 1;
        }

        ball_speed = 0;
    }


    /* Goal on player_2 side */
    if (ball.position.x > x_map / 2 + 2 * ball_radius) {

        if (s == 0) {
            var snd = new Audio("sounds/punch.wav");
            snd.play();
            player1_score += 1;
         /*   if(player1_score==40){
                var loader = new THREE.FontLoader();

                loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

                        var geometry = new THREE.TextGeometry( 'GAME OVER!', {
                        font: font,
                        size: 80,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 10,
                        bevelSize: 8,
                        bevelOffset: 0,
                        bevelSegments: 5


                    } );
                    scene.add( geometry );
                    var tMaterial= new THREE.MeshStandardMaterial({color : 0x00ffff});
                    var sText= new  THREE.Mesh(geometry,tMaterial);
                    sText.rotation.y=Math.PI;
                    sText.castShadow=true;
                    sText.position.x=0;
                    sText.position.y=3;
                    scene.add(sText);
                } );
            } */
            document.getElementById("player1_score").innerHTML = player1_score;
            setTimeout(recovery_on_player2, 1000, ball_speed);
            s = 1;
        }

        ball_speed = 0;
    }


    renderer.render(scene, camera);
}


function setEventListenerHandler() {
    window.addEventListener('keydown', function (e) {
        keyState[e.keyCode || e.which] = true;
    }, true);

    window.addEventListener('keyup', function (e) {
        keyState[e.keyCode || e.which] = false;
    }, true);

    window.addEventListener('resize', onWindowResize, false);
}


function setKeyboardControls() {

    if (keyState[81]) {
        //q
        if (player_1.position.y < ( (y_map / 2) - ( y_mile / 2 ))) {
            player_1.position.y += 0.075;
        }
    }
        //a
    if (keyState[65]) {

        if (player_1.position.y > ( -(y_map / 2) + ( y_mile / 2 ))) {
            player_1.position.y -= 0.075;
        }
    }
    if (keyState[38]) {

        if (player_2.position.y < ( (y_map / 2) - ( y_mile / 2 ))) {
            player_2.position.y += 0.075;
        }
    }
    if (keyState[40]) {

        if (player_2.position.y > ( -(y_map / 2) + ( y_mile / 2 ))) {
            player_2.position.y -= 0.075;
        }
    }

    setTimeout(setKeyboardControls, 10);
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function setLights() {

    var light = new THREE.AmbientLight(0xffffff);
    scene.add(light);


    var spotLight = new THREE.SpotLight(0XFFC77C);
    spotLight.position.set(0, 0, 2);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = window.innerWidth;
    spotLight.shadow.mapSize.height = window.innerHeight;

    scene.add(spotLight);
}

function harder() {
    player1_score = 0;
    player2_score = 0;
    document.getElementById("player1_score").innerHTML = player1_score;
    document.getElementById("player2_score").innerHTML = player2_score;

    if (s == 0) {
        ball.position.x = 0;
        ball.position.y = 0;
        ball_speed = -0.1;

        ball_angle = Math.PI;

    }

}





function main() {

    setRenderer();
    setCamera();
    setEventListenerHandler();
    setKeyboardControls();
    setScene();
    setLights();
    setWorld();
    animate();
}
