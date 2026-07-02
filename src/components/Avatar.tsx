export function Avatar({
  color,
  initials,
  size = 44,
}: {
  color: string;
  initials: string;
  size?: number;
}) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  );
}
