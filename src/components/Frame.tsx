import { HTMLAttributes, ReactNode } from 'react';
import { Icon } from '../ui/icon/Icon';
import { AddBox } from './addBox';

type FrameProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  color?: string;
  children: ReactNode;
};

export function Frame({
  title,
  color = '#e3e3e3',
  children,
  ...props
}: FrameProps) {
  return (
    <div className="bg-frame-bg min-w-[300px] h-fit max-h-[calc(100vh-32px)] rounded-md shadow-column flex flex-col">
      <div className="relative w-full h-[8px] rounded-t overflow-hidden">
        <div className="absolute w-full h-full" style={{ background: color }} />
      </div>

      <div className="flex justify-between items-center px-4 py-2">
        <p className="font-semibold text-primary">{title}</p>
        <button className="flex justify-center items-center p-2 hover:bg-card-bg rounded-full transition-all duration-300">
          <Icon className="text-primary" name="Plus" size={20} />
        </button>
      </div>

      <div
        className="space-y-2 pl-2 mr-1 pr-1 pt-1 flex-1 overflow-y-auto"
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
