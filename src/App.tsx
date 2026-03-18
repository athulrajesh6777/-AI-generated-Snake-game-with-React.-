import { Play, Pause, SkipBack, SkipForward, Volume2, Trophy, Gamepad2, Music, Terminal, AlertTriangle, Activity } from 'lucide-react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useMusicPlayer } from './hooks/useMusicPlayer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { 
    snake, 
    food, 
    gameOver, 
    score, 
    isPaused, 
    resetGame, 
    setIsPaused, 
    GRID_SIZE 
  } = useSnakeGame();

  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
  } = useMusicPlayer();

  return (
    <div className="min-h-screen bg-glitch-bg flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 crt-flicker bg-cyan/5" />
      
      <header className="mb-12 text-center z-10 animate-tear">
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-6xl text-glitch mb-4"
        >
          CORE_SNAKE.EXE
        </motion.h1>
        <div className="flex items-center justify-center gap-4 text-magenta font-pixel text-[10px] tracking-widest">
          <span className="animate-pulse">INITIALIZING...</span>
          <span className="h-px w-12 bg-magenta/30" />
          <span>SYSTEM_READY</span>
        </div>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* Left Panel: Data Stream */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="glitch-border bg-black p-4">
            <div className="flex items-center justify-between mb-4 border-b border-cyan/30 pb-2">
              <div className="flex items-center gap-2 text-cyan">
                <Music size={16} />
                <span className="text-xs font-pixel uppercase">AUDIO_SRC</span>
              </div>
              <Activity size={14} className="text-magenta animate-pulse" />
            </div>
            
            <div className="relative aspect-square mb-4 border border-magenta/50 overflow-hidden grayscale contrast-150">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className={`w-full h-full object-cover opacity-70 ${isPlaying ? 'animate-pulse' : ''}`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-cyan/10 mix-blend-overlay" />
            </div>

            <div className="space-y-1 mb-4">
              <h2 className="text-lg text-glitch truncate">{currentTrack.title}</h2>
              <p className="text-magenta text-xs font-pixel opacity-80">{currentTrack.artist}</p>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 size={14} className="text-cyan" />
              <div className="flex-1 h-4 border border-cyan/30 p-0.5 relative">
                <div 
                  className="h-full bg-cyan shadow-[0_0_10px_#00ffff]" 
                  style={{ width: `${volume * 100}%` }}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="glitch-border bg-black p-4">
            <div className="flex items-center gap-2 mb-4 text-magenta">
              <Trophy size={16} />
              <span className="text-xs font-pixel uppercase">METRICS</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-cyan text-[10px] font-pixel mb-1">SCORE_VAL</p>
                <p className="text-4xl text-magenta font-pixel">{score.toString().padStart(4, '0')}</p>
              </div>
              <div className="border-t border-magenta/20 pt-2">
                <p className="text-cyan text-[10px] font-pixel mb-1">MAX_RECORD</p>
                <p className="text-xl text-gray-500 font-pixel">1240</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Center Panel: Execution Grid */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:col-span-6 flex flex-col items-center"
        >
          <div className="relative glitch-border bg-black p-1 shadow-[8px_8px_0px_#00ffff]">
            <div 
              className="grid bg-black"
              style={{ 
                gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                width: 'min(85vw, 500px)',
                height: 'min(85vw, 500px)'
              }}
            >
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
                const x = i % GRID_SIZE;
                const y = Math.floor(i / GRID_SIZE);
                const isSnake = snake.some(s => s.x === x && s.y === y);
                const isHead = snake[0].x === x && snake[0].y === y;
                const isFood = food.x === x && food.y === y;

                return (
                  <div 
                    key={i}
                    className={`border-[0.5px] border-white/5 ${
                      isHead ? 'bg-cyan shadow-[0_0_15px_#00ffff] z-10' :
                      isSnake ? 'bg-cyan/40' :
                      isFood ? 'bg-magenta shadow-[0_0_15px_#ff00ff] animate-pulse' :
                      'bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            <AnimatePresence>
              {(gameOver || isPaused) && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20"
                >
                  {gameOver ? (
                    <div className="text-center p-8 border-4 border-magenta animate-tear">
                      <h2 className="text-4xl text-glitch-magenta mb-4">FATAL_ERROR</h2>
                      <p className="text-cyan font-pixel text-xs mb-8">MEMORY_CORRUPTION_DETECTED</p>
                      <button 
                        onClick={resetGame}
                        className="px-10 py-4 bg-magenta text-white font-pixel text-sm hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-transform shadow-[4px_4px_0px_#00ffff]"
                      >
                        REBOOT_SYSTEM
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-8 border-4 border-cyan">
                      <h2 className="text-4xl text-glitch mb-8">HALTED</h2>
                      <button 
                        onClick={() => setIsPaused(false)}
                        className="px-10 py-4 bg-cyan text-black font-pixel text-sm hover:translate-x-1 hover:translate-y-1 active:translate-x-0 active:translate-y-0 transition-transform shadow-[4px_4px_0px_#ff00ff]"
                      >
                        RESUME_EXEC
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8 w-full max-w-[500px]">
            <div className="flex flex-col gap-2">
              <span className="text-cyan text-[10px] font-pixel">INPUT_MAP</span>
              <div className="flex gap-2">
                <kbd className="bg-magenta/20 border border-magenta/40 px-2 py-1 text-magenta text-[10px] font-pixel">ARROWS</kbd>
                <kbd className="bg-magenta/20 border border-magenta/40 px-2 py-1 text-magenta text-[10px] font-pixel">SPACE</kbd>
              </div>
            </div>
            <div className="text-right flex flex-col gap-2">
              <span className="text-cyan text-[10px] font-pixel">STATUS</span>
              <span className="text-magenta text-[10px] font-pixel animate-pulse">RUNNING_V1.0.4</span>
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Command Center */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-3 space-y-6"
        >
          <div className="glitch-border bg-black p-4">
            <div className="flex items-center gap-2 mb-6 text-cyan border-b border-cyan/30 pb-2">
              <Terminal size={16} />
              <span className="text-xs font-pixel uppercase">CMD_CENTER</span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <button 
                onClick={prevTrack}
                className="flex items-center justify-center aspect-square border border-cyan/30 text-cyan hover:bg-cyan/10 transition-colors"
              >
                <SkipBack size={18} />
              </button>
              <button 
                onClick={togglePlay}
                className="flex items-center justify-center aspect-square bg-cyan text-black hover:scale-95 transition-transform"
              >
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="flex items-center justify-center aspect-square border border-cyan/30 text-cyan hover:bg-cyan/10 transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-magenta font-pixel mb-3">DATA_INDEX</p>
              {[
                { id: '1', title: 'Neon Dreams' },
                { id: '2', title: 'Cyber Pulse' },
                { id: '3', title: 'Digital Horizon' }
              ].map((track, idx) => (
                <div 
                  key={track.id}
                  onClick={() => {/* Track selection logic if needed */}}
                  className={`p-2 border transition-colors cursor-pointer flex items-center justify-between text-[10px] font-pixel ${
                    currentTrack.id === track.id ? 'border-cyan bg-cyan/10 text-cyan' : 'border-white/10 text-gray-600 hover:border-white/30'
                  }`}
                >
                  <span>{idx.toString().padStart(2, '0')} // {track.title}</span>
                  {currentTrack.id === track.id && isPlaying && (
                    <div className="w-2 h-2 bg-cyan animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="glitch-border bg-black p-4 border-magenta shadow-[4px_4px_0px_#00ffff]">
            <div className="flex items-center gap-2 text-magenta mb-2">
              <AlertTriangle size={14} />
              <span className="text-[10px] font-pixel">WARNING</span>
            </div>
            <p className="text-[9px] text-gray-500 leading-relaxed font-pixel">
              UNAUTHORIZED ACCESS DETECTED. SYSTEM INTEGRITY AT 84%. DO NOT DISCONNECT.
            </p>
          </div>
        </motion.div>

      </main>

      <footer className="mt-12 text-gray-700 text-[10px] font-pixel tracking-widest flex items-center gap-4">
        <span>&copy; 2026_VOID_SYSTEMS</span>
        <span className="h-px w-8 bg-gray-800" />
        <span className="text-magenta">ENCRYPTED_CONNECTION</span>
      </footer>
    </div>
  );
}
