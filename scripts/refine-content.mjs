import { readFile, writeFile } from 'node:fs/promises';
const edits=[
 ['src/sections/About.tsx', ['{data.person.name} / {data.person.location}', '{data.person.name} / {data.person.role} / {data.person.location}']],
 ['src/sections/Journey.tsx', ['<h3>{data.sectionCopy.education.title}</h3>', '<h3 className="preserve-lines">{data.sectionCopy.education.title}</h3><p className="academic-description">{data.sectionCopy.education.description}</p>'], ['<p>{entry.description}</p></div>)}</aside>', '<p>{entry.description}</p>{entry.highlights.map(item => <p key={item}>{item}</p>)}<div className="project-tags">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>)}</aside>']],
 ['src/sections/SelectedWork.tsx', ['<span>{project.category}</span>', '<span>{project.category}{project.featured ? " / SELECTED" : ""}</span>']],
 ['src/sections/CreativeArchive.tsx', ['{item.type}</span>', '{item.type}{item.featured ? " / SELECTED" : ""}</span>']],
 ['src/sections/MemoryPuzzle.tsx', ['<section className="puzzle-section">', '<section id="puzzle" className="puzzle-section">']],
 ['src/sections/Contact.tsx', ["setStatus('Your email app will open with your message. Send it there to complete your note.')", 'setStatus(data.contact.successMessage)'], ['<a href={`mailto:${data.person.email}`} className="contact-email">', '<p className="folio contact-email-label">{data.contact.emailLabel}</p><a href={`mailto:${data.person.email}`} className="contact-email">']],
];
for(const [file,...pairs] of edits){let source=await readFile(file,'utf8');for(const [before,after] of pairs){if(!source.includes(before))throw new Error(`Missing edit in ${file}: ${before}`);source=source.replace(before,after)}await writeFile(file,source)}
const file='src/data/portfolio.ts';let source=await readFile(file,'utf8');source=source.replace(/"submitLabel":\s*"[^"]*"/,'"submitLabel": "Compose email"').replace(/"successMessage":\s*"[^"]*"/,'"successMessage": "Your email app will open with your message. Send it there to complete your note."');await writeFile(file,source);
