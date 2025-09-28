export type TypeSpeedCurvature = 'linear' | 'bezier' | 'exponential' | 'sine';

export interface TypedTextOptions {
  strings: string[];
  typeSpeed?: number;
  loop?: boolean;
  typeSpeedCurvature?: TypeSpeedCurvature;
  showCursor?: boolean;
  cursorChar?: string;
  backSpeed?: number;
  backDelay?: number;
  startDelay?: number;
  onComplete?: () => void;
  onStringComplete?: (stringIndex: number) => void;
  onStringStart?: (stringIndex: number) => void;
}

export class TypedText {
  private element: HTMLElement;
  private options: Required<Omit<TypedTextOptions, 'onComplete' | 'onStringComplete' | 'onStringStart'>> & {
    onComplete?: () => void;
    onStringComplete?: (stringIndex: number) => void;
    onStringStart?: (stringIndex: number) => void;
  };
  private displayText = '';
  private currentStringIndex = 0;
  private currentCharIndex = 0;
  private isTyping = true;
  private showCursor = true;
  private timeoutId: number | null = null;
  private cursorIntervalId: number | null = null;
  private textElement!: HTMLSpanElement;
  private cursorElement!: HTMLSpanElement;
  private isDestroyed = false;

  constructor(element: HTMLElement | string, options: TypedTextOptions) {
    if (typeof element === 'string') {
      const el = document.querySelector(element);
      if (!el) throw new Error(`Element with selector "${element}" not found`);
      this.element = el as HTMLElement;
    } else {
      this.element = element;
    }

    this.options = {
      strings: options.strings,
      typeSpeed: options.typeSpeed ?? 50,
      loop: options.loop ?? false,
      typeSpeedCurvature: options.typeSpeedCurvature ?? 'sine',
      showCursor: options.showCursor ?? true,
      cursorChar: options.cursorChar ?? '|',
      backSpeed: options.backSpeed ?? 25,
      backDelay: options.backDelay ?? 1000,
      startDelay: options.startDelay ?? 0,
      onComplete: options.onComplete,
      onStringComplete: options.onStringComplete,
      onStringStart: options.onStringStart
    };

    this.init();
  }

  private init(): void {
    if (this.isDestroyed) return;

    this.element.innerHTML = '';
    this.element.style.display = 'inline-block';

    this.textElement = document.createElement('span');
    this.textElement.className = 'typed-text-content';
    
    this.cursorElement = document.createElement('span');
    this.cursorElement.className = 'typed-text-cursor';
    this.cursorElement.textContent = this.options.cursorChar;
    this.cursorElement.style.transition = 'opacity 0.1s ease-in-out';

    this.element.appendChild(this.textElement);
    if (this.options.showCursor) {
      this.element.appendChild(this.cursorElement);
    }

    this.addStyles();

    this.startCursorBlink();
    if (this.options.strings.length > 0) {
      if (this.options.startDelay > 0) {
        setTimeout(() => this.typeText(), this.options.startDelay);
      } else {
        this.typeText();
      }
    }
  }

  private addStyles(): void {
    const styleId = 'typed-text-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .typed-text-cursor {
          transition: opacity 0.1s ease-in-out;
        }
        .typed-text-cursor.hidden {
          opacity: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private getSpeedMultiplier(progress: number, curvature: TypeSpeedCurvature): number {
    switch (curvature) {
      case 'linear':
        return 1;
      
      case 'bezier':
        return progress < 0.5 
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      case 'exponential':
        return Math.pow(progress, 3);
      
      case 'sine':
        return (Math.sin(progress * Math.PI - Math.PI / 2) + 1) / 2;
      
      default:
        return 1;
    }
  }

  private getCurrentTypeSpeed(): number {
    if (this.options.typeSpeedCurvature === 'linear') {
      return this.options.typeSpeed;
    }

    const currentString = this.options.strings[this.currentStringIndex];
    if (!currentString) return this.options.typeSpeed;

    const progress = this.currentCharIndex / currentString.length;
    const multiplier = this.getSpeedMultiplier(progress, this.options.typeSpeedCurvature);
    
    return this.options.typeSpeed * (3 - 2 * multiplier);
  }

  private startCursorBlink(): void {
    if (!this.options.showCursor || this.isDestroyed) return;
    
    this.cursorIntervalId = window.setInterval(() => {
      if (this.isDestroyed) return;
      this.showCursor = !this.showCursor;
      if (this.cursorElement) {
        this.cursorElement.classList.toggle('hidden', !this.showCursor);
      }
    }, 530);
  }

  private stopCursorBlink(): void {
    if (this.cursorIntervalId) {
      clearInterval(this.cursorIntervalId);
      this.cursorIntervalId = null;
    }
    this.showCursor = true;
    if (this.cursorElement) {
      this.cursorElement.classList.remove('hidden');
    }
  }

  private typeText(): void {
    if (this.options.strings.length === 0 || this.isDestroyed) return;

    const currentString = this.options.strings[this.currentStringIndex];

    if (this.isTyping) {
      if (this.currentCharIndex === 0) {
        this.options.onStringStart?.(this.currentStringIndex);
      }

      if (this.currentCharIndex < currentString.length) {
        this.displayText = currentString.substring(0, this.currentCharIndex + 1);
        this.textElement.textContent = this.displayText;
        this.currentCharIndex++;
        const currentSpeed = this.getCurrentTypeSpeed();
        this.timeoutId = window.setTimeout(() => this.typeText(), currentSpeed);
      } else {
        this.options.onStringComplete?.(this.currentStringIndex);
        this.isTyping = false;
        this.timeoutId = window.setTimeout(() => this.typeText(), this.options.backDelay);
      }
    } else {
      if (this.currentCharIndex > 0) {
        this.currentCharIndex--;
        this.displayText = currentString.substring(0, this.currentCharIndex);
        this.textElement.textContent = this.displayText;
        this.timeoutId = window.setTimeout(() => this.typeText(), this.options.backSpeed);
      } else {
        this.currentStringIndex++;
        
        if (this.currentStringIndex >= this.options.strings.length) {
          if (this.options.loop) {
            this.currentStringIndex = 0;
          } else {
            this.options.onComplete?.();
            return;
          }
        }
        
        this.isTyping = true;
        this.timeoutId = window.setTimeout(() => this.typeText(), 500);
      }
    }
  }

  public start(): void {
    if (this.isDestroyed) return;
    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isTyping = true;
    this.typeText();
  }

  public stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.stop();
    this.stopCursorBlink();
    if (this.element) {
      this.element.innerHTML = '';
    }
  }

  public updateOptions(newOptions: Partial<TypedTextOptions>): void {
    if (this.isDestroyed) return;
    this.options = { ...this.options, ...newOptions };
  }

  public reset(): void {
    if (this.isDestroyed) return;
    this.stop();
    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isTyping = true;
    this.displayText = '';
    if (this.textElement) {
      this.textElement.textContent = '';
    }
  }

  public getCurrentString(): string {
    return this.options.strings[this.currentStringIndex] || '';
  }

  public getCurrentStringIndex(): number {
    return this.currentStringIndex;
  }

  public isRunning(): boolean {
    return this.timeoutId !== null;
  }
}
