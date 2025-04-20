// État de l'application
const appState = {
    isOnline: navigator.onLine,
    currentUser: null,
    searchQuery: '',
    currentFilter: 'all'
};

// Gestionnaire de connexion
window.addEventListener('load', () => {
    updateOnlineStatus();
    // Vérifier si l'utilisateur est déjà connecté
    checkAuthStatus();
});

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    appState.isOnline = navigator.onLine;
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `status-indicator ${appState.isOnline ? 'online' : 'offline'}`;
    statusIndicator.textContent = appState.isOnline ? '🟢 En ligne' : '🔴 Hors ligne';
    
    // Ajouter ou mettre à jour l'indicateur dans la navbar
    const navbar = document.querySelector('.navbar-nav');
    const existingIndicator = document.querySelector('.status-indicator');
    if (existingIndicator) {
        navbar.removeChild(existingIndicator);
    }
    navbar.appendChild(statusIndicator);
}

// Fonctions de recherche pour la bibliothèque
function initializeLibrarySearch() {
    const searchInput = document.querySelector('input[type="text"]');
    const filterSelect = document.querySelector('select');

    if (searchInput && filterSelect) {
        searchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase();
            filterLibraryContent();
        });

        filterSelect.addEventListener('change', (e) => {
            appState.currentFilter = e.target.value;
            filterLibraryContent();
        });
    }
}

function filterLibraryContent() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const matchesSearch = title.includes(appState.searchQuery);
        const matchesFilter = appState.currentFilter === 'all' || 
                            card.dataset.category === appState.currentFilter;
        
        card.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
    });
}

// Gestion du cache pour le mode hors ligne
async function cacheContent(url) {
    if ('caches' in window) {
        try {
            const cache = await caches.open('educonnect-v1');
            await cache.add(url);
            console.log(`Content cached: ${url}`);
        } catch (error) {
            console.error('Caching failed:', error);
        }
    }
}

// Vérification de l'authentification
function checkAuthStatus() {
    const user = localStorage.getItem('user');
    if (user) {
        appState.currentUser = JSON.parse(user);
        updateUIForAuthenticatedUser();
    }
}

function updateUIForAuthenticatedUser() {
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink && appState.currentUser) {
        loginLink.textContent = `👤 ${appState.currentUser.name}`;
        loginLink.href = '#';
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    initializeLibrarySearch();
    
    // Ajouter les gestionnaires d'événements pour les boutons de téléchargement
    const downloadButtons = document.querySelectorAll('.btn-primary');
    downloadButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            if (!appState.isOnline) {
                alert('Cette action nécessite une connexion Internet');
                return;
            }
            // Logique de téléchargement ici
        });
    });
});