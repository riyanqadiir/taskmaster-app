import './styles/components.css'
import './styles/layout.css'
import './styles/navigation.css'
import './styles/theme-overrides.css'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
