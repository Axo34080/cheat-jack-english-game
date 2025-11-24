// Définition des cartes
const cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'JOKER'];
const suits = {
    spades: '♠',
    hearts: '♥',
    clubs: '♣',
    diamonds: '♦'
};

// Variables pour stocker les sélections
let selectedCards = {
    playerCard1: null,
    playerCard2: null,
    dealerCard: null
};

let currentSuitFilter = 'all';

// Variables pour détecter les changements
let previousHelpStatus = null;
let previousGameActive = null;
let previousRound = null;
let previousJokerStatus = null; // ← AJOUTE cette variable

// Variable pour savoir si le Joker est disponible dans cette partie
let isJokerAvailable = false;

// Fonction pour déterminer si le Joker est disponible (5% de chance)
function determineJokerAvailability() {
    isJokerAvailable = Math.random() < 0.05; // 5% de chance
    console.log('Joker disponible:', isJokerAvailable);
    return isJokerAvailable;
}

// Création d'une carte
function createCard(value, suitKey, className) {
    const card = document.createElement('div');
    card.className = `card ${className}`;
    card.dataset.value = value;
    card.dataset.suit = suitKey || 'joker';

    if (value === 'JOKER') {
        card.innerHTML = `
            <div class="card-value">🃏</div>
            <div class="card-value">JOKER</div>
        `;
    } else {
        card.innerHTML = `
            <div class="card-value">${value}</div>
            <div class="card-suit">${suits[suitKey]}</div>
        `;
    }

    return card;
}

// Génération des cartes pour une grille
function generateCards(gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    cardValues.forEach(value => {
        if (value === 'JOKER') {
            // N'ajouter le Joker que s'il est disponible
            if (isJokerAvailable) {
                const jokerCard = createCard(value, null, 'joker');
                jokerCard.addEventListener('click', () => selectCard(jokerCard, gridId));
                grid.appendChild(jokerCard);
            }
        } else {
            // Cartes normales pour chaque couleur
            Object.keys(suits).forEach(suitKey => {
                const card = createCard(value, suitKey, suitKey);
                card.addEventListener('click', () => selectCard(card, gridId));
                grid.appendChild(card);
            });
        }
    });
}

// Sélection d'une carte
function selectCard(card, gridId) {
    const grid = document.getElementById(gridId);
    const previousSelected = grid.querySelector('.card.selected');
    
    // Retirer la sélection précédente
    if (previousSelected) {
        previousSelected.classList.remove('selected');
    }

    // Ajouter la nouvelle sélection
    card.classList.add('selected');

    // Sauvegarder la sélection
    const value = card.dataset.value;
    const suit = card.dataset.suit;
    const cardName = value === 'JOKER' ? 'JOKER' : `${value}${suits[suit]}`;

    if (gridId === 'playerCard1Grid') {
        selectedCards.playerCard1 = { value, suit };
        document.getElementById('card1Selected').textContent = cardName;
    } else if (gridId === 'playerCard2Grid') {
        selectedCards.playerCard2 = { value, suit };
        document.getElementById('card2Selected').textContent = cardName;
    } else if (gridId === 'dealerCardGrid') {
        selectedCards.dealerCard = { value, suit };
        document.getElementById('dealerCardSelected').textContent = cardName;
    }

    // Vérifier si toutes les cartes sont sélectionnées
    checkAllCardsSelected();
}

// Vérifier si toutes les cartes sont sélectionnées
function checkAllCardsSelected() {
    const allSelected = selectedCards.playerCard1 && 
                       selectedCards.playerCard2 && 
                       selectedCards.dealerCard;

    const adviceButton = document.getElementById('getAdvice');
    adviceButton.disabled = !allSelected;
}

// Filtre de couleur
function setupSuitFilter() {
    const suitButtons = document.querySelectorAll('.suit-btn');
    
    suitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer l'état actif de tous les boutons
            suitButtons.forEach(b => b.classList.remove('active'));
            
            // Ajouter l'état actif au bouton cliqué
            btn.classList.add('active');
            
            // Appliquer le filtre
            currentSuitFilter = btn.dataset.suit;
            applyFilter(currentSuitFilter);
        });
    });
}

