interface ProductItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

const TOTAL_ITEMS = 10000;

const CARD_WIDTH = 240;
const CARD_HEIGHT = 340;
const CARD_GAP = 16;
const BUFFER = 2;

const container = document.getElementById("listContainer") as HTMLDivElement;
const content = document.getElementById("listContent") as HTMLDivElement;

// @ts-ignore
const products: ProductItem[] = Array.from({ length: TOTAL_ITEMS }, (_, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  description: `Description for product ${i + 1}`,
  price: Math.floor(Math.random() * 200) + 10,
  imageUrl: `https://picsum.photos/seed/${i}/300/300`,
}));

function getColumnsCount(): number {
  const width = window.innerWidth;
  if (width < 600) {
    return 1;
  } else if (width < 900) {
    return 2;
  } else if (width < 1200) {
    return 3;
  }
  return 4;
}

//  lazy loading images
const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const dataSrc = img.getAttribute("data-src");
        if (dataSrc) {
          img.src = dataSrc;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  },
  {
    root: container,
    threshold: 0.1,
  }
);

function render() {
  const columns = getColumnsCount();
  const totalRows = Math.ceil(TOTAL_ITEMS / columns);
  content.style.height = `${totalRows * (CARD_HEIGHT + CARD_GAP)}px`;

  // Calculate the total width
  const gridWidth = columns * CARD_WIDTH + (columns - 1) * CARD_GAP;
  const offset = Math.max(0, (container.clientWidth - gridWidth) / 2);

  const scrollTop = container.scrollTop;
  const containerHeight = container.clientHeight;

  const startRow = Math.floor(scrollTop / (CARD_HEIGHT + CARD_GAP)) - BUFFER;
  const endRow =
    Math.ceil((scrollTop + containerHeight) / (CARD_HEIGHT + CARD_GAP)) +
    BUFFER;

  const visibleStartRow = Math.max(0, startRow);
  const visibleEndRow = Math.min(totalRows, endRow);

  // Clear the previous cards
  content.innerHTML = "";

  for (let row = visibleStartRow; row < visibleEndRow; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index >= TOTAL_ITEMS) break;

      const product = products[index];

      const card = document.createElement("div");
      card.className = "card";

      // Position card in grid
      const topPos = row * (CARD_HEIGHT + CARD_GAP);
      const leftPos = offset + col * (CARD_WIDTH + CARD_GAP);
      card.style.top = `${topPos}px`;
      card.style.left = `${leftPos}px`;

      card.addEventListener("click", () => {
        card.classList.toggle("expanded");
      });

      const img = document.createElement("img");
      img.alt = product.title;
      img.setAttribute("data-src", product.imageUrl);
      imageObserver.observe(img);

      const infoDiv = document.createElement("div");
      infoDiv.className = "info";

      const titleEl = document.createElement("h2");
      titleEl.textContent = product.title;

      const descEl = document.createElement("p");
      descEl.textContent = product.description;

      const priceEl = document.createElement("div");
      priceEl.className = "price";
      priceEl.textContent = `$${product.price}`;

      const detailsEl = document.createElement("button");
      detailsEl.className = "details";
      detailsEl.textContent = `Add Cart`;

      infoDiv.appendChild(titleEl);
      infoDiv.appendChild(descEl);
      infoDiv.appendChild(priceEl);
      infoDiv.appendChild(detailsEl);

      card.appendChild(img);
      card.appendChild(infoDiv);

      content.appendChild(card);
    }
  }
}

// Animation
container.addEventListener("scroll", () => {
  requestAnimationFrame(render);
});

window.addEventListener("resize", () => {
  requestAnimationFrame(render);
});

render();
