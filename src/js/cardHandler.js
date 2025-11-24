function handleCardInput(playerCard1, playerCard2, dealerCard) {
    const cards = [playerCard1, playerCard2, dealerCard];
    const total = calculateTotal(cards);
    return total;
}

function calculateTotal(cards) {
    let total = 0;
    let hasAce = false;

    for (const card of cards) {
        if (card === 'Joker') {
            return 21; // Joker sets total to 21
        }
        total += getCardValue(card);
        if (card === 'A') {
            hasAce = true;
        }
    }

    if (hasAce && total + 10 <= 21) {
        total += 10; // Count Ace as 11 if it doesn't bust the total
    }

    return total;
}

function getCardValue(card) {
    const cardValues = {
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        '10': 10,
        'J': 10,
        'Q': 10,
        'K': 10,
        'A': 1 // Ace is counted as 1 by default
    };

    return cardValues[card] || 0; // Return 0 for invalid cards
}