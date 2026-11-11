import { describe, expect, it } from "vitest";
import { taskReducer, selectTasks, type Task } from "./todo";

const task: Task = { id: "one", title: "応募書類を準備", completed: false, priority: "normal", due: "2026-11-12" };
describe("Todo tasks", () => {
  it("adds trimmed tasks and rejects blank tasks", () => {
    expect(taskReducer([], { type: "add", task: { ...task, title: "  応募書類を準備  " } })[0]?.title).toBe("応募書類を準備");
    expect(taskReducer([], { type: "add", task: { ...task, title: "  " } })).toEqual([]);
  });
  it("edits a task without losing completion", () => {
    expect(taskReducer([{ ...task, completed: true }], { type: "update", task: { ...task, completed: true, title: "面接を準備" } })[0]).toMatchObject({ title: "面接を準備", completed: true });
  });
  it("toggles completion in both directions", () => {
    const completed = taskReducer([task], { type: "toggle", id: "one" });
    expect(completed[0]?.completed).toBe(true);
    expect(taskReducer(completed, { type: "toggle", id: "one" })[0]?.completed).toBe(false);
  });
  it("deletes only the selected task", () => {
    expect(taskReducer([task, { ...task, id: "two" }], { type: "delete", id: "one" }).map((t) => t.id)).toEqual(["two"]);
  });
  it("clears completed tasks only", () => {
    expect(taskReducer([task, { ...task, id: "two", completed: true }], { type: "clear" })).toEqual([task]);
  });
  it("combines completion and search filters", () => {
    expect(selectTasks([task, { ...task, id: "two", completed: true }], "active", "応募", "newest").map((t) => t.id)).toEqual(["one"]);
  });
  it("sorts high priority first and missing deadlines last", () => {
    const tasks = [task, { ...task, id: "two", priority: "high" as const, due: "" }];
    expect(selectTasks(tasks, "all", "", "priority")[0]?.id).toBe("two");
    expect(selectTasks(tasks, "all", "", "due")[0]?.id).toBe("one");
  });
});