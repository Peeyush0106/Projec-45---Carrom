function startQueenTxtTimer() {
    queenTxtTimerStart = true;
}

function continueQueenTimerUntilOverIfToDo() {
    if (queenTxtTimerStart && queenTxtTimer > 0) {
        queenTxtTimer -= 1;
    }
    if (queenTxtTimer <= 0) {
        queenInPocket = false;
        queenTxt.hide();
        queenTxtTimer = 3 * 30;
        queenTxtTimerStart = false;
    }
}

function gameWin() {
    fill(rgb(0, 128, 0));
    textSize(25);
    text("You Win!", 250, 307);
}

function destroyCoins() {
    for (let m = 0; m < coins.length; m++) {
        const spr = coins[m];
        if (spr.isTouching(pockets)) {
            if (spr.name !== "queen") {
                points += spr.points;
                spr.destroy();
                coins.remove(spr);
            }
            else {
                queenInPocket = true;
                recentQueenCapturedTurnNo = turns;
                pointsAfterQueenCaptured = points;
            }
        }
    }
    if (striker.isTouching(pockets)) {
        points += striker.points;
    }
}

function bounceObjects() {
    striker.bounceOff(edges);
    striker.bounceOff(boardEdge);
    if (!strikerReady) {
        striker.bounce(coins);
    }
    for (let m = 0; m < coins.length; m++) {
        const spr = coins[m];
        coins.bounceOff(spr);
    }
    coins.bounceOff(edges)
}

function resetGame() {
    for (const i in arguments) {
        const elt = arguments[i];
        elt.hide();
    }
    startButtons[0].show();
    startButtons[1].show();
    startButtons[2].hide();
    startButtons[3].hide();
    gameState = 0;
    striker.destroy();
    striker2.destroy();
    coins.destroyEach();
    boardEdge.destroy();
    thickBand.destroy();
    thinBand.destroy();
    showOptions.hideButtons();
    points = "not-initialized";
    queenInPocket = false;
    queenTxtTimer = 3 * 30;
    queenTxt.html("Come on, you just need a cover for the queen to be safe!!!");
    coverNeed = false;
    turns = 0;
    turnStarts = 1;
    pointsAfterQueenCaptured = "not-captured";
    queenTxtTimerStart = false;
    recentQueenCapturedTurnNo = "not-captured";
    waitForQueenCover = false;
}

function drawShapesAndPatternsOnBoard() {
    push();
    noFill();
    push();
    translate(200, 200);
    rotate(-135);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(400, 200);
    rotate(-45);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(200, 400);
    rotate(135);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    push();
    translate(400, 400);
    rotate(45);
    arc(0, 0, 40, 40, 35, 325);
    pop();
    pop();
    // Down left
    line(213, 386, 52.5, 542.5);
    // Down right
    line(386, 386, 547.5, 542.5);
    // Up Left
    line(213, 215, 55, 57.5);
    // Up Right
    line(386, 215, 545, 60);

    push();
    fill("black");
    // Triangles as arrows
    triangle(175, 205, 187.5, 205, 180, 195);
    triangle(205, 187.5, 205, 175, 195, 180);

    triangle(400, 175, 400, 185, 410, 180);
    triangle(415, 200, 425, 200, 420, 190);

    triangle(205, 415, 202.5, 425, 195, 417.5);
    triangle(185, 395, 175, 395, 180, 405);

    triangle(412.5, 397.5, 425, 397.5, 420, 405);
    triangle(390, 422.5, 395, 412.5, 402.5, 420);

    // Up left
    triangle(52.5, 65, 65, 55, 42.5, 47.5);

    // Up right
    triangle(532.5, 60, 545, 70, 550, 52.5);

    // Down left
    triangle(67.5, 535, 57.5, 525, 47.5, 545);

    // Down right
    triangle(532.5, 535, 545, 525, 550, 545);

    push();
    stroke("black");
    noFill();
    for (let k = 0; k < ellipse_pos.x.length; k++) {
        var current_r;
        if (k <= 3) {
            current_r = 0;
        }
        else if (k === 4) {
            current_r = 1;
        }
        else if (k >= 5 && k <= 12) {
            current_r = 2;
            fill("yellow");
        }
        else if (k >= 13 || k <= 20) {
            current_r = 3;
            fill("red");
        }
        else if (k >= 21 || k <= 24) {
            current_r = 4;
        }
        ellipse(ellipse_pos.x[k], ellipse_pos.y[k], ellipse_pos.r[current_r]);
    }
    pop();
    pop();
}