// Appliquer le filtre de couleur
function applyFilter(suit) {
    const allCards = document.querySelectorAll('.card');
    
    allCards.forEach(card => {
        if (suit === 'all') {
            card.classList.remove('hidden');
        } else {
            if (card.dataset.suit === suit || card.dataset.suit === 'joker') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// Filtre de couleur - Version pour mini-filtres individuels
function setupMiniSuitFilters() {
    const miniSuitButtons = document.querySelectorAll('.mini-suit-btn');
    
    miniSuitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetGrid = btn.dataset.grid;
            const suit = btn.dataset.suit;
            
            // Retirer l'état actif uniquement des boutons de ce groupe
            const parentFilter = btn.parentElement;
            parentFilter.querySelectorAll('.mini-suit-btn').forEach(b => b.classList.remove('active'));
            
            // Ajouter l'état actif au bouton cliqué
            btn.classList.add('active');
            
            // Appliquer le filtre uniquement à la grille ciblée
            applyFilterToGrid(targetGrid, suit);
        });
    });
}

// Appliquer le filtre à une grille spécifique
function applyFilterToGrid(gridId, suit) {
    const grid = document.getElementById(gridId);
    const cards = grid.querySelectorAll('.card');
    
    cards.forEach(card => {
        if (suit === 'all') {
            card.classList.remove('hidden');
        } else {
            if (card.dataset.suit === suit || card.dataset.suit === 'joker') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        }
    });
}

// Fonction pour rafraîchir le statut du joueur
function refreshPlayerStatus() {
    const playerName = localStorage.getItem('currentPlayer') || 'Guest';
    const helpStatus = canUseHelp(playerName);
    const helpStatusElement = document.getElementById('helpStatus');
    const gameInfo = getCurrentGameInfo();
    
    // Mettre à jour l'info de la manche
    const roundInfoEl = document.getElementById('roundInfo');
    if (roundInfoEl) {
        if (gameInfo.gameActive) {
            roundInfoEl.textContent = `${gameInfo.round}/${gameInfo.maxRounds}`;
            roundInfoEl.style.color = '#00ff41';
        } else {
            roundInfoEl.textContent = 'Partie inactive';
            roundInfoEl.style.color = '#ff0040';
        }
    }
    
    // Vérifier si le statut a changé
    const statusChanged = previousHelpStatus === false && helpStatus.allowed === true;
    const gameStatusChanged = previousGameActive !== null && previousGameActive !== gameInfo.gameActive;
    const roundChanged = previousRound !== null && previousRound !== gameInfo.round;
    const shouldReset = statusChanged || gameStatusChanged || roundChanged;
    
    // Détecter la fin de partie (passage de active à inactive)
    if (previousGameActive === true && gameInfo.gameActive === false) {
        showEndGameModal();
    }
    
    // Réinitialiser si nécessaire (AVANT de vérifier helpStatus.allowed)
    if (shouldReset) {
        console.log('Changement détecté, réinitialisation...');
        resetCardSelections();
        
        // Cacher la section résultat
        const resultSection = document.querySelector('.result-section');
        if (resultSection) {
            resultSection.style.display = 'none';
        }
    }
    
    // Mettre à jour le statut de l'aide
    if (helpStatus.allowed) {
        helpStatusElement.textContent = '✅ Disponible';
        helpStatusElement.style.color = '#00ff41';
        
        // Réactiver le bouton si toutes les cartes sont sélectionnées
        const adviceBtn = document.getElementById('getAdvice');
        if (selectedCards.playerCard1 && selectedCards.playerCard2 && selectedCards.dealerCard) {
            adviceBtn.disabled = false;
            adviceBtn.textContent = 'Laisse moi compter les cartes';
        } else {
            adviceBtn.disabled = true;
            adviceBtn.textContent = 'Laisse moi compter les cartes';
        }
        
    } else {
        helpStatusElement.textContent = '❌ Utilisée';
        helpStatusElement.style.color = '#ff0040';
        
        // Désactiver le bouton
        const adviceBtn = document.getElementById('getAdvice');
        adviceBtn.disabled = true;
        adviceBtn.textContent = 'Aide déjà utilisée';
    }
    
    // Sauvegarder l'état actuel pour la prochaine vérification
    previousHelpStatus = helpStatus.allowed;
    previousGameActive = gameInfo.gameActive;
    previousRound = gameInfo.round;
    
    // CORRECTION : Vérifier le Joker SEULEMENT si c'était déjà initialisé
    if (previousJokerStatus !== null && previousJokerStatus !== gameInfo.jokerAvailable) {
        console.log('Statut du Joker changé, rechargement de la page...');
        location.reload();
    }
    
    // Sauvegarder le statut Joker actuel
    previousJokerStatus = gameInfo.jokerAvailable;
}

