/* =====================================================================
 * WEB03 · ฟอร์มประเมิน DSR 7 ข้อ — ชิ้นส่วนใช้ซ้ำ "แหล่งเดียว"
 * ใช้ที่: /dsr/ (ปลายทาง Google Ads) และ /debt/ (ฝังใต้กล่องส้ม)
 * คำสั่ง: ORDER-BIZ04-to-WEB03-WEB02-dsr-embed-debt-and-trust-strip-2026-10-23.md เรื่อง 1
 *
 * วิธีฝัง:
 *   <div id="dsr-mount" data-page="/debt/" data-intro="0"></div>
 *   <script src="/dsr/dsr-form.js" defer></script>
 *     data-page  = หน้าต้นทาง ส่งไป worker เป็นฟิลด์ page → ท่อนแรกของช่อง "รหัสคลิกโฆษณา" (กติกา BOT01 23 ต.ค. 69)
 *                  รับเฉพาะ "/dsr/" หรือ "/debt/" — ค่าอื่น worker จะเขียน หน้า:อื่น
 *     data-intro = "0" ซ่อนหัว "ประเมินเบื้องต้นด้วยตัวเอง" (หน้าที่มีหัวข้อของตัวเองอยู่แล้ว)
 *
 * ⚠️ ห้ามก๊อปฟอร์มนี้เป็นชุดที่ 2 — แก้ที่ไฟล์นี้ที่เดียว ทุกหน้าเปลี่ยนตาม
 * ⚠️ ชื่อฟิลด์ใน payload (income, debt, gclid, utm_source, utm_campaign, page ฯลฯ) worker ของ BOT01 อ้างตรงตัว — เปลี่ยนต้องแจ้ง BOT01 ก่อน
 * ⚠️ debt = ผ่อนเดิม/เดือน ไม่ใช่ยอดหนี้คงค้าง (worker ตั้งใจไม่เอาไปลงช่อง "ยอดหนี้รวม")
 * ⚠️ ข้อความ prefill LINE ต้องมีคำว่า "ฟอร์ม DSR" — worker ใช้แยกไม่ให้ลงชีตซ้ำ
 * สเปคตัวเลขล็อก 4 ส.ค. 2569 — sources/loan-rates/mortgage-rates-2569-08.md
 * ===================================================================== */
