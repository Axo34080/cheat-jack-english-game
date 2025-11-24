// Conversion des valeurs de cartes en valeurs numériques
function getCardValue(card) {
    if (card === 'JOKER') return 21; // Le Joker vaut instantanément 21
    if (card === 'A') return 11; // As vaut 11 par défaut (peut être 1 aussi)
    if (['J', 'Q', 'K'].includes(card)) return 10;
    return parseInt(card);
}

// Calculer le total de la main du joueur
function calculateHandValue(cards) {
    // Si un Joker est présent, retour direct 21
    if (cards.some(c => c.value === 'JOKER')) {
        return { total: 21, soft: false, isBlackjack: true };
    }

    let total = 0;
    let aces = 0;

    cards.forEach(card => {
        const value = getCardValue(card.value);
        if (card.value === 'A') {
            aces++;
            total += 11;
        } else {
            total += value;
        }
    });

    // Ajuster pour les As (convertir 11 en 1 si nécessaire)
    while (total > 21 && aces > 0) {
        total -= 10; // Convertir un As de 11 à 1
        aces--;
    }

    const soft = aces > 0; // Main "soft" si elle contient un As compté comme 11
    const isBlackjack = total === 21 && cards.length === 2;

    return { total, soft, isBlackjack };
}

// Vérifier si on a une paire (pour SPLIT)
function isPair(card1, card2) {
    return card1.value === card2.value;
}

