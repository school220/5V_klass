/**
 * МАТЕМАТИКА 5 КЛАСС — Единая обучающая платформа
 * Поддержка мобильных устройств, ПК и интерактивных смарт-досок
 */

// ==========================================================================
// 1. ФОРМАТИРОВАНИЕ МАТЕМАТИЧЕСКИХ ВЫРАЖЕНИЙ (Школьный стандарт РФ)
// Деление через двоеточие « : », дроби с горизонтальной чертой
// ==========================================================================
function formatMathHtml(str) {
  if (str === null || str === undefined) return "";
  let s = String(str);

  // 1. Умножение: * -> ×
  s = s.replace(/\s*\*\s*/g, ' × ');

  // 2. Деление: знак ÷ или слэш между пробелами " / " -> " : "
  s = s.replace(/÷/g, ' : ');
  s = s.replace(/\s+\/\s+/g, ' : ');

  // 3. Минус: обычный дефис между пробелами -> математический минус −
  s = s.replace(/(?<=\s)-(?=\s)/g, '−');
  s = s.replace(/^-(\d)/g, '−$1');

  // 4. Смешанные дроби: "1 2/3" -> целое число + дробь с горизонтальной чертой
  s = s.replace(/(\d+)\s+(\d+)\/(\d+)/g, '<span class="mixed-frac"><span class="whole">$1</span><span class="frac"><span class="num">$2</span><span class="den">$3</span></span></span>');

  // 5. Обыкновенные дроби: "1/7" -> числитель над знаменателем с горизонтальной чертой
  s = s.replace(/(\d+)\/(\d+)/g, '<span class="frac"><span class="num">$1</span><span class="den">$2</span></span>');

  // 6. Красивые отступы вокруг двоеточия (знака деления)
  s = s.replace(/(\S)\s*:\s*(\S)/g, '$1 : $2');

  return s;
}

// ==========================================================================
// 2. АУДИОСИНТЕЗАТОР (Web Audio API — без внешних файлов)
// ==========================================================================
class SoundFX {
  constructor() {
    this.enabled = localStorage.getItem('math5_sound') !== 'false';
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('math5_sound', this.enabled);
    return this.enabled;
  }

  playTone(freq, duration, type = 'sine', gainVal = 0.15) {
    if (!this.enabled) return;
    try {
      this.init();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio not supported or blocked", e);
    }
  }

  correct() {
    if (!this.enabled) return;
    this.playTone(523.25, 0.1, 'sine', 0.18);
    setTimeout(() => this.playTone(659.25, 0.15, 'sine', 0.18), 100);
    setTimeout(() => this.playTone(783.99, 0.25, 'triangle', 0.22), 200);
  }

  wrong() {
    if (!this.enabled) return;
    this.playTone(220, 0.15, 'sawtooth', 0.12);
    setTimeout(() => this.playTone(196, 0.25, 'sawtooth', 0.1), 120);
  }

  victory() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.3, 'triangle', 0.2), i * 150);
    });
  }
}

const sfx = new SoundFX();

