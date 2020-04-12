// object to carry the app
const memoryApp = {};

memoryApp.maxStage = 7;
memoryApp.minStage = 2;
// starting stage
memoryApp.stage = 7;
memoryApp.stageDisplay = memoryApp.stage - 1;
// how many boxes to select
memoryApp.boxToSelect = 0;
memoryApp.totalBoxes = memoryApp.stage * memoryApp.stage;
// array to store random selections
memoryApp.randomBoxSelection = [];
// array to store user selections
memoryApp.userSelectionArray = [];
memoryApp.hard = false;
memoryApp.container = $('.boxContainer');
// time for the success alert to stay up
memoryApp.alertTimer = 1500;
// sound clips courtesy of https://www.freesound.org
memoryApp.correctSound = $('#correctSound').get(0);
memoryApp.wrongSound = $('#wrongSound').get(0);
memoryApp.buttonClickSound = $('#buttonClickSound').get(0);
// object to get value from user 
memoryApp.inputOptions = {
    'false': 'Go easy',
    'true': 'A bit of Challenge'
};


// functions definitions
memoryApp.head = async function () {
    const { value: userInput } = await Swal.fire({
        title: 'Select level!!!',
        input: 'radio',
        inputValue: 'false',
        inputOptions: memoryApp.inputOptions,
        allowOutsideClick: false
    });
    memoryApp.hard = (userInput === 'true');
    $('.gameBoard').css('display', 'flex');
    $('.instructions').css('display', 'none');
    $('.home').css('display', 'none');
    memoryApp.start();
};

// Mute a the audio sound
memoryApp.muteAudio = function (element) {
    element.muted = !element.muted;
    element.pause();
    element.currentTime = 0;
};
// to mute all audio elements on the page
memoryApp.toggleMute = function () {
    const $soundOnOff = $('.mute').find($('.fas'));
    $soundOnOff.toggleClass('fa-volume-off').toggleClass('fa-volume-up');
    Array.from($('audio')).forEach(element => memoryApp.muteAudio(element));
    if ($soundOnOff.hasClass('fa-volume-up'))
    memoryApp.playSound(memoryApp.correctSound);
}
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    
// look for how many boxes will be there for user to guess
memoryApp.boxes = () => {
    memoryApp.boxToSelect = memoryApp.stage;
    if(memoryApp.hard){
        if (memoryApp.stage === 3) { memoryApp.boxToSelect = memoryApp.stage; }
        if (memoryApp.stage === 4) { memoryApp.boxToSelect = memoryApp.stage + 1; }
        if (memoryApp.stage === 5) { memoryApp.boxToSelect = memoryApp.stage + 3; }
        if (memoryApp.stage === 6) { memoryApp.boxToSelect = memoryApp.stage + 5; }
        if (memoryApp.stage === 7) { memoryApp.boxToSelect = memoryApp.stage + 7; }
    }
};

// set the grid structure dynamically as per the number of boxes
memoryApp.setGridColumns = function (){
    document.documentElement.style.setProperty(`--gridColumns`, `${memoryApp.stage}`);
};
    
// start the game for any given stage
memoryApp.start = function () {
    memoryApp.reset();
    memoryApp.boxes();
    memoryApp.setGridColumns();
    memoryApp.stageDisplay = memoryApp.stage - 1;
    memoryApp.totalBoxes = memoryApp.stage * memoryApp.stage;
    memoryApp.updateCounter(memoryApp.boxToSelect, memoryApp.stageDisplay);
    memoryApp.addElements();
    // when the boxes are in place then call the function to show boxes to be selected
    memoryApp.makeRandomSelections();
    memoryApp.showRandomSelections();
    $('.kg').fadeTo('fast',0);  
};

