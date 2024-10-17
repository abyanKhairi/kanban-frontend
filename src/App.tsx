import './App.css'
import { ToastContainer } from 'react-toastify'
import { UserProvider } from './Context/useAuth'
import { Outlet } from 'react-router-dom'
import { BoardProvider } from './Context/useBoard'
// import { Sidebar } from './Pages/Layouts/Sidebar'

function App() {

  return (
    <>
      <UserProvider>
        <BoardProvider>
          <Outlet />
          <ToastContainer />
        </BoardProvider>
      </UserProvider>
    </>
  )
}

export default App
