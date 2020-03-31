
// load script when page is ready
(function () {
    // variable declaration
    const maxStage = 6;
    const minStage = 3;

    let stage = 3;
    let boxToSelect = stage;
    
    let totalBoxes = stage * stage;
    let randomBoxSelection = [];
    let userSelectionArray = [];
    let containerWidth = 300;
    
    // functions definitions
    // look for how many boxes will be there for user to guess
    const boxes = ()=> {
        if (stage === 3) { boxToSelect = stage; containerWidth = 420;}
        if (stage === 4) { boxToSelect = stage + 1; containerWidth = 540;}
        if (stage === 5) { boxToSelect = stage + 3; containerWidth = 660;}
        if (stage === 6) { boxToSelect = stage + 5; containerWidth = 780;}
    };

    // set the grid structure dynamically as per the number of boxes
    function setGridSizing(){
        document.documentElement.style.setProperty(`--gridColumns`, `${stage-1}`);
        document.documentElement.style.setProperty(`--containerWidth`, `${containerWidth}px`);
        let boxWidth = 100;
        let boxHeight = 100;
        document.documentElement.style.setProperty(`--boxWidth`, `${boxWidth}px`);
        document.documentElement.style.setProperty(`--boxHeight`, `${boxHeight}px`);
    };

    // start the game for any given stage
    const start = function () {
        reset();
        boxes();
        setGridSizing();
        updateCounter(boxToSelect,stage-2);
        // re-calculate total boxes as per the stage
        totalBoxes = stage * stage;
        // add boxes to the container
        for (let x = 1; x <= totalBoxes; x++) {
            $('.boxContainer')
            .append(`<div class="box" id=\"box${x}\" data-num=\"${x}\">
                        <div class="card">
                            <div class="boxFront"></div>
                            <div class="boxBack"></div>
                        </div>
                    </div>`
                );
        }
        // when the boxes are in place then call the function to show boxes to be selected
        makeRandomSelections();
        showRandomSelections();
    };
    
    // make the unique random selections out of the given boxes for user to guess
    const makeRandomSelections = function(){
        while (randomBoxSelection.length != boxToSelect) {
            let r = Math.floor(Math.random() * (totalBoxes)) + 1;
            if (randomBoxSelection.indexOf(r) === -1) randomBoxSelection.push(r);
        }
    }
    
    // show the green color on the random boxes for user to remember
    const showRandomSelections = function(){
        for (let j = 0; j < randomBoxSelection.length; j++) {
            let temporary = '';
            temporary = '#box' + randomBoxSelection[j];
            $(temporary).find('.boxFront').addClass('boxRandom');
            $(temporary).find('.boxBack').addClass('boxRandomBack');
            setTimeout(function(){
                $(temporary).find('.boxFront').removeClass('boxRandom');
            },(2000 + (j*100)));
        }
    }


    // reset the stage for next of previous stage to appear
    const reset = function () {
        $('.boxContainer').empty();
        randomBoxSelection = [];
        userSelectionArray = [];
    };

    // perform actions if user clicks any box to play
    const boxClicked = function (e) {
        e.preventDefault();
        const selection = parseInt($(this).closest('.box').attr('data-num'));
        const selectionIndex = randomBoxSelection.indexOf(selection);
        
        $(this).closest('.box').addClass('active');
        console.log($(this).closest('.box'));

        if (selectionIndex !== -1) {
            if (!$(this).hasClass("boxSelected")) {
                userSelectionArray.push(selection);
                $(this).addClass("boxSelected");
            }
        } else {
            stageDiminish();
        }
        updateCounter((boxToSelect - userSelectionArray.length),stage-2);
        if(userSelectionArray.length === boxToSelect){
            stageProgress();
            // start();
        }
    };
    
    // if user wins, user will go one stage up
    const stageProgress = function(){
        if(stage < maxStage){
            alert("You won");
            stage++;
        }
        else
        alert("You have a very sharp memory");

        start();
    }

    // if user loses, user will go one stage down
    const stageDiminish = function(){
        if(stage > minStage){
            alert("Wrong answer...Please try again");
            stage--;
        }
        else
            alert("Please try again");
        start();
    }

    // update the game info counter
    const updateCounter = function(boxes,stage){
        $('.selectionsLeft span').text(boxes);
        $('.stage span').text(stage);
    }

    // put a delay on the reset button once it is clicked
    const resetClickDelay = function (e) {
        e.preventDefault();
        start();
        const $this = $(this);
        $this.prop("disabled", true);
        setTimeout(function () {
            $this.prop("disabled", false);
        }, 5000);
    }
    
    // define events here
    $('#reset').on('click', resetClickDelay);
    $('.boxContainer').on('click',".boxFront",boxClicked);
    
    // start the game with initial stage or minStage
    start();
})();