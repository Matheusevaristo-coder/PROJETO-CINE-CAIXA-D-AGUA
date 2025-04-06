document.addEventListener("DOMContentLoaded", function () {
  // Alternância de modo escuro
  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkModeEnabled", isDarkMode);
    });

    const savedDarkMode = localStorage.getItem("darkModeEnabled") === "true";
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.checked = true;
    }
  }

  // Referências aos elementos do DOM
  const cardForm = document.getElementById("card-form");
  const cardsContainer = document.getElementById("cards-container");
  const editModal = document.getElementById("edit-modal"); // Modal para edição
  const editCardForm = document.getElementById("edit-card-form"); // Formulário do modal
  let cardBeingEdited = null; // Referência ao card que está sendo editado

  // Função para criar um novo card
  function createCard(title, classificationImg, imageSrc) {
    if (!title || !classificationImg || !imageSrc) return; // Evita criar cards vazios

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${imageSrc}" alt="${title}">
      <div class="card-content">
        <h3 class="card-title">${title}</h3>
        <div class="card-classification">
          <img src="${classificationImg}" alt="Classificação">
          <span>Classificação</span>
        </div>
        <div class="card-actions">
          <button class="edit-btn">Editar</button>
          <button class="remove-btn">Remover</button>
        </div>
      </div>
    `;

    cardsContainer.appendChild(card);
    addEventListenersToCard(card);
  }

  // Função para salvar cards no localStorage
  function saveCardsToLocalStorage() {
    const cards = Array.from(cardsContainer.children).map(card => ({
      title: card.querySelector(".card-title").innerText,
      classification: card.querySelector(".card-classification img").src,
      image: card.querySelector("img").src,
    }));
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  // Função para carregar os cards do localStorage
  function loadCardsFromLocalStorage() {
    const storedCards = JSON.parse(localStorage.getItem("cards") || "[]");
    if (cardsContainer.children.length === 0) {
      storedCards.forEach(card => createCard(card.title, card.classification, card.image));
    }
  }

  // Função para adicionar eventos de edição e remoção aos cards
  function addEventListenersToCard(card) {
    const editButton = card.querySelector(".edit-btn");
    const removeButton = card.querySelector(".remove-btn");

    // Abrir modal de edição
    editButton.addEventListener("click", function () {
      cardBeingEdited = card; // Armazena referência ao card
      document.getElementById("edit-card-title").value = card.querySelector(".card-title").innerText;
      document.getElementById("edit-card-classification").value = card.querySelector(".card-classification img").src;
      document.getElementById("edit-card-image").value = card.querySelector("img").src;
      editModal.classList.add("active"); // Mostra o modal
    });

    // Remover o card
    removeButton.addEventListener("click", function () {
      card.remove();
      saveCardsToLocalStorage();
    });
  }

  // Submissão do formulário de criação de cards
  if (cardForm) {
    cardForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const title = document.getElementById("card-title").value.trim();
      const classificationImg = document.getElementById("card-classification").value.trim();
      const imageSrc = document.getElementById("card-image").value.trim();

      createCard(title, classificationImg, imageSrc); // Cria somente se os valores forem válidos
      saveCardsToLocalStorage(); // Salva os novos cards
      cardForm.reset(); // Limpa o formulário
    });
  }

  // Submissão do formulário de edição no modal
  if (editCardForm) {
    editCardForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const newTitle = document.getElementById("edit-card-title").value.trim();
      const newClassification = document.getElementById("edit-card-classification").value.trim();
      const newImage = document.getElementById("edit-card-image").value.trim();

      if (cardBeingEdited) {
        cardBeingEdited.querySelector(".card-title").innerText = newTitle;
        cardBeingEdited.querySelector(".card-classification img").src = newClassification;
        cardBeingEdited.querySelector("img").src = newImage;
        saveCardsToLocalStorage(); // Salva as alterações no localStorage
      }

      editModal.classList.remove("active"); // Fecha o modal
      cardBeingEdited = null; // Limpa o estado de edição
    });
  }

  // Fechar modal de edição
  const closeModal = document.getElementById("close-modal");
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      editModal.classList.remove("active");
      cardBeingEdited = null; // Reseta o card que estava sendo editado
    });
  }

  // Carregar os cards ao iniciar a página
  loadCardsFromLocalStorage();
});
