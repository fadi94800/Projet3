document.addEventListener('DOMContentLoaded', () => {
    async function fetchAppartements() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            displayAppartements(data);
            displayAllPhotosInModal(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }

    function displayAppartements(appartements) {
        const galerie = document.getElementById('listeFilm');
        if (!galerie) {
            console.error('Élément galerie non trouvé');
            return;
        }
        galerie.innerHTML = '';

        appartements.forEach(appartement => {
            const div = document.createElement('figure');
            div.className = 'appartement';
            div.dataset.id = appartement.id;
            div.dataset.category = appartement.category.name.toLowerCase(); 

            const title = document.createElement('figcaption');
            title.textContent = appartement.title;

            const img = document.createElement('img');
            img.src = appartement.imageUrl;
            img.alt = appartement.title;

            const deleteIcon = document.createElement('div');
            deleteIcon.className = 'delete-icon';
            deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

            deleteIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log(`Delete icon clicked for ID: ${appartement.id}`);
                deleteAppartement(appartement.id, div);
            });

            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(deleteIcon);
            galerie.appendChild(div);
        });
    }

    function displayAllPhotosInModal(appartements) {
        const galleryContent = document.querySelector('.gallery-content');
        if (!galleryContent) {
            console.error('Élément gallery-content non trouvé');
            return;
        }
        galleryContent.innerHTML = '';

        appartements.forEach(appartement => {
            const div = document.createElement('figure');
            div.className = 'appartement-modal';
            div.dataset.id = appartement.id;

            const img = document.createElement('img');
            img.src = appartement.imageUrl;
            img.alt = appartement.title;

            const deleteIcon = document.createElement('div');
            deleteIcon.className = 'delete-icon';
            deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

            deleteIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                console.log(`Delete icon clicked for ID: ${appartement.id}`);
                deleteAppartement(appartement.id, div);
            });

            div.appendChild(img);
            div.appendChild(deleteIcon);
            galleryContent.appendChild(div);
        });
    }

    async function deleteAppartement(id, element) {
        console.log(`Attempting to delete ID: ${id}`);
        const authToken = localStorage.getItem('authToken');
        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                console.log(`Successfully deleted ID: ${id}`);
                element.remove();
            } else {
                console.error(`Erreur lors de la suppression de l'appartement, status: ${response.status}`);
            }
        } catch (error) {
            console.error('Erreur lors de la requête de suppression:', error);
        }
    }

    function filterAppartements(category) {
        const allAppartements = document.querySelectorAll('#listeFilm .appartement');
        allAppartements.forEach(appartement => {
            if (category === 'all' || appartement.dataset.category === category) {
                appartement.style.display = 'block';
            } else {
                appartement.style.display = 'none';
            }
        });
    }

    document.getElementById('filters').addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            const category = event.target.dataset.category.toLowerCase();
            filterAppartements(category);
        }
    });

    document.getElementById('add-photo').addEventListener('change', previewImage);

    function previewImage(event) {
        const defaultImage = document.getElementById('default-image');
        const input = event.target;
        const image = document.getElementById('image-reader');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                image.src = event.target.result;
            }
            defaultImage.style.display = 'none';
            image.style.display = 'block';
            reader.readAsDataURL(input.files[0]);
        }
    }

    document.getElementById('add-photo-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const authToken = localStorage.getItem('authToken');
        console.log('Submitting new photo with form data:', formData);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const newPhoto = await response.json();
            console.log('New photo added:', newPhoto);

            // Ajoute la nouvelle photo à la galerie principale
            addPhotoToGallery(newPhoto);
            // Ajoute la nouvelle photo à la modale
            addPhotoToModal(newPhoto);

            // Réinitialise le formulaire
            event.target.reset();
            // Réinitialiser la prévisualisation de l'image
            document.getElementById('image-reader').style.display = 'none';
            document.getElementById('default-image').style.display = 'block';

        } catch (error) {
            console.error('Erreur lors de l\'ajout de la photo:', error);
        }
    });

    function addPhotoToGallery(photo) {
        console.log('Adding photo to gallery:', photo);
        const galerie = document.getElementById('listeFilm');
        const div = document.createElement('figure');
        div.className = 'appartement';
        div.dataset.id = photo.id;
        div.dataset.category = photo.category.name.toLowerCase();

        const title = document.createElement('figcaption');
        title.textContent = photo.title;

        const img = document.createElement('img');
        img.src = photo.imageUrl;
        img.alt = photo.title;

        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'delete-icon';
        deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

        deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log(`Delete icon clicked for ID: ${photo.id}`);
            deleteAppartement(photo.id, div);
        });

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(deleteIcon);
        galerie.appendChild(div);
    }

    function addPhotoToModal(photo) {
        console.log('Adding photo to modal:', photo);
        const galleryContent = document.querySelector('.gallery-content');
        const div = document.createElement('figure');
        div.className = 'appartement-modal';
        div.dataset.id = photo.id;

        const img = document.createElement('img');
        img.src = photo.imageUrl;
        img.alt = photo.title;

        const deleteIcon = document.createElement('div');
        deleteIcon.className = 'delete-icon';
        deleteIcon.innerHTML = '<i class="fa-regular fa-trash-can"></i>';

        deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            console.log(`Delete icon clicked for ID: ${photo.id}`);
            deleteAppartement(photo.id, div);
        });

        div.appendChild(img);
        div.appendChild(deleteIcon);
        galleryContent.appendChild(div);
    }

    fetchAppartements();

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

    const modal = document.getElementById('modal');
    const manageWorksBtn = document.getElementById('manage-works-btn');
    const closeBtn = document.querySelector('.close-btn');

    manageWorksBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
