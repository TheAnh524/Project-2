import { Outlet } from 'react-router'
import Header from '../components/Header'

const ClientLayout = () => {
  return (
    <div className="flex flex-col height-screen">
      <Header />
      <section className="flex-1 w-full max-w-7xl mx-auto">
        <Outlet />
      </section>
    </div>
  )
}

export default ClientLayout
