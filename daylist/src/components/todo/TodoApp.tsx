import { useReducer, useState, type FormEvent } from "react";
import { Check, CheckCheck, Circle, ClipboardList, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { initialTasks, priorityLabels, selectTasks, taskReducer, type Task, type TaskFilter, type TaskPriority } from "@/data/todo";

export function TodoApp() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("normal");
  const [due, setDue] = useState("");
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | "completed" | null>(null);
  const [notice, setNotice] = useState("");
  const complete = tasks.filter((task) => task.completed).length;
  const visible = selectTasks(tasks, filter, search, sort);
  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    dispatch({ type: "add", task: { id: crypto.randomUUID(), title, priority, due, completed: false } });
    setTitle(""); setDue(""); setPriority("normal"); setNotice("タスクを追加しました");
  }
  const filters: { value: TaskFilter; label: string; count: number; icon: typeof Circle }[] = [
    { value: "all", label: "すべて", count: tasks.length, icon: ClipboardList },
    { value: "active", label: "未完了", count: tasks.length - complete, icon: Circle },
    { value: "completed", label: "完了", count: complete, icon: CheckCheck },
  ];
  return (
    <section className="todo-app container-page" aria-label="Todoアプリ">
      <div className="todo-heading">
        <div><p className="todo-kicker">PERSONAL TASK MANAGER</p><h1>Daylist<span className="text-code-cyan">.</span></h1></div>
        <p className="text-sm text-muted-foreground">React Todo / セッション内のみ</p>
      </div>
      <div className="todo-layout">
        <aside className="todo-sidebar">
          <p className="todo-kicker">MY TASKS</p>
          <div className="todo-filters" role="group" aria-label="タスク表示">
            {filters.map(({ value, label, count, icon: Icon }) => <Button key={value} variant={filter === value ? "secondary" : "ghost"} onClick={() => setFilter(value)} aria-pressed={filter === value} className="justify-start gap-3"><Icon className="size-4" />{label}<span className="ml-auto font-mono text-xs">{count}</span></Button>)}
          </div>
          <div className="todo-progress"><span className="todo-kicker">PROGRESS</span><p className="mt-4 font-display text-3xl">{complete}<span className="text-lg text-muted-foreground"> / {tasks.length}</span></p><progress aria-label="完了率" value={complete} max={tasks.length || 1} /><p className="text-xs text-muted-foreground">{tasks.length ? Math.round(complete / tasks.length * 100) : 0}% 完了</p></div>
        </aside>
        <div className="todo-main">
          <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="text-heading">{filters.find((item) => item.value === filter)?.label}のタスク</h2><span className="font-mono text-sm text-muted-foreground">{visible.length} tasks</span></div>
          <form onSubmit={addTask} className="todo-composer">
            <label htmlFor="task-title" className="sr-only">新しいタスク</label>
            <Input id="task-title" placeholder="新しいタスクを追加" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} required className="h-12" />
            <div className="todo-composer-options"><label className="todo-field">優先度<select aria-label="優先度" value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="todo-field">期限<Input type="date" aria-label="期限" value={due} onChange={(event) => setDue(event.target.value)} /></label><Button type="submit" disabled={!title.trim()} className="h-10 gap-2"><Plus className="size-4" />追加</Button></div>
          </form>
          <div className="todo-toolbar"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" /><Input aria-label="タスクを検索" placeholder="タスクを検索" value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9" /></div><select aria-label="並び替え" value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">追加順</option><option value="priority">優先度順</option><option value="due">期限順</option></select></div>
          <ul className="todo-list">
            {visible.map((task) => <li key={task.id} className="todo-task" data-completed={task.completed}>
              <Checkbox aria-label={`${task.title}を${task.completed ? "未完了" : "完了"}にする`} checked={task.completed} onCheckedChange={() => dispatch({ type: "toggle", id: task.id })} className="size-5" />
              <div className="min-w-0 flex-1"><p className="todo-task-title">{task.title}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="todo-priority" data-priority={task.priority}>優先度 {priorityLabels[task.priority]}</span>{task.due && <time dateTime={task.due}>{task.due.replaceAll("-", "/")}</time>}</div></div>
              <div className="flex shrink-0"><Button size="icon" variant="ghost" aria-label={`${task.title}を編集`} title="編集" onClick={() => setEditing({ ...task })}><Pencil className="size-4" /></Button><Button size="icon" variant="ghost" aria-label={`${task.title}を削除`} title="削除" onClick={() => setDeleting(task)}><Trash2 className="size-4" /></Button></div>
            </li>)}
          </ul>
          {visible.length === 0 && <div className="todo-empty"><ClipboardList className="size-10 text-muted-foreground" strokeWidth={1} /><h3 className="mt-5 font-medium">{tasks.length === 0 ? "まだタスクがありません" : "該当するタスクがありません"}</h3>{search && <Button variant="ghost" onClick={() => setSearch("")} className="mt-3"><X className="mr-2 size-4" />検索をクリア</Button>}</div>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><p role="status">{notice || `${tasks.length - complete}件の未完了タスク`}</p><Button variant="ghost" size="sm" disabled={complete === 0} onClick={() => setDeleting("completed")}><Trash2 className="mr-2 size-3.5" />完了したタスクを削除</Button></div>
        </div>
      </div>
      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}><DialogContent><DialogHeader><DialogTitle>タスクを編集</DialogTitle></DialogHeader>{editing && <form onSubmit={(event) => { event.preventDefault(); if (!editing.title.trim()) return; dispatch({ type: "update", task: editing }); setEditing(null); setNotice("タスクを更新しました"); }} className="space-y-5"><label className="todo-field">タスク名<Input aria-label="タスク名" value={editing.title} required maxLength={200} onChange={(event) => setEditing({ ...editing, title: event.target.value })} /></label><label className="todo-field">優先度<select aria-label="編集する優先度" value={editing.priority} onChange={(event) => setEditing({ ...editing, priority: event.target.value as TaskPriority })}>{Object.entries(priorityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="todo-field">期限<Input aria-label="編集する期限" type="date" value={editing.due} onChange={(event) => setEditing({ ...editing, due: event.target.value })} /></label><DialogFooter><Button type="button" variant="outline" onClick={() => setEditing(null)}>キャンセル</Button><Button type="submit" disabled={!editing.title.trim()}><Check className="mr-2 size-4" />保存</Button></DialogFooter></form>}</DialogContent></Dialog>
      <Dialog open={deleting !== null} onOpenChange={(open) => { if (!open) setDeleting(null); }}><DialogContent><DialogHeader><DialogTitle>{deleting === "completed" ? "完了したタスクを削除しますか？" : "タスクを削除しますか？"}</DialogTitle></DialogHeader><p className="text-sm text-muted-foreground">{deleting && deleting !== "completed" ? deleting.title : `${complete}件の完了したタスク`} — この操作は取り消せません。</p><DialogFooter><Button variant="outline" onClick={() => setDeleting(null)}>キャンセル</Button><Button variant="destructive" onClick={() => { if (!deleting) return; dispatch(deleting === "completed" ? { type: "clear" } : { type: "delete", id: deleting.id }); setDeleting(null); setNotice("タスクを削除しました"); }}>削除</Button></DialogFooter></DialogContent></Dialog>
    </section>
  );
}