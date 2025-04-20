document.addEventListener('DOMContentLoaded', () => {
    // Initialisation des composants
    initializeDashboard();
    loadRecentActivities();
    initializeAdminUI();

    // Gestion du formulaire d'ajout de cours
    const newCourseForm = document.getElementById('newCourseForm');
    if (newCourseForm) {
        newCourseForm.addEventListener('submit', handleNewCourse);
    }
});

function initializeDashboard() {
    // Toggle sidebar on mobile
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

async function loadRecentActivities() {
    const activitiesTable = document.getElementById('recentActivities');
    if (!activitiesTable) return;

    try {
        // Simuler un chargement depuis une API
        const activities = [
            {
                user: "John Doe",
                action: "A téléchargé Mathématiques Chapitre 3",
                date: "2024-04-15 14:30",
                status: "success"
            },
            {
                user: "Jane Smith",
                action: "A ajouté un nouveau cours",
                date: "2024-04-15 13:45",
                status: "info"
            }
        ];

        // Remplir le tableau
        activities.forEach(activity => {
            const row = createActivityRow(activity);
            activitiesTable.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
    }
}

function createActivityRow(activity) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${activity.user}</td>
        <td>${activity.action}</td>
        <td>${formatDate(activity.date)}</td>
        <td><span class="badge bg-${activity.status}">${getStatusText(activity.status)}</span></td>
    `;
    return tr;
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function getStatusText(status) {
    const statusMap = {
        success: 'Terminé',
        info: 'En cours',
        warning: 'En attente',
        danger: 'Erreur'
    };
    return statusMap[status] || status;
}

async function handleNewCourse(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    try {
        // Simuler l'envoi à une API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newCourseModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        e.target.reset();
        
        // Afficher une notification
        showNotification('Cours ajouté avec succès!', 'success');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du cours:', error);
        showNotification('Erreur lors de l\'ajout du cours', 'danger');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.querySelector('.main-content').insertAdjacentElement('afterbegin', notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function initializeAdminUI() {
    setupSidebar();
    setupDropdowns();
    highlightActivePage();
}

function setupSidebar() {
    const toggleBtn = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleBtn && sidebar) {
        // Restaurer l'état de la sidebar depuis le localStorage
        const isSidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isSidebarCollapsed) {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }

        // Gérer le clic sur le bouton toggle
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            // Sauvegarder l'état dans le localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });

        // Gérer le clic en dehors sur mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const isClickInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
                if (!isClickInside && !sidebar.classList.contains('collapsed')) {
                    sidebar.classList.add('collapsed');
                    mainContent.classList.add('expanded');
                    localStorage.setItem('sidebarCollapsed', 'true');
                }
            }
        });

        // Gérer le redimensionnement
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('expanded');
                localStorage.setItem('sidebarCollapsed', 'false');
            }
        });
    }
}

function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
    });
}

function highlightActivePage() {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar .list-group-item');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
    });
}