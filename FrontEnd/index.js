document.addEventListener('DOMContentLoaded', () => {
    // Fonction asynchrone pour récupérer les données des appartements
    async function fetchAppartements() {
        try {
            // Effectue une requête GET vers l'API pour obtenir les données
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                // Lance une erreur en cas de réponse non correcte
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Convertit la réponse en JSON
            const data = await response.json();
            console.log('Données récupérées:', data); // Affiche les données dans la console pour vérification
            // Appelle la fonction pour afficher les appartements
            displayAppartements(data);
        } catch (error) {
            // Gère les erreurs éventuelles lors de la requête
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    // Fonction pour afficher les appartements
    function displayAppartements(appartements) {
        // Sélectionne l'élément avec l'id listeFilm
        const galerie = document.getElementById('listeFilm');
        if (!galerie) {
            // Affiche un message d'erreur si l'élément n'est pas trouvé
            console.error('Élément galerie non trouvé');
            return; // Sort de la fonction
        }
        // Supprime le contenu HTML existant dans l'élément galerie
        galerie.innerHTML = '';

        // Parcourt les données des appartements
        appartements.forEach(appartement => {
            // Crée un nouvel élément figure pour chaque appartement
            const div = document.createElement('figure');
            div.className = 'appartement'; // Assigne une classe à l'élément figure pour le CSS
            // Utilise la propriété category.name pour les catégories et les met en minuscules
            div.dataset.category = appartement.category.name.toLowerCase(); 

            // Crée un nouvel élément figcaption pour le titre
            const title = document.createElement('figcaption');
            title.textContent = appartement.title; // Définit le texte du titre avec le titre de l'appartement

            // Crée un nouvel élément img pour l'image
            const img = document.createElement('img');
            img.src = appartement.imageUrl; // Définit la source de l'image avec l'URL de l'image de l'appartement
            img.alt = appartement.title; // Définit le texte alternatif de l'image avec le titre de l'appartement

            // Ajoute l'image et le titre à l'élément figure
            div.appendChild(img);
            div.appendChild(title);
            // Ajoute l'élément figure à la galerie
            galerie.appendChild(div);
        });
    }

    // Fonction pour filtrer les appartements en fonction de la catégorie
    function filterAppartements(category) {
        // Sélectionne tous les éléments avec la classe appartement dans l'élément listeFilm
        const allAppartements = document.querySelectorAll('#listeFilm .appartement');
        // Parcourt tous les appartements et ajuste leur affichage en fonction de la catégorie
        allAppartements.forEach(appartement => {
            if (category === 'all' || appartement.dataset.category === category) {
                // Affiche l'appartement si la catégorie correspond ou si "Tous" est sélectionné
                appartement.style.display = 'block';
            } else {
                // Cache l'appartement si la catégorie ne correspond pas
                appartement.style.display = 'none';
            }
        });
    }

    // Ajoute un écouteur d'événements pour gérer les clics sur les boutons de filtre
    document.getElementById('filters').addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            // Récupère la catégorie à partir de l'attribut data-category du bouton cliqué et la met en minuscules
            const category = event.target.dataset.category.toLowerCase();
            // Appelle la fonction pour filtrer les appartements en fonction de la catégorie
            filterAppartements(category);
        }
    });

    // Appelle la fonction pour récupérer et afficher les appartements au chargement de la page
    fetchAppartements();

    // Code pour gérer l'authentification et le mode édition
    const authLink = document.getElementById('auth-link');
    const editModeBar = document.getElementById('edit-mode-bar');
    const filters = document.getElementById('filters');
    const authToken = localStorage.getItem('authToken');

    if (authToken) {
        authLink.innerHTML = '<a href="#" id="logout-link">logout</a>';
        editModeBar.style.display = 'block';
        filters.style.display = 'none';

        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = 'index.html';
        });
    } else {
        filters.style.display = 'flex';
    }
});
