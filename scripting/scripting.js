// load script when page is ready
(function () {
    // variable declaration
    const maxStage = 7;
    const minStage = 2;

    // starting stage
    let stage = 3;
    let stageDisplay = stage-1;
    // how many boxes to select
    let boxToSelect;
    // total boxes on the board
    let totalBoxes = stage * stage;
    // array to store random selections
    let randomBoxSelection = [];
    // array to store user selections
    let userSelectionArray = [];
    let hard = false;
    const container = $('.boxContainer');
    // time for the success alert to stay up
    const alertTimer = 1500;

    // functions definitions
    // look for how many boxes will be there for user to guess
    const boxes = ()=> {
        boxToSelect = stage;
        if(hard){
            if (stage === 3) { boxToSelect = stage; }
            if (stage === 4) { boxToSelect = stage + 1; }
            if (stage === 5) { boxToSelect = stage + 3; }
            if (stage === 6) { boxToSelect = stage + 5; }
            if (stage === 7) { boxToSelect = stage + 7; }
        }
    };

    // set the grid structure dynamically as per the number of boxes
    function setGridColumns(){
        document.documentElement.style.setProperty(`--gridColumns`, `${stage}`);
    };

    // start the game for any given stage
    const start = function () {

        reset();
        boxes();
        setGridColumns();
        stageDisplay = stage - 1;
        totalBoxes = stage * stage;
        updateCounter(boxToSelect,stageDisplay);
        addElements();
        // when the boxes are in place then call the function to show boxes to be selected
        makeRandomSelections();
        showRandomSelections();
        $('.kg').fadeTo('fast',0);
        
    };
    
    // add boxes to the container
    const addElements = ()=>{
        for (let x = 1; x <= totalBoxes; x++) {
            container
            .append(`<div class='box' id='box${x}' data-num='${x}'>
            <div class='innerContainer'>
            <div class='boxFront'></div>
            <div class='boxBack'></div>
            </div>
            </div>`
            );
        }    
    }
    // make the unique random selections out of the given boxes for user to guess
    const makeRandomSelections = function(){
        while (randomBoxSelection.length != boxToSelect) {
            let r = Math.floor(Math.random() * (totalBoxes)) + 1;
            if (randomBoxSelection.indexOf(r) === -1) randomBoxSelection.push(r);
        }
    }
    
    // show the green color on the random boxes for user to remember
    const showRandomSelections = function(){
        container.css('pointer-events', 'none');
        for (let j = 0; j < randomBoxSelection.length; j++) {
            let temporary = '';
            temporary = '#box' + randomBoxSelection[j];
            $(temporary).find('.boxFront').addClass('boxRandom');
            $(temporary).find('.boxBack').addClass('boxRandomBack');
            setTimeout(function(){
                $(temporary).find('.boxFront').removeClass('boxRandom');
                container.css('pointer-events', 'auto');
            },(2000 + (j*10)));
        }
    }
    
    // reset the stage for next or previous stage to appear
    const reset = function () {
        $('.boxContainer').empty();
        randomBoxSelection = [];
        userSelectionArray = [];
        resetButtonDelay();
    };
    
    // perform actions if user clicks any box to play
    const boxClicked = function (e) {
        e.preventDefault();
        const $boxClicked = $(this);
        const selection = parseInt($boxClicked.closest('.box').attr('data-num'));
        $boxClicked.closest('.box').addClass('active');
        // to know if the selected box is added to the user selection array
        if (!$boxClicked.hasClass('boxSelected')) {
            userSelectionArray.push(selection);
            $boxClicked.addClass('boxSelected');
        }
        checkResult(selection);
    };
    
    // check the results
    const checkResult = function(num){
        const lengthU = userSelectionArray.length;
        const lengthR = randomBoxSelection.length;
        const selectionIndex = randomBoxSelection.indexOf(num);
        updateCounter((boxToSelect - lengthU),stageDisplay);
        if(selectionIndex === -1 && (lengthU < lengthR)){
            $('.kg').fadeTo('slow', 1);
        } 
        if(lengthU === lengthR){
            $('.kg').fadeTo('fast',0);
            let result = userSelectionArray.sort().every(function (value, index) { 
                return value === randomBoxSelection.sort()[index] 
            });
            if(result){
                setTimeout(stageProgress,0);
            }else{
                setTimeout(stageDiminish,0);
            }
            container.css('pointer-events','none');
        }
    }
    
    // if user guessed wrong then show the actual boxes
    const showActual = function(){
        const leftOvers = randomBoxSelection.filter(function (obj) { return userSelectionArray.indexOf(obj) == -1; });
        const childrenArray = Array.from(container.children('.box'));
        childrenArray.forEach(function(child){
            const childNum = parseInt(child.getAttribute('data-num'));
            if( leftOvers.indexOf(childNum) !== -1){
                $(child).find('.boxFront').addClass('boxRandom').css('background-color', 'darkGreen').css("pointer-events", "none");;   
            }
        });
    }
    
    // if user wins, user will go one stage up
    const stageProgress = function(){
        if(stage < maxStage){
            stage++;
            displayOverlay(stage);
        }
        else
        alertUser('success','');
        
        setTimeout(start,(alertTimer+1000));
    }
    // if user loses, user will go one stage down
    const stageDiminish = function(){
        if(stage > minStage){
            stage--;
            displayOverlay(stage);
        }
        else
            alertUser('error','');
        
        setTimeout(showActual,500);
        setTimeout(start,(alertTimer+1000));
    }
    const displayOverlay = function(stage){
        stageDisplay = stage - 1;
        const $overlay = $('.overlay');
        $overlay.find('.txt').text('Stage '+stageDisplay);
        $overlay.fadeIn(alertTimer);
        $overlay.fadeOut(1000);
    }
    const alertUser = function(result,resultQuote){
        Swal.fire({
            position: 'center',
            icon: result,
            title: resultQuote,
            timer: alertTimer,
            showConfirmButton: false,
            allowOutsideClick:false
        });
    }

    // update the game info counter
    const updateCounter = function(boxes,stageDisplay){
        $('.selectionsLeft span').text(boxes);
        $('.stage span').text(stageDisplay);
    }

    // put a delay on the reset button once it is clicked
    const resetButtonClick = function () {
        start();
        resetButtonDelay();
    }
    const resetButtonDelay = ()=>{
        const $reset = $('#reset');
        $reset.prop('disabled', true);
        setTimeout(function () {
            $reset.prop('disabled', false);
        }, 2000);
    }
    
    // define events here
    $('#reset').on('click', resetButtonClick);
    $('.boxContainer').on('click','.boxFront',boxClicked);
    
    $('.gameBoard').css('display','none');
    $('.instructions').css('display', 'none');

    $('div.start').on('click',function(){
        $('.gameBoard').css('display','flex');
        $('.home').css('display','none');
    });
    
    $('div.how').on('click', function () {
        $('.instructions').css('display', 'flex');
        $('.home').css('display', 'none');
    });
    // start the game with initial stage or minStage
    start();
})();