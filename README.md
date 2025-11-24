# 🎰 Cheat Jack - Blackjack Strategy Helper

## 📖 Overview
Cheat Jack is an interactive serious game designed to teach players optimal Blackjack decision-making through a probability-based algorithm. Players receive ONE strategic recommendation per 5-round game, forcing them to think critically about when to use their limited help and encouraging internalization of mathematical strategy.

## ✨ Features

### **Player Interface**
- 🎴 Visual card selection system with suit filters (♠♥♣♦)
- 🧮 Real-time strategy recommendations based on probability theory
- 📚 Detailed explanations for each recommended action (HIT/STAND/DOUBLE/SPLIT/SURRENDER)
- 🃏 Joker mechanic (20% chance per game) - instant 21
- ⏱️ ONE-TIME help system per game (strategic resource management)
- 🔄 Auto-synchronization with dealer interface every 2 seconds
- ✨ Smooth CSS animations (glow, pulse, bounce, slide effects)
- 📱 Responsive design (mobile, tablet, desktop)

### **Dealer Interface**
- 🎮 Password-protected control panel (`dealer123`)
- ▶️ Game flow management (Start/Next Round/End Game)
- 👥 Real-time player tracking with help usage status
- 📊 Live activity log with timestamps
- 🃏 Joker availability indicator (randomly determined per game)
- 🔄 Round progression tracker (1/5 → 5/5)
- 🗑️ Full data reset functionality

### **Educational Value**
- 📉 Reduces house edge from 2-3% to ~0.5% with optimal strategy
- 🧠 Teaches probability-based decision-making
- 💡 Develops risk assessment and resource management skills
- 🎯 Pattern recognition through repeated gameplay
- 📈 Long-term thinking vs. short-term intuition

## 🗂️ Project Structure
```
blackjack-helper/
├── src/
│   ├── index.html              # Login page (player/dealer selection)
│   ├── player.html             # Player interface (card selection + strategy)
│   ├── dealer.html             # Dealer control panel
│   ├── css/
│   │   ├── styles.css          # Global styles (casino theme)
│   │   ├── index.css           # Login page styles
│   │   ├── cards.css           # Player interface + animations
│   │   └── dealer.css          # Dealer dashboard styles
│   └── js/
│       ├── login.js            # Authentication logic
│       ├── cardSelector.js     # Card selection + synchronization
│       ├── strategy.js         # Blackjack algorithm (decision tree)
│       ├── usageTracker.js     # localStorage + game state management
│       ├── dealer.js           # Dealer controls + player monitoring
│       └── app.js              # Global utilities
└── README.md                   # Project documentation
```

## ⏳ Setup Instructions
1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser to run the application.
3. Ensure that you have a modern web browser for the best experience.

## 🎮 Usage Guidelines
- Enter the values of your two cards and the dealer's visible card in the input fields.
- Click the "Get Advice" button to receive the best move based on the current cards.
- Note that the application can only be used once every 5 rounds per player to ensure fair play.

## 🙏 Acknowledgments
This project is a simple implementation of Blackjack strategy and is intended for educational purposes. Enjoy playing and may the odds be in your favor!