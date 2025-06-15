const fetch = require('node-fetch');
const fs = require('fs');

async function fetchJordanMatches() {
  const url = 'https://site.web.api.espn.com/apis/site/v2/sports/soccer/all/teams/2917/schedule?region=us&lang=en&seasontype=2';

  try {
    console.log("🚀 بدء الاتصال بـ ESPN...");
    const res = await fetch(url);
    console.log("🔄 تم الاتصال، جاري قراءة البيانات...");
    const data = await res.json();

    if (!data.events || !Array.isArray(data.events)) {
      console.error("❌ البيانات غير متوقعة أو لا تحتوي على مباريات.");
      return;
    }

    console.log(`📦 عدد المباريات المستلمة: ${data.events.length}`);

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

    console.log("✅ المباريات تم تحويلها بنجاح. جاري حفظها في matches.json...");
    fs.writeFileSync('matches.json', JSON.stringify(matches, null, 2), 'utf8');
    console.log('🎉 تم حفظ المباريات في matches.json');
  } catch (error) {
    console.error('❌ حصل خطأ أثناء جلب المباريات:', error);
  }
}

fetchJordanMatches();
