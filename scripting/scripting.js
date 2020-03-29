
(function () {
    // variable declaration
    const stage = 3;
    let boxToSelect = stage;
    const totalBoxes = stage * stage;
    let randomBoxSelection = [];
    let userClickArray = [];
    
    function setGridSizing(){
        document.documentElement.style.setProperty(`--gridColumns`, `${boxToSelect-1}`);
        let boxWidth = 100;
        let boxHeight = 100;
        if(boxToSelect>5){
            boxWidth = 50;
            boxHeight = 50;
        }
        document.documentElement.style.setProperty(`--boxWidth`, `${boxWidth}px`);
        document.documentElement.style.setProperty(`--boxHeight`, `${boxHeight}px`);
    };setGridSizing();

    // your page initialization code here
    // the DOM will be available here
    
    // functions definitions
    const start = function () {
        reset();
        updateCounter(boxToSelect);
        for (let x = 1; x <= totalBoxes; x++) {
            $('.boxContainer').append(`<div class="box" id=\"box${x}\" data-num=${x}>
                <div class="card">
                    <div class="boxFront"></div>
                    <div class="boxBack"></div>
                </div>
            </div>`);
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
            },(3000 + (j*100)));
        }
    }


    const reset = function () {
        for (let j = 0; j < randomBoxSelection.length; j++) {
            let temporary = '';
            temporary = '#box' + randomBoxSelection[j];
            $(temporary).find('.boxFront').removeClass('boxRandom');
            $(temporary).find('.boxBack').removeClass('boxRandomBack');
        }
        // $('.boxContainer').children().remove();
        randomBoxSelection = [];
        userClickArray = [];
    };


    
    const boxClicked = function () {       
        
        console.log($(this).attr('data-num'));
        
        const digit = $(this).attr('data-num');
        const selectionIndex = randomBoxSelection.indexOf(digit);
        $(this).addClass('active');

        console.log("box clicked:"+digit);
        
        if (selectionIndex !== -1) {
            if (!$(this).hasClass("boxSelected")) {
                console.log("Right choice...Play again");
                userClickArray.push(digit);
                $(this).addClass("boxSelected");
            } else {
                console.log("Already Selected");
            }
        } else {
            alert("You lost...Play again");
            start();
        }
        
        updateCounter(boxToSelect - userClickArray.length);
        console.log("currentSelections : "+userClickArray.length);
        if(userClickArray.length === boxToSelect){
            alert("You won");
        }

    };

    const updateCounter = function(val){
        $('.selectionsLeft span').text(val);
    }

    $('#play').on('click', function (e) {
        e.preventDefault();
        start();
    });

    // define events here
    start();
    $('.box').on('click', boxClicked);
})();