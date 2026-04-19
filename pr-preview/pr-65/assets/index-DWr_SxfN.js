(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const i of l.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function s(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function a(r){if(r.ep)return;r.ep=!0;const l=s(r);fetch(r.href,l)}})();function n(e,t,s,a=0,r=.78,l={}){return Object.freeze({beat:e,duration:t,degree:s,octave:a,velocity:r,...l})}function o(...e){return Object.freeze(e)}const f=o(),C=Object.freeze([{id:"echoes-of-tomorrow",title:"Echoes Of Tomorrow",category:"타이틀 / 메인 테마",chapter:"전체 서사",accent:"gold",summary:"반향해의 장엄함과 불길한 희망을 함께 담은 메인 테마.",mood:"장엄한 서정, 깊은 잔광, 넓은 바다",scenarioRefs:["story-overview","main-story","scenario-ending"],useCases:["타이틀 화면","메인 메뉴","회상 연출"],instruments:["glass-pad","star-lead","cello-bass","soft-pulse"],mode:"lydian",tonicMidi:62,tempo:80,meter:4,loopMeasures:8,progression:[0,5,3,4,0,1,4,0],bassStyle:"pedal-cinematic",pulseStyle:"shimmer-8ths",percussionStyle:"soft-heartbeat",textureStyle:"sea-wind",padInstrument:"glass-pad",leadInstrument:"star-lead",counterInstrument:"hollow-bell",bassInstrument:"cello-bass",mix:Object.freeze({reverb:.38,delay:.14,width:.52,brightness:.88}),melodyMeasures:Object.freeze([o(n(0,1.5,7,0,.82),n(2,1,9,0,.76),n(3.25,.75,11,0,.74)),o(n(.5,1,9,0,.78),n(2,1,7,0,.76),n(3,1,6,0,.72)),o(n(0,1.5,4,0,.8),n(2,.75,6,0,.76),n(3,1,7,0,.76)),o(n(.5,1.5,6,0,.78),n(2.5,.5,4,0,.7),n(3,1,2,0,.74)),o(n(0,1.5,7,0,.84),n(2.25,.75,9,0,.8),n(3.25,.75,11,0,.76)),o(n(.5,1,12,0,.72),n(1.75,.75,11,0,.72),n(2.75,1.25,9,0,.78)),o(n(0,1,7,0,.76),n(1.25,.75,6,0,.72),n(2.25,.75,4,0,.72),n(3.25,.5,6,0,.68)),o(n(0,2.5,7,0,.84),n(3,1,9,0,.78))]),counterMeasures:Object.freeze([f,o(n(1,1,4,0,.46),n(2.5,.5,6,0,.42)),f,o(n(1.5,1,1,0,.42),n(3,.5,2,0,.38)),f,o(n(0,1.5,4,0,.42),n(2,1,6,0,.42)),f,o(n(1,1.5,2,0,.4))])},{id:"mirajin-hushed-dawn",title:"Mirajin Hushed Dawn",category:"허브 / 프롤로그",chapter:"프롤로그",accent:"teal",summary:"영원한 황혼에 잠긴 미라진의 정지된 공기를 위한 허브 BGM.",mood:"정지된 시간, 조용한 죄책감, 황혼의 습기",scenarioRefs:["scenario-prologue","regions","characters"],useCases:["미라진 탐색","시계탑 접근 전","허브 정비"],instruments:["mist-choir","glass-pad","whisper-lead","sub-bass"],mode:"aeolian",tonicMidi:57,tempo:68,meter:4,loopMeasures:8,progression:[0,4,5,3,0,6,4,0],bassStyle:"drone-tide",pulseStyle:"none",percussionStyle:"none",textureStyle:"clock-dust",padInstrument:"mist-choir",leadInstrument:"whisper-lead",counterInstrument:"hollow-bell",bassInstrument:"sub-bass",mix:Object.freeze({reverb:.46,delay:.18,width:.58,brightness:.72}),melodyMeasures:Object.freeze([o(n(0,2,7,0,.62),n(2.5,1,5,0,.54)),o(n(1,1.5,4,0,.52),n(3,.75,2,0,.48)),o(n(.5,1.5,5,0,.54),n(2.5,1,7,0,.56)),o(n(0,2.5,4,0,.6)),o(n(.5,1.5,7,0,.6),n(2.5,.75,8,0,.5)),o(n(1.25,.75,10,0,.48),n(2.5,1.25,8,0,.52)),o(n(0,1.5,5,0,.54),n(2.25,1,4,0,.48)),o(n(.5,2.75,2,0,.6))]),counterMeasures:Object.freeze([o(n(2,1.5,2,0,.28)),f,o(n(1.5,1,3,0,.26)),f,o(n(2.5,1,2,0,.26)),f,o(n(1,1.5,1,0,.24)),f])},{id:"glasssalt-drifter",title:"Glasssalt Drifter",category:"챕터 1 탐험",chapter:"챕터 1",accent:"gold",summary:"유리염 사구와 폐채굴 첨탑 탐험을 위한 건조하고 반짝이는 필드 트랙.",mood:"메마른 광채, 모래폭풍, 잔향이 울리는 공간",scenarioRefs:["scenario-chapter-1","regions","world-rules"],useCases:["유리염 사구 필드","첨탑 탐험","침몰선 접근"],instruments:["glass-pad","salt-pluck","dust-bass","brush-kit"],mode:"dorian",tonicMidi:60,tempo:92,meter:4,loopMeasures:8,progression:[0,2,5,4,0,3,4,0],bassStyle:"restless-roots",pulseStyle:"salt-ostinato",percussionStyle:"brush-travel",textureStyle:"salt-wind",padInstrument:"glass-pad",leadInstrument:"salt-pluck",counterInstrument:"whisper-lead",bassInstrument:"dust-bass",mix:Object.freeze({reverb:.3,delay:.1,width:.44,brightness:.9}),melodyMeasures:Object.freeze([o(n(.5,.75,7,0,.66),n(1.5,.5,8,0,.6),n(2.5,1,10,0,.62)),o(n(0,.75,9,0,.62),n(1,.75,7,0,.58),n(2.5,1,5,0,.56)),o(n(.5,.75,10,0,.62),n(1.5,.75,9,0,.58),n(3,.75,7,0,.56)),o(n(.5,.75,8,0,.6),n(1.5,.75,7,0,.56),n(2.5,1,5,0,.58)),o(n(.5,.75,7,0,.66),n(1.5,.5,8,0,.6),n(2.5,1,10,0,.62)),o(n(.5,.75,8,0,.58),n(1.5,.75,7,0,.56),n(2.5,1,5,0,.56)),o(n(.5,.5,7,0,.58),n(1,.5,8,0,.54),n(1.75,.75,10,0,.6),n(3,.5,8,0,.52)),o(n(.5,2,7,0,.64))]),counterMeasures:Object.freeze([f,o(n(2,.75,2,0,.3),n(3,.5,4,0,.28)),f,o(n(2,.75,1,0,.28),n(3,.5,2,0,.26)),f,o(n(2,.75,3,0,.28),n(3,.5,4,0,.26)),f,o(n(2.5,.75,2,0,.26))])},{id:"faultline-run",title:"Faultline Run",category:"긴장 / 추적",chapter:"프롤로그-챕터 2",accent:"coral",summary:"균열 폭주와 탈출, 붕괴 추격 구간을 위한 추진형 트랙.",mood:"급박함, 파열음, 달리는 판단",scenarioRefs:["scenario-prologue","scenario-chapter-1","scenario-chapter-2"],useCases:["시계탑 붕괴","구조선 방어전 직전","비상 추격"],instruments:["tense-pad","alarm-bell","pulse-bass","fracture-kit"],mode:"phrygian",tonicMidi:55,tempo:116,meter:4,loopMeasures:8,progression:[0,1,5,4,0,1,5,4],bassStyle:"pumping-octaves",pulseStyle:"fracture-16ths",percussionStyle:"chase-kit",textureStyle:"crackle",padInstrument:"tense-pad",leadInstrument:"alarm-bell",counterInstrument:"ember-horn",bassInstrument:"pulse-bass",mix:Object.freeze({reverb:.22,delay:.08,width:.36,brightness:.8}),melodyMeasures:Object.freeze([o(n(0,.5,7,0,.62),n(1,.5,8,0,.64),n(2,.5,10,0,.66),n(3,.5,8,0,.6)),o(n(.5,.5,7,0,.62),n(1.5,.5,8,0,.64),n(2.5,.5,5,0,.6),n(3.5,.25,3,0,.56)),o(n(0,.5,10,0,.66),n(1,.5,8,0,.62),n(2.25,.5,7,0,.6),n(3.25,.5,5,0,.58)),o(n(.5,.5,8,0,.62),n(1.5,.5,7,0,.6),n(2.5,.5,5,0,.58),n(3.5,.25,3,0,.54)),o(n(0,.5,7,0,.62),n(1,.5,8,0,.64),n(2,.5,10,0,.66),n(3,.5,8,0,.6)),o(n(.5,.5,12,0,.7),n(1.5,.5,10,0,.66),n(2.5,.5,8,0,.62),n(3.5,.25,7,0,.58)),o(n(0,.5,10,0,.66),n(1,.5,8,0,.62),n(2.25,.5,7,0,.6),n(3.25,.5,5,0,.58)),o(n(.5,.5,8,0,.62),n(1.5,.5,7,0,.6),n(2.5,1,3,0,.56))]),counterMeasures:Object.freeze([f,o(n(2,.5,0,0,.3),n(3,.5,1,0,.3)),f,o(n(2,.5,6,0,.3),n(3,.5,4,0,.3)),f,o(n(2,.5,7,0,.3),n(3,.5,8,0,.3)),f,o(n(2.5,.5,5,0,.28))])},{id:"cadel-overturn",title:"Cadel Overturn",category:"챕터 2 도시 / 정치 긴장",chapter:"챕터 2",accent:"plum",summary:"역항도 카델의 수직 질서와 불편한 안정을 표현한 도시 트랙.",mood:"정제된 긴장, 뒤집힌 공간, 냉정한 통치",scenarioRefs:["scenario-chapter-2","factions","regions"],useCases:["카델 조사","유라 협상 전후","상하층 이동"],instruments:["clock-pad","inversion-pluck","cello-bass","tick-kit"],mode:"dorian",tonicMidi:61,tempo:96,meter:4,loopMeasures:8,progression:[0,3,5,4,1,4,3,0],bassStyle:"measured-steps",pulseStyle:"inversion-arp",percussionStyle:"tick-kit",textureStyle:"gravity-whispers",padInstrument:"clock-pad",leadInstrument:"inversion-pluck",counterInstrument:"hollow-bell",bassInstrument:"cello-bass",mix:Object.freeze({reverb:.26,delay:.12,width:.48,brightness:.82}),melodyMeasures:Object.freeze([o(n(.5,.75,7,0,.58),n(1.5,.75,6,0,.54),n(2.5,.75,8,0,.56)),o(n(.5,.75,9,0,.58),n(1.5,.75,8,0,.54),n(2.75,.5,6,0,.5)),o(n(0,.75,10,0,.58),n(1.25,.75,9,0,.54),n(2.5,.75,7,0,.52)),o(n(.5,.75,8,0,.56),n(1.75,.75,7,0,.54),n(3,.5,5,0,.48)),o(n(0,.75,6,0,.52),n(1.5,.75,7,0,.52),n(2.75,.5,8,0,.48)),o(n(.5,.75,8,0,.56),n(1.5,.75,7,0,.52),n(2.75,.5,5,0,.48)),o(n(0,.75,9,0,.54),n(1.25,.75,8,0,.5),n(2.5,.75,6,0,.48)),o(n(.5,2,7,0,.56))]),counterMeasures:Object.freeze([f,o(n(2,.75,2,0,.24)),f,o(n(2,.75,1,0,.24)),f,o(n(2,.75,0,0,.24)),f,o(n(2.5,.75,2,0,.22))])},{id:"fractured-tide-skirmish",title:"Fractured Tide Skirmish",category:"일반 전투",chapter:"전 챕터 공통",accent:"coral",summary:"시간 균열 전투에 맞춘 일반 전투용 트랙.",mood:"결의, 긴장, 유기적인 전투 리듬",scenarioRefs:["scenario-prologue","scenario-chapter-1","scenario-chapter-2","scenario-chapter-3"],useCases:["일반 전투","구조 중 교전","필드 돌발전"],instruments:["battle-pad","ember-horn","pulse-bass","battle-kit"],mode:"aeolian",tonicMidi:58,tempo:124,meter:4,loopMeasures:8,progression:[0,5,6,4,0,5,3,4],bassStyle:"battle-drive",pulseStyle:"war-stabs",percussionStyle:"battle-kit",textureStyle:"rift-sparks",padInstrument:"battle-pad",leadInstrument:"ember-horn",counterInstrument:"alarm-bell",bassInstrument:"pulse-bass",mix:Object.freeze({reverb:.18,delay:.06,width:.34,brightness:.76}),melodyMeasures:Object.freeze([o(n(0,.5,7,0,.72),n(1,.5,8,0,.7),n(2,.5,10,0,.72),n(3,.5,8,0,.68)),o(n(.5,.5,8,0,.7),n(1.5,.5,10,0,.72),n(2.5,.5,12,0,.74),n(3.5,.25,10,0,.68)),o(n(0,.5,13,0,.74),n(1,.5,12,0,.72),n(2,.5,10,0,.7),n(3,.5,8,0,.68)),o(n(.5,.5,10,0,.7),n(1.5,.5,8,0,.68),n(2.5,.5,7,0,.66),n(3.5,.25,5,0,.62)),o(n(0,.5,7,0,.72),n(1,.5,8,0,.7),n(2,.5,10,0,.72),n(3,.5,8,0,.68)),o(n(.5,.5,8,0,.7),n(1.5,.5,10,0,.72),n(2.5,.5,12,0,.74),n(3.5,.25,13,0,.72)),o(n(0,.5,10,0,.7),n(1,.5,8,0,.68),n(2,.5,7,0,.66),n(3,.5,5,0,.62)),o(n(.5,.5,8,0,.68),n(1.5,.5,10,0,.7),n(2.5,1,7,0,.72))]),counterMeasures:Object.freeze([f,o(n(2,.5,3,0,.24)),f,o(n(2,.5,1,0,.24)),f,o(n(2,.5,3,0,.24)),f,o(n(2.5,.5,1,0,.22))])},{id:"afterglow-vow",title:"Afterglow Vow",category:"감정 이벤트",chapter:"챕터 3",accent:"rose",summary:"사야 렌의 고백과 플레이어 정체성 공개 같은 감정 장면을 위한 서정 트랙.",mood:"가까워짐, 떨림, 상실을 예감하는 온기",scenarioRefs:["scenario-chapter-3","characters","main-story"],useCases:["고백 장면","동료 대화","진실 공개 전후"],instruments:["memory-piano","mist-choir","soft-bass","shimmer-noise"],mode:"ionian",tonicMidi:64,tempo:72,meter:6,loopMeasures:8,progression:[0,3,4,0,5,3,1,4],bassStyle:"slow-6",pulseStyle:"memory-ripple",percussionStyle:"felt-ticks",textureStyle:"glow",padInstrument:"mist-choir",leadInstrument:"memory-piano",counterInstrument:"whisper-lead",bassInstrument:"soft-bass",mix:Object.freeze({reverb:.44,delay:.16,width:.56,brightness:.84}),melodyMeasures:Object.freeze([o(n(0,1.5,7,0,.72),n(2,1,9,0,.66),n(4,1.5,11,0,.68)),o(n(.5,1,9,0,.66),n(2.5,1,7,0,.6),n(4.5,1,6,0,.58)),o(n(0,1.5,7,0,.66),n(2,1,9,0,.62),n(4,1.5,11,0,.66)),o(n(.5,1,12,0,.7),n(2.5,1.5,9,0,.66)),o(n(0,1.5,14,0,.72),n(2,1.5,12,0,.68),n(4,1,11,0,.64)),o(n(.5,1,9,0,.62),n(2.5,1.5,7,0,.6),n(4.5,1,6,0,.56)),o(n(0,1.5,7,0,.64),n(2,1,6,0,.58),n(4,1.5,4,0,.56)),o(n(.5,2,7,0,.72),n(3.5,1.5,9,0,.62))]),counterMeasures:Object.freeze([f,o(n(3,1.5,4,0,.26)),f,o(n(3,1.5,7,0,.26)),f,o(n(3,1.5,4,0,.24)),f,o(n(3,1.5,2,0,.24))])},{id:"abyssal-adjudicator",title:"Abyssal Adjudicator",category:"보스전",chapter:"챕터 1-엔딩",accent:"slate",summary:"거대 보스전과 심연의 기계 장치를 위한 중량급 전투 트랙.",mood:"심판, 장엄함, 과부하, 거대한 압박",scenarioRefs:["scenario-chapter-1","scenario-chapter-2","scenario-ending"],useCases:["유리염 거신","역추자","심연의 합창기"],instruments:["iron-choir","ember-horn","abyss-bass","boss-kit"],mode:"aeolian",tonicMidi:52,tempo:108,meter:4,loopMeasures:8,progression:[0,6,4,5,0,6,3,4],bassStyle:"boss-march",pulseStyle:"choir-stabs",percussionStyle:"boss-kit",textureStyle:"abyss-rumble",padInstrument:"iron-choir",leadInstrument:"ember-horn",counterInstrument:"alarm-bell",bassInstrument:"abyss-bass",mix:Object.freeze({reverb:.28,delay:.08,width:.42,brightness:.7}),melodyMeasures:Object.freeze([o(n(0,.75,7,0,.72),n(1,.75,8,0,.72),n(2.25,.75,10,0,.74),n(3.25,.5,12,0,.78)),o(n(.5,.75,13,0,.78),n(1.75,.75,12,0,.76),n(3,.5,10,0,.72)),o(n(0,.75,10,0,.72),n(1.25,.75,8,0,.7),n(2.5,.75,7,0,.68)),o(n(.5,.75,8,0,.7),n(1.75,.75,7,0,.68),n(3,.5,5,0,.64)),o(n(0,.75,7,0,.72),n(1,.75,8,0,.72),n(2.25,.75,10,0,.74),n(3.25,.5,12,0,.78)),o(n(.5,.75,15,0,.8),n(1.75,.75,13,0,.78),n(3,.5,12,0,.76)),o(n(0,.75,10,0,.74),n(1.25,.75,8,0,.72),n(2.5,.75,7,0,.7)),o(n(.5,.75,8,0,.7),n(1.75,.75,7,0,.68),n(3,1,5,0,.68))]),counterMeasures:Object.freeze([f,o(n(2,.75,3,0,.26)),f,o(n(2,.75,1,0,.26)),f,o(n(2,.75,3,0,.26)),f,o(n(2.5,.75,1,0,.24))])},{id:"silent-coral-vault",title:"Silent Coral Vault",category:"최종 던전 / 후반 탐험",chapter:"엔딩",accent:"slate",summary:"침묵 산호궁과 심연 진입 구간을 위한 심해 탐험 트랙.",mood:"심해 저음, 생체 기관, 오래된 종소리의 공허",scenarioRefs:["scenario-ending","regions","world-rules"],useCases:["침묵 산호궁 외곽","동료 분리 구간","심연 진입"],instruments:["iron-choir","abyss-bell","sub-bass","deep-pulses"],mode:"aeolian",tonicMidi:50,tempo:74,meter:4,loopMeasures:8,progression:[0,1,5,3,0,1,6,4],bassStyle:"abyss-pedal",pulseStyle:"abyss-ripples",percussionStyle:"deep-pulses",textureStyle:"deep-water",padInstrument:"iron-choir",leadInstrument:"abyss-bell",counterInstrument:"whisper-lead",bassInstrument:"sub-bass",mix:Object.freeze({reverb:.42,delay:.12,width:.52,brightness:.68}),melodyMeasures:Object.freeze([o(n(.5,1.5,7,0,.6),n(2.5,1,8,0,.58)),o(n(.5,1.5,10,0,.58),n(2.5,1,8,0,.54)),o(n(0,1.5,12,0,.62),n(2.5,1,10,0,.56)),o(n(.5,1.5,8,0,.56),n(2.5,1,7,0,.52)),o(n(.5,1.5,7,0,.6),n(2.5,1,8,0,.58)),o(n(.5,1.5,13,0,.62),n(2.5,1,12,0,.58)),o(n(0,1.5,10,0,.56),n(2.5,1,8,0,.54)),o(n(.5,2.5,7,0,.62))]),counterMeasures:Object.freeze([o(n(2,1,2,0,.22)),f,o(n(2,1,3,0,.22)),f,o(n(2,1,2,0,.22)),f,o(n(2,1,1,0,.2)),f])},{id:"last-bell-refrain",title:"Last Bell Refrain",category:"엔딩 / 크레딧",chapter:"엔딩",accent:"rose",summary:"메인 테마를 회수하며 상실과 희망을 함께 남기는 엔딩 트랙.",mood:"결단 뒤의 잔광, 조용한 상승, 남겨진 여운",scenarioRefs:["scenario-ending","main-story","story-overview"],useCases:["엔딩 후일담","크레딧","브랜치 청취"],instruments:["memory-piano","glass-pad","soft-bass","felt-ticks"],mode:"lydian",tonicMidi:62,tempo:78,meter:6,loopMeasures:8,progression:[0,4,5,3,0,1,4,0],bassStyle:"slow-6",pulseStyle:"credits-ripple",percussionStyle:"felt-ticks",textureStyle:"sea-wind",padInstrument:"glass-pad",leadInstrument:"memory-piano",counterInstrument:"star-lead",bassInstrument:"soft-bass",mix:Object.freeze({reverb:.4,delay:.18,width:.58,brightness:.9}),melodyMeasures:Object.freeze([o(n(0,1.5,7,0,.76),n(2,1,9,0,.7),n(4,1.5,11,0,.72)),o(n(.5,1,9,0,.7),n(2.5,1,7,0,.64),n(4.5,1,6,0,.6)),o(n(0,1.5,4,0,.66),n(2,1,6,0,.62),n(4,1.5,7,0,.64)),o(n(.5,1,6,0,.62),n(2.5,1,4,0,.58),n(4,1.5,2,0,.56)),o(n(0,1.5,7,0,.76),n(2,1,9,0,.7),n(4,1.5,11,0,.72)),o(n(.5,1,12,0,.68),n(2.5,1,11,0,.64),n(4,1.5,9,0,.66)),o(n(0,1.5,7,0,.66),n(2,1,6,0,.6),n(4,1.5,4,0,.58)),o(n(.5,2.5,7,0,.76),n(4,1,9,0,.66))]),counterMeasures:Object.freeze([f,o(n(3,1.5,4,0,.24)),f,o(n(3,1.5,2,0,.22)),f,o(n(3,1.5,4,0,.24)),f,o(n(3,1.5,2,0,.22))])}]),P=Object.freeze({ionian:[0,2,4,5,7,9,11],dorian:[0,2,3,5,7,9,10],aeolian:[0,2,3,5,7,8,10],lydian:[0,2,4,6,7,9,11],phrygian:[0,1,3,5,7,8,10]}),T=new Map(C.map(e=>[e.id,e])),H=C[0]?.id??"",B=48e3,X=Object.freeze({"glass-pad":{partials:[{type:"sawtooth",gain:.52,detune:-8},{type:"sawtooth",gain:.52,detune:8},{type:"triangle",gain:.24,detune:0},{type:"sine",gain:.08,harmonic:2}],gain:.038,attack:.72,release:1.5,filter:1900,q:.7,reverb:.72,delay:.12},"mist-choir":{partials:[{type:"sine",gain:.58,detune:-6},{type:"triangle",gain:.32,detune:5},{type:"sine",gain:.12,harmonic:2}],gain:.034,attack:.86,release:1.8,filter:1500,q:.9,reverb:.82,delay:.1},"tense-pad":{partials:[{type:"sawtooth",gain:.5,detune:-4},{type:"sawtooth",gain:.5,detune:4},{type:"triangle",gain:.18}],gain:.03,attack:.2,release:.8,filter:1350,q:1.4,reverb:.42,delay:.06},"clock-pad":{partials:[{type:"triangle",gain:.52,detune:-4},{type:"triangle",gain:.46,detune:4},{type:"sine",gain:.12,harmonic:2}],gain:.03,attack:.38,release:1.04,filter:1650,q:1.1,reverb:.48,delay:.12},"battle-pad":{partials:[{type:"sawtooth",gain:.56,detune:-6},{type:"triangle",gain:.26},{type:"sawtooth",gain:.56,detune:6}],gain:.028,attack:.12,release:.58,filter:1420,q:1.5,reverb:.24,delay:.04},"iron-choir":{partials:[{type:"triangle",gain:.48,detune:-5},{type:"triangle",gain:.48,detune:5},{type:"sine",gain:.14,harmonic:2},{type:"sawtooth",gain:.1,harmonic:.5}],gain:.034,attack:.42,release:1.32,filter:1180,q:1.25,reverb:.52,delay:.08},"star-lead":{partials:[{type:"triangle",gain:.58},{type:"sine",gain:.24,harmonic:2},{type:"sine",gain:.12,harmonic:3}],gain:.03,attack:.04,release:.5,filter:3e3,q:.4,reverb:.38,delay:.24},"whisper-lead":{partials:[{type:"sine",gain:.66},{type:"triangle",gain:.18,harmonic:2}],gain:.025,attack:.08,release:.92,filter:2200,q:.6,reverb:.62,delay:.18},"salt-pluck":{partials:[{type:"triangle",gain:.56},{type:"square",gain:.16},{type:"sine",gain:.1,harmonic:2}],gain:.024,attack:.01,release:.22,filter:2350,q:1.1,reverb:.28,delay:.12},"alarm-bell":{partials:[{type:"sine",gain:.78},{type:"sine",gain:.22,harmonic:2.01},{type:"sine",gain:.12,harmonic:3.99}],gain:.026,attack:.01,release:.6,filter:3600,q:.2,reverb:.3,delay:.18},"inversion-pluck":{partials:[{type:"triangle",gain:.54},{type:"sine",gain:.18,harmonic:2},{type:"square",gain:.1}],gain:.022,attack:.01,release:.24,filter:2500,q:.95,reverb:.2,delay:.16},"ember-horn":{partials:[{type:"sawtooth",gain:.42,detune:-5},{type:"triangle",gain:.26},{type:"sawtooth",gain:.42,detune:5}],gain:.028,attack:.02,release:.38,filter:1800,q:.9,reverb:.18,delay:.08},"memory-piano":{partials:[{type:"triangle",gain:.62},{type:"sine",gain:.18,harmonic:2},{type:"sine",gain:.08,harmonic:3}],gain:.024,attack:.01,release:.56,filter:2850,q:.45,reverb:.46,delay:.14},"abyss-bell":{partials:[{type:"sine",gain:.72},{type:"sine",gain:.18,harmonic:2.02},{type:"triangle",gain:.08,harmonic:.5}],gain:.028,attack:.02,release:1.08,filter:2400,q:.35,reverb:.7,delay:.08},"hollow-bell":{partials:[{type:"sine",gain:.74},{type:"sine",gain:.18,harmonic:1.5},{type:"sine",gain:.08,harmonic:2.7}],gain:.018,attack:.01,release:.82,filter:2600,q:.3,reverb:.56,delay:.18},"cello-bass":{partials:[{type:"triangle",gain:.68},{type:"sine",gain:.22,harmonic:.5},{type:"triangle",gain:.1,harmonic:2}],gain:.038,attack:.012,release:.26,filter:420,q:.6,reverb:.1,delay:0},"sub-bass":{partials:[{type:"sine",gain:.84},{type:"triangle",gain:.12,harmonic:.5}],gain:.04,attack:.02,release:.34,filter:260,q:.7,reverb:.02,delay:0},"dust-bass":{partials:[{type:"triangle",gain:.64},{type:"square",gain:.1},{type:"sine",gain:.18,harmonic:.5}],gain:.032,attack:.01,release:.22,filter:540,q:.7,reverb:.06,delay:0},"pulse-bass":{partials:[{type:"sawtooth",gain:.34,detune:-2},{type:"triangle",gain:.28},{type:"sawtooth",gain:.34,detune:2}],gain:.036,attack:.006,release:.16,filter:620,q:.9,reverb:.02,delay:0},"soft-bass":{partials:[{type:"sine",gain:.76},{type:"triangle",gain:.16}],gain:.034,attack:.01,release:.3,filter:340,q:.55,reverb:.04,delay:0},"abyss-bass":{partials:[{type:"triangle",gain:.58},{type:"sawtooth",gain:.16,harmonic:.5},{type:"sine",gain:.16,harmonic:2}],gain:.042,attack:.01,release:.22,filter:360,q:1.1,reverb:.04,delay:0}});function j(e,t,s){return Math.min(Math.max(e,t),s)}function Z(e){return 440*2**((e-69)/12)}function nn(e){return P[e]??P.ionian}function w(e,t,s=0){const a=nn(e.mode),r=(t%a.length+a.length)%a.length,l=Math.floor(t/a.length)*12;return e.tonicMidi+a[r]+l+s}function N(e,t){return Object.freeze({root:w(e,t,-12),third:w(e,t+2),fifth:w(e,t+4),seventh:w(e,t+6),ninth:w(e,t+8),highRoot:w(e,t+7)})}function en(e,t=2.8,s=2.6){const a=Math.max(1,Math.floor(e.sampleRate*t)),r=e.createBuffer(2,a,e.sampleRate);for(let l=0;l<r.numberOfChannels;l+=1){const i=r.getChannelData(l);for(let c=0;c<a;c+=1){const h=(1-c/a)**s;i[c]=(Math.random()*2-1)*h}}return r}function z(e,{color:t="white",seconds:s=1}={}){const a=Math.max(1,Math.floor(e.sampleRate*s)),r=e.createBuffer(1,a,e.sampleRate),l=r.getChannelData(0);let i=0;for(let c=0;c<a;c+=1){const u=Math.random()*2-1;if(t==="brown"){i=(i+.02*u)/1.02,l[c]=i*3.5;continue}if(t==="pink"){i=.985*i+.15*u,l[c]=i;continue}l[c]=u}return r}function tn(e,t){const s=e.createGain(),a=e.createGain(),r=e.createGain(),l=e.createBiquadFilter(),i=e.createGain(),c=e.createDynamicsCompressor(),u=e.createConvolver(),h=e.createGain(),d=e.createDelay(1.4),p=e.createGain(),m=e.createBiquadFilter(),y=e.createGain();return l.type="lowpass",l.frequency.value=1900+(t.mix?.brightness??.84)*4200,l.Q.value=.2,i.gain.value=.76,c.threshold.value=-19,c.knee.value=14,c.ratio.value=5,c.attack.value=.002,c.release.value=.18,u.buffer=en(e,2.6+(t.mix?.reverb??.3)*1.6,2.6),h.gain.value=.56,d.delayTime.value=60/t.tempo*(t.meter===6?.75:.5),p.gain.value=.28,m.type="lowpass",m.frequency.value=2200,y.gain.value=.5,s.connect(l),a.connect(u),u.connect(h),h.connect(l),r.connect(d),d.connect(m),m.connect(p),p.connect(d),m.connect(y),y.connect(l),l.connect(i),i.connect(c),c.connect(e.destination),Object.freeze({dryBus:s,reverbSend:a,delaySend:r})}function K(e,t=0){if(typeof e.createStereoPanner=="function"){const a=e.createStereoPanner();return a.pan.value=j(t,-1,1),a}return e.createGain()}function M(e,t,s,a,r,l,i=.8,c={}){const u=X[s];if(!u||l<=0)return;const h=e.createBiquadFilter(),d=e.createGain(),p=K(e,c.pan??0),m=u.gain*i*(c.velocityScale??1),y=Math.max(.005,c.attack??u.attack),g=Math.max(.04,c.release??u.release),S=r+l,$=S+g+.04,D=Math.max(180,(c.filterFrequency??u.filter)*(c.brightness??1));if(h.type="lowpass",h.frequency.setValueAtTime(D*.72,r),h.frequency.linearRampToValueAtTime(D,r+y*1.4),h.Q.value=u.q,d.gain.setValueAtTime(1e-4,r),d.gain.linearRampToValueAtTime(m,r+y),d.gain.linearRampToValueAtTime(m*.72,S),d.gain.linearRampToValueAtTime(1e-4,S+g),h.connect(d),d.connect(p),p.connect(t.dryBus),u.reverb>0){const b=e.createGain();b.gain.value=u.reverb*(c.reverbScale??1),p.connect(b),b.connect(t.reverbSend)}if(u.delay>0){const b=e.createGain();b.gain.value=u.delay*(c.delayScale??1),p.connect(b),b.connect(t.delaySend)}u.partials.forEach(b=>{const A=e.createOscillator(),G=e.createGain(),J=Z(a)*(b.harmonic??1);A.type=b.type,A.frequency.setValueAtTime(J,r),A.detune.setValueAtTime((b.detune??0)+(c.detune??0),r),G.gain.value=b.gain,A.connect(G),G.connect(h),A.start(r),A.stop($)})}function v(e,t,s,a,r,l={}){if(r<=0)return;const i=e.createBufferSource(),c=e.createBiquadFilter(),u=e.createGain(),h=K(e,l.pan??0),d=Math.max(.003,l.attack??.02),p=Math.max(.04,l.release??.12),m=l.gain??.02,y=a+r+p+.02;i.buffer=s,i.loop=r>s.duration,i.playbackRate.value=l.playbackRate??1,c.type=l.filterType??"highpass",c.frequency.value=l.filterFrequency??1800,c.Q.value=l.q??.4,u.gain.setValueAtTime(1e-4,a),u.gain.linearRampToValueAtTime(m,a+d),u.gain.linearRampToValueAtTime(m*.6,a+r),u.gain.linearRampToValueAtTime(1e-4,a+r+p),i.connect(c),c.connect(u),u.connect(h),h.connect(t.dryBus);const g=e.createGain();g.gain.value=l.reverb??.08,h.connect(g),g.connect(t.reverbSend),i.start(a),i.stop(y)}function k(e,t,s,a=.26){const r=e.createOscillator(),l=e.createGain(),i=e.createBiquadFilter(),c=s+.5;r.type="sine",r.frequency.setValueAtTime(142,s),r.frequency.exponentialRampToValueAtTime(46,s+.14),i.type="lowpass",i.frequency.value=760,l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(a,s+.005),l.gain.exponentialRampToValueAtTime(1e-4,s+.28),r.connect(i),i.connect(l),l.connect(t.dryBus),r.start(s),r.stop(c)}function O(e,t,s,a,r=.12){v(e,t,s,a,.14,{filterType:"bandpass",filterFrequency:2100,q:.8,gain:r,attack:.004,release:.08,reverb:.04}),M(e,t,"pulse-bass",38,a,.09,.28,{filterFrequency:940,reverbScale:.06,delayScale:0})}function I(e,t,s,a,r=.05){v(e,t,s,a,.05,{filterType:"highpass",filterFrequency:5200,q:.3,gain:r,attack:.002,release:.03,reverb:.02})}function R(e,t,s,a,r=.03){v(e,t,s,a,.04,{filterType:"bandpass",filterFrequency:2800,q:2.2,gain:r,attack:.002,release:.04,reverb:.01})}function V(e,t,s,a=.11){const r=e.createOscillator(),l=e.createGain(),i=s+.38;r.type="triangle",r.frequency.setValueAtTime(110,s),r.frequency.exponentialRampToValueAtTime(72,s+.18),l.gain.setValueAtTime(1e-4,s),l.gain.exponentialRampToValueAtTime(a,s+.006),l.gain.exponentialRampToValueAtTime(1e-4,s+.24),r.connect(l),l.connect(t.dryBus),r.start(s),r.stop(i)}function an(e,t,s,a,r,l){const i=N(s,a);[{midi:i.root,velocity:.42,pan:-.26},{midi:i.third,velocity:.34,pan:-.08},{midi:i.fifth,velocity:.32,pan:.12},{midi:i.seventh,velocity:.2,pan:.26},{midi:i.highRoot,velocity:.16,pan:.42}].forEach(u=>{M(e,t,s.padInstrument,u.midi,r,l*.94,u.velocity,{pan:u.pan*(s.mix?.width??.5)})})}function U(e,t,s,a,r,l,i,c=0){r.forEach(u=>{const h=w(s,u.degree,u.octave*12);M(e,t,a,h,l+u.beat*i,u.duration*i,u.velocity,{pan:j((u.pan??0)+c,-.9,.9)})})}function rn(e,t,s,a,r,l,i){const c=N(s,a),u=s.bassStyle,h=(d,p,m,y=.8)=>{M(e,t,s.bassInstrument,d,r+p*l,m*l,y,{pan:-.02})};switch(u){case"pedal-cinematic":h(c.root,0,2,.82),h(c.fifth-12,2.25,.75,.62),h(c.root,3,.75,.74);return;case"drone-tide":h(c.root,0,3.5,.72),i%2===1&&h(c.fifth-12,3,.75,.46);return;case"restless-roots":h(c.root,0,1.25,.78),h(c.fifth-12,1.75,.75,.58),h(c.root,3,.75,.76);return;case"pumping-octaves":[0,1,2,3].forEach((d,p)=>{h(p%2===0?c.root:c.root+12,d,.5,.76)});return;case"measured-steps":h(c.root,0,1,.74),h(c.fifth-12,1.5,.75,.56),h(c.root,3,.5,.66);return;case"battle-drive":[0,1,2,3].forEach((d,p)=>{h(p===2?c.fifth-12:c.root,d,.5,.78)}),h(c.root+12,3.5,.25,.54);return;case"slow-6":h(c.root,0,2,.76),h(c.fifth-12,3,1.5,.58);return;case"boss-march":[0,1,2,3].forEach((d,p)=>{const m=p%2===0?c.root:c.fifth-12;h(m,d,.75,.82)});return;case"abyss-pedal":h(c.root,0,4,.7),h(c.root+12,2.5,.5,.36);return;default:h(c.root,0,s.meter,.68)}}function sn(e,t,s,a,r,l){const i=N(s,a),c=s.pulseStyle,u=s.leadInstrument,h=(d,p,m,y,g=0)=>{M(e,t,u,d,r+p*l,m*l,y,{pan:g,velocityScale:.9})};switch(c){case"shimmer-8ths":{[i.third,i.fifth,i.seventh,i.fifth,i.highRoot,i.fifth,i.seventh,i.third].forEach((p,m)=>h(p,m*.5,.28,.26,(m%2===0?-.2:.2)*(s.mix?.width??.5)));return}case"salt-ostinato":{[i.root+12,i.third,i.fifth,i.third,i.ninth,i.fifth,i.third,i.fifth].forEach((p,m)=>h(p,m*.5,.2,.2,m%2===0?-.12:.14));return}case"fracture-16ths":{[i.root+12,i.third,i.fifth,i.third,i.seventh,i.fifth,i.third,i.fifth].forEach((p,m)=>{const y=m*.5;h(p,y,.16,.18,m%2===0?-.08:.08),h(p,y+.25,.12,.12,m%2===0?.08:-.08)});return}case"inversion-arp":{[i.third,i.seventh,i.fifth,i.highRoot,i.third,i.fifth,i.seventh,i.highRoot].forEach((p,m)=>h(p,m*.5,.2,.18,m%2===0?-.18:.18));return}case"war-stabs":{[0,1.5,2.5,3.25].forEach((d,p)=>{const m=[i.root+12,i.fifth,i.seventh,i.fifth][p];h(m,d,.22,.26,p%2===0?-.1:.1)});return}case"memory-ripple":{const d=[0,1.5,3,4.5],p=[i.third,i.fifth,i.seventh,i.highRoot];d.forEach((m,y)=>h(p[y],m,.42,.18,y%2===0?-.18:.18));return}case"choir-stabs":{[0,1,2.5,3.25].forEach((d,p)=>{const m=[i.root+12,i.third,i.fifth,i.seventh][p];M(e,t,s.padInstrument,m,r+d*l,.32*l,.22,{pan:p%2===0?-.12:.12,attack:.02,release:.24})});return}case"abyss-ripples":{[.5,2,3.5].forEach((d,p)=>{const m=[i.third,i.fifth,i.seventh][p];h(m,d,.5,.16,p%2===0?-.14:.14)});return}case"credits-ripple":{const d=[0,1.5,3,4.5],p=[i.third,i.fifth,i.highRoot,i.fifth];d.forEach((m,y)=>h(p[y],m,.4,.2,y%2===0?-.2:.2));return}}}function on(e,t,s,a,r,l,i){const c=s.percussionStyle,u=i.white,h=i.pink;switch(c){case"none":return;case"soft-heartbeat":k(e,t,a,.18),V(e,t,a+2.5*r,.05);return;case"brush-travel":k(e,t,a,.18),O(e,t,h,a+2*r,.07),[.5,1.5,2.5,3.5].forEach(d=>I(e,t,u,a+d*r,.02));return;case"chase-kit":[0,1.5,2.5].forEach(d=>k(e,t,a+d*r,.2)),[2,3.5].forEach(d=>O(e,t,u,a+d*r,.09)),Array.from({length:8},(d,p)=>p*.5).forEach(d=>I(e,t,u,a+d*r,.024));return;case"tick-kit":[0,2].forEach(d=>k(e,t,a+d*r,.12)),Array.from({length:8},(d,p)=>p*.5).forEach(d=>R(e,t,u,a+d*r,.02));return;case"battle-kit":[0,1.5,2.5].forEach(d=>k(e,t,a+d*r,.24)),[2].forEach(d=>O(e,t,u,a+d*r,.1)),Array.from({length:8},(d,p)=>p*.5).forEach(d=>I(e,t,u,a+d*r,.03)),l%4===3&&V(e,t,a+3.5*r,.1);return;case"felt-ticks":[0,3].forEach(d=>R(e,t,h,a+d*r,.018));return;case"boss-kit":[0,1.5,3].forEach(d=>k(e,t,a+d*r,.28)),[2].forEach(d=>O(e,t,u,a+d*r,.11)),Array.from({length:8},(d,p)=>p*.5).forEach(d=>I(e,t,u,a+d*r,.026)),l%2===1&&V(e,t,a+3.5*r,.12);return;case"deep-pulses":[0,2.5].forEach(d=>k(e,t,a+d*r,.14)),[1.5,3.5].forEach(d=>R(e,t,h,a+d*r,.016));return}}function cn(e,t,s,a,r,l,i){const c=s.textureStyle,u=r/s.meter;switch(c){case"sea-wind":l%4===0&&v(e,t,i.pink,a,r*.9,{filterType:"bandpass",filterFrequency:940,q:.45,gain:.015,attack:.14,release:.6,reverb:.18,pan:-.18});return;case"clock-dust":[.75,2.75].forEach(h=>R(e,t,i.pink,a+h*u,.012)),l%2===0&&v(e,t,i.white,a+1.25*u,.35,{filterType:"bandpass",filterFrequency:1600,q:1.8,gain:.01,reverb:.06});return;case"salt-wind":v(e,t,i.white,a+.1,r*.8,{filterType:"highpass",filterFrequency:1900,q:.4,gain:.01,attack:.08,release:.28,reverb:.08,pan:l%2===0?-.2:.2});return;case"crackle":[.25,1.75,3.25].forEach(h=>v(e,t,i.white,a+h*u,.08,{filterType:"bandpass",filterFrequency:2600,q:2.6,gain:.014,reverb:.02}));return;case"gravity-whispers":l%2===0&&M(e,t,"hollow-bell",w(s,14),a+2*u,.4,.22,{pan:l%4===0?-.22:.22});return;case"rift-sparks":[.75,2.25,3.75].forEach(h=>v(e,t,i.white,a+h*u,.06,{filterType:"highpass",filterFrequency:4200,q:.4,gain:.012,reverb:.02}));return;case"glow":l%2===0&&v(e,t,i.pink,a,r,{filterType:"bandpass",filterFrequency:1200,q:.35,gain:.014,attack:.2,release:.4,reverb:.16,pan:-.12});return;case"abyss-rumble":M(e,t,"sub-bass",w(s,-7),a,r*.8,.2,{filterFrequency:180,reverbScale:.02});return;case"deep-water":v(e,t,i.brown,a,r,{filterType:"lowpass",filterFrequency:420,q:.2,gain:.012,attack:.1,release:.4,reverb:.12});return}}async function ln(e){const t=window.OfflineAudioContext||window.webkitOfflineAudioContext,s=60/e.tempo,a=e.meter*s,r=e.loopMeasures*a,i=Math.ceil((r+2.8)*B),c=new t(2,i,B),u=tn(c,e),h=Object.freeze({white:z(c,{color:"white",seconds:1}),pink:z(c,{color:"pink",seconds:1.4}),brown:z(c,{color:"brown",seconds:1.8})});for(let p=0;p<e.loopMeasures;p+=1){const m=p*a,y=e.progression[p%e.progression.length],g=e.melodyMeasures[p]??[],S=e.counterMeasures[p]??[];an(c,u,e,y,m,a),rn(c,u,e,y,m,s,p),sn(c,u,e,y,m,s),cn(c,u,e,m,a,p,h),on(c,u,e,m,s,p,h),U(c,u,e,e.leadInstrument,g,m,s,.04),U(c,u,e,e.counterInstrument,S,m,s,-.06)}const d=await c.startRendering();return Object.freeze({buffer:d,loopDuration:r})}class un{constructor({initialTrackId:t=H,initialVolume:s=.6,onStateChange:a}={}){this.onStateChange=typeof a=="function"?a:null,this.audioContext=null,this.masterGain=null,this.compressor=null,this.currentSource=null,this.currentSourceGain=null,this.currentTrackId=T.has(t)?t:H,this.pendingTrackId="",this.hasStarted=!1,this.isPlaying=!1,this.volume=j(s,0,1),this.renderCache=new Map,this.operationToken=0,this.status="idle",this.errorMessage="",this.supported=!!((window.AudioContext||window.webkitAudioContext)&&(window.OfflineAudioContext||window.webkitOfflineAudioContext))}getSnapshot(){const t=T.get(this.currentTrackId)??null,s=T.get(this.pendingTrackId)??null;return{supported:this.supported,status:this.status,isPlaying:this.isPlaying,hasStarted:this.hasStarted,volume:this.volume,currentTrackId:t?.id??"",currentTrackTitle:t?.title??"대기 중",pendingTrackId:s?.id??"",pendingTrackTitle:s?.title??"",trackCount:C.length,errorMessage:this.errorMessage}}notifyState(){this.onStateChange?.(this.getSnapshot())}ensureAudioGraph(){if(!this.supported||this.audioContext)return;const t=window.AudioContext||window.webkitAudioContext;this.audioContext=new t,this.masterGain=this.audioContext.createGain(),this.compressor=this.audioContext.createDynamicsCompressor(),this.masterGain.gain.value=this.volume,this.compressor.threshold.value=-18,this.compressor.knee.value=16,this.compressor.ratio.value=4.5,this.compressor.attack.value=.003,this.compressor.release.value=.2,this.masterGain.connect(this.compressor),this.compressor.connect(this.audioContext.destination)}async resumeFromGesture(){return!this.supported||(this.ensureAudioGraph(),!this.audioContext)?!1:(this.audioContext.state==="suspended"&&await this.audioContext.resume(),this.hasStarted=!0,!0)}async getRenderedTrack(t){const s=this.renderCache.get(t);if(s)return s instanceof Promise?s:Promise.resolve(s);const a=T.get(t);if(!a)throw new Error(`알 수 없는 트랙입니다: ${t}`);const r=ln(a).then(l=>(this.renderCache.set(t,l),l)).catch(l=>{throw this.renderCache.delete(t),l});return this.renderCache.set(t,r),r}fadeOutCurrentTrack({clearTrackId:t=!1}={}){if(!this.audioContext||!this.currentSource||!this.currentSourceGain){t&&(this.currentTrackId="");return}const s=this.currentSource,a=this.currentSourceGain,r=this.audioContext.currentTime;a.gain.cancelScheduledValues(r),a.gain.setValueAtTime(a.gain.value,r),a.gain.linearRampToValueAtTime(1e-4,r+.18),s.stop(r+.24),s.onended=()=>{try{s.disconnect(),a.disconnect()}catch{}},this.currentSource=null,this.currentSourceGain=null,t&&(this.currentTrackId="")}startRenderedTrack(t,s){if(!this.audioContext||!this.masterGain)return;this.fadeOutCurrentTrack();const a=this.audioContext.createBufferSource(),r=this.audioContext.createGain(),l=this.audioContext.currentTime;a.buffer=s.buffer,a.loop=!0,a.loopStart=0,a.loopEnd=s.loopDuration,r.gain.setValueAtTime(1e-4,l),r.gain.linearRampToValueAtTime(1,l+.2),a.connect(r),r.connect(this.masterGain),a.start(l+.02),this.currentSource=a,this.currentSourceGain=r,this.currentTrackId=t,this.pendingTrackId="",this.isPlaying=!0,this.status="playing",this.errorMessage="",this.notifyState()}async playTrack(t){if(!this.supported||!T.has(t))return!1;const s=++this.operationToken;try{if(this.pendingTrackId=t,this.status="rendering",this.errorMessage="",this.notifyState(),!await this.resumeFromGesture())return!1;const r=await this.getRenderedTrack(t);return s!==this.operationToken?!1:(this.startRenderedTrack(t,r),!0)}catch(a){return s!==this.operationToken||(this.pendingTrackId="",this.status="error",this.errorMessage=a instanceof Error?a.message:"오디오 트랙을 렌더링하지 못했습니다.",this.notifyState()),!1}}async stop(){if(this.operationToken+=1,this.pendingTrackId="",this.fadeOutCurrentTrack({clearTrackId:!0}),this.isPlaying=!1,this.status=this.hasStarted?"stopped":"idle",this.errorMessage="",this.audioContext&&this.audioContext.state==="running"){const t=this.audioContext.suspend();typeof t?.catch=="function"&&t.catch(()=>{})}this.notifyState()}setVolume(t){if(this.volume=j(t,0,1),this.masterGain&&this.audioContext){const s=this.audioContext.currentTime;this.masterGain.gain.cancelScheduledValues(s),this.masterGain.gain.setValueAtTime(this.masterGain.gain.value,s),this.masterGain.gain.linearRampToValueAtTime(this.volume,s+.08)}this.notifyState()}destroy(){if(this.fadeOutCurrentTrack({clearTrackId:!0}),this.isPlaying=!1,this.audioContext){const t=this.audioContext.close();typeof t?.catch=="function"&&t.catch(()=>{}),this.audioContext=null,this.masterGain=null,this.compressor=null}}}const dn=`# 반향해 연대기

## 한 줄 개요

**내일이 바다 위에 결정으로 떠오르는 세계에서, 어느 날 모든 내일이 사라졌다.**
플레이어는 사라진 미래의 잔향을 들을 수 있는 \`여명 인양사\`가 되어
도시 국가들의 음모와 오래된 재앙의 진실을 파헤친다.

## 핵심 콘셉트

- 장르: 판타지 해양 탐험 RPG
- 정서: 몽환적, 서정적, 불길한 희망
- 핵심 갈등: **미래를 소유하려는 세력**과 **미래를 모두에게 되돌리려는 세력**의 충돌
- 플레이어 판타지: 잃어버린 시간을 직접 건져 올리고, 그 조각으로 세계의 방향을 바꾸는 인물

## 세계의 출발점

오래전 하늘은 육지 위에 있었고, 바다는 땅 아래를 흘렀다.
하지만 \`첫 역조\` 이후 세계는 뒤집혔고,
하늘과 바다의 경계는 갈라져 거대한 상층 바다 \`반향해\`가 만들어졌다.

반향해에서는 매일 새벽, 아직 도래하지 않은 하루의 가능성이
푸른 결정 \`내일결\`로 응결된다.
도시들은 이 결정을 수확해 연료, 치유, 기억 보존, 항해 예측에 사용하며 번영했다.

그러나 어느 날 \`무월조\`가 시작되며 내일결이 생성되지 않기 시작한다.
사람들은 같은 실수를 반복하고, 일부 지역에서는 하루가 도착하지 못한 채
붉은 황혼만 길게 늘어진다.

## 플레이어의 역할

플레이어는 \`등외항 미라진\` 소속의 여명 인양사다.
여명 인양사는 바다 표면에 남는 미래의 반향을 듣고,
깨진 시간의 파편에서 아직 오지 않은 장면을 읽어 낼 수 있다.

이 능력은 축복이자 저주다.
파편을 오래 들여다볼수록 자신의 실제 기억 일부가 흐려지기 때문이다.

## 메인 목표

사라진 내일의 흐름을 복구하기 위해,
플레이어는 세계 곳곳에 흩어진 \`일곱 개의 새벽 종편\`을 회수해야 한다.
종편은 과거 세계가 매일의 경계를 고정하기 위해 남긴 장치의 잔해이며,
각각 서로 다른 세력의 손에 들어가 있다.

## RPG 활용 포인트

- 미래 조각을 사용해 전투, 탐험, 대화에서 **잠깐 다른 가능성**을 실행할 수 있다.
- 큰 힘을 사용할수록 플레이어는 기억을 잃기 때문에,
  강한 선택과 정체성 보존 사이의 긴장이 핵심 시스템이 된다.
- 지역마다 시간이 흐르는 방식이 달라 던전 구조와 퍼즐 규칙이 달라질 수 있다.
`,pn=`# 메인 스토리 구조

## 프롤로그: 내일이 오지 않은 항구

등외항 \`미라진\`은 늘 새벽이 가장 먼저 닿는 항구였다.
하지만 어느 날, 항구의 수면에 내일결이 한 조각도 맺히지 않는다.
항구의 시계탑은 종을 울렸지만 아침은 도착하지 않았고,
사람들은 전날의 후회와 감정만을 간직한 채 멈춘 황혼 속에 갇힌다.

플레이어는 사라진 새벽의 마지막 파문 속에서
누군가가 \`새벽종\`을 부순 장면을 목격한다.
문제는 그 범인의 얼굴이 플레이어 자신의 실루엣처럼 보인다는 점이다.

## 1막: 종편을 둘러싼 첫 항해

플레이어는 미라진의 항로 기록관이자 메인 히로인인 \`사야 렌\`과 함께
새벽종이 일곱 조각으로 흩어졌다는 사실을 확인한다.
각 종편은 반향해의 다른 조류에 떠밀려
서로 다른 도시와 세력의 질서 일부가 되었다.

1막의 핵심은 세계를 소개하고,
플레이어가 각 세력의 논리가 완전히 틀리지 않다는 점을 이해하게 만드는 것이다.
동시에 사야 렌은 단순한 조력자가 아니라,
플레이어가 가장 먼저 신뢰하고 가장 늦게 놓게 되는 감정 축으로 자리 잡는다.

- \`조율원\`은 미래를 통제해야 혼란을 막을 수 있다고 믿는다.
- \`염해 길드\`는 내일결의 독점을 깨야 모두가 살아남는다고 주장한다.
- \`공백 법정\`은 미래 자체가 세계를 병들게 했다며 모든 가능성을 지우려 한다.

## 2막: 잃어버린 하루들의 진실

플레이어가 종편을 모을수록
\`첫 역조\`가 단순한 자연재해가 아니었다는 진실이 드러난다.
고대의 사람들은 끝없는 전쟁을 멈추기 위해
미래를 매일 잘라 내어 보관하는 장치를 만들었고,
그 결과 내일은 모두에게 자연스럽게 주어지는 시간이 아니라
인공적으로 배급되는 자원이 되었다.

플레이어의 능력 역시 그 장치의 관리자를 계승한 흔적이다.
즉, 플레이어는 새벽종을 되살릴 유일한 인물인 동시에
현재 질서를 만든 원죄의 후손이다.

이 진실이 드러날수록 사야 렌은
플레이어를 세계를 고칠 열쇠로 봐야 하는지,
아니면 잃고 싶지 않은 한 사람으로 봐야 하는지 사이에서 흔들린다.

## 3막: 세계를 묶을 것인가, 풀어낼 것인가

마지막 항해에서 플레이어는 \`침묵 산호궁\`의 심장부로 들어간다.
그곳에는 미래를 보관하던 거대한 생체 기관 \`심연의 합창기\`가 남아 있다.
합창기는 이미 과부하 상태이며, 세계 곳곳의 시간 균열은
새벽종 복구만으로는 해결되지 않는 단계에 도달했다.

플레이어는 세 가지 방향 중 하나를 선택하게 된다.

1. 새벽종을 복구해 안정된 미래 배급 체계를 유지한다.
2. 새벽종을 해체해 누구도 미래를 소유하지 못하게 만든다.
3. 합창기와 플레이어 자신을 연결해, 인간이 아닌 새로운 매개체로 세계를 지탱한다.

## 엔딩 톤

어떤 결말을 택해도 완전한 해피엔드는 아니다.
이 세계의 이야기는 "모두에게 같은 내일이 필요한가"라는 질문에 답하는 과정이며,
결말은 플레이어가 어떤 상실을 감수했는지에 따라 달라진다.
특히 사야 렌과의 관계는 각 엔딩에서 가장 개인적인 여운을 남기는 감정선으로 작동한다.

## 확장 가능한 서브 플롯

- 내일결 중독으로 미래 장면에만 집착하는 귀족 가문
- 플레이어가 잃어버린 기억 속에서 반복 등장하는 정체불명의 아이
- 과거에 멈춘 채 주민들이 늙지 않는 어시장
- 한 번도 오지 않은 겨울을 기다리는 북쪽 등대 마을
`,hn=`# 메인 시나리오 챕터 설계 개요

## 문서 목적

이 문서는 \`반향해 연대기\`의 메인 시나리오를
실제 게임 제작에 바로 옮길 수 있도록
\`프롤로그 + 3개 메인 챕터 + 엔딩\` 구조로 재정리한 기준안이다.

목표는 다음 두 가지다.

- 메인 엔딩까지 **약 8시간**의 플레이 리듬을 유지한다.
- 맵, 전투, 연출, 대화, 퀘스트 설계를 챕터 단위로 분해한다.

## 총 플레이타임 기준

- 메인 스토리 기준 총 플레이타임: 약 8시간
- 컷신, 필수 대화, 필수 탐험, 필수 전투를 포함한 기준
- 선택형 서브 이벤트는 포함하지 않음
- 챕터 간 이동, 허브 정비, 튜토리얼 흡수 시간을 포함한 값

## 권장 챕터 수

권장 챕터 수는 총 5개 문서다.

1. \`01-prologue.md\`
2. \`02-chapter-1.md\`
3. \`03-chapter-2.md\`
4. \`04-chapter-3.md\`
5. \`05-ending.md\`

이 구성이 적절한 이유는 다음과 같다.

- 프롤로그에서 세계 규칙과 플레이어 동기를 빠르게 잡을 수 있다.
- 메인 챕터 3개에 각각 다른 갈등 축을 배치할 수 있다.
- 엔딩 챕터를 별도 문서로 빼야 최종 선택과 후속 연출을 충분히 설계할 수 있다.
- 문서 분량이 과도하게 길어지지 않아 이후 수정과 참조가 쉽다.

## 챕터별 플레이타임 배분

1. 프롤로그 \`내일이 오지 않은 항구\`: 약 45분
2. 챕터 1 \`유리염 사구\`: 약 95분
3. 챕터 2 \`역항도 카델\`: 약 100분
4. 챕터 3 \`잃어버린 하루들의 진실\`: 약 130분
5. 엔딩 \`침묵 산호궁과 마지막 새벽\`: 약 110분

총합은 약 480분, 즉 8시간이다.

## 챕터별 스크립트 분량 가이드

- 프롤로그: 메인 컷신 4개, 현장 NPC 반응 대사 15줄 이상, 주요 인물 스크립트 70줄 이상
- 챕터 1: 구조 현장 대사와 가치 충돌 대화를 포함해 주요 인물 스크립트 110줄 이상
- 챕터 2: 유라 베인 협상, 시민 반응, 동료 논쟁을 포함해 주요 인물 스크립트 120줄 이상
- 챕터 3: 진실 공개와 관계 균열 장면 비중이 높으므로 주요 인물 스크립트 140줄 이상
- 엔딩: 최종 결전 전후 감정 회수와 엔딩 분기를 포함해 주요 인물 스크립트 130줄 이상

문서에 적는 스크립트는 최종 대본 확정본이 아니라
\`기획\`, \`연출\`, \`퀘스트\`, \`UI 컷신 배치\`가 공통으로 참조할 수 있는 기준본으로 본다.

## 대사 스크립트 작성 원칙

1. 각 챕터는 최소 3개의 \`플레이 가능 장면\`과 2개의 \`비전투 감정 장면\`을 가져야 한다.
2. 주요 장면 스크립트에는 반드시 \`연출\`, \`진행 목적\`, \`등장인물\`, \`대사 흐름\`이 함께 적혀야 한다.
3. 플레이어는 완전한 무성 주인공으로 두지 않고,
   짧고 단호한 선택형 문장을 말하는 구조로 작성한다.
4. 사야 렌, 라오 템, 유라 베인의 대사는
   같은 정보를 두고도 서로 다른 가치 판단이 드러나게 분리한다.
5. 사야 렌은 메인 히로인 축이므로
   설명자 역할에 머물지 않고 플레이어와의 신뢰, 미묘한 끌림,
   결별 공포가 챕터마다 누적되게 쓴다.
6. 백야의 대사는 항상 정답을 직접 말하지 않고,
   미래형, 회상형, 은유형 표현으로 반 박자 늦게 꽂히게 쓴다.
7. 각 장면 끝에는 다음 탐험 목표가 한 문장으로 선명하게 남아야 한다.

## 인물별 화법 가이드

### 플레이어

- 짧게 묻고 빠르게 결론 내리는 화법
- 죄책감과 책임감을 숨기려 하지만 중요한 순간에는 감정이 새어 나옴
- 예시 어조: "지금 판단해야 해.", "그 이름, 어디서 들었지.", "내가 본 장면이 맞다면 늦었어."

### 사야 렌

- 차분하고 정리된 문장
- 감정을 숨기지만 특정 대상, 특히 가족과 플레이어, 새벽종 이야기가 나오면 미세하게 호흡이 흔들림
- 플레이어 앞에서는 평정을 유지하려 할수록 말끝에 진심이 먼저 새어 나옴
- 예시 어조: "정황을 먼저 맞추자.", "확신은 없어도 가능성은 충분해.", "이번엔 놓치지 않을 거야.", "네가 다치는 전개는 기록으로도 싫어."

### 라오 템

- 현장형, 직설형, 생존 우선 화법
- 비꼼이 섞이지만 사람을 안심시키는 리듬이 있음
- 예시 어조: "말은 나중에 해.", "죽을 사람부터 살리고 따지자.", "그 질서가 배를 띄워 주진 않아."

### 유라 베인

- 논리적이고 절제된 통치자 화법
- 상대를 얕보지 않지만 감정으로 설득하지도 않음
- 예시 어조: "희생을 계산하지 않는 통치는 없다.", "감정은 이해하지만 결정은 별개야.", "네 선택의 비용을 네가 감당해라."

### 백야

- 시처럼 들리지만 장면의 핵심을 찌르는 문장
- 현재, 과거, 미래 시제를 일부러 섞어 사용
- 예시 어조: "아직 끝나지 않은 아침이 울고 있어.", "너는 이미 한 번 저 문을 닫았어.", "남겨 둔 마음이 나를 만들었지."

## 장면 스크립트 문서화 형식

각 챕터 문서의 스크립트는 아래 형식을 기본으로 삼는다.

### 장면 제목

- 연출: 화면, 카메라, 사운드, 상호작용 상태
- 진행 목적: 플레이어가 이 장면에서 반드시 얻어야 하는 정보나 감정
- 등장인물: 장면에 실제로 목소리를 내는 인물
- 스크립트:
- 인물명: "실제 사용 가능한 기준 대사"
- 인물명: "감정 전환이 필요한 후속 대사"
- 마무리 포인트: 다음 목적지나 전투/탐험으로 연결되는 한 줄

## 제작 파이프라인 메모

- 기획 단계에서는 먼저 챕터별 \`필수 장면 리스트\`를 잠그고,
  이후 세부 대사를 늘리는 순서가 안전하다.
- UI 컷신 제작 시 한 장면의 강제 대사 길이는
  90초를 넘기지 않도록 잘라 두는 편이 좋다.
- 전투 직전 대사는 전투 실패를 고려해
  반복 시에도 피로가 적은 길이로 조정해야 한다.
- 탐험 중 트리거 대사는 같은 장면 핵심을 다른 길이로 나눈
  \`첫 진입용\`, \`재진입용\`, \`전투 후용\` 3종 세트를 권장한다.

## 메인 시나리오 핵심 흐름

1. 플레이어는 \`등외항 미라진\`에서 사라진 새벽을 직접 목격한다.
2. \`새벽종\`이 일곱 조각으로 흩어졌다는 사실이 밝혀진다.
3. 각 세력은 종편을 서로 다른 이유로 붙들고 있으며,
   플레이어는 그 논리가 모두 불완전한 진실임을 체감한다.
4. 중반 이후 플레이어는 자신이 현재 질서를 만든 원죄와 연결된 존재라는 사실을 알게 된다.
5. 최종적으로 플레이어는 미래를 통제할지, 해방할지, 자신이 매개체가 될지를 선택한다.

## 챕터별 종편 회수 계획

- 프롤로그: 종편 위치와 전체 목표를 확인한다.
- 챕터 1: 1번, 2번 종편 회수
- 챕터 2: 3번, 4번 종편 회수
- 챕터 3: 5번, 6번 종편 회수
- 엔딩: 7번 종편 회수 및 새벽종 최종 결정

모든 종편을 각각 별도 챕터로 빼지 않고,
한 챕터 안에서 \`핵심 종편 1개 + 보조 종편 1개\` 구조로 묶는 것이
8시간 분량을 유지하는 데 효율적이다.

## 챕터별 정서 곡선

- 프롤로그: 혼란, 불길함, 개인적 죄책감
- 챕터 1: 생존 현장 체감, 책임감, 첫 신뢰 형성
- 챕터 2: 정치적 긴장, 가치 충돌, 불안한 동맹
- 챕터 3: 진실 노출, 관계 균열, 자기 정체성 붕괴
- 엔딩: 감정 회수, 결단, 불완전하지만 명확한 상실

## 제작 관점의 장별 역할

## 프롤로그

- 이동, 조사, 기본 전투 튜토리얼
- 세계관과 메인 목표 제시
- 플레이어 실루엣 떡밥 심기

## 챕터 1

- 필드 탐험과 구조형 퀘스트 중심
- 염해 길드와 조율원의 가치 차이 체험
- 메인 모험 파티 리듬 형성

## 챕터 2

- 입체 맵과 시간 퍼즐 확장
- 재상인 유라 베인의 논리와 압박 제시
- 세력 간 정치 드라마 본격화

## 챕터 3

- 대사 비중 증가
- 플레이어 정체성과 세계 진실 공개
- 동료 간 입장 차이를 실제 갈등으로 전환

## 엔딩

- 최종 던전 집중 설계
- 종편 회수의 결과를 전투와 선택으로 회수
- 세 가지 엔딩 분기 정리

## 공통 설계 원칙

1. 각 챕터는 반드시 \`탐험\`, \`전투\`, \`감정 대화\`, \`대형 연출\`을 모두 포함한다.
2. 각 챕터 끝에는 다음 지역 좌표나 사건 원인이 명확하게 드러나야 한다.
3. 강한 힘을 쓸수록 기억과 관계가 흔들린다는 대가 구조를 반복적으로 상기시킨다.
4. 세력은 선악이 아니라 \`미래를 다루는 방식의 차이\`로 보여 준다.
5. 엔딩 직전까지도 플레이어가 어느 진영에 더 공감하는지 단정되지 않게 유지한다.

## 필수 제작 체크포인트

- 챕터마다 최소 1개의 메인 맵 세트와 1개의 변형 맵 세트가 필요하다.
- 챕터마다 최소 1회의 보스급 전투 또는 전투 연출이 필요하다.
- 챕터마다 \`백야\`가 다른 방식으로 등장해 장기 서사 연결고리를 제공해야 한다.
- \`사야 렌\`, \`라오 템\`, \`유라 베인\`은 최소 한 번씩 플레이어와 가치 충돌을 일으켜야 한다.
- \`사야 렌\`은 각 챕터마다 최소 1회의 단독 감정 장면을 가져 메인 히로인 축을 누적한다.
- 마지막 선택은 단순 선악 분기보다 \`무엇을 잃을 것인가\`를 묻는 구조여야 한다.

## 후속 문서 활용 방식

- 기획자는 이 문서를 기준으로 맵 수, 퀘스트 수, 컷신 수를 산정한다.
- 시스템 설계자는 각 챕터의 필수 기믹을 전투와 탐험 기능으로 분해한다.
- 아트 작업자는 지역별 톤과 핵심 오브젝트를 챕터 단위로 관리한다.
- 캐릭터 디자인과 컷신 콘티 작업자는 각 챕터 문서의 \`인물 외형 포인트\`와
  \`src/content/lore/characters.md\`의 상세 외형 묘사를 함께 참조한다.
- 이후 서브 퀘스트 문서는 메인 챕터 문서의 빈 감정 구간을 보강하는 방식으로 붙인다.
- 시나리오 라이터는 본 개요 문서의 화법 가이드를 기준으로
  챕터 문서에 적힌 장면 스크립트를 실제 대본으로 확장한다.
`,mn=`# 프롤로그: 내일이 오지 않은 항구

## 챕터 개요

영원한 황혼에 잠긴 \`등외항 미라진\`에서
플레이어는 사라진 새벽의 흔적과 자신의 실루엣을 닮은 범인의 잔향을 목격한다.

이 챕터는 게임의 세계 규칙, 플레이어 능력, 메인 미스터리를 빠르게 제시하는 도입부다.
동시에 "왜 이 항해를 떠나야 하는가"에 대한 감정적 이유를 플레이어에게 심어 준다.

## 예상 플레이타임

- 약 45분
- 오프닝 컷신 5분
- 항구 탐색과 조사 15분
- 시계탑 진입과 기본 전투 15분
- 탈출 연출과 출항 준비 10분

## 주요 목표

- 미라진에서 새벽이 사라진 이유를 조사한다.
- \`여명 인양사\` 능력의 기본 사용법을 익힌다.
- \`새벽종\`이 일곱 개의 종편으로 분해되었다는 사실을 확인한다.
- 첫 항해를 결심하고 사야 렌과 임시 동맹이자 가장 먼저 등을 맡길 관계를 만든다.

## 주요 등장 인물

- 플레이어: 새벽 부재를 직접 목격한 여명 인양사
- 사야 렌: 항로 기록관, 메인 히로인, 항해의 제안자
- 라오 템: 출항 수단을 제공하는 구조선 선장
- 백야: 파편 속에서만 보이는 수수께끼의 아이
- 재상인 유라 베인: 직접 등장하지는 않지만 조율원 명령문과 음성 기록으로 존재감을 드러낸다

## 인물 외형 포인트

- 플레이어: 젖은 남청 외투와 바랜 장비 벨트, 손등에 아주 약한 새벽빛 균열 문양이 보이기 시작한다.
- 사야 렌: 정리된 아이보리 롱 코트와 은색 기록 장비, 차분하게 묶은 머리로 \`질서 있는 인물\`이라는 첫인상을 준다.
- 라오 템: 거친 구조용 재킷, 굵은 밧줄 하네스, 넓은 어깨 실루엣으로 현장형 인물임을 즉시 드러낸다.
- 백야: 젖은 새벽빛 머리와 맨발, 주변 공기보다 한 톤 밝게 뜨는 반투명 윤곽이 중요하다.
- 유라 베인: 직접 등장하지 않더라도 기록 매체 속 실루엣은 검은 제복, 백색 장갑, 날 선 어깨선으로 남겨 두면 좋다.

## 주요 사건

1. 미라진의 새벽이 오지 않는다.
2. 플레이어는 항구 수면 위에서 깨진 새벽종과 자기 닮은 실루엣의 잔향을 본다.
3. 항구 곳곳에서 시간이 삐걱거리며 주민들이 같은 불안을 반복한다.
4. 시계탑 상층에서 사야 렌이 \`새벽종의 파손\`과 \`일곱 종편\`의 존재를 확인한다.
5. 공백 법정이 남긴 균열 장치가 폭주하고, 플레이어는 탈출 과정에서 첫 전투를 치른다.
6. 라오 템의 배를 타고 첫 목적지 \`유리염 사구\`로 떠난다.

## 상세 진행 흐름

## 1. 오프닝 연출: 새벽이 끊긴 순간

- 플레이어는 항구 작업 도중 멈춰 선 파도와 붉은 하늘을 본다.
- 물 위에 비친 미래 잔향 속에서 새벽종이 깨지는 장면이 짧게 스친다.
- 실루엣의 얼굴이 자신과 닮아 있다는 불쾌한 인상이 남는다.

이 장면은 이후 스토리 전체를 끌고 가는 첫 질문을 만든다.

> "내가 본 범인은 왜 나를 닮아 있었나."

## 2. 멈춘 항구 조사

- 선창, 어시장, 채집 장비 구역을 돌아다니며 NPC 상태를 확인한다.
- 튜토리얼로 \`이동\`, \`상호작용\`, \`새벽 청취\`, \`간단한 아이템 사용\`을 배운다.
- 주민들은 각자 어긋난 미래를 짧게 중얼거린다.

예시 장면:

- 어부는 아직 오지 않은 폭풍을 기억하며 같은 밧줄을 세 번 묶는다.
- 약사는 "오늘 아침에 약을 건넸다"고 말하지만 아침이 오지 않았음을 곧 깨닫는다.
- 등대지기는 이미 끝난 밤을 또 견디는 표정으로 불빛 세기를 조정한다.

## 3. 시계탑으로 향하는 단서 수집

- 플레이어는 세 군데 조사 지점에서 파문 기록기를 복원한다.
- 기록기 세 개를 모두 맞추면 사야 렌이 남긴 신호가 재생된다.
- 신호는 시계탑 상층으로 향하라는 메시지와 함께 끊긴다.

이 구간은 간단한 조사 퍼즐과 경로 개방 역할을 한다.

## 4. 시계탑 내부 진입

- 시계탑 내부에서는 시간이 끊긴 기계장치와 균열 생물들이 등장한다.
- 기본 전투 튜토리얼로 \`선행 발자국\`, \`미도착 상처\`를 익힌다.
- 사야 렌과 합류한 뒤, 둘이 함께 상층으로 올라간다.

사야는 상황을 설명하면서도 지나치게 차분하다.
플레이어는 그녀가 단순한 기록관이 아니라
이미 오래전부터 이 사태를 추적해 왔음을 눈치챈다.

## 5. 새벽종 파손 확인

- 시계탑 최상층에서 거대한 종형 장치 \`새벽종\`의 껍데기와 파손 흔적이 드러난다.
- 사야 렌은 종편이 \`일곱 개\`라는 점, 그리고 이미 여러 세력이 조각을 가져갔을 가능성을 말한다.
- 이때 플레이어는 다시 백야를 보고 "당신은 이미 한 번 종을 울렸어"라는 말을 듣는다.

## 6. 균열 폭주와 방파제 탈출

- 공백 법정이 남겨둔 균열 장치가 작동하면서 시계탑과 항구 일부가 붕괴한다.
- 플레이어는 사야와 함께 내려오며 짧은 추격형 전투를 치른다.
- 방파제에서 소형 보스 \`황혼 파수체\`와 싸운 뒤, 라오 템의 구조선으로 도주한다.

## 장면별 상세 스크립트

### 장면 1. 수면 위에 멈춘 새벽

- 연출: 검붉은 바다 위에 금빛 새벽이 오려다 멈춘다. 주변 소리는 사라지고 파도만 역재생처럼 거꾸로 흐른다.
- 진행 목적: 플레이어가 새벽 부재를 개인적 사건으로 받아들이게 만들고, 자기 닮은 실루엣 떡밥을 박는다.
- 등장인물: 플레이어, 백야
- 스크립트:
- 플레이어: "파도가... 멈췄어. 아니, 뒤로 가고 있나."
- 플레이어: "방금 저 종소리, 분명 들었는데 왜 아침이 안 와."
- 백야: "아침은 왔어. 다만 네가 닫아 버렸지."
- 플레이어: "누구지. 어디서 말하는 거야."
- 백야: "바다를 보지 말고 물에 비친 너를 봐."
- 플레이어: "저 얼굴... 나야?"
- 백야: "닮았지. 잊은 사람은 늘 자기 그림자를 범인이라 부르니까."
- 마무리 포인트: 플레이어는 환청을 떨치지 못한 채 항구 쪽 비명을 듣고 달린다.

### 장면 2. 멈춘 어시장 조사

- 연출: NPC들이 같은 행동을 반복한다. 플레이어가 상호작용할 때마다 짧은 잔향 음성이 덧씌워진다.
- 진행 목적: 미라진 전체가 이상 현상에 잠겼다는 사실과 \`새벽 청취\` 시스템을 튜토리얼로 묶는다.
- 등장인물: 플레이어, 어부, 약사, 등대지기
- 스크립트:
- 어부: "밧줄을 세 번 묶어야 폭풍이 안 와. 분명 아까도 그랬어."
- 플레이어: "폭풍은 아직 안 왔잖아요."
- 어부: "왔어. 아니, 올 거야. 왜 다들 젖지도 않았지."
- 약사: "아침 약은 이미 나눴는데 왜 사람들 눈이 아직 밤이야."
- 플레이어: "오늘 아침을 기억하세요?"
- 약사: "기억은 나는데 냄새가 없어. 그런 아침이 있었나."
- 등대지기: "불빛 세기를 낮추면 해가 보여야 하는데, 오늘은 끝이 없어."
- 플레이어: "시계탑에서 무슨 일 있었는지 아세요?"
- 등대지기: "종이 울린 뒤로 바다가 숨을 참더군. 탑으로 가면 알겠지."
- 마무리 포인트: 세 조사 지점을 마치면 사야 렌의 파문 기록이 열린다.

### 장면 3. 사야 렌과 첫 합류

- 연출: 시계탑 중층. 깨진 기어 사이로 빛이 새고, 사야가 기록 장치를 복구한 채 서 있다.
- 진행 목적: 사야를 단순한 설명 NPC가 아니라 이미 사건을 추적 중인 인물로 세운다.
- 등장인물: 플레이어, 사야 렌
- 스크립트:
- 사야 렌: "올 줄 알았어. 잔향을 들은 사람이라면 탑으로 올 수밖에 없으니까."
- 플레이어: "당신이 신호를 보냈지. 대체 무슨 일이야."
- 사야 렌: "누군가 새벽종을 부쉈어. 그래서 미라진에서 아침이 잘려 나갔어."
- 플레이어: "새벽 하나가 사라졌다고 도시가 이렇게 망가진다고?"
- 사야 렌: "하나가 아니야. 시작이 여기였을 뿐."
- 플레이어: "당신은 언제부터 이걸 알고 있었어."
- 사야 렌: "정확히는 몰랐어. 다만 이런 형태의 침묵을 예전 기록에서 본 적이 있어."
- 플레이어: "예전 기록?"
- 사야 렌: "내 언니가 마지막으로 남긴 항로 기록. 그날도 새벽이 늦게 왔어."
- 플레이어: "그래서 혼자 조사하고 있었군."
- 사야 렌: "혼자 끝낼 생각이었는데, 이제는 아니야. 네가 종의 반응을 듣고 있으니까."
- 플레이어: "필요해서 붙잡는다는 말치곤 안심한 얼굴이네."
- 사야 렌: "그건... 부정 안 할게. 네가 탑에 들어온 순간부터 혼자라는 생각이 덜 났어."
- 마무리 포인트: 둘은 상층으로 오르며 균열 생물 첫 전투를 치른다.

### 장면 4. 새벽종 파손 확인

- 연출: 최상층. 깨진 종형 장치 내부가 비어 있고 금속보다 생체에 가까운 맥동이 남아 있다.
- 진행 목적: 일곱 종편 목표를 제시하고 백야의 두 번째 직접 개입을 넣는다.
- 등장인물: 플레이어, 사야 렌, 백야
- 스크립트:
- 플레이어: "이게 새벽종... 안쪽이 텅 비어 있어."
- 사야 렌: "비어 있는 게 아니야. 뜯겨 나간 거지."
- 플레이어: "몇 조각으로."
- 사야 렌: "기록상 핵심 공명축은 일곱 개. 전부 흩어졌다면 각지의 질서가 뒤틀릴 거야."
- 플레이어: "누가 이런 짓을 했는지 짐작 가?"
- 사야 렌: "짐작은 있어. 확신이 없을 뿐."
- 백야: "확신은 늘 늦게 도착해. 종은 벌써 두 번째로 깨졌는데."
- 플레이어: "또 너냐. 두 번째라니, 무슨 뜻이야."
- 백야: "네가 가장 잘 아는 뜻."
- 사야 렌: "누구랑 말하고 있어?"
- 플레이어: "아이 목소리. 넌 안 들려?"
- 사야 렌: "아니. 하지만 네 표정은 거짓말이 아니네."
- 마무리 포인트: 아래층 균열 장치가 폭주하면서 탈출 이벤트가 시작된다.

### 장면 5. 방파제 탈출과 라오 템의 제안

- 연출: 붕괴하는 방파제 끝. 구조선이 측면으로 미끄러져 들어오고 라오가 밧줄을 던진다.
- 진행 목적: 라오 템의 현장형 성격을 소개하고 다음 장의 목적지까지 밀어 준다.
- 등장인물: 플레이어, 사야 렌, 라오 템
- 스크립트:
- 라오 템: "둘 다 살아 있으면 뛰어. 설명은 배 위에서 해."
- 플레이어: "방파제가 무너지고 있어."
- 라오 템: "그래서 뛰라고 했지. 오늘 바다는 친절하지 않다."
- 사야 렌: "남쪽 계선장에 남은 사람들은?"
- 라오 템: "내 선원들이 태우고 있어. 네가 들고 있는 기록부터 지켜."
- 플레이어: "우릴 기다리고 있었어?"
- 라오 템: "시계탑이 저렇게 터지면 기다리는 수밖에 없지. 게다가 사야가 어제부터 이상한 항로를 계산하더군."
- 사야 렌: "첫 종편 좌표가 잡혔어. 유리염 사구야."
- 라오 템: "사구라... 좋은 소식은 아니군."
- 플레이어: "그래도 가야 해. 미라진을 이렇게 만든 조각이라면."
- 라오 템: "좋아. 다만 기억해. 바다에선 진실보다 먼저 사람부터 건진다."
- 마무리 포인트: 라오의 구조선이 미라진을 떠나며 챕터가 종료된다.

## 핵심 대사 또는 감정 흐름

- 사야 렌: "새벽이 사라진 게 아니야. 누군가 가져간 거야."
- 라오 템: "지금 바다에 필요한 건 설명보다 출항이야. 남은 사람부터 살리자."
- 백야: "당신은 잊었을 뿐이야. 끝난 적은 없어."

감정 흐름은 다음 순서로 가져간다.

1. 불길한 혼란
2. 개인적 죄책감
3. 진실을 추적해야 한다는 의무감
4. 아직 서로 다 알지 못하지만 함께 나아가야 한다는 긴장과 첫 신뢰

## 탐험 / 전투 / 연출 포인트

- 탐험: 황혼에 잠긴 미라진 선창, 멈춘 어시장, 시계탑 내부
- 전투: 균열 갈매기, 시간에 젖은 하역 인형, 황혼 파수체
- 연출: 바다 위에 비친 깨진 새벽, 종 내부의 공허, 붕괴하는 방파제 출항
- 시스템 포인트: 이동과 조사 튜토리얼, 기본 전투, 미래 잔향 읽기

## 챕터 종료 조건

- 플레이어가 사야 렌과 함께 항해 계약을 맺는다.
- 라오 템의 배를 타고 미라진을 떠난다.
- 첫 목적지가 \`유리염 사구\`임이 명확해진다.

## 다음 챕터로 넘어가는 연결

사야 렌은 미라진의 항로 기록과 깨진 종의 공명을 대조해
첫 종편이 \`유리염 사구의 폐채굴 첨탑\`에 있을 가능성이 높다고 말한다.

동시에 조율원 공문 일부가 발견되며,
미라진의 새벽 정지가 단순 사고가 아니라
의도된 봉쇄였을 가능성이 제시된다.

## 제작 참고 메모

- 프롤로그 맵은 \`허브형 항구 + 소형 던전형 시계탑\`의 2단 구조가 적합하다.
- 컷신은 너무 길게 끌지 말고 플레이 가능한 조사와 전투를 빠르게 넣는다.
- 플레이어 실루엣 떡밥은 선명하게 보여 주되 정답처럼 보이면 안 된다.
- 프롤로그 종료 시점에는 세계관보다 "개인적 수수께끼"가 더 강하게 남아야 한다.
- 주요 인물 대사는 짧지만 날카롭게 가져가고,
  현장 NPC 대사는 미라진 전체가 이미 시간 이상에 잠겼다는 증거처럼 배치한다.
`,fn=`# 챕터 1: 유리염 사구, 미래가 메마른 땅

## 챕터 개요

첫 항해의 목적지인 \`유리염 사구\`는
내일결 남획으로 미래 자체가 비어 버린 지역이다.

이 챕터는 플레이어가 세계의 고통을 처음으로 체감하는 장이다.
조율원의 통제 논리와 염해 길드의 생존 논리가
현장에서 어떻게 충돌하는지를 보여 주고,
플레이어가 처음으로 두 개의 종편을 손에 넣는다.

## 예상 플레이타임

- 약 95분
- 사구 외곽 도착과 구조 요청 대응 20분
- 사막 탐험과 채굴 첨탑 공략 35분
- 구조선 방어전과 1번 종편 회수 20분
- 숨겨진 인양선 조사와 2번 종편 확보 20분

## 주요 목표

- 유리염 사구에서 첫 종편의 정확한 위치를 찾는다.
- 라오 템과 함께 구조 활동을 수행하며 지역의 현실을 체감한다.
- 조율원 보급대와 염해 길드가 대립하는 이유를 직접 본다.
- 1번, 2번 종편을 회수해 첫 성과를 만든다.

## 주요 등장 인물

- 플레이어
- 사야 렌
- 라오 템
- 백야
- 조율원 현장감독들
- 염해 길드 구조선 승무원들

## 인물 외형 포인트

- 플레이어: 소금과 유리 가루가 눌어붙은 외투, 사막용 천을 급히 둘러 쓴 얼굴선으로 초반 항해의 소모를 보여 준다.
- 사야 렌: 모래막이 후드와 얇은 보호 고글을 추가해도 기본의 정돈된 기록관 실루엣은 유지돼야 한다.
- 라오 템: 패치가 많은 방풍 망토, 물통과 구조 갈고리, 사막을 버틴 사람 같은 마른 강인함이 잘 보여야 한다.
- 백야: 소금 결정 위에 남는 희미한 젖은 발자국, 멀리서도 눈에 띄는 희백색 윤곽이 적합하다.
- 조율원 현장감독: 먼지 하나 허용하지 않는 제복, 측정 장치가 많은 직선형 실루엣으로 \`관리\`를 시각화한다.
- 염해 길드 승무원: 기능성 천과 보강 장갑, 물자 꾸러미가 달린 비대칭 장비 구성으로 \`구조와 생존\`을 보여 준다.

## 주요 사건

1. 사구 외곽 역참이 시간폭풍에 휘말리고, 플레이어 일행은 구조 작업에 뛰어든다.
2. 조율원은 채굴 설비 복구를 우선시하고, 염해 길드는 고립된 주민 구출을 우선시한다.
3. 플레이어는 폐채굴 첨탑 중심부에서 1번 종편을 회수한다.
4. 종편 공명으로 오래전 침몰한 인양선의 위치가 드러난다.
5. 라오 템은 자신이 숨겨 두었던 2번 종편의 존재를 털어놓고, 결국 플레이어에게 맡긴다.

## 상세 진행 흐름

## 1. 사구 상륙과 첫 구조

- 배가 사구에 접근하자 유리처럼 굳은 모래폭풍이 시야를 가른다.
- 역참 생존자들은 "도착하지 않은 내일"의 환청을 듣고 패닉 상태에 빠져 있다.
- 플레이어는 구조, 응급 회복, 경로 확보를 반복하며 현장의 절박함을 느낀다.

이 구간에서 라오 템의 세계관이 또렷해진다.

> "미래를 누가 가져가든 지금 물 한 모금 없는 사람은 오늘 죽어."

## 2. 조율원과 염해 길드의 충돌

- 조율원 현장감독은 채굴 첨탑의 동력 회복 없이는 더 큰 재난이 온다고 주장한다.
- 염해 길드는 그 설비가 이미 너무 많은 미래를 빨아들여 사구를 망쳤다고 반박한다.
- 플레이어는 어느 쪽 주장에도 일리가 있다는 점을 본다.

이 대립은 선악 판단이 아니라
\`전체 안정\`과 \`현장 생존\` 사이의 충돌로 보여 주는 것이 중요하다.

## 3. 폐채굴 첨탑 공략

- 사구 깊숙한 곳의 첨탑 내부는 굳은 소금층과 미래 환청으로 가득하다.
- 퍼즐은 \`기억 닻\`을 사용해 무너지는 발판 순서를 잠깐 고정하는 방식으로 구성한다.
- 중간에는 아직 오지 않은 자신들의 대화를 먼저 듣는 연출을 넣어
  불길한 예감을 쌓는다.

## 4. 1번 종편 회수

- 첨탑 최하층의 채굴 심장부에는 과도한 채집 때문에 변형된 보스 \`유리염 거신\`이 있다.
- 보스를 쓰러뜨리면 1번 종편이 드러나고,
  플레이어는 잠깐 첫 역조 시기의 파편 영상을 본다.
- 영상 속 누군가가 "미래는 남겨야 할 자에게만 배급하라"고 말한다.

이 장면은 플레이어가 현재 질서의 잔혹함과 필요성을 동시에 느끼게 만들어야 한다.

## 5. 구조선 방어전

- 첨탑에서 나온 직후 사구 외곽 구조선이 균열 생물에게 습격당한다.
- 플레이어는 사야와 라오 사이에서 빠른 판단을 강요받는다.
- 전투는 넓은 사막에서 벌어지는 방어형 전투로 구성하고,
  이동과 보호 오브젝트 사용을 강조한다.

## 6. 2번 종편의 정체

- 방어전 이후 라오 템은 과거 자신이 구조 중 회수해 숨겨 두었던 종편 하나가 있다고 고백한다.
- 그는 조율원이 그 조각을 가져가면 또 다른 도시를 희생시킬 것이라 믿고 있었다.
- 플레이어는 침몰한 인양선 잔해에서 그 종편을 직접 확인하고 인계받는다.

이때 라오는 처음으로 플레이어를 완전히 신뢰하지는 않지만,
적어도 조율원보다 나은 선택지를 만들 수 있으리라 기대한다.

## 장면별 상세 스크립트

### 장면 1. 유리염 폭풍 속 상륙

- 연출: 배 앞유리에 소금 결정이 자라며 시야를 가른다. 배가 멈출 때마다 멀리서 구조 신호등이 깜빡였다 사라진다.
- 진행 목적: 사구의 참상을 첫 화면에서 체감시키고, 라오 템의 현장 리더십을 보여 준다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 구조 요청 주민
- 스크립트:
- 라오 템: "닻 내리지 마. 모래가 배 밑을 갈아먹고 있어. 얕은 쪽으로 붙인다."
- 사야 렌: "저 신호는 역참에서 보내는 거야. 세기가 불규칙해."
- 플레이어: "사람이 살아 있으면 가야 해."
- 라오 템: "그래. 하지만 선에서 떨어지면 네 발밑 시간이 먼저 꺼진다. 내 발자국만 따라와."
- 주민: "물... 물이 아니라 내일이라도 좀 남았으면..."
- 플레이어: "정신 차리세요. 몇 명이 남았죠?"
- 주민: "셋이 첨탑 쪽에 갔고 둘은 모래에 묻혔어. 조율원은 장치부터 살리라 했는데..."
- 라오 템: "장치는 도망 안 간다. 사람부터 꺼낸다."
- 사야 렌: "기록은 해 둘게. 나중에 책임을 물을 수 있도록."
- 플레이어: "둘 다 맞아. 구조하면서도 누가 뭘 막았는지 남겨 두자."
- 마무리 포인트: 플레이어는 응급 구조 튜토리얼과 첫 필드 이동을 수행한다.

### 장면 2. 조율원 현장감독과 공개 충돌

- 연출: 부서진 보급탑 아래에서 조율원과 염해 길드가 대치한다. 바람에 따라 대화 일부가 끊겨 긴장이 더 커진다.
- 진행 목적: 챕터 1의 핵심 가치 충돌을 정면으로 드러낸다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 조율원 현장감독
- 스크립트:
- 조율원 현장감독: "채굴 첨탑 동력을 복구하지 않으면 이 일대 시간폭풍이 세 배로 커진다."
- 라오 템: "그래서 사람을 모래에 파묻어 두고 기계를 먼저 세우겠다고?"
- 조율원 현장감독: "열 명을 살리기 위해 백 명을 잃을 수는 없다."
- 라오 템: "그 계산표에 늘 네 얼굴은 없더군."
- 사야 렌: "감독관 말에도 근거는 있어. 첨탑이 완전히 무너지면 사구 전체가 쪼개질 가능성이 커."
- 플레이어: "둘 다 들어. 구조를 멈출 생각은 없지만 첨탑도 확인해야 해."
- 조율원 현장감독: "그 말이 진심이라면, 남쪽 승강로 열쇠를 가져가라. 대신 결과는 네가 책임져."
- 라오 템: "좋아. 책임은 현장에서 지는 거다. 서류에서 지는 게 아니라."
- 사야 렌: "플레이어, 먼저 역참 생존자부터 정리하자. 그다음 첨탑으로 가면 돼."
- 플레이어: "그래. 둘 중 하나만 고르라는 식으론 안 끝낼 거야."
- 마무리 포인트: 플레이어가 구조와 첨탑 공략을 병행하는 챕터 목표를 확정한다.

### 장면 3. 폐채굴 첨탑 하강

- 연출: 소금 기둥과 붉은 균열이 뒤엉킨 수직 갱도. 아래로 내려갈수록 미래 잔향이 실제 음성처럼 들린다.
- 진행 목적: 불길한 세계관 체험과 사야의 분석형 면모를 강화한다.
- 등장인물: 플레이어, 사야 렌, 백야
- 스크립트:
- 플레이어: "방금... 우리가 아직 하지도 않은 말을 들었어."
- 사야 렌: "미래 잔향이 앞당겨 새는 거야. 여기선 시간 순서가 의미 없어."
- 플레이어: "익숙한 것처럼 말하네."
- 사야 렌: "익숙하진 않아. 다만 이런 기록을 쫓아다닌 시간이 길었을 뿐."
- 백야: "위에서 떨어진 말은 아래에서 먼저 들려. 그래서 사람들은 늘 늦게 후회하지."
- 플레이어: "또 들리기 시작했어."
- 사야 렌: "이번에도 그 아이?"
- 플레이어: "응. 넌 정말 안 들려?"
- 사야 렌: "안 들려. 하지만 네 반응은 기록해 둘 가치가 있어."
- 플레이어: "기록 말고, 걱정은 안 돼?"
- 사야 렌: "걱정하고 있어. 그래서 더 정확히 알아야 해. 네가 다치는 장면은 더 보고 싶지 않으니까."
- 마무리 포인트: 플레이어는 \`기억 닻\` 퍼즐을 풀며 심장부로 진입한다.

### 장면 4. 유리염 거신 격파 직후

- 연출: 보스가 무너진 뒤 사막 전체에 잠시 잔잔한 파문이 퍼진다. 종편이 붉은 소금층 안에서 맥동한다.
- 진행 목적: 첫 종편 획득의 무게와 플레이어가 종편 보유자가 되는 책임감을 강조한다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 백야
- 스크립트:
- 플레이어: "이게... 첫 번째 조각."
- 사야 렌: "가까이 가면 종의 반응이 다시 올 거야. 준비해."
- 플레이어: "손을 대는 순간 누가 말했어. 미래는 남겨야 할 자에게만 배급하라고."
- 라오 템: "듣기만 해도 속이 뒤집히는군. 저 말대로 해서 이 사막이 이렇게 된 거잖아."
- 사야 렌: "그래도 장치가 완전히 사라지면 더 큰 붕괴가 올 수도 있어."
- 플레이어: "둘 다 알겠어. 그래서 더 함부로 못 움직이겠어."
- 백야: "종을 쥔 손이 처음 떨렸네. 그건 아직 늦지 않았다는 뜻이야."
- 플레이어: "날 시험하는 거라면 관둬."
- 백야: "시험은 네가 이미 끝냈어. 지금은 채점만 남았지."
- 라오 템: "둘이 누구랑 싸우는지 몰라도, 바깥 구조선이 위험하다. 생각은 뛰면서 해."
- 마무리 포인트: 구조선 방어전으로 즉시 넘어간다.

### 장면 5. 구조선 방어전 후 라오의 고백

- 연출: 밤으로 굳은 사막 한복판. 부서진 인양선 잔해에 작은 등불이 매달려 있다.
- 진행 목적: 2번 종편을 인물 선택으로 얻도록 설계하고, 라오와 플레이어의 신뢰를 쌓는다.
- 등장인물: 플레이어, 라오 템, 사야 렌
- 스크립트:
- 라오 템: "숨길 생각은 오래전에 끝났어. 다만 넘길 사람이 없었지."
- 플레이어: "2번 종편이 여기 있다는 거지."
- 라오 템: "맞아. 예전에 구조하다가 찾았어. 그날 난 도시 하나가 배급표에서 지워지는 걸 봤다."
- 사야 렌: "그래서 조율원에 보고하지 않았군."
- 라오 템: "보고하면 봉인이라는 이름으로 또 다른 도시를 묶을 게 뻔했으니까."
- 플레이어: "왜 지금은 내게 주려 해."
- 라오 템: "너도 완전히 믿진 않아. 하지만 적어도 눈앞 사람을 숫자로 읽는 눈은 아니더라."
- 사야 렌: "그 판단이 맞길 바라. 우리에게 남은 선택지가 많지 않으니까."
- 플레이어: "맡길 거면 끝까지 책임질게. 이 조각으로 누굴 더 희생시키진 않겠어."
- 라오 템: "좋아. 그 말, 나중에도 그대로 말해."
- 마무리 포인트: 두 종편이 공명하며 카델 좌표가 열린다.

## 핵심 대사 또는 감정 흐름

- 라오 템: "질서가 사람을 살렸다면 이 사막은 왜 이렇게 비었겠어."
- 사야 렌: "그래도 무너지는 걸 그냥 둘 순 없어. 종이 없으면 더 많은 도시가 끝나."
- 백야: "두 번째 종은 오래전에 한 번 숨겨졌어. 이번엔 누구를 위해 숨길래?"

감정 흐름은 다음과 같다.

1. 현장 생존의 처참함 체감
2. 라오에 대한 신뢰 형성
3. 사야의 냉정함 뒤에 숨은 걱정이 드러나며 미묘한 끌림 형성
4. 플레이어가 처음으로 \`종편을 가진 사람\`이 되는 책임감

## 탐험 / 전투 / 연출 포인트

- 탐험: 유리 모래 사구, 폐채굴 첨탑, 침몰 인양선 잔해
- 전투: 시간폭풍 속 구조전, 유리염 거신 보스전, 구조선 방어전
- 연출: 모래가 아닌 미래의 목소리가 울리는 사막, 채굴 심장부의 붉은 균열, 사막 한가운데 떠오르는 침몰선 그림자
- 시스템 포인트: 넓은 필드 탐험, 구조형 목표, 환경 위험지대, 기억 닻 활용 퍼즐

## 챕터 종료 조건

- 플레이어가 1번 종편과 2번 종편을 모두 확보한다.
- 라오 템이 메인 파티의 확실한 협력자로 자리 잡는다.
- 조율원이 \`역항도 카델\`에 3번 종편을 보관 중이라는 단서를 얻는다.

## 다음 챕터로 넘어가는 연결

1번 종편과 2번 종편이 함께 공명하면서
\`역항도 카델\` 상공의 왜곡 좌표가 드러난다.

사야 렌은 카델이 현재 조율원의 핵심 거점이며,
재상인 유라 베인이 직접 종편을 관리하고 있을 가능성이 높다고 말한다.

라오 템은 "그 도시에서 사람보다 질서가 먼저라면 반드시 썩은 자리가 있을 것"이라고 경고한다.

## 제작 참고 메모

- 챕터 1은 메인 필드 탐험의 기준이 되므로 지나치게 복잡한 분기보다 밀도 있는 현장 사건에 집중한다.
- 라오 템의 호감도와 신뢰는 이 장에서 확실히 쌓아야 후반 갈등이 살아난다.
- 2번 종편은 대형 보스보다 \`인물 선택과 신뢰\`로 얻는 조각으로 설계해 반복감을 줄인다.
- 구조 현장 대사는 NPC 절규만 반복하지 말고,
  생존자마다 \`도착하지 않은 내일\`을 다르게 기억하는 식으로 변주를 준다.
`,yn=`# 챕터 2: 역항도 카델, 거꾸로 매달린 질서

## 챕터 개요

\`역항도 카델\`은 배가 하늘의 흐름에 거꾸로 정박하는 도시 국가이자
조율원의 통제 철학이 가장 완벽하게 구현된 장소다.

이 챕터는 정치적 압박과 입체 탐험이 중심이다.
플레이어는 재상인 \`유라 베인\`을 직접 만나고,
질서를 지키기 위한 희생이 실제로 어떤 얼굴을 하고 있는지 마주한다.

## 예상 플레이타임

- 약 100분
- 역항도 진입과 도시 구조 적응 20분
- 유라 베인과의 협상 및 내부 조사 20분
- 중력 전환 퍼즐과 시민 구출 20분
- 3번 종편 회수와 도시 코어 방어전 20분
- 비밀 금고 진입과 4번 종편 확보 20분

## 주요 목표

- 카델에 잠긴 3번 종편과 4번 종편을 확보한다.
- 유라 베인의 통제 논리를 직접 듣고 판단한다.
- 공백 법정이 카델 내부를 흔들고 있다는 사실을 확인한다.
- 조율원의 질서가 단순한 악의가 아니라 붕괴 공포에서 비롯되었음을 체감한다.

## 주요 등장 인물

- 플레이어
- 사야 렌
- 라오 템
- 재상인 유라 베인
- 백야
- 카델 시민들
- 공백 법정 침투자들

## 인물 외형 포인트

- 플레이어: 중력 전환 장치에 맞춰 보강한 장화와 금속 고리, 항해 장비 위에 덧댄 임시 안전 장치가 보이면 좋다.
- 사야 렌: 부유하는 종이 태그와 접이식 지도 장치, 정돈된 실루엣 위에 카델용 보조 고정구를 더해 \`적응하는 기록관\`을 보여 준다.
- 라오 템: 중력 고리와 자석 갈고리를 덕지덕지 덧댄 현장형 복장으로, 도시 규칙에도 결국 몸으로 대응하는 인물처럼 보이게 한다.
- 유라 베인: 흑청과 냉백의 수직 제복, 금속 견장과 장갑, 정면을 향한 자세만으로도 통치자의 압박감이 느껴져야 한다.
- 백야: 위아래가 뒤집힌 공간에서도 중력 영향을 받지 않는 듯 천천히 떠 있는 연출이 잘 어울린다.
- 카델 시민: 상층은 단정한 조율원식 실루엣, 하층은 마모된 작업복과 보조 장치가 많은 형태로 격차를 시각화한다.

## 주요 사건

1. 카델은 3번 종편을 중심축으로 삼아 도시의 중력과 시간 흐름을 유지하고 있다.
2. 유라 베인은 종편을 함부로 떼어 낼 경우 도시 전체가 붕괴할 수 있다고 경고한다.
3. 공백 법정이 도시 코어를 먼저 파괴하려 하며 혼란이 폭발한다.
4. 플레이어는 시민 구출과 코어 안정화에 협력한 뒤 3번 종편을 회수한다.
5. 유라 베인이 별도로 숨겨 두었던 4번 종편의 존재가 드러난다.
6. 유라는 그것을 내주되, 플레이어가 어떤 미래를 만들지 끝까지 지켜보겠다고 선언한다.

## 상세 진행 흐름

## 1. 거꾸로 선 항구 진입

- 카델에 도착하면 건물과 선착장이 천장 방향으로 뻗어 있는 비정상적 풍경이 펼쳐진다.
- 중력 방향이 지역마다 달라 이동 자체가 퍼즐이 된다.
- 플레이어는 카델이 종편을 단순 보관하는 곳이 아니라
  \`도시 유지 장치\`로 쓰고 있음을 곧 알게 된다.

## 2. 유라 베인과 첫 대면

- 유라는 플레이어를 적대하기보다 관찰 대상으로 대한다.
- 그녀는 미라진의 새벽 정지가 카델 붕괴를 막기 위한 긴급 봉쇄였다고 밝힌다.
- 즉, 미라진은 카델을 살리기 위해 희생된 셈이다.

이 대면은 유라를 악역이 아니라
\`냉혹하지만 무능하지 않은 통치자\`로 자리 잡게 만드는 핵심 장면이다.

## 3. 내부 조사와 균열 징후

- 플레이어는 도시 하층, 상층 부두, 조율원 보급 회랑을 오가며 이상 징후를 조사한다.
- 일부 시민은 안정된 생활을 유지하고 있어 조율원 체제의 효율을 직접 보여 준다.
- 반면 하층 노동 구역은 내일결 부족으로 무너지고 있어 내부 격차도 드러난다.

## 4. 공백 법정 침투 사건

- 공백 법정 침투자들이 중력 전환 장치를 무력화하며 도시가 흔들린다.
- 플레이어는 추격전과 시민 구조를 병행해야 한다.
- 라오 템은 시민을 먼저 구해야 한다고 주장하고,
  사야는 코어 붕괴를 막지 못하면 구조도 의미 없다고 주장한다.

이 구간에서 동료 둘의 관점 차이를 플레이 차원에서 체감하게 만든다.

## 5. 3번 종편 회수

- 도시 중심의 \`천정 심실\`에서 보스전이 발생한다.
- 보스는 종편 에너지를 흡수한 공백 법정의 균열 잠수사 \`역추자\`다.
- 격파 후 유라는 카델을 살릴 임시 조율 장치를 가동하고,
  플레이어는 3번 종편을 회수한다.

유라는 이 선택이 옳은지 확신하지 못하지만,
플레이어를 믿기보다는 \`지켜볼 가치가 있다\`고 판단한다.

## 6. 4번 종편 비밀 금고

- 사야 렌은 조율원 문서에서 종편 수량이 맞지 않는다는 사실을 발견한다.
- 플레이어는 유라의 허가 아래 조율원 금고에 들어가고,
  거기서 4번 종편이 따로 봉인되어 있음을 확인한다.
- 유라는 "모든 가능성을 한 사람에게 넘기지 않기 위해" 일부를 숨겼다고 털어놓는다.

결국 그녀는 4번 종편을 넘기며,
플레이어가 실패하면 자신이 직접 종을 다시 봉인하겠다고 못 박는다.

## 장면별 상세 스크립트

### 장면 1. 거꾸로 매달린 항구 입성

- 연출: 카메라가 위아래를 뒤집으며 선착장이 천장으로 이어진다. 시민들은 익숙하다는 듯 반전 중력 구간을 걸어 다닌다.
- 진행 목적: 카델의 경이와 위화감을 동시에 주고, 플레이어 일행이 이 도시의 질서를 체감하게 만든다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 카델 안내원
- 스크립트:
- 카델 안내원: "발판의 청색선 안에서는 하늘이 아래입니다. 처음 오신 분은 손잡이를 놓지 마십시오."
- 라오 템: "안내문부터 사람을 겁주는군."
- 사야 렌: "도시 전체가 종편 공명축에 기대고 있으니 이런 방식이 가장 효율적이겠지."
- 플레이어: "효율적이라는 말이 자꾸 불편해."
- 카델 안내원: "불편함은 적응으로 해결됩니다. 붕괴는 적응으로 해결되지 않지만요."
- 라오 템: "여긴 시민도 말투가 유라 베인 같네."
- 사야 렌: "그만. 우릴 지켜보는 눈이 많아."
- 플레이어: "좋아. 먼저 도시가 어떻게 버티는지부터 보자."
- 마무리 포인트: 안내원이 재상청으로 인도하며 첫 협상 장면으로 이어진다.

### 장면 2. 유라 베인과 첫 협상

- 연출: 창문 바깥으로 역방향 선박들이 떠 있고, 유라는 탁자 대신 도시 축소 홀로그램 옆에 서 있다.
- 진행 목적: 유라를 설득력 있는 통치자로 제시하고, 미라진 봉쇄의 진실을 던진다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 유라 베인
- 스크립트:
- 유라 베인: "환영 인사는 생략하지. 너희는 종편을 찾고, 나는 도시를 유지해야 해. 목적이 다르니 바로 본론으로 가자."
- 플레이어: "미라진의 새벽을 묶은 게 당신이야?"
- 유라 베인: "정확히는 내가 승인한 봉쇄 조치지. 카델 축이 흔들리던 시각과 겹쳤다."
- 라오 템: "한 도시 아침을 잘라 다른 도시 기둥으로 썼다는 말이군."
- 유라 베인: "표현은 자극적이지만 사실과 크게 다르지 않아."
- 사야 렌: "그 결정으로 미라진 주민이 어떤 상태에 빠졌는지 알고도?"
- 유라 베인: "알고도 했다. 모른 척할 정도로 무능하진 않아."
- 플레이어: "그렇게까지 해야 했다면, 당신도 이 체계가 정상이 아니라는 걸 아는 거겠지."
- 유라 베인: "정상인 체계는 없다. 버티는 체계만 있을 뿐."
- 라오 템: "그래서 사람을 부품으로 만든다?"
- 유라 베인: "아니. 부품이 되는 사람을 줄이려 계산한다."
- 마무리 포인트: 유라는 도시 조사 권한을 주되 3번 종편 회수는 불허한다.

### 장면 3. 하층 노동 구역 조사

- 연출: 상층은 안정된 빛으로 반짝이지만 하층은 공명 부족으로 조명이 깜빡인다. 같은 도시의 다른 얼굴이 선명히 대비된다.
- 진행 목적: 조율원 체제의 효율과 한계를 동시에 보여 준다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 하층 노동자
- 스크립트:
- 노동자: "상층 사람들은 오늘도 하늘이 예쁘다더군. 우린 오늘이 몇 분 남았는지도 몰라."
- 플레이어: "배급량이 이렇게 차이 나?"
- 노동자: "도시를 떠받치는 구역이라면서 늘 부족하대. 떠받치는 사람이 먼저 무너지는 셈이지."
- 사야 렌: "자료상으론 하층 공급이 줄어든 시점이 최근이야. 누군가 더 강하게 쥐고 있어."
- 라오 템: "질서라는 말은 늘 위에서부터 단정하군."
- 노동자: "그래도 완전히 무너지진 않았어. 조율원이 없었으면 벌써 다 떨어졌을 거라는 말도 틀리진 않아."
- 플레이어: "그래서 더 복잡해. 누가 완전히 틀렸다고도 못 하겠어."
- 사야 렌: "그 복잡함을 외면하면 우리도 같은 실수를 반복할 거야."
- 마무리 포인트: 공백 법정 침투 흔적과 중력 전환 장치 이상이 드러난다.

### 장면 4. 코어 붕괴 직전의 동료 충돌

- 연출: 경보음 속에서 도시는 90도로 비틀리고, 멀리 시민들이 천장으로 미끄러진다.
- 진행 목적: 사야와 라오의 갈등을 플레이 체감 수준으로 끌어올린다.
- 등장인물: 플레이어, 사야 렌, 라오 템
- 스크립트:
- 사야 렌: "코어실부터 닫아야 해. 저게 열리면 구조 자체가 의미 없어."
- 라오 템: "지금 저 아래로 떨어지는 사람들은 의미가 없다는 거냐."
- 사야 렌: "그런 뜻이 아니야. 다만 둘 다 살리려면 우선순위를 정해야 한다는 거지."
- 라오 템: "늘 그 우선순위에서 밀리는 쪽이 누군데."
- 플레이어: "둘 다 멈춰. 코어실까지 가는 동안 보이는 시민은 전부 구한다. 그 대신 속도를 늦추진 마."
- 사야 렌: "가능은 해. 하지만 한 명이라도 놓치면 네 판단 탓이 될 거야."
- 라오 템: "좋아. 그 정도 짐은 같이 들어 주지."
- 플레이어: "그럼 움직여. 싸우는 건 모두 살리고 나서 해."
- 마무리 포인트: 시민 보호전과 코어실 전투가 하나의 연속 시퀀스로 진행된다.

### 장면 5. 3번 종편 회수 뒤 유라의 평가

- 연출: 역추자가 쓰러진 뒤 중심축이 불안정하게 맥동한다. 유라가 임시 조율 장치를 손수 기동한다.
- 진행 목적: 유라가 플레이어를 잠재적 동맹 혹은 위협으로 보는 시점을 명확히 한다.
- 등장인물: 플레이어, 유라 베인, 사야 렌, 라오 템
- 스크립트:
- 유라 베인: "종편을 뽑아도 도시가 즉시 떨어지진 않아. 다만 이제부터는 내 책임이 더 무거워졌지."
- 플레이어: "도시를 살리려면 종편이 꼭 필요하단 말은 아니었군."
- 유라 베인: "꼭 필요했다. 다만 대체 수단이 매우 비쌌을 뿐이야."
- 라오 템: "결국 선택지가 있었단 뜻이네."
- 유라 베인: "선택지는 언제나 있다. 비용을 감당할 사람이 적을 뿐."
- 사야 렌: "그럼 4번 종편도 비용 계산 때문에 숨긴 건가."
- 유라 베인: "예리하군. 맞아. 모든 가능성을 한 사람 손에 쥐여 주는 건 통치가 아니지."
- 플레이어: "그래서 날 시험했어?"
- 유라 베인: "관찰했다. 그리고 지금도 판단은 끝나지 않았어."
- 마무리 포인트: 유라는 금고 접근을 허용한다.

### 장면 6. 비밀 금고와 4번 종편 인계

- 연출: 중력 없는 백색 공간. 작은 종편이 공중에 봉인된 채 회전하고, 목소리도 약하게 울린다.
- 진행 목적: 유라가 단순 적대자가 아니라 끝까지 책임을 떠안는 인물임을 강조한다.
- 등장인물: 플레이어, 유라 베인, 사야 렌
- 스크립트:
- 유라 베인: "이 조각을 숨긴 이유는 간단해. 세계가 한 번에 무너지지 않도록 보험을 든 거지."
- 플레이어: "보험이라는 말치고는 너무 많은 사람이 피를 흘렸어."
- 유라 베인: "통치의 보험은 늘 그렇다. 표면에 드러나지 않는 대가를 먹고 버틴다."
- 사야 렌: "그걸 알면서도 내려놓지 않는군."
- 유라 베인: "내려놓는 순간 더 많은 것이 떨어진다면, 나는 당분간 악역으로 남겠다."
- 플레이어: "이걸 넘겨도 괜찮아?"
- 유라 베인: "괜찮지 않다. 그래도 넘긴다. 네가 끝까지 무엇을 잃을지 보고 싶으니까."
- 플레이어: "실패하면?"
- 유라 베인: "그땐 내가 직접 종을 다시 봉인한다. 너까지 포함해서."
- 마무리 포인트: 남은 기록이 속삭임 과수원과 척추탑을 가리킨다.

## 핵심 대사 또는 감정 흐름

- 유라 베인: "한 도시의 아침을 묶지 않았다면, 세 도시가 떨어져 나갔을 거야."
- 라오 템: "사람을 숫자로 세면 언제든 누군가는 계산에서 지워진다."
- 사야 렌: "그래도 무너뜨리는 건 쉽지. 다시 붙이는 건 늘 늦어."

감정 흐름은 다음 순서로 설계한다.

1. 경이로운 도시 구조와 낯섦
2. 유라의 논리에 대한 불쾌한 납득
3. 동료 사이 가치 충돌 심화
4. 불안한 동맹 수립

## 탐험 / 전투 / 연출 포인트

- 탐험: 천장 부두, 회전 승강로, 하층 노동 구역, 조율원 금고
- 전투: 중력 반전 전투, 시민 보호전, 역추자 보스전
- 연출: 위아래가 뒤집히는 도시 전경, 하늘로 떨어지는 잔해, 종편을 뽑아도 간신히 버티는 카델의 균형
- 시스템 포인트: 입체 경로 탐험, 시간과 중력의 복합 퍼즐, 선택 압박이 있는 구조 상황

## 챕터 종료 조건

- 3번 종편과 4번 종편을 모두 확보한다.
- 유라 베인이 적대자이면서도 일시 협력 가능한 인물로 정립된다.
- 종편 속 기록을 통해 \`속삭임 과수원\`과 \`무도서고 척추탑\`이 다음 목적지로 연결된다.

## 다음 챕터로 넘어가는 연결

4번 종편 내부 기록에는
\`첫 역조\` 당시 잘려 나간 기억이 \`속삭임 과수원\` 뿌리층과
\`무도서고 척추탑\` 상층에 분리 보관되었다는 내용이 담겨 있다.

사야는 그 기록이 사실이라면
남은 종편뿐 아니라 \`왜 플레이어가 종의 반응을 일으키는지\`도 알 수 있다고 본다.

백야는 장면 끝에서 처음으로 플레이어 이름을 부르며
"이제는 네가 누구였는지 볼 차례"라고 말한다.

## 제작 참고 메모

- 챕터 2는 시각적으로 강한 지역이므로 수직 이동과 원근 연출이 핵심이다.
- 유라 베인의 호감 여부보다 그녀의 논리가 설득력 있게 느껴지는지가 중요하다.
- 시민 보호와 코어 유지 목표를 동시에 제시해 플레이 압박을 높이는 것이 좋다.
- 유라의 대사는 차갑더라도 비아냥으로 흐르지 않게 조절하고,
  시민 대사는 \`질서 덕분에 살아남은 층\`과 \`질서 때문에 짓눌린 층\`이 모두 보이게 배치한다.
`,gn=`# 챕터 3: 잃어버린 하루들의 진실

## 챕터 개요

이 챕터는 \`속삭임 과수원\`과 \`무도서고 척추탑\`을 잇는 중후반 핵심 파트다.
감정과 기억, 선택되지 못한 역사들이 직접 목소리를 갖기 시작하며
플레이어와 동료들은 더 이상 같은 답을 바라볼 수 없게 된다.

게임 전체에서 가장 중요한 진실 공개 장이며,
플레이어 정체성과 세계의 원죄가 본격적으로 드러난다.

## 예상 플레이타임

- 약 130분
- 속삭임 과수원 탐색과 감정 이벤트 35분
- 5번 종편 회수와 동료 대화 20분
- 척추탑 하층 공략 30분
- 과거 기록 열람과 6번 종편 회수 25분
- 플레이어 실루엣 대치와 다음 항로 확정 20분

## 주요 목표

- 5번 종편과 6번 종편을 회수한다.
- 첫 역조와 새벽종의 진짜 기원을 확인한다.
- 플레이어가 현재 질서를 만든 계보와 연결되어 있음을 알게 된다.
- 사야 렌과 라오 템의 입장 차이를 명확한 갈등으로 전환한다.

## 주요 등장 인물

- 플레이어
- 사야 렌
- 라오 템
- 유라 베인
- 백야
- 물비늘 성가대 기록 보관자들

## 인물 외형 포인트

- 플레이어: 종편 공명 후유증이 누적돼 손목과 목선 주변 문양이 더 선명해지고, 외투에도 장거리 항해의 마모가 쌓여 있어야 한다.
- 사야 렌: 단정했던 머리와 복장이 조금씩 흐트러져 감정 균열이 보이되, 기록 도구만은 끝까지 정리된 상태가 좋다.
- 라오 템: 소금기와 피로가 묻은 장갑, 거칠어진 보호대, 이전보다 무거워진 눈빛으로 누적된 현장 피로를 표현한다.
- 유라 베인: 의례용이 아닌 원정용 제복으로 바뀌어도 직선적 실루엣과 절제된 계급감은 유지돼야 한다.
- 백야: 과수원 열매의 새벽빛과 섞여 윤곽이 번지고, 척추탑에서는 기록 틈새마다 다른 나이처럼 보이는 연출도 가능하다.
- 물비늘 성가대 기록 보관자: 물결처럼 흐르는 로브와 서고용 발광 문자 장식으로 지역의 몽환성을 강화한다.

## 주요 사건

1. 속삭임 과수원에서는 아직 일어나지 않은 감정들이 열매의 목소리로 흘러나온다.
2. 플레이어는 과수원 뿌리층에서 5번 종편을 회수하고,
   사야 렌의 개인적 집착을 보다 분명히 알게 된다.
3. 무도서고 척추탑에서는 실현되지 못한 과거가 장면 형태로 보관되어 있다.
4. 플레이어는 자신의 선대가 새벽종 체계의 관리자였다는 기록을 본다.
5. 백야가 단순 환영이 아니라 종 중심부에 남은 인격 잔재임이 드러난다.
6. 6번 종편을 회수한 뒤, 플레이어는 자신과 닮은 실루엣과 직접 대치한다.

## 상세 진행 흐름

## 1. 속삭임 과수원 진입

- 과수원 나무마다 다른 계절의 열매가 열려 있고,
  열매를 건드리면 아직 말하지 않은 감정이 음성처럼 새어 나온다.
- 플레이어는 각 동료가 숨기고 있는 후회와 소망을 간접적으로 듣는다.
- 이 구간은 전투보다 감정 탐색과 대화 비중이 높다.

사야는 언니의 내일을 되찾고 싶다는 속내를 처음으로 드러내고,
동시에 플레이어를 종 복구의 열쇠로만 대하지 못하게 됐음을 자각한다.
라오는 누군가의 내일을 고정하는 체계 자체를 불신한다고 못 박는다.

## 2. 5번 종편 회수

- 과수원 중심부 뿌리층에는 감정을 먹고 자라는 균열 생물 \`후회목\`이 둥지를 틀고 있다.
- 보스전은 플레이어가 들은 감정 잔향을 역이용해 약점을 드러내는 방식으로 구성한다.
- 승리 후 5번 종편이 드러나고,
  플레이어는 사야 렌의 언니가 과거 종편 실험에 휘말렸다는 단서를 얻는다.

이 장면은 사야 렌을 단순 안내자가 아니라
\`새벽종 복구에 집착할 수밖에 없는 사람\`이자
\`플레이어를 잃을 가능성 앞에서 처음으로 흔들리는 메인 히로인\`으로 재정의한다.

## 3. 무도서고 척추탑으로 이동

- 물비늘 성가대는 남은 기록이 척추탑 상층에 있다고 안내한다.
- 탑 내부는 "선택되지 못한 역사"가 살아 움직이는 공간이라
  층마다 서로 다른 가능성이 환경으로 구현된다.
- 예를 들어 어떤 층에서는 첫 역조가 일어나지 않은 세계의 항구가 잠깐 펼쳐진다.

## 4. 척추탑 하층 공략

- 퍼즐은 \`이 세계에서 선택되지 않은 길\`을 골라 문을 여는 방식으로 설계한다.
- 플레이어는 자신이 택하지 않은 대사, 지나쳤던 행동, 잊은 기억의 변형과 마주한다.
- 라오와 사야는 탑 안에서 서로의 입장을 더 이상 외면하지 못하고 직접 충돌한다.

## 5. 진실 공개

- 상층 기록실에서 플레이어는 선대 인양사들의 기록을 본다.
- 고대 문명은 끝없는 전쟁을 멈추기 위해 미래를 매일 잘라 보관했고,
  그 분배 장치가 바로 \`새벽종\`이었다는 사실이 드러난다.
- 플레이어의 능력은 우연이 아니라, 그 관리 권한의 잔재를 계승했기 때문에 생긴 것이다.

즉, 플레이어는 세계를 구할 열쇠이자
현재 질서의 원죄를 이어받은 존재다.

## 6. 6번 종편과 실루엣 대치

- 6번 종편은 기록실 최상층의 봉인 구획에 있다.
- 획득 직후 플레이어는 자신을 닮은 실루엣과 전투 또는 대화 이벤트를 치른다.
- 실루엣은 별개의 적이 아니라 \`플레이어가 과거에 선택했던 관리자적 자아\`의 반향으로 밝혀진다.

백야는 이 순간 자신의 정체를 명확히 밝힌다.

> "나는 종 안에 남겨진 마지막 아침이야. 네가 끝까지 버리지 못한 목소리."

## 장면별 상세 스크립트

### 장면 1. 속삭임 과수원 입구

- 연출: 나무마다 다른 계절의 열매가 맺혀 있고, 가까이 가면 동료의 목소리가 열매 속에서 먼저 새어 나온다.
- 진행 목적: 감정 탐색 중심 챕터로 리듬을 전환하고, 동료 속내를 장면 밖 독백처럼 보여 준다.
- 등장인물: 플레이어, 사야 렌, 라오 템
- 스크립트:
- 플레이어: "열매에서 목소리가 나. 환청이 아니라... 기억 같아."
- 사야 렌: "과수원은 아직 말하지 않은 감정을 저장한다는 기록이 있어. 들린다면 외면하지 마."
- 라오 템: "남의 속마음까지 캐라는 장소라니 취미 나쁘군."
- 열매 속 사야의 잔향: "이번엔 언니도, 너도 놓치지 않을 거야."
- 열매 속 라오의 잔향: "살릴 수 있었는데, 명령 때문에 배를 돌렸어."
- 플레이어: "둘 다 들었어?"
- 사야 렌: "내 건 들렸겠지. 얼굴 보지 마."
- 라오 템: "좋다, 이제 공평하게 네 속도 들어 보자."
- 플레이어: "내 속은... 나도 아직 모르겠어."
- 마무리 포인트: 각자 숨기던 후회가 챕터 전반의 긴장으로 남는다.

### 장면 2. 사야 렌의 고백과 5번 종편 직전 대화

- 연출: 뿌리층 아래 호수. 발밑 물에 비친 모습이 현재가 아니라 각자의 잃어버린 사람으로 흔들린다.
- 진행 목적: 사야의 집착이 개인적 상실에서 비롯됐음을 명확히 한다.
- 등장인물: 플레이어, 사야 렌
- 스크립트:
- 사야 렌: "내 언니는 종편 실험대에 선 채로 사라졌어. 시신도, 마지막 기록도 없어."
- 플레이어: "그래서 종을 복구하려는 거구나."
- 사야 렌: "응. 세상을 위해서라는 말이 완전히 거짓은 아니야. 하지만 처음 이유는 훨씬 작고 이기적이었어."
- 플레이어: "그게 왜 죄가 되지."
- 사야 렌: "누군가 하나를 되찾기 위해 다른 누군가의 내일을 다시 묶자고 할 수도 있으니까."
- 플레이어: "그래도 네가 왜 여기까지 왔는지는 알겠어."
- 사야 렌: "알아 버리면 나중에 날 막기 어려워질 수도 있어."
- 플레이어: "필요하면 막을 거야. 그래도 네가 혼자 무너지게 두진 않아."
- 사야 렌: "그 말 때문에 더 위험해져. 널 이용하려 했던 마음이 자꾸 흔들리니까."
- 플레이어: "지금도 날 열쇠로만 봐?"
- 사야 렌: "아니. 그게 문제야. 언니 때문만이 아니라, 네가 다치는 쪽으로 답이 기울까 봐 무서워."
- 플레이어: "무서워도 같이 가자. 그건 아직 안 바뀌었어."
- 사야 렌: "그 말, 생각보다 더 잔인하게 안심돼."
- 마무리 포인트: 후회목 보스전과 5번 종편 회수로 이어진다.

### 장면 3. 과수원 전투 후 라오와 충돌

- 연출: 후회목이 쓰러지며 열매들이 한꺼번에 터져 감정 잔향이 비처럼 떨어진다.
- 진행 목적: 사야를 이해한 직후 라오의 반대 논리를 정면으로 붙인다.
- 등장인물: 플레이어, 라오 템, 사야 렌
- 스크립트:
- 라오 템: "그 마음은 이해해. 하지만 이해한다고 체계를 다시 세우자는 말까지 받아들이진 못해."
- 사야 렌: "난 아직 결정을 말하지 않았어."
- 라오 템: "아니, 이미 얼굴에 써 있어. 누군가를 되찾을 수 있다면 위험을 감수하겠다는 얼굴."
- 플레이어: "라오."
- 라오 템: "말 막지 마. 여기까지 와서 또 '어쩔 수 없었다'는 소리 듣긴 싫어."
- 사야 렌: "그럼 네 답은 뭔데. 전부 부수고 혼란 속에 맡기면 정말 덜 잔인해?"
- 라오 템: "적어도 누가 살아도 되는지 표 찍는 손은 사라지겠지."
- 플레이어: "둘 다 틀린 말은 아니야. 그래서 더 답이 없어 보여."
- 사야 렌: "답이 없다고 멈출 순 없어. 척추탑으로 가자."
- 마무리 포인트: 파티는 불편한 침묵 속에 척추탑으로 이동한다.

### 장면 4. 척추탑 기록실의 진실

- 연출: 창문처럼 열린 기록 패널마다 선택되지 않은 역사들이 재생된다. 플레이어가 손을 대면 자신의 선대 기록이 겹쳐 뜬다.
- 진행 목적: 세계의 원죄와 플레이어 계보를 분명하게 밝힌다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 백야
- 스크립트:
- 기록 음성: "전쟁을 끝내려면 미래를 공용으로 두어선 안 된다. 배급과 제한이 필요하다."
- 플레이어: "이 목소리... 이상하게 익숙해."
- 사야 렌: "관리자 인장 반응이 네 혈맥에서 열리고 있어. 너, 정말로..."
- 라오 템: "설마 네 선대가 이 체계를 만든 쪽이었다는 거냐."
- 플레이어: "내가 만든 건 아니야. 하지만 내 안에 그 권한이 남아 있어."
- 백야: "남은 권한이 아니라 남긴 죄지."
- 플레이어: "넌 대체 누구야."
- 백야: "너희가 기계로 바꾸지 못한 마지막 망설임. 종 안에 남은 인간의 조각."
- 사야 렌: "그럼 네가 종을 멈출 수도 있나."
- 백야: "멈추게 할 수는 있어도 대신 책임지진 못해."
- 마무리 포인트: 6번 종편 봉인 구획과 플레이어 실루엣이 열린다.

### 장면 5. 플레이어 실루엣 대치

- 연출: 어두운 거울 복도 끝에서 플레이어와 똑같은 걸음, 똑같은 호흡으로 실루엣이 다가온다.
- 진행 목적: 실루엣을 외부 악역이 아닌 플레이어 내부의 관리자 자아로 정의한다.
- 등장인물: 플레이어 실루엣, 플레이어, 백야
- 스크립트:
- 실루엣: "세계는 내일을 잘라서 겨우 살아남았다. 넌 그 사실을 알면서도 또 흔들리는군."
- 플레이어: "넌 내가 아니야."
- 실루엣: "아니, 너였지. 계산하고, 나누고, 버티게 했던 손."
- 플레이어: "그 손 때문에 지워진 사람들이 있어."
- 실루엣: "그 손이 없었다면 더 많이 죽었다."
- 백야: "그래서 너는 아직도 둘 다 놓지 못해."
- 플레이어: "맞아. 하지만 이번엔 누굴 지울지 모른 채 결정하진 않아."
- 실루엣: "결국 결정은 해야 한다."
- 플레이어: "그래. 그래서 널 핑계로 숨진 않겠어."
- 마무리 포인트: 실루엣이 사라지며 침묵 산호궁 좌표가 활성화된다.

## 핵심 대사 또는 감정 흐름

- 사야 렌: "누군가의 내일을 되찾고 싶다는 마음도, 너를 잃고 싶지 않다는 마음도 죄가 될까."
- 라오 템: "미래를 나눠 준다는 말은 결국 누가 덜 가질지 정한다는 뜻이야."
- 백야: "네가 관리자가 된 날, 세계는 살았고 사람들은 조금씩 지워졌어."

감정 흐름은 다음과 같다.

1. 동료 내면을 엿보는 불편한 친밀감
2. 진실을 앞두고 고백과 불안이 뒤섞이며 무너지는 평정
3. 플레이어 자기혐오와 책임감 동시 폭발
4. 마지막 결정을 피할 수 없다는 체념 섞인 각성

## 탐험 / 전투 / 연출 포인트

- 탐험: 감정이 말하는 과수원, 선택되지 않은 역사가 구현된 척추탑 층계
- 전투: 후회목 보스전, 기억 잔향 군집전, 플레이어 실루엣 대치 이벤트
- 연출: 열매가 속삭이는 숲, 실현되지 못한 역사들이 창문처럼 열리는 탑, 플레이어와 동일한 걸음으로 다가오는 실루엣
- 시스템 포인트: 감정 기반 단서 수집, 선택되지 않은 경로 퍼즐, 기억과 정체성 떡밥 회수

## 챕터 종료 조건

- 5번 종편과 6번 종편을 모두 확보한다.
- 플레이어 정체성과 새벽종의 기원이 공개된다.
- 사야와 라오의 가치 갈등이 명백해져 엔딩 선택의 축이 완성된다.

## 다음 챕터로 넘어가는 연결

6번 종편과 백야의 기억이 겹치면서
마지막 7번 종편이 \`침묵 산호궁\` 심장부,
즉 \`심연의 합창기\` 안에 고정돼 있다는 사실이 밝혀진다.

유라 베인은 원격 통신으로 마지막 제안을 보낸다.

- 종을 복구하면 자신이 세계 질서 복원을 돕겠다.
- 종을 부수려 한다면 조율원은 플레이어를 막을 수밖에 없다.

플레이어는 누구를 완전히 믿을 수 없는 상태로 마지막 항해에 들어간다.

## 제작 참고 메모

- 챕터 3은 감정과 정보 밀도가 가장 높으므로 전투를 과도하게 늘리면 늘어진다.
- 대신 탐험 중 짧고 강한 장면을 자주 배치해 리듬을 유지한다.
- 후반 선택의 설득력은 이 장에서 사야, 라오, 유라의 입장이 얼마나 공감되게 전달되는지에 달려 있다.
- 스크립트 작업 시 사야, 라오, 플레이어 셋의 감정선을 같은 장면 안에서 꺾어 줘야
  엔딩 분기에서 특정 인물만 일방적으로 옳아 보이지 않는다.
`,bn=`# 엔딩: 침묵 산호궁과 마지막 새벽

## 챕터 개요

최종 챕터는 반향해 심해층에 잠긴 고대 시설 \`침묵 산호궁\`에서 진행된다.
플레이어는 마지막 7번 종편을 회수하고,
\`심연의 합창기\` 앞에서 세계의 미래 배분 구조를 어떻게 끝낼지 결정한다.

이 챕터의 핵심은 단순 보스 격파가 아니라
지금까지 모아 온 관계, 가치관, 죄책감, 책임감이 하나의 선택으로 수렴되는 것이다.

## 예상 플레이타임

- 약 110분
- 출항 전 결의와 세력 정리 15분
- 침묵 산호궁 외곽 탐험 25분
- 심해 내부 기믹과 동료 분리 구간 25분
- 최종 보스전과 7번 종편 회수 25분
- 엔딩 선택 및 후일담 20분

## 주요 목표

- 7번 종편을 회수한다.
- 심연의 합창기를 멈추거나 재구동할 방법을 선택한다.
- 사야 렌, 라오 템, 유라 베인의 입장을 최종적으로 마주한다.
- 메인 엔딩 3갈래를 설계 가능한 수준으로 정리한다.

## 주요 등장 인물

- 플레이어
- 사야 렌
- 라오 템
- 재상인 유라 베인
- 백야
- 공백 법정 집행자들
- 심연의 합창기

## 인물 외형 포인트

- 플레이어: 지금까지의 상처와 장비가 모두 겹친 최종 실루엣에, 일곱 종편 공명이 순간적으로 원형 후광처럼 맴도는 연출이 어울린다.
- 사야 렌: 기록관 코트 위에 심해용 방수 장비를 덧대고도 본래의 단정함을 잃지 않는 모습이 중요하다.
- 라오 템: 잠수 구조용 하네스, 무거운 장갑, 산호 파편이 박힌 보호대 등 \`끝까지 현장에 남는 사람\` 같은 무게감이 필요하다.
- 유라 베인: 심해 압력 대응 외투와 무광 금속 장치로 실전성을 더하되, 여전히 가장 정돈된 사람처럼 보여야 한다.
- 백야: 마지막에는 거의 빛과 물결만 남은 듯 투명해져, 인간의 형상과 새벽의 잔광이 겹쳐 보이는 편이 좋다.
- 공백 법정 집행자: 얼굴보다 비어 있는 가면과 절제된 장비가 먼저 읽히게 해 \`삭제자\` 같은 인상을 강화한다.

## 주요 사건

1. 남은 세력들이 각자 다른 목적을 품은 채 침묵 산호궁으로 향한다.
2. 산호궁 내부에서 동료들은 각자 바라는 미래에 붙잡혀 일시적으로 분리된다.
3. 백야는 7번 종편이 자신과 완전히 분리될 수 없다고 밝힌다.
4. 플레이어는 공백 법정의 최후 난입과 심연의 합창기 폭주를 동시에 상대한다.
5. 7번 종편을 회수한 뒤, 새벽종의 최종 형태를 어떻게 다룰지 선택한다.

## 상세 진행 흐름

## 1. 마지막 항해 준비

- 출항 전 짧은 허브 구간에서 동료들과 마지막 대화를 나눈다.
- 사야는 "불완전해도 다시 연결해야 한다"고 말한다.
- 사야는 동시에 플레이어가 자신을 희생하는 결론으로 기울까 봐 두려워한다.
- 라오는 "누구도 미래를 보관할 자격은 없다"고 말한다.
- 유라는 직접 동행하거나 원격 지원하는 방식으로 등장하며,
  플레이어가 어떤 선택을 하든 그 책임을 외면하지 말라고 압박한다.

이 구간은 플레이어가 지금까지 쌓은 정서적 무게를 정리하는 시간이어야 한다.

## 2. 침묵 산호궁 외곽 탐험

- 산호궁은 유기체처럼 꿈틀대는 통로와 오래된 기계 기관이 결합된 구조다.
- 종소리가 거의 들리지 않는 대신 멀리서 심장 같은 저음이 울린다.
- 외곽에서는 공백 법정 집행자들이 먼저 진입해 장치를 파괴하고 있다.

전투는 적을 쓰러뜨리는 것보다
시설 붕괴 속에서 경로를 유지하고 동료를 보호하는 방식이 어울린다.

## 3. 동료 분리 구간

- 심해 내부에서는 각 인물이 바라는 미래가 환영 공간으로 구현된다.
- 사야는 언니가 살아 있고 플레이어도 떠나지 않은 내일을 본다.
- 라오는 아무도 배급표에서 지워지지 않는 오늘을 본다.
- 유라는 붕괴 없는 안정된 질서를 본다.
- 플레이어는 이 환영들을 지나며 각 인물을 다시 설득하거나 받아들인다.

이 장면은 최종 선택 직전 각 입장이 감정적으로 정리되는 구간이다.

## 4. 백야와 7번 종편의 진실

- 심장부에서 백야는 자신이 새벽종이 마지막으로 보존한 \`인간적 망설임\`이라고 밝힌다.
- 관리자들은 완전한 배급 장치를 원했지만,
  마지막 순간 누군가가 인간의 연민을 한 조각 남겨 두었고 그것이 백야가 되었다.
- 7번 종편은 그 연민과 결합되어 있어, 힘만으로 떼어 낼 수 없다.

즉, 마지막 종편 회수는 전투이자 결단이다.

## 5. 최종 보스전

- 공백 법정 집행자들이 합창기를 파괴하려 들면서 시스템이 과부하된다.
- 플레이어는 폭주한 \`심연의 합창기\`와 싸운다.
- 전투 연출에는 지금까지 회수한 종편 능력이 모두 반영되어야 한다.

보스전은 세 단계가 적합하다.

1. 붕괴하는 산호궁에서의 이동형 전투
2. 합창기 핵심부의 패턴 공략
3. 백야와 플레이어의 대화 선택이 섞인 마무리 페이즈

## 6. 엔딩 선택

플레이어는 세 가지 결정을 내릴 수 있다.

## 엔딩 A: 새벽종 복구

- 플레이어는 종을 다시 울려 미래 배급 체계를 안정화한다.
- 혼란은 줄어들지만, 미래는 다시 관리 대상이 된다.
- 사야 렌은 안도하며 플레이어 곁에 남지만 라오 템과는 거리가 생긴다.
- 유라는 플레이어를 새로운 조정자로 인정한다.

## 엔딩 B: 새벽종 해체

- 플레이어는 종과 합창기를 해체해 누구도 미래를 소유하지 못하게 만든다.
- 세계는 한동안 극심한 혼란을 겪지만,
  내일은 다시 누구에게도 독점되지 않는 것으로 돌아간다.
- 라오 템은 플레이어 곁에 남지만,
  사야 렌은 언니를 되찾을 가능성과 플레이어를 향한 미련을 함께 떠안은 채
  되돌릴 수 없는 상실을 받아들여야 한다.

## 엔딩 C: 플레이어의 결속

- 플레이어 자신이 종의 새 매개체가 되어 합창기를 대체한다.
- 미래는 완전히 통제되지도, 완전히 해방되지도 않은 중간 상태로 유지된다.
- 세계는 버티지만 플레이어는 더 이상 예전처럼 살 수 없다.
- 백야는 사라지고, 플레이어는 종소리와 함께 남는다.
- 사야 렌은 이 엔딩에서 플레이어를 끝까지 기억해 내는 마지막 인간적 닻이 된다.

세 엔딩 모두 완전한 해피엔드가 아니라
무엇을 살리고 무엇을 잃는지에 초점을 둔다.

## 장면별 상세 스크립트

### 장면 1. 출항 전 마지막 대화

- 연출: 갑판 위에 종편 일곱 개의 공명이 얇은 빛 고리로 맺힌다. 선택 전 허브 장면으로 각 인물과 한 번씩 대화할 수 있다.
- 진행 목적: 최종 선택 직전 각 인물의 입장을 플레이어가 정리하도록 만든다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 유라 베인
- 스크립트:
- 사야 렌: "완전한 복구가 아니어도 괜찮아. 다만 다시는 아무도 이유 없이 새벽을 빼앗기지 않게 만들고 싶어."
- 사야 렌: "그리고 네가 혼자 감당하는 식의 답은 원하지 않아."
- 플레이어: "네가 바라는 건 질서야, 아니면 언니를 되찾을 가능성이야."
- 사야 렌: "지금은 둘을 분리해서 말할 자신이 없어. 너까지 포함하면 더더욱."
- 라오 템: "그 솔직함은 마음에 든다. 그래도 난 반대야. 미래를 쥐는 손이 있는 한 누군가는 밀려난다."
- 플레이어: "그럼 부숴야 한다고 생각해?"
- 라오 템: "적어도 허락받아 살아야 하는 세상은 끝내야지."
- 유라 베인: "둘 다 절반만 맞다. 복구도, 해체도, 대가 없이 끝나진 않아."
- 플레이어: "당신은 아직도 내가 감당할 수 있는지 보겠다는 거겠지."
- 유라 베인: "그래. 세계는 의견이 아니라 비용으로 유지되니까."
- 마무리 포인트: 침묵 산호궁으로의 마지막 진입이 시작된다.

### 장면 2. 동료 분리 환영 공간

- 연출: 플레이어가 심해 통로를 지날 때마다 다른 동료의 바라는 미래가 현실처럼 펼쳐진다.
- 진행 목적: 각 인물의 욕망을 비난이 아니라 공감 가능한 감정으로 정리한다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 유라 베인
- 스크립트:
- 환영 속 사야 렌: "언니, 이번엔 늦지 않았어. 그리고 너도 떠나지 않았어. 이 정도면 욕심일까."
- 플레이어: "사야, 네가 붙잡고 싶은 내일은 둘이구나."
- 사야 렌: "원했다기보다 버리지 못한 내일이지. 둘 다."
- 환영 속 라오 템: "명단에 없는 사람도 배에 태워. 오늘만 넘기면 된다고 말하는 세상."
- 플레이어: "라오, 네가 지키고 싶은 건 제도보다 사람 자체구나."
- 라오 템: "처음부터 그랬어. 제도는 물에 빠진 사람을 바로 안 건져."
- 환영 속 유라 베인: "붕괴 없는 도시, 배급표 없는 공포, 계산이 늦지 않는 세계."
- 플레이어: "당신도 겁이 나는 거군."
- 유라 베인: "통치자는 늘 겁을 감춘다. 보여 주면 아래가 먼저 무너지니까."
- 마무리 포인트: 플레이어는 각 환영을 지나 심장부에 도달한다.

### 장면 3. 백야의 정체와 마지막 설득

- 연출: 합창기 중심부. 백야가 처음으로 선명한 인간 형상으로 고정된다.
- 진행 목적: 백야의 정체를 감정적으로 회수하고 마지막 종편 회수의 의미를 설명한다.
- 등장인물: 플레이어, 백야
- 스크립트:
- 백야: "나는 남겨 둔 연민이야. 종을 만든 사람들조차 끝까지 버리지 못한 망설임."
- 플레이어: "그래서 네가 마지막 조각과 붙어 있었군."
- 백야: "힘만으로는 떼어 낼 수 없어. 누군가의 떨리는 손이 필요해."
- 플레이어: "왜 하필 나지."
- 백야: "네가 가장 많이 닮았으니까. 종을 지키려 했던 사람과, 종을 끝내려는 사람 둘 다."
- 플레이어: "어느 쪽도 완전히 되고 싶진 않아."
- 백야: "그래서 아직 인간이네."
- 플레이어: "내가 뭘 선택하든 넌 사라질 수도 있겠지."
- 백야: "사라짐이 두렵진 않아. 두려운 건 또다시 아무도 떨지 않는 손이 종을 쥐는 거야."
- 마무리 포인트: 공백 법정이 난입하며 최종 전투가 시작된다.

### 장면 4. 최종 보스전 종료 직후

- 연출: 심연의 합창기가 멈추듯 흔들리고, 회수한 종편들이 플레이어 주변에 원형으로 떠오른다.
- 진행 목적: 최종 선택의 감정 압력을 극대화한다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 유라 베인, 백야
- 스크립트:
- 사야 렌: "지금이라면 다시 연결할 수 있어. 완전하진 않아도 세상을 버티게 할 수 있어."
- 사야 렌: "하지만 네가 사라지는 선택지만은 고르지 마."
- 라오 템: "버티게 하는 동안 또 누가 잘려 나갈지부터 봐."
- 유라 베인: "두 사람 다 반만 말하고 있어. 복구는 희생을 관리하는 길이고, 해체는 희생을 분산시키는 길이야."
- 플레이어: "결국 아무것도 잃지 않는 길은 없다는 거네."
- 백야: "그래서 선택은 늘 상실의 모양을 고르는 일이었지."
- 사야 렌: "그래도 누군가는 오늘 밤을 넘어야 해."
- 라오 템: "그리고 누군가의 오늘이 허락받는 형태여선 안 돼."
- 유라 베인: "결정해. 오래 머뭇거릴수록 세계가 먼저 찢어진다."
- 플레이어: "알아. 이번엔 내가 끝까지 본다."
- 마무리 포인트: 플레이어 선택 UI와 분기 컷신이 열린다.

### 장면 5. 엔딩 A, 새벽종 복구

- 연출: 새벽종이 다시 울리고 하늘에 규칙적인 금빛 띠가 생긴다. 도시들은 안정을 되찾지만 빛은 어딘가 인공적이다.
- 진행 목적: 안정과 통제의 대가를 분명히 보여 준다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 유라 베인
- 스크립트:
- 플레이어: "종을 잇는다. 불완전하더라도 지금 무너지는 세계를 붙든다."
- 사야 렌: "고마워. 이 선택이 모두를 구하진 못해도, 적어도 더 늦진 않았어."
- 사야 렌: "이번엔 네 옆에서 끝까지 기록할게. 혼자 남겨 두지 않겠어."
- 라오 템: "안정은 찾겠지. 대신 또 누군가는 관리 대상이 된다."
- 플레이어: "알아. 그래서 이번엔 기록을 숨기지 않을 거야."
- 유라 베인: "좋은 대답이군. 통제는 감시받을 때만 덜 잔인해진다."
- 라오 템: "난 아직 찬성 못 해. 그래도 네가 책임에서 도망치지 않는다면 지켜보겠다."
- 마무리 포인트: 후일담은 안정된 세계와 벌어진 관계의 틈을 함께 보여 준다.

### 장면 6. 엔딩 B, 새벽종 해체

- 연출: 종편이 하나씩 소금빛 입자로 부서져 바다와 하늘로 흩어진다. 새벽은 불규칙하지만 자연스럽게 다시 찾아오기 시작한다.
- 진행 목적: 해방의 희망과 혼란의 비용을 동시에 남긴다.
- 등장인물: 플레이어, 사야 렌, 라오 템, 백야
- 스크립트:
- 플레이어: "끝낸다. 누구도 내일을 보관하지 못하게."
- 라오 템: "그래, 그걸로 됐어. 적어도 오늘이 허락받는 물건은 아니게 된다."
- 사야 렌: "이러면 되돌릴 수 있는 것도 사라져. 알고도 가는 거지?"
- 플레이어: "응. 누군가를 되찾을 가능성보다, 모두가 빼앗기지 않을 가능성을 택할 거야."
- 백야: "흩어진 아침은 불편하지만 살아 있지."
- 사야 렌: "미워할 수도 있을 것 같았는데... 아직은 모르겠어. 다만 널 완전히 놓을 자신도 없어."
- 라오 템: "모르겠으면 그 상태로 살아. 이번엔 누구도 답안지를 나눠 주지 않으니까."
- 마무리 포인트: 후일담은 혼란 속 자율과 새로운 지역 질서를 비춘다.

### 장면 7. 엔딩 C, 플레이어의 결속

- 연출: 플레이어 몸에 공명 문양이 번지며 합창기와 종편이 한 몸처럼 접속된다. 백야는 마지막 미소를 남기고 빛으로 흩어진다.
- 진행 목적: 희생적 중재 엔딩의 쓸쓸함과 지속성을 강조한다.
- 등장인물: 플레이어, 백야, 사야 렌, 라오 템, 유라 베인
- 스크립트:
- 플레이어: "종도, 세계도 지금 당장 부수지 않겠다. 대신 내가 사이에 선다."
- 사야 렌: "그건 네 삶을 포기하는 선택이야."
- 라오 템: "그래서 더 반대하고 싶은데... 지금 세계가 버틸 길이 그뿐이라면."
- 유라 베인: "가장 비효율적이면서 가장 인간적인 결정이군."
- 백야: "좋아. 떨리는 손이 끝까지 남았네."
- 플레이어: "네가 남긴 망설임, 내가 이어받을게."
- 백야: "그럼 아침은 이제 네 목소리로 울리겠지."
- 사야 렌: "우릴 잊지 마. 아니, 적어도 나 하나쯤은 남겨 둬."
- 플레이어: "완전히는 못 잊을 거야. 그게 내가 버틸 이유니까."
- 마무리 포인트: 후일담은 플레이어가 세계의 경계선이 된 채 남는 여운으로 끝낸다.

## 핵심 대사 또는 감정 흐름

- 백야: "미래를 나누는 손은 늘 떨려야 해. 떨리지 않는 손은 반드시 누군가를 지워."
- 사야 렌: "되돌릴 수 있다면 되돌리고 싶어. 하지만 너까지 잃는 답을 원한 적은 없어."
- 라오 템: "사람은 오늘을 살아야 해. 내일을 허락받고 사는 게 아니라."
- 유라 베인: "무너지는 세계를 붙드는 일은 늘 잔인하다. 네가 그 잔인함을 견딜 수 있나."

감정 흐름은 다음 순서로 설계한다.

1. 결전 직전의 침묵과 정리
2. 동료 입장에 대한 최종 공감
3. 거대한 구조와 개인적 죄책감의 충돌
4. 선택 이후의 상실 수용

## 탐험 / 전투 / 연출 포인트

- 탐험: 유기체처럼 자란 산호 통로, 침수된 합창실, 심해 기관실
- 전투: 공백 법정 최후 난입전, 합창기 보스전, 붕괴 탈출 연출
- 연출: 심해 속 종소리 잔향, 각 인물의 바라는 미래 환영, 선택 직후 세계 하늘 색이 바뀌는 엔딩 컷
- 시스템 포인트: 회수한 종편 능력 총동원, 최종 선택에 따라 다른 연출과 후일담 분기

## 챕터 종료 조건

- 7번 종편을 회수한다.
- 새벽종의 운명을 결정한다.
- 선택에 맞는 메인 엔딩과 후일담이 재생된다.

## 다음 챕터로 넘어가는 연결

메인 시나리오는 여기서 종료된다.

후속 확장이나 후일담 문서가 필요하다면 다음 방향으로 확장 가능하다.

- 선택별 세계 변화 정리 문서
- 동료별 엔딩 후 상태 정리
- 엔딩 이후 플레이 가능 지역과 신규 서브 퀘스트 연결

## 제작 참고 메모

- 최종 던전은 지나치게 길기보다 장면 전환 밀도가 높아야 한다.
- 보스전은 난도보다 \`여기까지 모은 힘과 관계를 한 번에 회수한다\`는 감각이 중요하다.
- 엔딩 분기는 연출 차이뿐 아니라 동료 관계 변화와 세계 상태 변화가 명확하게 보이도록 준비한다.
- 엔딩 스크립트는 분기마다 달라도
  \`플레이어의 책임 수용\`, \`동료의 반응\`, \`세계 상태 변화\` 세 축은 반드시 모두 들어가야 한다.
`,vn=`# 시나리오 기반 BGM 기획 및 제작 문서

## 목적

이 문서는 \`반향해 연대기\`의 메인 시나리오와 설정 문서를 기준으로
어떤 장면에 어떤 음악이 필요한지 정리하고,
이번 브랜치에서 실제로 구현한 Web Audio 기반 BGM 라이브러리의 사용처를 함께 기록한다.

핵심 기준은 아래 두 가지다.

- 장면의 감정선과 흐름을 음악이 밀어 주되 과하게 앞서가지 않을 것
- 기존 유명 곡을 모사하지 않고, 프로젝트 내부에서 독자적으로 관리 가능한 구조일 것

## 제작 방식

- 정적 오디오 파일을 가져오는 대신 \`Web Audio API\`로 브라우저 안에서 직접 합성한다.
- 각 곡은 \`OfflineAudioContext\`로 렌더링해 반복 재생 가능한 루프 버퍼로 관리한다.
- 패드, 저역, 선율, 질감 노이즈, 리듬 레이어를 분리해 장면 분위기를 설계했다.
- 전체 출력에는 컴프레서, 컨볼루션 리버브, 딜레이를 얹어 거칠지 않고 넓게 퍼지는 질감을 목표로 했다.
- 청취 UI에서는 곡이 겹쳐 재생되지 않도록 한 번에 하나의 트랙만 재생한다.

## 시나리오를 읽고 정리한 음악 요구

### 1. 타이틀 / 메인 테마

- 세계의 정체성인 \`몽환적 서정성\`, \`해양 판타지\`, \`불길한 희망\`을 한 곡 안에 담아야 한다.
- 이후 엔딩 크레딧에서도 변주해 사용할 수 있는 주제 선율이 필요하다.

### 2. 미라진 / 허브 / 항구 정서

- 프롤로그의 \`영원한 황혼\`, \`사라진 새벽\`, \`개인적 죄책감\`이 동시에 느껴져야 한다.
- 너무 슬프기만 하지 않고, 아직 항해가 시작되기 전의 숨죽인 긴장감이 필요하다.

### 3. 탐험

- 유리염 사구, 속삭임 과수원, 침묵 산호궁처럼 서로 결이 다른 공간을 받쳐야 한다.
- 반복 재생에 피로가 적어야 하고, 탐험 리듬을 깨지 않도록 선율 밀도는 조절해야 한다.

### 4. 긴장 / 추적

- 균열 폭주, 붕괴 탈출, 추격형 전투처럼 화면이 빠르게 움직이는 구간용 음악이 필요하다.
- 타악이 있어도 귀를 찌르지 않도록 고역을 눌러야 한다.

### 5. 전투

- 일반 전투는 결의를 밀어 올리되, 보스전보다 한 단계 절제된 에너지가 적합하다.
- 반향해 세계의 시간 왜곡감을 살리기 위해 단순 8비트보다 파동적이고 유기적인 질감이 어울린다.

### 6. 보스전

- \`유리염 거신\`, \`역추자\`, \`심연의 합창기\` 같은 거대 장면을 버틸 무게가 필요하다.
- 공포와 장엄함이 함께 있어야 하며, 저역과 합창성 패드가 중요하다.

### 7. 감정 이벤트

- 사야 렌의 고백, 플레이어 정체성 공개, 동료 충돌 장면을 위해 선율 중심 곡이 필요하다.
- 감정이 과장되지 않도록 여백과 긴 호흡이 중요하다.

### 8. 엔딩 / 크레딧

- 세 엔딩 모두 완전한 해피엔드가 아니기 때문에 승리감보다 \`여운\`, \`상실\`, \`잔광\`이 우선이다.
- 메인 테마를 정리하는 곡이어야 하며, 플레이어 선택의 무게가 마지막까지 남아야 한다.

## 이번 브랜치에서 구현한 트랙 목록

## 1. Echoes Of Tomorrow

- 분류: 타이틀 / 메인 테마
- 용도: 첫 화면, 시나리오 소개, 메인 메뉴, 엔딩 전 회상
- 분위기: 넓은 바다, 불길한 희망, 잊힌 새벽의 잔향
- 연결 장면: \`story-overview\`, \`main-story\`

## 2. Mirajin Hushed Dawn

- 분류: 항구 / 허브 / 프롤로그 정서
- 용도: 미라진 탐색, 시계탑 진입 전, 허브 정비
- 분위기: 황혼, 정지된 시간, 낮은 죄책감, 첫 신뢰
- 연결 장면: \`scenario-prologue\`, \`regions\`

## 3. Glasssalt Drifter

- 분류: 챕터 1 탐험
- 용도: 유리염 사구 필드, 폐채굴 첨탑 탐색, 침몰 인양선 접근
- 분위기: 메마른 공간, 잔향, 모래폭풍 속 이동감
- 연결 장면: \`scenario-chapter-1\`, \`regions\`

## 4. Faultline Run

- 분류: 긴장 / 추적
- 용도: 붕괴 탈출, 구조선 방어전 직전, 시간폭풍 회피, 카델 비상구간
- 분위기: 조급함, 진동, 균열 확산, 그러나 지나치게 공격적이지 않은 추진감
- 연결 장면: \`scenario-prologue\`, \`scenario-chapter-1\`, \`scenario-chapter-2\`

## 5. Cadel Overturn

- 분류: 챕터 2 도시 / 정치 긴장
- 용도: 역항도 카델 조사, 상층과 하층 이동, 유라 베인 협상 전후
- 분위기: 정교한 질서, 불편한 안정, 수직 도시의 비현실감
- 연결 장면: \`scenario-chapter-2\`, \`factions\`

## 6. Fractured Tide Skirmish

- 분류: 일반 전투
- 용도: 균열 생물 전투, 구조전, 추격 중 소규모 교전
- 분위기: 전술적 긴장, 결의, 속도감
- 연결 장면: 전 챕터 공통 전투 구간

## 7. Afterglow Vow

- 분류: 감정 이벤트
- 용도: 사야 렌 고백, 동료 대화, 정체성 공개 직전과 직후, 후회가 드러나는 장면
- 분위기: 가까워짐, 불안, 상실을 예감하는 따뜻함
- 연결 장면: \`scenario-chapter-3\`, \`characters\`

## 8. Abyssal Adjudicator

- 분류: 보스전
- 용도: 유리염 거신, 역추자, 최종 결전 1차 페이즈 등 강한 전투
- 분위기: 심판, 압박, 거대한 장치와 맞서는 느낌
- 연결 장면: \`scenario-chapter-1\`, \`scenario-chapter-2\`, \`scenario-ending\`

## 9. Silent Coral Vault

- 분류: 최종 던전 / 후반 탐험
- 용도: 침묵 산호궁 외곽, 심연 진입, 동료 분리 구간
- 분위기: 심해 저음, 산호 기관의 생체성, 오래된 종소리의 공허
- 연결 장면: \`scenario-ending\`, \`world-rules\`

## 10. Last Bell Refrain

- 분류: 엔딩 / 크레딧
- 용도: 엔딩 후일담, 크레딧, 브랜치 마감용 청취
- 분위기: 결단 이후의 잔광, 상실과 희망이 함께 남는 마무리
- 연결 장면: \`scenario-ending\`, \`main-story\`

## 장면별 추천 매핑

- 프롤로그 오프닝: \`Echoes Of Tomorrow\`
- 미라진 조사 / 허브: \`Mirajin Hushed Dawn\`
- 시계탑 붕괴 / 방파제 탈출: \`Faultline Run\`
- 유리염 사구 탐험: \`Glasssalt Drifter\`
- 구조선 방어전 / 일반 교전: \`Fractured Tide Skirmish\`
- 유리염 거신, 역추자, 합창기 전투: \`Abyssal Adjudicator\`
- 카델 조사 / 유라 협상: \`Cadel Overturn\`
- 속삭임 과수원 감정 장면: \`Afterglow Vow\`
- 침묵 산호궁 탐험: \`Silent Coral Vault\`
- 엔딩 / 크레딧: \`Last Bell Refrain\`

## 파일 관리 구조

- 문서: \`src/content/audio/scenario-bgm-direction.md\`
- 트랙 정의: \`src/scripts/bgm-track-library.js\`
- 합성 및 재생 엔진: \`src/scripts/bgm-manager.js\`
- 청취 UI: \`src/scripts/main.js\`
- 정리 메모: \`assets/audio/README.md\`

## 표절 방지 메모

- 특정 작품 멜로디를 복제하지 않고, 각 곡은 시나리오 키워드와 모드, 코드 진행, 리듬 구조를 새로 조합했다.
- 샘플 팩이나 외부 음원을 끌어오지 않고 브라우저 내부 합성만 사용해 프로젝트 내 출처를 단순화했다.
- 메인 테마와 엔딩 테마는 같은 프로젝트 모티프를 공유하되, 직접 작성한 선율과 리듬으로 변주했다.
`,wn=`# 세계 규칙과 시스템 설정

## 반향해

반향해는 하늘과 육지 사이에 걸쳐 있는 상층 바다다.
낮에는 하늘처럼 보이지만, 해가 기울면 파도와 조류가 드러난다.
전용 함선과 조율 나침반이 있어야만 정상적으로 항해할 수 있다.

## 내일결

\`내일결\`은 아직 현실이 되지 않은 하루의 가능성이 응결된 결정이다.
색과 결에 따라 성질이 달라진다.

- 청람결: 항로 예측, 정찰, 순간 회피
- 금백결: 치유, 회복, 생장 가속
- 자홍결: 기억 증폭, 환영, 감정 공명
- 흑은결: 봉인, 정지, 시간 지연

내일결은 강력하지만 부작용이 명확하다.
누군가 하나의 가능성을 강하게 사용하면,
다른 곳의 가능성 하나가 약해지거나 사라질 수 있다.

## 시간 균열

새벽종이 약해질수록 세계에는 \`시간 균열\`이 생긴다.
균열 지역에서는 다음과 같은 현상이 발생한다.

- 같은 대사가 다른 날씨와 감정으로 반복된다.
- 그림자가 본체보다 먼저 움직인다.
- 상처가 늦게 도착하거나, 반대로 치유가 먼저 일어난다.
- 특정 문은 "열린 뒤"의 상태로만 존재한다.

이 규칙은 전투 패턴, 퍼즐, 지역 기믹으로 활용할 수 있다.

## 여명 인양사

여명 인양사는 일반인이 듣지 못하는 미래의 잔향을 들을 수 있다.
내일결을 무작정 소비하는 대신,
결정 내부에 들어 있는 가능성을 짧게 "시연"해 볼 수 있다.

대표 능력 예시:

- \`선행 발자국\`: 몇 초 뒤 자신이 설 자리로 먼저 흔적을 보낸다.
- \`미도착 상처\`: 받은 피해 일부를 뒤로 미룬다.
- \`기억 닻\`: 특정 선택 직전 상태를 짧게 고정한다.
- \`새벽 청취\`: 주변 인물의 아직 말하지 않은 후회를 듣는다.

## 기술 수준

전체적인 기술은 범선 시대와 아날로그 장치 중심이지만,
내일결 활용 기술 때문에 독특한 준마법 공학이 발달했다.

- 수정 기관을 단 배와 엘리베이터
- 미래 풍향을 읽는 조율 나침반
- 감정이 남은 소리를 재생하는 파문 기록기
- 균열 지역 전용 작업복과 잠수 장비

## 서사의 핵심 규칙

이 세계에서 미래는 무한하지 않다.
누군가 더 안전하고 확실한 내일을 가져갈수록,
다른 누군가의 가능성은 더 가늘어진다.

따라서 스토리와 시스템 모두
\`강한 힘 = 더 큰 대가\` 구조를 유지해야 분위기가 살아난다.
`,Sn=`# 주요 지역 설정

## 1. 등외항 미라진

플레이어의 출발점이 되는 부유 항구 도시.
새벽빛이 가장 먼저 닿는 도시였으나 지금은 영원한 황혼에 잠겨 있다.
항구의 선창마다 오래된 내일결 채집 장비가 줄지어 있고,
주민들은 시간이 완전히 멈추기 전에 다시 아침을 되찾으려 한다.

## 2. 유리염 사구

바다가 말라 남은 소금 들판이 아니라,
내일결이 너무 많이 채굴되어 미래가 비어 버린 사막 지대다.
밟으면 발소리가 아니라 "이곳에 오지 않았을 삶"의 목소리가 울린다.
탐험과 기억 관련 퀘스트에 적합한 지역이다.

## 3. 역항도 카델

배가 물이 아닌 하늘의 흐름을 따라 거꾸로 정박하는 도시 국가.
부두가 위를 향하고 있고, 건물은 천장 쪽으로 확장되어 있다.
중력과 시간 감각이 비틀려 있어 입체적 탐험과 퍼즐에 적합하다.

## 4. 속삭임 과수원

나무마다 다른 계절의 열매가 열리는 농원 지대.
열매를 따면 아직 일어나지 않은 감정이 목소리로 흘러나온다.
정치적 음모, 숨겨진 관계, 서브 퀘스트용 비밀을 풀기에 좋은 지역이다.

## 5. 침묵 산호궁

반향해 심해층에 잠긴 고대 시설이자 최종 던전.
유기체처럼 자라난 산호 기관이 통로와 방을 이루며,
곳곳에서 과거의 아침 종소리가 아주 멀게 메아리친다.

## 6. 무도서고 척추탑

책이 아니라 "실현되지 못한 선택"이 보관되는 탑.
각 층에는 특정 인물이나 도시가 택하지 않은 역사 하나가
실체를 가진 장면으로 남아 있다.
세계관 설명과 캐릭터 서사 확장에 최적화된 장소다.
`,Mn=`# 세력 설정

## 조율원

내일결의 사용량과 배급을 통제하는 공적 기관.
겉으로는 질서와 생존을 위해 움직이지만,
실제로는 미래의 편중을 이용해 도시 간 서열을 유지해 왔다.

### 특징

- 상징: 금선이 들어간 청색 종문장
- 강점: 행정력, 정제 기술, 항로 정보 독점
- 약점: 지나친 통제, 민심 이반, 내부 파벌 갈등

## 염해 길드

밀수상, 잠수부, 구조선 선원, 자유 항해사들이 만든 연합체.
내일결은 특정 세력의 소유물이 아니라
모든 생존자에게 공평하게 흘러가야 한다고 믿는다.

### 특징

- 상징: 균열 난 나침반
- 강점: 기동성, 현장 감각, 음지 네트워크
- 약점: 느슨한 조직력, 배신 위험, 지역별 이해관계 충돌

## 공백 법정

미래가 존재하기 때문에 인간이 현재를 살지 못한다고 믿는 급진 집단.
내일결과 새벽종을 모두 파괴해
불완전하더라도 진짜 시간을 되돌리겠다는 목표를 가진다.

### 특징

- 상징: 중심이 비어 있는 흑환
- 강점: 강한 신념, 균열 지대 적응력, 금지 기술 보유
- 약점: 극단성, 희생 강요, 내부 인격 붕괴 문제

## 물비늘 성가대

반향해의 파문과 종소리를 연구하는 종교 겸 학회.
플레이어 능력의 기원, 첫 역조의 기록, 심연의 합창기에 대한
가장 오래된 자료를 보유하고 있다.

### 특징

- 상징: 물결 위에 뜬 음표 모양 성인
- 강점: 고문서, 의식 기술, 해석 능력
- 약점: 실천력 부족, 교리 해석 충돌, 외부 세력 침투
`,kn=`# 주요 인물 설정

## 인물 설계 방향

\`반향해 연대기\`의 주요 인물은 단순히 정보를 설명하는 역할이 아니라,
각자 다른 방식으로 \`미래를 누가 감당해야 하는가\`라는 질문을 밀어붙이는 축이다.

- 플레이어: 죄와 책임을 직접 떠안는 선택의 중심
- 사야 렌: 메인 히로인, 복구와 상실을 동시에 끌어안는 정서의 중심
- 라오 템: 현장 생존과 인간 존엄을 끝까지 붙드는 현실의 중심
- 유라 베인: 붕괴 공포를 관리 가능한 질서로 바꾸려는 통치의 중심
- 백야: 인간이 끝내 버리지 못한 망설임과 연민의 중심

이 다섯 축이 서로를 반박하면서도 어느 누구도 완전히 틀리지 않게 유지하는 것이 중요하다.

## 플레이어: 여명 인양사

### 기본 정보

- 포지션: 주인공, 선택의 중심축
- 공통 배경: \`미라진 출신\`, \`새벽의 부재를 직접 목격\`, \`미래 반향 청취 능력 보유\`
- 기본 인상: 조용하지만 상황 판단이 빠르고, 위기에서는 망설임보다 행동이 먼저 나간다.

### 외형 묘사

- 전체 실루엣은 길게 떨어지는 방수 외투와 한쪽으로 기운 장비 벨트로 구성해
  \`항해자\`와 \`인양사\`의 생활감을 먼저 보여 준다.
- 색은 짙은 남청, 바랜 청록, 젖은 소금빛 회색을 기본으로 두고
  공명 능력이 발동할 때만 새벽빛 금선이 손등과 목선 근처에 스친다.
- 얼굴 인상은 날카롭기보다 피로와 집중이 함께 남은 타입이 적합하다.
  잠을 덜 잔 듯한 눈가와 짧게 정리한 머리, 혹은 묶어 둔 잔머리가 잘 어울린다.
- 장비는 휴대 등불, 균열 청취용 이어 피스, 젖은 항해 수첩 같은
  \`현장 도구\`가 중심이어야 한다.
- 실루엣 포인트는 칼보다 먼저 보이는 외투 자락과,
  결정을 미루지 않는 사람처럼 곧게 나가는 보행 자세다.

### 겉으로 보이는 성격

- 필요 이상으로 감정을 드러내지 않는다.
- 질문은 짧고 단도직입적이며, 결론을 미루는 상황을 싫어한다.
- 남을 구하는 행동은 빠르지만 자기 자신은 자주 후순위로 둔다.

### 내면의 균열

- 미래의 잔향을 들을수록 자신의 기억이 흐려진다는 사실을 이미 어렴풋이 두려워한다.
- 새벽이 사라진 현장에서 본 \`자기와 닮은 실루엣\` 때문에
  문제를 해결해야 한다는 책임감과 스스로를 의심하는 죄책감이 동시에 커진다.
- 후반부에는 자신이 현재 질서의 원죄와 연결된 존재라는 사실을 알게 되며
  "내가 고칠 자격이 있는가"라는 질문에 정면으로 부딪힌다.

### 주요 관계

- 사야 렌과는 처음에는 정보와 필요로 엮인 동맹이지만,
  점차 서로의 가장 약한 부분을 먼저 알게 되는 관계가 된다.
- 라오 템에게는 현장에서 사람을 먼저 보는 법을 배운다.
- 유라 베인에게는 자신과 닮은 책임 윤리의 어두운 미래상을 본다.
- 백야에게는 잊고 싶었던 망설임과 인간성을 들킨다.

### 서사 포인트

- 플레이어의 선택에 따라 조율원 협력자, 해방자, 혹은 새로운 중재자가 될 수 있다.
- 강한 힘을 쓸수록 정체성이 흔들리기 때문에,
  전능한 영웅보다 \`대가를 알고도 결정해야 하는 인물\`로 보이게 해야 한다.
- 주요 감정선은 세계 구원보다도 \`누구를 살리고 무엇을 잃을 것인가\`에 맞춘다.

## 사야 렌

### 기본 정보

- 성별: 여성
- 포지션: 메인 히로인, 항로 기록관, 메인 파티 브레인
- 소속: \`등외항 미라진\` 항로 기록 보관소
- 기본 인상: 침착하고 정교하며, 위기일수록 말수가 더 짧아지는 타입

### 외형 묘사

- 사야는 \`정리된 사람\`처럼 보여야 한다.
  목선과 허리선이 단정한 롱 코트, 잘 접힌 지도 케이스, 얇은 필기 도구 홀더가 핵심이다.
- 기본 팔레트는 해무색 아이보리, 옅은 남색, 은빛 회색이 적합하다.
  과장된 장식보다 기록관다운 차분한 금속 장식이 어울린다.
- 머리는 단정히 묶거나 반묶음으로 정리하되,
  챕터가 진행될수록 몇 가닥이 흐트러져 감정 균열이 시각적으로 보이면 좋다.
- 눈매와 표정은 차갑기보다 집중력이 강한 인상으로 잡고,
  놀라거나 다급할 때만 숨겨 둔 다정함이 표면으로 새어 나오는 방향이 맞다.
- 실루엣 포인트는 얇고 곧은 선, 기록 장비의 정돈된 배치,
  그리고 위기 상황에서도 자세가 쉽게 무너지지 않는 점이다.

### 겉으로 보이는 성격

- 언제나 정황을 먼저 정리하고 감정 표현은 뒤로 미룬다.
- 남을 함부로 믿지 않지만, 한 번 신뢰한 사람은 끝까지 책임지려 한다.
- 논리적으로 말하려 애쓰지만 중요한 순간에는 숨겨 둔 다정함이 먼저 튀어나온다.

### 숨겨진 욕망과 상처

- 오래전 \`종편 실험\` 도중 사라진 언니를 되찾고 싶다는 마음이 이야기의 출발점이다.
- 새벽종 복구에 집착하는 이유는 세계를 살리기 위해서이기도 하지만,
  가장 깊은 곳에는 "그날을 되돌리고 싶다"는 사적인 후회가 남아 있다.
- 플레이어를 처음에는 종의 반응을 해석할 유일한 열쇠로 본다.
  그러나 항해가 이어질수록 플레이어를 \`수단으로만 보지 못하게 되는 것\`이
  그녀의 가장 큰 내적 갈등이 된다.

### 플레이어와의 관계

- 프롤로그: 유능한 협력자이자 위험한 단서로 플레이어를 관찰한다.
- 챕터 1: 플레이어가 사람을 먼저 구하는 모습을 보며 기록 대상이 아니라
  함께 등을 맡길 사람으로 보기 시작한다.
- 챕터 2: 판단이 갈릴 때마다 플레이어에게 기대는 자신을 자각하고 흔들린다.
- 챕터 3: 언니를 되찾고 싶은 마음과 플레이어를 잃고 싶지 않은 마음이 충돌한다.
- 엔딩: 어느 결말이든 플레이어와의 관계가 가장 큰 상실 혹은 희망의 잔향으로 남는다.

### 왜 메인 히로인인가

- 세계관 설명 담당에 머물지 않고,
  플레이어가 가장 자주 감정적으로 돌아오게 되는 인물이어야 한다.
- 사야의 선택은 언제나 \`세계를 붙잡고 싶은 이유\`와 \`플레이어를 놓치고 싶지 않은 마음\`
  사이에서 흔들려야 한다.
- 엔딩 직전 플레이어가 무엇을 지킬지 고민할 때,
  가장 개인적인 얼굴로 떠오르는 인물이 사야여야 한다.

### 서사 포인트

- 플레이어에게 항로, 세력, 세계 구조를 설명하는 안내자
- 후반부에는 안정된 미래를 선택하길 바라지만,
  플레이어를 희생시키는 방향으로는 선뜻 넘어가지 못한다
- 차분한 겉모습 아래 \`복구\`, \`상실\`, \`애정\`, \`죄책감\`이 함께 흐르는 인물

## 라오 템

### 기본 정보

- 포지션: 현장형 조력자, 구조선 선장, 생존 윤리의 대변자
- 소속: \`염해 길드\`
- 기본 인상: 웃음이 많고 거칠어 보이지만, 위기 상황에서 가장 먼저 몸이 움직이는 사람

### 외형 묘사

- 라오는 넓은 어깨와 짧은 준비 동작만으로도 \`몸이 먼저 나가는 사람\`이라는 인상이 보여야 한다.
- 소금과 햇빛에 바랜 갈색 피부, 군데군데 수선한 작업 재킷,
  굵은 장갑과 밧줄 하네스가 기본 장비로 어울린다.
- 팔레트는 녹슨 적갈, 모래빛 황토, 바랜 청록을 중심으로 두고
  구조 신호용 선명한 주황이나 붉은 천을 포인트로 섞으면 좋다.
- 머리와 수염은 지나치게 정리되지 않은 현장형이 맞지만,
  방치가 아니라 바쁜 생활의 흔적처럼 보여야 한다.
- 실루엣 포인트는 허리에 걸린 갈고리, 등 뒤의 구조용 접이창,
  그리고 무게 중심이 늘 앞으로 쏠려 있는 자세다.

### 겉으로 보이는 성격

- 말은 직설적이고 비꼬는 맛이 있지만, 실제 행동은 누구보다 빠르다.
- 규칙을 신뢰하지 않으며 상황 판단을 현장에서 다시 내리는 타입이다.
- 분노를 오래 품기보다 즉시 행동으로 밀어붙인다.

### 숨겨진 상처

- 과거 한 도시가 내일결 배급표에서 제외되어 무너지는 장면을 직접 봤다.
- 그때 구조 명령보다 봉인 명령이 우선되는 현실을 겪은 뒤,
  \`질서가 사람을 살린다\`는 말 자체를 믿지 않게 되었다.
- 그래서 누군가가 "큰 그림"을 말할수록 더 강하게 반발한다.

### 플레이어와의 관계

- 처음에는 플레이어를 아직 방향이 정해지지 않은 사람으로 본다.
- 챕터 1에서 사람을 먼저 구하려는 선택을 보고 조율원보다 나은 가능성으로 인정한다.
- 후반부에는 플레이어가 관리자 권한과 연결된 존재라는 사실을 알고도,
  \`그래도 지금 누구를 먼저 보느냐\`로 그를 판단한다.

### 서사 포인트

- 필드 탐험과 이동 거점 역할
- 플레이어에게 "미래보다 현재의 사람을 먼저 보라"는 관점을 제시
- 사야 렌과 정면충돌할 때도 악의가 아니라
  "다시는 누군가를 계산표 밖으로 밀어내고 싶지 않다"는 윤리에서 출발해야 한다

## 재상인 유라 베인

### 기본 정보

- 포지션: 대립자이자 잠재적 협력자, 통치 윤리의 구현체
- 소속: \`조율원\`
- 기본 인상: 절제되어 있고 빈틈이 없으며, 감정보다 비용과 결과를 먼저 본다.

### 외형 묘사

- 유라는 멀리서도 단번에 구분되는 \`수직적 실루엣\`이 중요하다.
  견고하게 재단된 긴 제복형 코트와 날 선 어깨선이 잘 어울린다.
- 기본 팔레트는 흑청, 냉백색, 무광 금속색이 적합하다.
  장식은 많지 않아야 하지만 각 장식의 기능과 계급감은 분명해야 한다.
- 장갑, 견장, 허리 장치 모두 \`정리된 권한\`처럼 보여야 하고,
  흐트러짐이나 우연성은 거의 없는 편이 좋다.
- 얼굴 인상은 화려함보다 피로를 숨긴 절제에 가깝다.
  눈밑에 옅은 그늘이나 잠을 줄여 버틴 흔적이 있으면 설득력이 높다.
- 실루엣 포인트는 직선, 억제된 움직임,
  그리고 주변 공기를 스스로 정렬시키는 듯한 정지 자세다.

### 겉으로 보이는 성격

- 항상 상대의 말을 끝까지 듣고 난 뒤 핵심만 잘라 답한다.
- 자신의 결정이 잔인하다는 사실을 숨기지 않는다.
- 동정 대신 책임을, 위로 대신 구조를 택한다.

### 숨겨진 공포

- 유라는 질서를 사랑한다기보다 붕괴를 누구보다 정확히 두려워하는 인물이다.
- 그녀가 미래를 통제하려는 이유는 권력욕보다
  "한 번 무너진 세계는 약자를 가장 먼저 집어삼킨다"는 확신에 가깝다.
- 그래서 스스로 악역처럼 보이는 선택도 감수한다.

### 플레이어와의 관계

- 플레이어를 자신이 될 수도 있었고,
  자신을 넘어설 수도 있는 존재로 본다.
- 사야 렌과 라오 템이 감정과 현장을 들이밀 때,
  유라는 플레이어에게 끝까지 \`비용의 총합\`을 묻는 인물이다.

### 서사 포인트

- 플레이어와 비슷한 방식으로 세계를 구하려 하지만 방법이 다르다
- 중후반부 동맹 또는 대립 루트 모두 가능
- 단순한 악역이 아니라 "가장 잔인한 계산이 때로는 가장 현실적인가"를 묻는 인물

## 무명의 아이 \`백야\`

### 기본 정보

- 포지션: 상징 인물, 진실의 안내자, 인간적 망설임의 잔재
- 외형 인상: 성별과 나이를 특정하기 어려운 중성적 어린아이
- 기본 인상: 시처럼 말하지만, 가장 아픈 진실을 정확히 찌른다.

### 외형 묘사

- 백야는 \`현실에 완전히 발 딛지 않은 존재\`처럼 보여야 한다.
  맨발, 젖은 옷자락, 물과 새벽빛이 동시에 남은 머리결이 핵심이다.
- 피부와 옷은 새하얗기보다 빛이 빠진 조개껍질 같은 색이 어울리고,
  가장자리에는 옅은 청금색이나 분홍빛 새벽 톤이 스친다.
- 눈동자는 또렷하게 그리기보다 빛이 맺혀 있는 수면처럼 표현하는 편이 좋다.
- 아이 체형이지만 정확한 나이를 짐작하기 어렵도록 팔다리 비율이나 표정을 약간 비현실적으로 두면 좋다.
- 실루엣 포인트는 발소리 없이 서 있는 자세,
  그리고 배경에 따라 조금씩 흐려지거나 번지는 윤곽이다.

### 존재의 성격

- 플레이어가 미래 파편을 들여다볼 때마다 반복해서 보게 되는 존재다.
- 늘 약간 늦은 타이밍으로 나타나 이미 지나간 후회를 되짚게 만든다.
- 실제로는 첫 역조 당시 새벽종의 핵심에 남겨진 \`인간적 연민\`의 인격 잔재다.

### 서사 기능

- 초반에는 불길한 예언자로 보이지만,
  후반에는 플레이어가 완전히 관리자적 선택으로 굳어지지 않게 붙드는 장치가 된다.
- 사야 렌이 복구를, 라오 템이 해방을, 유라가 통제를 말할 때
  백야는 늘 \`선택하는 손이 떨리고 있는가\`를 확인한다.

### 서사 포인트

- 세계의 진실을 암시하는 상징 인물
- 엔딩 선택에서 중요한 정서적 열쇠 역할
- 플레이어가 아직 인간으로 남아 있는지 비추는 마지막 거울

## 주요 관계 축 정리

- 플레이어 ↔ 사야 렌: 신뢰에서 시작해 서로의 약점을 먼저 알아 버리는 관계
- 플레이어 ↔ 라오 템: 행동과 생존을 통해 쌓는 전우 관계
- 플레이어 ↔ 유라 베인: 책임과 통치의 방식으로 맞부딪히는 거울 관계
- 플레이어 ↔ 백야: 잊고 싶던 인간성을 끝까지 상기시키는 내면 관계
- 사야 렌 ↔ 라오 템: 복구와 해방이 부딪히는 가치 충돌 관계
- 사야 렌 ↔ 유라 베인: 같은 복구 논리를 공유하지만, 포기할 수 있는 선이 다른 관계

## 아트 작업용 실루엣 체크

- 플레이어, 라오 템은 \`현장 장비가 먼저 보이는 실루엣\`으로 차별화한다.
- 사야 렌과 유라 베인은 둘 다 정돈된 인물이지만,
  사야는 유연한 곡선과 얇은 장비선, 유라는 수직선과 권위적 재단선으로 구분한다.
- 백야는 다른 인물과 달리 장비보다 \`빛의 번짐\`이 먼저 읽히도록 잡는다.
- 다섯 인물 모두 후면 실루엣만 봐도 구분되게 외투 길이, 어깨선, 휴대 장비 위치를 다르게 설계한다.
`,F=Object.freeze({title:"반향해 연대기",subtitle:"내일이 결정으로 떠오르는 세계에서, 사라진 새벽을 추적하는 해양 판타지 RPG 설정집",pitch:"플레이어는 미래의 잔향을 들을 수 있는 여명 인양사가 되어, 도시 국가와 고대 장치가 얽힌 세계에서 내일의 소유권을 둘러싼 전쟁을 마주한다.",setting:"반향해 기반 해양 판타지",mood:"몽환적 서정성과 시간 재난",coreConflict:"미래를 통제할 것인가, 모두에게 되돌릴 것인가"}),An=Object.freeze([{label:"세계 키워드",value:"반향해, 내일결, 새벽종"},{label:"플레이어 역할",value:"미래 반향을 듣는 여명 인양사"},{label:"메인 목표",value:"일곱 개의 새벽 종편 회수"},{label:"메인 플레이타임",value:"약 8시간"},{label:"문서 구성",value:"시나리오 6종 + 인물 외형 메모"},{label:"서사 테마",value:"강한 미래는 누군가의 가능성을 앗아간다"}]),Tn=Object.freeze([{title:"미래를 자원처럼 쓰는 세계",text:"전투와 탐험, 정치가 모두 내일결 배분 구조와 연결된다."},{title:"상실을 전제로 한 성장",text:"강력한 힘은 기억, 관계, 현재 감각을 대가로 요구한다."},{title:"항해형 지역 구조",text:"도시와 던전이 조류와 시간대에 따라 다른 규칙을 가진다."}]),Cn=Object.freeze([{era:"첫 역조",detail:"하늘과 바다의 경계가 뒤집히고 반향해가 생겨난다."},{era:"새벽종 시대",detail:"고대인들이 미래 배급 장치를 만들고 문명을 안정시킨다."},{era:"무월조 발발",detail:"내일결 생성이 멈추고 일부 지역에서 아침이 사라진다."},{era:"플레이어의 항해",detail:"종편 회수와 세계 질서 재구성의 선택이 시작된다."}]),q=Object.freeze([{id:"story-overview",title:"스토리 개요",category:"메인 설정",summary:"세계의 한 줄 콘셉트, 플레이어 역할, 메인 목표를 빠르게 파악하는 문서",fileName:"src/content/lore/story-overview.md",accent:"teal",content:dn},{id:"main-story",title:"메인 스토리",category:"메인 설정",summary:"프롤로그부터 엔딩 선택까지의 3막 구조와 핵심 반전을 정리한 문서",fileName:"src/content/lore/main-story.md",accent:"gold",content:pn},{id:"scenario-overview",title:"시나리오 개요",category:"시나리오 설계",summary:"메인 엔딩까지 약 8시간 기준의 챕터 수, 플레이타임, 대사 스크립트 작성 원칙을 정리한 문서",fileName:"src/content/scenario/00-overview.md",accent:"teal",content:hn},{id:"scenario-prologue",title:"프롤로그",category:"챕터 시나리오",summary:"미라진에서 사라진 새벽을 목격하고 첫 항해를 시작하는 도입 챕터와 상세 대사 문서",fileName:"src/content/scenario/01-prologue.md",accent:"coral",content:mn},{id:"scenario-chapter-1",title:"챕터 1",category:"챕터 시나리오",summary:"유리염 사구에서 생존 갈등을 체감하고 첫 두 개의 종편을 회수하는 장면별 스크립트 문서",fileName:"src/content/scenario/02-chapter-1.md",accent:"gold",content:fn},{id:"scenario-chapter-2",title:"챕터 2",category:"챕터 시나리오",summary:"역항도 카델에서 유라 베인의 질서 논리와 두 개의 종편을 마주하는 장면별 스크립트 문서",fileName:"src/content/scenario/03-chapter-2.md",accent:"plum",content:yn},{id:"scenario-chapter-3",title:"챕터 3",category:"챕터 시나리오",summary:"속삭임 과수원과 척추탑에서 진실과 플레이어 정체성을 드러내는 장면별 스크립트 문서",fileName:"src/content/scenario/04-chapter-3.md",accent:"slate",content:gn},{id:"scenario-ending",title:"엔딩",category:"챕터 시나리오",summary:"침묵 산호궁 최종 던전과 세 가지 메인 엔딩 선택을 상세 스크립트로 정리한 문서",fileName:"src/content/scenario/05-ending.md",accent:"rose",content:bn},{id:"audio-scenario-bgm",title:"시나리오 기반 BGM 기획",category:"오디오 설계",summary:"시나리오를 읽고 정리한 장면별 음악 요구, 트랙 매핑, Web Audio 제작 구조를 정리한 문서",fileName:"src/content/audio/scenario-bgm-direction.md",accent:"gold",content:vn},{id:"world-rules",title:"세계 규칙",category:"시스템 설정",summary:"반향해, 내일결, 시간 균열, 여명 인양사의 규칙을 정의한 문서",fileName:"src/content/lore/world-rules.md",accent:"coral",content:wn},{id:"regions",title:"지역 설정",category:"세부 설정",summary:"항구, 사막, 역중력 도시, 최종 던전 등 탐험 지역의 성격을 정리한 문서",fileName:"src/content/lore/regions.md",accent:"plum",content:Sn},{id:"factions",title:"세력 설정",category:"세부 설정",summary:"조율원, 염해 길드, 공백 법정 등 주요 집단의 논리와 강약점을 정의한 문서",fileName:"src/content/lore/factions.md",accent:"slate",content:Mn},{id:"characters",title:"인물 설정",category:"세부 설정",summary:"플레이어와 주요 인물의 역할, 감정선, 외형 디자인 포인트를 정리한 문서",fileName:"src/content/lore/characters.md",accent:"rose",content:kn}]),Q=document.querySelector("#app");if(!Q)throw new Error("앱 루트 요소를 찾을 수 없습니다.");const qn=Object.freeze(["scenario-overview","scenario-prologue","scenario-chapter-1","scenario-chapter-2","scenario-chapter-3","scenario-ending","audio-scenario-bgm","characters"]),Y=Object.freeze(qn.map(e=>q.find(t=>t.id===e)).filter(Boolean));function _(e){return q.find(t=>t.id===e)}function x(e){return C.find(t=>t.id===e)}function W(){const e=decodeURIComponent(window.location.hash.replace(/^#/,""));return _(e)?e:""}function $n(e){const t=`#${e}`;window.location.hash!==t&&window.history.replaceState(null,"",t)}function On(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function E(e){return On(e).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>")}function In(e){const t=e.trim().split(/\r?\n/),s=[];let a=[],r=[],l="ul",i=[];const c=()=>{a.length&&(s.push(`<p>${a.map(E).join("<br />")}</p>`),a=[])},u=()=>{if(!r.length)return;const d=r.map(p=>`<li>${E(p)}</li>`).join("");s.push(`<${l}>${d}</${l}>`),r=[],l="ul"},h=()=>{i.length&&(s.push(`<blockquote><p>${i.map(E).join("<br />")}</p></blockquote>`),i=[])};for(const d of t){const p=d.trimEnd(),m=p.match(/^(#{1,3})\s+(.*)$/),y=p.match(/^-\s+(.*)$/),g=p.match(/^\d+\.\s+(.*)$/),S=p.match(/^>\s?(.*)$/);if(!p.trim()){c(),u(),h();continue}if(p==="---"){c(),u(),h(),s.push("<hr />");continue}if(m){c(),u(),h();const $=m[1].length;s.push(`<h${$}>${E(m[2])}</h${$}>`);continue}if(y){c(),h(),l!=="ul"&&r.length&&u(),l="ul",r.push(y[1]);continue}if(g){c(),h(),l!=="ol"&&r.length&&u(),l="ol",r.push(g[1]);continue}if(S){c(),u(),i.push(S[1]);continue}a.push(p)}return c(),u(),h(),s.join("")}function En(e,t){const s=document.querySelector("[data-document-nav]");s&&(s.innerHTML=q.map(a=>`
        <button
          type="button"
          class="document-card${a.id===e?" is-active":""}"
          data-document-trigger="${a.id}"
        >
          <span class="document-card__category">${a.category}</span>
          <strong>${a.title}</strong>
          <span>${a.summary}</span>
        </button>
      `).join(""),s.querySelectorAll("[data-document-trigger]").forEach(a=>{a.addEventListener("click",()=>{t(a.getAttribute("data-document-trigger")||e)})}))}function Rn(e,t){const s=document.querySelector("[data-featured-links]");s&&(s.innerHTML=Y.map(a=>`
        <button
          type="button"
          class="spotlight-card spotlight-card--${a.accent}${a.id===e?" is-active":""}"
          data-featured-trigger="${a.id}"
        >
          <span class="spotlight-card__category">${a.category}</span>
          <strong>${a.title}</strong>
          <span>${a.summary}</span>
          <span class="spotlight-card__file">${a.fileName}</span>
        </button>
      `).join(""),s.querySelectorAll("[data-featured-trigger]").forEach(a=>{a.addEventListener("click",()=>{t(a.getAttribute("data-featured-trigger")||e)})}))}function jn(e){const t=_(e)??q[0],s=document.querySelector("[data-document-viewer]");!s||!t||(s.innerHTML=`
    <div class="viewer-meta">
      <span class="viewer-meta__badge viewer-meta__badge--${t.accent}">${t.category}</span>
      <span class="viewer-meta__file">${t.fileName}</span>
    </div>
    <header class="viewer-header">
      <h2>${t.title}</h2>
      <p>${t.summary}</p>
    </header>
    <article class="markdown-body">${In(t.content)}</article>
  `)}function _n(e){if(!e.supported)return"이 브라우저는 Web Audio 렌더링을 지원하지 않습니다.";switch(e.status){case"rendering":return`${e.pendingTrackTitle||"트랙"}을 브라우저에서 합성하고 있습니다.`;case"playing":return`${e.currentTrackTitle} 재생 중`;case"stopped":return"재생이 멈췄습니다.";case"error":return e.errorMessage||"오디오를 준비하지 못했습니다.";default:return"재생 버튼을 눌러 첫 합성을 시작하세요."}}function L(e,t){const s=document.querySelector("[data-music-console]"),a=document.querySelector("[data-music-track-list]");if(!s||!a)return;const r=e.getSnapshot(),l=x(r.currentTrackId),i=x(r.pendingTrackId);s.innerHTML=`
    <div class="music-console__topline">
      <span class="eyebrow">Web Audio Score</span>
      <span class="music-console__status music-console__status--${r.status}">
        ${_n(r)}
      </span>
    </div>
    <div class="music-console__hero">
      <div>
        <p class="music-console__label">Now Playing</p>
        <h3>${l?.title??i?.title??"대기 중"}</h3>
        <p class="music-console__copy">
          ${l?.summary??i?.summary??"장면에 맞는 트랙을 선택하면 브라우저 안에서 직접 합성해 재생합니다."}
        </p>
      </div>
      <div class="music-console__chips">
        <span>${l?.category??i?.category??"시나리오 BGM"}</span>
        <span>${l?.chapter??i?.chapter??"전체 문서 기반 설계"}</span>
        <span>${l?`${l.tempo} BPM`:i?`${i.tempo} BPM`:"10 Tracks"}</span>
      </div>
    </div>
    <div class="music-console__controls">
      <button
        type="button"
        class="music-action music-action--primary"
        data-audio-stop
        ${r.isPlaying?"":"disabled"}
      >
        정지
      </button>
      <label class="music-volume">
        <span>볼륨</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value="${Math.round(r.volume*100)}"
          data-audio-volume
        />
        <strong>${Math.round(r.volume*100)}%</strong>
      </label>
      <button type="button" class="music-action" data-audio-open-doc>오디오 설계 문서</button>
    </div>
    <p class="music-console__note">
      모든 트랙은 <code>Web Audio API</code>로 합성되며, 한 번에 하나만 재생됩니다. 첫 재생 시 브라우저 정책 때문에 버튼 클릭이 필요합니다.
    </p>
  `,s.querySelector("[data-audio-stop]")?.addEventListener("click",()=>{e.stop()}),s.querySelector("[data-audio-open-doc]")?.addEventListener("click",()=>{t("audio-scenario-bgm")}),s.querySelector("[data-audio-volume]")?.addEventListener("input",c=>{const u=c.currentTarget;u instanceof HTMLInputElement&&e.setVolume(Number(u.value)/100)}),a.innerHTML=C.map(c=>{const u=r.currentTrackId===c.id&&r.isPlaying,h=r.pendingTrackId===c.id,d=c.scenarioRefs.map(p=>_(p)?.title).filter(Boolean).slice(0,3);return`
      <article class="music-card${u?" is-active":""}${h?" is-pending":""}">
        <div class="music-card__header">
          <div>
            <span class="music-card__category">${c.category}</span>
            <h3>${c.title}</h3>
          </div>
          <button
            type="button"
            class="music-action music-action--${u?"secondary":"primary"}"
            data-audio-play="${c.id}"
            ${!r.supported||h?"disabled":""}
          >
            ${h?"준비 중...":u?"재생 중":"재생"}
          </button>
        </div>
        <p class="music-card__summary">${c.summary}</p>
        <dl class="music-card__meta">
          <div>
            <dt>챕터</dt>
            <dd>${c.chapter}</dd>
          </div>
          <div>
            <dt>분위기</dt>
            <dd>${c.mood}</dd>
          </div>
          <div>
            <dt>리듬</dt>
            <dd>${c.tempo} BPM · ${c.meter}/4</dd>
          </div>
        </dl>
        <div class="music-card__chips">
          ${c.useCases.map(p=>`<span>${p}</span>`).join("")}
        </div>
        <div class="music-card__footer">
          <span>${d.join(" · ")}</span>
          <button type="button" class="music-link" data-audio-ref="${c.scenarioRefs[0]}">
            관련 문서 열기
          </button>
        </div>
      </article>
    `}).join(""),a.querySelectorAll("[data-audio-play]").forEach(c=>{c.addEventListener("click",()=>{const u=c.getAttribute("data-audio-play");if(u){if(r.currentTrackId===u&&r.isPlaying){e.stop();return}e.playTrack(u)}})}),a.querySelectorAll("[data-audio-ref]").forEach(c=>{c.addEventListener("click",()=>{const u=c.getAttribute("data-audio-ref");u&&t(u)})})}function Gn(){Q.innerHTML=`
    <div class="page-shell">
      <header class="hero">
        <div class="hero__content">
          <p class="eyebrow">Issue #59 · Scenario BGM Suite</p>
          <h1>${F.title}</h1>
          <p class="hero__subtitle">${F.subtitle}</p>
          <p class="hero__pitch">${F.pitch}</p>
        </div>
        <div class="hero__panel">
          <dl class="hero-stats">
            ${An.map(e=>`
                  <div>
                    <dt>${e.label}</dt>
                    <dd>${e.value}</dd>
                  </div>
                `).join("")}
          </dl>
        </div>
      </header>

      <main class="layout">
        <section class="spotlight-section" aria-label="이번 브랜치 바로가기">
          <div class="section-heading">
            <p class="eyebrow">Branch Focus</p>
            <h2>이번 브랜치에서 바로 볼 문서</h2>
            <p class="section-copy">
              메인 시나리오와 새로 추가한 오디오 설계 문서를 빠르게 오갈 수 있도록 묶었습니다.
            </p>
          </div>
          <div class="spotlight-grid" data-featured-links></div>
        </section>

        <section class="music-section" aria-label="시나리오 기반 음악">
          <div class="section-heading">
            <p class="eyebrow">Scenario Score</p>
            <h2>시나리오 기반 BGM 청취</h2>
            <p class="section-copy">
              문서에서 정리한 장면별 감정선을 기준으로 만든 트랙들입니다. 버튼을 누르면 브라우저 안에서 직접 합성해서 재생합니다.
            </p>
          </div>
          <div class="music-layout">
            <article class="music-console" data-music-console></article>
            <div class="music-track-grid" data-music-track-list></div>
          </div>
        </section>

        <section class="info-grid" aria-label="핵심 기둥">
          ${Tn.map(e=>`
                <article class="info-card">
                  <h2>${e.title}</h2>
                  <p>${e.text}</p>
                </article>
              `).join("")}
        </section>

        <section class="timeline-section" aria-label="타임라인">
          <div class="section-heading">
            <p class="eyebrow">World Flow</p>
            <h2>세계 사건 흐름</h2>
          </div>
          <div class="timeline">
            ${Cn.map(e=>`
                  <article class="timeline__item">
                    <strong>${e.era}</strong>
                    <p>${e.detail}</p>
                  </article>
                `).join("")}
          </div>
        </section>

        <section class="viewer-section">
          <div class="section-heading">
            <p class="eyebrow">Story Viewer</p>
            <h2>스토리와 설정 문서 전체 보기</h2>
            <p class="section-copy">
              왼쪽 전체 목록과 위 빠른 열기를 함께 써서 챕터 문서, 설정 문서, 오디오 설계 문서를 오갈 수 있습니다.
            </p>
          </div>
          <div class="viewer-layout">
            <nav class="document-nav" data-document-nav aria-label="문서 목록"></nav>
            <section class="document-viewer" data-document-viewer aria-live="polite"></section>
          </div>
        </section>
      </main>
    </div>
  `}function zn(){let e=W()||Y[0]?.id||q[0]?.id||"",t=null;const s=(a,{syncHash:r=!0}={})=>{e=_(a)?.id??e,Rn(e,s),En(e,s),jn(e),r&&$n(e),t&&L(t,s)};Gn(),t=new un({initialTrackId:"echoes-of-tomorrow",initialVolume:.58,onStateChange:()=>{L(t,s)}}),s(e),L(t,s),window.addEventListener("hashchange",()=>{const a=W();a&&a!==e&&s(a,{syncHash:!1})}),window.addEventListener("beforeunload",()=>{t?.destroy()},{once:!0})}zn();