// ==========================================================================
// 3. ВСТРОЕННАЯ БАЗА ТЕМ (Fallback для offline и file://)
// ==========================================================================
const BUILTIN_TOPICS = [
  {
    "id": "division-10-100-1000",
    "title": "Деление чисел на 10, 100, 1000",
    "icon": "🔟",
    "grade": "5 класс",
    "description": "Правило отбрасывания нулей при делении на 10, 100, 1000",
    "ruleTip": "📌 Правило: Чтобы разделить натуральное число с нулями на конце на 10, 100, 1000, нужно отбросить справа столько нулей, сколько их в делителе (на 10 — один ноль, на 100 — два ноля, на 1000 — три ноля)!",
    "quiz": [
      {
        "id": 1,
        "exp": "320 : 10",
        "correct": 32,
        "options": [
          3,
          32,
          42,
          320
        ]
      },
      {
        "id": 2,
        "exp": "3400 : 100",
        "correct": 34,
        "options": [
          34,
          3,
          44,
          340
        ]
      },
      {
        "id": 3,
        "exp": "46000 : 1000",
        "correct": 46,
        "options": [
          46,
          460,
          56,
          4
        ]
      },
      {
        "id": 4,
        "exp": "530 : 10",
        "correct": 53,
        "options": [
          53,
          530,
          63,
          5
        ]
      },
      {
        "id": 5,
        "exp": "6700 : 100",
        "correct": 67,
        "options": [
          670,
          6,
          77,
          67
        ]
      },
      {
        "id": 6,
        "exp": "85000 : 1000",
        "correct": 85,
        "options": [
          8,
          95,
          850,
          85
        ]
      },
      {
        "id": 7,
        "exp": "740 : 10",
        "correct": 74,
        "options": [
          740,
          84,
          74,
          7
        ]
      },
      {
        "id": 8,
        "exp": "10000 : 100",
        "correct": 100,
        "options": [
          100,
          110,
          1000,
          10
        ]
      },
      {
        "id": 9,
        "exp": "124000 : 1000",
        "correct": 124,
        "options": [
          1240,
          12,
          134,
          124
        ]
      },
      {
        "id": 10,
        "exp": "950 : 10",
        "correct": 95,
        "options": [
          950,
          105,
          95,
          9
        ]
      },
      {
        "id": 11,
        "exp": "13300 : 100",
        "correct": 133,
        "options": [
          133,
          13,
          1330,
          143
        ]
      },
      {
        "id": 12,
        "exp": "163000 : 1000",
        "correct": 163,
        "options": [
          1630,
          16,
          173,
          163
        ]
      },
      {
        "id": 13,
        "exp": "1160 : 10",
        "correct": 116,
        "options": [
          1160,
          126,
          11,
          116
        ]
      },
      {
        "id": 14,
        "exp": "16600 : 100",
        "correct": 166,
        "options": [
          166,
          1660,
          16,
          176
        ]
      },
      {
        "id": 15,
        "exp": "202000 : 1000",
        "correct": 202,
        "options": [
          202,
          2020,
          20,
          212
        ]
      },
      {
        "id": 16,
        "exp": "1370 : 10",
        "correct": 137,
        "options": [
          13,
          1370,
          137,
          147
        ]
      },
      {
        "id": 17,
        "exp": "19900 : 100",
        "correct": 199,
        "options": [
          19,
          199,
          1990,
          209
        ]
      },
      {
        "id": 18,
        "exp": "241000 : 1000",
        "correct": 241,
        "options": [
          2410,
          251,
          241,
          24
        ]
      },
      {
        "id": 19,
        "exp": "1580 : 10",
        "correct": 158,
        "options": [
          168,
          15,
          1580,
          158
        ]
      },
      {
        "id": 20,
        "exp": "23200 : 100",
        "correct": 232,
        "options": [
          2320,
          242,
          23,
          232
        ]
      },
      {
        "id": 21,
        "exp": "30000 : 1000",
        "correct": 30,
        "options": [
          30,
          300,
          3,
          40
        ]
      },
      {
        "id": 22,
        "exp": "1790 : 10",
        "correct": 179,
        "options": [
          179,
          1790,
          189,
          17
        ]
      },
      {
        "id": 23,
        "exp": "26500 : 100",
        "correct": 265,
        "options": [
          265,
          2650,
          275,
          26
        ]
      },
      {
        "id": 24,
        "exp": "69000 : 1000",
        "correct": 69,
        "options": [
          690,
          69,
          6,
          79
        ]
      },
      {
        "id": 25,
        "exp": "2000 : 10",
        "correct": 200,
        "options": [
          2000,
          200,
          20,
          210
        ]
      },
      {
        "id": 26,
        "exp": "29800 : 100",
        "correct": 298,
        "options": [
          308,
          29,
          2980,
          298
        ]
      },
      {
        "id": 27,
        "exp": "108000 : 1000",
        "correct": 108,
        "options": [
          118,
          10,
          1080,
          108
        ]
      },
      {
        "id": 28,
        "exp": "2210 : 10",
        "correct": 221,
        "options": [
          2210,
          221,
          22,
          231
        ]
      },
      {
        "id": 29,
        "exp": "33100 : 100",
        "correct": 331,
        "options": [
          331,
          3310,
          33,
          341
        ]
      },
      {
        "id": 30,
        "exp": "147000 : 1000",
        "correct": 147,
        "options": [
          14,
          1470,
          157,
          147
        ]
      },
      {
        "id": 31,
        "exp": "2420 : 10",
        "correct": 242,
        "options": [
          24,
          2420,
          242,
          252
        ]
      },
      {
        "id": 32,
        "exp": "1400 : 100",
        "correct": 14,
        "options": [
          1,
          140,
          24,
          14
        ]
      },
      {
        "id": 33,
        "exp": "186000 : 1000",
        "correct": 186,
        "options": [
          196,
          18,
          1860,
          186
        ]
      },
      {
        "id": 34,
        "exp": "2630 : 10",
        "correct": 263,
        "options": [
          273,
          263,
          2630,
          26
        ]
      },
      {
        "id": 35,
        "exp": "4700 : 100",
        "correct": 47,
        "options": [
          470,
          47,
          4,
          57
        ]
      },
      {
        "id": 36,
        "exp": "225000 : 1000",
        "correct": 225,
        "options": [
          235,
          225,
          2250,
          22
        ]
      },
      {
        "id": 37,
        "exp": "2840 : 10",
        "correct": 284,
        "options": [
          284,
          2840,
          294,
          28
        ]
      },
      {
        "id": 38,
        "exp": "8000 : 100",
        "correct": 80,
        "options": [
          80,
          800,
          8,
          90
        ]
      },
      {
        "id": 39,
        "exp": "14000 : 1000",
        "correct": 14,
        "options": [
          24,
          1,
          140,
          14
        ]
      },
      {
        "id": 40,
        "exp": "3050 : 10",
        "correct": 305,
        "options": [
          315,
          30,
          3050,
          305
        ]
      },
      {
        "id": 41,
        "exp": "11300 : 100",
        "correct": 113,
        "options": [
          113,
          1130,
          11,
          123
        ]
      },
      {
        "id": 42,
        "exp": "53000 : 1000",
        "correct": 53,
        "options": [
          530,
          53,
          5,
          63
        ]
      },
      {
        "id": 43,
        "exp": "3260 : 10",
        "correct": 326,
        "options": [
          3260,
          326,
          336,
          32
        ]
      },
      {
        "id": 44,
        "exp": "14600 : 100",
        "correct": 146,
        "options": [
          146,
          1460,
          14,
          156
        ]
      },
      {
        "id": 45,
        "exp": "92000 : 1000",
        "correct": 92,
        "options": [
          102,
          9,
          920,
          92
        ]
      },
      {
        "id": 46,
        "exp": "3470 : 10",
        "correct": 347,
        "options": [
          357,
          3470,
          347,
          34
        ]
      },
      {
        "id": 47,
        "exp": "17900 : 100",
        "correct": 179,
        "options": [
          179,
          1790,
          17,
          189
        ]
      },
      {
        "id": 48,
        "exp": "131000 : 1000",
        "correct": 131,
        "options": [
          131,
          1310,
          13,
          141
        ]
      },
      {
        "id": 49,
        "exp": "3680 : 10",
        "correct": 368,
        "options": [
          36,
          3680,
          378,
          368
        ]
      },
      {
        "id": 50,
        "exp": "21200 : 100",
        "correct": 212,
        "options": [
          212,
          21,
          2120,
          222
        ]
      },
      {
        "id": 51,
        "exp": "170000 : 1000",
        "correct": 170,
        "options": [
          1700,
          170,
          180,
          17
        ]
      },
      {
        "id": 52,
        "exp": "3890 : 10",
        "correct": 389,
        "options": [
          38,
          399,
          3890,
          389
        ]
      },
      {
        "id": 53,
        "exp": "24500 : 100",
        "correct": 245,
        "options": [
          24,
          2450,
          245,
          255
        ]
      },
      {
        "id": 54,
        "exp": "209000 : 1000",
        "correct": 209,
        "options": [
          20,
          2090,
          209,
          219
        ]
      },
      {
        "id": 55,
        "exp": "4100 : 10",
        "correct": 410,
        "options": [
          410,
          4100,
          41,
          420
        ]
      },
      {
        "id": 56,
        "exp": "27800 : 100",
        "correct": 278,
        "options": [
          288,
          27,
          2780,
          278
        ]
      },
      {
        "id": 57,
        "exp": "248000 : 1000",
        "correct": 248,
        "options": [
          24,
          2480,
          248,
          258
        ]
      },
      {
        "id": 58,
        "exp": "4310 : 10",
        "correct": 431,
        "options": [
          43,
          4310,
          431,
          441
        ]
      },
      {
        "id": 59,
        "exp": "31100 : 100",
        "correct": 311,
        "options": [
          31,
          311,
          321,
          3110
        ]
      },
      {
        "id": 60,
        "exp": "37000 : 1000",
        "correct": 37,
        "options": [
          370,
          47,
          37,
          3
        ]
      },
      {
        "id": 61,
        "exp": "4520 : 10",
        "correct": 452,
        "options": [
          452,
          4520,
          462,
          45
        ]
      },
      {
        "id": 62,
        "exp": "34400 : 100",
        "correct": 344,
        "options": [
          344,
          354,
          3440,
          34
        ]
      },
      {
        "id": 63,
        "exp": "76000 : 1000",
        "correct": 76,
        "options": [
          76,
          86,
          760,
          7
        ]
      },
      {
        "id": 64,
        "exp": "230 : 10",
        "correct": 23,
        "options": [
          230,
          33,
          23,
          2
        ]
      },
      {
        "id": 65,
        "exp": "2700 : 100",
        "correct": 27,
        "options": [
          27,
          270,
          2,
          37
        ]
      },
      {
        "id": 66,
        "exp": "115000 : 1000",
        "correct": 115,
        "options": [
          125,
          1150,
          115,
          11
        ]
      },
      {
        "id": 67,
        "exp": "440 : 10",
        "correct": 44,
        "options": [
          54,
          440,
          4,
          44
        ]
      },
      {
        "id": 68,
        "exp": "6000 : 100",
        "correct": 60,
        "options": [
          600,
          6,
          70,
          60
        ]
      },
      {
        "id": 69,
        "exp": "154000 : 1000",
        "correct": 154,
        "options": [
          15,
          1540,
          164,
          154
        ]
      },
      {
        "id": 70,
        "exp": "650 : 10",
        "correct": 65,
        "options": [
          65,
          650,
          6,
          75
        ]
      },
      {
        "id": 71,
        "exp": "9300 : 100",
        "correct": 93,
        "options": [
          930,
          93,
          103,
          9
        ]
      },
      {
        "id": 72,
        "exp": "193000 : 1000",
        "correct": 193,
        "options": [
          203,
          19,
          193,
          1930
        ]
      },
      {
        "id": 73,
        "exp": "860 : 10",
        "correct": 86,
        "options": [
          860,
          86,
          96,
          8
        ]
      },
      {
        "id": 74,
        "exp": "12600 : 100",
        "correct": 126,
        "options": [
          136,
          12,
          1260,
          126
        ]
      },
      {
        "id": 75,
        "exp": "232000 : 1000",
        "correct": 232,
        "options": [
          232,
          2320,
          23,
          242
        ]
      },
      {
        "id": 76,
        "exp": "1070 : 10",
        "correct": 107,
        "options": [
          117,
          107,
          10,
          1070
        ]
      },
      {
        "id": 77,
        "exp": "15900 : 100",
        "correct": 159,
        "options": [
          159,
          169,
          1590,
          15
        ]
      },
      {
        "id": 78,
        "exp": "21000 : 1000",
        "correct": 21,
        "options": [
          21,
          2,
          210,
          31
        ]
      },
      {
        "id": 79,
        "exp": "1280 : 10",
        "correct": 128,
        "options": [
          138,
          12,
          1280,
          128
        ]
      },
      {
        "id": 80,
        "exp": "19200 : 100",
        "correct": 192,
        "options": [
          192,
          202,
          1920,
          19
        ]
      },
      {
        "id": 81,
        "exp": "60000 : 1000",
        "correct": 60,
        "options": [
          6,
          70,
          60,
          600
        ]
      },
      {
        "id": 82,
        "exp": "1490 : 10",
        "correct": 149,
        "options": [
          159,
          149,
          14,
          1490
        ]
      },
      {
        "id": 83,
        "exp": "22500 : 100",
        "correct": 225,
        "options": [
          22,
          2250,
          235,
          225
        ]
      },
      {
        "id": 84,
        "exp": "99000 : 1000",
        "correct": 99,
        "options": [
          99,
          990,
          9,
          109
        ]
      },
      {
        "id": 85,
        "exp": "1700 : 10",
        "correct": 170,
        "options": [
          180,
          17,
          1700,
          170
        ]
      },
      {
        "id": 86,
        "exp": "25800 : 100",
        "correct": 258,
        "options": [
          258,
          268,
          2580,
          25
        ]
      },
      {
        "id": 87,
        "exp": "138000 : 1000",
        "correct": 138,
        "options": [
          148,
          138,
          1380,
          13
        ]
      },
      {
        "id": 88,
        "exp": "1910 : 10",
        "correct": 191,
        "options": [
          1910,
          201,
          191,
          19
        ]
      },
      {
        "id": 89,
        "exp": "29100 : 100",
        "correct": 291,
        "options": [
          291,
          2910,
          29,
          301
        ]
      },
      {
        "id": 90,
        "exp": "177000 : 1000",
        "correct": 177,
        "options": [
          187,
          17,
          1770,
          177
        ]
      },
      {
        "id": 91,
        "exp": "2120 : 10",
        "correct": 212,
        "options": [
          212,
          2120,
          222,
          21
        ]
      },
      {
        "id": 92,
        "exp": "32400 : 100",
        "correct": 324,
        "options": [
          32,
          334,
          324,
          3240
        ]
      },
      {
        "id": 93,
        "exp": "216000 : 1000",
        "correct": 216,
        "options": [
          226,
          21,
          2160,
          216
        ]
      },
      {
        "id": 94,
        "exp": "2330 : 10",
        "correct": 233,
        "options": [
          23,
          233,
          2330,
          243
        ]
      },
      {
        "id": 95,
        "exp": "700 : 100",
        "correct": 7,
        "options": [
          17,
          70,
          700,
          7
        ]
      },
      {
        "id": 96,
        "exp": "5000 : 1000",
        "correct": 5,
        "options": [
          5,
          50,
          500,
          15
        ]
      },
      {
        "id": 97,
        "exp": "2540 : 10",
        "correct": 254,
        "options": [
          25,
          264,
          2540,
          254
        ]
      },
      {
        "id": 98,
        "exp": "4000 : 100",
        "correct": 40,
        "options": [
          50,
          400,
          4,
          40
        ]
      },
      {
        "id": 99,
        "exp": "44000 : 1000",
        "correct": 44,
        "options": [
          44,
          54,
          440,
          4
        ]
      },
      {
        "id": 100,
        "exp": "2750 : 10",
        "correct": 275,
        "options": [
          285,
          2750,
          27,
          275
        ]
      }
    ],
    "classwork": [
      {
        "exp": "340 : 10",
        "ans": 34
      },
      {
        "exp": "700 : 100",
        "ans": 7
      },
      {
        "exp": "5000 : 1000",
        "ans": 5
      },
      {
        "exp": "8200 : 10",
        "ans": 820
      },
      {
        "exp": "9600 : 100",
        "ans": 96
      },
      {
        "exp": "14000 : 1000",
        "ans": 14
      },
      {
        "exp": "2050 : 10",
        "ans": 205
      },
      {
        "exp": "43000 : 100",
        "ans": 430
      },
      {
        "exp": "68000 : 1000",
        "ans": 68
      },
      {
        "exp": "500 : 10",
        "ans": 50
      },
      {
        "exp": "1200 : 100",
        "ans": 12
      },
      {
        "exp": "30000 : 1000",
        "ans": 30
      },
      {
        "exp": "7900 : 10",
        "ans": 790
      },
      {
        "exp": "85000 : 100",
        "ans": 850
      },
      {
        "exp": "125000 : 1000",
        "ans": 125
      },
      {
        "exp": "400 : 10",
        "ans": 40
      },
      {
        "exp": "2700 : 100",
        "ans": 27
      },
      {
        "exp": "90000 : 1000",
        "ans": 90
      },
      {
        "exp": "6100 : 10",
        "ans": 610
      },
      {
        "exp": "31400 : 100",
        "ans": 314
      },
      {
        "exp": "400000 : 1000",
        "ans": 400
      },
      {
        "exp": "180 : 10",
        "ans": 18
      },
      {
        "exp": "59000 : 100",
        "ans": 590
      },
      {
        "exp": "750000 : 1000",
        "ans": 750
      },
      {
        "exp": "10000 : 1000",
        "ans": 10
      }
    ],
    "homework": [
      {
        "exp": "560 : 10",
        "ans": 56
      },
      {
        "exp": "900 : 100",
        "ans": 9
      },
      {
        "exp": "8000 : 1000",
        "ans": 8
      },
      {
        "exp": "4700 : 10",
        "ans": 470
      },
      {
        "exp": "8300 : 100",
        "ans": 83
      },
      {
        "exp": "26000 : 1000",
        "ans": 26
      },
      {
        "exp": "1900 : 10",
        "ans": 190
      },
      {
        "exp": "65000 : 100",
        "ans": 650
      },
      {
        "exp": "92000 : 1000",
        "ans": 92
      },
      {
        "exp": "700 : 10",
        "ans": 70
      },
      {
        "exp": "3400 : 100",
        "ans": 34
      },
      {
        "exp": "50000 : 1000",
        "ans": 50
      },
      {
        "exp": "9100 : 10",
        "ans": 910
      },
      {
        "exp": "74000 : 100",
        "ans": 740
      },
      {
        "exp": "215000 : 1000",
        "ans": 215
      },
      {
        "exp": "600 : 10",
        "ans": 60
      },
      {
        "exp": "4800 : 100",
        "ans": 48
      },
      {
        "exp": "80000 : 1000",
        "ans": 80
      },
      {
        "exp": "3900 : 10",
        "ans": 390
      },
      {
        "exp": "42500 : 100",
        "ans": 425
      },
      {
        "exp": "600000 : 1000",
        "ans": 600
      },
      {
        "exp": "250 : 10",
        "ans": 25
      },
      {
        "exp": "81000 : 100",
        "ans": 810
      },
      {
        "exp": "950000 : 1000",
        "ans": 950
      },
      {
        "exp": "100000 : 1000",
        "ans": 100
      }
    ]
  },
  {
    "id": "order-of-operations",
    "title": "Выполнение действий в выражениях без скобок",
    "icon": "➗",
    "grade": "5 класс",
    "description": "Сначала умножение и деление (слева направо), затем сложение и вычитание!",
    "ruleTip": "📌 Правило: 1) Сначала выполни умножение (×) и деление (:) по порядку слева направо; 2) Затем выполни сложение (+) и вычитание (−) по порядку слева направо.",
    "quiz": [
      {
        "id": 1,
        "exp": "18 + 4 × 5",
        "correct": 38,
        "options": [
          110,
          38,
          36,
          33
        ]
      },
      {
        "id": 2,
        "exp": "34 − 5 × 4",
        "correct": 14,
        "options": [
          9,
          16,
          14,
          116
        ]
      },
      {
        "id": 3,
        "exp": "30 + 12 : 6",
        "correct": 32,
        "options": [
          32,
          7,
          30,
          37
        ]
      },
      {
        "id": 4,
        "exp": "28 − 14 : 7",
        "correct": 26,
        "options": [
          28,
          21,
          26,
          2
        ]
      },
      {
        "id": 5,
        "exp": "3 × 3 + 3 × 2",
        "correct": 15,
        "options": [
          24,
          15,
          10,
          13
        ]
      },
      {
        "id": 6,
        "exp": "8 × 5 − 2 × 2",
        "correct": 36,
        "options": [
          41,
          38,
          76,
          36
        ]
      },
      {
        "id": 7,
        "exp": "20 : 5 × 3",
        "correct": 12,
        "options": [
          7,
          12,
          10,
          1
        ]
      },
      {
        "id": 8,
        "exp": "22 + 6 × 4 − 14",
        "correct": 32,
        "options": [
          32,
          98,
          27,
          34
        ]
      },
      {
        "id": 9,
        "exp": "42 + 6 × 3",
        "correct": 60,
        "options": [
          58,
          65,
          60,
          144
        ]
      },
      {
        "id": 10,
        "exp": "39 − 3 × 3",
        "correct": 30,
        "options": [
          25,
          30,
          32,
          108
        ]
      },
      {
        "id": 11,
        "exp": "20 + 48 : 8",
        "correct": 26,
        "options": [
          24,
          21,
          8,
          26
        ]
      },
      {
        "id": 12,
        "exp": "20 − 10 : 5",
        "correct": 18,
        "options": [
          23,
          2,
          18,
          20
        ]
      },
      {
        "id": 13,
        "exp": "6 × 4 + 7 × 4",
        "correct": 52,
        "options": [
          52,
          47,
          50,
          124
        ]
      },
      {
        "id": 14,
        "exp": "8 × 5 − 2 × 4",
        "correct": 32,
        "options": [
          152,
          27,
          32,
          34
        ]
      },
      {
        "id": 15,
        "exp": "6 : 3 × 2",
        "correct": 4,
        "options": [
          1,
          9,
          4,
          2
        ]
      },
      {
        "id": 16,
        "exp": "29 + 4 × 5 − 8",
        "correct": 41,
        "options": [
          36,
          43,
          157,
          41
        ]
      },
      {
        "id": 17,
        "exp": "26 + 8 × 7",
        "correct": 82,
        "options": [
          82,
          80,
          77,
          238
        ]
      },
      {
        "id": 18,
        "exp": "53 − 6 × 7",
        "correct": 11,
        "options": [
          16,
          13,
          329,
          11
        ]
      },
      {
        "id": 19,
        "exp": "60 + 16 : 4",
        "correct": 64,
        "options": [
          59,
          62,
          19,
          64
        ]
      },
      {
        "id": 20,
        "exp": "12 − 6 : 3",
        "correct": 10,
        "options": [
          2,
          10,
          5,
          12
        ]
      },
      {
        "id": 21,
        "exp": "4 × 5 + 6 × 6",
        "correct": 56,
        "options": [
          56,
          156,
          54,
          61
        ]
      },
      {
        "id": 22,
        "exp": "8 × 5 − 2 × 3",
        "correct": 34,
        "options": [
          114,
          34,
          29,
          36
        ]
      },
      {
        "id": 23,
        "exp": "36 : 6 × 6",
        "correct": 36,
        "options": [
          1,
          34,
          36,
          31
        ]
      },
      {
        "id": 24,
        "exp": "36 + 7 × 6 − 17",
        "correct": 61,
        "options": [
          61,
          241,
          66,
          63
        ]
      },
      {
        "id": 25,
        "exp": "50 + 4 × 5",
        "correct": 70,
        "options": [
          65,
          70,
          270,
          68
        ]
      },
      {
        "id": 26,
        "exp": "51 − 4 × 6",
        "correct": 27,
        "options": [
          282,
          22,
          29,
          27
        ]
      },
      {
        "id": 27,
        "exp": "50 + 12 : 6",
        "correct": 52,
        "options": [
          52,
          50,
          10,
          57
        ]
      },
      {
        "id": 28,
        "exp": "44 − 12 : 6",
        "correct": 42,
        "options": [
          42,
          5,
          44,
          37
        ]
      },
      {
        "id": 29,
        "exp": "7 × 6 + 5 × 3",
        "correct": 57,
        "options": [
          57,
          141,
          55,
          52
        ]
      },
      {
        "id": 30,
        "exp": "8 × 5 − 2 × 2",
        "correct": 36,
        "options": [
          41,
          76,
          38,
          36
        ]
      },
      {
        "id": 31,
        "exp": "16 : 4 × 5",
        "correct": 20,
        "options": [
          15,
          20,
          25,
          18
        ]
      },
      {
        "id": 32,
        "exp": "18 + 5 × 7 − 11",
        "correct": 42,
        "options": [
          42,
          150,
          44,
          37
        ]
      },
      {
        "id": 33,
        "exp": "34 + 6 × 3",
        "correct": 52,
        "options": [
          52,
          120,
          50,
          57
        ]
      },
      {
        "id": 34,
        "exp": "78 − 7 × 5",
        "correct": 43,
        "options": [
          38,
          355,
          43,
          45
        ]
      },
      {
        "id": 35,
        "exp": "40 + 48 : 8",
        "correct": 46,
        "options": [
          44,
          46,
          41,
          11
        ]
      },
      {
        "id": 36,
        "exp": "36 − 8 : 4",
        "correct": 34,
        "options": [
          39,
          7,
          34,
          36
        ]
      },
      {
        "id": 37,
        "exp": "5 × 7 + 4 × 5",
        "correct": 55,
        "options": [
          53,
          50,
          195,
          55
        ]
      },
      {
        "id": 38,
        "exp": "8 × 5 − 2 × 4",
        "correct": 32,
        "options": [
          32,
          27,
          152,
          34
        ]
      },
      {
        "id": 39,
        "exp": "14 : 7 × 4",
        "correct": 8,
        "options": [
          12,
          8,
          13,
          6
        ]
      },
      {
        "id": 40,
        "exp": "25 + 3 × 3 − 5",
        "correct": 29,
        "options": [
          79,
          29,
          24,
          31
        ]
      },
      {
        "id": 41,
        "exp": "18 + 8 × 7",
        "correct": 74,
        "options": [
          72,
          182,
          74,
          69
        ]
      },
      {
        "id": 42,
        "exp": "44 − 5 × 4",
        "correct": 24,
        "options": [
          24,
          156,
          26,
          29
        ]
      },
      {
        "id": 43,
        "exp": "30 + 16 : 4",
        "correct": 34,
        "options": [
          29,
          32,
          11,
          34
        ]
      },
      {
        "id": 44,
        "exp": "28 − 14 : 7",
        "correct": 26,
        "options": [
          26,
          2,
          21,
          28
        ]
      },
      {
        "id": 45,
        "exp": "3 × 3 + 3 × 2",
        "correct": 15,
        "options": [
          24,
          20,
          13,
          15
        ]
      },
      {
        "id": 46,
        "exp": "8 × 5 − 2 × 3",
        "correct": 34,
        "options": [
          34,
          114,
          36,
          29
        ]
      },
      {
        "id": 47,
        "exp": "30 : 5 × 3",
        "correct": 18,
        "options": [
          13,
          16,
          2,
          18
        ]
      },
      {
        "id": 48,
        "exp": "32 + 6 × 4 − 14",
        "correct": 42,
        "options": [
          44,
          138,
          42,
          47
        ]
      },
      {
        "id": 49,
        "exp": "42 + 4 × 5",
        "correct": 62,
        "options": [
          62,
          230,
          60,
          57
        ]
      },
      {
        "id": 50,
        "exp": "49 − 3 × 3",
        "correct": 40,
        "options": [
          35,
          138,
          40,
          42
        ]
      },
      {
        "id": 51,
        "exp": "20 + 12 : 6",
        "correct": 22,
        "options": [
          22,
          5,
          27,
          20
        ]
      },
      {
        "id": 52,
        "exp": "20 − 10 : 5",
        "correct": 18,
        "options": [
          18,
          2,
          13,
          20
        ]
      },
      {
        "id": 53,
        "exp": "6 × 4 + 7 × 4",
        "correct": 52,
        "options": [
          52,
          124,
          50,
          47
        ]
      },
      {
        "id": 54,
        "exp": "8 × 5 − 2 × 2",
        "correct": 36,
        "options": [
          36,
          76,
          38,
          41
        ]
      },
      {
        "id": 55,
        "exp": "12 : 3 × 2",
        "correct": 8,
        "options": [
          3,
          6,
          2,
          8
        ]
      },
      {
        "id": 56,
        "exp": "39 + 4 × 5 − 8",
        "correct": 51,
        "options": [
          51,
          207,
          46,
          53
        ]
      },
      {
        "id": 57,
        "exp": "26 + 6 × 3",
        "correct": 44,
        "options": [
          49,
          42,
          96,
          44
        ]
      },
      {
        "id": 58,
        "exp": "63 − 6 × 7",
        "correct": 21,
        "options": [
          16,
          23,
          399,
          21
        ]
      },
      {
        "id": 59,
        "exp": "60 + 48 : 8",
        "correct": 66,
        "options": [
          66,
          61,
          13,
          64
        ]
      },
      {
        "id": 60,
        "exp": "12 − 6 : 3",
        "correct": 10,
        "options": [
          10,
          12,
          15,
          2
        ]
      },
      {
        "id": 61,
        "exp": "4 × 5 + 6 × 6",
        "correct": 56,
        "options": [
          51,
          156,
          56,
          54
        ]
      },
      {
        "id": 62,
        "exp": "8 × 5 − 2 × 4",
        "correct": 32,
        "options": [
          27,
          34,
          152,
          32
        ]
      },
      {
        "id": 63,
        "exp": "12 : 6 × 6",
        "correct": 12,
        "options": [
          12,
          17,
          16,
          10
        ]
      },
      {
        "id": 64,
        "exp": "21 + 7 × 6 − 17",
        "correct": 46,
        "options": [
          46,
          151,
          48,
          41
        ]
      },
      {
        "id": 65,
        "exp": "50 + 8 × 7",
        "correct": 106,
        "options": [
          106,
          406,
          104,
          101
        ]
      },
      {
        "id": 66,
        "exp": "61 − 4 × 6",
        "correct": 37,
        "options": [
          42,
          39,
          37,
          342
        ]
      },
      {
        "id": 67,
        "exp": "50 + 16 : 4",
        "correct": 54,
        "options": [
          52,
          16,
          54,
          49
        ]
      },
      {
        "id": 68,
        "exp": "44 − 12 : 6",
        "correct": 42,
        "options": [
          37,
          44,
          42,
          5
        ]
      },
      {
        "id": 69,
        "exp": "7 × 6 + 5 × 3",
        "correct": 57,
        "options": [
          57,
          62,
          55,
          141
        ]
      },
      {
        "id": 70,
        "exp": "8 × 5 − 2 × 3",
        "correct": 34,
        "options": [
          29,
          36,
          114,
          34
        ]
      },
      {
        "id": 71,
        "exp": "24 : 4 × 5",
        "correct": 30,
        "options": [
          1,
          28,
          25,
          30
        ]
      },
      {
        "id": 72,
        "exp": "28 + 5 × 7 − 11",
        "correct": 52,
        "options": [
          57,
          54,
          220,
          52
        ]
      },
      {
        "id": 73,
        "exp": "34 + 4 × 5",
        "correct": 54,
        "options": [
          49,
          52,
          190,
          54
        ]
      },
      {
        "id": 74,
        "exp": "53 − 7 × 5",
        "correct": 18,
        "options": [
          18,
          230,
          13,
          20
        ]
      },
      {
        "id": 75,
        "exp": "40 + 12 : 6",
        "correct": 42,
        "options": [
          47,
          42,
          8,
          40
        ]
      },
      {
        "id": 76,
        "exp": "36 − 8 : 4",
        "correct": 34,
        "options": [
          36,
          7,
          34,
          29
        ]
      },
      {
        "id": 77,
        "exp": "5 × 7 + 4 × 5",
        "correct": 55,
        "options": [
          50,
          195,
          55,
          53
        ]
      },
      {
        "id": 78,
        "exp": "8 × 5 − 2 × 2",
        "correct": 36,
        "options": [
          36,
          76,
          38,
          41
        ]
      },
      {
        "id": 79,
        "exp": "28 : 7 × 4",
        "correct": 16,
        "options": [
          14,
          1,
          11,
          16
        ]
      },
      {
        "id": 80,
        "exp": "35 + 3 × 3 − 5",
        "correct": 39,
        "options": [
          34,
          41,
          109,
          39
        ]
      },
      {
        "id": 81,
        "exp": "18 + 6 × 3",
        "correct": 36,
        "options": [
          72,
          34,
          41,
          36
        ]
      },
      {
        "id": 82,
        "exp": "54 − 5 × 4",
        "correct": 34,
        "options": [
          34,
          196,
          36,
          29
        ]
      },
      {
        "id": 83,
        "exp": "30 + 48 : 8",
        "correct": 36,
        "options": [
          34,
          9,
          36,
          31
        ]
      },
      {
        "id": 84,
        "exp": "28 − 14 : 7",
        "correct": 26,
        "options": [
          26,
          2,
          28,
          31
        ]
      },
      {
        "id": 85,
        "exp": "3 × 3 + 3 × 2",
        "correct": 15,
        "options": [
          24,
          15,
          13,
          10
        ]
      },
      {
        "id": 86,
        "exp": "8 × 5 − 2 × 4",
        "correct": 32,
        "options": [
          27,
          34,
          152,
          32
        ]
      },
      {
        "id": 87,
        "exp": "10 : 5 × 3",
        "correct": 6,
        "options": [
          10,
          4,
          11,
          6
        ]
      },
      {
        "id": 88,
        "exp": "17 + 6 × 4 − 14",
        "correct": 27,
        "options": [
          22,
          29,
          78,
          27
        ]
      },
      {
        "id": 89,
        "exp": "42 + 8 × 7",
        "correct": 98,
        "options": [
          93,
          98,
          350,
          96
        ]
      },
      {
        "id": 90,
        "exp": "24 − 3 × 3",
        "correct": 15,
        "options": [
          15,
          20,
          63,
          17
        ]
      },
      {
        "id": 91,
        "exp": "20 + 16 : 4",
        "correct": 24,
        "options": [
          19,
          24,
          9,
          22
        ]
      },
      {
        "id": 92,
        "exp": "20 − 10 : 5",
        "correct": 18,
        "options": [
          18,
          20,
          2,
          13
        ]
      },
      {
        "id": 93,
        "exp": "6 × 4 + 7 × 4",
        "correct": 52,
        "options": [
          52,
          57,
          124,
          50
        ]
      },
      {
        "id": 94,
        "exp": "8 × 5 − 2 × 3",
        "correct": 34,
        "options": [
          36,
          114,
          29,
          34
        ]
      },
      {
        "id": 95,
        "exp": "18 : 3 × 2",
        "correct": 12,
        "options": [
          3,
          12,
          7,
          10
        ]
      },
      {
        "id": 96,
        "exp": "24 + 4 × 5 − 8",
        "correct": 36,
        "options": [
          41,
          38,
          132,
          36
        ]
      },
      {
        "id": 97,
        "exp": "26 + 4 × 5",
        "correct": 46,
        "options": [
          41,
          44,
          150,
          46
        ]
      },
      {
        "id": 98,
        "exp": "73 − 6 × 7",
        "correct": 31,
        "options": [
          31,
          469,
          26,
          33
        ]
      },
      {
        "id": 99,
        "exp": "60 + 12 : 6",
        "correct": 62,
        "options": [
          62,
          60,
          12,
          67
        ]
      },
      {
        "id": 100,
        "exp": "12 − 6 : 3",
        "correct": 10,
        "options": [
          5,
          12,
          2,
          10
        ]
      }
    ],
    "classwork": [
      {
        "exp": "24 + 6 × 5",
        "ans": 54
      },
      {
        "exp": "80 − 45 : 9",
        "ans": 75
      },
      {
        "exp": "7 × 8 − 36",
        "ans": 20
      },
      {
        "exp": "64 : 8 + 42",
        "ans": 50
      },
      {
        "exp": "15 + 25 × 4",
        "ans": 115
      },
      {
        "exp": "90 − 72 : 8",
        "ans": 81
      },
      {
        "exp": "12 × 5 + 38",
        "ans": 98
      },
      {
        "exp": "100 − 16 × 4",
        "ans": 36
      },
      {
        "exp": "48 : 6 × 5",
        "ans": 40
      },
      {
        "exp": "30 + 14 × 3 − 22",
        "ans": 50
      },
      {
        "exp": "200 − 50 × 2 + 15",
        "ans": 115
      },
      {
        "exp": "81 : 9 + 49 : 7",
        "ans": 16
      },
      {
        "exp": "60 + 40 : 5 × 2",
        "ans": 76
      },
      {
        "exp": "9 × 9 − 8 × 8",
        "ans": 17
      },
      {
        "exp": "150 − 30 × 4",
        "ans": 30
      },
      {
        "exp": "56 : 7 + 12 × 3",
        "ans": 44
      },
      {
        "exp": "70 − 6 × 9 + 14",
        "ans": 30
      },
      {
        "exp": "45 : 5 × 4",
        "ans": 36
      },
      {
        "exp": "18 + 72 : 9 × 6",
        "ans": 66
      },
      {
        "exp": "35 × 2 − 48 : 4",
        "ans": 58
      },
      {
        "exp": "250 − 120 : 6",
        "ans": 230
      },
      {
        "exp": "6 × 7 + 8 × 4",
        "ans": 74
      },
      {
        "exp": "90 : 3 − 18 : 2",
        "ans": 21
      },
      {
        "exp": "100 − 8 × 7 + 25",
        "ans": 69
      },
      {
        "exp": "50 + 15 × 6 − 40",
        "ans": 100
      }
    ],
    "homework": [
      {
        "exp": "32 + 8 × 4",
        "ans": 64
      },
      {
        "exp": "70 − 54 : 6",
        "ans": 61
      },
      {
        "exp": "9 × 6 − 24",
        "ans": 30
      },
      {
        "exp": "49 : 7 + 53",
        "ans": 60
      },
      {
        "exp": "25 + 15 × 4",
        "ans": 85
      },
      {
        "exp": "100 − 63 : 7",
        "ans": 91
      },
      {
        "exp": "14 × 5 + 30",
        "ans": 100
      },
      {
        "exp": "120 − 18 × 4",
        "ans": 48
      },
      {
        "exp": "54 : 6 × 7",
        "ans": 63
      },
      {
        "exp": "40 + 16 × 3 − 38",
        "ans": 50
      },
      {
        "exp": "300 − 40 × 5 + 25",
        "ans": 125
      },
      {
        "exp": "72 : 8 + 64 : 8",
        "ans": 17
      },
      {
        "exp": "50 + 30 : 6 × 4",
        "ans": 70
      },
      {
        "exp": "8 × 7 − 6 × 6",
        "ans": 20
      },
      {
        "exp": "180 − 40 × 3",
        "ans": 60
      },
      {
        "exp": "63 : 9 + 15 × 3",
        "ans": 52
      },
      {
        "exp": "80 − 7 × 8 + 16",
        "ans": 40
      },
      {
        "exp": "36 : 4 × 5",
        "ans": 45
      },
      {
        "exp": "24 + 56 : 8 × 5",
        "ans": 59
      },
      {
        "exp": "45 × 2 − 60 : 5",
        "ans": 78
      },
      {
        "exp": "350 − 150 : 5",
        "ans": 320
      },
      {
        "exp": "7 × 9 + 6 × 5",
        "ans": 93
      },
      {
        "exp": "80 : 4 − 27 : 3",
        "ans": 11
      },
      {
        "exp": "120 − 9 × 8 + 32",
        "ans": 80
      },
      {
        "exp": "60 + 25 × 4 − 50",
        "ans": 110
      }
    ]
  }
];

