const coreKeywords = [
  {
    id: "command-line-args",
    title: "コマンドライン引数",
    category: "Java",
    summary: "mainの横にいる String[] args。結局どこから何が入るのかを、実行の流れから追う。",
    lead: "コマンドライン引数は、プログラムを起動するときに外側から渡す「ちょっとした注文メモ」です。",
    body: "Javaでは main メソッドの String[] args に、スペース区切りで渡した値が順番に入ります。Eclipseの実行構成から渡す場合も、ターミナルから渡す場合も仕組みは同じです。",
    code: `public class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"こんにちは、\" + args[0] + \"さん\");\n  }\n}\n\n$ java Hello Tanaka\nこんにちは、Tanakaさん`,
    detourTitle: "なぜ args は複数形？",
    detour: "argument（引数）の複数形が arguments。args はその略です。名前自体は変更できますが、世界中のコードが args と書くので、そのまま読むのがいちばん通じます。",
    related: ["配列", "mainメソッド", "標準入力"]
  },
  {
    id: "classpath",
    title: "クラスパス",
    category: "Java",
    summary: "Javaがクラスを探しに行く場所。エラー文で見かける前に、住所録として理解する。",
    lead: "クラスパスは、Javaに「必要なクラスはこの辺を探してね」と教える住所録です。",
    body: "自分で書いたクラスや外部ライブラリの場所が探索範囲に入っていないと、コンパイル時や実行時にクラスが見つからないエラーになります。Eclipseは多くを自動設定してくれますが、裏側では同じ仕組みが動いています。",
    code: `$ javac -cp lib/sample.jar Main.java\n$ java -cp .:lib/sample.jar Main\n\n# Windowsでは区切り文字が : ではなく ;`,
    detourTitle: "IDEは魔法ではなく代行業",
    detour: "Eclipseが便利なのは、クラスパスやコンパイルをうまく代行してくれるから。仕組みを一度コマンドで触ると、IDEのエラーも急に読めるようになります。",
    related: ["JAR", "コンパイル", "Eclipse"]
  },
  {
    id: "permissions",
    title: "Linuxの権限",
    category: "Linux",
    summary: "rwx と 755 の読み方。謎の数字ではなく、3人分のスイッチとして眺める。",
    lead: "Linuxの権限は「誰が、読める・書ける・実行できるか」を3セットで表したものです。",
    body: "対象は所有者、グループ、その他の3種類。r=4、w=2、x=1として足し算すると、rwxは7、r-xは5になります。だから755は「所有者だけ全部OK、ほかは読み取りと実行OK」です。",
    code: `$ ls -l script.sh\n-rwxr-xr-x  1 user staff  120 script.sh\n\n$ chmod 755 script.sh`,
    detourTitle: "実行権限がない、はLinuxの丁寧な拒否",
    detour: "スクリプトの中身が正しくても x がなければ直接実行できません。コードのバグではなく、入口の鍵が閉まっている状態です。",
    related: ["chmod", "シェル", "所有者"]
  },
  {
    id: "box-model",
    title: "CSSボックスモデル",
    category: "CSS",
    summary: "余白が合わない問題の主犯候補。content、padding、border、marginを箱で整理。",
    lead: "HTML要素はすべて箱です。CSSは、その箱の中身・内側の余白・枠線・外側の余白を調整しています。",
    body: "width: 200px に padding を足すと、標準では見た目の幅が200pxを超えます。box-sizing: border-box を指定すると、指定幅の中にpaddingとborderが収まるので、レイアウトを考えやすくなります。",
    code: `* {\n  box-sizing: border-box;\n}\n\n.card {\n  width: 200px;\n  padding: 20px;\n  border: 1px solid #333;\n}`,
    detourTitle: "まず全要素に border を出す技",
    detour: "レイアウトが崩れたら、一時的に * { outline: 1px solid red; } を入れると箱の正体が丸見えになります。地味ですが現場でも強いデバッグ術です。",
    related: ["padding", "margin", "DevTools"]
  },
  {
    id: "git-commit",
    title: "Gitのコミット",
    category: "開発道具",
    summary: "セーブポイントだけではない。変更理由を未来の自分に渡す、小さな手紙。",
    lead: "コミットはファイルの保存ではなく、意味のある変更単位に名前をつけて履歴へ残す操作です。",
    body: "良いコミットは「何をしたか」と「なぜしたか」を追いやすくします。完璧な粒度に悩むより、まずは一つの目的につき一コミットを意識すると十分です。",
    code: `$ git add src/Main.java\n$ git commit -m \"入力値が空の場合のメッセージを追加\"`,
    detourTitle: "「修正」「更新」だけだと未来で困る",
    detour: "コミットメッセージは作業日記ではなく検索可能な見出しです。半年後の自分はほぼ他人なので、何を直したかまで書いてあげましょう。",
    related: ["Git", "差分", "ブランチ"]
  },
  {
    id: "eclipse-workspace",
    title: "Eclipseのワークスペース",
    category: "Eclipse",
    summary: "ただの保存フォルダに見えて、設定も抱えている。プロジェクトとの違いを整理。",
    lead: "ワークスペースは、複数プロジェクトとEclipse側の設定をまとめて扱う作業机です。",
    body: "プロジェクトのコードだけでなく、画面配置や一部の設定もワークスペース側に保存されます。コードを別の場所へ移しただけでは同じ環境にならないことがあるのはこのためです。",
    code: `workspace/\n├── .metadata/      # Eclipseの設定\n├── sample-app/     # Javaプロジェクト\n└── practice/       # 別のプロジェクト`,
    detourTitle: "壊れたら新しい机を出す",
    detour: "原因不明のEclipse不調で、新しいワークスペースを作ってプロジェクトをimportすると直る場合があります。机の引き出しだけが散らかっていた、というわけです。",
    related: ["Eclipse", "プロジェクト", "import"]
  },
  {
    id: "java-method",
    title: "Javaのメソッド",
    category: "Java",
    summary: "処理に名前をつけて再利用する仕組み。引数・戻り値・呼び出しを一つの例で整理。",
    lead: "メソッドは、ひとまとまりの処理に名前をつけた「小さな仕事」です。",
    body: "同じ処理を何度も書かずに済み、mainメソッドを読みやすくできます。引数は仕事に渡す材料、戻り値は仕事が返す結果です。まずは「入力を受け取り、処理し、結果を返す」の3段階で眺めましょう。",
    code: `public class PriceCalculator {\n  static int addTax(int price) {\n    return (int) (price * 1.1);\n  }\n\n  public static void main(String[] args) {\n    int total = addTax(1000);\n    System.out.println(total); // 1100\n  }\n}`,
    detourTitle: "長いmainは、仕事の切り分けどき",
    detour: "mainに処理が増えたら「この数行は何をしている？」と問い、その答えをメソッド名にして切り出すと読みやすくなります。",
    related: ["引数", "戻り値", "オーバーロード"]
  },
  {
    id: "java-for-loop",
    title: "for文の使い方",
    category: "Java",
    summary: "繰り返す回数が見えているときの基本形。配列の走査まで手を動かす。",
    lead: "for文は「何回目かを数えながら、同じ処理を繰り返す」ための構文です。",
    body: "初期化、継続条件、更新の順に読みます。iは現在の回数を表す目印です。まず0から始めて、iが要素数より小さい間だけ動かす形を覚えると、配列にもそのまま使えます。",
    code: `String[] tools = {"Java", "Linux", "Git"};\n\nfor (int i = 0; i < tools.length; i++) {\n  System.out.println((i + 1) + ": " + tools[i]);\n}\n\n// 拡張for文\nfor (String tool : tools) {\n  System.out.println(tool);\n}`,
    detourTitle: "なぜ0から数えるの？",
    detour: "配列の先頭位置が0だからです。i <= tools.length とすると最後に存在しない位置へ進むため、基本は i < tools.length です。",
    related: ["配列", "while文", "繰り返し"]
  },
  {
    id: "java-fizzbuzz",
    title: "FizzBuzzを解く",
    category: "Java演習",
    summary: "if文・剰余・for文を一度に練習する定番問題。考える順序から解説。",
    lead: "FizzBuzzは難問ではなく、条件の順番を言葉からコードへ移す練習です。",
    body: "1から100まで表示し、3の倍数はFizz、5の倍数はBuzz、両方の倍数はFizzBuzzにします。15の倍数を最初に判定しないと、3の条件だけで処理が終わる点が小さな罠です。",
    code: `for (int i = 1; i <= 100; i++) {\n  if (i % 15 == 0) {\n    System.out.println("FizzBuzz");\n  } else if (i % 3 == 0) {\n    System.out.println("Fizz");\n  } else if (i % 5 == 0) {\n    System.out.println("Buzz");\n  } else {\n    System.out.println(i);\n  }\n}`,
    detourTitle: "問題を日本語の箇条書きに戻す",
    detour: "コードが書けないときは、条件を優先順に箇条書きします。プログラミングは、曖昧な説明を機械が迷わない順番へ直す作業でもあります。",
    related: ["for文", "if文", "剰余演算子"]
  },
  {
    id: "sequence-diagram",
    title: "シーケンス図",
    category: "設計・DB",
    summary: "画面、Java、DBがどの順番で会話するかを時間軸で読む。",
    lead: "シーケンス図は、登場人物どうしのやり取りを上から下へ時系列で読む設計図です。",
    body: "横方向に画面・アプリ・DBなどの登場人物を置き、縦方向に時間が進みます。矢印は呼び出し、点線は戻り値として描かれることが多く、処理の担当と順番を確認するのに向いています。",
    code: `利用者      画面        Java        DB\n  |          |           |          |\n  |--検索--->|           |          |\n  |          |--search-->|          |\n  |          |           |--SELECT->|\n  |          |           |<--結果---|\n  |          |<--一覧-----|          |\n  |<--表示----|           |          |\n\n※ 上から下へ時間が進む`,
    detourTitle: "クラス図とは役割が違う",
    detour: "クラス図は構造、シーケンス図は会話を表します。同じ機能を両方で描くと「誰が持つか」と「いつ呼ぶか」が分かれます。",
    related: ["UML", "クラス図", "API"]
  },
  {
    id: "er-diagram",
    title: "ER図",
    category: "設計・DB",
    summary: "テーブル同士の関係を、1対多や外部キーから読む。",
    lead: "ER図は、システムが扱うデータの種類と、そのつながりを表す地図です。",
    body: "Entityは顧客や注文などのデータのまとまり、Relationshipはその関係です。顧客1人が複数の注文を持つなら1対多。注文側にcustomer_idという外部キーを持たせて関係を表します。",
    code: `┌──────────┐       1     N       ┌──────────┐\n│ customers│─────────────────────│ orders   │\n├──────────┤                     ├──────────┤\n│ id (PK)  │                     │ id (PK)  │\n│ name     │                     │ customer_id (FK)\n└──────────┘                     │ total    │\n                                 └──────────┘\n\nPK: 主キー / FK: 外部キー`,
    detourTitle: "先に画面ではなく名詞を拾う",
    detour: "要件文から顧客、商品、注文などの名詞を丸で囲むと、Entity候補が見えます。ただし同じ意味の言葉は一つに整理します。",
    related: ["主キー", "外部キー", "正規化"]
  },
  {
    id: "cobol-introduction",
    title: "はじめてのCOBOL",
    category: "COBOL",
    summary: "古いから残るのではなく、業務と資産が積み重なった言語。Javaとの見え方の違いから入る。",
    lead: "COBOLは、帳票・会計・金融など大量の業務データを扱う現場で長く使われてきた言語です。",
    body: "英語に近い記述と、部ごとに分かれたプログラム構造が特徴です。研修ではまずDIVISIONの役割、固定形式か自由形式か、PIC句によるデータ定義を押さえると読みやすくなります。",
    code: `IDENTIFICATION DIVISION.\nPROGRAM-ID. HELLO.\nDATA DIVISION.\nWORKING-STORAGE SECTION.\n01 USER-NAME PIC X(10) VALUE "TANAKA".\nPROCEDURE DIVISION.\n    DISPLAY "HELLO " USER-NAME.\n    STOP RUN.`,
    detourTitle: "「古い」と「単純」は別の話",
    detour: "言語仕様を覚えても、長年育った業務ルールを読むのは別の難しさがあります。COBOL研修では処理だけでなくデータ項目名にも注目しましょう。",
    related: ["PIC句", "DIVISION", "JCL"]
  },
  {
    id: "c-family-difference",
    title: "C・C++・C#の違い",
    category: "言語比較",
    summary: "名前は似ていても、得意分野も実行環境も別。C+という独立言語も整理。",
    lead: "C、C++、C#は親戚ですが同じ言語ではありません。なお一般的な主要言語として「C+」はなく、C++との混同が多い表記です。",
    body: "CはOSや組み込みなど低水準制御に強く、C++はCを土台に抽象化やオブジェクト指向を広げています。C#はMicrosoftが設計した.NET上の言語で、文法に似た部分はあっても実行環境や標準ライブラリが大きく異なります。",
    code: `C    : 手続き型 / ネイティブ実行 / 組み込み・OS\nC++  : マルチパラダイム / ネイティブ実行 / ゲーム・高性能処理\nC#   : .NET / GCあり / 業務アプリ・Web・Unity\nJava : JVM / GCあり / 業務アプリ・Web\n\n// 「C+」は通常「C++」の書き間違い`,
    detourTitle: "名前の順番で進化度を決めない",
    detour: "新しい言語が常に上位互換とは限りません。用途、既存資産、実行環境、チームの経験で選択が変わります。",
    related: ["コンパイル", "ポインタ", ".NET"]
  }
];

const topicGroups = {
  "Java": ["変数と型", "String", "配列", "if文", "switch文", "while文", "拡張for文", "引数と戻り値", "コンストラクタ", "クラスとインスタンス", "カプセル化", "継承", "インターフェース", "オーバーロード", "オーバーライド", "例外処理", "try-catch-finally", "ListとArrayList", "MapとHashMap", "Set", "ジェネリクス", "ラムダ式", "Stream API", "static", "final", "アクセス修飾子", "パッケージ", "JAR", "JDK・JRE・JVM", "ガベージコレクション"],
  "Linux": ["pwd・cd・ls", "mkdir・touch", "cp・mv・rm", "cat・less", "grep", "find", "パイプ", "リダイレクト", "環境変数", "PATH", "プロセス", "ps・kill", "標準入力・標準出力", "シェルスクリプト", "相対パスと絶対パス", "sudo", "SSH", "tar・gzip", "curl", "ログの読み方"],
  "設計・DB": ["UML", "クラス図", "ユースケース図", "アクティビティ図", "主キー", "外部キー", "正規化", "SELECT", "INSERT・UPDATE・DELETE", "WHERE句", "JOIN", "GROUP BY", "トランザクション", "コミットとロールバック", "インデックス", "NULL", "テーブル設計", "CRUD"],
  "Web・CSS": ["HTMLの基本構造", "セマンティックHTML", "フォーム", "HTTP", "URL", "GETとPOST", "ステータスコード", "CookieとSession", "REST API", "JSON", "CSSセレクタ", "詳細度", "Flexbox", "Grid", "position", "レスポンシブデザイン", "DevTools", "JavaScript DOM"],
  "開発道具": ["Git add・status", "Git branch", "Git merge", "コンフリクト", "プルリクエスト", "README", "デバッグ", "ブレークポイント", "単体テスト", "テストケース", "Eclipseの実行構成", "Eclipseのデバッグ", "ビルド", "依存関係", "Maven", "Gradle"],
  "基本情報": ["2進数", "論理演算", "CPUとメモリ", "アルゴリズム", "計算量", "スタックとキュー", "ネットワーク基礎", "IPアドレス", "DNS", "暗号化とハッシュ", "認証と認可", "脆弱性", "バックアップ", "冗長化"]
};

