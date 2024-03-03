import { FormEvent, useEffect, useState } from "react";
import { Task } from "./shared/task"
import { remult } from "remult";
import { TasksController } from "./shared/TasksController";

const taskRepo = remult.repo(Task);

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewtaskTitle] = useState("");

  useEffect(() => {
    return taskRepo.liveQuery({
      orderBy: { completed: "desc" }
    }).subscribe(info => setTasks(info.applyChanges))
  }, [])

  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks((tasks) => [...tasks, newTask]);
      setNewtaskTitle("");
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function deleteTask(id: number) {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this task?")

      if (!confirmed) return;

      await taskRepo.delete(id);
      setTasks((tasks) => tasks.filter(t => t.id !== id))
    }
    catch (error: any) {
      alert(error.message);
    }
  }

  function setTask(task: Task, value: Task) {
    setTasks((tasks) => tasks.map((t) => (t === task ? value : t)))
  }

  async function setCompleted(task: Task, completed: boolean) {
    setTask(task, await taskRepo.save({ ...task, completed }));
  }

  function setTitle(task: Task, title: string) {
    setTask(task, { ...task, title });
  }


  async function saveTask(task: Task) {
    try {
      setTask(task, await taskRepo.save(task));
    } catch (error: any) {
      alert(error.message);
    }
  }

  async function setAllCompleted(completed: boolean) {
    await TasksController.setAllCompleted(completed);
  }
  return (
    <div>
      <h1>Todos</h1>
      <main>
        <form onSubmit={e => addTask(e)}>
          <input
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewtaskTitle(e.target.value)} />

          <button>Add</button>
        </form>

        {tasks.map((task) => (
          <div key={task.id}>

            <input type="checkbox" checked={task.completed}
              onChange={(e) => setCompleted(task, e.target.checked)} />

            <input type="text"
              value={task.title}
              onChange={(e) => setTitle(task, e.target.value)} />

            <button onClick={() => saveTask(task)}>Save</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        ))}

        <div>
          <button onClick={() => setAllCompleted(true)}>Set all completed</button>
          <button onClick={() => setAllCompleted(false)}>Clear all completed</button>
        </div>
      </main>
    </div>
  )
}

export default App
