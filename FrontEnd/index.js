document.addEventListener('DOMContentLoaded', () => {
    const galleryModal = document.getElementById('gallery-view');
    const addPhotoModal = document.getElementById('add-photo-view');
    const authLink = document.getElementById('auth-link');
    const editModeBar = document.querySelector('.edit-mode-barr');
    const manageWorksBtn = document.getElementById('edit-button');
    const modal = document.getElementById('modal');
    const filtersContainer = document.createElement('div');
    filtersContainer.id = 'filters';
    document.querySelector('#portfolio').insertBefore(filtersContainer, document.getElementById('listeFilm'));

    const categories = [
        { label: 'Tous', value: 'all' },
        { label: 'Objets', value: 'objets' },
        { label: 'Appartements', value: 'appartements' },
        { label: 'Hôtel & Restaurants', value: 'hotel & restaurants' }
    ];

    function createFilters() {
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.dataset.category = category.value;
            button.textContent = category.label;
            filtersContainer.appendChild(button);
        });

        filtersContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-btn')) {
                const category = event.target.dataset.category;
                filterAppartements(category);
            }
        });
    }

    function updateEditModeBar() {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            authLink.innerHTML = '<a href="#" id="logout-link">logout</a>';
            editModeBar.style.display = 'block';
            manageWorksBtn.style.display = 'block';
            filtersContainer.style.display = 'none';

            document.getElementById('logout-link').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            authLink.innerHTML = '<a href="login.html">login</a>';
            editModeBar.style.display = 'none';
            manageWorksBtn.style.display = 'none';
            filtersContainer.style.display = 'flex';
        }
    }

    function logout() {
        localStorage.removeItem('authToken');
        updateEditModeBar();
    }

    function login(authToken) {
        localStorage.setItem('authToken', authToken);
        updateEditModeBar();
    }

    function createAppartementElement(appartement) {
        const div = document.createElement('figure');
        div.className = 'appartement';
        div.dataset.id = appartement.id;

        if (appartement.categoryId) {
            let categoryName = getCategoryNameById(appartement.categoryId);
            div.dataset.category = categoryName;
        } else {
            div.dataset.category = 'inconnu';
        }

        const title = document.createElement('figcaption');
        title.textContent = appartement.title;

        const img = document.createElement('img');
        img.src = appartement.imageUrl;
        img.alt = appartement.title;

        const deleteIcon = document.createElement('div');

        deleteIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteAppartement(appartement.id, div);
        });

        div.appendChild(img);
        div.appendChild(title);
        div.appendChild(deleteIcon);

        return div;
    }

    function getCategoryNameById(categoryId) {
        switch (categoryId) {
            case 1:
                return 'objets';
            case 2:
                return 'appartements';
            case 3:
                return 'hotel & restaurants';
            default:
                return 'inconnu';
        }
    }

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
            const div = createAppartementElement(appartement);
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
            const div = createModalPhotoElement(appartement);
            galleryContent.appendChild(div);
        });
    }

    function createModalPhotoElement(photo) {
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
            deleteAppartement(photo.id, div);
        });

        div.appendChild(img);
        div.appendChild(deleteIcon);

        return div;
    }

    async function deleteAppartement(id, element) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.error('Token not found. Please log in again.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (response.ok) {
                element.remove();
            } else {
                console.error(`Erreur lors de la suppression de l'appartement, status: ${response.status}`);
            }
        } catch (error) {
            console.error('Erreur lors de la requête de suppression:', error);
        }
        fetchAppartements();
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

    document.getElementById('add-photo').addEventListener('change', previewImage);

    function previewImage(event) {
        const defaultImage = document.getElementById('default-image');
        const addPhotoLabel = document.getElementById('add-photo-label');
        const input = event.target;
        const image = document.getElementById('image-reader');
        const fileInfo = document.querySelector('.add-photo-button p');

        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                image.src = event.target.result;
                image.style.display = 'block';
                defaultImage.style.display = 'none';
                addPhotoLabel.style.display = 'none';
                if (fileInfo) {
                    fileInfo.style.display = 'none';
                }
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            image.style.display = 'none';
            defaultImage.style.display = 'block';
            addPhotoLabel.style.display = 'block';
            if (fileInfo) {
                fileInfo.style.display = 'block';
            }
        }
    }

    document.getElementById('add-photo-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const imageForm = document.getElementById('add-photo');
        const titleForm = document.getElementById('photo-title');
        const categoryForm = document.getElementById('photo-category');

        if (!imageForm || !titleForm || !categoryForm) {
            console.error('Un ou plusieurs éléments du formulaire sont introuvables');
            return;
        }

        const formData = new FormData();
        formData.append('image', imageForm.files[0], imageForm.files[0].name);
        formData.append('title', titleForm.value);
        formData.append('category', categoryForm.value);

        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Vous devez être connecté pour ajouter une photo.');
            console.error('Token not found. Please log in again.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${response.status}`);
            }

            const newPhoto = await response.json();
            const newGalleryElement = createAppartementElement(newPhoto);
            document.getElementById('listeFilm').appendChild(newGalleryElement);

            const newModalElement = createModalPhotoElement(newPhoto);
            document.querySelector('.gallery-content').appendChild(newModalElement);

            event.target.reset();
            document.getElementById('image-reader').style.display = 'none';
            document.getElementById('default-image').style.display = 'block';
            document.querySelector('.add-photo-button p').style.display = 'block';

            addPhotoModal.style.display = 'none';
            galleryModal.style.display = 'block';

        } catch (error) {
            console.error('Erreur lors de l\'ajout de la photo:', error);
        }
    });

    fetchAppartements();

    const closeBtns = document.getElementsByClassName('close-btn');

    manageWorksBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        galleryModal.style.display = 'block';
        addPhotoModal.style.display = 'none';
    });

    Array.from(closeBtns).forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    document.getElementById('add-photo-btn').addEventListener('click', () => {
        galleryModal.style.display = 'none';
        addPhotoModal.style.display = 'block';
    });

    document.getElementById('back-to-gallery-btn').addEventListener('click', () => {
        addPhotoModal.style.display = 'none';
        galleryModal.style.display = 'block';
    });

    createFilters();
    updateEditModeBar();
});
