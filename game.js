function draw() {
    background(255, 250, 220);
    if (points != "not-initialized") mouse_pos.innerText = "Turns: " + turns + " || Score: " + points + " || MouseX: " + mouseX + " || MouseY: " + mouseY;
    else mouse_pos.innerText = "MouseX: " + mouseX + " || MouseY: " + mouseY;

    if (showOptions.currentOpt === 1) {
        startButtons[4].show();
        startButtons[5].show();
        startButtons[6].show();
        showOptions.goNeutral();
    }
    if (showOptions.currentOpt === -1) {
        startButtons[4].hide();
        startButtons[5].hide();
        startButtons[6].hide();
        showOptions.goNeutral();
    }
    if (gameState === 0) queenTxt.hide();
    if (gameState === 1) {
        for (let j = 0; j < strip_pos.x.length; j++) {
            push();
            fill("black");
            rect(strip_pos.x[j] - strip_pos.width[j] / 2, strip_pos.y[j] - strip_pos.height[j] / 2, strip_pos.width[j], strip_pos.height[j]);
            pop();
        }
        drawShapesAndPatternsOnBoard();

        // Bouncing
        bounceObjects();

        if (strikerReady) {
            striker.x = striker2.x;
            striker2.pointTo(mouseX, mouseY);
            if (mouseDown()) {
                striker.pointTo(mouseX, mouseY);
                if (dist(mouseX, mouseY, striker2.x, striker2.y) < striker2.width && striker2.x <= 500 && striker2.x >= 100) striker2.x = mouseX;
            }
            if (striker.x <= 497 && (keyDown("right") || keyDown("d"))) {
                striker.x = striker.x + 3;
                striker2.x = striker.x;
            }
            if (striker.x >= 103 && (keyDown("left") || keyDown("a"))) {
                striker.x = striker.x - 3;
            }
            if (keyDown("enter")) {
                strikerReady = false;
                striker.setSpeedAndDirection(30);
                turns += 1;
            }
        }
        else striker2.pointTo(striker.x, striker.y);
        if (striker2.x > 464) {
            striker2.x = 500;
        }
        if (striker2.x < 136) {
            striker2.x = 100;
        }

        if (Math.round(Math.abs(striker.velocity.x)) <= 0.65
            && Math.round(Math.abs(striker.velocity.y)) <= 0.65
            && striker.x !== 300
            && striker.y !== 530) {
            setStriker();
        }
        if (striker.y === 530 && Math.round(Math.abs(striker.velocity.x)) <= 0.65 && Math.round(Math.abs(striker.velocity.y)) <= 0.65) {
            strikerReady = true;
        }
        else {
            strikerReady = false;
        }

        // Destroying coins
        destroyCoins();
        // Reset striker
        if (striker.isTouching(pockets)) {
            setStriker();
            striker.setVelocity(0, 0);
        }

        if (haveToSetStriker) {
            setStrikerToInitPos();
        }

        drawSprites();

        if (coins.length === 0) {
            gameWin();
        }
        if (queenInPocket) {
            fill(rgb(0, 128, 0));
            textSize(25);
            queenTxt.style("background-color", "green");
            queenTxt.html("Come on, you just need a cover for the queen to be safe!!!");
            queenTxt.show();
            startQueenTxtTimer();
            queen.x = 20;
            queen.y = 690;
            queen.setVelocity(0, 0);
            for (var n in coins.length - 1) {
                coins[n].bounceOff(boardEdge);
            }
            coverNeed = true;
            waitForQueenCover = true;
        }
        else {
            coins.bounceOff(boardEdge);
        }
        if (waitForQueenCover) {
            pointsAfterQueenCaptured = points;
            if (recentQueenCapturedTurnNo === turnStarts - 2) {
                if (pointsAfterQueenCaptured > 0) {
                    points += queen.points;
                    queenTxt.html("Yeah, you captured the queen. But don't be overconfident!");
                    queenTxt.style("background-color", "red");
                    queenTxt.style("color", "white");
                    queenTxt.show();
                    queenTxtTimer = 3 * 30;
                    startQueenTxtTimer();
                    queenInPocket = false;
                }
                else {
                    queenTxt.html("Ohh don't be sad, try again and play more to be a master!");
                    queenTxt.style("background-color", "white");
                    queenTxt.style("color", "red");
                    queenTxt.show();
                    startQueenTxtTimer();
                    queenInPocket = false;
                    queen.x = 300;
                    queen.y = 300;
                }
                waitForQueenCover = false;
            }
        }
        if (!strikerReady) {
            // queenTxt.hide();
        }
    }
    continueQueenTimerUntilOverIfToDo();
}