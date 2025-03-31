
import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react"; // Sparkles が不要なら削除してください

// 16問の質問配列（originalQuestions）※ 各質問は後でランダムに表示されます
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
    question: "自分の主張をするのが苦手で、気づけば“いい人役”に落ち着いている。",
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

/* 
  ② シャッフル関数
  - Fisher-Yatesアルゴリズムで、質問の順番をランダムに並び替えます。
*/
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/* 
  ③ キャラクター情報（results）
  - 各キャラクターの診断結果の詳細な説明を、バッククォート（``）を使って複数行のHTMLとして記述します。
*/
const results = {
  hikkun: {
    name: "ひっくん：ひねくれ王のツンデレビーム炸裂",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>一見冷めていて「どうせ無理」と口にしがち。でもそれは、期待に応えたい気持ちが強すぎるあまり、失敗して傷つくのを避けたいだけ。本音は「頑張りたい」「認められたい」なのに、先にネガティブを出して心を守っている。</p>
      <ul>
        <li>危険を察知して動ける冷静な観察眼</li>
        <li>「一歩引く」ことで周囲の変化に気づける敏感さ</li>
        <li>本音で付き合える人とは、深く長くつながれる</li>
        <li>無理に関わらず、自己防衛ができる</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>自分を守りすぎると、逆に孤立してしまう可能性があります。少し勇気を出して一歩踏み出しましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>今日は気になる人に、たとえぎこちなくても声をかけてみる。</p>
      <p><strong>【口癖】</strong></p>
      <p>「ここにいれば安全だよね…多分。」</p>
    `
  },
  kodokun: {
    name: "こどくん：孤高の哲学者、でもちょっとさみしがり",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>「ひとりで大丈夫」と言いつつ、ふとした瞬間に寂しさがにじむあなた。自分のペースや世界観を大切にする静かな自由人です。</p>
      <ul>
        <li>感情の波に流されにくい安定感</li>
        <li>内なる軸を持ち、他人の意見に左右されない</li>
        <li>一人の時間にアイデアや創造性が花開く</li>
        <li>自然体で人と接することで安心感を与える</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>「一人でいい」という考えが孤独を深める可能性も。時々、心のドアを開けてみましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>今日は、気になる誰かに短い連絡をしてみる。</p>
      <p><strong>【口癖】</strong></p>
      <p>「一人が気楽でいいんだよ、いや、本当だってば！」</p>
    `
  },
  semerunda: {
    name: "セメルンダー：100点じゃないと、意味がない",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>自分に厳しすぎて、時に“鬼の自己ダメ出しモード”に陥るあなた。誰も気にしていないミスでも、延々と反省会を開いてしまいます。</p>
      <ul>
        <li>どこまでも高みを目指すストイック魂</li>
        <li>誠実さと妥協しない精神</li>
        <li>細部に気づける繊細さと丁寧さ</li>
        <li>困難な時に燃える粘り強さ</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>自己批判が強すぎると、周りの良さが見えなくなることも。自分に花マルをあげる時間も大切に。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>今日だけは「よくやった自分」を鏡の前で褒めてみる。</p>
      <p><strong>【口癖】</strong></p>
      <p>「これもダメ、あれもダメ、全部ダメ！」</p>
    `
  },
  mayoita: {
    name: "マヨイタイソン：選択肢は無限。でも時間は有限。",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>何事も慎重に、失敗を恐れるあなた。しかし、迷いが続くとチャンスを逃してしまうことも。</p>
      <ul>
        <li>物事を多面的に見て冷静に判断できる</li>
        <li>自分のペースを守る粘り強さ</li>
        <li>集中力と実行力は抜群</li>
        <li>急がず焦らず、周囲と調和できる</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>迷い続けると、せっかくのチャンスを逃すかもしれません。決断する勇気を持ちましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>悩んだら「今日はこれに決めた！」と声に出してみる。</p>
      <p><strong>【口癖】</strong></p>
      <p>「いや、どっちがいいと思う？いや、でもさ…」</p>
    `
  },
  guzukey: {
    name: "グズッキー：頭では分かってる。でも体が動かないんだ…",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>やりたい気持ちはあるのに、タイミングや準備不足を理由に後回しにしてしまうあなた。実はその真面目さの裏返しです。</p>
      <ul>
        <li>考え抜いたアイデアは深く実用的</li>
        <li>自分のペースを守る力がある</li>
        <li>一度動き出すと実行力は爆発的</li>
        <li>焦らず周囲と調和する穏やかさ</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>考えすぎて行動に移せないと自信を失うことも。まずは「5分だけやってみよう」から始めましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>「5分だけやってみよう」と小さく始める。</p>
      <p><strong>【口癖】</strong></p>
      <p>「いや、まだ完璧じゃないから、もうちょっとだけ…」</p>
    `
  },
  netchorin: {
    name: "ねっちょりん：全身全霊、愛されたがりのかまってちゃん",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>誰かに認められたい、愛されたいという強い気持ちがあるあなた。そのため、無視やスルーに敏感ですが、対人スキルは抜群です。</p>
      <ul>
        <li>共感・察知・表現力の高さは天性</li>
        <li>「誰かのために」が行動の原動力</li>
        <li>愛情を注ぐことで周囲の空気を温める</li>
        <li>情熱が火をつけると猛烈にエネルギッシュ</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>愛されたい気持ちが強すぎると、自分の軸を見失うことも。まずは自分自身を大切に。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>鏡の前で「今日も頑張ってるね」と自分に声をかける。</p>
      <p><strong>【口癖】</strong></p>
      <p>「ねぇ、ちゃんと見てる？ねぇってば！」</p>
    `
  },
  nigedasu: {
    name: "ニゲダス：その場にとどまる？ムリムリムリ！",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>イヤな空気を感じたら即ダッシュするあなた。直感と危機感覚に優れ、ピンチをチャンスに変える力があります。</p>
      <ul>
        <li>危機管理能力に優れる</li>
        <li>柔軟な思考でしがらみを捨てる</li>
        <li>迅速な判断と行動力</li>
        <li>次の一手に向かうスピード感</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>早すぎる撤退は、可能性を摘むことも。逃げる前に「本当にムリ？」と考えてみましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>「今ここで、ちょっとだけ残れる方法は？」と自問する。</p>
      <p><strong>【口癖】</strong></p>
      <p>「ここは一旦、退散で！」</p>
    `
  },
  kyohiro: {
    name: "キョヒロー：拒絶されるくらいなら…最初から近づかない",
    description: `
      <p><strong>【性格傾向】</strong></p>
      <p>人と関わるのが怖い、というより深く傷つきたくないという思いから、非常に慎重になっているあなた。これは、自分や他人を大切に思う優しさの表れです。</p>
      <ul>
        <li>危険を察知して動ける冷静な観察眼</li>
        <li>「一歩引く」ことで周囲の変化に気づける敏感さ</li>
        <li>本音で付き合える人とは深く長くつながれる</li>
        <li>無理に関わらず、自己防衛ができる</li>
      </ul>
      <p><strong>【ちょっと注意】</strong></p>
      <p>自分を守りすぎると、逆に孤立してしまう可能性があります。少し勇気を出して一歩踏み出してみましょう。</p>
      <p><strong>【今すぐできるワンアクション】</strong></p>
      <p>今日は気になる人に、たとえぎこちなくても声をかけてみる。</p>
      <p><strong>【口癖】</strong></p>
      <p>「ここにいれば安全だよね…多分。」</p>
    `
  },
};

/* 
  ② シャッフル用の関数
  - Fisher-Yatesアルゴリズムで、質問の順番をランダムに並び替えます。
*/

/* 
  ③ CharacterDiagnosis コンポーネント
  - ここでは、質問をランダムな順番で表示し、回答に応じたスコアを集計します。
  - 全問終了後、最も高いスコアのキャラクターの診断結果（長文）を HTML として表示します。
*/
export default function CharacterDiagnosis() {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState({});
  const [finished, setFinished] = useState(false);
  const [topChars, setTopChars] = useState([]);

  // コンポーネントマウント時に質問をランダムに並び替えてセットします
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

  // 質問がまだロードされていない場合
  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  // 診断結果を表示する場合
  if (finished && topChars.length > 0) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">診断結果</h1>
        </div>
        {topChars.map((char, i) => (
          <div key={i} className="question-card">
            <h3>{results[char].name}</h3>
            {/* 結果の長文を HTML としてレンダリング */}
            <div dangerouslySetInnerHTML={{ __html: results[char].description }} />
          </div>
        ))}
      </div>
    );
  }

  // 現在の質問を表示する場合
  const q = questions[currentQ];
  // 進捗バーの計算
  const progressPercent = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">キャラクター診断</h1>
      </div>
      
      {/* 進捗バー */}
      <div className="progress-text">
        <span>質問 {currentQ + 1}/{questions.length}</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      {/* 質問カード */}
      <div className="question-card">
        <div className="question-text">{q.question}</div>
        <div className="options-container">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className="option-button"
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
