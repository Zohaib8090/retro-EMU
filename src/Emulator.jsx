import React, { useEffect, useRef, useState } from 'react';
import * as jsnes from 'jsnes';
const NES = jsnes.NES || (jsnes.default && jsnes.default.NES);

const NES_WIDTH = 256;
const NES_HEIGHT = 240;
const AUDIO_BUFFER_SIZE = 4096;

const Emulator = ({ romData, speed = 1, onSaveReady, onLoadRequested }) => {
    const canvasRef = useRef(null);
    const nesRef = useRef(null);
    const requestRef = useRef(null);
    const [isRunning, setIsRunning] = useState(false);

    // Audio refs
    const audioCtxRef = useRef(null);
    const scriptNodeRef = useRef(null);
    const audioBuffer = useRef({
        left: new Float32Array(AUDIO_BUFFER_SIZE * 2),
        right: new Float32Array(AUDIO_BUFFER_SIZE * 2),
        writeIndex: 0,
        readIndex: 0
    });

    // Buffer for the canvas imaging
    const frameBuffer = useRef(new Uint32Array(NES_WIDTH * NES_HEIGHT));
    const canvasImageData = useRef(null);
    const canvasContext = useRef(null);

    const initAudio = () => {
        if (audioCtxRef.current) return;

        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        scriptNodeRef.current = audioCtxRef.current.createScriptProcessor(AUDIO_BUFFER_SIZE, 0, 2);

        scriptNodeRef.current.onaudioprocess = (e) => {
            const left = e.outputBuffer.getChannelData(0);
            const right = e.outputBuffer.getChannelData(1);
            const b = audioBuffer.current;

            for (let i = 0; i < AUDIO_BUFFER_SIZE; i++) {
                if (b.readIndex !== b.writeIndex) {
                    left[i] = b.left[b.readIndex];
                    right[i] = b.right[b.readIndex];
                    b.readIndex = (b.readIndex + 1) % (AUDIO_BUFFER_SIZE * 2);
                } else {
                    left[i] = 0;
                    right[i] = 0;
                }
            }
        };

        scriptNodeRef.current.connect(audioCtxRef.current.destination);
    };

    useEffect(() => {
        if (!canvasRef.current) return;

        canvasContext.current = canvasRef.current.getContext('2d');
        canvasImageData.current = canvasContext.current.createImageData(NES_WIDTH, NES_HEIGHT);

        // Initialize JSNES
        try {
            if (!NES) {
                console.error("JSNES not found. Check your imports.");
                return;
            }
            const nes = new NES({
                onFrame: (frameBuffer24) => {
                    if (!frameBuffer.current) return;
                    for (let i = 0; i < frameBuffer24.length; i++) {
                        frameBuffer.current[i] = 0xFF000000 | frameBuffer24[i];
                    }
                },
                onAudioSample: (left, right) => {
                    const b = audioBuffer.current;
                    b.left[b.writeIndex] = left;
                    b.right[b.writeIndex] = right;
                    b.writeIndex = (b.writeIndex + 1) % (AUDIO_BUFFER_SIZE * 2);
                }
            });
            nesRef.current = nes;
            console.log("JSNES initialized successfully");
        } catch (err) {
            console.error("Failed to initialize JSNES:", err);
        }

        return () => {
            cancelAnimationFrame(requestRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close();
        };
    }, []);

    useEffect(() => {
        if (romData && nesRef.current) {
            initAudio();
            nesRef.current.loadROM(romData);
            setIsRunning(true);
            startLoop();
        }
    }, [romData]);

    useEffect(() => {
        if (onSaveReady) {
            onSaveReady(() => {
                if (nesRef.current) {
                    return nesRef.current.toJSON();
                }
                return null;
            });
        }
    }, [onSaveReady]);

    useEffect(() => {
        if (onLoadRequested && nesRef.current) {
            nesRef.current.fromJSON(onLoadRequested);
        }
    }, [onLoadRequested]);

    const startLoop = () => {
        let lastTime = performance.now();

        const loop = (currentTime) => {
            if (!nesRef.current) return;

            const frameTime = (1000 / 60) / speed;
            const deltaTime = currentTime - lastTime;

            if (deltaTime >= frameTime) {
                nesRef.current.frame();

                // Copy framebuffer to canvas
                const data = new Uint32Array(canvasImageData.current.data.buffer);
                data.set(frameBuffer.current);
                canvasContext.current.putImageData(canvasImageData.current, 0, 0);

                lastTime = currentTime - (deltaTime % frameTime);
            }

            requestRef.current = requestAnimationFrame(loop);
        };

        cancelAnimationFrame(requestRef.current);
        requestRef.current = requestAnimationFrame(loop);
    };

    // Keyboard mapping
    useEffect(() => {
        const keys = {
            87: [1, jsnes.Controller.BUTTON_UP],    // W
            83: [1, jsnes.Controller.BUTTON_DOWN],  // S
            65: [1, jsnes.Controller.BUTTON_LEFT],  // A
            68: [1, jsnes.Controller.BUTTON_RIGHT], // D
            74: [1, jsnes.Controller.BUTTON_A],     // J
            75: [1, jsnes.Controller.BUTTON_B],     // K
            13: [1, jsnes.Controller.BUTTON_START], // Enter
            16: [1, jsnes.Controller.BUTTON_SELECT],// Shift
        };

        const handleKeyDown = (e) => {
            if (keys[e.keyCode] && nesRef.current) {
                nesRef.current.buttonDown(...keys[e.keyCode]);
            }
        };

        const handleKeyUp = (e) => {
            if (keys[e.keyCode] && nesRef.current) {
                nesRef.current.buttonUp(...keys[e.keyCode]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return (
        <div className="crt-container">
            <div className="crt-screen">
                <canvas
                    ref={canvasRef}
                    width={NES_WIDTH}
                    height={NES_HEIGHT}
                    style={{ width: '100%', height: 'auto', backgroundColor: '#000' }}
                />
                {!isRunning && (
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                        <p className="retro-font">INSERT CARTRIDGE</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Emulator;
