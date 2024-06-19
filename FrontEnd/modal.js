document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments de la modale
    const modal = document.getElementById('modal');
    const manageWorksBtn = document.getElementById('manage-works-btn');
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    // Sélectionner les éléments des vues
    const galleryView = document.getElementById('gallery-view');
    const addPhotoView = document.getElementById('add-photo-view');
    const addPhotoBtn = document.getElementById('add-photo-btn');
    const backToGalleryBtn = document.getElementById('back-to-gallery-btn');

    // Afficher la modale lorsque le bouton "Gérer mes travaux" est cliqué
    manageWorksBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        galleryView.style.display = 'block';
        addPhotoView.style.display = 'none';
    });

    // Fermer la modale lorsque l'utilisateur clique sur la croix
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fermer la modale lorsque l'utilisateur clique en dehors de la modale
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Afficher la vue "Ajout photo" lorsque le bouton "Ajouter une photo" est cliqué
    addPhotoBtn.addEventListener('click', () => {
        galleryView.style.display = 'none';
        addPhotoView.style.display = 'block';
    });

    // Retourner à la vue "Galerie photo" lorsque le bouton "Retour à la galerie" est cliqué
    backToGalleryBtn.addEventListener('click', () => {
        addPhotoView.style.display = 'none';
        galleryView.style.display = 'block';
    });

    // Gérer la soumission du formulaire d'ajout de photo
    const addPhotoForm = document.getElementById('add-photo-form');
    addPhotoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        // Code pour gérer l'ajout de photo...
        alert('Photo ajoutée avec succès!');
        addPhotoView.style.display = 'none';
        galleryView.style.display = 'block';
    });
});
