export type TaskPriority = "high" | "normal" | "low";
export type Task = { id: string; title: string; completed: boolean; priority: TaskPriority; due: string };
export type TaskFilter = "all" | "active" | "completed";

export const priorityLabels: Record<TaskPriority, string> = { high: "高", normal: "中", low: "低" };
export const initialTasks: Task[] = [];

export function selectTasks(tasks: Task[], filter: TaskFilter, search: string, sort: string) {
  const ranks = { high: 0, normal: 1, low: 2 };
  const selected = tasks.filter((task) =>
    (filter === "all" || (filter === "completed" ? task.completed : !task.completed)) &&
    task.title.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()),
  );
  if (sort === "priority") selected.sort((a, b) => ranks[a.priority] - ranks[b.priority]);
  if (sort === "due") selected.sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"));
  return selected;
}

export function taskReducer(tasks: Task[], action:
  | { type: "add"; task: Task }
  | { type: "update"; task: Task }
  | { type: "toggle" | "delete"; id: string }
  | { type: "clear" }
) {
  switch (action.type) {
    case "add": return action.task.title.trim() ? [{ ...action.task, title: action.task.title.trim() }, ...tasks] : tasks;
    case "update": return action.task.title.trim() ? tasks.map((task) => task.id === action.task.id ? { ...action.task, title: action.task.title.trim() } : task) : tasks;
    case "toggle": return tasks.map((task) => task.id === action.id ? { ...task, completed: !task.completed } : task);
    case "delete": return tasks.filter((task) => task.id !== action.id);
    case "clear": return tasks.filter((task) => !task.completed);
  }
}