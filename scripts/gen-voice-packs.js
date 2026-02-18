/**
 * Generate voice pack sounds using Kie.ai sound effects API via mcpl.
 * Generates: Halo, Terminator, Movie Quotes packs.
 * Uses double-quote escaping for Windows compatibility.
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const HAIL_ROOT = path.resolve(__dirname, '..');

function generateSound(packName, filename, prompt) {
  const outPath = path.join(HAIL_ROOT, 'packs', packName, 'sounds', filename).replace(/\\/g, '/');
  // Write params to temp file to avoid shell escaping hell
  const tmpFile = path.join(HAIL_ROOT, '_tmp_params.json');
  const params = {
    service: 'kie',
    action: 'generate_sound_effect',
    params: { prompt, outputPath: outPath }
  };
  fs.writeFileSync(tmpFile, JSON.stringify(params));

  const cmd = `mcpl call --no-daemon router route_request "$(cat ${tmpFile.replace(/\\/g, '/')})"`;
  try {
    const result = execSync(cmd, { stdio: 'pipe', timeout: 30000, shell: 'bash' }).toString();
    const data = JSON.parse(result);
    if (data.result && data.result.data && data.result.data.success) {
      console.log(`  OK  ${packName}/${filename}`);
      return true;
    } else {
      console.log(`  FAIL ${packName}/${filename}`);
      return false;
    }
  } catch (e) {
    console.log(`  ERR  ${packName}/${filename} — ${e.message.split('\n')[0].slice(0, 100)}`);
    return false;
  }
}

// ============================================================================
// HALO PACK
// ============================================================================
const halo = [
  ['halo', 'wake-up-chief.mp3', 'deep commanding female AI voice saying Wake up Chief in a calm futuristic tone, sci-fi ambiance'],
  ['halo', 'i-need-a-weapon.mp3', 'deep gravelly male soldier voice saying I need a weapon with determination, military sci-fi'],
  ['halo', 'lets-go.mp3', 'calm confident female AI voice saying Lets go with subtle electronic reverb, futuristic'],
  ['halo', 'copy-that.mp3', 'deep male military voice saying Copy that brief and crisp, radio comms style'],
  ['halo', 'affirmative.mp3', 'calm female AI voice saying Affirmative with slight electronic processing'],
  ['halo', 'mission-complete.mp3', 'authoritative female AI voice saying Mission complete with satisfaction, sci-fi tone'],
  ['halo', 'job-done-chief.mp3', 'warm female AI voice saying Job done Chief friendly and accomplished tone'],
  ['halo', 'area-secured.mp3', 'deep male soldier voice saying Area secured confident and relieved military tone'],
  ['halo', 'we-got-a-problem.mp3', 'concerned female AI voice saying We got a problem urgent but controlled, sci-fi'],
  ['halo', 'shield-down.mp3', 'alert female AI voice saying Shields down with urgency and electronic distortion'],
  ['halo', 'chief-need-you.mp3', 'urgent female AI voice saying Chief I need you requesting attention, sci-fi'],
  ['halo', 'awaiting-orders.mp3', 'calm male military voice saying Awaiting orders sir professional and ready'],
  ['halo', 'low-ammo.mp3', 'tense male soldier voice saying Running low on ammo concerned military tone'],
  ['halo', 'easy-spartan.mp3', 'calm female AI voice saying Easy Spartan gently admonishing, futuristic tone'],
];

// ============================================================================
// TERMINATOR PACK
// ============================================================================
const terminator = [
  ['terminator', 'ill-be-back.mp3', 'deep monotone robotic male voice with slight Austrian accent saying Ill be back cold and menacing'],
  ['terminator', 'system-activated.mp3', 'cold robotic male voice saying System activated flat emotionless terminator style'],
  ['terminator', 'acknowledged.mp3', 'flat emotionless robotic male voice saying Acknowledged brief terminator style'],
  ['terminator', 'affirmative-t.mp3', 'deep robotic male voice saying Affirmative cold and mechanical'],
  ['terminator', 'terminated.mp3', 'deep menacing robotic male voice saying Terminated with finality, cold'],
  ['terminator', 'mission-accomplished.mp3', 'flat robotic male voice saying Mission accomplished emotionless terminator'],
  ['terminator', 'hasta-la-vista.mp3', 'deep robotic male voice with Austrian accent saying Hasta la vista baby iconic delivery'],
  ['terminator', 'system-malfunction.mp3', 'glitching robotic voice saying System malfunction with electronic distortion'],
  ['terminator', 'damage-detected.mp3', 'cold robotic male voice saying Damage detected flat diagnostic tone'],
  ['terminator', 'come-with-me.mp3', 'deep commanding robotic male voice saying Come with me if you want to live urgent monotone'],
  ['terminator', 'your-input.mp3', 'flat robotic male voice saying Your input is required mechanical and patient'],
  ['terminator', 'power-cell-low.mp3', 'weakening robotic voice saying Power cell depleting with slight electronic fade'],
  ['terminator', 'talk-to-the-hand.mp3', 'deadpan robotic male voice saying Talk to the hand dry humor terminator style'],
];

// ============================================================================
// MOVIE QUOTES PACK
// ============================================================================
const movieQuotes = [
  ['movie_quotes', 'good-morning-vietnam.mp3', 'energetic enthusiastic male voice shouting Good morning Vietnam with excitement and radio static'],
  ['movie_quotes', 'here-we-go.mp3', 'dramatic male voice saying Here we go with building intensity, action movie style'],
  ['movie_quotes', 'as-you-wish.mp3', 'charming gentle male voice saying As you wish romantic and sincere, fairy tale tone'],
  ['movie_quotes', 'you-got-it.mp3', 'confident casual male voice saying You got it dude friendly 90s sitcom energy'],
  ['movie_quotes', 'houston-no-problem.mp3', 'calm astronaut male voice saying Houston we no longer have a problem satisfied and relieved'],
  ['movie_quotes', 'i-am-iron-man.mp3', 'confident charismatic male voice saying I am Iron Man with cool swagger and slight echo'],
  ['movie_quotes', 'thats-all-folks.mp3', 'cheerful animated voice saying Thats all folks classic cartoon ending style'],
  ['movie_quotes', 'houston-problem.mp3', 'concerned calm astronaut male voice saying Houston we have a problem serious understatement'],
  ['movie_quotes', 'i-got-a-bad-feeling.mp3', 'worried male voice saying I got a bad feeling about this apprehensive space adventure tone'],
  ['movie_quotes', 'are-you-talking-to-me.mp3', 'confrontational intense male voice saying Are you talking to me challenging New York accent'],
  ['movie_quotes', 'phone-home.mp3', 'gentle alien-like childish voice saying Phone home sweet and innocent, sci-fi'],
  ['movie_quotes', 'what-we-got-here.mp3', 'authoritative Southern male voice saying What we got here is a failure to communicate drawling'],
  ['movie_quotes', 'bigger-boat.mp3', 'stunned male voice saying Were gonna need a bigger boat awestruck and worried'],
  ['movie_quotes', 'do-i-feel-lucky.mp3', 'menacing calm male voice saying Do you feel lucky punk low and threatening Dirty Harry style'],
  ['movie_quotes', 'slow-your-roll.mp3', 'cool laid-back male voice saying Slow your roll casual street wisdom'],
];

function delay(ms) {
  execSync(`sleep ${ms / 1000}`, { stdio: 'pipe', shell: 'bash' });
}

async function generatePack(name, sounds) {
  console.log(`\n=== Generating ${name} pack (${sounds.length} sounds) ===\n`);
  let ok = 0, fail = 0;
  for (const [pack, file, prompt] of sounds) {
    const success = generateSound(pack, file, prompt);
    if (success) ok++; else fail++;
    delay(500);
  }
  console.log(`\n${name}: ${ok} succeeded, ${fail} failed\n`);
  return { ok, fail };
}

async function main() {
  console.log('Generating voice packs via Kie.ai...\n');

  const results = [];
  results.push(await generatePack('halo', halo));
  results.push(await generatePack('terminator', terminator));
  results.push(await generatePack('movie_quotes', movieQuotes));

  // Cleanup temp file
  const tmpFile = path.join(HAIL_ROOT, '_tmp_params.json');
  if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

  const totalOk = results.reduce((s, r) => s + r.ok, 0);
  const totalFail = results.reduce((s, r) => s + r.fail, 0);
  console.log(`\nAll done! ${totalOk} succeeded, ${totalFail} failed.`);
}

main();
