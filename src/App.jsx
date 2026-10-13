import { useState,useEffect } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState(() => {
  const savedApplications = localStorage.getItem("applications");

  return savedApplications ? JSON.parse(savedApplications) : [
    {
      id: 1,
      company: "Infosys",
      role: "Frontend Developer",
      date: "2026-10-10",
      status: "Applied",
    },
    {
      id: 2,
      company: "Accenture",
      role: "React Developer",
      date: "2026-10-11",
      status: "Interview",
    },
    {
      id: 3,
      company: "Capgemini",
      role: "Web Developer",
      date: "2026-10-12",
      status: "Rejected",
    },
  ];
});
useEffect(() => {
  localStorage.setItem(
    "applications",
    JSON.stringify(applications)
  );
}, [applications]);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Applied");
  const [editId, setEditId] = useState(null);
const [search, setSearch] = useState("");
const [filterStatus, setFilterStatus] = useState("All");


  function handleSubmit(e) {
    e.preventDefault();

    if (editId !== null) {
      const updatedApplications = applications.map((app) =>
        app.id === editId
          ? { ...app, company, role, date, status }
          : app
      );

      setApplications(updatedApplications);
    } else {
      const newApplication = {
        id: Date.now(),
        company,
        role,
        date,
        status,
      };

      setApplications([...applications, newApplication]);
    }

    resetForm();
  }

  function handleEdit(app) {
    setCompany(app.company);
    setRole(app.role);
    setDate(app.date);
    setStatus(app.status);
    setEditId(app.id);
    setShowForm(true);
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (confirmDelete) {
      setApplications(
        applications.filter((app) => app.id !== id)
      );
    }
  }

  function resetForm() {
    setCompany("");
    setRole("");
    setDate("");
    setStatus("Applied");
    setEditId(null);
    setShowForm(false);
  }

const filteredApplications = applications.filter((app) => {
  const matchesSearch =
    app.company.toLowerCase().includes(search.toLowerCase()) ||
    app.role.toLowerCase().includes(search.toLowerCase());

  const matchesStatus =
    filterStatus === "All" || app.status === filterStatus;

  return matchesSearch && matchesStatus;
});


  return (
    <div className="app">
      <aside className="sidebar">
        <h2>JobTrack</h2>
        <p className="active-menu">Dashboard</p>
        <p>Applications</p>
        <p>Interviews</p>
      </aside>

      <main className="main-content">
        <header className="header">
          <div>
            <h1>Job Application Tracker</h1>
          </div>

          <button
            className="add-button"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
          >
            + Add Application
          </button>
        </header>

        {showForm && (
          <form
            className="application-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Job Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Offered">Offered</option>
            </select>

            <button type="submit" className="add-button">
              {editId !== null
                ? "Update Application"
                : "Save Application"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={resetForm}
            >
              Cancel
            </button>
          </form>
        )}

        <section className="stats">
          <div className="stat-card">
            <p>Total Applications</p>
            <h2>{applications.length}</h2>
          </div>

          <div className="stat-card">
            <p>Applied</p>
            <h2>
              {
                applications.filter(
                  (app) => app.status === "Applied"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <p>Interviews</p>
            <h2>
              {
                applications.filter(
                  (app) => app.status === "Interview"
                ).length
              }
            </h2>
          </div>

          <div className="stat-card">
            <p>Rejected</p>
            <h2>
              {
                applications.filter(
                  (app) => app.status === "Rejected"
                ).length
              }
            </h2>
          </div>
        </section>

        <section className="applications-section">

<div className="table-heading">
  <h2>Recent Applications</h2>

  <div className="table-controls">
    <input
      type="text"
      placeholder="Search company or role..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="All">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Rejected">Rejected</option>
      <option value="Offered">Offered</option>
    </select>
  </div>
</div>


          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Job Role</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
<tbody>
  {filteredApplications.length === 0 ? (
    <tr>
      <td colSpan="5" className="empty-message">
        No applications found. Try another search or filter.
      </td>
    </tr>
  ) : (
    filteredApplications.map((app) => (
      <tr key={app.id}>
        <td>{app.company}</td>
        <td>{app.role}</td>
        <td>{app.date}</td>
        <td>
          <span className={`status ${app.status.toLowerCase()}`}>
            {app.status}
          </span>
        </td>
        <td>
          <button
            className="edit-button"
            onClick={() => handleEdit(app)}
          >
            Edit
          </button>

          <button
            className="delete-button"
            onClick={() => handleDelete(app.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