// ==========================================================================
// 4. МЕНЕДЖЕР ТЕМ (Управление темами из GitHub и локальных файлов)
// ==========================================================================
class TopicManager {
  constructor() {
    this.topics = [...BUILTIN_TOPICS];
    this.currentTopic = null;
    this.loadCustomPreviewTopic();
  }

  async fetchGitHubTopics() {
    if (!window.location.protocol.startsWith('http')) return;
    try {
      const res = await fetch('topics/topics.json?t=' + Date.now());
      if (res.ok) {
        const indexList = await res.json();
        const loadedTopics = [];

        for (const item of indexList) {
          try {
            const topicRes = await fetch(item.file + '?t=' + Date.now());
            if (topicRes.ok) {
              const topicData = await topicRes.json();
              loadedTopics.push(topicData);
            }
          } catch (e) {
            console.warn("Could not fetch topic file:", item.file, e);
          }
        }

        if (loadedTopics.length > 0) {
          const preview = this.getCustomPreviewTopic();
          this.topics = preview ? [...loadedTopics, preview] : loadedTopics;
          renderCatalog();
        }
      }
    } catch (e) {
      console.log("Local/offline mode, using built-in topics catalog", e);
    }
  }

  getCustomPreviewTopic() {
    try {
      const stored = localStorage.getItem('math5_teacher_preview');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return null;
  }

  loadCustomPreviewTopic() {
    const preview = this.getCustomPreviewTopic();
    if (preview) {
      const idx = this.topics.findIndex(t => t.id === preview.id);
      if (idx >= 0) this.topics[idx] = preview;
      else this.topics.push(preview);
    }
  }

  setPreviewTopic(topic) {
    if (!topic.title) throw new Error("У темы должно быть название!");
    if (!topic.id) topic.id = 'topic_' + Date.now();
    if (!topic.icon) topic.icon = '🧪';
    topic.isPreview = true;

    localStorage.setItem('math5_teacher_preview', JSON.stringify(topic));
    this.loadCustomPreviewTopic();
    renderCatalog();
    openLesson(topic.id);
  }

  getTopic(id) {
    return this.topics.find(t => t.id === id) || this.topics[0];
  }
}

const topicMgr = new TopicManager();

// ==========================================================================
// 5. ОТОБРАЖЕНИЕ КАТАЛОГА ТЕМ (Экран 1)
// ==========================================================================
function renderCatalog(filterQuery = "") {
  const container = document.getElementById("catalog-cards");
  if (!container) return;

  const query = filterQuery.trim().toLowerCase();
  const filtered = topicMgr.topics.filter(t => {
    return t.title.toLowerCase().includes(query) || (t.description || "").toLowerCase().includes(query);
  });

  const countBadge = document.getElementById("topics-count-badge");
  if (countBadge) countBadge.textContent = `Доступно тем: ${filtered.length}`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px; color: var(--text-muted);">
        🔍 По вашему запросу темы не найдены.
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  filtered.forEach(t => {
    const cwCount = t.classwork ? t.classwork.length : 0;
    const hwCount = t.homework ? t.homework.length : 0;
    const quizCount = t.quiz ? t.quiz.length : 0;

    const card = document.createElement("div");
    card.className = "topic-card";
    card.onclick = () => openLesson(t.id);

    card.innerHTML = `
      <div class="topic-card-top">
        <div class="topic-card-icon">${t.icon || '📘'}</div>
        <div>
          <div class="topic-card-title">${t.title}</div>
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--primary);">5 класс</div>
        </div>
      </div>
      <div class="topic-card-desc">${t.description || 'Изучай правила и закрепляй знания на примерах!'}</div>
      
      <div class="topic-card-badges">
        <span class="task-tag">🎯 Квиз: ${quizCount}</span>
        <span class="task-tag">🏫 В классе: ${cwCount}</span>
        <span class="task-tag">🏠 Дома: ${hwCount}</span>
        ${t.isPreview ? `<span class="task-tag" style="background:#fef3c7; color:#b45309;">🧪 Предпросмотр</span>` : ''}
      </div>

      <button class="topic-card-btn">
        <span>Открыть урок</span>
        <span>→</span>
      </button>
    `;
    container.appendChild(card);
  });
}

function filterTopics(query) {
  renderCatalog(query);
}

function showCatalog() {
  document.getElementById("view-lesson").classList.add("hidden");
  document.getElementById("view-catalog").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });
  history.replaceState(null, "", window.location.pathname);
}

