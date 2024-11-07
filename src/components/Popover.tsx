import { useState, useRef, useEffect, HTMLAttributes, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// Cria um contêiner no body para o portal do popover
const popoverRoot = document.createElement('div');
document.body.appendChild(popoverRoot);

type PopoverProps = HTMLAttributes<HTMLButtonElement> & {
  open: boolean;
  trigger: ReactNode;
  contentProps?: HTMLAttributes<HTMLDivElement>;
  popoverContent: ReactNode;
  onChangeOpen: (boolean: boolean) => void;
};

export function Popover({
  open,
  onChangeOpen,
  contentProps,
  trigger,
  popoverContent,
  ...props
}: PopoverProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Função para abrir o popover e calcular a posição
  const togglePopover = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
    onChangeOpen(!open);
  };

  // Fecha o popover ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onChangeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation(), togglePopover();
        }}
        className="w-fit"
        {...props}
      >
        {trigger}
      </button>
      {open &&
        createPortal(
          <div
            className="absolute z-50"
            style={{
              top: position.top + 5,
              left: position.left + 13,
            }}
            {...contentProps}
          >
            {popoverContent}
          </div>,
          popoverRoot,
        )}
    </>
  );
}

export default Popover;
