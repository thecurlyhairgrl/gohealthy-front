import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section style={{ textAlign: 'center', padding: '48px 20px' }}>
      <h1>404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}

export default NotFoundPage