function openLesson(topicId) {
  const topic = topicMgr.getTopic(topicId);
  if (!topic) return;

  topicMgr.currentTopic = topic;
  document.getElementById("view-catalog").classList.add("hidden");
  document.getElementById("view-lesson").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });

  history.replaceState(null, "", `#${topic.id}`);
  renderCurrentTopic();
}

// ==========================================================================
// 6. ЭЛЕКТРОННЫЙ ЧЕРНОВИК (Scratchpad Canvas)
// ==========================================================================
class Scratchpad {
  constructor(canvasId, wrapperId) {
    this.canvas = document.getElementById(canvasId);
    this.wrapper = document.getElementById(wrapperId);
    this.ctx = this.canvas.getContext("2d");
    this.isDrawing = false;
    this.tool = 'pen';
    this.points = [];

    this.init();
    this.bindEvents();
  }

  init() {
    if (!this.wrapper) return;
    const rect = this.wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.setTool(this.tool);
  }

  setTool(tool) {
    this.tool = tool;
    document.getElementById("btn-pen")?.classList.toggle("active", tool === "pen");
    document.getElementById("btn-highlighter")?.classList.toggle("active", tool === "highlighter");
    document.getElementById("btn-eraser")?.classList.toggle("active", tool === "eraser");
  }

