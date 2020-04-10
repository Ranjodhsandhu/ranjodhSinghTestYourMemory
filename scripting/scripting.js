const testMemory = {};


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

    // sound clips courtesy of https://www.freesound.org
    const correctSound = $('#correctSound').get(0);
    const wrongSound = $('#wrongSound').get(0);
    const buttonClickSound = $('#buttonClickSound').get(0);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();

    // functions definitions
    /* object to get value from user */
    const inputOptions = {
        'false':'Go easy',
        'true':'A bit of Challenge'
    }

    async function f1() {
        const { value: userInput } =  await Swal.fire({
            title: 'Select level!!!',
            input: 'radio',
            inputOptions: inputOptions,
            allowOutsideClick:false
        });
        hard =  (userInput === 'true');
        $('.gameBoard').css('display', 'flex');
        $('.instructions').css('display', 'none');
        $('.home').css('display', 'none');
        start();
    }
    
    
    // Mute a the audio sound
    const muteAudio = function(element) {
        element.muted = !element.muted;
        element.pause();
        element.currentTime = 0;
    }
    
    // to mute all audio elements on the page
    const toggleMute = function() {
        const $soundOnOff = $('.mute').find($('.fas'));
        $soundOnOff.toggleClass('fa-volume-off').toggleClass('fa-volume-up');
        Array.from($('audio')).forEach(element => muteAudio(element));
        if($soundOnOff.hasClass('fa-volume-up'))
        playSound(correctSound);
    }
    
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
        // f1();
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
    
    // get the user input either easy or hard
    const getHardship = function(){

    }

    // add boxes to the container
    const addElements = ()=>{
        for (let x = 1; x <= totalBoxes; x++) {
            container
            .append(`<div class='box' id='box${x}' data-num='${x}'>
            <div class='innerContainer'>
                <label for="f${x}" class="sr-only">Box ${x}</label>
                <button class='boxFront' id="f${x}" aria-label="Box ${x}" tabindex="${8+x}"></button>
                <label for="b${x}" class="sr-only">Box ${x}</label>
                <button class='boxBack' id="b${x}"aria-label="Box ${x}"></button>
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
    
    const playSound = function(sound){
        sound.currentTime = 0;
        sound.play().then(()=>{
            sound.currentTime = 0;
        });
    }

    // check the results
    const checkResult = function(num){
        const lengthU = userSelectionArray.length;
        const lengthR = randomBoxSelection.length;
        const selectionIndex = randomBoxSelection.indexOf(num);
        updateCounter((boxToSelect - lengthU),stageDisplay);
        if(selectionIndex === -1 && (lengthU < lengthR)){
            $('.kg').fadeTo('slow', 1);
        } 

        if(lengthU !== lengthR)playSound(buttonClickSound);
        
        if(lengthU === lengthR){
            $('.kg').fadeTo('fast',0);
            let result = userSelectionArray.sort()
                            .every(function (value, index) { 
                            return value === randomBoxSelection.sort()[index] 
            });
            if(result){
                playSound(correctSound);
                setTimeout(stageProgress,0);
            }else{
                playSound(wrongSound);
                setTimeout(stageDiminish,0);
            }
            container.css('pointer-events','none');
        }
    }
    
    // if user guessed wrong then show the actual boxes
    const showActual = function(){
        const leftOvers = randomBoxSelection.filter(function (obj) { 
            return userSelectionArray.indexOf(obj) == -1; 
        });
        const childrenArray = Array.from(container.children('.box'));
        childrenArray.forEach(function(child){
            const childNum = parseInt(child.getAttribute('data-num'));
            if( leftOvers.indexOf(childNum) !== -1){
                $(child)
                .find('.boxFront')
                .addClass('boxRandom')
                .css('background-color', 'darkGreen')
                .css("pointer-events", "none");;   
            }
        });
    }
    
    // if user wins, user will go one stage up
    const stageProgress = function(){
        if(stage < maxStage){
            stage++;
            displayOverlay(stage);
        }
        else{
            alertUser('success','');
        }
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
    // this function uses the sweetAlert2 library
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

    // add tool tip to the action button on hovering
    if (window.matchMedia("(max-width: 767px)").matches)
    {console.log("mobile")}
    else{
        {console.log("desktop");}
        $('.guideTip').hover(function () {
        let title = $(this).attr('data-tooltip');
        $(this).data('tipText', title);
        if (title == '') { }
        else {
            $('<p class="tooltip"></p>').fadeIn(200).text(title).appendTo('body');
        }
    }, function () {
            $(this).attr('data-tooltip', $(this).data('tipText'));
            $('.tooltip').fadeOut(200);
        }).mousemove(function (e) {
        // tooltip should follow the cursor on desktop or laptop
        let mousex = e.pageX+30;
        let mousey = e.pageY+60;
        $('.tooltip').css({top: mousey,left: mousex});
    });
    }
    // define events here
    $('#reset').on('click', resetButtonClick);
    $('.boxContainer').on('click','.boxFront',boxClicked);
    
    $('.gameBoard').css('display','none');
    $('.instructions').css('display', 'none');

    $('.start').on('click',function(){
        f1();
        // start the game with initial stage or minStage
        // start();
    });    
    $('.how').on('click', function () {
        $('.instructions').css('display', 'flex');
        $('.home').css('display', 'none');
    });
    $('.mute').on('click',toggleMute);
    $('.back').on('click',function(){
        $('.home').css('display', 'flex');
        $('.gameBoard').css('display','none');
        $('.instructions').css('display', 'none');
    });
})();