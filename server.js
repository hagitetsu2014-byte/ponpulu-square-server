import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L6C4VDGGTTN1C";
const SQUARE_API_VERSION = process.env.SQUARE_API_VERSION || "2025-10-16";

// ここに前回作った全対応表を入れる
const SQUARE_ITEM_MAP = {
  "コーラ": "6KMUOICSTV554DSGY2AIE36Y",
  "グレープソーダ": "2OTXGV5NMLG7RRLSNBT2CG2C",
  "ジンジャーエール": "RORB2PBB4R74H6LG2QZXVR4Y",
  "チルソンサイダー": "MPYNNR5IDXK6IMYSEDFGOB3H",
  "オレンジジュース": "MPZJJTJ24CVDDEUHQV5T3WCL",
  "りんごジュース": "I3AMNRAJFET5ZBCT6VNIBGDC",
  "メロンソーダ": "5AZWKRRST5OFYMWMCGJOOTI2",
  "いちごミルク": "JMTUZ6JFJQPKSO7ZITQMPBIB",
  "クリームメロンソーダ": "AUOKW3WKG57QDXQMHC3CK6ER",
  "レモネード": "77DZR4DRPTLNGMM4DNC4RBZC",
  "ノンアルトロピカルソーダ": "SMUPGQ7RS7GQSQHCSGD4XGLH",
  "ノンアルブルーパイン": "7TGYFDJ7AKVHQZO3OLSCZKKD",
  "ノンアルカシスオレンジ": "SKVHCV6XJCAJU6EGLIM75FFQ",
  "ノンアルカシスソーダ": "4OH6NHPNFP6YZZNBW3EKUSH6",
  "ノンアルサングリア": "GBUUKKJAFLRTMIHCA2VSWOFR",

  "コロナビール": "BFWHPI6EWGNCPKUWKGPE35U5",
  "ヒューガルデン": "GFOME4LOK7YBSYHATVW4AZV3",
  "プレミアムモルツ": "QJ44N4B2YZKALPKBSMFR3SVJ",
  "スーパードライ": "N3ADQQDCJTPTTLZPY4INQVBM",
  "レモンサワー": "ES26ZBQJWQVISQWEV24UZ4RL",
  "ハイボール": "HMO6TZSMKFXTC533DJYBUZFL",
  "レモンハイボール": "2GDPG5YG6X4TDTEJ3PMWARNX",
  "トロピカルソーダ": "26PWUB7GWDW4YUUPSBWJEJFF",
  "ブルーパイン": "J5X25C6IHKYV43PPVCUBJA2R",
  "カシスオレンジ": "R5HS2T3IC5MF2LBHGO22HYSZ",
  "カシスソーダ": "BUEUIFU22FYSQAK2CLZTCTY5",
  "サングリア": "27HJVDGXQLJUGHDJ5VJIRQKV",

  "コーヒー（Hot）": "SXZOWXVEQH4WI2XLZ232I6MU",
  "コーヒー（Ice）": "RIAJOTS33MX4AT6SOSTTRKWD",
  "カフェラテ（Hot）": "5KUJDZPCQXO3DKMQ7DTKGFBA",
  "カフェラテ（Ice）": "KHQYRA4KAVWKDK7SSFTAOYIF",
  "ダージリンティー（Hot）": "X3YASKGO6SWTGRCN6RBVJBRC",
  "ダージリンティー（Ice）": "IBMVA2ED7CKN6GBSRJIX5XRC",
  "ミルクティー（Hot）": "JNID2YQNZSEFH7LXUYHL4PB3",
  "ミルクティー（Ice）": "YRISOWDBQIKKYM3AHLK5HXW3",
  "チャイ（Hot）": "V4GLALP2BSCZB7SB4WI6GPRR",
  "チャイ（Ice）": "THDA6YAOQTY2WLQFEG55QFV3",
  "ココア（Hot）": "VE6UVGBVCX2FUPT52DKD462B",
  "ココア（Ice）": "JMP44C4GNJLHOTLWTMH25HR7",
  "抹茶ラテ（Hot）": "PRAW3O6UR6D4KOGNSAGDPXR2",
  "抹茶ラテ（Ice）": "42VVCC2GFAD6FF4SCUUI4PP6",
  "キャラメルラテ（Hot）": "2I4UWESVA4PLL7NRX6TU52J3",
  "キャラメルラテ（Ice）": "V5CYXR2KMMO5GFXPMWMILAAM",

  "唐揚げプレートセット（サラダ・スープ付き）": "MEZQM3YUTRZACQTYFNLUXAUX",
  "デミグラスハンバーグセット（サラダ・スープ付き）": "B5CP3Q3SDV2OEKQD4X73M626",
  "チーズハンバーグセット（サラダ・スープ付き）": "KGUPQ733B3JOMVGS6PE7WYJC",
  "きのこソースハンバーグセット（サラダ・スープ付き）": "GVT6ETB7CEMQWISOQWWCXGGB",
  "シーフードピラフセット（サラダ・スープ付き）": "JGU3UTWGCQQXUU6CRNLHE3WZ",
  "パスタセット（ベーコンとアスパラのカルボナーラ）": "QXARIFJJP6ZLQGXNJBD7AHBP",
  "パスタセット（ベーコンのペペロンチーノ）": "IOCPLTVCIR32P7FR3EP6SIHC",
  "パスタセット（ナスとキノコのミートソース）": "X6FTHQ5HDO4ULBS4IC6KAVFX",
  "パスタセット（シーフードたらこパスタ）": "XDN3NGEMTH7I3E7CRGRQYRU2",
  "ホットドックセット（ヨーグルト・スープ付き）": "CZMZ3UDWYO6RGSLTBBIF5GRM",
  "クロワッサンサンドセット（ツナバジル）": "ZBYJ6WFDSBB5WAZ6XI5F54RL",
  "クロワッサンサンドセット（たまごフィリング）": "ATOO6NRP2ZMVLM5ZH3XKG3HJ",

  "アメリカン（サラミ・マッシュルーム）": "47TFGZQ2VERSH3USZWOKHKNT",
  "シーフード（アンチョビ・シーフード）": "IAXACVD2J5R7YB4H2PPIA7OO",

  "シーフードピラフ": "4NWLYQ5VTKP5KV3ZPVGDFDKD",

  "ベーコンとアスパラのカルボナーラ": "WOHHSIIZ5SI5AD55KGRUNI4M",
  "ベーコンのペペロンチーノ": "55BI34BDBSSR4DVKFAHLKUIE",
  "ナスとキノコのミートソース": "BCJQI64GEK2K4J7I6JALMRT5",
  "シーフードたらこパスタ": "CV2SSTHYERD7MHEFC54UZT7P",

  "フライドポテト": "BOKOJKR2JIAWHZEHKTKSGEXA",
  "唐揚げ": "M4PZEQV4427LHGXZDXGLVDKS",
  "フィッシュ・アンド・チップス": "G5PKDELVHEWIY2LN2DF6SK5H",
  "ポテト＆ナゲット": "D2YWRYBOSOFURSYZVSMNGDH7",

  "チョコレートケーキ": "UNUVVDMVCFUDX4RH3SVAWAUS",
  "レアチーズケーキ": "QAABCTVMO3XDSCAWLFL5ACL7",
  "季節のケーキ": "MVYDK3YFJVC263455NBFAG4W",
  "マフィン各種": "YS7VAWKMA4RQZBDLLPMJCGT5",

  "わんこの贅沢ミルフィーユ ＋ ヤギミルク": "G4IQW7UGP5VIGX47E5I3AELY",
  "グリークヨーグルト ＋ ビーガンクッキー": "WPB34SBLB5SOOHDNRHW7DSKO",
  "単品メニュー（鶏肉団子）": "A2LZSU2ZZWZEXANGXMM6BCUW",
  "単品メニュー（ラムカットステーキ）": "54Y2ERJKX6MAB2EI4HF2V4XF",
  "単品メニュー（牛カットステーキ）": "YM4TTSBMESOPM4BRKYLT6TPH",
  "単品メニュー（まぐろほぐし）": "F4ZDRIRBD353WHYYDDV6TSU3",
  "単品メニュー（豚肉団子）": "57K2KP3RG26NEGX3MAT2RY5F",
  "単品メニュー（ささみほぐし）": "FB7BHRZXQEOUW5ZXBUWWOBSU"
};

