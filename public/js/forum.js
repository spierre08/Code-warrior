document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('input[type="text"]');
    const matiereFilter = document.getElementById('matiere-filter');
    const questionForm = document.getElementById('questionForm');

    // Gestion de la recherche
    searchInput.addEventListener('input', (e) => {
        filterQuestions(e.target.value, matiereFilter.value);
    });

    // Gestion du filtre par matière
    matiereFilter.addEventListener('change', (e) => {
        filterQuestions(searchInput.value, e.target.value);
    });

    // Gestion du formulaire de nouvelle question
    questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!appState.isOnline) {
            alert('Cette action nécessite une connexion Internet');
            return;
        }

        const formData = new FormData(questionForm);
        saveQuestion(formData);
        
        // Fermer le modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('newQuestionModal'));
        modal.hide();
        
        // Réinitialiser le formulaire
        questionForm.reset();
    });
});

function filterQuestions(searchQuery, matiere) {
    const questions = document.querySelectorAll('.list-group-item');
    
    questions.forEach(question => {
        const title = question.querySelector('h5').textContent.toLowerCase();
        const questionMatiere = question.querySelector('.badge').textContent;
        
        const matchesSearch = title.includes(searchQuery.toLowerCase());
        const matchesMatiere = matiere === 'Toutes les matières' || questionMatiere === matiere;
        
        question.style.display = matchesSearch && matchesMatiere ? 'block' : 'none';
    });
}

async function saveQuestion(formData) {
    try {
        // Si hors ligne, sauvegarder dans IndexedDB pour synchronisation ultérieure
        if (!appState.isOnline) {
            await saveQuestionOffline(formData);
            return;
        }

        // Si en ligne, envoyer au serveur
        const response = await fetch('/api/questions', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // Actualiser la liste des questions
            location.reload();
        }
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la question:', error);
        alert('Une erreur est survenue lors de la publication de votre question');
    }
}

async function saveQuestionOffline(formData) {
    // Implémentation de la sauvegarde locale à venir
    console.log('Question sauvegardée localement pour synchronisation ultérieure');
}