// add boxes to the container
memoryApp.addElements = ()=>{
    for (let x = 1; x <= memoryApp.totalBoxes; x++) {
        memoryApp.container.append(`
        <div class='box' id='box${x}' data-num='${x}'>
            <div class='innerContainer'>
                <label for="f${x}" class="sr-only">Box ${x}</label>
                <button class='boxFront' id="f${x}" aria-label="Box ${x}" tabindex="${10+x}"></button>
                <label for="b${x}" class="sr-only">Box ${x}</label>
                <button class='boxBack' id="b${x}"aria-label="Box ${x}"></button>
            </div>
        </div>`
        );
    }    
}

// make the unique random selections out of the given boxes for user to guess
memoryApp.makeRandomSelections = function(){
    while (memoryApp.randomBoxSelection.length != memoryApp.boxToSelect) {
        let r = Math.floor(Math.random() * (memoryApp.totalBoxes)) + 1;
        if (memoryApp.randomBoxSelection.indexOf(r) === -1) memoryApp.randomBoxSelection.push(r);
    }
}
    
// show the green color on the random boxes for user to remember
memoryApp.showRandomSelections = function(){
    memoryApp.container.css('pointer-events', 'none');
    for (let j = 0; j < memoryApp.randomBoxSelection.length; j++) {
        let temporary = '#box' + memoryApp.randomBoxSelection[j];
        $(temporary).find('.boxFront').addClass('boxRandom');
        $(temporary).find('.boxBack').addClass('boxRandomBack');
        setTimeout(function(){
            $(temporary).find('.boxFront').removeClass('boxRandom');
            memoryApp.container.css('pointer-events', 'auto');
        },(2000 + (j*10)));
    }
}
    
// reset the stage for next or previous stage to appear
memoryApp.reset = function () {
    $('.boxContainer').empty();
    memoryApp.randomBoxSelection = [];
    memoryApp.userSelectionArray = [];
    memoryApp.resetButtonDelay();
};
    
// perform actions if user clicks any box to play
memoryApp.boxClicked = function (e) {
    e.preventDefault();
    const $boxClicked = $(this);
    const selection = parseInt($boxClicked.closest('.box').attr('data-num'));
    $boxClicked.closest('.box').addClass('active');
    // to know if the selected box is added to the user selection array
    if (!$boxClicked.hasClass('boxSelected')) {
        memoryApp.userSelectionArray.push(selection);
        $boxClicked.addClass('boxSelected');
    }
    memoryApp.checkResult(selection);
};
memoryApp.playSound = function(sound){  
    sound.currentTime = 0;
    sound.play();
}

// check the results
memoryApp.checkResult = function(num){
    const lengthU = memoryApp.userSelectionArray.length;
    const lengthR = memoryApp.randomBoxSelection.length;
    const selectionIndex = memoryApp.randomBoxSelection.indexOf(num);
    memoryApp.updateCounter((memoryApp.boxToSelect - lengthU), memoryApp.stageDisplay);
    if(selectionIndex === -1 && (lengthU < lengthR)){
        $('.kg').fadeTo('slow', 1);
    } 

    if (lengthU !== lengthR) memoryApp.playSound(memoryApp.buttonClickSound);
    
    if(lengthU === lengthR){
        $('.kg').fadeTo('fast',0);
        let result = memoryApp.userSelectionArray.sort()
                        .every(function (value, index) { 
                            return value === memoryApp.randomBoxSelection.sort()[index] 
                        });
        if(result){
            memoryApp.playSound(memoryApp.correctSound);
            setTimeout(memoryApp.stageProgress,0);
        }else{
            memoryApp.playSound(memoryApp.wrongSound);
            setTimeout(memoryApp.stageDiminish,0);
        }
        memoryApp.container.css('pointer-events','none');
    }
}
    
// if user guessed wrong then show the actual boxes
memoryApp.showActual = function(){
    const leftOvers = memoryApp.randomBoxSelection.filter(function (obj) { 
        return memoryApp.userSelectionArray.indexOf(obj) == -1; 
    });
    const childrenArray = Array.from(memoryApp.container.children('.box'));
    childrenArray.forEach(function(child){
        const childNum = parseInt(child.getAttribute('data-num'));
        if( leftOvers.indexOf(childNum) !== -1){
            $(child)
            .find('.boxFront')
            .addClass('boxRandom')
            .css('background-color', 'darkGreen')
            .css('pointer-events', 'none');   
        }
    });
}
    