const topicDefinitions = {
  "変数と型": "変数は値につける名前、型はその値をどう解釈し、どんな操作を許すかを決めるルールです。Javaはコンパイル時に型の不整合を検出します。",
  "String": "Stringは文字列を表す不変オブジェクトです。内容を変更したように見える操作でも、基本的には新しいStringが作られます。",
  "配列": "配列は同じ型の要素を固定個数まとめ、0から始まる添字でアクセスするデータ構造です。",
  "if文": "if文はbooleanの条件がtrueかfalseかによって、実行する処理を分岐させます。条件の重なりと順序が結果を変えます。",
  "switch文": "switch文は一つの値に対する複数の候補を整理する分岐です。ifの連続より意図が明確になる場面があります。",
  "while文": "while文は条件がtrueの間、回数を決めずに処理を繰り返します。条件を変化させないと無限ループになります。",
  "拡張for文": "拡張for文は配列やIterableの各要素を先頭から順に取り出します。位置ではなく要素だけが必要な処理に向きます。",
  "引数と戻り値": "引数は呼び出し側からメソッドへ渡す入力、戻り値はメソッドから呼び出し側へ返す結果です。",
  "コンストラクタ": "コンストラクタはnewでインスタンスを作るときに呼ばれ、初期状態を整える特別な処理です。戻り値の型を書きません。",
  "クラスとインスタンス": "クラスはデータと処理の設計、インスタンスはその設計から実際に作られた個別のオブジェクトです。",
  "カプセル化": "カプセル化は内部状態を無制限に触らせず、公開した操作を通して一貫性を守る設計の考え方です。",
  "継承": "継承は既存クラスの性質を引き継ぐ仕組みです。単なるコード再利用ではなく、is-a関係が成立するかを考えます。",
  "インターフェース": "インターフェースは実装クラスが提供すべき操作の契約を表し、利用側を具体的な実装から切り離します。",
  "オーバーロード": "オーバーロードは同じ名前で引数の型や個数が異なるメソッドを定義することです。コンパイル時に呼び先が決まります。",
  "オーバーライド": "オーバーライドは親クラスやインターフェースのメソッドを子クラスで再実装し、実際の型に応じた振る舞いを選ばせます。",
  "例外処理": "例外処理は通常の戻り値では扱いにくい異常を呼び出し側へ伝え、回復・記録・終了を判断する仕組みです。",
  "try-catch-finally": "tryは例外が起こり得る処理、catchは対応、finallyは成否にかかわらず必要な後処理を記述します。",
  "ListとArrayList": "Listは順序を持つコレクションの契約、ArrayListは可変長配列を使った代表的な実装です。",
  "MapとHashMap": "Mapはキーと値の対応を保持し、HashMapはハッシュ値を利用してキーから値を高速に探す代表的実装です。",
  "Set": "Setは重複を許さない要素の集合です。登録済み判定や一意な値の収集に向きます。",
  "ジェネリクス": "ジェネリクスはList<String>のように扱う型をパラメータ化し、キャストと実行時の型エラーを減らします。",
  "ラムダ式": "ラムダ式は一つの抽象メソッドを持つインターフェースの実装を、処理そのものとして簡潔に渡す構文です。",
  "Stream API": "Stream APIは要素の列に対し、絞り込み・変換・集約を段階的に組み合わせて処理します。",
  "static": "staticなメンバーは個々のインスタンスではなくクラスに属し、共有されます。状態を安易に置くと依存が見えにくくなります。",
  "final": "finalは変数の再代入、メソッドのオーバーライド、クラスの継承を制限します。対象によって意味が変わります。",
  "アクセス修飾子": "public、protected、パッケージプライベート、privateは、クラスやメンバーをどこから利用できるか制御します。",
  "パッケージ": "パッケージはクラス名の衝突を避け、関連するコードを名前空間として整理する仕組みです。",
  "JAR": "JARはクラスファイルや設定をZIP形式でまとめたJavaの配布単位です。実行可能JARには入口情報も持たせられます。",
  "JDK・JRE・JVM": "JVMはバイトコードの実行環境、JREは実行に必要な一式、JDKはコンパイラなど開発道具まで含む概念です。",
  "ガベージコレクション": "ガベージコレクションは到達不能になったオブジェクトのメモリを自動回収しますが、外部資源のcloseは別途必要です。",
  "pwd・cd・ls": "pwdは現在地、cdは移動、lsは一覧表示です。Linux操作では現在地と対象を確認する基本セットになります。",
  "mkdir・touch": "mkdirはディレクトリを作り、touchはファイル作成や更新日時の変更に使います。",
  "cp・mv・rm": "cpは複製、mvは移動・改名、rmは削除です。rmはゴミ箱を経由しないため対象確認が重要です。",
  "cat・less": "catは内容を連結して一気に出力し、lessは長いテキストをページ単位で検索しながら閲覧します。",
  "grep": "grepは標準入力やファイルから、文字列または正規表現に一致する行を抽出します。",
  "find": "findはディレクトリ以下を名前、種類、更新日時などの条件で探索し、見つけた対象へ処理も実行できます。",
  "パイプ": "パイプ `|` は左のコマンドの標準出力を右のコマンドの標準入力へ接続し、小さな処理を組み合わせます。",
  "リダイレクト": "リダイレクトは標準入力・標準出力・標準エラーの接続先を、端末からファイルなどへ切り替えます。",
  "環境変数": "環境変数はプロセスへ外部から渡される名前付き設定値です。子プロセスへ引き継げます。",
  "PATH": "PATHはコマンド名だけを入力したとき、実行ファイルを探すディレクトリと探索順を定める環境変数です。",
  "プロセス": "プロセスは実行中のプログラムの単位で、固有のPID、メモリ空間、環境、入出力を持ちます。",
  "ps・kill": "psはプロセス状態を表示し、killはPIDへシグナルを送ります。killは必ずしも強制終了だけを意味しません。",
  "標準入力・標準出力": "標準入力、標準出力、標準エラーは、プログラムと外部をつなぐ共通の入出力口です。",
  "シェルスクリプト": "シェルスクリプトはコマンド列、変数、条件分岐などをファイルへまとめ、定型操作を再現可能にします。",
  "相対パスと絶対パス": "絶対パスはルートから対象までを示し、相対パスは現在のディレクトリを基準に対象を示します。",
  "sudo": "sudoは許可された利用者が別ユーザーの権限でコマンドを実行する仕組みです。何でも解決する接頭辞ではありません。",
  "SSH": "SSHは暗号化された通信路でリモート端末操作やファイル転送を行い、パスワードや公開鍵で認証します。",
  "tar・gzip": "tarは複数ファイルを一つにまとめ、gzipはデータを圧縮します。役割が違うため組み合わせて使われます。",
  "curl": "curlはURLで指定した相手とHTTPなどで通信し、APIの要求・応答確認にも使えるCLIツールです。",
  "ログの読み方": "ログは時刻、重要度、発生場所、メッセージ、例外の連鎖を手掛かりに、最初の原因と波及したエラーを分けて読みます。",
  "UML": "UMLは構造や振る舞いを複数種類の図で表す標準的なモデリング言語です。一種類の万能な図ではありません。",
  "クラス図": "クラス図はクラスの属性・操作と、関連・継承・依存などの静的な関係を表します。",
  "ユースケース図": "ユースケース図は利用者などのアクターと、システムが提供する目的単位の機能の境界を整理します。",
  "アクティビティ図": "アクティビティ図は処理の流れ、分岐、並行処理を表し、業務フローやアルゴリズムの整理に使います。",
  "主キー": "主キーはテーブルの各行を一意に識別し、NULLを許さない列または列の組です。",
  "外部キー": "外部キーは別テーブルの候補キーを参照し、存在しない相手への参照を防いで関係の整合性を守ります。",
  "正規化": "正規化はデータの重複と更新時の矛盾を減らすため、関数従属性などに基づいてテーブルを分ける設計手法です。",
  "SELECT": "SELECTはテーブルから必要な列と行を取得します。FROM、WHERE、GROUP BY、ORDER BYなどと組み合わせます。",
  "INSERT・UPDATE・DELETE": "INSERTは行の追加、UPDATEは既存行の変更、DELETEは行の削除です。WHEREの有無が影響範囲を左右します。",
  "WHERE句": "WHERE句は各行に対する条件を指定して対象を絞ります。NULLの比較には通常の等号を使えません。",
  "JOIN": "JOINは関連条件に基づいて複数テーブルの行を組み合わせます。INNERとOUTERでは残る行が異なります。",
  "GROUP BY": "GROUP BYは同じ値を持つ行をグループ化し、COUNTやSUMなどの集約関数を単位ごとに計算します。",
  "トランザクション": "トランザクションは複数の更新を一つの論理的な処理単位として扱い、途中失敗による不整合を防ぎます。",
  "コミットとロールバック": "COMMITはトランザクションの変更を確定し、ROLLBACKは未確定の変更を取り消します。",
  "インデックス": "インデックスは検索用の追加構造で読み取りを速くできますが、容量と更新コストが増えます。",
  "NULL": "NULLは空文字や0ではなく、値が不明または存在しない状態です。比較結果は三値論理の影響を受けます。",
  "テーブル設計": "テーブル設計は業務上の事実を行と列へ落とし、キー、制約、型、履歴、更新単位を決める作業です。",
  "CRUD": "CRUDはデータに対する作成、参照、更新、削除の4操作で、画面やAPIの基本機能を整理する観点です。",
  "HTMLの基本構造": "HTMLは文書の意味と構造を要素で表し、headには文書情報、bodyには表示される内容を置きます。",
  "セマンティックHTML": "セマンティックHTMLは見た目ではなく役割に合う要素を使い、アクセシビリティや検索、保守性を高めます。",
  "フォーム": "フォームは入力欄の値を名前と組にして送信します。label、検証、送信先、HTTPメソッドが重要です。",
  "HTTP": "HTTPはクライアントがリクエストを送り、サーバーがステータス・ヘッダー・本文を返す通信プロトコルです。",
  "URL": "URLはスキーム、ホスト、ポート、パス、クエリ、フラグメントなどで資源の場所とアクセス方法を表します。",
  "GETとPOST": "GETは主に資源の取得、POSTはデータ送信や処理依頼に使います。URLへ見えるかどうかだけの違いではありません。",
  "ステータスコード": "HTTPステータスコードは応答結果を3桁で分類し、2xx成功、4xxクライアント側、5xxサーバー側などを示します。",
  "CookieとSession": "Cookieはブラウザ側に保持され要求へ送られる情報、Sessionは一般にサーバー側で利用者ごとの状態を管理する仕組みです。",
  "REST API": "REST APIは資源をURIで表し、HTTPメソッドやステータスコードを活用して状態をやり取りする設計スタイルです。",
  "JSON": "JSONはオブジェクト、配列、文字列、数値、真偽値、nullで構成される軽量なデータ交換形式です。",
  "CSSセレクタ": "CSSセレクタはどの要素へスタイルを適用するかを、要素名、class、属性、関係などで指定します。",
  "詳細度": "CSSの詳細度は複数ルールが同じプロパティへ競合したときの優先順位を決めます。単純な後勝ちだけではありません。",
  "Flexbox": "Flexboxは一方向の並びを基準に、要素の大きさ、間隔、整列を柔軟に制御するレイアウト方式です。",
  "Grid": "CSS Gridは行と列の二次元グリッドを定義し、要素を領域へ配置するレイアウト方式です。",
  "position": "positionは要素の配置基準をstatic、relative、absolute、fixed、stickyで切り替えます。",
  "レスポンシブデザイン": "レスポンシブデザインは画面幅や入力方法などに応じ、同じ内容を読みやすい配置へ適応させます。",
  "DevTools": "ブラウザのDevToolsはDOM、適用CSS、通信、JavaScript、性能などを実際のページ上で観察・変更する道具です。",
  "JavaScript DOM": "DOMはHTML文書をオブジェクトの木として表し、JavaScriptから要素の取得・変更・イベント処理を可能にします。",
  "Git add・status": "git statusは作業ツリーとステージの状態を確認し、git addは次のコミットへ含める差分をステージします。",
  "Git branch": "ブランチは特定コミットを指す移動可能な名前で、作業の流れを分けても履歴本体を複製しません。",
  "Git merge": "mergeは別のブランチの履歴を現在のブランチへ統合し、必要に応じてマージコミットを作ります。",
  "コンフリクト": "コンフリクトはGitが複数の変更を自動統合できない状態で、人が意図を判断して完成形を選びます。",
  "プルリクエスト": "プルリクエストはブランチの差分を共有し、レビュー、議論、テストを経て統合するための共同作業単位です。",
  "README": "READMEはプロジェクトの目的、起動方法、構成、制約など、最初に必要な情報を利用者へ伝える入口です。",
  "デバッグ": "デバッグは現象を再現し、期待値と実際値が最初にずれる地点を観察して原因を絞る作業です。",
  "ブレークポイント": "ブレークポイントは指定行の直前で実行を一時停止し、変数、呼び出し履歴、条件分岐を観察します。",
  "単体テスト": "単体テストは小さな処理単位へ入力を与え、期待結果や例外を自動で検証します。",
  "テストケース": "テストケースは前提、入力、操作、期待結果を具体化し、正常・境界・異常の観点を漏れにくくします。",
  "Eclipseの実行構成": "実行構成は起動クラス、引数、JRE、クラスパス、環境変数など、プログラムをどう起動するか保存します。",
  "Eclipseのデバッグ": "Eclipseのデバッグ実行はブレークポイントで停止し、変数表示やステップ実行で処理を追跡します。",
  "ビルド": "ビルドはソースコードや資源をコンパイル・検証・パッケージ化し、実行や配布が可能な成果物へ変換します。",
  "依存関係": "依存関係はコードが動くために必要な別のライブラリやモジュールとの関係で、版の衝突も管理対象です。",
  "Maven": "Mavenはpom.xmlに依存関係とビルド設定を記述し、標準的なライフサイクルでJavaプロジェクトを構築します。",
  "Gradle": "Gradleはタスクと依存関係を使い、GroovyまたはKotlin DSLで柔軟なビルドを定義します。",
  "2進数": "2進数は0と1だけで数を表し、各桁が2の累乗の重みを持ちます。ビット演算や容量計算の基礎です。",
  "論理演算": "論理演算はAND、OR、NOTなどで真偽値を組み合わせ、条件式やビット列の処理に使います。",
  "CPUとメモリ": "CPUは命令を実行し、主記憶は実行中の命令とデータを保持します。速度・容量・揮発性が異なります。",
  "アルゴリズム": "アルゴリズムは問題を有限の手順で解く方法です。同じ結果でも時間やメモリ使用量が異なります。",
  "計算量": "計算量は入力サイズの増加に対して処理時間や使用メモリがどう増えるかを、O記法などで評価します。",
  "スタックとキュー": "スタックは後入れ先出し、キューは先入れ先出しで要素を取り出すデータ構造です。",
  "ネットワーク基礎": "ネットワーク通信は階層ごとに役割を分け、アドレス、経路、ポート、プロトコルを使って相手とデータを届けます。",
  "IPアドレス": "IPアドレスはIPネットワーク上のインターフェースを識別し、ネットワーク部とホスト部をプレフィックス長で分けます。",
  "DNS": "DNSはドメイン名をIPアドレスなどの情報へ対応付ける分散データベースです。",
  "暗号化とハッシュ": "暗号化は鍵で復号可能な形へ変換し、ハッシュは入力から固定長値を計算する一方向性を重視した仕組みです。",
  "認証と認可": "認証は誰であるかを確かめ、認可は確認された主体にどの操作を許すか判断します。",
  "脆弱性": "脆弱性は攻撃や誤操作に利用され得る設計・実装・設定上の弱点で、影響と悪用可能性を評価します。",
  "バックアップ": "バックアップは障害や誤操作から復旧するための別コピーです。取得だけでなく復元試験と世代管理が必要です。",
  "冗長化": "冗長化は同じ役割を担える要素を複数用意し、一部故障でもサービスを継続できるようにします。"
};

