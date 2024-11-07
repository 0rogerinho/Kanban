import { useEffect, useRef, useState } from 'react';
import { More } from './More';
import { cn } from '../../utils/cn';
import { Icon } from '../../ui/icon/Icon';

type CardProps = {
  id: string;
  title: string;
  startDrag: boolean;
  isEditing?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onChangeValue?: (value: string) => void;
  onClickEdit?: (editing: boolean) => void;
};

export function Card({
  id,
  title,
  startDrag,
  isEditing = false,
  onClick,
  onDelete,
  onClickEdit,
  onChangeValue,
}: CardProps) {
  const [value, setValue] = useState(title);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ajuste da altura do textarea
  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextAreaHeight(); // Ajusta a altura ao iniciar ou alterar o conteúdo
  }, [isEditing]); // Dependências de mudança de conteúdo e edição

  // Função para detectar clique fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClickEdit?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    onClickEdit?.(false);
    onChangeValue?.(value);
  };

  const handleCancel = () => {
    setValue(title);
    onClickEdit?.(false);
  };

  return (
    <div ref={containerRef}>
      <div className={cn('h-auto', isEditing && 'hidden')}>
        <div
          className={cn(
            'relative w-full flex justify-between rounded-md p-3 cursor-pointer bg-card',
            !startDrag && 'hover:outline-1 hover:outline-button hover:outline',
          )}
          onClick={onClick}
        >
          <p className="text-content-primary text-sm">{title}</p>
          <More
            onClickEdit={() => onClickEdit?.(!isEditing)}
            onClickDelete={onDelete}
          />
        </div>
      </div>

      <div
        className={cn(
          'relative w-full h-auto flex flex-col gap-3 justify-between rounded-md p-2 bg-card',
          !startDrag && 'hover:outline-1 hover:outline-button hover:outline',
          !isEditing && 'hidden',
        )}
      >
        <textarea
          ref={textAreaRef}
          className="w-full text-content-primary bg-transparent p-2 text-[.875rem] cursor-text min-h-[30px]"
          style={{ height: textAreaRef.current?.scrollHeight }}
          value={value}
          onChange={({ target }) => setValue(target.value)}
        />
        <div className="flex gap-2">
          <button
            className="text-content-primary font-medium rounded-md flex-1 transition-all duration-300 bg-button hover:bg-button-hover h-8"
            onClick={handleSave}
          >
            Salvar
          </button>
          <button
            className="px-3 hover:bg-frame rounded-md text-white transition-all duration-300 h-8"
            onClick={handleCancel}
          >
            <Icon name="X" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
