import { useParams } from "react-router-dom";

export default function Publish() {
  const { profileId } = useParams();

  return <div>Publish{profileId}</div>;
}
