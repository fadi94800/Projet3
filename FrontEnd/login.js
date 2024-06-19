// Attendre que le DOM soit complètement chargé avant d'exécuter le code
document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner le formulaire de connexion par son ID
    const loginForm = document.getElementById('login-form');
    // Sélectionner l'élément de message d'erreur par son ID
    const errorMessage = document.getElementById('error-message');

    // Ajouter un écouteur d'événements pour intercepter la soumission du formulaire
    loginForm.addEventListener('submit', async (event) => {
        // Empêcher le comportement par défaut du formulaire (soumission et rechargement de la page)
        event.preventDefault();

        // Récupérer les valeurs des champs email et mot de passe
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        try {
            // Envoyer une requête POST à l'API pour tenter de se connecter
            const response = await fetch('http://localhost:5678/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Convertir les données de connexion en JSON pour l'envoi
                body: JSON.stringify({ email, password }),
            });

            // Vérifier si la réponse n'est pas correcte (statut HTTP non 200-299)
            if (!response.ok) {
                throw new Error('Invalid login'); // Lancer une erreur si la connexion échoue
            }

            // Convertir la réponse de l'API en JSON
            const data = await response.json();
            // Supposer qu'une connexion réussie retourne un token
            localStorage.setItem('authToken', data.token); // Stocker le token d'authentification dans le localStorage

            // Rediriger vers la page d'accueil après une connexion réussie
            window.location.href = 'index.html';
        } catch (error) {
            // Afficher le message d'erreur si la connexion échoue
            errorMessage.style.display = 'block';
        }
    });
});
