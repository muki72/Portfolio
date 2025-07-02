const zaapy = document.getElementById("zaapy");
const diet = document.getElementById("diet");
const container = document.querySelector('.project-container');
const icons = container.querySelectorAll('.icon');


// switch entre les different projets
icons[0].addEventListener('click', () => {
    zaapy.style.display = "flex"
    diet.style.display = "none"
    jack.style.display = "none"
});

icons[1].addEventListener('click', () => {
    diet.style.display = "flex"
    zaapy.style.display = "none"
    jack.style.display = "none"
});

icons[2].addEventListener('click', () => {
    jack.style.display = "flex"
    diet.style.display = "none"
    zaapy.style.display = "none"
});


//effet de slide in
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.slide-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // On ajoute un décalage progressif si plusieurs éléments entrent en vue en même temps
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, index * 100);

                observer.unobserve(entry.target); // ne l'observe qu'une fois
            }
        });
    }, {
        threshold: 0.3
    });

    elements.forEach(el => observer.observe(el));
});

// copy clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showCopyModal();
        })
        .catch(err => {
            console.error('Erreur lors de la copie :', err);
        });
}

//Black jack
const playerHandP = document.getElementById('player-hand');
const playerScoreP = document.getElementById('player-score');
const dealerHandP = document.getElementById('dealer-hand');
const dealerScoreP = document.getElementById('dealer-score');
const messageP = document.getElementById('message');

const btnHit = document.getElementById('btn-hit');
const btnStand = document.getElementById('btn-stand');
const btnRestart = document.getElementById('btn-restart');



// fonction pour creer le deck des 52 cartes avec leur couleurs et leur valeurs
function createDeck() {
    const labels = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack (10)', 'Queen (10)', 'King (10)', 'Ace (11)'];
    const suits = ['hearts ♥', 'diamonds ♦', 'spades ♠', 'clubs ♣'];
    const newDeck = [];

    for (let suit of suits) {
        for (let label of labels) {
            newDeck.push({
                label: label,
                suit: suit,
                value: getCardValue(label)
            });
        }
    }

    return newDeck;
}

// fonction pour atribuer une valeur au cartes visage
function getCardValue(label) {
    if (label === "Jack (10)" || label === "Queen (10)" || label === "King (10)") return 10;
    if (label === 'Ace (11)') return 11;
    return parseInt(label)
}


//fonction qui calcul le score
function calculateScore(hand) {
    let total = 0;
    let aceCount = 0;

    for (let card of hand) {
        total += card.value;
        if (card.label === 'A') {
            aceCount++;
        }
    }

    // Si le score dépasse 21 et qu’on a des As, on les fait valoir 1 au lieu de 11
    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount--;
    }

    return total;
}


// foction pour tirer une carte 
function drawCard(deck) {
    let index = Math.floor(Math.random() * deck.length);
    let card = deck[index];
    deck.splice(index, 1); // enlève la carte du deck
    return card;
}



// ajoute une carte a la main du joueur
function playerHit() {
    const card = drawCard(deck);
    playerHand.push(card);
    updateHandDisplay(playerHand, playerHandP);

    const score = calculateScore(playerHand);
    playerScoreP.textContent = "Score : " + score;

    if (score > 21) {
        endGame("You lose");
    }
}


function dealerPlay() {
    let dealerScore = calculateScore(dealerHand);
    const playerScore = calculateScore(playerHand);

    function drawNextCard() {
        dealerScore = calculateScore(dealerHand);

        if (dealerScore < 17) {
            const card = drawCard(deck);
            dealerHand.push(card);

            updateHandDisplay(dealerHand, dealerHandP);
            dealerScoreP.textContent = "Score : " + dealerScore;

            // Attendre 1 seconde avant de tirer la suivante
            setTimeout(drawNextCard, 1000);
        } else {
            // Le croupier arrête de tirer → on compare les scores
            updateHandDisplay(dealerHand, dealerHandP);
            dealerScoreP.textContent = "Score : " + dealerScore;

            let message = "";
            if (dealerScore > 21) {
                message = "The dealer has passed 21. You win";
            } else if (dealerScore > playerScore) {
                message = "Dealer wins";
            } else if (dealerScore < playerScore) {
                message = "You win !";
            } else {
                message = "Tie";
            }

            endGame(message);
        }
    }

    // Démarrer le processus avec la première carte (ou pas si >= 17)
    drawNextCard();
}


// fonction pour finir la partie
function endGame(message) {
    btnHit.disabled = true;
    btnStand.disabled = true;

    // Affiche le message dans un paragraphe (tu peux créer un <p id="message"> dans le HTML)
    document.getElementById('message').textContent = message;
}


//  variable des mains du dealer et du joueur
let playerHand = [];
let dealerHand = [];



// fonction pour relancer la partie
function restartGame() {
    deck = createDeck();
    playerHand = [];
    dealerHand = [];

    // Donne 2 cartes au joueur, 1 au dealer
    playerHand.push(drawCard(deck));
    playerHand.push(drawCard(deck));

    dealerHand.push(drawCard(deck));



    // Affichage
    updateHandDisplay(playerHand, playerHandP);
    updateHandDisplay(dealerHand, dealerHandP);

    playerScoreP.textContent = "Score : " + calculateScore(playerHand);
    dealerScoreP.textContent = "Score : " + calculateScore(dealerHand);

    document.getElementById('message').textContent = "";
    btnHit.disabled = false;
    btnStand.disabled = false;


}

//ajoute les cartes dans les mains et met a jour
function updateHandDisplay(hand, element) {
    element.textContent = hand.map(card => `${card.label} of ${card.suit}`).join(' + ');
}


//boutons actions du joeur
document.getElementById('btn-hit').addEventListener('click', () => {
    playerHit()
});

document.getElementById('btn-stand').addEventListener('click', () => {
    dealerPlay()
});

document.getElementById('btn-restart').addEventListener('click', () => {
    restartGame()
});





//modal "Copié dans le presse-papiers"
function showCopyModal() {
    const modal = document.getElementById('copy-modal');
    modal.classList.remove('hidden');
    modal.classList.add('visible');

    setTimeout(() => {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
    }, 2000); // 2 secondes
}


