import { MouseEvent, useEffect, useRef, useState } from 'react';
import { Frame } from './components/Frame';
import { AddBox } from './components/AddBox';
import { Card } from './components/Card';

const kanbanCard = [
  // TODO
  {
    title:
      'Comece colocando suas tarefas na coluna Todo. Isso é feito criando cartões com a descrição da tarefa e atribuindo-os à coluna Todo',
    id: '1',
    column: 'Todo',
  },
  // DOING
  {
    title:
      'Quando você começar a trabalhar em uma tarefa, mova o cartão para a coluna "Doing". Isso indica que a tarefa está em andamento. Exemplo: "Lavar a louça"',
    id: '2',
    column: 'Doing',
  },
  // DONE
  {
    title:
      ' Após terminar uma tarefa, mova o cartão para a coluna "Done" para indicar que a tarefa foi concluída. Exemplo: "Lavar a louça".',
    id: '3',
    column: 'Done',
  },
];

const kanbanFrame = [
  {
    id: '1',
    title: 'Todo',
  },
  {
    id: '2',
    title: 'Doing',
  },
  {
    id: '3',
    title: 'Done',
  },
];

type CardProps = {
  title: string;
  id: string;
  column: string;
};

function App() {
  const [data, setData] = useState(kanbanCard);
  const [dataFrame, setDataFrame] = useState(kanbanFrame);

  const [editing, setEditing] = useState<string>();

  const [ghostStyles, setGhostStyles] = useState({});
  const [currentCard, setCurrentCard] = useState<CardProps>();
  const [startDrag, setStartDrag] = useState(false);
  const position = useRef({ posX: 0, posY: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frames = localStorage.getItem('kanbanFrame');
    const cards = localStorage.getItem('kanbanCard');
    if (frames) {
      setDataFrame(JSON.parse(frames));
    } else {
      setDataFrame(kanbanFrame);
    }
    if (cards) {
      setData(JSON.parse(cards));
    } else {
      setData(kanbanCard);
    }
  }, []);

  function handleMouseMove(event: any) {
    const e = event as MouseEvent;

    if (e.clientX > 0 || e.clientY > 0) {
      if (!startDrag) setStartDrag(true);
      setGhostStyles({
        display: 'block',
        top: e.clientY - position.current.posY,
        left: e.clientX - position.current.posX,
      });
    }
  }

  function handleMouseUp() {
    setStartDrag(false);
    setGhostStyles({ display: 'none' });

    document.body.style.userSelect = 'auto';
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mousedown', handleMouseDow);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  function handleMouseDow(event: any, card?: CardProps) {
    const e = event as MouseEvent<HTMLElement>;
    const isEditing = card?.id === editing;

    event.stopPropagation();

    if (!isEditing) {
      const div = e.currentTarget.getBoundingClientRect();
      const posX = e.clientX - div.left;
      const posY = e.clientY - div.top;

      position.current = { posX, posY };

      document.body.style.userSelect = 'none';
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }

  function handleMouseMoveCard(cardId: string, column: string) {
    // Encontrar o cartão atual e a posição do cartão para mover
    if (currentCard && currentCard?.id !== cardId) {
      const copy = [...data]; // Faz uma cópia do array `data`
      const moveToCardIndex = copy.findIndex((c) => c.id === currentCard?.id);
      const targetCardIndex = copy.findIndex((c) => c.id === cardId);

      if (moveToCardIndex !== -1 && targetCardIndex !== -1) {
        const moveToCard = { ...copy[moveToCardIndex], column };
        // Remove o cartão do array na posição original
        copy.splice(moveToCardIndex, 1);

        copy.splice(targetCardIndex, 0, moveToCard);

        setCurrentCard({ ...currentCard, column: column });

        setData(copy);
        localStorage.setItem('kanbanCard', JSON.stringify(copy));
      }
    }
  }

  function handleNewFrame(string: string) {
    if (string !== '') {
      const frame = [
        ...dataFrame,
        { id: (dataFrame.length + 1).toString(), title: string },
      ];
      setDataFrame(frame);
      localStorage.setItem('kanbanFrame', JSON.stringify(frame));
    }
  }

  function handleNewCard(frame: string, value?: string) {
    if (value && value !== '') {
      const copy = [...data];

      copy.push({
        id: (data.length + 1).toString(),
        title: value,
        column: frame,
      });

      setData(copy);
      localStorage.setItem('kanbanCard', JSON.stringify(copy));
    }
  }

  function handleMouseEnter(frame: string) {
    console.log('entrou');

    if (currentCard && frame !== currentCard.column) {
      const filter = data.filter((c) => c.id !== currentCard?.id);
      setData([...filter, { ...currentCard, column: frame }]);
      localStorage.setItem(
        'kanbanCard',
        JSON.stringify([...filter, { ...currentCard, column: frame }]),
      );
    }
  }

  function handleEditCard(card: CardProps, newTitle: string) {
    console.log('clicou em edit');

    const updatedData = data.reduce<CardProps[]>((acc, item) => {
      if (item.id === card.id) {
        // Atualiza o title do item
        acc.push({ ...item, title: newTitle });
      } else {
        // Mantém o item inalterado
        acc.push(item);
      }
      return acc;
    }, []);

    setData(updatedData);
    localStorage.setItem('kanbanCard', JSON.stringify(updatedData));
  }

  function handleDeleteCard(card: CardProps) {
    const filter = data.filter((c) => c.id !== card.id);
    setData(filter);
    localStorage.setItem('kanbanCard', JSON.stringify(filter));
  }

  return (
    <div
      className="size-full flex gap-4 p-4 overflow-x-auto overflow-y-hidden"
      onDragEnter={() => {}}
    >
      {dataFrame.map((frame) => (
        <Frame
          key={frame.id}
          title={frame.title}
          cardLength={data.filter((c) => c.column === frame.title).length}
          onMouseEnter={() => startDrag && handleMouseEnter(frame.title)}
          onAddFrame={(value) => handleNewCard(frame.title, value)}
        >
          {data.map((card) => (
            <>
              {card.column === frame.title && (
                <div
                  key={card.id + card.title}
                  ref={divRef}
                  className="relative cursor-default shrink-0 transition-all duration-300"
                  onMouseDown={(e) => {
                    handleMouseDow(e, card), setCurrentCard(card);
                  }}
                  onMouseMove={() =>
                    startDrag && handleMouseMoveCard(card.id, frame.title)
                  }
                >
                  <Card
                    key={card.id}
                    startDrag={startDrag}
                    onDelete={() => handleDeleteCard(card)}
                    onChangeValue={(value) => handleEditCard(card, value)}
                    isEditing={editing === card.id}
                    onClickEdit={(editing) =>
                      setEditing(editing ? card.id : undefined)
                    }
                    {...card}
                  />
                  {startDrag && currentCard?.id === card.id && (
                    <div className="absolute z-50 pointer-events-none size-full bg-ghost top-0 rounded-md" />
                  )}
                </div>
              )}
            </>
          ))}
        </Frame>
      ))}

      {/* Ghost */}
      <div
        className="fixed hidden z-[9999] pointer-events-none rotate-[3deg] opacity-90 shadow-md"
        style={{ ...ghostStyles, width: divRef.current?.offsetWidth }}
      >
        {currentCard && <Card startDrag={startDrag} {...currentCard} />}
      </div>

      <AddBox
        className="w-[300px]"
        variant="frame"
        onValue={(value) => handleNewFrame(value)}
      />
    </div>
  );
}

export default App;