  clear() {
    const dpr = window.devicePixelRatio || 1;
    this.ctx.clearRect(0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
  }

  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const touch = e.touches && e.touches[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  start(e) {
    this.isDrawing = true;
    const coords = this.getCoords(e);
    this.points = [coords];
    this.ctx.beginPath();
    this.ctx.moveTo(coords.x, coords.y);
    if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
  }

  draw(e) {
    if (!this.isDrawing) return;
    const coords = this.getCoords(e);
    this.points.push(coords);

    if (this.tool === "eraser") {
      this.ctx.strokeStyle = "#ffffff";
      this.ctx.lineWidth = 24;
      this.ctx.globalAlpha = 1.0;
    } else if (this.tool === "highlighter") {
      this.ctx.strokeStyle = "#fef08a";
      this.ctx.lineWidth = 14;
      this.ctx.globalAlpha = 0.5;
    } else {
      this.ctx.strokeStyle = "#1e293b";
      this.ctx.lineWidth = 2.8;
      this.ctx.globalAlpha = 1.0;
    }

    if (this.points.length >= 3) {
      const p1 = this.points[this.points.length - 2];
      const p2 = this.points[this.points.length - 1];
      const xc = (p1.x + p2.x) / 2;
      const yc = (p1.y + p2.y) / 2;
      this.ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      this.ctx.stroke();
    } else {
      this.ctx.lineTo(coords.x, coords.y);
      this.ctx.stroke();
    }

    if (e.cancelable && e.type.startsWith("touch")) e.preventDefault();
  }

  stop() {
    if (this.isDrawing) {
      this.ctx.closePath();
      this.ctx.globalAlpha = 1.0;
      this.isDrawing = false;
      this.points = [];
    }
  }

  bindEvents() {
    this.canvas.addEventListener("mousedown", (e) => this.start(e));
    this.canvas.addEventListener("mousemove", (e) => this.draw(e));
    window.addEventListener("mouseup", () => this.stop());

    this.canvas.addEventListener("touchstart", (e) => this.start(e), { passive: false });
    this.canvas.addEventListener("touchmove", (e) => this.draw(e), { passive: false });
    window.addEventListener("touchend", () => this.stop());

    window.addEventListener("resize", () => {
      const temp = document.createElement("canvas");
      temp.width = this.canvas.width;
      temp.height = this.canvas.height;
      temp.getContext("2d").drawImage(this.canvas, 0, 0);
      this.init();
      const dpr = window.devicePixelRatio || 1;
      this.ctx.drawImage(temp, 0, 0, this.canvas.width / dpr, this.canvas.height / dpr);
    });
  }
}

let scratchpad = null;

// ==========================================================================
// 7. ДВИЖОК ТРЕНАЖЁРА (Quiz Engine)
// ==========================================================================
let quizCurrentIndex = 0;
let quizCorrectCount = 0;
let quizWrongCount = 0;
let quizAnswered = false;

function initQuiz() {
  quizCurrentIndex = 0;
  quizCorrectCount = 0;
  quizWrongCount = 0;
  quizAnswered = false;
  updateQuizStats();
  loadQuizQuestion(0);
}

function updateQuizStats() {
  const cEl = document.getElementById("session-correct");
  const wEl = document.getElementById("session-wrong");
  if (!cEl || !wEl) return;

  cEl.textContent = quizCorrectCount;
  wEl.textContent = quizWrongCount;

  const total = quizCorrectCount + quizWrongCount;
  const accuracy = total > 0 ? Math.round((quizCorrectCount / total) * 100) : 0;

  document.getElementById("session-accuracy").textContent = `${accuracy}%`;
  document.getElementById("ring-text").textContent = `${accuracy}%`;

  const ringBar = document.getElementById("ring-bar");
  ringBar.setAttribute("stroke-dasharray", `${accuracy}, 100`);

  if (accuracy >= 80) ringBar.style.stroke = "#10b981";
  else if (accuracy >= 50) ringBar.style.stroke = "#f59e0b";
  else ringBar.style.stroke = "#ef4444";
}

function loadQuizQuestion(index) {
  const quiz = topicMgr.currentTopic?.quiz || [];
  if (quiz.length === 0) {
    document.getElementById("expression").innerHTML = "Примеры для тренажёра отсутствуют";
    document.getElementById("options-container").innerHTML = "";
    return;
  }

  quizAnswered = false;
  scratchpad?.clear();
  document.getElementById("next-btn").disabled = true;
  document.getElementById("feedback").textContent = "";

  const q = quiz[index];
  document.getElementById("q-current").textContent = index + 1;
  document.getElementById("q-total").textContent = quiz.length;
  document.getElementById("progress-bar").style.width = `${((index + 1) / quiz.length) * 100}%`;
  
  // Красивое математическое форматирование выражения
  document.getElementById("expression").innerHTML = `${formatMathHtml(q.exp)} = ?`;

  const optContainer = document.getElementById("options-container");
  optContainer.innerHTML = "";

  let opts = q.options ? [...q.options] : [];
  if (opts.length === 0) {
    opts = [q.correct, q.correct + 2, q.correct - 2, q.correct + 5];
  }

  opts.sort(() => Math.random() - 0.5);

  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = formatMathHtml(String(opt));
    btn.dataset.raw = String(opt);
    btn.onclick = () => selectQuizOption(btn, String(opt), String(q.correct));
    optContainer.appendChild(btn);
  });
}

