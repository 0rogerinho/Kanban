import { ReactNode, useState } from 'react';
import { Icon } from '../../ui/icon/Icon';
import { iconProps } from '../../ui/icon/type';
import Popover from '../Popover';

type MoreProps = {
  onClickEdit?: () => void;
  onClickDelete?: () => void;
};

export function More({ onClickDelete, onClickEdit }: MoreProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onChangeOpen={(open) => setOpen(open)}
      className="h-fit"
      trigger={<Icon name="DotsThreeVertical" color="white" />}
      popoverContent={
        <div className="absolute bg-zinc-700 p-2 rounded-md z-50 right-0 top-0 space-y-1">
          <Button
            iconName="PencilSimple"
            onClick={() => {
              setOpen(false);
              onClickEdit && onClickEdit();
            }}
          >
            Editar
          </Button>

          <Button
            iconName="TreasureChest"
            onClick={() => {
              setOpen(false);
              onClickDelete && onClickDelete();
            }}
          >
            Exlcuir
          </Button>
        </div>
      }
    />
  );
}

type ButtonProps = {
  iconName: iconProps['name'];
  children: ReactNode;
  onClick: () => void;
};

export const Button = ({ children, iconName, onClick }: ButtonProps) => {
  return (
    <button
      className="flex flex-1 w-full text-content-primary justify-center items-center gap-2 p-1.5 hover:bg-button rounded-md transition-all duration-200"
      onClick={onClick}
    >
      <Icon name={iconName} color="white" />
      {children}
    </button>
  );
};
