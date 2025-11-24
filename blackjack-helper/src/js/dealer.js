// Éléments DOM
const currentRoundEl = document.getElementById('currentRound');
const maxRoundsEl = document.getElementById('maxRounds');
const gameStatusEl = document.getElementById('gameStatus');
const jokerStatusEl = document.getElementById('jokerStatus');
const playersListEl = document.getElementById('playersList');
const logsEl = document.getElementById('activityLogs');

const startGameBtn = document.getElementById('startGameBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const endGameBtn = document.getElementById('endGameBtn');
const resetDataBtn = document.getElementById('resetDataBtn');

// Ajouter un log
function addLog(message, type = 'info') {
    const logEntry = document.createElement('p');
    logEntry.className = `log-entry ${type}`;
    
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    logEntry.textContent = `[${timestamp}] ${message}`;
    
    logsEl.insertBefore(logEntry, logsEl.firstChild);
    
    // Limiter à 50 logs
    if (logsEl.children.length > 50) {
        logsEl.removeChild(logsEl.lastChild);
    }
}

// Mettre à jour l'affichage
function updateDisplay() {
    const gameInfo = getCurrentGameInfo();
    const players = getAllPlayers();
    
    // Infos de la partie
    currentRoundEl.textContent = gameInfo.gameActive ? gameInfo.round : '-';
    maxRoundsEl.textContent = gameInfo.maxRounds;
    
    // Statut
    if (gameInfo.gameActive) {
        gameStatusEl.textContent = '✅ Active';
        gameStatusEl.style.color = '#00ff41';
        startGameBtn.disabled = true;
        nextRoundBtn.disabled = false;
        endGameBtn.disabled = false;
    } else {
        gameStatusEl.textContent = '❌ Inactive';
        gameStatusEl.style.color = '#ff0040';
        startGameBtn.disabled = false;
        nextRoundBtn.disabled = true;
        endGameBtn.disabled = true;
    }
    
    // Joker - Juste l'icône
    if (gameInfo.jokerAvailable) {
        jokerStatusEl.textContent = '🃏';
        jokerStatusEl.style.color = '#ffd700';
        jokerStatusEl.style.fontSize = '2em';
    } else {
        jokerStatusEl.textContent = '❌';
        jokerStatusEl.style.color = '#666';
        jokerStatusEl.style.fontSize = '2em';
    }
    
    // Liste des joueurs
    if (players.length === 0) {
        playersListEl.innerHTML = '<p class="no-players">Aucun joueur enregistré</p>';
    } else {
        playersListEl.innerHTML = '';
        players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.className = `player-card ${player.helpUsed ? 'help-used' : ''}`;
            
            playerCard.innerHTML = `
                <div class="player-name">${player.name}</div>
                <div class="player-stats">
                    <span>Aide: ${player.helpUsed ? '❌ Utilisée' : '✅ Disponible'}</span>
                    <span>Parties: ${player.gamesPlayed}</span>
                </div>
            `;
            
            playersListEl.appendChild(playerCard);
        });
    }
}

// Démarrer une nouvelle partie
startGameBtn.addEventListener('click', () => {
    if (confirm('Démarrer une nouvelle partie ? Cela réinitialisera toutes les aides.')) {
        const jokerAvailable = resetAllHelp();
        addLog('🎮 Nouvelle partie démarrée !', 'success');
        addLog(`🃏 Joker ${jokerAvailable ? 'DISPONIBLE' : 'indisponible'} pour cette partie`, jokerAvailable ? 'success' : 'info');
        
        // Forcer le rafraîchissement immédiat
        setTimeout(() => {
            updateDisplay();
        }, 100);
    }
});

// Manche suivante
nextRoundBtn.addEventListener('click', () => {
    const success = nextRound();
    if (success) {
        const gameInfo = getCurrentGameInfo();
        addLog(`➡️ Manche ${gameInfo.round}/${gameInfo.maxRounds}`, 'success');
    } else {
        addLog('⚠️ Fin de la partie ! Démarrez une nouvelle partie.', 'warning');
        endGame();
    }
    
    // Forcer le rafraîchissement immédiat
    setTimeout(() => {
        updateDisplay();
    }, 100);
});

// Terminer la partie
endGameBtn.addEventListener('click', () => {
    if (confirm('Terminer la partie en cours ?')) {
        endGame();
        addLog('🛑 Partie terminée par le croupier', 'warning');
        
        // Forcer le rafraîchissement immédiat
        setTimeout(() => {
            updateDisplay();
        }, 100);
    }
});

// Réinitialiser toutes les données
resetDataBtn.addEventListener('click', () => {
    if (confirm('⚠️ ATTENTION ! Cela supprimera TOUTES les données (joueurs, parties, etc.). Confirmer ?')) {
        if (confirm('Êtes-vous VRAIMENT sûr ? Cette action est irréversible !')) {
            resetAllData();
            addLog('⚠️ Toutes les données ont été supprimées', 'error');
            
            // Forcer le rafraîchissement immédiat
            setTimeout(() => {
                updateDisplay();
            }, 100);
        }
    }
});

// Initialisation
updateDisplay();
addLog('🟢 Interface croupier prête', 'success');

// Rafraîchir l'affichage toutes les 5 secondes
setInterval(updateDisplay, 5000);