function selectQuizOption(clickedBtn, selectedVal, correctVal) {
  if (quizAnswered) return;
  quizAnswered = true;

  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);
  const feedback = document.getElementById("feedback");

  const isMatch = selectedVal.trim() === correctVal.trim();

  if (isMatch) {
    clickedBtn.classList.add("correct");
    feedback.style.color = "var(--success)";
    feedback.innerHTML = "🎉 Правильно! Молодец!";
    quizCorrectCount++;
    sfx.correct();
  } else {
    clickedBtn.classList.add("wrong");
    feedback.style.color = "var(--danger)";
    feedback.innerHTML = `❌ Ошибка! Верный ответ: <b>${formatMathHtml(correctVal)}</b>`;
    quizWrongCount++;
    sfx.wrong();

    allBtns.forEach(btn => {
      if (btn.dataset.raw && btn.dataset.raw.trim() === correctVal.trim()) {
        btn.classList.add("correct");
      }
    });
  }

  updateQuizStats();
  document.getElementById("next-btn").disabled = false;
}

function nextQuizQuestion() {
  const quiz = topicMgr.currentTopic?.quiz || [];
  if (quizCurrentIndex < quiz.length - 1) {
    quizCurrentIndex++;
    loadQuizQuestion(quizCurrentIndex);
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  const container = document.getElementById("tab-quiz");
  const total = quizCorrectCount + quizWrongCount;
  const acc = total > 0 ? Math.round((quizCorrectCount / total) * 100) : 0;
  
  if (acc >= 80) {
    launchConfetti();
    sfx.victory();
  }

  container.innerHTML = `
    <div style="text-align: center; padding: 32px 12px; animation: fadeIn 0.4s ease;">
      <div style="font-size: 3.5rem; margin-bottom: 12px;">🏆</div>
      <h2 style="font-size: 1.9rem; font-weight: 800; margin-bottom: 8px;">Тренажёр завершён!</h2>
      <p style="font-size: 1.05rem; color: var(--text-muted); margin-bottom: 24px;">
        Вы успешно прошли задания темы «${topicMgr.currentTopic.title}»!
      </p>
      <div style="background: #f8fafc; border: 1.5px solid var(--border); border-radius: 16px; padding: 20px; max-width: 380px; margin: 0 auto 26px; display: flex; flex-direction: column; gap: 10px; font-size: 1.1rem; font-weight: 700;">
        <span style="color: var(--success);">✔ Решено правильно: ${quizCorrectCount}</span>
        <span style="color: var(--danger);">✖ Ошибок: ${quizWrongCount}</span>
        <span style="color: var(--primary);">🎯 Итоговая точность: ${acc}%</span>
      </div>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <button class="action-btn" onclick="renderCurrentTopic()">Пройти ещё раз 🔄</button>
        <button class="action-btn secondary-btn" onclick="showCatalog()">К списку тем 📚</button>
      </div>
    </div>
  `;
}

// ==========================================================================
// 8. ДВИЖОК ЗАДАНИЙ (Классная и Домашняя работа)
// ==========================================================================
function renderTasks(type, data, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 30px;">В этой теме пока нет примеров.</div>`;
    return;
  }

  data.forEach((item, idx) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "task-interactive-item";
    itemDiv.id = `${type}-row-${idx}`;
    itemDiv.innerHTML = `
      <div class="task-exp-label"><b>${idx + 1})</b> ${formatMathHtml(item.exp)} =</div>
      <div class="task-input-wrap">
        <input 
          type="text" 
          inputmode="text" 
          class="task-input" 
          id="${type}-input-${idx}" 
          placeholder="?" 
          autocomplete="off"
          onkeydown="handleTaskInputKey(event, '${type}', ${idx}, ${data.length})"
        />
        <button class="task-check-btn" onclick="checkSingleTask('${type}', ${idx})" title="Проверить ответ">✔</button>
        <span class="task-badge" id="${type}-badge-${idx}"></span>
      </div>
    `;
    container.appendChild(itemDiv);
  });

  updateTaskScore(type);
}

