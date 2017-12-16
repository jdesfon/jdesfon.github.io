//TABLE MOCKING THE GAME TO ALLOW EASIER TREATEMENT
var mockTable = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

//TABLE WITH POSITIONS CLASS NAME ORDERED AS THE GAME PLATFORM
var classList = [
    ["position1-1", "position1-2", "position1-3", "position1-4"],
    ["position2-1", "position2-2", "position2-3", "position2-4"],
    ["position3-1", "position3-2", "position3-3", "position3-4"],
    ["position4-1", "position4-2", "position4-3", "position4-4"]
];

var score = 0;

var hasLost = function() {
    var line = 0;
    while (line < 4) {
        col = 0;
        while (col < 3) {
            if (mockTable[line][col] == mockTable[line][col + 1]) {
                return false;
            }
            col++;
        }
        line++;
    }
    var col = 0;
    while (col < 4) {
        line = 0;
        while (line < 3) {
            if (mockTable[line][col] == mockTable[line + 1][col]) {
                return false;
            }
            line++;
        }
        col++;
    }
    return true;
}

//COMPARE TWO ARRAYS BY VALUE
var arrayIsEqual = function(a, b) {
    var line = 0;
    while (line < 4) {
        col = 0;
        while (col < 4) {
            if (a[line][col] != b[line][col]) {
                return false;
            }
            col++;
        }
        line++;
    }
    return true;
}

