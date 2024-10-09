import React, { useEffect, useRef } from 'react';
import { Game } from './Game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const game = new Game(canvasRef.current);
      game.start();
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={320}
        height={480}
        className="border-4 border-white"
      />
    </div>
  );
}

export default App;