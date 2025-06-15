const fetch = require('node-fetch');
const fs = require('fs');

async function fetchJordanMatches() {
  const url = 'https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/2917/schedule?region=us&lang=en&seasontype=2';

  try {
    const res = await fetch(url);
    const data = await res.json();

    const matches = data.events.map(e => {
      const comp = e.competitions[0];
      const home = comp.competitors.find(c => c.homeAway === 'home');
      const away = comp.competitors.find(c => c.homeAway === 'away');

      return {
        date: new Date(e.date).toISOString().split('T')[0],
        time: new Date(e.date).toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
        home: home.team.displayName,
        away: away.team.displayName,
        venue: comp.venue?.fullName || 'غير معروف',
        type: comp.competition?.name || 'ودية',
        status: e.status?.type?.name || 'SCHEDULED',
        score: comp.status?.type?.name === 'STATUS_FINAL' ? comp.competitors.map(c => c.score).join(' - ') : undefined
      };
    });

    fs.writeFileSync('matches.json', JSON.stringify(matches, null, 2), 'utf8');
    console.log('✅ تم تحديث matches.json');
  } catch (error) {
    console.error('❌ فشل التحديث:', error);
  }
}

fetchJordanMatches();
