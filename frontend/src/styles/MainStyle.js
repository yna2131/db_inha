export const mainstyle = {
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    overflow: "hidden",
  },
  header: {
    height: "15%",
    maxHeight: "100px",
    width: "100%",
    backgroundColor: "#1563B8",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    position: "fixed",
    top: 0,
    zIndex: 10,
    padding: "0 1rem",
    paddingRight: "4rem",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: "40px",
  },
  categoriesContainer: {
    position: "sticky",
    top: "100px",
    left: 0,
    width: "100%",
    padding: "10px",
    overflowX: "auto",
    display: "flex",
    gap: "10px",
    whiteSpace: "nowrap",
    backgroundColor: "#fff",
    zIndex: 9,
    paddingBottom: "10px",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    color: "white",
    cursor: "pointer",
  },
  categoryBox: {
    flex: "0 0 auto",
    width: "10rem",
    height: "1.5rem",
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "50px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.8rem",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    minWidth: "8rem",
  },
  postsContainer: {
    flex: 1,
    padding: "0 10px 10px 10px",
    overflowY: "scroll",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(20rem, 1fr))",
    gap: "10px",
    position: "relative",
    paddingTop: "120px",
    boxSizing: "border-box",
    justifyItems: "center",
  },
  postBox: {
    width: "100%",
    aspectRatio: "auto",
    backgroundColor: "#e0e0e0",
    border: "1px solid #ccc",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    fontSize: "1rem",
    padding: "15px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
    flex: "none",
    minHeight: "20rem",
    justifyContent: "space-between",
  },

  postTitle: {
    fontWeight: "bold",
    marginBottom: "10px",
  },

  postContent: {
    flexGrow: 1,
    overflowY: "auto",
    maxHeight: "1000px",
    wordWrap: "break-word",
    whiteSpace: "normal",
    marginBottom: "0",
  },

  "@media (max-width: 768px)": {
    postBox: {
      fontSize: "0.9rem",
    },
    postContent: {
      maxHeight: "250px",
    },
  },

  "@media (max-width: 480px)": {
    postBox: {
      fontSize: "0.8rem",
    },
    postContent: {
      maxHeight: "200px",
    },
  },

  "@media (max-width: 768px)": {
    header: {
      fontSize: "1.2rem",
      height: "12%",
    },
    categoriesContainer: {
      padding: "8px",
      gap: "8px",
    },
    categoryBox: {
      width: "8rem",
      fontSize: "0.9rem",
    },
    postsContainer: {
      paddingTop: "110px",
    },
    postBox: {
      fontSize: "0.9rem",
    },
  },

  "@media (max-width: 480px)": {
    header: {
      fontSize: "1rem",
    },
    categoriesContainer: {
      padding: "5px",
      gap: "5px",
    },
    categoryBox: {
      width: "7rem",
      fontSize: "0.8rem",
    },
    postsContainer: {
      paddingTop: "100px",
    },
    postBox: {
      fontSize: "0.8rem",
    },
  },
};
