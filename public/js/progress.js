document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du graphique de progression
    const ctx = document.getElementById('progressChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
            datasets: [{
                label: 'Progression globale',
                data: [30, 45, 55, 60, 75, 85],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // Mise à jour des statistiques en temps réel
    updateStats();
});

function updateStats() {
    // Récupération des statistiques depuis le stockage local
    const stats = JSON.parse(localStorage.getItem('userStats')) || {
        documentsConsulted: 0,
        exercisesCompleted: 0,
        studyTime: 0,
        quizzesPassed: 0
    };

    // Mise à jour de l'affichage
    updateStatDisplay('documentsConsulted', stats.documentsConsulted);
    updateStatDisplay('exercisesCompleted', stats.exercisesCompleted);
    updateStatDisplay('studyTime', formatStudyTime(stats.studyTime));
    updateStatDisplay('quizzesPassed', stats.quizzesPassed);
}

function updateStatDisplay(statId, value) {
    const element = document.querySelector(`[data-stat="${statId}"]`);
    if (element) {
        element.textContent = value;
    }
}

function formatStudyTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
}