//GENERATE RANDOM NUMBERS
var getRandom = function(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

/*  GAME */
//FUNCTION TO GENERATE TWO GENERATE TWO TILES WITH RANDOM POSITION
var newTile = function(int) {
    var i = 0;
    while (i < int) {
        var mockX = getRandom(0, 3);
        var mockY = getRandom(0, 3);
        if (mockTable[mockX][mockY] == 0) {
            var value = Math.random() < 0.9 ? 2 : 4;
            mockTable[mockX][mockY] = value;
            $(".tile-container > div").append("<canvas class='tile " + classList[mockX][mockY] + " val" + value + "'></canvas>");
        } else {
            newTile(int - i);
        }
        i++;
    }
}

//MOVE A CANVAS
var updateTable = function() {
    $("canvas.tile").remove();
    var line = 0;
    while (line < 4) {
        var col = 0;
        while (col < 4) {
            if (mockTable[line][col] != 0) {
                var value = mockTable[line][col];
                $(".tile-container > div").append("<canvas class='tile " + classList[line][col] + " val" + value + "'></canvas>");
            }
            col++;
        }
        line++;
    }
}

var updateScore = function() {
    //UPDATE SCORE
    $('.scores-container>p').text(score);
    $.ajax({
        url: 'scores.php', // La ressource ciblée
        type: 'GET', // Le type de la requête HTTP.
        data: 'score=' + score
    });

    //GET BEST SCORE
    /*$.get('scores.php', function(data) {
        $('.best-container>p').text(data[0].bestscore); //BEST SCORE
    });*/

}

//MERGE
var mergeLeft = function() {
    //PARCOURIR CHAQUE LIGNE DE GAUCHE A DROITE
    var line = 0 //haut
    while (line < 4) {
        var col = 0; //GAUCHE
        while (col < 3) {
            if (col == 0 && mockTable[line][col] == mockTable[line][col + 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                if (mockTable[line][col + 2] == mockTable[line][col + 3]) {
                    mockTable[line][col + 1] = mockTable[line][col + 2] * 2;
                    score += mockTable[line][col + 1];
                    mockTable[line][col + 2] = 0;
                } else {
                    mockTable[line][col + 1] = mockTable[line][col + 2];
                    mockTable[line][col + 2] = mockTable[line][col + 3];;
                    mockTable[line][col + 3] = 0;
                }
            }
            if (col == 1 && mockTable[line][col] == mockTable[line][col + 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line][col + 1] = mockTable[line][col + 2];
                mockTable[line][col + 2] = 0;
            }
            if (col == 2 && mockTable[line][col] == mockTable[line][col + 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line][col + 1] = 0;
            }
            col++;
        }
        line++
    }
    updateTable();
}

var moveLeft = function() {
    //PARCOURIR CHAQUE LIGNE DE GAUCHE A DROITE
    var line = 0 //haut
    while (line < 4) {
        var nTile = 0;
        var col = 0; //GAUCHE
        while (col < 4) {
            if (mockTable[line][col] != 0) {
                mockTable[line][nTile] = mockTable[line][col];
                if (col > nTile) {
                    mockTable[line][col] = 0;
                }
                nTile++
            }
            col++;
        }
        line++
    }
    mergeLeft();
}

var mergeRight = function() {
    //PARCOURIR CHAQUE LIGNE DE DROITE A GAUCHE
    var line = 0 //haut
    while (line < 4) {
        var col = 3; //DROITE        
        while (col > -1) {
            if (col == 3 && mockTable[line][col] == mockTable[line][col - 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                if (mockTable[line][col - 2] == mockTable[line][col - 3]) {
                    mockTable[line][col - 1] = mockTable[line][col - 2] * 2;
                    score += mockTable[line][col - 1];
                    mockTable[line][col - 2] = 0;
                } else {
                    mockTable[line][col - 1] = mockTable[line][col - 2];
                    mockTable[line][col - 2] = mockTable[line][col - 3];
                    mockTable[line][col - 3] = 0;
                }
            }
            if (col == 2 && mockTable[line][col] == mockTable[line][col - 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line][col - 1] = mockTable[line][col - 2];
                mockTable[line][col - 2] = 0;
            }
            if (col == 1 && mockTable[line][col] == mockTable[line][col - 1]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line][col - 1] = 0;
            }
            col--;
        }
        line++;
    }
    updateTable();
}

var moveRight = function() {
    //PARCOURIR CHAQUE LIGNE DE DROITE A GAUCHE
    var line = 0 //haut
    while (line < 4) {
        var nTile = 0;
        var col = 3; //DROITE        
        while (col > -1) {
            if (mockTable[line][col] != 0) {
                mockTable[line][3 - nTile] = mockTable[line][col];
                if (col < 3 - nTile) {
                    mockTable[line][col] = 0;
                }
                nTile++;
            }
            col--;
        }
        line++;
    }
    mergeRight();
}

//MERGE
var mergeUp = function() {
    //PARCOURIR CHAQUE COLONNE DE HAUT EN BAS
    var col = 0 //gauche
    while (col < 4) {
        var line = 0; //HAUT
        while (line < 3) {
            if (line == 0 && mockTable[line][col] == mockTable[line + 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                if (mockTable[line + 2][col] == mockTable[line + 3][col]) {
                    mockTable[line + 1][col] = mockTable[line + 2][col] * 2;
                    score += mockTable[line + 1][col];
                    mockTable[line + 2][col] = 0;
                } else {
                    mockTable[line + 1][col] = mockTable[line + 2][col];
                    mockTable[line + 2][col] = mockTable[line + 3][col];
                    mockTable[line + 3][col] = 0;
                }
            }
            if (line == 1 && mockTable[line][col] == mockTable[line + 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line + 1][col] = mockTable[line + 2][col];
                mockTable[line + 2][col] = 0;
            }
            if (line == 2 && mockTable[line][col] == mockTable[line + 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line + 1][col] = 0;
            }
            line++;
        }
        col++
    }
    updateTable();
}

var moveUp = function() {
    //PARCOURIR CHAQUE COLONNE DE HAUT EN BAS
    var col = 0; //gauche
    while (col < 4) {
        var nTile = 0;
        var line = 0; //HAUT        
        while (line < 4) {
            if (mockTable[line][col] != 0) {
                mockTable[nTile][col] = mockTable[line][col];
                if (line > nTile) {
                    mockTable[line][col] = 0;
                }
                nTile++;
            }
            line++;
        }
        col++;
    }
    mergeUp()
}

var mergeDown = function() {
    //PARCOURIR CHAQUE COLONNE DE BAS EN HAUT //CHECK
    var col = 0 //gauche
    while (col < 4) {
        var line = 3; //BAS        
        while (line > -1) {
            if (line == 3 && mockTable[line][col] == mockTable[line - 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                if (mockTable[line - 2][col] == mockTable[line - 3][col]) {
                    mockTable[line - 1][col] = mockTable[line - 2][col] * 2;
                    score += mockTable[line - 1][col];
                    mockTable[line - 2][col] = 0;
                } else {
                    mockTable[line - 1][col] = mockTable[line - 2][col];
                    mockTable[line - 2][col] = mockTable[line - 3][col];
                    mockTable[line - 3][col] = 0;
                }
            }
            if (line == 2 && mockTable[line][col] == mockTable[line - 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line - 1][col] = mockTable[line - 2][col];
                mockTable[line - 2][col] = 0;

            }
            if (line == 1 && mockTable[line][col] == mockTable[line - 1][col]) {
                mockTable[line][col] *= 2;
                score += mockTable[line][col];
                mockTable[line - 1][col] = 0;
            }
            line--;
        }
        col++;
    }
    updateTable();
}

var moveDown = function() {
    //PARCOURIR CHAQUE COLONNE DE BAS EN HAUT
    var col = 0; //gauche
    while (col < 4) {
        var nTile = 0;
        var line = 3; //BAS        
        while (line > -1) {
            if (mockTable[line][col] != 0) {
                mockTable[3 - nTile][col] = mockTable[line][col];
                if (line < 3 - nTile) {
                    mockTable[line][col] = 0;
                }
                nTile++;
            }
            line--;
        }
        col++;
    }
    mergeDown()
}

newGame = function() {
    //INITIALISE MOCKTABLE
    var line = 0;
    while (line < 4) {
        col = 0;
        while (col < 4) {
            mockTable[line][col] = 0;
            col++;
        }
        line++;
    }
    score *= 0;
    //INITIALISE SCORE
    $('.scores-container>p').remove();
    $('.best-container>p').remove();
    $(".tile-container > div > canvas").remove();

    //GET BEST SCORE
    $.get('scores.php', function(data) {
        $('.best-container').append('<p>' + data[0].bestscore + '</p>'); //BEST SCORE
    });
    //DISPLAY SCORE
    $('.scores-container').append('<p>0</p>');
    newTile(2); //START GAME    
}

$(".new-game").click(function() {
    //INITIALISE MOCKTABLE
    var line = 0;
    while (line < 4) {
        col = 0;
        while (col < 4) {
            mockTable[line][col] = 0;
            col++;
        }
        line++;
    }
    score *= 0;
    //INITIALISE SCORE
    $('.scores-container>p').remove();
    $('.best-container>p').remove();
    $(".tile-container > div > canvas").remove();

    //GET BEST SCORE
    $.get('scores.php', function(data) {
        $('.best-container').append('<p>' + data[0].bestscore + '</p>'); //BEST SCORE
    });
    //DISPLAY SCORE
    $('.scores-container').append('<p>0</p>');
    newTile(2); //START GAME    
})

$("body").keydown(function(e) {
    if (e.keyCode == 37) { // left
        var before = JSON.parse(JSON.stringify(mockTable)); //copy of mocktable by values
        moveLeft();
    } else if (e.keyCode == 39) { // right
        var before = JSON.parse(JSON.stringify(mockTable));
        moveRight();
    } else if (e.keyCode == 38) { //up
        var before = JSON.parse(JSON.stringify(mockTable));
        moveUp();
    } else if (e.keyCode == 40) { //down
        var before = JSON.parse(JSON.stringify(mockTable));
        moveDown();
    };
    if (arrayIsEqual(before, mockTable) == 0) { //COMPARE TWO DIM ARRAYS
        newTile(1);
    } else if ($("canvas.tile").length == 16) {
        if (hasLost()) {
            alert("GAME OVER");
            newGame();
        }
    }
    updateScore();
});