function handleTaskInputKey(event, type, index, total) {
  if (event.key === 'Enter') {
    checkSingleTask(type, index);
    if (index + 1 < total) {
      const nextInput = document.getElementById(`${type}-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }
}

function checkSingleTask(type, index) {
  const data = type === 'cw' ? topicMgr.currentTopic.classwork : topicMgr.currentTopic.homework;
  const input = document.getElementById(`${type}-input-${index}`);
  const row = document.getElementById(`${type}-row-${index}`);
  const badge = document.getElementById(`${type}-badge-${index}`);
  
  // Нормализуем пользовательский ввод (ученик может ввести 4/7 или 4:7 или 4 / 7)
  const userVal = input.value.trim().replace(/\s+/g, '').replace(':', '/').replace(',', '.');
  const correctVal = String(data[index].ans).trim().replace(/\s+/g, '').replace(':', '/').replace(',', '.');

  if (!userVal) {
    row.classList.remove("is-correct", "is-wrong");
    badge.textContent = "";
    updateTaskScore(type);
    return;
  }

  if (userVal === correctVal) {
    row.classList.remove("is-wrong");
    row.classList.add("is-correct");
    badge.textContent = "✅";
    sfx.correct();
  } else {
    row.classList.remove("is-correct");
    row.classList.add("is-wrong");
    badge.textContent = "❌";
    sfx.wrong();
  }

  updateTaskScore(type);
}

function checkAllTasks(type) {
  const data = type === 'cw' ? topicMgr.currentTopic.classwork : topicMgr.currentTopic.homework;
  data.forEach((_, idx) => checkSingleTask(type, idx));
}

function resetTasks(type) {
  const sectionName = type === 'cw' ? "классной" : "домашней";
  if (confirm(`Очистить все ответы в ${sectionName} работе?`)) {
    const data = type === 'cw' ? topicMgr.currentTopic.classwork : topicMgr.currentTopic.homework;
    data.forEach((_, idx) => {
      const input = document.getElementById(`${type}-input-${idx}`);
      const row = document.getElementById(`${type}-row-${idx}`);
      const badge = document.getElementById(`${type}-badge-${idx}`);
      if (input) input.value = "";
      if (row) row.classList.remove("is-correct", "is-wrong");
      if (badge) badge.textContent = "";
    });
    updateTaskScore(type);
  }
}

function updateTaskScore(type) {
  const data = type === 'cw' ? topicMgr.currentTopic.classwork : topicMgr.currentTopic.homework;
  const total = data ? data.length : 0;
  const correctRows = document.querySelectorAll(`#tab-${type === 'cw' ? 'classwork' : 'homework'} .task-interactive-item.is-correct`).length;

  const countElem = document.getElementById(`${type}-correct-count`);
  const praiseElem = document.getElementById(`${type}-praise`);
  const totalElem = document.getElementById(`${type}-total-count`);

  if (countElem) countElem.textContent = correctRows;
  if (totalElem) totalElem.textContent = total;

  if (praiseElem) {
    if (correctRows === total && total > 0) {
      praiseElem.textContent = `🔥 Отлично! Все ${total} примеров решены на 5+!`;
      praiseElem.style.color = "var(--success)";
      launchConfetti();
      sfx.victory();
    } else if (correctRows >= Math.floor(total * 0.6)) {
      praiseElem.textContent = "👍 Отличный темп, продолжай!";
      praiseElem.style.color = "var(--primary)";
    } else if (correctRows > 0) {
      praiseElem.textContent = "Хорошее начало, так держать!";
      praiseElem.style.color = "var(--text-muted)";
    } else {
      praiseElem.textContent = "Вводи ответы и нажимай Enter!";
      praiseElem.style.color = "var(--text-muted)";
    }
  }
}

// ==========================================================================
// 9. РЕНДЕР ТЕКУЩЕГО УРОКА
// ==========================================================================
function renderCurrentTopic() {
  const t = topicMgr.currentTopic;
  if (!t) return;

  const quizTab = document.getElementById("tab-quiz");
  quizTab.innerHTML = `
    <div class="session-stats-card">
      <div class="session-stats-info">
        <div class="session-stats-title">📊 Результаты сессии</div>
        <div class="session-row">
          <span class="session-label">Решено верно:</span>
          <span class="session-val correct" id="session-correct">0</span>
        </div>
        <div class="session-row">
          <span class="session-label">Ошибок:</span>
          <span class="session-val wrong" id="session-wrong">0</span>
        </div>
        <div class="session-row">
          <span class="session-label">Точность:</span>
          <span class="session-val acc" id="session-accuracy">0%</span>
        </div>
      </div>

      <div class="session-circle-container">
        <svg class="progress-ring" width="68" height="68" viewBox="0 0 36 36">
          <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path class="circle-bar" id="ring-bar" stroke-dasharray="0, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <span class="ring-text" id="ring-text">0%</span>
      </div>
    </div>

    <div class="stats-bar">
      <div>Пример: <span id="q-current">1</span> / <span id="q-total">100</span></div>
    </div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" id="progress-bar"></div>
    </div>

    <div class="quiz-rule-tip" id="quiz-rule-tip"></div>
    <div class="quiz-expression" id="expression">...</div>

    <!-- Электронный черновик -->
    <div class="scratchpad-container" id="scratchpad-box">
      <div class="scratchpad-header">
        <div class="scratchpad-title">✏️ Электронный черновик в клетку</div>
        <div class="scratchpad-tools">
          <button type="button" class="tool-btn active" id="btn-pen" onclick="scratchpad.setTool('pen')">🖊 Ручка</button>
          <button type="button" class="tool-btn" id="btn-highlighter" onclick="scratchpad.setTool('highlighter')">🖍 Маркер</button>
          <button type="button" class="tool-btn" id="btn-eraser" onclick="scratchpad.setTool('eraser')">🧹 Ластик</button>
          <button type="button" class="tool-btn danger" onclick="scratchpad.clear()">🗑 Стереть</button>
        </div>
      </div>
      <div class="canvas-wrap" id="canvas-wrapper">
        <canvas id="scratchpad-canvas"></canvas>
      </div>
    </div>

    <div class="options-grid" id="options-container"></div>
    <div class="feedback-banner" id="feedback"></div>

    <div class="quiz-actions">
      <button class="action-btn" id="next-btn" onclick="nextQuizQuestion()" disabled>Следующий пример →</button>
      <button class="action-btn secondary-btn" onclick="initQuiz()">Сбросить сессию 🔄</button>
    </div>
  `;

  document.getElementById("topic-title").textContent = t.title;
  document.getElementById("topic-desc").textContent = t.description || "";
  document.getElementById("topic-icon").textContent = t.icon || "📘";
  document.getElementById("quiz-rule-tip").innerHTML = formatMathHtml(t.ruleTip || "Решай внимательно!");

  const cwCount = t.classwork ? t.classwork.length : 0;
  const hwCount = t.homework ? t.homework.length : 0;
  document.getElementById("tab-cw-badge").textContent = `(${cwCount})`;
  document.getElementById("tab-hw-badge").textContent = `(${hwCount})`;

  scratchpad = new Scratchpad("scratchpad-canvas", "canvas-wrapper");

  initQuiz();
  renderTasks('cw', t.classwork || [], 'classwork-container');
  renderTasks('hw', t.homework || [], 'homework-container');
}

// ==========================================================================
// 10. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Tabs, Fullscreen, Toast, Confetti, Teacher Modal)
// ==========================================================================
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("tab-quiz").classList.add("hidden");
  document.getElementById("tab-classwork").classList.add("hidden");
  document.getElementById("tab-homework").classList.add("hidden");

  if (tab === 'quiz') {
    document.querySelectorAll(".tab-btn")[0].classList.add("active");
    document.getElementById("tab-quiz").classList.remove("hidden");
    setTimeout(() => scratchpad?.init(), 50);
  } else if (tab === 'classwork') {
    document.querySelectorAll(".tab-btn")[1].classList.add("active");
    document.getElementById("tab-classwork").classList.remove("hidden");
  } else if (tab === 'homework') {
    document.querySelectorAll(".tab-btn")[2].classList.add("active");
    document.getElementById("tab-homework").classList.remove("hidden");
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
  }
}

function toggleSound() {
  const isEnabled = sfx.toggle();
  const btn = document.getElementById("sound-btn");
  if (btn) btn.textContent = isEnabled ? "🔊" : "🔇";
  showToast(isEnabled ? "Звук включён" : "Звук выключен");
}

function showToast(text) {
  let toast = document.getElementById("toast-msg");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-msg";
    toast.className = "toast-msg";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

function launchConfetti() {
  const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.left = `${50 + (Math.random() * 60 - 30)}%`;
    el.style.top = "40%";
    el.style.width = `${Math.random() * 8 + 6}px`;
    el.style.height = `${Math.random() * 8 + 6}px`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = "2px";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);

    const destX = (Math.random() - 0.5) * window.innerWidth * 0.8;
    const destY = (Math.random() - 0.5) * window.innerHeight * 0.7;

    el.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY + 150}px) scale(0)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 800,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }).onfinish = () => el.remove();
  }
}