const topicExamples = {
  "変数と型": "int count = 3;\ndouble rate = 0.1;\nString name = \"Sato\";\n// count = \"three\"; // 型が違うためコンパイルエラー",
  "String": "String a = \"Java\";\nString b = a.toUpperCase();\nSystem.out.println(a); // Java\nSystem.out.println(b); // JAVA",
  "配列": "int[] scores = {70, 85, 92};\nSystem.out.println(scores[0]);\nSystem.out.println(scores.length);",
  "if文": "int score = 75;\nif (score >= 80) {\n  System.out.println(\"A\");\n} else if (score >= 60) {\n  System.out.println(\"B\");\n} else {\n  System.out.println(\"C\");\n}",
  "switch文": "String role = \"admin\";\nswitch (role) {\n  case \"admin\" -> System.out.println(\"管理者\");\n  case \"user\" -> System.out.println(\"一般利用者\");\n  default -> System.out.println(\"不明\");\n}",
  "while文": "int remaining = 3;\nwhile (remaining > 0) {\n  System.out.println(remaining);\n  remaining--;\n}",
  "拡張for文": "List<String> names = List.of(\"A\", \"B\", \"C\");\nfor (String name : names) {\n  System.out.println(name);\n}",
  "引数と戻り値": "static int square(int number) {\n  return number * number;\n}\nint result = square(4); // 引数4、戻り値16",
  "コンストラクタ": "class User {\n  String name;\n  User(String name) {\n    this.name = name;\n  }\n}\nUser user = new User(\"Sato\");",
  "クラスとインスタンス": "class Counter {\n  int value;\n  void increment() { value++; }\n}\nCounter a = new Counter();\nCounter b = new Counter();\na.increment(); // aだけ1",
  "カプセル化": "class Account {\n  private int balance;\n  public void deposit(int amount) {\n    if (amount > 0) balance += amount;\n  }\n  public int getBalance() { return balance; }\n}",
  "継承": "class Employee { String name; }\nclass Engineer extends Employee {\n  String language;\n}",
  "インターフェース": "interface Payment {\n  void pay(int amount);\n}\nclass CardPayment implements Payment {\n  public void pay(int amount) { /* カード決済 */ }\n}",
  "オーバーロード": "void print(String value) { }\nvoid print(int value) { }\n// 名前は同じ、引数リストが異なる",
  "オーバーライド": "class Animal { void speak() { } }\nclass Dog extends Animal {\n  @Override void speak() { System.out.println(\"bow\"); }\n}",
  "例外処理": "try {\n  int value = Integer.parseInt(input);\n} catch (NumberFormatException e) {\n  System.out.println(\"数字を入力してください\");\n}",
  "try-catch-finally": "try {\n  connect();\n} catch (IOException e) {\n  log(e);\n} finally {\n  disconnect();\n}",
  "ListとArrayList": "List<String> tasks = new ArrayList<>();\ntasks.add(\"設計書を読む\");\ntasks.add(\"コードを動かす\");\nSystem.out.println(tasks.get(0));",
  "MapとHashMap": "Map<String, Integer> stock = new HashMap<>();\nstock.put(\"keyboard\", 3);\nint count = stock.getOrDefault(\"mouse\", 0);",
  "Set": "Set<String> ids = new HashSet<>();\nids.add(\"A001\");\nids.add(\"A001\");\nSystem.out.println(ids.size()); // 1",
  "ジェネリクス": "List<String> names = new ArrayList<>();\nnames.add(\"Sato\");\n// names.add(100); // String以外は不可",
  "ラムダ式": "List<String> names = List.of(\"Sato\", \"Ito\");\nnames.forEach(name -> System.out.println(name));",
  "Stream API": "List<String> result = names.stream()\n    .filter(name -> name.length() >= 3)\n    .map(String::toUpperCase)\n    .toList();",
  "static": "class IdGenerator {\n  static int nextId = 1;\n  static int issue() { return nextId++; }\n}\nint id = IdGenerator.issue();",
  "final": "final int max = 100;\n// max = 200; // 再代入不可\nfinal List<String> list = new ArrayList<>();\nlist.add(\"A\"); // オブジェクトの変更は可能",
  "アクセス修飾子": "public class UserService {\n  public void register() { validate(); }\n  private void validate() { }\n}",
  "パッケージ": "package com.example.training;\n\nimport java.util.List;\n\npublic class Main { }",
  "JAR": "$ javac -d out src/Main.java\n$ jar --create --file app.jar -C out .\n$ java -cp app.jar Main",
  "JDK・JRE・JVM": "$ javac Main.java   # JDKのコンパイラ\n$ java Main         # JVMでバイトコードを実行\n$ java -version",
  "ガベージコレクション": "User user = new User();\nuser = null; // 元のUserへ到達できなければ回収候補\n// ファイルやDB接続はtry-with-resourcesで閉じる",
  "pwd・cd・ls": "$ pwd\n/home/user\n$ cd training\n$ ls -la",
  "mkdir・touch": "$ mkdir -p practice/java\n$ touch practice/java/Main.java\n$ ls -l practice/java",
  "cp・mv・rm": "$ cp report.txt report.bak\n$ mv report.bak archive.txt\n$ rm archive.txt  # 実行前に対象を確認",
  "cat・less": "$ cat short.txt\n$ less application.log\n# less内: /ERROR で検索、qで終了",
  "grep": "$ grep -n \"ERROR\" application.log\n$ ps aux | grep java",
  "find": "$ find . -name \"*.java\"\n$ find logs -type f -mtime -1",
  "パイプ": "$ cat access.log | grep \" 500 \" | sort | uniq -c\n# 左の出力が右の入力になる",
  "リダイレクト": "$ echo \"start\" > app.log\n$ echo \"next\" >> app.log\n$ command 2> error.log",
  "環境変数": "$ export APP_ENV=development\n$ echo \"$APP_ENV\"\n$ env | grep APP_",
  "PATH": "$ echo \"$PATH\"\n$ which java\n$ /usr/bin/java -version\n# コマンドが見つからない時は探索先と実体を確認",
  "プロセス": "$ ps -ef | grep java\n$ echo $$  # 現在のシェルのPID\n$ top",
  "ps・kill": "$ ps -ef | grep sample-app\n$ kill 12345      # SIGTERM\n$ kill -9 12345   # 最終手段のSIGKILL",
  "標準入力・標準出力": "$ echo \"hello\" | tr a-z A-Z\nHELLO\n# echoの標準出力がtrの標準入力へ入る",
  "シェルスクリプト": "#!/bin/sh\nset -eu\nname=${1:-guest}\necho \"hello $name\"\n\n$ chmod +x hello.sh\n$ ./hello.sh Sato",
  "相対パスと絶対パス": "$ pwd\n/home/user/project\n$ cat ./config/app.conf\n$ cat /home/user/project/config/app.conf",
  "sudo": "$ sudo -l\n$ sudo systemctl status sample\n# 実行前に、なぜ管理権限が必要か確認",
  "SSH": "$ ssh user@example.com\n$ ssh -i ~/.ssh/id_ed25519 user@example.com\n$ scp report.txt user@example.com:/tmp/",
  "tar・gzip": "$ tar -cvf logs.tar logs/\n$ gzip logs.tar\n$ tar -xzf logs.tar.gz",
  "curl": "$ curl -i https://example.com/api/users\n$ curl -X POST -H 'Content-Type: application/json' \\\n  -d '{\"name\":\"Sato\"}' https://example.com/api/users",
  "ログの読み方": "2026-06-14T10:00:03 ERROR UserService - register failed\nCaused by: java.sql.SQLException: duplicate key\n# 最後のERRORだけでなく最初の原因と時刻を追う",
  "UML": "目的: ログイン機能を説明する\n構造を見る → クラス図\n時系列を見る → シーケンス図\n処理分岐を見る → アクティビティ図",
  "クラス図": "User\n- id: long\n- name: String\n+ changeName(name): void\n\nUser 1 ─── 0..* Order",
  "ユースケース図": "アクター: 利用者\nシステム境界: 研修管理システム\nユースケース: ログインする / 教材を見る / メモを保存する",
  "アクティビティ図": "開始 → 入力を検証\n  ├─ 正常 → DBへ保存 → 完了\n  └─ エラー → メッセージ表示 → 入力へ戻る",
  "主キー": "CREATE TABLE users (\n  id BIGINT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);",
  "外部キー": "CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT NOT NULL REFERENCES users(id)\n);",
  "正規化": "悪い例: orders(id, user_name, product1, product2)\n分割: users / orders / order_items / products\n同じ利用者名や商品を何度も持たない",
  "SELECT": "SELECT id, name\nFROM users\nWHERE active = true\nORDER BY name;",
  "INSERT・UPDATE・DELETE": "INSERT INTO users(name) VALUES ('Sato');\nUPDATE users SET name = 'Ito' WHERE id = 1;\nDELETE FROM users WHERE id = 1;",
  "WHERE句": "SELECT * FROM orders\nWHERE total >= 10000\n  AND ordered_at >= DATE '2026-06-01';",
  "JOIN": "SELECT o.id, u.name\nFROM orders o\nJOIN users u ON u.id = o.user_id;",
  "GROUP BY": "SELECT user_id, COUNT(*) AS order_count, SUM(total) AS total\nFROM orders\nGROUP BY user_id;",
  "トランザクション": "BEGIN;\nUPDATE accounts SET balance = balance - 1000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 1000 WHERE id = 2;\nCOMMIT;",
  "コミットとロールバック": "BEGIN;\nUPDATE products SET stock = stock - 1 WHERE id = 10;\n-- 問題があれば ROLLBACK;\nCOMMIT;",
  "インデックス": "CREATE INDEX idx_orders_user_id ON orders(user_id);\nEXPLAIN SELECT * FROM orders WHERE user_id = 10;\n# 読取改善と更新コストを両方確認",
  "NULL": "SELECT * FROM users WHERE deleted_at IS NULL;\n-- deleted_at = NULL はtrueにならない\nSELECT COALESCE(nickname, name) FROM users;",
  "テーブル設計": "orders\n- id: BIGINT PK\n- user_id: BIGINT FK NOT NULL\n- total: DECIMAL(12,2) NOT NULL\n- ordered_at: TIMESTAMP NOT NULL",
  "CRUD": "POST /users      Create\nGET /users/10    Read\nPUT /users/10    Update\nDELETE /users/10 Delete",
  "HTMLの基本構造": "<!doctype html>\n<html lang=\"ja\">\n<head><meta charset=\"UTF-8\"><title>研修</title></head>\n<body><main><h1>Java研修</h1></main></body>\n</html>",
  "セマンティックHTML": "<header>サイト名</header>\n<nav>主要リンク</nav>\n<main><article>教材本文</article></main>\n<footer>補足情報</footer>",
  "フォーム": "<form action=\"/users\" method=\"post\">\n  <label for=\"name\">名前</label>\n  <input id=\"name\" name=\"name\" required>\n  <button>登録</button>\n</form>",
  "HTTP": "GET /users/10 HTTP/1.1\nHost: example.com\nAccept: application/json\n\nHTTP/1.1 200 OK\nContent-Type: application/json",
  "URL": "https://example.com:443/articles/10?lang=ja#summary\n|scheme|  |host| port |path|      |query| |fragment|",
  "GETとPOST": "GET /articles?category=java   # 取得\nPOST /articles                 # 新規処理\nContent-Type: application/json\n{\"title\":\"メソッド\"}",
  "ステータスコード": "200 OK          取得成功\n201 Created     作成成功\n400 Bad Request 入力不正\n404 Not Found   対象なし\n500 Internal Server Error",
  "CookieとSession": "Set-Cookie: session_id=abc; HttpOnly; Secure; SameSite=Lax\n\nCookie: session_id=abc\n# IDを手掛かりにサーバー側の状態を参照",
  "REST API": "GET    /users/10\nPOST   /users\nPATCH  /users/10\nDELETE /users/10\n# URIは資源、メソッドは操作",
  "JSON": "{\n  \"id\": 10,\n  \"name\": \"Sato\",\n  \"skills\": [\"Java\", \"Linux\"],\n  \"active\": true\n}",
  "CSSセレクタ": "article p { color: #334; }\n.card > h2 { margin-top: 0; }\ninput[required] { border-color: #789; }",
  "詳細度": ".card p { color: blue; }   /* class + element */\n#main p { color: red; }    /* id + element: より強い */\n/* !importantの乱用より構造を整理 */",
  "Flexbox": ".toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}",
  "Grid": ".cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 16px;\n}",
  "position": ".parent { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }\n.header { position: sticky; top: 0; }",
  "レスポンシブデザイン": ".cards { grid-template-columns: repeat(3, 1fr); }\n@media (max-width: 700px) {\n  .cards { grid-template-columns: 1fr; }\n}",
  "DevTools": "1. Elementsで対象要素を選択\n2. Stylesでルールを一つ無効化\n3. Computedで最終値を確認\n4. Networkで要求と応答を見る",
  "JavaScript DOM": "const button = document.querySelector('#save');\nbutton.addEventListener('click', () => {\n  document.querySelector('#status').textContent = '保存しました';\n});",
  "Git add・status": "$ git status\n$ git diff\n$ git add src/Main.java\n$ git diff --staged\n$ git commit -m \"入力検証を追加\"",
  "Git branch": "$ git switch -c feature/training-note\n$ git branch --show-current\n$ git log --oneline --decorate -5",
  "Git merge": "$ git switch main\n$ git merge feature/training-note\n$ git log --graph --oneline --all",
  "コンフリクト": "<<<<<<< HEAD\n現在ブランチの内容\n=======\n統合するブランチの内容\n>>>>>>> feature\n# 完成形へ編集し、git addする",
  "プルリクエスト": "確認項目\n- 目的と変更理由\n- 主要な差分\n- 動作確認方法\n- 影響範囲\n- レビューしてほしい点",
  "README": "# Sample App\n\n## 必要環境\nJDK 21\n\n## 起動\n`./mvnw spring-boot:run`\n\n## テスト\n`./mvnw test`",
  "デバッグ": "再現条件: 空文字で登録\n期待: 入力エラー\n実際: NullPointerException\n最初の差: UserService.java:42 のuserがnull",
  "ブレークポイント": "停止 → Step Overで次の行\nメソッド内部へ → Step Into\n呼び出し元へ → Step Return\nVariablesで値、Call Stackで経路を確認",
  "単体テスト": "@Test\nvoid addsTax() {\n  assertEquals(1100, calculator.addTax(1000));\n}\n@Test\nvoid rejectsNegativePrice() { /* 異常系 */ }",
  "テストケース": "No.1 正常: price=1000 → 1100\nNo.2 境界: price=0 → 0\nNo.3 異常: price=-1 → IllegalArgumentException",
  "Eclipseの実行構成": "Run Configurations\n- Main class: com.example.Main\n- Program arguments: Sato 10\n- VM arguments: -Xmx512m\n- Environment: APP_ENV=dev",
  "Eclipseのデバッグ": "1. 行番号横をクリックしてブレークポイント\n2. Debug As > Java Application\n3. VariablesとExpressionsを確認\n4. F6 Step Over / F5 Step Into",
  "ビルド": "ソース + 依存関係 + 設定\n  ↓ compile\nクラスファイル\n  ↓ test / package\nJAR・WARなどの成果物",
  "依存関係": "application\n├─ library-a 1.0\n│  └─ common 2.0\n└─ library-b 3.0\n   └─ common 1.5  ← バージョン衝突",
  "Maven": "$ ./mvnw clean test\n$ ./mvnw package\n$ ./mvnw dependency:tree\n# pom.xmlでgroupId/artifactId/versionを管理",
  "Gradle": "$ ./gradlew clean test\n$ ./gradlew build\n$ ./gradlew dependencies\n# build.gradle(.kts)にタスクと依存関係",
  "2進数": "13(10進数) = 1101(2進数)\n1×8 + 1×4 + 0×2 + 1×1 = 13\n8bitの最大値: 11111111 = 255",
  "論理演算": "A=true, B=false\nA AND B = false\nA OR  B = true\nNOT A    = false\n\n権限: READ | WRITE のようなビット演算にも使う",
  "CPUとメモリ": "ストレージ → プログラムを読み込む → メモリ\nCPU → メモリから命令とデータを取得して実行\nキャッシュ → よく使うデータをCPU近くへ保持",
  "アルゴリズム": "線形探索: 先頭から一つずつ比較 O(n)\n二分探索: ソート済み範囲を半分ずつ絞る O(log n)\n前提条件と入力サイズで選ぶ",
  "計算量": "for (int i = 0; i < n; i++)       // O(n)\nfor (int i = 0; i < n; i++)\n  for (int j = 0; j < n; j++)     // O(n²)",
  "スタックとキュー": "Stack: push A, push B, pop → B\nQueue: enqueue A, enqueue B, dequeue → A\n呼出履歴はスタック、待ち行列はキュー",
  "ネットワーク基礎": "ブラウザ\n  ↓ DNSで名前解決\nIPアドレスへ接続\n  ↓ TCP/TLS\nHTTPリクエスト\n  ↓\nWebサーバー",
  "IPアドレス": "192.168.10.25/24\nネットワーク: 192.168.10.0\nホスト範囲の一部: .1〜.254\n/24は先頭24bitがネットワーク部",
  "DNS": "example.com\n  ↓ A/AAAAレコード問い合わせ\n203.0.113.10\n\n$ nslookup example.com\n$ dig example.com",
  "暗号化とハッシュ": "暗号化: 平文 + 鍵 → 暗号文 → 鍵で復号\nハッシュ: 入力 → 固定長ダイジェスト\nパスワード保存ではsalt付きの専用KDFを使う",
  "認証と認可": "認証: ログインしてSato本人と確認\n認可: Satoは記事閲覧可、管理画面は不可\nHTTPでは401と403の違いにも現れる",
  "脆弱性": "入力値をSQL文字列へ連結\n  ↓ SQLインジェクション\n対策: プレースホルダー、最小権限、入力と出力の文脈に応じた処理",
  "バックアップ": "3-2-1の例\n3個のコピー\n2種類の媒体\n1個は別拠点\n\n復旧目標: RPOとRTO、定期的なリストア試験",
  "冗長化": "利用者\n  ↓ Load Balancer\nApp 1  App 2\n  ↓\nPrimary DB → Standby DB\n# 冗長化しても切替手順と監視が必要"
};

