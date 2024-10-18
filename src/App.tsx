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
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </BoardProvider>
      </UserProvider>
    </>
  )
}

export default App
