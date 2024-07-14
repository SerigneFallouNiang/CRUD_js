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
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const messagesDiv = document.getElementById('messages');
const ideasList = document.getElementById('ideasList');

// Ajouter un écouteur d'événement pour la soumission du formulaire
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Valider les données du formulaire
    const title = titleInput.value.trim();
    const category = categoryInput.value;
    const description = descriptionInput.value.trim();

    if (title === '' || description === '') {
        showMessage('Tous les champs sont obligatoires', 'error');
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

// Fonction pour afficher un message
function showMessage(message, type) {
    messagesDiv.textContent = message;
    messagesDiv.className = type;
    messagesDiv.style.display = 'block';
    setTimeout(() => {
        messagesDiv.style.display = 'none';
    }, 2000);
}

// Fonction pour mettre à jour la liste des idées
function updateIdeasList() {
    ideasList.innerHTML = '';

    ideas.forEach(idea => {
        const div = document.createElement('div');
        div.className = idea.approved ? 'approved' : 'Napproved';
        div.innerHTML = `
            <div class="col">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${idea.title}</h5>
                        <h6>${idea.category}</h6>
                        <p class="card-text">${idea.description}</p>
                        <div class="action d-flex">
                            <button type="button" class="btn btn-success" onclick="approveIdea(${idea.id})">Approuver</button>
                            <button type="button" class="btn btn-danger" onclick="disapproveIdea(${idea.id})">Désapprouver</button>
                            <i class="corbeille fa-solid fa-trash fa-2xl ms-auto" style="color: #c21e1e;" onclick="deleteIdea(${idea.id})"></i>
                        </div>
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
