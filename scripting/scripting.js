
let randomBoxSelection = [];
const boxToSelect = 3;
const totalBoxes = boxToSelect * boxToSelect;
let userClickArray = [];
for (let x = 1; x <= totalBoxes; x++) {
    $('.boxContainer').append(`<div class="box" id=\"box${x}\"></div>`);
}

const start = function () {
    reset();
    $('.box').removeClass('boxSelected');
    while (randomBoxSelection.length != boxToSelect) {
        let r = Math.floor(Math.random() * (totalBoxes)) + 1;
        if (randomBoxSelection.indexOf(r) === -1)
            randomBoxSelection.push(r);
    }
    for (let i = 0; i < randomBoxSelection.length; i++)
        console.log(randomBoxSelection[i]);
    for (let j = 0; j < randomBoxSelection.length; j++) {
        let temporary = '';
        temporary = '#box' + randomBoxSelection[j];
        $(temporary).addClass('boxRandom');
    }
};
const reset = function () {
    for (let j = 0; j < randomBoxSelection.length; j++) {
        let temporary = '';
        temporary = '#box' + randomBoxSelection[j];
        $(temporary).removeClass('boxRandom');
    }
    randomBoxSelection = [];
    userClickArray = [];
    console.clear();
};


$('.box').on('click', function () {
    userClickArray = [];
    const userClick = $(this).attr('id');
    const digit = Number(userClick.slice(-1));
    const selectionIndex = randomBoxSelection.indexOf(digit);
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
});



$('#play').on('click', function (e) {
    e.preventDefault();
    start();
});

start();
