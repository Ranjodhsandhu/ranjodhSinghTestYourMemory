
(function () {
    // variable declaration
    const maxStage = 6;
    const minStage = 3;

    let stage = 3;
    let boxToSelect = stage;
    
    let totalBoxes = stage * stage;
    let randomBoxSelection = [];
    let userSelectionArray = [];
    
    const boxes = ()=> {
        if(stage === 3) boxToSelect = stage;
        if(stage === 4) boxToSelect = stage+1;
        if(stage === 5) boxToSelect = stage+3;
        if(stage === 6) boxToSelect = stage+5;
    };
    function setGridSizing(){
        document.documentElement.style.setProperty(`--gridColumns`, `${stage-1}`);
        let boxWidth = 100;
        let boxHeight = 100;
        document.documentElement.style.setProperty(`--boxWidth`, `${boxWidth}px`);
        document.documentElement.style.setProperty(`--boxHeight`, `${boxHeight}px`);
    };
    
    // your page initialization code here
    // the DOM will be available here
    
    // functions definitions
    const start = function () {
        reset();
        boxes();
        totalBoxes = stage * stage;
        setGridSizing();
        updateCounter(boxToSelect,stage-2);
        for (let x = 1; x <= totalBoxes; x++) {
            $('.boxContainer').empty();
        }
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
        makeRandomSelections();
        showRandomSelections();
    };
    
    const makeRandomSelections = function(){
        while (randomBoxSelection.length != boxToSelect) {
            let r = Math.floor(Math.random() * (totalBoxes)) + 1;
            
            if (randomBoxSelection.indexOf(r) === -1) randomBoxSelection.push(r);
        }
    }
    
    const showRandomSelections = function(){
        for (let i = 0; i < randomBoxSelection.length; i++)
            console.log(randomBoxSelection[i]);
        
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


    const reset = function () {
        for (let j = 0; j < randomBoxSelection.length; j++) {
            let temporary = '';
            temporary = '#box' + randomBoxSelection[j];
            $(temporary).find('.boxFront').removeClass('boxRandom');
            $(temporary).find('.boxBack').removeClass('boxRandomBack');
        }
        randomBoxSelection = [];
        userSelectionArray = [];
    };


    
    const boxClicked = function (e) {
        const selection = parseInt($(e.target).closest('.box').attr('data-num'));
        const selectionIndex = randomBoxSelection.indexOf(selection);
        
        console.log($(e.target).closest('.box'));

        $(e.target).closest('.box').addClass('active');
        if (selectionIndex !== -1) {
            if (!$(this).hasClass("boxSelected")) {
                console.log("Right choice...Play again");
                userSelectionArray.push(selection);
                $(this).addClass("boxSelected");
            } else {
                alert("Already selected");
            }
        } else {
            stageDiminish();
        }
        updateCounter((boxToSelect - userSelectionArray.length),stage-2);
        if(userSelectionArray.length === boxToSelect){
            stageProgress();
        }
    };
    
    const stageProgress = function(){
        if(stage < maxStage){
            alert("You won");
            stage++;
        }
        else
        alert("You have a very sharp memory");

        start();
    }
    const stageDiminish = function(){
        if(stage > minStage){
            alert("Wrong answer...Please try again");
            stage--;
        }
        else
            alert("Please try again");
        
        start();
    }
    const updateCounter = function(boxes,stage){
        $('.selectionsLeft span').text(boxes);
        $('.stage span').text(stage);

    }

    $('#play').on('click', function (e) {
        e.preventDefault();
        start();
    });

    // define events here
    start();
    $('.boxContainer').on('click',".boxFront",boxClicked);
})();