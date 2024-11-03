import { MouseEvent, useRef, useState } from 'react';
import { Card } from './components/Card';
import { Frame } from './components/Frame';
import { AddBox } from './components/addBox';

const kanbanCard = [
  // BACKLOG
  { title: 'Look into render bug in dashboard', id: '1', column: 'backlog' },
  { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
  { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
  { title: 'Document Notifications service', id: '4', column: 'backlog' },
  // TODO
  {
    title: 'Research DB options for new microservice',
    id: '5',
    column: 'todo',
  },
  { title: 'Postmortem for outage', id: '6', column: 'todo' },
  { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },

  // DOING
  {
    title: 'Refactor context providers to use Zustand',
    id: '8',
    column: 'doing',
  },
  { title: 'Add logging to daily CRON', id: '9', column: 'doing' },
  // DONE
  {
    title: 'Set up DD dashboards for Lambda listener',
    id: '10',
    column: 'done',
  },
];

const kanbanFrame = [
  {
    id: '1',
    title: 'backlog',
  },
  {
    id: '2',
    title: 'todo',
  },
  {
    id: '3',
    title: 'doing',
  },
  {
    id: '4',
    title: 'done',
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

  const [ghostStyles, setGhostStyles] = useState({});
  const [currentCard, setCurrentCard] = useState<CardProps>();
  const [startDrag, setStartDrag] = useState(false);

  const position = useRef({ posX: 0, posY: 0 });
  const divRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: any) {
    const e = event as MouseEvent;

    // console.log(e.clientX);

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

  function handleMouseDow(event: any) {
    const e = event as MouseEvent<HTMLElement>;

    const div = e.currentTarget.getBoundingClientRect();
    const posX = e.clientX - div.left;
    const posY = e.clientY - div.top;

    position.current = { posX, posY };

    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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
        // setData(copy); // Atualiza o estado com o array modificado
      }
    }
  }

  function handleNewFrame(string: string) {
    if (string !== '') {
      setDataFrame([
        ...dataFrame,
        { id: (dataFrame.length + 1).toString(), title: string },
      ]);
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
    }
  }

  function handleMouseEnter(frame: string) {
    console.log('entrou');

    if (currentCard && frame !== currentCard.column) {
      const filter = data.filter((c) => c.id !== currentCard?.id);
      setData([...filter, { ...currentCard, column: frame }]);
    }
  }

  return (
    <div
      className="size-full flex gap-4 p-4 overflow-x-auto"
      onDragEnter={() => {}}
    >
      {dataFrame.map((frame) => (
        <Frame
          key={frame.id}
          title={frame.title}
          onMouseEnter={() => startDrag && handleMouseEnter(frame.title)}
        >
          {data.map((card) => (
            <>
              {card.column === frame.title && (
                <div
                  key={card.id}
                  ref={divRef}
                  className="relative cursor-default shrink-0 transition-all duration-300"
                  onMouseDown={(e) => {
                    handleMouseDow(e), setCurrentCard(card);
                  }}
                  onMouseMove={() =>
                    startDrag && handleMouseMoveCard(card.id, frame.title)
                  }
                >
                  <Card startDrag={startDrag} {...card} />
                  {startDrag && currentCard?.id === card.id && (
                    <div className="absolute z-50 pointer-events-none size-full bg-background top-0 rounded-md" />
                  )}
                </div>
              )}
            </>
          ))}
          <AddBox
            variant="card"
            onValue={(value) => handleNewCard(frame.title, value)}
          />
        </Frame>
      ))}

      {/* Ghost */}
      <div
        className="fixed hidden z-[9999] pointer-events-none rotate-[3deg] opacity-80 shadow-md"
        style={{ ...ghostStyles, width: divRef.current?.offsetWidth }}
      >
        {currentCard && <Card startDrag={startDrag} {...currentCard} />}
      </div>

      <AddBox variant="frame" onValue={(value) => handleNewFrame(value)} />
    </div>
  );
}

export default App;
