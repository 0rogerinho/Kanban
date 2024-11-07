import { HTMLAttributes, ReactNode, useEffect, useRef } from 'react';
import { AddBox } from './AddBox';

type FrameProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  color?: string;
  children: ReactNode;
  cardLength: number;
  onAddFrame?: (value: string) => void;
};

export function Frame({
  title,
  color = '#e3e3e3',
  children,
  cardLength,
  onAddFrame,
  ...props
}: FrameProps) {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight + 50;
    }
  }, [divRef.current?.scrollHeight]);

  return (
    <div className="min-w-[300px] max-w-[300px] h-fit max-h-[calc(100vh-32px)] rounded-md flex flex-col gap-2">
      <div className="flex justify-between items-center px-4 py-2 rounded-lg">
        <p className="font-bold text-content-primary">{title}</p>
        <p className="text-content-primary">{cardLength}</p>
      </div>

      <div className="bg-frame rounded-lg flex-1 h-0 flex flex-col overflow-hidden pt-3.5">
        <div
          ref={divRef}
          className="space-y-2 flex-1 pl-4 py-0.5 pr-1.5 mr-1 h-0 overflow-y-auto [scrollbarGutter:stable]"
          {...props}
        >
          {children}
        </div>

        <div className="mx-4 mb-4 mt-1.5">
          <AddBox
            variant="card"
            onValue={(value) => {
              onAddFrame && onAddFrame(value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
