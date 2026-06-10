
import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Trophy, Timer, Tv, Flag, Flame, PlayCircle, Medal, Users, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { raceShedData } from './data';
import './styles.css';

const TODAY = new Date('2026-06-09T12:00:00');

function findCurrentRace(schedule) {
  const upcoming = schedule.find(r => new Date(r.date + 'T12:00:00') >= TODAY);
  return upcoming || schedule[schedule.length - 1];
}

function getTrackKey(raceName='') {
  const upper = raceName.toUpperCase();
  if (upper.includes('POCONO')) return 'POCONO';
  if (upper.includes('MICHIGAN')) return 'MICHIGAN';
  if (upper.includes('NASHVILLE')) return 'NASHVILLE';
  if (upper.includes('CHARLOTTE')) return 'CHARLOTTE';
  return 'DEFAULT';
}

function formatDate(dateString) {
  return new Date(dateString + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

function useCountdown(targetDate) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  const target = new Date(targetDate + 'T14:00:00');
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes };
}

const TRACK_MAPS = {
  POCONO: {
    name: 'Pocono Raceway',
    nickname: 'The Tricky Triangle',
    shape: 'M102 248 L300 62 L516 238 Q536 258 518 279 Q506 294 474 296 L136 294 Q96 292 84 271 Q76 258 102 248Z',
    inner: 'M168 244 L304 120 L438 238 Q450 248 438 258 L158 260 Q146 258 168 244Z',
    turns: [{x:94,y:238,t:'T1'}, {x:300,y:52,t:'T2'}, {x:522,y:228,t:'T3'}],
    stat: '2.5 mi • 3 turns • 160 laps'
  },
  MICHIGAN: {
    name: 'Michigan International Speedway',
    nickname: 'Fast two-mile D-oval',
    shape: 'M142 226 C142 112 226 62 316 62 L430 62 C508 62 552 118 552 178 C552 250 502 286 420 286 L188 286 C118 286 78 252 78 214 C78 186 96 164 142 154 Z',
    inner: 'M190 218 C190 148 246 118 322 118 L418 118 C460 118 494 144 494 180 C494 220 462 236 416 236 L194 236 C170 236 160 230 190 218 Z',
    turns: [{x:150,y:120,t:'T1'}, {x:488,y:88,t:'T2'}, {x:532,y:238,t:'T3'}, {x:122,y:270,t:'T4'}],
    stat: '2.0 mi • D-shaped oval • 200 laps'
  },
  NASHVILLE: {
    name: 'Nashville Superspeedway',
    nickname: 'Concrete speedway',
    shape: 'M132 230 C132 122 210 76 304 76 L406 76 C504 76 550 122 550 181 C550 248 500 286 414 286 L192 286 C112 286 70 248 70 205 C70 178 88 154 132 150 Z',
    inner: 'M188 218 C188 154 244 130 310 130 L402 130 C454 130 492 152 492 184 C492 218 454 236 404 236 L192 236 C168 236 160 228 188 218 Z',
    turns: [{x:142,y:126,t:'T1'}, {x:484,y:104,t:'T2'}, {x:520,y:246,t:'T3'}, {x:122,y:266,t:'T4'}],
    stat: '1.33 mi • concrete oval'
  },
  DEFAULT: {
    name: 'RaceShed Track Preview',
    nickname: 'Race day intel',
    shape: 'M110 250 L300 70 L500 240 Q520 270 485 288 L135 292 Q85 285 110 250Z',
    inner: 'M178 242 L305 122 L438 238 Q451 252 430 259 L172 262 Q151 260 178 242Z',
    turns: [{x:108,y:236,t:'T1'}, {x:300,y:60,t:'T2'}, {x:500,y:230,t:'T3'}],
    stat: 'Track map • race preview'
  }
};