(function () {
  'use strict';

  var mount = document.getElementById('dsr-mount');
  if (!mount || mount.getAttribute('data-ready') === '1') return;
  mount.setAttribute('data-ready', '1');

  var PAGE = mount.getAttribute('data-page') || '/dsr/';
  var SHOW_INTRO = mount.getAttribute('data-intro') !== '0';

  /* ---------- นำร่องหน้าแบรนด์ (ORDER BIZ04 23 ต.ค. 69 "การตลาดย้อนกลับ") — เปิดเฉพาะหน้าที่ตั้งค่าเท่านั้น ----------
   * data-title  = หัวข้อแทน "ประเมินเบื้องต้นด้วยตัวเอง" เช่น "สนใจคอนโดพฤกษา? เช็คก่อนว่ากู้ผ่านไหม ใน 2 นาที"
   * data-sub    = ข้อความเชื่อมใต้หัวข้อ (เบา ไม่สัญญาว่ากู้ผ่าน)
   * data-unit   = "ห้องนี้" (คอนโด) / "หลังนี้" (บ้าน) — ใช้ในปุ่มการ์ด + หัวข้อเมื่อกดจากการ์ด
   * data-cards  = "1" ฉีดปุ่ม "เช็คว่ากู้<unit>ผ่านไหม" ลง .property-card .card-footer ทุกใบ (ชื่อโครงการจาก .card-title)
   * data-sticky = "1" แถบติดล่างจอมือถือ "เช็คโอกาสกู้ 2 นาที" ซ่อนเมื่อถึงฟอร์มแล้ว
   * ไม่ตั้งค่าเหล่านี้ (/dsr/ /debt/) = พฤติกรรมเดิมทุกตัวอักษร · project ส่งเฉพาะเมื่อมีค่า */
  var TITLE = mount.getAttribute('data-title') || '';
  var SUB = mount.getAttribute('data-sub') || '';
  var UNIT = mount.getAttribute('data-unit') || 'ห้องนี้';
  var USE_CARDS = mount.getAttribute('data-cards') === '1';
  var USE_STICKY = mount.getAttribute('data-sticky') === '1';
  var PROJECT = '';
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- สไตล์ (ย้ายมาจาก <style> ของ /dsr/ ทั้งชุด — แหล่งเดียว) ---------- */
  if (!document.getElementById('dsr-form-css')) {
    var css = document.createElement('style');
    css.id = 'dsr-form-css';
    css.textContent = [
      ".dsr-wrap { max-width: 640px; margin: 0 auto; padding: 0 20px 2.5rem; font-family: 'IBM Plex Sans Thai','Prompt',sans-serif; }",
      ".dsr-card { background:#ffffff; border:1px solid #e7e5e4; border-radius:20px; padding:28px 24px; box-shadow:0 12px 32px rgba(0,0,0,.08); color:#1c1917; }",
      ".dsr-card h2 { font-family:'Prompt',sans-serif; font-size:1.3rem; color:#1e40af; margin:0 0 4px; }",
      ".dsr-sub { color:#57534e; font-size:.95rem; margin:0 0 18px; line-height:1.6; }",
      ".dsr-label { display:block; font-size:.9rem; font-weight:600; color:#1c1917; margin:0 0 4px; }",
      ".dsr-num { display:block; font-size:.78rem; font-weight:700; color:#1e40af; margin:14px 0 2px; }",
      ".dsr-num.first { margin-top:0; }",
      ".dsr-input, .dsr-select { width:100%; box-sizing:border-box; padding:11px 14px; border:1px solid #d6d3d1; border-radius:10px; font:inherit; font-size:.95rem; margin-bottom:4px; background:#fafaf9; color:#1c1917; }",
      ".dsr-hint { font-size:.8rem; color:#a8a29e; margin:0 0 6px; line-height:1.5; }",
      ".dsr-radio-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:4px; }",
      ".dsr-radio-row label { flex:1; min-width:110px; display:flex; align-items:center; justify-content:center; gap:6px; padding:10px 8px; border:1px solid #d6d3d1; border-radius:10px; font-size:.9rem; cursor:pointer; background:#fafaf9; text-align:center; }",
      ".dsr-radio-row input { accent-color:#1e40af; }",
      ".dsr-radio-row label:has(input:checked) { border-color:#1e40af; background:#eff6ff; font-weight:600; }",
      ".dsr-submit { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg,#1e40af,#3b82f6); color:#fff; border:none; border-radius:999px; padding:14px; font-family:'Prompt',sans-serif; font-weight:600; font-size:1.05rem; cursor:pointer; box-shadow:0 4px 14px rgba(30,64,175,.35); margin-top:16px; }",
      ".dsr-consent { display:flex; gap:8px; align-items:flex-start; font-size:.85rem; color:#57534e; margin-top:14px; line-height:1.5; cursor:pointer; }",
      ".dsr-result { margin-top:1.5rem; display:none; }",
      ".dsr-badge { display:inline-block; font-family:'Prompt',sans-serif; font-weight:600; font-size:.95rem; padding:6px 16px; border-radius:999px; margin-bottom:10px; }",
      ".dsr-badge.good { background:#dcfce7; color:#166534; }",
      ".dsr-badge.mid { background:#fef3c7; color:#92400e; }",
      ".dsr-badge.low { background:#e0e7ff; color:#3730a3; }",
      ".dsr-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:16px 0; }",
      ".dsr-stat { background:#f5f5f4; border-radius:12px; padding:12px 14px; }",
      ".dsr-stat .k { font-size:.78rem; color:#78716c; line-height:1.4; }",
      ".dsr-stat .v { font-family:'Prompt',sans-serif; font-weight:700; font-size:1.15rem; color:#1c1917; }",
      ".dsr-stat .v small { font-size:.75rem; font-weight:400; color:#a8a29e; }",
      ".dsr-reasons { background:#fffbeb; border:1px solid #fde68a; border-radius:12px; padding:12px 16px; font-size:.88rem; color:#78350f; line-height:1.7; margin:12px 0; }",
      ".dsr-callout { background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; padding:12px 16px; font-size:.88rem; color:#1e3a8a; line-height:1.7; margin:12px 0; }",
      ".dsr-line-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:#06C755; color:#fff; border:none; border-radius:999px; padding:14px; font-family:'Prompt',sans-serif; font-weight:600; font-size:1.05rem; cursor:pointer; box-shadow:0 4px 14px rgba(6,199,85,.35); text-decoration:none; box-sizing:border-box; margin-top:8px; }",
      ".dsr-disclaimer { font-size:.8rem; color:#a8a29e; line-height:1.6; margin-top:14px; }",
      ".dsr-again { background:none; border:none; color:#1e40af; text-decoration:underline; font:inherit; font-size:.85rem; cursor:pointer; margin-top:10px; }",
      "@media (max-width:480px){ .dsr-stats{ grid-template-columns:1fr; } }"
    ].concat(USE_CARDS || USE_STICKY ? [
      // ปุ่มการ์ด + แถบล่างมือถือ (หน้าแบรนด์เท่านั้น)
      // เลื่อนลงฟอร์ม/ผลแล้วไม่ให้หัวข้อมุดใต้ header ที่ติดบนจอ (สูง 56px)
      "#dsrFormCard, #dsrResult { scroll-margin-top:72px; }",
      ".card-footer:has(.dsr-card-btn) { display:flex; flex-wrap:wrap; gap:8px; }",
      ".dsr-card-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff !important; border:none; border-radius:999px; padding:8px 14px; font-family:'Prompt',sans-serif; font-weight:600; font-size:.85rem; text-decoration:none; cursor:pointer; box-shadow:0 3px 10px rgba(217,119,6,.3); }",
      ".dsr-bar { position:fixed; left:0; right:0; bottom:0; z-index:95; padding:10px 14px calc(10px + env(safe-area-inset-bottom)); background:rgba(17,17,17,.94); border-top:1px solid rgba(255,255,255,.12); transform:translateY(110%); transition:transform .2s ease; }",
      ".dsr-bar.on { transform:none; }",
      ".dsr-bar a { display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg,#f59e0b,#d97706); color:#fff; border-radius:999px; padding:12px; font-family:'Prompt',sans-serif; font-weight:700; font-size:1rem; text-decoration:none; }",
      // ยกปุ่มลอย โทร/LINE ขึ้นเหนือแถบ — ไม่บังกัน
      "body.dsr-bar-on .float-cta-pair { bottom:84px !important; transition:bottom .2s ease; }",
      "@media (min-width:769px){ .dsr-bar { display:none !important; } body.dsr-bar-on .float-cta-pair { bottom:20px !important; } }"
    ] : []).join('\n');
    document.head.appendChild(css);
  }

  /* ---------- HTML ฟอร์ม 7 ข้อ (เดิมทุกตัวอักษร) ---------- */
  mount.innerHTML =
    '<div class="dsr-wrap">' +
    '<div class="dsr-card" id="dsrFormCard">' +
    (TITLE
      ? '<h2 id="dsrTitle">' + esc(TITLE) + '</h2>' +
        (SUB ? '<p class="dsr-sub">' + esc(SUB) + '</p>' : '')
      : SHOW_INTRO
      ? '<h2>ประเมินเบื้องต้นด้วยตัวเอง</h2>' +
        '<p class="dsr-sub">ใช้เกณฑ์เดียวกับที่ทีมเราใช้คัดกรองเคสจริง ผลที่ได้เป็นประมาณการเบื้องต้น ไม่ใช่ผลอนุมัติ</p>'
      : '') +
    '<form id="dsrForm" autocomplete="off">' +

    '<span class="dsr-num' + (SHOW_INTRO || TITLE ? '' : ' first') + '">ข้อ 1/7</span>' +
    '<label class="dsr-label" for="fAge">อายุ (ปี)</label>' +
    '<p class="dsr-hint">อายุมีผลกับระยะเวลากู้ที่เหลือ — ยิ่งอายุมาก ระยะกู้สั้นลง ค่างวดต่อเดือนสูงขึ้น</p>' +
    '<input class="dsr-input" id="fAge" name="age" type="number" inputmode="numeric" min="20" max="75" required placeholder="เช่น 35">' +

    '<span class="dsr-num">ข้อ 2/7</span>' +
    '<label class="dsr-label" for="fIncome">รายได้ต่อเดือน (บาท)</label>' +
    '<input class="dsr-input" id="fIncome" name="income" type="number" inputmode="numeric" min="0" step="100" required placeholder="เช่น 30000">' +
    '<div class="dsr-radio-row" style="margin-top:6px;">' +
      '<label><input type="radio" name="jobType" value="ประจำ" checked> พนักงานประจำ</label>' +
      '<label><input type="radio" name="jobType" value="อิสระ"> อิสระ / เจ้าของกิจการ</label>' +
    '</div>' +
    '<p class="dsr-hint">รายได้อิสระ ธนาคารดูจาก statement ย้อนหลัง 12-24 เดือน และมักนับให้ต่ำกว่ายอดจริง</p>' +

    '<span class="dsr-num">ข้อ 3/7</span>' +
    '<label class="dsr-label" for="fProvince">จังหวัดที่ทำงาน</label>' +
    '<select class="dsr-select" id="fProvince" name="province" required>' +
      '<option value="" disabled selected>— เลือกจังหวัด —</option>' +
    '</select>' +

    '<span class="dsr-num">ข้อ 4/7</span>' +
    '<label class="dsr-label" for="fDebt">ภาระผ่อนรวมต่อเดือน (บาท)</label>' +
    '<p class="dsr-hint">รวมทุกรายการ: บัตรเครดิต (ยอดผ่อนขั้นต่ำ) · บัตรกดเงินสด · ผ่อนรถ · ผ่อนบ้าน · สินเชื่อส่วนบุคคล — ไม่มีใส่ 0</p>' +
    '<input class="dsr-input" id="fDebt" name="debt" type="number" inputmode="numeric" min="0" step="100" required placeholder="เช่น 8000">' +

    '<span class="dsr-num">ข้อ 5/7</span>' +
    '<label class="dsr-label" for="fBnpl">ยอดผ่อนแอปซื้อก่อนจ่ายทีหลัง (BNPL) ต่อเดือน (บาท)</label>' +
    '<p class="dsr-hint">เช่น Shopee SPayLater · LazPayLater · Flash Pay · True Money ผ่อนชำระ — รายการพวกนี้ไม่โชว์ในบูโร แต่ธนาคารเห็นจาก statement แน่นอน — ไม่มีใส่ 0</p>' +
    '<input class="dsr-input" id="fBnpl" name="bnpl" type="number" inputmode="numeric" min="0" step="100" required placeholder="เช่น 0">' +

    '<span class="dsr-num">ข้อ 6/7</span>' +
    '<label class="dsr-label">เคยผิดนัดชำระ (ค้างเกิน 30 วัน) กี่รายการ</label>' +
    '<div class="dsr-radio-row">' +
      '<label><input type="radio" name="defaults" value="ไม่เคย" checked> ไม่เคย</label>' +
      '<label><input type="radio" name="defaults" value="1-2 รายการ"> 1-2 รายการ</label>' +
      '<label><input type="radio" name="defaults" value="มากกว่า 2"> มากกว่า 2</label>' +
    '</div>' +

    '<span class="dsr-num">ข้อ 7/7</span>' +
    '<label class="dsr-label" for="fGoal">เป้าหมายของคุณ</label>' +
    '<select class="dsr-select" id="fGoal" name="goal">' +
      '<option>ปิดหนี้ รวมหนี้</option>' +
      '<option>ปิดหนี้ก่อนกู้บ้าน</option>' +
      '<option>ซื้อบ้าน / คอนโด มือ 1</option>' +
      '<option>เรื่องอื่น ๆ</option>' +
    '</select>' +

    '<hr style="border:none;border-top:1px solid #e7e5e4;margin:20px 0 14px;">' +

    '<label class="dsr-label" for="fName">ชื่อที่ให้เราเรียก</label>' +
    '<input class="dsr-input" id="fName" name="name" type="text" placeholder="ชื่อเล่นก็ได้">' +
    '<label class="dsr-label" for="fPhone" style="margin-top:10px;">เบอร์โทร</label>' +
    '<input class="dsr-input" id="fPhone" name="phone" type="tel" required placeholder="08x-xxx-xxxx" pattern="[0-9\\-\\s]{9,12}">' +
    // ช่วงเวลาโทรกลับ (อ.เคาะ 23 ต.ค. 69 · ชุดเดียวกันทุกช่องทาง) — value = ค่าที่ลงชีต 21 ตรงตัว ห้ามแก้โดยไม่แจ้ง BOT01
    '<label class="dsr-label" for="fCallTime" style="margin-top:10px;">ช่วงเวลาที่สะดวกให้ทีมโทรกลับ (จ–ส)</label>' +
    '<select class="dsr-select" id="fCallTime" name="callTime">' +
      '<option value="เวลาไหนก็ได้" selected>เวลาไหนก็ได้</option>' +
      '<option value="11.00-13.00">11.00–13.00 น. (พักกลางวัน)</option>' +
      '<option value="13.00-15.00">13.00–15.00 น.</option>' +
      '<option value="15.00-18.00">15.00–18.00 น.</option>' +
      '<option value="18.00-20.00">18.00–20.00 น. (หลังเลิกงาน)</option>' +
    '</select>' +
    '<input type="text" name="website" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px;height:0;width:0;border:0;padding:0;" aria-hidden="true">' +

    '<label class="dsr-consent">' +
      '<input type="checkbox" id="fConsent" required style="margin-top:3px;flex:none;">' +
      '<span>ยินยอมให้บริษัทเก็บข้อมูลข้างต้นเพื่อประเมินเบื้องต้นและติดต่อกลับ ตาม<a href="/privacy/" target="_blank" style="color:#1e40af;text-decoration:underline;">นโยบายความเป็นส่วนตัว</a> (ยกเลิกได้ทุกเมื่อทาง LINE หรือโทร 02-334-0940)</span>' +
    '</label>' +

    '<button type="submit" class="dsr-submit">ดูผลประเมินของฉัน</button>' +
    '<p style="text-align:center;font-size:.85rem;color:#a8a29e;margin:12px 0 0;">ไม่ต้องใช้เลขบัตรประชาชน · ไม่ต้องใช้ข้อมูลบัญชีธนาคาร</p>' +
    '</form>' +
    '</div>' +
    '<div class="dsr-card dsr-result" id="dsrResult"></div>' +
    '</div>';

  /* ---------- ค่าคงที่ ---------- */
  var DSR_CFG = {
    RATE_SCREEN: 0.065,   // ชั้นคัดกรอง ≈ MRR เต็ม (ธปท. 4 ส.ค. 69 เฉลี่ย 5 แบงก์ 6.63%)
    RATE_PROMO: 0.030,    // โชว์ค่างวดช่วงโปร 3 ปีแรก (ค่ากลางตลาด ส.ค. 69)
    RATE_AFTER: 0.055,    // โชว์ค่างวดหลังหมดโปร (MRR - ส่วนลดทั่วไป)
    DSR_CAP: 60,          // เพดาน DSR เดียวทุกระดับรายได้
    DSR_GOOD: 40,
    AGE_CAP: { "ประจำ": 65, "อิสระ": 70 },   // อายุ + ระยะกู้ ไม่เกิน
    MAX_TERM: 30,
    MIN_TERM: 5,          // สั้นกว่านี้ = ไม่คำนวณ ชวนคุยทีม
    SELF_INCOME_FACTOR: 0.7,
    METRO: ["กรุงเทพมหานคร","นนทบุรี","ปทุมธานี","สมุทรปราการ","สมุทรสาคร","นครปฐม"],
    FLOOR_METRO: 20000, FLOOR_OTHER: 15000
  };

  var PROVINCES = ["กรุงเทพมหานคร","นนทบุรี","ปทุมธานี","สมุทรปราการ","สมุทรสาคร","นครปฐม","กระบี่","กาญจนบุรี","กาฬสินธุ์","กำแพงเพชร","ขอนแก่น","จันทบุรี","ฉะเชิงเทรา","ชลบุรี","ชัยนาท","ชัยภูมิ","ชุมพร","เชียงราย","เชียงใหม่","ตรัง","ตราด","ตาก","นครนายก","นครพนม","นครราชสีมา","นครศรีธรรมราช","นครสวรรค์","นราธิวาส","น่าน","บึงกาฬ","บุรีรัมย์","ประจวบคีรีขันธ์","ปราจีนบุรี","ปัตตานี","พระนครศรีอยุธยา","พะเยา","พังงา","พัทลุง","พิจิตร","พิษณุโลก","เพชรบุรี","เพชรบูรณ์","แพร่","ภูเก็ต","มหาสารคาม","มุกดาหาร","แม่ฮ่องสอน","ยโสธร","ยะลา","ร้อยเอ็ด","ระนอง","ระยอง","ราชบุรี","ลพบุรี","ลำปาง","ลำพูน","เลย","ศรีสะเกษ","สกลนคร","สงขลา","สตูล","สมุทรสงคราม","สระแก้ว","สระบุรี","สิงห์บุรี","สุโขทัย","สุพรรณบุรี","สุราษฎร์ธานี","สุรินทร์","หนองคาย","หนองบัวลำภู","อ่างทอง","อำนาจเจริญ","อุดรธานี","อุตรดิตถ์","อุทัยธานี","อุบลราชธานี"];
  var provSel = document.getElementById('fProvince');
  PROVINCES.forEach(function (p) { var o = document.createElement('option'); o.value = p; o.textContent = p; provSel.appendChild(o); });

  /* ---------- ที่มาของผู้เข้าชม (gclid / utm) — อ่านจาก localStorage ntk_* ที่ snippet WEB01 เก็บไว้ ---------- */
  var NTK_SRC = (function () {
    var q = new URLSearchParams(location.search);
    var store = function (k, v) { if (v) { try { localStorage.setItem('ntk_' + k, v); } catch (e) {} } };
    var get = function (k) { return q.get(k) || (function () { try { return localStorage.getItem('ntk_' + k) || ''; } catch (e) { return ''; } })(); };
    store('gclid', q.get('gclid')); store('utm_source', q.get('utm_source')); store('utm_campaign', q.get('utm_campaign'));
    var gclid = get('gclid'), us = (get('utm_source') || '').toLowerCase(), ref = (document.referrer || '').toLowerCase();
    var code = 'ORG';
    if (gclid || us.indexOf('google') !== -1) code = 'G';
    else if (/facebook|^fb$|instagram|^ig$/.test(us) || ref.indexOf('facebook.') !== -1 || ref.indexOf('instagram.') !== -1) code = 'FB';
    else if (us.indexOf('tiktok') !== -1 || ref.indexOf('tiktok.') !== -1) code = 'TT';
    var camp = (code === 'ORG') ? '' : (window.NTK_CAMP || '');
    var token = '[' + code + (camp ? ':' + camp : '') + ']';
    return { gclid: gclid, utm_source: get('utm_source'), utm_campaign: get('utm_campaign'), token: token };
  })();

  function pmtPerMillion(annualRate, years) {
    var r = annualRate / 12, n = Math.round(years * 12);
    return 1000000 * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  }
  function fmtBaht(x) { return Math.round(x).toLocaleString('th-TH'); }
  function fmtM(x) { return (Math.floor(x / 100000) / 10).toLocaleString('th-TH', { minimumFractionDigits: 1 }); }

  function assessDsr(d) {
    var cap = DSR_CFG.AGE_CAP[d.jobType] || 65;
    var term = Math.min(DSR_CFG.MAX_TERM, cap - d.age);
    var incomeAdj = d.jobType === 'อิสระ' ? d.income * DSR_CFG.SELF_INCOME_FACTOR : d.income;
    var floor = DSR_CFG.METRO.indexOf(d.province) !== -1 ? DSR_CFG.FLOOR_METRO : DSR_CFG.FLOOR_OTHER;
    var dsr = incomeAdj > 0 ? (d.debt + d.bnpl) / incomeAdj * 100 : 999;
    var reasons = [];
    var tier; // 1=แนวโน้มดี 2=ก้ำกึ่ง 3=ยังไม่ผ่านเกณฑ์ 4=ชวนคุยทีม(อายุ)

    if (term < DSR_CFG.MIN_TERM) {
      tier = 4;
      reasons.push('ช่วงอายุนี้ระยะกู้ที่เหลือสั้นมาก ธนาคารส่วนใหญ่พิจารณาเป็นรายเคส');
    } else {
      if (d.income < floor) reasons.push('รายได้ต่ำกว่าเกณฑ์พื้นที่ (' + fmtBaht(floor) + ' บาท/เดือน)');
      if (d.defaults === 'มากกว่า 2') reasons.push('ประวัติผิดนัดเกิน 2 รายการ');
      if (d.income < floor || d.defaults === 'มากกว่า 2') {
        tier = 3;
      } else if (dsr <= DSR_CFG.DSR_GOOD) {
        tier = 1;
      } else if (dsr <= DSR_CFG.DSR_CAP) {
        tier = 2;
        reasons.push('DSR ปัจจุบัน ' + dsr.toFixed(0) + '% อยู่ช่วง ' + DSR_CFG.DSR_GOOD + '-' + DSR_CFG.DSR_CAP + '% — จัดภาระหนี้ก่อนยื่นจะช่วยได้มาก');
      } else {
        tier = 3;
        reasons.push('DSR ปัจจุบัน ' + dsr.toFixed(0) + '% เกินเพดานที่ธนาคารส่วนใหญ่ใช้ (' + DSR_CFG.DSR_CAP + '%)');
      }
      if (d.defaults === '1-2 รายการ' && tier === 1) {
        tier = 2;
        reasons.push('มีประวัติผิดนัด 1-2 รายการ — ธนาคารพิจารณารายเคส ควรให้ทีมช่วยดูก่อนยื่น');
      }
      if (d.age >= 55 && tier === 1) {
        tier = 2;
        reasons.push('อายุ 55 ปีขึ้นไป ระยะกู้ที่เหลือสั้น — ควรคุยกับทีมและพิจารณาหาผู้กู้ร่วม');
      }
    }

    var capacity = Math.max(0, incomeAdj * DSR_CFG.DSR_CAP / 100 - d.debt - d.bnpl);
    var termCalc = Math.max(term, DSR_CFG.MIN_TERM);
    var pmtScreen = pmtPerMillion(DSR_CFG.RATE_SCREEN, termCalc);
    var loan = capacity / pmtScreen * 1000000;
    return {
      tier: tier, dsr: dsr, term: term, loan: loan, capacity: capacity,
      payPromo: loan / 1000000 * pmtPerMillion(DSR_CFG.RATE_PROMO, termCalc),
      payAfter: loan / 1000000 * pmtPerMillion(DSR_CFG.RATE_AFTER, termCalc),
      reasons: reasons, floor: floor
    };
  }

  var TIER_META = {
    1: { cls: 'good', badge: 'แนวโน้มดี', title: 'เคสของคุณอยู่ในเกณฑ์ที่มีโอกาสวางแผนได้',
         body: 'จากข้อมูลเบื้องต้น ภาระหนี้ต่อรายได้ของคุณอยู่ในระดับที่ดี ขั้นถัดไปคือให้ทีมตรวจแบบละเอียดจากเอกสารจริง (สลิป + statement) ฟรี ไม่มีค่าใช้จ่าย เพื่อยืนยันตัวเลขก่อนยื่นจริง' },
    2: { cls: 'mid', badge: 'ก้ำกึ่ง — ควรวางแผนก่อนยื่น', title: 'มีจุดที่ต้องจัดการก่อนยื่น ถึงจะยื่นได้อย่างมั่นใจ',
         body: 'เคสลักษณะนี้เจอบ่อยที่สุด หลายเคสใช้เวลาเตรียมตัว 3-6 เดือน (จัดภาระหนี้ ลด DSR เตรียมเอกสาร) แล้วค่อยยื่น ทีมช่วยวางแผนให้ฟรี' },
    3: { cls: 'low', badge: 'ยังไม่ผ่านเกณฑ์เบื้องต้น', title: 'ตอนนี้อาจยังไม่ใช่จังหวะยื่นกู้ — แต่ไม่ใช่ทางตัน',
         body: 'นี่คืองานหลักของทีมเราโดยตรง: วางแผนปิดหนี้ / จัดโครงสร้างภาระหนี้ ให้ตัวเลขพร้อมก่อนยื่นรอบหน้า ทีมงานมีทางเลือกให้ปรึกษาตามสภาพเคสจริง ทักมาคุยได้เลย ประเมินฟรี' },
    4: { cls: 'mid', badge: 'แนะนำคุยกับทีมโดยตรง', title: 'ช่วงอายุนี้ต้องดูรายละเอียดเป็นรายเคส',
         body: 'ระยะกู้ที่เหลือสั้น ทำให้การคำนวณอัตโนมัติไม่แม่นพอ ทีมช่วยดูทางเลือกที่เหมาะกับคุณ เช่น การหาผู้กู้ร่วม หรือรูปแบบสินเชื่อที่เหมาะกับช่วงวัย' }
  };

  function renderResult(d, r) {
    var m = TIER_META[r.tier];
    var html = '<span class="dsr-badge ' + m.cls + '">' + m.badge + '</span>';
    html += '<h2 style="color:#1c1917;font-size:1.15rem;margin:0 0 8px;">' + m.title + '</h2>';
    html += '<p style="color:#57534e;font-size:.93rem;line-height:1.7;margin:0;">' + m.body + '</p>';

    if (r.tier !== 4) {
      html += '<div class="dsr-stats">';
      html += '<div class="dsr-stat"><div class="k">DSR ปัจจุบันของคุณ</div><div class="v">' + (r.dsr >= 999 ? '—' : r.dsr.toFixed(0) + '%') + ' <small>เกณฑ์ทั่วไป ≤ ' + DSR_CFG.DSR_CAP + '%</small></div></div>';
      if (r.loan >= 300000 && r.tier !== 3) {
        html += '<div class="dsr-stat"><div class="k">วงเงินกู้บ้านโดยประมาณ</div><div class="v">~' + fmtM(r.loan) + ' ล้านบาท <small>ที่ระยะกู้ ' + Math.min(r.term, DSR_CFG.MAX_TERM) + ' ปี</small></div></div>';
        html += '<div class="dsr-stat"><div class="k">ค่างวดช่วงโปร 3 ปีแรก (~3.0%)</div><div class="v">~' + fmtBaht(r.payPromo) + ' บ./เดือน</div></div>';
        html += '<div class="dsr-stat"><div class="k">ค่างวดหลังหมดโปร (~5.5%)</div><div class="v">~' + fmtBaht(r.payAfter) + ' บ./เดือน <small>ปีที่ 4 เป็นต้นไป ดอกเบี้ยลอยตัว</small></div></div>';
      }
      html += '</div>';
    }

    if (r.reasons.length) {
      html += '<div class="dsr-reasons"><b>สิ่งที่ระบบเห็นจากข้อมูลของคุณ (ตรงไปตรงมา):</b><br>· ' + r.reasons.join('<br>· ') + '</div>';
    }
    if (r.tier === 3) {
      var tips = [];
      if (r.dsr > DSR_CFG.DSR_CAP) tips.push('ลดภาระผ่อนรายเดือน — เริ่มจากปิดหนี้ดอกเบี้ยแพงสุดก่อน (บัตรกดเงินสด · BNPL · สินเชื่อส่วนบุคคล)');
      if (d.defaults === 'มากกว่า 2') tips.push('รักษาประวัติชำระตรงเวลาต่อเนื่อง 6-12 เดือน ให้ประวัติล่าสุดดีขึ้นก่อนยื่นใหม่');
      if (d.income < r.floor) tips.push('เสริมหลักฐานรายได้ให้ชัดขึ้น (เงินเข้าบัญชีสม่ำเสมอ) หรือพิจารณาหาผู้กู้ร่วม');
      if (!tips.length) tips.push('จัดภาระหนี้และเตรียมเอกสารรายได้ให้พร้อมก่อนยื่นรอบหน้า');
      html += '<div class="dsr-callout" style="background:#f0fdf4;border-color:#bbf7d0;color:#14532d;"><b>สิ่งที่ควรปรับก่อนยื่นรอบหน้า:</b><br>· ' + tips.join('<br>· ') + '</div>';
    }
    if (d.age >= 46 && r.tier !== 4) {
      html += '<div class="dsr-callout">💡 อายุ 46 ปีขึ้นไป: แนะนำพิจารณา<b>หาผู้กู้ร่วม</b> (เช่น คู่สมรส บุตร) ก่อนยื่น — ผู้กู้ร่วมอายุน้อยช่วยยืดระยะกู้ ทำให้วงเงินสูงขึ้นและค่างวดเบาลงได้จริง</div>';
    }
    if (d.bnpl > 0) {
      html += '<div class="dsr-callout">📌 ยอด BNPL ของคุณถูกนับรวมในการประเมินแล้ว — ตอนยื่นจริงธนาคารเห็นรายการนี้จาก statement เสมอ การเคลียร์ BNPL ก่อนยื่นช่วยให้ DSR ดีขึ้นทันที</div>';
    }

    var lineMsg = 'สวัสดีครับ ต้องการปรึกษาเรื่อง: ' + d.goal
      + '\nชื่อ: ' + (d.name || '-')
      + '\nเบอร์โทร: ' + d.phone
      + '\nสะดวกให้ติดต่อกลับ: ' + d.callTime
      + (PROJECT ? '\nโครงการที่สนใจ: ' + PROJECT : '')
      + '\nผลประเมินเบื้องต้น: ' + m.badge + (r.dsr < 999 && r.tier !== 4 ? ' (DSR ~' + r.dsr.toFixed(0) + '%)' : '')
      + '\n(ส่งจากฟอร์ม DSR บนเว็บ ninethanakarn.com) ' + NTK_SRC.token;
    html += '<a class="dsr-line-btn" href="https://line.me/R/oaMessage/%40ninethanakarn/?' + encodeURIComponent(lineMsg) + '" data-no-ref target="_blank" rel="noopener">'
      + '<svg viewBox="0 0 24 24" fill="currentColor" style="width:22px;height:22px;"><path d="M12 2C6.48 2 2 5.58 2 10c0 2.85 1.85 5.35 4.62 6.78-.13.44-.78 2.66-.85 2.95 0 0-.02.13.07.18.09.05.2.01.2.01.27-.04 3.16-2.06 3.66-2.42.75.11 1.51.16 2.3.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>'
      + (r.tier === 1 ? 'ให้ทีมตรวจละเอียดฟรี ทาง LINE' : r.tier === 3 ? 'ปรึกษาแผนปิดหนี้ฟรี ทาง LINE' : 'คุยกับทีมฟรี ทาง LINE') + '</a>';
    html += '<p style="text-align:center;font-size:.85rem;color:#a8a29e;margin:10px 0 0;">หรือโทรเลย <a href="tel:023340940" style="color:#1e40af;font-weight:600;">02-334-0940</a> (จ–ส 9:00–17:00)</p>';
    html += '<p class="dsr-disclaimer">ตัวเลขทั้งหมดเป็น<b>ประมาณการเบื้องต้น</b>จากข้อมูลที่คุณกรอกเอง คำนวณแบบระมัดระวัง (ดอกเบี้ยประเมิน 6.5% ต่อปี) ผลอนุมัติจริงขึ้นอยู่กับ<b>ดุลยพินิจและเงื่อนไขของแต่ละธนาคาร</b> · อัตราดอกเบี้ยอ้างอิงตลาด ณ ส.ค. 2569</p>';
    html += '<button type="button" class="dsr-again">← แก้ข้อมูล / คำนวณใหม่</button>';

    var box = document.getElementById('dsrResult');
    box.innerHTML = html;
    box.style.display = 'block';
    box.querySelector('.dsr-again').addEventListener('click', function () {
      box.style.display = 'none';
      document.getElementById('dsrFormCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  var form = document.getElementById('dsrForm');

  // พารามิเตอร์ event: page เสมอ + project เฉพาะเมื่อมีค่า (/dsr/ /debt/ ได้ event รูปแบบเดิม)
  function evp(extra) {
    var o = {};
    for (var k in extra) o[k] = extra[k];   // ลำดับเดิม: {topic|tier, page} — คงไว้ให้ /dsr/ /debt/ เหมือนเดิมทุกตัว
    o.page = PAGE;
    if (PROJECT) o.project = PROJECT;
    return o;
  }

  // วัดอัตรากรอก (MKT03 เทียบ /dsr/ vs /debt/ 14 วัน): ยิงครั้งเดียวเมื่อแตะช่องแรก
  var started = false;
  form.addEventListener('focusin', function () {
    if (started) return;
    started = true;
    if (typeof gtag === 'function') gtag('event', 'dsr_form_start', evp({}));
  });

  /* ---------- หน้าแบรนด์: ปุ่มการ์ด + แถบล่างมือถือ ---------- */
  // ล้างชื่อโครงการด้วยกฎเดียวกับ worker BOT01 (ไทย/อังกฤษ/ตัวเลข/ช่องว่าง/- . ( ) & ' / + · ≤80)
  // ให้หัวข้อ · event GA · ชีต 21 ได้ชื่อเดียวกัน (เช่น การ์ด "KAVE (เคฟ) ⭐" → "KAVE (เคฟ)")
  function cleanProject(s) {
    return String(s || '').replace(/[^฀-๿A-Za-z0-9 \-.()&'\/+]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  function goToForm(project, source) {
    if (project) {
      PROJECT = cleanProject(project);
      var t = document.getElementById('dsrTitle');
      if (t) t.textContent = 'สนใจ ' + PROJECT + '? เช็คก่อนว่ากู้' + UNIT + 'ผ่านไหม ใน 2 นาที';
    }
    if (typeof gtag === 'function') gtag('event', 'dsr_cta_click', evp({ source: source }));
    // ไม่ auto-focus ช่องแรก — บนมือถือจะเด้งคีย์บอร์ดทับหัวข้อ
    // คำนวณตำแหน่งเอง (เผื่อ header ติดบนจอ) — smooth scrollIntoView บางเบราว์เซอร์ไม่เคารพ scroll-margin
    var card = document.getElementById('dsrFormCard');
    window.scrollTo({ top: card.getBoundingClientRect().top + window.pageYOffset - 72, behavior: 'smooth' });
  }

  if (USE_CARDS) {
    var cards = document.querySelectorAll('.property-card');
    for (var ci = 0; ci < cards.length; ci++) {
      var foot = cards[ci].querySelector('.card-footer');
      var tEl = cards[ci].querySelector('.card-title');
      if (!foot || !tEl || foot.querySelector('.dsr-card-btn')) continue;
      var name = cleanProject(tEl.textContent);
      var btn = document.createElement('a');
      btn.href = '#dsr-mount';
      btn.className = 'dsr-card-btn';
      btn.setAttribute('data-dsr-project', name);
      btn.textContent = 'เช็คว่ากู้' + UNIT + 'ผ่านไหม';
      foot.insertBefore(btn, foot.firstChild);
    }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('.dsr-card-btn') : null;
      if (!a) return;
      e.preventDefault();
      goToForm(a.getAttribute('data-dsr-project'), 'card');
    });
  }

  if (USE_STICKY) {
    var bar = document.createElement('div');
    bar.className = 'dsr-bar';
    bar.innerHTML = '<a href="#dsr-mount">✓ เช็คโอกาสกู้ 2 นาที</a>';
    document.body.appendChild(bar);
    bar.querySelector('a').addEventListener('click', function (e) { e.preventDefault(); goToForm('', 'bar'); });
    // โชว์เฉพาะตอนฟอร์มยังอยู่ใต้จอ · ถึงฟอร์มหรือเลยลงไปแล้ว (footer) = ซ่อน ไม่บังเนื้อหา
    var syncBar = function () {
      var show = mount.getBoundingClientRect().top > window.innerHeight - 40;
      bar.classList.toggle('on', show);
      document.body.classList.toggle('dsr-bar-on', show);
    };
    // throttle ด้วยเวลา + เรียกท้ายอีกครั้งหลังหยุดเลื่อน (ไม่พึ่ง requestAnimationFrame — บาง in-app browser หน่วงเฟรม)
    var lastRun = 0, trail = null;
    window.addEventListener('scroll', function () {
      var now = Date.now();
      if (now - lastRun > 100) { lastRun = now; syncBar(); }
      clearTimeout(trail); trail = setTimeout(syncBar, 120);
    }, { passive: true });
    window.addEventListener('resize', syncBar);
    syncBar();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;
    var d = {
      age: parseInt(f.age.value, 10),
      income: parseFloat(f.income.value) || 0,
      jobType: f.jobType.value,
      province: f.province.value,
      debt: parseFloat(f.debt.value) || 0,
      bnpl: parseFloat(f.bnpl.value) || 0,
      defaults: f.defaults.value,
      goal: f.goal.value,
      name: f.name.value.trim(),
      phone: f.phone.value.replace(/\D/g, ''),
      callTime: f.callTime.value
    };
    var r = assessDsr(d);
    var badge = TIER_META[r.tier].badge;

    if (typeof gtag === 'function') {
      gtag('event', 'submit_lead', evp({ topic: d.goal }));
      gtag('event', 'dsr_result', evp({ tier: badge }));
    }
    if (typeof fbq === 'function') { fbq('track', 'Lead', { content_category: d.goal }); }

    // ส่ง lead เข้าระบบ (ไม่บล็อกการแสดงผล — ล้มเหลวเงียบ ลูกค้ายังไปต่อทาง LINE ได้)
    var payload = {
      name: d.name, phone: d.phone, goal: d.goal, tier: badge,
      age: d.age, jobType: d.jobType, income: d.income, debt: d.debt, bnpl: d.bnpl,
      dsr: r.dsr >= 999 ? '-' : r.dsr.toFixed(0), province: d.province, defaults: d.defaults,
      gclid: NTK_SRC.gclid, utm_source: NTK_SRC.utm_source, utm_campaign: NTK_SRC.utm_campaign,
      page: PAGE,
      callTime: d.callTime,
      website: f.website.value
    };
    if (PROJECT) payload.project = PROJECT;   // worker BOT01 ba5732ae: ท่อน "โครงการ:" ใน รหัสคลิกโฆษณา + Note + KV
    try {
      fetch('https://ninethanakarn-line-bot.touch-nachonkamol.workers.dev/dsr-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: JSON.stringify(payload)
      }).catch(function () {});
    } catch (err) {}

    renderResult(d, r);
  });
})();