// Logique principale de stratégie Blackjack avec explications
function getBestMove(playerCard1, playerCard2, dealerCard) {
    const playerCards = [playerCard1, playerCard2];
    const playerHand = calculateHandValue(playerCards);
    const dealerValue = getCardValue(dealerCard.value);
    
    // Texte d'explication
    const playerTotal = playerHand.total;
    const dealerCardName = dealerCard.value === 'A' ? 'As' : dealerCard.value;

    // Si Joker, toujours STAND (on a déjà 21)
    if (playerHand.isBlackjack && playerCards.some(c => c.value === 'JOKER')) {
        return {
            action: 'STAND (Rester)',
            reason: `Vous avez 21 avec le Joker! 🃏\n\nC'est le score parfait, impossible de faire mieux. Restez tranquille et profitez de votre victoire assurée (sauf si le croupier a aussi 21).`
        };
    }

    // Blackjack naturel (As + 10/J/Q/K)
    if (playerHand.isBlackjack) {
        return {
            action: 'STAND (Rester)',
            reason: `Blackjack naturel! 🎉\n\nVous avez ${playerTotal} avec seulement 2 cartes (As + figure/10). C'est la meilleure main possible et vous gagnez 1.5x votre mise (sauf si le croupier a aussi un Blackjack).`
        };
    }

    // Vérifier si on peut SPLIT (paire)
    if (isPair(playerCard1, playerCard2)) {
        const pairValue = playerCard1.value;
        
        // Toujours split les As et les 8
        if (pairValue === 'A') {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos As! 🎴\n\n📚 SPLIT = Séparer vos 2 cartes identiques en 2 mains différentes (mise x2).\n\nDeux As valent seulement 12 ensemble (ou 2). En les séparant, vous avez 2 chances d'obtenir un 10/J/Q/K pour faire 21. C'est mathématiquement la meilleure option.`
            };
        }
        
        if (pairValue === '8') {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos 8! 🎴\n\n📚 SPLIT = Séparer vos 2 cartes identiques en 2 mains différentes (mise x2).\n\nDeux 8 = 16, la pire main du Blackjack. En les séparant, vous transformez une mauvaise situation en deux mains qui commencent à 8, avec plus de chances d'amélioration.`
            };
        }
        
        // Ne jamais split les 10, J, Q, K
        if (['10', 'J', 'Q', 'K'].includes(pairValue)) {
            return {
                action: 'STAND (Rester)',
                reason: `Ne séparez JAMAIS vos figures/10! 🚫\n\nVous avez déjà 20, la deuxième meilleure main possible. Séparer serait stupide : vous risquez de transformer une excellente main en deux mains médiocres.`
            };
        }
        
        // Split les paires en fonction du croupier
        if (pairValue === '9' && dealerValue <= 9 && dealerValue !== 7) {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos 9 contre ${dealerCardName}\n\n📚 SPLIT = Séparer en 2 mains (mise x2).\n\nVous avez 18, ce qui est bon. Mais le croupier montre une carte faible (${dealerCardName}), donc il risque de dépasser 21 (perdre automatiquement). En séparant, vous doublez vos gains potentiels avec peu de risque.`
            };
        }
        
        if (pairValue === '7' && dealerValue <= 7) {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos 7 contre ${dealerCardName}\n\n📚 SPLIT = Séparer en 2 mains (mise x2).\n\nLe croupier a une carte moyenne/faible. Séparer vos 7 vous donne de bonnes chances d'améliorer chaque main, surtout que le croupier risque de s'arrêter sur 17 ou moins.`
            };
        }
        
        if (pairValue === '6' && dealerValue <= 6) {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos 6 contre ${dealerCardName}\n\n📚 SPLIT = Séparer en 2 mains (mise x2).\n\nLe croupier montre une carte très faible (2-6). Il a de fortes chances de dépasser 21 et donc perdre automatiquement. Profitez-en pour doubler vos gains avec deux mains au lieu d'une.`
            };
        }
        
        if (['2', '3'].includes(pairValue) && dealerValue <= 7) {
            return {
                action: 'SPLIT (Séparer)',
                reason: `Séparez vos ${pairValue} contre ${dealerCardName}\n\n📚 SPLIT = Séparer en 2 mains (mise x2).\n\nLe croupier n'a pas une main très forte. Séparer vous donne deux chances de construire des mains décentes, plutôt qu'une seule main faible.`
            };
        }
    }

    // Main "soft" (avec As compté comme 11)
    if (playerHand.soft) {
        if (playerHand.total >= 19) {
            return {
                action: 'STAND (Rester)',
                reason: `Restez avec votre ${playerTotal} "soft"\n\n📚 SOFT = Main avec un As qui compte pour 11 (flexible).\n📚 STAND = Ne plus tirer de carte.\n\nVous avez déjà une excellente main (${playerTotal}). Tirer une carte risque de vous faire perdre cet avantage. Le croupier doit avoir 20+ pour vous battre, ce qui est peu probable.`
            };
        }
        
        if (playerHand.total === 18) {
            if (dealerValue >= 9) {
                return {
                    action: 'HIT (Tirer)',
                    reason: `Tirez avec votre 18 "soft" contre ${dealerCardName}\n\n📚 SOFT = Main avec un As flexible (peut devenir 1 ou 11).\n📚 HIT = Tirer une carte supplémentaire.\n\nLe croupier a une forte carte (${dealerCardName}). Votre 18 ne suffit probablement pas. Comme c'est un "soft 18" (avec As), vous ne risquez rien : l'As peut devenir 1 si vous dépassez.`
                };
            }
            if (dealerValue >= 3 && dealerValue <= 6) {
                return {
                    action: 'DOUBLE (Doubler)',
                    reason: `Doublez avec 18 "soft" contre ${dealerCardName}! 💰\n\n📚 DOUBLE = Doubler votre mise, mais vous ne pouvez tirer qu'UNE seule carte supplémentaire.\n\nLe croupier montre une carte faible (${dealerCardName}), il va probablement dépasser 21. Doublez votre mise pour maximiser vos gains. Si la table ne permet pas de doubler, tirez une carte normalement.`
                };
            }
            return {
                action: 'STAND (Rester)',
                reason: `Restez avec 18 "soft" contre ${dealerCardName}\n\n📚 SOFT = Main avec un As flexible.\n📚 STAND = Ne plus tirer de carte.\n\nVous avez une bonne main et le croupier n'a pas une carte trop menaçante. Pas besoin de prendre de risques inutiles.`
            };
        }
        
        if (playerHand.total === 17) {
            if (dealerValue >= 3 && dealerValue <= 6) {
                return {
                    action: 'DOUBLE (Doubler)',
                    reason: `Doublez avec 17 "soft" contre ${dealerCardName}! 💰\n\n📚 DOUBLE = Doubler la mise, mais 1 seule carte en plus.\n\nLe croupier a une carte faible, il va probablement dépasser 21 et perdre automatiquement. Votre 17 "soft" peut s'améliorer sans risque (l'As devient 1 si besoin). Profitez-en pour doubler vos gains!`
                };
            }
            return {
                action: 'HIT (Tirer)',
                reason: `Tirez avec 17 "soft" contre ${dealerCardName}\n\n📚 HIT = Tirer une carte.\n📚 SOFT = As flexible (devient 1 si vous dépassez).\n\n17 est une main médiocre. Mais comme c'est "soft" (avec As comptant pour 11), vous pouvez tirer sans risque de dépasser 21 immédiatement. Tentez d'améliorer votre main!`
            };
        }
        
        if (playerHand.total >= 15 && playerHand.total <= 16) {
            if (dealerValue >= 4 && dealerValue <= 6) {
                return {
                    action: 'DOUBLE (Doubler)',
                    reason: `Doublez avec ${playerTotal} "soft" contre ${dealerCardName}! 💰\n\n📚 DOUBLE = x2 la mise, 1 carte max.\n\nLe croupier montre une carte très faible. Vous avez une main qui peut s'améliorer sans risque. Doublez pour maximiser vos profits quand le croupier va dépasser 21 et perdre!`
                };
            }
            return {
                action: 'HIT (Tirer)',
                reason: `Tirez avec ${playerTotal} "soft"\n\n📚 HIT = Tirer une carte.\n\nVotre main est faible, mais vous avez un As flexible. Vous pouvez tirer sans craindre de dépasser 21 immédiatement. Essayez d'améliorer vers 17+.`
            };
        }
        
        if (playerHand.total >= 13 && playerHand.total <= 14) {
            if (dealerValue >= 5 && dealerValue <= 6) {
                return {
                    action: 'DOUBLE (Doubler)',
                    reason: `Doublez avec ${playerTotal} "soft" contre ${dealerCardName}! 💰\n\n📚 DOUBLE = x2 la mise, 1 carte max.\n\nLe croupier a la pire carte possible (5 ou 6). Il va probablement dépasser 21 et perdre automatiquement. Même avec votre main moyenne, doublez pour profiter de sa faiblesse!`
                };
            }
            return {
                action: 'HIT (Tirer)',
                reason: `Tirez avec ${playerTotal} "soft"\n\n📚 HIT = Tirer une carte.\n\nVotre total est trop faible pour rester. Heureusement, l'As vous protège : tirez pour améliorer sans risque immédiat de dépasser 21.`
            };
        }
    }

    // Main "hard" (sans As ou As compté comme 1)
    if (playerHand.total >= 17) {
        return {
            action: 'STAND (Rester)',
            reason: `Restez avec ${playerTotal}\n\n📚 STAND = Ne plus tirer de carte.\n\nVous avez une bonne main (17-21). Tirer risquerait de vous faire dépasser 21 et perdre automatiquement. Le croupier doit tirer jusqu'à 17 minimum, donc il a plus de chances de dépasser 21 que vous de vous améliorer.`
        };
    }
    
    if (playerHand.total >= 13 && playerHand.total <= 16) {
        if (dealerValue <= 6) {
            return {
                action: 'STAND (Rester)',
                reason: `Restez avec ${playerTotal} contre ${dealerCardName}\n\n📚 STAND = Ne plus tirer.\n\nVotre main est faible (${playerTotal}), mais le croupier montre une carte faible (${dealerCardName}). Il a de fortes chances de dépasser 21 en tirant des cartes. Ne prenez pas de risque : laissez-le perdre tout seul en dépassant 21!`
            };
        }
        
        if (dealerValue >= 7) {
            // Option SURRENDER si total 15 ou 16 contre 9, 10, A
            if ((playerHand.total === 15 || playerHand.total === 16) && dealerValue >= 9) {
                return {
                    action: 'SURRENDER (Abandonner)',
                    reason: `Abandonnez avec ${playerTotal} contre ${dealerCardName} (ou tirez si impossible) ⚠️\n\n📚 SURRENDER = Abandonner la main et récupérer 50% de votre mise.\n\nC'est la PIRE situation du Blackjack : 15-16 contre 9/10/As du croupier. Statistiquement, vous perdez 75% du temps. Abandonnez pour limiter vos pertes à 50%. Si la table n'autorise pas l'abandon, tirez une carte et croisez les doigts.`
                };
            }
            
            return {
                action: 'HIT (Tirer)',
                reason: `Tirez avec ${playerTotal} contre ${dealerCardName}\n\n📚 HIT = Tirer une carte.\n\nLe croupier a une forte carte (${dealerCardName}). Votre ${playerTotal} ne suffit probablement pas. Oui, vous risquez de dépasser 21 et perdre, mais rester garantit presque la défaite. Tentez votre chance!`
            };
        }
    }
    
    if (playerHand.total === 12) {
        if (dealerValue >= 4 && dealerValue <= 6) {
            return {
                action: 'STAND (Rester)',
                reason: `Restez avec 12 contre ${dealerCardName}\n\n📚 STAND = Ne plus tirer de carte.\n\nLe croupier montre une carte faible (4-6). Il va devoir tirer des cartes et risque fortement de dépasser 21 et perdre automatiquement. Même si votre 12 est médiocre, ne prenez pas le risque de dépasser 21 vous-même. Laissez le croupier se tirer une balle dans le pied!`
            };
        }
        return {
            action: 'HIT (Tirer)',
            reason: `Tirez avec 12 contre ${dealerCardName}\n\n📚 HIT = Tirer une carte.\n\n12 est une main faible. Le croupier a une carte correcte, il ne va probablement pas dépasser 21. Vous devez améliorer votre main pour avoir une chance de gagner.`
        };
    }
    
    if (playerHand.total === 11) {
        return {
            action: 'DOUBLE (Doubler)',
            reason: `DOUBLEZ avec 11! 💰💰💰\n\n📚 DOUBLE = Doubler votre mise, mais vous ne pouvez tirer qu'UNE carte supplémentaire.\n\nC'est LA meilleure situation pour doubler! Vous avez 11, donc environ 30% de chance de tirer un 10/J/Q/K pour faire 21. Doublez TOUJOURS avec 11, quelle que soit la carte du croupier!`
        };
    }
    
    if (playerHand.total === 10) {
        if (dealerValue <= 9) {
            return {
                action: 'DOUBLE (Doubler)',
                reason: `Doublez avec 10 contre ${dealerCardName}! 💰\n\n📚 DOUBLE = x2 la mise, 1 carte max.\n\nVous avez de bonnes chances de tirer un 10/J/Q/K pour faire 20 (excellente main!). Le croupier n'a pas d'As, donc doublez pour maximiser vos gains! Si la table n'autorise pas, tirez normalement.`
            };
        }
        return {
            action: 'HIT (Tirer)',
            reason: `Tirez avec 10 contre ${dealerCardName}\n\n📚 HIT = Tirer une carte.\n\nLe croupier a un As, donc potentiellement un Blackjack ou une forte main. Ne doublez pas votre mise, mais tirez quand même : 10 peut facilement devenir 20.`
        };
    }
    
    if (playerHand.total === 9) {
        if (dealerValue >= 3 && dealerValue <= 6) {
            return {
                action: 'DOUBLE (Doubler)',
                reason: `Doublez avec 9 contre ${dealerCardName}! 💰\n\n📚 DOUBLE = x2 la mise, 1 carte max.\n\nLe croupier a une carte faible (${dealerCardName}). Vous pouvez facilement améliorer votre 9, et il va probablement dépasser 21. Doublez pour profiter de la situation! Si impossible, tirez normalement.`
            };
        }
        return {
            action: 'HIT (Tirer)',
            reason: `Tirez avec 9 contre ${dealerCardName}\n\n📚 HIT = Tirer une carte.\n\n9 est trop faible pour rester. Le croupier a une carte décente, donc ne doublez pas. Tirez simplement pour améliorer votre main.`
        };
    }
    
    if (playerHand.total <= 8) {
        return {
            action: 'HIT (Tirer)',
            reason: `Tirez avec ${playerTotal}\n\n📚 HIT = Tirer une carte.\n\nVous avez 8 ou moins, c'est IMPOSSIBLE de dépasser 21 sur la prochaine carte! Tirez sans hésitation pour améliorer votre main. Ne JAMAIS rester avec 8 ou moins.`
            };
    }

    return {
        action: 'STAND (Rester)',
        reason: `Situation par défaut : restez\n\n📚 STAND = Ne plus tirer de carte.\n\nVotre main est correcte dans cette situation particulière. Restez prudent.`
    };
}
