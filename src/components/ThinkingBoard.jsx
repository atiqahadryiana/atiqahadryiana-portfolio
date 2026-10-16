import { Code2, HeartHandshake, Sparkles, MoveUpRight } from 'lucide-react';
import { pillars } from '../data/portfolio';

const icons = [Code2, Sparkles, HeartHandshake];
export default function ThinkingBoard() {
  return (
    <div className="thought-board" aria-hidden="true">
      <div className="board-paper paper-back" />
      <div className="board-paper paper-front" />
      <div className="board-caption">
        <span className="board-cross">+</span>From a little curiosity
      </div>
      <svg className="board-connections" viewBox="0 0 500 500" fill="none">
        <path d="M142 110h172a34 34 0 0 1 34 34v203" />
        <path d="M141 110v142a35 35 0 0 0 35 35h73" strokeDasharray="4 7" />
        <path d="M264 286h86v94" />
        <circle cx="142" cy="110" r="5" />
        <circle cx="348" cy="347" r="5" />
      </svg>
      {pillars.slice(0, 3).map((pillar, index) => {
        const Icon = icons[index];
        return (
          <div className={`thought-node node-${index}`} key={pillar.title}>
            <span className="node-glyph">
              <Icon size={index === 0 ? 40 : 23} strokeWidth={1.3} />
            </span>
            <span className="node-counter">0{index + 1}</span>
            <strong>{pillar.title}</strong>
            {index === 0 && (
              <span className="node-detail">
                ideas <span>→</span> thoughtful systems
              </span>
            )}
          </div>
        );
      })}
      <div className="board-finish">
        <span>To something that matters.</span>
        <MoveUpRight size={18} strokeWidth={1.4} />
      </div>
    </div>
  );
}
