export default function Follow({
  followType,
}: {
  followType: "followers" | "following";
}) {
  if (followType === "followers") {
    return <div>Followers</div>;
  } else if (followType === "following") {
    return <div>Following</div>;
  }
}
