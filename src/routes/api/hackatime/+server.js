import { HACKATIME_API_KEY } from '$env/static/private'
import { json } from '@sveltejs/kit'

export async function GET() {
  const [todayRes, profileRes, heartbeatRes] = await Promise.all([
    fetch(
      `https://hackatime.hackclub.com/api/hackatime/v1/users/current/statusbar/today?api_key=${HACKATIME_API_KEY}`,
    ),
    fetch('https://hackatime.hackclub.com/@Xtimate', {
      headers: { Accept: 'text/html' },
    }),
    fetch('https://hackatime.hackclub.com/api/v1/my/heartbeats/most_recent', {
      headers: { Authorization: `Bearer ${HACKATIME_API_KEY}` },
    }),
  ])

  const today = await todayRes.json()
  const html = await profileRes.text()
  const heartbeat = await heartbeatRes.json()

  const allTimeMatch = html.match(
    /All Time<\/div>\s*<div[^>]*>([\dh\sm]+)<\/div>/,
  )
  const streakMatch = html.match(/Streak:\s*([\d]+)\s*days/)

  const entity = heartbeat.heartbeat?.entity ?? null
  const currentFile = entity?.split('/').pop() ?? null
  const project = heartbeat.heartbeat?.project ?? null
  const currentLanguage = heartbeat.heartbeat?.language ?? null

  const marker = project + '/'
  const idx = entity.lastIndexOf(marker)
  const currentRelativePath =
    idx !== -1 ? entity.slice(idx + marker.length) : null

  return json({
    today: today.data.grand_total.text,
    allTime: allTimeMatch?.[1] ?? 'N/A',
    streak: streakMatch?.[1] ?? 'N/A',
    currentFile: currentFile ?? null,
    currentProject: project ?? null,
    currentLanguage: currentLanguage ?? null,
    currentRelativePath: currentRelativePath ?? null,
  })
}