function openTeacherModal() {
  document.getElementById("teacher-modal").classList.remove("hidden");
}

function closeTeacherModal() {
  document.getElementById("teacher-modal").classList.add("hidden");
}

function handleTeacherFileUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const topicData = JSON.parse(e.target.result);
      topicMgr.setPreviewTopic(topicData);
      showToast(`Превью темы «${topicData.title}» открыто!`);
      closeTeacherModal();
    } catch (err) {
      alert("Ошибка в формате файла: " + err.message);
    }
  };
  reader.readAsText(file, "UTF-8");
}

// ==========================================================================
// 11. СТАРТ ПРИЛОЖЕНИЯ
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  topicMgr.fetchGitHubTopics();

  const soundBtn = document.getElementById("sound-btn");
  if (soundBtn) soundBtn.textContent = sfx.enabled ? "🔊" : "🔇";

  const hash = window.location.hash.replace('#', '').trim();
  if (hash) {
    const topic = topicMgr.topics.find(t => t.id === hash);
    if (topic) openLesson(topic.id);
  }

  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("teacher-file-input");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (e) => handleTeacherFileUpload(e.target.files[0]));

    ['dragenter', 'dragover'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
      });
    });

    ['dragleave', 'drop'].forEach(name => {
      dropzone.addEventListener(name, (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      if (e.dataTransfer && e.dataTransfer.files.length > 0) {
        handleTeacherFileUpload(e.dataTransfer.files[0]);
      }
    });
  }
});
