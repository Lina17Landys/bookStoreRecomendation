import Lottie from "lottie-react";
import bookLoading from "./book-loading.json";

const BookLoader = () => {
  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f6f3ee" }}>
      <Lottie
        animationData={bookLoading}
        loop={true}
        autoplay={true}
        style={{ height: "200px", width: "200px" }}
      />
    </div>
  );
};

export default BookLoader;
