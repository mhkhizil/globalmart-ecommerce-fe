import { motion, PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface CardType {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface CardStackProps {
  cards: CardType[];
  cardWidth?: number;
  cardHeight?: number;
  stackOffset?: number;
  swipeThreshold?: number; // New prop for swipe distance
}

const CardStack = ({
  cards: initialCards,
  cardWidth = 300,
  cardHeight = 400,
  stackOffset = 10,
  swipeThreshold = 150, // Default swipe distance threshold
}: CardStackProps) => {
  const [cards, setCards] = useState<CardType[]>(initialCards);

  useEffect(() => {
    setCards(initialCards);
  }, [initialCards]);

  const handleDragEnd = (info: PanInfo, draggedCardId: string) => {
    if (Math.abs(info.offset.x) > swipeThreshold) {
      setCards(previous => {
        if (previous.length <= 1) return previous;
        // Move top card to bottom of the stack
        const [first, ...rest] = previous;
        return [...rest, first];
      });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      }}
    >
      {cards.map((card, index) => {
        const currentOffset = (cards.length - 1 - index) * stackOffset;
        const isTopCard = index === cards.length - 1;

        return (
          <motion.div
            key={card.id}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '24px',
              cursor: 'grab',
            }}
            drag={isTopCard}
            dragConstraints={{
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
            }}
            animate={{
              x: currentOffset,
              y: currentOffset,
              scale: 1 - (cards.length - 1 - index) * 0.03,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onDragEnd={(_, info) => handleDragEnd(info, card.id)}
            whileDrag={{
              cursor: 'grabbing',
              scale: 1.02,
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>{card.title}</h3>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardStack;
