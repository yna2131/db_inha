import { useState } from "react";

export function CreateModal({ type, onClose, onSubmit, categories }) {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    if (field1 && field2 && (type === "category" || category)) {
      onSubmit({
        field1,
        field2,
        category: type === "post" ? category : undefined,
      });
      onClose();
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          X
        </button>
        <h2>
          {type === "post" ? "Create a New Post" : "Create a New Category"}
        </h2>
        <div>
          <input
            type="text"
            placeholder={type === "post" ? "Title" : "Name"}
            value={field1}
            onChange={(e) => setField1(e.target.value)}
            style={styles.input}
          />
        </div>
        <div>
          <textarea
            placeholder={type === "post" ? "Content" : "Description"}
            value={field2}
            onChange={(e) => setField2(e.target.value)}
            style={styles.textarea}
          />
        </div>
        {type === "post" && (
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <button onClick={handleSubmit} style={styles.submitButton}>
          {type === "post" ? "Create Post" : "Create Category"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "600px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    margin: "10px 0",
    height: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    margin: "10px 0",
    height: "200px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    margin: "10px 0",
    height: "40px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  submitButton: {
    backgroundColor: "#1563B8",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default CreateModal;
