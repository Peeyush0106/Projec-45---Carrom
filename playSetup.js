console.group("Console group of logs");

var mouse_pos = document.getElementById("mouse-pos");
var coinDiameter = 25;

var pocket_width_and_height, pockets, thickStripWidth, coins_pos, canvas, boardEdge,
    thinStripWidth, coins, striker, striker2, strikerMove, ellipse_pos, haveToSetStriker, queen, music, edges, strip_pos, stopped_coins, thickBand, thinBand, whiteImg, blackImg, queenImg, strikerImg, strikerReady, pocket_pos, gameState, showOptions, points, queenInPocket, queenTxtTimer, queenTxt, coverNeed, turns, extraCoin, turnStarts, pointsAfterQueenCaptured, queenTxtTimerStart, recentQueenCapturedTurnNo, waitForQueenCover;

function setStriker() {
    if (!striker.isTouching(pockets)) {
        turnStarts += 1;
    }

    if (striker2 !== undefined) striker.x = striker2.x;
    else striker.x = 300;
    striker.y = 530;
    strikerReady = false;
    striker.setSpeedAndDirection(0)
    striker.pointTo(canvas.width / 2, canvas.height / 2);
}

function startGame() {
    // Pockets
    pocket_width_and_height = 56;
    points = 0;
    // Multiplying by 30 for getting seconds. The 
    queenTxtTimer = 3 * 30;
    turns = 0;
    recentQueenCapturedTurnNo = "not-captured";
    pointsAfterQueenCaptured = "not-captured";
    queenInPocket = false;
    coverNeed = false;
    waitForQueenCover = false;
    turnStarts = 1;
    queenTxtTimerStart = false;
    pockets = createGroup();
    pocket_pos = { x: [0, 600, 600, 0], y: [0, 0, 600, 600] };
    for (let i = 0; i < pocket_pos.x.length; i++) {
        const spr = createSprite(pocket_pos.x[i], pocket_pos.y[i], pocket_width_and_height, pocket_width_and_height);
        spr.setCollider("circle");
        pockets.add(spr);
        spr.visible = false;
    }

    // Strips
    thickStripWidth = 9;
    thinStripWidth = 4;

    strip_pos = {
        x: [525, 540, 75, 60, 300, 300, 300, 300],
        y: [300, 300, 300, 300, 75, 60, 525, 540],
        width: [thickStripWidth, thinStripWidth, thickStripWidth, thinStripWidth, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100],
        height: [thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thinStripWidth * 100, thickStripWidth, thinStripWidth, thickStripWidth, thinStripWidth]
    };
    coins = createGroup();

    //  Striker
    striker = createSprite();
    setStriker();
    striker.restitution = 0.18;
    striker.rotation = -90;
    striker.rotateToDirection = true;
    striker.friction = 0.02;
    striker.points = -10;
    striker.setCollider("circle");
    striker.addImage(strikerImg);
    striker2 = createSprite(300, 650);
    striker2.rotation = -90;
    striker2.depth = 1;
    striker2.addImage(strikerImg);
    // Coins

    var queenX = 300;
    var queenY = 300;

    coins_pos = { black: { x: [], y: [] }, white: { x: [], y: [] } };
    //Black coins - first layer
    for (var angle = 75; angle < 360; angle += 120) {
        var coinX = queenX + cos(angle) * coinDiameter;
        var coinY = queenY + sin(angle) * coinDiameter;
        coins_pos.black.x.push(coinX);
        coins_pos.black.y.push(coinY);
    }

    //Black coins second layer
    for (var angle = 45; angle < 360; angle += 60) {

        var xOffset = cos(angle) * (2 * coinDiameter * cos(30));
        var yOffset = sin(angle) * (2 * coinDiameter * cos(30));

        var coinX = queenX + xOffset;
        var coinY = queenY + yOffset;
        coins_pos.black.x.push(coinX);
        coins_pos.black.y.push(coinY);
    }


    //White coins - first layer
    for (var angle = 15; angle < 360; angle += 120) {
        var coinX = queenX + cos(angle) * coinDiameter;
        var coinY = queenY + sin(angle) * coinDiameter;
        coins_pos.white.x.push(coinX);
        coins_pos.white.y.push(coinY);
    }

    //White coins second layer
    for (var angle = 15; angle < 360; angle += 60) {

        var xOffset = cos(angle) * (2 * coinDiameter);
        var yOffset = sin(angle) * (2 * coinDiameter);

        var coinX = queenX + xOffset;
        var coinY = queenY + yOffset;
        coins_pos.white.x.push(coinX);
        coins_pos.white.y.push(coinY);
    }

    for (let l = 0; l < coins_pos.white.x.length; l++) {
        var spr = createSprite(coins_pos.white.x[l], coins_pos.white.y[l], coinDiameter, coinDiameter);
        blackImg.width = spr.width;
        spr.addImage(blackImg);
        coins.add(spr);
        spr.restitution = 0.5;
        spr.setCollider("circle", 0, 0, 12);
        spr.friction = 0.065;
        spr.points = 10;
    }
    for (let l = 0; l < coins_pos.black.x.length; l++) {
        var spr = createSprite(coins_pos.black.x[l], coins_pos.black.y[l], coinDiameter, coinDiameter);
        whiteImg.width = spr.width;
        spr.addImage(whiteImg);
        coins.add(spr);
        spr.restitution = 0.5;
        spr.setCollider("circle", 0, 0, 12);
        spr.friction = 0.065;
        spr.points = 20;
    }
    extraCoin = createSprite(10, 60, coinDiameter, coinDiameter);
    extraCoin.addImage(whiteImg);
    extraCoin.restitution = 0.5;
    extraCoin.setCollider("circle", 0, 0, 12);
    extraCoin.friction = 0.065;
    extraCoin.points = 20;
    coins.add(extraCoin);

    queen = createSprite(590, 85, coinDiameter, coinDiameter);
    queen.addImage(queenImg);
    coins.add(queen);
    queen.restitution = 0.5;
    queen.points = 50;
    queen.name = "queen";
    queen.setCollider("circle", 0, 0, 12);
    queen.friction = 0.055;
    // strikerImg.width = 5;
    ellipse_pos = {
        x: [0, 0, 600, 600,
            300,
            500, 532.5, 500, 532.5, 67.5, 100, 100, 67.5, 500, 532.5, 500, 532.5, 67.5, 100, 100, 67.5,
            520, 520, 82, 82.5],
        y: [0, 600, 600, 0,
            300,
            68, 105, 532, 495, 495, 530, 68, 100, 68, 105, 532, 495, 495, 530, 68, 100,
            82.5, 515, 515, 82.5],
        r: [90, 130, 35, 15],
    };
    edges = createEdgeSprites();
    boardEdge = createSprite(300, 675, 600, 150);
    boardEdge.shapeColor = rgb(155, 210, 220);
    boardEdge.depth = -2;

    // thickBand at the bottom
    thickBand = createSprite(300, 640, 438, 10);
    thickBand.shapeColor = "black";
    thickBand.depth = -1;
    // thinBand at the bottom
    thinBand = createSprite(300, 660, 438, 5);
    thinBand.shapeColor = "black";
    thinBand.depth = -1;
}