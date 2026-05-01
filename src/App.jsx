// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './presentation/pages/auth/Login.jsx';
import Register from './presentation/pages/auth/Register.jsx'
import LandingPage from './presentation/pages/landing/LandingPage.jsx';
import VerifyCode from './presentation/pages/auth/VerifyCode.jsx';
import { ResendVerificationCode } from './presentation/pages/auth/ResendVerificationCode.jsx';

import Dashboard from './presentation/pages/dashboard/Dashboard.jsx';
import VotationList from './presentation/pages/votation/VotationList.jsx';
import VotationAdminView from './presentation/pages/votation/VotationAdminView.jsx';
import VotationAnswers from './presentation/pages/votation/VotationAnswers.jsx';
import InvitationsList from './presentation/pages/invitation/InvitationsList.jsx';
import MembersList from './presentation/pages/member/MemberList.jsx';
import NotificationsPage from './presentation/pages/notifications/NotificationsPage.jsx';
import MyVotationAnswersById from './presentation/pages/votation/MyVotationAnswersById.jsx';
import CreateVotation from './presentation/pages/votation/CreateVotaton.jsx';
import PublicVotationView from './presentation/pages/votation/PublicVotationView.jsx';
import PublicAnswerVotationView from './presentation/pages/votation/PublicAnswerVotationView.jsx';
import PublicUpdateAnswerVotationView from './presentation/pages/votation/PublicUpdateAnswerVotationView.jsx';
import UpdateVotation from './presentation/pages/votation/UpdateVotation.jsx';
import ProfilePage from './presentation/pages/profile/ProfilePage.jsx';
import VotationResults from './presentation/pages/votation/VotationResults.jsx';
import ForgotPassword from './presentation/pages/auth/ForgotPassword.jsx';
import ResetPassword from './presentation/pages/auth/ResetPassword.jsx';

// Importar el layout
import DashboardLayout from './presentation/components/layout/DashboardLayout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page - Sin navbar */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes - Sin navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/verify-code/:token" element={<VerifyCode />} />
        <Route path="/resend-verification" element={<ResendVerificationCode />} />
        
        {/* Rutas públicas - Sin navbar */}
        <Route path="/public/votation/:id/view" element={<PublicVotationView />} />
        <Route path="/public/votation/:id/answer" element={<PublicAnswerVotationView />} />
        <Route path="/public/votation/:id/update-answer" element={<PublicUpdateAnswerVotationView />} />

        {/* Dashboard routes - CON NAVBAR */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/votations" element={<VotationList />} />
          <Route path="/dashboard/votations/:id" element={<VotationAdminView />} />
          <Route path="/dashboard/votations/:id/answers" element={<VotationAnswers />} />
          <Route path="/dashboard/votations/:id/results" element={<VotationResults />} />
          <Route path="/dashboard/votations/:id/members" element={<MembersList />} />
          <Route path="/dashboard/votations/create" element={<CreateVotation />} />
          <Route path="/dashboard/votations/:id/update-votation" element={<UpdateVotation />} />
          <Route path="/dashboard/invitations" element={<InvitationsList />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
          <Route path="/votations/:id/my-answers" element={<MyVotationAnswersById />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;