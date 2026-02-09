import { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const loadFeedbacks = async () => {
    const res = await api.get("/feedback");
    setFeedbacks(res.data);
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const startEdit = (feedback) => {
    setEditingId(feedback._id);
    setMessage(feedback.message);
  };

  const updateFeedback = async () => {
    if (!message.trim()) return alert("Message cannot be empty");

    setLoading(true);
    await api.put(`/feedback/${editingId}`, { message });
    setEditingId(null);
    setMessage("");
    setLoading(false);
    loadFeedbacks();
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    await api.delete(`/feedback/${id}`);
    loadFeedbacks();
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Admin Dashboard</h3>

      {feedbacks.length === 0 ? (
        <p className="text-muted">No feedback available</p>
      ) : (
        feedbacks.map((f, index) => (
          <div key={f._id} className="card mb-3 shadow-sm">
            <div className="card-body">
              {/* Header Row */}
              <div className="d-flex justify-content-between mb-2">
                <strong>SR No: {index + 1}</strong>
                <small className="text-muted">
                  {new Date(f.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </small>
              </div>

              {editingId === f._id ? (
                <>
                  <textarea
                    className="form-control mb-2"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={updateFeedback}
                    disabled={loading}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingId(null);
                      setMessage("");
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-1">{f.message}</p>
                  <small className="text-muted">
                    {f.userId?.email}
                  </small>

                  <div className="mt-2">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => startEdit(f)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteFeedback(f._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
