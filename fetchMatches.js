import fetch from 'node-fetch';
import fs from 'fs';

async function fetchJordan() {
  const res = await fetch('https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/2917/schedule?fixture=true');
  const json = await res.json();
  return json.events.map(e => ({
    date: new Date(e.date).toISOString().split('T')[0],
    time: new Date(e.date).toLocaleTimeString('ar-JO', {hour:'2-digit', minute:'2-digit'}),
    home: e.competitions[0].competitors.find(c => c.homeAway==='home').team.name,
    away: e.competitions[0].competitors.find(c => c.homeAway==='away').team.name,
    venue: e.competitions[0].venue.fullName,
    type: e.competitions[0].competition.name,
    status: e.status.type.name
  }));
}

(async () => {
  const m = await fetchJordan();
  fs.writeFileSync('matches.json', JSON.stringify(m, null, 2), 'utf8');
})();
