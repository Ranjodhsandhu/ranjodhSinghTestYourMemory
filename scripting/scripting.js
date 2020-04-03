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
        updateCounter(boxToSelect,stageDisplay);
        // re-calculate total boxes as per the stage
        totalBoxes = stage * stage;
        // add boxes to the container
        for (let x = 1; x <= totalBoxes; x++) {
            $('.boxContainer')
            .append(`<div class="box" id=\"box${x}\" data-num=\"${x}\">
            <div class="innerContainer">
            <div class="boxFront"></div>
            <div class="boxBack"></div>
            </div>
            </div>`
            );
        }
        // when the boxes are in place then call the function to show boxes to be selected
        makeRandomSelections();
        showRandomSelections();
        $('.kg').fadeTo("slow", 0);//.css("visibility", "hidden");
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
            },(2000 + (j*10)));
        }
    }


    // reset the stage for next or previous stage to appear
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
        const $boxClicked = $(this);
        $boxClicked.closest('.box').addClass('active');
        if (!$boxClicked.hasClass('boxSelected')) {
            userSelectionArray.push(selection);
            $boxClicked.addClass('boxSelected');
        }
        $('.kg').fadeTo("slow", 0);//.css('visibility', 'hidden');
        if(selectionIndex === -1 && (userSelectionArray.length < randomBoxSelection.length)){
            console.log("keep clicking");
            $('.kg').fadeTo("slow", 1);//.fadeIn().css('visibility', 'visible');
        } 
        updateCounter((boxToSelect - userSelectionArray.length),stageDisplay);
        if(userSelectionArray.length === randomBoxSelection.length){
            let result = false;
            result = userSelectionArray.sort().every(function (value, index) { return value === randomBoxSelection.sort()[index] });
            if(result){
                setTimeout(stageProgress,0);
            }else{
                showActuals();
                setTimeout(stageDiminish,0);
            }
        }
    };
    // if user guessed wrong then show the actual boxes
    const showActuals = function(){
        
    }
    // if user wins, user will go one stage up
    const stageProgress = function(){
        if(stage < maxStage){
            stage++;
            alertUser('success','Success!!!');
        }
        else
            alertUser('success','You have SHARP Memory!!!');
            
        setTimeout(start,(alertTimer+100));
    }
    // if user loses, user will go one stage down
    const stageDiminish = function(){
        if(stage > minStage){
            alertUser('error','Try Again!!!');
            stage--;
        }
        else
            alertUser('error','Try Again!!!');

        setTimeout(start,(alertTimer+100));
    }
    const alertUser = function(result,resultQuote){
        let timerInterval;
        Swal.fire({
            position: 'top',
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