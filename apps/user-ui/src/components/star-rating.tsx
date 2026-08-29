interface StarRatingProps {
  rating: number
  size?: string
}

export function StarRating({ rating, size = "var(--fs-7)" }: StarRatingProps) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const stars: string[] = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("★")
    else if (i === full && hasHalf) stars.push("★")
    else stars.push("☆")
  }
  return (
    <span className="star-rating" style={{ fontSize: size }}>
      {stars.map((s, i) => (
        <span key={i} className={s === "☆" ? "star-empty" : ""}>
          {s}
        </span>
      ))}
    </span>
  )
}
