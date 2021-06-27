function draw() {
    background(255, 250, 220);
    if (loggedIn) {
        updateStatus();
    }
    if (points != "not-initialized") mouse_pos.innerText = "Turns: " + turns + " || Score: " + points + " || MouseX: " + mouseX + " || MouseY: " + mouseY;
    else mouse_pos.innerText = "MouseX: " + mouseX + " || MouseY: " + mouseY;

    if (!checkedAnEnterStatement) {
        if (!gameStarted && !loggedIn && keyDown("enter")) {
            continueGame();
            console.log("login");
            checkedAnEnterStatement = true;
        }
    }
    if (!checkedAnEnterStatement) {
        if (!gameStarted && loggedIn && keyDown("enter")) {
            startPlaying();
            startGame();
            console.log("started");
            checkedAnEnterStatement = true;
        }
    }
    if (keyWentUp("enter")) {
        checkedAnEnterStatement = false;
    }

    if (showOptions.currentOpt === 1) {
        startButtons[4].show();
        startButtons[5].show();
        startButtons[6].show();
        startButtons[7].show();
        showOptions.goNeutral();
    }
    if (showOptions.currentOpt === -1) {
        startButtons[4].hide();
        startButtons[5].hide();
        startButtons[6].hide();
        startButtons[7].hide();
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
            if (mousePressedOnStriker2()) {
                striker2.x = mouseX
            }
            if (mouseDown() && mouseY < 600) {
                striker.pointTo(mouseX, mouseY);
            }
            else {
                if (striker2.x === 104 && (keyDown("right"))) striker2.x = 136;
                if (striker2.x === 496 && (keyDown("left"))) striker2.x = 464;
                if (keyDown("a")) striker.rotation -= 4;
                if (keyDown("d")) striker.rotation += 4;
                if (keyDown("enter") && !checkedAnEnterStatement && !mouseDown()) shoot();
                if (strikerState === "moving") striker2.x = mouseX;
                if (striker.x < 500 && (keyDown("right"))) striker2.x = striker2.x + 4;
                if (striker.x > 100 && (keyDown("left"))) striker2.x = striker2.x - 4;
                if (striker2.x > 464 && !keyDown("left") && !mousePressedOnStriker2()) striker2.x = 500
                if (striker2.x < 136 && !keyDown("right") && !mousePressedOnStriker2()) striker2.x = 100
            }
        }
        if (!strikerReady) striker2.pointTo(striker.x, striker.y);

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

        if (gameState === 1) {
            push();
            noFill();
            stroke("black");
            strokeWeight(3);
            rect(115, 675, 357.5 - 115, 735 - 675);
            pop();
        }

        if (coins.length === 0) {
            gameWin();
        }
        if (queenInPocket) {
            queen.x = 20;
            queen.y = 690;
            queen.setVelocity(0, 0);
            for (var n in coins.length - 1) {
                coins[n].bounceOff(boardEdge);
            }
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
                    notify("Yeah, you captured the queen!!! You're amazing...", "black", "yellow");
                    queenInPocket = false;
                }
                else {
                    notify("Ohh, don't be sad, try again to capture it! You'll be a master soon..", "red", "white");
                    queenInPocket = false;
                    queen.x = 300;
                    queen.y = 300;
                }
                waitForQueenCover = false;
            }
        }
    }
    if (nameChecked) {
        if (plrNameAlreadyTaken) {
            alert("Name already taken, choose another one");
            location.reload();
        } else {
            // Create new account and start playing
            startGame();
            updatePassword(plrName);
        }
        nameChecked = false;
    }
    // Check the password status
    if (passwordStatus === 1) {
        startGame();
        passwordStatus = 0;
    }
    continueQueenTimerUntilOverIfToDo();
    if (notifyTimeStarted) {
        notifyCountDownContinue();
    }
    if (notificationTime === 0) {
        notification.hide();
        notifyTimeStarted = false;
    }
}