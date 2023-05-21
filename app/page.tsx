"use client";

import React from "react";
import { useState, useEffect } from "react";

import "./main.css";

interface CardInfo {
  id: number;
  title: string;
  description: string;
  shouldDelete: Boolean;
}

let draggedCard: CardInfo;

function Card(props: any): JSX.Element {
  const [grabbed, setGrabbed] = useState<Boolean>(false);
  const [title, setTitle] = useState<string>(props.cardInfo.title);
  const [description, setDescription] = useState<string>(
    props.cardInfo.description
  );
  const [titleFlag, setTitleFlag] = useState<Boolean>(true);
  const [descriptionFlag, setDescriptionFlag] = useState<Boolean>(true);

  return (
    <div
      onDragStart={() => {
        setGrabbed(true);
        props.cardInfo.shouldDelete = false;
        draggedCard = props.cardInfo;
      }}
      onDragEnd={() => {
        setGrabbed(false);

        if (draggedCard.shouldDelete) {
          props.callback(props.cardInfo);
        } else {
          draggedCard.shouldDelete = true;
        }
      }}
      className={grabbed ? "cardClass grabbed" : "cardClass"}
      draggable={true}
    >
      <div>
        <i onClick={() => props.callback(props.cardInfo)} className="rightIcon">
          &#10006;
        </i>
        <i className="leftIcon">=</i>
      </div>
      {titleFlag ? (
        <h5 onClick={() => setTitleFlag(false)}>{title}</h5>
      ) : (
        <input
          autoFocus={true}
          onKeyDown={(e: any) => {
            if (e.key == "Enter") {
              setTitle(e.target.value);
              props.cardInfo.title = title;
              props.updateCard(props.cardInfo);
              setTitleFlag(true);
            }
          }}
          defaultValue={title}
          onBlur={(e: any) => {
            setTitle(e.target.value);
            props.cardInfo.title = title;
            props.updateCard(props.cardInfo);
            setTitleFlag(true);
          }}
        />
      )}
      {descriptionFlag ? (
        <p
          onClick={() => {
            setDescriptionFlag(false);
          }}
        >
          {description}
        </p>
      ) : (
        <textarea
          onKeyDown={(e: any) => {
            if (e.key == "Enter") {
              setDescription(e.target.value);
              props.cardInfo.description = description;
              props.updateCard(props.cardInfo);
              setDescriptionFlag(true);
            }
          }}
          defaultValue={description}
          autoFocus={true}
          onBlur={(e: any) => {
            setDescription(e.target.value);
            props.cardInfo.description = description;
            props.updateCard(props.cardInfo);
            setDescriptionFlag(true);
          }}
        />
      )}
    </div>
  );
}

function Column(props: any): JSX.Element {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [drag, setDrag] = useState<Boolean>(false);

  useEffect(() => {
    let items: any = localStorage.getItem(props.title);
    items = JSON.parse(items);
    if (items) setCards(items);
  }, [props.title]);

  useEffect(() => {
    localStorage.setItem(props.title, JSON.stringify(cards));
  }, [cards]);

  const updateCard = (toUpdate: CardInfo) => {
    let filtered = cards.map((card: CardInfo) => {
      if (card.id == toUpdate.id) {
        card.title = toUpdate.title;
        card.description = toUpdate.description;
      }
      return card;
    });

    setCards(filtered);
  };

  function removeFromArr(toDelete: CardInfo) {
    let filtered = cards.filter((card) => card.id !== toDelete.id);

    setCards(filtered);
  }

  function addElement() {
    let currId = props.getAndIncrement();

    setCards([
      ...cards,
      {
        id: currId,
        title: "Sample Title" + currId.toString(),
        description: "Sample Description",
        shouldDelete: true,
      },
    ]);
  }

  return (
    <div
      className={drag ? "hoveringColumn" : ""}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => {
        setDrag(false);
      }}
      onDrop={() => {
        setDrag(false);
        for (const card of cards) {
          if (card.id == draggedCard.id)
            return (draggedCard.shouldDelete = false);
        }

        setCards([...cards, draggedCard]);
        draggedCard.shouldDelete = true;
      }}
    >
      <h3>{props.title}</h3>
      <button onClick={() => addElement()}>+</button>
      <hr />
      {cards.map((card) => (
        <Card
          updateCard={updateCard}
          callback={removeFromArr}
          key={card.id}
          cardInfo={card}
        />
      ))}
    </div>
  );
}

export default function Grid(): JSX.Element {
  const [nextId, setNextId] = useState<number>(0);

  useEffect(() => {
    const items = localStorage.getItem("nextId");

    if (items) setNextId(parseInt(items));
    else setNextId(0);
  }, []);

  useEffect(() => {
    localStorage.setItem("nextId", JSON.stringify(nextId));
  }, [nextId]);

  const getAndIncrement = (): number => {
    setNextId(nextId + 1);
    return nextId;
  };

  return (
    <div className="gridContainer">
      <Column title="TODO" getAndIncrement={getAndIncrement} />
      <Column title="Started" getAndIncrement={getAndIncrement} />
      <Column title="Done" getAndIncrement={getAndIncrement} />
      <Column title="Deleted" getAndIncrement={getAndIncrement} />
    </div>
  );
}
