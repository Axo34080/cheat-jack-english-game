// src/js/app.js

console.log('Blackjack Helper initialized');

// Fonction utilitaire pour démarrer une nouvelle partie (appelée par le croupier)
function startNewGame() {
    const jokerAvailable = resetAllHelp();
    console.log('Nouvelle partie démarrée!');
    console.log('Joker disponible:', jokerAvailable);
    
    // Recharger la page pour rafraîchir l'interface
    if (window.location.pathname.includes('player.html')) {
        location.reload();
    }
    
    return jokerAvailable;
}

// Exposer les fonctions globalement pour la console (debug)
window.blackjackHelper = {
    startNewGame,
    resetAllHelp,
    nextRound,
    endGame,
    getCurrentGameInfo,
    getAllPlayers,
    getPlayerStatus,
    resetAllData
};

console.log('Pour déboguer, utilisez: window.blackjackHelper');