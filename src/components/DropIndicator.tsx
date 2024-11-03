type DropIndicatorProps = {
  beforeId?: string;
  column: string;
};

export const DropIndicator = ({
  beforeId = '-1',
  column,
}: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};
