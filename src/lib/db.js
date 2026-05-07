import { createClient } from '@libsql/client'

const client = createClient({
  url: 'file:data.db',
})

await client.execute(`
  CREATE TABLE IF NOT EXISTS pinned (
    id INTEGER PRIMARY KEY,
    repo_name TEXT NOT NULL,
    order_index INTEGER DEFAULT 0
  )
`)

await client.execute(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

await client.execute(`
  CREATE TABLE IF NOT EXISTS views (
    repo_name TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
  )
  `)

export default client
