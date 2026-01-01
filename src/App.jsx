import React, { useState, useRef } from 'react';
import Emulator from './Emulator';
import './App.css';

function App() {
  const [romData, setRomData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [speed, setSpeed] = useState(1);
  const [saveData, setSaveData] = useState(null);
  const [loadRequested, setLoadRequested] = useState(null);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const getSaveRef = useRef(null);

  const handleSave = () => {
    if (getSaveRef.current) {
      const state = getSaveRef.current();
      if (state) {
        setSaveData(state);
        localStorage.setItem(`save_${fileName}`, JSON.stringify(state));
        alert('State Saved!');
      }
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem(`save_${fileName}`);
    if (saved) {
      setLoadRequested(JSON.parse(saved));
      alert('State Loaded!');
    } else {
      alert('No save state found for this game.');
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.name.endsWith('.nes')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setRomData(e.target.result);
      };
      reader.readAsBinaryString(file);
    } else {
      alert('Please upload a valid .nes ROM file.');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="app-container">
      <header className="hero-section">
        <h1>NES <span className="text-glow">BEYOND</span></h1>
        <p className="subtitle">Experience the golden age of gaming in high fidelity.</p>
      </header>

      <main className="main-content">
        <div className="emulator-wrapper glass">
          <div className="emulator-column">
            <Emulator
              romData={romData}
              speed={speed}
              onSaveReady={(fn) => getSaveRef.current = fn}
              onLoadRequested={loadRequested}
              isMobileMode={isMobileMode}
            />

            <div className="advanced-controls glass">
              <div className="state-controls">
                <button className="btn-secondary" onClick={handleSave}>SAVE STATE</button>
                <button className="btn-secondary" onClick={handleLoad}>LOAD STATE</button>
                <button 
                  className={`btn-secondary ${isMobileMode ? 'active-mobile' : ''}`} 
                  onClick={() => setIsMobileMode(!isMobileMode)}
                >
                  {isMobileMode ? 'DISABLE TOUCH' : 'MOBILE MODE'}
                </button>
              </div>

              <div className="speed-controls">
                <span className="retro-font">SPEED:</span>
                <button className={`speed-btn ${speed === 0.5 ? 'active' : ''}`} onClick={() => setSpeed(0.5)}>0.5x</button>
                <button className={`speed-btn ${speed === 1 ? 'active' : ''}`} onClick={() => setSpeed(1)}>1x</button>
                <button className={`speed-btn ${speed === 2 ? 'active' : ''}`} onClick={() => setSpeed(2)}>2x</button>
                <button className={`speed-btn ${speed === 3 ? 'active' : ''}`} onClick={() => setSpeed(3)}>3x</button>
              </div>
            </div>
          </div>

          <div className="controls-panel">
            <div
              className={`upload-section ${romData ? 'has-rom' : ''}`}
              onDrop={onDrop}
              onDragOver={onDragOver}
            >
              <div className="drop-zone">
                <label htmlFor="rom-upload" className="btn-primary">
                  {romData ? 'REPLACE ROM' : 'UPLOAD .NES FILE'}
                </label>
                <input
                  id="rom-upload"
                  type="file"
                  accept=".nes"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                {!romData && <p className="drop-hint">or drop your ROM here</p>}
              </div>
              {fileName && (
                <div className="file-info glass">
                  <span className="retro-font">Loaded: {fileName}</span>
                </div>
              )}
            </div>

            <div className="instructions glass">
              <h3 className="retro-font">Controls</h3>
              <div className="key-grid">
                <div className="key-item"><span className="key">W/A/S/D</span> D-Pad</div>
                <div className="key-item"><span className="key">J</span> Button A</div>
                <div className="key-item"><span className="key">K</span> Button B</div>
                <div className="key-item"><span className="key">ENTER</span> Start</div>
                <div className="key-item"><span className="key">SHIFT</span> Select</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="glass">
        <p>&copy; 2024 NES BEYOND | Built with Antigravity</p>
      </footer>
    </div>
  );
}

export default App;
