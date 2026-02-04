#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../api-beta/node_modules/@urbit/aura/dist/aura.cjs.production.min.js
var require_aura_cjs_production_min = __commonJS({
  "../api-beta/node_modules/@urbit/aura/dist/aura.cjs.production.min.js"(exports) {
    "use strict";
    function n(n2) {
      let t2 = true, [e2, r2, u2] = n2.split("..");
      r2 = r2 || "0.0.0", u2 = u2 || "0000";
      let [s2, c2, l2] = e2.slice(1).split(".");
      "-" === s2.at(-1) && (s2 = s2.slice(0, -1), t2 = false);
      const [d2, p2, g2] = r2.split("."), h2 = u2.split(".").map(((n3) => BigInt("0x" + n3)));
      return (function(n3) {
        const t3 = n3.pos ? a + BigInt(n3.year) : a - (BigInt(n3.year) - 1n), e3 = (() => {
          let e4 = i(t3) ? f : o, r3 = n3.time.day - 1n, a2 = n3.month - 1n;
          for (; 0n !== a2; ) {
            const [n4, ...t4] = e4;
            r3 += BigInt(n4), a2 -= 1n, e4 = t4;
          }
          let u3 = true, s3 = t3;
          for (; 1 == u3; ) s3 % 4n !== 0n ? (s3 -= 1n, r3 += i(s3) ? 366n : 365n) : s3 % 100n !== 0n ? (s3 -= 4n, r3 += i(s3) ? 1461n : 1460n) : s3 % 400n !== 0n ? (s3 -= 100n, r3 += i(s3) ? 36525n : 36524n) : (r3 += s3 / 400n * (4n * 36524n + 1n), u3 = false);
          return r3;
        })();
        return n3.time.day = e3, m(n3.time);
      })({ pos: t2, year: BigInt(s2), month: BigInt(c2), time: { day: BigInt(l2), hour: BigInt(d2), minute: BigInt(p2), second: BigInt(g2), ms: h2 } });
    }
    function t(n2) {
      const t2 = { day: 0n, hour: 0n, minute: 0n, second: 0n, ms: [] };
      n2 = n2.slice(1);
      let [e2, r2] = n2.split("..");
      return r2 = r2 || "0000", t2.ms = r2.split(".").map(((n3) => BigInt("0x" + n3))), e2.split(".").forEach(((e3) => {
        switch (e3[0]) {
          case "d":
            t2.day += BigInt(e3.slice(1));
            break;
          case "h":
            t2.hour += BigInt(e3.slice(1));
            break;
          case "m":
            t2.minute += BigInt(e3.slice(1));
            break;
          case "s":
            t2.second += BigInt(e3.slice(1));
            break;
          default:
            throw new Error("bad dr: " + n2);
        }
      })), r2 = r2 || "0000", m(t2);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    var e = BigInt("170141184475152167957503069145530368000");
    var r = BigInt("18446744073709551616");
    var a = BigInt("292277024400");
    function i(n2) {
      return n2 % 4n === 0n && n2 % 100n !== 0n || n2 % 400n === 0n;
    }
    var o = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var f = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var u = 86400n;
    var s = 3600n;
    var c = 60n;
    var l = 146097n;
    var d = 36524n;
    function m(n2) {
      let t2 = n2.second + u * n2.day + s * n2.hour + c * n2.minute, e2 = n2.ms, r2 = 0n, a2 = 3n;
      for (; 0 !== e2.length; ) {
        const [n3, ...t3] = e2;
        r2 += n3 << 16n * a2, e2 = t3, a2 -= 1n;
      }
      return r2 | t2 << 64n;
    }
    function p(n2) {
      let t2 = n2 >> 64n;
      const e2 = (BigInt("0xffffffffffffffff") & n2).toString(16).padStart(16, "0").match(/.{4}/g).map(((n3) => BigInt("0x" + n3)));
      for (; 0n === e2.at(-1); ) e2.pop();
      let r2 = t2 / u;
      t2 %= u;
      let a2 = t2 / s;
      t2 %= s;
      let i2 = t2 / c;
      return t2 %= c, { ms: e2, day: r2, minute: i2, hour: a2, second: t2 };
    }
    var g = (n2, t2) => ((n3, t3) => {
      const e2 = Number(0xffn & t3), r2 = Number((0xff00n & t3) / 256n), a2 = String.fromCharCode(e2) + String.fromCharCode(r2);
      return BigInt(((n4, t4) => {
        let e3, r3, a3, i2, o2, f2, u2, s2;
        for (e3 = 3 & n4.length, r3 = n4.length - e3, a3 = t4, o2 = 3432918353, f2 = 461845907, s2 = 0; s2 < r3; ) u2 = 255 & n4.charCodeAt(s2) | (255 & n4.charCodeAt(++s2)) << 8 | (255 & n4.charCodeAt(++s2)) << 16 | (255 & n4.charCodeAt(++s2)) << 24, ++s2, u2 = (65535 & u2) * o2 + (((u2 >>> 16) * o2 & 65535) << 16) & 4294967295, u2 = u2 << 15 | u2 >>> 17, u2 = (65535 & u2) * f2 + (((u2 >>> 16) * f2 & 65535) << 16) & 4294967295, a3 ^= u2, a3 = a3 << 13 | a3 >>> 19, i2 = 5 * (65535 & a3) + ((5 * (a3 >>> 16) & 65535) << 16) & 4294967295, a3 = 27492 + (65535 & i2) + ((58964 + (i2 >>> 16) & 65535) << 16);
        switch (u2 = 0, e3) {
          case 3:
            u2 ^= (255 & n4.charCodeAt(s2 + 2)) << 16;
          case 2:
            u2 ^= (255 & n4.charCodeAt(s2 + 1)) << 8;
          case 1:
            u2 ^= 255 & n4.charCodeAt(s2), u2 = (65535 & u2) * o2 + (((u2 >>> 16) * o2 & 65535) << 16) & 4294967295, u2 = u2 << 15 | u2 >>> 17, u2 = (65535 & u2) * f2 + (((u2 >>> 16) * f2 & 65535) << 16) & 4294967295, a3 ^= u2;
        }
        return a3 ^= n4.length, a3 ^= a3 >>> 16, a3 = 2246822507 * (65535 & a3) + ((2246822507 * (a3 >>> 16) & 65535) << 16) & 4294967295, a3 ^= a3 >>> 13, a3 = 3266489909 * (65535 & a3) + ((3266489909 * (a3 >>> 16) & 65535) << 16) & 4294967295, a3 ^= a3 >>> 16, a3 >>> 0;
      })(a2, n3));
    })([3077398253, 3995603712, 2243735041, 1261992695][n2], t2);
    var h = (n2) => y(4, 65535n, 65536n, 0xffffffffn, g, n2);
    var y = (n2, t2, e2, r2, a2, i2) => {
      const o2 = b(n2, t2, e2, a2, i2);
      return o2 < r2 ? o2 : b(n2, t2, e2, a2, o2);
    };
    var b = (n2, t2, e2, r2, a2) => {
      const i2 = (a3, o2, f2) => {
        if (a3 > n2) return n2 % 2 != 0 || f2 === t2 ? t2 * f2 + o2 : t2 * o2 + f2;
        {
          const n3 = BigInt(r2(a3 - 1, f2).toString());
          return i2(a3 + 1, f2, a3 % 2 != 0 ? (o2 + n3) % t2 : (o2 + n3) % e2);
        }
      };
      return i2(1, a2 % t2, a2 / t2);
    };
    var x = (n2) => w(4, 65535n, 65536n, 0xffffffffn, g, n2);
    var w = (n2, t2, e2, r2, a2, i2) => {
      const o2 = B(n2, t2, e2, a2, i2);
      return o2 < r2 ? o2 : B(n2, t2, e2, a2, o2);
    };
    var B = (n2, t2, e2, r2, a2) => {
      const i2 = (n3, a3, o3) => {
        if (n3 < 1) return t2 * o3 + a3;
        {
          const f3 = r2(n3 - 1, a3);
          return i2(n3 - 1, n3 % 2 != 0 ? (o3 + t2 - f3 % t2) % t2 : (o3 + e2 - f3 % e2) % e2, a3);
        }
      }, o2 = n2 % 2 != 0 ? a2 / t2 : a2 % t2, f2 = n2 % 2 != 0 ? a2 % t2 : a2 / t2;
      return i2(n2, f2 === t2 ? o2 : f2, f2 === t2 ? f2 : o2);
    };
    var I = { F: g, fe: b, Fe: y, feis: h, fein: (n2) => {
      const t2 = (n3) => {
        const e2 = 0xffffffffn & n3, r2 = 0xffffffff00000000n & n3;
        return n3 >= 0x10000n && n3 <= 0xffffffffn ? 0x10000n + h(n3 - 0x10000n) : n3 >= 0x100000000n && n3 <= 0xffffffffffffffffn ? r2 | t2(e2) : n3;
      };
      return t2(n2);
    }, fen: B, Fen: w, tail: x, fynd: (n2) => {
      const t2 = (n3) => {
        const e2 = 0xffffffffn & n3, r2 = 0xffffffff00000000n & n3;
        return n3 >= 0x10000n && n3 <= 0xffffffffn ? 0x10000n + x(n3 - 0x10000n) : n3 >= 0x100000000n && n3 <= 0xffffffffffffffffn ? r2 | t2(e2) : n3;
      };
      return t2(BigInt(n2));
    } };
    var v = /^~([a-z]{3}|([a-z]{6}(\-[a-z]{6}){0,3}(\-(\-[a-z]{6}){4})*))$/;
    function S(n2) {
      const t2 = N(n2), e2 = (n3) => n3.toString(2).padStart(8, "0"), r2 = t2.reduce(((n3, r3, a3) => a3 % 2 != 0 || 1 === t2.length ? n3 + e2(E.indexOf(r3)) : n3 + e2(C.indexOf(r3))), ""), a2 = BigInt("0b" + r2);
      return I.fynd(a2);
    }
    function $2(n2) {
      const t2 = I.fein(n2), e2 = Math.ceil(t2.toString(16).length / 2), r2 = Math.ceil(t2.toString(16).length / 4);
      return "~" + (e2 <= 1 ? E[Number(t2)] : (function n3(t3, e3, a2) {
        const i2 = 0xffffn & t3, o2 = C[Number(i2 >> 8n)], f2 = E[Number(0xffn & i2)];
        return e3 === r2 ? a2 : n3(t3 >> 16n, e3 + 1, o2 + f2 + (3 & e3 ? "-" : 0 === e3 ? "" : "--") + a2);
      })(t2, 0, ""));
    }
    function A(n2) {
      let t2;
      return t2 = "bigint" == typeof n2 ? n2 : z(n2), t2 <= 0xffn ? "czar" : t2 <= 0xffffn ? "king" : t2 <= 0xffffffffn ? "duke" : t2 <= 0xffffffffffffffffn ? "earl" : "pawn";
    }
    function k(n2) {
      switch (n2) {
        case "czar":
          return "galaxy";
        case "king":
          return "star";
        case "duke":
          return "planet";
        case "earl":
          return "moon";
        case "pawn":
          return "comet";
      }
    }
    function z(n2) {
      if (!(function(n3) {
        return v.test(n3) && j(n3) && n3 === $2(S(n3));
      })(n2)) throw new Error("invalid @p literal: " + n2);
      return S(n2);
    }
    var C = "\ndozmarbinwansamlitsighidfidlissogdirwacsabwissibrigsoldopmodfoglidhopdardorlorhodfolrintogsilmirholpaslacrovlivdalsatlibtabhanticpidtorbolfosdotlosdilforpilramtirwintadbicdifrocwidbisdasmidloprilnardapmolsanlocnovsitnidtipsicropwitnatpanminritpodmottamtolsavposnapnopsomfinfonbanmorworsipronnorbotwicsocwatdolmagpicdavbidbaltimtasmalligsivtagpadsaldivdactansidfabtarmonranniswolmispallasdismaprabtobrollatlonnodnavfignomnibpagsopralbilhaddocridmocpacravripfaltodtiltinhapmicfanpattaclabmogsimsonpinlomrictapfirhasbosbatpochactidhavsaplindibhosdabbitbarracparloddosbortochilmactomdigfilfasmithobharmighinradmashalraglagfadtopmophabnilnosmilfopfamdatnoldinhatnacrisfotribhocnimlarfitwalrapsarnalmoslandondanladdovrivbacpollaptalpitnambonrostonfodponsovnocsorlavmatmipfip".match(/.{1,3}/g);
    var E = "\nzodnecbudwessevpersutletfulpensytdurwepserwylsunrypsyxdyrnuphebpeglupdepdysputlughecryttyvsydnexlunmeplutseppesdelsulpedtemledtulmetwenbynhexfebpyldulhetmevruttylwydtepbesdexsefwycburderneppurrysrebdennutsubpetrulsynregtydsupsemwynrecmegnetsecmulnymtevwebsummutnyxrextebfushepbenmuswyxsymselrucdecwexsyrwetdylmynmesdetbetbeltuxtugmyrpelsyptermebsetdutdegtexsurfeltudnuxruxrenwytnubmedlytdusnebrumtynseglyxpunresredfunrevrefmectedrusbexlebduxrynnumpyxrygryxfeptyrtustyclegnemfermertenlusnussyltecmexpubrymtucfyllepdebbermughuttunbylsudpemdevlurdefbusbeprunmelpexdytbyttyplevmylwedducfurfexnulluclennerlexrupnedlecrydlydfenwelnydhusrelrudneshesfetdesretdunlernyrsebhulrylludremlysfynwerrycsugnysnyllyndyndemluxfedsedbecmunlyrtesmudnytbyrsenwegfyrmurtelreptegpecnelnevfes".match(/.{1,3}/g);
    function N(n2) {
      return n2.replace(/[\^~-]/g, "").match(/.{1,3}/g) || [];
    }
    function j(n2) {
      const t2 = N(n2);
      return !(t2.length % 2 != 0 && 1 !== t2.length) && t2.every(((n3, e2) => e2 % 2 != 0 || 1 === t2.length ? E.includes(n3) : C.includes(n3)));
    }
    function _(n2, t2) {
      let e2 = [], r2 = [e2];
      for (let a2 = 0; a2 < n2.length; a2++) e2.length < t2 ? e2.push(n2[a2]) : (e2 = [n2[a2]], r2.push(e2));
      return r2;
    }
    function q(n2, t2) {
      return n2 = M(n2), (function(n3, t3, e2) {
        if ("nan" === n3) return (function(n4, t4) {
          return O2(BigInt(n4 + 1)) << BigInt(t4 - 1);
        })(t3, e2);
        if ("inf" === n3) return U(true, t3, e2);
        if ("-inf" === n3) return U(false, t3, e2);
        let r2 = 0, a2 = true;
        "-" === n3[r2] && (a2 = false, r2++);
        let i2 = "";
        for (; "." !== n3[r2] && "e" !== n3[r2] && void 0 !== n3[r2]; ) i2 += n3[r2++];
        "." === n3[r2] && r2++;
        let o2 = "";
        for (; "e" !== n3[r2] && void 0 !== n3[r2]; ) o2 += n3[r2++];
        "e" === n3[r2] && r2++;
        let f2 = true;
        "-" === n3[r2] && (f2 = false, r2++);
        let u2 = "";
        for (; void 0 !== n3[r2]; ) u2 += n3[r2++];
        return BigInt("0b" + (function(n4, t4, e3, r3, a3, i3, o3) {
          return 0 !== o3 && (i3 ? (r3 += a3.padEnd(o3, "0").slice(0, o3), a3 = a3.slice(o3)) : (a3 = r3.padStart(o3, "0").slice(-o3) + a3, r3 = r3.slice(0, -o3))), (function(n5, t5, e4, r4, a4, i4) {
            function o4(n6) {
              return console.warn(n6), 1;
            }
            const f3 = 2 ** (t5 - 1) - 1, u3 = 1 - f3, s2 = f3, c2 = u3 - n5, l2 = 2 * f3 + 1 + n5 + 3, d2 = new Array(l2), m2 = 10n ** a4;
            var p2, g2, h2, y2, b2, x2, w2 = 0, B2 = !e4;
            for (p2 = l2; p2; d2[--p2] = 0) ;
            for (p2 = f3 + 2; r4 && p2; d2[--p2] = 1n & r4, r4 >>= 1n) ;
            for (p2 = f3 + 1; i4 > 0n && p2 < l2; (d2[++p2] = (i4 *= 2n) >= m2 ? 1 : 0) && (i4 -= m2)) ;
            for (p2 = -1; ++p2 < l2 && !d2[p2]; ) ;
            if (d2[(g2 = n5 - 1 + (p2 = (w2 = f3 + 1 - p2) >= u3 && w2 <= s2 ? p2 + 1 : f3 + 1 - (w2 = u3 - 1))) + 1]) {
              if (!(h2 = d2[g2])) for (y2 = g2 + 2; !h2 && y2 < l2; h2 = d2[y2++]) ;
              for (y2 = g2 + 1; h2 && --y2 >= 0; (d2[y2] = (d2[y2] ? 0 : 1) - 0) && (h2 = 0)) ;
            }
            for (p2 = p2 - 2 < 0 ? -1 : p2 - 3; ++p2 < l2 && !d2[p2]; ) ;
            for ((w2 = f3 + 1 - p2) >= u3 && w2 <= s2 ? ++p2 : w2 < u3 && (w2 != f3 + 1 - l2 && w2 < c2 && o4("r.construct underflow"), p2 = f3 + 1 - (w2 = u3 - 1)), r4 && (o4(r4 ? "r.construct overflow" : "r.construct"), w2 = s2 + 1, p2 = f3 + 2), x2 = Math.abs(w2 + f3), y2 = t5 + 1, b2 = ""; --y2; b2 = (1 & x2) + b2, x2 = x2 >>= 1) ;
            return (B2 ? "1" : "0") + b2 + d2.slice(p2, p2 + n5).join("");
          })(t4, n4, e3, BigInt(r3), BigInt(a3.length), BigInt(a3));
        })(t3, e2, a2, i2, o2, f2, Number(u2)));
      })(t2.slice(n2.l.length), n2.w, n2.p);
    }
    function F(n2, t2) {
      return (n2 = M(n2)).l + (function(n3) {
        if ("n" === n3.t) return "nan";
        if ("i" === n3.t) return n3.s ? "inf" : "-inf";
        let t3;
        return n3.e - 4 > 0 || n3.e + 2 < 0 ? t3 = 1 : (t3 = n3.e + 1, n3.e = 0), (n3.s ? "" : "-") + (function(n4, t4) {
          const e2 = Math.abs(n4);
          if (n4 <= 0) return "0." + "".padEnd(e2, "0") + t4;
          {
            const n5 = t4.length;
            return e2 >= n5 ? t4 + "".padEnd(e2 - n5, "0") : t4.slice(0, e2) + "." + t4.slice(e2);
          }
        })(t3, n3.a) + (0 === n3.e ? "" : "e" + n3.e.toString());
      })((function(n3, t3, e2) {
        const r2 = O2(e2), a2 = O2(t3), i2 = n3 & r2, o2 = n3 >> BigInt(e2) & a2, f2 = 0n === (n3 >> BigInt(t3 + e2) & 1n);
        let u2, s2, c2, l2;
        if (o2 === a2) return 0n === i2 ? { t: "i", s: f2 } : { t: "n" };
        0n !== o2 ? (u2 = 1n << BigInt(e2) | i2, s2 = o2 - (2n ** (t3 - 1n) - 1n) - e2, c2 = Number(e2), l2 = 1n !== o2 && 0n === i2) : (u2 = i2, s2 = 1n - (2n ** (t3 - 1n) - 1n) - e2, c2 = u2.toString(2).length - 1, l2 = false);
        const d2 = (2n ** e2).toString(10).length + 1, m2 = (function(n4, t4, e3, r3, a3, i3, o3) {
          const f3 = BigInt(t4);
          let u3, s3, c3, l3, d3 = 0, m3 = new Array(o3).fill("0"), p2 = 0;
          if (0n === n4) return m3[0] = "0", p2 = 0, { digits: m3.slice(0, 1).join(""), outExponent: p2 };
          r3 ? t4 > 0 ? (s3 = 4n * n4, s3 <<= f3, u3 = 4n, c3 = 1n << f3, l3 = 1n << f3 + 1n) : (s3 = 4n * n4, u3 = 1n << -f3 + 2n, c3 = 1n, l3 = 2n) : t4 > 0 ? (s3 = 2n * n4, s3 <<= f3, u3 = 2n, c3 = 1n << f3, l3 = c3) : (s3 = 2n * n4, u3 = 1n << BigInt(1 - t4), c3 = 1n, l3 = c3);
          let g2 = Math.ceil(0.3010299956639812 * (e3 + t4) - 0.69);
          if (g2 > 0) u3 *= BigInt(10) ** BigInt(g2);
          else if (g2 < 0) {
            const n5 = BigInt(10) ** BigInt(-g2);
            s3 *= n5, c3 *= n5, l3 !== c3 && (l3 *= c3);
          }
          s3 >= u3 ? g2 += 1 : (s3 *= 10n, c3 *= 10n, l3 !== c3 && (l3 *= 10n));
          let h2 = g2 - o3;
          p2 = g2 - 1;
          let y2 = false, b2 = false, x2 = 0;
          for (; g2 -= 1, x2 = Number(s3 / u3), s3 %= u3, y2 = s3 < c3, b2 = s3 + l3 > u3, !y2 && !b2 && g2 !== h2; ) m3[d3] = String.fromCharCode("0".charCodeAt(0) + x2), d3 += 1, s3 *= 10n, c3 *= 10n, l3 !== c3 && (l3 *= 10n);
          let w2 = y2;
          if (y2 === b2) {
            s3 *= 2n;
            let n5 = s3 < u3 ? -1 : s3 > u3 ? 1 : 0;
            w2 = n5 < 0, 0 === n5 && (w2 = 0 == (1 & x2));
          }
          if (w2) m3[d3] = String.fromCharCode("0".charCodeAt(0) + x2), d3 += 1;
          else if (9 === x2) for (; ; ) {
            if (0 === d3) {
              m3[d3] = "1", d3 += 1, p2 += 1;
              break;
            }
            if (d3 -= 1, "9" !== m3[d3]) {
              m3[d3] = String.fromCharCode(m3[d3].charCodeAt(0) + 1), d3 += 1;
              break;
            }
          }
          else m3[d3] = String.fromCharCode("0".charCodeAt(0) + x2 + 1), d3 += 1;
          return { digits: m3.slice(0, d3).join(""), outExponent: p2 };
        })(u2, Number(s2), c2, l2, 0, 0, d2);
        return { t: "d", s: f2, e: m2.outExponent, a: m2.digits };
      })(t2, BigInt(n2.w), BigInt(n2.p)));
    }
    function M(n2) {
      return "h" === n2 ? { w: 5, p: 10, l: ".~~" } : "s" === n2 ? { w: 8, p: 23, l: "." } : "d" === n2 ? { w: 11, p: 52, l: ".~" } : "q" === n2 ? { w: 15, p: 112, l: ".~~~" } : n2;
    }
    function O2(n2) {
      return 2n ** n2 - 1n;
    }
    function U(n2, t2, e2) {
      return O2(BigInt(n2 ? t2 : t2 + 1)) << BigInt(e2);
    }
    function Z(n2, t2, e2, r2, a2) {
      return void 0 === a2 && (a2 = false), new RegExp(`^${a2 ? "\\-\\-?" : ""}${n2}(0|${0 === r2 ? t2 : `${t2}${e2}{0,${r2 - 1}}`}${0 === r2 ? `${e2}*` : `(\\.${e2}{${r2}})*`})$`);
    }
    function P(n2) {
      return new RegExp(`^\\.~{${n2}}(nan|\\-?(inf|(0|[1-9][0-9]*)(\\.[0-9]+)?(e\\-?(0|[1-9][0-9]*))?))$`);
    }
    var R = { c: /^~\-((~[0-9a-fA-F]+\.)|(~[~\.])|[0-9a-z\-\._])*$/, da: /^~(0|[1-9][0-9]*)\-?\.0*([1-9]|1[0-2])\.0*[1-9][0-9]*(\.\.([0-9]+)\.([0-9]+)\.([0-9]+)(\.(\.[0-9a-f]{4})+)?)?$/, dr: /^~((d|h|m|s)(0|[1-9][0-9]*))(\.(d|h|m|s)(0|[1-9][0-9]*))*(\.(\.[0-9a-f]{4})+)?$/, f: /^\.(y|n)$/, if: /^(\.(0|[1-9][0-9]{0,2})){4}$/, is: /^(\.(0|[1-9a-fA-F][0-9a-fA-F]{0,3})){8}$/, n: /^~$/, p: v, q: /^\.~(([a-z]{3}|[a-z]{6})(\-[a-z]{6})*)$/, rd: P(1), rh: P(2), rq: P(3), rs: P(0), sb: Z("0b", "1", "[01]", 4, true), sd: Z("", "[1-9]", "[0-9]", 3, true), si: Z("0i", "[1-9]", "[0-9]", 0, true), sv: Z("0v", "[1-9a-v]", "[0-9a-v]", 5, true), sw: Z("0w", "[1-9a-zA-Z~-]", "[0-9a-zA-Z~-]", 5, true), sx: Z("0x", "[1-9a-f]", "[0-9a-f]", 4, true), t: /^~~((~[0-9a-fA-F]+\.)|(~[~\.])|[0-9a-z\-\._])*$/, ta: /^~\.[0-9a-z\-\.~_]*$/, tas: /^[a-z][a-z0-9\-]*$/, ub: Z("0b", "1", "[01]", 4), ud: Z("", "[1-9]", "[0-9]", 3), ui: Z("0i", "[1-9]", "[0-9]", 0), uv: Z("0v", "[1-9a-v]", "[0-9a-v]", 5), uw: Z("0w", "[1-9a-zA-Z~-]", "[0-9a-zA-Z~-]", 5), ux: Z("0x", "[1-9a-f]", "[0-9a-f]", 4) };
    var T = D;
    function D(n2, t2) {
      const e2 = H(n2, t2);
      if (!e2) throw new Error("slav: failed to parse @" + n2 + " from string: " + t2);
      return e2;
    }
    var G = H;
    function H(n2, t2) {
      if (n2 in R && !R[n2].test(t2)) return null;
      const e2 = J(t2);
      return e2 && "dime" === e2.type && e2.aura === n2 ? e2.atom : null;
    }
    function J(e2) {
      if ("" === e2) return null;
      const r2 = e2[0];
      if (r2 >= "a" && r2 <= "z") return R.tas.test(e2) ? { type: "dime", aura: "tas", atom: Q(e2) } : null;
      if (r2 >= "0" && r2 <= "9") {
        const n2 = K(e2);
        return n2 ? { type: "dime", ...n2 } : null;
      }
      if ("-" === r2) {
        let n2 = true;
        "-" == e2[1] ? e2 = e2.slice(2) : (e2 = e2.slice(1), n2 = false);
        const t2 = K(e2);
        return t2 ? (n2 ? t2.atom = 2n * t2.atom : 0n !== t2.atom && (t2.atom = 1n + 2n * (t2.atom - 1n)), { type: "dime", aura: t2.aura.replace("u", "s"), atom: t2.atom }) : null;
      }
      if ("." === r2) {
        if (".y" === e2) return { type: "dime", aura: "f", atom: 0n };
        if (".n" === e2) return { type: "dime", aura: "f", atom: 1n };
        if (R.is.test(e2)) {
          const n2 = e2.slice(1).split(".").reduce(((n3, t2) => n3 + t2.padStart(4, "0")), "");
          return { type: "dime", aura: "is", atom: BigInt("0x" + n2) };
        }
        if (R.if.test(e2)) return { type: "dime", aura: "if", atom: e2.slice(1).split(".").reduce(((n2, t2, e3) => n2 + (BigInt(t2) << BigInt(8 * (3 - e3)))), 0n) };
        if ("~" === e2[1] && (R.rd.test(e2) || R.rh.test(e2) || R.rq.test(e2)) || R.rs.test(e2)) {
          let n2, t2 = 0;
          for (; "~" === e2[t2 + 1]; ) t2++;
          switch (t2) {
            case 0:
              n2 = "rs";
              break;
            case 1:
              n2 = "rd";
              break;
            case 2:
              n2 = "rh";
              break;
            case 3:
              n2 = "rq";
              break;
            default:
              throw new Error("parsing invalid @r*");
          }
          return { type: "dime", aura: n2, atom: q(n2[1], e2) };
        }
        if ("~" === e2[1] && R.q.test(e2)) {
          const n2 = (function(n3) {
            try {
              const t2 = (function(n4) {
                const t3 = n4.slice(2).split("-"), e3 = (n5) => {
                  if (n5 < 0) throw new Error("malformed @q");
                  return n5.toString(16).padStart(2, "0");
                }, r3 = t3.map(((n5, t4) => {
                  let r4 = (function(n6, t5) {
                    return [t5.slice(0, 3), t5.slice(3)];
                  })(0, n5);
                  return "" === r4[1] && 0 === t4 ? e3(E.indexOf(r4[0])) : e3(C.indexOf(r4[0])) + e3(E.indexOf(r4[1]));
                }));
                return BigInt("0x" + (0 === n4.length ? "00" : r3.join("")));
              })(n3);
              return t2;
            } catch (n4) {
              return null;
            }
          })(e2);
          return null === n2 ? null : { type: "dime", aura: "q", atom: n2 };
        }
        if ("_" === e2[1] && /^\.(_([0-9a-zA-Z\-\.]|~\-|~~)+)*__$/.test(e2)) {
          const n2 = e2.slice(1, -2).split("_").slice(1).map(((n3) => J(n3 = n3.replaceAll("~-", "_").replaceAll("~~", "~"))));
          return n2.some(((n3) => null === n3)) ? null : { type: "many", list: n2 };
        }
        return null;
      }
      if ("~" === r2) {
        if ("~" === e2) return { type: "dime", aura: "n", atom: 0n };
        if (R.da.test(e2)) return { type: "dime", aura: "da", atom: n(e2) };
        if (R.dr.test(e2)) return { type: "dime", aura: "dr", atom: t(e2) };
        if (R.p.test(e2)) {
          const n2 = (function(n3) {
            if (!v.test(n3) || !j(n3)) return null;
            const t2 = S(n3);
            return n3 === $2(t2) ? t2 : null;
          })(e2);
          return null === n2 ? null : { type: "dime", aura: "p", atom: n2 };
        }
        return "." === e2[1] && R.ta.test(e2) ? { type: "dime", aura: "ta", atom: Q(e2.slice(2)) } : "~" === e2[1] && R.t.test(e2) ? { type: "dime", aura: "t", atom: Q(L(e2.slice(2))) } : "-" === e2[1] && R.c.test(e2) ? /^~\-~[0-9a-f]+\.$/.test(e2) ? { type: "dime", aura: "c", atom: BigInt("0x" + e2.slice(3, -1)) } : { type: "dime", aura: "c", atom: Q(L(e2.slice(2))) } : "0" === e2[1] && /^~0[0-9a-v]+$/.test(e2) ? { type: "blob", jam: X(5, W, e2.slice(2)) } : null;
      }
      return null;
    }
    function K(n2) {
      switch (n2.slice(0, 2)) {
        case "0b":
          return R.ub.test(n2) ? { aura: "ub", atom: BigInt(n2.replaceAll(".", "")) } : null;
        case "0c":
          return console.log("aura-js: @uc parsing unsupported (bisk)"), null;
        case "0i":
          return R.ui.test(n2) ? { aura: "ui", atom: BigInt(n2.slice(2)) } : null;
        case "0x":
          return R.ux.test(n2) ? { aura: "ux", atom: BigInt(n2.replaceAll(".", "")) } : null;
        case "0v":
          return R.uv.test(n2) ? { aura: "uv", atom: X(5, W, n2.slice(2)) } : null;
        case "0w":
          return R.uw.test(n2) ? { aura: "uw", atom: X(6, V2, n2.slice(2)) } : null;
        default:
          return R.ud.test(n2) ? { aura: "ud", atom: BigInt(n2.replaceAll(".", "")) } : null;
      }
    }
    function L(n2) {
      let t2 = "", e2 = 0;
      for (; e2 < n2.length; ) switch (n2[e2]) {
        case ".":
          t2 += " ", e2++;
          continue;
        case "~":
          switch (n2[++e2]) {
            case "~":
              t2 += "~", e2++;
              continue;
            case ".":
              t2 += ".", e2++;
              continue;
            default:
              let r2 = 0;
              do {
                r2 = r2 << 4 | Number.parseInt(n2[e2++], 16);
              } while ("." !== n2[e2]);
              t2 += String.fromCodePoint(r2), e2++;
              continue;
          }
        default:
          t2 += n2[e2++];
          continue;
      }
      return t2;
    }
    function Q(n2) {
      return (function(n3) {
        if (0 === n3.length) return 0n;
        if ("undefined" != typeof Buffer) return BigInt("0x" + Buffer.from(n3.reverse()).toString("hex"));
        let t2, e2 = [];
        for (var r2 = n3.length - 1; r2 >= 0; --r2) t2 = n3[r2], e2.push(t2 < 16 ? "0" + t2.toString(16) : t2.toString(16));
        return BigInt("0x" + e2.join(""));
      })(new TextEncoder().encode(n2));
    }
    var V2 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~";
    var W = "0123456789abcdefghijklmnopqrstuv";
    function X(n2, t2, e2) {
      let r2 = 0n;
      const a2 = BigInt(n2);
      for (; "" !== e2; ) "." !== e2[0] && (r2 = (r2 << a2) + BigInt(t2.indexOf(e2[0]))), e2 = e2.slice(1);
      return r2;
    }
    var Y = nn2;
    function nn2(n2, t2) {
      return tn({ type: "dime", aura: n2, atom: t2 });
    }
    function tn(n2) {
      switch (n2.type) {
        case "blob":
          return "~0" + n2.jam.toString(32);
        case "many":
          return "." + n2.list.reduce(((n3, t2) => n3 + "_" + tn(t2).replaceAll("~", "~~").replaceAll("_", "~-")), "") + "__";
        case "dime":
          switch (n2.aura[0]) {
            case "c":
              return n2.atom < 0x7fn ? "~-" + rn2(String.fromCharCode(Number(n2.atom))) : "~-~" + n2.atom.toString(16) + ".";
            case "d":
              switch (n2.aura[1]) {
                case "a":
                  return (function(n3) {
                    const { pos: t3, year: e2, month: r2, time: i2 } = (function(n4) {
                      const t4 = p(n4), [e3, r3, i3] = (function(n5) {
                        let t5 = 0n, e4 = 0n, r4 = false;
                        t5 = n5 / l, (n5 %= l) < d + 1n ? r4 = true : (r4 = false, e4 = 1n, e4 += (n5 -= d + 1n) / d, n5 %= d);
                        let a2 = 400n * t5 + 100n * e4, i4 = true;
                        for (; 1 == i4; ) {
                          let t6 = r4 ? 366n : 365n;
                          if (n5 < t6) {
                            i4 = false;
                            let t7 = true, e5 = 0n;
                            for (; t7; ) {
                              let t8 = BigInt((r4 ? f : o)[Number(e5)]);
                              if (n5 < t8) return [a2, e5 + 1n, n5 + 1n];
                              e5 += 1n, n5 -= t8;
                            }
                          } else a2 += 1n, n5 -= t6, r4 = a2 % 4n === 0n;
                        }
                        return [0n, 0n, 0n];
                      })(t4.day);
                      t4.day = i3;
                      const u3 = e3 > a;
                      return { pos: u3, year: u3 ? e3 - a : a + 1n - e3, month: r3, time: t4 };
                    })(n3);
                    let u2 = `~${e2}${t3 ? "" : "-"}.${r2}.${i2.day}`;
                    return 0n === i2.hour && 0n === i2.minute && 0n === i2.second && 0 === i2.ms.length || (u2 += `..${i2.hour.toString().padStart(2, "0")}.${i2.minute.toString().padStart(2, "0")}.${i2.second.toString().padStart(2, "0")}`, 0 !== i2.ms.length && (u2 += `..${i2.ms.map(((n4) => n4.toString(16).padStart(4, "0"))).join(".")}`)), u2;
                  })(n2.atom);
                case "r":
                  return (function(n3) {
                    if (0n === n3) return "~s0";
                    const { day: t3, hour: e2, minute: r2, second: a2, ms: i2 } = p(n3);
                    let o2 = [];
                    return 0n !== t3 && o2.push("d" + t3.toString()), 0n !== e2 && o2.push("h" + e2.toString()), 0n !== r2 && o2.push("m" + r2.toString()), 0n !== a2 && o2.push("s" + a2.toString()), 0 !== i2.length && (0 === o2.length && o2.push("s0"), o2.push("." + i2.map(((n4) => n4.toString(16).padStart(4, "0"))).join("."))), "~" + o2.join(".");
                  })(n2.atom);
                default:
                  return en2(n2.atom);
              }
            case "f":
              switch (n2.atom) {
                case 0n:
                  return ".y";
                case 1n:
                  return ".n";
                default:
                  return en2(n2.atom);
              }
            case "n":
              return "~";
            case "i":
              switch (n2.aura[1]) {
                case "f":
                  return "." + fn(n2.atom, 1, 4, 10);
                case "s":
                  return "." + fn(n2.atom, 2, 8, 16);
                default:
                  return en2(n2.atom);
              }
            case "p":
              return $2(n2.atom);
            case "q":
              return (function(n3) {
                const t3 = n3.toString(16), e2 = t3.length, r2 = Buffer.from(t3.padStart(e2 + e2 % 2, "0"), "hex"), a2 = r2.length % 2 != 0 && r2.length > 1 ? [[r2[0]]].concat(_(Array.from(r2.slice(1)), 2)) : _(Array.from(r2), 2);
                return a2.reduce(((n4, t4) => {
                  return n4 + (".~" === n4 ? "" : "-") + ((e3 = t4).length % 2 != 0 && a2.length > 1 ? void 0 === (r3 = e3)[1] ? E[r3[0]] : C[r3[0]] + E[r3[1]] : ((n5) => void 0 === n5[1] ? E[n5[0]] : C[n5[0]] + E[n5[1]])(e3));
                  var e3, r3;
                }), ".~");
              })(n2.atom);
            case "r":
              switch (n2.aura[1]) {
                case "d":
                  return F("d", n2.atom);
                case "h":
                  return F("h", n2.atom);
                case "q":
                  return F("q", n2.atom);
                case "s":
                  return F("s", n2.atom);
                default:
                  return en2(n2.atom);
              }
            case "u":
              switch (n2.aura[1]) {
                case "c":
                  throw new Error("aura-js: @uc rendering unsupported");
                case "b":
                  return "0b" + on2(n2.atom.toString(2), 4);
                case "i":
                  return "0i" + n2.atom.toString(10).padStart(1, "0");
                case "x":
                  return "0x" + on2(n2.atom.toString(16), 4);
                case "v":
                  return "0v" + on2(n2.atom.toString(32), 5);
                case "w":
                  return "0w" + on2((function(n3, t3, e2) {
                    if (0n === e2) return t3[0];
                    let r2 = "";
                    const a2 = BigInt(6);
                    for (; 0n !== e2; ) r2 = t3[Number(BigInt.asUintN(6, e2))] + r2, e2 >>= a2;
                    return r2;
                  })(0, an, n2.atom), 5);
                default:
                  return on2(n2.atom.toString(10), 3);
              }
            case "s":
              const t2 = 1n & n2.atom;
              return n2.atom = t2 + (n2.atom >> 1n), n2.aura = n2.aura.replace("s", "u"), (0n === t2 ? "--" : "-") + tn(n2);
            case "t":
              return "a" === n2.aura[1] ? "s" === n2.aura[2] ? un(n2.atom) : "~." + un(n2.atom) : "~~" + rn2(un(n2.atom));
            default:
              return en2(n2.atom);
          }
      }
    }
    function en2(n2) {
      return "0x" + (function(n3, t2) {
        return t2.toString(16).padStart(1, "0");
      })(0, n2);
    }
    function rn2(n2) {
      let t2 = "";
      for (let e2 = 0; e2 < n2.length; e2 += 1) {
        const r2 = n2[e2];
        let a2 = "";
        switch (r2) {
          case " ":
            a2 = ".";
            break;
          case ".":
            a2 = "~.";
            break;
          case "~":
            a2 = "~~";
            break;
          default: {
            const t3 = n2.codePointAt(e2);
            if (!t3) break;
            t3 > 65535 && (e2 += 1), a2 = t3 >= 97 && t3 <= 122 || t3 >= 48 && t3 <= 57 || "-" === r2 ? r2 : `~${t3.toString(16)}.`;
          }
        }
        t2 += a2;
      }
      return t2;
    }
    var an = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~";
    function on2(n2, t2) {
      return n2.replace(new RegExp(`(?=(?:.{${t2}})+$)(?!^)`, "g"), ".");
    }
    function fn(n2, t2, e2, r2) {
      void 0 === r2 && (r2 = 10);
      let a2 = "";
      const i2 = 8n * BigInt(t2), o2 = (1n << i2) - 1n;
      for (; e2-- > 0; ) "" !== a2 && (a2 = "." + a2), a2 = (n2 & o2).toString(r2) + a2, n2 >>= i2;
      return a2;
    }
    function un(n2) {
      return new TextDecoder("utf-8").decode((function(n3) {
        if (0n === n3) return new Uint8Array(0);
        const t2 = n3.toString(16), e2 = t2.length % 2 == 0 ? t2 : "0" + t2, r2 = new Uint8Array(e2.length / 2);
        for (let n4 = 0; n4 < e2.length; n4 += 2) {
          const t3 = e2.slice(n4, n4 + 2), a2 = parseInt(t3, 16) << 24 >> 24;
          r2[n4 / 2] = a2;
        }
        return r2;
      })(n2).reverse());
    }
    var sn = { toSeconds: function(n2) {
      const { day: t2, hour: e2, minute: r2, second: a2 } = p(n2);
      return 60n * (60n * (24n * t2 + e2) + r2) + a2;
    }, fromSeconds: function(n2) {
      return m({ day: 0n, hour: 0n, minute: 0n, second: n2, ms: [] });
    } };
    var cn = { cite: function(n2) {
      let t2;
      return t2 = "bigint" == typeof n2 ? n2 : z(n2), t2 <= 0xffffffffn ? $2(t2) : t2 <= 0xffffffffffffffffn ? $2(0xffffffffn & t2).replace("-", "^") : $2(BigInt("0x" + t2.toString(16).slice(0, 4))) + "_" + $2(0xffffn & t2).slice(1);
    }, sein: function(n2) {
      let t2;
      t2 = "bigint" == typeof n2 ? n2 : z(n2);
      let e2 = A(t2);
      const r2 = "czar" === e2 ? t2 : "king" === e2 ? 0xffn & t2 : "duke" === e2 ? 0xffffn & t2 : "earl" === e2 ? 0xffffffffn & t2 : 0xffffn & t2;
      return "bigint" == typeof n2 ? r2 : $2(r2);
    }, clan: A, kind: function(n2) {
      return k(A(n2));
    }, rankToSize: k, sizeToRank: function(n2) {
      switch (n2) {
        case "galaxy":
          return "czar";
        case "star":
          return "king";
        case "planet":
          return "duke";
        case "moon":
          return "earl";
        case "comet":
          return "pawn";
      }
    } };
    exports.da = { toUnix: function(n2) {
      return Math.round(Number(1000n * (r / 2000n + (n2 - e)) / r));
    }, fromUnix: function(n2) {
      const t2 = BigInt(n2) * r / 1000n;
      return e + t2;
    } }, exports.dr = sn, exports.nuck = J, exports.p = cn, exports.parse = T, exports.rend = tn, exports.render = Y, exports.scot = nn2, exports.slav = D, exports.slaw = H, exports.tryParse = G, exports.valid = function(n2, t2) {
      return null !== H(n2, t2);
    };
  }
});

// ../api-beta/node_modules/@urbit/aura/dist/aura.cjs.development.js
var require_aura_cjs_development = __commonJS({
  "../api-beta/node_modules/@urbit/aura/dist/aura.cjs.development.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parseDa(x) {
      let pos = true;
      let [date, time, ms] = x.split("..");
      time = time || "0.0.0";
      ms = ms || "0000";
      let [yer, month, day] = date.slice(1).split(".");
      if (yer.at(-1) === "-") {
        yer = yer.slice(0, -1);
        pos = false;
      }
      const [hour, minute, sec] = time.split(".");
      const millis = ms.split(".").map((m) => BigInt("0x" + m));
      return year({
        pos,
        year: BigInt(yer),
        month: BigInt(month),
        time: {
          day: BigInt(day),
          hour: BigInt(hour),
          minute: BigInt(minute),
          second: BigInt(sec),
          ms: millis
        }
      });
    }
    function parseDr(x) {
      const rop = {
        day: 0n,
        hour: 0n,
        minute: 0n,
        second: 0n,
        ms: []
      };
      x = x.slice(1);
      let [time, ms] = x.split("..");
      ms = ms || "0000";
      rop.ms = ms.split(".").map((m) => BigInt("0x" + m));
      time.split(".").forEach((a) => {
        switch (a[0]) {
          case "d":
            rop.day += BigInt(a.slice(1));
            break;
          case "h":
            rop.hour += BigInt(a.slice(1));
            break;
          case "m":
            rop.minute += BigInt(a.slice(1));
            break;
          case "s":
            rop.second += BigInt(a.slice(1));
            break;
          default:
            throw new Error("bad dr: " + x);
        }
      });
      ms = ms || "0000";
      return yule(rop);
    }
    function renderDa(x) {
      const {
        pos,
        year: year2,
        month,
        time
      } = yore(x);
      let out = `~${year2}${pos ? "" : "-"}.${month}.${time.day}`;
      if (time.hour !== 0n || time.minute !== 0n || time.second !== 0n || time.ms.length !== 0) {
        out = out + `..${time.hour.toString().padStart(2, "0")}.${time.minute.toString().padStart(2, "0")}.${time.second.toString().padStart(2, "0")}`;
        if (time.ms.length !== 0) {
          out = out + `..${time.ms.map((x2) => x2.toString(16).padStart(4, "0")).join(".")}`;
        }
      }
      return out;
    }
    function renderDr(x) {
      if (x === 0n) return "~s0";
      const {
        day,
        hour,
        minute,
        second,
        ms
      } = yell(x);
      let out = [];
      if (day !== 0n) out.push("d" + day.toString());
      if (hour !== 0n) out.push("h" + hour.toString());
      if (minute !== 0n) out.push("m" + minute.toString());
      if (second !== 0n) out.push("s" + second.toString());
      if (ms.length !== 0) {
        if (out.length === 0) out.push("s0");
        out.push("." + ms.map((x2) => x2.toString(16).padStart(4, "0")).join("."));
      }
      return "~" + out.join(".");
    }
    function toUnix(da2) {
      const offset = DA_SECOND / 2000n;
      const epochAdjusted = offset + (da2 - DA_UNIX_EPOCH);
      return Math.round(Number(epochAdjusted * 1000n / DA_SECOND));
    }
    function fromUnix(unix) {
      const timeSinceEpoch = BigInt(unix) * DA_SECOND / 1000n;
      return DA_UNIX_EPOCH + timeSinceEpoch;
    }
    function fromSeconds(seconds) {
      return yule({
        day: 0n,
        hour: 0n,
        minute: 0n,
        second: seconds,
        ms: []
      });
    }
    function toSeconds(dr2) {
      const {
        day,
        hour,
        minute,
        second
      } = yell(dr2);
      return ((day * 24n + hour) * 60n + minute) * 60n + second;
    }
    var DA_UNIX_EPOCH = /* @__PURE__ */ BigInt("170141184475152167957503069145530368000");
    var DA_SECOND = /* @__PURE__ */ BigInt("18446744073709551616");
    var EPOCH = /* @__PURE__ */ BigInt("292277024400");
    function isLeapYear(year2) {
      return year2 % 4n === 0n && year2 % 100n !== 0n || year2 % 400n === 0n;
    }
    var MOH_YO = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var MOY_YO = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var DAY_YO = 86400n;
    var HOR_YO = 3600n;
    var MIT_YO = 60n;
    var ERA_YO = 146097n;
    var CET_YO = 36524n;
    function year(det) {
      const yer = det.pos ? EPOCH + BigInt(det.year) : EPOCH - (BigInt(det.year) - 1n);
      const day = (() => {
        let cah = isLeapYear(yer) ? MOY_YO : MOH_YO;
        let d = det.time.day - 1n;
        let m = det.month - 1n;
        while (m !== 0n) {
          const [first, ...rest] = cah;
          d = d + BigInt(first);
          m = m - 1n;
          cah = rest;
        }
        let loop = true;
        let y = yer;
        while (loop == true) {
          if (y % 4n !== 0n) {
            y = y - 1n;
            d = d + (isLeapYear(y) ? 366n : 365n);
          } else if (y % 100n !== 0n) {
            y = y - 4n;
            d = d + (isLeapYear(y) ? 1461n : 1460n);
          } else if (y % 400n !== 0n) {
            y = y - 100n;
            d = d + (isLeapYear(y) ? 36525n : 36524n);
          } else {
            let eras = y / 400n;
            d = d + eras * (4n * 36524n + 1n);
            loop = false;
          }
        }
        return d;
      })();
      det.time.day = day;
      return yule(det.time);
    }
    function yule(rip) {
      let sec = rip.second + DAY_YO * rip.day + HOR_YO * rip.hour + MIT_YO * rip.minute;
      let ms = rip.ms;
      let fac = 0n;
      let muc = 3n;
      while (ms.length !== 0) {
        const [first, ...rest] = ms;
        fac = fac + (first << 16n * muc);
        ms = rest;
        muc -= 1n;
      }
      return fac | sec << 64n;
    }
    function yell(x) {
      let sec = x >> 64n;
      const milliMask = BigInt("0xffffffffffffffff");
      const millis = milliMask & x;
      const ms = millis.toString(16).padStart(16, "0").match(/.{4}/g).map((x2) => BigInt("0x" + x2));
      while (ms.at(-1) === 0n) {
        ms.pop();
      }
      let day = sec / DAY_YO;
      sec = sec % DAY_YO;
      let hor = sec / HOR_YO;
      sec = sec % HOR_YO;
      let mit = sec / MIT_YO;
      sec = sec % MIT_YO;
      return {
        ms,
        day,
        minute: mit,
        hour: hor,
        second: sec
      };
    }
    function yall(day) {
      let era = 0n;
      let cet = 0n;
      let lep = false;
      era = day / ERA_YO;
      day = day % ERA_YO;
      if (day < CET_YO + 1n) {
        lep = true;
      } else {
        lep = false;
        cet = 1n;
        day = day - (CET_YO + 1n);
        cet = cet + day / CET_YO;
        day = day % CET_YO;
      }
      let yer = era * 400n + cet * 100n;
      let loop = true;
      while (loop == true) {
        let dis = lep ? 366n : 365n;
        if (!(day < dis)) {
          yer = yer + 1n;
          day = day - dis;
          lep = yer % 4n === 0n;
        } else {
          loop = false;
          let inner = true;
          let mot = 0n;
          while (inner) {
            let cah = lep ? MOY_YO : MOH_YO;
            let zis = BigInt(cah[Number(mot)]);
            if (day < zis) {
              return [yer, mot + 1n, day + 1n];
            }
            mot = mot + 1n;
            day = day - zis;
          }
        }
      }
      return [0n, 0n, 0n];
    }
    function yore(x) {
      const time = yell(x);
      const [y, month, d] = yall(time.day);
      time.day = d;
      const pos = y > EPOCH;
      const year2 = pos ? y - EPOCH : EPOCH + 1n - y;
      return {
        pos,
        year: year2,
        month,
        time
      };
    }
    var muk = (syd, key) => {
      const lo = Number(key & 0xffn);
      const hi = Number((key & 0xff00n) / 256n);
      const kee = String.fromCharCode(lo) + String.fromCharCode(hi);
      return BigInt(murmurhash3_32_gc(kee, syd));
    };
    var murmurhash3_32_gc = (key, seed) => {
      let remainder, bytes, h1, h1b, c1, c2, k1, i;
      remainder = key.length & 3;
      bytes = key.length - remainder;
      h1 = seed;
      c1 = 3432918353;
      c2 = 461845907;
      i = 0;
      while (i < bytes) {
        k1 = key.charCodeAt(i) & 255 | (key.charCodeAt(++i) & 255) << 8 | (key.charCodeAt(++i) & 255) << 16 | (key.charCodeAt(++i) & 255) << 24;
        ++i;
        k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
        h1 ^= k1;
        h1 = h1 << 13 | h1 >>> 19;
        h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
        h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
      }
      k1 = 0;
      switch (remainder) {
        case 3:
          k1 ^= (key.charCodeAt(i + 2) & 255) << 16;
        case 2:
          k1 ^= (key.charCodeAt(i + 1) & 255) << 8;
        case 1:
          k1 ^= key.charCodeAt(i) & 255;
          k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
          k1 = k1 << 15 | k1 >>> 17;
          k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
          h1 ^= k1;
      }
      h1 ^= key.length;
      h1 ^= h1 >>> 16;
      h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
      h1 ^= h1 >>> 13;
      h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
      h1 ^= h1 >>> 16;
      return h1 >>> 0;
    };
    var F = (j, arg) => {
      const raku = [3077398253, 3995603712, 2243735041, 1261992695];
      return muk(raku[j], arg);
    };
    var fein = (arg) => {
      const loop = (pyn) => {
        const lo = pyn & 0xffffffffn;
        const hi = pyn & 0xffffffff00000000n;
        return pyn >= 0x10000n && pyn <= 0xffffffffn ? 0x10000n + feis(pyn - 0x10000n) : pyn >= 0x100000000n && pyn <= 0xffffffffffffffffn ? hi | loop(lo) : pyn;
      };
      return loop(arg);
    };
    var fynd = (arg) => {
      const loop = (cry) => {
        const lo = cry & 0xffffffffn;
        const hi = cry & 0xffffffff00000000n;
        return cry >= 0x10000n && cry <= 0xffffffffn ? 0x10000n + tail(cry - 0x10000n) : cry >= 0x100000000n && cry <= 0xffffffffffffffffn ? hi | loop(lo) : cry;
      };
      return loop(BigInt(arg));
    };
    var feis = (arg) => Fe(4, 65535n, 65536n, 0xffffffffn, F, arg);
    var Fe = (r, a, b, k, f, m) => {
      const c = fe(r, a, b, f, m);
      return c < k ? c : fe(r, a, b, f, c);
    };
    var fe = (r, a, b, f, m) => {
      const loop = (j, ell, arr) => {
        if (j > r) {
          return r % 2 !== 0 ? a * arr + ell : arr === a ? a * arr + ell : a * ell + arr;
        } else {
          const eff = BigInt(f(j - 1, arr).toString());
          const tmp = j % 2 !== 0 ? (ell + eff) % a : (ell + eff) % b;
          return loop(j + 1, arr, tmp);
        }
      };
      const L = m % a;
      const R = m / a;
      return loop(1, L, R);
    };
    var tail = (arg) => Fen(4, 65535n, 65536n, 0xffffffffn, F, arg);
    var Fen = (r, a, b, k, f, m) => {
      const c = fen(r, a, b, f, m);
      return c < k ? c : fen(r, a, b, f, c);
    };
    var fen = (r, a, b, f, m) => {
      const loop = (j, ell, arr) => {
        if (j < 1) {
          return a * arr + ell;
        } else {
          const eff = f(j - 1, ell);
          const tmp = j % 2 !== 0 ? (arr + a - eff % a) % a : (arr + b - eff % b) % b;
          return loop(j - 1, tmp, ell);
        }
      };
      const ahh = r % 2 !== 0 ? m / a : m % a;
      const ale = r % 2 !== 0 ? m % a : m / a;
      const L = ale === a ? ahh : ale;
      const R = ale === a ? ale : ahh;
      return loop(r, L, R);
    };
    var ob = {
      F,
      fe,
      Fe,
      feis,
      fein,
      fen,
      Fen,
      tail,
      fynd
    };
    var regexP = /^~([a-z]{3}|([a-z]{6}(\-[a-z]{6}){0,3}(\-(\-[a-z]{6}){4})*))$/;
    function parseP(str) {
      const syls = patp2syls(str);
      const syl2bin = (idx) => {
        return idx.toString(2).padStart(8, "0");
      };
      const addr = syls.reduce((acc, syl, idx) => idx % 2 !== 0 || syls.length === 1 ? acc + syl2bin(suffixes.indexOf(syl)) : acc + syl2bin(prefixes.indexOf(syl)), "");
      const num = BigInt("0b" + addr);
      return ob.fynd(num);
    }
    function parseValidP(str) {
      if (!regexP.test(str) || !validSyllables(str)) return null;
      const res = parseP(str);
      return str === renderP(res) ? res : null;
    }
    function renderP(num) {
      const sxz = ob.fein(num);
      const dyx = Math.ceil(sxz.toString(16).length / 2);
      const dyy = Math.ceil(sxz.toString(16).length / 4);
      function loop(tsxz, timp, trep) {
        const log = tsxz & 0xffffn;
        const pre2 = prefixes[Number(log >> 8n)];
        const suf2 = suffixes[Number(log & 0xffn)];
        const etc = timp & 3 ? "-" : timp === 0 ? "" : "--";
        const res = pre2 + suf2 + etc + trep;
        return timp === dyy ? trep : loop(tsxz >> 16n, timp + 1, res);
      }
      return "~" + (dyx <= 1 ? suffixes[Number(sxz)] : loop(sxz, 0, ""));
    }
    function isValidP(str) {
      return regexP.test(str) && validSyllables(str) && str === renderP(parseP(str));
    }
    function clan(who) {
      let num;
      if (typeof who === "bigint") num = who;
      else num = checkedParseP(who);
      return num <= 0xffn ? "czar" : num <= 0xffffn ? "king" : num <= 0xffffffffn ? "duke" : num <= 0xffffffffffffffffn ? "earl" : "pawn";
    }
    function kind(who) {
      return rankToSize(clan(who));
    }
    function rankToSize(rank) {
      switch (rank) {
        case "czar":
          return "galaxy";
        case "king":
          return "star";
        case "duke":
          return "planet";
        case "earl":
          return "moon";
        case "pawn":
          return "comet";
      }
    }
    function sizeToRank(size) {
      switch (size) {
        case "galaxy":
          return "czar";
        case "star":
          return "king";
        case "planet":
          return "duke";
        case "moon":
          return "earl";
        case "comet":
          return "pawn";
      }
    }
    function sein(who) {
      let num;
      if (typeof who === "bigint") num = who;
      else num = checkedParseP(who);
      let mir = clan(num);
      const res = mir === "czar" ? num : mir === "king" ? num & 0xffn : mir === "duke" ? num & 0xffffn : mir === "earl" ? num & 0xffffffffn : num & 0xffffn;
      if (typeof who === "bigint") return res;
      else return renderP(res);
    }
    function cite(who) {
      let num;
      if (typeof who === "bigint") num = who;
      else num = checkedParseP(who);
      if (num <= 0xffffffffn) {
        return renderP(num);
      } else if (num <= 0xffffffffffffffffn) {
        return renderP(num & 0xffffffffn).replace("-", "^");
      } else {
        return renderP(BigInt("0x" + num.toString(16).slice(0, 4))) + "_" + renderP(num & 0xffffn).slice(1);
      }
    }
    function checkedParseP(str) {
      if (!isValidP(str)) throw new Error("invalid @p literal: " + str);
      return parseP(str);
    }
    var pre = `
dozmarbinwansamlitsighidfidlissogdirwacsabwissibrigsoldopmodfoglidhopdardorlorhodfolrintogsilmirholpaslacrovlivdalsatlibtabhanticpidtorbolfosdotlosdilforpilramtirwintadbicdifrocwidbisdasmidloprilnardapmolsanlocnovsitnidtipsicropwitnatpanminritpodmottamtolsavposnapnopsomfinfonbanmorworsipronnorbotwicsocwatdolmagpicdavbidbaltimtasmalligsivtagpadsaldivdactansidfabtarmonranniswolmispallasdismaprabtobrollatlonnodnavfignomnibpagsopralbilhaddocridmocpacravripfaltodtiltinhapmicfanpattaclabmogsimsonpinlomrictapfirhasbosbatpochactidhavsaplindibhosdabbitbarracparloddosbortochilmactomdigfilfasmithobharmighinradmashalraglagfadtopmophabnilnosmilfopfamdatnoldinhatnacrisfotribhocnimlarfitwalrapsarnalmoslandondanladdovrivbacpollaptalpitnambonrostonfodponsovnocsorlavmatmipfip`;
    var suf = `
zodnecbudwessevpersutletfulpensytdurwepserwylsunrypsyxdyrnuphebpeglupdepdysputlughecryttyvsydnexlunmeplutseppesdelsulpedtemledtulmetwenbynhexfebpyldulhetmevruttylwydtepbesdexsefwycburderneppurrysrebdennutsubpetrulsynregtydsupsemwynrecmegnetsecmulnymtevwebsummutnyxrextebfushepbenmuswyxsymselrucdecwexsyrwetdylmynmesdetbetbeltuxtugmyrpelsyptermebsetdutdegtexsurfeltudnuxruxrenwytnubmedlytdusnebrumtynseglyxpunresredfunrevrefmectedrusbexlebduxrynnumpyxrygryxfeptyrtustyclegnemfermertenlusnussyltecmexpubrymtucfyllepdebbermughuttunbylsudpemdevlurdefbusbeprunmelpexdytbyttyplevmylwedducfurfexnulluclennerlexrupnedlecrydlydfenwelnydhusrelrudneshesfetdesretdunlernyrsebhulrylludremlysfynwerrycsugnysnyllyndyndemluxfedsedbecmunlyrtesmudnytbyrsenwegfyrmurtelreptegpecnelnevfes`;
    var prefixes = /* @__PURE__ */ pre.match(/.{1,3}/g);
    var suffixes = /* @__PURE__ */ suf.match(/.{1,3}/g);
    function patp2syls(name) {
      return name.replace(/[\^~-]/g, "").match(/.{1,3}/g) || [];
    }
    function validSyllables(name) {
      const syls = patp2syls(name);
      return !(syls.length % 2 !== 0 && syls.length !== 1) && syls.every((syl, index) => (
        //  invalid syllables
        index % 2 !== 0 || syls.length === 1 ? suffixes.includes(syl) : prefixes.includes(syl)
      ));
    }
    function renderQ(num) {
      const hex = num.toString(16);
      const lex = hex.length;
      const buf = Buffer.from(hex.padStart(lex + lex % 2, "0"), "hex");
      const chunked = buf.length % 2 !== 0 && buf.length > 1 ? [[buf[0]]].concat(chunk(Array.from(buf.slice(1)), 2)) : chunk(Array.from(buf), 2);
      const prefixName = (byts) => byts[1] === void 0 ? suffixes[byts[0]] : prefixes[byts[0]] + suffixes[byts[1]];
      const name = (byts) => byts[1] === void 0 ? suffixes[byts[0]] : prefixes[byts[0]] + suffixes[byts[1]];
      const alg = (pair2) => pair2.length % 2 !== 0 && chunked.length > 1 ? prefixName(pair2) : name(pair2);
      return chunked.reduce((acc, elem) => acc + (acc === ".~" ? "" : "-") + alg(elem), ".~");
    }
    function parseQ(str) {
      const chunks = str.slice(2).split("-");
      const dec2hex = (dec2) => {
        if (dec2 < 0) throw new Error("malformed @q");
        return dec2.toString(16).padStart(2, "0");
      };
      const splat = chunks.map((chunk2, i) => {
        let syls = splitAt(3, chunk2);
        return syls[1] === "" && i === 0 ? dec2hex(suffixes.indexOf(syls[0])) : dec2hex(prefixes.indexOf(syls[0])) + dec2hex(suffixes.indexOf(syls[1]));
      });
      return BigInt("0x" + (str.length === 0 ? "00" : splat.join("")));
    }
    function parseValidQ(str) {
      try {
        const num = parseQ(str);
        return num;
      } catch (e) {
        return null;
      }
    }
    function chunk(arr, size) {
      let chunk2 = [];
      let newArray = [chunk2];
      for (let i = 0; i < arr.length; i++) {
        if (chunk2.length < size) {
          chunk2.push(arr[i]);
        } else {
          chunk2 = [arr[i]];
          newArray.push(chunk2);
        }
      }
      return newArray;
    }
    function splitAt(index, str) {
      return [str.slice(0, index), str.slice(index)];
    }
    function parseR(per, str) {
      per = getPrecision(per);
      return parse$1(str.slice(per.l.length), per.w, per.p);
    }
    function renderR(per, r) {
      per = getPrecision(per);
      return per.l + rCo(deconstruct(r, BigInt(per.w), BigInt(per.p)));
    }
    function getPrecision(per) {
      if (per === "h") return {
        w: 5,
        p: 10,
        l: ".~~"
      };
      else if (per === "s") return {
        w: 8,
        p: 23,
        l: "."
      };
      else if (per === "d") return {
        w: 11,
        p: 52,
        l: ".~"
      };
      else if (per === "q") return {
        w: 15,
        p: 112,
        l: ".~~~"
      };
      else return per;
    }
    function bitMask(bits2) {
      return 2n ** bits2 - 1n;
    }
    function parse$1(str, w, p2) {
      if (str === "nan") return makeNaN(w, p2);
      if (str === "inf") return makeInf(true, w, p2);
      if (str === "-inf") return makeInf(false, w, p2);
      let i = 0;
      let sign = true;
      if (str[i] === "-") {
        sign = false;
        i++;
      }
      let int = "";
      while (str[i] !== "." && str[i] !== "e" && str[i] !== void 0) {
        int += str[i++];
      }
      if (str[i] === ".") i++;
      let fra = "";
      while (str[i] !== "e" && str[i] !== void 0) {
        fra += str[i++];
      }
      if (str[i] === "e") i++;
      let expSign = true;
      if (str[i] === "-") {
        expSign = false;
        i++;
      }
      let exp = "";
      while (str[i] !== void 0) {
        exp += str[i++];
      }
      return BigInt("0b" + makeFloat(w, p2, sign, int, fra, expSign, Number(exp)));
    }
    function makeNaN(w, p2) {
      return bitMask(BigInt(w + 1)) << BigInt(p2 - 1);
    }
    function makeInf(s, w, p2) {
      return bitMask(BigInt(s ? w : w + 1)) << BigInt(p2);
    }
    function makeFloat(w, p2, sign, intPart, floatPart, expSign, exp) {
      if (exp !== 0) {
        if (expSign) {
          intPart = intPart + floatPart.padEnd(exp, "0").slice(0, exp);
          floatPart = floatPart.slice(exp);
        } else {
          floatPart = intPart.padStart(exp, "0").slice(-exp) + floatPart;
          intPart = intPart.slice(0, -exp);
        }
      }
      return construct(p2, w, sign, BigInt(intPart), BigInt(floatPart.length), BigInt(floatPart));
    }
    function construct(precisionBits, exponentBits, sign, intPart, floatDits, floatPart) {
      function exceed(x) {
        console.warn(x);
        return 1;
      }
      const bias = 2 ** (exponentBits - 1) - 1, minExp = -bias + 1, maxExp = bias, minUnnormExp = minExp - precisionBits, len = 2 * bias + 1 + precisionBits + 3, bin = new Array(len), denom = 10n ** floatDits;
      var exp = 0, signal = !sign, i, lastBit, rounded, j, result, n;
      for (i = len; i; bin[--i] = 0) ;
      for (i = bias + 2; intPart && i; bin[--i] = intPart & 1n, intPart = intPart >> 1n) ;
      for (i = bias + 1; floatPart > 0n && i < len; (bin[++i] = (floatPart *= 2n) >= denom ? 1 : 0) && (floatPart = floatPart - denom)) ;
      for (i = -1; ++i < len && !bin[i]; ) ;
      if (bin[(lastBit = precisionBits - 1 + (i = (exp = bias + 1 - i) >= minExp && exp <= maxExp ? i + 1 : bias + 1 - (exp = minExp - 1))) + 1]) {
        if (!(rounded = bin[lastBit])) for (j = lastBit + 2; !rounded && j < len; rounded = bin[j++]) ;
        for (j = lastBit + 1; rounded && --j >= 0; (bin[j] = (!bin[j] ? 1 : 0) - 0) && (rounded = 0)) ;
      }
      for (i = i - 2 < 0 ? -1 : i - 3; ++i < len && !bin[i]; ) ;
      (exp = bias + 1 - i) >= minExp && exp <= maxExp ? ++i : exp < minExp && (exp != bias + 1 - len && exp < minUnnormExp && exceed("r.construct underflow"), i = bias + 1 - (exp = minExp - 1));
      intPart && (exceed(intPart ? "r.construct overflow" : "r.construct"), exp = maxExp + 1, i = bias + 2);
      for (n = Math.abs(exp + bias), j = exponentBits + 1, result = ""; --j; result = (n & 1) + result, n = n >>= 1) ;
      return (signal ? "1" : "0") + result + bin.slice(i, i + precisionBits).join("");
    }
    function rCo(a) {
      if (a.t === "n") return "nan";
      if (a.t === "i") return a.s ? "inf" : "-inf";
      let e;
      if (a.e - 4 > 0) {
        e = 1;
      } else if (a.e + 2 < 0) {
        e = 1;
      } else {
        e = a.e + 1;
        a.e = 0;
      }
      return (a.s ? "" : "-") + edCo(e, a.a) + (a.e === 0 ? "" : "e" + a.e.toString());
    }
    function edCo(exp, int) {
      const dig = Math.abs(exp);
      if (exp <= 0) {
        return "0." + "".padEnd(dig, "0") + int;
      } else {
        const len = int.length;
        if (dig >= len) return int + "".padEnd(dig - len, "0");
        return int.slice(0, dig) + "." + int.slice(dig);
      }
    }
    function deconstruct(float, exponentBits, precisionBits) {
      const mantissaMask = bitMask(precisionBits);
      const exponentMask = bitMask(exponentBits);
      const floatMantissa = float & mantissaMask;
      const floatExponent = float >> BigInt(precisionBits) & exponentMask;
      const sign = (float >> BigInt(exponentBits + precisionBits) & 1n) === 0n;
      let mantissa, exponent, mantissaHighBitIdx, unequalMargins;
      if (floatExponent === exponentMask) {
        if (floatMantissa === 0n) return {
          t: "i",
          s: sign
        };
        return {
          t: "n"
        };
      } else if (floatExponent !== 0n) {
        mantissa = 1n << BigInt(precisionBits) | floatMantissa;
        exponent = floatExponent - (2n ** (exponentBits - 1n) - 1n) - precisionBits;
        mantissaHighBitIdx = Number(precisionBits);
        unequalMargins = floatExponent !== 1n && floatMantissa === 0n;
      } else {
        mantissa = floatMantissa;
        exponent = 1n - (2n ** (exponentBits - 1n) - 1n) - precisionBits;
        mantissaHighBitIdx = mantissa.toString(2).length - 1;
        unequalMargins = false;
      }
      const buf = (2n ** precisionBits).toString(10).length + 1;
      const res = dragon4(mantissa, Number(exponent), mantissaHighBitIdx, unequalMargins, "unique", 0, buf);
      return {
        t: "d",
        s: sign,
        e: res.outExponent,
        a: res.digits
      };
    }
    function dragon4(mantissa, exponent, mantissaHighBitIdx, hasUnequalMargins, cutoffMode, cutoffNumber, bufferSize) {
      const bexponent = BigInt(exponent);
      let pCurDigit = 0;
      let outBuffer = new Array(bufferSize).fill("0");
      let outExponent = 0;
      if (mantissa === 0n) {
        outBuffer[0] = "0";
        outExponent = 0;
        return {
          digits: outBuffer.slice(0, 1).join(""),
          outExponent
        };
      }
      let scale;
      let scaledValue;
      let scaledMarginLow;
      let scaledMarginHigh;
      if (hasUnequalMargins) {
        if (exponent > 0) {
          scaledValue = 4n * mantissa;
          scaledValue <<= bexponent;
          scale = 4n;
          scaledMarginLow = 1n << bexponent;
          scaledMarginHigh = 1n << bexponent + 1n;
        } else {
          scaledValue = 4n * mantissa;
          scale = 1n << -bexponent + 2n;
          scaledMarginLow = 1n;
          scaledMarginHigh = 2n;
        }
      } else {
        if (exponent > 0) {
          scaledValue = 2n * mantissa;
          scaledValue <<= bexponent;
          scale = 2n;
          scaledMarginLow = 1n << bexponent;
          scaledMarginHigh = scaledMarginLow;
        } else {
          scaledValue = 2n * mantissa;
          scale = 1n << BigInt(-exponent + 1);
          scaledMarginLow = 1n;
          scaledMarginHigh = scaledMarginLow;
        }
      }
      const log10_2 = 0.3010299956639812;
      let digitExponent = Math.ceil((mantissaHighBitIdx + exponent) * log10_2 - 0.69);
      if (cutoffMode === "fractionLength" && digitExponent <= -cutoffNumber) {
        digitExponent = -cutoffNumber + 1;
      }
      if (digitExponent > 0) {
        scale *= BigInt(10) ** BigInt(digitExponent);
      } else if (digitExponent < 0) {
        const pow10 = BigInt(10) ** BigInt(-digitExponent);
        scaledValue *= pow10;
        scaledMarginLow *= pow10;
        if (scaledMarginHigh !== scaledMarginLow) {
          scaledMarginHigh *= scaledMarginLow;
        }
      }
      if (scaledValue >= scale) {
        digitExponent += 1;
      } else {
        scaledValue *= 10n;
        scaledMarginLow *= 10n;
        if (scaledMarginHigh !== scaledMarginLow) scaledMarginHigh *= 10n;
      }
      let cutoffExponent = digitExponent - bufferSize;
      if (cutoffMode === "totalLength") {
        let desired = digitExponent - cutoffNumber;
        if (desired > cutoffExponent) cutoffExponent = desired;
      } else if (cutoffMode === "fractionLength") {
        let desired = -cutoffNumber;
        if (desired > cutoffExponent) cutoffExponent = desired;
      }
      outExponent = digitExponent - 1;
      let low = false;
      let high = false;
      let outputDigit = 0;
      if (cutoffMode === "unique") {
        while (true) {
          digitExponent -= 1;
          outputDigit = Number(scaledValue / scale);
          scaledValue = scaledValue % scale;
          let scaledValueHigh = scaledValue + scaledMarginHigh;
          low = scaledValue < scaledMarginLow;
          high = scaledValueHigh > scale;
          if (low || high || digitExponent === cutoffExponent) break;
          outBuffer[pCurDigit] = String.fromCharCode("0".charCodeAt(0) + outputDigit);
          pCurDigit += 1;
          scaledValue *= 10n;
          scaledMarginLow *= 10n;
          if (scaledMarginHigh !== scaledMarginLow) scaledMarginHigh *= 10n;
        }
      } else {
        low = false;
        high = false;
        while (true) {
          digitExponent -= 1;
          outputDigit = Number(scaledValue / scale);
          scaledValue = scaledValue % scale;
          if (scaledValue === 0n || digitExponent === cutoffExponent) break;
          outBuffer[pCurDigit] = String.fromCharCode("0".charCodeAt(0) + outputDigit);
          pCurDigit += 1;
          scaledValue *= 10n;
        }
      }
      let roundDown = low;
      if (low === high) {
        scaledValue *= 2n;
        let compare = scaledValue < scale ? -1 : scaledValue > scale ? 1 : 0;
        roundDown = compare < 0;
        if (compare === 0) roundDown = (outputDigit & 1) === 0;
      }
      if (roundDown) {
        outBuffer[pCurDigit] = String.fromCharCode("0".charCodeAt(0) + outputDigit);
        pCurDigit += 1;
      } else {
        if (outputDigit === 9) {
          while (true) {
            if (pCurDigit === 0) {
              outBuffer[pCurDigit] = "1";
              pCurDigit += 1;
              outExponent += 1;
              break;
            }
            pCurDigit -= 1;
            if (outBuffer[pCurDigit] !== "9") {
              outBuffer[pCurDigit] = String.fromCharCode(outBuffer[pCurDigit].charCodeAt(0) + 1);
              pCurDigit += 1;
              break;
            }
          }
        } else {
          outBuffer[pCurDigit] = String.fromCharCode("0".charCodeAt(0) + outputDigit + 1);
          pCurDigit += 1;
        }
      }
      const digits = outBuffer.slice(0, pCurDigit).join("");
      return {
        digits,
        outExponent
      };
    }
    function integerRegex(a, b, c, d, e) {
      if (e === void 0) {
        e = false;
      }
      const pre2 = d === 0 ? b : `${b}${c}{0,${d - 1}}`;
      const aft = d === 0 ? `${c}*` : `(\\.${c}{${d}})*`;
      return new RegExp(`^${e ? "\\-\\-?" : ""}${a}(0|${pre2}${aft})$`);
    }
    function floatRegex(a) {
      return new RegExp(`^\\.~{${a}}(nan|\\-?(inf|(0|[1-9][0-9]*)(\\.[0-9]+)?(e\\-?(0|[1-9][0-9]*))?))$`);
    }
    var regex = {
      "c": /^~\-((~[0-9a-fA-F]+\.)|(~[~\.])|[0-9a-z\-\._])*$/,
      "da": /^~(0|[1-9][0-9]*)\-?\.0*([1-9]|1[0-2])\.0*[1-9][0-9]*(\.\.([0-9]+)\.([0-9]+)\.([0-9]+)(\.(\.[0-9a-f]{4})+)?)?$/,
      "dr": /^~((d|h|m|s)(0|[1-9][0-9]*))(\.(d|h|m|s)(0|[1-9][0-9]*))*(\.(\.[0-9a-f]{4})+)?$/,
      "f": /^\.(y|n)$/,
      "if": /^(\.(0|[1-9][0-9]{0,2})){4}$/,
      "is": /^(\.(0|[1-9a-fA-F][0-9a-fA-F]{0,3})){8}$/,
      "n": /^~$/,
      "p": regexP,
      "q": /^\.~(([a-z]{3}|[a-z]{6})(\-[a-z]{6})*)$/,
      "rd": /* @__PURE__ */ floatRegex(1),
      "rh": /* @__PURE__ */ floatRegex(2),
      "rq": /* @__PURE__ */ floatRegex(3),
      "rs": /* @__PURE__ */ floatRegex(0),
      "sb": /* @__PURE__ */ integerRegex("0b", "1", "[01]", 4, true),
      "sd": /* @__PURE__ */ integerRegex("", "[1-9]", "[0-9]", 3, true),
      "si": /* @__PURE__ */ integerRegex("0i", "[1-9]", "[0-9]", 0, true),
      "sv": /* @__PURE__ */ integerRegex("0v", "[1-9a-v]", "[0-9a-v]", 5, true),
      "sw": /* @__PURE__ */ integerRegex("0w", "[1-9a-zA-Z~-]", "[0-9a-zA-Z~-]", 5, true),
      "sx": /* @__PURE__ */ integerRegex("0x", "[1-9a-f]", "[0-9a-f]", 4, true),
      "t": /^~~((~[0-9a-fA-F]+\.)|(~[~\.])|[0-9a-z\-\._])*$/,
      "ta": /^~\.[0-9a-z\-\.~_]*$/,
      "tas": /^[a-z][a-z0-9\-]*$/,
      "ub": /* @__PURE__ */ integerRegex("0b", "1", "[01]", 4),
      "ud": /* @__PURE__ */ integerRegex("", "[1-9]", "[0-9]", 3),
      "ui": /* @__PURE__ */ integerRegex("0i", "[1-9]", "[0-9]", 0),
      "uv": /* @__PURE__ */ integerRegex("0v", "[1-9a-v]", "[0-9a-v]", 5),
      "uw": /* @__PURE__ */ integerRegex("0w", "[1-9a-zA-Z~-]", "[0-9a-zA-Z~-]", 5),
      "ux": /* @__PURE__ */ integerRegex("0x", "[1-9a-f]", "[0-9a-f]", 4)
    };
    var parse = slav;
    function slav(aura, str) {
      const out = slaw(aura, str);
      if (!out) {
        throw new Error("slav: failed to parse @" + aura + " from string: " + str);
      }
      return out;
    }
    var tryParse = slaw;
    function slaw(aura, str) {
      if (aura in regex && !regex[aura].test(str)) {
        return null;
      }
      const coin = nuck(str);
      if (coin && coin.type === "dime" && coin.aura === aura) {
        return coin.atom;
      } else {
        return null;
      }
    }
    function valid(aura, str) {
      return slaw(aura, str) !== null;
    }
    function nuck(str) {
      if (str === "") return null;
      const c = str[0];
      if (c >= "a" && c <= "z") {
        if (regex["tas"].test(str)) {
          return {
            type: "dime",
            aura: "tas",
            atom: stringToCord(str)
          };
        } else {
          return null;
        }
      } else if (c >= "0" && c <= "9") {
        const dim = bisk(str);
        if (!dim) {
          return null;
        } else {
          return {
            type: "dime",
            ...dim
          };
        }
      } else if (c === "-") {
        let pos = true;
        if (str[1] == "-") {
          str = str.slice(2);
        } else {
          str = str.slice(1);
          pos = false;
        }
        const dim = bisk(str);
        if (dim) {
          if (pos) {
            dim.atom = 2n * dim.atom;
          } else if (dim.atom !== 0n) {
            dim.atom = 1n + 2n * (dim.atom - 1n);
          }
          return {
            type: "dime",
            aura: dim.aura.replace("u", "s"),
            atom: dim.atom
          };
        } else {
          return null;
        }
      } else if (c === ".") {
        if (str === ".y") {
          return {
            type: "dime",
            aura: "f",
            atom: 0n
          };
        } else if (str === ".n") {
          return {
            type: "dime",
            aura: "f",
            atom: 1n
          };
        } else if (regex["is"].test(str)) {
          const value = str.slice(1).split(".").reduce((a, v) => a + v.padStart(4, "0"), "");
          return {
            type: "dime",
            aura: "is",
            atom: BigInt("0x" + value)
          };
        } else if (regex["if"].test(str)) {
          const value = str.slice(1).split(".").reduce((a, v, i) => a + (BigInt(v) << BigInt(8 * (3 - i))), 0n);
          return {
            type: "dime",
            aura: "if",
            atom: value
          };
        } else if (str[1] === "~" && (regex["rd"].test(str) || regex["rh"].test(str) || regex["rq"].test(str)) || regex["rs"].test(str)) {
          let precision = 0;
          while (str[precision + 1] === "~") precision++;
          let aura;
          switch (precision) {
            case 0:
              aura = "rs";
              break;
            case 1:
              aura = "rd";
              break;
            case 2:
              aura = "rh";
              break;
            case 3:
              aura = "rq";
              break;
            default:
              throw new Error("parsing invalid @r*");
          }
          return {
            type: "dime",
            aura,
            atom: parseR(aura[1], str)
          };
        } else if (str[1] === "~" && regex["q"].test(str)) {
          const num = parseValidQ(str);
          if (num === null) return null;
          return {
            type: "dime",
            aura: "q",
            atom: num
          };
        } else if (str[1] === "_" && /^\.(_([0-9a-zA-Z\-\.]|~\-|~~)+)*__$/.test(str)) {
          const coins = str.slice(1, -2).split("_").slice(1).map((s) => {
            s = s.replaceAll("~-", "_").replaceAll("~~", "~");
            return nuck(s);
          });
          if (coins.some((c2) => c2 === null)) {
            return null;
          } else {
            return {
              type: "many",
              list: coins
            };
          }
        }
        return null;
      } else if (c === "~") {
        if (str === "~") {
          return {
            type: "dime",
            aura: "n",
            atom: 0n
          };
        } else {
          if (regex["da"].test(str)) {
            return {
              type: "dime",
              aura: "da",
              atom: parseDa(str)
            };
          } else if (regex["dr"].test(str)) {
            return {
              type: "dime",
              aura: "dr",
              atom: parseDr(str)
            };
          } else if (regex["p"].test(str)) {
            const res = parseValidP(str);
            if (res === null) return null;
            return {
              type: "dime",
              aura: "p",
              atom: res
            };
          } else if (str[1] === "." && regex["ta"].test(str)) {
            return {
              type: "dime",
              aura: "ta",
              atom: stringToCord(str.slice(2))
            };
          } else if (str[1] === "~" && regex["t"].test(str)) {
            return {
              type: "dime",
              aura: "t",
              atom: stringToCord(decodeString(str.slice(2)))
            };
          } else if (str[1] === "-" && regex["c"].test(str)) {
            if (/^~\-~[0-9a-f]+\.$/.test(str)) {
              return {
                type: "dime",
                aura: "c",
                atom: BigInt("0x" + str.slice(3, -1))
              };
            }
            return {
              type: "dime",
              aura: "c",
              atom: stringToCord(decodeString(str.slice(2)))
            };
          }
        }
        if (str[1] === "0" && /^~0[0-9a-v]+$/.test(str)) {
          return {
            type: "blob",
            jam: slurp(5, UV_ALPHABET, str.slice(2))
          };
        }
        return null;
      }
      return null;
    }
    function bisk(str) {
      switch (str.slice(0, 2)) {
        case "0b":
          if (regex["ub"].test(str)) {
            return {
              aura: "ub",
              atom: BigInt(str.replaceAll(".", ""))
            };
          } else {
            return null;
          }
        case "0c":
          console.log("aura-js: @uc parsing unsupported (bisk)");
          return null;
        case "0i":
          if (regex["ui"].test(str)) {
            return {
              aura: "ui",
              atom: BigInt(str.slice(2))
            };
          } else {
            return null;
          }
        case "0x":
          if (regex["ux"].test(str)) {
            return {
              aura: "ux",
              atom: BigInt(str.replaceAll(".", ""))
            };
          } else {
            return null;
          }
        case "0v":
          if (regex["uv"].test(str)) {
            return {
              aura: "uv",
              atom: slurp(5, UV_ALPHABET, str.slice(2))
            };
          } else {
            return null;
          }
        case "0w":
          if (regex["uw"].test(str)) {
            return {
              aura: "uw",
              atom: slurp(6, UW_ALPHABET$1, str.slice(2))
            };
          } else {
            return null;
          }
        default:
          if (regex["ud"].test(str)) {
            return {
              aura: "ud",
              atom: BigInt(str.replaceAll(".", ""))
            };
          } else {
            return null;
          }
      }
    }
    function decodeString(str) {
      let out = "";
      let i = 0;
      while (i < str.length) {
        switch (str[i]) {
          case ".":
            out = out + " ";
            i++;
            continue;
          case "~":
            switch (str[++i]) {
              case "~":
                out = out + "~";
                i++;
                continue;
              case ".":
                out = out + ".";
                i++;
                continue;
              default:
                let char = 0;
                do {
                  char = char << 4 | Number.parseInt(str[i++], 16);
                } while (str[i] !== ".");
                out = out + String.fromCodePoint(char);
                i++;
                continue;
            }
          default:
            out = out + str[i++];
            continue;
        }
      }
      return out;
    }
    function stringToCord(str) {
      return bytesToBigint2(new TextEncoder().encode(str));
    }
    var UW_ALPHABET$1 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~";
    var UV_ALPHABET = "0123456789abcdefghijklmnopqrstuv";
    function slurp(bits2, alphabet, str) {
      let out = 0n;
      const bbits = BigInt(bits2);
      while (str !== "") {
        if (str[0] !== ".") {
          out = (out << bbits) + BigInt(alphabet.indexOf(str[0]));
        }
        str = str.slice(1);
      }
      return out;
    }
    function bytesToBigint2(bytes) {
      if (bytes.length === 0) return 0n;
      if (typeof Buffer !== "undefined") return BigInt("0x" + Buffer.from(bytes.reverse()).toString("hex"));
      let byt, parts = [];
      for (var i = bytes.length - 1; i >= 0; --i) {
        byt = bytes[i];
        parts.push(byt < 16 ? "0" + byt.toString(16) : byt.toString(16));
      }
      const num = BigInt("0x" + parts.join(""));
      return num;
    }
    var render = scot;
    function scot(aura, atom) {
      return rend({
        type: "dime",
        aura,
        atom
      });
    }
    function rend(coin) {
      switch (coin.type) {
        case "blob":
          return "~0" + coin.jam.toString(32);
        case "many":
          return "." + coin.list.reduce((acc, item) => {
            return acc + "_" + wack(rend(item));
          }, "") + "__";
        case "dime":
          switch (coin.aura[0]) {
            case "c":
              if (coin.atom < 0x7fn) return "~-" + encodeString(String.fromCharCode(Number(coin.atom)));
              else return "~-~" + coin.atom.toString(16) + ".";
            case "d":
              switch (coin.aura[1]) {
                case "a":
                  return renderDa(coin.atom);
                case "r":
                  return renderDr(coin.atom);
                default:
                  return zco(coin.atom);
              }
            case "f":
              switch (coin.atom) {
                case 0n:
                  return ".y";
                case 1n:
                  return ".n";
                default:
                  return zco(coin.atom);
              }
            case "n":
              return "~";
            case "i":
              switch (coin.aura[1]) {
                case "f":
                  return "." + spite(coin.atom, 1, 4, 10);
                case "s":
                  return "." + spite(coin.atom, 2, 8, 16);
                default:
                  return zco(coin.atom);
              }
            case "p":
              return renderP(coin.atom);
            case "q":
              return renderQ(coin.atom);
            case "r":
              switch (coin.aura[1]) {
                case "d":
                  return renderR("d", coin.atom);
                case "h":
                  return renderR("h", coin.atom);
                case "q":
                  return renderR("q", coin.atom);
                case "s":
                  return renderR("s", coin.atom);
                default:
                  return zco(coin.atom);
              }
            case "u":
              switch (coin.aura[1]) {
                case "c":
                  throw new Error("aura-js: @uc rendering unsupported");
                //TODO;
                case "b":
                  return "0b" + split(coin.atom.toString(2), 4);
                case "i":
                  return "0i" + dco(1, coin.atom);
                case "x":
                  return "0x" + split(coin.atom.toString(16), 4);
                case "v":
                  return "0v" + split(coin.atom.toString(32), 5);
                case "w":
                  return "0w" + split(blend(6, UW_ALPHABET, coin.atom), 5);
                default:
                  return split(coin.atom.toString(10), 3);
              }
            case "s":
              const end2 = coin.atom & 1n;
              coin.atom = end2 + (coin.atom >> 1n);
              coin.aura = coin.aura.replace("s", "u");
              return (end2 === 0n ? "--" : "-") + rend(coin);
            case "t":
              if (coin.aura[1] === "a") {
                if (coin.aura[2] === "s") {
                  return cordToString(coin.atom);
                } else {
                  return "~." + cordToString(coin.atom);
                }
              } else {
                return "~~" + encodeString(cordToString(coin.atom));
              }
            default:
              return zco(coin.atom);
          }
      }
    }
    function dco(lent, atom) {
      return atom.toString(10).padStart(lent, "0");
    }
    function xco(lent, atom) {
      return atom.toString(16).padStart(lent, "0");
    }
    function zco(atom) {
      return "0x" + xco(1, atom);
    }
    function wack(str) {
      return str.replaceAll("~", "~~").replaceAll("_", "~-");
    }
    function encodeString(string) {
      let out = "";
      for (let i = 0; i < string.length; i += 1) {
        const char = string[i];
        let add2 = "";
        switch (char) {
          case " ":
            add2 = ".";
            break;
          case ".":
            add2 = "~.";
            break;
          case "~":
            add2 = "~~";
            break;
          default: {
            const codePoint = string.codePointAt(i);
            if (!codePoint) break;
            if (codePoint > 65535) i += 1;
            if (codePoint >= 97 && codePoint <= 122 || // a-z
            codePoint >= 48 && codePoint <= 57 || // 0-9
            char === "-") {
              add2 = char;
            } else {
              add2 = `~${codePoint.toString(16)}.`;
            }
          }
        }
        out += add2;
      }
      return out;
    }
    var UW_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-~";
    function blend(bits2, alphabet, atom) {
      if (atom === 0n) return alphabet[0];
      let out = "";
      const bbits = BigInt(bits2);
      while (atom !== 0n) {
        out = alphabet[Number(BigInt.asUintN(bits2, atom))] + out;
        atom = atom >> bbits;
      }
      return out;
    }
    function split(str, group) {
      return str.replace(new RegExp(`(?=(?:.{${group}})+$)(?!^)`, "g"), ".");
    }
    function spite(atom, bytes, groups, base) {
      if (base === void 0) {
        base = 10;
      }
      let out = "";
      const size = 8n * BigInt(bytes);
      const mask = (1n << size) - 1n;
      while (groups-- > 0) {
        if (out !== "") out = "." + out;
        out = (atom & mask).toString(base) + out;
        atom = atom >> size;
      }
      return out;
    }
    function cordToString(atom) {
      return new TextDecoder("utf-8").decode(atomToByteArray(atom).reverse());
    }
    function atomToByteArray(atom) {
      if (atom === 0n) return new Uint8Array(0);
      const hexString = atom.toString(16);
      const paddedHexString = hexString.length % 2 === 0 ? hexString : "0" + hexString;
      const arrayLength = paddedHexString.length / 2;
      const int8Array = new Uint8Array(arrayLength);
      for (let i = 0; i < paddedHexString.length; i += 2) {
        const hexSubstring = paddedHexString.slice(i, i + 2);
        const signedInt = parseInt(hexSubstring, 16) << 24 >> 24;
        int8Array[i / 2] = signedInt;
      }
      return int8Array;
    }
    var da = {
      toUnix,
      fromUnix
    };
    var dr = {
      toSeconds,
      fromSeconds
    };
    var p = {
      cite,
      sein,
      clan,
      kind,
      rankToSize,
      sizeToRank
    };
    exports.da = da;
    exports.dr = dr;
    exports.nuck = nuck;
    exports.p = p;
    exports.parse = parse;
    exports.rend = rend;
    exports.render = render;
    exports.scot = scot;
    exports.slav = slav;
    exports.slaw = slaw;
    exports.tryParse = tryParse;
    exports.valid = valid;
  }
});

// ../api-beta/node_modules/@urbit/aura/dist/index.js
var require_dist = __commonJS({
  "../api-beta/node_modules/@urbit/aura/dist/index.js"(exports, module) {
    "use strict";
    if (process.env.NODE_ENV === "production") {
      module.exports = require_aura_cjs_production_min();
    } else {
      module.exports = require_aura_cjs_development();
    }
  }
});

// ../api-beta/node_modules/big-integer/BigInteger.js
var require_BigInteger = __commonJS({
  "../api-beta/node_modules/big-integer/BigInteger.js"(exports, module) {
    var bigInt = (function(undefined2) {
      "use strict";
      var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
      var supportsNativeBigInt = typeof BigInt === "function";
      function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined") return Integer[0];
        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
      }
      function BigInteger(value, sign) {
        this.value = value;
        this.sign = sign;
        this.isSmall = false;
      }
      BigInteger.prototype = Object.create(Integer.prototype);
      function SmallInteger(value) {
        this.value = value;
        this.sign = value < 0;
        this.isSmall = true;
      }
      SmallInteger.prototype = Object.create(Integer.prototype);
      function NativeBigInt(value) {
        this.value = value;
      }
      NativeBigInt.prototype = Object.create(Integer.prototype);
      function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
      }
      function smallToArray(n) {
        if (n < 1e7)
          return [n];
        if (n < 1e14)
          return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
      }
      function arrayToSmall(arr) {
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
          switch (length) {
            case 0:
              return 0;
            case 1:
              return arr[0];
            case 2:
              return arr[0] + arr[1] * BASE;
            default:
              return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
          }
        }
        return arr;
      }
      function trim(v) {
        var i2 = v.length;
        while (v[--i2] === 0) ;
        v.length = i2 + 1;
      }
      function createArray(length) {
        var x = new Array(length);
        var i2 = -1;
        while (++i2 < length) {
          x[i2] = 0;
        }
        return x;
      }
      function truncate(n) {
        if (n > 0) return Math.floor(n);
        return Math.ceil(n);
      }
      function add2(a, b) {
        var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum, i2;
        for (i2 = 0; i2 < l_b; i2++) {
          sum = a[i2] + b[i2] + carry;
          carry = sum >= base ? 1 : 0;
          r[i2] = sum - carry * base;
        }
        while (i2 < l_a) {
          sum = a[i2] + carry;
          carry = sum === base ? 1 : 0;
          r[i2++] = sum - carry * base;
        }
        if (carry > 0) r.push(carry);
        return r;
      }
      function addAny(a, b) {
        if (a.length >= b.length) return add2(a, b);
        return add2(b, a);
      }
      function addSmall(a, carry) {
        var l = a.length, r = new Array(l), base = BASE, sum, i2;
        for (i2 = 0; i2 < l; i2++) {
          sum = a[i2] - base + carry;
          carry = Math.floor(sum / base);
          r[i2] = sum - carry * base;
          carry += 1;
        }
        while (carry > 0) {
          r[i2++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r;
      }
      BigInteger.prototype.add = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
          return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
      };
      BigInteger.prototype.plus = BigInteger.prototype.add;
      SmallInteger.prototype.add = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          if (isPrecise(a + b)) return new SmallInteger(a + b);
          b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
      };
      SmallInteger.prototype.plus = SmallInteger.prototype.add;
      NativeBigInt.prototype.add = function(v) {
        return new NativeBigInt(this.value + parseValue(v).value);
      };
      NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
      function subtract(a, b) {
        var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i2, difference;
        for (i2 = 0; i2 < b_l; i2++) {
          difference = a[i2] - borrow - b[i2];
          if (difference < 0) {
            difference += base;
            borrow = 1;
          } else borrow = 0;
          r[i2] = difference;
        }
        for (i2 = b_l; i2 < a_l; i2++) {
          difference = a[i2] - borrow;
          if (difference < 0) difference += base;
          else {
            r[i2++] = difference;
            break;
          }
          r[i2] = difference;
        }
        for (; i2 < a_l; i2++) {
          r[i2] = a[i2];
        }
        trim(r);
        return r;
      }
      function subtractAny(a, b, sign) {
        var value;
        if (compareAbs(a, b) >= 0) {
          value = subtract(a, b);
        } else {
          value = subtract(b, a);
          sign = !sign;
        }
        value = arrayToSmall(value);
        if (typeof value === "number") {
          if (sign) value = -value;
          return new SmallInteger(value);
        }
        return new BigInteger(value, sign);
      }
      function subtractSmall(a, b, sign) {
        var l = a.length, r = new Array(l), carry = -b, base = BASE, i2, difference;
        for (i2 = 0; i2 < l; i2++) {
          difference = a[i2] + carry;
          carry = Math.floor(difference / base);
          difference %= base;
          r[i2] = difference < 0 ? difference + base : difference;
        }
        r = arrayToSmall(r);
        if (typeof r === "number") {
          if (sign) r = -r;
          return new SmallInteger(r);
        }
        return new BigInteger(r, sign);
      }
      BigInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
          return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
      };
      BigInteger.prototype.minus = BigInteger.prototype.subtract;
      SmallInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
      };
      SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
      NativeBigInt.prototype.subtract = function(v) {
        return new NativeBigInt(this.value - parseValue(v).value);
      };
      NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
      BigInteger.prototype.negate = function() {
        return new BigInteger(this.value, !this.sign);
      };
      SmallInteger.prototype.negate = function() {
        var sign = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign;
        return small;
      };
      NativeBigInt.prototype.negate = function() {
        return new NativeBigInt(-this.value);
      };
      BigInteger.prototype.abs = function() {
        return new BigInteger(this.value, false);
      };
      SmallInteger.prototype.abs = function() {
        return new SmallInteger(Math.abs(this.value));
      };
      NativeBigInt.prototype.abs = function() {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
      };
      function multiplyLong(a, b) {
        var a_l = a.length, b_l = b.length, l = a_l + b_l, r = createArray(l), base = BASE, product, carry, i2, a_i, b_j;
        for (i2 = 0; i2 < a_l; ++i2) {
          a_i = a[i2];
          for (var j = 0; j < b_l; ++j) {
            b_j = b[j];
            product = a_i * b_j + r[i2 + j];
            carry = Math.floor(product / base);
            r[i2 + j] = product - carry * base;
            r[i2 + j + 1] += carry;
          }
        }
        trim(r);
        return r;
      }
      function multiplySmall(a, b) {
        var l = a.length, r = new Array(l), base = BASE, carry = 0, product, i2;
        for (i2 = 0; i2 < l; i2++) {
          product = a[i2] * b + carry;
          carry = Math.floor(product / base);
          r[i2] = product - carry * base;
        }
        while (carry > 0) {
          r[i2++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r;
      }
      function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0) r.push(0);
        return r.concat(x);
      }
      function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);
        if (n <= 30) return multiplyLong(x, y);
        n = Math.ceil(n / 2);
        var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
        var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
      }
      function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
      }
      BigInteger.prototype.multiply = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, sign = this.sign !== n.sign, abs;
        if (n.isSmall) {
          if (b === 0) return Integer[0];
          if (b === 1) return this;
          if (b === -1) return this.negate();
          abs = Math.abs(b);
          if (abs < BASE) {
            return new BigInteger(multiplySmall(a, abs), sign);
          }
          b = smallToArray(abs);
        }
        if (useKaratsuba(a.length, b.length))
          return new BigInteger(multiplyKaratsuba(a, b), sign);
        return new BigInteger(multiplyLong(a, b), sign);
      };
      BigInteger.prototype.times = BigInteger.prototype.multiply;
      function multiplySmallAndArray(a, b, sign) {
        if (a < BASE) {
          return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
      }
      SmallInteger.prototype._multiplyBySmall = function(a) {
        if (isPrecise(a.value * this.value)) {
          return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
      };
      BigInteger.prototype._multiplyBySmall = function(a) {
        if (a.value === 0) return Integer[0];
        if (a.value === 1) return this;
        if (a.value === -1) return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
      };
      SmallInteger.prototype.multiply = function(v) {
        return parseValue(v)._multiplyBySmall(this);
      };
      SmallInteger.prototype.times = SmallInteger.prototype.multiply;
      NativeBigInt.prototype.multiply = function(v) {
        return new NativeBigInt(this.value * parseValue(v).value);
      };
      NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
      function square(a) {
        var l = a.length, r = createArray(l + l), base = BASE, product, carry, i2, a_i, a_j;
        for (i2 = 0; i2 < l; i2++) {
          a_i = a[i2];
          carry = 0 - a_i * a_i;
          for (var j = i2; j < l; j++) {
            a_j = a[j];
            product = 2 * (a_i * a_j) + r[i2 + j] + carry;
            carry = Math.floor(product / base);
            r[i2 + j] = product - carry * base;
          }
          r[i2 + l] = carry;
        }
        trim(r);
        return r;
      }
      BigInteger.prototype.square = function() {
        return new BigInteger(square(this.value), false);
      };
      SmallInteger.prototype.square = function() {
        var value = this.value * this.value;
        if (isPrecise(value)) return new SmallInteger(value);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
      };
      NativeBigInt.prototype.square = function(v) {
        return new NativeBigInt(this.value * this.value);
      };
      function divMod1(a, b) {
        var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i2, l, q;
        if (remainder.length <= a_l) remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
          quotientDigit = base - 1;
          if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
            quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
          }
          carry = 0;
          borrow = 0;
          l = divisor.length;
          for (i2 = 0; i2 < l; i2++) {
            carry += quotientDigit * divisor[i2];
            q = Math.floor(carry / base);
            borrow += remainder[shift + i2] - (carry - q * base);
            carry = q;
            if (borrow < 0) {
              remainder[shift + i2] = borrow + base;
              borrow = -1;
            } else {
              remainder[shift + i2] = borrow;
              borrow = 0;
            }
          }
          while (borrow !== 0) {
            quotientDigit -= 1;
            carry = 0;
            for (i2 = 0; i2 < l; i2++) {
              carry += remainder[shift + i2] - base + divisor[i2];
              if (carry < 0) {
                remainder[shift + i2] = carry + base;
                carry = 0;
              } else {
                remainder[shift + i2] = carry;
                carry = 1;
              }
            }
            borrow += carry;
          }
          result[shift] = quotientDigit;
        }
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
      }
      function divMod2(a, b) {
        var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
        while (a_l) {
          part.unshift(a[--a_l]);
          trim(part);
          if (compareAbs(part, b) < 0) {
            result.push(0);
            continue;
          }
          xlen = part.length;
          highx = part[xlen - 1] * base + part[xlen - 2];
          highy = b[b_l - 1] * base + b[b_l - 2];
          if (xlen > b_l) {
            highx = (highx + 1) * base;
          }
          guess = Math.ceil(highx / highy);
          do {
            check = multiplySmall(b, guess);
            if (compareAbs(check, part) <= 0) break;
            guess--;
          } while (guess);
          result.push(guess);
          part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
      }
      function divModSmall(value, lambda) {
        var length = value.length, quotient = createArray(length), base = BASE, i2, q, remainder, divisor;
        remainder = 0;
        for (i2 = length - 1; i2 >= 0; --i2) {
          divisor = remainder * base + value[i2];
          q = truncate(divisor / lambda);
          remainder = divisor - q * lambda;
          quotient[i2] = q | 0;
        }
        return [quotient, remainder | 0];
      }
      function divModAny(self2, v) {
        var value, n = parseValue(v);
        if (supportsNativeBigInt) {
          return [new NativeBigInt(self2.value / n.value), new NativeBigInt(self2.value % n.value)];
        }
        var a = self2.value, b = n.value;
        var quotient;
        if (b === 0) throw new Error("Cannot divide by zero");
        if (self2.isSmall) {
          if (n.isSmall) {
            return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
          }
          return [Integer[0], self2];
        }
        if (n.isSmall) {
          if (b === 1) return [self2, Integer[0]];
          if (b == -1) return [self2.negate(), Integer[0]];
          var abs = Math.abs(b);
          if (abs < BASE) {
            value = divModSmall(a, abs);
            quotient = arrayToSmall(value[0]);
            var remainder = value[1];
            if (self2.sign) remainder = -remainder;
            if (typeof quotient === "number") {
              if (self2.sign !== n.sign) quotient = -quotient;
              return [new SmallInteger(quotient), new SmallInteger(remainder)];
            }
            return [new BigInteger(quotient, self2.sign !== n.sign), new SmallInteger(remainder)];
          }
          b = smallToArray(abs);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1) return [Integer[0], self2];
        if (comparison === 0) return [Integer[self2.sign === n.sign ? 1 : -1], Integer[0]];
        if (a.length + b.length <= 200)
          value = divMod1(a, b);
        else value = divMod2(a, b);
        quotient = value[0];
        var qSign = self2.sign !== n.sign, mod = value[1], mSign = self2.sign;
        if (typeof quotient === "number") {
          if (qSign) quotient = -quotient;
          quotient = new SmallInteger(quotient);
        } else quotient = new BigInteger(quotient, qSign);
        if (typeof mod === "number") {
          if (mSign) mod = -mod;
          mod = new SmallInteger(mod);
        } else mod = new BigInteger(mod, mSign);
        return [quotient, mod];
      }
      BigInteger.prototype.divmod = function(v) {
        var result = divModAny(this, v);
        return {
          quotient: result[0],
          remainder: result[1]
        };
      };
      NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
      BigInteger.prototype.divide = function(v) {
        return divModAny(this, v)[0];
      };
      NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
        return new NativeBigInt(this.value / parseValue(v).value);
      };
      SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
      BigInteger.prototype.mod = function(v) {
        return divModAny(this, v)[1];
      };
      NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
        return new NativeBigInt(this.value % parseValue(v).value);
      };
      SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
      BigInteger.prototype.pow = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, value, x, y;
        if (b === 0) return Integer[1];
        if (a === 0) return Integer[0];
        if (a === 1) return Integer[1];
        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
          return Integer[0];
        }
        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
          if (isPrecise(value = Math.pow(a, b)))
            return new SmallInteger(truncate(value));
        }
        x = this;
        y = Integer[1];
        while (true) {
          if (b & true) {
            y = y.times(x);
            --b;
          }
          if (b === 0) break;
          b /= 2;
          x = x.square();
        }
        return y;
      };
      SmallInteger.prototype.pow = BigInteger.prototype.pow;
      NativeBigInt.prototype.pow = function(v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0) return Integer[1];
        if (a === _0) return Integer[0];
        if (a === _1) return Integer[1];
        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative()) return new NativeBigInt(_0);
        var x = this;
        var y = Integer[1];
        while (true) {
          if ((b & _1) === _1) {
            y = y.times(x);
            --b;
          }
          if (b === _0) break;
          b /= _2;
          x = x.square();
        }
        return y;
      };
      BigInteger.prototype.modPow = function(exp, mod) {
        exp = parseValue(exp);
        mod = parseValue(mod);
        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
        var r = Integer[1], base = this.mod(mod);
        if (exp.isNegative()) {
          exp = exp.multiply(Integer[-1]);
          base = base.modInv(mod);
        }
        while (exp.isPositive()) {
          if (base.isZero()) return Integer[0];
          if (exp.isOdd()) r = r.multiply(base).mod(mod);
          exp = exp.divide(2);
          base = base.square().mod(mod);
        }
        return r;
      };
      NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
      function compareAbs(a, b) {
        if (a.length !== b.length) {
          return a.length > b.length ? 1 : -1;
        }
        for (var i2 = a.length - 1; i2 >= 0; i2--) {
          if (a[i2] !== b[i2]) return a[i2] > b[i2] ? 1 : -1;
        }
        return 0;
      }
      BigInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall) return 1;
        return compareAbs(a, b);
      };
      SmallInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = Math.abs(this.value), b = n.value;
        if (n.isSmall) {
          b = Math.abs(b);
          return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
      };
      NativeBigInt.prototype.compareAbs = function(v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      BigInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (this.sign !== n.sign) {
          return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
          return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
      };
      BigInteger.prototype.compareTo = BigInteger.prototype.compare;
      SmallInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall) {
          return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
          return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
      };
      SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
      NativeBigInt.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
      BigInteger.prototype.equals = function(v) {
        return this.compare(v) === 0;
      };
      NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
      BigInteger.prototype.notEquals = function(v) {
        return this.compare(v) !== 0;
      };
      NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
      BigInteger.prototype.greater = function(v) {
        return this.compare(v) > 0;
      };
      NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
      BigInteger.prototype.lesser = function(v) {
        return this.compare(v) < 0;
      };
      NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
      BigInteger.prototype.greaterOrEquals = function(v) {
        return this.compare(v) >= 0;
      };
      NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
      BigInteger.prototype.lesserOrEquals = function(v) {
        return this.compare(v) <= 0;
      };
      NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
      BigInteger.prototype.isEven = function() {
        return (this.value[0] & 1) === 0;
      };
      SmallInteger.prototype.isEven = function() {
        return (this.value & 1) === 0;
      };
      NativeBigInt.prototype.isEven = function() {
        return (this.value & BigInt(1)) === BigInt(0);
      };
      BigInteger.prototype.isOdd = function() {
        return (this.value[0] & 1) === 1;
      };
      SmallInteger.prototype.isOdd = function() {
        return (this.value & 1) === 1;
      };
      NativeBigInt.prototype.isOdd = function() {
        return (this.value & BigInt(1)) === BigInt(1);
      };
      BigInteger.prototype.isPositive = function() {
        return !this.sign;
      };
      SmallInteger.prototype.isPositive = function() {
        return this.value > 0;
      };
      NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
      BigInteger.prototype.isNegative = function() {
        return this.sign;
      };
      SmallInteger.prototype.isNegative = function() {
        return this.value < 0;
      };
      NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
      BigInteger.prototype.isUnit = function() {
        return false;
      };
      SmallInteger.prototype.isUnit = function() {
        return Math.abs(this.value) === 1;
      };
      NativeBigInt.prototype.isUnit = function() {
        return this.abs().value === BigInt(1);
      };
      BigInteger.prototype.isZero = function() {
        return false;
      };
      SmallInteger.prototype.isZero = function() {
        return this.value === 0;
      };
      NativeBigInt.prototype.isZero = function() {
        return this.value === BigInt(0);
      };
      BigInteger.prototype.isDivisibleBy = function(v) {
        var n = parseValue(v);
        if (n.isZero()) return false;
        if (n.isUnit()) return true;
        if (n.compareAbs(2) === 0) return this.isEven();
        return this.mod(n).isZero();
      };
      NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
      function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit()) return false;
        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
        if (n.lesser(49)) return true;
      }
      function millerRabinTest(n, a) {
        var nPrev = n.prev(), b = nPrev, r = 0, d, t, i2, x;
        while (b.isEven()) b = b.divide(2), r++;
        next: for (i2 = 0; i2 < a.length; i2++) {
          if (n.lesser(a[i2])) continue;
          x = bigInt(a[i2]).modPow(b, n);
          if (x.isUnit() || x.equals(nPrev)) continue;
          for (d = r - 1; d != 0; d--) {
            x = x.square().mod(n);
            if (x.isUnit()) return false;
            if (x.equals(nPrev)) continue next;
          }
          return false;
        }
        return true;
      }
      BigInteger.prototype.isPrime = function(strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2) return isPrime;
        var n = this.abs();
        var bits2 = n.bitLength();
        if (bits2 <= 64)
          return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits2.toJSNumber();
        var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
        for (var a = [], i2 = 0; i2 < t; i2++) {
          a.push(bigInt(i2 + 2));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
      BigInteger.prototype.isProbablePrime = function(iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2) return isPrime;
        var n = this.abs();
        var t = iterations === undefined2 ? 5 : iterations;
        for (var a = [], i2 = 0; i2 < t; i2++) {
          a.push(bigInt.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
      BigInteger.prototype.modInv = function(n) {
        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
          q = r.divide(newR);
          lastT = t;
          lastR = r;
          t = newT;
          r = newR;
          newT = lastT.subtract(q.multiply(newT));
          newR = lastR.subtract(q.multiply(newR));
        }
        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t.compare(0) === -1) {
          t = t.add(n);
        }
        if (this.isNegative()) {
          return t.negate();
        }
        return t;
      };
      NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
      BigInteger.prototype.next = function() {
        var value = this.value;
        if (this.sign) {
          return subtractSmall(value, 1, this.sign);
        }
        return new BigInteger(addSmall(value, 1), this.sign);
      };
      SmallInteger.prototype.next = function() {
        var value = this.value;
        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
        return new BigInteger(MAX_INT_ARR, false);
      };
      NativeBigInt.prototype.next = function() {
        return new NativeBigInt(this.value + BigInt(1));
      };
      BigInteger.prototype.prev = function() {
        var value = this.value;
        if (this.sign) {
          return new BigInteger(addSmall(value, 1), true);
        }
        return subtractSmall(value, 1, this.sign);
      };
      SmallInteger.prototype.prev = function() {
        var value = this.value;
        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
        return new BigInteger(MAX_INT_ARR, true);
      };
      NativeBigInt.prototype.prev = function() {
        return new NativeBigInt(this.value - BigInt(1));
      };
      var powersOfTwo = [1];
      while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
      var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
      function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
      }
      BigInteger.prototype.shiftLeft = function(v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftRight(-n);
        var result = this;
        if (result.isZero()) return result;
        while (n >= powers2Length) {
          result = result.multiply(highestPower2);
          n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
      };
      NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
      BigInteger.prototype.shiftRight = function(v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0) return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
          if (result.isZero() || result.isNegative() && result.isUnit()) return result;
          remQuo = divModAny(result, highestPower2);
          result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
          n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
      };
      NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
      function bitwise(x, y, fn) {
        y = parseValue(y);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
          xDivMod = divModAny(xRem, highestPower2);
          xDigit = xDivMod[1].toJSNumber();
          if (xSign) {
            xDigit = highestPower2 - 1 - xDigit;
          }
          yDivMod = divModAny(yRem, highestPower2);
          yDigit = yDivMod[1].toJSNumber();
          if (ySign) {
            yDigit = highestPower2 - 1 - yDigit;
          }
          xRem = xDivMod[0];
          yRem = yDivMod[0];
          result.push(fn(xDigit, yDigit));
        }
        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
        for (var i2 = result.length - 1; i2 >= 0; i2 -= 1) {
          sum = sum.multiply(highestPower2).add(bigInt(result[i2]));
        }
        return sum;
      }
      BigInteger.prototype.not = function() {
        return this.negate().prev();
      };
      NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
      BigInteger.prototype.and = function(n) {
        return bitwise(this, n, function(a, b) {
          return a & b;
        });
      };
      NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
      BigInteger.prototype.or = function(n) {
        return bitwise(this, n, function(a, b) {
          return a | b;
        });
      };
      NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
      BigInteger.prototype.xor = function(n) {
        return bitwise(this, n, function(a, b) {
          return a ^ b;
        });
      };
      NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
      var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
      function roughLOB(n) {
        var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
      }
      function integerLogarithm(value, base) {
        if (base.compareTo(value) <= 0) {
          var tmp = integerLogarithm(value, base.square(base));
          var p = tmp.p;
          var e = tmp.e;
          var t = p.multiply(base);
          return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p, e: e * 2 };
        }
        return { p: bigInt(1), e: 0 };
      }
      BigInteger.prototype.bitLength = function() {
        var n = this;
        if (n.compareTo(bigInt(0)) < 0) {
          n = n.negate().subtract(bigInt(1));
        }
        if (n.compareTo(bigInt(0)) === 0) {
          return bigInt(0);
        }
        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
      };
      NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
      function max(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
      }
      function min(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
      }
      function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b)) return a;
        if (a.isZero()) return b;
        if (b.isZero()) return a;
        var c = Integer[1], d, t;
        while (a.isEven() && b.isEven()) {
          d = min(roughLOB(a), roughLOB(b));
          a = a.divide(d);
          b = b.divide(d);
          c = c.multiply(d);
        }
        while (a.isEven()) {
          a = a.divide(roughLOB(a));
        }
        do {
          while (b.isEven()) {
            b = b.divide(roughLOB(b));
          }
          if (a.greater(b)) {
            t = b;
            b = a;
            a = t;
          }
          b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
      }
      function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
      }
      function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low).add(1);
        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
        var digits = toBase(range, BASE).value;
        var result = [], restricted = true;
        for (var i2 = 0; i2 < digits.length; i2++) {
          var top = restricted ? digits[i2] + (i2 + 1 < digits.length ? digits[i2 + 1] / BASE : 0) : BASE;
          var digit = truncate(usedRNG() * top);
          result.push(digit);
          if (digit < digits[i2]) restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
      }
      var parseBase = function(text, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text = String(text);
        if (!caseSensitive) {
          text = text.toLowerCase();
          alphabet = alphabet.toLowerCase();
        }
        var length = text.length;
        var i2;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i2 = 0; i2 < alphabet.length; i2++) {
          alphabetValues[alphabet[i2]] = i2;
        }
        for (i2 = 0; i2 < length; i2++) {
          var c = text[i2];
          if (c === "-") continue;
          if (c in alphabetValues) {
            if (alphabetValues[c] >= absBase) {
              if (c === "1" && absBase === 1) continue;
              throw new Error(c + " is not a valid digit in base " + base + ".");
            }
          }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (i2 = isNegative ? 1 : 0; i2 < text.length; i2++) {
          var c = text[i2];
          if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
          else if (c === "<") {
            var start = i2;
            do {
              i2++;
            } while (text[i2] !== ">" && i2 < text.length);
            digits.push(parseValue(text.slice(start + 1, i2)));
          } else throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
      };
      function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow = Integer[1], i2;
        for (i2 = digits.length - 1; i2 >= 0; i2--) {
          val = val.add(digits[i2].times(pow));
          pow = pow.times(base);
        }
        return isNegative ? val.negate() : val;
      }
      function stringify(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
          return alphabet[digit];
        }
        return "<" + digit + ">";
      }
      function toBase(n, base) {
        base = bigInt(base);
        if (base.isZero()) {
          if (n.isZero()) return { value: [0], isNegative: false };
          throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
          if (n.isZero()) return { value: [0], isNegative: false };
          if (n.isNegative())
            return {
              value: [].concat.apply(
                [],
                Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])
              ),
              isNegative: false
            };
          var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
          arr.unshift([1]);
          return {
            value: [].concat.apply([], arr),
            isNegative: false
          };
        }
        var neg = false;
        if (n.isNegative() && base.isPositive()) {
          neg = true;
          n = n.abs();
        }
        if (base.isUnit()) {
          if (n.isZero()) return { value: [0], isNegative: false };
          return {
            value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
            isNegative: neg
          };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
          divmod = left.divmod(base);
          left = divmod.quotient;
          var digit = divmod.remainder;
          if (digit.isNegative()) {
            digit = base.minus(digit).abs();
            left = left.next();
          }
          out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
      }
      function toBaseString(n, base, alphabet) {
        var arr = toBase(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
          return stringify(x, alphabet);
        }).join("");
      }
      BigInteger.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      SmallInteger.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      NativeBigInt.prototype.toArray = function(radix) {
        return toBase(this, radix);
      };
      BigInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2) radix = 10;
        if (radix !== 10 || alphabet) return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
          digit = String(v[l]);
          str += zeros.slice(digit.length) + digit;
        }
        var sign = this.sign ? "-" : "";
        return sign + str;
      };
      SmallInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2) radix = 10;
        if (radix != 10 || alphabet) return toBaseString(this, radix, alphabet);
        return String(this.value);
      };
      NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
      NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
        return this.toString();
      };
      BigInteger.prototype.valueOf = function() {
        return parseInt(this.toString(), 10);
      };
      BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
      SmallInteger.prototype.valueOf = function() {
        return this.value;
      };
      SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
      NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
        return parseInt(this.toString(), 10);
      };
      function parseStringValue(v) {
        if (isPrecise(+v)) {
          var x = +v;
          if (x === truncate(x))
            return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
          throw new Error("Invalid integer: " + v);
        }
        var sign = v[0] === "-";
        if (sign) v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
          var exp = split[1];
          if (exp[0] === "+") exp = exp.slice(1);
          exp = +exp;
          if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
          var text = split[0];
          var decimalPlace = text.indexOf(".");
          if (decimalPlace >= 0) {
            exp -= text.length - decimalPlace - 1;
            text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
          }
          if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
          text += new Array(exp + 1).join("0");
          v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid) throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(sign ? "-" + v : v));
        }
        var r = [], max2 = v.length, l = LOG_BASE, min2 = max2 - l;
        while (max2 > 0) {
          r.push(+v.slice(min2, max2));
          min2 -= l;
          if (min2 < 0) min2 = 0;
          max2 -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
      }
      function parseNumberValue(v) {
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
          if (v !== truncate(v)) throw new Error(v + " is not an integer.");
          return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
      }
      function parseValue(v) {
        if (typeof v === "number") {
          return parseNumberValue(v);
        }
        if (typeof v === "string") {
          return parseStringValue(v);
        }
        if (typeof v === "bigint") {
          return new NativeBigInt(v);
        }
        return v;
      }
      for (var i = 0; i < 1e3; i++) {
        Integer[i] = parseValue(i);
        if (i > 0) Integer[-i] = parseValue(-i);
      }
      Integer.one = Integer[1];
      Integer.zero = Integer[0];
      Integer.minusOne = Integer[-1];
      Integer.max = max;
      Integer.min = min;
      Integer.gcd = gcd;
      Integer.lcm = lcm;
      Integer.isInstance = function(x) {
        return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
      };
      Integer.randBetween = randBetween;
      Integer.fromArray = function(digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
      };
      return Integer;
    })();
    if (typeof module !== "undefined" && module.hasOwnProperty("exports")) {
      module.exports = bigInt;
    }
    if (typeof define === "function" && define.amd) {
      define(function() {
        return bigInt;
      });
    }
  }
});

// ../api-beta/node_modules/sorted-btree/b+tree.js
var require_b_tree = __commonJS({
  "../api-beta/node_modules/sorted-btree/b+tree.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EmptyBTree = exports.asSet = exports.simpleComparator = exports.defaultComparator = void 0;
    function defaultComparator(a, b) {
      if (Number.isFinite(a) && Number.isFinite(b)) {
        return a - b;
      }
      var ta = typeof a;
      var tb = typeof b;
      if (ta !== tb) {
        return ta < tb ? -1 : 1;
      }
      if (ta === "object") {
        if (a === null)
          return b === null ? 0 : -1;
        else if (b === null)
          return 1;
        a = a.valueOf();
        b = b.valueOf();
        ta = typeof a;
        tb = typeof b;
        if (ta !== tb) {
          return ta < tb ? -1 : 1;
        }
      }
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      if (a === b)
        return 0;
      if (Number.isNaN(a))
        return Number.isNaN(b) ? 0 : -1;
      else if (Number.isNaN(b))
        return 1;
      return Array.isArray(a) ? 0 : Number.NaN;
    }
    exports.defaultComparator = defaultComparator;
    function simpleComparator(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    }
    exports.simpleComparator = simpleComparator;
    var BTree = (
      /** @class */
      (function() {
        function BTree2(entries, compare, maxNodeSize) {
          this._root = EmptyLeaf;
          this._size = 0;
          this._maxNodeSize = maxNodeSize >= 4 ? Math.min(maxNodeSize, 256) : 32;
          this._compare = compare || defaultComparator;
          if (entries)
            this.setPairs(entries);
        }
        Object.defineProperty(BTree2.prototype, "size", {
          /////////////////////////////////////////////////////////////////////////////
          // ES6 Map<K,V> methods /////////////////////////////////////////////////////
          /** Gets the number of key-value pairs in the tree. */
          get: function() {
            return this._size;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(BTree2.prototype, "length", {
          /** Gets the number of key-value pairs in the tree. */
          get: function() {
            return this._size;
          },
          enumerable: false,
          configurable: true
        });
        Object.defineProperty(BTree2.prototype, "isEmpty", {
          /** Returns true iff the tree contains no key-value pairs. */
          get: function() {
            return this._size === 0;
          },
          enumerable: false,
          configurable: true
        });
        BTree2.prototype.clear = function() {
          this._root = EmptyLeaf;
          this._size = 0;
        };
        BTree2.prototype.forEach = function(callback, thisArg) {
          var _this = this;
          if (thisArg !== void 0)
            callback = callback.bind(thisArg);
          return this.forEachPair(function(k, v) {
            return callback(v, k, _this);
          });
        };
        BTree2.prototype.forEachPair = function(callback, initialCounter) {
          var low = this.minKey(), high = this.maxKey();
          return this.forRange(low, high, true, callback, initialCounter);
        };
        BTree2.prototype.get = function(key, defaultValue) {
          return this._root.get(key, defaultValue, this);
        };
        BTree2.prototype.set = function(key, value, overwrite) {
          if (this._root.isShared)
            this._root = this._root.clone();
          var result = this._root.set(key, value, overwrite, this);
          if (result === true || result === false)
            return result;
          this._root = new BNodeInternal([this._root, result]);
          return true;
        };
        BTree2.prototype.has = function(key) {
          return this.forRange(key, key, true, void 0) !== 0;
        };
        BTree2.prototype.delete = function(key) {
          return this.editRange(key, key, true, DeleteRange) !== 0;
        };
        BTree2.prototype.with = function(key, value, overwrite) {
          var nu = this.clone();
          return nu.set(key, value, overwrite) || overwrite ? nu : this;
        };
        BTree2.prototype.withPairs = function(pairs2, overwrite) {
          var nu = this.clone();
          return nu.setPairs(pairs2, overwrite) !== 0 || overwrite ? nu : this;
        };
        BTree2.prototype.withKeys = function(keys, returnThisIfUnchanged) {
          var nu = this.clone(), changed = false;
          for (var i = 0; i < keys.length; i++)
            changed = nu.set(keys[i], void 0, false) || changed;
          return returnThisIfUnchanged && !changed ? this : nu;
        };
        BTree2.prototype.without = function(key, returnThisIfUnchanged) {
          return this.withoutRange(key, key, true, returnThisIfUnchanged);
        };
        BTree2.prototype.withoutKeys = function(keys, returnThisIfUnchanged) {
          var nu = this.clone();
          return nu.deleteKeys(keys) || !returnThisIfUnchanged ? nu : this;
        };
        BTree2.prototype.withoutRange = function(low, high, includeHigh, returnThisIfUnchanged) {
          var nu = this.clone();
          if (nu.deleteRange(low, high, includeHigh) === 0 && returnThisIfUnchanged)
            return this;
          return nu;
        };
        BTree2.prototype.filter = function(callback, returnThisIfUnchanged) {
          var nu = this.greedyClone();
          var del;
          nu.editAll(function(k, v, i) {
            if (!callback(k, v, i))
              return del = Delete;
          });
          if (!del && returnThisIfUnchanged)
            return this;
          return nu;
        };
        BTree2.prototype.mapValues = function(callback) {
          var tmp = {};
          var nu = this.greedyClone();
          nu.editAll(function(k, v, i) {
            return tmp.value = callback(v, k, i), tmp;
          });
          return nu;
        };
        BTree2.prototype.reduce = function(callback, initialValue) {
          var i = 0, p = initialValue;
          var it = this.entries(this.minKey(), ReusedArray), next;
          while (!(next = it.next()).done)
            p = callback(p, next.value, i++, this);
          return p;
        };
        BTree2.prototype.entries = function(lowestKey, reusedArray) {
          var info = this.findPath(lowestKey);
          if (info === void 0)
            return iterator();
          var nodequeue = info.nodequeue, nodeindex = info.nodeindex, leaf = info.leaf;
          var state = reusedArray !== void 0 ? 1 : 0;
          var i = lowestKey === void 0 ? -1 : leaf.indexOf(lowestKey, 0, this._compare) - 1;
          return iterator(function() {
            jump: for (; ; ) {
              switch (state) {
                case 0:
                  if (++i < leaf.keys.length)
                    return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                  state = 2;
                  continue;
                case 1:
                  if (++i < leaf.keys.length) {
                    reusedArray[0] = leaf.keys[i], reusedArray[1] = leaf.values[i];
                    return { done: false, value: reusedArray };
                  }
                  state = 2;
                case 2:
                  for (var level = -1; ; ) {
                    if (++level >= nodequeue.length) {
                      state = 3;
                      continue jump;
                    }
                    if (++nodeindex[level] < nodequeue[level].length)
                      break;
                  }
                  for (; level > 0; level--) {
                    nodequeue[level - 1] = nodequeue[level][nodeindex[level]].children;
                    nodeindex[level - 1] = 0;
                  }
                  leaf = nodequeue[0][nodeindex[0]];
                  i = -1;
                  state = reusedArray !== void 0 ? 1 : 0;
                  continue;
                case 3:
                  return { done: true, value: void 0 };
              }
            }
          });
        };
        BTree2.prototype.entriesReversed = function(highestKey, reusedArray, skipHighest) {
          if (highestKey === void 0) {
            highestKey = this.maxKey();
            skipHighest = void 0;
            if (highestKey === void 0)
              return iterator();
          }
          var _a = this.findPath(highestKey) || this.findPath(this.maxKey()), nodequeue = _a.nodequeue, nodeindex = _a.nodeindex, leaf = _a.leaf;
          check(!nodequeue[0] || leaf === nodequeue[0][nodeindex[0]], "wat!");
          var i = leaf.indexOf(highestKey, 0, this._compare);
          if (!skipHighest && i < leaf.keys.length && this._compare(leaf.keys[i], highestKey) <= 0)
            i++;
          var state = reusedArray !== void 0 ? 1 : 0;
          return iterator(function() {
            jump: for (; ; ) {
              switch (state) {
                case 0:
                  if (--i >= 0)
                    return { done: false, value: [leaf.keys[i], leaf.values[i]] };
                  state = 2;
                  continue;
                case 1:
                  if (--i >= 0) {
                    reusedArray[0] = leaf.keys[i], reusedArray[1] = leaf.values[i];
                    return { done: false, value: reusedArray };
                  }
                  state = 2;
                case 2:
                  for (var level = -1; ; ) {
                    if (++level >= nodequeue.length) {
                      state = 3;
                      continue jump;
                    }
                    if (--nodeindex[level] >= 0)
                      break;
                  }
                  for (; level > 0; level--) {
                    nodequeue[level - 1] = nodequeue[level][nodeindex[level]].children;
                    nodeindex[level - 1] = nodequeue[level - 1].length - 1;
                  }
                  leaf = nodequeue[0][nodeindex[0]];
                  i = leaf.keys.length;
                  state = reusedArray !== void 0 ? 1 : 0;
                  continue;
                case 3:
                  return { done: true, value: void 0 };
              }
            }
          });
        };
        BTree2.prototype.findPath = function(key) {
          var nextnode = this._root;
          var nodequeue, nodeindex;
          if (nextnode.isLeaf) {
            nodequeue = EmptyArray, nodeindex = EmptyArray;
          } else {
            nodequeue = [], nodeindex = [];
            for (var d = 0; !nextnode.isLeaf; d++) {
              nodequeue[d] = nextnode.children;
              nodeindex[d] = key === void 0 ? 0 : nextnode.indexOf(key, 0, this._compare);
              if (nodeindex[d] >= nodequeue[d].length)
                return;
              nextnode = nodequeue[d][nodeindex[d]];
            }
            nodequeue.reverse();
            nodeindex.reverse();
          }
          return { nodequeue, nodeindex, leaf: nextnode };
        };
        BTree2.prototype.diffAgainst = function(other, onlyThis, onlyOther, different) {
          if (other._compare !== this._compare) {
            throw new Error("Tree comparators are not the same.");
          }
          if (this.isEmpty || other.isEmpty) {
            if (this.isEmpty && other.isEmpty)
              return void 0;
            if (this.isEmpty)
              return onlyOther === void 0 ? void 0 : BTree2.stepToEnd(BTree2.makeDiffCursor(other), onlyOther);
            return onlyThis === void 0 ? void 0 : BTree2.stepToEnd(BTree2.makeDiffCursor(this), onlyThis);
          }
          var _compare = this._compare;
          var thisCursor = BTree2.makeDiffCursor(this);
          var otherCursor = BTree2.makeDiffCursor(other);
          var thisSuccess = true, otherSuccess = true, prevCursorOrder = BTree2.compare(thisCursor, otherCursor, _compare);
          while (thisSuccess && otherSuccess) {
            var cursorOrder = BTree2.compare(thisCursor, otherCursor, _compare);
            var thisLeaf = thisCursor.leaf, thisInternalSpine = thisCursor.internalSpine, thisLevelIndices = thisCursor.levelIndices;
            var otherLeaf = otherCursor.leaf, otherInternalSpine = otherCursor.internalSpine, otherLevelIndices = otherCursor.levelIndices;
            if (thisLeaf || otherLeaf) {
              if (prevCursorOrder !== 0) {
                if (cursorOrder === 0) {
                  if (thisLeaf && otherLeaf && different) {
                    var valThis = thisLeaf.values[thisLevelIndices[thisLevelIndices.length - 1]];
                    var valOther = otherLeaf.values[otherLevelIndices[otherLevelIndices.length - 1]];
                    if (!Object.is(valThis, valOther)) {
                      var result = different(thisCursor.currentKey, valThis, valOther);
                      if (result && result.break)
                        return result.break;
                    }
                  }
                } else if (cursorOrder > 0) {
                  if (otherLeaf && onlyOther) {
                    var otherVal = otherLeaf.values[otherLevelIndices[otherLevelIndices.length - 1]];
                    var result = onlyOther(otherCursor.currentKey, otherVal);
                    if (result && result.break)
                      return result.break;
                  }
                } else if (onlyThis) {
                  if (thisLeaf && prevCursorOrder !== 0) {
                    var valThis = thisLeaf.values[thisLevelIndices[thisLevelIndices.length - 1]];
                    var result = onlyThis(thisCursor.currentKey, valThis);
                    if (result && result.break)
                      return result.break;
                  }
                }
              }
            } else if (!thisLeaf && !otherLeaf && cursorOrder === 0) {
              var lastThis = thisInternalSpine.length - 1;
              var lastOther = otherInternalSpine.length - 1;
              var nodeThis = thisInternalSpine[lastThis][thisLevelIndices[lastThis]];
              var nodeOther = otherInternalSpine[lastOther][otherLevelIndices[lastOther]];
              if (nodeOther === nodeThis) {
                prevCursorOrder = 0;
                thisSuccess = BTree2.step(thisCursor, true);
                otherSuccess = BTree2.step(otherCursor, true);
                continue;
              }
            }
            prevCursorOrder = cursorOrder;
            if (cursorOrder < 0) {
              thisSuccess = BTree2.step(thisCursor);
            } else {
              otherSuccess = BTree2.step(otherCursor);
            }
          }
          if (thisSuccess && onlyThis)
            return BTree2.finishCursorWalk(thisCursor, otherCursor, _compare, onlyThis);
          if (otherSuccess && onlyOther)
            return BTree2.finishCursorWalk(otherCursor, thisCursor, _compare, onlyOther);
        };
        BTree2.finishCursorWalk = function(cursor, cursorFinished, compareKeys, callback) {
          var compared = BTree2.compare(cursor, cursorFinished, compareKeys);
          if (compared === 0) {
            if (!BTree2.step(cursor))
              return void 0;
          } else if (compared < 0) {
            check(false, "cursor walk terminated early");
          }
          return BTree2.stepToEnd(cursor, callback);
        };
        BTree2.stepToEnd = function(cursor, callback) {
          var canStep = true;
          while (canStep) {
            var leaf = cursor.leaf, levelIndices = cursor.levelIndices, currentKey = cursor.currentKey;
            if (leaf) {
              var value = leaf.values[levelIndices[levelIndices.length - 1]];
              var result = callback(currentKey, value);
              if (result && result.break)
                return result.break;
            }
            canStep = BTree2.step(cursor);
          }
          return void 0;
        };
        BTree2.makeDiffCursor = function(tree2) {
          var _root = tree2._root, height = tree2.height;
          return { height, internalSpine: [[_root]], levelIndices: [0], leaf: void 0, currentKey: _root.maxKey() };
        };
        BTree2.step = function(cursor, stepToNode) {
          var internalSpine = cursor.internalSpine, levelIndices = cursor.levelIndices, leaf = cursor.leaf;
          if (stepToNode === true || leaf) {
            var levelsLength = levelIndices.length;
            if (stepToNode === true || levelIndices[levelsLength - 1] === 0) {
              var spineLength = internalSpine.length;
              if (spineLength === 0)
                return false;
              var nodeLevelIndex = spineLength - 1;
              var levelIndexWalkBack = nodeLevelIndex;
              while (levelIndexWalkBack >= 0) {
                if (levelIndices[levelIndexWalkBack] > 0) {
                  if (levelIndexWalkBack < levelsLength - 1) {
                    cursor.leaf = void 0;
                    levelIndices.pop();
                  }
                  if (levelIndexWalkBack < nodeLevelIndex)
                    cursor.internalSpine = internalSpine.slice(0, levelIndexWalkBack + 1);
                  cursor.currentKey = internalSpine[levelIndexWalkBack][--levelIndices[levelIndexWalkBack]].maxKey();
                  return true;
                }
                levelIndexWalkBack--;
              }
              return false;
            } else {
              var valueIndex = --levelIndices[levelsLength - 1];
              cursor.currentKey = leaf.keys[valueIndex];
              return true;
            }
          } else {
            var nextLevel = internalSpine.length;
            var currentLevel = nextLevel - 1;
            var node = internalSpine[currentLevel][levelIndices[currentLevel]];
            if (node.isLeaf) {
              cursor.leaf = node;
              var valueIndex = levelIndices[nextLevel] = node.values.length - 1;
              cursor.currentKey = node.keys[valueIndex];
            } else {
              var children = node.children;
              internalSpine[nextLevel] = children;
              var childIndex = children.length - 1;
              levelIndices[nextLevel] = childIndex;
              cursor.currentKey = children[childIndex].maxKey();
            }
            return true;
          }
        };
        BTree2.compare = function(cursorA, cursorB, compareKeys) {
          var heightA = cursorA.height, currentKeyA = cursorA.currentKey, levelIndicesA = cursorA.levelIndices;
          var heightB = cursorB.height, currentKeyB = cursorB.currentKey, levelIndicesB = cursorB.levelIndices;
          var keyComparison = compareKeys(currentKeyB, currentKeyA);
          if (keyComparison !== 0) {
            return keyComparison;
          }
          var heightMin = heightA < heightB ? heightA : heightB;
          var depthANormalized = levelIndicesA.length - (heightA - heightMin);
          var depthBNormalized = levelIndicesB.length - (heightB - heightMin);
          return depthANormalized - depthBNormalized;
        };
        BTree2.prototype.keys = function(firstKey) {
          var it = this.entries(firstKey, ReusedArray);
          return iterator(function() {
            var n = it.next();
            if (n.value)
              n.value = n.value[0];
            return n;
          });
        };
        BTree2.prototype.values = function(firstKey) {
          var it = this.entries(firstKey, ReusedArray);
          return iterator(function() {
            var n = it.next();
            if (n.value)
              n.value = n.value[1];
            return n;
          });
        };
        Object.defineProperty(BTree2.prototype, "maxNodeSize", {
          /////////////////////////////////////////////////////////////////////////////
          // Additional methods ///////////////////////////////////////////////////////
          /** Returns the maximum number of children/values before nodes will split. */
          get: function() {
            return this._maxNodeSize;
          },
          enumerable: false,
          configurable: true
        });
        BTree2.prototype.minKey = function() {
          return this._root.minKey();
        };
        BTree2.prototype.maxKey = function() {
          return this._root.maxKey();
        };
        BTree2.prototype.clone = function() {
          this._root.isShared = true;
          var result = new BTree2(void 0, this._compare, this._maxNodeSize);
          result._root = this._root;
          result._size = this._size;
          return result;
        };
        BTree2.prototype.greedyClone = function(force) {
          var result = new BTree2(void 0, this._compare, this._maxNodeSize);
          result._root = this._root.greedyClone(force);
          result._size = this._size;
          return result;
        };
        BTree2.prototype.toArray = function(maxLength) {
          if (maxLength === void 0) {
            maxLength = 2147483647;
          }
          var min = this.minKey(), max = this.maxKey();
          if (min !== void 0)
            return this.getRange(min, max, true, maxLength);
          return [];
        };
        BTree2.prototype.keysArray = function() {
          var results = [];
          this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, function(k, v) {
            results.push(k);
          });
          return results;
        };
        BTree2.prototype.valuesArray = function() {
          var results = [];
          this._root.forRange(this.minKey(), this.maxKey(), true, false, this, 0, function(k, v) {
            results.push(v);
          });
          return results;
        };
        BTree2.prototype.toString = function() {
          return this.toArray().toString();
        };
        BTree2.prototype.setIfNotPresent = function(key, value) {
          return this.set(key, value, false);
        };
        BTree2.prototype.nextHigherPair = function(key, reusedArray) {
          reusedArray = reusedArray || [];
          if (key === void 0) {
            return this._root.minPair(reusedArray);
          }
          return this._root.getPairOrNextHigher(key, this._compare, false, reusedArray);
        };
        BTree2.prototype.nextHigherKey = function(key) {
          var p = this.nextHigherPair(key, ReusedArray);
          return p && p[0];
        };
        BTree2.prototype.nextLowerPair = function(key, reusedArray) {
          reusedArray = reusedArray || [];
          if (key === void 0) {
            return this._root.maxPair(reusedArray);
          }
          return this._root.getPairOrNextLower(key, this._compare, false, reusedArray);
        };
        BTree2.prototype.nextLowerKey = function(key) {
          var p = this.nextLowerPair(key, ReusedArray);
          return p && p[0];
        };
        BTree2.prototype.getPairOrNextLower = function(key, reusedArray) {
          return this._root.getPairOrNextLower(key, this._compare, true, reusedArray || []);
        };
        BTree2.prototype.getPairOrNextHigher = function(key, reusedArray) {
          return this._root.getPairOrNextHigher(key, this._compare, true, reusedArray || []);
        };
        BTree2.prototype.changeIfPresent = function(key, value) {
          return this.editRange(key, key, true, function(k, v) {
            return { value };
          }) !== 0;
        };
        BTree2.prototype.getRange = function(low, high, includeHigh, maxLength) {
          if (maxLength === void 0) {
            maxLength = 67108863;
          }
          var results = [];
          this._root.forRange(low, high, includeHigh, false, this, 0, function(k, v) {
            results.push([k, v]);
            return results.length > maxLength ? Break : void 0;
          });
          return results;
        };
        BTree2.prototype.setPairs = function(pairs2, overwrite) {
          var added = 0;
          for (var i = 0; i < pairs2.length; i++)
            if (this.set(pairs2[i][0], pairs2[i][1], overwrite))
              added++;
          return added;
        };
        BTree2.prototype.forRange = function(low, high, includeHigh, onFound, initialCounter) {
          var r = this._root.forRange(low, high, includeHigh, false, this, initialCounter || 0, onFound);
          return typeof r === "number" ? r : r.break;
        };
        BTree2.prototype.editRange = function(low, high, includeHigh, onFound, initialCounter) {
          var root = this._root;
          if (root.isShared)
            this._root = root = root.clone();
          try {
            var r = root.forRange(low, high, includeHigh, true, this, initialCounter || 0, onFound);
            return typeof r === "number" ? r : r.break;
          } finally {
            var isShared = void 0;
            while (root.keys.length <= 1 && !root.isLeaf) {
              isShared || (isShared = root.isShared);
              this._root = root = root.keys.length === 0 ? EmptyLeaf : root.children[0];
            }
            if (isShared) {
              root.isShared = true;
            }
          }
        };
        BTree2.prototype.editAll = function(onFound, initialCounter) {
          return this.editRange(this.minKey(), this.maxKey(), true, onFound, initialCounter);
        };
        BTree2.prototype.deleteRange = function(low, high, includeHigh) {
          return this.editRange(low, high, includeHigh, DeleteRange);
        };
        BTree2.prototype.deleteKeys = function(keys) {
          for (var i = 0, r = 0; i < keys.length; i++)
            if (this.delete(keys[i]))
              r++;
          return r;
        };
        Object.defineProperty(BTree2.prototype, "height", {
          /** Gets the height of the tree: the number of internal nodes between the
           *  BTree object and its leaf nodes (zero if there are no internal nodes). */
          get: function() {
            var node = this._root;
            var height = -1;
            while (node) {
              height++;
              node = node.isLeaf ? void 0 : node.children[0];
            }
            return height;
          },
          enumerable: false,
          configurable: true
        });
        BTree2.prototype.freeze = function() {
          var t = this;
          t.clear = t.set = t.editRange = function() {
            throw new Error("Attempted to modify a frozen BTree");
          };
        };
        BTree2.prototype.unfreeze = function() {
          delete this.clear;
          delete this.set;
          delete this.editRange;
        };
        Object.defineProperty(BTree2.prototype, "isFrozen", {
          /** Returns true if the tree appears to be frozen. */
          get: function() {
            return this.hasOwnProperty("editRange");
          },
          enumerable: false,
          configurable: true
        });
        BTree2.prototype.checkValid = function() {
          var size = this._root.checkValid(0, this, 0);
          check(size === this.size, "size mismatch: counted ", size, "but stored", this.size);
        };
        return BTree2;
      })()
    );
    exports.default = BTree;
    function asSet(btree) {
      return btree;
    }
    exports.asSet = asSet;
    if (Symbol && Symbol.iterator)
      BTree.prototype[Symbol.iterator] = BTree.prototype.entries;
    BTree.prototype.where = BTree.prototype.filter;
    BTree.prototype.setRange = BTree.prototype.setPairs;
    BTree.prototype.add = BTree.prototype.set;
    function iterator(next) {
      if (next === void 0) {
        next = (function() {
          return { done: true, value: void 0 };
        });
      }
      var result = { next };
      if (Symbol && Symbol.iterator)
        result[Symbol.iterator] = function() {
          return this;
        };
      return result;
    }
    var BNode = (
      /** @class */
      (function() {
        function BNode2(keys, values) {
          if (keys === void 0) {
            keys = [];
          }
          this.keys = keys;
          this.values = values || undefVals;
          this.isShared = void 0;
        }
        Object.defineProperty(BNode2.prototype, "isLeaf", {
          get: function() {
            return this.children === void 0;
          },
          enumerable: false,
          configurable: true
        });
        BNode2.prototype.maxKey = function() {
          return this.keys[this.keys.length - 1];
        };
        BNode2.prototype.indexOf = function(key, failXor, cmp) {
          var keys = this.keys;
          var lo = 0, hi = keys.length, mid = hi >> 1;
          while (lo < hi) {
            var c = cmp(keys[mid], key);
            if (c < 0)
              lo = mid + 1;
            else if (c > 0)
              hi = mid;
            else if (c === 0)
              return mid;
            else {
              if (key === key)
                return keys.length;
              else
                throw new Error("BTree: NaN was used as a key");
            }
            mid = lo + hi >> 1;
          }
          return mid ^ failXor;
        };
        BNode2.prototype.minKey = function() {
          return this.keys[0];
        };
        BNode2.prototype.minPair = function(reusedArray) {
          if (this.keys.length === 0)
            return void 0;
          reusedArray[0] = this.keys[0];
          reusedArray[1] = this.values[0];
          return reusedArray;
        };
        BNode2.prototype.maxPair = function(reusedArray) {
          if (this.keys.length === 0)
            return void 0;
          var lastIndex = this.keys.length - 1;
          reusedArray[0] = this.keys[lastIndex];
          reusedArray[1] = this.values[lastIndex];
          return reusedArray;
        };
        BNode2.prototype.clone = function() {
          var v = this.values;
          return new BNode2(this.keys.slice(0), v === undefVals ? v : v.slice(0));
        };
        BNode2.prototype.greedyClone = function(force) {
          return this.isShared && !force ? this : this.clone();
        };
        BNode2.prototype.get = function(key, defaultValue, tree2) {
          var i = this.indexOf(key, -1, tree2._compare);
          return i < 0 ? defaultValue : this.values[i];
        };
        BNode2.prototype.getPairOrNextLower = function(key, compare, inclusive, reusedArray) {
          var i = this.indexOf(key, -1, compare);
          var indexOrLower = i < 0 ? ~i - 1 : inclusive ? i : i - 1;
          if (indexOrLower >= 0) {
            reusedArray[0] = this.keys[indexOrLower];
            reusedArray[1] = this.values[indexOrLower];
            return reusedArray;
          }
          return void 0;
        };
        BNode2.prototype.getPairOrNextHigher = function(key, compare, inclusive, reusedArray) {
          var i = this.indexOf(key, -1, compare);
          var indexOrLower = i < 0 ? ~i : inclusive ? i : i + 1;
          var keys = this.keys;
          if (indexOrLower < keys.length) {
            reusedArray[0] = keys[indexOrLower];
            reusedArray[1] = this.values[indexOrLower];
            return reusedArray;
          }
          return void 0;
        };
        BNode2.prototype.checkValid = function(depth, tree2, baseIndex) {
          var kL = this.keys.length, vL = this.values.length;
          check(this.values === undefVals ? kL <= vL : kL === vL, "keys/values length mismatch: depth", depth, "with lengths", kL, vL, "and baseIndex", baseIndex);
          check(depth == 0 || kL > 0, "empty leaf at depth", depth, "and baseIndex", baseIndex);
          return kL;
        };
        BNode2.prototype.set = function(key, value, overwrite, tree2) {
          var i = this.indexOf(key, -1, tree2._compare);
          if (i < 0) {
            i = ~i;
            tree2._size++;
            if (this.keys.length < tree2._maxNodeSize) {
              return this.insertInLeaf(i, key, value, tree2);
            } else {
              var newRightSibling = this.splitOffRightSide(), target = this;
              if (i > this.keys.length) {
                i -= this.keys.length;
                target = newRightSibling;
              }
              target.insertInLeaf(i, key, value, tree2);
              return newRightSibling;
            }
          } else {
            if (overwrite !== false) {
              if (value !== void 0)
                this.reifyValues();
              this.keys[i] = key;
              this.values[i] = value;
            }
            return false;
          }
        };
        BNode2.prototype.reifyValues = function() {
          if (this.values === undefVals)
            return this.values = this.values.slice(0, this.keys.length);
          return this.values;
        };
        BNode2.prototype.insertInLeaf = function(i, key, value, tree2) {
          this.keys.splice(i, 0, key);
          if (this.values === undefVals) {
            while (undefVals.length < tree2._maxNodeSize)
              undefVals.push(void 0);
            if (value === void 0) {
              return true;
            } else {
              this.values = undefVals.slice(0, this.keys.length - 1);
            }
          }
          this.values.splice(i, 0, value);
          return true;
        };
        BNode2.prototype.takeFromRight = function(rhs) {
          var v = this.values;
          if (rhs.values === undefVals) {
            if (v !== undefVals)
              v.push(void 0);
          } else {
            v = this.reifyValues();
            v.push(rhs.values.shift());
          }
          this.keys.push(rhs.keys.shift());
        };
        BNode2.prototype.takeFromLeft = function(lhs) {
          var v = this.values;
          if (lhs.values === undefVals) {
            if (v !== undefVals)
              v.unshift(void 0);
          } else {
            v = this.reifyValues();
            v.unshift(lhs.values.pop());
          }
          this.keys.unshift(lhs.keys.pop());
        };
        BNode2.prototype.splitOffRightSide = function() {
          var half = this.keys.length >> 1, keys = this.keys.splice(half);
          var values = this.values === undefVals ? undefVals : this.values.splice(half);
          return new BNode2(keys, values);
        };
        BNode2.prototype.forRange = function(low, high, includeHigh, editMode, tree2, count, onFound) {
          var cmp = tree2._compare;
          var iLow, iHigh;
          if (high === low) {
            if (!includeHigh)
              return count;
            iHigh = (iLow = this.indexOf(low, -1, cmp)) + 1;
            if (iLow < 0)
              return count;
          } else {
            iLow = this.indexOf(low, 0, cmp);
            iHigh = this.indexOf(high, -1, cmp);
            if (iHigh < 0)
              iHigh = ~iHigh;
            else if (includeHigh === true)
              iHigh++;
          }
          var keys = this.keys, values = this.values;
          if (onFound !== void 0) {
            for (var i = iLow; i < iHigh; i++) {
              var key = keys[i];
              var result = onFound(key, values[i], count++);
              if (result !== void 0) {
                if (editMode === true) {
                  if (key !== keys[i] || this.isShared === true)
                    throw new Error("BTree illegally changed or cloned in editRange");
                  if (result.delete) {
                    this.keys.splice(i, 1);
                    if (this.values !== undefVals)
                      this.values.splice(i, 1);
                    tree2._size--;
                    i--;
                    iHigh--;
                  } else if (result.hasOwnProperty("value")) {
                    values[i] = result.value;
                  }
                }
                if (result.break !== void 0)
                  return result;
              }
            }
          } else
            count += iHigh - iLow;
          return count;
        };
        BNode2.prototype.mergeSibling = function(rhs, _) {
          this.keys.push.apply(this.keys, rhs.keys);
          if (this.values === undefVals) {
            if (rhs.values === undefVals)
              return;
            this.values = this.values.slice(0, this.keys.length);
          }
          this.values.push.apply(this.values, rhs.reifyValues());
        };
        return BNode2;
      })()
    );
    var BNodeInternal = (
      /** @class */
      (function(_super) {
        __extends(BNodeInternal2, _super);
        function BNodeInternal2(children, keys) {
          var _this = this;
          if (!keys) {
            keys = [];
            for (var i = 0; i < children.length; i++)
              keys[i] = children[i].maxKey();
          }
          _this = _super.call(this, keys) || this;
          _this.children = children;
          return _this;
        }
        BNodeInternal2.prototype.clone = function() {
          var children = this.children.slice(0);
          for (var i = 0; i < children.length; i++)
            children[i].isShared = true;
          return new BNodeInternal2(children, this.keys.slice(0));
        };
        BNodeInternal2.prototype.greedyClone = function(force) {
          if (this.isShared && !force)
            return this;
          var nu = new BNodeInternal2(this.children.slice(0), this.keys.slice(0));
          for (var i = 0; i < nu.children.length; i++)
            nu.children[i] = nu.children[i].greedyClone(force);
          return nu;
        };
        BNodeInternal2.prototype.minKey = function() {
          return this.children[0].minKey();
        };
        BNodeInternal2.prototype.minPair = function(reusedArray) {
          return this.children[0].minPair(reusedArray);
        };
        BNodeInternal2.prototype.maxPair = function(reusedArray) {
          return this.children[this.children.length - 1].maxPair(reusedArray);
        };
        BNodeInternal2.prototype.get = function(key, defaultValue, tree2) {
          var i = this.indexOf(key, 0, tree2._compare), children = this.children;
          return i < children.length ? children[i].get(key, defaultValue, tree2) : void 0;
        };
        BNodeInternal2.prototype.getPairOrNextLower = function(key, compare, inclusive, reusedArray) {
          var i = this.indexOf(key, 0, compare), children = this.children;
          if (i >= children.length)
            return this.maxPair(reusedArray);
          var result = children[i].getPairOrNextLower(key, compare, inclusive, reusedArray);
          if (result === void 0 && i > 0) {
            return children[i - 1].maxPair(reusedArray);
          }
          return result;
        };
        BNodeInternal2.prototype.getPairOrNextHigher = function(key, compare, inclusive, reusedArray) {
          var i = this.indexOf(key, 0, compare), children = this.children, length = children.length;
          if (i >= length)
            return void 0;
          var result = children[i].getPairOrNextHigher(key, compare, inclusive, reusedArray);
          if (result === void 0 && i < length - 1) {
            return children[i + 1].minPair(reusedArray);
          }
          return result;
        };
        BNodeInternal2.prototype.checkValid = function(depth, tree2, baseIndex) {
          var kL = this.keys.length, cL = this.children.length;
          check(kL === cL, "keys/children length mismatch: depth", depth, "lengths", kL, cL, "baseIndex", baseIndex);
          check(kL > 1 || depth > 0, "internal node has length", kL, "at depth", depth, "baseIndex", baseIndex);
          var size = 0, c = this.children, k = this.keys, childSize = 0;
          for (var i = 0; i < cL; i++) {
            size += c[i].checkValid(depth + 1, tree2, baseIndex + size);
            childSize += c[i].keys.length;
            check(size >= childSize, "wtf", baseIndex);
            check(i === 0 || c[i - 1].constructor === c[i].constructor, "type mismatch, baseIndex:", baseIndex);
            if (c[i].maxKey() != k[i])
              check(false, "keys[", i, "] =", k[i], "is wrong, should be ", c[i].maxKey(), "at depth", depth, "baseIndex", baseIndex);
            if (!(i === 0 || tree2._compare(k[i - 1], k[i]) < 0))
              check(false, "sort violation at depth", depth, "index", i, "keys", k[i - 1], k[i]);
          }
          var toofew = childSize === 0;
          if (toofew || childSize > tree2.maxNodeSize * cL)
            check(false, toofew ? "too few" : "too many", "children (", childSize, size, ") at depth", depth, "maxNodeSize:", tree2.maxNodeSize, "children.length:", cL, "baseIndex:", baseIndex);
          return size;
        };
        BNodeInternal2.prototype.set = function(key, value, overwrite, tree2) {
          var c = this.children, max = tree2._maxNodeSize, cmp = tree2._compare;
          var i = Math.min(this.indexOf(key, 0, cmp), c.length - 1), child = c[i];
          if (child.isShared)
            c[i] = child = child.clone();
          if (child.keys.length >= max) {
            var other;
            if (i > 0 && (other = c[i - 1]).keys.length < max && cmp(child.keys[0], key) < 0) {
              if (other.isShared)
                c[i - 1] = other = other.clone();
              other.takeFromRight(child);
              this.keys[i - 1] = other.maxKey();
            } else if ((other = c[i + 1]) !== void 0 && other.keys.length < max && cmp(child.maxKey(), key) < 0) {
              if (other.isShared)
                c[i + 1] = other = other.clone();
              other.takeFromLeft(child);
              this.keys[i] = c[i].maxKey();
            }
          }
          var result = child.set(key, value, overwrite, tree2);
          if (result === false)
            return false;
          this.keys[i] = child.maxKey();
          if (result === true)
            return true;
          if (this.keys.length < max) {
            this.insert(i + 1, result);
            return true;
          } else {
            var newRightSibling = this.splitOffRightSide(), target = this;
            if (cmp(result.maxKey(), this.maxKey()) > 0) {
              target = newRightSibling;
              i -= this.keys.length;
            }
            target.insert(i + 1, result);
            return newRightSibling;
          }
        };
        BNodeInternal2.prototype.insert = function(i, child) {
          this.children.splice(i, 0, child);
          this.keys.splice(i, 0, child.maxKey());
        };
        BNodeInternal2.prototype.splitOffRightSide = function() {
          var half = this.children.length >> 1;
          return new BNodeInternal2(this.children.splice(half), this.keys.splice(half));
        };
        BNodeInternal2.prototype.takeFromRight = function(rhs) {
          this.keys.push(rhs.keys.shift());
          this.children.push(rhs.children.shift());
        };
        BNodeInternal2.prototype.takeFromLeft = function(lhs) {
          this.keys.unshift(lhs.keys.pop());
          this.children.unshift(lhs.children.pop());
        };
        BNodeInternal2.prototype.forRange = function(low, high, includeHigh, editMode, tree2, count, onFound) {
          var cmp = tree2._compare;
          var keys = this.keys, children = this.children;
          var iLow = this.indexOf(low, 0, cmp), i = iLow;
          var iHigh = Math.min(high === low ? iLow : this.indexOf(high, 0, cmp), keys.length - 1);
          if (!editMode) {
            for (; i <= iHigh; i++) {
              var result = children[i].forRange(low, high, includeHigh, editMode, tree2, count, onFound);
              if (typeof result !== "number")
                return result;
              count = result;
            }
          } else if (i <= iHigh) {
            try {
              for (; i <= iHigh; i++) {
                if (children[i].isShared)
                  children[i] = children[i].clone();
                var result = children[i].forRange(low, high, includeHigh, editMode, tree2, count, onFound);
                keys[i] = children[i].maxKey();
                if (typeof result !== "number")
                  return result;
                count = result;
              }
            } finally {
              var half = tree2._maxNodeSize >> 1;
              if (iLow > 0)
                iLow--;
              for (i = iHigh; i >= iLow; i--) {
                if (children[i].keys.length <= half) {
                  if (children[i].keys.length !== 0) {
                    this.tryMerge(i, tree2._maxNodeSize);
                  } else {
                    keys.splice(i, 1);
                    children.splice(i, 1);
                  }
                }
              }
              if (children.length !== 0 && children[0].keys.length === 0)
                check(false, "emptiness bug");
            }
          }
          return count;
        };
        BNodeInternal2.prototype.tryMerge = function(i, maxSize) {
          var children = this.children;
          if (i >= 0 && i + 1 < children.length) {
            if (children[i].keys.length + children[i + 1].keys.length <= maxSize) {
              if (children[i].isShared)
                children[i] = children[i].clone();
              children[i].mergeSibling(children[i + 1], maxSize);
              children.splice(i + 1, 1);
              this.keys.splice(i + 1, 1);
              this.keys[i] = children[i].maxKey();
              return true;
            }
          }
          return false;
        };
        BNodeInternal2.prototype.mergeSibling = function(rhs, maxNodeSize) {
          var oldLength = this.keys.length;
          this.keys.push.apply(this.keys, rhs.keys);
          var rhsChildren = rhs.children;
          this.children.push.apply(this.children, rhsChildren);
          if (rhs.isShared && !this.isShared) {
            for (var i = 0; i < rhsChildren.length; i++)
              rhsChildren[i].isShared = true;
          }
          this.tryMerge(oldLength - 1, maxNodeSize);
        };
        return BNodeInternal2;
      })(BNode)
    );
    var undefVals = [];
    var Delete = { delete: true };
    var DeleteRange = function() {
      return Delete;
    };
    var Break = { break: true };
    var EmptyLeaf = (function() {
      var n = new BNode();
      n.isShared = true;
      return n;
    })();
    var EmptyArray = [];
    var ReusedArray = [];
    function check(fact) {
      var args = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
      }
      if (!fact) {
        args.unshift("B+ tree");
        throw new Error(args.join(" "));
      }
    }
    exports.EmptyBTree = (function() {
      var t = new BTree();
      t.freeze();
      return t;
    })();
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/options.js
var require_options = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/options.js"(exports) {
    "use strict";
    var __assign = exports && exports.__assign || function() {
      __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOptions = {
      delayFirstAttempt: false,
      jitter: "none",
      maxDelay: Infinity,
      numOfAttempts: 10,
      retry: function() {
        return true;
      },
      startingDelay: 100,
      timeMultiple: 2
    };
    function getSanitizedOptions(options) {
      var sanitized = __assign(__assign({}, defaultOptions), options);
      if (sanitized.numOfAttempts < 1) {
        sanitized.numOfAttempts = 1;
      }
      return sanitized;
    }
    exports.getSanitizedOptions = getSanitizedOptions;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/jitter/full/full.jitter.js
var require_full_jitter = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/jitter/full/full.jitter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function fullJitter(delay) {
      var jitteredDelay = Math.random() * delay;
      return Math.round(jitteredDelay);
    }
    exports.fullJitter = fullJitter;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/jitter/no/no.jitter.js
var require_no_jitter = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/jitter/no/no.jitter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function noJitter(delay) {
      return delay;
    }
    exports.noJitter = noJitter;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/jitter/jitter.factory.js
var require_jitter_factory = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/jitter/jitter.factory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var full_jitter_1 = require_full_jitter();
    var no_jitter_1 = require_no_jitter();
    function JitterFactory(options) {
      switch (options.jitter) {
        case "full":
          return full_jitter_1.fullJitter;
        case "none":
        default:
          return no_jitter_1.noJitter;
      }
    }
    exports.JitterFactory = JitterFactory;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/delay/delay.base.js
var require_delay_base = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/delay/delay.base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jitter_factory_1 = require_jitter_factory();
    var Delay = (
      /** @class */
      (function() {
        function Delay2(options) {
          this.options = options;
          this.attempt = 0;
        }
        Delay2.prototype.apply = function() {
          var _this = this;
          return new Promise(function(resolve) {
            return setTimeout(resolve, _this.jitteredDelay);
          });
        };
        Delay2.prototype.setAttemptNumber = function(attempt) {
          this.attempt = attempt;
        };
        Object.defineProperty(Delay2.prototype, "jitteredDelay", {
          get: function() {
            var jitter = jitter_factory_1.JitterFactory(this.options);
            return jitter(this.delay);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Delay2.prototype, "delay", {
          get: function() {
            var constant = this.options.startingDelay;
            var base = this.options.timeMultiple;
            var power = this.numOfDelayedAttempts;
            var delay = constant * Math.pow(base, power);
            return Math.min(delay, this.options.maxDelay);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Delay2.prototype, "numOfDelayedAttempts", {
          get: function() {
            return this.attempt;
          },
          enumerable: true,
          configurable: true
        });
        return Delay2;
      })()
    );
    exports.Delay = Delay;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js
var require_skip_first_delay = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/delay/skip-first/skip-first.delay.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var delay_base_1 = require_delay_base();
    var SkipFirstDelay = (
      /** @class */
      (function(_super) {
        __extends(SkipFirstDelay2, _super);
        function SkipFirstDelay2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        SkipFirstDelay2.prototype.apply = function() {
          return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
              return [2, this.isFirstAttempt ? true : _super.prototype.apply.call(this)];
            });
          });
        };
        Object.defineProperty(SkipFirstDelay2.prototype, "isFirstAttempt", {
          get: function() {
            return this.attempt === 0;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SkipFirstDelay2.prototype, "numOfDelayedAttempts", {
          get: function() {
            return this.attempt - 1;
          },
          enumerable: true,
          configurable: true
        });
        return SkipFirstDelay2;
      })(delay_base_1.Delay)
    );
    exports.SkipFirstDelay = SkipFirstDelay;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/delay/always/always.delay.js
var require_always_delay = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/delay/always/always.delay.js"(exports) {
    "use strict";
    var __extends = exports && exports.__extends || /* @__PURE__ */ (function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    var delay_base_1 = require_delay_base();
    var AlwaysDelay = (
      /** @class */
      (function(_super) {
        __extends(AlwaysDelay2, _super);
        function AlwaysDelay2() {
          return _super !== null && _super.apply(this, arguments) || this;
        }
        return AlwaysDelay2;
      })(delay_base_1.Delay)
    );
    exports.AlwaysDelay = AlwaysDelay;
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/delay/delay.factory.js
var require_delay_factory = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/delay/delay.factory.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var skip_first_delay_1 = require_skip_first_delay();
    var always_delay_1 = require_always_delay();
    function DelayFactory(options, attempt) {
      var delay = initDelayClass(options);
      delay.setAttemptNumber(attempt);
      return delay;
    }
    exports.DelayFactory = DelayFactory;
    function initDelayClass(options) {
      if (!options.delayFirstAttempt) {
        return new skip_first_delay_1.SkipFirstDelay(options);
      }
      return new always_delay_1.AlwaysDelay(options);
    }
  }
});

// ../api-beta/node_modules/exponential-backoff/dist/backoff.js
var require_backoff = __commonJS({
  "../api-beta/node_modules/exponential-backoff/dist/backoff.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports && exports.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var options_1 = require_options();
    var delay_factory_1 = require_delay_factory();
    function backOff(request, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var sanitizedOptions, backOff2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              sanitizedOptions = options_1.getSanitizedOptions(options);
              backOff2 = new BackOff(request, sanitizedOptions);
              return [4, backOff2.execute()];
            case 1:
              return [2, _a.sent()];
          }
        });
      });
    }
    exports.backOff = backOff;
    var BackOff = (
      /** @class */
      (function() {
        function BackOff2(request, options) {
          this.request = request;
          this.options = options;
          this.attemptNumber = 0;
        }
        BackOff2.prototype.execute = function() {
          return __awaiter(this, void 0, void 0, function() {
            var e_1, shouldRetry;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  if (!!this.attemptLimitReached) return [3, 7];
                  _a.label = 1;
                case 1:
                  _a.trys.push([1, 4, , 6]);
                  return [4, this.applyDelay()];
                case 2:
                  _a.sent();
                  return [4, this.request()];
                case 3:
                  return [2, _a.sent()];
                case 4:
                  e_1 = _a.sent();
                  this.attemptNumber++;
                  return [4, this.options.retry(e_1, this.attemptNumber)];
                case 5:
                  shouldRetry = _a.sent();
                  if (!shouldRetry || this.attemptLimitReached) {
                    throw e_1;
                  }
                  return [3, 6];
                case 6:
                  return [3, 0];
                case 7:
                  throw new Error("Something went wrong.");
              }
            });
          });
        };
        Object.defineProperty(BackOff2.prototype, "attemptLimitReached", {
          get: function() {
            return this.attemptNumber >= this.options.numOfAttempts;
          },
          enumerable: true,
          configurable: true
        });
        BackOff2.prototype.applyDelay = function() {
          return __awaiter(this, void 0, void 0, function() {
            var delay;
            return __generator(this, function(_a) {
              switch (_a.label) {
                case 0:
                  delay = delay_factory_1.DelayFactory(this.options, this.attemptNumber);
                  return [4, delay.apply()];
                case 1:
                  _a.sent();
                  return [
                    2
                    /*return*/
                  ];
              }
            });
          });
        };
        return BackOff2;
      })()
    );
  }
});

// ../api-beta/node_modules/emoji-regex/index.js
var require_emoji_regex = __commonJS({
  "../api-beta/node_modules/emoji-regex/index.js"(exports, module) {
    module.exports = () => {
      return /[#*0-9]\uFE0F?\u20E3|[\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23ED-\u23EF\u23F1\u23F2\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB\u25FC\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692\u2694-\u2697\u2699\u269B\u269C\u26A0\u26A7\u26AA\u26B0\u26B1\u26BD\u26BE\u26C4\u26C8\u26CF\u26D1\u26E9\u26F0-\u26F5\u26F7\u26F8\u26FA\u2702\u2708\u2709\u270F\u2712\u2714\u2716\u271D\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u27A1\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B55\u3030\u303D\u3297\u3299]\uFE0F?|[\u261D\u270C\u270D](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\u270A\u270B](?:\uD83C[\uDFFB-\uDFFF])?|[\u23E9-\u23EC\u23F0\u23F3\u25FD\u2693\u26A1\u26AB\u26C5\u26CE\u26D4\u26EA\u26FD\u2705\u2728\u274C\u274E\u2753-\u2755\u2795-\u2797\u27B0\u27BF\u2B50]|\u26D3\uFE0F?(?:\u200D\uD83D\uDCA5)?|\u26F9(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\u2764\uFE0F?(?:\u200D(?:\uD83D\uDD25|\uD83E\uDE79))?|\uD83C(?:[\uDC04\uDD70\uDD71\uDD7E\uDD7F\uDE02\uDE37\uDF21\uDF24-\uDF2C\uDF36\uDF7D\uDF96\uDF97\uDF99-\uDF9B\uDF9E\uDF9F\uDFCD\uDFCE\uDFD4-\uDFDF\uDFF5\uDFF7]\uFE0F?|[\uDF85\uDFC2\uDFC7](?:\uD83C[\uDFFB-\uDFFF])?|[\uDFC4\uDFCA](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDFCB\uDFCC](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDCCF\uDD8E\uDD91-\uDD9A\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF43\uDF45-\uDF4A\uDF4C-\uDF7C\uDF7E-\uDF84\uDF86-\uDF93\uDFA0-\uDFC1\uDFC5\uDFC6\uDFC8\uDFC9\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF8-\uDFFF]|\uDDE6\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF]|\uDDE7\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF]|\uDDE8\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF7\uDDFA-\uDDFF]|\uDDE9\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF]|\uDDEA\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA]|\uDDEB\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7]|\uDDEC\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE]|\uDDED\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA]|\uDDEE\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9]|\uDDEF\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5]|\uDDF0\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF]|\uDDF1\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE]|\uDDF2\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF]|\uDDF3\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF]|\uDDF4\uD83C\uDDF2|\uDDF5\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE]|\uDDF6\uD83C\uDDE6|\uDDF7\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC]|\uDDF8\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF]|\uDDF9\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF]|\uDDFA\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF]|\uDDFB\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA]|\uDDFC\uD83C[\uDDEB\uDDF8]|\uDDFD\uD83C\uDDF0|\uDDFE\uD83C[\uDDEA\uDDF9]|\uDDFF\uD83C[\uDDE6\uDDF2\uDDFC]|\uDF44(?:\u200D\uD83D\uDFEB)?|\uDF4B(?:\u200D\uD83D\uDFE9)?|\uDFC3(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDFF3\uFE0F?(?:\u200D(?:\u26A7\uFE0F?|\uD83C\uDF08))?|\uDFF4(?:\u200D\u2620\uFE0F?|\uDB40\uDC67\uDB40\uDC62\uDB40(?:\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDC73\uDB40\uDC63\uDB40\uDC74|\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F)?)|\uD83D(?:[\uDC3F\uDCFD\uDD49\uDD4A\uDD6F\uDD70\uDD73\uDD76-\uDD79\uDD87\uDD8A-\uDD8D\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA\uDECB\uDECD-\uDECF\uDEE0-\uDEE5\uDEE9\uDEF0\uDEF3]\uFE0F?|[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDC8F\uDC91\uDCAA\uDD7A\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC](?:\uD83C[\uDFFB-\uDFFF])?|[\uDC6E-\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4\uDEB5](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD74\uDD90](?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?|[\uDC00-\uDC07\uDC09-\uDC14\uDC16-\uDC25\uDC27-\uDC3A\uDC3C-\uDC3E\uDC40\uDC44\uDC45\uDC51-\uDC65\uDC6A\uDC79-\uDC7B\uDC7D-\uDC80\uDC84\uDC88-\uDC8E\uDC90\uDC92-\uDCA9\uDCAB-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDDA4\uDDFB-\uDE2D\uDE2F-\uDE34\uDE37-\uDE41\uDE43\uDE44\uDE48-\uDE4A\uDE80-\uDEA2\uDEA4-\uDEB3\uDEB7-\uDEBF\uDEC1-\uDEC5\uDED0-\uDED2\uDED5-\uDED8\uDEDC-\uDEDF\uDEEB\uDEEC\uDEF4-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uDC08(?:\u200D\u2B1B)?|\uDC15(?:\u200D\uD83E\uDDBA)?|\uDC26(?:\u200D(?:\u2B1B|\uD83D\uDD25))?|\uDC3B(?:\u200D\u2744\uFE0F?)?|\uDC41\uFE0F?(?:\u200D\uD83D\uDDE8\uFE0F?)?|\uDC68(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDC68\uDC69]\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?)|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFC-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFD-\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFD\uDFFF]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?\uDC68\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDD1D\uDEEF]\u200D\uD83D\uDC68\uD83C[\uDFFB-\uDFFE]|[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3])))?))?|\uDC69(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:\uDC8B\u200D\uD83D)?[\uDC68\uDC69]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?|\uDC69\u200D\uD83D(?:\uDC66(?:\u200D\uD83D\uDC66)?|\uDC67(?:\u200D\uD83D[\uDC66\uDC67])?))|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFC-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFD-\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFD\uDFFF]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D\uD83D(?:[\uDC68\uDC69]|\uDC8B\u200D\uD83D[\uDC68\uDC69])\uD83C[\uDFFB-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3]|\uDD1D\u200D\uD83D[\uDC68\uDC69]\uD83C[\uDFFB-\uDFFE]|\uDEEF\u200D\uD83D\uDC69\uD83C[\uDFFB-\uDFFE])))?))?|\uDD75(?:\uD83C[\uDFFB-\uDFFF]|\uFE0F)?(?:\u200D[\u2640\u2642]\uFE0F?)?|\uDE2E(?:\u200D\uD83D\uDCA8)?|\uDE35(?:\u200D\uD83D\uDCAB)?|\uDE36(?:\u200D\uD83C\uDF2B\uFE0F?)?|\uDE42(?:\u200D[\u2194\u2195]\uFE0F?)?|\uDEB6(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?)|\uD83E(?:[\uDD0C\uDD0F\uDD18-\uDD1F\uDD30-\uDD34\uDD36\uDD77\uDDB5\uDDB6\uDDBB\uDDD2\uDDD3\uDDD5\uDEC3-\uDEC5\uDEF0\uDEF2-\uDEF8](?:\uD83C[\uDFFB-\uDFFF])?|[\uDD26\uDD35\uDD37-\uDD39\uDD3C-\uDD3E\uDDB8\uDDB9\uDDCD\uDDCF\uDDD4\uDDD6-\uDDDD](?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDDDE\uDDDF](?:\u200D[\u2640\u2642]\uFE0F?)?|[\uDD0D\uDD0E\uDD10-\uDD17\uDD20-\uDD25\uDD27-\uDD2F\uDD3A\uDD3F-\uDD45\uDD47-\uDD76\uDD78-\uDDB4\uDDB7\uDDBA\uDDBC-\uDDCC\uDDD0\uDDE0-\uDDFF\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC2\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF]|\uDDCE(?:\uD83C[\uDFFB-\uDFFF])?(?:\u200D(?:[\u2640\u2642]\uFE0F?(?:\u200D\u27A1\uFE0F?)?|\u27A1\uFE0F?))?|\uDDD1(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1|\uDDD1\u200D\uD83E\uDDD2(?:\u200D\uD83E\uDDD2)?|\uDDD2(?:\u200D\uD83E\uDDD2)?))|\uD83C(?:\uDFFB(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFC-\uDFFF])))?|\uDFFC(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFD-\uDFFF])))?|\uDFFD(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])))?|\uDFFE(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFD\uDFFF])))?|\uDFFF(?:\u200D(?:[\u2695\u2696\u2708]\uFE0F?|\u2764\uFE0F?\u200D(?:\uD83D\uDC8B\u200D)?\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE]|\uD83C[\uDF3E\uDF73\uDF7C\uDF84\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D(?:[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uDC30\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])|\uD83E(?:[\uDDAF\uDDBC\uDDBD](?:\u200D\u27A1\uFE0F?)?|[\uDDB0-\uDDB3\uDE70]|\uDD1D\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFF]|\uDEEF\u200D\uD83E\uDDD1\uD83C[\uDFFB-\uDFFE])))?))?|\uDEF1(?:\uD83C(?:\uDFFB(?:\u200D\uD83E\uDEF2\uD83C[\uDFFC-\uDFFF])?|\uDFFC(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFD-\uDFFF])?|\uDFFD(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])?|\uDFFE(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFD\uDFFF])?|\uDFFF(?:\u200D\uD83E\uDEF2\uD83C[\uDFFB-\uDFFE])?))?)/g;
    };
  }
});

// ../api-beta/dist/index.js
var import_aura = __toESM(require_dist(), 1);

// ../api-beta/node_modules/@urbit/nockjs/dist/nockjs.esm.mjs
function bigIntToByteArray(bigInt) {
  const hexString = bigInt.toString(16);
  const paddedHexString = hexString.length % 2 === 0 ? hexString : "0" + hexString;
  const arrayLength = paddedHexString.length / 2;
  const int8Array = new Uint8Array(arrayLength);
  for (let i = 0; i < paddedHexString.length; i += 2) {
    const hexSubstring = paddedHexString.slice(i, i + 2);
    const signedInt = parseInt(hexSubstring, 16) << 24 >> 24;
    int8Array[i / 2] = signedInt;
  }
  return int8Array;
}
var blcCoeff = [];
var blcBigCoeff = [];
var blc = [];
var blcNext = 0;
function bitLength(bigIntValue) {
  if (bigIntValue === 0n) return 0;
  let k = 0;
  while (true) {
    if (blcNext === k) {
      blcCoeff.push(32 << blcNext);
      blcBigCoeff.push(BigInt(blcCoeff[blcNext]));
      blc.push(1n << blcBigCoeff[blcNext]);
      blcNext++;
    }
    if (bigIntValue < blc[k]) break;
    k++;
  }
  if (!k) return 32 - Math.clz32(Number(bigIntValue));
  k--;
  let i = blcCoeff[k];
  let a = bigIntValue >> blcBigCoeff[k];
  while (k--) {
    let b = a >> blcBigCoeff[k];
    if (b) i += blcCoeff[k], a = b;
  }
  return i + 32 - Math.clz32(Number(a));
}
function testBit(bigIntValue, index) {
  return (bigIntValue & BigInt(1) << BigInt(index)) !== BigInt(0);
}
function bigIntFromStringWithRadix(number, radix) {
  if (radix === 16) return BigInt("0x" + (number || "0"));
  if (radix === 10) return BigInt(number || "0");
  let result = BigInt(0);
  const base = BigInt(radix);
  const length = number.length;
  for (let i = 0; i < length; i++) {
    const digit = parseInt(number.charAt(i), radix);
    if (isNaN(digit)) {
      throw new Error(`Invalid character for radix ${radix}: '${number.charAt(i)}'`);
    }
    result = result * base + BigInt(digit);
  }
  return result;
}
function murmurhash3_bi(len, key, seed) {
  let remainder, bytes, h1, h1b, c1, c2, k1, i;
  let yek;
  if (0n === key) {
    yek = new Uint8Array(0);
    len = len || 0;
  } else {
    yek = bigIntToByteArray(key);
    len = len || yek.length;
  }
  if (yek.length < len) {
    const fil = new Uint8Array(len - yek.length);
    const nek = new Uint8Array(yek.length + fil.length);
    nek.set(fil);
    nek.set(yek, fil.length);
    yek = nek;
  } else if (yek.length > len) {
    throw new Error("murmur3 oversized key for length");
  }
  yek.reverse();
  remainder = yek.length & 3;
  bytes = yek.length - remainder;
  h1 = seed;
  c1 = 3432918353;
  c2 = 461845907;
  i = 0;
  while (i < bytes) {
    k1 = yek[i] & 255 | (yek[++i] & 255) << 8 | (yek[++i] & 255) << 16 | (yek[++i] & 255) << 24;
    ++i;
    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
    k1 = k1 << 15 | k1 >>> 17;
    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
    h1 ^= k1;
    h1 = h1 << 13 | h1 >>> 19;
    h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
    h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16);
  }
  k1 = 0;
  switch (remainder) {
    case 3:
      k1 ^= (yek[i + 2] & 255) << 16;
    case 2:
      k1 ^= (yek[i + 1] & 255) << 8;
    case 1:
      k1 ^= yek[i] & 255;
      k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
      h1 ^= k1;
  }
  h1 ^= yek.length;
  h1 ^= h1 >>> 16;
  h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 13;
  h1 = (h1 & 65535) * 3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
  h1 ^= h1 >>> 16;
  return h1 >>> 0;
}
function dwim$1() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  const n = args.length === 1 ? args[0] : args;
  if (isNoun(n)) return n;
  if (typeof n === "number") {
    return Atom.fromInt(n);
  } else if (typeof n === "bigint") {
    return new Atom(n);
  } else if (typeof n === "string") {
    return Atom.fromCord(n);
  } else if (Array.isArray(n)) {
    if (n.length < 2) {
      return dwim$1(n[0]);
    }
    const head = dwim$1(n[n.length - 2]);
    const tail = dwim$1(n[n.length - 1]);
    let cel = new Cell(head, tail);
    for (var j = n.length - 3; j >= 0; --j) {
      cel = new Cell(dwim$1(n[j]), cel);
    }
    return cel;
  } else if (n === null) {
    return Atom.zero;
  }
  console.error("what do you mean??", typeof n, JSON.stringify(n));
  throw new Error("dwim, but meaning unclear");
}
function list$1(args) {
  if (args.length === 0) return Atom.zero;
  return dwim$1([...args, Atom.zero]);
}
function set(args) {
  if (args.length === 0) return Atom.zero;
  let set2 = Atom.zero;
  for (let arg of args) {
    set2 = putIn(set2, dwim$1(arg));
  }
  return set2;
}
function map(args) {
  if (args.length === 0) return Atom.zero;
  let map2 = Atom.zero;
  for (let arg of args) {
    map2 = putBy(map2, dwim$1(arg.key), dwim$1(arg.val));
  }
  return map2;
}
var dejs = {
  nounify: dwim$1,
  dwim: dwim$1,
  list: list$1,
  set,
  map
};
function mum(syd, fal, key) {
  let i = 0;
  while (i < 8) {
    const haz = murmurhash3_bi(null, key, syd);
    const ham = haz >>> 31 ^ haz & 2147483647;
    if (0 !== ham) return ham;
    i++;
    syd++;
  }
  return fal;
}
function dor(a, b) {
  if (a.equals(b)) return true;
  if (a.isCell()) {
    if (b.isAtom()) return false;
    if (a.head.equals(b.head))
      return dor(a.tail, b.tail);
    return dor(a.head, b.head);
  }
  if (b.isCell()) return true;
  return a < b;
}
function gor(a, b) {
  const c = a.mug();
  const d = b.mug();
  if (c === d)
    return dor(a, b);
  return c < d;
}
function mor(a, b) {
  const c = Atom.fromInt(a.mug()).mug();
  const d = Atom.fromInt(b.mug()).mug();
  if (c === d)
    return dor(a, b);
  return c < d;
}
function isSet(a) {
  return a.isCell() && a.tail.isCell();
}
function putIn(a, b) {
  if (a.equals(Atom.zero)) {
    return dwim$1(b, null, null);
  }
  if (!isSet(a)) {
    throw new Error("malformed set");
  }
  if (b.equals(a.head)) {
    return a;
  }
  if (gor(b, a.head)) {
    const c2 = putIn(a.tail.head, b);
    if (!isSet(c2)) {
      throw new Error("implementation error");
    }
    if (mor(a.head, c2.head)) {
      return dwim$1(a.head, c2, a.tail.tail);
    }
    return dwim$1(c2.head, c2.tail.head, [a.head, c2.tail.tail, a.tail.tail]);
  }
  const c = putIn(a.tail.tail, b);
  if (!isSet(c)) {
    throw new Error("implementation error");
  }
  if (mor(a.head, c.head)) {
    return dwim$1(a.head, a.tail.head, c);
  }
  return dwim$1(c.head, [a.head, a.tail.head, c.tail.head], c.tail.tail);
}
function isMap(a) {
  return a.isCell() && a.head.isCell() && a.tail.isCell();
}
function putBy(a, b, c) {
  if (a.equals(Atom.zero)) {
    return dwim$1([b, c], null, null);
  }
  if (!isMap(a)) {
    throw new Error("malformed map");
  }
  if (b.equals(a.head.head)) {
    if (c.equals(a.head.tail)) {
      return a;
    }
    return dwim$1([b, c], a.tail);
  }
  if (gor(b, a.head.head)) {
    const d2 = putBy(a.tail.head, b, c);
    if (!isMap(d2)) {
      throw new Error("implementation error");
    }
    if (mor(a.head.head, d2.head.head)) {
      return dwim$1(a.head, d2, a.tail.tail);
    }
    return dwim$1(d2.head, d2.tail.head, [a.head, d2.tail.tail, a.tail.tail]);
  }
  const d = putBy(a.tail.tail, b, c);
  if (!isMap(d)) {
    throw new Error("implementation error");
  }
  if (mor(a.head.head, d.head.head)) {
    return dwim$1(a.head, a.tail.head, d);
  }
  return dwim$1(d.head, [a.head, a.tail.head, d.tail.head], d.tail.tail);
}
var _Atom;
var fragCache = {
  "0": function(a) {
    throw new Error("Bail");
  },
  "1": function(a) {
    return a;
  }
};
var Atom = class _Atom2 {
  constructor(number) {
    this.number = void 0;
    this._mug = 0;
    this.deep = false;
    this.number = number;
  }
  // common methods with Cell
  isAtom() {
    return true;
  }
  isCell() {
    return false;
  }
  pretty(out, hasTail) {
    if (this.number < 65536n) out.push(this.number.toString(10));
    else {
      let tap = [], isTa = true, isTas = true, bytes = bigIntToByteArray(this.number);
      for (let i = bytes.length - 1; i >= 0; --i) {
        const c = bytes[i];
        if (isTa && (c < 32 || c > 127)) {
          isTa = false;
          isTas = false;
          break;
        } else if (isTas && !(c > 47 && c < 58 || c > 96 && c < 123 || c === 45)) isTas = false;
        tap.push(String.fromCharCode(c));
      }
      if (isTas) {
        out.push("%");
        out.push.apply(out, tap);
      } else if (isTa) {
        out.push("'");
        out.push.apply(out, tap);
        out.push("'");
      } else {
        out.push("0x");
        out.push(this.number.toString(16));
      }
    }
  }
  toString() {
    const parts = [];
    this.pretty(parts, false);
    return parts.join("");
  }
  equals(o) {
    return o instanceof _Atom2 && o.number === this.number;
  }
  loob() {
    if (Number(this.number) === 0) return true;
    if (Number(this.number) === 1) return false;
    else throw new Error("Bail");
  }
  mug() {
    if (this._mug === 0) this._mug = this.calculateMug();
    return this._mug;
  }
  calculateMug() {
    return mum(3405691582, 32767, this.number);
  }
  mugged() {
    return this._mug !== 0;
  }
  at(a) {
    return _Atom2.fragmenter(a)(this);
  }
  // Atom specific methods
  bump() {
    return new _Atom2(this.number + 1n);
  }
  bytes() {
    const bytes = bigIntToByteArray(this.number);
    const r = [];
    for (var i = bytes.length - 1; i >= 0; --i) {
      r.push(bytes[i] & 255);
    }
    return r;
  }
  cap() {
    if (Number(this.number) === 0) throw new Error("Bail");
    if (Number(this.number) === 1) throw new Error("Bail");
    else return testBit(this.number, bitLength(this.number) - 2) ? new _Atom2(3n) : new _Atom2(2n);
  }
  mas() {
    if (Number(this.number) === 0) throw new Error("Bail");
    if (Number(this.number) === 1) throw new Error("Bail");
    if (Number(this.number) === 2) return new _Atom2(1n);
    if (Number(this.number) === 3) return new _Atom2(1n);
    else {
      const n = this.number;
      const l = bitLength(n) - 2;
      const addTop = BigInt(1 << l);
      const mask = BigInt((1 << l) - 1);
      return new _Atom2(n & mask ^ addTop);
    }
  }
  shortCode() {
    return this.number.toString(36);
  }
  // Class Methods
  static cordToString(c) {
    const bytes = c.bytes(), chars = [];
    for (let i = 0; i < bytes.length; ++i) {
      chars.push(String.fromCharCode(bytes[i]));
    }
    return chars.join("");
  }
  // cached tree addressing function constructor
  static fragmenter(a) {
    const s = a.shortCode();
    if (fragCache.hasOwnProperty(s)) {
      return fragCache[s];
    } else {
      for (var parts = ["a"]; !_Atom2.one.equals(a); a = a.mas()) {
        parts.push(_Atom2.two.equals(a.cap()) ? "head" : "tail");
      }
      return fragCache[s] = new Function("a", "return " + parts.join(".") + ";");
    }
  }
  // Atom builders
  static fromString(str, radix) {
    if (radix === void 0) {
      radix = 10;
    }
    const num = bigIntFromStringWithRadix(str, radix);
    return new _Atom2(num);
  }
  static fromInt(n) {
    if (n < 256) return _Atom2.small[n];
    else return new _Atom2(BigInt(n));
  }
  static fromCord(str) {
    if (str.length === 0) return _Atom2.zero;
    let i, j, octs = Array(str.length);
    for (i = 0, j = octs.length - 1; i < octs.length; ++i, --j) {
      const charByte = (str.charCodeAt(i) & 255).toString(16);
      octs[j] = charByte.length === 1 ? "0" + charByte : charByte;
    }
    if (str.length > 4) return _Atom2.fromString(octs.join(""), 16);
    else return new _Atom2(BigInt(parseInt(octs.join(""), 16)));
  }
};
_Atom = Atom;
Atom.small = /* @__PURE__ */ Array.from(Array(256)).map(function(_, i) {
  return new _Atom(BigInt(i));
});
Atom.zero = _Atom.small[0];
Atom.one = _Atom.small[1];
Atom.two = _Atom.small[2];
Atom.three = _Atom.small[3];
var Cell = class _Cell {
  constructor(head, tail, deep) {
    if (deep === void 0) {
      deep = true;
    }
    this.head = void 0;
    this.tail = void 0;
    this.deep = void 0;
    this._mug = 0;
    this.head = head;
    this.tail = tail;
    this.deep = deep;
  }
  // common methods
  isAtom() {
    return false;
  }
  isCell() {
    return true;
  }
  pretty(out, hasTail) {
    if (!hasTail) out.push("[");
    this.head.pretty(out, false);
    out.push(" ");
    this.tail.pretty(out, true);
    if (!hasTail) out.push("]");
  }
  toString() {
    const parts = [];
    this.pretty(parts, false);
    return parts.join("");
  }
  mug() {
    if (this._mug === 0) this._mug = this.calculateMug();
    return this._mug;
  }
  calculateMug() {
    return mum(3735928559, 65534, BigInt(this.tail.mug()) << 32n | BigInt(this.head.mug()));
  }
  mugged() {
    return this._mug !== 0;
  }
  equals(o) {
    if (o instanceof _Cell) return this.unify(o);
    else return false;
  }
  bump() {
    throw new Error("Bail");
  }
  loob() {
    throw new Error("Bail");
  }
  at(a) {
    return Atom.fragmenter(a)(this);
  }
  // Cell specific
  unify(o) {
    if (this === o) return true;
    if (o.mugged()) {
      if (this.mugged()) {
        if (this.mug() != o.mug()) return false;
      } else return o.unify(this);
    }
    if (this.head.equals(o.head)) {
      o.head = this.head;
      if (this.tail.equals(o.tail)) {
        o._mug = this._mug;
        o.tail = this.tail;
        return true;
      }
    }
    return false;
  }
};
function isAtom(a) {
  return a instanceof Atom;
}
function isCell(a) {
  return a instanceof Cell;
}
function isNoun(a) {
  return isAtom(a) || isCell(a);
}
var frond = function(opts) {
  return function(noun) {
    if (!(noun instanceof Cell && noun.head instanceof Atom)) {
      throw new Error("frond: noun not cell with tag head");
    }
    const tag = Atom.cordToString(noun.head);
    for (let i = 0; i < opts.length; i++) {
      if (tag === opts[i].tag) {
        return {
          [tag]: opts[i].get(noun.tail)
        };
      }
    }
    throw new Error("frond: unknown tag" + tag);
  };
};
var tuple = function(funs) {
  return function(noun) {
    let i = 0;
    let o = [];
    while (i < funs.length - 1) {
      if (noun.isAtom()) {
        throw new Error("tuple: noun too shallow");
      }
      o.push(funs[i](noun.head));
      noun = noun.tail;
      i++;
    }
    o.push(funs[i](noun));
    return o;
  };
};
var pairs = function(cels) {
  return function(noun) {
    let i = 0;
    let o = {};
    while (i < cels.length - 1) {
      if (!(noun instanceof Cell)) {
        throw new Error("pairs: noun too shallow");
      }
      o[cels[i].nom] = cels[i].get(noun.head);
      noun = noun.tail;
      i++;
    }
    o[cels[i].nom] = cels[i].get(noun);
    return o;
  };
};
var pair = function(na, ga, nb, gb) {
  return pairs([{
    nom: na,
    get: ga
  }, {
    nom: nb,
    get: gb
  }]);
};
var bucwut = function(opts) {
  return function(noun) {
    for (let i = 0; i < opts.length; i++) {
      try {
        const res = opts[i](noun);
        return res;
      } catch (e) {
        continue;
      }
    }
    throw new Error("bucwut: no matches");
  };
};
var buccen = function(opts) {
  return function(noun) {
    if (!(noun instanceof Cell && noun.head instanceof Atom)) {
      throw new Error("buccen: noun not cell with tag head");
    }
    const tag = Atom.cordToString(noun.head);
    for (let i = 0; i < opts.length; i++) {
      if (tag === opts[i].tag) {
        return opts[i].get(noun.tail);
      }
    }
    throw new Error("buccen: unknown tag: " + tag);
  };
};
var array = function(item) {
  return function(noun) {
    let a = [];
    while (noun instanceof Cell) {
      a.push(item(noun.head));
      noun = noun.tail;
    }
    return a;
  };
};
var tree = function(item) {
  return function(noun) {
    if (noun instanceof Cell) {
      if (!(noun.tail instanceof Cell)) {
        throw new Error("tree: malformed");
      }
      return [...tree(item)(noun.tail.tail), item(noun.head), ...tree(item)(noun.tail.head)];
    }
    return [];
  };
};
var cord = function(noun) {
  if (!(noun instanceof Atom)) {
    throw new Error(`cord: noun not atom ${noun.toString()}`);
  }
  return Atom.cordToString(noun);
};
var tape = function(noun) {
  return array((n) => {
    if (n.isCell()) {
      throw new Error("tape: malformed");
    }
    return Atom.cordToString(n);
  })(noun).join();
};
var numb = function(noun) {
  if (!(noun instanceof Atom)) {
    throw new Error("numb: noun not atom");
  }
  if (bitLength(noun.number) <= 32) {
    return Number(noun.number);
  } else {
    return noun.number.toString();
  }
};
var numb32 = function(noun) {
  if (!(noun instanceof Atom)) {
    throw new Error("numb32: noun not atom");
  }
  if (bitLength(noun.number) > 32) {
    throw new Error("numb32: number too big");
  }
  return Number(noun.number);
};
var numbString = function(noun) {
  if (!(noun instanceof Atom)) {
    throw new Error("numbString: noun not atom");
  }
  return noun.number.toString();
};
var loob = function(noun) {
  return noun.loob();
};
var nill = function(noun) {
  if (!(noun instanceof Atom && noun.number === 0n)) {
    throw new Error("nill: not null");
  }
  return null;
};
var path = /* @__PURE__ */ array(cord);
var enjs = {
  frond,
  tuple,
  pairs,
  pair,
  array,
  loob,
  tree,
  cord,
  tape,
  numb,
  numb32,
  numbString,
  path,
  buccen,
  bucwut,
  nill
};
function met(a, b) {
  var bits2 = bitLength(b.number), full = bits2 >>> a, part = full << a !== bits2;
  return part ? full + 1 : full;
}
function gth(a, b) {
  return a.number > b.number;
}
function lth(a, b) {
  return a.number < b.number;
}
function gte(a, b) {
  return a.number >= b.number;
}
function lte(a, b) {
  return a.number <= b.number;
}
function add(a, b) {
  return new Atom(a.number + b.number);
}
function sub(a, b) {
  var r = a.number - b.number;
  if (r < 0) {
    throw new Error("subtract underflow");
  } else {
    return new Atom(r);
  }
}
function dec(a) {
  return sub(a, Atom.one);
}
function bex(a) {
  const b = 1n << a.number;
  return new Atom(b);
}
function lsh(a, b, c) {
  var bits2 = Number(b.number << a.number);
  return new Atom(c.number << BigInt(bits2));
}
function rsh(a, b, c) {
  var bits2 = b.number << a.number;
  return new Atom(c.number >> BigInt(bits2));
}
function bytesToWords(bytes) {
  var len = bytes.length, trim = len % 4;
  let i, b, w;
  if (trim > 0) {
    len += 4 - trim;
    for (i = 0; i < trim; ++i) {
      bytes.push(0);
    }
  }
  const size = len >> 2;
  const words = new Array(size);
  for (i = 0, b = 0; i < size; ++i) {
    w = bytes[b++] << 0 & 255;
    w ^= bytes[b++] << 8 & 65280;
    w ^= bytes[b++] << 16 & 16711680;
    w ^= bytes[b++] << 24 & 4278190080;
    words[i] = w;
  }
  return words;
}
function wordsToBytes(words) {
  const buf = [];
  let w, i, b;
  for (i = 0, b = 0; i < words.length; ++i) {
    w = words[i];
    buf[b++] = 255 & (w & 255);
    buf[b++] = 255 & (w & 65280) >>> 8;
    buf[b++] = 255 & (w & 16711680) >>> 16;
    buf[b++] = 255 & (w & 4278190080) >>> 24;
  }
  while (buf[--b] === 0) {
    buf.pop();
  }
  return buf;
}
function bytesToAtom(bytes) {
  let byt, parts = [];
  for (var i = bytes.length - 1; i >= 0; --i) {
    byt = bytes[i] & 255;
    parts.push(byt < 16 ? "0" + byt.toString(16) : byt.toString(16));
  }
  const num = bigIntFromStringWithRadix(parts.join(""), 16);
  return new Atom(num);
}
function atomToBytes(atom) {
  return atom.bytes();
}
function atomToWords(atom) {
  return bytesToWords(atomToBytes(atom));
}
function wordsToAtom(words) {
  return bytesToAtom(wordsToBytes(words));
}
var malt = wordsToAtom;
function slaq(bloq, len) {
  return new Array((len << bloq) + 31 >>> 5);
}
function chop(met2, fum, wid, tou, dst, src) {
  var buf = atomToWords(src), len = buf.length, i, j, san, mek, baf, bat, hut, san, wuf, wut, waf, raf, wat, rat, hop;
  if (met2 < 5) {
    san = 1 << met2;
    mek = (1 << san) - 1;
    baf = fum << met2;
    bat = tou << met2;
    for (i = 0; i < wid; ++i) {
      waf = baf >>> 5;
      raf = baf & 31;
      wat = bat >>> 5;
      rat = bat & 31;
      hop = waf >= len ? 0 : buf[waf];
      hop = hop >>> raf & mek;
      dst[wat] ^= hop << rat;
      baf += san;
      bat += san;
    }
  } else {
    hut = met2 - 5;
    san = 1 << hut;
    for (i = 0; i < wid; ++i) {
      wuf = fum + i << hut;
      wut = tou + i << hut;
      for (j = 0; j < san; ++j) {
        dst[wut + j] ^= wuf + j >= len ? 0 : buf[wuf + j];
      }
    }
  }
}
function cut(a, b, c, d) {
  if (a.number === 0n) {
    return new Atom(d.number >> b.number & (1n << c.number) - 1n);
  }
  var ai = Number(a.number), bi = Number(b.number), ci = Number(c.number);
  var len = met(ai, d);
  if (Atom.zero.equals(c) || bi >= len) {
    return Atom.zero;
  }
  if (bi + ci > len) {
    ci = len - Number(b.number);
  }
  if (0 === bi && ci === len) {
    return d;
  } else {
    var sal = slaq(ai, ci);
    chop(ai, bi, ci, 0, sal, d);
    return malt(sal);
  }
}
var maxCat = /* @__PURE__ */ Atom.fromInt(4294967295);
var catBits = /* @__PURE__ */ Atom.fromInt(32);
function end(a, b, c) {
  if (gth(a, catBits)) {
    throw new Error("Fail");
  } else if (gth(b, maxCat)) {
    return c;
  } else {
    var ai = Number(a.number), bi = Number(b.number), len = met(ai, c);
    if (0 === bi) {
      return Atom.zero;
    } else if (bi >= len) {
      return c;
    } else {
      var sal = slaq(ai, bi);
      chop(ai, 0, bi, 0, sal, c);
      return malt(sal);
    }
  }
}
function mix(a, b) {
  return new Atom(a.number ^ b.number);
}
function cat(a, b, c) {
  if (gth(a, catBits)) {
    throw new Error("Fail");
  } else {
    var ai = Number(a.number), lew = met(ai, b), ler = met(ai, c), all = lew + ler;
    if (0 === all) {
      return Atom.zero;
    } else {
      const sal = slaq(ai, all);
      chop(ai, 0, lew, 0, sal, b);
      chop(ai, 0, ler, lew, sal, c);
      return malt(sal);
    }
  }
}
function can(a, b) {
  if (gth(a, catBits)) {
    throw new Error("Fail");
  } else {
    let ai = Number(a.number), tot = 0, cab = b, pos, i_cab, pi_cab, qi_cab;
    while (true) {
      if (Atom.zero.equals(cab)) break;
      if (cab instanceof Atom) throw new Error("Fail");
      i_cab = cab.head;
      if (i_cab instanceof Atom) throw new Error("Fail");
      else if (i_cab instanceof Cell) {
        pi_cab = i_cab.head;
        qi_cab = i_cab.tail;
      }
      if (pi_cab instanceof Atom && gth(pi_cab, maxCat)) throw new Error("Fail");
      if (qi_cab instanceof Cell) throw new Error("Fail");
      if (pi_cab instanceof Atom) tot += Number(pi_cab.number);
      if (cab instanceof Cell) cab = cab.tail;
    }
    if (0 === tot) return Atom.zero;
    var sal = slaq(ai, tot);
    cab = b;
    pos = 0;
    while (!Atom.zero.equals(cab)) {
      if (cab instanceof Cell) i_cab = cab.head;
      if (i_cab instanceof Cell) {
        if (i_cab.head instanceof Atom) pi_cab = Number(i_cab.head.number);
        qi_cab = i_cab.tail;
        chop(ai, 0, pi_cab, pos, sal, qi_cab);
        pos += pi_cab;
        if (cab instanceof Cell) cab = cab.tail;
      }
    }
    return malt(sal);
  }
}
var bits = {
  met,
  cut,
  add,
  sub,
  dec,
  gth,
  lth,
  gte,
  lte,
  bex,
  lsh,
  rsh,
  end,
  mix,
  cat,
  can,
  bytesToWords,
  wordsToBytes,
  bytesToAtom,
  atomToBytes,
  atomToWords,
  wordsToAtom
};
var dwim = dejs.dwim;
function flop(a) {
  var b = Atom.zero;
  while (true) {
    if (Atom.zero.equals(a)) {
      return b;
    } else if (a instanceof Atom) {
      throw new Error("Bail");
    } else {
      b = new Cell(a.head, b);
      a = a.tail;
    }
  }
}
function forEach(n, f) {
  while (true) {
    if (Atom.zero.equals(n)) {
      return;
    } else if (n instanceof Atom) {
      throw new Error("Bail");
    } else {
      f(n.head);
      n = n.tail;
    }
  }
}
var list = {
  flop,
  forEach
};
var Slot = class {
};
var Node = class extends Slot {
  constructor() {
    super();
    this.slots = void 0;
    this.slots = Array(32);
  }
  insert(key, val, lef, rem) {
    lef -= 5;
    const inx = rem >>> lef;
    rem &= (1 << lef) - 1;
    this.slots[inx] = void 0 === this.slots[inx] ? new Single(key, val) : this.slots[inx].insert(key, val, lef, rem);
    return this;
  }
  get(key, lef, rem) {
    lef -= 5;
    const inx = rem >>> lef;
    rem &= (1 << lef) - 1;
    const sot = this.slots[inx];
    return void 0 === sot ? void 0 : sot.get(key, lef, rem);
  }
};
var Bucket = class extends Slot {
  constructor() {
    super();
    this.singles = void 0;
    this.singles = [];
  }
  insert(key, val, lef, rem) {
    const a = this.singles;
    for (var i = 0; i < a.length; ++i) {
      const s = a[i];
      if (s.key.equals(key)) {
        s.val = val;
        return this;
      }
    }
    a.push(new Single(key, val));
    return this;
  }
  get(key) {
    const a = this.singles;
    for (var i = 0; i < a.length; ++i) {
      const s = a[i];
      if (s.key.equals(key)) {
        return s.val;
      }
    }
  }
};
var Single = class extends Slot {
  constructor(key, val) {
    super();
    this.key = void 0;
    this.val = void 0;
    this.key = key;
    this.val = val;
  }
  insert(key, val, lef, rem) {
    if (this.key.equals(key)) {
      this.val = val;
      return this;
    } else {
      const rom = this.key.mug() & (1 << lef) - 1;
      const n = lef > 0 ? new Node() : new Bucket();
      n.insert(this.key, this.val, lef, rom);
      n.insert(key, val, lef, rem);
      return n;
    }
  }
  get(key) {
    if (this.key.equals(key)) return this.val;
  }
};
var NounMap = class {
  constructor() {
    this.slots = void 0;
    this.slots = Array(64);
  }
  insert(key, val) {
    const m = key.mug();
    const inx = m >>> 25;
    const sot = this.slots;
    if (sot[inx] === void 0) sot[inx] = new Single(key, val);
    else {
      var rem = m & (1 << 25) - 1;
      sot[inx] = sot[inx].insert(key, val, 25, rem);
    }
  }
  get(key) {
    const m = key.mug();
    const inx = m >>> 25;
    const sot = this.slots[inx];
    if (void 0 === sot) {
      return void 0;
    } else {
      var rem = m & (1 << 25) - 1;
      return sot.get(key, 25, rem);
    }
  }
};
function bytesToBigint(bytes) {
  if (bytes.length === 1) return BigInt(bytes[0]);
  let byt, parts = [];
  for (var i = bytes.length - 1; i >= 0; --i) {
    byt = bytes[i] & 255;
    parts.push(byt.toString(16).padStart(2, "0"));
  }
  const num = bigIntFromStringWithRadix(parts.join(""), 16);
  return num;
}
function bigintToDataView(a) {
  return new DataView(new Uint8Array(bigIntToByteArray(a).reverse()).buffer);
}
function dv_bit(b, d) {
  const byte = Math.floor(b / 8);
  return d.getUint8(byte) >> b % 8 & 1;
}
function dv_bitLength(d) {
  const l = d.byteLength - 1;
  if (l > 2 ** 49) throw new Error("bail: oversized byte buffer");
  return l * 8 + d.getUint8(l).toString(2).length;
}
function dv_cut(b, c, d) {
  if (c === 1) return dv_bit(b, d) ? 1n : 0n;
  const offset = b % 8;
  if (offset === 0) return dv_cut_at_bytes(b, c, d);
  const out = [];
  let curByte = Math.floor(b / 8);
  const bitsFromOne = 8 - offset;
  const bitsFromTwo = offset;
  const twoMask = 255 >> 8 - bitsFromTwo;
  while (c >= 8) {
    const one = d.getUint8(curByte);
    const two = d.getUint8(curByte + 1);
    const left = (two & twoMask) << bitsFromOne;
    const right = one >> bitsFromTwo;
    out.push(left | right);
    curByte++;
    c -= 8;
  }
  if (c > 0n) {
    const bitsFromOne2 = Math.min(c, 8 - offset);
    const bitsFromTwo2 = c - bitsFromOne2;
    const oneMask = 255 >> 8 - bitsFromOne2 << offset;
    const twoMask2 = 255 >> 8 - bitsFromTwo2;
    const one = d.getUint8(curByte);
    const two = curByte + 1 >= d.byteLength ? 0 : d.getUint8(curByte + 1);
    const left = bitsFromTwo2 === 0 ? 0 : (two & twoMask2) << bitsFromOne2;
    const right = (one & oneMask) >> offset;
    out.push(left | right);
  }
  return bytesToBigint(out);
}
function dv_cut_at_bytes(b, c, d) {
  if (b % 8 !== 0) throw new Error("non-byte-aligned read " + b);
  let curByte = Math.floor(b / 8);
  const out = [];
  while (c >= 8) {
    out.push(d.getUint8(curByte));
    curByte++;
    c -= 8;
  }
  if (c > 0n) {
    out.push(d.getUint8(curByte) & 255 >> 8 - c);
  }
  return bytesToBigint(out);
}
function rub(a, v, l) {
  var c, d, e, w, x, y, z, p, q, m;
  m = a + l;
  x = a;
  while (0 === dv_bit(x, v)) {
    y = x + 1;
    if (x > m) throw new Error("bail: rubbing past end");
    x = y;
  }
  if (a === x) return {
    head: 1,
    tail: Atom.zero
  };
  c = x - a;
  d = x + 1;
  x = c - 1;
  if (x > 52) throw new Error("bail: rubbing oversized pointer (>52 bits)");
  y = 2 ** x;
  z = Number(dv_cut(d, x, v));
  e = y + z;
  w = c + c;
  y = w + e;
  z = d + x;
  p = w + e;
  q = dv_cut(z, e, v);
  return {
    head: p,
    tail: new Atom(q)
  };
}
function insert(m, k, n) {
  return m[k] = n;
}
function get(m, k) {
  return m[k];
}
function cue_in(m, vv2, l, b) {
  let head;
  let tailhead;
  if (0 === dv_bit(b, vv2)) {
    const x = 1 + b;
    const c = rub(x, vv2, l);
    head = c.head + 1;
    tailhead = c.tail;
    insert(m, b, tailhead);
  } else {
    let b2 = 2 + b;
    let b12 = 1 + b;
    if (0 === dv_bit(b12, vv2)) {
      const u = cue_in(m, vv2, l, b2);
      const x = u.head + b2;
      const v = cue_in(m, vv2, l, x);
      const y = u.head + v.head;
      head = 2 + y;
      tailhead = new Cell(u.tail, v.tail);
      insert(m, b, tailhead);
    } else {
      const d = rub(b2, vv2, l);
      const dd = get(m, Number(d.tail.number));
      if (void 0 === dd) throw new Error("Bail");
      head = 2 + d.head;
      tailhead = dd;
    }
  }
  return {
    head,
    tail: tailhead
  };
}
function cue(a) {
  return cue_bytes(bigintToDataView(a.number));
}
function cue_bytes(v) {
  return cue_in({}, v, dv_bitLength(v), 0).tail;
}
function mat(a) {
  if (Atom.zero.equals(a)) {
    return dwim(1, 1);
  } else {
    const b = dwim(bits.met(0, a)), c = dwim(bits.met(0, b)), u = bits.dec(c), v = bits.add(c, c), x = bits.end(Atom.zero, u, b), w = bits.bex(c), y = bits.lsh(Atom.zero, u, a), z = bits.mix(x, y), p = bits.add(v, b), q = bits.cat(Atom.zero, w, z);
    return dwim(p, q);
  }
}
function _jam_in_pair(m, h_a, t_a, b, l) {
  var w = dwim([2, 1], l), x = bits.add(Atom.two, b), d = _jam_in(m, h_a, x, w), y = bits.add(x, d.head), e = _jam_in(m, t_a, y, d.tail.head), z = bits.add(d.head, e.head);
  return dwim(bits.add(Atom.two, z), e.tail.head, Atom.zero);
}
function _jam_in_ptr(u_c, l) {
  var d = mat(u_c), x = bits.lsh(Atom.zero, Atom.two, d.tail), y = bits.add(Atom.two, d.head);
  return dwim(y, [[y, bits.mix(Atom.three, x)], l], Atom.zero);
}
function _jam_in_flat(a, l) {
  var d = mat(a), x = bits.add(Atom.one, d.head);
  return dwim(x, [[x, bits.lsh(Atom.zero, Atom.one, d.tail)], l], Atom.zero);
}
function _jam_in(m, a, b, l) {
  const c = m.get(a);
  if (void 0 == c) {
    m.insert(a, b);
    return a instanceof Cell ? _jam_in_pair(m, a.head, a.tail, b, l) : _jam_in_flat(a, l);
  } else if (a instanceof Atom && bits.met(0, a) <= bits.met(0, c)) {
    return _jam_in_flat(a, l);
  } else {
    return _jam_in_ptr(c, l);
  }
}
function jam(n) {
  const x = _jam_in(new NounMap(), n, Atom.zero, Atom.zero), q = list.flop(x.tail.head);
  return bits.can(Atom.zero, q);
}

// ../api-beta/node_modules/browser-or-node/dist/index.mjs
var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isNode = (
  // @ts-expect-error
  typeof process !== "undefined" && // @ts-expect-error
  process.versions != null && // @ts-expect-error
  process.versions.node != null
);
var isWebWorker = typeof self === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
var isJsDom = typeof window !== "undefined" && window.name === "nodejs" || typeof navigator !== "undefined" && "userAgent" in navigator && typeof navigator.userAgent === "string" && (navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom"));
var isDeno = (
  // @ts-expect-error
  typeof Deno !== "undefined" && // @ts-expect-error
  typeof Deno.version !== "undefined" && // @ts-expect-error
  typeof Deno.version.deno !== "undefined"
);
var isBun = typeof process !== "undefined" && process.versions != null && process.versions.bun != null;

// ../api-beta/dist/index.js
var import_big_integer = __toESM(require_BigInteger(), 1);
var import_sorted_btree = __toESM(require_b_tree(), 1);
var import_exponential_backoff = __toESM(require_backoff(), 1);
var import_emoji_regex = __toESM(require_emoji_regex(), 1);
var gy = Object.defineProperty;
var my = (n, r, i) => r in n ? gy(n, r, { enumerable: true, configurable: true, writable: true, value: i }) : n[r] = i;
var Ee = (n, r, i) => my(n, typeof r != "symbol" ? r + "" : r, i);
var kr = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _y(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var Fi = { exports: {} };
Fi.exports;
(function(n, r) {
  (function() {
    var i, s = "4.17.23", l = 200, f = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", y = "Expected a function", h = "Invalid `variable` option passed into `_.template`", I = "__lodash_hash_undefined__", C = 500, k = "__lodash_placeholder__", R = 1, G = 2, D = 4, Y = 1, F = 2, H = 1, ue = 2, Ue = 4, Z = 8, oe = 16, ce = 32, xe = 64, ge = 128, Ct = 256, bn = 512, Lr = 30, Ji = "...", Vi = 800, Yi = 16, pr = 1, Mr = 2, Zi = 3, Mt = 1 / 0, Pt = 9007199254740991, Xi = 17976931348623157e292, $n = NaN, he = 4294967295, Me = he - 1, $r = he >>> 1, Gr = [
      ["ary", ge],
      ["bind", H],
      ["bindKey", ue],
      ["curry", Z],
      ["curryRight", oe],
      ["flip", bn],
      ["partial", ce],
      ["partialRight", xe],
      ["rearg", Ct]
    ], $t = "[object Arguments]", Cn = "[object Array]", Wr = "[object AsyncFunction]", pt = "[object Boolean]", Gt = "[object Date]", Hr = "[object DOMException]", Gn = "[object Error]", Sn = "[object Function]", Wt = "[object GeneratorFunction]", Fe = "[object Map]", En = "[object Number]", Qi = "[object Null]", nt = "[object Object]", zr = "[object Promise]", eo = "[object Proxy]", an = "[object RegExp]", $e = "[object Set]", Ge = "[object String]", un = "[object Symbol]", to = "[object Undefined]", Ve = "[object WeakMap]", no = "[object WeakSet]", d = "[object ArrayBuffer]", u = "[object DataView]", c = "[object Float32Array]", w = "[object Float64Array]", b = "[object Int8Array]", x = "[object Int16Array]", P = "[object Int32Array]", X = "[object Uint8Array]", ve = "[object Uint8ClampedArray]", me = "[object Uint16Array]", _e = "[object Uint32Array]", de = /\b__p \+= '';/g, Fl = /\b(__p \+=) '' \+/g, Dl = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ws = /&(?:amp|lt|gt|quot|#39);/g, Hs = /[&<>"']/g, Ll = RegExp(Ws.source), Ml = RegExp(Hs.source), $l = /<%-([\s\S]+?)%>/g, Gl = /<%([\s\S]+?)%>/g, zs = /<%=([\s\S]+?)%>/g, Wl = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Hl = /^\w*$/, zl = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, ro = /[\\^$.*+?()[\]{}|]/g, ql = RegExp(ro.source), io = /^\s+/, jl = /\s/, Kl = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, Jl = /\{\n\/\* \[wrapped with (.+)\] \*/, Vl = /,? & /, Yl = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Zl = /[()=,{}\[\]\/\s]/, Xl = /\\(\\)?/g, Ql = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, qs = /\w*$/, ef = /^[-+]0x[0-9a-f]+$/i, tf = /^0b[01]+$/i, nf = /^\[object .+?Constructor\]$/, rf = /^0o[0-7]+$/i, of = /^(?:0|[1-9]\d*)$/, sf = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, qr = /($^)/, af = /['\n\r\u2028\u2029\\]/g, jr = "\\ud800-\\udfff", uf = "\\u0300-\\u036f", cf = "\\ufe20-\\ufe2f", lf = "\\u20d0-\\u20ff", js = uf + cf + lf, Ks = "\\u2700-\\u27bf", Js = "a-z\\xdf-\\xf6\\xf8-\\xff", ff = "\\xac\\xb1\\xd7\\xf7", pf = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", hf = "\\u2000-\\u206f", df = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", Vs = "A-Z\\xc0-\\xd6\\xd8-\\xde", Ys = "\\ufe0e\\ufe0f", Zs = ff + pf + hf + df, oo = "['\u2019]", gf = "[" + jr + "]", Xs = "[" + Zs + "]", Kr = "[" + js + "]", Qs = "\\d+", mf = "[" + Ks + "]", ea = "[" + Js + "]", ta = "[^" + jr + Zs + Qs + Ks + Js + Vs + "]", so = "\\ud83c[\\udffb-\\udfff]", yf = "(?:" + Kr + "|" + so + ")", na = "[^" + jr + "]", ao = "(?:\\ud83c[\\udde6-\\uddff]){2}", uo = "[\\ud800-\\udbff][\\udc00-\\udfff]", Wn = "[" + Vs + "]", ra = "\\u200d", ia = "(?:" + ea + "|" + ta + ")", wf = "(?:" + Wn + "|" + ta + ")", oa = "(?:" + oo + "(?:d|ll|m|re|s|t|ve))?", sa = "(?:" + oo + "(?:D|LL|M|RE|S|T|VE))?", aa = yf + "?", ua = "[" + Ys + "]?", vf = "(?:" + ra + "(?:" + [na, ao, uo].join("|") + ")" + ua + aa + ")*", _f = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", If = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ca = ua + aa + vf, bf = "(?:" + [mf, ao, uo].join("|") + ")" + ca, Cf = "(?:" + [na + Kr + "?", Kr, ao, uo, gf].join("|") + ")", Sf = RegExp(oo, "g"), Ef = RegExp(Kr, "g"), co = RegExp(so + "(?=" + so + ")|" + Cf + ca, "g"), xf = RegExp([
      Wn + "?" + ea + "+" + oa + "(?=" + [Xs, Wn, "$"].join("|") + ")",
      wf + "+" + sa + "(?=" + [Xs, Wn + ia, "$"].join("|") + ")",
      Wn + "?" + ia + "+" + oa,
      Wn + "+" + sa,
      If,
      _f,
      Qs,
      bf
    ].join("|"), "g"), Af = RegExp("[" + ra + jr + js + Ys + "]"), kf = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Tf = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], Rf = -1, be = {};
    be[c] = be[w] = be[b] = be[x] = be[P] = be[X] = be[ve] = be[me] = be[_e] = true, be[$t] = be[Cn] = be[d] = be[pt] = be[u] = be[Gt] = be[Gn] = be[Sn] = be[Fe] = be[En] = be[nt] = be[an] = be[$e] = be[Ge] = be[Ve] = false;
    var Ie = {};
    Ie[$t] = Ie[Cn] = Ie[d] = Ie[u] = Ie[pt] = Ie[Gt] = Ie[c] = Ie[w] = Ie[b] = Ie[x] = Ie[P] = Ie[Fe] = Ie[En] = Ie[nt] = Ie[an] = Ie[$e] = Ie[Ge] = Ie[un] = Ie[X] = Ie[ve] = Ie[me] = Ie[_e] = true, Ie[Gn] = Ie[Sn] = Ie[Ve] = false;
    var Pf = {
      // Latin-1 Supplement block.
      \u00C0: "A",
      \u00C1: "A",
      \u00C2: "A",
      \u00C3: "A",
      \u00C4: "A",
      \u00C5: "A",
      \u00E0: "a",
      \u00E1: "a",
      \u00E2: "a",
      \u00E3: "a",
      \u00E4: "a",
      \u00E5: "a",
      \u00C7: "C",
      \u00E7: "c",
      \u00D0: "D",
      \u00F0: "d",
      \u00C8: "E",
      \u00C9: "E",
      \u00CA: "E",
      \u00CB: "E",
      \u00E8: "e",
      \u00E9: "e",
      \u00EA: "e",
      \u00EB: "e",
      \u00CC: "I",
      \u00CD: "I",
      \u00CE: "I",
      \u00CF: "I",
      \u00EC: "i",
      \u00ED: "i",
      \u00EE: "i",
      \u00EF: "i",
      \u00D1: "N",
      \u00F1: "n",
      \u00D2: "O",
      \u00D3: "O",
      \u00D4: "O",
      \u00D5: "O",
      \u00D6: "O",
      \u00D8: "O",
      \u00F2: "o",
      \u00F3: "o",
      \u00F4: "o",
      \u00F5: "o",
      \u00F6: "o",
      \u00F8: "o",
      \u00D9: "U",
      \u00DA: "U",
      \u00DB: "U",
      \u00DC: "U",
      \u00F9: "u",
      \u00FA: "u",
      \u00FB: "u",
      \u00FC: "u",
      \u00DD: "Y",
      \u00FD: "y",
      \u00FF: "y",
      \u00C6: "Ae",
      \u00E6: "ae",
      \u00DE: "Th",
      \u00FE: "th",
      \u00DF: "ss",
      // Latin Extended-A block.
      \u0100: "A",
      \u0102: "A",
      \u0104: "A",
      \u0101: "a",
      \u0103: "a",
      \u0105: "a",
      \u0106: "C",
      \u0108: "C",
      \u010A: "C",
      \u010C: "C",
      \u0107: "c",
      \u0109: "c",
      \u010B: "c",
      \u010D: "c",
      \u010E: "D",
      \u0110: "D",
      \u010F: "d",
      \u0111: "d",
      \u0112: "E",
      \u0114: "E",
      \u0116: "E",
      \u0118: "E",
      \u011A: "E",
      \u0113: "e",
      \u0115: "e",
      \u0117: "e",
      \u0119: "e",
      \u011B: "e",
      \u011C: "G",
      \u011E: "G",
      \u0120: "G",
      \u0122: "G",
      \u011D: "g",
      \u011F: "g",
      \u0121: "g",
      \u0123: "g",
      \u0124: "H",
      \u0126: "H",
      \u0125: "h",
      \u0127: "h",
      \u0128: "I",
      \u012A: "I",
      \u012C: "I",
      \u012E: "I",
      \u0130: "I",
      \u0129: "i",
      \u012B: "i",
      \u012D: "i",
      \u012F: "i",
      \u0131: "i",
      \u0134: "J",
      \u0135: "j",
      \u0136: "K",
      \u0137: "k",
      \u0138: "k",
      \u0139: "L",
      \u013B: "L",
      \u013D: "L",
      \u013F: "L",
      \u0141: "L",
      \u013A: "l",
      \u013C: "l",
      \u013E: "l",
      \u0140: "l",
      \u0142: "l",
      \u0143: "N",
      \u0145: "N",
      \u0147: "N",
      \u014A: "N",
      \u0144: "n",
      \u0146: "n",
      \u0148: "n",
      \u014B: "n",
      \u014C: "O",
      \u014E: "O",
      \u0150: "O",
      \u014D: "o",
      \u014F: "o",
      \u0151: "o",
      \u0154: "R",
      \u0156: "R",
      \u0158: "R",
      \u0155: "r",
      \u0157: "r",
      \u0159: "r",
      \u015A: "S",
      \u015C: "S",
      \u015E: "S",
      \u0160: "S",
      \u015B: "s",
      \u015D: "s",
      \u015F: "s",
      \u0161: "s",
      \u0162: "T",
      \u0164: "T",
      \u0166: "T",
      \u0163: "t",
      \u0165: "t",
      \u0167: "t",
      \u0168: "U",
      \u016A: "U",
      \u016C: "U",
      \u016E: "U",
      \u0170: "U",
      \u0172: "U",
      \u0169: "u",
      \u016B: "u",
      \u016D: "u",
      \u016F: "u",
      \u0171: "u",
      \u0173: "u",
      \u0174: "W",
      \u0175: "w",
      \u0176: "Y",
      \u0177: "y",
      \u0178: "Y",
      \u0179: "Z",
      \u017B: "Z",
      \u017D: "Z",
      \u017A: "z",
      \u017C: "z",
      \u017E: "z",
      \u0132: "IJ",
      \u0133: "ij",
      \u0152: "Oe",
      \u0153: "oe",
      \u0149: "'n",
      \u017F: "s"
    }, Uf = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, Bf = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, Nf = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, Of = parseFloat, Ff = parseInt, la = typeof kr == "object" && kr && kr.Object === Object && kr, Df = typeof self == "object" && self && self.Object === Object && self, De = la || Df || Function("return this")(), lo = r && !r.nodeType && r, xn = lo && true && n && !n.nodeType && n, fa = xn && xn.exports === lo, fo = fa && la.process, ht = (function() {
      try {
        var S = xn && xn.require && xn.require("util").types;
        return S || fo && fo.binding && fo.binding("util");
      } catch {
      }
    })(), pa = ht && ht.isArrayBuffer, ha = ht && ht.isDate, da = ht && ht.isMap, ga = ht && ht.isRegExp, ma = ht && ht.isSet, ya = ht && ht.isTypedArray;
    function rt(S, T, A) {
      switch (A.length) {
        case 0:
          return S.call(T);
        case 1:
          return S.call(T, A[0]);
        case 2:
          return S.call(T, A[0], A[1]);
        case 3:
          return S.call(T, A[0], A[1], A[2]);
      }
      return S.apply(T, A);
    }
    function Lf(S, T, A, M) {
      for (var K = -1, se = S == null ? 0 : S.length; ++K < se; ) {
        var Be = S[K];
        T(M, Be, A(Be), S);
      }
      return M;
    }
    function dt(S, T) {
      for (var A = -1, M = S == null ? 0 : S.length; ++A < M && T(S[A], A, S) !== false; )
        ;
      return S;
    }
    function Mf(S, T) {
      for (var A = S == null ? 0 : S.length; A-- && T(S[A], A, S) !== false; )
        ;
      return S;
    }
    function wa(S, T) {
      for (var A = -1, M = S == null ? 0 : S.length; ++A < M; )
        if (!T(S[A], A, S))
          return false;
      return true;
    }
    function cn(S, T) {
      for (var A = -1, M = S == null ? 0 : S.length, K = 0, se = []; ++A < M; ) {
        var Be = S[A];
        T(Be, A, S) && (se[K++] = Be);
      }
      return se;
    }
    function Jr(S, T) {
      var A = S == null ? 0 : S.length;
      return !!A && Hn(S, T, 0) > -1;
    }
    function po(S, T, A) {
      for (var M = -1, K = S == null ? 0 : S.length; ++M < K; )
        if (A(T, S[M]))
          return true;
      return false;
    }
    function Ce(S, T) {
      for (var A = -1, M = S == null ? 0 : S.length, K = Array(M); ++A < M; )
        K[A] = T(S[A], A, S);
      return K;
    }
    function ln(S, T) {
      for (var A = -1, M = T.length, K = S.length; ++A < M; )
        S[K + A] = T[A];
      return S;
    }
    function ho(S, T, A, M) {
      var K = -1, se = S == null ? 0 : S.length;
      for (M && se && (A = S[++K]); ++K < se; )
        A = T(A, S[K], K, S);
      return A;
    }
    function $f(S, T, A, M) {
      var K = S == null ? 0 : S.length;
      for (M && K && (A = S[--K]); K--; )
        A = T(A, S[K], K, S);
      return A;
    }
    function go(S, T) {
      for (var A = -1, M = S == null ? 0 : S.length; ++A < M; )
        if (T(S[A], A, S))
          return true;
      return false;
    }
    var Gf = mo("length");
    function Wf(S) {
      return S.split("");
    }
    function Hf(S) {
      return S.match(Yl) || [];
    }
    function va(S, T, A) {
      var M;
      return A(S, function(K, se, Be) {
        if (T(K, se, Be))
          return M = se, false;
      }), M;
    }
    function Vr(S, T, A, M) {
      for (var K = S.length, se = A + (M ? 1 : -1); M ? se-- : ++se < K; )
        if (T(S[se], se, S))
          return se;
      return -1;
    }
    function Hn(S, T, A) {
      return T === T ? tp(S, T, A) : Vr(S, _a, A);
    }
    function zf(S, T, A, M) {
      for (var K = A - 1, se = S.length; ++K < se; )
        if (M(S[K], T))
          return K;
      return -1;
    }
    function _a(S) {
      return S !== S;
    }
    function Ia(S, T) {
      var A = S == null ? 0 : S.length;
      return A ? wo(S, T) / A : $n;
    }
    function mo(S) {
      return function(T) {
        return T == null ? i : T[S];
      };
    }
    function yo(S) {
      return function(T) {
        return S == null ? i : S[T];
      };
    }
    function ba(S, T, A, M, K) {
      return K(S, function(se, Be, we) {
        A = M ? (M = false, se) : T(A, se, Be, we);
      }), A;
    }
    function qf(S, T) {
      var A = S.length;
      for (S.sort(T); A--; )
        S[A] = S[A].value;
      return S;
    }
    function wo(S, T) {
      for (var A, M = -1, K = S.length; ++M < K; ) {
        var se = T(S[M]);
        se !== i && (A = A === i ? se : A + se);
      }
      return A;
    }
    function vo(S, T) {
      for (var A = -1, M = Array(S); ++A < S; )
        M[A] = T(A);
      return M;
    }
    function jf(S, T) {
      return Ce(T, function(A) {
        return [A, S[A]];
      });
    }
    function Ca(S) {
      return S && S.slice(0, Aa(S) + 1).replace(io, "");
    }
    function it(S) {
      return function(T) {
        return S(T);
      };
    }
    function _o(S, T) {
      return Ce(T, function(A) {
        return S[A];
      });
    }
    function hr(S, T) {
      return S.has(T);
    }
    function Sa(S, T) {
      for (var A = -1, M = S.length; ++A < M && Hn(T, S[A], 0) > -1; )
        ;
      return A;
    }
    function Ea(S, T) {
      for (var A = S.length; A-- && Hn(T, S[A], 0) > -1; )
        ;
      return A;
    }
    function Kf(S, T) {
      for (var A = S.length, M = 0; A--; )
        S[A] === T && ++M;
      return M;
    }
    var Jf = yo(Pf), Vf = yo(Uf);
    function Yf(S) {
      return "\\" + Nf[S];
    }
    function Zf(S, T) {
      return S == null ? i : S[T];
    }
    function zn(S) {
      return Af.test(S);
    }
    function Xf(S) {
      return kf.test(S);
    }
    function Qf(S) {
      for (var T, A = []; !(T = S.next()).done; )
        A.push(T.value);
      return A;
    }
    function Io(S) {
      var T = -1, A = Array(S.size);
      return S.forEach(function(M, K) {
        A[++T] = [K, M];
      }), A;
    }
    function xa(S, T) {
      return function(A) {
        return S(T(A));
      };
    }
    function fn(S, T) {
      for (var A = -1, M = S.length, K = 0, se = []; ++A < M; ) {
        var Be = S[A];
        (Be === T || Be === k) && (S[A] = k, se[K++] = A);
      }
      return se;
    }
    function Yr(S) {
      var T = -1, A = Array(S.size);
      return S.forEach(function(M) {
        A[++T] = M;
      }), A;
    }
    function ep(S) {
      var T = -1, A = Array(S.size);
      return S.forEach(function(M) {
        A[++T] = [M, M];
      }), A;
    }
    function tp(S, T, A) {
      for (var M = A - 1, K = S.length; ++M < K; )
        if (S[M] === T)
          return M;
      return -1;
    }
    function np(S, T, A) {
      for (var M = A + 1; M--; )
        if (S[M] === T)
          return M;
      return M;
    }
    function qn(S) {
      return zn(S) ? ip(S) : Gf(S);
    }
    function St(S) {
      return zn(S) ? op(S) : Wf(S);
    }
    function Aa(S) {
      for (var T = S.length; T-- && jl.test(S.charAt(T)); )
        ;
      return T;
    }
    var rp = yo(Bf);
    function ip(S) {
      for (var T = co.lastIndex = 0; co.test(S); )
        ++T;
      return T;
    }
    function op(S) {
      return S.match(co) || [];
    }
    function sp(S) {
      return S.match(xf) || [];
    }
    var ap = function S(T) {
      T = T == null ? De : jn.defaults(De.Object(), T, jn.pick(De, Tf));
      var A = T.Array, M = T.Date, K = T.Error, se = T.Function, Be = T.Math, we = T.Object, bo = T.RegExp, up = T.String, gt = T.TypeError, Zr = A.prototype, cp = se.prototype, Kn = we.prototype, Xr = T["__core-js_shared__"], Qr = cp.toString, le = Kn.hasOwnProperty, lp = 0, ka = (function() {
        var e = /[^.]+$/.exec(Xr && Xr.keys && Xr.keys.IE_PROTO || "");
        return e ? "Symbol(src)_1." + e : "";
      })(), ei = Kn.toString, fp = Qr.call(we), pp = De._, hp = bo(
        "^" + Qr.call(le).replace(ro, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), ti = fa ? T.Buffer : i, pn = T.Symbol, ni = T.Uint8Array, Ta = ti ? ti.allocUnsafe : i, ri = xa(we.getPrototypeOf, we), Ra = we.create, Pa = Kn.propertyIsEnumerable, ii = Zr.splice, Ua = pn ? pn.isConcatSpreadable : i, dr = pn ? pn.iterator : i, An = pn ? pn.toStringTag : i, oi = (function() {
        try {
          var e = Un(we, "defineProperty");
          return e({}, "", {}), e;
        } catch {
        }
      })(), dp = T.clearTimeout !== De.clearTimeout && T.clearTimeout, gp = M && M.now !== De.Date.now && M.now, mp = T.setTimeout !== De.setTimeout && T.setTimeout, si = Be.ceil, ai = Be.floor, Co = we.getOwnPropertySymbols, yp = ti ? ti.isBuffer : i, Ba = T.isFinite, wp = Zr.join, vp = xa(we.keys, we), Ne = Be.max, We = Be.min, _p = M.now, Ip = T.parseInt, Na = Be.random, bp = Zr.reverse, So = Un(T, "DataView"), gr = Un(T, "Map"), Eo = Un(T, "Promise"), Jn = Un(T, "Set"), mr = Un(T, "WeakMap"), yr = Un(we, "create"), ui = mr && new mr(), Vn = {}, Cp = Bn(So), Sp = Bn(gr), Ep = Bn(Eo), xp = Bn(Jn), Ap = Bn(mr), ci = pn ? pn.prototype : i, wr = ci ? ci.valueOf : i, Oa = ci ? ci.toString : i;
      function g(e) {
        if (Ae(e) && !J(e) && !(e instanceof re)) {
          if (e instanceof mt)
            return e;
          if (le.call(e, "__wrapped__"))
            return Fu(e);
        }
        return new mt(e);
      }
      var Yn = /* @__PURE__ */ (function() {
        function e() {
        }
        return function(t) {
          if (!Se(t))
            return {};
          if (Ra)
            return Ra(t);
          e.prototype = t;
          var o = new e();
          return e.prototype = i, o;
        };
      })();
      function li() {
      }
      function mt(e, t) {
        this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = i;
      }
      g.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: $l,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: Gl,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: zs,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: g
        }
      }, g.prototype = li.prototype, g.prototype.constructor = g, mt.prototype = Yn(li.prototype), mt.prototype.constructor = mt;
      function re(e) {
        this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = he, this.__views__ = [];
      }
      function kp() {
        var e = new re(this.__wrapped__);
        return e.__actions__ = Ye(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = Ye(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = Ye(this.__views__), e;
      }
      function Tp() {
        if (this.__filtered__) {
          var e = new re(this);
          e.__dir__ = -1, e.__filtered__ = true;
        } else
          e = this.clone(), e.__dir__ *= -1;
        return e;
      }
      function Rp() {
        var e = this.__wrapped__.value(), t = this.__dir__, o = J(e), a = t < 0, p = o ? e.length : 0, m = Wh(0, p, this.__views__), v = m.start, _ = m.end, E = _ - v, U = a ? _ : v - 1, B = this.__iteratees__, N = B.length, L = 0, W = We(E, this.__takeCount__);
        if (!o || !a && p == E && W == E)
          return ou(e, this.__actions__);
        var q = [];
        e:
          for (; E-- && L < W; ) {
            U += t;
            for (var ee = -1, j = e[U]; ++ee < N; ) {
              var ne = B[ee], ie = ne.iteratee, at = ne.type, Ke = ie(j);
              if (at == Mr)
                j = Ke;
              else if (!Ke) {
                if (at == pr)
                  continue e;
                break e;
              }
            }
            q[L++] = j;
          }
        return q;
      }
      re.prototype = Yn(li.prototype), re.prototype.constructor = re;
      function kn(e) {
        var t = -1, o = e == null ? 0 : e.length;
        for (this.clear(); ++t < o; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      function Pp() {
        this.__data__ = yr ? yr(null) : {}, this.size = 0;
      }
      function Up(e) {
        var t = this.has(e) && delete this.__data__[e];
        return this.size -= t ? 1 : 0, t;
      }
      function Bp(e) {
        var t = this.__data__;
        if (yr) {
          var o = t[e];
          return o === I ? i : o;
        }
        return le.call(t, e) ? t[e] : i;
      }
      function Np(e) {
        var t = this.__data__;
        return yr ? t[e] !== i : le.call(t, e);
      }
      function Op(e, t) {
        var o = this.__data__;
        return this.size += this.has(e) ? 0 : 1, o[e] = yr && t === i ? I : t, this;
      }
      kn.prototype.clear = Pp, kn.prototype.delete = Up, kn.prototype.get = Bp, kn.prototype.has = Np, kn.prototype.set = Op;
      function Ht(e) {
        var t = -1, o = e == null ? 0 : e.length;
        for (this.clear(); ++t < o; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      function Fp() {
        this.__data__ = [], this.size = 0;
      }
      function Dp(e) {
        var t = this.__data__, o = fi(t, e);
        if (o < 0)
          return false;
        var a = t.length - 1;
        return o == a ? t.pop() : ii.call(t, o, 1), --this.size, true;
      }
      function Lp(e) {
        var t = this.__data__, o = fi(t, e);
        return o < 0 ? i : t[o][1];
      }
      function Mp(e) {
        return fi(this.__data__, e) > -1;
      }
      function $p(e, t) {
        var o = this.__data__, a = fi(o, e);
        return a < 0 ? (++this.size, o.push([e, t])) : o[a][1] = t, this;
      }
      Ht.prototype.clear = Fp, Ht.prototype.delete = Dp, Ht.prototype.get = Lp, Ht.prototype.has = Mp, Ht.prototype.set = $p;
      function zt(e) {
        var t = -1, o = e == null ? 0 : e.length;
        for (this.clear(); ++t < o; ) {
          var a = e[t];
          this.set(a[0], a[1]);
        }
      }
      function Gp() {
        this.size = 0, this.__data__ = {
          hash: new kn(),
          map: new (gr || Ht)(),
          string: new kn()
        };
      }
      function Wp(e) {
        var t = Ci(this, e).delete(e);
        return this.size -= t ? 1 : 0, t;
      }
      function Hp(e) {
        return Ci(this, e).get(e);
      }
      function zp(e) {
        return Ci(this, e).has(e);
      }
      function qp(e, t) {
        var o = Ci(this, e), a = o.size;
        return o.set(e, t), this.size += o.size == a ? 0 : 1, this;
      }
      zt.prototype.clear = Gp, zt.prototype.delete = Wp, zt.prototype.get = Hp, zt.prototype.has = zp, zt.prototype.set = qp;
      function Tn(e) {
        var t = -1, o = e == null ? 0 : e.length;
        for (this.__data__ = new zt(); ++t < o; )
          this.add(e[t]);
      }
      function jp(e) {
        return this.__data__.set(e, I), this;
      }
      function Kp(e) {
        return this.__data__.has(e);
      }
      Tn.prototype.add = Tn.prototype.push = jp, Tn.prototype.has = Kp;
      function Et(e) {
        var t = this.__data__ = new Ht(e);
        this.size = t.size;
      }
      function Jp() {
        this.__data__ = new Ht(), this.size = 0;
      }
      function Vp(e) {
        var t = this.__data__, o = t.delete(e);
        return this.size = t.size, o;
      }
      function Yp(e) {
        return this.__data__.get(e);
      }
      function Zp(e) {
        return this.__data__.has(e);
      }
      function Xp(e, t) {
        var o = this.__data__;
        if (o instanceof Ht) {
          var a = o.__data__;
          if (!gr || a.length < l - 1)
            return a.push([e, t]), this.size = ++o.size, this;
          o = this.__data__ = new zt(a);
        }
        return o.set(e, t), this.size = o.size, this;
      }
      Et.prototype.clear = Jp, Et.prototype.delete = Vp, Et.prototype.get = Yp, Et.prototype.has = Zp, Et.prototype.set = Xp;
      function Fa(e, t) {
        var o = J(e), a = !o && Nn(e), p = !o && !a && yn(e), m = !o && !a && !p && er(e), v = o || a || p || m, _ = v ? vo(e.length, up) : [], E = _.length;
        for (var U in e)
          (t || le.call(e, U)) && !(v && // Safari 9 has enumerable `arguments.length` in strict mode.
          (U == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          p && (U == "offset" || U == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          m && (U == "buffer" || U == "byteLength" || U == "byteOffset") || // Skip index properties.
          Jt(U, E))) && _.push(U);
        return _;
      }
      function Da(e) {
        var t = e.length;
        return t ? e[Fo(0, t - 1)] : i;
      }
      function Qp(e, t) {
        return Si(Ye(e), Rn(t, 0, e.length));
      }
      function eh(e) {
        return Si(Ye(e));
      }
      function xo(e, t, o) {
        (o !== i && !xt(e[t], o) || o === i && !(t in e)) && qt(e, t, o);
      }
      function vr(e, t, o) {
        var a = e[t];
        (!(le.call(e, t) && xt(a, o)) || o === i && !(t in e)) && qt(e, t, o);
      }
      function fi(e, t) {
        for (var o = e.length; o--; )
          if (xt(e[o][0], t))
            return o;
        return -1;
      }
      function th(e, t, o, a) {
        return hn(e, function(p, m, v) {
          t(a, p, o(p), v);
        }), a;
      }
      function La(e, t) {
        return e && Bt(t, Oe(t), e);
      }
      function nh(e, t) {
        return e && Bt(t, Xe(t), e);
      }
      function qt(e, t, o) {
        t == "__proto__" && oi ? oi(e, t, {
          configurable: true,
          enumerable: true,
          value: o,
          writable: true
        }) : e[t] = o;
      }
      function Ao(e, t) {
        for (var o = -1, a = t.length, p = A(a), m = e == null; ++o < a; )
          p[o] = m ? i : as(e, t[o]);
        return p;
      }
      function Rn(e, t, o) {
        return e === e && (o !== i && (e = e <= o ? e : o), t !== i && (e = e >= t ? e : t)), e;
      }
      function yt(e, t, o, a, p, m) {
        var v, _ = t & R, E = t & G, U = t & D;
        if (o && (v = p ? o(e, a, p, m) : o(e)), v !== i)
          return v;
        if (!Se(e))
          return e;
        var B = J(e);
        if (B) {
          if (v = zh(e), !_)
            return Ye(e, v);
        } else {
          var N = He(e), L = N == Sn || N == Wt;
          if (yn(e))
            return uu(e, _);
          if (N == nt || N == $t || L && !p) {
            if (v = E || L ? {} : Au(e), !_)
              return E ? Bh(e, nh(v, e)) : Uh(e, La(v, e));
          } else {
            if (!Ie[N])
              return p ? e : {};
            v = qh(e, N, _);
          }
        }
        m || (m = new Et());
        var W = m.get(e);
        if (W)
          return W;
        m.set(e, v), nc(e) ? e.forEach(function(j) {
          v.add(yt(j, t, o, j, e, m));
        }) : ec(e) && e.forEach(function(j, ne) {
          v.set(ne, yt(j, t, o, ne, e, m));
        });
        var q = U ? E ? Ko : jo : E ? Xe : Oe, ee = B ? i : q(e);
        return dt(ee || e, function(j, ne) {
          ee && (ne = j, j = e[ne]), vr(v, ne, yt(j, t, o, ne, e, m));
        }), v;
      }
      function rh(e) {
        var t = Oe(e);
        return function(o) {
          return Ma(o, e, t);
        };
      }
      function Ma(e, t, o) {
        var a = o.length;
        if (e == null)
          return !a;
        for (e = we(e); a--; ) {
          var p = o[a], m = t[p], v = e[p];
          if (v === i && !(p in e) || !m(v))
            return false;
        }
        return true;
      }
      function $a(e, t, o) {
        if (typeof e != "function")
          throw new gt(y);
        return xr(function() {
          e.apply(i, o);
        }, t);
      }
      function _r(e, t, o, a) {
        var p = -1, m = Jr, v = true, _ = e.length, E = [], U = t.length;
        if (!_)
          return E;
        o && (t = Ce(t, it(o))), a ? (m = po, v = false) : t.length >= l && (m = hr, v = false, t = new Tn(t));
        e:
          for (; ++p < _; ) {
            var B = e[p], N = o == null ? B : o(B);
            if (B = a || B !== 0 ? B : 0, v && N === N) {
              for (var L = U; L--; )
                if (t[L] === N)
                  continue e;
              E.push(B);
            } else m(t, N, a) || E.push(B);
          }
        return E;
      }
      var hn = hu(Ut), Ga = hu(To, true);
      function ih(e, t) {
        var o = true;
        return hn(e, function(a, p, m) {
          return o = !!t(a, p, m), o;
        }), o;
      }
      function pi(e, t, o) {
        for (var a = -1, p = e.length; ++a < p; ) {
          var m = e[a], v = t(m);
          if (v != null && (_ === i ? v === v && !st(v) : o(v, _)))
            var _ = v, E = m;
        }
        return E;
      }
      function oh(e, t, o, a) {
        var p = e.length;
        for (o = Q(o), o < 0 && (o = -o > p ? 0 : p + o), a = a === i || a > p ? p : Q(a), a < 0 && (a += p), a = o > a ? 0 : ic(a); o < a; )
          e[o++] = t;
        return e;
      }
      function Wa(e, t) {
        var o = [];
        return hn(e, function(a, p, m) {
          t(a, p, m) && o.push(a);
        }), o;
      }
      function Le(e, t, o, a, p) {
        var m = -1, v = e.length;
        for (o || (o = Kh), p || (p = []); ++m < v; ) {
          var _ = e[m];
          t > 0 && o(_) ? t > 1 ? Le(_, t - 1, o, a, p) : ln(p, _) : a || (p[p.length] = _);
        }
        return p;
      }
      var ko = du(), Ha = du(true);
      function Ut(e, t) {
        return e && ko(e, t, Oe);
      }
      function To(e, t) {
        return e && Ha(e, t, Oe);
      }
      function hi(e, t) {
        return cn(t, function(o) {
          return Vt(e[o]);
        });
      }
      function Pn(e, t) {
        t = gn(t, e);
        for (var o = 0, a = t.length; e != null && o < a; )
          e = e[Nt(t[o++])];
        return o && o == a ? e : i;
      }
      function za(e, t, o) {
        var a = t(e);
        return J(e) ? a : ln(a, o(e));
      }
      function qe(e) {
        return e == null ? e === i ? to : Qi : An && An in we(e) ? Gh(e) : ed(e);
      }
      function Ro(e, t) {
        return e > t;
      }
      function sh(e, t) {
        return e != null && le.call(e, t);
      }
      function ah(e, t) {
        return e != null && t in we(e);
      }
      function uh(e, t, o) {
        return e >= We(t, o) && e < Ne(t, o);
      }
      function Po(e, t, o) {
        for (var a = o ? po : Jr, p = e[0].length, m = e.length, v = m, _ = A(m), E = 1 / 0, U = []; v--; ) {
          var B = e[v];
          v && t && (B = Ce(B, it(t))), E = We(B.length, E), _[v] = !o && (t || p >= 120 && B.length >= 120) ? new Tn(v && B) : i;
        }
        B = e[0];
        var N = -1, L = _[0];
        e:
          for (; ++N < p && U.length < E; ) {
            var W = B[N], q = t ? t(W) : W;
            if (W = o || W !== 0 ? W : 0, !(L ? hr(L, q) : a(U, q, o))) {
              for (v = m; --v; ) {
                var ee = _[v];
                if (!(ee ? hr(ee, q) : a(e[v], q, o)))
                  continue e;
              }
              L && L.push(q), U.push(W);
            }
          }
        return U;
      }
      function ch(e, t, o, a) {
        return Ut(e, function(p, m, v) {
          t(a, o(p), m, v);
        }), a;
      }
      function Ir(e, t, o) {
        t = gn(t, e), e = Pu(e, t);
        var a = e == null ? e : e[Nt(vt(t))];
        return a == null ? i : rt(a, e, o);
      }
      function qa(e) {
        return Ae(e) && qe(e) == $t;
      }
      function lh(e) {
        return Ae(e) && qe(e) == d;
      }
      function fh(e) {
        return Ae(e) && qe(e) == Gt;
      }
      function br(e, t, o, a, p) {
        return e === t ? true : e == null || t == null || !Ae(e) && !Ae(t) ? e !== e && t !== t : ph(e, t, o, a, br, p);
      }
      function ph(e, t, o, a, p, m) {
        var v = J(e), _ = J(t), E = v ? Cn : He(e), U = _ ? Cn : He(t);
        E = E == $t ? nt : E, U = U == $t ? nt : U;
        var B = E == nt, N = U == nt, L = E == U;
        if (L && yn(e)) {
          if (!yn(t))
            return false;
          v = true, B = false;
        }
        if (L && !B)
          return m || (m = new Et()), v || er(e) ? Su(e, t, o, a, p, m) : Mh(e, t, E, o, a, p, m);
        if (!(o & Y)) {
          var W = B && le.call(e, "__wrapped__"), q = N && le.call(t, "__wrapped__");
          if (W || q) {
            var ee = W ? e.value() : e, j = q ? t.value() : t;
            return m || (m = new Et()), p(ee, j, o, a, m);
          }
        }
        return L ? (m || (m = new Et()), $h(e, t, o, a, p, m)) : false;
      }
      function hh(e) {
        return Ae(e) && He(e) == Fe;
      }
      function Uo(e, t, o, a) {
        var p = o.length, m = p, v = !a;
        if (e == null)
          return !m;
        for (e = we(e); p--; ) {
          var _ = o[p];
          if (v && _[2] ? _[1] !== e[_[0]] : !(_[0] in e))
            return false;
        }
        for (; ++p < m; ) {
          _ = o[p];
          var E = _[0], U = e[E], B = _[1];
          if (v && _[2]) {
            if (U === i && !(E in e))
              return false;
          } else {
            var N = new Et();
            if (a)
              var L = a(U, B, E, e, t, N);
            if (!(L === i ? br(B, U, Y | F, a, N) : L))
              return false;
          }
        }
        return true;
      }
      function ja(e) {
        if (!Se(e) || Vh(e))
          return false;
        var t = Vt(e) ? hp : nf;
        return t.test(Bn(e));
      }
      function dh(e) {
        return Ae(e) && qe(e) == an;
      }
      function gh(e) {
        return Ae(e) && He(e) == $e;
      }
      function mh(e) {
        return Ae(e) && Ri(e.length) && !!be[qe(e)];
      }
      function Ka(e) {
        return typeof e == "function" ? e : e == null ? Qe : typeof e == "object" ? J(e) ? Ya(e[0], e[1]) : Va(e) : gc(e);
      }
      function Bo(e) {
        if (!Er(e))
          return vp(e);
        var t = [];
        for (var o in we(e))
          le.call(e, o) && o != "constructor" && t.push(o);
        return t;
      }
      function yh(e) {
        if (!Se(e))
          return Qh(e);
        var t = Er(e), o = [];
        for (var a in e)
          a == "constructor" && (t || !le.call(e, a)) || o.push(a);
        return o;
      }
      function No(e, t) {
        return e < t;
      }
      function Ja(e, t) {
        var o = -1, a = Ze(e) ? A(e.length) : [];
        return hn(e, function(p, m, v) {
          a[++o] = t(p, m, v);
        }), a;
      }
      function Va(e) {
        var t = Vo(e);
        return t.length == 1 && t[0][2] ? Tu(t[0][0], t[0][1]) : function(o) {
          return o === e || Uo(o, e, t);
        };
      }
      function Ya(e, t) {
        return Zo(e) && ku(t) ? Tu(Nt(e), t) : function(o) {
          var a = as(o, e);
          return a === i && a === t ? us(o, e) : br(t, a, Y | F);
        };
      }
      function di(e, t, o, a, p) {
        e !== t && ko(t, function(m, v) {
          if (p || (p = new Et()), Se(m))
            wh(e, t, v, o, di, a, p);
          else {
            var _ = a ? a(Qo(e, v), m, v + "", e, t, p) : i;
            _ === i && (_ = m), xo(e, v, _);
          }
        }, Xe);
      }
      function wh(e, t, o, a, p, m, v) {
        var _ = Qo(e, o), E = Qo(t, o), U = v.get(E);
        if (U) {
          xo(e, o, U);
          return;
        }
        var B = m ? m(_, E, o + "", e, t, v) : i, N = B === i;
        if (N) {
          var L = J(E), W = !L && yn(E), q = !L && !W && er(E);
          B = E, L || W || q ? J(_) ? B = _ : ke(_) ? B = Ye(_) : W ? (N = false, B = uu(E, true)) : q ? (N = false, B = cu(E, true)) : B = [] : Ar(E) || Nn(E) ? (B = _, Nn(_) ? B = oc(_) : (!Se(_) || Vt(_)) && (B = Au(E))) : N = false;
        }
        N && (v.set(E, B), p(B, E, a, m, v), v.delete(E)), xo(e, o, B);
      }
      function Za(e, t) {
        var o = e.length;
        if (o)
          return t += t < 0 ? o : 0, Jt(t, o) ? e[t] : i;
      }
      function Xa(e, t, o) {
        t.length ? t = Ce(t, function(m) {
          return J(m) ? function(v) {
            return Pn(v, m.length === 1 ? m[0] : m);
          } : m;
        }) : t = [Qe];
        var a = -1;
        t = Ce(t, it(z()));
        var p = Ja(e, function(m, v, _) {
          var E = Ce(t, function(U) {
            return U(m);
          });
          return { criteria: E, index: ++a, value: m };
        });
        return qf(p, function(m, v) {
          return Ph(m, v, o);
        });
      }
      function vh(e, t) {
        return Qa(e, t, function(o, a) {
          return us(e, a);
        });
      }
      function Qa(e, t, o) {
        for (var a = -1, p = t.length, m = {}; ++a < p; ) {
          var v = t[a], _ = Pn(e, v);
          o(_, v) && Cr(m, gn(v, e), _);
        }
        return m;
      }
      function _h(e) {
        return function(t) {
          return Pn(t, e);
        };
      }
      function Oo(e, t, o, a) {
        var p = a ? zf : Hn, m = -1, v = t.length, _ = e;
        for (e === t && (t = Ye(t)), o && (_ = Ce(e, it(o))); ++m < v; )
          for (var E = 0, U = t[m], B = o ? o(U) : U; (E = p(_, B, E, a)) > -1; )
            _ !== e && ii.call(_, E, 1), ii.call(e, E, 1);
        return e;
      }
      function eu(e, t) {
        for (var o = e ? t.length : 0, a = o - 1; o--; ) {
          var p = t[o];
          if (o == a || p !== m) {
            var m = p;
            Jt(p) ? ii.call(e, p, 1) : Mo(e, p);
          }
        }
        return e;
      }
      function Fo(e, t) {
        return e + ai(Na() * (t - e + 1));
      }
      function Ih(e, t, o, a) {
        for (var p = -1, m = Ne(si((t - e) / (o || 1)), 0), v = A(m); m--; )
          v[a ? m : ++p] = e, e += o;
        return v;
      }
      function Do(e, t) {
        var o = "";
        if (!e || t < 1 || t > Pt)
          return o;
        do
          t % 2 && (o += e), t = ai(t / 2), t && (e += e);
        while (t);
        return o;
      }
      function te(e, t) {
        return es(Ru(e, t, Qe), e + "");
      }
      function bh(e) {
        return Da(tr(e));
      }
      function Ch(e, t) {
        var o = tr(e);
        return Si(o, Rn(t, 0, o.length));
      }
      function Cr(e, t, o, a) {
        if (!Se(e))
          return e;
        t = gn(t, e);
        for (var p = -1, m = t.length, v = m - 1, _ = e; _ != null && ++p < m; ) {
          var E = Nt(t[p]), U = o;
          if (E === "__proto__" || E === "constructor" || E === "prototype")
            return e;
          if (p != v) {
            var B = _[E];
            U = a ? a(B, E, _) : i, U === i && (U = Se(B) ? B : Jt(t[p + 1]) ? [] : {});
          }
          vr(_, E, U), _ = _[E];
        }
        return e;
      }
      var tu = ui ? function(e, t) {
        return ui.set(e, t), e;
      } : Qe, Sh = oi ? function(e, t) {
        return oi(e, "toString", {
          configurable: true,
          enumerable: false,
          value: ls(t),
          writable: true
        });
      } : Qe;
      function Eh(e) {
        return Si(tr(e));
      }
      function wt(e, t, o) {
        var a = -1, p = e.length;
        t < 0 && (t = -t > p ? 0 : p + t), o = o > p ? p : o, o < 0 && (o += p), p = t > o ? 0 : o - t >>> 0, t >>>= 0;
        for (var m = A(p); ++a < p; )
          m[a] = e[a + t];
        return m;
      }
      function xh(e, t) {
        var o;
        return hn(e, function(a, p, m) {
          return o = t(a, p, m), !o;
        }), !!o;
      }
      function gi(e, t, o) {
        var a = 0, p = e == null ? a : e.length;
        if (typeof t == "number" && t === t && p <= $r) {
          for (; a < p; ) {
            var m = a + p >>> 1, v = e[m];
            v !== null && !st(v) && (o ? v <= t : v < t) ? a = m + 1 : p = m;
          }
          return p;
        }
        return Lo(e, t, Qe, o);
      }
      function Lo(e, t, o, a) {
        var p = 0, m = e == null ? 0 : e.length;
        if (m === 0)
          return 0;
        t = o(t);
        for (var v = t !== t, _ = t === null, E = st(t), U = t === i; p < m; ) {
          var B = ai((p + m) / 2), N = o(e[B]), L = N !== i, W = N === null, q = N === N, ee = st(N);
          if (v)
            var j = a || q;
          else U ? j = q && (a || L) : _ ? j = q && L && (a || !W) : E ? j = q && L && !W && (a || !ee) : W || ee ? j = false : j = a ? N <= t : N < t;
          j ? p = B + 1 : m = B;
        }
        return We(m, Me);
      }
      function nu(e, t) {
        for (var o = -1, a = e.length, p = 0, m = []; ++o < a; ) {
          var v = e[o], _ = t ? t(v) : v;
          if (!o || !xt(_, E)) {
            var E = _;
            m[p++] = v === 0 ? 0 : v;
          }
        }
        return m;
      }
      function ru(e) {
        return typeof e == "number" ? e : st(e) ? $n : +e;
      }
      function ot(e) {
        if (typeof e == "string")
          return e;
        if (J(e))
          return Ce(e, ot) + "";
        if (st(e))
          return Oa ? Oa.call(e) : "";
        var t = e + "";
        return t == "0" && 1 / e == -Mt ? "-0" : t;
      }
      function dn(e, t, o) {
        var a = -1, p = Jr, m = e.length, v = true, _ = [], E = _;
        if (o)
          v = false, p = po;
        else if (m >= l) {
          var U = t ? null : Dh(e);
          if (U)
            return Yr(U);
          v = false, p = hr, E = new Tn();
        } else
          E = t ? [] : _;
        e:
          for (; ++a < m; ) {
            var B = e[a], N = t ? t(B) : B;
            if (B = o || B !== 0 ? B : 0, v && N === N) {
              for (var L = E.length; L--; )
                if (E[L] === N)
                  continue e;
              t && E.push(N), _.push(B);
            } else p(E, N, o) || (E !== _ && E.push(N), _.push(B));
          }
        return _;
      }
      function Mo(e, t) {
        t = gn(t, e);
        var o = -1, a = t.length;
        if (!a)
          return true;
        for (var p = e == null || typeof e != "object" && typeof e != "function"; ++o < a; ) {
          var m = t[o];
          if (typeof m == "string") {
            if (m === "__proto__" && !le.call(e, "__proto__"))
              return false;
            if (m === "constructor" && o + 1 < a && typeof t[o + 1] == "string" && t[o + 1] === "prototype") {
              if (p && o === 0)
                continue;
              return false;
            }
          }
        }
        var v = Pu(e, t);
        return v == null || delete v[Nt(vt(t))];
      }
      function iu(e, t, o, a) {
        return Cr(e, t, o(Pn(e, t)), a);
      }
      function mi(e, t, o, a) {
        for (var p = e.length, m = a ? p : -1; (a ? m-- : ++m < p) && t(e[m], m, e); )
          ;
        return o ? wt(e, a ? 0 : m, a ? m + 1 : p) : wt(e, a ? m + 1 : 0, a ? p : m);
      }
      function ou(e, t) {
        var o = e;
        return o instanceof re && (o = o.value()), ho(t, function(a, p) {
          return p.func.apply(p.thisArg, ln([a], p.args));
        }, o);
      }
      function $o(e, t, o) {
        var a = e.length;
        if (a < 2)
          return a ? dn(e[0]) : [];
        for (var p = -1, m = A(a); ++p < a; )
          for (var v = e[p], _ = -1; ++_ < a; )
            _ != p && (m[p] = _r(m[p] || v, e[_], t, o));
        return dn(Le(m, 1), t, o);
      }
      function su(e, t, o) {
        for (var a = -1, p = e.length, m = t.length, v = {}; ++a < p; ) {
          var _ = a < m ? t[a] : i;
          o(v, e[a], _);
        }
        return v;
      }
      function Go(e) {
        return ke(e) ? e : [];
      }
      function Wo(e) {
        return typeof e == "function" ? e : Qe;
      }
      function gn(e, t) {
        return J(e) ? e : Zo(e, t) ? [e] : Ou(fe(e));
      }
      var Ah = te;
      function mn(e, t, o) {
        var a = e.length;
        return o = o === i ? a : o, !t && o >= a ? e : wt(e, t, o);
      }
      var au = dp || function(e) {
        return De.clearTimeout(e);
      };
      function uu(e, t) {
        if (t)
          return e.slice();
        var o = e.length, a = Ta ? Ta(o) : new e.constructor(o);
        return e.copy(a), a;
      }
      function Ho(e) {
        var t = new e.constructor(e.byteLength);
        return new ni(t).set(new ni(e)), t;
      }
      function kh(e, t) {
        var o = t ? Ho(e.buffer) : e.buffer;
        return new e.constructor(o, e.byteOffset, e.byteLength);
      }
      function Th(e) {
        var t = new e.constructor(e.source, qs.exec(e));
        return t.lastIndex = e.lastIndex, t;
      }
      function Rh(e) {
        return wr ? we(wr.call(e)) : {};
      }
      function cu(e, t) {
        var o = t ? Ho(e.buffer) : e.buffer;
        return new e.constructor(o, e.byteOffset, e.length);
      }
      function lu(e, t) {
        if (e !== t) {
          var o = e !== i, a = e === null, p = e === e, m = st(e), v = t !== i, _ = t === null, E = t === t, U = st(t);
          if (!_ && !U && !m && e > t || m && v && E && !_ && !U || a && v && E || !o && E || !p)
            return 1;
          if (!a && !m && !U && e < t || U && o && p && !a && !m || _ && o && p || !v && p || !E)
            return -1;
        }
        return 0;
      }
      function Ph(e, t, o) {
        for (var a = -1, p = e.criteria, m = t.criteria, v = p.length, _ = o.length; ++a < v; ) {
          var E = lu(p[a], m[a]);
          if (E) {
            if (a >= _)
              return E;
            var U = o[a];
            return E * (U == "desc" ? -1 : 1);
          }
        }
        return e.index - t.index;
      }
      function fu(e, t, o, a) {
        for (var p = -1, m = e.length, v = o.length, _ = -1, E = t.length, U = Ne(m - v, 0), B = A(E + U), N = !a; ++_ < E; )
          B[_] = t[_];
        for (; ++p < v; )
          (N || p < m) && (B[o[p]] = e[p]);
        for (; U--; )
          B[_++] = e[p++];
        return B;
      }
      function pu(e, t, o, a) {
        for (var p = -1, m = e.length, v = -1, _ = o.length, E = -1, U = t.length, B = Ne(m - _, 0), N = A(B + U), L = !a; ++p < B; )
          N[p] = e[p];
        for (var W = p; ++E < U; )
          N[W + E] = t[E];
        for (; ++v < _; )
          (L || p < m) && (N[W + o[v]] = e[p++]);
        return N;
      }
      function Ye(e, t) {
        var o = -1, a = e.length;
        for (t || (t = A(a)); ++o < a; )
          t[o] = e[o];
        return t;
      }
      function Bt(e, t, o, a) {
        var p = !o;
        o || (o = {});
        for (var m = -1, v = t.length; ++m < v; ) {
          var _ = t[m], E = a ? a(o[_], e[_], _, o, e) : i;
          E === i && (E = e[_]), p ? qt(o, _, E) : vr(o, _, E);
        }
        return o;
      }
      function Uh(e, t) {
        return Bt(e, Yo(e), t);
      }
      function Bh(e, t) {
        return Bt(e, Eu(e), t);
      }
      function yi(e, t) {
        return function(o, a) {
          var p = J(o) ? Lf : th, m = t ? t() : {};
          return p(o, e, z(a, 2), m);
        };
      }
      function Zn(e) {
        return te(function(t, o) {
          var a = -1, p = o.length, m = p > 1 ? o[p - 1] : i, v = p > 2 ? o[2] : i;
          for (m = e.length > 3 && typeof m == "function" ? (p--, m) : i, v && je(o[0], o[1], v) && (m = p < 3 ? i : m, p = 1), t = we(t); ++a < p; ) {
            var _ = o[a];
            _ && e(t, _, a, m);
          }
          return t;
        });
      }
      function hu(e, t) {
        return function(o, a) {
          if (o == null)
            return o;
          if (!Ze(o))
            return e(o, a);
          for (var p = o.length, m = t ? p : -1, v = we(o); (t ? m-- : ++m < p) && a(v[m], m, v) !== false; )
            ;
          return o;
        };
      }
      function du(e) {
        return function(t, o, a) {
          for (var p = -1, m = we(t), v = a(t), _ = v.length; _--; ) {
            var E = v[e ? _ : ++p];
            if (o(m[E], E, m) === false)
              break;
          }
          return t;
        };
      }
      function Nh(e, t, o) {
        var a = t & H, p = Sr(e);
        function m() {
          var v = this && this !== De && this instanceof m ? p : e;
          return v.apply(a ? o : this, arguments);
        }
        return m;
      }
      function gu(e) {
        return function(t) {
          t = fe(t);
          var o = zn(t) ? St(t) : i, a = o ? o[0] : t.charAt(0), p = o ? mn(o, 1).join("") : t.slice(1);
          return a[e]() + p;
        };
      }
      function Xn(e) {
        return function(t) {
          return ho(hc(pc(t).replace(Sf, "")), e, "");
        };
      }
      function Sr(e) {
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return new e();
            case 1:
              return new e(t[0]);
            case 2:
              return new e(t[0], t[1]);
            case 3:
              return new e(t[0], t[1], t[2]);
            case 4:
              return new e(t[0], t[1], t[2], t[3]);
            case 5:
              return new e(t[0], t[1], t[2], t[3], t[4]);
            case 6:
              return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
            case 7:
              return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
          }
          var o = Yn(e.prototype), a = e.apply(o, t);
          return Se(a) ? a : o;
        };
      }
      function Oh(e, t, o) {
        var a = Sr(e);
        function p() {
          for (var m = arguments.length, v = A(m), _ = m, E = Qn(p); _--; )
            v[_] = arguments[_];
          var U = m < 3 && v[0] !== E && v[m - 1] !== E ? [] : fn(v, E);
          if (m -= U.length, m < o)
            return _u(
              e,
              t,
              wi,
              p.placeholder,
              i,
              v,
              U,
              i,
              i,
              o - m
            );
          var B = this && this !== De && this instanceof p ? a : e;
          return rt(B, this, v);
        }
        return p;
      }
      function mu(e) {
        return function(t, o, a) {
          var p = we(t);
          if (!Ze(t)) {
            var m = z(o, 3);
            t = Oe(t), o = function(_) {
              return m(p[_], _, p);
            };
          }
          var v = e(t, o, a);
          return v > -1 ? p[m ? t[v] : v] : i;
        };
      }
      function yu(e) {
        return Kt(function(t) {
          var o = t.length, a = o, p = mt.prototype.thru;
          for (e && t.reverse(); a--; ) {
            var m = t[a];
            if (typeof m != "function")
              throw new gt(y);
            if (p && !v && bi(m) == "wrapper")
              var v = new mt([], true);
          }
          for (a = v ? a : o; ++a < o; ) {
            m = t[a];
            var _ = bi(m), E = _ == "wrapper" ? Jo(m) : i;
            E && Xo(E[0]) && E[1] == (ge | Z | ce | Ct) && !E[4].length && E[9] == 1 ? v = v[bi(E[0])].apply(v, E[3]) : v = m.length == 1 && Xo(m) ? v[_]() : v.thru(m);
          }
          return function() {
            var U = arguments, B = U[0];
            if (v && U.length == 1 && J(B))
              return v.plant(B).value();
            for (var N = 0, L = o ? t[N].apply(this, U) : B; ++N < o; )
              L = t[N].call(this, L);
            return L;
          };
        });
      }
      function wi(e, t, o, a, p, m, v, _, E, U) {
        var B = t & ge, N = t & H, L = t & ue, W = t & (Z | oe), q = t & bn, ee = L ? i : Sr(e);
        function j() {
          for (var ne = arguments.length, ie = A(ne), at = ne; at--; )
            ie[at] = arguments[at];
          if (W)
            var Ke = Qn(j), ut = Kf(ie, Ke);
          if (a && (ie = fu(ie, a, p, W)), m && (ie = pu(ie, m, v, W)), ne -= ut, W && ne < U) {
            var Te = fn(ie, Ke);
            return _u(
              e,
              t,
              wi,
              j.placeholder,
              o,
              ie,
              Te,
              _,
              E,
              U - ne
            );
          }
          var At = N ? o : this, Zt = L ? At[e] : e;
          return ne = ie.length, _ ? ie = td(ie, _) : q && ne > 1 && ie.reverse(), B && E < ne && (ie.length = E), this && this !== De && this instanceof j && (Zt = ee || Sr(Zt)), Zt.apply(At, ie);
        }
        return j;
      }
      function wu(e, t) {
        return function(o, a) {
          return ch(o, e, t(a), {});
        };
      }
      function vi(e, t) {
        return function(o, a) {
          var p;
          if (o === i && a === i)
            return t;
          if (o !== i && (p = o), a !== i) {
            if (p === i)
              return a;
            typeof o == "string" || typeof a == "string" ? (o = ot(o), a = ot(a)) : (o = ru(o), a = ru(a)), p = e(o, a);
          }
          return p;
        };
      }
      function zo(e) {
        return Kt(function(t) {
          return t = Ce(t, it(z())), te(function(o) {
            var a = this;
            return e(t, function(p) {
              return rt(p, a, o);
            });
          });
        });
      }
      function _i(e, t) {
        t = t === i ? " " : ot(t);
        var o = t.length;
        if (o < 2)
          return o ? Do(t, e) : t;
        var a = Do(t, si(e / qn(t)));
        return zn(t) ? mn(St(a), 0, e).join("") : a.slice(0, e);
      }
      function Fh(e, t, o, a) {
        var p = t & H, m = Sr(e);
        function v() {
          for (var _ = -1, E = arguments.length, U = -1, B = a.length, N = A(B + E), L = this && this !== De && this instanceof v ? m : e; ++U < B; )
            N[U] = a[U];
          for (; E--; )
            N[U++] = arguments[++_];
          return rt(L, p ? o : this, N);
        }
        return v;
      }
      function vu(e) {
        return function(t, o, a) {
          return a && typeof a != "number" && je(t, o, a) && (o = a = i), t = Yt(t), o === i ? (o = t, t = 0) : o = Yt(o), a = a === i ? t < o ? 1 : -1 : Yt(a), Ih(t, o, a, e);
        };
      }
      function Ii(e) {
        return function(t, o) {
          return typeof t == "string" && typeof o == "string" || (t = _t(t), o = _t(o)), e(t, o);
        };
      }
      function _u(e, t, o, a, p, m, v, _, E, U) {
        var B = t & Z, N = B ? v : i, L = B ? i : v, W = B ? m : i, q = B ? i : m;
        t |= B ? ce : xe, t &= ~(B ? xe : ce), t & Ue || (t &= -4);
        var ee = [
          e,
          t,
          p,
          W,
          N,
          q,
          L,
          _,
          E,
          U
        ], j = o.apply(i, ee);
        return Xo(e) && Uu(j, ee), j.placeholder = a, Bu(j, e, t);
      }
      function qo(e) {
        var t = Be[e];
        return function(o, a) {
          if (o = _t(o), a = a == null ? 0 : We(Q(a), 292), a && Ba(o)) {
            var p = (fe(o) + "e").split("e"), m = t(p[0] + "e" + (+p[1] + a));
            return p = (fe(m) + "e").split("e"), +(p[0] + "e" + (+p[1] - a));
          }
          return t(o);
        };
      }
      var Dh = Jn && 1 / Yr(new Jn([, -0]))[1] == Mt ? function(e) {
        return new Jn(e);
      } : hs;
      function Iu(e) {
        return function(t) {
          var o = He(t);
          return o == Fe ? Io(t) : o == $e ? ep(t) : jf(t, e(t));
        };
      }
      function jt(e, t, o, a, p, m, v, _) {
        var E = t & ue;
        if (!E && typeof e != "function")
          throw new gt(y);
        var U = a ? a.length : 0;
        if (U || (t &= -97, a = p = i), v = v === i ? v : Ne(Q(v), 0), _ = _ === i ? _ : Q(_), U -= p ? p.length : 0, t & xe) {
          var B = a, N = p;
          a = p = i;
        }
        var L = E ? i : Jo(e), W = [
          e,
          t,
          o,
          a,
          p,
          B,
          N,
          m,
          v,
          _
        ];
        if (L && Xh(W, L), e = W[0], t = W[1], o = W[2], a = W[3], p = W[4], _ = W[9] = W[9] === i ? E ? 0 : e.length : Ne(W[9] - U, 0), !_ && t & (Z | oe) && (t &= -25), !t || t == H)
          var q = Nh(e, t, o);
        else t == Z || t == oe ? q = Oh(e, t, _) : (t == ce || t == (H | ce)) && !p.length ? q = Fh(e, t, o, a) : q = wi.apply(i, W);
        var ee = L ? tu : Uu;
        return Bu(ee(q, W), e, t);
      }
      function bu(e, t, o, a) {
        return e === i || xt(e, Kn[o]) && !le.call(a, o) ? t : e;
      }
      function Cu(e, t, o, a, p, m) {
        return Se(e) && Se(t) && (m.set(t, e), di(e, t, i, Cu, m), m.delete(t)), e;
      }
      function Lh(e) {
        return Ar(e) ? i : e;
      }
      function Su(e, t, o, a, p, m) {
        var v = o & Y, _ = e.length, E = t.length;
        if (_ != E && !(v && E > _))
          return false;
        var U = m.get(e), B = m.get(t);
        if (U && B)
          return U == t && B == e;
        var N = -1, L = true, W = o & F ? new Tn() : i;
        for (m.set(e, t), m.set(t, e); ++N < _; ) {
          var q = e[N], ee = t[N];
          if (a)
            var j = v ? a(ee, q, N, t, e, m) : a(q, ee, N, e, t, m);
          if (j !== i) {
            if (j)
              continue;
            L = false;
            break;
          }
          if (W) {
            if (!go(t, function(ne, ie) {
              if (!hr(W, ie) && (q === ne || p(q, ne, o, a, m)))
                return W.push(ie);
            })) {
              L = false;
              break;
            }
          } else if (!(q === ee || p(q, ee, o, a, m))) {
            L = false;
            break;
          }
        }
        return m.delete(e), m.delete(t), L;
      }
      function Mh(e, t, o, a, p, m, v) {
        switch (o) {
          case u:
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
              return false;
            e = e.buffer, t = t.buffer;
          case d:
            return !(e.byteLength != t.byteLength || !m(new ni(e), new ni(t)));
          case pt:
          case Gt:
          case En:
            return xt(+e, +t);
          case Gn:
            return e.name == t.name && e.message == t.message;
          case an:
          case Ge:
            return e == t + "";
          case Fe:
            var _ = Io;
          case $e:
            var E = a & Y;
            if (_ || (_ = Yr), e.size != t.size && !E)
              return false;
            var U = v.get(e);
            if (U)
              return U == t;
            a |= F, v.set(e, t);
            var B = Su(_(e), _(t), a, p, m, v);
            return v.delete(e), B;
          case un:
            if (wr)
              return wr.call(e) == wr.call(t);
        }
        return false;
      }
      function $h(e, t, o, a, p, m) {
        var v = o & Y, _ = jo(e), E = _.length, U = jo(t), B = U.length;
        if (E != B && !v)
          return false;
        for (var N = E; N--; ) {
          var L = _[N];
          if (!(v ? L in t : le.call(t, L)))
            return false;
        }
        var W = m.get(e), q = m.get(t);
        if (W && q)
          return W == t && q == e;
        var ee = true;
        m.set(e, t), m.set(t, e);
        for (var j = v; ++N < E; ) {
          L = _[N];
          var ne = e[L], ie = t[L];
          if (a)
            var at = v ? a(ie, ne, L, t, e, m) : a(ne, ie, L, e, t, m);
          if (!(at === i ? ne === ie || p(ne, ie, o, a, m) : at)) {
            ee = false;
            break;
          }
          j || (j = L == "constructor");
        }
        if (ee && !j) {
          var Ke = e.constructor, ut = t.constructor;
          Ke != ut && "constructor" in e && "constructor" in t && !(typeof Ke == "function" && Ke instanceof Ke && typeof ut == "function" && ut instanceof ut) && (ee = false);
        }
        return m.delete(e), m.delete(t), ee;
      }
      function Kt(e) {
        return es(Ru(e, i, Mu), e + "");
      }
      function jo(e) {
        return za(e, Oe, Yo);
      }
      function Ko(e) {
        return za(e, Xe, Eu);
      }
      var Jo = ui ? function(e) {
        return ui.get(e);
      } : hs;
      function bi(e) {
        for (var t = e.name + "", o = Vn[t], a = le.call(Vn, t) ? o.length : 0; a--; ) {
          var p = o[a], m = p.func;
          if (m == null || m == e)
            return p.name;
        }
        return t;
      }
      function Qn(e) {
        var t = le.call(g, "placeholder") ? g : e;
        return t.placeholder;
      }
      function z() {
        var e = g.iteratee || fs;
        return e = e === fs ? Ka : e, arguments.length ? e(arguments[0], arguments[1]) : e;
      }
      function Ci(e, t) {
        var o = e.__data__;
        return Jh(t) ? o[typeof t == "string" ? "string" : "hash"] : o.map;
      }
      function Vo(e) {
        for (var t = Oe(e), o = t.length; o--; ) {
          var a = t[o], p = e[a];
          t[o] = [a, p, ku(p)];
        }
        return t;
      }
      function Un(e, t) {
        var o = Zf(e, t);
        return ja(o) ? o : i;
      }
      function Gh(e) {
        var t = le.call(e, An), o = e[An];
        try {
          e[An] = i;
          var a = true;
        } catch {
        }
        var p = ei.call(e);
        return a && (t ? e[An] = o : delete e[An]), p;
      }
      var Yo = Co ? function(e) {
        return e == null ? [] : (e = we(e), cn(Co(e), function(t) {
          return Pa.call(e, t);
        }));
      } : ds, Eu = Co ? function(e) {
        for (var t = []; e; )
          ln(t, Yo(e)), e = ri(e);
        return t;
      } : ds, He = qe;
      (So && He(new So(new ArrayBuffer(1))) != u || gr && He(new gr()) != Fe || Eo && He(Eo.resolve()) != zr || Jn && He(new Jn()) != $e || mr && He(new mr()) != Ve) && (He = function(e) {
        var t = qe(e), o = t == nt ? e.constructor : i, a = o ? Bn(o) : "";
        if (a)
          switch (a) {
            case Cp:
              return u;
            case Sp:
              return Fe;
            case Ep:
              return zr;
            case xp:
              return $e;
            case Ap:
              return Ve;
          }
        return t;
      });
      function Wh(e, t, o) {
        for (var a = -1, p = o.length; ++a < p; ) {
          var m = o[a], v = m.size;
          switch (m.type) {
            case "drop":
              e += v;
              break;
            case "dropRight":
              t -= v;
              break;
            case "take":
              t = We(t, e + v);
              break;
            case "takeRight":
              e = Ne(e, t - v);
              break;
          }
        }
        return { start: e, end: t };
      }
      function Hh(e) {
        var t = e.match(Jl);
        return t ? t[1].split(Vl) : [];
      }
      function xu(e, t, o) {
        t = gn(t, e);
        for (var a = -1, p = t.length, m = false; ++a < p; ) {
          var v = Nt(t[a]);
          if (!(m = e != null && o(e, v)))
            break;
          e = e[v];
        }
        return m || ++a != p ? m : (p = e == null ? 0 : e.length, !!p && Ri(p) && Jt(v, p) && (J(e) || Nn(e)));
      }
      function zh(e) {
        var t = e.length, o = new e.constructor(t);
        return t && typeof e[0] == "string" && le.call(e, "index") && (o.index = e.index, o.input = e.input), o;
      }
      function Au(e) {
        return typeof e.constructor == "function" && !Er(e) ? Yn(ri(e)) : {};
      }
      function qh(e, t, o) {
        var a = e.constructor;
        switch (t) {
          case d:
            return Ho(e);
          case pt:
          case Gt:
            return new a(+e);
          case u:
            return kh(e, o);
          case c:
          case w:
          case b:
          case x:
          case P:
          case X:
          case ve:
          case me:
          case _e:
            return cu(e, o);
          case Fe:
            return new a();
          case En:
          case Ge:
            return new a(e);
          case an:
            return Th(e);
          case $e:
            return new a();
          case un:
            return Rh(e);
        }
      }
      function jh(e, t) {
        var o = t.length;
        if (!o)
          return e;
        var a = o - 1;
        return t[a] = (o > 1 ? "& " : "") + t[a], t = t.join(o > 2 ? ", " : " "), e.replace(Kl, `{
/* [wrapped with ` + t + `] */
`);
      }
      function Kh(e) {
        return J(e) || Nn(e) || !!(Ua && e && e[Ua]);
      }
      function Jt(e, t) {
        var o = typeof e;
        return t = t ?? Pt, !!t && (o == "number" || o != "symbol" && of.test(e)) && e > -1 && e % 1 == 0 && e < t;
      }
      function je(e, t, o) {
        if (!Se(o))
          return false;
        var a = typeof t;
        return (a == "number" ? Ze(o) && Jt(t, o.length) : a == "string" && t in o) ? xt(o[t], e) : false;
      }
      function Zo(e, t) {
        if (J(e))
          return false;
        var o = typeof e;
        return o == "number" || o == "symbol" || o == "boolean" || e == null || st(e) ? true : Hl.test(e) || !Wl.test(e) || t != null && e in we(t);
      }
      function Jh(e) {
        var t = typeof e;
        return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
      }
      function Xo(e) {
        var t = bi(e), o = g[t];
        if (typeof o != "function" || !(t in re.prototype))
          return false;
        if (e === o)
          return true;
        var a = Jo(o);
        return !!a && e === a[0];
      }
      function Vh(e) {
        return !!ka && ka in e;
      }
      var Yh = Xr ? Vt : gs;
      function Er(e) {
        var t = e && e.constructor, o = typeof t == "function" && t.prototype || Kn;
        return e === o;
      }
      function ku(e) {
        return e === e && !Se(e);
      }
      function Tu(e, t) {
        return function(o) {
          return o == null ? false : o[e] === t && (t !== i || e in we(o));
        };
      }
      function Zh(e) {
        var t = ki(e, function(a) {
          return o.size === C && o.clear(), a;
        }), o = t.cache;
        return t;
      }
      function Xh(e, t) {
        var o = e[1], a = t[1], p = o | a, m = p < (H | ue | ge), v = a == ge && o == Z || a == ge && o == Ct && e[7].length <= t[8] || a == (ge | Ct) && t[7].length <= t[8] && o == Z;
        if (!(m || v))
          return e;
        a & H && (e[2] = t[2], p |= o & H ? 0 : Ue);
        var _ = t[3];
        if (_) {
          var E = e[3];
          e[3] = E ? fu(E, _, t[4]) : _, e[4] = E ? fn(e[3], k) : t[4];
        }
        return _ = t[5], _ && (E = e[5], e[5] = E ? pu(E, _, t[6]) : _, e[6] = E ? fn(e[5], k) : t[6]), _ = t[7], _ && (e[7] = _), a & ge && (e[8] = e[8] == null ? t[8] : We(e[8], t[8])), e[9] == null && (e[9] = t[9]), e[0] = t[0], e[1] = p, e;
      }
      function Qh(e) {
        var t = [];
        if (e != null)
          for (var o in we(e))
            t.push(o);
        return t;
      }
      function ed(e) {
        return ei.call(e);
      }
      function Ru(e, t, o) {
        return t = Ne(t === i ? e.length - 1 : t, 0), function() {
          for (var a = arguments, p = -1, m = Ne(a.length - t, 0), v = A(m); ++p < m; )
            v[p] = a[t + p];
          p = -1;
          for (var _ = A(t + 1); ++p < t; )
            _[p] = a[p];
          return _[t] = o(v), rt(e, this, _);
        };
      }
      function Pu(e, t) {
        return t.length < 2 ? e : Pn(e, wt(t, 0, -1));
      }
      function td(e, t) {
        for (var o = e.length, a = We(t.length, o), p = Ye(e); a--; ) {
          var m = t[a];
          e[a] = Jt(m, o) ? p[m] : i;
        }
        return e;
      }
      function Qo(e, t) {
        if (!(t === "constructor" && typeof e[t] == "function") && t != "__proto__")
          return e[t];
      }
      var Uu = Nu(tu), xr = mp || function(e, t) {
        return De.setTimeout(e, t);
      }, es = Nu(Sh);
      function Bu(e, t, o) {
        var a = t + "";
        return es(e, jh(a, nd(Hh(a), o)));
      }
      function Nu(e) {
        var t = 0, o = 0;
        return function() {
          var a = _p(), p = Yi - (a - o);
          if (o = a, p > 0) {
            if (++t >= Vi)
              return arguments[0];
          } else
            t = 0;
          return e.apply(i, arguments);
        };
      }
      function Si(e, t) {
        var o = -1, a = e.length, p = a - 1;
        for (t = t === i ? a : t; ++o < t; ) {
          var m = Fo(o, p), v = e[m];
          e[m] = e[o], e[o] = v;
        }
        return e.length = t, e;
      }
      var Ou = Zh(function(e) {
        var t = [];
        return e.charCodeAt(0) === 46 && t.push(""), e.replace(zl, function(o, a, p, m) {
          t.push(p ? m.replace(Xl, "$1") : a || o);
        }), t;
      });
      function Nt(e) {
        if (typeof e == "string" || st(e))
          return e;
        var t = e + "";
        return t == "0" && 1 / e == -Mt ? "-0" : t;
      }
      function Bn(e) {
        if (e != null) {
          try {
            return Qr.call(e);
          } catch {
          }
          try {
            return e + "";
          } catch {
          }
        }
        return "";
      }
      function nd(e, t) {
        return dt(Gr, function(o) {
          var a = "_." + o[0];
          t & o[1] && !Jr(e, a) && e.push(a);
        }), e.sort();
      }
      function Fu(e) {
        if (e instanceof re)
          return e.clone();
        var t = new mt(e.__wrapped__, e.__chain__);
        return t.__actions__ = Ye(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t;
      }
      function rd(e, t, o) {
        (o ? je(e, t, o) : t === i) ? t = 1 : t = Ne(Q(t), 0);
        var a = e == null ? 0 : e.length;
        if (!a || t < 1)
          return [];
        for (var p = 0, m = 0, v = A(si(a / t)); p < a; )
          v[m++] = wt(e, p, p += t);
        return v;
      }
      function id(e) {
        for (var t = -1, o = e == null ? 0 : e.length, a = 0, p = []; ++t < o; ) {
          var m = e[t];
          m && (p[a++] = m);
        }
        return p;
      }
      function od() {
        var e = arguments.length;
        if (!e)
          return [];
        for (var t = A(e - 1), o = arguments[0], a = e; a--; )
          t[a - 1] = arguments[a];
        return ln(J(o) ? Ye(o) : [o], Le(t, 1));
      }
      var sd = te(function(e, t) {
        return ke(e) ? _r(e, Le(t, 1, ke, true)) : [];
      }), ad = te(function(e, t) {
        var o = vt(t);
        return ke(o) && (o = i), ke(e) ? _r(e, Le(t, 1, ke, true), z(o, 2)) : [];
      }), ud = te(function(e, t) {
        var o = vt(t);
        return ke(o) && (o = i), ke(e) ? _r(e, Le(t, 1, ke, true), i, o) : [];
      });
      function cd(e, t, o) {
        var a = e == null ? 0 : e.length;
        return a ? (t = o || t === i ? 1 : Q(t), wt(e, t < 0 ? 0 : t, a)) : [];
      }
      function ld(e, t, o) {
        var a = e == null ? 0 : e.length;
        return a ? (t = o || t === i ? 1 : Q(t), t = a - t, wt(e, 0, t < 0 ? 0 : t)) : [];
      }
      function fd(e, t) {
        return e && e.length ? mi(e, z(t, 3), true, true) : [];
      }
      function pd(e, t) {
        return e && e.length ? mi(e, z(t, 3), true) : [];
      }
      function hd(e, t, o, a) {
        var p = e == null ? 0 : e.length;
        return p ? (o && typeof o != "number" && je(e, t, o) && (o = 0, a = p), oh(e, t, o, a)) : [];
      }
      function Du(e, t, o) {
        var a = e == null ? 0 : e.length;
        if (!a)
          return -1;
        var p = o == null ? 0 : Q(o);
        return p < 0 && (p = Ne(a + p, 0)), Vr(e, z(t, 3), p);
      }
      function Lu(e, t, o) {
        var a = e == null ? 0 : e.length;
        if (!a)
          return -1;
        var p = a - 1;
        return o !== i && (p = Q(o), p = o < 0 ? Ne(a + p, 0) : We(p, a - 1)), Vr(e, z(t, 3), p, true);
      }
      function Mu(e) {
        var t = e == null ? 0 : e.length;
        return t ? Le(e, 1) : [];
      }
      function dd(e) {
        var t = e == null ? 0 : e.length;
        return t ? Le(e, Mt) : [];
      }
      function gd(e, t) {
        var o = e == null ? 0 : e.length;
        return o ? (t = t === i ? 1 : Q(t), Le(e, t)) : [];
      }
      function md(e) {
        for (var t = -1, o = e == null ? 0 : e.length, a = {}; ++t < o; ) {
          var p = e[t];
          a[p[0]] = p[1];
        }
        return a;
      }
      function $u(e) {
        return e && e.length ? e[0] : i;
      }
      function yd(e, t, o) {
        var a = e == null ? 0 : e.length;
        if (!a)
          return -1;
        var p = o == null ? 0 : Q(o);
        return p < 0 && (p = Ne(a + p, 0)), Hn(e, t, p);
      }
      function wd(e) {
        var t = e == null ? 0 : e.length;
        return t ? wt(e, 0, -1) : [];
      }
      var vd = te(function(e) {
        var t = Ce(e, Go);
        return t.length && t[0] === e[0] ? Po(t) : [];
      }), _d = te(function(e) {
        var t = vt(e), o = Ce(e, Go);
        return t === vt(o) ? t = i : o.pop(), o.length && o[0] === e[0] ? Po(o, z(t, 2)) : [];
      }), Id = te(function(e) {
        var t = vt(e), o = Ce(e, Go);
        return t = typeof t == "function" ? t : i, t && o.pop(), o.length && o[0] === e[0] ? Po(o, i, t) : [];
      });
      function bd(e, t) {
        return e == null ? "" : wp.call(e, t);
      }
      function vt(e) {
        var t = e == null ? 0 : e.length;
        return t ? e[t - 1] : i;
      }
      function Cd(e, t, o) {
        var a = e == null ? 0 : e.length;
        if (!a)
          return -1;
        var p = a;
        return o !== i && (p = Q(o), p = p < 0 ? Ne(a + p, 0) : We(p, a - 1)), t === t ? np(e, t, p) : Vr(e, _a, p, true);
      }
      function Sd(e, t) {
        return e && e.length ? Za(e, Q(t)) : i;
      }
      var Ed = te(Gu);
      function Gu(e, t) {
        return e && e.length && t && t.length ? Oo(e, t) : e;
      }
      function xd(e, t, o) {
        return e && e.length && t && t.length ? Oo(e, t, z(o, 2)) : e;
      }
      function Ad(e, t, o) {
        return e && e.length && t && t.length ? Oo(e, t, i, o) : e;
      }
      var kd = Kt(function(e, t) {
        var o = e == null ? 0 : e.length, a = Ao(e, t);
        return eu(e, Ce(t, function(p) {
          return Jt(p, o) ? +p : p;
        }).sort(lu)), a;
      });
      function Td(e, t) {
        var o = [];
        if (!(e && e.length))
          return o;
        var a = -1, p = [], m = e.length;
        for (t = z(t, 3); ++a < m; ) {
          var v = e[a];
          t(v, a, e) && (o.push(v), p.push(a));
        }
        return eu(e, p), o;
      }
      function ts(e) {
        return e == null ? e : bp.call(e);
      }
      function Rd(e, t, o) {
        var a = e == null ? 0 : e.length;
        return a ? (o && typeof o != "number" && je(e, t, o) ? (t = 0, o = a) : (t = t == null ? 0 : Q(t), o = o === i ? a : Q(o)), wt(e, t, o)) : [];
      }
      function Pd(e, t) {
        return gi(e, t);
      }
      function Ud(e, t, o) {
        return Lo(e, t, z(o, 2));
      }
      function Bd(e, t) {
        var o = e == null ? 0 : e.length;
        if (o) {
          var a = gi(e, t);
          if (a < o && xt(e[a], t))
            return a;
        }
        return -1;
      }
      function Nd(e, t) {
        return gi(e, t, true);
      }
      function Od(e, t, o) {
        return Lo(e, t, z(o, 2), true);
      }
      function Fd(e, t) {
        var o = e == null ? 0 : e.length;
        if (o) {
          var a = gi(e, t, true) - 1;
          if (xt(e[a], t))
            return a;
        }
        return -1;
      }
      function Dd(e) {
        return e && e.length ? nu(e) : [];
      }
      function Ld(e, t) {
        return e && e.length ? nu(e, z(t, 2)) : [];
      }
      function Md(e) {
        var t = e == null ? 0 : e.length;
        return t ? wt(e, 1, t) : [];
      }
      function $d(e, t, o) {
        return e && e.length ? (t = o || t === i ? 1 : Q(t), wt(e, 0, t < 0 ? 0 : t)) : [];
      }
      function Gd(e, t, o) {
        var a = e == null ? 0 : e.length;
        return a ? (t = o || t === i ? 1 : Q(t), t = a - t, wt(e, t < 0 ? 0 : t, a)) : [];
      }
      function Wd(e, t) {
        return e && e.length ? mi(e, z(t, 3), false, true) : [];
      }
      function Hd(e, t) {
        return e && e.length ? mi(e, z(t, 3)) : [];
      }
      var zd = te(function(e) {
        return dn(Le(e, 1, ke, true));
      }), qd = te(function(e) {
        var t = vt(e);
        return ke(t) && (t = i), dn(Le(e, 1, ke, true), z(t, 2));
      }), jd = te(function(e) {
        var t = vt(e);
        return t = typeof t == "function" ? t : i, dn(Le(e, 1, ke, true), i, t);
      });
      function Kd(e) {
        return e && e.length ? dn(e) : [];
      }
      function Jd(e, t) {
        return e && e.length ? dn(e, z(t, 2)) : [];
      }
      function Vd(e, t) {
        return t = typeof t == "function" ? t : i, e && e.length ? dn(e, i, t) : [];
      }
      function ns(e) {
        if (!(e && e.length))
          return [];
        var t = 0;
        return e = cn(e, function(o) {
          if (ke(o))
            return t = Ne(o.length, t), true;
        }), vo(t, function(o) {
          return Ce(e, mo(o));
        });
      }
      function Wu(e, t) {
        if (!(e && e.length))
          return [];
        var o = ns(e);
        return t == null ? o : Ce(o, function(a) {
          return rt(t, i, a);
        });
      }
      var Yd = te(function(e, t) {
        return ke(e) ? _r(e, t) : [];
      }), Zd = te(function(e) {
        return $o(cn(e, ke));
      }), Xd = te(function(e) {
        var t = vt(e);
        return ke(t) && (t = i), $o(cn(e, ke), z(t, 2));
      }), Qd = te(function(e) {
        var t = vt(e);
        return t = typeof t == "function" ? t : i, $o(cn(e, ke), i, t);
      }), eg = te(ns);
      function tg(e, t) {
        return su(e || [], t || [], vr);
      }
      function ng(e, t) {
        return su(e || [], t || [], Cr);
      }
      var rg = te(function(e) {
        var t = e.length, o = t > 1 ? e[t - 1] : i;
        return o = typeof o == "function" ? (e.pop(), o) : i, Wu(e, o);
      });
      function Hu(e) {
        var t = g(e);
        return t.__chain__ = true, t;
      }
      function ig(e, t) {
        return t(e), e;
      }
      function Ei(e, t) {
        return t(e);
      }
      var og = Kt(function(e) {
        var t = e.length, o = t ? e[0] : 0, a = this.__wrapped__, p = function(m) {
          return Ao(m, e);
        };
        return t > 1 || this.__actions__.length || !(a instanceof re) || !Jt(o) ? this.thru(p) : (a = a.slice(o, +o + (t ? 1 : 0)), a.__actions__.push({
          func: Ei,
          args: [p],
          thisArg: i
        }), new mt(a, this.__chain__).thru(function(m) {
          return t && !m.length && m.push(i), m;
        }));
      });
      function sg() {
        return Hu(this);
      }
      function ag() {
        return new mt(this.value(), this.__chain__);
      }
      function ug() {
        this.__values__ === i && (this.__values__ = rc(this.value()));
        var e = this.__index__ >= this.__values__.length, t = e ? i : this.__values__[this.__index__++];
        return { done: e, value: t };
      }
      function cg() {
        return this;
      }
      function lg(e) {
        for (var t, o = this; o instanceof li; ) {
          var a = Fu(o);
          a.__index__ = 0, a.__values__ = i, t ? p.__wrapped__ = a : t = a;
          var p = a;
          o = o.__wrapped__;
        }
        return p.__wrapped__ = e, t;
      }
      function fg() {
        var e = this.__wrapped__;
        if (e instanceof re) {
          var t = e;
          return this.__actions__.length && (t = new re(this)), t = t.reverse(), t.__actions__.push({
            func: Ei,
            args: [ts],
            thisArg: i
          }), new mt(t, this.__chain__);
        }
        return this.thru(ts);
      }
      function pg() {
        return ou(this.__wrapped__, this.__actions__);
      }
      var hg = yi(function(e, t, o) {
        le.call(e, o) ? ++e[o] : qt(e, o, 1);
      });
      function dg(e, t, o) {
        var a = J(e) ? wa : ih;
        return o && je(e, t, o) && (t = i), a(e, z(t, 3));
      }
      function gg(e, t) {
        var o = J(e) ? cn : Wa;
        return o(e, z(t, 3));
      }
      var mg = mu(Du), yg = mu(Lu);
      function wg(e, t) {
        return Le(xi(e, t), 1);
      }
      function vg(e, t) {
        return Le(xi(e, t), Mt);
      }
      function _g(e, t, o) {
        return o = o === i ? 1 : Q(o), Le(xi(e, t), o);
      }
      function zu(e, t) {
        var o = J(e) ? dt : hn;
        return o(e, z(t, 3));
      }
      function qu(e, t) {
        var o = J(e) ? Mf : Ga;
        return o(e, z(t, 3));
      }
      var Ig = yi(function(e, t, o) {
        le.call(e, o) ? e[o].push(t) : qt(e, o, [t]);
      });
      function bg(e, t, o, a) {
        e = Ze(e) ? e : tr(e), o = o && !a ? Q(o) : 0;
        var p = e.length;
        return o < 0 && (o = Ne(p + o, 0)), Pi(e) ? o <= p && e.indexOf(t, o) > -1 : !!p && Hn(e, t, o) > -1;
      }
      var Cg = te(function(e, t, o) {
        var a = -1, p = typeof t == "function", m = Ze(e) ? A(e.length) : [];
        return hn(e, function(v) {
          m[++a] = p ? rt(t, v, o) : Ir(v, t, o);
        }), m;
      }), Sg = yi(function(e, t, o) {
        qt(e, o, t);
      });
      function xi(e, t) {
        var o = J(e) ? Ce : Ja;
        return o(e, z(t, 3));
      }
      function Eg(e, t, o, a) {
        return e == null ? [] : (J(t) || (t = t == null ? [] : [t]), o = a ? i : o, J(o) || (o = o == null ? [] : [o]), Xa(e, t, o));
      }
      var xg = yi(function(e, t, o) {
        e[o ? 0 : 1].push(t);
      }, function() {
        return [[], []];
      });
      function Ag(e, t, o) {
        var a = J(e) ? ho : ba, p = arguments.length < 3;
        return a(e, z(t, 4), o, p, hn);
      }
      function kg(e, t, o) {
        var a = J(e) ? $f : ba, p = arguments.length < 3;
        return a(e, z(t, 4), o, p, Ga);
      }
      function Tg(e, t) {
        var o = J(e) ? cn : Wa;
        return o(e, Ti(z(t, 3)));
      }
      function Rg(e) {
        var t = J(e) ? Da : bh;
        return t(e);
      }
      function Pg(e, t, o) {
        (o ? je(e, t, o) : t === i) ? t = 1 : t = Q(t);
        var a = J(e) ? Qp : Ch;
        return a(e, t);
      }
      function Ug(e) {
        var t = J(e) ? eh : Eh;
        return t(e);
      }
      function Bg(e) {
        if (e == null)
          return 0;
        if (Ze(e))
          return Pi(e) ? qn(e) : e.length;
        var t = He(e);
        return t == Fe || t == $e ? e.size : Bo(e).length;
      }
      function Ng(e, t, o) {
        var a = J(e) ? go : xh;
        return o && je(e, t, o) && (t = i), a(e, z(t, 3));
      }
      var Og = te(function(e, t) {
        if (e == null)
          return [];
        var o = t.length;
        return o > 1 && je(e, t[0], t[1]) ? t = [] : o > 2 && je(t[0], t[1], t[2]) && (t = [t[0]]), Xa(e, Le(t, 1), []);
      }), Ai = gp || function() {
        return De.Date.now();
      };
      function Fg(e, t) {
        if (typeof t != "function")
          throw new gt(y);
        return e = Q(e), function() {
          if (--e < 1)
            return t.apply(this, arguments);
        };
      }
      function ju(e, t, o) {
        return t = o ? i : t, t = e && t == null ? e.length : t, jt(e, ge, i, i, i, i, t);
      }
      function Ku(e, t) {
        var o;
        if (typeof t != "function")
          throw new gt(y);
        return e = Q(e), function() {
          return --e > 0 && (o = t.apply(this, arguments)), e <= 1 && (t = i), o;
        };
      }
      var rs = te(function(e, t, o) {
        var a = H;
        if (o.length) {
          var p = fn(o, Qn(rs));
          a |= ce;
        }
        return jt(e, a, t, o, p);
      }), Ju = te(function(e, t, o) {
        var a = H | ue;
        if (o.length) {
          var p = fn(o, Qn(Ju));
          a |= ce;
        }
        return jt(t, a, e, o, p);
      });
      function Vu(e, t, o) {
        t = o ? i : t;
        var a = jt(e, Z, i, i, i, i, i, t);
        return a.placeholder = Vu.placeholder, a;
      }
      function Yu(e, t, o) {
        t = o ? i : t;
        var a = jt(e, oe, i, i, i, i, i, t);
        return a.placeholder = Yu.placeholder, a;
      }
      function Zu(e, t, o) {
        var a, p, m, v, _, E, U = 0, B = false, N = false, L = true;
        if (typeof e != "function")
          throw new gt(y);
        t = _t(t) || 0, Se(o) && (B = !!o.leading, N = "maxWait" in o, m = N ? Ne(_t(o.maxWait) || 0, t) : m, L = "trailing" in o ? !!o.trailing : L);
        function W(Te) {
          var At = a, Zt = p;
          return a = p = i, U = Te, v = e.apply(Zt, At), v;
        }
        function q(Te) {
          return U = Te, _ = xr(ne, t), B ? W(Te) : v;
        }
        function ee(Te) {
          var At = Te - E, Zt = Te - U, mc = t - At;
          return N ? We(mc, m - Zt) : mc;
        }
        function j(Te) {
          var At = Te - E, Zt = Te - U;
          return E === i || At >= t || At < 0 || N && Zt >= m;
        }
        function ne() {
          var Te = Ai();
          if (j(Te))
            return ie(Te);
          _ = xr(ne, ee(Te));
        }
        function ie(Te) {
          return _ = i, L && a ? W(Te) : (a = p = i, v);
        }
        function at() {
          _ !== i && au(_), U = 0, a = E = p = _ = i;
        }
        function Ke() {
          return _ === i ? v : ie(Ai());
        }
        function ut() {
          var Te = Ai(), At = j(Te);
          if (a = arguments, p = this, E = Te, At) {
            if (_ === i)
              return q(E);
            if (N)
              return au(_), _ = xr(ne, t), W(E);
          }
          return _ === i && (_ = xr(ne, t)), v;
        }
        return ut.cancel = at, ut.flush = Ke, ut;
      }
      var Dg = te(function(e, t) {
        return $a(e, 1, t);
      }), Lg = te(function(e, t, o) {
        return $a(e, _t(t) || 0, o);
      });
      function Mg(e) {
        return jt(e, bn);
      }
      function ki(e, t) {
        if (typeof e != "function" || t != null && typeof t != "function")
          throw new gt(y);
        var o = function() {
          var a = arguments, p = t ? t.apply(this, a) : a[0], m = o.cache;
          if (m.has(p))
            return m.get(p);
          var v = e.apply(this, a);
          return o.cache = m.set(p, v) || m, v;
        };
        return o.cache = new (ki.Cache || zt)(), o;
      }
      ki.Cache = zt;
      function Ti(e) {
        if (typeof e != "function")
          throw new gt(y);
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return !e.call(this);
            case 1:
              return !e.call(this, t[0]);
            case 2:
              return !e.call(this, t[0], t[1]);
            case 3:
              return !e.call(this, t[0], t[1], t[2]);
          }
          return !e.apply(this, t);
        };
      }
      function $g(e) {
        return Ku(2, e);
      }
      var Gg = Ah(function(e, t) {
        t = t.length == 1 && J(t[0]) ? Ce(t[0], it(z())) : Ce(Le(t, 1), it(z()));
        var o = t.length;
        return te(function(a) {
          for (var p = -1, m = We(a.length, o); ++p < m; )
            a[p] = t[p].call(this, a[p]);
          return rt(e, this, a);
        });
      }), is = te(function(e, t) {
        var o = fn(t, Qn(is));
        return jt(e, ce, i, t, o);
      }), Xu = te(function(e, t) {
        var o = fn(t, Qn(Xu));
        return jt(e, xe, i, t, o);
      }), Wg = Kt(function(e, t) {
        return jt(e, Ct, i, i, i, t);
      });
      function Hg(e, t) {
        if (typeof e != "function")
          throw new gt(y);
        return t = t === i ? t : Q(t), te(e, t);
      }
      function zg(e, t) {
        if (typeof e != "function")
          throw new gt(y);
        return t = t == null ? 0 : Ne(Q(t), 0), te(function(o) {
          var a = o[t], p = mn(o, 0, t);
          return a && ln(p, a), rt(e, this, p);
        });
      }
      function qg(e, t, o) {
        var a = true, p = true;
        if (typeof e != "function")
          throw new gt(y);
        return Se(o) && (a = "leading" in o ? !!o.leading : a, p = "trailing" in o ? !!o.trailing : p), Zu(e, t, {
          leading: a,
          maxWait: t,
          trailing: p
        });
      }
      function jg(e) {
        return ju(e, 1);
      }
      function Kg(e, t) {
        return is(Wo(t), e);
      }
      function Jg() {
        if (!arguments.length)
          return [];
        var e = arguments[0];
        return J(e) ? e : [e];
      }
      function Vg(e) {
        return yt(e, D);
      }
      function Yg(e, t) {
        return t = typeof t == "function" ? t : i, yt(e, D, t);
      }
      function Zg(e) {
        return yt(e, R | D);
      }
      function Xg(e, t) {
        return t = typeof t == "function" ? t : i, yt(e, R | D, t);
      }
      function Qg(e, t) {
        return t == null || Ma(e, t, Oe(t));
      }
      function xt(e, t) {
        return e === t || e !== e && t !== t;
      }
      var em = Ii(Ro), tm = Ii(function(e, t) {
        return e >= t;
      }), Nn = qa(/* @__PURE__ */ (function() {
        return arguments;
      })()) ? qa : function(e) {
        return Ae(e) && le.call(e, "callee") && !Pa.call(e, "callee");
      }, J = A.isArray, nm = pa ? it(pa) : lh;
      function Ze(e) {
        return e != null && Ri(e.length) && !Vt(e);
      }
      function ke(e) {
        return Ae(e) && Ze(e);
      }
      function rm(e) {
        return e === true || e === false || Ae(e) && qe(e) == pt;
      }
      var yn = yp || gs, im = ha ? it(ha) : fh;
      function om(e) {
        return Ae(e) && e.nodeType === 1 && !Ar(e);
      }
      function sm(e) {
        if (e == null)
          return true;
        if (Ze(e) && (J(e) || typeof e == "string" || typeof e.splice == "function" || yn(e) || er(e) || Nn(e)))
          return !e.length;
        var t = He(e);
        if (t == Fe || t == $e)
          return !e.size;
        if (Er(e))
          return !Bo(e).length;
        for (var o in e)
          if (le.call(e, o))
            return false;
        return true;
      }
      function am(e, t) {
        return br(e, t);
      }
      function um(e, t, o) {
        o = typeof o == "function" ? o : i;
        var a = o ? o(e, t) : i;
        return a === i ? br(e, t, i, o) : !!a;
      }
      function os(e) {
        if (!Ae(e))
          return false;
        var t = qe(e);
        return t == Gn || t == Hr || typeof e.message == "string" && typeof e.name == "string" && !Ar(e);
      }
      function cm(e) {
        return typeof e == "number" && Ba(e);
      }
      function Vt(e) {
        if (!Se(e))
          return false;
        var t = qe(e);
        return t == Sn || t == Wt || t == Wr || t == eo;
      }
      function Qu(e) {
        return typeof e == "number" && e == Q(e);
      }
      function Ri(e) {
        return typeof e == "number" && e > -1 && e % 1 == 0 && e <= Pt;
      }
      function Se(e) {
        var t = typeof e;
        return e != null && (t == "object" || t == "function");
      }
      function Ae(e) {
        return e != null && typeof e == "object";
      }
      var ec = da ? it(da) : hh;
      function lm(e, t) {
        return e === t || Uo(e, t, Vo(t));
      }
      function fm(e, t, o) {
        return o = typeof o == "function" ? o : i, Uo(e, t, Vo(t), o);
      }
      function pm(e) {
        return tc(e) && e != +e;
      }
      function hm(e) {
        if (Yh(e))
          throw new K(f);
        return ja(e);
      }
      function dm(e) {
        return e === null;
      }
      function gm(e) {
        return e == null;
      }
      function tc(e) {
        return typeof e == "number" || Ae(e) && qe(e) == En;
      }
      function Ar(e) {
        if (!Ae(e) || qe(e) != nt)
          return false;
        var t = ri(e);
        if (t === null)
          return true;
        var o = le.call(t, "constructor") && t.constructor;
        return typeof o == "function" && o instanceof o && Qr.call(o) == fp;
      }
      var ss = ga ? it(ga) : dh;
      function mm(e) {
        return Qu(e) && e >= -Pt && e <= Pt;
      }
      var nc = ma ? it(ma) : gh;
      function Pi(e) {
        return typeof e == "string" || !J(e) && Ae(e) && qe(e) == Ge;
      }
      function st(e) {
        return typeof e == "symbol" || Ae(e) && qe(e) == un;
      }
      var er = ya ? it(ya) : mh;
      function ym(e) {
        return e === i;
      }
      function wm(e) {
        return Ae(e) && He(e) == Ve;
      }
      function vm(e) {
        return Ae(e) && qe(e) == no;
      }
      var _m = Ii(No), Im = Ii(function(e, t) {
        return e <= t;
      });
      function rc(e) {
        if (!e)
          return [];
        if (Ze(e))
          return Pi(e) ? St(e) : Ye(e);
        if (dr && e[dr])
          return Qf(e[dr]());
        var t = He(e), o = t == Fe ? Io : t == $e ? Yr : tr;
        return o(e);
      }
      function Yt(e) {
        if (!e)
          return e === 0 ? e : 0;
        if (e = _t(e), e === Mt || e === -Mt) {
          var t = e < 0 ? -1 : 1;
          return t * Xi;
        }
        return e === e ? e : 0;
      }
      function Q(e) {
        var t = Yt(e), o = t % 1;
        return t === t ? o ? t - o : t : 0;
      }
      function ic(e) {
        return e ? Rn(Q(e), 0, he) : 0;
      }
      function _t(e) {
        if (typeof e == "number")
          return e;
        if (st(e))
          return $n;
        if (Se(e)) {
          var t = typeof e.valueOf == "function" ? e.valueOf() : e;
          e = Se(t) ? t + "" : t;
        }
        if (typeof e != "string")
          return e === 0 ? e : +e;
        e = Ca(e);
        var o = tf.test(e);
        return o || rf.test(e) ? Ff(e.slice(2), o ? 2 : 8) : ef.test(e) ? $n : +e;
      }
      function oc(e) {
        return Bt(e, Xe(e));
      }
      function bm(e) {
        return e ? Rn(Q(e), -Pt, Pt) : e === 0 ? e : 0;
      }
      function fe(e) {
        return e == null ? "" : ot(e);
      }
      var Cm = Zn(function(e, t) {
        if (Er(t) || Ze(t)) {
          Bt(t, Oe(t), e);
          return;
        }
        for (var o in t)
          le.call(t, o) && vr(e, o, t[o]);
      }), sc = Zn(function(e, t) {
        Bt(t, Xe(t), e);
      }), Ui = Zn(function(e, t, o, a) {
        Bt(t, Xe(t), e, a);
      }), Sm = Zn(function(e, t, o, a) {
        Bt(t, Oe(t), e, a);
      }), Em = Kt(Ao);
      function xm(e, t) {
        var o = Yn(e);
        return t == null ? o : La(o, t);
      }
      var Am = te(function(e, t) {
        e = we(e);
        var o = -1, a = t.length, p = a > 2 ? t[2] : i;
        for (p && je(t[0], t[1], p) && (a = 1); ++o < a; )
          for (var m = t[o], v = Xe(m), _ = -1, E = v.length; ++_ < E; ) {
            var U = v[_], B = e[U];
            (B === i || xt(B, Kn[U]) && !le.call(e, U)) && (e[U] = m[U]);
          }
        return e;
      }), km = te(function(e) {
        return e.push(i, Cu), rt(ac, i, e);
      });
      function Tm(e, t) {
        return va(e, z(t, 3), Ut);
      }
      function Rm(e, t) {
        return va(e, z(t, 3), To);
      }
      function Pm(e, t) {
        return e == null ? e : ko(e, z(t, 3), Xe);
      }
      function Um(e, t) {
        return e == null ? e : Ha(e, z(t, 3), Xe);
      }
      function Bm(e, t) {
        return e && Ut(e, z(t, 3));
      }
      function Nm(e, t) {
        return e && To(e, z(t, 3));
      }
      function Om(e) {
        return e == null ? [] : hi(e, Oe(e));
      }
      function Fm(e) {
        return e == null ? [] : hi(e, Xe(e));
      }
      function as(e, t, o) {
        var a = e == null ? i : Pn(e, t);
        return a === i ? o : a;
      }
      function Dm(e, t) {
        return e != null && xu(e, t, sh);
      }
      function us(e, t) {
        return e != null && xu(e, t, ah);
      }
      var Lm = wu(function(e, t, o) {
        t != null && typeof t.toString != "function" && (t = ei.call(t)), e[t] = o;
      }, ls(Qe)), Mm = wu(function(e, t, o) {
        t != null && typeof t.toString != "function" && (t = ei.call(t)), le.call(e, t) ? e[t].push(o) : e[t] = [o];
      }, z), $m = te(Ir);
      function Oe(e) {
        return Ze(e) ? Fa(e) : Bo(e);
      }
      function Xe(e) {
        return Ze(e) ? Fa(e, true) : yh(e);
      }
      function Gm(e, t) {
        var o = {};
        return t = z(t, 3), Ut(e, function(a, p, m) {
          qt(o, t(a, p, m), a);
        }), o;
      }
      function Wm(e, t) {
        var o = {};
        return t = z(t, 3), Ut(e, function(a, p, m) {
          qt(o, p, t(a, p, m));
        }), o;
      }
      var Hm = Zn(function(e, t, o) {
        di(e, t, o);
      }), ac = Zn(function(e, t, o, a) {
        di(e, t, o, a);
      }), zm = Kt(function(e, t) {
        var o = {};
        if (e == null)
          return o;
        var a = false;
        t = Ce(t, function(m) {
          return m = gn(m, e), a || (a = m.length > 1), m;
        }), Bt(e, Ko(e), o), a && (o = yt(o, R | G | D, Lh));
        for (var p = t.length; p--; )
          Mo(o, t[p]);
        return o;
      });
      function qm(e, t) {
        return uc(e, Ti(z(t)));
      }
      var jm = Kt(function(e, t) {
        return e == null ? {} : vh(e, t);
      });
      function uc(e, t) {
        if (e == null)
          return {};
        var o = Ce(Ko(e), function(a) {
          return [a];
        });
        return t = z(t), Qa(e, o, function(a, p) {
          return t(a, p[0]);
        });
      }
      function Km(e, t, o) {
        t = gn(t, e);
        var a = -1, p = t.length;
        for (p || (p = 1, e = i); ++a < p; ) {
          var m = e == null ? i : e[Nt(t[a])];
          m === i && (a = p, m = o), e = Vt(m) ? m.call(e) : m;
        }
        return e;
      }
      function Jm(e, t, o) {
        return e == null ? e : Cr(e, t, o);
      }
      function Vm(e, t, o, a) {
        return a = typeof a == "function" ? a : i, e == null ? e : Cr(e, t, o, a);
      }
      var cc = Iu(Oe), lc = Iu(Xe);
      function Ym(e, t, o) {
        var a = J(e), p = a || yn(e) || er(e);
        if (t = z(t, 4), o == null) {
          var m = e && e.constructor;
          p ? o = a ? new m() : [] : Se(e) ? o = Vt(m) ? Yn(ri(e)) : {} : o = {};
        }
        return (p ? dt : Ut)(e, function(v, _, E) {
          return t(o, v, _, E);
        }), o;
      }
      function Zm(e, t) {
        return e == null ? true : Mo(e, t);
      }
      function Xm(e, t, o) {
        return e == null ? e : iu(e, t, Wo(o));
      }
      function Qm(e, t, o, a) {
        return a = typeof a == "function" ? a : i, e == null ? e : iu(e, t, Wo(o), a);
      }
      function tr(e) {
        return e == null ? [] : _o(e, Oe(e));
      }
      function e0(e) {
        return e == null ? [] : _o(e, Xe(e));
      }
      function t0(e, t, o) {
        return o === i && (o = t, t = i), o !== i && (o = _t(o), o = o === o ? o : 0), t !== i && (t = _t(t), t = t === t ? t : 0), Rn(_t(e), t, o);
      }
      function n0(e, t, o) {
        return t = Yt(t), o === i ? (o = t, t = 0) : o = Yt(o), e = _t(e), uh(e, t, o);
      }
      function r0(e, t, o) {
        if (o && typeof o != "boolean" && je(e, t, o) && (t = o = i), o === i && (typeof t == "boolean" ? (o = t, t = i) : typeof e == "boolean" && (o = e, e = i)), e === i && t === i ? (e = 0, t = 1) : (e = Yt(e), t === i ? (t = e, e = 0) : t = Yt(t)), e > t) {
          var a = e;
          e = t, t = a;
        }
        if (o || e % 1 || t % 1) {
          var p = Na();
          return We(e + p * (t - e + Of("1e-" + ((p + "").length - 1))), t);
        }
        return Fo(e, t);
      }
      var i0 = Xn(function(e, t, o) {
        return t = t.toLowerCase(), e + (o ? fc(t) : t);
      });
      function fc(e) {
        return cs(fe(e).toLowerCase());
      }
      function pc(e) {
        return e = fe(e), e && e.replace(sf, Jf).replace(Ef, "");
      }
      function o0(e, t, o) {
        e = fe(e), t = ot(t);
        var a = e.length;
        o = o === i ? a : Rn(Q(o), 0, a);
        var p = o;
        return o -= t.length, o >= 0 && e.slice(o, p) == t;
      }
      function s0(e) {
        return e = fe(e), e && Ml.test(e) ? e.replace(Hs, Vf) : e;
      }
      function a0(e) {
        return e = fe(e), e && ql.test(e) ? e.replace(ro, "\\$&") : e;
      }
      var u0 = Xn(function(e, t, o) {
        return e + (o ? "-" : "") + t.toLowerCase();
      }), c0 = Xn(function(e, t, o) {
        return e + (o ? " " : "") + t.toLowerCase();
      }), l0 = gu("toLowerCase");
      function f0(e, t, o) {
        e = fe(e), t = Q(t);
        var a = t ? qn(e) : 0;
        if (!t || a >= t)
          return e;
        var p = (t - a) / 2;
        return _i(ai(p), o) + e + _i(si(p), o);
      }
      function p0(e, t, o) {
        e = fe(e), t = Q(t);
        var a = t ? qn(e) : 0;
        return t && a < t ? e + _i(t - a, o) : e;
      }
      function h0(e, t, o) {
        e = fe(e), t = Q(t);
        var a = t ? qn(e) : 0;
        return t && a < t ? _i(t - a, o) + e : e;
      }
      function d0(e, t, o) {
        return o || t == null ? t = 0 : t && (t = +t), Ip(fe(e).replace(io, ""), t || 0);
      }
      function g0(e, t, o) {
        return (o ? je(e, t, o) : t === i) ? t = 1 : t = Q(t), Do(fe(e), t);
      }
      function m0() {
        var e = arguments, t = fe(e[0]);
        return e.length < 3 ? t : t.replace(e[1], e[2]);
      }
      var y0 = Xn(function(e, t, o) {
        return e + (o ? "_" : "") + t.toLowerCase();
      });
      function w0(e, t, o) {
        return o && typeof o != "number" && je(e, t, o) && (t = o = i), o = o === i ? he : o >>> 0, o ? (e = fe(e), e && (typeof t == "string" || t != null && !ss(t)) && (t = ot(t), !t && zn(e)) ? mn(St(e), 0, o) : e.split(t, o)) : [];
      }
      var v0 = Xn(function(e, t, o) {
        return e + (o ? " " : "") + cs(t);
      });
      function _0(e, t, o) {
        return e = fe(e), o = o == null ? 0 : Rn(Q(o), 0, e.length), t = ot(t), e.slice(o, o + t.length) == t;
      }
      function I0(e, t, o) {
        var a = g.templateSettings;
        o && je(e, t, o) && (t = i), e = fe(e), t = Ui({}, t, a, bu);
        var p = Ui({}, t.imports, a.imports, bu), m = Oe(p), v = _o(p, m), _, E, U = 0, B = t.interpolate || qr, N = "__p += '", L = bo(
          (t.escape || qr).source + "|" + B.source + "|" + (B === zs ? Ql : qr).source + "|" + (t.evaluate || qr).source + "|$",
          "g"
        ), W = "//# sourceURL=" + (le.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Rf + "]") + `
`;
        e.replace(L, function(j, ne, ie, at, Ke, ut) {
          return ie || (ie = at), N += e.slice(U, ut).replace(af, Yf), ne && (_ = true, N += `' +
__e(` + ne + `) +
'`), Ke && (E = true, N += `';
` + Ke + `;
__p += '`), ie && (N += `' +
((__t = (` + ie + `)) == null ? '' : __t) +
'`), U = ut + j.length, j;
        }), N += `';
`;
        var q = le.call(t, "variable") && t.variable;
        if (!q)
          N = `with (obj) {
` + N + `
}
`;
        else if (Zl.test(q))
          throw new K(h);
        N = (E ? N.replace(de, "") : N).replace(Fl, "$1").replace(Dl, "$1;"), N = "function(" + (q || "obj") + `) {
` + (q ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (_ ? ", __e = _.escape" : "") + (E ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + N + `return __p
}`;
        var ee = dc(function() {
          return se(m, W + "return " + N).apply(i, v);
        });
        if (ee.source = N, os(ee))
          throw ee;
        return ee;
      }
      function b0(e) {
        return fe(e).toLowerCase();
      }
      function C0(e) {
        return fe(e).toUpperCase();
      }
      function S0(e, t, o) {
        if (e = fe(e), e && (o || t === i))
          return Ca(e);
        if (!e || !(t = ot(t)))
          return e;
        var a = St(e), p = St(t), m = Sa(a, p), v = Ea(a, p) + 1;
        return mn(a, m, v).join("");
      }
      function E0(e, t, o) {
        if (e = fe(e), e && (o || t === i))
          return e.slice(0, Aa(e) + 1);
        if (!e || !(t = ot(t)))
          return e;
        var a = St(e), p = Ea(a, St(t)) + 1;
        return mn(a, 0, p).join("");
      }
      function x0(e, t, o) {
        if (e = fe(e), e && (o || t === i))
          return e.replace(io, "");
        if (!e || !(t = ot(t)))
          return e;
        var a = St(e), p = Sa(a, St(t));
        return mn(a, p).join("");
      }
      function A0(e, t) {
        var o = Lr, a = Ji;
        if (Se(t)) {
          var p = "separator" in t ? t.separator : p;
          o = "length" in t ? Q(t.length) : o, a = "omission" in t ? ot(t.omission) : a;
        }
        e = fe(e);
        var m = e.length;
        if (zn(e)) {
          var v = St(e);
          m = v.length;
        }
        if (o >= m)
          return e;
        var _ = o - qn(a);
        if (_ < 1)
          return a;
        var E = v ? mn(v, 0, _).join("") : e.slice(0, _);
        if (p === i)
          return E + a;
        if (v && (_ += E.length - _), ss(p)) {
          if (e.slice(_).search(p)) {
            var U, B = E;
            for (p.global || (p = bo(p.source, fe(qs.exec(p)) + "g")), p.lastIndex = 0; U = p.exec(B); )
              var N = U.index;
            E = E.slice(0, N === i ? _ : N);
          }
        } else if (e.indexOf(ot(p), _) != _) {
          var L = E.lastIndexOf(p);
          L > -1 && (E = E.slice(0, L));
        }
        return E + a;
      }
      function k0(e) {
        return e = fe(e), e && Ll.test(e) ? e.replace(Ws, rp) : e;
      }
      var T0 = Xn(function(e, t, o) {
        return e + (o ? " " : "") + t.toUpperCase();
      }), cs = gu("toUpperCase");
      function hc(e, t, o) {
        return e = fe(e), t = o ? i : t, t === i ? Xf(e) ? sp(e) : Hf(e) : e.match(t) || [];
      }
      var dc = te(function(e, t) {
        try {
          return rt(e, i, t);
        } catch (o) {
          return os(o) ? o : new K(o);
        }
      }), R0 = Kt(function(e, t) {
        return dt(t, function(o) {
          o = Nt(o), qt(e, o, rs(e[o], e));
        }), e;
      });
      function P0(e) {
        var t = e == null ? 0 : e.length, o = z();
        return e = t ? Ce(e, function(a) {
          if (typeof a[1] != "function")
            throw new gt(y);
          return [o(a[0]), a[1]];
        }) : [], te(function(a) {
          for (var p = -1; ++p < t; ) {
            var m = e[p];
            if (rt(m[0], this, a))
              return rt(m[1], this, a);
          }
        });
      }
      function U0(e) {
        return rh(yt(e, R));
      }
      function ls(e) {
        return function() {
          return e;
        };
      }
      function B0(e, t) {
        return e == null || e !== e ? t : e;
      }
      var N0 = yu(), O0 = yu(true);
      function Qe(e) {
        return e;
      }
      function fs(e) {
        return Ka(typeof e == "function" ? e : yt(e, R));
      }
      function F0(e) {
        return Va(yt(e, R));
      }
      function D0(e, t) {
        return Ya(e, yt(t, R));
      }
      var L0 = te(function(e, t) {
        return function(o) {
          return Ir(o, e, t);
        };
      }), M0 = te(function(e, t) {
        return function(o) {
          return Ir(e, o, t);
        };
      });
      function ps(e, t, o) {
        var a = Oe(t), p = hi(t, a);
        o == null && !(Se(t) && (p.length || !a.length)) && (o = t, t = e, e = this, p = hi(t, Oe(t)));
        var m = !(Se(o) && "chain" in o) || !!o.chain, v = Vt(e);
        return dt(p, function(_) {
          var E = t[_];
          e[_] = E, v && (e.prototype[_] = function() {
            var U = this.__chain__;
            if (m || U) {
              var B = e(this.__wrapped__), N = B.__actions__ = Ye(this.__actions__);
              return N.push({ func: E, args: arguments, thisArg: e }), B.__chain__ = U, B;
            }
            return E.apply(e, ln([this.value()], arguments));
          });
        }), e;
      }
      function $0() {
        return De._ === this && (De._ = pp), this;
      }
      function hs() {
      }
      function G0(e) {
        return e = Q(e), te(function(t) {
          return Za(t, e);
        });
      }
      var W0 = zo(Ce), H0 = zo(wa), z0 = zo(go);
      function gc(e) {
        return Zo(e) ? mo(Nt(e)) : _h(e);
      }
      function q0(e) {
        return function(t) {
          return e == null ? i : Pn(e, t);
        };
      }
      var j0 = vu(), K0 = vu(true);
      function ds() {
        return [];
      }
      function gs() {
        return false;
      }
      function J0() {
        return {};
      }
      function V0() {
        return "";
      }
      function Y0() {
        return true;
      }
      function Z0(e, t) {
        if (e = Q(e), e < 1 || e > Pt)
          return [];
        var o = he, a = We(e, he);
        t = z(t), e -= he;
        for (var p = vo(a, t); ++o < e; )
          t(o);
        return p;
      }
      function X0(e) {
        return J(e) ? Ce(e, Nt) : st(e) ? [e] : Ye(Ou(fe(e)));
      }
      function Q0(e) {
        var t = ++lp;
        return fe(e) + t;
      }
      var ey = vi(function(e, t) {
        return e + t;
      }, 0), ty = qo("ceil"), ny = vi(function(e, t) {
        return e / t;
      }, 1), ry = qo("floor");
      function iy(e) {
        return e && e.length ? pi(e, Qe, Ro) : i;
      }
      function oy(e, t) {
        return e && e.length ? pi(e, z(t, 2), Ro) : i;
      }
      function sy(e) {
        return Ia(e, Qe);
      }
      function ay(e, t) {
        return Ia(e, z(t, 2));
      }
      function uy(e) {
        return e && e.length ? pi(e, Qe, No) : i;
      }
      function cy(e, t) {
        return e && e.length ? pi(e, z(t, 2), No) : i;
      }
      var ly = vi(function(e, t) {
        return e * t;
      }, 1), fy = qo("round"), py = vi(function(e, t) {
        return e - t;
      }, 0);
      function hy(e) {
        return e && e.length ? wo(e, Qe) : 0;
      }
      function dy(e, t) {
        return e && e.length ? wo(e, z(t, 2)) : 0;
      }
      return g.after = Fg, g.ary = ju, g.assign = Cm, g.assignIn = sc, g.assignInWith = Ui, g.assignWith = Sm, g.at = Em, g.before = Ku, g.bind = rs, g.bindAll = R0, g.bindKey = Ju, g.castArray = Jg, g.chain = Hu, g.chunk = rd, g.compact = id, g.concat = od, g.cond = P0, g.conforms = U0, g.constant = ls, g.countBy = hg, g.create = xm, g.curry = Vu, g.curryRight = Yu, g.debounce = Zu, g.defaults = Am, g.defaultsDeep = km, g.defer = Dg, g.delay = Lg, g.difference = sd, g.differenceBy = ad, g.differenceWith = ud, g.drop = cd, g.dropRight = ld, g.dropRightWhile = fd, g.dropWhile = pd, g.fill = hd, g.filter = gg, g.flatMap = wg, g.flatMapDeep = vg, g.flatMapDepth = _g, g.flatten = Mu, g.flattenDeep = dd, g.flattenDepth = gd, g.flip = Mg, g.flow = N0, g.flowRight = O0, g.fromPairs = md, g.functions = Om, g.functionsIn = Fm, g.groupBy = Ig, g.initial = wd, g.intersection = vd, g.intersectionBy = _d, g.intersectionWith = Id, g.invert = Lm, g.invertBy = Mm, g.invokeMap = Cg, g.iteratee = fs, g.keyBy = Sg, g.keys = Oe, g.keysIn = Xe, g.map = xi, g.mapKeys = Gm, g.mapValues = Wm, g.matches = F0, g.matchesProperty = D0, g.memoize = ki, g.merge = Hm, g.mergeWith = ac, g.method = L0, g.methodOf = M0, g.mixin = ps, g.negate = Ti, g.nthArg = G0, g.omit = zm, g.omitBy = qm, g.once = $g, g.orderBy = Eg, g.over = W0, g.overArgs = Gg, g.overEvery = H0, g.overSome = z0, g.partial = is, g.partialRight = Xu, g.partition = xg, g.pick = jm, g.pickBy = uc, g.property = gc, g.propertyOf = q0, g.pull = Ed, g.pullAll = Gu, g.pullAllBy = xd, g.pullAllWith = Ad, g.pullAt = kd, g.range = j0, g.rangeRight = K0, g.rearg = Wg, g.reject = Tg, g.remove = Td, g.rest = Hg, g.reverse = ts, g.sampleSize = Pg, g.set = Jm, g.setWith = Vm, g.shuffle = Ug, g.slice = Rd, g.sortBy = Og, g.sortedUniq = Dd, g.sortedUniqBy = Ld, g.split = w0, g.spread = zg, g.tail = Md, g.take = $d, g.takeRight = Gd, g.takeRightWhile = Wd, g.takeWhile = Hd, g.tap = ig, g.throttle = qg, g.thru = Ei, g.toArray = rc, g.toPairs = cc, g.toPairsIn = lc, g.toPath = X0, g.toPlainObject = oc, g.transform = Ym, g.unary = jg, g.union = zd, g.unionBy = qd, g.unionWith = jd, g.uniq = Kd, g.uniqBy = Jd, g.uniqWith = Vd, g.unset = Zm, g.unzip = ns, g.unzipWith = Wu, g.update = Xm, g.updateWith = Qm, g.values = tr, g.valuesIn = e0, g.without = Yd, g.words = hc, g.wrap = Kg, g.xor = Zd, g.xorBy = Xd, g.xorWith = Qd, g.zip = eg, g.zipObject = tg, g.zipObjectDeep = ng, g.zipWith = rg, g.entries = cc, g.entriesIn = lc, g.extend = sc, g.extendWith = Ui, ps(g, g), g.add = ey, g.attempt = dc, g.camelCase = i0, g.capitalize = fc, g.ceil = ty, g.clamp = t0, g.clone = Vg, g.cloneDeep = Zg, g.cloneDeepWith = Xg, g.cloneWith = Yg, g.conformsTo = Qg, g.deburr = pc, g.defaultTo = B0, g.divide = ny, g.endsWith = o0, g.eq = xt, g.escape = s0, g.escapeRegExp = a0, g.every = dg, g.find = mg, g.findIndex = Du, g.findKey = Tm, g.findLast = yg, g.findLastIndex = Lu, g.findLastKey = Rm, g.floor = ry, g.forEach = zu, g.forEachRight = qu, g.forIn = Pm, g.forInRight = Um, g.forOwn = Bm, g.forOwnRight = Nm, g.get = as, g.gt = em, g.gte = tm, g.has = Dm, g.hasIn = us, g.head = $u, g.identity = Qe, g.includes = bg, g.indexOf = yd, g.inRange = n0, g.invoke = $m, g.isArguments = Nn, g.isArray = J, g.isArrayBuffer = nm, g.isArrayLike = Ze, g.isArrayLikeObject = ke, g.isBoolean = rm, g.isBuffer = yn, g.isDate = im, g.isElement = om, g.isEmpty = sm, g.isEqual = am, g.isEqualWith = um, g.isError = os, g.isFinite = cm, g.isFunction = Vt, g.isInteger = Qu, g.isLength = Ri, g.isMap = ec, g.isMatch = lm, g.isMatchWith = fm, g.isNaN = pm, g.isNative = hm, g.isNil = gm, g.isNull = dm, g.isNumber = tc, g.isObject = Se, g.isObjectLike = Ae, g.isPlainObject = Ar, g.isRegExp = ss, g.isSafeInteger = mm, g.isSet = nc, g.isString = Pi, g.isSymbol = st, g.isTypedArray = er, g.isUndefined = ym, g.isWeakMap = wm, g.isWeakSet = vm, g.join = bd, g.kebabCase = u0, g.last = vt, g.lastIndexOf = Cd, g.lowerCase = c0, g.lowerFirst = l0, g.lt = _m, g.lte = Im, g.max = iy, g.maxBy = oy, g.mean = sy, g.meanBy = ay, g.min = uy, g.minBy = cy, g.stubArray = ds, g.stubFalse = gs, g.stubObject = J0, g.stubString = V0, g.stubTrue = Y0, g.multiply = ly, g.nth = Sd, g.noConflict = $0, g.noop = hs, g.now = Ai, g.pad = f0, g.padEnd = p0, g.padStart = h0, g.parseInt = d0, g.random = r0, g.reduce = Ag, g.reduceRight = kg, g.repeat = g0, g.replace = m0, g.result = Km, g.round = fy, g.runInContext = S, g.sample = Rg, g.size = Bg, g.snakeCase = y0, g.some = Ng, g.sortedIndex = Pd, g.sortedIndexBy = Ud, g.sortedIndexOf = Bd, g.sortedLastIndex = Nd, g.sortedLastIndexBy = Od, g.sortedLastIndexOf = Fd, g.startCase = v0, g.startsWith = _0, g.subtract = py, g.sum = hy, g.sumBy = dy, g.template = I0, g.times = Z0, g.toFinite = Yt, g.toInteger = Q, g.toLength = ic, g.toLower = b0, g.toNumber = _t, g.toSafeInteger = bm, g.toString = fe, g.toUpper = C0, g.trim = S0, g.trimEnd = E0, g.trimStart = x0, g.truncate = A0, g.unescape = k0, g.uniqueId = Q0, g.upperCase = T0, g.upperFirst = cs, g.each = zu, g.eachRight = qu, g.first = $u, ps(g, (function() {
        var e = {};
        return Ut(g, function(t, o) {
          le.call(g.prototype, o) || (e[o] = t);
        }), e;
      })(), { chain: false }), g.VERSION = s, dt(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(e) {
        g[e].placeholder = g;
      }), dt(["drop", "take"], function(e, t) {
        re.prototype[e] = function(o) {
          o = o === i ? 1 : Ne(Q(o), 0);
          var a = this.__filtered__ && !t ? new re(this) : this.clone();
          return a.__filtered__ ? a.__takeCount__ = We(o, a.__takeCount__) : a.__views__.push({
            size: We(o, he),
            type: e + (a.__dir__ < 0 ? "Right" : "")
          }), a;
        }, re.prototype[e + "Right"] = function(o) {
          return this.reverse()[e](o).reverse();
        };
      }), dt(["filter", "map", "takeWhile"], function(e, t) {
        var o = t + 1, a = o == pr || o == Zi;
        re.prototype[e] = function(p) {
          var m = this.clone();
          return m.__iteratees__.push({
            iteratee: z(p, 3),
            type: o
          }), m.__filtered__ = m.__filtered__ || a, m;
        };
      }), dt(["head", "last"], function(e, t) {
        var o = "take" + (t ? "Right" : "");
        re.prototype[e] = function() {
          return this[o](1).value()[0];
        };
      }), dt(["initial", "tail"], function(e, t) {
        var o = "drop" + (t ? "" : "Right");
        re.prototype[e] = function() {
          return this.__filtered__ ? new re(this) : this[o](1);
        };
      }), re.prototype.compact = function() {
        return this.filter(Qe);
      }, re.prototype.find = function(e) {
        return this.filter(e).head();
      }, re.prototype.findLast = function(e) {
        return this.reverse().find(e);
      }, re.prototype.invokeMap = te(function(e, t) {
        return typeof e == "function" ? new re(this) : this.map(function(o) {
          return Ir(o, e, t);
        });
      }), re.prototype.reject = function(e) {
        return this.filter(Ti(z(e)));
      }, re.prototype.slice = function(e, t) {
        e = Q(e);
        var o = this;
        return o.__filtered__ && (e > 0 || t < 0) ? new re(o) : (e < 0 ? o = o.takeRight(-e) : e && (o = o.drop(e)), t !== i && (t = Q(t), o = t < 0 ? o.dropRight(-t) : o.take(t - e)), o);
      }, re.prototype.takeRightWhile = function(e) {
        return this.reverse().takeWhile(e).reverse();
      }, re.prototype.toArray = function() {
        return this.take(he);
      }, Ut(re.prototype, function(e, t) {
        var o = /^(?:filter|find|map|reject)|While$/.test(t), a = /^(?:head|last)$/.test(t), p = g[a ? "take" + (t == "last" ? "Right" : "") : t], m = a || /^find/.test(t);
        p && (g.prototype[t] = function() {
          var v = this.__wrapped__, _ = a ? [1] : arguments, E = v instanceof re, U = _[0], B = E || J(v), N = function(ne) {
            var ie = p.apply(g, ln([ne], _));
            return a && L ? ie[0] : ie;
          };
          B && o && typeof U == "function" && U.length != 1 && (E = B = false);
          var L = this.__chain__, W = !!this.__actions__.length, q = m && !L, ee = E && !W;
          if (!m && B) {
            v = ee ? v : new re(this);
            var j = e.apply(v, _);
            return j.__actions__.push({ func: Ei, args: [N], thisArg: i }), new mt(j, L);
          }
          return q && ee ? e.apply(this, _) : (j = this.thru(N), q ? a ? j.value()[0] : j.value() : j);
        });
      }), dt(["pop", "push", "shift", "sort", "splice", "unshift"], function(e) {
        var t = Zr[e], o = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru", a = /^(?:pop|shift)$/.test(e);
        g.prototype[e] = function() {
          var p = arguments;
          if (a && !this.__chain__) {
            var m = this.value();
            return t.apply(J(m) ? m : [], p);
          }
          return this[o](function(v) {
            return t.apply(J(v) ? v : [], p);
          });
        };
      }), Ut(re.prototype, function(e, t) {
        var o = g[t];
        if (o) {
          var a = o.name + "";
          le.call(Vn, a) || (Vn[a] = []), Vn[a].push({ name: t, func: o });
        }
      }), Vn[wi(i, ue).name] = [{
        name: "wrapper",
        func: i
      }], re.prototype.clone = kp, re.prototype.reverse = Tp, re.prototype.value = Rp, g.prototype.at = og, g.prototype.chain = sg, g.prototype.commit = ag, g.prototype.next = ug, g.prototype.plant = lg, g.prototype.reverse = fg, g.prototype.toJSON = g.prototype.valueOf = g.prototype.value = pg, g.prototype.first = g.prototype.head, dr && (g.prototype[dr] = cg), g;
    }, jn = ap();
    xn ? ((xn.exports = jn)._ = jn, lo._ = jn) : De._ = jn;
  }).call(kr);
})(Fi, Fi.exports);
var bs = Fi.exports;
var Cs = /* @__PURE__ */ _y(bs);
function ft(n, r = true) {
  const i = `[${n}]`;
  return {
    log: (...s) => r && console.log(i, ...s),
    warn: (...s) => r && console.warn(i, ...s),
    error: (...s) => console.error(i, ...s),
    debug: (...s) => r && console.debug(i, ...s),
    crumb: (...s) => r && console.log(i, "[crumb]", ...s),
    trackError: (s, l) => console.error(i, "[error]", s, l),
    trackEvent: (s, l) => r && console.log(i, "[event]", s, l),
    sensorsLog: (...s) => r && console.log(i, "[sensors]", ...s)
  };
}
function Iy(n) {
  return n.replace(/\n/g, "\\n");
}
function Mc(n) {
  if (process.env.NODE_ENV !== "production")
    return n();
}
var pe = /* @__PURE__ */ ((n) => (n.InviteShared = "Invite Link Shared", n.OnboardingSessionRevived = "Onboarding Session Revived", n.AppInstalled = "App Installed", n.AppUpdated = "App Updated", n.AppActive = "App Active", n.LoggedInBeforeSignup = "Logged In Without Signing Up", n.FailedSignupOTP = "Failed to send Signup OTP", n.FailedLoginOTP = "Failed to send Login OTP", n.InvitedUserFailedInventoryCheck = "Invited User Failed Inventory Check", n.PersonalInvitePressed = "Personal Invite Shown", n.ChannelTemplateSetup = "Channel Created from Template", n.ChannelLoadComplete = "Channel Load Complete", n.SessionInitialized = "Session Initialized", n.NodeNotRunning = "Node Not Running", n.NodeUnderMaintenance = "Node Under Maintenance", n.LoginDebug = "Login Debug", n.LoginAnomaly = "Login Anomaly", n.ExpectedHostingError = "Expected Hosting API Error", n.UnexpectedHostingError = "Unexpected Hosting API Response", n.NodeWaitReport = "Node Wait Report", n.InviteError = "Invite Error", n.InviteDebug = "Invite Debug", n.InviteButtonShown = "Invite Button Shown", n.InitializedNewInvite = "Initialized New Invite", n.DebugLogs = "Debug Logs", n.DebugGroupCreate = "Create Group Debug", n.DebugAttestation = "Attestation Debug", n.DebugContactMatching = "Contact Matching Debug", n.ErrorContactMatching = "Contact Matching Error", n.AppError = "App Error", n.AuthenticatedNodeStopped = "Node Stopped While Logged In", n.Scry = "Scry", n.ScryNoun = "Scry Noun", n.Poke = "Poke", n.NativeDbDebug = "Native DB Debug", n.Thread = "Thread", n.TrackedPoke = "TrackedPoke", n.ErrorDatabaseQuery = "Database Query Error", n.ErrorTrackedPokeTimeout = "Error Tracked Poke Timeout", n.ErrorThread = "Thread Error", n.ErrorSubscribeOnceTimeout = "Error Subscribe Once Timeout", n.ErrorNativeDb = "Native DB Error", n.InitDataFetched = "Init Data Fetched", n.InitDataWritten = "Init Data Written", n.LatestPostsFetched = "Latest Posts Fetched", n.LatestPostsWritten = "Latest Posts Written", n.SubscriptionsEstablished = "Subscriptions Established", n.AuthFailedToGetCode = "Failed to get access code", n.AuthForcedLogout = "Auth Forced Logout", n.NodeConnectionDebug = "Node Connection Debug", n.NodeConnectionError = "Node Connection Error", n.SyncDiscontinuity = "Sync Discontinuity", n.OnNetworkInvite = "Sent On Network Group Invite", n.UserLoggedIn = "User Logged In", n.NodeAuthSaved = "Node Auth Saved", n.ErrorNodeResumePush = "Node Resume Push Error", n.AnalyticsDigest = "Usage Digest Report", n.WebAppOpened = "Web App Opened", n.WebConsoleError = "Web Console Error", n.WayfindingDebug = "Wayfinding Debug", n.AttachmentUploadSuccess = "Attachment Upload Success", n.ActionContactAdded = "Contact Added", n.ActionContactRemoved = "Contact Removed", n.ActionRemoveContactSuggestion = "Removed Contact Suggestion", n.ActionContactEdited = "Contact Edited", n.ActionUpdatedProfile = "Updated Profile", n.ActionSendPost = "Sent Post", n.ActionForwardPost = "Forwarded Post", n.ActionForwardGroup = "Forwarded Group", n.ActionStartedDM = "Started DM", n.ActionSendPostRetry = "Retried Post Send", n.ActionHidePost = "Hid Post", n.ActionSendReply = "Sent Thread Reply", n.ActionDeletePost = "Deleted Post", n.ActionReact = "Reacted to Post", n.ActionUnreact = "Removed Reaction from Post ", n.ActionRespondToDMInvite = "Responded to DM Invite", n.ActionBlockUser = "Blocked User", n.ActionUnblockUser = "Unblocked User", n.ActionCustomizeDM = "Customized DM", n.ActionJoinGroup = "Joined Group", n.ActionCancelGroupJoin = "Cancelled Group Join", n.ActionCustomizedGroup = "Customized Group", n.ActionDeleteGroup = "Deleted Group", n.ActionKickUser = "Kicked User", n.ActionBanUser = "Banned User", n.ActionUnbanUser = "Unbanned User", n.ActionCreateGroup = "Created Group", n.ActionAcceptJoinRequest = "Accepted Request to Join Group", n.ActionRejectJoinRequest = "Rejected Request to Join Group", n.ActionAcceptGroupInvite = "Accepted Group Invite", n.ActionRejectGroupInvite = "Rejected Group Invite", n.ActionUpdatedGroupPrivacy = "Updated Group Privacy", n.ActionLeaveGroup = "Left Group", n.ActionAddedRole = "Added Group Role", n.ActionRemovedRole = "Removed Group Role", n.ActionUpdatedRole = "Updated Group Role", n.ActionAddMemberRole = "Added Members to Group Role", n.ActionRemoveMemberRole = "Removed Members from Group Role", n.ActionVisitedGroup = "Viewed Group", n.ActionRequestGroupInvite = "Requested Group Invite", n.ActionCreateChannel = "Created Channel", n.ActionDeleteChannel = "Deleted Channel", n.ActionUpdatedChannel = "Updated Channel", n.ActionPinChat = "Pinned Chat", n.ActionUnpinChat = "Unpinned Chat", n.ActionVisitedChannel = "Viewed Channel", n.ActionTappedChat = "Tapped Chatlist Item", n.ActionJoinChannel = "Joined Channel", n.ActionMoveChannel = "Moved Channel", n.ActionUpdateChannelWriters = "Updated Channel Writers", n.ActionAddedNavSection = "Added Navigation Section", n.ActionUpdatedNavSection = "Updated Navigation Section", n.ActionDeletedNavSection = "Deleted Navigation Section", n.ActionUpdatedGroupNavigation = "Updated Group Navigation", n.ActionViewProfileGroup = "Viewed Pinned Profile Group", n.ActionSelectActivityEvent = "Tapped Activity Event", n.ActionsNotifPermsChecked = "Checked Notification Permissions", n.ActionNotifPermsSettingsOpened = "Opened Notification Settings from Nag", n.ActionNotifPermsGrantedFromNag = "Granted Notification Permission from Nag", n.ActionInitiateTwitterAttest = "Initiated Twitter Attestation", n.ActionConfirmTwitterAttest = "Confirmed Twitter Attestation", n.ActionInitiatePhoneAttest = "Initiated Phone Attestation", n.ActionCheckAttestSig = "Checked Attestation Signature", n.ActionRevokeAttestation = "Revoked Attestation", n.ActionUpdateAttestDiscoverability = "Updated Attestation Discoverability", n.ActionConfirmPhoneAttest = "Confirmed Phone Attestation", n.ActionGroupChannelSelected = "Tapped group channel", n.ActionTappedPushNotif = "Tapped Push Notification", n.ActionDeferredDeepLink = "Installed with Deferred Deeplink Invite", n.ActionContactBookSkipped = "Skipped Syncing Contact Book", n.ActionContactBookPermRequested = "Contact Book Requesting Permission", n.ActionContactBookPermGranted = "Contact Book Permission Granted", n.ActionContactBookPermDenied = "Contact Book Permission Denied", n.ActionContactBookInviteShown = "Contact Book Invite Shown", n.ActionContactBookInviteSent = "Contact Book Invite Sent", n.FetchLinkMetadata = "Fetched Link Metadata", n.ActionCalmSettingsUpdate = "Calm Settings Updated", n.ActionThemeUpdate = "Theme Setting Updated", n.DebugSystemContacts = "System Contacts Debug", n.GroupJoinComplete = "Group Join Complete", n.PersonalInviteLinkReady = "Personal Invite Link Ready", n.ErrorSendPost = "Error Sending Post", n.ErrorSendReply = "Error Sending Thread Reply", n.ErrorReact = "Error Reacting to Post", n.ErrorUnreact = "Error Removing Reaction from Post", n.ErrorPushNotifNavigate = "Error Navigating to Push Channel", n.ErrorDigestFailed = "Error Preparing Usage Digest", n.ErrorSyncStartHighPriority = "Error Start Sync: High Priority", n.ErrorSyncStartLowPriority = "Error Start Sync: Low Priority", n.ErrorVerifyingPersonalInvite = "Error Verifying DM Invite Link", n.ErrorAttestation = "Attestation Error", n.ErrorNounParse = "Error Parsing Noun", n.ErrorNotificationService = "Notification Service Error", n.ErrorCreateGroup = "Error Creating Group", n.ErrorWayfinding = "Wayfinding Error", n.ErrorSystemContacts = "System Contacts Error", n.ErrorCalmSettingsUpdate = "Error Updating Calm Settings", n.ErrorThemeUpdate = "Error Updating Theme Setting", n.ErrorApi = "API Error", n.ErrorFetchLinkMetadata = "Error Fetching Link Metadata", n))(pe || {});
var Ss = /* @__PURE__ */ ((n) => (n.Critical = "Critical", n.High = "High", n.Medium = "Medium", n.Low = "Low", n))(Ss || {});
var yc;
((n) => {
  function r(i) {
    switch (i.uploadState.status) {
      case "success":
        return i.uploadState.remoteUri;
      case "uploading":
        return i.uploadState.localUri;
    }
  }
  n.uri = r;
})(yc || (yc = {}));
var wc;
((n) => {
  function r(i) {
    return by(i.uploadState);
  }
  n.uri = r;
})(wc || (wc = {}));
var Es;
((n) => {
  ((f) => {
    function y(F) {
      return {
        type: "image",
        asset: F
      };
    }
    f.fromImagePickerAsset = y;
    function h(F) {
      return { type: "file", file: F };
    }
    f.fromFile = h;
    function I(F) {
      switch (F.type) {
        case "image":
          return F.asset.uri;
        case "file":
          return URL.createObjectURL(F.file);
        case "fileUri":
          return F.localUri;
      }
    }
    f.createLocalUri = I;
    function C(F) {
      return F.filter((H) => H.type === "image").map((H) => H.asset);
    }
    f.extractImagePickerAssets = C;
    const k = bs.memoize((F) => bs.uniqueId("File"));
    function R(F) {
      return (() => {
        switch (F.type) {
          case "image":
            return F.asset.uri;
          case "file":
            return k(F.file);
          case "fileUri":
            return F.localUri;
        }
      })();
    }
    f.extractKey = R;
    function G(F, H) {
      if (F.type !== H.type)
        return false;
      switch (F.type) {
        case "image":
          return F.asset.uri === H.asset.uri;
        case "file":
          return F.file === H.file;
        case "fileUri":
          return F.localUri === H.localUri;
      }
    }
    f.equivalent = G;
    function D(F, H) {
      if (H.status === "error")
        return null;
      switch (F.type) {
        case "image":
          return {
            type: "image",
            file: F.asset,
            uploadState: H
          };
        case "file":
          return {
            type: "file",
            localFile: F.file,
            size: F.file.size,
            mimeType: F.file.type,
            name: F.file.name,
            uploadState: H
          };
        case "fileUri":
          return {
            type: "file",
            localFile: F.localUri,
            name: F.name,
            size: F.size,
            mimeType: F.type,
            uploadState: H
          };
      }
    }
    f.toFinalizedAttachment = D;
    function Y(F) {
      switch (F.type) {
        case "image":
          return {
            type: "image",
            file: F.asset,
            uploadState: {
              status: "uploading",
              localUri: F.asset.uri
            }
          };
        case "file":
          return {
            type: "file",
            localFile: F.file,
            size: F.file.size,
            mimeType: F.file.type,
            name: F.file.name,
            uploadState: {
              status: "uploading",
              localUri: I(F)
            }
          };
        case "fileUri":
          return {
            type: "file",
            localFile: F.localUri,
            size: F.size,
            mimeType: F.mimeType,
            name: F.name,
            uploadState: {
              status: "uploading",
              localUri: F.localUri
            }
          };
      }
    }
    f.toLocalFinalizedAttachment = Y;
  })(n.UploadIntent || (n.UploadIntent = {}));
  function r(f) {
    switch (f.type) {
      case "image":
        return {
          needsUpload: true,
          type: "image",
          asset: f.file
        };
      case "file":
        return f.localFile instanceof File ? {
          needsUpload: true,
          type: "file",
          file: f.localFile
        } : {
          needsUpload: true,
          type: "fileUri",
          localUri: f.localFile,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType
        };
      case "text":
      case "link":
      case "reference":
        return { needsUpload: false, finalized: f };
    }
  }
  n.toUploadIntent = r;
  function i(f) {
    switch (f.type) {
      case "image":
        return { type: "image", file: f.asset };
      case "file":
        return {
          type: "file",
          localFile: f.file,
          size: f.file.size,
          mimeType: f.file.type
        };
      case "fileUri":
        return {
          type: "file",
          localFile: f.localUri,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType
        };
    }
  }
  n.fromUploadIntent = i;
  function s(f, y) {
    const h = r(f);
    if (h.needsUpload) {
      if (y == null || y.status !== "success")
        return null;
      switch (h.type) {
        case "image":
          return {
            type: "image",
            file: h.asset,
            uploadState: y
          };
        case "file":
          return {
            type: "file",
            localFile: h.file,
            size: h.file.size,
            name: h.file.name,
            mimeType: h.file.type,
            uploadState: y
          };
        case "fileUri":
          return {
            type: "file",
            localFile: h.localUri,
            size: h.size,
            name: h.name,
            mimeType: h.mimeType,
            uploadState: y
          };
      }
    } else
      return h.finalized;
  }
  n.toSuccessfulFinalizedAttachment = s;
  function l(f) {
    return f.type === "file" && f.localFile instanceof File && typeof URL.createObjectURL == "function" ? {
      ...f,
      localFile: URL.createObjectURL(f.localFile),
      name: f.localFile.name,
      size: f.localFile.size,
      mimeType: f.localFile.type
    } : f;
  }
  n.makeSerializable = l;
})(Es || (Es = {}));
function by(n) {
  switch (n.status) {
    case "success":
      return n.remoteUri;
    case "uploading":
      return n.localUri;
  }
}
var Cy = [
  {
    id: "book-club",
    title: "Book Club",
    subtitle: "Discuss your latest reads",
    description: "A group for discussing books and literature",
    icon: "\u{1F4DA}",
    channels: [
      {
        type: "chat",
        title: "Book chat",
        description: "Discuss books and literature"
      },
      {
        type: "gallery",
        title: "Now reading",
        description: "Share what you're currently reading"
      },
      {
        type: "notebook",
        title: "Reviews",
        description: "Write and share book reviews"
      }
    ]
  },
  {
    id: "cooking-club",
    title: "Cooking Club",
    subtitle: "Share recipes and cooking tips",
    description: "A group for food lovers and home cooks",
    icon: "\u{1F373}",
    channels: [
      {
        type: "chat",
        title: "Food talk",
        description: "Chat about cooking and food"
      },
      {
        type: "gallery",
        title: "Meal pics",
        description: "Share photos of your culinary creations"
      },
      {
        type: "notebook",
        title: "Recipes",
        description: "Collect and share your favorite recipes"
      }
    ]
  },
  {
    id: "music",
    title: "Music",
    subtitle: "Share and discover new tunes",
    description: "A group for music lovers and audiophiles",
    icon: "\u{1F3B5}",
    channels: [
      {
        type: "chat",
        title: "Tune talk",
        description: "Discuss music and artists"
      },
      {
        type: "gallery",
        title: "Now listening",
        description: "Share what you're listening to"
      },
      {
        type: "notebook",
        title: "Playlists",
        description: "Curate and share playlists"
      }
    ]
  },
  {
    id: "running-club",
    title: "Running Club",
    subtitle: "Track your runs and stay motivated",
    description: "A group for runners of all levels",
    icon: "\u{1F3C3}",
    channels: [
      {
        type: "chat",
        title: "Run chat",
        description: "Chat about running and training"
      },
      {
        type: "gallery",
        title: "Run pics",
        description: "Share photos from your runs"
      },
      {
        type: "notebook",
        title: "Goals",
        description: "Track your running goals and progress"
      }
    ]
  },
  {
    id: "cinema-club",
    title: "Cinema Club",
    subtitle: "Discuss and review films",
    description: "A group for movie enthusiasts and film buffs",
    icon: "\u{1F3AC}",
    channels: [
      {
        type: "chat",
        title: "Film chat",
        description: "Discuss movies and cinema"
      },
      {
        type: "gallery",
        title: "Now watching",
        description: "Share what you're currently watching"
      },
      {
        type: "notebook",
        title: "Reviews",
        description: "Write and share film reviews"
      }
    ]
  },
  {
    id: "garden-club",
    title: "Garden Club",
    subtitle: "Grow together",
    description: "A group for gardeners and plant enthusiasts",
    icon: "\u{1F331}",
    channels: [
      {
        type: "chat",
        title: "Garden talk",
        description: "Chat about gardening and plants"
      },
      {
        type: "gallery",
        title: "Plant pics",
        description: "Share photos of your garden and plants"
      },
      {
        type: "notebook",
        title: "Tips, plans and schedules",
        description: "Share gardening tips and track your plans"
      }
    ]
  }
];
var Sy = {
  id: "basic-group",
  title: "Basic Group",
  subtitle: "A basic group with essential channels",
  description: "A basic group with essential channels",
  icon: "\u2728",
  channels: [
    {
      type: "chat",
      title: "Chat",
      description: "General chat"
    },
    {
      type: "gallery",
      title: "Gallery",
      description: "Share images"
    },
    {
      type: "notebook",
      title: "Notebook",
      description: "Share notes"
    }
  ]
};
var Ey = [...Cy, Sy];
Ey.reduce(
  (n, r) => (n[r.id] = r, n),
  {}
);
var _c;
((n) => {
  function r(l) {
    return {
      ...l,
      attachments: l.attachments.map(Es.makeSerializable)
    };
  }
  n.serialize = r;
  function i(l) {
    if (typeof l != "object" || l === null)
      return false;
    const f = l;
    return !(!(typeof f.channelId == "string" && Array.isArray(f.content) && Array.isArray(f.attachments) && typeof f.channelType == "string") || f.replyToPostId !== null && typeof f.replyToPostId != "string");
  }
  n.isValid = i;
  function s(l) {
    for (const f of l.attachments)
      if (f.type === "file" && typeof f.localFile == "string" && f.localFile.startsWith("blob:"))
        try {
          URL.revokeObjectURL(f.localFile);
        } catch {
        }
  }
  n.revokeBlobUrls = s;
})(_c || (_c = {}));
var xy = {
  slug: "tm-wayfinding-group"
};
function Bs(...n) {
  return "/" + n.filter((r) => !!r).join("/");
}
function Ic(n) {
  return n[0] === "#";
}
var bc = 2048;
function Pr(n) {
  const r = n.image.length > bc ? "" : n.image, i = r ? Ic(r) ? { iconImageColor: r } : { iconImage: r } : {}, s = n.cover.length > bc ? "" : n.cover, l = s ? Ic(s) ? { coverImageColor: s } : { coverImage: s } : {};
  return {
    title: n.title,
    iconImage: i.iconImage ?? null,
    iconImageColor: i.iconImageColor ?? null,
    coverImage: l.coverImage ?? null,
    coverImageColor: l.coverImageColor ?? null,
    description: n.description
  };
}
function Fn(n) {
  return (0, import_aura.render)("ud", BigInt(n));
}
function Or(n) {
  return import_aura.da.toUnix(ky(n));
}
function ky(n) {
  return (0, import_aura.tryParse)("ud", n) || BigInt(n);
}
function Ty(n) {
  return (0, import_aura.render)("ud", import_aura.da.fromUnix(n.getTime()));
}
function Tt(n) {
  return n.startsWith("~");
}
function on(n) {
  return n.startsWith("0v");
}
function Ln(n) {
  return n.startsWith("chat") || n.startsWith("diary") || n.startsWith("heap");
}
function $c(n) {
  const r = n.split("/");
  return {
    kind: r[0],
    host: r[1],
    name: r[2]
  };
}
function Wi(n) {
  const r = n.split("/");
  return {
    host: r[0],
    name: r[1]
  };
}
function Ns(n) {
  if (Tt(n))
    return "dm";
  if (on(n))
    return "club";
  if (Ln(n))
    return "channel";
  throw new Error("invalid channel id");
}
async function Ry(n, r) {
  try {
    return await n;
  } catch (i) {
    if (i instanceof Fr && i.status === 404)
      return r;
    throw i;
  }
}
function ae(n) {
  let r = n;
  return r[0] === "~" && (r = r.split("/").pop()), r[3] !== "." && (r = (0, import_aura.render)("ud", BigInt(r))), r;
}
function Gc({
  content: n,
  authorId: r,
  sentAt: i,
  channelType: s,
  blob: l,
  metadata: f
}) {
  return {
    content: n,
    sent: i,
    kind: s === "notebook" ? "/diary" : s === "gallery" ? "/heap" : "/chat",
    author: r,
    blob: l || null,
    meta: f || null
  };
}
var xs;
((n) => {
  function r(i, s) {
    return s === "link" ? Ly(i) : s in i;
  }
  n.is = r;
})(xs || (xs = {}));
function Wc(n) {
  return typeof n == "object" && n !== null && "bold" in n;
}
function Hc(n) {
  return typeof n == "object" && n !== null && "italics" in n;
}
function zc(n) {
  return typeof n == "object" && n !== null && "link" in n && "href" in n.link;
}
function qc(n) {
  return typeof n == "object" && n !== null && "strike" in n;
}
function jc(n) {
  return typeof n == "object" && n !== null && "blockquote" in n;
}
function Kc(n) {
  return typeof n == "object" && n !== null && "inline-code" in n;
}
function Jc(n) {
  return typeof n == "object" && n !== null && "code" in n && typeof n.code == "string";
}
function Os(n) {
  return typeof n == "object" && n !== null && "break" in n;
}
function Vc(n) {
  return typeof n == "object" && n !== null && "ship" in n;
}
function Yc(n) {
  return typeof n == "object" && n !== null && "sect" in n;
}
function Oy(n) {
  return "list" in n;
}
function Zc(n) {
  return typeof n == "object" && n !== null && "task" in n;
}
function Xc(n) {
  return typeof n == "object" && n !== null && "image" in n;
}
function Ly(n) {
  return typeof n == "object" && n !== null && "link" in n && "url" in n.link;
}
function Qc(n) {
  return "block" in n;
}
var Cc = ft("urbitUtils", false);
var $y = ["chat", "heap", "diary"];
function el(n) {
  const r = n.split("/");
  return r.length !== 3 ? (Cc.error("Invalid nest:", n), false) : $y.includes(r[0]) ? true : (Cc.log(
    `Custom channel type detected (${r[0]}), pretending its chat.`,
    n
  ), false);
}
function Gy(n) {
  el(n);
  const [r, ...i] = n.split("/");
  return [r, i.join("/")];
}
function Wy(n) {
  return n ? n.trim().startsWith("~") ? n.trim() : "~".concat(n.trim()) : "";
}
function Sc(n) {
  return n ? n.trim().replace("~", "") : "";
}
function Hy(n) {
  return (0, import_aura.render)("t", Atom.fromCord(n).number);
}
function zy(n) {
  return n.split("/").length === 3;
}
function Hi(n) {
  if (!zy(n)) {
    if (nl(n))
      return "dm";
    if (Jy(n))
      return "groupDm";
  }
  const [r] = Gy(n);
  return r === "chat" ? "chat" : r === "heap" ? "gallery" : r === "diary" ? "notebook" : "chat";
}
function nl(n) {
  return n.startsWith("~") && !n.match("/");
}
function Jy(n) {
  return n.startsWith("0v");
}
var Ec;
((n) => {
  function r(i, s) {
    return s in i;
  }
  n.is = r;
})(Ec || (Ec = {}));
function Zy(n) {
  throw new Error(`Unexpected case: ${n}`);
}
async function Xy(n) {
  return await new Promise((r, i) => {
    const s = new FileReader();
    s.onload = () => r(s.result), s.onerror = i, s.readAsArrayBuffer(n);
  });
}
function ys(n) {
  const r = new AbortController(), i = r.signal, s = setTimeout(() => {
    r.abort();
  }, n);
  return i.addEventListener(
    "abort",
    () => {
      clearTimeout(s);
    },
    { once: true }
  ), i.cleanup = () => {
    clearTimeout(s);
  }, i;
}
var Qy = class {
  constructor() {
    Ee(this, "listeners", {});
  }
  on(r, i) {
    return r in this.listeners || (this.listeners[r] = []), this.listeners[r].push(i), this;
  }
  off(r, i) {
    if (!(r in this.listeners))
      return;
    const s = this.listeners[r].findIndex((l) => l === i);
    return s !== -1 && this.listeners[r].splice(s, 1), this;
  }
  emit(r, ...i) {
    if (r in this.listeners)
      for (let s = 0; s < this.listeners[r].length; s++)
        this.listeners[r][s].apply(this, i);
  }
};
var ew = class extends Error {
};
var ol = class extends Error {
};
var Dn = class extends Error {
};
var tw = class extends Error {
};
var As = class extends Error {
  constructor(i, s, l) {
    super(i);
    Ee(this, "status");
    Ee(this, "text");
    this.status = s, this.text = l;
  }
};
async function nw(n, r, i) {
  const s = n.getReader();
  let l = {
    done: false,
    value: new Uint8Array()
  };
  for (; l && !l.done; ) {
    if (l = await Promise.race([
      s.read(),
      new Promise((f, y) => {
        setTimeout(
          () => y(new Error("getBytes timed out")),
          i
        );
      })
    ]), !l.value) {
      console.warn("Empty chunk received from server");
      continue;
    }
    try {
      r(l.value);
    } catch (f) {
      console.error("Error processing chunk:", f);
    }
  }
}
function rw(n) {
  let r, i, s, l = false;
  return function(y) {
    r === void 0 ? (r = y, i = 0, s = -1) : r = ow(r, y);
    const h = r.length;
    let I = 0;
    for (; i < h; ) {
      l && (r[i] === 10 && (I = ++i), l = false);
      let C = -1;
      for (; i < h && C === -1; ++i)
        switch (r[i]) {
          case 58:
            s === -1 && (s = i - I);
            break;
          case 13:
            l = true;
          case 10:
            C = i;
            break;
        }
      if (C === -1)
        break;
      n(r.subarray(I, C), s), I = i, s = -1;
    }
    I === h ? r = void 0 : I !== 0 && (r = r.subarray(I), i -= I);
  };
}
function iw(n, r, i) {
  let s = ws();
  const l = new TextDecoder();
  return function(y, h) {
    if (y.length === 0)
      n == null || n(s), s = ws();
    else if (h > 0) {
      const I = l.decode(y.subarray(0, h)), C = h + (y[h + 1] === 32 ? 2 : 1), k = l.decode(y.subarray(C));
      switch (I) {
        case "data":
          s.data = s.data ? s.data + `
` + k : k;
          break;
        case "event":
          s.event = k;
          break;
        case "id":
          s = ws(), r == null || r(s.id = k);
          break;
        case "retry":
          const R = parseInt(k, 10);
          isNaN(R) || i == null || i(s.retry = R);
          break;
      }
    }
  };
}
function ow(n, r) {
  const i = new Uint8Array(n.length + r.length);
  return i.set(n), i.set(r, n.length), i;
}
function ws() {
  return {
    data: "",
    event: "",
    id: "",
    retry: void 0
  };
}
var ks = "text/event-stream";
var sw = 1e3;
var xc = "last-event-id";
function Ac(n, {
  signal: r,
  headers: i,
  onopen: s,
  onmessage: l,
  onclose: f,
  onerror: y,
  openWhenHidden: h,
  fetch: I,
  responseTimeout: C,
  ...k
}) {
  return new Promise((R, G) => {
    const D = { ...i };
    D.accept || (D.accept = ks);
    let Y, F = sw, H;
    function ue() {
      clearTimeout(H), Y.abort();
    }
    r == null || r.addEventListener("abort", () => {
      ue(), R();
    });
    const Ue = I ?? fetch, Z = s ?? aw;
    let oe = false;
    async function ce() {
      Y = new AbortController();
      try {
        const xe = await Promise.race([
          Ue(n, {
            ...k,
            headers: D,
            signal: Y.signal
          }),
          new Promise((ge, Ct) => {
            setTimeout(
              () => Ct(new tw("Request timed out")),
              C
            );
          })
        ]);
        if (xe.status === 404) {
          ue(), y == null || y(new ol("Channel reaped")), R();
          return;
        } else if (xe.status === 500) {
          ue(), y == null || y(new As("Server error", 500)), R();
          return;
        }
        if (xe.status < 200 || xe.status >= 300)
          throw new As(
            "Invalid server response",
            xe.status
          );
        await Z(xe, oe), oe && (oe = false), await nw(
          xe.body,
          rw(
            iw(
              l,
              (ge) => {
                ge ? D[xc] = ge : delete D[xc];
              },
              (ge) => {
                F = ge;
              }
            )
          ),
          C
        ), f == null || f(), ue(), R();
      } catch (xe) {
        if (!Y.signal.aborted)
          try {
            oe = true, Y.abort();
            const ge = (y == null ? void 0 : y(xe)) ?? F;
            clearTimeout(H), H = setTimeout(ce, ge);
          } catch (ge) {
            ue(), G(ge);
          }
      }
    }
    ce();
  });
}
function aw(n) {
  const r = n.headers.get("content-type");
  if (!(r != null && r.startsWith(ks)))
    throw new Error(
      `Expected content-type to be ${ks}, Actual: ${r}`
    );
}
async function uw(n) {
  const r = [...new Uint8Array(n)].reverse().map((i) => i.toString(16).padStart(2, "0")).join("");
  return cue(Atom.fromString(r, 16));
}
function Ni(n) {
  const i = Math.pow(16, Math.min(n, 8) - 1), s = Math.pow(16, Math.min(n, 8)) - 1;
  let f = (Math.floor(Math.random() * (s - i + 1)) + i).toString(16);
  for (; f.length < n; )
    f = f + Ni(n - 8);
  return f;
}
var vs = ft("UrbitHttpApi", false);
function cw(n) {
  return n instanceof Atom || n instanceof Cell;
}
var Di = class _Di {
  /**
   * Constructs a new Urbit connection.
   *
   * @param url  The URL (with protocol and port) of the ship to be accessed. If
   * the airlock is running in a webpage served by the ship, this should just
   * be the empty string.
   * @param code The access code for the ship at that address
   */
  constructor(r, i, s, l) {
    Ee(this, "emitter", new Qy());
    Ee(this, "uid", `${Math.floor(Date.now() / 1e3)}-${Ni(6)}`);
    Ee(this, "lastEventId", 0);
    Ee(this, "lastHeardEventId", -1);
    Ee(this, "lastAcknowledgedEventId", -1);
    Ee(this, "sseClientInitialized", false);
    Ee(this, "cookie");
    Ee(this, "outstandingPokes", /* @__PURE__ */ new Map());
    Ee(this, "outstandingSubscriptions", /* @__PURE__ */ new Map());
    Ee(this, "channelAbort", new AbortController());
    Ee(this, "nodeId");
    Ee(this, "our");
    Ee(this, "verbose");
    Ee(this, "errorCount", 0);
    Ee(this, "fetchFn", (r2, i2) => fetch(r2, i2));
    return this.url = r, this.code = i, this.desk = s, isBrowser && window.addEventListener("beforeunload", this.delete), l && (this.fetchFn = l), this;
  }
  /** This is basic interpolation to get the channel URL of an instantiated Urbit connection. */
  get channelUrl() {
    return `${this.url}/~/channel/${this.uid}`;
  }
  get fetchOptions() {
    const r = {
      "Content-Type": "application/json"
    };
    return !isBrowser && this.cookie && (r.Cookie = this.cookie), {
      credentials: isBrowser ? "include" : void 0,
      accept: "*",
      headers: r
    };
  }
  fetchOptionsNoun(r = "PUT", i = "noun") {
    let s;
    switch (i) {
      case "noun":
        s = "application/x-urb-jam";
        break;
      case "json":
        s = "application/json";
        break;
    }
    const l = {};
    switch (r) {
      case "PUT":
        l["Content-Type"] = s, l.Accept = s;
        break;
      case "GET":
        l["X-Channel-Format"] = s;
        break;
    }
    return isBrowser || (l.Cookie = this.cookie), {
      credentials: "include",
      accept: "*",
      headers: l
    };
  }
  /**
   * All-in-one hook-me-up.
   *
   * Given a ship, url, and code, this returns an airlock connection
   * that is ready to go. It `|hi`s itself to create the channel,
   * then opens the channel via EventSource.
   *
   */
  //TODO  rename this to connect() and only do constructor & event source setup.
  //      that way it can be used with the assumption that you're already
  //      authenticated.
  static async authenticate({
    ship: r,
    url: i,
    code: s,
    verbose: l = false
  }) {
    const f = new _Di(
      i.startsWith("http") ? i : `http://${i}`,
      s
    );
    return f.verbose = l, f.nodeId = r, await f.connect(), await f.poke({
      app: "hood",
      mark: "helm-hi",
      json: "opening airlock"
    }), await f.eventSource(), f;
  }
  emit(r, ...i) {
    this.emitter.emit(r, ...i);
  }
  on(r, i) {
    this.emitter.on(r, i), this.verbose && console.log(r, "listening active"), r === "init" && this.emitter.emit("init", {
      uid: this.uid,
      subscriptions: [...this.outstandingSubscriptions.entries()].map(
        ([s, l]) => ({ id: s, app: l.app, path: l.path })
      )
    });
  }
  /**
   * Gets the name of the ship accessible at this.url and stores it to this.ship
   *
   */
  async getShipName() {
    if (this.nodeId)
      return Promise.resolve();
    const i = await (await this.fetchFn(`${this.url}/~/host`, {
      method: "get",
      credentials: "include"
    })).text();
    this.nodeId = i;
  }
  /**
   * Gets the name of the ship accessible at this.url and stores it to this.ship
   *
   */
  async getOurName() {
    const r = {};
    !isBrowser && this.cookie && (r.Cookie = this.cookie);
    const s = await (await this.fetchFn(`${this.url}/~/name`, {
      method: "get",
      credentials: "include",
      headers: r
    })).text();
    this.our = s;
  }
  /**
   * Connects to the Urbit ship. Nothing can be done until this is called.
   * That's why we roll it into this.authenticate
   * TODO  as of urbit/urbit#6561, this is no longer true, and we are able
   *       to interact with the ship using a guest identity.
   */
  //TODO  rename to authenticate() and call connect() at the end
  async connect() {
    return this.verbose && console.log(
      `password=${this.code} `,
      isBrowser ? `Connecting in browser context at ${this.url}/~/login` : "Connecting from node context"
    ), this.fetchFn(`${this.url}/~/login`, {
      method: "post",
      body: `password=${this.code}`,
      credentials: "include"
    }).then(async (r) => {
      var s;
      if (this.verbose && console.log("Received authentication response", r), r.status < 200 || r.status >= 300)
        throw new Error("Login failed with status " + r.status);
      const i = r.headers.get("set-cookie");
      if (!this.nodeId && i) {
        const l = (s = new RegExp(/urbauth-(~[\w-]+)/).exec(i)) == null ? void 0 : s[1];
        this.nodeId = l;
      }
      isBrowser || (this.cookie = i || void 0), this.getShipName(), this.getOurName();
    });
  }
  /**
   * Initializes the SSE pipe for the appropriate channel.
   */
  async eventSource() {
    if (this.sseClientInitialized)
      return Promise.resolve();
    if (this.lastEventId === 0) {
      this.emit("status-update", { status: "opening" }), await this.poke({
        app: "hood",
        mark: "helm-hi",
        json: "Opening API channel"
      });
      return;
    }
    return this.sseClientInitialized = true, new Promise((r, i) => {
      Ac(this.channelUrl, {
        ...this.fetchOptions,
        signal: this.channelAbort.signal,
        reactNative: { textStreaming: true },
        openWhenHidden: true,
        responseTimeout: 25e3,
        fetch: this.fetchFn,
        onopen: async (s, l) => {
          if (this.verbose && console.log("Opened eventsource", s), s.ok) {
            this.errorCount = 0, this.emit("status-update", {
              status: l ? "reconnected" : "active"
            }), r();
            return;
          } else {
            const f = new Error("failed to open eventsource");
            i(f);
          }
        },
        onmessage: (s) => {
          var f, y, h, I, C;
          if (this.verbose && console.log("Received SSE: ", s), !s.id) return;
          const l = parseInt(s.id, 10);
          if (this.emit("fact", {
            id: l,
            data: s.data,
            time: Date.now()
          }), l <= this.lastHeardEventId) {
            this.verbose && console.log("dropping old or out-of-order event", {
              eventId: l,
              lastHeard: this.lastHeardEventId
            });
            return;
          }
          if (this.lastHeardEventId = l, this.emit("id-update", { lastHeard: this.lastHeardEventId }), l - this.lastAcknowledgedEventId > 20 && this.ack(l), s.data && JSON.parse(s.data)) {
            const k = JSON.parse(s.data);
            if (this.verbose && console.log("received data", k), k.response === "poke" && this.outstandingPokes.has(k.id)) {
              const R = this.outstandingPokes.get(k.id);
              "ok" in k && R ? (f = R.onSuccess) == null || f.call(R) : "err" in k && R ? (console.error(k.err), (y = R.onError) == null || y.call(R, k.err)) : console.error("Invalid poke response", k), this.outstandingPokes.delete(k.id);
            } else if (k.response === "subscribe" && this.outstandingSubscriptions.has(k.id)) {
              const R = this.outstandingSubscriptions.get(k.id);
              "err" in k && R && (console.error(k.err), (h = R.err) == null || h.call(R, k.err, k.id), this.outstandingSubscriptions.delete(k.id));
            } else if (k.response === "diff" && this.outstandingSubscriptions.has(k.id)) {
              const R = this.outstandingSubscriptions.get(k.id);
              try {
                (I = R == null ? void 0 : R.event) == null || I.call(R, k.json, k.mark ?? "json", k.id);
              } catch (G) {
                console.error("Failed to call subscription event callback", G);
              }
            } else if (k.response === "quit" && this.outstandingSubscriptions.has(k.id)) {
              const R = this.outstandingSubscriptions.get(k.id);
              (C = R == null ? void 0 : R.quit) == null || C.call(R, k), this.outstandingSubscriptions.delete(k.id), this.emit("subscription", {
                id: k.id,
                status: "close"
              }), R != null && R.resubOnQuit && this.subscribe(R);
            } else this.verbose && (console.log([...this.outstandingSubscriptions.keys()]), console.log("Unrecognized response", k));
          }
        },
        onerror: (s) => {
          if (this.errorCount++, this.emit("error", {
            time: Date.now(),
            msg: JSON.stringify(s),
            error: s
          }), s instanceof ol) {
            this.emit("channel-reaped", { time: Date.now() }), this.seamlessReset();
            return;
          }
          if (!(s instanceof ew)) {
            const l = {};
            if (s instanceof As) {
              if (s.status === 500) {
                this.seamlessReset();
                return;
              }
              l.message = s.message, l.requestStatus = s.status;
            }
            return l.message = s.message, this.emit("status-update", { status: "reconnecting", context: l }), Math.min(5e3, Math.pow(2, this.errorCount - 1) * 750);
          }
          throw this.emit("status-update", { status: "errored" }), s;
        },
        onclose: () => {
          throw console.log("e"), new Error("Ship unexpectedly closed the connection");
        }
      });
    });
  }
  /**
   * Reset airlock, abandoning current subscriptions and wiping state
   *
   */
  reset() {
    this.verbose && console.log("resetting"), this.delete(), this.uid = `${Math.floor(Date.now() / 1e3)}-${Ni(6)}`, this.emit("reset", { uid: this.uid }), this.lastEventId = 0, this.lastHeardEventId = -1, this.lastAcknowledgedEventId = -1, this.outstandingSubscriptions = /* @__PURE__ */ new Map(), this.outstandingPokes = /* @__PURE__ */ new Map(), this.sseClientInitialized = false;
  }
  seamlessReset() {
    this.uid = `${Math.floor(Date.now() / 1e3)}-${Ni(6)}`, this.emit("seamless-reset", { uid: this.uid }), this.emit("status-update", { status: "initial" }), this.sseClientInitialized = false, this.lastEventId = 0, this.lastHeardEventId = -1, this.lastAcknowledgedEventId = -1;
    const r = [...this.outstandingSubscriptions.entries()];
    this.outstandingSubscriptions = /* @__PURE__ */ new Map(), r.forEach(([i, s]) => {
      var l;
      (l = s.quit) == null || l.call(s, {
        id: i,
        response: "quit"
      }), this.emit("subscription", {
        id: i,
        status: "close"
      }), s.resubOnQuit && this.subscribe(s);
    }), this.outstandingPokes.forEach((i, s) => {
      var l;
      (l = i.onError) == null || l.call(i, "Channel was reaped");
    }), this.outstandingPokes = /* @__PURE__ */ new Map();
  }
  /**
   * Autoincrements the next event ID for the appropriate channel.
   */
  getEventId() {
    return this.lastEventId += 1, this.emit("id-update", { current: this.lastEventId }), this.lastEventId;
  }
  /**
   * Acknowledges an event.
   *
   * @param eventId The event to acknowledge.
   */
  async ack(r) {
    this.lastAcknowledgedEventId = r, this.emit("id-update", { lastAcknowledged: r });
    const i = {
      action: "ack",
      "event-id": r
    };
    return await this.sendJSONtoChannel(i), r;
  }
  //NOTE  every arg is interpreted (through nockjs.dwim) as a noun, which
  //      should result in a noun nesting inside of the xx $eyre-command type
  async sendNounsToChannel(...r) {
    const i = this.fetchOptionsNoun("PUT", "noun"), s = (0, import_aura.render)("uw", jam(dejs.list(r)).number);
    this.validatePokeBodySize(s);
    const l = await this.fetchFn(this.channelUrl, {
      ...i,
      signal: this.channelAbort.signal,
      method: "PUT",
      body: s
    });
    if (!l.ok)
      throw console.log(l.status, l.statusText, await l.text()), new Error("Failed to PUT channel command(s)");
    if (!this.sseClientInitialized) {
      if (this.verbose && console.log("initializing event source"), await Promise.all([this.getOurName(), this.getShipName()]), this.our !== this.nodeId)
        throw new Dn("invalid session");
      await this.eventSource();
    }
  }
  async sendJSONtoChannel(...r) {
    const i = JSON.stringify(r);
    if (this.validatePokeBodySize(i), !(await this.fetchFn(this.channelUrl, {
      ...this.fetchOptions,
      signal: this.channelAbort.signal,
      method: "PUT",
      body: i
    })).ok)
      throw new Error("Failed to PUT channel");
    if (!this.sseClientInitialized) {
      if (this.verbose && console.log("initializing event source"), await Promise.all([this.getOurName(), this.getShipName()]), this.our !== this.nodeId)
        throw console.log("our name does not match ship name"), console.log("our:", this.our), console.log("ship:", this.nodeId), console.log("messages:", r), new Dn("invalid session");
      await this.eventSource();
    }
  }
  /**
   * Validates the size of the poke body.
   * This prevents us from accidentally sending large payloads (eg base64 images)
   * @param body The body to validate.
   */
  validatePokeBodySize(r) {
    if (r.length / 1024 > 512)
      throw vs.trackError("Body too large to send to channel"), new Error("Body too large to send to channel");
  }
  /**
   * Creates a subscription, waits for a fact and then unsubscribes
   *
   * @param app Name of gall agent to subscribe to
   * @param path Path to subscribe to
   * @param timeout Optional timeout before ending subscription
   *
   * @returns The first fact on the subcription
   */
  async subscribeOnce(r, i, s, l) {
    return new Promise((f, y) => {
      let h = false;
      const k = {
        app: r,
        path: i,
        ship: s,
        resubOnQuit: false,
        event: (R, G, D) => {
          h || (f(R), this.unsubscribe(D));
        },
        err: y,
        quit: () => {
          h || y("quit");
        }
      };
      this.subscribe(k).then((R) => {
        l && setTimeout(() => {
          h || (h = true, y("timeout"), this.unsubscribe(R));
        }, l);
      });
    });
  }
  async pokeNoun(r) {
    var h;
    r.onSuccess = r.onSuccess || (() => {
    }), r.onError = r.onError || (() => {
    });
    const { app: i, mark: s, noun: l, ship: f } = {
      ship: ((h = this.nodeId) == null ? void 0 : h.replace("~", "")) || "",
      ...r
    };
    this.lastEventId === 0 && this.emit("status-update", { status: "opening" });
    const y = this.getEventId();
    if (this.outstandingPokes.set(y, r), cw(l)) {
      const I = new Atom((0, import_aura.parse)("p", `~${f}`)), C = ["poke", y, I, i, s, l];
      await this.sendNounsToChannel(C);
    } else
      throw new Error("pokeNoun requires a noun");
    return y;
  }
  /**
   * Pokes a ship with data.
   *
   * @param app The app to poke
   * @param mark The mark of the data being sent
   * @param json The data to send
   */
  async poke(r) {
    const { app: i, mark: s, json: l, ship: f, onSuccess: y, onError: h } = {
      onSuccess: () => {
      },
      onError: () => {
      },
      ship: Sc(this.nodeId ?? ""),
      ...r
    };
    this.lastEventId === 0 && this.emit("status-update", { status: "opening" });
    const I = {
      id: this.getEventId(),
      action: "poke",
      ship: f,
      app: i,
      mark: s,
      json: l
    };
    return new Promise((C, k) => {
      this.outstandingPokes.set(I.id, {
        onSuccess: () => {
          y(), C(I.id);
        },
        onError: (R) => {
          h(R), k(R);
        }
      }), this.sendJSONtoChannel(I).catch(k);
    });
  }
  /**
   * Subscribes to a path on an app on a ship.
   *
   *
   * @param app The app to subsribe to
   * @param path The path to which to subscribe
   * @param handlers Handlers to deal with various events of the subscription
   */
  async subscribe(r) {
    const { app: i, path: s, ship: l, resubOnQuit: f, err: y, event: h, quit: I } = {
      err: () => {
      },
      event: () => {
      },
      quit: () => {
      },
      resubOnQuit: true,
      ...r,
      ship: Sc(r.ship ?? this.nodeId ?? "")
    };
    this.lastEventId === 0 && this.emit("status-update", { status: "opening" });
    const C = {
      id: this.getEventId(),
      action: "subscribe",
      ship: l,
      app: i,
      path: s
    };
    return this.outstandingSubscriptions.set(C.id, {
      app: i,
      path: s,
      resubOnQuit: f,
      err: y,
      event: h,
      quit: I
    }), this.emit("subscription", {
      id: C.id,
      app: i,
      path: s,
      status: "open"
    }), await this.sendJSONtoChannel(C), C.id;
  }
  /**
   * Unsubscribes to a given subscription.
   *
   * @param subscription
   */
  async unsubscribe(r) {
    return this.sendJSONtoChannel({
      id: this.getEventId(),
      action: "unsubscribe",
      subscription: r
    }).then(() => {
      this.emit("subscription", {
        id: r,
        status: "close"
      }), this.outstandingSubscriptions.delete(r);
    });
  }
  /**
   * Deletes the connection to a channel.
   */
  async delete() {
    this.channelAbort.abort(), this.channelAbort = new AbortController();
    const r = JSON.stringify([
      {
        id: this.getEventId(),
        action: "delete"
      }
    ]);
    if (isBrowser)
      navigator.sendBeacon(this.channelUrl, r);
    else if (!(await this.fetchFn(this.channelUrl, {
      ...this.fetchOptions,
      signal: this.channelAbort.signal,
      method: "POST",
      body: r
    })).ok)
      throw new Error("Failed to DELETE channel in node context");
  }
  async checkIsNodeBusy() {
    try {
      const r = await this.fetchFn(`${this.url}/~_~/healthz`, {
        method: "GET"
      });
      return r.status === 204 ? "available" : r.status === 429 ? "busy" : (vs.trackEvent("Unexpected node busy response", {
        status: r.status
      }), "unknown");
    } catch (r) {
      return vs.trackEvent("Failed to check if node is busy", { error: r }), "unknown";
    }
  }
  /**
   * Scry into an gall agent at a path
   *
   * @typeParam T - Type of the scry result
   *
   * @remarks
   *
   * Equivalent to
   * ```hoon
   * .^(T %gx /(scot %p our)/[app]/(scot %da now)/[path]/json)
   * ```
   * The returned cage must have a conversion to JSON for the scry to succeed
   *
   * @param params The scry request
   * @returns The scry result
   */
  async scry(r) {
    const { result: i } = await this.scryWithInfo(r);
    return i;
  }
  async scryWithInfo(r) {
    const { app: i, path: s, timeout: l } = r, f = l ? ys(l) : void 0, y = await this.fetchFn(
      `${this.url}/~/scry/${i}${s}.json`,
      {
        ...this.fetchOptions,
        signal: f
      }
    );
    if (f == null || f.cleanup(), !y.ok)
      return Promise.reject(y);
    const h = await y.json(), I = y.headers.get("content-length");
    return {
      responseStatus: y.status,
      responseSizeInBytes: Number(I),
      result: h
    };
  }
  async scryNoun(r) {
    const { result: i } = await this.scryNounWithInfo(r);
    return i;
  }
  async scryNounWithInfo(r) {
    const { app: i, path: s } = r;
    try {
      const l = await this.fetchFn(
        `${this.url}/~/scry/${i}${s}.noun`,
        {
          ...this.fetchOptionsNoun("GET", "noun")
        }
      );
      if (!l.ok)
        return Promise.reject(l);
      const f = await l.blob(), y = await Xy(f);
      try {
        const h = await uw(y), I = l.headers.get("content-length");
        return {
          responseStatus: l.status,
          responseSizeInBytes: Number(I),
          result: h
        };
      } catch (h) {
        throw console.error("Unpack failed", h), h;
      }
    } catch (l) {
      throw console.error(l), l;
    }
  }
  /**
   * Run a thread
   *
   *
   * @param inputMark   The mark of the data being sent
   * @param outputMark  The mark of the data being returned
   * @param threadName  The thread to run
   * @param body        The data to send to the thread
   * @returns  The return value of the thread
   */
  async thread(r) {
    const {
      inputMark: i,
      outputMark: s,
      threadName: l,
      body: f,
      timeout: y,
      desk: h = this.desk
    } = r;
    if (!h)
      throw new Error("Must supply desk to run thread from");
    const I = y ? ys(y) : void 0, C = await this.fetchFn(
      `${this.url}/spider/${h}/${i}/${l}/${s}`,
      {
        ...this.fetchOptions,
        signal: I,
        method: "POST",
        body: JSON.stringify(f)
      }
    );
    return I == null || I.cleanup(), C;
  }
  async getSpinHints() {
    return new Promise((r, i) => {
      const s = new AbortController();
      let l = false;
      Ac(`${this.url}/~_~/spin`, {
        signal: s.signal,
        // @ts-expect-error reactNative not in types but is essential
        reactNative: { textStreaming: true },
        openWhenHidden: true,
        responseTimeout: 25e3,
        fetch: this.fetchFn,
        onmessage(f) {
          l || (l = true, s.abort(), r(f.data));
        },
        onerror(f) {
          s.abort(), i(f);
        }
      });
    });
  }
  /**
   * Perform a standard HTTP request using the channel's authentication
   *
   * @param path The path to request (relative to the ship's URL)
   * @param options Request options (method, headers, body, etc.)
   * @returns The response from the request
   */
  async request(r, i = {}, s) {
    r.startsWith("/") || (r = "/" + r);
    const l = s ? ys(s) : void 0, f = {
      ...this.fetchOptions,
      ...i,
      // Merge headers properly
      headers: {
        ...this.fetchOptions.headers,
        ...i.headers || {}
      },
      signal: l
    };
    !isBrowser && this.cookie && (f.headers = {
      ...f.headers,
      Cookie: this.cookie
    });
    const y = await this.fetchFn(`${this.url}${r}`, f);
    if (l == null || l.cleanup(), !y.ok)
      return Promise.reject(y);
    const h = y.headers.get("content-type");
    return h != null && h.includes("application/json") ? y.json() : h != null && h.includes("text/") ? y.text() : y.blob();
  }
  /**
   * Utility function to connect to a ship that has its *.arvo.network domain configured.
   *
   * @param name Name of the ship e.g. zod
   * @param code Code to log in
   */
  static async onArvoNetwork(r, i) {
    const s = `https://${r}.arvo.network`;
    return await _Di.authenticate({ ship: r, url: s, code: i });
  }
};
var lw = async (n, r) => {
  var s;
  const i = await fetch(`${n}/~/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    body: `password=${r}`,
    credentials: "include"
  });
  if (i.status < 200 || i.status > 299)
    throw new Error("Failed to authenticate. Is your access code correct?");
  return (s = i.headers.get("set-cookie")) == null ? void 0 : s.split(";")[0];
};
var V = ft("urbit", false);
var Li = 60 * 1e3;
var kc = 90 * 1e3;
var Fr = class extends Error {
  constructor(r, i) {
    super(), this.status = r, this.body = i;
  }
};
var sl = class extends Error {
  constructor({
    connectionStatus: i,
    timeoutDuration: s
  }) {
    super(`TimeoutError: ${i}`);
    Ee(this, "connectionStatus");
    Ee(this, "timeoutDuration");
    this.connectionStatus = i || "unknown", this.timeoutDuration = s ?? null;
  }
};
var O = {
  client: null,
  lastStatus: "",
  shipUrl: "",
  subWatchers: {},
  pendingAuth: null,
  onQuitOrReset: void 0,
  getCode: void 0,
  handleAuthFailure: void 0
};
var ir = new Proxy(
  {},
  {
    get: function(n, r, i) {
      if (!O.client)
        throw new Error("Urbit client not set.");
      return Reflect.get(O.client, r, i);
    }
  }
);
var _n = () => {
  if (!ir.nodeId)
    throw new Error("Client not initialized");
  return ir.nodeId;
};
function g1({
  shipName: n,
  shipUrl: r,
  verbose: i,
  fetchFn: s,
  getCode: l,
  handleAuthFailure: f,
  onQuitOrReset: y,
  onChannelStatusChange: h,
  client: I
}) {
  O.client = I || O.client || new Di(r, "", "", s), O.client.verbose = i, O.client.nodeId = Wy(n), O.shipUrl = r, O.onQuitOrReset = y, O.getCode = l, O.handleAuthFailure = f, O.subWatchers = {}, O.client.on("status-update", (C) => {
    V.trackEvent(pe.NodeConnectionDebug, {
      context: "status update",
      connectionStatus: C.status,
      statusUpdateContext: C.context ? C.context : null
    }), O.lastStatus = C.status, h == null || h(C.status);
  }), O.client.on("fact", (C) => {
    V.log(
      "received message",
      Mc(() => Iy(JSON.stringify(C)))
    );
  }), O.client.on("seamless-reset", () => {
    var C;
    V.log("client seamless-reset"), V.trackEvent(pe.NodeConnectionDebug, {
      context: "seamless-reset"
    }), (C = O.onQuitOrReset) == null || C.call(O, "reset");
  }), O.client.on("error", (C) => {
    V.log("client error", C);
  }), O.client.on("channel-reaped", () => {
    V.trackEvent(pe.NodeConnectionDebug, {
      context: "client channel reaped"
    }), V.log("client channel-reaped");
  });
}
function tt(n) {
  return `${n.app}${n.path}`;
}
async function $({ app: n, mark: r, json: i }) {
  V.log("poke", n, r, i);
  const s = Dr(pe.Poke, {
    app: n,
    mark: r
  }), l = async (y) => {
    if (!O.client)
      throw new Error("Client not initialized");
    return O.pendingAuth && await O.pendingAuth, O.client.poke({
      ...y,
      app: n,
      mark: r,
      json: i
    });
  }, f = async (y) => {
    if (V.trackError(`bad poke to ${n} with mark ${r}`, {
      stack: y,
      body: i
    }), !(y instanceof Dn))
      throw s("error"), y;
    return await Mn(), l();
  };
  try {
    const y = await l();
    return s("success"), y;
  } catch (y) {
    const h = await f(y);
    return s("success"), h;
  }
}
async function Rt(n, r, i, s) {
  O.pendingAuth && await O.pendingAuth;
  const l = Dr(pe.TrackedPoke, {
    app: n.app,
    mark: n.mark
  });
  let f = false;
  try {
    const y = pw(
      r,
      i,
      (s == null ? void 0 : s.timeout) ?? 2e4
    ), h = $(n).then(() => f = true);
    await Promise.all([y, h]), l("success");
  } catch (y) {
    throw V.error("tracked poke failed", y), l("error"), y instanceof sl && V.trackEvent(pe.ErrorTrackedPokeTimeout, {
      requestTag: s == null ? void 0 : s.tag,
      pokeParams: n,
      subEndpoint: tt(r),
      connectionStatus: O.lastStatus,
      timeoutDuration: y.timeoutDuration,
      pokeCompleted: f
    }), y;
  }
}
async function pw(n, r, i = 15e3) {
  const s = tt(n);
  return new Promise((l, f) => {
    const y = O.subWatchers[s] || /* @__PURE__ */ new Map(), h = Cs.uniqueId();
    O.subWatchers[s] = y.set(h, {
      id: h,
      predicate: r,
      resolve: l,
      reject: f
    }), i && setTimeout(() => {
      y.has(h) && (y.delete(h), f(
        new sl({
          connectionStatus: O.lastStatus,
          timeoutDuration: i
        })
      ));
    }, i);
  });
}
async function ye({
  app: n,
  path: r,
  timeout: i
}) {
  if (!O.client)
    throw new Error("Client not initialized");
  O.pendingAuth && await O.pendingAuth, V.log("scry", n, r);
  const s = Dr(pe.Scry, {
    app: n,
    path: cl(r),
    shouldTimeoutAfter: i ?? Li
  });
  try {
    const { result: l, responseSizeInBytes: f, responseStatus: y } = await O.client.scryWithInfo({
      app: n,
      path: r,
      timeout: i ?? Li
    });
    return s("success", { responseSizeInBytes: f, responseStatus: y }), l;
  } catch (l) {
    if (V.log("bad scry", n, r, l.status), l.status === 403) {
      V.log("scry failed with 403, authing to try again"), await Mn();
      const { result: f, responseSizeInBytes: y, responseStatus: h } = await O.client.scryWithInfo({ app: n, path: r });
      return s("success", { responseSizeInBytes: y, responseStatus: h }), f;
    }
    throw s("error", {
      errorMessage: l.message,
      responseStatus: l.status
    }), new Fr(l.status, l.toString());
  }
}
async function ul(n) {
  if (!n.desk)
    throw new Error("Must supply desk to run thread from");
  if (!O.client)
    throw new Error("Cannot call thread before client is initialized");
  const r = Dr(pe.Thread, {
    desk: n.desk,
    inputMark: n.inputMark,
    threadName: n.threadName,
    outputMark: n.outputMark,
    shouldTimeoutAfter: n.timeout ?? kc
  }), i = {};
  try {
    const s = await O.client.thread({
      ...n,
      timeout: n.timeout ?? kc
    });
    if (!s.ok) {
      const l = await s.text();
      throw i.responseStatus = s.status, i.responseText = l, new Fr(s.status, l);
    }
    return r("success"), s.json();
  } catch (s) {
    throw r("error", { ...i, errorMessage: s.toString() }), s;
  }
}
function cl(n) {
  return n.replace(/~.+?(?:\/.+?)(\/|$)/g, "[id]/");
}
async function Mn() {
  if (!O.getCode) {
    if (V.log("No getCode function provided for auth"), O.handleAuthFailure)
      return V.log("calling auth failure handler"), O.handleAuthFailure();
    throw new Error("Unable to authenticate with urbit");
  }
  if (O.pendingAuth)
    return O.pendingAuth;
  try {
    let n = 0;
    V.log("getting urbit code");
    const r = await O.getCode();
    return O.pendingAuth = new Promise((i, s) => {
      const l = async () => {
        try {
          V.log("trying to auth with code", r);
          const f = await lw(O.shipUrl, r);
          if (!f && n < 3) {
            V.log("auth failed, trying again", n), n++, setTimeout(l, 1e3 + 2 ** n * 1e3);
            return;
          }
          if (!f) {
            O.pendingAuth = null, O.handleAuthFailure && (V.log("auth failed, calling auth failure handler"), O.handleAuthFailure()), s(new Error("Couldn't authenticate with urbit"));
            return;
          }
          O.client && (O.client.cookie = f), O.pendingAuth = null, i(f);
          return;
        } catch (f) {
          s(new Error(`Error during reauth: ${f}`));
        }
      };
      l();
    }), await O.pendingAuth;
  } catch (n) {
    if (V.error("error getting urbit code", n), O.pendingAuth = null, O.handleAuthFailure)
      return O.handleAuthFailure();
    throw n;
  }
}
function Dr(n, r) {
  const i = Date.now();
  return (s, l) => {
    V.trackEvent(n, {
      ...r,
      ...l,
      status: s,
      scryStatus: s,
      duration: Date.now() - i
    });
  };
}
var gw = "settings";
var ll = "base_unreads";
var ww = /(\.mov|\.mp4|\.ogv|\.webm)(?:\?.*)?$/i;
var vw = /^(http(s?):)([/.\w\s-:]|%2*)*\.(?:jpg|img|png|gif|tiff|jpeg|webp|svg)(?:\?.*)?$/i;
var _w = (0, import_emoji_regex.default)();
function Iw(n) {
  const r = n.trim();
  return r.length === 0 || r.length > 10 ? false : [...r].every((i) => !!i.match(_w));
}
function Fs(n) {
  if (!n)
    return null;
  if (n.startsWith("#"))
    return n;
  const r = n.replace(".", "");
  return `#${(n.startsWith("0x") ? r.slice(2) : r).toUpperCase().padStart(6, "0")}`;
}
(/* @__PURE__ */ new Date()).getTimezoneOffset() * 60 * 1e3;
function bw(n) {
  let r = 0;
  for (let i = 0; i < n.length; i++) {
    const s = n.charCodeAt(i);
    r = (r << 5) - r + s, r = r & r;
  }
  return Math.abs(r).toString(36);
}
var Cw = ft("harkApi", true);
function xw(n) {
  return (r) => {
    if (!(r instanceof Cell))
      throw new Error("malformed frond");
    const i = enjs.cord(r.head), s = n.find((l) => l.tag === i);
    if (!s)
      throw new Error("unknown frond tag");
    return s.get(r.tail);
  };
}
var Ur;
((n) => {
  n.defaultConfig = Object.freeze({
    blockSeparator: `
`,
    includeLinebreaks: true,
    includeRefTag: true
  }), n.inlineConfig = Object.freeze({
    blockSeparator: " ",
    includeLinebreaks: false,
    includeRefTag: false
  });
})(Ur || (Ur = {}));
function Aw(n, r = Ur.defaultConfig) {
  return n.map((i) => {
    switch (i.type) {
      case "blockquote":
        return `> ${or(i.content)}`;
      case "paragraph":
        return or(i.content);
      case "image":
        return "(Image)";
      case "video":
        return "(Video)";
      case "reference":
        return r.includeRefTag ? "(Ref)" : "";
      case "code":
        return `\`\`\`${i.lang ?? ""}
${i.content}
\`\`\``;
      case "header":
        return or(i.children);
      case "rule":
        return "---";
      case "list":
        return fl(i.list, r);
      case "bigEmoji":
        return i.emoji;
    }
  }).join(r.blockSeparator).trim();
}
function fl(n, r) {
  const i = [];
  if (i.push(or(n.content)), n.children != null) {
    const s = (y) => {
      switch (n.type) {
        case void 0:
        case "tasklist":
        case "unordered":
          return "-";
        case "ordered":
          return `${y + 1}.`;
      }
    }, l = r.indentDepth ?? 0, f = r.includeLinebreaks ? l : 0;
    i.push(
      ...n.children.map(
        (y, h) => `${"	".repeat(f)}${s(h)} ${fl(
          y,
          {
            ...r,
            indentDepth: l + 1
          }
        )}`
      )
    );
  }
  return i.join(r.blockSeparator);
}
function or(n, r) {
  return n.map((i) => kw(i)).join("");
}
function kw(n, r) {
  switch (n.type) {
    case "style":
      return or(n.children);
    case "text":
      return n.text;
    case "mention":
      return n.contactId;
    case "groupMention":
      return `@${n.group}`;
    case "lineBreak":
      return `
`;
    case "link":
      return n.text;
    case "task": {
      let i = n.checked ? "[x] " : "[ ] ";
      return i += or(n.children), i;
    }
  }
}
function Tw(n) {
  const r = [];
  for (const i of n)
    if ("type" in i && i.type === "reference")
      r.push(i);
    else if ("block" in i) {
      const s = Pw(i.block);
      r.push(s);
    } else "inline" in i ? r.push(...Rw(i)) : (console.warn("Unhandled verse type:", { verse: i }), r.push({
      type: "paragraph",
      content: [{ type: "text", text: "Unknown content type" }]
    }));
  return r;
}
function Rw(n) {
  const r = [];
  let i = [];
  function s() {
    if (i.length) {
      if (!i.every(
        (f) => typeof f == "string" && f.trim() === ""
      )) {
        const f = rn(i);
        f.length && r.push({
          type: "paragraph",
          content: f
        });
      }
      i = [];
    }
  }
  return (
    // Start with cheaper checks to rule out most cases
    n.inline.length < 3 && (!n.inline[1] || Os(n.inline[1])) && typeof n.inline[0] == "string" && n.inline[0].length < 12 && Iw(n.inline[0].trim()) ? [
      {
        type: "bigEmoji",
        emoji: n.inline[0]
      }
    ] : (n.inline.forEach((l) => {
      jc(l) ? (s(), r.push({
        type: "blockquote",
        content: rn(l.blockquote)
      })) : Jc(l) ? (s(), r.push({
        type: "code",
        content: l.code
      })) : i.push(l);
    }), s(), r)
  );
}
function Pw(n) {
  const r = xs.is, i = (s) => ({
    type: "paragraph",
    content: [{ type: "text", text: s }]
  });
  switch (true) {
    case r(n, "image"):
      return ww.test(n.image.src) ? {
        type: "video",
        ...n.image
      } : {
        type: "image",
        ...n.image
      };
    case r(n, "listing"):
      return {
        type: "list",
        list: pl(n.listing)
      };
    case r(n, "header"):
      return {
        type: "header",
        level: n.header.tag,
        children: rn(n.header.content)
      };
    case r(n, "code"):
      return {
        type: "code",
        content: n.code.code,
        lang: n.code.lang
      };
    case r(n, "rule"):
      return {
        type: "rule"
      };
    case r(n, "cite"):
      return Sl(n.cite) ?? i("Failed to parse");
    case r(n, "link"):
      return {
        ...n.link.meta,
        type: "link",
        url: n.link.url
      };
    default:
      return Zy(n), console.warn("Unhandled block type:", { block: n }), i("Unknown content type");
  }
}
function pl(n) {
  return Oy(n) ? {
    type: n.list.type,
    content: rn(n.list.contents),
    children: n.list.items.map(pl)
  } : {
    content: rn(n.item)
  };
}
function rn(n) {
  const r = [];
  return n.forEach((i, s) => {
    typeof i == "string" ? r.push({
      type: "text",
      text: i
    }) : Wc(i) ? r.push({
      type: "style",
      style: "bold",
      children: rn(i.bold)
    }) : Hc(i) ? r.push({
      type: "style",
      style: "italic",
      children: rn(i.italics)
    }) : qc(i) ? r.push({
      type: "style",
      style: "strikethrough",
      children: rn(i.strike)
    }) : Kc(i) ? r.push({
      type: "style",
      style: "code",
      children: [{ type: "text", text: i["inline-code"] }]
    }) : zc(i) ? r.push({
      type: "link",
      href: i.link.href,
      text: i.link.content ?? i.link.href
    }) : Os(i) ? s !== n.length - 1 && r.push({
      type: "lineBreak"
    }) : Vc(i) ? r.push({
      type: "mention",
      contactId: i.ship
    }) : Yc(i) ? r.push({
      type: "groupMention",
      group: i.sect ? i.sect : "all"
    }) : Zc(i) ? r.push({
      type: "task",
      checked: i.task.checked,
      children: rn(i.task.content)
    }) : (console.warn("Unhandled inline type:", { inline: i }), r.push({
      type: "text",
      text: "Unknown content type"
    }));
  }), r;
}
function hl(n, r = Ur.defaultConfig) {
  return n == null ? null : Aw(Tw(n), r);
}
var dl = ft("activityApi", false);
async function v1() {
  const n = await ye({
    app: "activity",
    path: "/v4/activity"
  });
  return fr(n);
}
var gl = 30;
async function b1() {
  const n = await ye({
    app: "activity",
    path: `/v5/feed/init/${gl}`
  }), r = Uw(n), i = fr(n.summaries);
  return {
    events: r,
    relevantUnreads: i
  };
}
function Uw(n) {
  return [
    ...Oi(n.all, "all"),
    ...Oi(n.mentions, "mentions"),
    ...Oi(n.replies, "replies")
  ];
}
function Oi(n, r) {
  const i = {};
  return n.forEach((s) => {
    const l = s["source-key"];
    s.events.forEach(({ time: f, event: y }) => {
      i[f] = { sourceId: l, ...y };
    });
  }), Nw(i, r);
}
function Nw(n, r) {
  return Object.entries(n).map(
    ([i, s]) => ml({ id: i, event: s, bucketId: r, sourceId: s.sourceId })
  ).filter(Boolean);
}
function ml({
  id: n,
  sourceId: r,
  bucketId: i,
  event: s
}) {
  const l = typeof n == "number" ? n : Or(n), f = s.notified, y = {
    id: n.toString(),
    timestamp: l,
    shouldNotify: f,
    bucketId: i,
    sourceId: r
  };
  if ("post" in s) {
    const h = s.post, { authorId: I, postId: C } = Qt(h.key);
    return {
      ...y,
      type: "post",
      postId: C,
      authorId: I,
      channelId: h.channel,
      groupId: h.group,
      content: h.content,
      isMention: h.mention
    };
  }
  if ("reply" in s) {
    const h = s.reply, { authorId: I, postId: C } = Qt(h.key), { postId: k, authorId: R } = Qt(h.parent);
    return {
      ...y,
      type: "reply",
      postId: C,
      parentId: k,
      authorId: I,
      parentAuthorId: R,
      channelId: h.channel,
      groupId: h.group,
      content: h.content,
      isMention: h.mention
    };
  }
  if ("dm-post" in s) {
    const h = s["dm-post"], { authorId: I, postId: C } = Qt(h.key, true);
    return {
      ...y,
      type: "post",
      postId: C,
      authorId: I,
      channelId: "ship" in h.whom ? h.whom.ship : h.whom.club,
      content: h.content,
      isMention: h.mention
    };
  }
  if ("dm-reply" in s) {
    const h = s["dm-reply"], { authorId: I, postId: C } = Qt(h.key, true), { postId: k, authorId: R } = Qt(h.parent, true);
    return {
      ...y,
      type: "reply",
      authorId: I,
      postId: C,
      parentId: k,
      parentAuthorId: R,
      channelId: "ship" in h.whom ? h.whom.ship : h.whom.club,
      content: h.content,
      isMention: h.mention
    };
  }
  if ("flag-post" in s) {
    const h = s["flag-post"], { authorId: I, postId: C } = Qt(h.key);
    return {
      ...y,
      type: "flag-post",
      postId: C,
      authorId: I,
      channelId: h.channel,
      groupId: h.group
    };
  }
  if ("flag-reply" in s) {
    const h = s["flag-reply"], { authorId: I, postId: C } = Qt(h.key), { postId: k, authorId: R } = Qt(h.parent);
    return {
      ...y,
      type: "flag-reply",
      postId: C,
      parentId: k,
      parentAuthorId: R,
      authorId: I,
      channelId: h.channel,
      groupId: h.group
    };
  }
  if ("group-ask" in s)
    return {
      ...y,
      type: "group-ask",
      groupId: s["group-ask"].group,
      groupEventUserId: s["group-ask"].ship
    };
  if ("contact" in s) {
    const h = s.contact, I = Ow(y.id, s);
    return I ? {
      ...y,
      type: "contact",
      contactUserId: h.who,
      ...I
    } : null;
  }
  return null;
}
function Ow(n, r) {
  var s, l, f, y, h, I, C;
  const i = r.contact.update;
  if (!i)
    return null;
  if ("nickname" in i)
    return {
      contactUpdateType: "nickname",
      contactUpdateValue: ((s = i.nickname) == null ? void 0 : s.value) ?? ""
    };
  if ("bio" in i)
    return {
      contactUpdateType: "bio",
      contactUpdateValue: ((l = i.bio) == null ? void 0 : l.value) ?? ""
    };
  if ("status" in i)
    return {
      contactUpdateType: "status",
      contactUpdateValue: ((f = i.status) == null ? void 0 : f.value) ?? ""
    };
  if ("color" in i)
    return {
      contactUpdateType: "color",
      contactUpdateValue: Fs(((y = i.color) == null ? void 0 : y.value) ?? "")
    };
  if ("avatar" in i)
    return {
      contactUpdateType: "avatarImage",
      contactUpdateValue: ((h = i.avatar) == null ? void 0 : h.value) ?? ""
    };
  if ("groups" in i) {
    const k = ((I = i.groups) == null ? void 0 : I.value.map((R) => R.value)) ?? [];
    return k.length === 0 ? null : {
      contactUpdateType: "pinnedGroups",
      contactUpdateValue: ((C = i.groups) == null ? void 0 : C.value.map((R) => R.value).join(",")) ?? "",
      contactUpdateGroups: k.map((R) => ({
        groupId: R,
        activityEventId: n
      })) ?? []
    };
  }
  return null;
}
function Qt(n, r) {
  const i = n.id.split("/")[0], s = ae(r ? n.id : n.time);
  return { authorId: i, postId: s };
}
var fr = (n) => {
  const r = [], i = [], s = [];
  let l;
  return Object.entries(n).forEach(([f, y]) => {
    f === "base" && (l = {
      id: ll,
      count: y.count,
      notify: y.notify,
      notifyCount: y["notify-count"],
      updatedAt: y.recency
    });
    const [h, ...I] = f.split("/");
    if (h === "ship" || h === "club") {
      const C = I.join("/");
      i.push(Ts(C, y, "dm"));
    }
    if (h === "group") {
      const C = I.join("/");
      r.push(yl(C, y));
    }
    if (h === "channel") {
      const C = I.join("/");
      i.push(Ts(C, y, "channel"));
    }
    if (h === "thread" || h === "dm-thread") {
      const C = h === "dm-thread" ? I[0] : I.slice(0, 3).join("/"), k = I[I.length - 1];
      s.push(
        wl(
          C,
          k,
          y,
          h === "dm-thread" ? "dm" : "channel"
        )
      );
    }
  }), { baseUnread: l, channelUnreads: i, threadActivity: s, groupUnreads: r };
};
var yl = (n, r) => ({
  groupId: n,
  count: r.count,
  notify: r.notify,
  updatedAt: r.recency,
  notifyCount: r["notify-count"]
});
var Ts = (n, r, i) => {
  var f;
  const s = i === "dm" ? "id" : "time", l = r.unread && r.unread[s] ? ae(r.unread[s]) : null;
  return {
    channelId: n,
    type: i,
    updatedAt: r.recency,
    count: r.count,
    notify: r.notify,
    countWithoutThreads: ((f = r.unread) == null ? void 0 : f.count) ?? 0,
    firstUnreadPostId: l,
    firstUnreadPostReceivedAt: l ? Or(l) : null
  };
};
var wl = (n, r, i, s) => {
  const l = s === "dm" ? "id" : "time", f = i.unread && i.unread[l] ? ae(i.unread[l]) : null;
  return {
    channelId: n,
    threadId: ae(r),
    updatedAt: i.recency,
    count: i.count,
    notify: i.notify,
    firstUnreadPostId: f,
    firstUnreadPostReceivedAt: f ? Or(f) : null
  };
};
function en() {
  return {
    showAuthors: {
      displayName: "Show authors",
      type: "boolean"
    },
    showReplies: {
      displayName: "Show replies",
      type: "boolean"
    }
  };
}
var Lw = {
  "tlon.r0.collection.chat": {
    displayName: "Chat",
    enumTag: "chat",
    parametersSchema: en()
  },
  "tlon.r0.collection.gallery": {
    displayName: "Gallery",
    enumTag: "gallery",
    parametersSchema: en()
  },
  "tlon.r0.collection.notebook": {
    displayName: "Notebook",
    enumTag: "notebook",
    parametersSchema: en()
  },
  "tlon.r0.collection.carousel": {
    displayName: "Carousel",
    enumTag: "carousel",
    parametersSchema: {
      ...en(),
      scrollDirection: {
        displayName: "Scroll direction",
        type: "radio",
        options: [
          {
            displayName: "Horizontal",
            value: "horizontal"
          },
          {
            displayName: "Vertical",
            value: "vertical"
          }
        ]
      }
    }
  },
  "tlon.r0.collection.cards": {
    displayName: "Cards",
    enumTag: "cards",
    parametersSchema: en()
  },
  "tlon.r0.collection.sign": {
    displayName: "Sign",
    enumTag: "sign",
    parametersSchema: en()
  },
  "tlon.r0.collection.boardroom": {
    displayName: "Boardroom",
    enumTag: "boardroom",
    parametersSchema: en()
  },
  "tlon.r0.collection.strobe": {
    displayName: "Strobe",
    enumTag: "strobe",
    parametersSchema: {
      ...en(),
      interval: {
        displayName: "Frame rate in milliseconds",
        type: "string"
      }
    }
  },
  "tlon.r0.collection.summaries": {
    displayName: "Summaries",
    enumTag: "summaries",
    parametersSchema: en()
  }
};
var Mw = {
  "tlon.r0.input.chat": {
    displayName: "Chat",
    enumTag: "chat"
  },
  "tlon.r0.input.gallery": {
    displayName: "Gallery",
    enumTag: "gallery"
  },
  "tlon.r0.input.notebook": {
    displayName: "Notebook",
    enumTag: "notebook"
  },
  "tlon.r0.input.yo": {
    displayName: "Yo",
    enumTag: "yo",
    parametersSchema: {
      text: {
        displayName: "Message text",
        type: "string"
      }
    }
  },
  "tlon.r0.input.mic": {
    displayName: "Mic",
    enumTag: "mic"
  },
  "tlon.r0.input.color": {
    displayName: "Color",
    enumTag: "color"
  }
};
var $w = {
  "tlon.r0.content.chat": {
    displayName: "Chat",
    enumTag: "chat"
  },
  "tlon.r0.content.gallery": {
    displayName: "Gallery",
    enumTag: "gallery",
    parametersSchema: {
      embedded: {
        displayName: "Show frame",
        type: "boolean"
      },
      contentSize: {
        displayName: "Content size",
        type: "radio",
        options: [
          {
            displayName: "Large",
            value: "$l"
          },
          {
            displayName: "Small",
            value: "$s"
          }
        ]
      }
    }
  },
  "tlon.r0.content.notebook": {
    displayName: "Notebook",
    enumTag: "notebook"
  },
  "tlon.r0.content.audio": {
    displayName: "Audio",
    enumTag: "audio"
  },
  "tlon.r0.content.color": {
    displayName: "Color",
    enumTag: "color"
  },
  "tlon.r0.content.raw": {
    displayName: "Raw",
    enumTag: "raw",
    parametersSchema: {
      fontFamily: {
        displayName: "Font family",
        type: "string"
      }
    }
  },
  "tlon.r0.content.yell": {
    displayName: "Yell",
    enumTag: "yell"
  },
  "tlon.r0.content.scratchpad": {
    displayName: "Scratchpad",
    enumTag: "scratchpad"
  }
};
var vl = Ds(Lw);
var _l = Ds(Mw);
var Il = Ds($w);
var sr;
((n) => {
  function r(s) {
    return typeof s == "string" ? s : s.id;
  }
  n.id = r;
  function i(s) {
    return typeof s == "string" ? { id: s } : s;
  }
  n.coerce = i;
})(sr || (sr = {}));
var Tc;
((n) => {
  function r() {
    return {
      draftInput: { id: _l.chat },
      defaultPostContentRenderer: { id: Il.chat },
      defaultPostCollectionRenderer: { id: vl.chat }
    };
  }
  n.defaultConfiguration = r;
  function i(f) {
    return sr.coerce(f.draftInput);
  }
  n.draftInput = i;
  function s(f) {
    return sr.coerce(f.defaultPostContentRenderer);
  }
  n.defaultPostContentRenderer = s;
  function l(f) {
    return sr.coerce(f.defaultPostCollectionRenderer);
  }
  n.defaultPostCollectionRenderer = l;
})(Tc || (Tc = {}));
var Br;
((n) => {
  function r(s) {
    return JSON.stringify(s);
  }
  n.encode = r;
  function i(s) {
    if (s == null)
      return {};
    try {
      const l = JSON.parse(s);
      if (typeof l != "object" || !l)
        return {};
      if ("channelContentConfiguration" in l) {
        if (typeof l.channelContentConfiguration != "object")
          throw new Error("Invalid configuration");
        l.channelContentConfiguration = ((f) => {
          const y = {
            draftInput: _l.chat,
            defaultPostContentRenderer: Il.chat,
            defaultPostCollectionRenderer: vl.chat,
            ...f
          }, h = sr.coerce(
            y.defaultPostCollectionRenderer
          );
          return h.configuration = {
            showAuthors: true,
            showReplies: true,
            ...h.configuration
          }, y;
        })(l.channelContentConfiguration);
      }
      return l;
    } catch {
      return { description: s.length === 0 ? void 0 : s };
    }
  }
  n.decode = i;
})(Br || (Br = {}));
function Ds(n) {
  return Object.entries(n).reduce(
    (r, [i, { enumTag: s }]) => (r[s] = i, r),
    {}
  );
}
var x1 = ({
  id: n,
  members: r
}) => $({
  app: "chat",
  mark: "chat-club-create",
  json: {
    id: n,
    hive: [...r]
  }
});
var A1 = ({
  channel: n,
  accept: r
}) => {
  const i = _n();
  if (n.type === "dm")
    return $({
      app: "chat",
      mark: "chat-dm-rsvp",
      json: {
        ship: n.id,
        ok: r
      }
    });
  const s = zi(n.id, {
    team: { ship: i, ok: r }
  });
  return $(s);
};
function zi(n, r) {
  return {
    app: "chat",
    mark: "chat-club-action-0",
    json: {
      id: n,
      diff: {
        uid: "0v3",
        delta: r
      }
    }
  };
}
var Re = ft("postsApi", false);
function bt(n, r, i) {
  return nl(n) ? {
    app: "chat",
    mark: "chat-dm-action-1",
    json: {
      ship: n,
      diff: {
        id: r,
        delta: i
      }
    }
  } : {
    app: "chat",
    mark: "chat-club-action-1",
    json: {
      id: n,
      diff: {
        uid: "0v3",
        delta: { writ: { id: r, delta: i } }
      }
    }
  };
}
function Ls(n, r) {
  return el(n), Dt(n, {
    post: r
  });
}
var R1 = async ({
  channelId: n,
  authorId: r,
  sentAt: i,
  content: s,
  blob: l,
  metadata: f
}) => {
  Re.log("sending post", { channelId: n, authorId: r, sentAt: i, content: s });
  const y = Hi(n);
  if (y === "dm" || y === "groupDm") {
    const C = {
      add: {
        essay: {
          content: s,
          sent: i,
          author: r,
          kind: "/chat",
          meta: null,
          blob: l ?? null
        },
        time: null
      }
    }, k = bt(
      n,
      `${C.add.essay.author}/${Fn(import_aura.da.fromUnix(C.add.essay.sent).toString())}`,
      C
    );
    await $(k);
    return;
  }
  const h = Gc({
    content: s,
    blob: l,
    authorId: r,
    sentAt: i,
    channelType: y,
    metadata: f ? {
      title: f.title || "",
      image: f.image || "",
      description: f.description || "",
      cover: f.cover || ""
    } : void 0
  }), I = Ls(n, {
    add: h
  });
  await $(I), Re.log("post sent", { channelId: n, authorId: r, sentAt: i, content: s });
};
var P1 = async ({
  channelId: n,
  postId: r,
  authorId: i,
  sentAt: s,
  content: l,
  parentId: f,
  metadata: y,
  blob: h
}) => {
  Re.log("editing post", { channelId: n, postId: r, authorId: i, sentAt: s, content: l });
  const I = Hi(n);
  if (Tt(n) || on(n))
    throw Re.error("Cannot edit a post in a DM or group DM"), new Error("Cannot edit a post in a DM or group DM");
  if (f) {
    Re.log("editing a reply");
    const G = {
      post: {
        reply: {
          id: f,
          action: {
            edit: {
              id: r,
              memo: {
                author: i,
                content: l,
                sent: s
              }
            }
          }
        }
      }
    };
    Re.log("sending action", G), await $(Dt(n, G)), Re.log("action sent");
    return;
  }
  Re.log("editing a post");
  const C = Gc({
    content: l,
    authorId: i,
    sentAt: s,
    channelType: I,
    blob: h,
    metadata: y ? {
      title: y.title || "",
      image: y.image || "",
      description: y.description || "",
      cover: y.cover || ""
    } : void 0
  }), k = Ls(n, {
    edit: {
      id: r,
      essay: C
    }
  });
  Re.log("sending action", k), await $(k), Re.log("action sent");
};
var U1 = async ({
  channelId: n,
  parentId: r,
  parentAuthor: i,
  content: s,
  sentAt: l,
  authorId: f
}) => {
  if (Tt(n) || on(n)) {
    const I = {
      reply: {
        id: `${f}/${Fn(import_aura.da.fromUnix(l).toString())}`,
        meta: null,
        delta: {
          add: {
            memo: {
              content: s,
              author: f,
              sent: l
            },
            time: null
          }
        }
      }
    }, C = bt(n, `${i}/${r}`, I);
    await $(C);
    return;
  }
  const h = Ls(n, {
    reply: {
      id: r,
      action: {
        add: {
          content: s,
          author: f,
          sent: l
        }
      }
    }
  });
  await $(h);
};
var N1 = async ({
  channelId: n,
  cursor: r,
  mode: i = "older",
  count: s = 20,
  includeReplies: l = false,
  sequenceBoundary: f = null
}) => {
  var D;
  const y = Ns(n), h = y === "channel" ? "channels" : "chat", I = Bs(
    y === "dm" ? "v3/dm" : null,
    y === "club" ? "v3/club" : null,
    y === "channel" ? "v4" : null,
    n,
    y === "channel" ? "posts" : "writs",
    i,
    r ? Gi(r) : null,
    s,
    y === "channel" ? l ? "post" : "outline" : null,
    y !== "channel" ? l ? "heavy" : "light" : null
  ), C = await Ry(
    ye({
      app: h,
      path: I
    }),
    { posts: [] }
  ), k = bl(n, C), { posts: R, numStubs: G } = zw(
    k.posts
  );
  return {
    ...k,
    posts: R,
    numStubs: G,
    numDeletes: ((D = k.deletedPosts) == null ? void 0 : D.length) ?? 0,
    newestSequenceNum: C.newest
  };
};
function zw(n, r) {
  if (!n.length)
    return { posts: [], numStubs: 0 };
  let i = 1 / 0, s = 0, l = 0;
  const f = /* @__PURE__ */ new Map();
  for (const C of n) {
    if (typeof C.sequenceNum != "number") {
      Re.trackError("post missing sequence number while filling gaps");
      continue;
    }
    C.sequenceNum < i && (i = C.sequenceNum), C.sequenceNum > s && (s = C.sequenceNum), f.set(C.sequenceNum, C);
  }
  const y = [], h = n[0];
  let I = h.sentAt;
  for (let C = i; C <= s; C++) {
    const k = f.get(C);
    if (k)
      I = k.sentAt, y.push(k);
    else {
      const R = I + 1;
      y.push(
        Vw({
          channelId: h.channelId,
          type: h.type,
          sentAt: R,
          sequenceNum: C
        })
      ), I = R, l++;
    }
  }
  return { posts: y, numStubs: l };
}
async function D1({
  channelId: n,
  postId: r,
  emoji: i,
  our: s,
  postAuthor: l,
  parentAuthorId: f,
  parentId: y
}) {
  if (/^:[a-zA-Z0-9_+-]+:?$/.test(i) && Re.trackError("Sending shortcode reaction to server", {
    channelId: n,
    postId: r,
    emoji: i,
    context: "addReaction_api",
    stack: new Error().stack
  }), Tt(n) || on(n))
    if (Tt(n)) {
      if (y) {
        if (!y || !f) {
          Re.trackError("Parent post not found", {
            postId: r,
            parentId: y,
            parentAuthorId: f,
            context: "addReaction_parentPostNotFound"
          });
          return;
        }
        const I = `${f}/${y}`, C = {
          reply: {
            id: `${l}/${r}`,
            meta: null,
            delta: {
              "add-react": {
                author: s,
                react: i
              }
            }
          }
        };
        await $(bt(n, I, C));
      } else {
        const I = {
          "add-react": {
            react: i,
            author: s
          }
        }, C = bt(n, `${l}/${r}`, I);
        await $(C);
      }
      return;
    } else {
      if (y) {
        if (!y || !f) {
          Re.trackError("Parent post not found", {
            postId: r,
            parentId: y,
            parentAuthorId: f,
            context: "addReaction_parentPostNotFound"
          });
          return;
        }
        const I = `${f}/${y}`, C = {
          reply: {
            id: `${l}/${r}`,
            meta: null,
            delta: {
              "add-react": {
                react: i,
                author: s
              }
            }
          }
        };
        await $(bt(n, I, C));
      } else {
        const I = {
          "add-react": {
            react: i,
            author: s
          }
        };
        await $(bt(n, `${l}/${r}`, I));
      }
      return;
    }
  y ? await $(
    Dt(n, {
      post: {
        reply: {
          id: y,
          action: {
            "add-react": {
              id: r,
              react: i,
              ship: s
            }
          }
        }
      }
    })
  ) : await $(
    Dt(n, {
      post: {
        "add-react": {
          id: r,
          react: i,
          ship: s
        }
      }
    })
  );
}
async function L1({
  channelId: n,
  postId: r,
  our: i,
  postAuthor: s,
  parentId: l,
  parentAuthorId: f
}) {
  if (Tt(n) || on(n))
    if (Tt(n))
      if (l) {
        if (!l || !f) {
          Re.trackError("Parent post not found", {
            postId: r,
            parentId: l,
            parentAuthorId: f,
            context: "removeReaction_parentPostNotFound"
          });
          return;
        }
        const h = `${f}/${l}`, I = {
          reply: {
            id: `${s}/${r}`,
            meta: null,
            delta: {
              "del-react": i
            }
          }
        };
        return $(bt(n, h, I));
      } else {
        const h = {
          "del-react": i
        };
        return $(bt(n, `${s}/${r}`, h));
      }
    else if (l) {
      if (!l || !f) {
        Re.trackError("Parent post not found", {
          postId: r,
          parentId: l,
          parentAuthorId: f,
          context: "removeReaction_parentPostNotFound"
        });
        return;
      }
      const h = `${f}/${l}`, I = {
        reply: {
          id: `${s}/${r}`,
          meta: null,
          delta: {
            "del-react": i
          }
        }
      };
      return $(bt(n, h, I));
    } else {
      const h = {
        "del-react": i
      };
      return $(bt(n, `${s}/${r}`, h));
    }
  return l ? await $(
    Dt(n, {
      post: {
        reply: {
          id: l,
          action: {
            "del-react": {
              id: r,
              ship: i
            }
          }
        }
      }
    })
  ) : await $(
    Dt(n, {
      post: {
        "del-react": {
          id: r,
          ship: i
        }
      }
    })
  );
}
async function H1(n, r, i) {
  const s = Tt(n) ? bt(n, `${i}/${r}`, {
    del: null
  }) : on(n) ? zi(n, {
    writ: {
      id: `${i}/${r}`,
      delta: {
        del: null
      }
    }
  }) : Dt(n, {
    post: {
      del: r
    }
  });
  return await $(s);
}
function bl(n, r) {
  const i = "writs" in r ? r.writs : r.posts, s = Nr(n, i);
  return {
    older: r.older ? Fn(r.older) : null,
    newer: r.newer ? Fn(r.newer) : null,
    totalPosts: r.total,
    ...s
  };
}
function Nr(n, r) {
  const i = Object.entries(r), s = [], l = [];
  for (const [, f] of i) {
    if (f === null)
      continue;
    const y = vn(n, f);
    qi(f) && s.push(y), l.push(y);
  }
  return l.sort((f, y) => (f.receivedAt ?? 0) - (y.receivedAt ?? 0)), {
    posts: l,
    deletedPosts: s
  };
}
function Mi(n) {
  return typeof n == "string" ? n : n.ship;
}
function vn(n, r) {
  var D, Y, F, H, ue;
  const i = n.split("/")[0], l = ((Ue) => Yw(Ue) ? "notice" : i === "chat" ? "chat" : i === "diary" ? "note" : i === "heap" ? "block" : "chat")(r);
  if (qi(r))
    return {
      id: ae(r.id),
      authorId: Mi(r.author),
      channelId: n,
      type: l,
      sentAt: ar(r.id),
      isDeleted: true,
      deletedAt: r["deleted-at"],
      receivedAt: ar(r.id),
      sequenceNum: r.seq ? Number(r.seq) : null
    };
  const [f, y] = Cl(r == null ? void 0 : r.essay.content), h = ae(r.seal.id), I = r.seal && "time" in r.seal ? ae(r.seal.time.toString()) : null, C = Kw(r) ? Jw(h, n, r) : null, k = i === "heap" && f && f.length === 1 && "inline" in f[0] && f[0].inline.length === 1 && typeof f[0].inline[0] == "object" && "link" in f[0].inline[0] && f[0].inline[0].link.href.match(vw) ? f[0].inline[0].link.href : null, R = [
    {
      block: {
        // @ts-expect-error - we don't know image size
        image: {
          src: k ?? "",
          alt: "heap image"
        }
      }
    }
  ];
  let G = null;
  return "seq" in r.seal && (G = Number(r.seal.seq)), {
    id: h,
    channelId: n,
    type: l,
    backendTime: I,
    sequenceNum: G,
    // Kind data will override
    title: ((D = r.essay.meta) == null ? void 0 : D.title) ?? "",
    image: ((Y = r.essay.meta) == null ? void 0 : Y.image) ?? "",
    description: ((F = r.essay.meta) == null ? void 0 : F.description) ?? "",
    cover: ((H = r.essay.meta) == null ? void 0 : H.cover) ?? "",
    authorId: Mi(r.essay.author),
    isEdited: "revision" in r && r.revision !== "0",
    content: JSON.stringify(k ? R : f),
    textContent: hl(
      r == null ? void 0 : r.essay.content,
      Ur.inlineConfig
    ),
    sentAt: r.essay.sent,
    receivedAt: ar(h),
    replyCount: r == null ? void 0 : r.seal.meta.replyCount,
    replyTime: r == null ? void 0 : r.seal.meta.lastReply,
    replyContactIds: r == null ? void 0 : r.seal.meta.lastRepliers,
    images: El(h, (ue = r.essay) == null ? void 0 : ue.content),
    reactions: (() => {
      const Ue = (r == null ? void 0 : r.seal.reacts) ?? {};
      if (Object.keys(Ue).length > 0) {
        const Z = Object.entries(Ue).filter(
          ([, oe]) => typeof oe == "string" && /^:[a-zA-Z0-9_+-]+:?$/.test(oe)
        );
        Z.length > 0 && Re.trackError("Shortcode reactions in initial post load", {
          postId: h,
          channelId: n,
          shortcodeReactions: Z.map(([oe, ce]) => ({
            user: oe,
            value: ce
          })),
          allReacts: Ue,
          context: "initial_post_load"
        });
      }
      return $i(Ue, h);
    })(),
    replies: C,
    deliveryStatus: null,
    syncedAt: Date.now(),
    blob: r.essay.blob ?? null,
    ...y
  };
}
function ar(n) {
  return Or(n.split("/").pop() ?? n);
}
function Kw(n) {
  return !!(n.seal.replies && !Array.isArray(n.seal.replies));
}
function qi(n) {
  return "type" in n && n.type === "tombstone";
}
function Jw(n, r, i) {
  return Object.entries(i.seal.replies ?? {}).map(
    ([, s]) => ji(r, n, s)
  );
}
function ji(n, r, i) {
  if (qi(i))
    return {
      id: ae(i.id),
      parentId: ae(r),
      authorId: Mi(i.author),
      channelId: n,
      type: "reply",
      sentAt: ar(i.id),
      isDeleted: true,
      deletedAt: i["deleted-at"],
      receivedAt: ar(i.id),
      sequenceNum: null,
      syncedAt: Date.now()
    };
  const [s, l] = Cl(i.memo.content), f = ae(i.seal.id), y = i.seal && "time" in i.seal ? ae(i.seal.time.toString()) : null;
  return {
    id: f,
    channelId: n,
    type: "reply",
    authorId: Mi(i.memo.author),
    isEdited: !!i.revision && i.revision !== "0",
    parentId: ae(r),
    reactions: $i(i.seal.reacts, f),
    content: JSON.stringify(s),
    textContent: hl(i.memo.content),
    sentAt: i.memo.sent,
    // replies aren't sequenced, seq 0 is never genuine. drizzle has trouble
    // targeting nulls for onConflictDoUpdate so we use a default value instead
    sequenceNum: 0,
    backendTime: y,
    receivedAt: ar(f),
    replyCount: 0,
    images: El(f, i.memo.content),
    syncedAt: Date.now(),
    ...l
  };
}
function Vw({
  channelId: n,
  type: r,
  sequenceNum: i,
  sentAt: s
}) {
  return {
    id: `sequence-stub-${n}-${i}`,
    type: r,
    channelId: n,
    authorId: "~zod",
    sentAt: s ?? Date.now(),
    receivedAt: s ?? Date.now(),
    content: null,
    hidden: false,
    sequenceNum: i,
    isSequenceStub: true
  };
}
function Cl(n) {
  if (!n)
    return [null, null];
  const r = {
    hasAppReference: false,
    hasChannelReference: false,
    hasGroupReference: false,
    hasLink: false,
    hasImage: false
  };
  return [n.map((s) => {
    if ("block" in s && "cite" in s.block) {
      const l = Sl(s.block.cite);
      if (l)
        return l.referenceType === "app" ? r.hasAppReference = true : l.referenceType === "channel" ? r.hasChannelReference = true : l.referenceType === "group" && (r.hasGroupReference = true), l;
    }
    return s;
  }), r];
}
function Sl(n) {
  if ("chan" in n) {
    const r = n.chan.nest, i = /\/([0-9\.]+(?=[$\/]?))/g, [s, l] = Array.from(
      n.chan.where.matchAll(i)
    ).map((f) => f[1].replace(/\./g, ""));
    return s ? {
      type: "reference",
      referenceType: "channel",
      channelId: r,
      postId: Fn(s),
      replyId: l ? Fn(l) : void 0
    } : (console.error("found invalid ref", n), null);
  } else {
    if ("group" in n)
      return { type: "reference", referenceType: "group", groupId: n.group };
    if ("desk" in n) {
      const r = n.desk.flag.split("/"), i = r[0], s = r[1];
      return !i || !s ? (console.error("found invalid ref", n), null) : { type: "reference", referenceType: "app", userId: i, appId: s };
    }
  }
  return null;
}
function Yw(n) {
  return !n || qi(n) ? false : (n == null ? void 0 : n.essay.kind) === "/chat/notice";
}
function El(n, r) {
  return (r || []).reduce((i, s) => (Qc(s) && Xc(s.block) && i.push({ ...s.block.image, postId: n }), i), []);
}
function $i(n, r) {
  return Object.entries(n).filter(([, i]) => {
    const s = typeof i == "string";
    return s || Re.log("toReactionsData: filtering out non-string reaction", {
      postId: r,
      reaction: i,
      type: typeof i
    }), s;
  }).map(([i, s]) => (typeof s == "string" && /^:[a-zA-Z0-9_+-]+:?$/.test(s) && Re.trackError("Shortcode reaction detected in toReactionsData", {
    postId: r,
    contactId: i,
    reaction: s,
    context: "channel_reactions",
    stack: new Error().stack
    // To trace where this is called from
  }), {
    contactId: i,
    postId: r,
    value: s
  }));
}
function Gi(n) {
  return typeof n == "string" ? n : Ty(n);
}
var ct = ft("channelsApi", false);
function Dt(n, r) {
  return {
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest: n,
        action: r
      }
    }
  };
}
var Z1 = async (n) => {
  const i = Ln(n.channelId), s = Hy(n.query);
  let l;
  if (i)
    l = await ye({
      app: "channels",
      path: `/${n.channelId}/search/bounded/text/${n.cursor ? (0, import_aura.render)("ud", BigInt(n.cursor ?? 0)) : ""}/500/${s}`
    });
  else {
    const h = Ns(n.channelId) === "dm" ? "dm" : "club";
    l = await ye({
      app: "chat",
      path: `/${h}/${n.channelId}/search/bounded/text/${n.cursor ? (0, import_aura.render)("ud", BigInt(n.cursor ?? 0)) : ""}/500/${s}`
    });
  }
  const f = l.scan.map((h) => {
    if ("post" in h)
      return vn(n.channelId, h.post);
    if ("writ" in h)
      return vn(n.channelId, h.writ);
    if ("reply" in h) {
      const I = ae(i ? h.reply["id-post"] : h.reply.reply.seal["parent-id"]);
      return ji(
        n.channelId,
        I,
        h.reply.reply
      );
    }
    return false;
  }).filter((h) => h !== false), y = l.last;
  return { posts: f, cursor: y };
};
var Ft = ft("groupsApi", false);
function Pe(n) {
  return {
    app: "groups",
    mark: "group-action-4",
    json: n
  };
}
function o_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      group: {
        flag: n,
        "a-group": {
          entry: {
            ask: {
              ships: r,
              "a-ask": "approve"
            }
          }
        }
      }
    })
  );
}
function s_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      group: {
        flag: n,
        "a-group": {
          entry: {
            ask: {
              ships: r,
              "a-ask": "deny"
            }
          }
        }
      }
    })
  );
}
function u_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      invite: {
        flag: n,
        ships: r,
        "a-invite": {
          token: null,
          note: null
        }
      }
    })
  );
}
async function l_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      group: {
        flag: n,
        "a-group": {
          seat: {
            ships: r,
            "a-seat": {
              del: null
            }
          }
        }
      }
    })
  );
}
async function f_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      group: {
        flag: n,
        "a-group": {
          entry: {
            ban: {
              "add-ships": r
            }
          }
        }
      }
    })
  );
}
async function p_({
  groupId: n,
  contactIds: r
}) {
  return $(
    Pe({
      group: {
        flag: n,
        "a-group": {
          entry: {
            ban: {
              "del-ships": r
            }
          }
        }
      }
    })
  );
}
async function h_(n) {
  return $({
    app: "groups",
    mark: "group-leave",
    json: n
  });
}
async function g_(n) {
  return $(
    Pe({
      group: {
        flag: n.groupId,
        "a-group": {
          entry: {
            privacy: n.newPrivacy
          }
        }
      }
    })
  );
}
var Al = "\u2060";
var I_ = async ({
  group: n,
  placeHolderTitle: r,
  memberIds: i
}) => {
  const s = {
    groupId: n.id,
    meta: {
      title: n.title ? n.title : r + Al,
      description: "",
      image: n.iconImage ?? "",
      cover: ""
    },
    guestList: i ?? [],
    channels: (n.channels ?? []).map((l) => ({
      channelId: l.id,
      meta: {
        title: l.title ?? "",
        description: l.description ?? "",
        image: "",
        cover: ""
      }
    }))
  };
  try {
    const l = await ul({
      desk: "groups",
      inputMark: "group-create-thread",
      threadName: "group-create-1",
      outputMark: "group-ui-2",
      body: s
    });
    return Ft.trackEvent(pe.DebugGroupCreate, {
      context: "group-create-thread request succeeded"
    }), $s(n.id, l, true);
  } catch (l) {
    throw l instanceof Fr ? Ft.trackEvent("Create Group Error", {
      severity: Ss.Critical,
      status: l.status,
      error: l.toString(),
      context: "group-create-thread request failed"
    }) : Ft.trackEvent("Create Group Error", {
      severity: Ss.Critical,
      errorMessage: l.message,
      errorStack: l.stack,
      context: "group-create-thread unexpected error"
    }), l;
  }
};
var b_ = async (n) => {
  const r = `/v2/ui/groups/${n}`, i = await ye({ app: "groups", path: r });
  return $s(n, i, true);
};
var C_ = async () => {
  const n = await ye({
    app: "groups",
    path: "/v2/groups"
  });
  return Ms(n, true);
};
var E_ = async (n) => await Rt(
  Pe({
    group: {
      flag: n,
      "a-group": {
        delete: null
      }
    }
  }),
  { app: "groups", path: "/v1/groups" },
  (r) => "r-group" in r ? "delete" in r["r-group"] && r.flag === n : false,
  { tag: "deleteGroup" }
);
var N_ = async ({
  groupId: n,
  roleId: r,
  meta: i
}) => await $(
  Pe({
    group: {
      flag: n,
      "a-group": {
        role: {
          roles: [r],
          "a-role": {
            add: {
              title: i.title ?? "",
              description: i.description ?? "",
              image: "",
              cover: ""
            }
          }
        }
      }
    }
  })
);
var O_ = async ({
  groupId: n,
  roleId: r
}) => await $(
  Pe({
    group: {
      flag: n,
      "a-group": {
        role: {
          roles: [r],
          "a-role": {
            del: null
          }
        }
      }
    }
  })
);
var D_ = async ({
  groupId: n,
  roleId: r,
  ships: i
}) => await $(
  Pe({
    group: {
      flag: n,
      "a-group": {
        seat: {
          ships: i,
          "a-seat": {
            "add-roles": [r]
          }
        }
      }
    }
  })
);
var L_ = async ({
  groupId: n,
  roleId: r,
  ships: i
}) => await $(
  Pe({
    group: {
      flag: n,
      "a-group": {
        seat: {
          ships: i,
          "a-seat": {
            "del-roles": [r]
          }
        }
      }
    }
  })
);
var rv = (n, r) => {
  const i = [];
  return r && Object.entries(r).forEach(([s, l]) => {
    Object.entries(l).forEach(([f, y]) => {
      y.flaggers.forEach((h) => {
        i.push({
          groupId: n,
          channelId: s,
          postId: f,
          flaggedByContactId: h
        });
      });
    });
  }), i;
};
function Ms(n, r) {
  return n ? Object.entries(n).map(([i, s]) => $s(i, s, r)) : [];
}
function $s(n, r, i) {
  var G, D, Y, F, H, ue, Ue;
  const s = _n(), { host: l } = Wi(n), f = rv(
    n,
    r["flagged-content"]
  );
  Ft.log("admissions", r.admissions);
  const y = ((Y = (D = (G = r.admissions) == null ? void 0 : G.banned) == null ? void 0 : D.ships) == null ? void 0 : Y.map((Z) => ({
    contactId: Z,
    groupId: n
  }))) ?? [];
  Ft.log("bannedMembers", y);
  const h = (F = r.admissions) != null && F.requests ? Object.entries(r.admissions.requests).map(([Z, oe]) => ({
    contactId: Z,
    groupId: n,
    requestedAt: oe.requestedAt || null
  })) : [], I = (H = r.admissions) != null && H.invited ? Object.entries(r.admissions.invited).filter(([Z]) => {
    var oe;
    return !((oe = r.seats) != null && oe[Z]);
  }).map(([Z]) => ({
    membershipType: "group",
    contactId: Z,
    chatId: n,
    roles: [],
    status: "invited",
    joinedAt: null
  })) : [], C = (r.seats ? Object.entries(r.seats) : []).map(([Z, oe]) => Pc({
    groupId: n,
    contactId: Z,
    vessel: {
      sects: oe.roles,
      // v7 uses 'roles', v6 used 'sects'
      joined: oe.joined
    },
    status: "joined"
  })).concat(
    I.map((Z) => Pc({
      groupId: n,
      contactId: Z.contactId,
      vessel: {
        sects: [],
        joined: 0
      },
      status: "invited"
    }))
  );
  Ft.log("joinRequests", h);
  const k = (r.roles ? Object.entries(r.roles) : []).map(
    ([Z, oe]) => ({
      id: Z,
      groupId: n,
      ...Pr(oe)
      // v7 role IS the meta object
    })
  ), R = ((Ue = (ue = r.seats) == null ? void 0 : ue[s]) == null ? void 0 : Ue.roles) ?? [];
  return {
    id: n,
    roles: k,
    privacy: r.admissions.privacy,
    ...Tl(r.meta),
    haveInvite: i ? false : void 0,
    haveRequestedInvite: i ? false : void 0,
    currentUserIsMember: i,
    currentUserIsHost: l === s,
    isPersonalGroup: n === `${s}/${xy.slug}`,
    joinStatus: void 0,
    // v7 groups from init are already joined
    hostUserId: l,
    flaggedPosts: f,
    navSections: (r["section-order"] ?? []).map((Z, oe) => {
      var ge;
      const ce = (ge = r.sections) == null ? void 0 : ge[Z];
      return ce ? {
        id: `${n}-${Z}`,
        sectionId: Z,
        groupId: n,
        ...Pr(ce.meta),
        sectionIndex: oe,
        channels: (ce.order ?? []).map((Ct, bn) => ({
          channelIndex: bn,
          channelId: Ct,
          groupNavSectionId: `${n}-${Z}`
        }))
      } : void 0;
    }).filter((Z) => !!Z),
    members: C,
    bannedMembers: y,
    joinRequests: h,
    channels: r.channels ? cv({
      channels: r.channels,
      groupId: n,
      currentUserRoles: R
    }) : []
  };
}
function Tl(n) {
  return {
    ...Pr(n),
    title: uv(n.title)
  };
}
function uv(n) {
  return n.at(-1) === Al ? "" : n;
}
function cv({
  channels: n,
  groupId: r,
  currentUserRoles: i = []
}) {
  return Object.entries(n).map(
    ([s, l]) => lv({ id: s, channel: l, groupId: r, currentUserRoles: i })
  );
}
function lv({
  id: n,
  channel: r,
  groupId: i,
  currentUserRoles: s = []
}) {
  const { description: l, channelContentConfiguration: f } = Br.decode(r.meta.description), y = (r.readers ?? []).map((G) => ({
    channelId: n,
    roleId: G
  })), h = _n(), { host: I } = $c(n), C = r.readers.length === 0, k = r.readers.some(
    (G) => s.includes(G)
  ), R = C || k;
  return {
    id: n,
    groupId: i,
    type: Hi(n),
    iconImage: ur(r.meta.image),
    title: ur(r.meta.title),
    coverImage: ur(r.meta.cover),
    description: l,
    contentConfiguration: f,
    currentUserIsHost: I === h,
    readerRoles: y,
    currentUserIsMember: R
  };
}
function Pc({
  groupId: n,
  contactId: r,
  vessel: i,
  status: s
}) {
  return {
    membershipType: "group",
    contactId: r,
    chatId: n,
    roles: i.sects.map((l) => ({
      groupId: n,
      contactId: r,
      roleId: l
    })),
    status: s,
    joinedAt: i.joined
  };
}
function ur(n) {
  return n === "" ? null : n;
}
var et = ft("initApi", false);
function Uc(n) {
  const r = (0, import_aura.parse)("uw", n), i = new Atom(r), s = cue(i);
  if (!(s instanceof Cell))
    throw new Error("Bad Sign: not a cell");
  const l = s.head;
  if (!(l instanceof Atom))
    throw new Error("Bad Sign: provider not an atom");
  const f = (0, import_aura.render)("p", l.number), h = s.at(Atom.fromInt(14));
  if (!h)
    throw new Error("Bad Sign: could not find dat");
  const I = gv(h);
  return I && (I.provider = f, I.signature = n), I;
}
function dv(n) {
  if (!(n instanceof Cell))
    throw new Error("getHeadTaggedAttestation: not a cell");
  const r = n.tail;
  if (!(r instanceof Cell))
    throw new Error("getHeadTaggedAttestation: tail is not a cell");
  return r.tail;
}
function gv(n) {
  const r = dv(n);
  return xw([
    { tag: "half", get: wv },
    { tag: "full", get: vv }
  ])(r);
}
function mv(n) {
  if (!(n instanceof Cell))
    throw new Error("Bad identifier: not a cell");
  const r = enjs.cord(n.head), i = enjs.cord(n.tail);
  if (r !== "twitter" && r !== "phone")
    throw new Error(`Bad identifier: invalid type ${r}`);
  return { type: r, value: i };
}
function yv(n) {
  if (!(n instanceof Cell))
    throw new Error("Bad identifier: not a cell");
  const r = enjs.cord(n.head), i = enjs.cord(n.tail);
  if (r === "tweet")
    return { proofTweetId: i };
  throw new Error(`Bad proof: invalid type ${r}`);
}
function wv(n) {
  if (!(n instanceof Cell))
    throw "Bad half sign 1";
  const r = new Date(import_aura.da.toUnix(BigInt(n.head.toString()))).getTime();
  if (!(n.tail instanceof Cell))
    throw "Bad half sign 2";
  const i = n.tail;
  if (!(i.head instanceof Atom))
    throw new Error("Bad half Sign 3");
  const s = (0, import_aura.render)("p", i.head.number), l = enjs.cord(i.tail);
  return { signType: "half", when: r, type: l, contactId: s };
}
function vv(n) {
  if (!(n instanceof Cell))
    throw "Bad full sign 1";
  const r = new Date(import_aura.da.toUnix(BigInt(n.head.toString()))).getTime();
  if (!(n.tail instanceof Cell))
    throw "Bad full sign 2";
  const i = n.tail;
  if (!(i.head instanceof Atom))
    throw new Error("Bad full Sign 3");
  const s = (0, import_aura.render)("p", i.head.number), l = i.tail;
  if (!(l instanceof Cell))
    throw new Error("Bad full Sign 4");
  const f = mv(l.head);
  let y = {};
  const h = l.tail;
  return h instanceof Cell && (y = yv(h.tail)), {
    signType: "full",
    when: r,
    contactId: s,
    type: f.type,
    value: f.value,
    ...y
  };
}
var ze = ft("lanyardApi", false);
function Bc(n) {
  const r = `${n.contactId}:${n.type}:${n.value}:${n.provider}`;
  return bw(r);
}
var Tr = ft("contactsApi", false);
var H_ = async () => {
  const n = await ye({
    app: "contacts",
    path: "/all"
  }), r = await ye({
    app: "contacts",
    path: "/v1/book"
  }), i = await ye({
    app: "groups-ui",
    path: "/suggested-contacts"
  });
  return Iv({
    peersResponse: n,
    contactsResponse: r,
    suggestionsResponse: i
  });
};
var Iv = ({
  peersResponse: n,
  contactsResponse: r,
  suggestionsResponse: i
}) => {
  const s = new Set(Object.keys(r)), l = new Set(i), f = bv(n, {
    userIdsToOmit: s,
    contactSuggestions: l
  }), y = Sv(r, {
    contactSuggestions: l
  });
  return [...f, ...y];
};
var K_ = async (n, r) => {
  const i = {};
  return r.nickname !== void 0 && (i.nickname = r.nickname ? { type: "text", value: r.nickname } : null), r.avatarImage !== void 0 && (i.avatar = r.avatarImage ? { type: "look", value: r.avatarImage } : null), $({
    app: "contacts",
    mark: "contact-action-1",
    json: { edit: { kip: n, contact: i } }
  });
};
var bv = (n, r) => Object.entries(n).filter(
  ([i]) => r != null && r.userIdsToOmit ? !r.userIdsToOmit.has(i) : true
).flatMap(
  ([i, s]) => {
    var l;
    return s === null ? [] : [
      Cv(i, s, {
        isContactSuggestion: (l = r == null ? void 0 : r.contactSuggestions) == null ? void 0 : l.has(i)
      })
    ];
  }
);
var Cv = (n, r, i) => {
  var l;
  const s = _n();
  return {
    id: n,
    peerNickname: (r == null ? void 0 : r.nickname) ?? null,
    peerAvatarImage: (r == null ? void 0 : r.avatar) ?? null,
    bio: (r == null ? void 0 : r.bio) ?? null,
    status: (r == null ? void 0 : r.status) ?? null,
    color: r != null && r.color ? Fs(r.color) : null,
    coverImage: (r == null ? void 0 : r.cover) ?? null,
    pinnedGroups: ((l = r == null ? void 0 : r.groups) == null ? void 0 : l.map((f) => ({
      groupId: f,
      contactId: n
    }))) ?? [],
    attestations: Rl(n, r),
    isContact: false,
    isContactSuggestion: (i == null ? void 0 : i.isContactSuggestion) && n !== s
  };
};
function Rl(n, r) {
  var l, f, y, h, I;
  if (!r)
    return null;
  const i = [];
  if (r["lanyard-twitter-0-sign"] && r["lanyard-twitter-0-sign"].value)
    try {
      const C = Uc(
        r["lanyard-twitter-0-sign"].value
      );
      if (C)
        if (C.contactId === n) {
          const R = ((l = r["lanyard-twitter-0-url"]) == null ? void 0 : l.value) ?? null, G = "~zod", D = C.type, Y = C.signType === "full" ? C.value : "", F = Bc({ provider: G, type: D, value: Y, contactId: n }), H = C.signType === "full" ? C.proofTweetId ?? null : null;
          i.push({
            id: F,
            provider: G,
            type: D,
            value: Y,
            contactId: n,
            initiatedAt: C.when,
            discoverability: C.signType === "full" ? "public" : "verified",
            status: "verified",
            providerUrl: R,
            provingTweetId: H,
            signature: C.signature
          });
        } else
          Tr.trackEvent(pe.ErrorAttestation, {
            context: "forged attestation",
            type: "twitter",
            contactId: n,
            sign: (f = r["lanyard-twitter-0-sign"]) == null ? void 0 : f.value
          });
    } catch (C) {
      Tr.trackEvent(pe.ErrorNounParse, {
        parser: "twitter signed",
        error: C,
        errorMessage: C.message,
        noun: r["lanyard-twitter-0-sign"].value
      });
    }
  if (r["lanyard-phone-0-sign"] && r["lanyard-phone-0-sign"].value)
    try {
      const C = Uc(
        r["lanyard-phone-0-sign"].value
      );
      if (C)
        if (C.contactId === n) {
          const R = ((y = r["lanyard-phone-0-url"]) == null ? void 0 : y.value) ?? null, G = "~zod", D = C.type, Y = C.signType === "full" ? C.value : "", F = Bc({ provider: G, type: D, value: Y, contactId: n }), H = C.signType === "full" ? C.proofTweetId ?? null : null;
          C.contactId !== n && Tr.trackEvent(pe.ErrorAttestation, {
            context: "forged attestation",
            contactId: n,
            sign: (h = r["lanyard-phone-0-sign"]) == null ? void 0 : h.value
          }), i.push({
            id: F,
            provider: G,
            type: D,
            value: Y,
            contactId: n,
            initiatedAt: C.when,
            discoverability: C.signType === "full" ? "public" : "verified",
            status: "verified",
            providerUrl: R,
            provingTweetId: H,
            signature: C.signature
          });
        } else
          Tr.trackEvent(pe.ErrorAttestation, {
            context: "forged attestation",
            type: "phone",
            contactId: n,
            sign: (I = r["lanyard-phone-0-sign"]) == null ? void 0 : I.value
          });
    } catch (C) {
      Tr.trackEvent(pe.ErrorNounParse, {
        parser: "phone signed",
        error: C,
        errorMessage: C.message,
        noun: r["lanyard-phone-0-sign"].value
      });
    }
  return i.length === 0 ? null : i.map((C) => ({
    contactId: n,
    attestationId: C.id,
    attestation: C
  }));
}
var Sv = (n, r) => Object.entries(n).flatMap(
  ([i, s]) => {
    var l;
    return s === null ? [] : [
      Pl(i, s, {
        isContactSuggestion: (l = r == null ? void 0 : r.contactSuggestions) == null ? void 0 : l.has(i)
      })
    ];
  }
);
var Pl = (n, r, i) => {
  var f, y, h, I, C, k, R, G;
  const [s, l] = r;
  return {
    id: n,
    peerNickname: ((f = s.nickname) == null ? void 0 : f.value) ?? null,
    customNickname: (y = l == null ? void 0 : l.nickname) == null ? void 0 : y.value,
    peerAvatarImage: ((h = s.avatar) == null ? void 0 : h.value) ?? null,
    customAvatarImage: (I = l == null ? void 0 : l.avatar) == null ? void 0 : I.value,
    status: ((C = s.status) == null ? void 0 : C.value) ?? null,
    bio: ((k = s.bio) == null ? void 0 : k.value) ?? null,
    coverImage: ((R = s.cover) == null ? void 0 : R.value) ?? null,
    color: s.color ? Fs(s.color.value) : null,
    pinnedGroups: ((G = s.groups) == null ? void 0 : G.value.map((D) => ({
      groupId: D.value,
      contactId: n
    }))) ?? [],
    attestations: Rl(n, s),
    isContact: !!l,
    isContactSuggestion: false
  };
};
var Rs = "pendingMemberDismissal:";
function Ev(n) {
  if (n.startsWith(Rs))
    return "groups";
  switch (n) {
    case "messagesFilter":
      return "talk";
    case "activitySeenTimestamp":
    case "completedWayfindingSplash":
    case "completedWayfindingTutorial":
    case "disableTlonInfraEnhancement":
    case "enableTelemetry":
      return "groups";
    case "disableAvatars":
    case "disableNicknames":
    case "disableRemoteContent":
    case "disableAppTileUnreads":
    case "disableSpellcheck":
    case "showUnreadCounts":
      return "calmEngine";
    case "theme":
      return "display";
    default:
      return console.warn(
        `No explicit bucket defined for setting key: ${n}, defaulting to 'groups'`
      ), "groups";
  }
}
var J_ = async (n, r) => $({
  app: "settings",
  mark: "settings-event",
  json: {
    "put-entry": {
      desk: "groups",
      "bucket-key": Ev(n),
      "entry-key": n,
      value: r
    }
  }
});
var V_ = async () => {
  const n = await ye({
    app: "settings",
    path: "/desk/groups"
  }), r = Av(n), i = kv(n);
  return { settings: r, pendingMemberDismissals: i };
};
var xv = (n) => {
  switch (n) {
    case "A \u2192 Z":
      return "alphabetical";
    case "Arranged":
      return "arranged";
    case "Recent":
      return "recent";
  }
  return "arranged";
};
var Av = (n) => {
  var r, i, s, l, f, y, h, I, C, k, R, G, D, Y, F, H, ue, Ue, Z, oe, ce, xe, ge;
  return {
    id: gw,
    theme: (r = n.desk.display) == null ? void 0 : r.theme,
    disableAppTileUnreads: (i = n.desk.calmEngine) == null ? void 0 : i.disableAppTileUnreads,
    disableAvatars: (s = n.desk.calmEngine) == null ? void 0 : s.disableAvatars,
    disableRemoteContent: (l = n.desk.calmEngine) == null ? void 0 : l.disableRemoteContent,
    disableSpellcheck: (f = n.desk.calmEngine) == null ? void 0 : f.disableSpellcheck,
    disableNicknames: (y = n.desk.calmEngine) == null ? void 0 : y.disableNicknames,
    orderedGroupPins: (h = n.desk.groups) == null ? void 0 : h.orderedGroupPins,
    sideBarSort: xv((I = n.desk.groups) == null ? void 0 : I.sideBarSort),
    groupSideBarSort: (C = n.desk.groups) == null ? void 0 : C.groupSideBarSort,
    showActivityMessage: (k = n.desk.groups) == null ? void 0 : k.showActivityMessage,
    enableTelemetry: (R = n.desk.groups) == null ? void 0 : R.enableTelemetry,
    // DEPRECATED: use enableTelemetry instead, this is kept for settings migration
    logActivity: (G = n.desk.groups) == null ? void 0 : G.logActivity,
    analyticsId: (D = n.desk.groups) == null ? void 0 : D.analyticsId,
    seenWelcomeCard: (Y = n.desk.groups) == null ? void 0 : Y.seenWelcomeCard,
    newGroupFlags: (F = n.desk.groups) == null ? void 0 : F.newGroupFlags,
    groupsNavState: (H = n.desk.groups) == null ? void 0 : H.groupsNavState,
    messagesNavState: (ue = n.desk.groups) == null ? void 0 : ue.messagesNavState,
    messagesFilter: (Ue = n.desk.talk) == null ? void 0 : Ue.messagesFilter,
    gallerySettings: (Z = n.desk.heaps) == null ? void 0 : Z.heapSettings,
    notebookSettings: JSON.stringify(n.desk.diary),
    activitySeenTimestamp: (oe = n.desk.groups) == null ? void 0 : oe.activitySeenTimestamp,
    completedWayfindingSplash: ((ce = n.desk.groups) == null ? void 0 : ce.completedWayfindingSplash) ?? false,
    completedWayfindingTutorial: ((xe = n.desk.groups) == null ? void 0 : xe.completedWayfindingTutorial) ?? false,
    disableTlonInfraEnhancement: ((ge = n.desk.groups) == null ? void 0 : ge.disableTlonInfraEnhancement) ?? false
  };
};
var kv = (n) => {
  const r = [];
  return Object.entries(n.desk.groups || {}).filter(([i]) => i.startsWith(Rs)).forEach(([i, s]) => {
    const l = i.slice(Rs.length);
    console.log(`Pending member dismissal for group ${l}: ${s}`);
    const f = Number(s);
    isNaN(f) || r.push({
      groupId: l,
      dismissedAt: f
    });
  }), r;
};
var Rv = 3 * 1e3;
var nn = ft("metagrabApi", false);
var Bl = {};
var Ki = {};
Ki.byteLength = $v;
Ki.toByteArray = Wv;
Ki.fromByteArray = qv;
var Ot = [];
var It = [];
var Lv = typeof Uint8Array < "u" ? Uint8Array : Array;
var _s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
for (nr = 0, Mv = _s.length; nr < Mv; ++nr)
  Ot[nr] = _s[nr], It[_s.charCodeAt(nr)] = nr;
var nr;
var Mv;
It[45] = 62;
It[95] = 63;
function Nl(n) {
  var r = n.length;
  if (r % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var i = n.indexOf("=");
  i === -1 && (i = r);
  var s = i === r ? 0 : 4 - i % 4;
  return [i, s];
}
function $v(n) {
  var r = Nl(n), i = r[0], s = r[1];
  return (i + s) * 3 / 4 - s;
}
function Gv(n, r, i) {
  return (r + i) * 3 / 4 - i;
}
function Wv(n) {
  var r, i = Nl(n), s = i[0], l = i[1], f = new Lv(Gv(n, s, l)), y = 0, h = l > 0 ? s - 4 : s, I;
  for (I = 0; I < h; I += 4)
    r = It[n.charCodeAt(I)] << 18 | It[n.charCodeAt(I + 1)] << 12 | It[n.charCodeAt(I + 2)] << 6 | It[n.charCodeAt(I + 3)], f[y++] = r >> 16 & 255, f[y++] = r >> 8 & 255, f[y++] = r & 255;
  return l === 2 && (r = It[n.charCodeAt(I)] << 2 | It[n.charCodeAt(I + 1)] >> 4, f[y++] = r & 255), l === 1 && (r = It[n.charCodeAt(I)] << 10 | It[n.charCodeAt(I + 1)] << 4 | It[n.charCodeAt(I + 2)] >> 2, f[y++] = r >> 8 & 255, f[y++] = r & 255), f;
}
function Hv(n) {
  return Ot[n >> 18 & 63] + Ot[n >> 12 & 63] + Ot[n >> 6 & 63] + Ot[n & 63];
}
function zv(n, r, i) {
  for (var s, l = [], f = r; f < i; f += 3)
    s = (n[f] << 16 & 16711680) + (n[f + 1] << 8 & 65280) + (n[f + 2] & 255), l.push(Hv(s));
  return l.join("");
}
function qv(n) {
  for (var r, i = n.length, s = i % 3, l = [], f = 16383, y = 0, h = i - s; y < h; y += f)
    l.push(zv(n, y, y + f > h ? h : y + f));
  return s === 1 ? (r = n[i - 1], l.push(
    Ot[r >> 2] + Ot[r << 4 & 63] + "=="
  )) : s === 2 && (r = (n[i - 2] << 8) + n[i - 1], l.push(
    Ot[r >> 10] + Ot[r >> 4 & 63] + Ot[r << 2 & 63] + "="
  )), l.join("");
}
var Gs = {};
Gs.read = function(n, r, i, s, l) {
  var f, y, h = l * 8 - s - 1, I = (1 << h) - 1, C = I >> 1, k = -7, R = i ? l - 1 : 0, G = i ? -1 : 1, D = n[r + R];
  for (R += G, f = D & (1 << -k) - 1, D >>= -k, k += h; k > 0; f = f * 256 + n[r + R], R += G, k -= 8)
    ;
  for (y = f & (1 << -k) - 1, f >>= -k, k += s; k > 0; y = y * 256 + n[r + R], R += G, k -= 8)
    ;
  if (f === 0)
    f = 1 - C;
  else {
    if (f === I)
      return y ? NaN : (D ? -1 : 1) * (1 / 0);
    y = y + Math.pow(2, s), f = f - C;
  }
  return (D ? -1 : 1) * y * Math.pow(2, f - s);
};
Gs.write = function(n, r, i, s, l, f) {
  var y, h, I, C = f * 8 - l - 1, k = (1 << C) - 1, R = k >> 1, G = l === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, D = s ? 0 : f - 1, Y = s ? 1 : -1, F = r < 0 || r === 0 && 1 / r < 0 ? 1 : 0;
  for (r = Math.abs(r), isNaN(r) || r === 1 / 0 ? (h = isNaN(r) ? 1 : 0, y = k) : (y = Math.floor(Math.log(r) / Math.LN2), r * (I = Math.pow(2, -y)) < 1 && (y--, I *= 2), y + R >= 1 ? r += G / I : r += G * Math.pow(2, 1 - R), r * I >= 2 && (y++, I /= 2), y + R >= k ? (h = 0, y = k) : y + R >= 1 ? (h = (r * I - 1) * Math.pow(2, l), y = y + R) : (h = r * Math.pow(2, R - 1) * Math.pow(2, l), y = 0)); l >= 8; n[i + D] = h & 255, D += Y, h /= 256, l -= 8)
    ;
  for (y = y << l | h, C += l; C > 0; n[i + D] = y & 255, D += Y, y /= 256, C -= 8)
    ;
  n[i + D - Y] |= F * 128;
};
(function(n) {
  const r = Ki, i = Gs, s = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
  n.Buffer = h, n.SlowBuffer = Ue, n.INSPECT_MAX_BYTES = 50;
  const l = 2147483647;
  n.kMaxLength = l, h.TYPED_ARRAY_SUPPORT = f(), !h.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
    "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
  );
  function f() {
    try {
      const d = new Uint8Array(1), u = { foo: function() {
        return 42;
      } };
      return Object.setPrototypeOf(u, Uint8Array.prototype), Object.setPrototypeOf(d, u), d.foo() === 42;
    } catch {
      return false;
    }
  }
  Object.defineProperty(h.prototype, "parent", {
    enumerable: true,
    get: function() {
      if (h.isBuffer(this))
        return this.buffer;
    }
  }), Object.defineProperty(h.prototype, "offset", {
    enumerable: true,
    get: function() {
      if (h.isBuffer(this))
        return this.byteOffset;
    }
  });
  function y(d) {
    if (d > l)
      throw new RangeError('The value "' + d + '" is invalid for option "size"');
    const u = new Uint8Array(d);
    return Object.setPrototypeOf(u, h.prototype), u;
  }
  function h(d, u, c) {
    if (typeof d == "number") {
      if (typeof u == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return R(d);
    }
    return I(d, u, c);
  }
  h.poolSize = 8192;
  function I(d, u, c) {
    if (typeof d == "string")
      return G(d, u);
    if (ArrayBuffer.isView(d))
      return Y(d);
    if (d == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof d
      );
    if (Ge(d, ArrayBuffer) || d && Ge(d.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Ge(d, SharedArrayBuffer) || d && Ge(d.buffer, SharedArrayBuffer)))
      return F(d, u, c);
    if (typeof d == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    const w = d.valueOf && d.valueOf();
    if (w != null && w !== d)
      return h.from(w, u, c);
    const b = H(d);
    if (b) return b;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof d[Symbol.toPrimitive] == "function")
      return h.from(d[Symbol.toPrimitive]("string"), u, c);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof d
    );
  }
  h.from = function(d, u, c) {
    return I(d, u, c);
  }, Object.setPrototypeOf(h.prototype, Uint8Array.prototype), Object.setPrototypeOf(h, Uint8Array);
  function C(d) {
    if (typeof d != "number")
      throw new TypeError('"size" argument must be of type number');
    if (d < 0)
      throw new RangeError('The value "' + d + '" is invalid for option "size"');
  }
  function k(d, u, c) {
    return C(d), d <= 0 ? y(d) : u !== void 0 ? typeof c == "string" ? y(d).fill(u, c) : y(d).fill(u) : y(d);
  }
  h.alloc = function(d, u, c) {
    return k(d, u, c);
  };
  function R(d) {
    return C(d), y(d < 0 ? 0 : ue(d) | 0);
  }
  h.allocUnsafe = function(d) {
    return R(d);
  }, h.allocUnsafeSlow = function(d) {
    return R(d);
  };
  function G(d, u) {
    if ((typeof u != "string" || u === "") && (u = "utf8"), !h.isEncoding(u))
      throw new TypeError("Unknown encoding: " + u);
    const c = Z(d, u) | 0;
    let w = y(c);
    const b = w.write(d, u);
    return b !== c && (w = w.slice(0, b)), w;
  }
  function D(d) {
    const u = d.length < 0 ? 0 : ue(d.length) | 0, c = y(u);
    for (let w = 0; w < u; w += 1)
      c[w] = d[w] & 255;
    return c;
  }
  function Y(d) {
    if (Ge(d, Uint8Array)) {
      const u = new Uint8Array(d);
      return F(u.buffer, u.byteOffset, u.byteLength);
    }
    return D(d);
  }
  function F(d, u, c) {
    if (u < 0 || d.byteLength < u)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (d.byteLength < u + (c || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let w;
    return u === void 0 && c === void 0 ? w = new Uint8Array(d) : c === void 0 ? w = new Uint8Array(d, u) : w = new Uint8Array(d, u, c), Object.setPrototypeOf(w, h.prototype), w;
  }
  function H(d) {
    if (h.isBuffer(d)) {
      const u = ue(d.length) | 0, c = y(u);
      return c.length === 0 || d.copy(c, 0, 0, u), c;
    }
    if (d.length !== void 0)
      return typeof d.length != "number" || un(d.length) ? y(0) : D(d);
    if (d.type === "Buffer" && Array.isArray(d.data))
      return D(d.data);
  }
  function ue(d) {
    if (d >= l)
      throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + l.toString(16) + " bytes");
    return d | 0;
  }
  function Ue(d) {
    return +d != d && (d = 0), h.alloc(+d);
  }
  h.isBuffer = function(u) {
    return u != null && u._isBuffer === true && u !== h.prototype;
  }, h.compare = function(u, c) {
    if (Ge(u, Uint8Array) && (u = h.from(u, u.offset, u.byteLength)), Ge(c, Uint8Array) && (c = h.from(c, c.offset, c.byteLength)), !h.isBuffer(u) || !h.isBuffer(c))
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (u === c) return 0;
    let w = u.length, b = c.length;
    for (let x = 0, P = Math.min(w, b); x < P; ++x)
      if (u[x] !== c[x]) {
        w = u[x], b = c[x];
        break;
      }
    return w < b ? -1 : b < w ? 1 : 0;
  }, h.isEncoding = function(u) {
    switch (String(u).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, h.concat = function(u, c) {
    if (!Array.isArray(u))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (u.length === 0)
      return h.alloc(0);
    let w;
    if (c === void 0)
      for (c = 0, w = 0; w < u.length; ++w)
        c += u[w].length;
    const b = h.allocUnsafe(c);
    let x = 0;
    for (w = 0; w < u.length; ++w) {
      let P = u[w];
      if (Ge(P, Uint8Array))
        x + P.length > b.length ? (h.isBuffer(P) || (P = h.from(P)), P.copy(b, x)) : Uint8Array.prototype.set.call(
          b,
          P,
          x
        );
      else if (h.isBuffer(P))
        P.copy(b, x);
      else
        throw new TypeError('"list" argument must be an Array of Buffers');
      x += P.length;
    }
    return b;
  };
  function Z(d, u) {
    if (h.isBuffer(d))
      return d.length;
    if (ArrayBuffer.isView(d) || Ge(d, ArrayBuffer))
      return d.byteLength;
    if (typeof d != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof d
      );
    const c = d.length, w = arguments.length > 2 && arguments[2] === true;
    if (!w && c === 0) return 0;
    let b = false;
    for (; ; )
      switch (u) {
        case "ascii":
        case "latin1":
        case "binary":
          return c;
        case "utf8":
        case "utf-8":
          return nt(d).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return c * 2;
        case "hex":
          return c >>> 1;
        case "base64":
          return an(d).length;
        default:
          if (b)
            return w ? -1 : nt(d).length;
          u = ("" + u).toLowerCase(), b = true;
      }
  }
  h.byteLength = Z;
  function oe(d, u, c) {
    let w = false;
    if ((u === void 0 || u < 0) && (u = 0), u > this.length || ((c === void 0 || c > this.length) && (c = this.length), c <= 0) || (c >>>= 0, u >>>= 0, c <= u))
      return "";
    for (d || (d = "utf8"); ; )
      switch (d) {
        case "hex":
          return Xi(this, u, c);
        case "utf8":
        case "utf-8":
          return pr(this, u, c);
        case "ascii":
          return Mt(this, u, c);
        case "latin1":
        case "binary":
          return Pt(this, u, c);
        case "base64":
          return Yi(this, u, c);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return $n(this, u, c);
        default:
          if (w) throw new TypeError("Unknown encoding: " + d);
          d = (d + "").toLowerCase(), w = true;
      }
  }
  h.prototype._isBuffer = true;
  function ce(d, u, c) {
    const w = d[u];
    d[u] = d[c], d[c] = w;
  }
  h.prototype.swap16 = function() {
    const u = this.length;
    if (u % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let c = 0; c < u; c += 2)
      ce(this, c, c + 1);
    return this;
  }, h.prototype.swap32 = function() {
    const u = this.length;
    if (u % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let c = 0; c < u; c += 4)
      ce(this, c, c + 3), ce(this, c + 1, c + 2);
    return this;
  }, h.prototype.swap64 = function() {
    const u = this.length;
    if (u % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let c = 0; c < u; c += 8)
      ce(this, c, c + 7), ce(this, c + 1, c + 6), ce(this, c + 2, c + 5), ce(this, c + 3, c + 4);
    return this;
  }, h.prototype.toString = function() {
    const u = this.length;
    return u === 0 ? "" : arguments.length === 0 ? pr(this, 0, u) : oe.apply(this, arguments);
  }, h.prototype.toLocaleString = h.prototype.toString, h.prototype.equals = function(u) {
    if (!h.isBuffer(u)) throw new TypeError("Argument must be a Buffer");
    return this === u ? true : h.compare(this, u) === 0;
  }, h.prototype.inspect = function() {
    let u = "";
    const c = n.INSPECT_MAX_BYTES;
    return u = this.toString("hex", 0, c).replace(/(.{2})/g, "$1 ").trim(), this.length > c && (u += " ... "), "<Buffer " + u + ">";
  }, s && (h.prototype[s] = h.prototype.inspect), h.prototype.compare = function(u, c, w, b, x) {
    if (Ge(u, Uint8Array) && (u = h.from(u, u.offset, u.byteLength)), !h.isBuffer(u))
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof u
      );
    if (c === void 0 && (c = 0), w === void 0 && (w = u ? u.length : 0), b === void 0 && (b = 0), x === void 0 && (x = this.length), c < 0 || w > u.length || b < 0 || x > this.length)
      throw new RangeError("out of range index");
    if (b >= x && c >= w)
      return 0;
    if (b >= x)
      return -1;
    if (c >= w)
      return 1;
    if (c >>>= 0, w >>>= 0, b >>>= 0, x >>>= 0, this === u) return 0;
    let P = x - b, X = w - c;
    const ve = Math.min(P, X), me = this.slice(b, x), _e = u.slice(c, w);
    for (let de = 0; de < ve; ++de)
      if (me[de] !== _e[de]) {
        P = me[de], X = _e[de];
        break;
      }
    return P < X ? -1 : X < P ? 1 : 0;
  };
  function xe(d, u, c, w, b) {
    if (d.length === 0) return -1;
    if (typeof c == "string" ? (w = c, c = 0) : c > 2147483647 ? c = 2147483647 : c < -2147483648 && (c = -2147483648), c = +c, un(c) && (c = b ? 0 : d.length - 1), c < 0 && (c = d.length + c), c >= d.length) {
      if (b) return -1;
      c = d.length - 1;
    } else if (c < 0)
      if (b) c = 0;
      else return -1;
    if (typeof u == "string" && (u = h.from(u, w)), h.isBuffer(u))
      return u.length === 0 ? -1 : ge(d, u, c, w, b);
    if (typeof u == "number")
      return u = u & 255, typeof Uint8Array.prototype.indexOf == "function" ? b ? Uint8Array.prototype.indexOf.call(d, u, c) : Uint8Array.prototype.lastIndexOf.call(d, u, c) : ge(d, [u], c, w, b);
    throw new TypeError("val must be string, number or Buffer");
  }
  function ge(d, u, c, w, b) {
    let x = 1, P = d.length, X = u.length;
    if (w !== void 0 && (w = String(w).toLowerCase(), w === "ucs2" || w === "ucs-2" || w === "utf16le" || w === "utf-16le")) {
      if (d.length < 2 || u.length < 2)
        return -1;
      x = 2, P /= 2, X /= 2, c /= 2;
    }
    function ve(_e, de) {
      return x === 1 ? _e[de] : _e.readUInt16BE(de * x);
    }
    let me;
    if (b) {
      let _e = -1;
      for (me = c; me < P; me++)
        if (ve(d, me) === ve(u, _e === -1 ? 0 : me - _e)) {
          if (_e === -1 && (_e = me), me - _e + 1 === X) return _e * x;
        } else
          _e !== -1 && (me -= me - _e), _e = -1;
    } else
      for (c + X > P && (c = P - X), me = c; me >= 0; me--) {
        let _e = true;
        for (let de = 0; de < X; de++)
          if (ve(d, me + de) !== ve(u, de)) {
            _e = false;
            break;
          }
        if (_e) return me;
      }
    return -1;
  }
  h.prototype.includes = function(u, c, w) {
    return this.indexOf(u, c, w) !== -1;
  }, h.prototype.indexOf = function(u, c, w) {
    return xe(this, u, c, w, true);
  }, h.prototype.lastIndexOf = function(u, c, w) {
    return xe(this, u, c, w, false);
  };
  function Ct(d, u, c, w) {
    c = Number(c) || 0;
    const b = d.length - c;
    w ? (w = Number(w), w > b && (w = b)) : w = b;
    const x = u.length;
    w > x / 2 && (w = x / 2);
    let P;
    for (P = 0; P < w; ++P) {
      const X = parseInt(u.substr(P * 2, 2), 16);
      if (un(X)) return P;
      d[c + P] = X;
    }
    return P;
  }
  function bn(d, u, c, w) {
    return $e(nt(u, d.length - c), d, c, w);
  }
  function Lr(d, u, c, w) {
    return $e(zr(u), d, c, w);
  }
  function Ji(d, u, c, w) {
    return $e(an(u), d, c, w);
  }
  function Vi(d, u, c, w) {
    return $e(eo(u, d.length - c), d, c, w);
  }
  h.prototype.write = function(u, c, w, b) {
    if (c === void 0)
      b = "utf8", w = this.length, c = 0;
    else if (w === void 0 && typeof c == "string")
      b = c, w = this.length, c = 0;
    else if (isFinite(c))
      c = c >>> 0, isFinite(w) ? (w = w >>> 0, b === void 0 && (b = "utf8")) : (b = w, w = void 0);
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    const x = this.length - c;
    if ((w === void 0 || w > x) && (w = x), u.length > 0 && (w < 0 || c < 0) || c > this.length)
      throw new RangeError("Attempt to write outside buffer bounds");
    b || (b = "utf8");
    let P = false;
    for (; ; )
      switch (b) {
        case "hex":
          return Ct(this, u, c, w);
        case "utf8":
        case "utf-8":
          return bn(this, u, c, w);
        case "ascii":
        case "latin1":
        case "binary":
          return Lr(this, u, c, w);
        case "base64":
          return Ji(this, u, c, w);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Vi(this, u, c, w);
        default:
          if (P) throw new TypeError("Unknown encoding: " + b);
          b = ("" + b).toLowerCase(), P = true;
      }
  }, h.prototype.toJSON = function() {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0)
    };
  };
  function Yi(d, u, c) {
    return u === 0 && c === d.length ? r.fromByteArray(d) : r.fromByteArray(d.slice(u, c));
  }
  function pr(d, u, c) {
    c = Math.min(d.length, c);
    const w = [];
    let b = u;
    for (; b < c; ) {
      const x = d[b];
      let P = null, X = x > 239 ? 4 : x > 223 ? 3 : x > 191 ? 2 : 1;
      if (b + X <= c) {
        let ve, me, _e, de;
        switch (X) {
          case 1:
            x < 128 && (P = x);
            break;
          case 2:
            ve = d[b + 1], (ve & 192) === 128 && (de = (x & 31) << 6 | ve & 63, de > 127 && (P = de));
            break;
          case 3:
            ve = d[b + 1], me = d[b + 2], (ve & 192) === 128 && (me & 192) === 128 && (de = (x & 15) << 12 | (ve & 63) << 6 | me & 63, de > 2047 && (de < 55296 || de > 57343) && (P = de));
            break;
          case 4:
            ve = d[b + 1], me = d[b + 2], _e = d[b + 3], (ve & 192) === 128 && (me & 192) === 128 && (_e & 192) === 128 && (de = (x & 15) << 18 | (ve & 63) << 12 | (me & 63) << 6 | _e & 63, de > 65535 && de < 1114112 && (P = de));
        }
      }
      P === null ? (P = 65533, X = 1) : P > 65535 && (P -= 65536, w.push(P >>> 10 & 1023 | 55296), P = 56320 | P & 1023), w.push(P), b += X;
    }
    return Zi(w);
  }
  const Mr = 4096;
  function Zi(d) {
    const u = d.length;
    if (u <= Mr)
      return String.fromCharCode.apply(String, d);
    let c = "", w = 0;
    for (; w < u; )
      c += String.fromCharCode.apply(
        String,
        d.slice(w, w += Mr)
      );
    return c;
  }
  function Mt(d, u, c) {
    let w = "";
    c = Math.min(d.length, c);
    for (let b = u; b < c; ++b)
      w += String.fromCharCode(d[b] & 127);
    return w;
  }
  function Pt(d, u, c) {
    let w = "";
    c = Math.min(d.length, c);
    for (let b = u; b < c; ++b)
      w += String.fromCharCode(d[b]);
    return w;
  }
  function Xi(d, u, c) {
    const w = d.length;
    (!u || u < 0) && (u = 0), (!c || c < 0 || c > w) && (c = w);
    let b = "";
    for (let x = u; x < c; ++x)
      b += to[d[x]];
    return b;
  }
  function $n(d, u, c) {
    const w = d.slice(u, c);
    let b = "";
    for (let x = 0; x < w.length - 1; x += 2)
      b += String.fromCharCode(w[x] + w[x + 1] * 256);
    return b;
  }
  h.prototype.slice = function(u, c) {
    const w = this.length;
    u = ~~u, c = c === void 0 ? w : ~~c, u < 0 ? (u += w, u < 0 && (u = 0)) : u > w && (u = w), c < 0 ? (c += w, c < 0 && (c = 0)) : c > w && (c = w), c < u && (c = u);
    const b = this.subarray(u, c);
    return Object.setPrototypeOf(b, h.prototype), b;
  };
  function he(d, u, c) {
    if (d % 1 !== 0 || d < 0) throw new RangeError("offset is not uint");
    if (d + u > c) throw new RangeError("Trying to access beyond buffer length");
  }
  h.prototype.readUintLE = h.prototype.readUIntLE = function(u, c, w) {
    u = u >>> 0, c = c >>> 0, w || he(u, c, this.length);
    let b = this[u], x = 1, P = 0;
    for (; ++P < c && (x *= 256); )
      b += this[u + P] * x;
    return b;
  }, h.prototype.readUintBE = h.prototype.readUIntBE = function(u, c, w) {
    u = u >>> 0, c = c >>> 0, w || he(u, c, this.length);
    let b = this[u + --c], x = 1;
    for (; c > 0 && (x *= 256); )
      b += this[u + --c] * x;
    return b;
  }, h.prototype.readUint8 = h.prototype.readUInt8 = function(u, c) {
    return u = u >>> 0, c || he(u, 1, this.length), this[u];
  }, h.prototype.readUint16LE = h.prototype.readUInt16LE = function(u, c) {
    return u = u >>> 0, c || he(u, 2, this.length), this[u] | this[u + 1] << 8;
  }, h.prototype.readUint16BE = h.prototype.readUInt16BE = function(u, c) {
    return u = u >>> 0, c || he(u, 2, this.length), this[u] << 8 | this[u + 1];
  }, h.prototype.readUint32LE = h.prototype.readUInt32LE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), (this[u] | this[u + 1] << 8 | this[u + 2] << 16) + this[u + 3] * 16777216;
  }, h.prototype.readUint32BE = h.prototype.readUInt32BE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), this[u] * 16777216 + (this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3]);
  }, h.prototype.readBigUInt64LE = Ve(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const c = this[u], w = this[u + 7];
    (c === void 0 || w === void 0) && Fe(u, this.length - 8);
    const b = c + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24, x = this[++u] + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + w * 2 ** 24;
    return BigInt(b) + (BigInt(x) << BigInt(32));
  }), h.prototype.readBigUInt64BE = Ve(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const c = this[u], w = this[u + 7];
    (c === void 0 || w === void 0) && Fe(u, this.length - 8);
    const b = c * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u], x = this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + w;
    return (BigInt(b) << BigInt(32)) + BigInt(x);
  }), h.prototype.readIntLE = function(u, c, w) {
    u = u >>> 0, c = c >>> 0, w || he(u, c, this.length);
    let b = this[u], x = 1, P = 0;
    for (; ++P < c && (x *= 256); )
      b += this[u + P] * x;
    return x *= 128, b >= x && (b -= Math.pow(2, 8 * c)), b;
  }, h.prototype.readIntBE = function(u, c, w) {
    u = u >>> 0, c = c >>> 0, w || he(u, c, this.length);
    let b = c, x = 1, P = this[u + --b];
    for (; b > 0 && (x *= 256); )
      P += this[u + --b] * x;
    return x *= 128, P >= x && (P -= Math.pow(2, 8 * c)), P;
  }, h.prototype.readInt8 = function(u, c) {
    return u = u >>> 0, c || he(u, 1, this.length), this[u] & 128 ? (255 - this[u] + 1) * -1 : this[u];
  }, h.prototype.readInt16LE = function(u, c) {
    u = u >>> 0, c || he(u, 2, this.length);
    const w = this[u] | this[u + 1] << 8;
    return w & 32768 ? w | 4294901760 : w;
  }, h.prototype.readInt16BE = function(u, c) {
    u = u >>> 0, c || he(u, 2, this.length);
    const w = this[u + 1] | this[u] << 8;
    return w & 32768 ? w | 4294901760 : w;
  }, h.prototype.readInt32LE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), this[u] | this[u + 1] << 8 | this[u + 2] << 16 | this[u + 3] << 24;
  }, h.prototype.readInt32BE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), this[u] << 24 | this[u + 1] << 16 | this[u + 2] << 8 | this[u + 3];
  }, h.prototype.readBigInt64LE = Ve(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const c = this[u], w = this[u + 7];
    (c === void 0 || w === void 0) && Fe(u, this.length - 8);
    const b = this[u + 4] + this[u + 5] * 2 ** 8 + this[u + 6] * 2 ** 16 + (w << 24);
    return (BigInt(b) << BigInt(32)) + BigInt(c + this[++u] * 2 ** 8 + this[++u] * 2 ** 16 + this[++u] * 2 ** 24);
  }), h.prototype.readBigInt64BE = Ve(function(u) {
    u = u >>> 0, Wt(u, "offset");
    const c = this[u], w = this[u + 7];
    (c === void 0 || w === void 0) && Fe(u, this.length - 8);
    const b = (c << 24) + // Overflow
    this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + this[++u];
    return (BigInt(b) << BigInt(32)) + BigInt(this[++u] * 2 ** 24 + this[++u] * 2 ** 16 + this[++u] * 2 ** 8 + w);
  }), h.prototype.readFloatLE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), i.read(this, u, true, 23, 4);
  }, h.prototype.readFloatBE = function(u, c) {
    return u = u >>> 0, c || he(u, 4, this.length), i.read(this, u, false, 23, 4);
  }, h.prototype.readDoubleLE = function(u, c) {
    return u = u >>> 0, c || he(u, 8, this.length), i.read(this, u, true, 52, 8);
  }, h.prototype.readDoubleBE = function(u, c) {
    return u = u >>> 0, c || he(u, 8, this.length), i.read(this, u, false, 52, 8);
  };
  function Me(d, u, c, w, b, x) {
    if (!h.isBuffer(d)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (u > b || u < x) throw new RangeError('"value" argument is out of bounds');
    if (c + w > d.length) throw new RangeError("Index out of range");
  }
  h.prototype.writeUintLE = h.prototype.writeUIntLE = function(u, c, w, b) {
    if (u = +u, c = c >>> 0, w = w >>> 0, !b) {
      const X = Math.pow(2, 8 * w) - 1;
      Me(this, u, c, w, X, 0);
    }
    let x = 1, P = 0;
    for (this[c] = u & 255; ++P < w && (x *= 256); )
      this[c + P] = u / x & 255;
    return c + w;
  }, h.prototype.writeUintBE = h.prototype.writeUIntBE = function(u, c, w, b) {
    if (u = +u, c = c >>> 0, w = w >>> 0, !b) {
      const X = Math.pow(2, 8 * w) - 1;
      Me(this, u, c, w, X, 0);
    }
    let x = w - 1, P = 1;
    for (this[c + x] = u & 255; --x >= 0 && (P *= 256); )
      this[c + x] = u / P & 255;
    return c + w;
  }, h.prototype.writeUint8 = h.prototype.writeUInt8 = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 1, 255, 0), this[c] = u & 255, c + 1;
  }, h.prototype.writeUint16LE = h.prototype.writeUInt16LE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 2, 65535, 0), this[c] = u & 255, this[c + 1] = u >>> 8, c + 2;
  }, h.prototype.writeUint16BE = h.prototype.writeUInt16BE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 2, 65535, 0), this[c] = u >>> 8, this[c + 1] = u & 255, c + 2;
  }, h.prototype.writeUint32LE = h.prototype.writeUInt32LE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 4, 4294967295, 0), this[c + 3] = u >>> 24, this[c + 2] = u >>> 16, this[c + 1] = u >>> 8, this[c] = u & 255, c + 4;
  }, h.prototype.writeUint32BE = h.prototype.writeUInt32BE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 4, 4294967295, 0), this[c] = u >>> 24, this[c + 1] = u >>> 16, this[c + 2] = u >>> 8, this[c + 3] = u & 255, c + 4;
  };
  function $r(d, u, c, w, b) {
    Sn(u, w, b, d, c, 7);
    let x = Number(u & BigInt(4294967295));
    d[c++] = x, x = x >> 8, d[c++] = x, x = x >> 8, d[c++] = x, x = x >> 8, d[c++] = x;
    let P = Number(u >> BigInt(32) & BigInt(4294967295));
    return d[c++] = P, P = P >> 8, d[c++] = P, P = P >> 8, d[c++] = P, P = P >> 8, d[c++] = P, c;
  }
  function Gr(d, u, c, w, b) {
    Sn(u, w, b, d, c, 7);
    let x = Number(u & BigInt(4294967295));
    d[c + 7] = x, x = x >> 8, d[c + 6] = x, x = x >> 8, d[c + 5] = x, x = x >> 8, d[c + 4] = x;
    let P = Number(u >> BigInt(32) & BigInt(4294967295));
    return d[c + 3] = P, P = P >> 8, d[c + 2] = P, P = P >> 8, d[c + 1] = P, P = P >> 8, d[c] = P, c + 8;
  }
  h.prototype.writeBigUInt64LE = Ve(function(u, c = 0) {
    return $r(this, u, c, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeBigUInt64BE = Ve(function(u, c = 0) {
    return Gr(this, u, c, BigInt(0), BigInt("0xffffffffffffffff"));
  }), h.prototype.writeIntLE = function(u, c, w, b) {
    if (u = +u, c = c >>> 0, !b) {
      const ve = Math.pow(2, 8 * w - 1);
      Me(this, u, c, w, ve - 1, -ve);
    }
    let x = 0, P = 1, X = 0;
    for (this[c] = u & 255; ++x < w && (P *= 256); )
      u < 0 && X === 0 && this[c + x - 1] !== 0 && (X = 1), this[c + x] = (u / P >> 0) - X & 255;
    return c + w;
  }, h.prototype.writeIntBE = function(u, c, w, b) {
    if (u = +u, c = c >>> 0, !b) {
      const ve = Math.pow(2, 8 * w - 1);
      Me(this, u, c, w, ve - 1, -ve);
    }
    let x = w - 1, P = 1, X = 0;
    for (this[c + x] = u & 255; --x >= 0 && (P *= 256); )
      u < 0 && X === 0 && this[c + x + 1] !== 0 && (X = 1), this[c + x] = (u / P >> 0) - X & 255;
    return c + w;
  }, h.prototype.writeInt8 = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 1, 127, -128), u < 0 && (u = 255 + u + 1), this[c] = u & 255, c + 1;
  }, h.prototype.writeInt16LE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 2, 32767, -32768), this[c] = u & 255, this[c + 1] = u >>> 8, c + 2;
  }, h.prototype.writeInt16BE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 2, 32767, -32768), this[c] = u >>> 8, this[c + 1] = u & 255, c + 2;
  }, h.prototype.writeInt32LE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 4, 2147483647, -2147483648), this[c] = u & 255, this[c + 1] = u >>> 8, this[c + 2] = u >>> 16, this[c + 3] = u >>> 24, c + 4;
  }, h.prototype.writeInt32BE = function(u, c, w) {
    return u = +u, c = c >>> 0, w || Me(this, u, c, 4, 2147483647, -2147483648), u < 0 && (u = 4294967295 + u + 1), this[c] = u >>> 24, this[c + 1] = u >>> 16, this[c + 2] = u >>> 8, this[c + 3] = u & 255, c + 4;
  }, h.prototype.writeBigInt64LE = Ve(function(u, c = 0) {
    return $r(this, u, c, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }), h.prototype.writeBigInt64BE = Ve(function(u, c = 0) {
    return Gr(this, u, c, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  });
  function $t(d, u, c, w, b, x) {
    if (c + w > d.length) throw new RangeError("Index out of range");
    if (c < 0) throw new RangeError("Index out of range");
  }
  function Cn(d, u, c, w, b) {
    return u = +u, c = c >>> 0, b || $t(d, u, c, 4), i.write(d, u, c, w, 23, 4), c + 4;
  }
  h.prototype.writeFloatLE = function(u, c, w) {
    return Cn(this, u, c, true, w);
  }, h.prototype.writeFloatBE = function(u, c, w) {
    return Cn(this, u, c, false, w);
  };
  function Wr(d, u, c, w, b) {
    return u = +u, c = c >>> 0, b || $t(d, u, c, 8), i.write(d, u, c, w, 52, 8), c + 8;
  }
  h.prototype.writeDoubleLE = function(u, c, w) {
    return Wr(this, u, c, true, w);
  }, h.prototype.writeDoubleBE = function(u, c, w) {
    return Wr(this, u, c, false, w);
  }, h.prototype.copy = function(u, c, w, b) {
    if (!h.isBuffer(u)) throw new TypeError("argument should be a Buffer");
    if (w || (w = 0), !b && b !== 0 && (b = this.length), c >= u.length && (c = u.length), c || (c = 0), b > 0 && b < w && (b = w), b === w || u.length === 0 || this.length === 0) return 0;
    if (c < 0)
      throw new RangeError("targetStart out of bounds");
    if (w < 0 || w >= this.length) throw new RangeError("Index out of range");
    if (b < 0) throw new RangeError("sourceEnd out of bounds");
    b > this.length && (b = this.length), u.length - c < b - w && (b = u.length - c + w);
    const x = b - w;
    return this === u && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(c, w, b) : Uint8Array.prototype.set.call(
      u,
      this.subarray(w, b),
      c
    ), x;
  }, h.prototype.fill = function(u, c, w, b) {
    if (typeof u == "string") {
      if (typeof c == "string" ? (b = c, c = 0, w = this.length) : typeof w == "string" && (b = w, w = this.length), b !== void 0 && typeof b != "string")
        throw new TypeError("encoding must be a string");
      if (typeof b == "string" && !h.isEncoding(b))
        throw new TypeError("Unknown encoding: " + b);
      if (u.length === 1) {
        const P = u.charCodeAt(0);
        (b === "utf8" && P < 128 || b === "latin1") && (u = P);
      }
    } else typeof u == "number" ? u = u & 255 : typeof u == "boolean" && (u = Number(u));
    if (c < 0 || this.length < c || this.length < w)
      throw new RangeError("Out of range index");
    if (w <= c)
      return this;
    c = c >>> 0, w = w === void 0 ? this.length : w >>> 0, u || (u = 0);
    let x;
    if (typeof u == "number")
      for (x = c; x < w; ++x)
        this[x] = u;
    else {
      const P = h.isBuffer(u) ? u : h.from(u, b), X = P.length;
      if (X === 0)
        throw new TypeError('The value "' + u + '" is invalid for argument "value"');
      for (x = 0; x < w - c; ++x)
        this[x + c] = P[x % X];
    }
    return this;
  };
  const pt = {};
  function Gt(d, u, c) {
    pt[d] = class extends c {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: u.apply(this, arguments),
          writable: true,
          configurable: true
        }), this.name = `${this.name} [${d}]`, this.stack, delete this.name;
      }
      get code() {
        return d;
      }
      set code(b) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value: b,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${d}]: ${this.message}`;
      }
    };
  }
  Gt(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function(d) {
      return d ? `${d} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  ), Gt(
    "ERR_INVALID_ARG_TYPE",
    function(d, u) {
      return `The "${d}" argument must be of type number. Received type ${typeof u}`;
    },
    TypeError
  ), Gt(
    "ERR_OUT_OF_RANGE",
    function(d, u, c) {
      let w = `The value of "${d}" is out of range.`, b = c;
      return Number.isInteger(c) && Math.abs(c) > 2 ** 32 ? b = Hr(String(c)) : typeof c == "bigint" && (b = String(c), (c > BigInt(2) ** BigInt(32) || c < -(BigInt(2) ** BigInt(32))) && (b = Hr(b)), b += "n"), w += ` It must be ${u}. Received ${b}`, w;
    },
    RangeError
  );
  function Hr(d) {
    let u = "", c = d.length;
    const w = d[0] === "-" ? 1 : 0;
    for (; c >= w + 4; c -= 3)
      u = `_${d.slice(c - 3, c)}${u}`;
    return `${d.slice(0, c)}${u}`;
  }
  function Gn(d, u, c) {
    Wt(u, "offset"), (d[u] === void 0 || d[u + c] === void 0) && Fe(u, d.length - (c + 1));
  }
  function Sn(d, u, c, w, b, x) {
    if (d > c || d < u) {
      const P = typeof u == "bigint" ? "n" : "";
      let X;
      throw u === 0 || u === BigInt(0) ? X = `>= 0${P} and < 2${P} ** ${(x + 1) * 8}${P}` : X = `>= -(2${P} ** ${(x + 1) * 8 - 1}${P}) and < 2 ** ${(x + 1) * 8 - 1}${P}`, new pt.ERR_OUT_OF_RANGE("value", X, d);
    }
    Gn(w, b, x);
  }
  function Wt(d, u) {
    if (typeof d != "number")
      throw new pt.ERR_INVALID_ARG_TYPE(u, "number", d);
  }
  function Fe(d, u, c) {
    throw Math.floor(d) !== d ? (Wt(d, c), new pt.ERR_OUT_OF_RANGE("offset", "an integer", d)) : u < 0 ? new pt.ERR_BUFFER_OUT_OF_BOUNDS() : new pt.ERR_OUT_OF_RANGE(
      "offset",
      `>= 0 and <= ${u}`,
      d
    );
  }
  const En = /[^+/0-9A-Za-z-_]/g;
  function Qi(d) {
    if (d = d.split("=")[0], d = d.trim().replace(En, ""), d.length < 2) return "";
    for (; d.length % 4 !== 0; )
      d = d + "=";
    return d;
  }
  function nt(d, u) {
    u = u || 1 / 0;
    let c;
    const w = d.length;
    let b = null;
    const x = [];
    for (let P = 0; P < w; ++P) {
      if (c = d.charCodeAt(P), c > 55295 && c < 57344) {
        if (!b) {
          if (c > 56319) {
            (u -= 3) > -1 && x.push(239, 191, 189);
            continue;
          } else if (P + 1 === w) {
            (u -= 3) > -1 && x.push(239, 191, 189);
            continue;
          }
          b = c;
          continue;
        }
        if (c < 56320) {
          (u -= 3) > -1 && x.push(239, 191, 189), b = c;
          continue;
        }
        c = (b - 55296 << 10 | c - 56320) + 65536;
      } else b && (u -= 3) > -1 && x.push(239, 191, 189);
      if (b = null, c < 128) {
        if ((u -= 1) < 0) break;
        x.push(c);
      } else if (c < 2048) {
        if ((u -= 2) < 0) break;
        x.push(
          c >> 6 | 192,
          c & 63 | 128
        );
      } else if (c < 65536) {
        if ((u -= 3) < 0) break;
        x.push(
          c >> 12 | 224,
          c >> 6 & 63 | 128,
          c & 63 | 128
        );
      } else if (c < 1114112) {
        if ((u -= 4) < 0) break;
        x.push(
          c >> 18 | 240,
          c >> 12 & 63 | 128,
          c >> 6 & 63 | 128,
          c & 63 | 128
        );
      } else
        throw new Error("Invalid code point");
    }
    return x;
  }
  function zr(d) {
    const u = [];
    for (let c = 0; c < d.length; ++c)
      u.push(d.charCodeAt(c) & 255);
    return u;
  }
  function eo(d, u) {
    let c, w, b;
    const x = [];
    for (let P = 0; P < d.length && !((u -= 2) < 0); ++P)
      c = d.charCodeAt(P), w = c >> 8, b = c % 256, x.push(b), x.push(w);
    return x;
  }
  function an(d) {
    return r.toByteArray(Qi(d));
  }
  function $e(d, u, c, w) {
    let b;
    for (b = 0; b < w && !(b + c >= u.length || b >= d.length); ++b)
      u[b + c] = d[b];
    return b;
  }
  function Ge(d, u) {
    return d instanceof u || d != null && d.constructor != null && d.constructor.name != null && d.constructor.name === u.name;
  }
  function un(d) {
    return d !== d;
  }
  const to = (function() {
    const d = "0123456789abcdef", u = new Array(256);
    for (let c = 0; c < 16; ++c) {
      const w = c * 16;
      for (let b = 0; b < 16; ++b)
        u[w + b] = d[c] + d[b];
    }
    return u;
  })();
  function Ve(d) {
    return typeof BigInt > "u" ? no : d;
  }
  function no() {
    throw new Error("BigInt not supported");
  }
})(Bl);
var Rr = ft("hostingApi", false);

// src/cli/index.ts
function getConfig() {
  const url = process.env.TLON_URL;
  const ship = process.env.TLON_SHIP;
  const code = process.env.TLON_CODE;
  if (!url || !ship || !code) {
    const missing = [];
    if (!url) missing.push("TLON_URL");
    if (!ship) missing.push("TLON_SHIP");
    if (!code) missing.push("TLON_CODE");
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
  return { url, ship: ship.startsWith("~") ? ship : `~${ship}`, code };
}
function setupClient() {
  const { url, ship, code } = getConfig();
  g1({
    shipName: ship,
    shipUrl: url,
    getCode: async () => code
  });
  return ship;
}
function output(success, data, error) {
  if (success) {
    console.log(JSON.stringify({ success: true, data }));
  } else {
    console.log(JSON.stringify({ success: false, error }));
  }
}
async function cmdContacts(args) {
  const action = args[0];
  const ship = setupClient();
  switch (action) {
    case "self": {
      const contacts = await H_();
      return contacts.find((c) => c.id === ship) || { id: ship };
    }
    case "get": {
      const targetShip = getArg(args, "--ship");
      if (!targetShip) throw new Error("--ship required");
      const contacts = await H_();
      return contacts.find((c) => c.id === targetShip) || { id: targetShip };
    }
    case "list": {
      return await H_();
    }
    case "update": {
      const nickname = getArg(args, "--nickname");
      const bio = getArg(args, "--bio");
      const status = getArg(args, "--status");
      const avatarImage = getArg(args, "--avatar");
      const coverImage = getArg(args, "--cover");
      await K_({
        id: ship,
        ...nickname && { nickname },
        ...bio && { bio },
        ...status && { status },
        ...avatarImage && { avatarImage },
        ...coverImage && { coverImage }
      });
      return { updated: true };
    }
    default:
      throw new Error(`Unknown contacts action: ${action}`);
  }
}
async function cmdChannels(args) {
  const action = args[0];
  setupClient();
  switch (action) {
    case "list": {
      const result = await ye({ app: "channels", path: "/v2/channels" });
      return Object.keys(result || {}).map((nest) => ({ nest, kind: nest.split("/")[0] }));
    }
    case "groups": {
      const groups = await C_();
      return groups.map((g) => ({ id: g.id, title: g.title }));
    }
    case "dms": {
      const result = await ye({ app: "chat", path: "/dm" });
      return result || [];
    }
    case "info": {
      const channel = getArg(args, "--channel");
      if (!channel) throw new Error("--channel required");
      const result = await ye({ app: "channels", path: `/v2/channels/${encodeURIComponent(channel)}` });
      return result;
    }
    case "search": {
      const channel = getArg(args, "--channel");
      const query = getArg(args, "--query");
      if (!channel || !query) throw new Error("--channel and --query required");
      return await Z1({ channelId: channel, query });
    }
    default:
      throw new Error(`Unknown channels action: ${action}`);
  }
}
async function cmdHistory(args) {
  setupClient();
  const target = getArg(args, "--target");
  const limit = parseInt(getArg(args, "--limit") || "20", 10);
  if (!target) throw new Error("--target required");
  const { posts } = await N1({
    channelId: target,
    count: limit,
    mode: "newest"
  });
  return posts.map((p) => ({
    id: p.id,
    author: p.authorId,
    sent: p.sentAt,
    content: p.textContent,
    replyCount: p.replyCount || 0
  }));
}
async function cmdGroups(args) {
  const action = args[0];
  const ship = setupClient();
  switch (action) {
    case "list": {
      const groups = await C_();
      return groups.map((g) => ({
        id: g.id,
        title: g.title,
        description: g.description,
        privacy: g.privacy,
        memberCount: g.members?.length || 0
      }));
    }
    case "info": {
      const groupId = getArg(args, "--group");
      if (!groupId) throw new Error("--group required");
      return await b_(groupId);
    }
    case "create": {
      const title = getArg(args, "--title");
      const description = getArg(args, "--description") || "";
      if (!title) throw new Error("--title required");
      return await I_({
        group: {
          id: "",
          title,
          description,
          privacy: "private",
          currentUserIsMember: true,
          currentUserIsHost: true,
          hostUserId: ship
        }
      });
    }
    case "delete": {
      const groupId = getArg(args, "--group");
      if (!groupId) throw new Error("--group required");
      await E_({ groupId });
      return { deleted: groupId };
    }
    case "join": {
      const groupId = getArg(args, "--group");
      if (!groupId) throw new Error("--group required");
      await $({
        app: "groups",
        mark: "group-join",
        json: { flag: groupId, "join-all": true }
      });
      return { joined: groupId };
    }
    case "leave": {
      const groupId = getArg(args, "--group");
      if (!groupId) throw new Error("--group required");
      await h_({ groupId });
      return { left: groupId };
    }
    case "invite": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      await u_({ groupId, contactIds: ships });
      return { invited: ships, group: groupId };
    }
    case "kick": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      await l_({ groupId, contactIds: ships });
      return { kicked: ships, group: groupId };
    }
    case "ban": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      await f_({ groupId, contactIds: ships });
      return { banned: ships, group: groupId };
    }
    case "unban": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      await p_({ groupId, contactIds: ships });
      return { unbanned: ships, group: groupId };
    }
    case "set-privacy": {
      const groupId = getArg(args, "--group");
      const privacy = getArg(args, "--privacy");
      if (!groupId || !privacy) throw new Error("--group and --privacy required");
      await g_({ groupId, privacy });
      return { group: groupId, privacy };
    }
    case "accept-join": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      for (const contactId of ships) {
        await o_({ groupId, contactId });
      }
      return { accepted: ships, group: groupId };
    }
    case "reject-join": {
      const groupId = getArg(args, "--group");
      const ships = getArgs(args, "--ships");
      if (!groupId || ships.length === 0) throw new Error("--group and --ships required");
      for (const contactId of ships) {
        await s_({ groupId, contactId });
      }
      return { rejected: ships, group: groupId };
    }
    case "add-role": {
      const groupId = getArg(args, "--group");
      const roleId = getArg(args, "--role");
      const title = getArg(args, "--title") || roleId;
      const description = getArg(args, "--description") || "";
      if (!groupId || !roleId) throw new Error("--group and --role required");
      await N_({ groupId, roleId, title, description });
      return { role: roleId, group: groupId };
    }
    case "delete-role": {
      const groupId = getArg(args, "--group");
      const roleId = getArg(args, "--role");
      if (!groupId || !roleId) throw new Error("--group and --role required");
      await O_({ groupId, roleId });
      return { deleted: roleId, group: groupId };
    }
    case "assign-role": {
      const groupId = getArg(args, "--group");
      const roleId = getArg(args, "--role");
      const ships = getArgs(args, "--ships");
      if (!groupId || !roleId || ships.length === 0) throw new Error("--group, --role and --ships required");
      await D_({ groupId, roleId, contactIds: ships });
      return { role: roleId, assigned: ships, group: groupId };
    }
    case "remove-role": {
      const groupId = getArg(args, "--group");
      const roleId = getArg(args, "--role");
      const ships = getArgs(args, "--ships");
      if (!groupId || !roleId || ships.length === 0) throw new Error("--group, --role and --ships required");
      await L_({ groupId, roleId, contactIds: ships });
      return { role: roleId, removed: ships, group: groupId };
    }
    default:
      throw new Error(`Unknown groups action: ${action}`);
  }
}
async function cmdPosts(args) {
  const action = args[0];
  const ship = setupClient();
  switch (action) {
    case "send": {
      const channel = getArg(args, "--channel");
      const content = getArg(args, "--content");
      if (!channel || !content) throw new Error("--channel and --content required");
      await R1({
        channelId: channel,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }]
      });
      return { sent: true, channel };
    }
    case "reply": {
      const channel = getArg(args, "--channel");
      const postId = getArg(args, "--post-id");
      const content = getArg(args, "--content");
      if (!channel || !postId || !content) throw new Error("--channel, --post-id and --content required");
      await U1({
        channelId: channel,
        parentId: postId,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }]
      });
      return { replied: true, postId };
    }
    case "edit": {
      const channel = getArg(args, "--channel");
      const postId = getArg(args, "--post-id");
      const content = getArg(args, "--content");
      if (!channel || !postId || !content) throw new Error("--channel, --post-id and --content required");
      await P1({
        channelId: channel,
        postId,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }]
      });
      return { edited: true, postId };
    }
    case "delete": {
      const channel = getArg(args, "--channel");
      const postId = getArg(args, "--post-id");
      if (!channel || !postId) throw new Error("--channel and --post-id required");
      await H1({ channelId: channel, postId });
      return { deleted: true, postId };
    }
    case "react": {
      const channel = getArg(args, "--channel");
      const postId = getArg(args, "--post-id");
      const emoji = getArg(args, "--emoji");
      const remove = args.includes("--remove");
      if (!channel || !postId) throw new Error("--channel and --post-id required");
      if (remove) {
        await L1({ channelId: channel, postId, odor: emoji || "" });
        return { removed: true, postId };
      } else {
        if (!emoji) throw new Error("--emoji required for adding reaction");
        await D1({ channelId: channel, postId, odor: emoji });
        return { reacted: true, emoji, postId };
      }
    }
    default:
      throw new Error(`Unknown posts action: ${action}`);
  }
}
async function cmdDm(args) {
  const action = args[0];
  setupClient();
  switch (action) {
    case "accept": {
      const targetShip = getArg(args, "--ship");
      if (!targetShip) throw new Error("--ship required");
      await A1({ odor: targetShip, accept: true });
      return { accepted: targetShip };
    }
    case "decline": {
      const targetShip = getArg(args, "--ship");
      if (!targetShip) throw new Error("--ship required");
      await A1({ odor: targetShip, accept: false });
      return { declined: targetShip };
    }
    case "create": {
      const ships = getArgs(args, "--ships");
      if (ships.length === 0) throw new Error("--ships required");
      const result = await x1({ contactIds: ships });
      return result;
    }
    default:
      throw new Error(`Unknown dm action: ${action}`);
  }
}
async function cmdActivity(args) {
  const action = args[0];
  const limit = parseInt(getArg(args, "--limit") || "20", 10);
  setupClient();
  switch (action) {
    case "unread": {
      return await v1();
    }
    case "mentions":
    case "all": {
      const activity = await b1();
      if (action === "mentions") {
        return activity.filter((a) => a.type === "mention").slice(0, limit);
      }
      return activity.slice(0, limit);
    }
    default:
      throw new Error(`Unknown activity action: ${action}`);
  }
}
async function cmdSettings(args) {
  const action = args[0];
  setupClient();
  switch (action) {
    case "get": {
      return await V_();
    }
    case "set": {
      const key = getArg(args, "--key");
      const value = getArg(args, "--value");
      if (!key || value === void 0) throw new Error("--key and --value required");
      let parsedValue;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }
      await J_({ key, value: parsedValue });
      return { set: key, value: parsedValue };
    }
    default:
      throw new Error(`Unknown settings action: ${action}`);
  }
}
function getArg(args, name) {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return void 0;
}
function getArgs(args, name) {
  const idx = args.indexOf(name);
  if (idx === -1) return [];
  const result = [];
  for (let i = idx + 1; i < args.length; i++) {
    if (args[i].startsWith("--")) break;
    result.push(args[i].startsWith("~") ? args[i] : `~${args[i]}`);
  }
  return result;
}
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const subArgs = args.slice(1);
  try {
    let result;
    switch (command) {
      case "contacts":
        result = await cmdContacts(subArgs);
        break;
      case "channels":
        result = await cmdChannels(subArgs);
        break;
      case "history":
        result = await cmdHistory(subArgs);
        break;
      case "groups":
        result = await cmdGroups(subArgs);
        break;
      case "posts":
        result = await cmdPosts(subArgs);
        break;
      case "dm":
        result = await cmdDm(subArgs);
        break;
      case "activity":
        result = await cmdActivity(subArgs);
        break;
      case "settings":
        result = await cmdSettings(subArgs);
        break;
      case "--help":
      case "-h":
      case void 0:
        console.log(`Tlon CLI - Interact with Tlon/Urbit

Commands:
  contacts  self|get|list|update       Manage contacts and profiles
  channels  list|groups|dms|info|search List channels and search
  history   --target <nest|ship>       Fetch message history
  groups    list|info|create|join|...  Full group management
  posts     send|reply|edit|delete|react Manage posts
  dm        accept|decline|create      Manage DMs
  activity  unread|mentions|all        Check activity
  settings  get|set                    Manage settings

Environment:
  TLON_URL   Ship URL (e.g., https://your-ship.tlon.network)
  TLON_SHIP  Ship name (e.g., ~zod)
  TLON_CODE  Access code`);
        return 0;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
    output(true, result);
    return 0;
  } catch (err) {
    output(false, void 0, err instanceof Error ? err.message : String(err));
    return 1;
  }
}
main().then(process.exit);
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
