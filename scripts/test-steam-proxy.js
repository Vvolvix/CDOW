const steamId = '76561197960287930';
const targetUrl = 'https://steamcommunity.com/profiles/' + steamId + '/?xml=1';

const proxies = [
  'https://corsproxy.io/?' + encodeURIComponent(targetUrl),
  'https://api.allorigins.win/raw?url=' + encodeURIComponent(targetUrl),
  'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(targetUrl),
  'https://api.microlink.io/?url=' + encodeURIComponent('https://steamcommunity.com/profiles/' + steamId)
];

async function testAll() {
  for (const p of proxies) {
    try {
      console.log('Testing proxy:', p.slice(0, 50));
      const res = await fetch(p, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const text = await res.text();
      console.log('  Status:', res.status, '| Length:', text.length);
      const nameM = text.match(/<steamID><!\[CDATA\[(.*?)\]\]><\/steamID>/) || text.match(/"title":"(.*?)"/);
      const avatarM = text.match(/<avatarFull><!\[CDATA\[(.*?)\]\]><\/avatarFull>/) || text.match(/"image":\{"url":"(.*?)"/);
      if (nameM || avatarM) {
        console.log('  🎉 SUCCESS! Name:', nameM ? nameM[1] : null, '| Avatar:', avatarM ? avatarM[1] : null);
      }
    } catch(e) {
      console.log('  Error:', e.message);
    }
  }
}

testAll();
