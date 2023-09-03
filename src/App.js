// First, I import the React library and the hooks I'll need.
import React, { useState, useEffect } from 'react';
// Importing the CSS file for styling my component.
import './App.css';

// defining my main function component called App.
function App() {
  // Setting up state variables using React's useState hook.
  const [deckId, setDeckId] = useState(null);  // ID of the card deck
  const [currentCard, setCurrentCard] = useState(null);  // current card drawn
  const [remaining, setRemaining] = useState(0);  // remaining number of cards
  const [isShuffling, setIsShuffling] = useState(false);  //is the deck is being shuffled?

  // using the useEffect hook to perform side-effects, in this case, fetching the card deck.
  useEffect(() => {
    // Fetching a new shuffled deck from the API
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
      .then(response => response.json())  // parsing the JSON response
      .then(data => {
        setDeckId(data.deck_id);  // updating deckId state
        setRemaining(data.remaining);  // updating remaining cards state
      });
  }, []);  

  // function to draw a card from the deck
  const drawCard = () => {
    // making sure we have a deck and that cards remain to be drawn
    if (deckId && remaining > 0) {
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
          setCurrentCard(data.cards[0]);  // updating currentCard state
          setRemaining(data.remaining);  // updating remaining cards state
        });
    } else {
      alert("Error: no cards remaining!");  // alerting the user if no cards remain
    }
  };

  // Function to shuffle the deck
  const shuffleDeck = () => {
    // making sure we have a deck to shuffle
    if (deckId) {
      setIsShuffling(true);  // Indicating that shuffling is in progress
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`)
        .then(response => response.json())
        .then(data => {
          setRemaining(data.remaining);  // updating remaining cards state
          setCurrentCard(null);  // resetting currentCard state
          setIsShuffling(false);  
        });
    }
  };

  // The JSX for rendering my component
  return (
    <div className="App">
      {/* Button to draw a card */}
      <button onClick={drawCard}>Draw Card</button>
      {/* Button to shuffle the deck */}
      <button onClick={shuffleDeck} disabled={isShuffling}>
        {isShuffling ? "Shuffling..." : "Shuffle Deck"}  {/* Changing button text based on shuffling status */}
      </button>
      {/* Displaying the current card */}
      {currentCard && (
        <div>
          {/* Displaying the card image */}
          <img src={currentCard.image} alt={`${currentCard.value} of ${currentCard.suit}`} />
        </div>
      )}
    </div>
  );
}

// Exporting the App component so it can be used in other parts of my app
export default App;
