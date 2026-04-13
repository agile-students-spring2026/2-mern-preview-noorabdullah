import { useEffect, useState } from 'react'
import axios from 'axios'
import './AboutUs.css'

/**
 * A React component that represents the About Us page of the app.
 * Content is fetched as JSON from the back-end /about route.
 */
const AboutUs = props => {
  const [aboutData, setAboutData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
      .then(response => setAboutData(response.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load About Us content.')
      })
  }, [])

  if (error) return <p className="AboutUs-error">{error}</p>
  if (!aboutData) return <p className="AboutUs-loading">Loading...</p>

  return (
    <div className="AboutUs-container">
      <h1>About Us</h1>
      <img
        src={aboutData.photo}
        alt={aboutData.name}
        className="AboutUs-photo"
      />
      <h2>{aboutData.name}</h2>
      {aboutData.paragraphs.map((para, index) => (
        <p key={index}>{para}</p>
      ))}
    </div>
  )
}

export default AboutUs
