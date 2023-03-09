import Link from "next/link"
import { CSSProperties, ReactNode } from "react"

type Props = {
  children: ReactNode
  onClick: (event: MouseEvent) => void
  style?: CSSProperties
}
export const ButtonLink: React.FC<Props> = ({ style, children, onClick }) => (
  <Link
    style={style}
    onClick={(e) => {
      e.preventDefault()
      //@ts-ignore
      onClick(e)
    }}
    href="#"
  >
    {children}
  </Link>
)
