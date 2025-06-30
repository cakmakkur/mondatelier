import artTypes from "./ArtTypes";
import Display1 from "./Display1";

export default function Art() {
  return (
    <div className="art_container">
      <div className="types_container">
        {Object.entries(artTypes).map(([type, index]) => (
          <div key={index} className={`art_type art_type_${index + 1}`}>
            <span>{type}</span>
          </div>
        ))}
      </div>
      <div className="artwork_container">
        <Display1 />
      </div>
    </div>
  );
}
