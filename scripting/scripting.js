// load script when page is ready
(function () {
    // variable declaration
    const maxStage = 7;
    const minStage = 2;
    // starting stage
    let stage = 2;
    // how many boxes to select
    let boxToSelect;
    // total boxes on the board
    let totalBoxes = stage * stage;
    // array to store random selections
    let randomBoxSelection = [];
    // array to store user selections
    let userSelectionArray = [];
    // time for the success alert to stay up
    const alertTimer = 1000;
    // view port width
    let vWidth = $(window).width();

    // functions definitions
    // look for how many boxes will be there for user to guess
    const boxes = ()=> {
        boxToSelect = stage;
        // if (stage === 3) { boxToSelect = stage; }
        // if (stage === 4) { boxToSelect = stage + 1; }
        // if (stage === 5) { boxToSelect = stage + 3; }
        // if (stage === 6) { boxToSelect = stage + 5; }
        // if (stage === 7) { boxToSelect = stage + 7; }
    };

    // set the grid structure dynamically as per the number of boxes
    function setGridColumns(){
        document.documentElement.style.setProperty(`--gridColumns`, `${stage-1}`);
        let [width,height] = getBoxWidthHeight();
        console.log(width+":"+height+"::stage:"+stage+"::width:"+vWidth);
        document.documentElement.style.setProperty(`--boxWidth`, `${width}rem`);
        document.documentElement.style.setProperty(`--boxHeight`, `${height}rem`);
    };
    
    const getBoxWidthHeight = () => {
        let [width,height] = [6,6];
        if (vWidth < 800 && stage >= 6) { console.log("6th");width = 5;height = 5;}
        if (vWidth < 580 && stage >= 7) { console.log("5th");width = 4.5;height = 4.5;}
        if (vWidth < 400 && stage >= 6) { console.log("4th");width = 4;height = 4;}
        if (vWidth < 350 && stage >= 7) { console.log("3rd");width = 3.7;height = 3.7;}
        if (vWidth < 350 && stage >= 6) { console.log("2nd");width = 4;height = 4;}
        if (vWidth < 350 && stage >= 4){ console.log("1st");width = 3.7;height = 3.7;}
        return [width,height];
    }
    // start the game for any given stage
    const start = function () {
        reset();
        boxes();
        setGridColumns();
        updateCounter(boxToSelect,stage-2);
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
        if (selectionIndex !== -1) {
            if (!$(this).hasClass("boxSelected")) {
                userSelectionArray.push(selection);
                $(this).addClass("boxSelected");
            }
        } else {
            setTimeout(stageDiminish,0);
        }
        updateCounter((boxToSelect - userSelectionArray.length),stage-2);
        if(userSelectionArray.length === boxToSelect){
            // put the stage progress function call to the end of the stack to make it work as expected in this case
            setTimeout(stageProgress,0);
        }
    };
    
    // if user wins, user will go one stage up
    const stageProgress = function(){
        if(stage < maxStage){
            stage++;
            alertUser('success','Success!!!');
        }
        else
            alertUser('success','You have SHARP Memory!!!');
            
        setTimeout(start,(alertTimer+200));
    }
    // if user loses, user will go one stage down
    const stageDiminish = function(){
        if(stage > minStage){
            alertUser('error','Try Again!!!');
            stage--;
        }
        else
            alertUser('error','Try Again!!!');

        setTimeout(start,alertTimer);
    }
    const alertUser = function(result,resultQuote){
        let timerInterval;
        Swal.fire({
            position: 'top',
            icon: result,
            title: resultQuote,
            timer: alertTimer,
            showConfirmButton: false
        });
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
    $(window).on('resize', () => {
        if ($(this).width() != vWidth) {
            vWidth = $(this).width();
            setGridColumns();
        }
    });

    // start the game with initial stage or minStage
    start();
})();