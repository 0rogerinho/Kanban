import { cn } from '../utils/cn';

/* eslint-disable @typescript-eslint/no-unused-vars */
type CardProps = {
  title: string;
  startDrag: boolean;
};

export function Card({ title, startDrag }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card-bg w-full rounded-md p-3 cursor-pointer overflow-hidden',
        !startDrag && 'hover:outline-blue-950 hover:outline',
      )}
    >
      <p className="text-secondary text-sm">{title}</p>
    </div>
  );
}
