import React, { useState } from 'react';
import { Cards } from './cards';
import './style.css';


export const App = () => {

  const [cards, setCards] = useState([{
    image:"../static/1.jpg"
  },
  {
    image:"../static/2.jpg"
  },
  {
    image:"../static/3.jpg"
  },
  {
    image:"../static/4.jpg"
  },
  {
    image:"../static/5.jpg"
  }]);

  function onCardThrowDone(obj) {
    let card = cards.splice(0,1);
    cards.push(card[0]);
    setCards(cards);
  }
  
  return (
    <div className="container">
      <Cards
        onDragMove = {() => {}}
        onDragStop = {() => {}}
        onDragStart = {() => {}}
        onThrowStart = {() => {}}
        onThrowDone = {(obj) => onCardThrowDone(obj)}
        onThrowFail = {() => {}}
        cardWidth = "350"
        cardHeight = "400"
        throwTriggerDistance = "20"
        hasShadow = {true}
        cards = {cards}
      />
    </div>
  )
}