// Fonction pour afficher la popup de fin de partie
function showEndGameModal() {
    const modal = document.getElementById('endGameModal');
    modal.style.display = 'flex';
    
    // Bouton Continuer
    document.getElementById('continueBtn').onclick = () => {
        modal.style.display = 'none';
        console.log('Le joueur continue avec le même compte');
    };
    
    // Bouton Se déconnecter
    document.getElementById('logoutBtn').onclick = () => {
        localStorage.removeItem('currentPlayer');
        window.location.href = 'index.html';
    };
}

// Fonction pour réinitialiser les sélections de cartes
function resetCardSelections() {
    // Retirer toutes les sélections visuelles
    document.querySelectorAll('.card.selected').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Réinitialiser les données de sélection
    selectedCards = {
        playerCard1: null,
        playerCard2: null,
        dealerCard: null
    };
    
    // Réinitialiser les textes affichés
    const card1SelectedEl = document.getElementById('card1Selected');
    const card2SelectedEl = document.getElementById('card2Selected');
    const dealerCardSelectedEl = document.getElementById('dealerCardSelected');
    
    if (card1SelectedEl) card1SelectedEl.textContent = 'Aucune';
    if (card2SelectedEl) card2SelectedEl.textContent = 'Aucune';
    if (dealerCardSelectedEl) dealerCardSelectedEl.textContent = 'Aucune';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le nom du joueur (pour l'instant on utilise "Guest", on changera avec la page de connexion)
    const playerName = localStorage.getItem('currentPlayer') || 'Guest';
    document.getElementById('playerName').textContent = playerName;
    
    // Vérifier si le joueur peut utiliser l'aide
    refreshPlayerStatus();
    
    // Récupérer les infos de la partie pour le Joker
    const gameInfo = getCurrentGameInfo();
    isJokerAvailable = gameInfo.jokerAvailable;
    
    // Générer les cartes pour chaque grille
    generateCards('playerCard1Grid');
    generateCards('playerCard2Grid');
    generateCards('dealerCardGrid');

    // Configurer les mini-filtres de couleur
    setupMiniSuitFilters();

    // Vérifier les changements toutes les 2 secondes
    setInterval(refreshPlayerStatus, 2000);

    // Gestionnaire pour le bouton "Obtenir un conseil"
    document.getElementById('getAdvice').addEventListener('click', () => {
        // Vérifier si le joueur peut utiliser l'aide
        const helpCheck = canUseHelp(playerName);
        
        if (!helpCheck.allowed) {
            alert(helpCheck.reason);
            return;
        }
        
        console.log('Cartes sélectionnées:', selectedCards);
        
        // Calculer le meilleur coup avec la stratégie
        const result = getBestMove(
            selectedCards.playerCard1,
            selectedCards.playerCard2,
            selectedCards.dealerCard
        );
        
        // Marquer l'aide comme utilisée
        markHelpAsUsed(playerName);
        
        // Rafraîchir le statut
        refreshPlayerStatus();
        
        // Afficher la section résultat
        const resultSection = document.querySelector('.result-section');
        resultSection.style.display = 'block';
        
        // Afficher l'action et la raison
        const bestMoveElement = document.getElementById('bestMove');
        bestMoveElement.innerHTML = `
            <strong style="font-size: 1.5em; color: #ffd700;">${result.action}</strong>
            <br><br>
            <span style="color: #00d4ff; font-size: 0.95em; white-space: pre-line;">${result.reason}</span>
        `;
    });
});

// Exporter les sélections pour les autres modules
function getSelectedCards() {
    return selectedCards;
}