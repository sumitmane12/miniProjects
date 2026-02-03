import React, { useEffect, useState } from "react";
import axios from "axios";

function Todo() {
  const [todoList, setTodoList] = useState([]);
  const [editableId, setEditableId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [editedDeadline, setEditedDeadline] = useState("");
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  // Fetch todo list
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3001/getTodoList")
      .then((res) => setTodoList(res.data || []))
      .catch(console.error);
  }, []);

  // Format date to DD-MM-YYYY HH:MM
  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const toggleEditable = (id) => {
    const task = todoList.find((t) => t._id === id);
    if (!task) return;
    setEditableId(id);
    setEditedTask(task.task || "");
    setEditedStatus(task.status || "");
    setEditedDeadline(task.deadline || "");
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask || !newStatus || !newDeadline)
      return alert("All fields required");

    axios
      .post("http://127.0.0.1:3001/addTodoList", {
        task: newTask,
        status: newStatus,
        deadline: newDeadline,
      })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const saveEditedTask = (id) => {
    if (!editedTask || !editedStatus || !editedDeadline)
      return alert("All fields required");

    axios
      .post(`http://127.0.0.1:3001/updateTodoList/${id}`, {
        task: editedTask,
        status: editedStatus,
        deadline: editedDeadline,
      })
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const deleteTask = (id) => {
    axios
      .delete(`http://127.0.0.1:3001/deleteTodoList/${id}`)
      .then(() => window.location.reload())
      .catch(console.error);
  };

  const getStatusBadge = (status = "") => {
    const s = status.toLowerCase();
    if (s === "completed" || s === "done")
      return "bg-green-100 text-green-700 border-green-200";
    if (s === "in progress" || s === "ongoing")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "pending" || s === "todo")
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">To-Do List</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 bg-white rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Task</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Deadline</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-4">
                    {editableId === item._id ? (
                      <input
                        className="border w-full px-3 py-2 rounded"
                        value={editedTask}
                        onChange={(e) => setEditedTask(e.target.value)}
                      />
                    ) : (
                      item.task
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editableId === item._id ? (
                      <select
                        className="border px-3 py-2 rounded"
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {editableId === item._id ? (
                      <input
                        type="datetime-local"
                        className="border px-3 py-2 rounded"
                        value={editedDeadline}
                        onChange={(e) => setEditedDeadline(e.target.value)}
                      />
                    ) : (
                      <span
                        className={isOverdue(item.deadline) ? "text-red-600 font-semibold" : ""}
                      >
                        {formatDate(item.deadline)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {editableId === item._id ? (
                      <>
                        <button
                          onClick={() => saveEditedTask(item._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditableId(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleEditable(item._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(item._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Task */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Add Task</h2>
          <input
            className="border w-full mb-2 px-3 py-2 rounded"
            placeholder="Task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            className="border w-full mb-2 px-3 py-2 rounded"
            placeholder="Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <input
            type="datetime-local"
            className="border w-full mb-2 px-3 py-2 rounded"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <button
            onClick={addTask}
            className="bg-indigo-600 text-white w-full py-2 rounded"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;
