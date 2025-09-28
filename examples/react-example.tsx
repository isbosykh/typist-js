import React, { useEffect, useRef, useState } from 'react';
import { TypedText, TypedTextOptions } from 'better-type';

interface TypedComponentProps {
  strings: string[];
  typeSpeed?: number;
  typeSpeedCurvature?: 'linear' | 'bezier' | 'exponential' | 'sine';
  loop?: boolean;
  showCursor?: boolean;
  onComplete?: () => void;
  onStringComplete?: (index: number) => void;
  className?: string;
}

const TypedComponent: React.FC<TypedComponentProps> = ({
  strings,
  typeSpeed = 50,
  typeSpeedCurvature = 'linear',
  loop = false,
  showCursor = true,
  onComplete,
  onStringComplete,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<TypedText | null>(null);

  useEffect(() => {
    if (elementRef.current && strings.length > 0) {
      // Уничтожаем предыдущий экземпляр
      if (typedRef.current) {
        typedRef.current.destroy();
      }

      // Создаем новый экземпляр
      typedRef.current = new TypedText(elementRef.current, {
        strings,
        typeSpeed,
        typeSpeedCurvature,
        loop,
        showCursor,
        onComplete,
        onStringComplete
      });
    }

    // Cleanup функция
    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
        typedRef.current = null;
      }
    };
  }, [strings, typeSpeed, typeSpeedCurvature, loop, showCursor]);

  return <div ref={elementRef} className={className} />;
};

// Пример использования компонента
const App: React.FC = () => {
  const [curve, setCurve] = useState<'linear' | 'bezier' | 'exponential' | 'sine'>('bezier');
  const [speed, setSpeed] = useState(100);

  const demoStrings = [
    'Привет из React!',
    'Better Type работает отлично!',
    'Framework-agnostic решение'
  ];

  const handleStringComplete = (index: number) => {
    console.log(`Завершена строка ${index}: "${demoStrings[index]}"`);
  };

  const handleComplete = () => {
    console.log('Анимация завершена!');
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #1e293b, #334155)',
      color: 'white',
      minHeight: '100vh'
    }}>
      <h1>Better Type + React Example</h1>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          fontSize: '24px', 
          minHeight: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <TypedComponent
            strings={demoStrings}
            typeSpeed={speed}
            typeSpeedCurvature={curve}
            loop={true}
            onStringComplete={handleStringComplete}
            onComplete={handleComplete}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Кривая скорости:
            </label>
            <select 
              value={curve} 
              onChange={(e) => setCurve(e.target.value as any)}
              style={{ 
                padding: '8px', 
                borderRadius: '5px', 
                border: 'none', 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white',
                width: '100%'
              }}
            >
              <option value="linear">Linear</option>
              <option value="bezier">Bezier</option>
              <option value="exponential">Exponential</option>
              <option value="sine">Sine</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Скорость: {speed}ms
            </label>
            <input
              type="range"
              min="50"
              max="300"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '20px', 
        borderRadius: '10px' 
      }}>
        <h2>Сравнение кривых</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px' }}>
            <h3>Linear</h3>
            <TypedComponent
              strings={['Постоянная скорость']}
              typeSpeed={80}
              typeSpeedCurvature="linear"
              loop={true}
            />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px' }}>
            <h3>Bezier</h3>
            <TypedComponent
              strings={['Плавное ускорение']}
              typeSpeed={80}
              typeSpeedCurvature="bezier"
              loop={true}
            />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px' }}>
            <h3>Exponential</h3>
            <TypedComponent
              strings={['Драматическое ускорение']}
              typeSpeed={80}
              typeSpeedCurvature="exponential"
              loop={true}
            />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px' }}>
            <h3>Sine</h3>
            <TypedComponent
              strings={['Волнообразный ритм']}
              typeSpeed={80}
              typeSpeedCurvature="sine"
              loop={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
