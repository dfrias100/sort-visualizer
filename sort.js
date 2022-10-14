function setup() {
    let sortVizDiv = document.getElementById("list-visualization");

    for (let i = 1; i <= 100; i++) {
        let sortBarDiv = document.createElement('div');
        sortBarDiv.className = "list-bar";
        sortBarDiv.style.width = "1%";
        sortBarDiv.style.height = i + "%";
        sortBarDiv.style.left = (i - 1) + "%";
        sortVizDiv.appendChild(sortBarDiv);
    }
}

setup();