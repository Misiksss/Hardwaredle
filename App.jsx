could you seperate css and html and js files
import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

// --- DATABASE ---
const hardwareDB = [
  // GPUs
  { name: "RTX 4090", type: "GPU", brand: "NVIDIA", year: 2022, interface: "PCIe 4.0", tier: "Enthusiast" },
  { name: "RTX 3080", type: "GPU", brand: "NVIDIA", year: 2020, interface: "PCIe 4.0", tier: "Enthusiast" },
  { name: "RTX 3060", type: "GPU", brand: "NVIDIA", year: 2021, interface: "PCIe 4.0", tier: "Consumer" },
  { name: "GTX 1080 Ti", type: "GPU", brand: "NVIDIA", year: 2017, interface: "PCIe 3.0", tier: "Enthusiast" },
  { name: "RX 7900 XTX", type: "GPU", brand: "AMD", year: 2022, interface: "PCIe 4.0", tier: "Enthusiast" },
  { name: "RX 6700 XT", type: "GPU", brand: "AMD", year: 2021, interface: "PCIe 4.0", tier: "Consumer" },
  { name: "RX 580", type: "GPU", brand: "AMD", year: 2017, interface: "PCIe 3.0", tier: "Budget" },
  // CPUs
  { name: "Core i9-13900K", type: "CPU", brand: "Intel", year: 2022, interface: "LGA1700", tier: "Enthusiast" },
  { name: "Core i5-12400F", type: "CPU", brand: "Intel", year: 2022, interface: "LGA1700", tier: "Budget" },
  { name: "Core i7-9700K", type: "CPU", brand: "Intel", year: 2018, interface: "LGA1151", tier: "Consumer" },
  { name: "Ryzen 7 7800X3D", type: "CPU", brand: "AMD", year: 2023, interface: "AM5", tier: "Enthusiast" },
  { name: "Ryzen 5 5600X", type: "CPU", brand: "AMD", year: 2020, interface: "AM4", tier: "Consumer" },
  { name: "Ryzen 5 3600", type: "CPU", brand: "AMD", year: 2019, interface: "AM4", tier: "Budget" },
  // Motherboards
  { name: "ROG Maximus Z790 Hero", type: "Motherboard", brand: "ASUS", year: 2022, interface: "LGA1700", tier: "Enthusiast" },
  { name: "B550 TOMAHAWK", type: "Motherboard", brand: "MSI", year: 2020, interface: "AM4", tier: "Consumer" },
  { name: "X670E AORUS MASTER", type: "Motherboard", brand: "Gigabyte", year: 2022, interface: "AM5", tier: "Enthusiast" },
  // RAM
  { name: "Vengeance LPX 16GB", type: "RAM", brand: "Corsair", year: 2015, interface: "DDR4", tier: "Budget" },
  { name: "Trident Z5 RGB 32GB", type: "RAM", brand: "G.Skill", year: 2021, interface: "DDR5", tier: "Enthusiast" },
  { name: "Fury Beast 16GB", type: "RAM", brand: "Kingston", year: 2021, interface: "DDR4", tier: "Consumer" },
  // Storage
  { name: "990 PRO 2TB", type: "Storage", brand: "Samsung", year: 2022, interface: "M.2 NVMe", tier: "Enthusiast" },
  { name: "970 EVO Plus 1TB", type: "Storage", brand: "Samsung", year: 2019, interface: "M.2 NVMe", tier: "Consumer" },
  { name: "SN850X 2TB", type: "Storage", brand: "WD_BLACK", year: 2022, interface: "M.2 NVMe", tier: "Enthusiast" },
  { name: "Crucial MX500 1TB", type: "Storage", brand: "Crucial", year: 2017, interface: "SATA", tier: "Budget" },
  // Coolers
  { name: "NH-D15", type: "Cooler", brand: "Noctua", year: 2014, interface: "Universal", tier: "Enthusiast" },
  { name: "Kraken Elite 360", type: "Cooler", brand: "NZXT", year: 2023, interface: "Universal", tier: "Enthusiast" },
  { name: "Hyper 212 EVO", type: "Cooler", brand: "Cooler Master", year: 2011, interface: "Universal", tier: "Budget" },
  // Cases
  { name: "O11 Dynamic", type: "Case", brand: "Lian Li", year: 2018, interface: "ATX", tier: "Consumer" },
  { name: "Meshify C", type: "Case", brand: "Fractal Design", year: 2017, interface: "ATX", tier: "Consumer" },
  { name: "4000D Airflow", type: "Case", brand: "Corsair", year: 2020, interface: "ATX", tier: "Consumer" },
  // PSUs
  { name: "RM850x", type: "PSU", brand: "Corsair", year: 2021, interface: "ATX", tier: "Consumer" },
  { name: "Focus GX-750", type: "PSU", brand: "Seasonic", year: 2019, interface: "ATX", tier: "Consumer" },
  { name: "Dark Power Pro 12", type: "PSU", brand: "be quiet!", year: 2020, interface: "ATX", tier: "Enthusiast" }
];



