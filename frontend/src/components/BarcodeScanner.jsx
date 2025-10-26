import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controlsRef = useRef(null);
  const codeReaderRef = useRef(null);
  const stopCamera = () => {
    console.log('Stopping camera...');

    if (controlsRef.current) {
      try {
        controlsRef.current.stop();
        console.log('ZXing controls stopped');
      } catch (e) {
        console.error('Error stopping ZXing controls:', e);
      }
      controlsRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      
      videoRef.current.srcObject = null;
    }

    if (codeReaderRef.current) {
      try {
        codeReaderRef.current.reset();
        console.log('Code reader reset');
      } catch (e) {
        console.error('Error resetting code reader:', e);
      }
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.load();
    }

    console.log('Camera stopped successfully');
  };

  const handleClose = () => {
    stopCamera();
    setTimeout(() => {
      onClose();
    }, 100);
  };

  useEffect(() => {
    let isActive = true;
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const startScanning = async () => {
      try {
        const videoDevices = await BrowserMultiFormatReader.listVideoInputDevices();

        if (!isActive) return;

        if (videoDevices.length === 0) {
          setError('No camera found on this device');
          setIsLoading(false);
          return;
        }

        const selectedDevice = videoDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || videoDevices[0];

        console.log('Starting camera:', selectedDevice.label);

        const controls = await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current,
          (result, err) => {
            if (result && isActive) {
              console.log('Barcode detected:', result.getText());
              stopCamera();
              onScan(result.getText());
            }
          }
        );

        if (!isActive) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;

        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => setIsLoading(false);
          setTimeout(() => setIsLoading(false), 1000);
        }

      } catch (err) {
        console.error('Camera error:', err);
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission denied');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use');
        } else {
          setError('Failed to access camera: ' + err.message);
        }
        
        setIsLoading(false);
      }
    };

    startScanning();
    return () => {
      console.log('Component unmounting, cleaning up...');
      isActive = false;
      stopCamera();
    };
  }, []); 

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Scan Barcode</h2>
          <button onClick={handleClose} style={styles.closeIcon}>✕</button>
        </div>
        
        {error ? (
          <div style={styles.errorContainer}>
            <div style={styles.error}>{error}</div>
          </div>
        ) : (
          <div style={styles.videoContainer}>
            {isLoading && (
              <div style={styles.loadingOverlay}>
                <div style={styles.spinner}></div>
                <p>Starting camera...</p>
              </div>
            )}
            <video 
              ref={videoRef} 
              style={styles.video}
              autoPlay
              playsInline
              muted
            />
            <p style={styles.instruction}>
              Position the barcode within the camera view
            </p>
          </div>
        )}
        
        <button onClick={handleClose} style={styles.closeButton}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  closeIcon: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px',
    lineHeight: 1,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: '20px',
    backgroundColor: '#000',
    borderRadius: '10px',
    overflow: 'hidden',
    minHeight: '300px',
  },
  video: {
    width: '100%',
    height: 'auto',
    maxHeight: '450px',
    display: 'block',
    objectFit: 'cover',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    zIndex: 10,
  },
  spinner: {
    border: '4px solid rgba(255, 255, 255, 0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '15px',
  },
  instruction: {
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px 20px',
    borderRadius: '5px',
    margin: '10px',
    fontSize: '14px',
    position: 'absolute',
    bottom: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  errorContainer: {
    marginBottom: '20px',
  },
  error: {
    color: '#721c24',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    padding: '15px',
    borderRadius: '8px',
  },
  closeButton: {
    width: '100%',
    padding: '12px 30px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default BarcodeScanner;
