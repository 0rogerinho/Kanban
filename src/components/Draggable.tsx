import React, {
  DragEventHandler,
  HTMLAttributes,
  ReactElement,
  useState,
} from 'react';

type DraggableProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactElement<HTMLDivElement>;
  onDrag?: DragEventHandler<HTMLDivElement>;
  onDragEnd?: DragEventHandler<HTMLDivElement>;
  onDragStart?: DragEventHandler<HTMLDivElement>;
};

export default function Draggable({
  children,
  onDrag,
  onDragEnd,
  onDragStart,
  ...props
}: DraggableProps) {
  const [ghostStyles, setGhostStyles] = useState({});
  const [clickPosition, setClickPosition] = useState({ posX: 0, posY: 0 });
  const [initialPosition, setInitialPosition] = useState({ posX: 0, posY: 0 });
  const [startDrag, setStartDrag] = useState(false);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setDragImage(new Image(), 0, 0);
    e.dataTransfer.setData('text/plain', children.props.id);

    const div = e.currentTarget.getBoundingClientRect();
    const posY = e.clientY - div.top;
    const posX = e.clientX - div.left;

    setStartDrag(true);
    setGhostStyles({ transform: 'rotate(3deg)', width: div.width });
    setClickPosition({ posY, posX });
    setInitialPosition({ posY: div.top, posX: div.left });
  }

  function handleDrag(e: React.DragEvent<HTMLDivElement>) {
    if (e.clientX > 0 && e.clientY > 0) {
      setGhostStyles({
        ...ghostStyles,
        display: 'block',
        top: e.clientY - clickPosition.posY,
        left: e.clientX - clickPosition.posX,
      });
    }
  }

  function handleDragEnd() {
    setGhostStyles({
      ...ghostStyles,
      display: 'block',
      transition: 'all 0.3s ease-in',
      top: initialPosition.posY,
      left: initialPosition.posX,
    });

    setTimeout(() => {
      setStartDrag(false);
      setGhostStyles({ display: 'none' });
    }, 300);
  }

  return (
    <div className="relative">
      <div
        className="relative w-full"
        draggable="true"
        onDragStart={(e) => {
          handleDragStart(e), onDragStart && onDragStart(e);
        }}
        onDrag={(e) => {
          handleDrag(e), onDrag && onDrag(e);
        }}
        onDragEnd={(e) => {
          handleDragEnd(), onDragEnd && onDragEnd(e);
        }}
        {...props}
      >
        {children}
        {startDrag && (
          <div className="absolute z-50 pointer-events-none size-full bg-background top-0 rounded-md" />
        )}
      </div>
      <div
        id={'ghost'}
        className="fixed hidden z-[9999] pointer-events-none"
        style={ghostStyles}
      >
        {React.cloneElement(children)}
      </div>
    </div>
  );
}
