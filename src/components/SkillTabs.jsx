import { useRef, useState } from 'react';
import { Braces, Database, Network } from 'lucide-react';
import { skillCategories } from '../data/portfolio';

export default function SkillTabs() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef([]);
  const category = skillCategories[selected];
  if (!category) return <p className="empty-state">Skills will appear here when added.</p>;
  function onKeyDown(event, index) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % skillCategories.length;
    else if (event.key === 'ArrowLeft')
      next = (index - 1 + skillCategories.length) % skillCategories.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = skillCategories.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    buttons.current[next]?.focus();
  }
  return (
    <div className="skills-panel">
      <div className="skill-tabs" role="tablist" aria-label="Technology categories">
        {skillCategories.map((item, index) => (
          <button
            key={item.id}
            ref={(node) => {
              buttons.current[index] = node;
            }}
            id={`tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={selected === index}
            aria-controls={`panel-${item.id}`}
            tabIndex={selected === index ? 0 : -1}
            onKeyDown={(event) => onKeyDown(event, index)}
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div
        id={`panel-${category.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${category.id}`}
        tabIndex={0}
        className="skill-panel"
      >
        <div className="skill-description">
          <Braces size={34} strokeWidth={1.2} aria-hidden="true" />
          <h3>{category.label}</h3>
          <p>Technologies I’m exploring and building with.</p>
        </div>
        <div className="skill-grid">
          {category.skills.map((skill) => (
            <div className="skill-item" key={skill.name}>
              {skill.icon === 'database' ? (
                <Database className="skill-icon-fallback" size={30} aria-hidden="true" />
              ) : skill.icon === 'network' ? (
                <Network className="skill-icon-fallback" size={30} aria-hidden="true" />
              ) : (
                <img className="skill-logo" src={`/tech/${skill.icon}.svg`} alt="" />
              )}
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
