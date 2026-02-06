import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ScorePage from './pages/ScorePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="score/:id" element={<ScorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