const categorySlugs = {
  Java: "java",
  Linux: "linux",
  "設計・DB": "design-db",
  "Web・CSS": "web-css",
  "開発道具": "tools",
  基本情報: "fundamentals"
};

const quickKeywords = Object.entries(topicGroups).flatMap(([category, titles]) =>
  titles.map((title, index) => ({
    id: `quick-${categorySlugs[category]}-${index}`,
    title,
    category,
    level: "予習カード",
    summary: `${title}を研修前後の3分で確認。意味、使いどころ、次に調べる言葉を短く整理。`,
    lead: `${title}は、研修や実装でよく出会う基礎テーマです。`,
    body: topicDefinitions[title] || `${title}が何を解決するものかを、入力・処理・結果に分けて理解します。`,
    code: topicExamples[title] || `1. 「${title}」を自分の言葉で一文にする\n2. 手元の資料から実例を一つ探す`,
    detourTitle: "研修での拾い方",
    detour: "講師の説明を全部書き取るより、「目的」「具体例」「分からない語」の3点だけ残すと復習しやすくなります。",
    related: [
      titles[(index - 1 + titles.length) % titles.length],
      titles[(index + 1) % titles.length],
      category
    ]
  }))
);

const seedKeywords = [...coreKeywords, ...quickKeywords];

