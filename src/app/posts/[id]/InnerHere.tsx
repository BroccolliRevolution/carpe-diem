"use client"

import { useEffect, useState } from "react"

const InnerHere = () => {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const response = fetch("/api/other")
      const data = await (await response).json()
      setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>InnerHere</h1>
      {/* <CheckBox>dasd</CheckBox>
      <Button variant="contained">Contained</Button> */}
      {/* <CheckBox>dasd</CheckBox>
      <Paper elevation={0} />
      <Paper />
      <Paper elevation={3} /> */}
      {JSON.stringify(data)}
    </div>
  )
}

export default InnerHere
