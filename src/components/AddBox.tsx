import { useEffect, useRef, useState } from 'react';
import { Icon } from '../ui/icon/Icon';
import { cn } from '../utils/cn';

type AddBoxProps = {
  className?: string;
  variant: 'frame' | 'card';
  onValue?: (value: string) => void;
};

export function AddBox({ className, variant, onValue }: AddBoxProps) {
  const [value, setValue] = useState<string>('');
  const [showInput, setShowInput] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextAreaHeight();
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleClick() {
    if (onValue && value !== '') {
      onValue(value);
      setValue('');
      setShowInput(false);
    }
  }

  return (
    <div
      ref={containerRef} // Atribuindo a referência ao contêiner principal
      className={cn(
        'w-full h-fit rounded-md flex flex-col',
        variant === 'frame' && showInput && 'bg-frame p-2',
        variant === 'frame' && 'min-w-[300px] max-w-[300px] mt-12',
      )}
    >
      {showInput && (
        <div className="space-y-0.5">
          <textarea
            ref={textAreaRef}
            className="w-full min-h-[40px] rounded-md h-9 p-2 bg-frame focus:outline-none border border-input-border focus:border-button text-white border-card-bg overflow-hidden"
            style={{ height: textAreaRef.current?.scrollHeight }}
            value={value}
            onChange={({ target }) => setValue(target.value)}
          />
          <div className="flex gap-2">
            <button
              className="p-2 px-3 text-content-primary font-medium rounded-md flex-1 transition-all duration-300 bg-button hover:bg-button-hover"
              onClick={handleClick}
            >
              {variant === 'frame' ? 'Adicionar quadro' : 'Adicionar card'}
            </button>
            <button
              className="p-3 hover:bg-frame rounded-md text-white transition-all duration-300"
              onClick={() => setShowInput(false)}
            >
              <Icon name="X" weight="bold" />
            </button>
          </div>
        </div>
      )}
      <button
        className={cn(
          'flex size-fit py-2 w-full bg-frame rounded-md justify-center items-center text-content-primary font-medium gap-3 hover:bg-card transition-all duration-300',
          variant === 'card' && 'bg-transparent hover:bg-card',
          showInput && 'hidden',
          className,
        )}
        onClick={() => setShowInput(true)}
      >
        <Icon name="Plus" size={20} weight="bold" />
        {variant === 'frame' ? 'Adicionar quadro' : 'Adicionar card'}
      </button>
    </div>
  );
}