const sourceCatalog = {
  Java: [
    { label: "Oracle Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/" },
    { label: "Java SE API Documentation", url: "https://docs.oracle.com/en/java/javase/" }
  ],
  Java演習: [
    { label: "Oracle: Language Basics", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/" }
  ],
  Linux: [
    { label: "GNU Coreutils Manual", url: "https://www.gnu.org/software/coreutils/manual/coreutils.html" },
    { label: "Linux man-pages project", url: "https://www.kernel.org/doc/man-pages/" }
  ],
  "設計・DB": [
    { label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
    { label: "UML 2.5.1 Specification", url: "https://www.omg.org/spec/UML/2.5.1/" }
  ],
  "Web・CSS": [
    { label: "MDN Web Docs", url: "https://developer.mozilla.org/ja/" }
  ],
  CSS: [
    { label: "MDN: CSS", url: "https://developer.mozilla.org/ja/docs/Web/CSS" }
  ],
  COBOL: [
    { label: "IBM Enterprise COBOL Documentation", url: "https://www.ibm.com/docs/en/cobol-zos" }
  ],
  "開発道具": [
    { label: "Git Reference", url: "https://git-scm.com/docs" },
    { label: "Eclipse IDE Documentation", url: "https://help.eclipse.org/" }
  ],
  Eclipse: [
    { label: "Eclipse IDE Documentation", url: "https://help.eclipse.org/" }
  ],
  基本情報: [
    { label: "IPA 基本情報技術者試験", url: "https://www.ipa.go.jp/shiken/kubun/fe.html" }
  ],
  言語比較: [
    { label: "C language reference", url: "https://en.cppreference.com/w/c/language" },
    { label: "C++ language reference", url: "https://en.cppreference.com/w/cpp/language" },
    { label: "Microsoft C# documentation", url: "https://learn.microsoft.com/ja-jp/dotnet/csharp/" }
  ]
};

const categoryGuides = {
  Java: {
    viewpoint: "Javaでは、構文だけでなく「どの型の値を、どのオブジェクトが持ち、どのメソッドへ渡すか」を追うと理解が安定します。",
    pitfall: "サンプルを写して終わると、少し形が変わっただけで読めなくなります。値を一つ変える、行を一つ消す、エラーを一度出すところまでが練習です。",
    practice: ["最小のコードをEclipseで実行する", "値か条件を一か所だけ変更する", "出た結果を実行前の予想と比べる"]
  },
  Linux: {
    viewpoint: "Linuxのコマンドは「入力を受け取り、処理し、標準出力へ返す小さな道具」として見ると、パイプで組み合わせる理由までつながります。",
    pitfall: "削除や権限変更のコマンドは、意味を確認せずに貼り付けないこと。まず pwd、ls、対象パスを確認する習慣が事故を減らします。",
    practice: ["pwdで現在地を確認する", "安全な練習用ディレクトリを作る", "実行前後をlsで比較する"]
  },
  "設計・DB": {
    viewpoint: "図やSQLは記号の暗記ではなく、「業務上の誰・何を、どのデータとして持ち、どう関連付けるか」を説明する道具です。",
    pitfall: "図をきれいに描くことが目的になると、要件との対応が消えます。各箱や矢印を日本語の一文で説明できるか確認しましょう。",
    practice: ["身近な題材を3つの名詞に分ける", "主キー候補を決める", "1件と複数件の関係を声に出して読む"]
  },
  "Web・CSS": {
    viewpoint: "Webはブラウザだけで完結せず、URL、HTTP、サーバー、HTML/CSS/JavaScriptが役割分担して画面を作ります。",
    pitfall: "見た目だけを直そうとして値を増やし続けると原因が隠れます。DevToolsで対象要素、適用ルール、箱の大きさを先に確認します。",
    practice: ["DevToolsで対象要素を選ぶ", "ルールを一つだけ無効化する", "画面幅を変えて影響範囲を見る"]
  },
  "開発道具": {
    viewpoint: "開発道具は操作名より「どの状態から、何を変え、どこへ記録する操作か」を押さえると応用できます。",
    pitfall: "IDEが自動化している処理を完全な魔法として扱うと、失敗時に切り分けられません。コンソールと差分を読む癖をつけましょう。",
    practice: ["操作前の状態を確認する", "一つだけ操作する", "差分・ログ・コンソールで結果を確認する"]
  },
  基本情報: {
    viewpoint: "試験用語は単独暗記より、入力・処理・出力、時間・容量、機密性・完全性・可用性などの対比で整理すると残ります。",
    pitfall: "正解の語句だけ覚えると、問題文の言い換えに弱くなります。なぜ他の選択肢が違うかも一行で説明しましょう。",
    practice: ["一文で定義する", "反対概念か比較対象を書く", "業務での具体例を一つ考える"]
  }
};

const deepLessons = {
  "java-method": {
    duration: "12 MIN + 3 EXERCISES",
    goals: ["メソッド宣言を5つの部品に分けて読める", "引数と戻り値を混同しない", "長いmainから処理を切り出せる"],
    sections: [
      {
        title: "メソッド宣言を左から読む",
        paragraphs: [
          "`static int addTax(int price)` は、修飾子・戻り値の型・名前・引数リストの順です。最初から一塊として暗記せず、「staticな」「intを返す」「addTaxという」「int型priceを受け取る仕事」と日本語へ戻します。",
          "呼び出し側の `int total = addTax(1000);` では、1000がpriceへ入り、returnされた1100が呼び出し式全体の値になります。引数は入口、戻り値は出口です。"
        ]
      },
      {
        title: "voidとreturnの関係",
        paragraphs: [
          "`void` は戻り値を返さないという宣言です。画面へ表示するメソッドはvoidでも作れますが、計算と表示を一つにすると再利用しにくくなります。計算結果をreturnし、表示は呼び出し側に任せるとテストしやすくなります。",
          "`return` に到達すると、そのメソッドの処理はそこで終了します。戻り値の型がintなら、returnする式もintとして扱える必要があります。"
        ]
      },
      {
        title: "処理を切り出す判断基準",
        paragraphs: [
          "同じ処理が2回出たときだけでなく、コードの数行を「合計金額を計算する」のような一文で説明できるときも切り出し候補です。名前をつけることで、呼び出し側は実装詳細ではなく意図を読めます。",
          "逆に、1行ごとに細かく分けると移動ばかり増えます。ひとつのメソッドがひとつの目的を持つ、という粒度を目安にします。"
        ]
      }
    ],
    mistakes: [
      { bad: "戻り値を受け取らず、結果が消えたと思う", fix: "`int result = method();` のように変数へ代入するか、そのまま式で使います。" },
      { bad: "同じクラスの非staticメソッドをmainから直接呼ぶ", fix: "インスタンスを作るか、設計上妥当ならstaticにします。両者の違いを曖昧なまま直さないこと。" },
      { bad: "メソッド名がdoIt、test、処理1になる", fix: "入力から何を得る仕事かを動詞で表します。例: calculateTotal、findUser。" }
    ],
    exercises: [
      "2つのintを受け取り、大きい方を返すmaxメソッドを書く。",
      "税込価格の税率を引数に追加し、10%固定をやめる。",
      "mainにある入力・計算・表示を3つのメソッドへ分ける。"
    ],
    fieldNote: "現場ではメソッド名が設計書の小見出しになります。名前から実装を予測できないときは、責務が混ざっているサインかもしれません。"
  },
  "java-for-loop": {
    duration: "11 MIN + TRACE PRACTICE",
    goals: ["for文の3要素を実行順に説明できる", "配列で `< length` を使う理由が分かる", "通常forと拡張forを選び分ける"],
    sections: [
      {
        title: "実際の実行順は左から一周ではない",
        paragraphs: [
          "`for (初期化; 条件; 更新)` は、初期化を一度だけ実行し、条件確認、本文、更新、再び条件確認の順で動きます。更新は本文より後です。紙にiの値を書きながら追うと、回数のずれが見えます。",
          "`i < 3` なら本文で使われるiは0、1、2です。3になった時点で条件がfalseになり終了します。"
        ]
      },
      {
        title: "配列と境界値",
        paragraphs: [
          "長さ3の配列で有効な添字は0から2です。`i <= array.length` ではiが3の回も本文へ入り、存在しない要素を読んで `ArrayIndexOutOfBoundsException` になります。",
          "この種の「1つ多い・1つ少ない」誤りをoff-by-one errorと呼びます。0件、1件、最後の1件をテストすると見つけやすくなります。"
        ]
      },
      {
        title: "拡張for文との使い分け",
        paragraphs: [
          "要素を先頭から順に読むだけなら `for (String tool : tools)` の方が意図が明確です。添字を表示したい、前後の要素を比べたい、逆順に進みたい場合は通常のfor文が向きます。",
          "どちらが上位という話ではありません。ループ内で必要な情報が「要素だけ」か「位置も必要」かで選びます。"
        ]
      }
    ],
    mistakes: [
      { bad: "条件を `i <= length` にする", fix: "最後の有効な添字はlength - 1。通常は `i < length` です。" },
      { bad: "更新式を書き忘れる", fix: "条件が永遠に変わらず無限ループになります。デバッガでiを監視します。" },
      { bad: "ループ中にListから要素を直接削除する", fix: "拡張forでは例外の原因になります。IteratorやremoveIfなど目的に合うAPIを検討します。" }
    ],
    exercises: ["1から10の合計を求める。", "配列から最も長い文字列を探す。", "5、4、3、2、1の逆順で表示する。"],
    fieldNote: "業務コードでは件数0件も普通に来ます。ループが一度も動かない場合に、後続処理が壊れないかまで確認します。"
  },
  "java-fizzbuzz": {
    duration: "14 MIN + REFACTOR",
    goals: ["条件の包含関係を説明できる", "剰余演算子で倍数判定ができる", "動作確認後にメソッドへ分割できる"],
    sections: [
      {
        title: "先に条件表を書く",
        paragraphs: [
          "15の倍数は3の倍数でも5の倍数でもあります。そのため3を最初に判定すると、15はFizzで確定してFizzBuzzへ到達しません。より狭い条件、つまり両方を満たす条件から先に置きます。",
          "`i % 3 == 0 && i % 5 == 0` と書いても正解です。15を使う形は最小公倍数を利用しています。読み手に意図が伝わる方を選びます。"
        ]
      },
      {
        title: "表示と判定を分ける",
        paragraphs: [
          "最初は一つのfor文で完成させて構いません。その後、数値を受け取って文字列を返す `toFizzBuzz(int number)` へ判定を切り出すと、1件ずつテストできます。",
          "出力をメソッド内で直接行うより文字列をreturnする方が、3ならFizz、5ならBuzz、15ならFizzBuzzというテストを書きやすくなります。"
        ]
      },
      {
        title: "FizzBuzzが見ているもの",
        paragraphs: [
          "採用問題として有名ですが、本質は奇抜なアルゴリズムではありません。仕様を条件へ分解できるか、優先順位を処理順へ反映できるか、小さく確認できるかを見ています。",
          "答えを暗記するより、7の倍数でPopを追加されたときに条件を組み直せることの方が重要です。"
        ]
      }
    ],
    mistakes: [
      { bad: "3、5、15の順に判定する", fix: "条件が重なる場合は、より限定的な15を先にします。" },
      { bad: "`i / 3 == 0` で倍数判定する", fix: "余りを見る演算子は `%` です。`i % 3 == 0` とします。" },
      { bad: "1から100なのに `i < 100`", fix: "上限を含む仕様なので `i <= 100`。境界値を日本語と照合します。" }
    ],
    exercises: ["1〜30版を紙で予想してから実行する。", "判定を文字列を返すメソッドへ分ける。", "7の倍数でPopを追加し、105の出力を決める。"],
    fieldNote: "仕様に条件が増えるほどifの順番だけでは管理しづらくなります。条件表やテストケースを先に作る癖は、そのまま業務ロジックに効きます。"
  },
  "sequence-diagram": {
    duration: "13 MIN + READING GUIDE",
    goals: ["縦と横の意味を説明できる", "同期呼び出しと戻りを追える", "処理の担当漏れを見つけられる"],
    sections: [
      {
        title: "横は登場人物、縦は時間",
        paragraphs: [
          "画面、Controller、Service、Repository、DBなどを横に並べ、各要素から下へ伸びる線をライフラインと呼びます。上で起きたことほど先、下ほど後です。",
          "矢印のラベルにはメソッド名やメッセージを書きます。単に「処理」とせず `searchUsers(condition)` のようにすると、実装との対応が追いやすくなります。"
        ]
      },
      {
        title: "正常系だけで終わらせない",
        paragraphs: [
          "検索結果0件、DB接続失敗、入力エラーでは流れが変わります。UMLではaltフラグメントで条件分岐、loopで繰り返しを表せます。",
          "すべてを一枚に詰め込むと読めないので、主要な正常系と重要な異常系を分ける判断も必要です。"
        ]
      },
      {
        title: "レビューで見る場所",
        paragraphs: [
          "画面から直接DBへ矢印が飛んでいないか、同じデータを何度も取得していないか、戻り値が次の処理でどう使われるかを確認します。",
          "シーケンス図は完成品の飾りではなく、実装前に責務や呼び出し回数の違和感を見つけるための会話道具です。"
        ]
      }
    ],
    mistakes: [
      { bad: "矢印に「処理する」しか書かない", fix: "何を渡し何を得るか分かる名前にします。" },
      { bad: "戻り値と次の呼び出しの関係がない", fix: "取得したデータがどこへ渡るかまで線を追います。" },
      { bad: "実装の全メソッドを一枚へ載せる", fix: "図の目的に必要な粒度へ絞ります。" }
    ],
    exercises: ["ログイン成功の流れを4者で描く。", "パスワード不一致のaltを追加する。", "自分の図から各担当のメソッド候補を拾う。"],
    fieldNote: "SIerの設計書では製品や現場ごとに矢印の書式が少し違います。記号の正しさだけでなく、凡例とチーム内の読み方を確認します。"
  },
  "er-diagram": {
    duration: "15 MIN + MODELING",
    goals: ["Entity・属性・Relationshipを区別する", "1対多を外部キーへ落とせる", "多対多に中間テーブルが必要な理由を説明できる"],
    sections: [
      {
        title: "業務の名詞をそのままテーブルにしない",
        paragraphs: [
          "要件から顧客、注文、商品などの名詞を拾うのは出発点です。ただし「購入者」と「顧客」が同じ概念なら統一し、逆に住所履歴を持つ必要があるなら住所を別Entityにする可能性があります。",
          "Entityを分ける基準は、識別したいもの、独立して更新したいもの、複数件を持ちたいものです。"
        ]
      },
      {
        title: "カーディナリティを日本語で読む",
        paragraphs: [
          "顧客1人は注文を0件以上持つ。注文1件は必ず1人の顧客に属する。この二文が描ければ、顧客1対注文多、注文側にcustomer_idという外部キーを置く構造が見えます。",
          "0を許すか必須かも重要です。注文の顧客IDがNULL可能なら、顧客不明の注文を業務上許すのか確認が必要です。"
        ]
      },
      {
        title: "多対多をほどく",
        paragraphs: [
          "注文には複数商品が入り、商品も複数注文に登場します。この多対多は注文詳細という中間Entityへ分け、order_id、product_id、数量、注文時単価などを持たせます。",
          "特に注文時単価は商品マスタの現在価格とは別です。業務上その時点の事実を保存する必要があるためです。"
        ]
      }
    ],
    mistakes: [
      { bad: "名前を主キーにする", fix: "同姓同名や名称変更を考え、安定したIDを用意します。" },
      { bad: "カンマ区切りで複数商品IDを一列に入れる", fix: "検索・制約・更新が難しくなるため中間テーブルへ分けます。" },
      { bad: "現在値だけで過去を再現しようとする", fix: "注文時単価など履歴上必要な値は取引側へ保持します。" }
    ],
    exercises: ["図書館の本・利用者・貸出をモデル化する。", "注文と商品の多対多を注文詳細で解消する。", "各外部キーがNULL可能か理由を書く。"],
    fieldNote: "ER図のレビューでは、線の美しさより「削除したら何が残るか」「過去の帳票を再現できるか」が効きます。"
  },
  "cobol-introduction": {
    duration: "16 MIN + CODE READING",
    goals: ["4つのDIVISIONの役割を区別する", "レベル番号とPIC句を読める", "Javaとのデータ表現の違いを意識する"],
    sections: [
      {
        title: "プログラムをDIVISION単位で読む",
        paragraphs: [
          "IDENTIFICATION DIVISIONはプログラム名などの識別情報、ENVIRONMENT DIVISIONは実行環境やファイル、DATA DIVISIONはデータ定義、PROCEDURE DIVISIONは処理を記述します。",
          "最初から1行ずつ追うより、データの定義と処理の入口を先に見つけると全体像を掴みやすくなります。"
        ]
      },
      {
        title: "01、05、PICは何を表すか",
        paragraphs: [
          "01や05は値そのものではなく階層を表すレベル番号です。01 CUSTOMER-RECORDの下に05 CUSTOMER-ID、05 CUSTOMER-NAMEがあれば、一つのレコードを複数項目へ分けています。",
          "`PIC X(10)` は英数字10文字、`PIC 9(5)` は数字5桁という性質を表します。小数点や符号、編集用文字を含むPIC句もあるため、桁と用途をセットで読みます。"
        ]
      },
      {
        title: "業務データと固定長の感覚",
        paragraphs: [
          "COBOLでは帳票やファイルの桁位置が重要な現場が多く、項目の長さと表現が処理へ強く影響します。JavaのStringやintと同じ感覚だけで読むと、空白埋めや数値編集を見落とします。",
          "文字コード、外部ファイル、JCL、コピー句など、ソース単体では完結しない情報もあります。研修では実行手順と入出力ファイルも一緒にメモしましょう。"
        ]
      }
    ],
    mistakes: [
      { bad: "PIC XとPIC 9をJavaのStringとintへ単純対応させる", fix: "格納形式、桁、符号、小数、編集用途まで確認します。" },
      { bad: "ピリオドを読み飛ばす", fix: "COBOLでは文や範囲へ影響します。終端位置を意識します。" },
      { bad: "ソースだけで入出力が分かると思う", fix: "JCL、ファイル定義、コピー句、実行ログも確認します。" }
    ],
    exercises: ["顧客ID5桁と氏名20文字のレコードを定義する。", "DISPLAYする値がどのデータ項目か線で結ぶ。", "Java版とCOBOL版のデータ定義の違いを3つ書く。"],
    fieldNote: "COBOL案件では『言語を読める』と『業務を理解して変更影響を読める』の間に大きな距離があります。項目名と帳票・ファイルの関係を丁寧に追うのが近道です。"
  },
  "c-family-difference": {
    duration: "13 MIN + COMPARISON",
    goals: ["C・C++・C#を実行環境から区別する", "メモリ管理の違いを説明できる", "用途だけで優劣を決めない"],
    sections: [
      {
        title: "同じ系譜でも実行の仕組みが違う",
        paragraphs: [
          "CとC++は一般にネイティブコードへコンパイルされ、OSやCPUに近い制御ができます。C#は通常.NETランタイム上で動き、ガベージコレクションや豊富な標準ライブラリを利用します。",
          "JavaとC#は仮想実行環境やGCという点で似ていますが、言語仕様、ランタイム、ライブラリ、開発文化は別です。"
        ]
      },
      {
        title: "C++はCにクラスを足しただけではない",
        paragraphs: [
          "C++にはクラスだけでなく、テンプレート、RAII、例外、標準ライブラリ、ラムダなど多くの仕組みがあります。C風にも書けますが、現代的なC++ではリソース管理や型安全の考え方が大きく異なります。",
          "CのコードがそのままC++で常に正しいとは限らず、両言語の規格とコンパイラの扱いを区別する必要があります。"
        ]
      },
      {
        title: "言語選択は既存資産を含む",
        paragraphs: [
          "組み込み、OS、ゲームエンジン、Windows業務アプリなど、各言語には得意分野と大きな既存資産があります。単純な新旧ランキングでは決まりません。",
          "新人としては『なぜこの現場はこの言語か』を、性能、環境、ライブラリ、保守要員、既存コードから聞くと理解が深まります。"
        ]
      }
    ],
    mistakes: [
      { bad: "C+という主要言語がCとC++の間にあると思う", fix: "通常はC++の誤記・略記です。正式名称を確認します。" },
      { bad: "文法が似ているのでライブラリも同じと思う", fix: "実行環境と標準ライブラリは別物です。" },
      { bad: "GCがない言語は古いだけだと思う", fix: "制御性、予測可能性、用途とのトレードオフがあります。" }
    ],
    exercises: ["Hello Worldのビルドから実行までを4言語で比較する。", "メモリ管理、実行環境、主用途の表を作る。", "自分の研修でJavaが選ばれている理由を仮説にする。"],
    fieldNote: "言語名だけでは案件の実態は分かりません。同じC++でも規格、コンパイラ、フレームワーク、対象OSで開発体験が大きく変わります。"
  }
};

const codeStudies = {
  "command-line-args": {
    notes: [
      ["public class Hello", "Helloというクラスを宣言します。publicクラス名とファイル名は通常一致させ、Hello.javaとして保存します。"],
      ["public static void main(String[] args)", "JVMが最初に呼ぶ入口です。起動時に渡された文字列が、順番を保ったString配列argsへ入ります。"],
      ["args[0]", "配列の先頭要素を読みます。`java Hello Tanaka`ならTanakaです。引数なしで実行すると要素0が存在せず例外になります。"],
      ["\"こんにちは、\" + args[0] + \"さん\"", "`+`で3つの文字列を連結します。数値の加算にも同じ記号を使うため、型と評価順に注意します。"],
      ["System.out.println(...)", "組み立てた文字列を標準出力へ書き、最後に改行します。EclipseではConsoleビューに表示されます。"],
      ["java Hello Tanaka", "シェルからHelloクラスを起動し、Tanakaを一つ目のコマンドライン引数として渡します。`$`はプロンプトなので入力しません。"]
    ],
    trace: [
      ["起動", "javaコマンドがHelloをJVMへ指定", "引数としてTanakaを渡す"],
      ["main呼び出し", "args.length = 1", "args[0] = \"Tanaka\""],
      ["文字列連結", "\"こんにちは、Tanakaさん\"", "新しいStringが作られる"],
      ["出力", "printlnが標準出力へ書く", "Consoleに一行表示"],
      ["引数なしの場合", "args.length = 0", "args[0]でArrayIndexOutOfBoundsException"]
    ]
  },
  "java-method": {
    notes: [
      ["public class PriceCalculator", "クラスの宣言です。Javaでは処理もデータも基本的にクラスの中へ置きます。ファイル名は通常 PriceCalculator.java です。"],
      ["static int addTax(int price)", "addTaxメソッドの入口です。int型のpriceを受け取り、int型の結果を返します。staticなのでmainからインスタンス生成なしで呼べます。"],
      ["return (int) (price * 1.1)", "priceを1.1倍し、doubleになった結果をintへキャストして返します。小数部分は四捨五入ではなく切り捨てられます。金額計算でdoubleを使う是非も寄り道ポイントです。"],
      ["public static void main(String[] args)", "Javaアプリケーションの実行入口です。JVMがこの形のmainメソッドを探して呼び出します。"],
      ["int total = addTax(1000)", "1000を引数として渡します。メソッド内ではpriceが1000になり、returnされた1100がtotalへ代入されます。"],
      ["System.out.println(total)", "標準出力へtotalを表示します。計算する責任と表示する責任が別の行に分かれています。"]
    ],
    trace: [
      ["呼び出し前", "mainを実行中", "totalはまだ存在しない"],
      ["addTax(1000)", "price = 1000", "mainは戻り値を待つ"],
      ["price * 1.1", "1100.0", "計算結果は一時的にdouble"],
      ["(int) 1100.0", "1100", "intへ変換"],
      ["return", "addTax終了", "1100が呼び出し位置へ戻る"],
      ["代入後", "total = 1100", "printlnで表示"]
    ]
  },
  "java-for-loop": {
    notes: [
      ["String[] tools = {...}", "String型の要素を3つ持つ配列を作ります。添字は0、1、2です。lengthは3です。"],
      ["int i = 0", "ループ開始前に一度だけ実行されます。配列の先頭添字が0なのでiも0から始めます。"],
      ["i < tools.length", "本文へ入ってよいか毎周確認します。iが3になったらfalseになり、存在しないtools[3]を読まずに終了します。"],
      ["i++", "本文の後でiを1増やします。`i = i + 1` の短縮形です。"],
      ["tools[i]", "現在のiを添字として配列要素を読みます。iの境界管理と配列アクセスはセットで考えます。"],
      ["for (String tool : tools)", "各要素をtoolへ順番に代入する拡張for文です。添字が不要ならこちらの方が読みやすくなります。"]
    ],
    trace: [
      ["1周目", "i = 0", "tools[0] = Java"],
      ["2周目", "i = 1", "tools[1] = Linux"],
      ["3周目", "i = 2", "tools[2] = Git"],
      ["終了判定", "i = 3", "3 < 3 はfalse。本文へ入らない"]
    ]
  },
  "java-fizzbuzz": {
    notes: [
      ["int i = 1", "仕様が1から100なので1から開始します。配列のループと違い、必ず0開始ではありません。"],
      ["i <= 100", "100を含めるため小なりイコールです。境界値は日本語の仕様と照合します。"],
      ["i % 15 == 0", "15で割った余りが0なら3と5の両方の倍数です。より限定的な条件を先に判定します。"],
      ["else if", "前の条件がfalseだった場合だけ次を調べます。15は最初のifで処理され、3の条件へ流れません。"],
      ["System.out.println(i)", "どの倍数条件にも当てはまらなかった数だけ、その数値自体を表示します。"],
      ["i++", "一回の判定が終わるごとに次の整数へ進みます。"]
    ],
    trace: [
      ["i = 3", "15では割り切れない → 3で割り切れる", "Fizz"],
      ["i = 5", "15でも3でも割り切れない → 5で割り切れる", "Buzz"],
      ["i = 15", "最初の条件で15の倍数", "FizzBuzz"],
      ["i = 16", "すべての条件がfalse", "16"]
    ]
  }
};

const triviaByCategory = {
  Java: [
    ["mainのString[] argsは予約語ではない", "argsという名前は慣習です。String[] bananaでもコンパイルできますが、読む人を驚かせるだけなので普通はargsを使います。"],
    ["Javaは最初からJavaという名前ではなかった", "開発初期の名称はOakでした。商標上の事情などからJavaへ変わったとされています。"],
    ["intはオブジェクトではない", "intはプリミティブ型、Integerはラッパークラスです。コレクションではList<int>ではなくList<Integer>を使います。"],
    ["セミコロンは文の区切り", "改行そのものではなくセミコロンが文を区切ります。ただし読みやすさのため通常は一文一行にします。"]
  ],
  Java演習: [
    ["FizzBuzzは答えより説明が本体", "短い問題なので、条件の順番をなぜそうしたか説明できるかが理解の差になります。"],
    ["剰余は時計にも使える", "曜日や交代制、循環する配列など「一定数で先頭へ戻る」処理に%が登場します。"],
    ["テストは3・5・15だけでは足りない", "条件に該当しない1、上限の100、開始値の1も境界・通常ケースとして確認します。"],
    ["短いコードにも設計がある", "表示を直接行うか文字列を返すかで、再利用性やテストの書きやすさが変わります。"]
  ],
  Linux: [
    ["コマンド名は省略語だらけ", "pwdはprint working directory、grepの名前はedのコマンド `g/re/p` に由来すると説明されます。"],
    ["成功は0", "多くのLinuxコマンドは終了ステータス0で成功、0以外で失敗を表します。Javaの真偽値の感覚とは逆に見えます。"],
    ["ドットで始まるファイル", ".bashrcのような名前はlsの通常表示で省略されます。秘密というより、表示を散らかさないための慣習から始まった仕組みです。"],
    ["拡張子がなくても実行できる", "Linuxは実行権限やファイル形式、shebangなどで扱います。Windowsほど拡張子に依存しません。"]
  ],
  "設計・DB": [
    ["NULLは値ではない", "値が不明・存在しない状態なので、`= NULL` ではなく `IS NULL` を使います。真偽だけでなくUNKNOWNを含む三値論理につながります。"],
    ["主キーは業務上の名前と別にすることが多い", "氏名や商品名は変わったり重複したりします。識別用IDと表示名を分ける理由です。"],
    ["図は未来の会話を減らす道具", "記号を完璧に描くことより、実装者と業務担当者が同じ誤解をしないことが価値です。"],
    ["インデックスは目次に似ているが無料ではない", "検索は速くなり得ますが、追加・更新時には索引側も更新するためコストが増えます。"]
  ],
  "Web・CSS": [
    ["404はページが消えた時だけではない", "URLに対応する資源が見つからない応答です。APIのIDが存在しない場合にも使われます。"],
    ["CSSは後勝ちだけではない", "出現順の前に詳細度や重要度、スタイルの出所が比較されます。だから下に書いても負けることがあります。"],
    ["Cookieはお菓子だが語源は別の技術用語", "magic cookieと呼ばれた識別情報の用語をWebが引き継いだとされています。"],
    ["ブラウザは壊れたHTMLをかなり直す", "多少の閉じタグ忘れでも表示されるのは、HTMLパーサーにエラー回復規則があるためです。正しいという意味ではありません。"]
  ],
  CSS: [
    ["すべての要素は箱", "文字も画像も最終的にはボックスとして配置されます。レイアウト調査でoutlineを付ける技が効く理由です。"],
    ["marginは場合によって合体する", "縦方向のmarginは相殺ではなく折りたたまれることがあり、指定値の単純な足し算になりません。"],
    ["透明と存在しないは違う", "opacity: 0は見えなくても場所やクリック判定が残る場合があります。display: noneとは挙動が異なります。"],
    ["1pxは物理的な1画素とは限らない", "CSSピクセルは論理単位で、高密度ディスプレイでは複数の物理画素に対応します。"]
  ],
  "開発道具": [
    ["Gitは差分ではなくスナップショットとして考える", "各コミットはプロジェクト全体の状態を指し、変わらないファイルは既存データを再利用します。"],
    ["commitとpushは別", "commitは手元のリポジトリへ記録し、pushはその履歴をリモートへ送ります。"],
    ["デバッガは時間を止める観察装置", "コードを直す道具というより、期待と実際が最初にずれる瞬間を見つける道具です。"],
    ["IDEの赤線が常にJavaのエラーとは限らない", "ビルドパス、JDK設定、インデックス、プラグインなどIDE側の状態が原因の場合もあります。"]
  ],
  Eclipse: [
    ["ワークスペースはコード置き場以上", "プロジェクト一覧や画面配置などのメタデータも持つため、同じソースでもワークスペースが違うと見え方が変わります。"],
    ["Cleanで直る理由", "生成済みクラスなどを作り直し、ソースと成果物の食い違いを解消する場合があります。万能薬ではありません。"],
    ["F5とF6は役割が違う", "Step Intoはメソッド内部へ入り、Step Overはその行を実行して次へ進みます。"],
    ["保存時ビルド", "自動ビルドが有効なら保存をきっかけにコンパイルされ、エラー表示が更新されます。"]
  ],
  COBOL: [
    ["COBOLは読みやすい英語風を目指した", "COmmon Business-Oriented Languageという名前の通り、業務データ処理を強く意識して設計されました。"],
    ["レベル番号は行番号ではない", "01や05はデータ項目の階層を表します。ソースの何行目かという意味ではありません。"],
    ["PICは写真ではない", "PICTURE句の略で、文字種・桁数・編集形式などデータの姿を記述します。"],
    ["長寿命は言語だけの理由ではない", "大量の業務ルール、データ、周辺運用、移行リスクが一緒に積み重なっています。"]
  ],
  基本情報: [
    ["1KBは文脈で1000か1024か", "SI接頭語では1000、二進接頭語KiBでは1024です。問題文や製品表示の前提を確認します。"],
    ["バグの語源は虫より古い", "機械の不具合をbugと呼ぶ用例はコンピュータ以前からあり、有名な蛾の記録は印象的な実例です。"],
    ["暗号化とハッシュは戻せるかが違う", "暗号化は鍵で復号する前提、ハッシュは元へ戻す用途ではありません。"],
    ["バックアップは復元できて完成", "コピーが存在するだけでは不十分です。復元時間と欠損範囲を実際に確認して初めて役立ちます。"]
  ],
  言語比較: [
    ["C++の++はインクリメント演算子", "Cを一段進めるという洒落を含む名称です。C+という段階が正式に存在したわけではありません。"],
    ["C#の#は音楽記号を連想させる", "4つの+を重ねた形にも見え、C++の次という連想を持つ名前ですが、独立した.NET言語です。"],
    ["同じ波括弧でも別言語", "見た目が似ていても、型システム、メモリ管理、ビルド、標準ライブラリは大きく違います。"],
    ["性能は言語名だけで決まらない", "アルゴリズム、実装、コンパイラ、実行環境、I/Oなど多くの要因があります。"]
  ]
};

function codeStudyFor(item) {
  const explicit = codeStudies[item.id];
  if (explicit) return explicit;
  const lines = item.code.split("\n").filter(line => line.trim()).slice(0, 8);
  return {
    notes: lines.map(line => {
      const clean = line.trim();
      let explanation = "この行が直前の状態をどう変え、次の行へ何を渡すかを確認します。";
      if (clean.startsWith("#") || clean.startsWith("//")) explanation = "実行されないコメントです。例の前提、注意点、期待する結果を人間向けに残しています。";
      else if (clean.startsWith("$")) explanation = "シェルで実行するコマンドです。`$` 自体は入力せず、その後ろを実行します。終了ステータスと標準出力も確認します。";
      else if (/^(if|else if|while|for|switch)\b/.test(clean)) explanation = "処理の流れを変える行です。条件がtrueになる具体的な値と、falseのときの行き先を追います。";
      else if (/^(SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE|JOIN|GROUP|ORDER|BEGIN|COMMIT|ROLLBACK)/i.test(clean)) explanation = "SQLの役割を表す句です。対象テーブル、対象行、変更範囲を日本語へ戻して読みます。";
      else if (clean.includes("=")) explanation = "値の定義または代入を含む行です。左辺が何を指し、右辺がどの型・値になるかを確認します。";
      else if (clean.includes("return")) explanation = "呼び出し元へ結果を返し、この処理を終了します。返る値の型と受け取り先を追います。";
      return [clean, explanation];
    }),
    trace: [
      ["実行前", "入力・対象・現在地を確認", "予想を一文で書く"],
      ["実行中", "値、条件、対象件数の変化を追う", "最初に予想とずれた行を探す"],
      ["実行後", "出力・終了状態・副作用を確認", "一か所だけ変えて再実行する"]
    ]
  };
}

function triviaFor(item) {
  return triviaByCategory[item.category] || [
    ["名前の由来を調べる", "技術用語の名前には、以前の道具や歴史的な制約が残っていることがあります。"],
    ["似た仕組みと比較する", "単独の定義より、何が同じで何が違うかを並べる方が記憶に残ります。"],
    ["失敗例を一つ持つ", "正しい例だけでなく、どんな入力で壊れるかを知ると実務で思い出しやすくなります。"],
    ["現場の理由を尋ねる", "仕様上できることと、そのプロジェクトで採用されている理由は別です。"]
  ];
}

const weeklyArticles = [
  {
    id: "week-24",
    issue: "024",
    date: "2026.06.14",
    title: "今週のITを、3つだけ。パスキー、AIエージェント、そして“消えない”古いJava",
    summary: "全部追わなくて大丈夫。新人エンジニアの仕事や勉強につながりそうな話題だけ、背景からゆっくり読み解きます。",
    tags: ["SECURITY", "AI", "JAVA"],
    minutes: "6 MIN READ"
  },
  {
    id: "week-23",
    issue: "023",
    date: "2026.06.07",
    title: "Linuxの小さな道具たちと、AI時代にCLIが妙に元気な理由",
    summary: "派手なAIニュースの脇で、ターミナルが再評価されている。初学者向けにコマンド文化から紹介。",
    tags: ["LINUX", "AI"],
    minutes: "5 MIN READ"
  }
];

const sideNotes = [
  { label: "INTERNET FOLKLORE", title: "「本番環境で試す」という怖い言葉", text: "なぜ検証環境が必要なのかを、失敗談の構造から考える。笑えるうちに覚えておこう。" },
  { label: "JAVA SIDE QUEST", title: "nullは「空っぽ」ではない", text: "空文字や0とは別物。何も参照していない、という状態がどうして厄介なのか。" },
  { label: "1ST YEAR SURVIVAL", title: "質問するときの最強テンプレ", text: "やったこと、期待したこと、起きたこと。この3つだけで質問の解像度がぐっと上がる。" }
];

let keywords = loadKeywords();
let currentFilter = "すべて";
let readingList = loadJson("yorimichi-reading-list", []);
let trainingNotes = loadJson("yorimichi-training-notes", []);

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function loadKeywords() {
  try {
    const savedValue = JSON.parse(localStorage.getItem("yorimichi-keywords"));
    const saved = Array.isArray(savedValue)
      ? savedValue.filter(item => item.level !== "予習カード")
      : savedValue;
    if (!Array.isArray(saved) || !saved.length) return seedKeywords;
    const savedIds = new Set(saved.map(item => item.id));
    return [...saved, ...seedKeywords.filter(item => !savedIds.has(item.id))];
  } catch {
    return seedKeywords;
  }
}

function saveKeywords() {
  localStorage.setItem("yorimichi-keywords", JSON.stringify(keywords));
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function formatInline(value = "") {
  return escapeHtml(value).replace(/`([^`]+)`/g, "<code class=\"inline-code\">$1</code>");
}

function genericLesson(item) {
  const guide = categoryGuides[item.category] || {
    viewpoint: `${item.title}は単独で暗記せず、何を入力として受け取り、何を変え、どんな結果を返すものかに分けて理解します。`,
    pitfall: "用語の一文定義だけで分かったつもりにならず、具体例と反例を一つずつ作ると理解の穴が見つかります。",
    practice: ["一文で説明する", "具体例を一つ作る", "似た用語との違いを書く"]
  };
  return {
    duration: "8 MIN + MINI PRACTICE",
    goals: [
      `${item.title}を自分の言葉で説明できる`,
      "使う場面と使わない場面を区別できる",
      "小さな具体例で理解を確認できる"
    ],
    sections: [
      {
        title: "まず役割から理解する",
        paragraphs: [
          item.body,
          guide.viewpoint
        ]
      },
      {
        title: "研修中はここを観察する",
        paragraphs: [
          `資料やサンプルコードで「${item.title}」を見つけたら、その行だけでなく直前の入力と直後の結果を追います。名前を知ることより、処理の流れの中で何を担当しているかを説明できる方が実務では役立ちます。`,
          "講師の操作を写すときは、操作前の状態、実行したこと、変化した結果の3列でメモします。後から再現できなければ、どの段階が曖昧かを特定できます。"
        ]
      },
      {
        title: "知識を使える形へ変える",
        paragraphs: [
          `最小例を一度そのまま動かした後、値・条件・名前のどれか一つだけを変えます。「${item.title}がなくても同じことができるか」「使うと何が読みやすくなるか」まで比較すると、丸暗記から抜けられます。`,
          "エラーが出た場合は消して終わりにせず、エラー名、原因だった行、直した内容を一行ずつ残します。自分専用のエラー辞典になり、同じ失敗からの復帰が速くなります。"
        ]
      }
    ],
    mistakes: [
      { bad: "定義を読んだだけで完了にする", fix: "画面、コード、コマンド、図のいずれかで具体例を一つ作ります。" },
      { bad: "似た言葉を同じものとして覚える", fix: `関連語の「${item.related[0] || "比較対象"}」と、目的・入力・結果の違いを表にします。` },
      { bad: "分からない箇所を全部同時に調べる", fix: "今の処理を止めている疑問を一つ選び、残りはあとでまとめる箱へ置きます。" }
    ],
    exercises: [
      `上の「${item.title}」の例を手元で再現し、実行前の予想と実際の結果を書く。`,
      "値・条件・対象のどれか一つだけを変え、結果が変わる理由を一文で説明する。",
      `「${item.related[0] || "似た用語"}」との違いを、目的・入力・結果の3列で比較する。`
    ],
    fieldNote: guide.pitfall
  };
}

function lessonFor(item) {
  return deepLessons[item.id] || genericLesson(item);
}

function codeLabelFor(category) {
  return ({
    Java: "JAVA",
    Java演習: "JAVA EXERCISE",
    Linux: "TERMINAL",
    "設計・DB": "SQL / DIAGRAM",
    "Web・CSS": "WEB",
    CSS: "CSS",
    COBOL: "COBOL",
    "開発道具": "TOOL / COMMAND",
    Eclipse: "IDE / FILE",
    基本情報: "CONCEPT MODEL",
    言語比較: "LANGUAGE MAP"
  })[category] || "EXAMPLE";
}

function keywordCards(items = keywords) {
  return items.map((item, index) => `
    <article class="keyword-card" data-keyword="${item.id}" tabindex="0">
      <div>
      <span class="card-number">${item.level ? "QUICK" : "GUIDE"}_${String(index + 1).padStart(2, "0")}</span>
        <span class="category-label">${escapeHtml(item.category)}</span>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <span class="card-arrow">↗</span>
    </article>
  `).join("");
}

function renderHome() {
  return `
    <div class="view">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">A casual field guide for rookie engineers</p>
          <h1>わからないを、<br><em>寄り道しながら</em><br>面白く。</h1>
          <p class="hero-lead">教科書のすみっこにあったコラムのように。Java、Linux、CSSから現場の小ネタまで、気になった言葉を入口にゆっくり知識をつなげよう。</p>
          <form class="search-box" id="hero-search">
            <span class="search-icon" aria-hidden="true"></span>
            <input id="hero-search-input" aria-label="キーワードを検索" placeholder="例：コマンドライン引数、クラスパス、chmod..." />
            <button class="primary-btn" type="submit">調べる</button>
          </form>
          <div class="quick-tags">
            <button data-search="コマンドライン引数"># コマンドライン引数</button>
            <button data-search="クラスパス"># クラスパス</button>
            <button data-search="FizzBuzz"># FizzBuzz</button>
            <button data-search="シーケンス図"># シーケンス図</button>
          </div>
        </div>
        <div class="hero-art">
          <img src="./assets/learning-map-v2.png" alt="JavaやLinuxなどの技術モチーフを淡い青と緑で構成したイラスト" />
        </div>
      </section>

      <section class="section alt">
        <div class="section-heading">
          <div>
            <p class="eyebrow">START HERE</p>
            <h2>今日のキーワード図鑑</h2>
            <p>${keywords.length}件の教材から、定義だけで終わらない解説と演習へ。</p>
          </div>
          <button class="text-btn" data-route="library">図鑑を全部見る →</button>
        </div>
        <div class="card-grid">${keywordCards(keywords.slice(0, 6))}</div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">WEEKLY DIGEST</p>
            <h2>今週、何があった？</h2>
          </div>
          <button class="text-btn" data-route="weekly">バックナンバー →</button>
        </div>
        ${weeklyFeature(weeklyArticles[0])}
      </section>

      <section class="section alt">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SIDE NOTES</p>
            <h2>教科書のすみっこ</h2>
            <p>試験には出ないかもしれない。でも、たぶん覚えている話。</p>
          </div>
        </div>
        <div class="side-note-grid">
          ${sideNotes.map(note => `
            <article class="side-note">
              <span class="mono">${note.label}</span>
              <h3>${note.title}</h3>
              <p>${note.text}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">DESK SIDE</p>
            <h2>今週のガジェット寄り道</h2>
            <p>道具から入ると、技術の話が少し身近になる。</p>
          </div>
        </div>
        <article class="gadget-feature">
          <div class="keyboard-visual" aria-label="コンパクトキーボードの図">
            ${Array.from({ length: 24 }, () => "<span></span>").join("")}
          </div>
          <div class="gadget-copy">
            <span class="category-label">KEYBOARD · 3 MIN</span>
            <h3>なぜエンジニアはキーボード配列の話を始めると長いのか</h3>
            <p>JISとUS、テンキーレス、分割式。正解探しというより、毎日触る道具を自分の作業に合わせる小さな改善です。まずは記号の位置とショートカットの違いから眺めます。</p>
            <button class="secondary-btn" data-search="コマンドライン引数">キーボードでCLIへ寄り道 →</button>
          </div>
        </article>
      </section>
    </div>
  `;
}

function weeklyFeature(article) {
  return `
    <article class="weekly-feature" data-weekly="${article.id}">
      <div class="weekly-copy">
        <p class="eyebrow">ISSUE #${article.issue} · ${article.tags.join(" / ")}</p>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
        <div class="weekly-meta">
          <span>${article.date}</span>
          <span>${article.minutes}</span>
          <span>READ →</span>
        </div>
      </div>
      <div class="weekly-side">
        <div class="week-stamp">
          <span>WEEKLY</span>
          <strong>${article.issue}</strong>
          <small>YORIMICHI PRESS</small>
        </div>
      </div>
    </article>
  `;
}

function renderLibrary(query = "") {
  const categories = ["すべて", ...new Set(keywords.map(item => item.category))];
  const normalized = query.toLowerCase();
  const filtered = keywords.filter(item => {
    const matchesFilter = currentFilter === "すべて" || item.category === currentFilter;
    const haystack = `${item.title} ${item.category} ${item.summary}`.toLowerCase();
    return matchesFilter && haystack.includes(normalized);
  });

  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">KEYWORD LIBRARY</p>
        <h1>キーワード図鑑</h1>
        <p>知りたい単語から入って、関連語へふらふら進むための場所。試験対策と現場の「それ何？」の間を埋めます。</p>
      </header>
      <section class="section">
        <form class="search-box" id="library-search" style="margin-bottom: 30px">
          <span class="search-icon" aria-hidden="true"></span>
          <input id="library-search-input" value="${escapeHtml(query)}" placeholder="キーワードを絞り込む" />
          <button class="primary-btn" type="submit">検索</button>
        </form>
        <div class="filter-bar">
          ${categories.map(category => `<button class="chip ${currentFilter === category ? "active" : ""}" data-filter="${category}">${category}</button>`).join("")}
        </div>
        ${filtered.length ? `<div class="card-grid">${keywordCards(filtered)}</div>` : `<div class="empty-state"><h3>まだ、その寄り道はありません。</h3><p>管理画面から新しいキーワードを追加できます。</p></div>`}
      </section>
    </div>
  `;
}

function renderKeyword(id) {
  const item = keywords.find(keyword => keyword.id === id);
  if (!item) return renderLibrary();
  const lesson = lessonFor(item);
  const codeStudy = codeStudyFor(item);
  const trivia = triviaFor(item);
  const sources = sourceCatalog[item.category] || [];
  return `
    <div class="view">
      <div class="article-nav">
        <button class="article-back" data-article-back>← 前の画面へ戻る</button>
        <span>${escapeHtml(item.category)} / ${escapeHtml(item.title)}</span>
      </div>
      <div class="detail-layout">
        <aside class="margin-rail" aria-hidden="true">
          <span class="margin-rail-label">YORIMICHI NOTE</span>
          <i></i>
          <span>READ</span>
          <b></b>
          <span>TRACE</span>
          <b></b>
          <span>DETOUR</span>
        </aside>
        <article class="article">
          <p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(lesson.duration)}</p>
          <h1>${escapeHtml(item.title)}</h1>
          <p class="lead">${escapeHtml(item.lead)}</p>
          <section class="learning-goals">
            <span>この記事を終えたら</span>
            <ul>${lesson.goals.map(goal => `<li>${escapeHtml(goal)}</li>`).join("")}</ul>
          </section>
          <h2 id="overview">最初に動く例を見る</h2>
          <p>${formatInline(item.body)}</p>
          <pre class="code-block" data-label="${escapeHtml(codeLabelFor(item.category))}"><code>${escapeHtml(item.code)}</code></pre>
          <p class="code-caption">読む順番は、入力される値 → 条件や処理 → 出力される結果。最初から記号をすべて暗記する必要はありません。</p>
          <section class="code-study" id="code-study">
            <p class="eyebrow">READ THE CODE</p>
            <h2>コードを上から追う</h2>
            <p>コードの言い換えだけではなく、その行で値や処理の流れがどう変わるかを追います。</p>
            <div class="code-note-list">
              ${codeStudy.notes.map((note, index) => `
                <article>
                  <span class="code-note-number">${String(index + 1).padStart(2, "0")}</span>
                  <code>${escapeHtml(note[0])}</code>
                  <p>${formatInline(note[1])}</p>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="execution-trace" id="trace">
            <p class="eyebrow">EXECUTION TRACE</p>
            <h2>実行中の頭の中</h2>
            <div class="trace-table">
              ${codeStudy.trace.map(row => `
                <div>
                  <strong>${escapeHtml(row[0])}</strong>
                  <span>${formatInline(row[1])}</span>
                  <span>${formatInline(row[2])}</span>
                </div>
              `).join("")}
            </div>
          </section>
          ${lesson.sections.map((section, index) => `
            <section class="lesson-section" id="section-${index + 1}">
              <span class="section-index">0${index + 1}</span>
              <h2>${escapeHtml(section.title)}</h2>
              ${section.paragraphs.map(paragraph => `<p>${formatInline(paragraph)}</p>`).join("")}
            </section>
          `).join("")}
          <aside class="detour-box">
            <h3>${escapeHtml(item.detourTitle)}</h3>
            <p>${escapeHtml(item.detour)}</p>
          </aside>
          <section class="trivia-section" id="trivia">
            <p class="eyebrow">DETOUR NOTES</p>
            <h2>ここから広がる寄り道</h2>
            <p>本筋の外側にある話ほど、あとで記憶を引っ張り出す目印になります。</p>
            <div class="trivia-grid">
              ${trivia.map((fact, index) => `
                <article>
                  <span>寄り道 ${String(index + 1).padStart(2, "0")}</span>
                  <h3>${escapeHtml(fact[0])}</h3>
                  <p>${formatInline(fact[1])}</p>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="mistake-section" id="mistakes">
            <p class="eyebrow">COMMON MISTAKES</p>
            <h2>よくある詰まり方</h2>
            <div class="mistake-list">
              ${lesson.mistakes.map((mistake, index) => `
                <article>
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <div><strong>${formatInline(mistake.bad)}</strong><p>${formatInline(mistake.fix)}</p></div>
                </article>
              `).join("")}
            </div>
          </section>
          <section class="exercise-section" id="exercises">
            <p class="eyebrow">TRY IT YOURSELF</p>
            <h2>予習・復習のための演習</h2>
            <ol>${lesson.exercises.map(exercise => `<li>${formatInline(exercise)}</li>`).join("")}</ol>
          </section>
          <aside class="field-note">
            <span>現場メモ</span>
            <p>${formatInline(lesson.fieldNote)}</p>
          </aside>
          ${sources.length ? `
            <section class="source-section" id="sources">
              <p class="eyebrow">PRIMARY SOURCES</p>
              <h2>次に読む公式資料</h2>
              <p>この記事は入口です。仕様や正確な挙動を確認するときは、検索結果の要約ではなく公式資料へ戻ります。</p>
              <div class="source-links">
                ${sources.map(source => `<a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} <span>↗</span></a>`).join("")}
              </div>
            </section>
          ` : ""}
        </article>
        <aside class="article-aside">
          <div class="toc">
            <strong>この記事の道順</strong>
            <button data-scroll="overview">00 動く例</button>
            <button data-scroll="code-study">01 コードを追う</button>
            <button data-scroll="trace">02 実行トレース</button>
            ${lesson.sections.map((section, index) => `<button data-scroll="section-${index + 1}">0${index + 1} ${escapeHtml(section.title)}</button>`).join("")}
            <button data-scroll="trivia">寄り道・雑学</button>
            <button data-scroll="mistakes">よくある詰まり</button>
            <button data-scroll="exercises">演習</button>
            ${sources.length ? `<button data-scroll="sources">公式資料</button>` : ""}
          </div>
          <div class="related">
            <strong>RELATED WORDS</strong>
            ${item.related.map(word => `<button class="chip" data-search="${escapeHtml(word)}">${escapeHtml(word)}</button>`).join("")}
          </div>
          <button class="secondary-btn save-later ${readingList.includes(item.id) ? "saved" : ""}" data-save-later="${item.id}">
            ${readingList.includes(item.id) ? "あとでまとめる箱に追加済み" : "あとでまとめる箱へ"}
          </button>
          <button class="secondary-btn" data-route="library" style="width:100%; margin-top: 20px">← 図鑑へ戻る</button>
        </aside>
      </div>
    </div>
  `;
}

function renderDesk() {
  const savedItems = readingList.map(id => keywords.find(item => item.id === id)).filter(Boolean);
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">YOUR STUDY DESK</p>
        <h1>学習デスク</h1>
        <p>今は理解しきれない言葉と、研修中の雑なメモをいったん置く場所。きれいに整理するのは後で大丈夫です。</p>
      </header>
      <div class="desk-layout">
        <section class="panel backlog-panel">
          <div class="panel-heading">
            <div><span class="category-label">READ LATER</span><h2>あとでまとめる箱</h2></div>
            <strong>${savedItems.length}件</strong>
          </div>
          <form id="backlog-form" class="compact-form">
            <input name="query" required placeholder="例：DI、排他制御、よく分からなかった言葉" />
            <button class="primary-btn" type="submit">追加</button>
          </form>
          <div class="desk-list">
            ${savedItems.length ? savedItems.map(item => `
              <div class="desk-item">
                <button class="desk-link" data-keyword="${item.id}"><small>${escapeHtml(item.category)}</small><strong>${escapeHtml(item.title)}</strong></button>
                <button class="icon-btn" data-remove-later="${item.id}">外す</button>
              </div>`).join("") : `<div class="empty-state small"><p>記事の「あとでまとめる箱へ」か、上の入力欄から追加できます。</p></div>`}
          </div>
        </section>
        <section class="panel notes-panel">
          <div class="panel-heading">
            <div><span class="category-label">ROUGH NOTES</span><h2>研修メモ置き場</h2></div>
            <strong>${trainingNotes.length}枚</strong>
          </div>
          <form id="note-form">
            <div class="field"><input name="title" required placeholder="見出し：今日のJava研修" /></div>
            <div class="field"><textarea name="text" required placeholder="箇条書き、疑問、あとで試したいコードなどを雑に置いておく"></textarea></div>
            <button class="primary-btn" type="submit">メモを置く</button>
          </form>
          <div class="note-grid">
            ${trainingNotes.map(note => `
              <article class="training-note">
                <div><time>${escapeHtml(note.date)}</time><button class="icon-btn" data-delete-note="${note.id}">削除</button></div>
                <h3>${escapeHtml(note.title)}</h3>
                <p>${escapeHtml(note.text).replace(/\n/g, "<br>")}</p>
              </article>`).join("")}
          </div>
        </section>
      </div>
    </div>
  `;
}

function renderWeekly() {
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">WEEKLY YORIMICHI PRESS</p>
        <h1>週刊トピック</h1>
        <p>IT、セキュリティ、AIの話を全部追うのは無理。新人エンジニアの視点で「今これだけ知っておこう」を記事風にまとめます。</p>
      </header>
      <section class="section">
        <div style="display:grid; gap:24px">
          ${weeklyArticles.map(weeklyFeature).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderWeeklyDetail(id) {
  const article = weeklyArticles.find(item => item.id === id) || weeklyArticles[0];
  return `
    <div class="view">
      <div class="detail-layout">
        <article class="article">
          <p class="eyebrow">WEEKLY #${article.issue} · ${article.date}</p>
          <h1>${article.title}</h1>
          <p class="lead">${article.summary}</p>
          <h2 id="roughly">01. パスワードの次に来るもの</h2>
          <p>セキュリティの世界では「人間に複雑な文字列を覚えさせる」方法から少しずつ離れています。パスキーは端末側の仕組みを使い、偽サイトへ秘密を渡しにくくする考え方です。用語そのものより、認証の責任を人の記憶だけに背負わせない流れを押さえておきましょう。</p>
          <aside class="detour-box">
            <h3>「強いパスワード」だけでは足りない理由</h3>
            <p>どれだけ複雑でも、偽サイトに自分で入力すれば盗まれます。文字列の強度と、渡す相手が本物かどうかは別問題です。</p>
          </aside>
          <h2 id="try">02. AIエージェントって結局なに？</h2>
          <p>質問に文章で答えるだけでなく、道具を選び、途中経過を見て、複数の操作を進めるAIを指すことが増えました。新人のうちは「全部任せられる存在」ではなく、「作業を分解して、確認ポイントを置く必要がある自動化」と捉えるとちょうどよいでしょう。</p>
          <pre class="code-block"><code>目的を受け取る\n  ↓\n必要な手順を考える\n  ↓\nツールを使う → 結果を確認する\n  ↓\n次の手順へ進む / 人に確認する</code></pre>
          <h2 id="next">03. 古いJavaはなぜ消えない？</h2>
          <p>企業システムでは、長年安定稼働していること自体が価値です。新しい技術が出ても、移行コストや業務リスクとの比較になります。SIer一年目なら、新旧どちらが正義かではなく「なぜ今これが使われているか」を聞く姿勢が強い武器になります。</p>
        </article>
        <aside class="article-aside">
          <div class="toc">
            <strong>今週の3トピック</strong>
            <button data-scroll="roughly">01 パスキー</button>
            <button data-scroll="try">02 AIエージェント</button>
            <button data-scroll="next">03 古いJava</button>
          </div>
          <button class="secondary-btn" data-route="weekly" style="width:100%; margin-top: 20px">← バックナンバー</button>
        </aside>
      </div>
    </div>
  `;
}

function renderAdmin() {
  const categories = [...new Set(keywords.map(item => item.category))];
  return `
    <div class="view">
      <header class="page-heading">
        <p class="eyebrow">CONTENT DESK</p>
        <h1>管理メニュー</h1>
        <p>学びたい言語やキーワードを、あとから自由に足せます。追加内容はこのブラウザに保存されます。</p>
      </header>
      <div class="admin-layout">
        <section class="panel">
          <h2>新しいキーワードを追加</h2>
          <form id="keyword-form">
            <div class="field">
              <label for="new-title">キーワード</label>
              <input id="new-title" name="title" required placeholder="例：例外処理" />
            </div>
            <div class="field">
              <label for="new-category">カテゴリ</label>
              <input id="new-category" name="category" list="category-list" required placeholder="例：Java" />
              <datalist id="category-list">${categories.map(category => `<option value="${escapeHtml(category)}">`).join("")}</datalist>
            </div>
            <div class="field">
              <label for="new-summary">カードの説明</label>
              <textarea id="new-summary" name="summary" required placeholder="どんなことがわかる記事か、短く入力"></textarea>
            </div>
            <div class="field">
              <label for="new-body">ざっくり解説</label>
              <textarea id="new-body" name="body" required placeholder="初学者向けの説明"></textarea>
            </div>
            <div class="field">
              <label for="new-code">コード・コマンド例</label>
              <textarea id="new-code" name="code" placeholder="System.out.println(...);"></textarea>
            </div>
            <button class="primary-btn" type="submit">図鑑に追加する</button>
          </form>
        </section>
        <section class="panel">
          <h2>登録済みコンテンツ <small style="font:400 11px 'DM Mono'">${keywords.length} FILES</small></h2>
          <div class="admin-list">
            ${keywords.map(item => `
              <div class="admin-item">
                <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.category)} · ${escapeHtml(item.summary.slice(0, 45))}${item.summary.length > 45 ? "..." : ""}</small></div>
                <button class="icon-btn" data-delete="${item.id}">削除</button>
              </div>
            `).join("")}
          </div>
          <button class="secondary-btn" id="reset-data" style="margin-top:20px">初期データに戻す</button>
        </section>
      </div>
    </div>
  `;
}

function routeUrl(route, id, query = "") {
  const params = new URLSearchParams();
  if (route && route !== "home") params.set("view", route);
  if (id) params.set("id", id);
  if (query) params.set("q", query);
  const search = params.toString();
  return `${window.location.pathname}${search ? `?${search}` : ""}`;
}

function routeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    route: params.get("view") || "home",
    id: params.get("id") || undefined,
    query: params.get("q") || ""
  };
}

function navigate(route, id, query = "", options = {}) {
  const app = document.getElementById("app");
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.route === route || (route === "keyword" && link.dataset.route === "library"));
  });
  document.querySelector(".main-nav").classList.remove("open");

  if (route === "library") app.innerHTML = renderLibrary(query);
  else if (route === "keyword") app.innerHTML = renderKeyword(id);
  else if (route === "weekly") app.innerHTML = renderWeekly();
  else if (route === "weekly-detail") app.innerHTML = renderWeeklyDetail(id);
  else if (route === "desk") app.innerHTML = renderDesk();
  else if (route === "admin") app.innerHTML = renderAdmin();
  else app.innerHTML = renderHome();

  if (options.history !== false) {
    const method = options.replace ? "replaceState" : "pushState";
    window.history[method]({ route, id, query }, "", routeUrl(route, id, query));
  }
  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
}