export default function App() {
  const [target, setTarget] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Statistické stavy uložené v localStorage
  const [winCount, setWinCount] = useState(() => {
    return parseInt(localStorage.getItem('hardwaredle_wins') || '0', 10);
  });
  const [gamesPlayed, setGamesPlayed] = useState(() => {
    return parseInt(localStorage.getItem('hardwaredle_played') || '0', 10);
  });
  const [bestAttempt, setBestAttempt] = useState(() => {
    const saved = localStorage.getItem('hardwaredle_best');
    return saved ? parseInt(saved, 10) : null;
  });

  const dropdownRef = useRef(null);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomIndex = Math.floor(Math.random() * hardwareDB.length);
    setTarget(hardwareDB[randomIndex]);
    setGuesses([]);
    setInputValue('');
    setIsWinner(false);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim().length > 0) {
      const filtered = hardwareDB.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(value.toLowerCase());
        const notGuessed = !guesses.some(g => g.name === item.name);
        return matchesSearch && notGuessed;
      });
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions([]);
      setShowDropdown(false);
    }
  };

  const handleGuess = (item) => {
    const updatedGuesses = [item, ...guesses];
    setGuesses(updatedGuesses);
    setInputValue('');
    setShowDropdown(false);
    setFilteredOptions([]);

    if (item.name === target.name) {
      const attemptsCount = updatedGuesses.length;

      // Aktualizace výher a statistik
      setWinCount(prev => {
        const nextWins = prev + 1;
        localStorage.setItem('hardwaredle_wins', nextWins.toString());
        return nextWins;
      });
      setGamesPlayed(prev => {
        const nextPlayed = prev + 1;
        localStorage.setItem('hardwaredle_played', nextPlayed.toString());
        return nextPlayed;
      });
      setBestAttempt(prev => {
        if (!prev || attemptsCount < prev) {
          localStorage.setItem('hardwaredle_best', attemptsCount.toString());
          return attemptsCount;
        }
        return prev;
      });

      setTimeout(() => {
        setIsWinner(true);
      }, 1500); // Počkej na animaci dlaždic
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const getTileStatus = (attr, guessValue, targetValue) => {
    return guessValue === targetValue ? 'match' : 'mismatch';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col items-center py-10 px-4">
      
      {/* Header */}
      <header className="mb-6 text-center flex flex-col items-center">
        <div className="relative group">
          {/* Zářící efekt pozadí (bílý glow) */}
          <div className="absolute -inset-1 bg-white rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          {/* Kontejner ve tvaru čipu */}
          <div className="relative flex items-center justify-center gap-2 md:gap-4 px-6 py-4 bg-gray-900 border-2 border-white/30 rounded-xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
            
            {/* Levé "spoje" (dekorace) */}
            <div className="hidden md:flex flex-col gap-1.5 mr-2 opacity-80 items-end">
               <div className="w-4 h-[2px] bg-white rounded-full"></div>
               <div className="w-8 h-[2px] bg-white rounded-full"></div>
               <div className="w-5 h-[2px] bg-white rounded-full"></div>
            </div>

            {/* Ikona Procesoru */}
            <svg className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>

            {/* Samotný text nadpisu */}
            <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-white uppercase drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
              HARDWAREDLE
            </h1>
            
            {/* Pravé "spoje" (dekorace) */}
            <div className="hidden md:flex flex-col gap-1.5 ml-2 opacity-80">
               <div className="w-5 h-[2px] bg-white rounded-full"></div>
               <div className="w-8 h-[2px] bg-white rounded-full"></div>
               <div className="w-4 h-[2px] bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Podnadpis s blikající bílou LED kontrolkou */}
        <p className="mt-4 font-mono text-white text-sm md:text-base tracking-[0.2em] flex items-center gap-3 uppercase">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          Uhádni PC komponentu
        </p>
      </header>

      {/* Počítadlo výher a statistik (Win Counter Bar) */}
      <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 mb-8 text-xs md:text-sm font-mono bg-gray-900/90 border border-gray-800 px-6 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-yellow-400">🏆</span>
          <span className="text-gray-400">Výhry:</span>
          <span className="font-bold text-white text-base">{winCount}</span>
        </div>
        <div className="w-px h-4 bg-gray-800 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-blue-400">🎮</span>
          <span className="text-gray-400">Odehráno:</span>
          <span className="font-bold text-white text-base">{gamesPlayed}</span>
        </div>
        <div className="w-px h-4 bg-gray-800 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-400">⚡</span>
          <span className="text-gray-400">Nejlepší:</span>
          <span className="font-bold text-white text-base">{bestAttempt ? `${bestAttempt}. pokus` : '-'}</span>
        </div>
        <div className="w-px h-4 bg-gray-800 hidden sm:block"></div>
        <div className="flex items-center gap-2">
          <span className="text-purple-400">🎯</span>
          <span className="text-gray-400">Aktuální pokusy:</span>
          <span className="font-bold text-white text-base">{guesses.length}</span>
        </div>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-md relative mb-8 z-50" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={isWinner}
            placeholder={isWinner ? "Konec hry!" : "Napiš název komponenty..."}
            className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-inner text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            autoComplete="off"
          />
          {/* Magnifying Glass Icon */}
          <div className="absolute right-3 top-3 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showDropdown && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <li
                key={option.name}
                onClick={() => handleGuess(option)}
                className={`px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700/50 last:border-0 ${index === 0 ? 'rounded-t-lg' : ''} ${index === filteredOptions.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <span className="font-semibold">{option.name}</span>
                <span className="text-xs text-gray-400 ml-2">({option.brand} {option.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Grid Container - Scrollable horizontally on small screens */}
      <div className="w-full max-w-5xl overflow-x-auto pb-4">
        <div className="min-w-[800px] flex flex-col gap-2">
          
          {/* Grid Header */}
          {guesses.length > 0 && (
            <div className="grid grid-cols-6 gap-2 text-center font-bold text-gray-400 text-sm uppercase tracking-wider mb-2 border-b border-gray-700 pb-2">
              <div>Komponenta</div>
              <div>Typ</div>
              <div>Značka</div>
              <div>Rok</div>
              <div>Rozhraní</div>
              <div>Třída</div>
            </div>
          )}

          {/* Guesses Rows */}
          {guesses.map((guess, rowIndex) => (
            <div key={`${guess.name}-${rowIndex}`} className="grid grid-cols-6 gap-2 perspective-container">
              
              {/* Tile rendering logic encapsulated in a small inline function for clean reading */}
              {[
                { label: 'name', value: guess.name, targetVal: target.name },
                { label: 'type', value: guess.type, targetVal: target.type },
                { label: 'brand', value: guess.brand, targetVal: target.brand },
                { label: 'year', value: guess.year, targetVal: target.year },
                { label: 'interface', value: guess.interface, targetVal: target.interface },
                { label: 'tier', value: guess.tier, targetVal: target.tier },
              ].map((attr, colIndex) => {
                
                const isMatch = attr.value === attr.targetVal;
                let bgColor = isMatch ? 'bg-emerald-600' : 'bg-red-600';
                let content = attr.value;
                let icon = null;

                // Special Year Logic
                if (attr.label === 'year' && !isMatch) {
                  if (guess.year < target.year) {
                    icon = <span className="text-xl ml-1">⬆️</span>;
                  } else {
                    icon = <span className="text-xl ml-1">⬇️</span>;
                  }
                }

                return (
                  <div 
                    key={colIndex}
                    className={`
                      tile-animate flex items-center justify-center p-3 rounded shadow-md
                      text-sm md:text-base font-semibold text-center border border-white/10
                      ${bgColor}
                    `}
                    style={{ animationDelay: `${colIndex * 0.15}s` }}
                  >
                    <div className="flex flex-col items-center justify-center break-words w-full h-full">
                       <span className="drop-shadow-md flex items-center gap-1">
                         {content}
                         {icon}
                       </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {guesses.length === 0 && (
             <div className="text-center text-gray-500 mt-10">
               Vyhledej a vyber komponentu pro začátek hry!
             </div>
          )}

        </div>
      </div>

      {/* Win Modal overlay */}
      {isWinner && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm w-full relative overflow-hidden">
            
            {/* Confetti-like decoration background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500"></div>

            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-1">Skvělé! Uhodl jsi!</h2>
            <p className="text-emerald-400 font-semibold text-xl mb-6">{target.name}</p>
            
            {/* Statistický přehled výhry */}
            <div className="w-full bg-gray-800/80 rounded-xl p-4 mb-6 border border-gray-700/50 flex flex-col gap-2.5 text-sm font-mono">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Potřebné pokusy:</span>
                <span className="font-bold text-emerald-400 text-base">{guesses.length}. pokus</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700/50 pt-2.5">
                <span className="text-gray-400">Celkem výher:</span>
                <span className="font-bold text-white text-base">{winCount}</span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700/50 pt-2.5">
                <span className="text-gray-400">Nejlepší výkon:</span>
                <span className="font-bold text-yellow-400 text-base">{bestAttempt}. pokus</span>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
            >
              Hrát znovu
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
