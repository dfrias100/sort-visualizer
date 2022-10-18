const leftSwapBgCol = "linear-gradient(to bottom, #ff4f4f, #990000)";
const rightSwapBgCol = "linear-gradient(to bottom, #73e1ff, #185b6e)";
const normalBgCol = "linear-gradient(to bottom, rgb(240, 187, 255), rgb(122, 0, 107))";
let sortBars = [];
let numElements = 100;
let activeSort = null;

function setup() {
    let sortVizDiv = document.getElementById("list-visualization");

    for (let i = 1; i <= numElements; i++) {
        let sortBarDiv = document.createElement('div');
        sortBarDiv.className = "list-bar";
        sortBarDiv.style.width = (100.0 / numElements) + "%";
        sortBarDiv.style.height = (i * 100.0 / numElements) + "%";
        sortBarDiv.style.left = ((i - 1) * 100.0 / numElements) + "%";
        sortBars.push(sortBarDiv);
        sortVizDiv.appendChild(sortBarDiv);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

async function shuffle() {
    for (let i = sortBars.length - 1; i >= 1; i--) {
        let j = Math.floor(Math.random() * i);
        await swap(i, j);
    }
}

async function swap(i, j) {
    sortBars[i].style.background = leftSwapBgCol;
    sortBars[j].style.background = rightSwapBgCol;

    [sortBars[i].style.left, sortBars[j].style.left] = [sortBars[j].style.left, sortBars[i].style.left];
    [sortBars[i], sortBars[j]] = [sortBars[j], sortBars[i]];   

    await new Promise(resolve => {
        setTimeout(resolve, 15);
    });

    sortBars[i].style.background = normalBgCol;
    sortBars[j].style.background = normalBgCol;
}

async function bubbleSort() {
    for (let i = 0; i < sortBars.length; i++) {
        for (let j = 0; j < sortBars.length - i - 1; j++) {
            if (compareLessThan(j + 1, j)) {
                await swap(j + 1, j);
            }
        }
    }
}

async function insertionSort() {
    for (let i = 1; i < sortBars.length; i++) {
        let j = i;

        while (j > 0 && compareLessThan(j, j - 1)) {
            await swap(j, j - 1);
            j--;
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < sortBars.length - 1; i++) {
        let jMin = i;

        for (j = i + 1; j < sortBars.length; j++) {
            if (compareLessThan(j, jMin)) {
                jMin = j;
            }
        }

        if (jMin != i) {
            await swap(i, jMin);
        }
    }
}

async function mergeSort(leftIdx, rightIdx) {
    if (leftIdx >= rightIdx - 1) return;

    let middleIdx = leftIdx + Math.floor((rightIdx - leftIdx) / 2);

    await mergeSort(leftIdx, middleIdx);
    await mergeSort(middleIdx, rightIdx);

    // Merge the two lists
    let result = [];
    
    let leftN = middleIdx - leftIdx;
    let rightN = rightIdx - middleIdx;
    let i = 0, j = 0;

    while (i < leftN && j < rightN) {
        if (compareLessThan(leftIdx + i, middleIdx + j)) {
            result.push(sortBars[leftIdx + (i++)]);
        } else {
            result.push(sortBars[middleIdx + (j++)]);
        }
    }

    while (i < leftN) {
        result.push(sortBars[leftIdx + (i++)]);
    }

    while (j < rightN) {
        result.push(sortBars[middleIdx + (j++)]);
    }

    for (let i = 0; i < result.length; i++) {
        sortBars[i + leftIdx] = result[i];
        sortBars[i + leftIdx].style.left = ((i + leftIdx) * 100.0 / numElements) + "%";
        sortBars[i + leftIdx].style.background = leftSwapBgCol;
        await new Promise(resolve => {
            setTimeout(resolve, 15);
        });
        sortBars[i + leftIdx].style.background = normalBgCol;
    }
}

// QUICK SORT //

async function quickSort(leftIdx, rightIdx) {
    if (leftIdx < rightIdx) {
        let partitionIdx = await partition(leftIdx, rightIdx);
        await quickSort(leftIdx, partitionIdx - 1);
        await quickSort(partitionIdx + 1, rightIdx);
    }
}

async function partition(leftIdx, rightIdx) {
    let randIdx = leftIdx + Math.round(Math.random() * (rightIdx - leftIdx));
    let pivots = [
        parseFloat(sortBars[leftIdx].style.height.slice(0, -1)), 
        parseFloat(sortBars[randIdx].style.height.slice(0, -1)), 
        parseFloat(sortBars[rightIdx].style.height.slice(0, -1))
    ];

    let pivot;

    if ((pivots[0] > pivots[1]) ^ (pivots[0] > pivots[2])) {
        pivot = leftIdx;
    } else if ((pivots[1] < pivots[0]) ^ (pivots[1] < pivots[2])) {
        pivot = randIdx;
    } else {
        pivot = rightIdx;
    }

    await swap(pivot, rightIdx);
    pivot = rightIdx;

    let i = leftIdx - 1;

    for (let j = leftIdx; j <= rightIdx - 1; j++) {
        if (compareLessThan(j, pivot)) {
            i++;
            await swap(i, j);
        }
    }

    await swap(i + 1, rightIdx);
    return i + 1;
}

// HEAP SORT //

function parent(i) {
    return Math.floor((i - 1) / 2);
}

function leftChild(i) {
    return 2 * i + 1;
}

async function siftDown(start, end) {
    let root = start;

    while (leftChild(root) <= end) {
        let child = leftChild(root);
        let swapLeaf = root;

        if (compareLessThan(swapLeaf, child)) {
            swapLeaf = child;
        }
        
        if ((child + 1) <= end && compareLessThan(swapLeaf, child + 1)) {
            swapLeaf = child + 1;
        }
        
        if (swapLeaf == root) {
            return;
        } else {
            await swap(root, swapLeaf);
            root = swapLeaf;
        }
    }
}

async function heapify(count) {
    let start = parent(count - 1);

    while (start >= 0) {
        await siftDown(start, count - 1);
        start--;
    }
}

async function heapSort() {
    await heapify(sortBars.length);
    let end = sortBars.length - 1;
    while (end > 0) {
        await swap(end, 0);
        end--;
        await siftDown(0, end);
    }
}

// Introsort

async function introSortHelper() {
    let maxDepth = Math.floor(Math.log2(sortBars.length));
    await introSort(0, sortBars.length, maxDepth); 
}

async function introSort(start, end, maxDepth) {
    let size = end - start;
    if (size < 16) {
        await introInsertionSort(start, end);
    } else if (maxDepth == 0) {
        await introHeapSort(start, end);
    } else {
        let pivot = await partition(start, end - 1);
        await introSort(start, pivot, maxDepth - 1);
        await introSort(pivot + 1, end, maxDepth - 1);
    }
}

async function introInsertionSort(start, end) {
    for (let i = start + 1; i < end; i++) {
        let j = i;

        while (j > 0 && compareLessThan(j, j - 1)) {
            await swap(j, j - 1);
            j--;
        }
    }
}

async function introHeapify(begin, count) {
    let start = begin + parent(count - 1);

    while (start >= begin) {
        await introSiftDown(start, begin + (count - 1), begin);
        start--;
    }
}

async function introSiftDown(start, end, beginIdx) {
    let root = start;

    while (beginIdx + leftChild(root - beginIdx) <= end) {
        let child = beginIdx + leftChild(root - beginIdx);
        let swapLeaf = root;

        if (compareLessThan(swapLeaf, child)) {
            swapLeaf = child;
        }
        
        if ((child + 1) <= end && compareLessThan(swapLeaf, child + 1)) {
            swapLeaf = child + 1;
        }
        
        if (swapLeaf == root) {
            return;
        } else {
            await swap(root, swapLeaf);
            root = swapLeaf;
        }
    }
}

async function introHeapSort(start, endOfArr) {
    await introHeapify(start, endOfArr - start);
    let end = endOfArr - 1;
    while (end > start) {
        await swap(end, start);
        end--;
        await introSiftDown(start, end, start);
    }
}

// UTIL

function compareLessThan(i, j) {
    return parseFloat(sortBars[i].style.height.slice(0, -1)) < parseFloat(sortBars[j].style.height.slice(0, -1));
}
 
const functions = [
    [ bubbleSort, [ null ] ], 
    [ insertionSort, [ null ] ], 
    [ selectionSort, [ null ] ], 
    [ mergeSort, [0, sortBars.length]], 
    [ quickSort, [0, sortBars.length - 1]], 
    [ heapSort, [ null ] ],
    [ introSortHelper, [ null ] ]
];

function disableInputControl(condition) {
    if (!(typeof condition === "boolean"))
        return;

    let inputs = document.getElementsByClassName("sort-input");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = condition;
    }
}

async function runSort() {
    disableInputControl(true);
    await activeSort[0](...activeSort[1]);
    disableInputControl(false);
}

async function runShuffle() {
    disableInputControl(true);
    await shuffle();
    disableInputControl(false);
}

function onChangeDropdown(element) {
    activeSort = functions[element.selectedIndex];
}

function updateArgs() {
    functions[3][1][1] = sortBars.length;
    functions[4][1][1] = sortBars.length - 1;
}

function onChangeRange(element) {
    numElements = element.value;
    removeAllChildNodes(document.getElementById("list-visualization"));
    sortBars = [];
    setup();
    updateArgs();
}

window.addEventListener("load", async function() {
    numElements = document.getElementById("elements-range").value;
    setup();
    disableInputControl(true);
    await shuffle();
    disableInputControl(false);
    let funcVal = document.getElementById("sort-selector").selectedIndex;
    activeSort = functions[funcVal]; 
    updateArgs();
})