function TrackAnimation({ trackKey, race, details }) {
  const map = TRACK_MAPS[trackKey] || TRACK_MAPS.DEFAULT;
  const title = details.fullName !== 'Track Preview' ? details.fullName : map.name;
  return (
    <div className="track-animation pro-preview">
      <div className="scanlines"></div>
      <div className="preview-topbar">
        <span>RACESHED TRACK INTEL</span>
        <strong>{race.segment}</strong>
      </div>
      <svg viewBox="0 0 640 390" role="img" aria-label={`${title} animated track preview`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <linearGradient id="trackSteel" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#505050"/>
            <stop offset="48%" stopColor="#f2f2f2"/>
            <stop offset="100%" stopColor="#505050"/>
          </linearGradient>
        </defs>
        <g className="grid-lines">
          {Array.from({length: 9}).map((_,i)=><line key={`h${i}`} x1="34" x2="606" y1={48+i*34} y2={48+i*34}/>)}
          {Array.from({length: 12}).map((_,i)=><line key={`v${i}`} y1="42" y2="338" x1={48+i*50} x2={48+i*50}/>)}
        </g>
        <path className="track-shadow" d={map.shape}/>
        <path className="track-rumble outer" d={map.shape}/>
        <path id="trackPath" className="track-line" d={map.shape}/>
        <path className="track-racing-line" d={map.shape}/>
        <path className="track-inner" d={map.inner}/>
        {map.turns.map(turn => (
          <g className="turn-marker" key={turn.t}>
            <circle cx={turn.x} cy={turn.y} r="18"/>
            <text x={turn.x} y={turn.y+5} textAnchor="middle">{turn.t}</text>
          </g>
        ))}
        <g className="start-finish">
          <line x1="118" y1="260" x2="154" y2="286"/>
          <text x="84" y="304">START/FINISH</text>
        </g>
        <circle className="race-dot chase" r="9" filter="url(#glow)">
          <animateMotion dur="4.2s" repeatCount="indefinite" rotate="auto">
            <mpath href="#trackPath"/>
          </animateMotion>
        </circle>
        <circle className="race-dot secondary" r="6" filter="url(#glow)">
          <animateMotion dur="4.2s" begin="-1.15s" repeatCount="indefinite" rotate="auto">
            <mpath href="#trackPath"/>
          </animateMotion>
        </circle>
        <circle className="race-dot third" r="5" filter="url(#glow)">
          <animateMotion dur="4.2s" begin="-2.1s" repeatCount="indefinite" rotate="auto">
            <mpath href="#trackPath"/>
          </animateMotion>
        </circle>
        <text x="320" y="178" textAnchor="middle" className="track-label">{title}</text>
        <text x="320" y="207" textAnchor="middle" className="track-sub">{map.nickname}</text>
        <text x="320" y="232" textAnchor="middle" className="track-stat">{map.stat}</text>
      </svg>
      <div className="telemetry">
        <div><span>Track</span><strong>{details.length}</strong></div>
        <div><span>Laps</span><strong>{details.laps}</strong></div>
        <div><span>Banking</span><strong>{details.banking}</strong></div>
      </div>
    </div>
  );
}

function Hero({ tvMode, setTvMode }) {
  return (
    <header className="hero">
      <div className="hero-glow"></div>
      <div className="logo-wrap"><img src="/raceshed-logo.png" alt="RaceShed Fantasy League logo" className="logo" /></div>
      <div className="hero-copy">
        <span className="badge"><Flame size={16}/> Version 25 Official Rebuild</span>
        <h1><span>RaceShed</span> Fantasy League</h1>
        <p>Garage-built NASCAR fantasy scoreboard. Clean standings, weekly race preview, track video support, and RaceShed TV mode.</p>
        <button className="tv-button" onClick={() => setTvMode(!tvMode)}>
          <Tv size={18}/> {tvMode ? 'Exit TV Mode' : 'Enter TV Mode'}
        </button>
      </div>
    </header>
  )
}

function RacePreview({ race, details }) {
  const countdown = useCountdown(race.date);
  return (
    <section className="card preview-card">
      <div className="section-title"><Flag /> This Week's Race</div>
      <div className="preview-grid">
        <div className="preview-copy">
          <p className="eyebrow">Race #{race.raceNumber} • {race.segment}</p>
          <h2>{details.fullName !== 'Track Preview' ? details.fullName : race.race}</h2>
          <p className="muted">{details.location}</p>
          <div className="countdown">
            <div><strong>{countdown.days}</strong><span>Days</span></div>
            <div><strong>{countdown.hours}</strong><span>Hours</span></div>
            <div><strong>{countdown.minutes}</strong><span>Min</span></div>
          </div>
          <div className="facts">
            <span>{formatDate(race.date)}</span>
            <span>TV: {race.tv}</span>
            <span>{details.length}</span>
            <span>{details.laps} laps</span>
            <span>{details.banking}</span>
          </div>
        </div>
        <div className="video-frame">
          {details.videoEmbedUrl ? (
            <iframe src={details.videoEmbedUrl} title={`${race.race} preview`} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <TrackAnimation trackKey={getTrackKey(race.race)} race={race} details={details} />
          )}
        </div>
      </div>
    </section>
  )
}

function Standings({ standings }) {
  return (
    <section className="card">
      <div className="section-title"><Trophy /> Championship Standings</div>
      <div className="standings-table">
        <div className="standings-row header-row">
          <span>Pos</span><span>Player</span><span>Points</span><span>Gap</span><span>Wins</span><span>Avg</span><span>Best</span>
        </div>
        {standings.map(s => (
          <div className={`standings-row ${s.rank === 1 ? 'leader' : ''}`} key={s.player}>
            <span className="rank">{s.rank}</span>
            <span className="player">{s.rank === 1 && <Medal size={17}/>} {s.player}</span>
            <span className="points">{s.points}</span>
            <span>{s.gap}</span>
            <span>{s.wins}</span>
            <span>{s.average}</span>
            <span>{s.best}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function WinnerCard({ lastRace, weeklyPicks }) {
  const picks = weeklyPicks.find(p => p.raceNumber === lastRace.raceNumber && p.player === lastRace.winner);
  return (
    <section className="card winner-card">
      <div className="section-title"><Trophy /> Last Week's Winner</div>
      <div className="winner-name">{lastRace.winner}</div>
      <div className="winner-points">{lastRace.winnerPts} pts</div>
      <div className="muted">{lastRace.race}</div>
      {picks && <div className="pick-pills">{picks.picks.filter(Boolean).map(p => <span key={p}>#{p}</span>)}</div>}
    </section>
  )
}

function PicksBoard({ race, weeklyPicks }) {
  const picks = weeklyPicks.filter(p => p.raceNumber === race.raceNumber);
  return (
    <section className="card">
      <div className="section-title"><Users /> This Week's Picks Board</div>
      {picks.length ? (
        <div className="picks-grid">
          {picks.map(p => (
            <div className="pick-card" key={p.player}>
              <strong>{p.player}</strong>
              <div className="pick-pills">
                {p.picks.some(Boolean) ? p.picks.filter(Boolean).map(car => <span key={car}>#{car}</span>) : <em>Waiting for picks</em>}
              </div>
            </div>
          ))}
        </div>
      ) : <p className="muted">No picks loaded for this race yet.</p>}
    </section>
  )
}


function DriverPointsWatch({ race, weeklyPicks }) {
  const picks = weeklyPicks.filter(p => p.raceNumber === race.raceNumber);
  const driverMap = new Map();
  picks.forEach(p => {
    p.picks.forEach((car, idx) => {
      if (!car) return;
      const key = String(car);
      if (!driverMap.has(key)) driverMap.set(key, { car: key, pickedBy: [], bestFinish: null, points: null });
      const entry = driverMap.get(key);
      entry.pickedBy.push(p.player);
      const finish = p.finishes?.[idx];
      const pts = p.points?.[idx];
      if (finish) entry.bestFinish = entry.bestFinish ? Math.min(entry.bestFinish, finish) : finish;
      if (pts) entry.points = Math.max(entry.points || 0, pts);
    });
  });
  const drivers = Array.from(driverMap.values()).sort((a,b) => (b.points || 0) - (a.points || 0) || Number(a.car) - Number(b.car));
  return (
    <section className="card">
      <div className="section-title"><Flag /> NASCAR Driver Points Watch</div>
      {drivers.length ? (
        <div className="driver-points-grid">
          {drivers.map(d => (
            <div className="driver-point-card" key={d.car}>
              <div className="car-number">#{d.car}</div>
              <div>
                <strong>{d.points ?? '—'} pts</strong>
                <p className="muted">{d.bestFinish ? `Best finish: ${d.bestFinish}` : 'Waiting on race result'}</p>
                <small>Picked by {d.pickedBy.join(', ')}</small>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="muted">No picks entered yet. Once players add picks, this section will show each NASCAR car number, fantasy points, finish, and who picked it.</p>}
    </section>
  )
}

function OtherSeries() {
  const series = [
    { name: 'FIA WEC', note: 'Endurance watch list', detail: 'Le Mans, Hypercar, LMGT3' },
    { name: 'Formula 1', note: 'Global race radar', detail: 'Grand Prix weekends and driver buzz' },
    { name: 'Craftsman Trucks', note: 'NASCAR feeder chaos', detail: 'Truck Series race-week info' },
    { name: 'IMSA', note: 'Sports car corner', detail: 'GTP, GTD Pro, endurance events' }
  ];
  return (
    <section className="card series-card">
      <div className="section-title"><Flag /> Other Race Series</div>
      <p className="muted series-intro">A clean bottom section for the players who want more than Cup Series. This is ready to expand with schedule, standings, and RaceShed picks later.</p>
      <div className="series-grid">
        {series.map(s => (
          <div className="series-tile" key={s.name}>
            <strong>{s.name}</strong>
            <span>{s.note}</span>
            <p>{s.detail}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function RaceHistory({ summary }) {
  const [open, setOpen] = useState(false);
  const completed = summary.filter(r => r.winner && r.winnerPts > 0).slice().reverse();
  const list = open ? completed : completed.slice(0, 6);
  return (
    <section className="card">
      <div className="section-title"><Timer /> Race History</div>
      <div className="history-list">
        {list.map(r => (
          <div className="history-row" key={r.raceNumber}>
            <span>#{r.raceNumber} {r.race}</span>
            <strong>{r.winner}</strong>
            <span>{r.winnerPts} pts</span>
          </div>
        ))}
      </div>
      <button className="ghost" onClick={() => setOpen(!open)}>{open ? <ChevronUp/> : <ChevronDown/>} {open ? 'Show Less' : 'Show Full History'}</button>
    </section>
  )
}

function TVMode({ race, details, standings, lastRace }) {
  const countdown = useCountdown(race.date);
  return (
    <main className="tv-mode">
      <img src="/raceshed-logo.png" alt="RaceShed" />
      <div className="tv-grid">
        <div>
          <p className="eyebrow">Next Race</p>
          <h1>{details.fullName !== 'Track Preview' ? details.fullName : race.race}</h1>
          <div className="countdown huge">
            <div><strong>{countdown.days}</strong><span>Days</span></div>
            <div><strong>{countdown.hours}</strong><span>Hours</span></div>
            <div><strong>{countdown.minutes}</strong><span>Min</span></div>
          </div>
          <p className="muted">{formatDate(race.date)} • TV: {race.tv}</p>
        </div>
        <div className="tv-leaderboard">
          {standings.slice(0,8).map(s => <div key={s.player}><span>{s.rank}. {s.player}</span><strong>{s.points}</strong></div>)}
        </div>
        <div className="tv-winner">
          <p className="eyebrow">Last Winner</p>
          <h2>{lastRace.winner}</h2>
          <strong>{lastRace.winnerPts} pts</strong>
          <p>{lastRace.race}</p>
        </div>
      </div>
    </main>
  )
}

function App() {
  const [tvMode, setTvMode] = useState(false);
  const currentRace = useMemo(() => findCurrentRace(raceShedData.schedule), []);
  const trackDetails = raceShedData.trackDetails[getTrackKey(currentRace.race)] || raceShedData.trackDetails.DEFAULT;
  const lastRace = raceShedData.raceSummary.filter(r => r.winner && r.winnerPts > 0).at(-1);

  if (tvMode) return <TVMode race={currentRace} details={trackDetails} standings={raceShedData.standings} lastRace={lastRace} />;

  return (
    <>
      <Hero tvMode={tvMode} setTvMode={setTvMode}/>
      <main className="layout">
        <RacePreview race={currentRace} details={trackDetails} />
        <div className="two-col">
          <WinnerCard lastRace={lastRace} weeklyPicks={raceShedData.weeklyPicks}/>
          <section className="card pot-card">
            <div className="section-title"><DollarSign /> Weekly Pot</div>
            <div className="pot">${raceShedData.weeklyPicks.filter(p => p.raceNumber === currentRace.raceNumber && p.picks.some(Boolean)).length * raceShedData.league.buyIn}</div>
            <p className="muted">Only players with picks count. Starts at $0 until picks are added.</p>
          </section>
        </div>
        <Standings standings={raceShedData.standings} />
        <PicksBoard race={currentRace} weeklyPicks={raceShedData.weeklyPicks}/>
        <DriverPointsWatch race={currentRace} weeklyPicks={raceShedData.weeklyPicks}/>
        <RaceHistory summary={raceShedData.raceSummary}/>
        <OtherSeries />
      </main>
      <footer>RaceShed Fantasy V25 • Built from your Excel workbook • Update weekly data in <code>src/data.js</code></footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
