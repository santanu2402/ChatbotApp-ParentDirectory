import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CreateFeedbackScreen from './Screens/CreateFeedbackScreen';
import CreateReportScreen from './Screens/CreateReportScreen';
import FeedbackReportScreen from './Screens/FeedbackReportScreen';
import HomeScreen from './Screens/HomeScreen';
import HowOurAppWorks from './Screens/HowOurAppWorks';
import MembersScreen from './Screens/MembersScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import VerifyUserScreen from './Screens/VerifyUserScreen';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/feedback/create" element={<CreateFeedbackScreen />} />
          <Route path="/report/create" element={<CreateReportScreen />} />
          <Route path="/feedback_reports" element={<FeedbackReportScreen />} />
          <Route path="/working" element={<HowOurAppWorks />} />
          <Route path="/members" element={<MembersScreen />} />
          <Route path="/profile" element={<UserProfileScreen />} />
          <Route path="/user/verify" element={<VerifyUserScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
