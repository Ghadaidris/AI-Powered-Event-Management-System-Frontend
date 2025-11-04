import React, { useEffect, useState } from "react";
import { getTeams, createTeam, updateTeam, deleteTeam } from "../../utilities/users-api";
import { getProfiles, getEvents } from "../../utilities/users-api";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    event: "",
    manager: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchProfiles();
    fetchEvents();
  }, []);

  async function fetchTeams() {
    const data = await getTeams();
    setTeams(data);
  }

  async function fetchProfiles() {
    const data = await getProfiles();
    setProfiles(data);
  }

  async function fetchEvents() {
    const data = await getEvents();
    setEvents(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateTeam(editingId, formData);
      } else {
        await createTeam(formData);
      }
      setFormData({ name: "", event: "", manager: "" });
      setEditingId(null);
      fetchTeams();
    } catch (err) {
      console.error("Error saving team:", err);
    }
  }

  function handleEdit(team) {
    setFormData({
      name: team.name,
      event: team.event,
      manager: team.manager,
    });
    setEditingId(team.id);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    await deleteTeam(id);
    fetchTeams();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Teams Management</h1>

      {/* نموذج إنشاء/تعديل فريق */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 space-y-3">
        <input
          type="text"
          placeholder="Team Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />

        {/* اختيار الحدث */}
        <select
          value={formData.event}
          onChange={(e) => setFormData({ ...formData, event: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Event</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>

        {/* اختيار المدير */}
        <select
          value={formData.manager}
          onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Manager</option>
          {profiles
            .filter((p) => p.role === "manager")
            .map((m) => (
              <option key={m.id} value={m.id}>{m.username}</option>
            ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? "Update Team" : "Create Team"}
        </button>
      </form>

      {/* عرض الفرق */}
      <div className="space-y-3">
        {teams.map((team) => (
          <div key={team.id} className="p-4 border rounded shadow-sm bg-gray-50">
            <h2 className="font-semibold text-lg">{team.name}</h2>
            <p>Manager: <strong>{team.manager_name}</strong></p>
            <p>Event: <strong>{events.find((e) => e.id === team.event)?.title || "N/A"}</strong></p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(team)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
