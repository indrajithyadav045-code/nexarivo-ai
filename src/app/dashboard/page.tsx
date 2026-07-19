const cards=['Recent chats','Pinned chats','Folders','Projects','Workspace usage','Model routing'];
export default function Dashboard(){return <div className="grid-auto">{cards.map(c=><section className="card" key={c}><h2>{c}</h2><p className="muted">Production workspace module ready for authenticated user data from Supabase PostgreSQL.</p></section>)}</div>}
