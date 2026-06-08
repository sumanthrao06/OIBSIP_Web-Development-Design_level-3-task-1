import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Topping coordinate presets on a 300x300 canvas centered at (150, 150)
const TOPPING_COORDINATES = {
  // Veg
  Onion: [
    { x: 100, y: 110, r: 12 }, { x: 180, y: 90, r: 15 }, { x: 130, y: 190, r: 10 },
    { x: 210, y: 160, r: 14 }, { x: 90, y: 170, r: 11 }, { x: 150, y: 70, r: 13 },
    { x: 160, y: 130, r: 12 }, { x: 110, y: 150, r: 10 }
  ],
  Tomato: [
    { x: 120, y: 90 }, { x: 190, y: 120 }, { x: 90, y: 150 }, { x: 170, y: 180 },
    { x: 140, y: 100 }, { x: 210, y: 150 }, { x: 100, y: 190 }, { x: 150, y: 220 }
  ],
  Mushroom: [
    { x: 140, y: 80 }, { x: 220, y: 110 }, { x: 80, y: 130 }, { x: 160, y: 160 },
    { x: 110, y: 200 }, { x: 180, y: 210 }, { x: 100, y: 90 }, { x: 150, y: 120 }
  ],
  Corn: [
    { x: 110, y: 100 }, { x: 130, y: 85 }, { x: 170, y: 75 }, { x: 190, y: 100 },
    { x: 220, y: 130 }, { x: 200, y: 160 }, { x: 180, y: 190 }, { x: 140, y: 210 },
    { x: 110, y: 210 }, { x: 85, y: 170 }, { x: 75, y: 130 }, { x: 95, y: 110 },
    { x: 150, y: 110 }, { x: 120, y: 140 }, { x: 170, y: 130 }, { x: 145, y: 175 }
  ],
  Capsicum: [
    { x: 95, y: 120, rot: 15 }, { x: 175, y: 80, rot: 45 }, { x: 135, y: 160, rot: 115 },
    { x: 205, y: 135, rot: 60 }, { x: 115, y: 185, rot: 90 }, { x: 170, y: 205, rot: 5 },
    { x: 150, y: 95, rot: 30 }, { x: 120, y: 130, rot: 80 }
  ],
  Paneer: [
    { x: 130, y: 90 }, { x: 180, y: 110 }, { x: 90, y: 140 }, { x: 160, y: 190 },
    { x: 200, y: 170 }, { x: 110, y: 170 }, { x: 150, y: 65 }, { x: 140, y: 140 }
  ],
  Olive: [
    { x: 105, y: 105 }, { x: 165, y: 85 }, { x: 205, y: 115 }, { x: 85, y: 155 },
    { x: 125, y: 175 }, { x: 195, y: 185 }, { x: 155, y: 205 }, { x: 115, y: 135 },
    { x: 145, y: 145 }, { x: 175, y: 155 }
  ],
  Jalapeno: [
    { x: 125, y: 75 }, { x: 215, y: 125 }, { x: 75, y: 125 }, { x: 185, y: 175 },
    { x: 105, y: 205 }, { x: 155, y: 225 }, { x: 135, y: 115 }, { x: 165, y: 105 }
  ],
  
  // Non-Veg
  Chicken: [
    { x: 115, y: 115 }, { x: 185, y: 95 }, { x: 145, y: 185 }, { x: 215, y: 145 },
    { x: 95, y: 165 }, { x: 155, y: 75 }, { x: 135, y: 145 }, { x: 175, y: 165 }
  ],
  Pepperoni: [
    { x: 130, y: 70 }, { x: 210, y: 100 }, { x: 80, y: 120 }, { x: 190, y: 150 },
    { x: 100, y: 170 }, { x: 160, y: 200 }, { x: 140, y: 130 }, { x: 170, y: 110 }
  ],
  Sausage: [
    { x: 105, y: 85 }, { x: 185, y: 125 }, { x: 135, y: 95 }, { x: 115, y: 155 },
    { x: 205, y: 165 }, { x: 155, y: 185 }, { x: 95, y: 115 }, { x: 165, y: 145 }
  ],
  Bacon: [
    { x: 140, y: 85, r: 10 }, { x: 200, y: 115, r: 70 }, { x: 95, y: 135, r: -40 },
    { x: 165, y: 175, r: 25 }, { x: 115, y: 195, r: 85 }, { x: 185, y: 205, r: 15 }
  ],
  Ham: [
    { x: 120, y: 105 }, { x: 190, y: 85 }, { x: 155, y: 125 }, { x: 215, y: 135 },
    { x: 95, y: 145 }, { x: 135, y: 195 }, { x: 185, y: 185 }, { x: 115, y: 175 }
  ]
};

