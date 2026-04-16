$(document).ready(function() {
    console.log("Maris System: Quest Link Established!");
});

// クエストのデータベース（チームパインの案を格納）
var questData = [
    {
        title: "01：【算数】牛乳パックの「解体真書」 (Anatomy of Shapes)",
        detail: "家にある空き箱を1つ解体し、ノートにその形を描き写す。各面に「A, B, C...」と名前をつけて「『解体レポート』を作成せよ！",
        hook: "図面じゃなく『立体の皮』を剥げ！"
    },
    {
        title: "02：【国語】接続詞のスイッチング",
        detail: "『今日は雨だ。だから、家で遊ぶ』の接続詞を『しかし』に変えて、後に続く面白い文章を作れ！",
        hook: "なんで「家で遊ぶ」になるのか、想像しながら作ってみて！"
    },
    {
        title: "03：【社会】日本の端っこ・呪文",
        detail: "日本の東西南北、一番端っこの島の名前を、早口言葉で3回唱えよ！",
        hook: "舌を噛まないでね？"
    },
    {
        title: "04：【算数】 小数の計算（足し算・引き算のひっ算）",
        detail: "Khan Academyの「Decimal addition/subtraction」を3つクリアせよ！",
        hook: "デザインと同じで、ミリ単位（位）のズレが命取り。位さえ合えば、あとはただの足し算!"
    }
    ,
    {
        title: "05：【国語】ガラスペンの「美」の言語化",
        detail: "お気に入りのインクの色を、世界で一番魅力的に感じる「名前（キャッチコピー）」を3つ考える。",
        hook: "（例：夜明けの深海ブルー、など）"
    }
    ,
    {
        title: "06：【英語】10秒間のアフレコ・スター",
        detail: " BBCのアプリや英検の教材から「一番かっこいい音」がする1文を選び、ナレーターになりきって3回録音！",
        hook: "一番の自信作をマミーに送る。"
    }
];

// クエストをランダムに表示する関数
function summonQuest() {
    const randomIndex = Math.floor(Math.random() * questData.length);
    const quest = questData[randomIndex];

    // HTMLの表示エリアを書き換える
    $('#quest-title').text(quest.title).removeClass('completed');
    $('#quest-detail').html(`${quest.detail}<br><br><strong>${quest.hook}</strong>`);
    $('#complete-btn').show().text("MISSION COMPLETE");
}

// 完了処理
$('#complete-btn').on('click', function() {
    // タイトルに打ち消し線を入れ、ボタンを消す
    $('#quest-title').addClass('completed');
    $(this).fadeOut();
    
    // 演出：ここでHPバーを動かす関数を呼ぶのもアリだぜ！
    console.log("Maris System: Quest Defeated.");
});

// ページ読み込み時に最初のクエストを出す
$(document).ready(function() {
    console.log("Maris System: Initializing...");
    if (typeof questData !== 'undefined') {
        summonQuest(); // ここで呼び出す！
    } else {
        console.error("Error: questData is not defined. Check quest.js path!");
    }
});