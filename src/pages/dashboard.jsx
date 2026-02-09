import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadFeedbacks = async () => {
    const res = await api.get("/feedback/my");
    setFeedbacks(res.data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const submitFeedback = async () => {
    if (!message.trim()) return alert("Feedback cannot be empty");

    setLoading(true);

    if (editingId) {
      await api.put(`/feedback/${editingId}`, { message });
      setEditingId(null);
    } else {
      await api.post("/feedback", { message });
    }

    setMessage("");
    setLoading(false);
    loadFeedbacks();
  };

  const startEdit = (fb) => {
    setEditingId(fb._id);
    setMessage(fb.message);
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">User Dashboard</h3>

      {/* Feedback Form */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5>{editingId ? "Edit Feedback" : "Add Feedback"}</h5>

        <textarea
          className="form-control mb-3"
          rows="3"
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={submitFeedback}
          disabled={loading}
        >
          {editingId ? "Update Feedback" : "Submit Feedback"}
        </button>
      </div>

      {/* Feedback List */}
      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">My Feedbacks</h5>

        {feedbacks.length === 0 ? (
          <p className="text-muted">No feedback submitted yet</p>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center"
            >
              <span>{fb.message}</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => startEdit(fb)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
