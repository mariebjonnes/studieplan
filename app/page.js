'use client';

import { useEffect, useState } from 'react';

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('studiepass');
    if (saved) setItems(JSON.parse(saved));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('studiepass', JSON.stringify(items));
  }, [items, ready]);

  function addItem(event) {
    event.preventDefault();
    const name = title.trim();
    if (!name) return;
    setItems((current) => [
      ...current,
      { id: crypto.randomUUID(), name, done: false },
    ]);
    setTitle('');
  }

  function toggleItem(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  return (
    <section>
      <h1>Veckoplan</h1>
      <form onSubmit={addItem}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Till exempel: React, kapitel 2"
          aria-label="Nytt studiepass"
        />
        <button type="submit">Lägg till</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleItem(item.id)}
              />
              <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
                {item.name}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}