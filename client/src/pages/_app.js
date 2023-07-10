import '@/styles/globals.css'
import Context from '../../context/socket'
import jwt from 'jwt-decode'

export default function App({ Component, pageProps }) {

  


  return (
    <Context>
      <Component {...pageProps} />
    </Context>
  )
}