// if user wins, user will go one stage up
memoryApp.stageProgress = function(){
    if (memoryApp.stage < memoryApp.maxStage){
        memoryApp.stage++;
        memoryApp.displayOverlay(memoryApp.stage);
        setTimeout(memoryApp.start, (memoryApp.alertTimer+1000));
    }
    else{
        memoryApp.getRandomFact();
    }
}
// if user loses, user will go one stage down
memoryApp.stageDiminish = function(){
    if (memoryApp.stage > memoryApp.minStage){
        memoryApp.stage--;
        memoryApp.displayOverlay(memoryApp.stage);
    }
    else
        memoryApp.alertUser('error','');
    
    setTimeout(memoryApp.showActual,500);
    setTimeout(memoryApp.start, (memoryApp.alertTimer+1000));
}

memoryApp.displayOverlay = function (givenStage){
    const $overlay = $('.overlay');
    $overlay.find('.txt').text('Stage ' + (givenStage - 1));
    $overlay.fadeIn(memoryApp.alertTimer);
    $overlay.fadeOut(1000);
}

// this function uses the sweetAlert2 library
memoryApp.alertUser = function(result,resultQuote){
    Swal.fire({
        position: 'center',
        icon: result,
        title: resultQuote,
        timer: memoryApp.alertTimer,
        showConfirmButton: false,
        allowOutsideClick:false
    });
}
// update the game info counter
memoryApp.updateCounter = function(boxes,stageDisplay){
    $('.selectionsLeft span').text(boxes);
    $('.stage span').text(stageDisplay);
}

// put a delay on the reset button once it is clicked
memoryApp.resetButtonClick =  () => {
    memoryApp.start();
    memoryApp.resetButtonDelay();
}
memoryApp.resetButtonDelay = ()=>{
    const $reset = $('#reset');
    $reset.prop('disabled', true);
    setTimeout(function () {
        $reset.prop('disabled', false);
    }, 2000);
}

memoryApp.displayTooltip = function(){
    // add tool tip to the action button on hovering
    if (window.matchMedia("(max-width: 767px)").matches)
    {}
    else{
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
}

// for fun-reward at the last stage user get to read a joke or fun fact
// use the ajax call to get the joke from api
memoryApp.getRandomFact = function() {
    memoryApp.alertUser('success','');
    $.ajax({
        // to get general type jokes
        url:'https://official-joke-api.appspot.com/jokes/random',
        method: 'GET',
        format: 'json'
    }).then(function (result) {
        const question = result.setup;
        const answer = result.punchline;
        memoryApp.showRandomFact(`${question}\n.\n.\n.\n${answer}`);
    });
}

// show the joke to user and wait for confirmation to finish reading
memoryApp.showRandomFact = async function(fact){
    const gotFact = await Swal.fire({
        title: fact,
        showConfirmButton: true,
        allowOutsideClick: false
    });
    if(gotFact){
        setTimeout(memoryApp.start, 0);
    }
}

// define events here
memoryApp.init = function(){
    $('#reset').on('click', memoryApp.resetButtonClick);
    $('.boxContainer').on('click', '.boxFront', memoryApp.boxClicked);
    
    $('.gameBoard').css('display','none');
    $('.instructions').css('display', 'none');

    $('.start').on('click',function(){
        memoryApp.head();
    });    
    $('.how').on('click', function () {
        $('.instructions').css('display', 'flex');
        $('.home').css('display', 'none');
    });
    $('.mute').on('click', memoryApp.toggleMute);
    $('.back').on('click',function(){
        $('.home').css('display', 'flex');
        $('.gameBoard').css('display','none');
        $('.instructions').css('display', 'none');
    });
    memoryApp.displayTooltip();
}


// load script when page is ready
(function () {
    memoryApp.init();
});