function searchKeyword(query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    navigate("library");
    return;
  }
  const exact = keywords.find(item =>
    item.title.toLowerCase().includes(normalized) ||
    normalized.includes(item.title.toLowerCase())
  );
  if (exact) navigate("keyword", exact.id);
  else navigate("library", null, query.trim());
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

document.addEventListener("click", (event) => {
  const routeTarget = event.target.closest("[data-route]");
  const keywordTarget = event.target.closest("[data-keyword]");
  const weeklyTarget = event.target.closest("[data-weekly]");
  const searchTarget = event.target.closest("[data-search]");
  const filterTarget = event.target.closest("[data-filter]");
  const scrollTarget = event.target.closest("[data-scroll]");
  const deleteTarget = event.target.closest("[data-delete]");
  const saveLaterTarget = event.target.closest("[data-save-later]");
  const removeLaterTarget = event.target.closest("[data-remove-later]");
  const deleteNoteTarget = event.target.closest("[data-delete-note]");
  const articleBackTarget = event.target.closest("[data-article-back]");

  if (articleBackTarget) {
    if (window.history.length > 1) window.history.back();
    else navigate("library");
    return;
  }
  if (routeTarget) navigate(routeTarget.dataset.route);
  if (keywordTarget) navigate("keyword", keywordTarget.dataset.keyword);
  if (weeklyTarget) navigate("weekly-detail", weeklyTarget.dataset.weekly);
  if (searchTarget) searchKeyword(searchTarget.dataset.search);
  if (filterTarget) {
    currentFilter = filterTarget.dataset.filter;
    navigate("library");
  }
  if (scrollTarget) document.getElementById(scrollTarget.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
  if (deleteTarget) {
    keywords = keywords.filter(item => item.id !== deleteTarget.dataset.delete);
    saveKeywords();
    navigate("admin");
    showToast("キーワードを削除しました");
  }
  if (saveLaterTarget) {
    if (!readingList.includes(saveLaterTarget.dataset.saveLater)) readingList.unshift(saveLaterTarget.dataset.saveLater);
    localStorage.setItem("yorimichi-reading-list", JSON.stringify(readingList));
    navigate("desk");
    showToast("あとでまとめる箱へ追加しました");
  }
  if (removeLaterTarget) {
    readingList = readingList.filter(id => id !== removeLaterTarget.dataset.removeLater);
    localStorage.setItem("yorimichi-reading-list", JSON.stringify(readingList));
    navigate("desk");
  }
  if (deleteNoteTarget) {
    trainingNotes = trainingNotes.filter(note => note.id !== deleteNoteTarget.dataset.deleteNote);
    localStorage.setItem("yorimichi-training-notes", JSON.stringify(trainingNotes));
    navigate("desk");
  }
  if (event.target.closest("#reset-data")) {
    keywords = [...seedKeywords];
    saveKeywords();
    navigate("admin");
    showToast("初期データに戻しました");
  }
  if (event.target.closest(".mobile-menu")) {
    document.querySelector(".main-nav").classList.toggle("open");
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "hero-search") {
    searchKeyword(document.getElementById("hero-search-input").value);
  }
  if (event.target.id === "library-search") {
    navigate("library", null, document.getElementById("library-search-input").value);
  }
  if (event.target.id === "keyword-form") {
    const data = new FormData(event.target);
    const title = data.get("title").trim();
    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "keyword"}-${Date.now()}`;
    keywords.unshift({
      id,
      title,
      category: data.get("category").trim(),
      summary: data.get("summary").trim(),
      lead: `${title}について、まずは初学者向けにざっくり見ていきましょう。`,
      body: data.get("body").trim(),
      code: data.get("code").trim() || "// コード例はまだありません",
      detourTitle: "ここから寄り道",
      detour: "このキーワードと一緒によく登場する言葉を、ひとつずつ調べてみると理解がつながります。",
      related: ["関連用語", "実行してみる", "エラーを読む"]
    });
    saveKeywords();
    navigate("admin");
    showToast(`「${title}」を追加しました`);
  }
  if (event.target.id === "backlog-form") {
    const query = new FormData(event.target).get("query").trim();
    const match = keywords.find(item => item.title.toLowerCase().includes(query.toLowerCase()));
    if (match) {
      if (!readingList.includes(match.id)) readingList.unshift(match.id);
    } else {
      const id = `inbox-${Date.now()}`;
      keywords.unshift({
        id, title: query, category: "あとで調べる", level: "INBOX",
        summary: "研修中に拾った、あとで整理するためのキーワード。",
        lead: `${query}について、研修資料や実例と結びつけて整理しましょう。`,
        body: "まだ本文はありません。管理画面から詳しい内容を追加するか、研修メモに分かったことを書いてください。",
        code: "// TODO: 具体例を一つ探す",
        detourTitle: "まず残せば十分",
        detour: "分からない言葉をその場ですべて解決しようとすると、本筋を見失うことがあります。いったん置いて、区切りのよい時間に戻りましょう。",
        related: ["研修メモ", "質問する", "具体例"]
      });
      saveKeywords();
      readingList.unshift(id);
    }
    localStorage.setItem("yorimichi-reading-list", JSON.stringify(readingList));
    navigate("desk");
    showToast("あとでまとめる箱へ追加しました");
  }
  if (event.target.id === "note-form") {
    const data = new FormData(event.target);
    trainingNotes.unshift({
      id: `note-${Date.now()}`,
      title: data.get("title").trim(),
      text: data.get("text").trim(),
      date: new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date())
    });
    localStorage.setItem("yorimichi-training-notes", JSON.stringify(trainingNotes));
    navigate("desk");
    showToast("研修メモを置きました");
  }
});

document.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-keyword]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    navigate("keyword", card.dataset.keyword);
  }
});

window.addEventListener("popstate", () => {
  const state = routeFromUrl();
  navigate(state.route, state.id, state.query, { history: false, instant: true });
});

const initialRoute = routeFromUrl();
navigate(initialRoute.route, initialRoute.id, initialRoute.query, { replace: true, instant: true });
