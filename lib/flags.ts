import type { Match, MatchStatus } from './types'

export function getTeamFlag(teamName: string): string {
  const name = teamName.trim().toLowerCase()

  const mapping: Record<string, string> = {
    // A
    'algeria': '🇩🇿',
    'argentina': '🇦🇷',
    'australia': '🇦🇺',
    'austria': '🇦🇹',
    // B
    'belgium': '🇧🇪',
    'brazil': '🇧🇷',
    // C
    'cameroon': '🇨🇲',
    'canada': '🇨🇦',
    'chile': '🇨🇱',
    'colombia': '🇨🇴',
    'costa rica': '🇨🇷',
    'croatia': '🇭🇷',
    // D
    'denmark': '🇩🇰',
    // E
    'ecuador': '🇪🇨',
    'egypt': '🇪🇬',
    'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    // F
    'france': '🇫🇷',
    // G
    'germany': '🇩🇪',
    'ghana': '🇬🇭',
    'greece': '🇬🇷',
    // H
    'hungary': '🇭🇺',
    // I
    'iran': '🇮🇷',
    'iraq': '🇮🇶',
    'italy': '🇮🇹',
    'ivory coast': '🇨🇮',
    // J
    'japan': '🇯🇵',
    // M
    'mexico': '🇲🇽',
    'morocco': '🇲🇦',
    // N
    'netherlands': '🇳🇱',
    'new zealand': '🇳🇿',
    'nigeria': '🇳🇬',
    // P
    'paraguay': '🇵🇾',
    'peru': '🇵🇪',
    'poland': '🇵🇱',
    'portugal': '🇵🇹',
    // Q
    'qatar': '🇶🇦',
    // R
    'romania': '🇷🇴',
    'russia': '🇷🇺',
    // S
    'saudi arabia': '🇸🇦',
    'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'senegal': '🇸🇳',
    'serbia': '🇷🇸',
    'south africa': '🇿🇦',
    'south korea': '🇰🇷',
    'spain': '🇪🇸',
    'sweden': '🇸🇪',
    'switzerland': '🇨🇭',
    // T
    'tunisia': '🇹🇳',
    'turkey': '🇹🇷',
    // U
    'ukraine': '🇺🇦',
    'united states': '🇺🇸',
    'usa': '🇺🇸',
    'uruguay': '🇺🇾',
    // W
    'wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  }

  return mapping[name] || '⚽'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbMatchToMatch(dbMatch: any): Match {
  // Extract date component from 'time'
  let matchDate = 'TBD'
  if (dbMatch.time) {
    const parts = dbMatch.time.split(/[T ]/)
    if (parts[0]) {
      matchDate = parts[0]
    }
  } else if (dbMatch.date) {
    matchDate = dbMatch.date
  }

  // Normalize status values to MatchStatus
  let status: MatchStatus = 'upcoming'
  const rawStatus = String(dbMatch.status || '').toLowerCase()
  if (rawStatus === 'live' || rawStatus === 'in_progress' || rawStatus === 'playing') {
    status = 'live'
  } else if (rawStatus === 'finished' || rawStatus === 'ft' || rawStatus === 'completed') {
    status = 'finished'
  }

  return {
    id: String(dbMatch.id),
    team_home: dbMatch.home_team || 'TBD',
    team_away: dbMatch.away_team || 'TBD',
    flag_home: getTeamFlag(dbMatch.home_team || ''),
    flag_away: getTeamFlag(dbMatch.away_team || ''),
    match_date: matchDate,
    time: dbMatch.time || null,
    stadium: dbMatch.stadium || null,
    status,
    stage: dbMatch.stage || null,
    group: dbMatch.group_name || undefined,
    winner: dbMatch.winner || dbMatch.result || null,
    score_line: dbMatch.score_line || null,
  }
}
