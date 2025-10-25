import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnService } from '../services/api';
import BarcodeScanner from './BarcodeScanner';

const CreateReturn = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [barcode, setBarcode] = useState('');
  const [files, setFiles] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBarcodeInput = (e) => {
    setBarcode(e.target.value);
  };

  const handleBarcodeScanned = (scannedCode) => {
    setBarcode(scannedCode);
    setShowScanner(false);
    setStep(2); // Automatically move to step 2 after scanning
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setError(''); // Clear any previous errors
  };

  const handleNext = () => {
    if (step === 1 && barcode) {
      setStep(2);
      setError('');
    } else {
      setError('Please enter or scan a barcode');
    }
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!barcode) {
      setError('Please provide a barcode');
      return;
    }
    
    if (files.length === 0) {
      setError('Please upload at least one image or video');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('barcode', barcode);
    files.forEach((file) => {
      formData.append('media_files', file);
    });

    try {
      await returnService.create(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Return Request</h2>
        
        <div style={styles.stepIndicator}>
          <div style={step >= 1 ? styles.stepActive : styles.step}>1. Scan Barcode</div>
          <div style={step >= 2 ? styles.stepActive : styles.step}>2. Upload Media</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {step === 1 && (
          <div style={styles.stepContent}>
            <h3>Step 1: Scan or Enter Barcode</h3>
            <input
              type="text"
              placeholder="Enter barcode manually"
              value={barcode}
              onChange={handleBarcodeInput}
              style={styles.input}
            />
            <button onClick={() => setShowScanner(true)} style={styles.scanButton}>
             Scan Barcode with Camera
            </button>
            <button
              onClick={handleNext}
              disabled={!barcode}
              style={{ ...styles.button, opacity: barcode ? 1 : 0.5 }}
            >
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.stepContent}>
            <h3>Step 2: Upload Images or Videos</h3>
            <p style={styles.barcodeDisplay}>Barcode: <strong>{barcode}</strong></p>
            
            <div style={styles.uploadSection}>
              <label htmlFor="file-upload" style={styles.uploadLabel}>
                <div style={styles.uploadIcon}>📁</div>
                <div style={styles.uploadText}>
                  {files.length === 0 ? (
                    <>
                      <strong>Click to upload</strong> or drag and drop
                      <br />
                      <small>Images (JPG, PNG, GIF) or Videos (MP4, AVI, MOV)</small>
                    </>
                  ) : (
                    <>
                      <strong>{files.length} file(s) selected</strong>
                      <br />
                      <small>Click to change files</small>
                    </>
                  )}
                </div>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={styles.fileInputHidden}
              />
            </div>
            
            {files.length > 0 && (
              <div style={styles.fileList}>
                <p style={styles.fileListTitle}>Selected Files:</p>
                <ul style={styles.fileListItems}>
                  {files.map((file, index) => (
                    <li key={index} style={styles.fileListItem}>
                      <span style={styles.fileIcon}>
                        {file.type.startsWith('image/') ? '🖼️' : '🎥'}
                      </span>
                      {file.name}
                      <span style={styles.fileSize}>
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button onClick={handleBack} style={styles.backButton}>
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || files.length === 0}
                style={{ 
                  ...styles.button, 
                  opacity: (files.length > 0 && !loading) ? 1 : 0.5,
                  flex: 1
                }}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    maxWidth: '700px',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontSize: '28px',
  },
  stepIndicator: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '40px',
    gap: '10px',
  },
  step: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#e9ecef',
    color: '#6c757d',
    textAlign: 'center',
    fontSize: '14px',
  },
  stepActive: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#0B0705',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14px',
  },
  stepContent: {
    marginTop: '20px',
  },
  input: {
    width: '100%',
    padding: '14px',
    marginBottom: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  scanButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#0B0705',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '15px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  backButton: {
    padding: '14px 24px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '10px',
    fontWeight: 'bold',
  },
  buttonGroup: {
    display: 'flex',
    marginTop: '30px',
    gap: '10px',
  },
  barcodeDisplay: {
    backgroundColor: '#e7f3ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '25px',
    fontSize: '16px',
  },
  uploadSection: {
    marginBottom: '25px',
  },
  uploadLabel: {
    display: 'block',
    border: '3px dashed #007bff',
    borderRadius: '12px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    backgroundColor: '#f8f9fa',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: '#e7f3ff',
      borderColor: '#0056b3',
    },
  },
  uploadIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  uploadText: {
    color: '#333',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  fileInputHidden: {
    display: 'none',
  },
  fileList: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  fileListTitle: {
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  fileListItems: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  fileListItem: {
    padding: '10px',
    backgroundColor: 'white',
    marginBottom: '8px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
  },
  fileIcon: {
    fontSize: '20px',
  },
  fileSize: {
    color: '#6c757d',
    fontSize: '12px',
    marginLeft: 'auto',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  },
};

export default CreateReturn;
