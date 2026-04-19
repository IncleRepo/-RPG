(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(s){if(s.ep)return;s.ep=!0;const i=t(s);fetch(s.href,i)}})();const j=""+new URL("01-tides-of-the-unarrived-dawn-s_Ku7bdq.mp3",import.meta.url).href,A=""+new URL("02-twilight-over-mirajin-Bp0rsTe1.mp3",import.meta.url).href,q=""+new URL("03-saltglass-horizon-DWtSCHK_.mp3",import.meta.url).href,U=""+new URL("04-inverted-harbor-of-kadel-C4m1LfRM.mp3",import.meta.url).href,$=""+new URL("05-fracture-chase-CD2c6Hvv.mp3",import.meta.url).href,G=""+new URL("06-bellshard-skirmish-_gbuKm7S.mp3",import.meta.url).href,F=""+new URL("07-whispers-beneath-the-orchard-C9gNFPhc.mp3",import.meta.url).href,K=""+new URL("08-abyssal-choir-reborn-dIGgSxeB.mp3",import.meta.url).href,N=Object.freeze([{id:"main-theme",title:"Tides Of The Unarrived Dawn",koreanTitle:"반향해 연대기 메인 테마",category:"타이틀 / 메인 테마",accent:"gold",durationLabel:"1:50",chapters:"전체 공통",sceneUse:"타이틀, 핵심 컷신 회고, 메인 메뉴 대표곡",mood:"장엄한 바다 판타지, 비터스위트한 상실, 앞으로 나아가야 하는 의지",instrumentation:"현악, 피아노, 호른, 유리 질감 벨, 깊은 저역 퍼커션",summary:"세계관의 규모감과 플레이어의 책임감을 동시에 들려주는 대표 테마입니다.",src:j,fileName:"assets/audio/01-tides-of-the-unarrived-dawn.mp3"},{id:"mirajin-hub",title:"Twilight Over Mirajin",koreanTitle:"미라진 황혼 허브",category:"마을 / 허브 지역",accent:"coral",durationLabel:"2:40",chapters:"프롤로그",sceneUse:"항구 조사, 출항 전 대화, 미라진 탐색",mood:"사라진 새벽의 정적, 조용한 죄책감, 아직 남아 있는 희망",instrumentation:"펠트 피아노, 저목관, 부드러운 현, 먼 종소리",summary:"영원한 황혼에 잠긴 항구의 쓸쓸함을 허브 탐색에 맞는 밀도로 정리한 곡입니다.",src:A,fileName:"assets/audio/02-twilight-over-mirajin.mp3"},{id:"glass-salt-exploration",title:"Saltglass Horizon",koreanTitle:"유리염 사구 탐험",category:"탐험",accent:"teal",durationLabel:"3:14",chapters:"챕터 1",sceneUse:"사구 필드 이동, 폐채굴 첨탑 전 탐험, 구조 동선 이동",mood:"황량함, 생존감, 묻힌 기억의 메아리, 넓은 수평선",instrumentation:"공기감 있는 현, 부드러운 타악, 유리성 타건, 낮은 첼로",summary:"미래가 메마른 땅의 공허함과 탐험 리듬을 함께 살리는 메인 필드 테마입니다.",src:q,fileName:"assets/audio/03-saltglass-horizon.mp3"},{id:"kadel-city",title:"Inverted Harbor Of Kadel",koreanTitle:"역항도 카델",category:"도시 / 정치 긴장",accent:"plum",durationLabel:"4:05",chapters:"챕터 2",sceneUse:"카델 진입, 도시 조사, 협상 이후 이동 구간",mood:"우아한 압박감, 불안한 균형, 규율의 아름다움과 냉기",instrumentation:"말렛 오스티나토, 절제된 브라스, 정교한 현, 기계 펄스",summary:"질서로 떠받친 도시의 위압감을 과도한 소음 없이 유지하도록 설계한 곡입니다.",src:U,fileName:"assets/audio/04-inverted-harbor-of-kadel.mp3"},{id:"crisis-pursuit",title:"Fracture Chase",koreanTitle:"붕괴 추적과 긴장",category:"긴장 / 추적",accent:"slate",durationLabel:"3:20",chapters:"프롤로그, 챕터 1, 챕터 2, 엔딩",sceneUse:"시계탑 탈출, 구조전 직전, 카델 붕괴, 산호궁 붕괴 구간",mood:"급박한 이동, 무너지는 구조물, 사람을 먼저 구해야 하는 압력",instrumentation:"빠른 현 리듬, 깊은 탐, 절제된 신스 펄스, 짧은 금관 액센트",summary:"추격과 재난 상황에서 긴장을 끌어올리되 피로한 자극음으로 흐르지 않게 조정한 액션 트랙입니다.",src:$,fileName:"assets/audio/05-fracture-chase.mp3"},{id:"battle-skirmish",title:"Bellshard Skirmish",koreanTitle:"일반 전투",category:"전투",accent:"rose",durationLabel:"2:52",chapters:"전 챕터 공통",sceneUse:"일반 전투, 균열 생물 교전, 중간 보스 전 전반",mood:"전투 추진력, 영웅성, 비극의 그림자가 남아 있는 긴장감",instrumentation:"리듬 현, 브라스, 저역 타격, 어두운 드론",summary:"스토리 중심 RPG에 맞춰 추진력은 확보하되 과도한 공격성은 피한 공용 전투 곡입니다.",src:G,fileName:"assets/audio/06-bellshard-skirmish.mp3"},{id:"orchard-revelation",title:"Whispers Beneath The Orchard",koreanTitle:"감정 이벤트와 진실",category:"감정 이벤트",accent:"teal",durationLabel:"3:05",chapters:"챕터 3",sceneUse:"속삭임 과수원, 사야 렌 고백, 척추탑 진실 공개",mood:"친밀감, 후회, 신뢰, 돌이킬 수 없는 진실의 무게",instrumentation:"피아노, 솔로 첼로, 하프, 유리 하모닉, 숨 쉬는 듯한 현",summary:"관계와 진실이 동시에 무너져 내리는 장면을 위해 설계한 감정 축 중심 테마입니다.",src:F,fileName:"assets/audio/07-whispers-beneath-the-orchard.mp3"},{id:"boss-ending",title:"Abyssal Choir Reborn",koreanTitle:"최종 결전과 엔딩",category:"보스전 / 엔딩",accent:"gold",durationLabel:"3:05",chapters:"엔딩",sceneUse:"심연의 합창기 보스전, 마지막 선택, 엔딩 크레딧",mood:"압도적 결전, 세계의 무게, 비터스위트한 새벽과 후일담",instrumentation:"거대한 저현, 브라스, 깊은 종소리, 피아노, 열리는 현 합주",summary:"최종 보스전의 중압감에서 엔딩의 여운까지 한 곡 안에서 아우르는 대서사 트랙입니다.",src:K,fileName:"assets/audio/08-abyssal-choir-reborn.mp3"}]),_=document.querySelector("#app");if(!_)throw new Error("앱 루트 요소를 찾을 수 없습니다.");const h=320,p=180,L=1120,d=144,z=860,W=320,T=12,Y=30,X=86,J=248,V=.16,Q=.28,b=100,f=100,R=N.reduce((n,e)=>(n[e.id]=e,n),{}),Z=new Set(["ArrowLeft","ArrowRight","KeyA","KeyD","ArrowUp","KeyW","Space","ShiftLeft","ShiftRight","KeyJ","KeyE","KeyQ","KeyR","Enter"]),x=Object.freeze([{max:244,label:"동쪽 방파제"},{max:640,label:"멈춘 어시장"},{max:760,label:"시계탑 외곽 광장"},{max:932,label:"시계탑 하층"},{max:1/0,label:"붕괴한 방파제 끝"}]),C=Object.freeze([{left:450,right:530,top:120,style:"wood"},{left:856,right:922,top:114,style:"stone"}]),S=Object.freeze([{id:"cart",type:"inspect",x:178,y:d,radius:20,label:"뒤집힌 수레"},{id:"fisherman",type:"npc",x:320,y:d,radius:24,label:"어부"},{id:"rope-bundle",type:"echo",x:392,y:d,radius:24,label:"어부의 밧줄 묶음",stepLabel:"밧줄 묶음 잔향 회수"},{id:"medicine",type:"echo",x:492,y:120,radius:24,label:"약사의 약상자",stepLabel:"약상자 잔향 회수"},{id:"lever",type:"echo",x:590,y:d,radius:24,label:"등대 제어 레버",stepLabel:"등대 레버 잔향 회수"},{id:"saya",type:"npc",x:720,y:d,radius:26,label:"사야 렌"},{id:"bell-shell",type:"device",x:978,y:d,radius:26,label:"새벽종 외피"},{id:"rope-line",type:"exit",x:1088,y:d,radius:24,label:"라오 템의 구조선"}]);function o(n,e,t){return Math.min(Math.max(n,e),t)}function ee(n,e,t){return n+(e-n)*t}function te(n,e){return Math.hypot(n.x-e.x,n.y-e.y)}function ae(n,e){return n.left<=e.right&&n.right>=e.left&&n.top<=e.bottom&&n.bottom>=e.top}function se(n){return R[n]?.koreanTitle??"사운드 대기"}function w(n,e){return n==="sentinel"?{id:`sentinel-${Math.random().toString(36).slice(2,8)}`,type:n,x:e,y:d,width:26,height:28,hp:142,maxHp:142,breakMeter:0,breakLimit:112,facing:-1,moveSpeed:34,attackRange:34,attackCooldown:1.8,state:"idle",attackTimer:0,stunTimer:0,hurtTimer:0,vx:0,windupDone:!1}:{id:`wraith-${Math.random().toString(36).slice(2,8)}`,type:n,x:e,y:d,width:18,height:18,hp:44,maxHp:44,breakMeter:0,breakLimit:38,facing:-1,moveSpeed:28,attackRange:20,attackCooldown:1.1,state:"idle",attackTimer:0,stunTimer:0,hurtTimer:0,vx:0}}function E(){return{started:!1,completed:!1,phase:"title",zone:"동쪽 방파제",elapsed:0,cameraX:0,shake:0,objective:{title:"비명 소리가 난 항구 쪽으로 이동",steps:["방파제 끝에서 이동 조작을 익힌다"]},banner:{text:"프롤로그 시작 준비",timer:0},overlay:{visible:!0,title:"사라진 새벽의 첫 단서",body:"한 화면짜리 프롤로그 버티컬 슬라이스입니다. 이동, 조사, 대화, 기본 전투, 종료 연출을 순서대로 체험하며 메인 루프를 검증합니다.",primaryLabel:"프롤로그 시작",primaryMode:"start"},prompt:"",logs:["키보드 기준: 이동, 조사, 전투, HUD를 모두 한 화면에서 확인할 수 있습니다."],echoesFound:new Set,activeDialogue:null,activeInteractableId:"",encounter:"탐험",checkpointX:74,checkpointPhase:"approach",currentTrackId:"mirajin-hub",audioEnabled:!1,player:{x:74,y:d,vx:0,vy:0,width:T,height:Y,facing:1,onGround:!0,moveIntent:0,hp:b,resonance:f,burden:0,hitTimer:0,invulnerableTimer:0,dashCooldown:0,dashTimer:0,dashDirection:1,attackTimer:0,attackStep:0,attackHitIds:new Set,comboTimer:0,wardTimer:0,wardCooldown:0,dashUnlocked:!1,wardUnlocked:!1,requestedJump:!1},enemies:[],effects:[],barriers:{left:null,right:null,gateClosed:!0},flags:{sawMarketObjective:!1,metSaya:!1,arenaCleared:!1,bellInspected:!1,bossCleared:!1}}}_.innerHTML=`
  <div class="game-page">
    <header class="landing">
      <div class="landing__copy">
        <p class="landing__eyebrow">Issue #76 · Prologue Vertical Slice</p>
        <h1 class="landing__title">반향해 연대기</h1>
        <p class="landing__subtitle">
          멈춘 새벽의 항구를 직접 걸으며 조사, 대화, 기본 전투, HUD 흐름을 검증하는
          프롤로그 플레이 프로토타입입니다.
        </p>
        <p class="landing__body">
          메인 주소는 이제 문서 뷰어가 아니라 실제 게임 진입점입니다. 프롤로그 일부를 한 구간으로
          압축해, 문서에 적힌 분위기와 핵심 루프가 플레이 감각으로 이어지는지 바로 확인할 수 있게
          정리했습니다.
        </p>
        <div class="landing__actions">
          <button type="button" class="action-button action-button--primary" data-start-button>
            프롤로그 시작
          </button>
          <a class="button-link button-link--secondary" href="./docs.html#prologue-playflow">
            문서 · BGM 뷰어 열기
          </a>
        </div>
      </div>

      <aside class="landing__panel" aria-label="버티컬 슬라이스 요약">
        <div class="stat-grid">
          <article class="stat-card">
            <strong>구현 범위</strong>
            <span>이동, 조사, 대화, HUD, 실시간 전투, 프롤로그 종료 연출</span>
          </article>
          <article class="stat-card">
            <strong>톤 & 비주얼</strong>
            <span>320×180 픽셀 캔버스 위에 항구 황혼 톤과 절제된 도트 모션을 맞췄습니다.</span>
          </article>
          <article class="stat-card">
            <strong>페이지 구조</strong>
            <span>메인 진입은 게임, 문서와 BGM 아카이브는 별도 docs.html로 분리했습니다.</span>
          </article>
        </div>
      </aside>
    </header>

    <main class="experience">
      <section class="game-stage__shell" aria-labelledby="slice-heading">
        <div class="game-stage__header">
          <div class="section-heading">
            <p class="section-heading__eyebrow">Playable Slice</p>
            <h2 id="slice-heading">미라진 프롤로그</h2>
            <p>오른쪽으로 전진하며 조사 목표를 완료하고, 시계탑 하층 전투를 돌파한 뒤 구조선으로 탈출하세요.</p>
          </div>
          <div class="status-badges" aria-label="상태 요약">
            <span class="status-pill status-pill--teal" data-zone-badge>동쪽 방파제</span>
            <span class="status-pill status-pill--gold" data-echo-badge>잔향 0/3</span>
            <span class="status-pill status-pill--rose" data-encounter-badge>탐험</span>
          </div>
        </div>

        <div class="game-frame">
          <canvas class="game-canvas" width="${h}" height="${p}" data-game-canvas></canvas>

          <div class="frame-ui">
            <div class="hud-cluster hud-cluster--top-left">
              <section class="hud-card" aria-label="플레이어 상태">
                <p class="hud-card__label">여명 인양사</p>
                <div class="meter">
                  <div class="meter__track">
                    <div class="meter__fill meter__fill--hp" data-hp-fill></div>
                  </div>
                  <div class="meter__meta">
                    <span>HP</span>
                    <span data-hp-text>100 / 100</span>
                  </div>
                </div>
                <div class="meter">
                  <div class="meter__track">
                    <div class="meter__fill meter__fill--resonance" data-resonance-fill></div>
                  </div>
                  <div class="meter__meta">
                    <span>공명</span>
                    <span data-resonance-text>100 / 100</span>
                  </div>
                </div>
                <div class="memory-burden" aria-label="기억 부담">
                  <span class="memory-burden__node" data-burden-node="0"></span>
                  <span class="memory-burden__node" data-burden-node="1"></span>
                  <span class="memory-burden__node" data-burden-node="2"></span>
                </div>
                <p class="hud-card__caption">강한 방어를 사용할수록 기억 부담이 쌓입니다.</p>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--top-right">
              <section class="hud-card hud-card--objective" aria-label="현재 목표">
                <p class="hud-card__label">현재 목표</p>
                <div class="hud-card__value" data-objective-title></div>
                <ul class="objective-list" data-objective-list></ul>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--bottom-left">
              <section class="hud-card" aria-label="최근 기록">
                <p class="hud-card__label">현장 기록</p>
                <ul class="log-list" data-log-list></ul>
              </section>
            </div>

            <div class="hud-cluster hud-cluster--bottom-right">
              <section class="hud-card" aria-label="장착 액션">
                <p class="hud-card__label">액션 슬롯</p>
                <div class="skill-grid">
                  <div class="skill-chip is-ready" data-skill-chip="attack">
                    <strong>J 기본 공격</strong>
                    <span>연속 참격</span>
                  </div>
                  <div class="skill-chip is-locked" data-skill-chip="dash">
                    <strong>Shift 선행 발자국</strong>
                    <span>짧은 회피 이동</span>
                  </div>
                  <div class="skill-chip is-locked" data-skill-chip="ward">
                    <strong>R 미도착 상처</strong>
                    <span>피해 지연 보호</span>
                  </div>
                </div>
              </section>
            </div>

            <section class="hud-card hud-card--prompt" data-prompt-card aria-live="polite">
              <div data-prompt-text></div>
            </section>
          </div>

          <div class="dialogue-box" data-dialogue hidden>
            <div class="dialogue-box__panel">
              <p class="dialogue-box__speaker" data-dialogue-speaker></p>
              <p class="dialogue-box__text" data-dialogue-text></p>
              <div class="dialogue-box__footer">
                <span class="dialogue-box__hint">E, Enter, Space로 다음</span>
                <button type="button" class="dialogue-box__next" data-dialogue-next>
                  다음 대사
                </button>
              </div>
            </div>
          </div>

          <div class="frame-overlay" data-overlay>
            <div class="overlay-panel">
              <h2 data-overlay-title>사라진 새벽의 첫 단서</h2>
              <p data-overlay-body>
                한 화면짜리 프롤로그 버티컬 슬라이스입니다. 이동, 조사, 대화, 기본 전투, 종료
                연출을 순서대로 체험하며 메인 루프를 검증합니다.
              </p>
              <div class="overlay-panel__actions">
                <button type="button" class="action-button action-button--primary" data-overlay-primary>
                  프롤로그 시작
                </button>
                <a class="button-link button-link--secondary" href="./docs.html#prologue-playflow">
                  문서 기준 확인
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <aside class="sidebar">
        <section class="slice-card">
          <h2 class="panel-title">플레이 가이드</h2>
          <div class="control-grid">
            <article class="control-chip">
              <strong>이동</strong>
              <span>A/D 또는 방향키, Space 점프</span>
            </article>
            <article class="control-chip">
              <strong>조사</strong>
              <span>E 상호작용, Q 새벽 청취</span>
            </article>
            <article class="control-chip">
              <strong>전투</strong>
              <span>J 연속 공격</span>
            </article>
            <article class="control-chip">
              <strong>해금 스킬</strong>
              <span>Shift 선행 발자국, R 미도착 상처</span>
            </article>
          </div>
        </section>

        <section class="slice-card">
          <h2 class="panel-title">진행 상태</h2>
          <div class="stat-grid">
            <article class="status-card">
              <span class="status-card__label">현재 구역</span>
              <strong class="status-card__value" data-zone-status>동쪽 방파제</strong>
            </article>
            <article class="status-card">
              <span class="status-card__label">프롤로그 단계</span>
              <strong class="status-card__value" data-phase-status>이동 튜토리얼</strong>
              <span class="status-card__meta" data-phase-meta>오른쪽으로 전진해 항구의 이상 현상을 조사하세요.</span>
            </article>
            <article class="status-card">
              <span class="status-card__label">조사 진척</span>
              <strong class="status-card__value" data-progress-status>잔향 0 / 3</strong>
            </article>
          </div>
        </section>

        <section class="slice-card audio-panel">
          <h2 class="panel-title">현장 BGM</h2>
          <p class="audio-panel__meta" data-audio-track>
            현재 트랙: 미사용
          </p>
          <button type="button" class="action-button action-button--secondary" data-audio-toggle>
            BGM 켜기
          </button>
          <audio class="visually-hidden" data-bgm-player preload="auto" loop></audio>
        </section>

        <section class="slice-card">
          <h2 class="panel-title">이 슬라이스에 담은 요소</h2>
          <ul class="slice-list">
            <li>프롤로그 도입 컷신과 첫 목표 노출</li>
            <li>조사 가능한 오브젝트와 새벽 청취 잔향 회수</li>
            <li>사야 렌과의 합류 대화 및 능력 해금</li>
            <li>실시간 전투, 적 브레이크, 체크포인트성 복구</li>
            <li>라오 템 구조선으로 이어지는 종료 연출</li>
          </ul>
        </section>
      </aside>
    </main>

    <section class="summary-grid" aria-label="요약 카드">
      <article class="summary-card">
        <h2>메인 진입 정리</h2>
        <p>
          대표 주소는 실제 게임 플레이를 보여 주고, 문서와 BGM 아카이브는 별도 페이지에서 유지합니다.
        </p>
      </article>
      <article class="summary-card">
        <h2>도트 톤 조정</h2>
        <p>
          외부 이미지 파일 대신 캔버스에서 직접 픽셀형 캐릭터, 장치, 항구 배경을 그려 톤과 모션을
          한 방향으로 맞췄습니다.
        </p>
      </article>
      <article class="summary-card">
        <h2>문서 기준 반영</h2>
        <p>
          목표 표시, HUD 계층, 프롤로그 조사 순서, 사야 합류, 첫 전투, 종료 전환을 게임 화면에 바로
          대응시켰습니다.
        </p>
      </article>
    </section>

    <section class="detail-grid" aria-label="구현 상세">
      <article class="detail-card">
        <h3>플레이 흐름</h3>
        <p>
          방파제 이동에서 시작해 어시장 조사 3개를 완료하고, 사야 렌과 합류한 뒤 시계탑 하층 전투와
          황혼 파수체를 넘어 구조선에 탑승하는 짧은 완성 구간입니다.
        </p>
      </article>
      <article class="detail-card">
        <h3>문서 · BGM 분리</h3>
        <p>
          기존 문서/BGM 뷰어는 docs.html에서 계속 제공되며, 게임 페이지에서 바로 이동할 수 있습니다.
        </p>
      </article>
    </section>
  </div>
`;class ie{constructor(e){if(this.root=e,this.canvas=e.querySelector("[data-game-canvas]"),this.context=this.canvas?.getContext("2d"),this.audioPlayer=e.querySelector("[data-bgm-player]"),this.state=E(),this.keys=new Map,this.justPressed=new Set,this.previousTimestamp=0,this.frameHandle=0,!this.canvas||!this.context||!this.audioPlayer)throw new Error("게임 화면 초기화에 필요한 요소를 찾을 수 없습니다.");this.context.imageSmoothingEnabled=!1,this.refs={startButton:e.querySelector("[data-start-button]"),overlay:e.querySelector("[data-overlay]"),overlayTitle:e.querySelector("[data-overlay-title]"),overlayBody:e.querySelector("[data-overlay-body]"),overlayPrimary:e.querySelector("[data-overlay-primary]"),dialogue:e.querySelector("[data-dialogue]"),dialogueSpeaker:e.querySelector("[data-dialogue-speaker]"),dialogueText:e.querySelector("[data-dialogue-text]"),dialogueNext:e.querySelector("[data-dialogue-next]"),hpFill:e.querySelector("[data-hp-fill]"),hpText:e.querySelector("[data-hp-text]"),resonanceFill:e.querySelector("[data-resonance-fill]"),resonanceText:e.querySelector("[data-resonance-text]"),burdenNodes:e.querySelectorAll("[data-burden-node]"),objectiveTitle:e.querySelector("[data-objective-title]"),objectiveList:e.querySelector("[data-objective-list]"),logList:e.querySelector("[data-log-list]"),promptCard:e.querySelector("[data-prompt-card]"),promptText:e.querySelector("[data-prompt-text]"),zoneBadge:e.querySelector("[data-zone-badge]"),echoBadge:e.querySelector("[data-echo-badge]"),encounterBadge:e.querySelector("[data-encounter-badge]"),zoneStatus:e.querySelector("[data-zone-status]"),phaseStatus:e.querySelector("[data-phase-status]"),phaseMeta:e.querySelector("[data-phase-meta]"),progressStatus:e.querySelector("[data-progress-status]"),audioToggle:e.querySelector("[data-audio-toggle]"),audioTrack:e.querySelector("[data-audio-track]"),skillAttack:e.querySelector('[data-skill-chip="attack"]'),skillDash:e.querySelector('[data-skill-chip="dash"]'),skillWard:e.querySelector('[data-skill-chip="ward"]')},this.bindEvents(),this.syncOverlay(),this.syncHud(),this.playTrack(this.state.currentTrackId),this.frameHandle=window.requestAnimationFrame(t=>this.loop(t))}bindEvents(){this.refs.startButton?.addEventListener("click",()=>this.beginRun()),this.refs.overlayPrimary?.addEventListener("click",()=>{if(this.state.completed){this.beginRun();return}this.beginRun()}),this.refs.dialogueNext?.addEventListener("click",()=>this.advanceDialogue()),this.refs.audioToggle?.addEventListener("click",()=>this.toggleAudio()),window.addEventListener("keydown",e=>this.handleKey(e,!0)),window.addEventListener("keyup",e=>this.handleKey(e,!1)),document.addEventListener("visibilitychange",()=>{document.hidden?this.audioPlayer.pause():this.state.audioEnabled&&this.state.started&&!this.state.completed&&this.audioPlayer.play().catch(()=>{this.state.audioEnabled=!1,this.syncHud()})})}handleKey(e,t){if(Z.has(e.code)&&!(this.state.overlay.visible&&!["Enter","Space"].includes(e.code)&&!this.state.started)){if(e.preventDefault(),t){this.keys.get(e.code)||this.justPressed.add(e.code),this.keys.set(e.code,!0),this.state.activeDialogue&&["KeyE","Enter","Space"].includes(e.code)&&this.advanceDialogue(),this.state.overlay.visible&&["Enter","Space"].includes(e.code)&&(this.state.completed||!this.state.started)&&this.beginRun();return}this.keys.set(e.code,!1)}}beginRun(){this.state=E(),this.state.started=!0,this.state.phase="opening",this.state.overlay.visible=!1,this.state.zone="동쪽 방파제",this.playTrack("mirajin-hub"),this.toggleAudio(!0),this.pushLog("항구 전체가 비틀린 채 멈춰 있다."),this.startDialogue([{speaker:"플레이어",text:"파도가... 멈췄어. 아니, 뒤로 가고 있나."},{speaker:"백야",text:"아침은 왔어. 다만 네가 닫아 버렸지."},{speaker:"플레이어",text:"누구지. 어디서 말하는 거야."},{speaker:"백야",text:"비명 소리가 난 항구 쪽으로 가. 물에 비친 너도 거기서 널 기다려."}],()=>{this.state.phase="approach",this.setObjective("비명 소리가 난 항구 쪽으로 이동",["오른쪽으로 전진하며 첫 조작을 익힌다","조사 가능한 물체를 찾아본다"]),this.setBanner("항구 쪽으로 이동하세요",2.6)}),this.syncOverlay(),this.syncHud()}toggleAudio(e=null){typeof e=="boolean"?this.state.audioEnabled=e:this.state.audioEnabled=!this.state.audioEnabled,this.state.audioEnabled?this.audioPlayer.play().catch(()=>{this.state.audioEnabled=!1,this.pushLog("브라우저가 자동 재생을 막아 BGM을 켜지 못했습니다."),this.syncHud()}):this.audioPlayer.pause(),this.syncHud()}playTrack(e){this.state.currentTrackId=R[e]?e:"mirajin-hub";const t=R[this.state.currentTrackId];t&&(this.audioPlayer.getAttribute("src")!==t.src&&(this.audioPlayer.src=t.src),this.state.audioEnabled&&this.audioPlayer.play().catch(()=>{this.state.audioEnabled=!1,this.syncHud()}),this.syncHud())}setObjective(e,t){this.state.objective={title:e,steps:t},this.syncHud()}setBanner(e,t=2.1){this.state.banner.text=e,this.state.banner.timer=t,this.syncHud()}pushLog(e){this.state.logs=[e,...this.state.logs].slice(0,4),this.syncHud()}syncOverlay(){this.refs.overlay.hidden=!this.state.overlay.visible,this.refs.overlayTitle.textContent=this.state.overlay.title,this.refs.overlayBody.textContent=this.state.overlay.body,this.refs.overlayPrimary.textContent=this.state.overlay.primaryLabel}startDialogue(e,t=null){this.state.activeDialogue={lines:e,index:0,onComplete:t},this.syncHud()}advanceDialogue(){if(!this.state.activeDialogue)return;const e=this.state.activeDialogue;if(e.index<e.lines.length-1){e.index+=1,this.syncHud();return}const t=e.onComplete;this.state.activeDialogue=null,this.syncHud(),t?.()}getGroundY(e){return e<244?144:e<660?140:e<760?136:e<930?138:144}getStandingPlatform(e,t,a){return C.find(s=>{const i=e+T/2>s.left&&e-T/2<s.right,r=t<=s.top&&a>=s.top;return i&&r})??null}isInteractableVisible(e){return e.id==="saya"?["meet-saya","arena-ready","arena-battle","after-arena","boss-battle","escape"].includes(this.state.phase):e.id==="bell-shell"?["after-arena","boss-battle","escape","complete"].includes(this.state.phase):e.id==="rope-line"?["escape","complete"].includes(this.state.phase):!0}getInteractableById(e){return S.find(t=>t.id===e)}getCurrentInteractable(){const e={x:this.state.player.x,y:this.state.player.y};return S.filter(a=>this.isInteractableVisible(a)).map(a=>({...a,distance:te(e,a)})).filter(a=>a.distance<=a.radius).sort((a,s)=>a.distance-s.distance)[0]??null}handleInteraction(){const e=this.getCurrentInteractable();if(e)switch(e.id){case"cart":this.pushLog("수레 바퀴가 멈춘 채 떨리고 있다. 항구 전체가 단순 정지가 아니라 비틀린 상태다."),this.setBanner("조사 로그가 현장 기록에 남았습니다",1.6);break;case"rope-bundle":this.pushLog("젖지 않은 밧줄이 세 번 같은 자리에서 묶여 있다. 시간을 되감는 손놀림이다.");break;case"medicine":this.pushLog("약상자 뚜껑 안쪽에 따뜻한 체온이 남아 있지만, 항구에는 아침 냄새가 없다.");break;case"lever":this.pushLog("등대 레버가 반 박자씩 뒤로 밀린다. 누군가 밤을 고정해 둔 것처럼 보인다.");break;case"fisherman":this.startDialogue([{speaker:"어부",text:"밧줄을 세 번 묶어야 폭풍이 안 와. 분명 아까도 그랬어."},{speaker:"플레이어",text:"폭풍은 아직 안 왔잖아요."},{speaker:"어부",text:"왔어. 아니, 올 거야. 왜 다들 젖지도 않았지."}]);break;case"saya":this.state.flags.metSaya?this.state.phase==="after-arena"&&this.startDialogue([{speaker:"사야 렌",text:"하층은 정리됐어. 이제 종 외피를 확인하면 방파제 쪽 탈출 경로가 보일 거야."},{speaker:"사야 렌",text:"파수체가 나오면 무리해서 버티지 말고, `미도착 상처`로 충격을 한 번 늦춰."}]):this.startDialogue([{speaker:"사야 렌",text:"올 줄 알았어. 잔향을 들은 사람이라면 탑으로 올 수밖에 없으니까."},{speaker:"플레이어",text:"당신이 신호를 보냈지. 대체 무슨 일이야."},{speaker:"사야 렌",text:"누군가 새벽종을 부쉈어. 여기선 이제 아침이 잘려 나간 상태야."},{speaker:"사야 렌",text:"먼저 하층을 정리하자. 내가 기록 경로를 열어 둘게. 너는 `선행 발자국`으로 빈틈을 메워."}],()=>{this.state.flags.metSaya=!0,this.state.player.dashUnlocked=!0,this.state.phase="arena-ready",this.state.barriers.gateClosed=!1,this.state.checkpointX=728,this.state.checkpointPhase="arena-ready",this.setObjective("시계탑 하층을 돌파",["사야 렌과 합류했다","Shift로 선행 발자국을 사용해 전투에 대비한다"]),this.pushLog("선행 발자국이 해금되었습니다. 짧은 무적 회피가 가능합니다."),this.setBanner("선행 발자국 해금",2.2),this.syncHud()});break;case"bell-shell":this.state.phase==="after-arena"&&!this.state.flags.bellInspected&&(this.state.flags.bellInspected=!0,this.startDialogue([{speaker:"플레이어",text:"이게 새벽종의 외피... 안쪽이 통째로 뜯겨 나가 있어."},{speaker:"사야 렌",text:"핵심 공명축은 일곱 개야. 조각이 흩어지면 도시와 항로가 모두 어긋나기 시작해."},{speaker:"백야",text:"확신은 늘 늦게 도착해. 하지만 파수체는 이미 너를 찾았어."}],()=>{this.state.phase="boss-battle",this.state.player.wardUnlocked=!0,this.state.checkpointX=936,this.state.checkpointPhase="boss-battle",this.spawnBoss(),this.setObjective("황혼 파수체를 제압",["J 기본 공격으로 균열 게이지를 채운다","R 미도착 상처로 큰 피해를 버틴다"]),this.pushLog("미도착 상처가 해금되었습니다. 큰 충격을 한 번 지연시킵니다."),this.setBanner("황혼 파수체가 방파제를 봉쇄했다",2.2),this.playTrack("crisis-pursuit")}));break;case"rope-line":this.state.phase==="escape"&&this.startDialogue([{speaker:"라오 템",text:"둘 다 살아 있으면 뛰어. 설명은 배 위에서 해."},{speaker:"사야 렌",text:"첫 종편 좌표가 잡혔어. 유리염 사구야."},{speaker:"플레이어",text:"그래도 가야 해. 미라진을 이렇게 만든 조각이라면 반드시 찾아야 하니까."}],()=>{this.finishRun()});break}}handleListen(){const e=this.getCurrentInteractable();if(!e||e.type!=="echo")return;if(this.state.echoesFound.has(e.id)){this.pushLog("이미 회수한 잔향입니다.");return}const t={"rope-bundle":"아직 오지 않은 폭풍 냄새가 밧줄에 남아 있다. 어부는 오지 않은 아침을 반복해서 기억하고 있다.",medicine:"약상자 안쪽에 손때가 남아 있다. 약사는 오늘 아침에 약을 건넸다고 믿지만, 항구엔 아침 냄새가 없다.",lever:"등대 레버가 미세하게 역회전한다. 누군가 밤이 끝나지 않도록 시간을 붙잡아 놓은 듯하다."};this.state.echoesFound.add(e.id),this.pushLog(t[e.id]),this.setBanner(`${e.label}의 잔향을 회수했습니다`,1.8),this.state.echoesFound.size===3&&this.state.phase==="survey"?(this.state.phase="meet-saya",this.state.barriers.gateClosed=!1,this.setObjective("광장에서 사야 렌과 만나기",["파문 기록기 3개를 모두 복구했다","시계탑 외곽 광장으로 이동한다"]),this.pushLog("사야 렌의 파문 기록이 시계탑 쪽에서 재생되기 시작한다."),this.setBanner("시계탑 광장이 개방되었습니다",2.2)):this.syncHud()}finishRun(){this.state.completed=!0,this.state.started=!1,this.state.phase="complete",this.state.encounter="프롤로그 종료",this.state.overlay.visible=!0,this.state.overlay.title="프롤로그 종료",this.state.overlay.body="미라진의 새벽은 아직 돌아오지 않았지만, 첫 항해의 방향은 정해졌습니다. 다음 목적지는 유리염 사구입니다.",this.state.overlay.primaryLabel="처음부터 다시 플레이",this.playTrack("main-theme"),this.pushLog("구조선이 방파제를 떠나며 프롤로그가 끝납니다."),this.syncOverlay(),this.syncHud()}spawnArenaWave(){this.state.enemies=[w("wraith",820),w("wraith",892)],this.state.barriers.left=760,this.state.barriers.right=930,this.state.encounter="하층 교전",this.playTrack("battle-skirmish")}spawnBoss(){this.state.enemies=[w("sentinel",1022)],this.state.barriers.left=910,this.state.barriers.right=1098,this.state.encounter="황혼 파수체"}resetEncounterFromCheckpoint(){this.state.player.hp=b,this.state.player.resonance=f,this.state.player.burden=Math.max(0,this.state.player.burden-1),this.state.player.x=this.state.checkpointX,this.state.player.y=d,this.state.player.vx=0,this.state.player.vy=0,this.state.player.onGround=!0,this.state.player.attackTimer=0,this.state.player.hitTimer=0,this.state.player.invulnerableTimer=1.1,this.state.player.dashTimer=0,this.state.effects=[],this.state.shake=.4,(this.state.checkpointPhase==="arena-ready"||this.state.checkpointPhase==="arena-battle")&&(this.state.phase="arena-battle",this.spawnArenaWave(),this.setObjective("시계탑 하층을 돌파",["적을 모두 제압해 길을 확보한다","공명과 회피를 함께 관리한다"])),this.state.checkpointPhase==="boss-battle"&&(this.state.phase="boss-battle",this.spawnBoss(),this.setObjective("황혼 파수체를 제압",["균열 게이지를 채워 붕괴 상태를 만든다","위험할 때는 R로 충격을 지연시킨다"]),this.playTrack("crisis-pursuit")),this.pushLog("임시 닻 포인트에서 복구되었습니다."),this.setBanner("현장 복구 완료",2)}consumeOneShotInput(){this.justPressed.clear()}isPressed(e){return!!this.keys.get(e)}wasPressed(e){return this.justPressed.has(e)}update(e){if(this.state.elapsed+=e,this.state.banner.timer>0&&(this.state.banner.timer=Math.max(0,this.state.banner.timer-e)),!this.state.started||this.state.completed){this.updateCamera(e),this.consumeOneShotInput(),this.syncHud();return}if(this.state.activeDialogue){this.updateCamera(e),this.consumeOneShotInput(),this.syncHud();return}this.wasPressed("KeyE")&&this.handleInteraction(),this.wasPressed("KeyQ")&&this.handleListen(),this.updatePhaseProgress(),this.updatePlayer(e),this.updateEnemies(e),this.updateEffects(e),this.updateCamera(e),this.syncHud(),this.consumeOneShotInput()}updatePhaseProgress(){this.state.phase==="approach"&&this.state.player.x>232&&!this.state.flags.sawMarketObjective&&(this.state.phase="survey",this.state.flags.sawMarketObjective=!0,this.setObjective("멈춘 어시장의 잔향을 조사",[`밧줄 묶음 잔향 회수 (${this.state.echoesFound.has("rope-bundle")?"완료":"미완료"})`,`약상자 잔향 회수 (${this.state.echoesFound.has("medicine")?"완료":"미완료"})`,`등대 레버 잔향 회수 (${this.state.echoesFound.has("lever")?"완료":"미완료"})`]),this.pushLog("세 군데 조사 지점에서 파문 잔향을 회수해 시계탑 경로를 복원해야 한다."),this.setBanner("새벽 청취로 잔향을 회수하세요",2.4)),this.state.phase==="arena-ready"&&this.state.player.x>770&&(this.state.phase="arena-battle",this.spawnArenaWave(),this.setObjective("시계탑 하층을 돌파",["출현한 균열 생물 2체를 모두 제압한다","공격으로 적의 균열 게이지를 누적한다"]),this.pushLog("시계탑 하층에서 균열 생물이 튀어나왔다."),this.setBanner("전투 진입",1.6)),this.state.phase==="arena-battle"&&this.state.enemies.length===0&&!this.state.flags.arenaCleared&&(this.state.flags.arenaCleared=!0,this.state.phase="after-arena",this.state.player.wardUnlocked=!0,this.state.barriers.left=null,this.state.barriers.right=null,this.state.encounter="탐험",this.setObjective("새벽종 외피를 조사",["전투가 종료되었다","새벽종 외피와 방파제 탈출 경로를 확인한다"]),this.playTrack("mirajin-hub"),this.pushLog("하층의 균열이 잠시 가라앉았다. 외피를 조사할 시간이다."),this.setBanner("미도착 상처 해금",2.2)),this.state.phase==="boss-battle"&&this.state.enemies.length===0&&!this.state.flags.bossCleared&&(this.state.flags.bossCleared=!0,this.state.phase="escape",this.state.barriers.left=null,this.state.barriers.right=null,this.state.encounter="탈출",this.setObjective("라오 템의 구조선에 탑승",["황혼 파수체를 제압했다","방파제 끝의 구조선으로 이동한다"]),this.playTrack("main-theme"),this.pushLog("파수체가 무너지고 방파제 끝에서 구조선이 닻을 맞춘다."),this.setBanner("탈출 경로 확보",2.2))}updatePlayer(e){const t=this.state.player,a=(this.isPressed("ArrowRight")||this.isPressed("KeyD")?1:0)-(this.isPressed("ArrowLeft")||this.isPressed("KeyA")?1:0);t.moveIntent=a,t.hitTimer=Math.max(0,t.hitTimer-e),t.invulnerableTimer=Math.max(0,t.invulnerableTimer-e),t.dashCooldown=Math.max(0,t.dashCooldown-e),t.wardCooldown=Math.max(0,t.wardCooldown-e),t.comboTimer=Math.max(0,t.comboTimer-e),t.wardTimer>0&&(t.wardTimer=Math.max(0,t.wardTimer-e)),["arena-battle","boss-battle"].includes(this.state.phase)||(t.resonance=o(t.resonance+e*9,0,f)),(this.wasPressed("Space")||this.wasPressed("ArrowUp")||this.wasPressed("KeyW"))&&(t.requestedJump=!0),t.requestedJump&&t.onGround&&(t.vy=-272,t.onGround=!1,t.requestedJump=!1,this.state.effects.push({type:"dust",x:t.x,y:t.y,timer:.3})),(this.wasPressed("ShiftLeft")||this.wasPressed("ShiftRight"))&&t.dashUnlocked&&t.dashCooldown<=0&&t.resonance>=14&&(t.dashTimer=V,t.dashCooldown=1.35,t.dashDirection=a||t.facing||1,t.resonance=o(t.resonance-14,0,f),this.state.effects.push({type:"trail",x:t.x,y:t.y-12,timer:.28,facing:t.dashDirection}),this.pushLog("선행 발자국으로 짧은 빈틈을 파고들었다.")),this.wasPressed("KeyR")&&t.wardUnlocked&&t.wardCooldown<=0&&t.resonance>=22&&(t.wardTimer=1.6,t.wardCooldown=5.4,t.resonance=o(t.resonance-22,0,f),this.setBanner("미도착 상처 활성화",1.4)),this.wasPressed("KeyJ")&&t.attackTimer<=0&&(t.attackStep=t.comboTimer>0?t.attackStep%3+1:1,t.attackTimer=Q,t.comboTimer=.42,t.attackHitIds.clear(),this.state.effects.push({type:"slash",x:t.x+t.facing*14,y:t.y-16,timer:.18,facing:t.facing,step:t.attackStep})),t.attackTimer>0&&(t.attackTimer=Math.max(0,t.attackTimer-e)),t.dashTimer>0?(t.dashTimer=Math.max(0,t.dashTimer-e),t.vx=t.dashDirection*J,t.facing=t.dashDirection,t.invulnerableTimer=Math.max(t.invulnerableTimer,.12)):(t.vx=a*X,a!==0&&(t.facing=a));const s=t.y;t.vy=o(t.vy+z*e,-272,W);let i=t.x+t.vx*e,r=t.y+t.vy*e;const l=this.getStandingPlatform(i,s,r);let u=this.getGroundY(i);l&&(u=Math.min(u,l.top)),r>=u?(r=u,t.vy=0,t.onGround=!0):t.onGround=!1,t.requestedJump=!1;const g=this.state.barriers.left,y=this.state.barriers.right,m=this.state.barriers.gateClosed?664:L-20;i=o(i,18,m),g!==null&&(i=Math.max(i,g+10)),y!==null&&(i=Math.min(i,y-10)),t.x=i,t.y=r,t.attackTimer>.1&&t.attackTimer<.24&&this.resolvePlayerAttack(),t.hp<=0&&this.resetEncounterFromCheckpoint()}resolvePlayerAttack(){const e=this.state.player,t=26+e.attackStep*4,a={left:e.x+(e.facing>0?4:-t),right:e.x+(e.facing>0?t:-4),top:e.y-24,bottom:e.y-2};this.state.enemies=this.state.enemies.filter(s=>{const i={left:s.x-s.width/2,right:s.x+s.width/2,top:s.y-s.height,bottom:s.y};return!ae(a,i)||e.attackHitIds.has(s.id)?!0:(e.attackHitIds.add(s.id),s.hurtTimer=.18,s.breakMeter+=14+e.attackStep*5,s.hp-=14+e.attackStep*6,s.x+=e.facing*8,e.resonance=o(e.resonance+6,0,f),this.state.shake=Math.max(this.state.shake,.22),this.state.effects.push({type:"spark",x:s.x,y:s.y-s.height/2,timer:.22}),s.breakMeter>=s.breakLimit&&(s.breakMeter=0,s.stunTimer=s.type==="sentinel"?1.5:1.1,this.pushLog(`${s.type==="sentinel"?"황혼 파수체":"균열 생물"}가 붕괴 상태에 빠졌다.`)),s.hp<=0?(this.pushLog(`${s.type==="sentinel"?"황혼 파수체":"균열 생물"}를 제압했다.`),!1):!0)})}applyDamage(e,t){const a=this.state.player;if(a.invulnerableTimer>0)return;let s=e;a.wardTimer>0&&(s=Math.ceil(e*.35),a.wardTimer=0,a.burden=o(a.burden+1,0,3),this.pushLog("미도착 상처가 충격을 지연시켰다.")),a.hp=o(a.hp-s,0,b),a.hitTimer=.28,a.invulnerableTimer=.84,a.vx=t<a.x?72:-72,this.state.shake=Math.max(this.state.shake,.4)}updateEnemies(e){const t=this.state.player;this.state.enemies.forEach(a=>{if(a.attackCooldown=Math.max(0,a.attackCooldown-e),a.stunTimer=Math.max(0,a.stunTimer-e),a.hurtTimer=Math.max(0,a.hurtTimer-e),a.stunTimer>0)return;const s=t.x-a.x,i=Math.abs(s);if(a.facing=s>=0?1:-1,a.type==="sentinel"){if(a.state==="attack"){a.attackTimer+=e,a.attackTimer>=.36&&!a.windupDone&&(a.windupDone=!0,a.x+=a.facing*26,this.state.effects.push({type:"slash",x:a.x+a.facing*18,y:a.y-14,timer:.22,facing:a.facing,step:3,hostile:!0}),i<38&&this.applyDamage(24,a.x)),a.attackTimer>=.76&&(a.state="idle",a.attackTimer=0,a.windupDone=!1,a.attackCooldown=1.5);return}if(i<a.attackRange&&a.attackCooldown<=0){a.state="attack",a.attackTimer=0,a.windupDone=!1,this.setBanner("황혼 파수체가 크게 휘두를 준비를 한다",.9);return}a.x+=o(s,-1,1)*a.moveSpeed*e;return}if(a.state==="attack"){a.attackTimer+=e,a.attackTimer>.18&&a.attackTimer<.28&&i<22&&this.applyDamage(12,a.x),a.attackTimer>=.44&&(a.state="idle",a.attackTimer=0,a.attackCooldown=1.1);return}if(i<a.attackRange&&a.attackCooldown<=0){a.state="attack",a.attackTimer=0;return}a.x+=o(s,-1,1)*a.moveSpeed*e})}updateEffects(e){this.state.shake=Math.max(0,this.state.shake-e*.7),this.state.effects=this.state.effects.map(t=>({...t,timer:t.timer-e})).filter(t=>t.timer>0)}updateCamera(e){const t=o(this.state.player.x-h*.42,0,L-h);this.state.cameraX=ee(this.state.cameraX,t,o(e*5.4,0,1)),this.state.zone=x.find(a=>this.state.player.x<=a.max)?.label??"미라진 항구"}syncHud(){const e=this.state.player,t=this.state.activeDialogue,a=this.getCurrentInteractable(),s=this.state.phase==="survey"?[`밧줄 묶음 잔향 회수 (${this.state.echoesFound.has("rope-bundle")?"완료":"미완료"})`,`약상자 잔향 회수 (${this.state.echoesFound.has("medicine")?"완료":"미완료"})`,`등대 레버 잔향 회수 (${this.state.echoesFound.has("lever")?"완료":"미완료"})`]:this.state.objective.steps;this.refs.hpFill.style.width=`${e.hp/b*100}%`,this.refs.hpText.textContent=`${Math.round(e.hp)} / ${b}`,this.refs.resonanceFill.style.width=`${e.resonance/f*100}%`,this.refs.resonanceText.textContent=`${Math.round(e.resonance)} / ${f}`,this.refs.burdenNodes.forEach((r,l)=>{r.classList.toggle("is-active",l<e.burden)}),this.refs.objectiveTitle.textContent=this.state.banner.timer>0?this.state.banner.text:this.state.objective.title,this.refs.objectiveList.innerHTML=s.map(r=>`<li>${r}</li>`).join(""),this.refs.logList.innerHTML=this.state.logs.map(r=>`<li>${r}</li>`).join("");let i="";a&&(a.type==="echo"&&!this.state.echoesFound.has(a.id)?i=`E 조사 · Q 새벽 청취 · ${a.label}`:a.id==="bell-shell"&&this.state.phase==="after-arena"?i=`E 활성화 · ${a.label}`:a.id==="rope-line"&&this.state.phase==="escape"?i=`E 탑승 · ${a.label}`:i=`E 상호작용 · ${a.label}`),this.refs.promptText.textContent=i,this.refs.promptCard.classList.toggle("is-visible",!!i&&!t),this.refs.zoneBadge.textContent=this.state.zone,this.refs.echoBadge.textContent=`잔향 ${this.state.echoesFound.size}/3`,this.refs.encounterBadge.textContent=this.state.encounter,this.refs.zoneStatus.textContent=this.state.zone,this.refs.progressStatus.textContent=`잔향 ${this.state.echoesFound.size} / 3`,this.refs.phaseStatus.textContent=this.getPhaseTitle(),this.refs.phaseMeta.textContent=this.getPhaseMeta(),this.refs.audioTrack.textContent=`현재 트랙: ${se(this.state.currentTrackId)}${this.state.audioEnabled?"":" (대기 중)"}`,this.refs.audioToggle.textContent=this.state.audioEnabled?"BGM 끄기":"BGM 켜기",this.refs.skillDash.classList.toggle("is-locked",!e.dashUnlocked),this.refs.skillDash.classList.toggle("is-ready",e.dashUnlocked&&e.dashCooldown<=0),this.refs.skillWard.classList.toggle("is-locked",!e.wardUnlocked),this.refs.skillWard.classList.toggle("is-ready",e.wardUnlocked&&e.wardCooldown<=0),t?(this.refs.dialogue.hidden=!1,this.refs.dialogueSpeaker.textContent=t.lines[t.index].speaker,this.refs.dialogueText.textContent=t.lines[t.index].text):this.refs.dialogue.hidden=!0,this.syncOverlay()}getPhaseTitle(){return{title:"프롤로그 준비",opening:"도입 대화",approach:"이동 튜토리얼",survey:"어시장 조사","meet-saya":"사야 렌 합류","arena-ready":"시계탑 진입","arena-battle":"하층 전투","after-arena":"새벽종 조사","boss-battle":"황혼 파수체",escape:"구조선 탑승",complete:"프롤로그 종료"}[this.state.phase]??"프롤로그"}getPhaseMeta(){return{title:"게임 시작 버튼을 눌러 프롤로그를 열 수 있습니다.",opening:"도입 대사를 통해 사라진 새벽과 첫 목표를 제시합니다.",approach:"오른쪽으로 이동하며 항구 초입을 확인합니다.",survey:"세 개의 조사 지점에서 새벽 청취를 사용하세요.","meet-saya":"시계탑 외곽 광장에서 사야 렌과 합류합니다.","arena-ready":"하층 입구로 전진해 전투를 시작하세요.","arena-battle":"균열 생물을 제압하고 길을 확보하세요.","after-arena":"새벽종 외피를 조사해 다음 장면으로 넘어갑니다.","boss-battle":"황혼 파수체를 브레이크시키며 방파제를 지켜내세요.",escape:"구조선에 탑승하면 프롤로그가 종료됩니다.",complete:"다음 목적지는 유리염 사구입니다."}[this.state.phase]??"프롤로그를 진행 중입니다."}loop(e){const t=o((e-this.previousTimestamp)/1e3||0,0,.05);this.previousTimestamp=e,this.update(t),this.render(),this.frameHandle=window.requestAnimationFrame(a=>this.loop(a))}render(){const e=this.context,t=this.state.shake>0?Math.round((Math.random()-.5)*this.state.shake*8):0,a=this.state.shake>0?Math.round((Math.random()-.5)*this.state.shake*5):0,s=this.state.cameraX+t;e.clearRect(0,0,h,p),e.save(),e.translate(0,a),this.drawBackdrop(e,s),this.drawWorld(e,s),this.drawCharacters(e,s),this.drawEffects(e,s),this.drawOverlayEffects(e),e.restore()}drawBackdrop(e,t){const a=e.createLinearGradient(0,0,0,p);a.addColorStop(0,"#2b3558"),a.addColorStop(.38,"#49385f"),a.addColorStop(.72,"#16324a"),a.addColorStop(1,"#08121f"),e.fillStyle=a,e.fillRect(0,0,h,p),e.fillStyle="rgba(244, 198, 118, 0.22)",e.beginPath(),e.arc(160,40,26,0,Math.PI*2),e.fill(),e.fillStyle="rgba(255, 255, 255, 0.08)";for(let i=0;i<28;i+=1){const r=Math.round((i*41+this.state.elapsed*8)%(h+80)-40),l=18+i*13%34;e.fillRect(r,l,1,1)}const s=-t*.18;e.fillStyle="#14253a";for(let i=0;i<8;i+=1){const r=Math.round(i*56+s%56)-20,l=18+i%3*6;e.fillRect(r,104-l,40,l)}e.fillStyle="#0b1a2a";for(let i=0;i<11;i+=1){const r=Math.round(i*36+s*1.4%36)-16,l=14+i%4*4;e.fillRect(r,120-l,24,l)}e.fillStyle="#1f5977",e.fillRect(0,126,h,54),e.fillStyle="rgba(255, 255, 255, 0.1)";for(let i=0;i<16;i+=1){const r=130+(i+Math.floor(this.state.elapsed*4))%5;e.fillRect(i*20,r,10,1)}}drawWorld(e,t){this.drawGround(e,t),this.drawStructures(e,t),this.drawPlatforms(e,t),this.drawInteractables(e,t),this.drawBarriers(e,t)}drawGround(e,t){for(let a=-16;a<=h+16;a+=16){const s=t+a+8,i=this.getGroundY(s),r=Math.round(a),l=Math.round(i);e.fillStyle=s<660?"#4a3b37":"#4e4648",e.fillRect(r,l,16,p-l),e.fillStyle=s<660?"#856757":"#72686a",e.fillRect(r,l,16,4),e.fillStyle="rgba(0, 0, 0, 0.16)",e.fillRect(r,l+8,16,1),e.fillStyle="rgba(255, 255, 255, 0.06)",e.fillRect(r,l+4,16,1)}}drawStructures(e,t){[{x:88,y:92,w:56,h:48,tone:"#233145"},{x:290,y:86,w:88,h:56,tone:"#26354a"},{x:430,y:74,w:68,h:66,tone:"#2a3950"},{x:688,y:58,w:84,h:84,tone:"#314661"},{x:938,y:70,w:92,h:72,tone:"#2f3f55"}].forEach(i=>{const r=Math.round(i.x-t);if(!(r<-i.w||r>h+i.w)){e.fillStyle=i.tone,e.fillRect(r,i.y,i.w,i.h),e.fillStyle="rgba(255, 255, 255, 0.08)",e.fillRect(r+6,i.y+8,i.w-12,4),e.fillStyle="rgba(255, 255, 255, 0.05)";for(let l=0;l<i.h;l+=12)e.fillRect(r+10,i.y+l+14,i.w-20,1)}});const s=Math.round(716-t);e.fillStyle="#384c64",e.fillRect(s,34,42,102),e.fillStyle="#516781",e.fillRect(s+12,20,18,14),e.fillStyle="#6f8190",e.fillRect(s+18,42,6,48),e.fillRect(s+10,62,22,2)}drawPlatforms(e,t){C.forEach(a=>{const s=Math.round(a.left-t),i=Math.round(a.right-a.left),r=a.style==="wood"?"#6a5142":"#5f6770",l=a.style==="wood"?"#a47d67":"#8f99a2";e.fillStyle=r,e.fillRect(s,a.top,i,10),e.fillStyle=l,e.fillRect(s,a.top,i,3);for(let c=s+4;c<s+i;c+=14)e.fillStyle="rgba(0, 0, 0, 0.18)",e.fillRect(c,a.top+3,2,10)})}drawInteractables(e,t){S.forEach(a=>{if(!this.isInteractableVisible(a))return;const s=Math.round(a.x-t),i=Math.round(a.y),r=a.id===this.getCurrentInteractable()?.id;a.id==="cart"&&(e.fillStyle="#65483d",e.fillRect(s-10,i-14,20,8),e.fillStyle="#4a3129",e.fillRect(s-12,i-8,8,8),e.fillRect(s+4,i-8,8,8)),a.id==="fisherman"&&this.drawHumanoid(e,s,i,{palette:{coat:"#526983",coatDark:"#344457",scarf:"#c88a6a",skin:"#e4c7a4",hair:"#6f5846",metal:"#8b99a2"},facing:1,role:"dockhand",bobOffset:1.6}),["rope-bundle","medicine","lever","bell-shell","rope-line"].includes(a.id)&&this.drawDevice(e,s,i,a,r),a.id==="saya"&&this.drawHumanoid(e,s,i,{palette:{coat:"#d1d7dd",coatDark:"#a5aab4",scarf:"#7fb8cf",skin:"#ead7c0",hair:"#97a2b0",metal:"#dbe4ef"},facing:-1,role:"saya",bobOffset:2.4}),a.type!=="npc"&&r&&(e.fillStyle="rgba(242, 197, 111, 0.8)",e.fillRect(s-8,i-32,16,2))})}drawDevice(e,t,a,s,i){s.id==="rope-bundle"&&(e.fillStyle="#7d6554",e.fillRect(t-8,a-10,16,10),e.fillStyle="#d2b394",e.fillRect(t-6,a-7,12,2),e.fillRect(t-6,a-3,12,2)),s.id==="medicine"&&(e.fillStyle="#6d7d89",e.fillRect(t-10,a-16,20,14),e.fillStyle="#d8e0e8",e.fillRect(t-2,a-13,4,8),e.fillRect(t-5,a-10,10,2)),s.id==="lever"&&(e.fillStyle="#6d5f58",e.fillRect(t-6,a-16,12,16),e.fillStyle="#df7e67",e.fillRect(t+2,a-24,4,12),e.fillStyle="#9fb7cb",e.fillRect(t-4,a-20,8,3)),s.id==="bell-shell"&&(e.fillStyle="#7d7083",e.fillRect(t-16,a-26,32,24),e.fillStyle="#b9a9c2",e.fillRect(t-10,a-30,20,6),e.fillStyle="rgba(242, 197, 111, 0.24)",e.fillRect(t-6,a-20,12,10)),s.id==="rope-line"&&(e.fillStyle="#5c8fa1",e.fillRect(t-2,a-40,4,40),e.fillStyle="#d7d2be",e.fillRect(t-1,a-40,18,2),e.fillRect(t+14,a-40,2,18)),i&&(e.fillStyle="rgba(95, 191, 194, 0.3)",e.fillRect(t-14,a-34,28,2))}drawBarriers(e,t){if(this.state.barriers.gateClosed){const a=Math.round(674-t);e.fillStyle="rgba(130, 180, 214, 0.28)",e.fillRect(a,72,6,72),e.fillStyle="rgba(95, 191, 194, 0.7)",e.fillRect(a+2,72,2,72)}["left","right"].forEach(a=>{const s=this.state.barriers[a];if(s===null)return;const i=Math.round(s-t);e.fillStyle="rgba(95, 191, 194, 0.22)",e.fillRect(i-2,48,4,96),e.fillStyle="rgba(242, 197, 111, 0.46)",e.fillRect(i-1,48,2,96)})}drawCharacters(e,t){const a=Math.round(this.state.player.x-t);this.drawPlayer(e,a,this.state.player.y,this.state.player),this.state.enemies.forEach(s=>{const i=Math.round(s.x-t);s.type==="sentinel"?this.drawSentinel(e,i,s.y,s):this.drawWraith(e,i,s.y,s)})}drawPlayer(e,t,a,s){const i={coat:"#2d5374",coatDark:"#19364d",scarf:"#d3b067",skin:"#e7cbac",hair:"#bcc8d3",metal:"#8db0c9",glow:"#f0d48f"};this.drawHumanoid(e,t,a,{palette:i,facing:s.facing,role:"player",moving:Math.abs(s.vx)>8&&s.onGround,attacking:s.attackTimer>0,dashing:s.dashTimer>0,hurt:s.hitTimer>0,airborne:!s.onGround,warding:s.wardTimer>0,bobOffset:0,runtime:this.state.elapsed})}drawHumanoid(e,t,a,s){const{palette:i,facing:r=1,role:l="player",moving:c=!1,attacking:u=!1,dashing:g=!1,hurt:y=!1,airborne:m=!1,warding:P=!1,runtime:D=this.state.elapsed,bobOffset:B=0}=s,v=D*(c?8.8:3.2)+B,H=m?-2:Math.round(Math.sin(v)*(c?1.5:1)),I=c?Math.round(Math.sin(v)*2):0,M=c?Math.round(Math.sin(v+Math.PI)*2):0,k=u?4:0,O=g?2:u?1:y?-1:0;e.save(),e.translate(t,a-38+H),r<0&&(e.translate(24,0),e.scale(-1,1)),e.fillStyle="rgba(0, 0, 0, 0.22)",e.fillRect(5,36,14,2),P&&(e.fillStyle="rgba(95, 191, 194, 0.24)",e.fillRect(2,6,20,26)),e.fillStyle=i.coatDark,e.fillRect(8,14,8,16),e.fillRect(6,26,12,8),e.fillStyle=i.coat,e.fillRect(7,14,10,14),e.fillRect(5,24,14,10),e.fillStyle=i.coatDark,e.fillRect(8+O,30,4,6),e.fillRect(12+I,30,4,6),e.fillStyle=l==="saya"?i.metal:i.scarf,e.fillRect(10,12,4,3),e.fillStyle=i.skin,e.fillRect(8,5,8,7),e.fillStyle=i.hair,e.fillRect(7,3,10,4),e.fillStyle="#0e1821",e.fillRect(10,8,1,1),e.fillRect(13,8,1,1),e.fillStyle=i.coatDark,e.fillRect(4,16+M,3,10),e.fillRect(17+k,15-M,3,11),l==="player"&&(e.fillStyle=i.metal,e.fillRect(18+k,19,6,2),u&&(e.fillStyle="rgba(240, 212, 143, 0.72)",e.fillRect(20+k,17,8,4))),l==="saya"&&(e.fillStyle=i.metal,e.fillRect(16,17,6,7)),l==="dockhand"&&(e.fillStyle=i.scarf,e.fillRect(3,18,3,6)),e.restore()}drawWraith(e,t,a,s){const i=Math.round(Math.sin(this.state.elapsed*5+t*.03)*2);e.save(),e.translate(t,a-20+i),e.fillStyle="rgba(0, 0, 0, 0.24)",e.fillRect(-8,18,16,2),e.fillStyle=s.hurtTimer>0?"#f9b0a3":"#4f6c86",e.fillRect(-8,0,16,12),e.fillStyle="#d87070",e.fillRect(-2,4,4,4),e.fillStyle="#96c6dd",e.fillRect(-6,12,4,3),e.fillRect(2,12,4,3),e.restore(),this.drawEnemyBar(e,t,a-26,s)}drawSentinel(e,t,a,s){const i=Math.round(Math.sin(this.state.elapsed*3.6)*1.4);e.save(),e.translate(t,a-32),e.fillStyle="rgba(0, 0, 0, 0.24)",e.fillRect(-12,30,24,2),e.fillStyle=s.hurtTimer>0?"#fac1ae":"#6d7488",e.fillRect(-12,8,24,20),e.fillStyle="#9ba6ba",e.fillRect(-8,0,16,10),e.fillStyle="#f2c56f",e.fillRect(-3,10+i,6,6),e.fillStyle="#44566e",e.fillRect(-15,14,3,12),e.fillRect(12,14,3,12),e.fillRect(-8,28,4,6),e.fillRect(4,28,4,6),e.restore(),this.drawEnemyBar(e,t,a-34,s)}drawEnemyBar(e,t,a,s){const i=s.type==="sentinel"?30:18;e.fillStyle="rgba(0, 0, 0, 0.34)",e.fillRect(t-i/2,a,i,3),e.fillStyle="#df7e67",e.fillRect(t-i/2,a,i*(s.hp/s.maxHp),2),e.fillStyle="#5fbfc2",e.fillRect(t-i/2,a+2,i*(s.breakMeter/s.breakLimit),1)}drawEffects(e,t){this.state.effects.forEach(a=>{const s=Math.round(a.x-t),i=o(a.timer/.3,0,1);a.type==="slash"&&(e.fillStyle=a.hostile?`rgba(223, 126, 103, ${i*.7})`:`rgba(242, 197, 111, ${i*.7})`,e.fillRect(s-(a.facing<0?10:0),Math.round(a.y),10*a.facing,3)),a.type==="spark"&&(e.fillStyle=`rgba(255, 245, 210, ${i})`,e.fillRect(s-3,Math.round(a.y),6,2),e.fillRect(s-1,Math.round(a.y)-3,2,8)),a.type==="trail"&&(e.fillStyle=`rgba(95, 191, 194, ${i*.55})`,e.fillRect(s-10,Math.round(a.y),20,8)),a.type==="dust"&&(e.fillStyle=`rgba(232, 212, 174, ${i*.7})`,e.fillRect(s-8,Math.round(a.y),16,2))})}drawOverlayEffects(e){this.state.player.wardTimer>0&&(e.fillStyle="rgba(95, 191, 194, 0.06)",e.fillRect(0,0,h,p)),this.state.player.hitTimer>0&&(e.fillStyle="rgba(240, 118, 109, 0.08)",e.fillRect(0,0,h,p)),this.state.player.burden>=3&&(e.fillStyle="rgba(242, 197, 111, 0.04)",e.fillRect(0,0,h,p))}}new ie(_);
