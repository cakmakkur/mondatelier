import type { Artwork } from "../../../dto/Artwork";

export default function Watchable({ artworks }: { artworks: Artwork[] }) {
  return <div data-artwork-count={artworks.length}>Watchable Art</div>;
}
