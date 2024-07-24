import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import DashboardLayout from './pages/Layouts/DashboardLayout';
import PDFtoQuestions from './pages/PDFtoQuestions';
import ChatBot from './pages/ChatBot';
import Analytics from './pages/Analytics';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<DashboardLayout />}>
        <Route path="/doc2qa" element={<PDFtoQuestions />} />
        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
