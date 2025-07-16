// src/pages/ImageClassifier.jsx
import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const classes = ['Mildiu', 'Mosca Blanca', 'Pulgón'];

export default function ImageClassifier() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const smallCanvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [result, setResult] = useState('');
  const [facingMode, setFacingMode] = useState('user');

  useEffect(() => {
    tf.loadLayersModel('/modelo/model.json').then(setModel);
    startCamera(facingMode);
  }, []);

  const startCamera = async (mode) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode, width: 400, height: 400 },
    });
    videoRef.current.srcObject = stream;
    videoRef.current.play();
    requestAnimationFrame(captureFrame);
    setTimeout(predictLoop, 1000);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    stopCamera();
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const captureFrame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 400, 400);
    requestAnimationFrame(captureFrame);
  };

  const predictLoop = () => {
    if (model && videoRef.current.readyState === 4) {
      const ctx = smallCanvasRef.current.getContext('2d');
      ctx.drawImage(canvasRef.current, 0, 0, 224, 224);
      const imgData = ctx.getImageData(0, 0, 224, 224);
      const input = tf.browser.fromPixels(imgData).toFloat().div(255).expandDims();
      const prediction = model.predict(input);
      const data = prediction.dataSync();
      const maxIndex = prediction.argMax(1).dataSync()[0];

      setResult(`${classes[maxIndex]} (${(data[maxIndex] * 100).toFixed(2)}%)`);
    }
    setTimeout(predictLoop, 800);
  };

  return (
    <div className="page-container">
      <h2>Clasificador de Enfermedades</h2>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="400" height="400" />
      <canvas ref={smallCanvasRef} width="224" height="224" style={{ display: 'none' }} />
      <div className="prediction-text">{result}</div>
      <button onClick={switchCamera}>Cambiar cámara</button>
    </div>
  );
}