function parseOrderItems(itemsText) {
  if (!itemsText || typeof itemsText !== "string") return [];

  return itemsText
    .split(" / ")
    .map(s => s.trim())
    .filter(Boolean)
    .map(entry => {
      const m = entry.match(/^(.*)\s×\s(\d+)$/);
      if (!m) {
        return { raw: entry, name: entry, qty: 1 };
      }
      return {
        raw: entry,
        name: m[1].trim(),
        qty: Number(m[2])
      };
    });
}

function buildSquareLineItems(parsedItems) {
  const lineItems = [];
  const unknownItems = [];

  for (const item of parsedItems) {
    const variationId = SQUARE_ITEM_MAP[item.name];
    if (!variationId) {
      unknownItems.push(item.raw);
      continue;
    }

    lineItems.push({
      quantity: String(item.qty),
      catalog_object_id: variationId
    });
  }

  return { lineItems, unknownItems };
}

app.post("/square/create-order", async (req, res) => {
  try {
    const { name, method, time, items, total, note } = req.body || {};

    if (!items) {
      return res.status(400).json({ ok: false, error: "items is required" });
    }

    const parsedItems = parseOrderItems(items);
    const { lineItems, unknownItems } = buildSquareLineItems(parsedItems);

    if (lineItems.length === 0) {
      return res.status(400).json({
        ok: false,
        error: "square line items is empty",
        unknownItems
      });
    }

    const idempotencyKey = crypto.randomUUID();

    const body = {
      idempotency_key: idempotencyKey,
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: lineItems,
        metadata: {
          customer_name: name || "",
          method: method || "",
          requested_time: time || "",
          order_total_text: total || "",
          note: note || ""
        }
      }
    };

    const squareRes = await fetch("https://connect.squareup.com/v2/orders", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "Square-Version": SQUARE_API_VERSION
      },
      body: JSON.stringify(body)
    });

    const squareJson = await squareRes.json();

    if (!squareRes.ok) {
      return res.status(squareRes.status).json({
        ok: false,
        square: squareJson,
        unknownItems
      });
    }

    return res.json({
      ok: true,
      orderId: squareJson.order?.id || null,
      state: squareJson.order?.state || null,
      unknownItems,
      square: squareJson
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("PONPULU Square order server is running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
