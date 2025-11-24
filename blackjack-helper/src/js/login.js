// Mot de passe croupier (à changer selon tes besoins)
const DEALER_PASSWORD = 'dealer123';

// Éléments DOM
const playerNameInput = document.getElementById('playerName');
const dealerPasswordInput = document.getElementById('dealerPassword');
const playerLoginBtn = document.getElementById('playerLoginBtn');
const dealerLoginBtn = document.getElementById('dealerLoginBtn');
const errorMessageDiv = document.getElementById('errorMessage');

// Fonction pour afficher un message d'erreur
function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    
    setTimeout(() => {
        errorMessageDiv.style.display = 'none';
    }, 3000);
}

// Connexion joueur
playerLoginBtn.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    
    if (name === '') {
        showError('❌ Veuillez entrer votre nom');
        playerNameInput.focus();
        return;
    }
    
    if (name.length < 2) {
        showError('❌ Le nom doit contenir au moins 2 caractères');
        playerNameInput.focus();
        return;
    }
    
    // Sauvegarder le nom du joueur
    localStorage.setItem('currentPlayer', name);
    
    // Rediriger vers la page joueur
    window.location.href = 'player.html';
});

// Connexion croupier
dealerLoginBtn.addEventListener('click', () => {
    const password = dealerPasswordInput.value;
    
    if (password === '') {
        showError('❌ Veuillez entrer le mot de passe');
        dealerPasswordInput.focus();
        return;
    }
    
    if (password !== DEALER_PASSWORD) {
        showError('❌ Mot de passe incorrect');
        dealerPasswordInput.value = '';
        dealerPasswordInput.focus();
        return;
    }
    
    // Rediriger vers l'interface croupier
    window.location.href = 'dealer.html';
});

// Permettre la connexion avec la touche Entrée
playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        playerLoginBtn.click();
    }
});

dealerPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        dealerLoginBtn.click();
    }
});

// Focus automatique sur le champ nom
playerNameInput.focus();