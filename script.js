var TOTAL_ITEMS = 10000;
var CARD_WIDTH = 240;
var CARD_HEIGHT = 340;
var CARD_GAP = 16;
var BUFFER = 2;
var container = document.getElementById("listContainer");
var content = document.getElementById("listContent");
// @ts-ignore
var products = Array.from({ length: TOTAL_ITEMS }, function (_, i) { return ({
    id: i,
    title: "Product ".concat(i + 1),
    description: "Description for product ".concat(i + 1),
    price: Math.floor(Math.random() * 200) + 10,
    imageUrl: "https://picsum.photos/seed/".concat(i, "/300/300"),
}); });
function getColumnsCount() {
    var width = window.innerWidth;
    if (width < 600) {
        return 1;
    }
    else if (width < 900) {
        return 2;
    }
    else if (width < 1200) {
        return 3;
    }
    return 4;
}
//  lazy loading images
var imageObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            var img = entry.target;
            var dataSrc = img.getAttribute("data-src");
            if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute("data-src");
            }
            observer.unobserve(img);
        }
    });
}, {
    root: container,
    threshold: 0.1,
});
function render() {
    var columns = getColumnsCount();
    var totalRows = Math.ceil(TOTAL_ITEMS / columns);
    content.style.height = "".concat(totalRows * (CARD_HEIGHT + CARD_GAP), "px");
    // Calculate the total width
    var gridWidth = columns * CARD_WIDTH + (columns - 1) * CARD_GAP;
    var offset = Math.max(0, (container.clientWidth - gridWidth) / 2);
    var scrollTop = container.scrollTop;
    var containerHeight = container.clientHeight;
    var startRow = Math.floor(scrollTop / (CARD_HEIGHT + CARD_GAP)) - BUFFER;
    var endRow = Math.ceil((scrollTop + containerHeight) / (CARD_HEIGHT + CARD_GAP)) +
        BUFFER;
    var visibleStartRow = Math.max(0, startRow);
    var visibleEndRow = Math.min(totalRows, endRow);
    // Clear the previous cards
    content.innerHTML = "";
    for (var row = visibleStartRow; row < visibleEndRow; row++) {
        var _loop_1 = function (col) {
            var index = row * columns + col;
            if (index >= TOTAL_ITEMS)
                return "break";
            var product = products[index];
            var card = document.createElement("div");
            card.className = "card";
            // Position card in grid
            var topPos = row * (CARD_HEIGHT + CARD_GAP);
            var leftPos = offset + col * (CARD_WIDTH + CARD_GAP);
            card.style.top = "".concat(topPos, "px");
            card.style.left = "".concat(leftPos, "px");
            card.addEventListener("click", function () {
                card.classList.toggle("expanded");
            });
            var img = document.createElement("img");
            img.alt = product.title;
            img.setAttribute("data-src", product.imageUrl);
            imageObserver.observe(img);
            var infoDiv = document.createElement("div");
            infoDiv.className = "info";
            var titleEl = document.createElement("h2");
            titleEl.textContent = product.title;
            var descEl = document.createElement("p");
            descEl.textContent = product.description;
            var priceEl = document.createElement("div");
            priceEl.className = "price";
            priceEl.textContent = "$".concat(product.price);
            var detailsEl = document.createElement("button");
            detailsEl.className = "details";
            detailsEl.textContent = "Add Cart";
            infoDiv.appendChild(titleEl);
            infoDiv.appendChild(descEl);
            infoDiv.appendChild(priceEl);
            infoDiv.appendChild(detailsEl);
            card.appendChild(img);
            card.appendChild(infoDiv);
            content.appendChild(card);
        };
        for (var col = 0; col < columns; col++) {
            var state_1 = _loop_1(col);
            if (state_1 === "break")
                break;
        }
    }
}
// Animation
container.addEventListener("scroll", function () {
    requestAnimationFrame(render);
});
window.addEventListener("resize", function () {
    requestAnimationFrame(render);
});
render();
