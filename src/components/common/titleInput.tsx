import styled from "@emotion/styled"
import { Button, Grid, TextField } from "@mui/material"
import { useState } from "react"
import { ButtonLink } from "../common/ButtonLink"

type Props = {
  onSave: (data: string) => void
}

export const TitleInput = ({ onSave }: Props) => {
  const [title, setTitle] = useState("")
  const [multiline, setMultiline] = useState(false)
  const [showError, setShowError] = useState(false)

  const save = () => {
    if (title === "") {
      setShowError(true)
      return
    }
    onSave(title)
    setTitle("")
    setShowError(false)
  }

  return (
    <>
      <ButtonLink onClick={(e) => setMultiline(!multiline)}>
        {multiline ? "Simple" : "Multiline"}
      </ButtonLink>

      <Form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <TextInput
          multiline={multiline}
          rows={7}
          fullWidth
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          id="outlined-basic"
          label="Title"
          variant="standard"
        />
        <Submit>
          <Button type="submit" variant="contained">
            +
          </Button>
        </Submit>
      </Form>
      {showError && <div style={{ color: "red" }}>Title cannot be empty</div>}
    </>
  )
}

const TextInput = styled(TextField)`
  max-width: 390px;
`
const Form = styled.form`
  display: flex;
`

const Submit = styled.div`
  display: flex;
  align-items: stretch;
`
