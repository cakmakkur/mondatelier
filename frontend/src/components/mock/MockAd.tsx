const MockAd = ({ width = "300px", height = "250px" }) => {
  return (
    <div
      className="mock-ad-container"
      style={{
        width: width,
        height: height,
        backgroundColor: "#f0f0f0",
        border: "2px dashed #cccccc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "10px",
          color: "#999",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Advertisement
      </span>
      <div style={{ fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
        🚀 Mock Product Name
      </div>
      <p
        style={{
          fontSize: "12px",
          color: "#666",
          textAlign: "center",
          margin: "0 10px 12px 10px",
        }}
      >
        This is a fake advertisement used exclusively for development layouts.
      </p>
      <button
        onClick={() => alert("Mock ad clicked!")}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "6px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "12px",
        }}
      >
        Learn More
      </button>
    </div>
  );
};

export default MockAd;
