import type { Artwork } from "../../../dto/Artwork";

export default function Readable({ artworks }: { artworks: Artwork[] }) {
  return <div data-artwork-count={artworks.length}>Readable Art</div>;
}
