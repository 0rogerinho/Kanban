interface Task {
  title: string;
  id: string;
  column: string;
}

interface ColumnedTasks {
  [key: string]: Task[];
}

export function organizeByColumn(data: Task[]): ColumnedTasks {
  return data.reduce<ColumnedTasks>((acc, task) => {
    const { column } = task;
    if (!acc[column]) {
      acc[column] = [];
    }
    acc[column].push(task);
    return acc;
  }, {});
}
