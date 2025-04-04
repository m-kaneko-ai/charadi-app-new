﻿import React, { useState, useEffect } from "react";
import { supabase } from '../lib/supabaseClient';

// スタイルとアニメーションの追加
const styles = `
  @keyframes flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// 16問の質問配列（originalQuestions）
const originalQuestions = [
  {
    question: "「どうせうまくいかない」と思って、最初から行動をあきらめることがある。",
    options: [
      { text: "A. よくある（3点）", scores: { hikkun: 3 } },
      { text: "B. たまにある（1点）", scores: { hikkun: 1 } },
      { text: "C. ほとんどない（0点）", scores: { hikkun: 0 } },
    ],
  },
  {
    question: "大勢の中にいるより、一人で静かに過ごす時間の方が好き。",
    options: [
      { text: "A. とてもそう思う（3点）", scores: { kodokun: 3 } },
      { text: "B. どちらかというとそう（1点）", scores: { kodokun: 1 } },
      { text: "C. あまりそう思わない（0点）", scores: { kodokun: 0 } },
    ],
  },
  {
    question: "失敗やミスをすると、自分を強く責めてしまう。",
    options: [
      { text: "A. いつも責める（3点）", scores: { semerunda: 3 } },
      { text: "B. 時々そうなる（1点）", scores: { semerunda: 1 } },
      { text: "C. あまり気にしない（0点）", scores: { semerunda: 0 } },
    ],
  },
  {
    question: "迷いに迷って、結局どちらも選べずにチャンスを逃すことがある。",
    options: [
      { text: "A. よくある（3点）", scores: { mayoita: 3 } },
      { text: "B. たまにある（1点）", scores: { mayoita: 1 } },
      { text: "C. ほとんどない（0点）", scores: { mayoita: 0 } },
    ],
  },
  {
    question: "何かを始めようと思っても「まだ準備が足りない」と感じて、先延ばししがち。",
    options: [
      { text: "A. すごく当てはまる（3点）", scores: { guzukey: 3 } },
      { text: "B. 少し当てはまる（1点）", scores: { guzukey: 1 } },
      { text: "C. 全く当てはまらない（0点）", scores: { guzukey: 0 } },
    ],
  },
  {
    question: "自分の気持ちに気づいてほしくて、つい遠回しにアピールしてしまう。",
    options: [
      { text: "A. ついしちゃう（3点）", scores: { netchorin: 3 } },
      { text: "B. まあまあある（1点）", scores: { netchorin: 1 } },
      { text: "C. あまりない（0点）", scores: { netchorin: 0 } },
    ],
  },
  {
    question: "ちょっとでも「嫌な予感」がすると、すぐにその場から逃げたくなる。",
    options: [
      { text: "A. よくある（3点）", scores: { nigedasu: 3 } },
      { text: "B. たまにある（1点）", scores: { nigedasu: 1 } },
      { text: "C. めったにない（0点）", scores: { nigedasu: 0 } },
    ],
  },
  {
    question: "自分の主張をするのが苦手で、気づけば\"いい人役\"に落ち着いている。",
    options: [
      { text: "A. よくある（3点）", scores: { kyohiro: 3 } },
      { text: "B. たまにある（1点）", scores: { kyohiro: 1 } },
      { text: "C. あまりない（0点）", scores: { kyohiro: 0 } },
    ],
  },
  {
    question: "「自分なんかができるわけない」と感じることがある。",
    options: [
      { text: "A. よくある（3点）", scores: { hikkun: 3 } },
      { text: "B. たまにある（1点）", scores: { hikkun: 1 } },
      { text: "C. ほとんどない（0点）", scores: { hikkun: 0 } },
    ],
  },
  {
    question: "嫌われたくなくて、自分の意見を飲み込むことがある.",
    options: [
      { text: "A. いつも飲み込む（3点）", scores: { netchorin: 3 } },
      { text: "B. 時々飲み込む（1点）", scores: { netchorin: 1 } },
      { text: "C. ほとんど飲み込まない（0点）", scores: { netchorin: 0 } },
    ],
  },
  {
    question: "誰かの評価や視線を気にしすぎて、本当の気持ちを言えないことがある.",
    options: [
      { text: "A. すごくある（3点）", scores: { kyohiro: 3 } },
      { text: "B. たまにある（1点）", scores: { kyohiro: 1 } },
      { text: "C. ほとんどない（0点）", scores: { kyohiro: 0 } },
    ],
  },
  {
    question: "「正解を出さなきゃ」と思うあまり、選ぶのに時間がかかる.",
    options: [
      { text: "A. とてもそう思う（3点）", scores: { mayoita: 3 } },
      { text: "B. どちらかというとそう（1点）", scores: { mayoita: 1 } },
      { text: "C. あまりそう思わない（0点）", scores: { mayoita: 0 } },
    ],
  },
  {
    question: "「今はまだタイミングじゃない」と理由をつけて、なかなか動けない.",
    options: [
      { text: "A. とてもそう思う（3点）", scores: { guzukey: 3 } },
      { text: "B. どちらかというとそう（1点）", scores: { guzukey: 1 } },
      { text: "C. あまりそう思わない（0点）", scores: { guzukey: 0 } },
    ],
  },
  {
    question: "失敗したとき「なんであんなこと言ったんだろう」と後悔が止まらない.",
    options: [
      { text: "A. いつも後悔する（3点）", scores: { semerunda: 3 } },
      { text: "B. たまに後悔する（1点）", scores: { semerunda: 1 } },
      { text: "C. あまり後悔しない（0点）", scores: { semerunda: 0 } },
    ],
  },
  {
    question: "まだ何も起きていないのに、「うまくいかないかも」と不安で動けなくなることがある.",
    options: [
      { text: "A. すごくある（3点）", scores: { nigedasu: 3 } },
      { text: "B. たまにある（1点）", scores: { nigedasu: 1 } },
      { text: "C. ほとんどない（0点）", scores: { nigedasu: 0 } },
    ],
  },
  {
    question: "気配を察して動くのは得意。でも、輪の中には入りにくいと感じる.",
    options: [
      { text: "A. とてもそう思う（3点）", scores: { kodokun: 3 } },
      { text: "B. どちらかというとそう（1点）", scores: { kodokun: 1 } },
      { text: "C. あまりそう思わない（0点）", scores: { kodokun: 0 } },
    ],
  },
];

// シャッフル関数（Fisher-Yatesアルゴリズム）
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// キャラクター情報（results）
const results = {
  hikkun: {
    name: "ひっくん：ひねくれ王のツンデレビーム炸裂",
    image: "/images/characters/hikkun.png",
    cardColor: "#FFC7C7",
    description: `
      <style>
        .char-title { color: #d33; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #d33; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #ffccd5 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">一見冷めていて「どうせ無理」と口にしがち。でもそれは、期待に応えたい気持ちが強すぎるあまり、失敗して傷つくのを避けたいだけ。本音は「頑張りたい」「認められたい」のに、先にネガティブを出して心を守ってる<span class="emphasis">繊細ツンデレ系</span>。</p>
      <p class="char-text">空気を読む力と自虐ユーモアで場を和ませる、ちょっと皮肉屋な愛されキャラ。</p>
      <p class="char-title">【あなたの強み】</p>
      <ul class="char-list">
        <li>リスクを早く察知できる"感情センサー"</li>
        <li>逆境をネタに変えるセルフツッコミ力</li>
        <li>「深読み力」が高く、相手の裏の気持ちに気づける</li>
        <li>本当は面倒見が良く、優しさを照れで隠すタイプ</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">本音を隠しすぎて、人との距離ができがち。「どうせ無理」は心の癖。自分に期待してもいい。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">「どうせ…」と思った瞬間、心の中で『でも、やってみるか』とつぶやいてみよう。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">どうせ僕なんか、いや、別にいいけどさ。</p>
    `
  },
  kodokun: {
    name: "こどくん：孤高の哲学者、でもちょっとさみしがり",
    image: "/images/characters/kodokun.png",
    cardColor: "#E0E7FF",
    description: `
      <style>
        .char-title { color: #4356b4; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #4356b4; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #c7d1ff 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">「ひとりで大丈夫」と言いつつ、ふとした瞬間に寂しさがにじむあなた。自分のペースや世界観を大切にする<span class="emphasis">静かな自由人</span>です。</p>
      <ul class="char-list">
        <li>感情の波に流されにくい安定感</li>
        <li>内なる軸を持ち、他人の意見に左右されない</li>
        <li>一人の時間にアイデアや創造性が花開く</li>
        <li>自然体で人と接することで安心感を与える</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">「一人でいい」という考えが孤独を深める可能性も。時々、心のドアを開けてみましょう。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">今日は、気になる誰かに短い連絡をしてみる。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「一人が気楽でいいんだよ、いや、本当だってば！」</p>
    `
  },
  semerunda: {
    name: "セメルンダー：100点じゃないと、意味がない",
    image: "/images/characters/semerunda.png",
    cardColor: "#DCC7FF",
    description: `
      <style>
        .char-title { color: #7e57c2; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #7e57c2; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #e4d4ff 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">自分に厳しすぎて、時に<span class="emphasis">鬼の自己ダメ出しモード</span>に陥るあなた。誰も気にしていないミスでも、延々と反省会を開いてしまいます。</p>
      <ul class="char-list">
        <li>どこまでも高みを目指すストイック魂</li>
        <li>誠実さと妥協しない精神</li>
        <li>細部に気づける繊細さと丁寧さ</li>
        <li>困難な時に燃える粘り強さ</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">自己批判が強すぎると、周りの良さが見えなくなることも。自分に花マルをあげる時間も大切に。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">今日だけは「よくやった自分」を鏡の前で褒めてみる。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「これもダメ、あれもダメ、全部ダメ！」</p>
    `
  },
  mayoita: {
    name: "マヨイタイソン：選択肢は無限。でも時間は有限。",
    image: "/images/characters/mayoita.png",
    cardColor: "#FAF2C7",
    description: `
      <style>
        .char-title { color: #b3a136; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #b3a136; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #fff4a3 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">何事も慎重に、失敗を恐れるあなた。しかし、<span class="emphasis">迷いが続くとチャンスを逃してしまうことも</span>。</p>
      <ul class="char-list">
        <li>物事を多面的に見て冷静に判断できる</li>
        <li>自分のペースを守る粘り強さ</li>
        <li>集中力と実行力は抜群</li>
        <li>急がず焦らず、周囲と調和できる</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">迷い続けると、せっかくのチャンスを逃すかもしれません。決断する勇気を持ちましょう。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">悩んだら「今日はこれに決めた！」と声に出してみる。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「いや、どっちがいいと思う？いや、でもさ…」</p>
    `
  },
  guzukey: {
    name: "グズッキー：頭では分かってる。でも体が動かないんだ…",
    image: "/images/characters/guzukey.png",
    cardColor: "#E3FFC7",
    description: `
      <style>
        .char-title { color: #6ca832; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #6ca832; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #d9ffa3 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">やりたい気持ちはあるのに、タイミングや準備不足を理由に後回しにしてしまうあなた。実はその<span class="emphasis">真面目さの裏返し</span>です。</p>
      <ul class="char-list">
        <li>考え抜いたアイデアは深く実用的</li>
        <li>自分のペースを守る力がある</li>
        <li>一度動き出すと実行力は爆発的</li>
        <li>焦らず周囲と調和する穏やかさ</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">考えすぎて行動に移せないと自信を失うことも。まずは「5分だけやってみよう」から始めましょう。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">「5分だけやってみよう」と小さく始める。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「いや、まだ完璧じゃないから、もうちょっとだけ…」</p>
    `
  },
  netchorin: {
    name: "ねっちょりん：全身全霊、愛されたがりのかまってちゃん",
    image: "/images/characters/netchorin.png",
    cardColor: "#FFD6F2",
    description: `
      <style>
        .char-title { color: #d24f9e; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #d24f9e; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #ffcae8 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">誰かに認められたい、愛されたいという強い気持ちがあるあなた。そのため、無視やスルーに敏感ですが、<span class="emphasis">対人スキルは抜群</span>です。</p>
      <ul class="char-list">
        <li>共感・察知・表現力の高さは天性</li>
        <li>「誰かのために」が行動の原動力</li>
        <li>愛情を注ぐことで周囲の空気を温める</li>
        <li>情熱が火をつけると猛烈にエネルギッシュ</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">愛されたい気持ちが強すぎると、自分の軸を見失うことも。まずは自分自身を大切に。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">鏡の前で「今日も頑張ってるね」と自分に声をかける。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「ねぇ、ちゃんと見てる？ねぇってば！」</p>
    `
  },
  nigedasu: {
    name: "ニゲダス：その場にとどまる？ムリムリムリ！",
    image: "/images/characters/nigedasu.png",
    cardColor: "#FFECC7",
    description: `
      <style>
        .char-title { color: #e6a639; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #e6a639; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #ffe0a3 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">イヤな空気を感じたら即ダッシュするあなた。<span class="emphasis">直感と危機感覚に優れ</span>、ピンチをチャンスに変える力があります。</p>
      <ul class="char-list">
        <li>危機管理能力に優れる</li>
        <li>柔軟な思考でしがらみを捨てる</li>
        <li>迅速な判断と行動力</li>
        <li>次の一手に向かうスピード感</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">早すぎる撤退は、可能性を摘むことも。逃げる前に「本当にムリ？」と考えてみましょう。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">「今ここで、ちょっとだけ残れる方法は？」と自問する。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「ここは一旦、退散で！」</p>
    `
  },
  kyohiro: {
    name: "キョヒロー：拒絶されるくらいなら…最初から近づかない",
    image: "/images/characters/kyohiro.png",
    cardColor: "#C7EAF0",
    description: `
      <style>
        .char-title { color: #4790a0; font-weight: bold; font-size: 1.2em; margin-top: 16px; border-bottom: 1px dotted #999; padding-bottom: 4px; }
        .char-text { margin-bottom: 12px; line-height: 1.6; }
        .char-list { margin-left: 20px; }
        .char-list li { margin-bottom: 8px; position: relative; padding-left: 20px; list-style-type: none; }
        .char-list li:before { content: "★"; position: absolute; left: 0; color: #4790a0; }
        .emphasis { font-weight: bold; background: linear-gradient(transparent 70%, #b3e3ec 70%); }
      </style>
      <p class="char-title">【性格傾向】</p>
      <p class="char-text">人と関わるのが怖い、というより深く傷つきたくないという思いから、非常に慎重になっているあなた。これは、<span class="emphasis">自分や他人を大切に思う優しさの表れ</span>です。</p>
      <ul class="char-list">
        <li>危険を察知して動ける冷静な観察眼</li>
        <li>「一歩引く」ことで周囲の変化に気づける敏感さ</li>
        <li>本音で付き合える人とは深く長くつながれる</li>
        <li>無理に関わらず、自己防衛ができる</li>
      </ul>
      <p class="char-title">【ちょっと注意】</p>
      <p class="char-text">自分を守りすぎると、逆に孤立してしまう可能性があります。少し勇気を出して一歩踏み出してみましょう。</p>
      <p class="char-title">【今すぐできるワンアクション】</p>
      <p class="char-text">今日は気になる人に、たとえぎこちなくても声をかけてみる。</p>
      <p class="char-title">【口癖】</p>
      <p class="char-text">「ここにいれば安全だよね…多分。」</p>
    `
  }
};

/*
  CharacterDiagnosis コンポーネント
  - 質問をランダムな順番で表示し、回答に応じたスコアを集計、結果を表示します。
*/
export default function CharacterDiagnosis() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [finished, setFinished] = useState(false);
  const [topChars, setTopChars] = useState([]);
  const [answers, setAnswers] = useState([]); // 追加：回答記録用の状態

  // コンポーネントマウント時に質問をランダムに並び替え
  useEffect(() => {
    setQuestions(shuffle([...originalQuestions]));
  }, []);

  // 回答処理関数
  const handleAnswer = (scoresForOption) => {
    const updatedScores = { ...scores };
    for (const char in scoresForOption) {
      updatedScores[char] = (updatedScores[char] || 0) + scoresForOption[char];
    }
    setScores(updatedScores);

    // 回答を記録
    setAnswers(prev => [
      ...prev,
      {
        question: questions[currentQ].question,
        answer: scoresForOption
      }
    ]);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      const maxScore = Math.max(...Object.values(updatedScores));
      const top = Object.entries(updatedScores)
        .filter(([_, v]) => v === maxScore)
        .map(([k]) => k);
      setTopChars(top);
      setFinished(true);
    }
  };

  // Log saving when displaying diagnosis results (add answers, topChars to dependency array)
  useEffect(() => {
    const saveLog = async () => {
      const { error } = await supabase.from('diagnostic_logs').insert([
        {
          result_type: topChars[0]?.name || 'unknown',
          answers: JSON.stringify(answers),
          shared: false,
          user_agent: navigator.userAgent,
          referrer: document.referrer,
        },
      ]);
      if (error) console.error('Supabaseログ保存エラー:', error);
    };

    if (finished && topChars.length > 0) {
      saveLog();
    }
  }, [finished, topChars, answers]);

  // 質問未ロード時の表示
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  // 診断結果表示
  if (finished) {
    return (
      <div className="container" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        minHeight: '100vh',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <style>{styles}</style>
        <div className="header">
          <h1 className="title" style={{ 
            fontSize: '2.8rem', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            margin: '1.5rem 0',
            color: '#333',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", sans-serif',
            letterSpacing: '0.05em'
          }}>診断結果</h1>
        </div>
        {topChars.map((char, i) => (
          <div 
            key={i} 
            className="question-card" 
            style={{ 
              backgroundColor: results[char].cardColor, 
              borderRadius: '16px', 
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.08)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <h3 style={{
              fontSize: '1.6rem',
              fontWeight: 'bold',
              color: '#444',
              borderBottom: '2px solid rgba(0,0,0,0.1)',
              paddingBottom: '8px',
              marginBottom: '16px',
              fontFamily: '"Hiragino Maru Gothic Pro", "ヒラギノ丸ゴ Pro W4", Meiryo, "メイリオ", sans-serif'
            }}>{results[char].name}</h3>
            {/* キャラクター画像 */}
            <img
              src={results[char].image}
              alt={results[char].name}
              className="w-32 h-32 mx-auto mb-4"
              style={{ 
                maxWidth: '160px', 
                maxHeight: '160px', 
                width: 'auto', 
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            {/* 結果説明文 */}
            <div 
              style={{ 
                lineHeight: '1.7',
                fontSize: '1rem',
                color: '#333',
                fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", sans-serif'
              }} 
              dangerouslySetInnerHTML={{ __html: results[char].description }} 
            />
            
            {/* シェアボタン */}
            <div style={{
              marginTop: '30px',
              textAlign: 'center',
              padding: '15px',
              borderTop: '1px dashed rgba(0,0,0,0.1)'
            }}>
              <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>この診断アプリをシェアする:</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  style={{
                    backgroundColor: '#000000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  X
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                  }}
                  style={{
                    backgroundColor: '#4267B2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Facebook
                </button>
                <button 
                  onClick={() => {
                    const text = `私は「${results[char].name.split('：')[0]}」タイプでした！`;
                    const url = window.location.href;
                    window.open(`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  style={{
                    backgroundColor: '#06C755',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 15px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  LINE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 現在の質問表示
  const q = questions[currentQ];
  const progressPercent = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div className="container" style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
      minHeight: '100vh',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <style>{styles}</style>
      <div className="header">
        <h1 className="title" style={{
          fontSize: '2.8rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          margin: '1.5rem 0',
          color: '#333',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          fontFamily: '"Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ Pro W3", Meiryo, "メイリオ", sans-serif',
          letterSpacing: '0.05em'
        }}>8キャラセルフチェック</h1>
      </div>
      
      {/* 進捗バー */}
      <div className="progress-text" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
        <span>質問 {currentQ + 1}/{questions.length}</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="progress-outer" style={{ 
        backgroundColor: '#f0f0f0', 
        borderRadius: '10px', 
        height: '12px',  
        marginBottom: '25px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="progress-inner" style={{ 
          width: `${progressPercent}%`, 
          height: '100%',
          background: 'linear-gradient(90deg, #36D1DC 0%, #5B86E5 50%, #8B5CF6 100%)',
          backgroundSize: '200% 100%',
          animation: 'flow 3s linear infinite',
          borderRadius: '10px',
          position: 'relative',
          transition: 'width 0.5s ease'
        }}></div>
      </div>
      
      {/* 質問カード */}
      <div className="question-card" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        padding: '30px',
        marginBottom: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 12px rgba(0, 0, 0, 0.08)',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,255,0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}>
        <div className="question-text" style={{
          fontSize: '1.2rem',
          fontWeight: '500',
          marginBottom: '30px',
          color: '#333',
          lineHeight: '1.6'
        }}>{q.question}</div>
        <div className="options-container">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className="option-button"
              style={{
                display: 'block',
                width: '100%',
                padding: '15px 20px',
                margin: '10px 0',
                backgroundColor: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9ff';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => handleAnswer(opt.scores)}
            >
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
