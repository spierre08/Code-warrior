function showError(message) {
    // Créer une alerte d'erreur
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    form.insertAdjacentElement('beforebegin', alert);
}

function showSuccess(message) {
    // Créer une alerte de succès
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show mt-3';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    loginForm.insertAdjacentElement('beforebegin', alert);
}