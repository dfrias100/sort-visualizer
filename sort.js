const leftSwapBgCol = "linear-gradient(to bottom, #ff4f4f, #990000)";
const rightSwapBgCol = "linear-gradient(to bottom, #73e1ff, #185b6e)";
let sortBars = []

function setup() {
    let sortVizDiv = document.getElementById("list-visualization");

    for (let i = 1; i <= 100; i++) {
        let sortBarDiv = document.createElement('div');
        sortBarDiv.className = "list-bar";
        sortBarDiv.style.width = "0.85%";
        sortBarDiv.style.height = i + "%";
        sortBarDiv.style.left = (i - 1) + "%";
        sortBars.push(sortBarDiv);
        sortVizDiv.appendChild(sortBarDiv);
    }
}

async function shuffle() {
    for (let i = sortBars.length - 1; i >= 1; i--) {
        let j = Math.floor(Math.random() * i);
        let origCol = sortBars[i].style.background;

        await swap(i, j);

        sortBars[i].style.background = origCol;
        sortBars[j].style.background = origCol;
    }
}

async function swap(i, j) {
    sortBars[i].style.background = leftSwapBgCol;
    sortBars[j].style.background = rightSwapBgCol;

    [sortBars[i].style.left, sortBars[j].style.left] = [sortBars[j].style.left, sortBars[i].style.left];
    [sortBars[i], sortBars[j]] = [sortBars[j], sortBars[i]];    

    return new Promise(resolve => {
        setTimeout(resolve, 10)
    });
}

async function bubbleSort() {
    for (let i = 0; i < sortBars.length; i++) {
        for (let j = 0; j < sortBars.length - i - 1; j++) {
            let origCol = sortBars[j].style.background;
            if (parseInt(sortBars[j].style.height) > parseInt(sortBars[j + 1].style.height)) {
                await swap(j + 1, j);

                sortBars[j + 1].style.background = origCol;
                sortBars[j].style.background = origCol;
            }
        }
    }
}

window.addEventListener("load", async function() {
    setup();
    await shuffle();
    await bubbleSort();
})