import React from 'react'
import NavBar from '../Components/NavBar'
import * as color from '../Assets/Colors/color'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import HomeIcon from '@mui/icons-material/Home';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
export default function FeedbackReportScreen() {
  const navigate = useNavigate();

  const mockUserFeedbackData = [
    {
      _id: "feedbackId1", // Add unique ID for each feedback entry
      feedback: "The product quality is excellent!",
      publishedStatus: true,
      checkedByAdmin: "Admin123",
      orderNo: 12345,
      anonymous: false,
      createdAt: new Date("2024-04-15T10:30:00"),
      user: "userId1"
    },
    {
      _id: "feedbackId2", // Add unique ID for each feedback entry
      feedback: "The delivery was delayed.",
      publishedStatus: false,
      checkedByAdmin: null,
      orderNo: 54321,
      anonymous: true,
      createdAt: new Date("2024-04-14T15:45:00"),
      user: "userId2"
    },
    {
      _id: "feedbackId3", // Add unique ID for each feedback entry
      feedback: "The customer support team was very helpful and responsive.",
      publishedStatus: true,
      checkedByAdmin: "Admin456",
      orderNo: 23456,
      anonymous: false,
      createdAt: new Date("2024-04-16T09:15:00"),
      user: "userId3"
    },
    {
      _id: "feedbackId4", // Add unique ID for each feedback entry
      feedback: "The website's loading speed is too slow.",
      publishedStatus: false,
      checkedByAdmin: null,
      orderNo: 65432,
      anonymous: true,
      createdAt: new Date("2024-04-15T17:30:00"),
      user: "userId4"
    },
    {
      _id: "feedbackId5", // Add unique ID for each feedback entry
      feedback: "I love the new feature additions!",
      publishedStatus: true,
      checkedByAdmin: "Admin789",
      orderNo: 34567,
      anonymous: false,
      createdAt: new Date("2024-04-14T11:45:00"),
      user: "userId5"
    },
    {
      _id: "feedbackId6", // Add unique ID for each feedback entry
      feedback: "The packaging was damaged upon arrival.",
      publishedStatus: true,
      checkedByAdmin: "Admin123",
      orderNo: 76543,
      anonymous: false,
      createdAt: new Date("2024-04-13T14:20:00"),
      user: "userId6"
    },
    {
      _id: "feedbackId7", // Add unique ID for each feedback entry
      feedback: "The product didn't meet my expectations.",
      publishedStatus: false,
      checkedByAdmin: null,
      orderNo: 98765,
      anonymous: true,
      createdAt: new Date("2024-04-12T08:45:00"),
      user: "userId7"
    },
    {
      _id: "feedbackId8", // Add unique ID for each feedback entry
      feedback: "The website layout is confusing.",
      publishedStatus: true,
      checkedByAdmin: "Admin456",
      orderNo: 87654,
      anonymous: false,
      createdAt: new Date("2024-04-11T12:10:00"),
      user: "userId8"
    },
    {
      _id: "feedbackId9", // Add unique ID for each feedback entry
      feedback: "I received the wrong item.",
      publishedStatus: true,
      checkedByAdmin: "Admin789",
      orderNo: 23456,
      anonymous: false,
      createdAt: new Date("2024-04-10T16:35:00"),
      user: "userId9"
    },
    {
      _id: "feedbackId10", // Add unique ID for each feedback entry
      feedback: "The checkout process was smooth.",
      publishedStatus: false,
      checkedByAdmin: null,
      orderNo: 34567,
      anonymous: true,
      createdAt: new Date("2024-04-09T19:50:00"),
      user: "userId10"
    }
  ];


  const mockUserReportData = [
    {
      reportSubject: "Voice Feature Improvement",
      reportDescription: "Enhance the voice feature to support more languages and improve accuracy in voice recognition.",
      reportImageUrl: null,
      status: "Ongoing",
      resolvedByAdmin: null,
      createdAt: new Date("2024-04-08T09:30:00"),
      user: "userId9" // Replace "userId9" with an actual ObjectId of a user
    },
    {
      reportSubject: "UI Enhancement",
      reportDescription: "Revamp the user interface with modern design principles and optimize for better performance on mobile devices.",
      reportImageUrl: "https://example.com/ui-enhancement.jpg",
      status: "Received",
      resolvedByAdmin: null,
      createdAt: new Date("2024-04-07T16:20:00"),
      user: "userId10" // Replace "userId10" with an actual ObjectId of a user
    },
    {
      reportSubject: "Chatbot Integration",
      reportDescription: "Integrate a chatbot feature to provide instant movie recommendations and answer user queries.",
      reportImageUrl: null,
      status: "Seen",
      resolvedByAdmin: "Admin456",
      createdAt: new Date("2024-04-06T11:45:00"),
      user: "userId11" // Replace "userId11" with an actual ObjectId of a user
    },
    {
      reportSubject: "Recommendation Algorithm Enhancement",
      reportDescription: "Improve the movie recommendation algorithm to suggest more accurate and personalized movie choices.",
      reportImageUrl: null,
      status: "Resolved",
      resolvedByAdmin: "Admin789",
      createdAt: new Date("2024-04-05T14:30:00"),
      user: "userId12" // Replace "userId12" with an actual ObjectId of a user
    },
    {
      reportSubject: "Social Media Integration",
      reportDescription: "Implement social media sharing functionality to allow users to share movie ratings and reviews on popular platforms.",
      reportImageUrl: null,
      status: "Received",
      resolvedByAdmin: null,
      createdAt: new Date("2024-04-04T17:50:00"),
      user: "userId13" // Replace "userId13" with an actual ObjectId of a user
    },
    // Add more mock data as needed
  ];

  const [value, setValue] = React.useState('feedback');
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const renderReports = () => {
    return mockUserReportData.map((report) => (
      <div key={report._id} style={{ margin: '20px 5px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#ffd601', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ textAlign: 'center', fontSize: '20px', marginBottom: '10px' }}>
            <strong>Subject:</strong> {report.reportSubject}
          </div>
          <div style={{ textAlign: 'justify', marginBottom: '10px' }}>
            <strong>Description:</strong> {report.reportDescription}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <div><strong>Status:</strong> {report.status}</div>
            <div><strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}><strong>_User:</strong> {report.user}</div>
        </div>
        <DeleteIcon style={{ cursor: 'pointer', color: 'red' }} onClick={() => console.log('delete')} />
      </div>
    ));
  };

  const renderFeedbacks = () => {
    return mockUserFeedbackData.map((feedback) => (
      <div key={feedback._id} style={{ margin: '20px 5px', padding: '10px', border: '1px solid #ccc', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffd601', borderRadius: '10px' }}>
        <div><strong>ID:</strong> {feedback._id}</div>
        <div ><strong>Feedback:</strong> {feedback.feedback}</div>
        <div><strong>Status:</strong> {feedback.publishedStatus ? 'Published' : 'Not Published'}</div>
        <div><strong>Anonymous:</strong> {feedback.anonymous ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {feedback.anonymous ? 'Anonymous' : feedback.user}</div>
        <div><strong>Date:</strong> {new Date(feedback.createdAt).toLocaleString()}</div>
        <DeleteIcon style={{ cursor: 'pointer', color: 'red' }} onClick={() => console.log('delete')} />
      </div>
    ));
  };


  return (
    <div style={{ height: '100%', backgroundColor: color.darkBackground }}>


      <div style={{ backgroundColor: '#e3f2fd', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='roboto-black' style={{ color: '#42a5f5', fontSize: 45, width: '10%', margin: 10 }}>
          Feedbacks  &  Reports
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <FormControl style={{ fontSize: 50 }}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
              style={{ display: 'flex', flexDirection: 'row' }}

            >
              <FormControlLabel style={{ color: '#42a5f5' }} labelPlacement="bottom" value="feedback" control={<Radio />} label="Feedbacks" />
              <FormControlLabel style={{ color: '#42a5f5' }} labelPlacement="bottom" value="report" control={<Radio />} label="Reports" />
            </RadioGroup>
          </FormControl>
        </div>
      </div>


      {(value == 'feedback') ?
        (
          <div>
            <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button variant="text" style={{ width: '10%' }} startIcon={<AddIcon />} onClick={() => { navigate('/feedback/create') }}>Create New</Button>
              <Button variant="text" style={{ width: '7%' }} startIcon={<HomeIcon />} onClick={() => { navigate('/') }}>Home</Button>
            </div>
            <div style={{ color: '#42a5f5', margin: 'auto 10px', fontSize: 40 }}>Feedbacks</div>

            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              {renderFeedbacks()}
            </div>

          </div>

        ) :
        (
          <div>
            <div style={{ display: 'flex', textAlign: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <Button variant="text" style={{ width: '10%' }} startIcon={<AddIcon />} onClick={() => { navigate('/report/create') }}>Create New</Button>
              <Button variant="text" style={{ width: '7%' }} startIcon={<HomeIcon />} onClick={() => { navigate('/') }}>Home</Button>
            </div>
            <div style={{ color: '#42a5f5', margin: 'auto 10px', fontSize: 40 }}>Reports</div>

            <div className='middle' style={{margin:'auto', maxHeight: '65vh', maxWidth: '50vw', overflowY: 'auto' }}>
              {renderReports()}
            </div>

          </div>

        )
      }

    </div>
  )
}
