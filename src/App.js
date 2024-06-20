import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as yup from 'yup';
import './App.css';

const validationSchema = yup.object().shape({
  fullName: yup.string().required('Full Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phoneNumber: yup.number().typeError('Phone Number must be a valid number').required('Phone Number is required'),
  position: yup.string().required('Position is required'),
  relevantExperience: yup.number().when('position', {
    is: (val) => val === 'Developer' || val === 'Designer',
    then: yup.number().typeError('Relevant Experience must be a valid number').min(1, 'Experience must be greater than 0').required('Relevant Experience is required')
  }),
  portfolioURL: yup.string().url('Invalid URL').when('position', {
    is: 'Designer',
    then: yup.string().required('Portfolio URL is required')
  }),
  managementExperience: yup.string().when('position', {
    is: 'Manager',
    then: yup.string().required('Management Experience is required')
  }),
  additionalSkills: yup.array().min(1, 'At least one skill must be selected'),
  interviewTime: yup.date().required('Preferred Interview Time is required')
});

const App = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    position: '',
    relevantExperience: '',
    portfolioURL: '',
    managementExperience: '',
    additionalSkills: [],
    interviewTime: new Date()
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const updatedSkills = checked
        ? [...formData.additionalSkills, value]
        : formData.additionalSkills.filter(skill => skill !== value);
      setFormData({ ...formData, additionalSkills: updatedSkills });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, interviewTime: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setSubmittedData(formData);
      setErrors({});
    } catch (err) {
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name:</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
        </div>
        <div className="form-group">
          <label>Applying for Position:</label>
          <select name="position" value={formData.position} onChange={handleChange}>
            <option value="">Select a position</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
          </select>
          {errors.position && <p className="error">{errors.position}</p>}
        </div>
        {(formData.position === 'Developer' || formData.position === 'Designer') && (
          <div className="form-group">
            <label>Relevant Experience:</label>
            <input type="number" name="relevantExperience" value={formData.relevantExperience} onChange={handleChange} />
            {errors.relevantExperience && <p className="error">{errors.relevantExperience}</p>}
          </div>
        )}
        {formData.position === 'Designer' && (
          <div className="form-group">
            <label>Portfolio URL:</label>
            <input type="text" name="portfolioURL" value={formData.portfolioURL} onChange={handleChange} />
            {errors.portfolioURL && <p className="error">{errors.portfolioURL}</p>}
          </div>
        )}
        {formData.position === 'Manager' && (
          <div className="form-group">
            <label>Management Experience:</label>
            <input type="text" name="managementExperience" value={formData.managementExperience} onChange={handleChange} />
            {errors.managementExperience && <p className="error">{errors.managementExperience}</p>}
          </div>
        )}
        <div className="form-group">
          <label>Additional Skills:</label>
          <label>
            <input type="checkbox" name="additionalSkills" value="JavaScript" checked={formData.additionalSkills.includes('JavaScript')} onChange={handleChange} />
            JavaScript
          </label>
          <label>
            <input type="checkbox" name="additionalSkills" value="CSS" checked={formData.additionalSkills.includes('CSS')} onChange={handleChange} />
            CSS
          </label>
          <label>
            <input type="checkbox" name="additionalSkills" value="Python" checked={formData.additionalSkills.includes('Python')} onChange={handleChange} />
            Python
          </label>
          {errors.additionalSkills && <p className="error">{errors.additionalSkills}</p>}
        </div>
        <div className="form-group">
          <label>Preferred Interview Time:</label>
          <DatePicker
            selected={formData.interviewTime}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat="Pp"
          />
          {errors.interviewTime && <p className="error">{errors.interviewTime}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
      {submittedData && (
        <div className="summary">
          <h2>Submission Summary</h2>
          <p><strong>Full Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Phone Number:</strong> {submittedData.phoneNumber}</p>
          <p><strong>Position:</strong> {submittedData.position}</p>
          {submittedData.relevantExperience && (
            <p><strong>Relevant Experience:</strong> {submittedData.relevantExperience} years</p>
          )}
          {submittedData.portfolioURL && (
            <p><strong>Portfolio URL:</strong> {submittedData.portfolioURL}</p>
          )}
          {submittedData.managementExperience && (
            <p><strong>Management Experience:</strong> {submittedData.managementExperience}</p>
          )}
          <p><strong>Additional Skills:</strong> {submittedData.additionalSkills.join(', ')}</p>
          <p><strong>Preferred Interview Time:</strong> {submittedData.interviewTime.toString()}</p>
        </div>
      )}
      {submittedData && (
        <div className="submitted-message">
          <h3>Submitted</h3>
        </div>
      )}
    </div>
  );
};

export default App;