// Sauce color mapping
const SAUCE_COLORS = {
  tomato: '#dc2626',      // Red
  bbq: '#78350f',         // Dark Brown
  'garlic-parmesan': '#fef08a', // Cream/light yellow
  pesto: '#15803d',       // Green
  arrabbiata: '#b91c1c'   // Dark red
};

// Cheese visual styles
const CHEESE_COLORS = {
  mozzarella: { base: '#fef08a', opacity: 0.85, dash: '0' },
  cheddar: { base: '#f59e0b', opacity: 0.85, dash: '0' },
  parmesan: { base: '#fef08a', opacity: 0.6, dash: '8,8' }, // Dotted grated style
  vegan: { base: '#fef9c3', opacity: 0.8, dash: '0' }
};

export default function LivePizzaPreview({
  size = 'medium',
  crust = 'hand-tossed',
  sauce = 'tomato',
  cheese = 'mozzarella',
  vegToppings = [],
  nonVegToppings = [],
  extras = []
}) {
  // Scaling calculations
  const sizeScales = {
    small: 0.8,
    medium: 0.95,
    large: 1.1
  };
  const scale = sizeScales[size] || 0.95;

  // Render individual topping SVG elements
  const renderTopping = (name) => {
    const coords = TOPPING_COORDINATES[name] || [];
    
    return coords.map((c, index) => {
      switch (name) {
        // Vegetable toppings
        case 'Onion':
          return (
            <path
              key={`${name}-${index}`}
              d={`M ${c.x - c.r} ${c.y} A ${c.r} ${c.r - 2} 0 0 1 ${c.x + c.r} ${c.y}`}
              stroke="#be123c"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          );
        case 'Tomato':
          return (
            <path
              key={`${name}-${index}`}
              d={`M ${c.x - 8} ${c.y - 2} Q ${c.x} ${c.y - 8} ${c.x + 8} ${c.y - 2} Q ${c.x + 4} ${c.y + 6} ${c.x - 4} ${c.y + 6} Z`}
              fill="#ef4444"
              stroke="#b91c1c"
              strokeWidth="1"
            />
          );
        case 'Mushroom':
          return (
            <g key={`${name}-${index}`} transform={`translate(${c.x}, ${c.y})`}>
              <path d="M -8 0 A 8 8 0 0 1 8 0 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="-3" y="0" width="6" height="8" rx="1.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
            </g>
          );
        case 'Corn':
          return (
            <circle
              key={`${name}-${index}`}
              cx={c.x}
              cy={c.y}
              r="4"
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth="0.5"
            />
          );
        case 'Capsicum':
          return (
            <rect
              key={`${name}-${index}`}
              x={c.x - 4}
              y={c.y - 8}
              width="8"
              height="16"
              rx="2"
              fill="#22c55e"
              stroke="#15803d"
              strokeWidth="1"
              transform={`rotate(${c.rot}, ${c.x}, ${c.y})`}
            />
          );
        case 'Paneer':
          return (
            <rect
              key={`${name}-${index}`}
              x={c.x - 7}
              y={c.y - 7}
              width="14"
              height="14"
              rx="1"
              fill="#f8fafc"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />
          );
        case 'Olive':
          return (
            <g key={`${name}-${index}`}>
              <circle cx={c.x} cy={c.y} r="5" fill="#1e293b" />
              <circle cx={c.x} cy={c.y} r="2.5" fill="#dc2626" opacity="0.3" /> {/* Red center olive juice */}
              <circle cx={c.x} cy={c.y} r="2.2" fill="none" stroke="#f1f5f9" strokeWidth="0.8" opacity="0.3" />
            </g>
          );
        case 'Jalapeno':
          return (
            <g key={`${name}-${index}`} transform={`translate(${c.x}, ${c.y})`}>
              <circle cx="0" cy="0" r="7" fill="#166534" stroke="#14532d" strokeWidth="1" />
              <circle cx="0" cy="0" r="4.5" fill="#22c55e" />
              <circle cx="-2" cy="-2" r="1" fill="#fef08a" />
              <circle cx="2" cy="1" r="1" fill="#fef08a" />
              <circle cx="-1" cy="2" r="1" fill="#fef08a" />
            </g>
          );

        // Meat toppings
        case 'Chicken':
          return (
            <path
              key={`${name}-${index}`}
              d={`M ${c.x - 8} ${c.y - 3} C ${c.x - 4} ${c.y - 9}, ${c.x + 8} ${c.y - 9}, ${c.x + 8} ${c.y} C ${c.x + 4} ${c.y + 6}, ${c.x - 8} ${c.y + 7}, ${c.x - 8} ${c.y - 3} Z`}
              fill="#f5efe6"
              stroke="#d8c4b6"
              strokeWidth="1.5"
            />
          );
        case 'Pepperoni':
          return (
            <g key={`${name}-${index}`}>
              <circle cx={c.x} cy={c.y} r="13" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.5" />
              <circle cx={c.x - 4} cy={c.y - 3} r="1.5" fill="#7f1d1d" opacity="0.4" />
              <circle cx={c.x + 5} cy={c.y + 3} r="1.2" fill="#7f1d1d" opacity="0.4" />
              <circle cx={c.x - 1} cy={c.y + 5} r="1.5" fill="#7f1d1d" opacity="0.4" />
            </g>
          );
        case 'Sausage':
          return (
            <circle
              key={`${name}-${index}`}
              cx={c.x}
              cy={c.y}
              r="8"
              fill="#78350f"
              stroke="#451a03"
              strokeWidth="1.5"
            />
          );
        case 'Bacon':
          return (
            <path
              key={`${name}-${index}`}
              d={`M ${c.x - 15} ${c.y - 4} Q ${c.x - 5} ${c.y + 4} ${c.x + 5} ${c.y - 4} T ${c.x + 15} ${c.y + 4}`}
              stroke="#991b1b"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              transform={`rotate(${c.r}, ${c.x}, ${c.y})`}
            />
          );
        case 'Ham':
          return (
            <rect
              key={`${name}-${index}`}
              x={c.x - 6}
              y={c.y - 6}
              width="12"
              height="12"
              rx="1"
              fill="#fda4af"
              stroke="#f43f5e"
              strokeWidth="1.2"
              transform="rotate(45, 150, 150)"
            />
          );
        default:
          return null;
      }
    });
  };

  const selectedCheese = CHEESE_COLORS[cheese] || CHEESE_COLORS.mozzarella;
  const isCheeseBurst = crust === 'cheese-burst';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-slate-100 shadow-premium">
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center overflow-visible select-none">
        
        {/* Shadow base under the pizza */}
        <div className="absolute w-[80%] h-[15%] bottom-[5%] bg-slate-900/10 blur-xl rounded-full" />

        {/* Scaled Interactive Pizza SVG */}
        <motion.svg
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          viewBox="0 0 300 300"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          {/* CRUST (Base layer) */}
          <circle
            cx="150"
            cy="150"
            r="130"
            fill={crust === 'whole-wheat' ? '#b45309' : '#f59e0b'} // Golden / Brown crust
            stroke={crust === 'whole-wheat' ? '#78350f' : '#d97706'}
            strokeWidth="8"
          />

          {/* Stuffed Edge / Cheese Burst visual indicators */}
          {isCheeseBurst && (
            <circle
              cx="150"
              cy="150"
              r="127"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.5"
              strokeDasharray="5,5"
              opacity="0.8"
            />
          )}
          {crust === 'stuffed-crust' && (
            <circle
              cx="150"
              cy="150"
              r="126"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="4"
              opacity="0.4"
            />
          )}

          {/* SAUCE (Middle layer) */}
          <circle
            cx="150"
            cy="150"
            r="115"
            fill={SAUCE_COLORS[sauce] || SAUCE_COLORS.tomato}
            opacity="0.95"
          />

          {/* CHEESE (Melted cheese layer) */}
          <circle
            cx="150"
            cy="150"
            r="110"
            fill={selectedCheese.base}
            opacity={selectedCheese.opacity}
            strokeDasharray={selectedCheese.dash}
            className="animate-cheese"
          />

          {/* Extra cheese / Double cheese indicators */}
          {(extras.includes('Extra Cheese') || extras.includes('Double Cheese')) && (
            <circle
              cx="150"
              cy="150"
              r="105"
              fill={selectedCheese.base}
              opacity="0.4"
              className="animate-cheese"
            />
          )}

          {/* VEG TOPPINGS LAYER */}
          <AnimatePresence>
            {vegToppings.map(topping => (
              <motion.g
                key={`veg-${topping}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
              >
                {renderTopping(topping)}
              </motion.g>
            ))}
          </AnimatePresence>

          {/* NON-VEG TOPPINGS LAYER */}
          <AnimatePresence>
            {nonVegToppings.map(topping => (
              <motion.g
                key={`meat-${topping}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
              >
                {renderTopping(topping)}
              </motion.g>
            ))}
          </AnimatePresence>
        </motion.svg>
      </div>

      {/* Dynamic Visual Specifications Summary */}
      <div className="mt-6 w-full text-center">
        <h4 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Live Specifications</h4>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 capitalize">
            {size} Size
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 capitalize">
            {crust.replace('-', ' ')} Crust
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-600 capitalize">
            {sauce.replace('-', ' ')} Sauce
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-600 capitalize">
            {cheese} Cheese
          </span>
          {vegToppings.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600">
              {vegToppings.length} Veg
            </span>
          )}
          {nonVegToppings.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600">
              {nonVegToppings.length} Meats
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
