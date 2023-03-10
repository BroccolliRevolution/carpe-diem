import Link from "next/link"
import { useState } from "react"

export const ChoppedTitle = ({ title }: { title: string }) => {
  const maxLength = 80
  const [fullText, setFullText] = useState(false)

  if (title.length <= maxLength) return <>{title}</>

  if (fullText)
    return (
      <>
        {title}{" "}
        <Link
          onClick={(e) => {
            e.preventDefault()
            setFullText(false)
          }}
          href="#"
        >
          Show Less
        </Link>
      </>
    )

  return (
    <>
      {title.substring(0, maxLength)}{" "}
      <Link
        onClick={(e) => {
          e.preventDefault()
          setFullText(true)
        }}
        href="#"
      >
        ...
      </Link>
    </>
  )
}
