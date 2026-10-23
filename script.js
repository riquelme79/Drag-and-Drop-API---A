const cards = document.querySelectorAll(".card");
const colunas = document.querySelectorAll(".coluna");
let arrastado = null;

// Eventos do card arrastado
cards.forEach(card => {
  card.addEventListener("dragstart", e => {
    arrastado = card;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id); // necessário no Firefox
    setTimeout(() => card.classList.add("arrastando"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("arrastando");
    colunas.forEach(c => c.classList.remove("sobre"));
    arrastado = null;
  });
});

// Eventos das colunas (zonas de soltura)
colunas.forEach(coluna => {
  coluna.addEventListener("dragover", e => {
    e.preventDefault(); // permite soltar
    coluna.classList.add("sobre");
    const depois = cardAposCursor(coluna, e.clientY);
    depois ? coluna.insertBefore(arrastado, depois) : coluna.appendChild(arrastado);
  });

  coluna.addEventListener("dragleave", e => {
    if (!coluna.contains(e.relatedTarget)) coluna.classList.remove("sobre");
  });

  coluna.addEventListener("drop", e => {
    e.preventDefault();
    coluna.classList.remove("sobre");
  });
});

// Descobre antes de qual card o item arrastado deve ficar
function cardAposCursor(coluna, y) {
  const outros = [...coluna.querySelectorAll(".card:not(.arrastando)")];
  return outros.find(c => {
    const r = c.getBoundingClientRect();
    return y < r.top + r.height / 2;
  });
}
