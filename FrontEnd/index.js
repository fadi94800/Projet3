document.addEventListener('DOMContentLoaded', () => { // Ajoute un écouteur d'événement pour exécuter le code lorsque le DOM est entièrement chargé
    async function fetchAppartements() { // Fonction asynchrone pour récupérer les données des appartements
      try {
        const response = await fetch('http://localhost:5678/api/works'); // Effectue une requête GET vers /api/appartements
        if (!response.ok) { // Vérifie si la réponse est correcte (status 200-299)
          throw new Error(`HTTP error! Status: ${response.status}`); // Lance une erreur en cas de réponse non correcte
        }
        const data = await response.json(); 
        console.log('Données récupérées:', data); // Affiche les données dans la console pour vérification
        displayAppartements(data); // Appelle la fonction pour afficher les appartements
      } catch (error) { // Gère les erreurs éventuelles lors de la requête
        console.error('Erreur lors de la récupération des données:', error); // Affiche l'erreur dans la console
      }
    }
  
    function displayAppartements(appartements) { // Fonction pour afficher les appartements
      const galerie = document.getElementById('listeFilm'); // Sélectionne l'élément avec l'id listeFilm
      if (!galerie) { // Vérifie si l'élément existe
        console.error('Élément galerie non trouvé'); // Affiche un message d'erreur si l'élément n'est pas trouvé
        return; // Sort de la fonction
      }
      galerie.innerHTML = ''; // Supprime le contenu HTML existant dans l'élément galerie
  
      appartements.forEach(appartement => { // Parcourt les données
        const div = document.createElement('figure'); // Crée un nouvel élément figure
        div.className = 'appartement'; // Assigne une classe à l'élément figure pour le css 
  
        const title = document.createElement('figcaption'); // Crée un nouvel élément figcaption pour le titre
        title.textContent = appartement.title; // Définit le texte du titre avec le titre de l'appartement
  
        const img = document.createElement('img'); // Crée un nouvel élément img pour l'image
        img.src = appartement.imageUrl; // Définit la source de l'image avec l'URL de l'image de l'appartement
        img.alt = appartement.title; // Définit le texte alternatif de l'image avec le titre de l'appartement
  
       
        div.appendChild(img); 
        div.appendChild(title); // Ajoute le titre à l'élément div
        galerie.appendChild(div); 
      });
    }
  
    fetchAppartements(); // Appelle la fonction pour récupérer et afficher les appartements
  });
  