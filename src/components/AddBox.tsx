import { useState } from 'react';
import { Icon } from '../ui/icon/Icon';
import { cn } from '../utils/cn';

type AddBoxProps = {
  variant: 'frame' | 'card';
  onValue?: (value: string) => void;
};
export function AddBox({ variant, onValue }: AddBoxProps) {
  const [value, setValue] = useState<string>('');
  const [showInput, setShowInput] = useState(false);

  function handleClick() {
    onValue && onValue(value);
    setValue('');
    if (value !== '') {
      setShowInput(false);
    }
  }

  return (
    <div
      className={cn(
        'w-full h-fit rounded-md flex flex-col pb-4',
        variant === 'frame' && showInput && 'bg-frame-bg shadow-column',
        variant === 'frame' && 'min-w-[300px] p-2',
      )}
    >
      {showInput && (
        <div className="space-y-2">
          <input
            className="w-full rounded-md h-9 px-2 bg-background focus:outline-1 focus:outline-none focus:border-2 focus:border-blue-950 text-white border border-card-bg"
            value={value}
            onChange={({ target }) => setValue(target.value)}
            type="text"
          />
          <div className="flex gap-2">
            <button
              className="p-2 px-3 bg-card-bg text-white rounded-md flex-1 hover:bg-card-border transition-all duration-300"
              onClick={handleClick}
            >
              Adicionar Quadro
            </button>
            <button
              className="p-3 hover:bg-card-bg rounded-md text-white transition-all duration-300"
              onClick={() => setShowInput(false)}
            >
              <Icon name="X" />
            </button>
          </div>
        </div>
      )}
      <button
        className={cn(
          'flex size-fit py-2 w-full bg-card-bg rounded-md justify-center items-center text-primary gap-3 hover:bg-card-border transition-all duration-300',
          variant === 'card' && 'bg-transparent hover:bg-card-bg',
          showInput && 'hidden',
        )}
        onClick={() => setShowInput(true)}
      >
        <Icon name="Plus" size={20} /> Adicionar quadro
      </button>
    </div>
  );
}
