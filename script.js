// script.js

// Charger les idées depuis localStorage
document.addEventListener('DOMContentLoaded', function() {
    const storedIdeas = localStorage.getItem('ideas');
    if (storedIdeas) {
        ideas = JSON.parse(storedIdeas);
        updateIdeasList();
    }
});

// Tableau pour stocker les idées
let ideas = [];

// Sélectionner les éléments du DOM
const form = document.getElementById('ideaForm');
const titleInput = document.getElementById('title');
const titleSuccess = document.getElementById('titleSuccess');
const categoryInput = document.getElementById('category');
const categorySuccess = document.getElementById('categorySuccess');
const descriptionInput = document.getElementById('description');
const descriptionSuccess = document.getElementById('descriptionSuccess');
const messagesDiv = document.getElementById('messages');
const ideasList = document.getElementById('ideasList');
const titleError = document.getElementById('titleError');
const categoryError = document.getElementById('categoryError');
const descriptionError = document.getElementById('descriptionError');

// Écouteurs d'événements pour la validation automatique
titleInput.addEventListener('input', validateTitleInput);
categoryInput.addEventListener('change', validateCategoryInput);
descriptionInput.addEventListener('input', validateDescriptionInput);

// Ajouter un écouteur d'événement pour la soumission du formulaire
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Valider les données du formulaire
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();

    let isValid = true;

    // Valider le titre
    if (!validateTitle(title)) {
        titleError.textContent = 'Le libellé doit contenir entre 3 et 50 caractères.';
        titleSuccess.textContent = '';
        isValid = false;
    } else {
        titleError.textContent = '';
        titleSuccess.textContent = 'Libellé valide.';
    }

    // Valider la catégorie
    if (!validateCategory(category)) {
        categoryError.textContent = 'Veuillez sélectionner une catégorie valide.';
        categorySuccess.textContent = '';
        isValid = false;
    } else {
        categoryError.textContent = '';
        categorySuccess.textContent = 'Catégorie valide.';
    }

    // Valider la description
    if (!validateDescription(description)) {
        descriptionError.textContent = 'La description doit contenir entre 10 et 255 caractères.';
        descriptionSuccess.textContent = '';
        isValid = false;
    } else {
        descriptionError.textContent = '';
        descriptionSuccess.textContent = 'Description valide.';
    }

    // Si le formulaire n'est pas valide, on arrête la soumission
    if (!isValid) {
        return;
    }

    // Ajouter l'idée au tableau
    const idea = {
        id: Date.now(),
        title,
        category,
        description,
        approved: false
    };

    ideas.push(idea);

    // Sauvegarder dans localStorage
    localStorage.setItem('ideas', JSON.stringify(ideas));

    // Réinitialiser le formulaire
    form.reset();

    // Afficher un message de succès
    showMessage('Idée ajoutée avec succès', 'success');

    // Mettre à jour la liste des idées
    updateIdeasList();
});

// Fonction de validation automatique pour le titre
function validateTitleInput() {
    const title = titleInput.value.trim();
    if (!validateTitle(title)) {
        titleError.textContent = 'Le libellé doit contenir entre 3 et 50 caractères.';
        titleSuccess.textContent = '';
    } else {
        titleError.textContent = '';
        titleSuccess.textContent = 'Libellé valide.';
    }
}

// Fonction de validation automatique pour la catégorie
function validateCategoryInput() {
    const category = categoryInput.value;
    if (!validateCategory(category)) {
        categoryError.textContent = 'Veuillez sélectionner une catégorie valide.';
        categorySuccess.textContent = '';
    } else {
        categoryError.textContent = '';
        categorySuccess.textContent = 'Catégorie valide.';
    }
}

// Fonction de validation automatique pour la description
function validateDescriptionInput() {
    const description = descriptionInput.value.trim();
    if (!validateDescription(description)) {
        descriptionError.textContent = 'La description doit contenir entre 10 et 255 caractères.';
        descriptionSuccess.textContent = '';
    } else {
        descriptionError.textContent = '';
        descriptionSuccess.textContent = 'Description valide.';
    }
}

// Fonction pour afficher un message
function showMessage(message, type) {
    messagesDiv.textContent = message;
    messagesDiv.className = type;
    messagesDiv.style.display = 'block';
    setTimeout(() => {
        messagesDiv.style.display = 'none';
    }, 2000);
}

 //  l'affichage des idées
 function updateIdeasList() {
    ideasList.innerHTML = '';
    ideas.forEach(idea => {
        const div = document.createElement('div');
        div.className = 'col';
        div.innerHTML = `
            <div class="card h-100 ${idea.approved ? 'border-success' : 'border-warning'}">
                <div class="card-body">
                    <h5 class="card-title">${idea.title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${idea.category}</h6>
                    <p class="card-text">${idea.description}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <button class="btn btn-sm btn-outline-success me-2" onclick="approveIdea(${idea.id})">Approuver</button>
                            <button class="btn btn-sm btn-outline-danger" onclick="disapproveIdea(${idea.id})">Désapprouver</button>
                        </div>
                        <button class="btn btn-sm btn-link text-danger" onclick="deleteIdea(${idea.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        ideasList.appendChild(div);
    });
}

// Fonction pour supprimer une idée
function deleteIdea(id) {
    ideas = ideas.filter(idea => idea.id !== id);
    localStorage.setItem('ideas', JSON.stringify(ideas));
    updateIdeasList();
}

// Fonction pour approuver une idée
function approveIdea(id) {
    ideas = ideas.map(idea => {
        if (idea.id === id) {
            idea.approved = true;
        }
        return idea;
    });
    localStorage.setItem('ideas', JSON.stringify(ideas));
    updateIdeasList();
}

// Fonction pour désapprouver une idée
function disapproveIdea(id) {
    ideas = ideas.map(idea => {
        if (idea.id === id) {
            idea.approved = false;
        }
        return idea;
    });
    localStorage.setItem('ideas', JSON.stringify(ideas));
    updateIdeasList();
}

// Fonctions de validation avec regex
function validateTitle(title) {
    const regex = /^[A-Za-z0-9\s]{3,50}$/;
    return regex.test(title);
}

function validateCategory(category) {
    const validCategories = ["Politique", "Sport", "Santé", "Education"];
    return validCategories.includes(category);
}

function validateDescription(description) {
    const regex = /^.{10,255}$/;
    return regex.test(description);
}
