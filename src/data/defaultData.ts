import { AdvisorRule, Milestone, ThesisFAQ, ChapterGuide, ExemplarThesis, FormatSpec, DefenseQuestion } from '../types';

export const DEFAULT_ADVISOR_RULES: AdvisorRule[] = [
  {
    id: 'rule-meeting-log',
    category: 'meeting',
    title: '每週指導會議（Lab Meeting）與進度紀要規範',
    description: '指導會議進度報告，並列出具體需要討論的1~3個瓶頸問題',
    isMandatory: true,
    severity: 'high',
    checkListItems: [
      '會議前完成新增部分',
      '提醒上次會議老師建議的修改建議（Diff / Revision Tracking）'
      
    ]
  },
  {
    id: 'rule-academic-integrity',
    category: 'integrity',
    title: '學術誠信與 AI 輔助寫作揭露守則',
    description: '嚴禁抄襲剽竊與數據造假。若使用生成式 AI（如 Gemini/ChatGPT）輔助潤飾或代碼除錯，必須於論文附錄或致謝中誠實揭露使用情境與提示詞紀錄，且不得直接複製 AI 生成未經考證之參考文獻。',
    isMandatory: true,
    severity: 'high',
    checkListItems: [
      '文獻比對系統（Turnitin / 快刀）相似度扣除參考文獻必須低於 12%',
      '所有直接引述（Direct Quotation）皆須加引號並精確標註頁碼',
      '嚴格檢驗所有 Reference 的真實性，杜絕 AI 幻覺虛構之期刊論文',
      '研究數據與問卷原始檔需完整保留至少5年以供查核'
    ]
  },
  {
    id: 'rule-writing-tone',
    category: 'writing',
    title: '學術寫作客觀性與邏輯論證規範',
    description: '論文非心得報告，禁止使用「筆者覺得」、「顯而易見」、「眾所周知」等主觀、武斷或缺乏文獻佐證之情緒字眼；每一段落核心論點必須有至少2~3篇同行評審文獻或實證數據支持。',
    isMandatory: true,
    severity: 'medium',
    checkListItems: [
      '段落遵循「主題句（Topic Sentence）→ 文獻/數據證據 → 批判性綜述/連結」三段式架構',
      '使用第三人稱或客觀語態（本研究、研究結果顯示），避免過度使用「我/我們」',
      '名詞定義在全篇論文中必須前後統一（Consistency）',
      '圖表必須在正文中有呼應說明（例：「如圖3-1所示...」），不能孤立呈現'
    ]
  },
  {
    id: 'rule-progress-timeline',
    category: 'progress',
    title: '論文進度三階段檢核點（Proposal / Pre-defense / Final）',
    description: '碩士班學生須於預計口試前完成前三章，口試前2個月完成全本初稿審。',
    isMandatory: true,
    severity: 'high',
    checkListItems: [
      '開題審查（Proposal）：完成第1~3章，並確立研究架構與工具信效度',
      '預備口試（Pre-Defense）：完成全部5章草稿與分析數據，實驗室內部審查通過',
      '正式口試：口試前14天將精裝或審查本送達所有口試委員手中'
    ]
  },
  {
    id: 'rule-format-standard',
    category: 'writing',
    title: '圖表與文獻格式嚴格一致性（APA 7th / IEEE）',
    description: '圖表編號必須依章節依序編排（如「圖4-1」、「表4-2」）。表格標題置於表格「上方」；圖片標題置於圖片「下方」；三線表格式（無直欄線、無多餘橫線）。',
    isMandatory: true,
    severity: 'medium',
    checkListItems: [
      '採用標準學術三線表（頂線、欄位分隔線、底線）',
      '內文引用格式與文後參考文獻清單 100% 雙向對應（無遺漏、無多餘）',
      '英文字型以 Times New Roman 12pt 為原則，中文以標楷體/微軟正黑體 12pt 為原則，行距固定 1.5 倍'
    ]
  }
];

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'ms-1',
    phase: 1,
    title: '研究選題與開題確立 (Proposal Readiness)',
    shortDesc: '確立研究動機、核心研究問題與文獻初步綜述',
    targetTimeline: '入學第2學期末 (開題前6個月)',
    deliverables: ['研究構想書 (2~3頁)', '初步文獻地圖 (30篇核心文獻)', '研究架構圖草稿'],
    advisorTips: '選題切忌「假大空」，研究問題要足夠聚焦（Specific），並明確指出既有文獻尚未解決的 Gap。',
    checkItems: [
      { id: 'c1-1', text: '研究動機是否立足於具體的理論缺口或產業實務痛點？', completed: true },
      { id: 'c1-2', text: '研究問題（Research Questions）是否能透過實證方法被檢定或回答？', completed: true },
      { id: 'c1-3', text: '已閱讀並整理至少 15 篇近期（5年內）頂級期刊文獻', completed: false }
    ]
  },
  {
    id: 'ms-2',
    phase: 2,
    title: '開題報告審查 (Thesis Proposal)',
    shortDesc: '完成論文第1~3章（緒論、文獻探討、研究方法）',
    targetTimeline: '口試前4~6個月',
    deliverables: ['前三章完整書面草稿', '開題簡報 PPT (20分鐘)', '研究工具/問卷初稿或系統原型架構'],
    advisorTips: '研究方法必須具體到讓任何同行能依照你的步驟「完全復現（Replicate）」研究過程。',
    checkItems: [
      { id: 'c2-1', text: '文獻探討是否進行了主題式的批判與綜整，而非單純的文獻流水帳？', completed: false },
      { id: 'c2-2', text: '研究假說與概念模型是否有充分的理論依據（Theoretical Foundation）？', completed: false },
      { id: 'c2-3', text: '研究對象抽樣方式、變數操作型定義、信效度檢驗步驟明確完整', completed: false }
    ]
  },
  {
    id: 'ms-3',
    phase: 3,
    title: '資料蒐集與實驗分析 (Data Collection & Analysis)',
    shortDesc: '執行實驗、問卷發放或質性訪談，並完成統計/編碼分析',
    targetTimeline: '口試前3個月',
    deliverables: ['乾淨的分析數據庫 / 訪談逐字稿編碼本', '初步結果圖表集', '第4章初稿'],
    advisorTips: '不要隱瞞不符合假說的數據，負面結果（Negative findings）在學術討論中往往具有更深刻的啟發。',
    checkItems: [
      { id: 'c3-1', text: '資料清洗過程（極端值剔除、缺失值處理）紀錄詳實', completed: false },
      { id: 'c3-2', text: '統計檢定力（Power）或質性飽和度（Saturation）達到學術標準', completed: false },
      { id: 'c3-3', text: '圖表設計清晰，且符合學術格式三線表規範', completed: false }
    ]
  },
  {
    id: 'ms-4',
    phase: 4,
    title: '全本初稿完成與預備口試 (Full Draft & Pre-Defense)',
    shortDesc: '完成全本5章草稿（包含第5章深入討論與建議）',
    targetTimeline: '口試前1.5~2個月',
    deliverables: ['論文全本 Word/PDF 初稿', 'Turnitin 原創性比對報告', '預口試 PPT (25分鐘)'],
    advisorTips: '第5章「討論（Discussion）」是論文的靈魂，必須將你的研究結果與第2章文獻進行深度對話！',
    checkItems: [
      { id: 'c4-1', text: '第5章明確闡述了「理論貢獻」與「實務意涵」，而非重複第4章數據', completed: false },
      { id: 'c4-2', text: '論文比對系統排除引用後相似度低於 12%', completed: false },
      { id: 'c4-3', text: '指導教授細閱並通過內部預備口試評估', completed: false }
    ]
  },
  {
    id: 'ms-5',
    phase: 5,
    title: '學位口試與定稿離校 (Final Defense & Graduation)',
    shortDesc: '正式學位論文口試答辯、委員意見修改對照表、定稿上傳',
    targetTimeline: '畢業學期末',
    deliverables: ['口試審查本', '口試委員修正意見逐條對照表 (Revision Table)', '圖書館論文上傳定稿'],
    advisorTips: '面對委員質疑時保持沉穩虛心，展現對研究限制的深刻理解與嚴謹的學術態度。',
    checkItems: [
      { id: 'c5-1', text: '口試前14天已將紙本或電子審查本送達所有口試委員', completed: false },
      { id: 'c5-2', text: '完成「口試委員審查意見回覆與修改對照表」並經指導教授簽核', completed: false },
      { id: 'c5-3', text: '通過國家圖書館學位論文格式審核與授權', completed: false }
    ]
  }
];

export const DEFAULT_THESIS_FAQS: ThesisFAQ[] = [
  {
    id: 'faq-1',
    category: 'topic',
    categoryName: '研究選題與動機',
    question: '老師常說我的研究動機「不夠強烈、像心得」，究竟該如何寫出具備學術說服力的動機？',
    shortAnswer: '學術研究動機不能僅靠個人生活觀察或主觀感受，必須建立在「實務重要性（Why it matters）」與「理論未決缺口（Research Gap）」的交叉點上。',
    detailedGuidance: [
      '1. 現象與實務痛點：引用具權威性的產業報告、政府統計數據或國際趨勢，指出問題的普遍性與急迫性。',
      '2. 既有文獻的盲點（Gap）：回顧前人研究，指出「過去研究雖然證實了A，但卻忽略了情境B/缺少機制C的探討/在特定族群上結論分歧」。',
      '3. 本研究的切入點：說明本研究如何透過何種視角或方法填補上述缺口，從而帶來的學術價值。'
    ],
    commonMistakes: [
      '❌ 寫成「因為我平常對這個主題很有興趣，所以想了解...」（過度主觀）',
      '❌ 僅羅列產業新聞，通篇沒有引用任何學術期刊文獻',
      '❌ 動機範圍太大（例如：為了解決全球暖化問題...），與實際研究題目落差過巨'
    ],
    advisorChecklist: [
      '前言第一段是否在3句話內清楚帶出核心議題的重要性？',
      '是否至少引用 3~5 篇近3年的權威期刊文獻支持動機論點？',
      '是否有一段明確標示「然而，既有文獻仍存在...之限制」？'
    ],
    phraseBankSuggestions: [
      'Despite extensive research on [Topic A], little attention has been paid to [Topic B]...',
      'While previous studies have emphasized the importance of X (e.g., Author, 2022), the underlying mechanism connecting X and Y remains unclear.',
      'To address this research gap, the present study aims to investigate...'
    ]
  },
  {
    id: 'faq-2',
    category: 'literature',
    categoryName: '文獻探討與綜述',
    question: '文獻探討寫起來很像「文獻摘要流水帳（Author A 說了什麼、Author B 又說了什麼）」，如何進行批判性綜整？',
    shortAnswer: '以「主題/概念/爭鳴焦點」為軸心組織段落，而非以「個別學者/單篇論文」為軸心。將文獻視為一場學者之間的對話。',
    detailedGuidance: [
      '1. 建立文獻矩陣（Literature Matrix）：將讀過的論文按「研究變數、研究情境、核心理論、主要發現、研究限制」製表歸類。',
      '2. 尋找文獻間的共識與分歧：哪些學者支持正向關係？哪些學者發現無顯著關係？造成分歧的原因是什麼（如中介變數、調節變數、樣本差異）？',
      '3. 段落內整合多篇引註：一個觀點由多篇文獻共同支持（例：近年多項實證研究指出... (Chen, 2021; Smith et al., 2023; Wang, 2024)）。'
    ],
    commonMistakes: [
      '❌ 每一段開頭都是「張三（2020）指出...。李四（2021）研究了...。王五（2022）則認為...。」（缺乏綜整）',
      '❌ 只引述支持自己想法的文獻，刻意忽略持相反觀點的經典文獻（Confirmation Bias）',
      '❌ 引述過多教科書或非學術網站（如維基百科、商業部落格）'
    ],
    advisorChecklist: [
      '各小節標題是否為「理論概念/變數構念」而非學者名字？',
      '每一段落是否皆有作者自己的綜合評述與收斂總結？',
      '文獻探討的最後是否自然推導出本研究的「研究架構」或「假說」？'
    ],
    phraseBankSuggestions: [
      'Extensive empirical evidence has substantiated the relationship between A and B (Author1, 2021; Author2, 2023). However, scholars remain divided regarding...',
      'Synthesizing these diverse theoretical perspectives suggests that...',
      'In contrast to earlier findings by [Author], recent studies suggest that...'
    ]
  },
  {
    id: 'faq-3',
    category: 'methodology',
    categoryName: '研究方法與工具',
    question: '問卷抽樣或實驗設計被老師質疑「信度、效度不足」或「抽樣偏差」，該如何嚴謹補強？',
    shortAnswer: '研究方法必須具備「透明度（Transparency）」與「可復現性（Replicability）」，清楚交代量表來源、前測（Pilot test）數值與抽樣代表性檢驗。',
    detailedGuidance: [
      '1. 測量工具來源：盡量採用國際頂級期刊已驗證之成熟量表（Validated Scales），並說明中文化過程（雙向翻譯 Back-Translation 流程）。',
      '2. 前測與信效度：執行前測（建議至少 30~50 份），檢驗 Cronbach’s α、組合信度（CR）與平均變異抽取量（AVE）。',
      '3. 抽樣限制與共同方法變異（CMV）：若採用便利抽樣或滾雪球抽樣，誠實交代母體範圍，並施測 Harman 單因子檢定或標記變數法檢驗 CMV。'
    ],
    commonMistakes: [
      '❌ 自己隨意設計問卷題目，未經任何專家內容效度（CVI）或信度檢定',
      '❌ 發放線上問卷任由網友填寫，未設計反向題、測謊題或篩選條件（Filter Questions）',
      '❌ 統計方法與研究假說不匹配（例如：想看因果機制卻只做簡單皮爾森相關分析）'
    ],
    advisorChecklist: [
      '是否有完整的變數操作型定義（Operational Definitions）對照表？',
      '問卷題項是否標明「李克特幾點量表」及計分方式？',
      '受試者同意書與倫理審查（IRB）相關聲明是否齊備？'
    ]
  },
  {
    id: 'faq-4',
    category: 'results',
    categoryName: '研究結果與圖表',
    question: '跑出統計分析結果或完成質性訪談編碼後，第4章該如何有條理地呈現，避免像「報表輸出堆疊」？',
    shortAnswer: '第4章是「陳述客觀客觀發現（Facts）」，而非發表個人主觀感想。必須依照「研究問題或研究假說」的順序逐一對應呈現。',
    detailedGuidance: [
      '1. 樣本基本資料描述：用精簡的表格呈現人口統計特徵（樣本數 N、百分比 %），正文僅挑選關鍵特徵摘要。',
      '2. 假說檢定循序漸進：模型適配度檢驗 → 主效應檢驗 → 中介/調節效應檢驗，每一項皆附標準化係數、t值、p值與假說成立與否。',
      '3. 質性研究引文規範：引述受訪者原話時須去識別化（如 [受訪者 A-03]），且引文長度適中，緊扣研究主題範疇。'
    ],
    commonMistakes: [
      '❌ 把 SPSS / R / Python 的整張龐大 Raw Output 截圖貼進論文正文',
      '❌ 表格內已經列出的每個數字，在內文字字不漏地重複唸一遍',
      '❌ 在第4章就開始過度推論原因（推論與文獻對話應留到第5章討論）'
    ],
    advisorChecklist: [
      '所有表格是否皆為乾淨的學術三線表？',
      '每一張圖表是否皆有在內文中被引述說明（如「如表4-3所示」）？',
      '假說檢定彙總表是否清晰總結所有假設之檢定結果（成立/不成立）？'
    ]
  },
  {
    id: 'faq-5',
    category: 'discussion',
    categoryName: '結論與討論',
    question: '第5章的「討論（Discussion）」與第4章的「結果（Results）」到底有何本質區別？',
    shortAnswer: '第4章回答「我們發現了什麼（What we found）」，第5章回答「這些發現意味著什麼、為什麼會這樣、跟前人研究有何不同（So what & Why）」。',
    detailedGuidance: [
      '1. 與前人研究對話：針對每一項研究發現，指出「本研究結果與 Smith (2020) 的研究一致，再次印證了...；但與 Lee (2022) 的發現分歧，可能原因在於情境差異...」。',
      '2. 理論貢獻（Theoretical Contributions）：明確指出本研究推進了既有哪一個理論模型（如擴展了 TAM 理論邊界、釐清了雙重路徑機制）。',
      '3. 實務意涵（Managerial/Practical Implications）：為產業管理者、政策制定者或第一線工作者提供可落地的具體建議。',
      '4. 研究限制與未來方向（Limitations & Future Research）：誠實坦白樣本、研究方法或環境限制，並給後續研究者具體探討建議。'
    ],
    commonMistakes: [
      '❌ 把第4章的數據結論換句話說重抄一遍當成討論',
      '❌ 實務建議淪為口號（例如「建議企業應加強員工訓練」），毫無根據本研究數據產生的洞察',
      '❌ 研究限制寫得像是自己的研究一文不值，或將低級錯誤（如問卷發太少）當成限制'
    ],
    advisorChecklist: [
      '理論貢獻是否至少分列 2~3 點具體論述？',
      '實務建議是否具有行動性（Actionable）且緊扣實證結果？',
      '未來研究方向是否針對本篇未解決的邊界條件提出建議？'
    ]
  },
  {
    id: 'faq-6',
    category: 'defense',
    categoryName: '學位口試與答辯',
    question: '口試時口試委員最常問哪些核心問題？該如何應對評審委員的尖銳質疑？',
    shortAnswer: '口試委員主要檢驗三個維度：研究價值（為什麼要做？）、方法論嚴謹度（做的方法對不對？）、學生對自己研究的邊界認識（你知道自己限制在哪嗎？）。',
    detailedGuidance: [
      '1. 「為什麼選這個題目？跟別人有什麼不一樣？」→ 從研究缺口（Gap）與實務價值自信回答。',
      '2. 「你的樣本只有300人/5間公司，結論能推論嗎？」→ 承認外部效度限制，並強調內部效度與研究情境的代表性。',
      '3. 「變數A跟變數B之間是否有共線性或替代解釋？」→ 說明在研究設計與統計分析中如何控制干擾變數。',
      '4. 應對心態：委員提問不是為了「打倒你」，而是為了「幫你把論文修得更好」。先感謝委員意見，再精準切入回答。'
    ],
    commonMistakes: [
      '❌ 與口試委員情緒化爭辯或當場反駁「老師你沒看懂我的論文」',
      '❌ 遇到不會的問題胡亂猜測，給出邏輯自相矛盾的回答',
      '❌ 簡報時間超時（規定20分鐘卻講了35分鐘，嚴重扣分）'
    ],
    advisorChecklist: [
      '口試 PPT 是否精簡在 20~25 頁以內，字體大小至少 24pt？',
      '是否事先進行過至少 2 次完整計時預口試演練？',
      '是否準備好「備用投影片（Backup Slides）」以因應細節數據提問？'
    ]
  }
];

export const DEFAULT_CHAPTER_GUIDES: ChapterGuide[] = [
  {
    chapterNumber: 1,
    chapterCode: 'Ch1',
    title: '第一章 緒論 (Introduction)',
    subTitle: '奠定研究基石：從實務現象引導至核心研究問題',
    estimatedPages: '8 ~ 15 頁',
    coreObjective: '向讀者與口委證明：這個研究主題極具價值、目前文獻確實缺少解答，且本研究有明確的可行目標。',
    sections: [
      {
        title: '1.1 研究背景與動機 (Background & Motivation)',
        purpose: '建立問題發生的宏觀情境，從現實世界問題收斂至學術研究問題。',
        essentialElements: [
          '產業或社會現象趨勢（附權威統計數據）',
          '實務痛點引發的學術關懷',
          '前人研究之重大進展與未竟之處（Research Gap）'
        ],
        advisorTips: [
          '漏斗型寫作架構（Broad context → Specific problem → Urgent need）',
          '避免寫成散文或個人日記，每一句重要事實陳述皆須附文獻來源'
        ],
        sentenceStarters: [
          {
            label: '引入現象與重要性',
            examples: [
              '近年來，隨著 [主題/技術] 的迅速普及，... 已成為學術界與實務界高度關注之核心議題 (Author, 2023)。',
              'Despite the growing prominence of [Phenomenon], empirical understanding of its underlying dynamics remains nascent.'
            ]
          },
          {
            label: '點出研究缺口 (Gap)',
            examples: [
              '雖然過去學者已針對 [構念A] 進行諸多探討 (e.g., Wang, 2021)，然而在 [特定情境/構念B] 的脈絡下，兩者之互動機制仍鮮少被實證檢驗。',
              'Prior studies have predominantly focused on X; however, whether these findings generalize to Y represents a critical yet unresolved empirical question.'
            ]
          }
        ],
        pitfallsToAvoid: [
          '花了五頁篇幅介紹大歷史，遲遲未切入論文核心主題',
          '將商業雜誌報導當作嚴謹學術論據'
        ]
      },
      {
        title: '1.2 研究目的與研究問題 (Objectives & Research Questions)',
        purpose: '明確列出本論文擬達成的具體目標與核心研究問題清單。',
        essentialElements: [
          '總體研究目的（Overall objective）陳述',
          '3~4 個具體的次要研究問題（RQ1, RQ2, RQ3）'
        ],
        advisorTips: [
          '研究問題必須是「疑問句」形式，且必須是可被實證驗證的',
          '研究問題必須能與後續的假說（第2章）與結論（第5章）一一對應'
        ],
        sentenceStarters: [
          {
            label: '研究目的宣示',
            examples: [
              '基於上述研究背景與理論缺口，本研究之主要目的在於探討...',
              'Specifically, this dissertation seeks to address the following research questions (RQs):'
            ]
          }
        ],
        pitfallsToAvoid: [
          '研究問題過於廣泛無法收斂（例如：「探討AI對人類社會的一切影響」）',
          '列出是/非題等缺乏研究深度的問題（例如：「科技是否重要？」）'
        ]
      },
      {
        title: '1.3 研究重要性與預期貢獻 (Significance & Contributions)',
        purpose: '闡述研究完成後，對理論學術界與實務應用的雙重價值。',
        essentialElements: ['學術理論貢獻 (Theoretical Value)', '實務應用價值 (Practical Value)'],
        advisorTips: ['不要過度誇大，用謙遜而堅定的語氣陳述本研究的邊際貢獻（Marginal Contribution）。'],
        sentenceStarters: [
          {
            label: '理論與實務貢獻說明',
            examples: [
              '在理論層面上，本研究藉由整合 [理論A] 與 [理論B]，拓展了...之解釋範疇。',
              'From a practical standpoint, the empirical findings offer actionable guidelines for practitioners aiming to...'
            ]
          }
        ],
        pitfallsToAvoid: ['只談實務好處，完全忽略對學術理論的推展貢獻。']
      },
      {
        title: '1.4 名詞釋義與研究範圍 (Definition of Terms & Scope)',
        purpose: '界定核心變數的操作型概念與論文的研究邊界。',
        essentialElements: ['核心構念專有名詞界定', '研究對象與地理/時間範圍限制'],
        advisorTips: ['名詞釋義必須有經典文獻佐證，不能隨意自己望文生義。'],
        sentenceStarters: [
          {
            label: '定義名詞',
            examples: ['本研究所指之「[構念名稱]」，係依據 Smith et al. (2020) 之定義，指稱...']
          }
        ],
        pitfallsToAvoid: ['同一個名詞在第一章與後續章節定義前後不一。']
      }
    ],
    exemplarSnippet: {
      title: '緒論優秀寫作示範：以「生成式AI輔助教學之學習焦慮與成效研究」為例',
      content: '近年來生成式AI（Generative AI）技術在高等教育場域引發革命性變革（Bender et al., 2021; UNESCO, 2023）。儘管近期文獻普遍肯定AI輔助工具能提升學生資料檢索與程式撰寫效率（Chen & Liu, 2023; Williamson, 2024），然而，多數實證研究多聚焦於技術採納意願（Acceptance），卻相對忽視了學習者在人機協作過程中所伴隨的認知負荷與科技焦慮（Technostress）對深層學習成效的潛在負面衝擊（Dwivedi et al., 2023）。本研究旨在以認知負荷理論（Cognitive Load Theory）為架構，深入探討...',
      analysis: '此段落具備完美的「宏觀背景（引用UNESCO）→ 既有文獻肯定面 → 既有文獻盲點（忽視科技焦慮）→ 帶入本研究理論架構」結構，具備極強的學術邏輯張力。'
    }
  },
  {
    chapterNumber: 2,
    chapterCode: 'Ch2',
    title: '第二章 文獻探討 (Literature Review)',
    subTitle: '站在巨人肩膀上：批判性綜述與理論假說推導',
    estimatedPages: '20 ~ 40 頁',
    coreObjective: '全面檢視與本研究相關的基礎理論與實證文獻，並有邏輯地推導出本研究的研究架構與假說（Hypotheses）。',
    sections: [
      {
        title: '2.1 基礎核心理論與理論架構 (Theoretical Foundation)',
        purpose: '建立支撐整篇論文的底層理論（例如：計劃行為理論 TPB、技術接受模型 TAM、資源基礎觀 RBV、認知評價理論 等）。',
        essentialElements: ['理論源起與核心假定', '理論在該領域的適用性與演進歷程', '本研究如何借鑑該理論進行延伸'],
        advisorTips: ['切忌把理論教科書歷史原封不動抄錄，重點在於「該理論如何為你的假說提供解釋機制」。'],
        sentenceStarters: [
          {
            label: '理論引入與依據',
            examples: [
              '本研究奠基於 Deci 與 Ryan (1985) 所提出之自我決定理論（Self-Determination Theory, SDT），該理論主張...',
              'Drawing upon the Resource-Based View (RBV) (Barney, 1991), this study conceptualizes firm capabilities as...'
            ]
          }
        ],
        pitfallsToAvoid: ['列了理論名詞，但在後續的假說推導中完全沒用到該理論的機制。']
      },
      {
        title: '2.2 各核心構念之相關文獻批判性綜述 (Critical Synthesis of Constructs)',
        purpose: '依變數主題分節綜整國內外重要實證研究之發現與爭鳴。',
        essentialElements: ['構念的維度劃分與測量方式', '前因變數（Antecedents）與結果變數（Consequences）之實證發現', '文獻綜整矩陣表'],
        advisorTips: ['每一小節最後必須有一段「小結」，歸納既有研究之結論並指出本研究之切入觀點。'],
        sentenceStarters: [
          {
            label: '綜整多元觀點',
            examples: [
              '綜觀既有文獻，學者對於 [構念A] 對 [構念B] 的影響效果仍存在不同論點。部分學者發現正向顯著影響 (e.g., Lin, 2020)，然而亦有研究指出兩者之間存在非線性關係 (e.g., Miller & Ross, 2022)。此種分歧可能源於...',
              'A synthesis of recent literature reveals three prominent perspectives on...'
            ]
          }
        ],
        pitfallsToAvoid: ['通篇單純摘要「A學者說...B學者說...」，沒有歸納比較的對話過程。']
      },
      {
        title: '2.3 研究假說之推導 (Hypothesis Development)',
        purpose: '利用文獻邏輯與理論機制，逐一推導假說（H1, H2, H3...）。',
        essentialElements: ['自變數對依變數的影響機制推導', '中介效果（Mediating effect）邏輯論述', '調節效果（Moderating effect）邏輯論述', '明確的假說陳述句（H1: ...呈正向顯著影響）'],
        advisorTips: ['推導假說一定要講清楚「因果黑盒子（Why X leads to Y?）」，不能只有「因為A說有影響所以H1成立」。'],
        sentenceStarters: [
          {
            label: '假說推導結語',
            examples: [
              '當個體感知到高度的 [變數A] 時，將會誘發 [心理機制/變數M]，進而提升其 [變數B] 的行為表現。綜上所述，本研究提出以下假說：\n假說一 (H1)：[變數A] 對 [變數B] 具有正向顯著影響。',
              'Based on the aforementioned theoretical reasoning and empirical evidence, it is hypothesized that:\nH1: Construct X is positively associated with Construct Y.'
            ]
          }
        ],
        pitfallsToAvoid: ['假說方向模糊（例如寫成「A與B有關係」，未明確指出正向、負向或差異）。']
      }
    ],
    exemplarSnippet: {
      title: '假說推導優秀示範：中介機制論證',
      content: '根據自我效能理論（Bandura, 1997），當員工獲得充分的數位工具支援時，能降低對新技術的不確定感，進而提升其科技自我效能感（Technological Self-Efficacy）（Venkatesh et al., 2012）。進一步而言，具備高自我效能感的個體，傾向將工作挑戰視為可克服的任務，從而展現更高的工作投入度（Work Engagement）（Schaufeli et al., 2006）。因此，科技工具支援不僅能直接促進工作投入，更可能透過科技自我效能感的中介作用間接強化投入程度。據此，本研究推論：\n假說 H2：科技自我效能感在科技工具支援與員工工作投入之間具有中介效果。',
      analysis: '此段落完美示範了「自變數 → 中介心理機制 → 依變數」的雙層理論推導鏈，邏輯水到渠成，極具說服力。'
    }
  },
  {
    chapterNumber: 3,
    chapterCode: 'Ch3',
    title: '第三章 研究方法 (Research Methodology)',
    subTitle: '科學復現的藍圖：研究架構、抽樣、工具與分析程序',
    estimatedPages: '12 ~ 25 頁',
    coreObjective: '鉅細靡遺交代研究設計細節，確保研究之內部效度、外部效度與可復現性。',
    sections: [
      {
        title: '3.1 研究架構 (Conceptual Framework)',
        purpose: '以清晰的圖形展現研究變數、路徑關係與假說編號。',
        essentialElements: ['研究架構圖 (Conceptual Model Diagram)', '自變數、中介變數、調節變數、依變數與控制變數標示'],
        advisorTips: ['架構圖中的箭頭方向必須與假說一一吻合，控制變數要畫在下方或明確註明。'],
        sentenceStarters: [
          {
            label: '架構說明',
            examples: ['本研究依據第二章文獻探討與理論假說推導，建構本研究之整體研究架構，如圖 3-1 所示：']
          }
        ],
        pitfallsToAvoid: ['圖表編號遺漏，或者文字中的假說代號與圖上標註不一致。']
      },
      {
        title: '3.2 研究對象與抽樣程序 (Participants & Sampling Procedure)',
        purpose: '界定母體特徵、抽樣方法、樣本數估算標準與受試者倫理保護。',
        essentialElements: ['母體定義與篩選條件', '抽樣策略（隨機、分層、立意、便利抽樣）', '樣本數決定原則（如 G*Power 檢定力分析）', '問卷發放與回收管道紀錄'],
        advisorTips: ['一定要交代樣本數計算依據（例如：依據 Hair et al. (2019) 建議，樣本數應為估計參數量的 5~10 倍以上）。'],
        sentenceStarters: [
          {
            label: '樣本數說明',
            examples: ['本研究採用 G*Power 3.1 軟體進行先驗檢定力分析（A priori power analysis），設定效應值 f² = 0.15、顯著水準 α = .05、檢定力 1-β = .80，計算得最小所需有效樣本數為...']
          }
        ],
        pitfallsToAvoid: ['只寫「本研究發放線上問卷共回收200份」，對抽樣母體、有效率篩選標準隻字不提。']
      },
      {
        title: '3.3 測量工具與操作型定義 (Operationalization & Instruments)',
        purpose: '列出各構念之操作型定義、題項來源量表、計分方式與前測信度。',
        essentialElements: ['各變數操作型定義對照表', '量表授權/翻譯過程', '李克特計分方式與反向題設定', '前測（Pilot Test）Cronbach α 數據'],
        advisorTips: ['製作精美完整的「變數操作型定義與題項對照表（Operationalization Table）」，是口試委員必看重點！'],
        sentenceStarters: [
          {
            label: '量表來源說明',
            examples: ['本研究之「[變數名稱]」量表改編自 Smith et al. (2020) 所編製之成熟量表，共計 X 個題項，採用李克特五點尺度（Likert 5-point scale）計分...']
          }
        ],
        pitfallsToAvoid: ['直接使用非標準量表卻未進行任何專家效度審查（Content Validity Index, CVI）。']
      },
      {
        title: '3.4 資料分析方法與統計檢定程序 (Data Analysis Methods)',
        purpose: '說明各階段資料分析將使用的統計方法或質性分析工具。',
        essentialElements: ['敘述性統計與常態性檢驗', '信度與效度檢定（EFA/CFA, CR, AVE）', '假說檢定工具（結構方程模型 SEM, 多元迴歸, Process 巨集）', '共同方法變異（CMV）檢驗程序'],
        advisorTips: ['詳細說明分析軟體版本（例如：SPSS 28.0, SmartPLS 4, AMOS 26, Python 3.10）。'],
        sentenceStarters: [
          {
            label: '統計分析步驟說明',
            examples: ['本研究之實證資料分析採用 SPSS 28.0 與 SmartPLS 4 進行統計處理。分析步驟依序包含：(1) 敘述性統計分析；(2) 測量模型之信效度分析；(3) 結構模型路徑分析與 Bootstrapping (5,000 次抽樣) 假說檢定。']
          }
        ],
        pitfallsToAvoid: ['分析工具與研究目的不符（例如：小樣本卻宣稱做需要大樣本的協方差結構方程模型 CB-SEM）。']
      }
    ],
    exemplarSnippet: {
      title: '操作型定義與量表信度示範',
      content: '本研究將「知覺有用性（Perceived Usefulness）」操作型定義為：學習者主觀感知使用生成式AI工具對於提升其學術研究效率與論文寫作產出品質之助益程度。量表改編自 Davis (1989) 與 Venkatesh et al. (2012) 之經典量表，包含「使用該工具能使我更快完成文獻檢索」、「該工具能提升我的寫作品質」等4個題項。預試樣本（N=45）之 Cronbach’s α 為 .892，顯示具備優良之內部一致性信度。',
      analysis: '定義精準緊扣本研究情境，並有經典理論出處與前測試驗信度支持，無懈可擊。'
    }
  },
  {
    chapterNumber: 4,
    chapterCode: 'Ch4',
    title: '第四章 研究結果與分析 (Results & Findings)',
    subTitle: '數據說話：客觀呈現實證分析結果與假說檢定',
    estimatedPages: '15 ~ 35 頁',
    coreObjective: '以嚴謹的學術表格與統計檢定數據，客觀、清晰地陳述所有實證發現與研究假說成立狀況。',
    sections: [
      {
        title: '4.1 樣本特徵與描述性統計 (Sample Profile & Descriptive Statistics)',
        purpose: '呈現受試者人口統計變數分佈、構念之平均數（Mean）、標準差（SD）與常態性檢定。',
        essentialElements: ['人口統計變數特徵表（三線表）', '各構念平均數、標準差、偏態與峰度檢定'],
        advisorTips: ['表格數字務必小數點位數統一（通常保留小數點後兩位或三位）。'],
        sentenceStarters: [
          {
            label: '描述統計呈現',
            examples: ['正式發放問卷共計回收 350 份，扣除無效問卷後，有效樣本為 318 份（有效回收率 90.8%）。樣本之人口統計變數分佈如表 4-1 所示：']
          }
        ],
        pitfallsToAvoid: ['文字將表格所有數字逐格唸一遍，缺乏重點摘要。']
      },
      {
        title: '4.2 測量模型檢驗：信度與效度分析 (Measurement Model Assessment)',
        purpose: '檢驗量表的收斂效度（Convergent Validity）與區別效度（Discriminant Validity）。',
        essentialElements: ['因素負荷量（Factor Loadings > 0.7）', '組合信度（CR > 0.7）與平均變異抽取量（AVE > 0.5）', 'Fornell-Larcker 準則或 HTMT 矩陣（< 0.85/0.90）'],
        advisorTips: ['若有題項因素負荷量過低（< 0.5），應說明刪除該題項的理由與刪除後的信效度改善情況。'],
        sentenceStarters: [
          {
            label: '效度檢定陳述',
            examples: ['如表 4-3 所示，所有構念之個別題項因素負荷量均介於 .72 至 .88 之間，組合信度（CR）介於 .85 至 .93，且平均變異抽取量（AVE）均高於 .50 之門檻值（Fornell & Larcker, 1981），顯示本研究測量模型具備良好之收斂效度。']
          }
        ],
        pitfallsToAvoid: ['忽視區別效度檢定，導致構念間高度重疊。']
      },
      {
        title: '4.3 結構模型路徑分析與假說檢定 (Structural Model & Hypothesis Testing)',
        purpose: '檢驗研究假說，呈現路徑係數（β）、t值、p值、效果值（f²）與解釋力（R²）。',
        essentialElements: ['主效應路徑分析表', '中介效應分析（Bootstrap 95% 信賴區間不包含0）', '調節效應圖（Simple Slopes Plot）', '假說檢定結果總彙整表'],
        advisorTips: ['假說檢定總表應包含：假說編號、假說內容、路徑係數、t/p值、檢定結果（成立/不成立）。'],
        sentenceStarters: [
          {
            label: '假說檢定結果陳述',
            examples: ['路徑分析結果顯示，[變數A] 對 [變數B] 具有顯著正向影響（β = .342, t = 4.891, p < .001），因此假說 H1 獲得實證資料支持。',
              'The bootstrapping analysis (5,000 resamples) revealed that the indirect effect of X on Y via M was statistically significant (β = .125, 95% CI [.048, .213]), thereby supporting H3.']
          }
        ],
        pitfallsToAvoid: ['不成立的假說刻意竄改數據或隱瞞不報。']
      }
    ],
    exemplarSnippet: {
      title: '中介效應統計呈現示範',
      content: '本研究採用 Hayes (2018) 之 PROCESS 巨集（Model 4）進行中介效應檢驗，設定重複抽樣次數為 5,000 次。分析結果顯示，認知負荷對學習成效之間接效果值為 -.148，其偏差校正後的 95% 信賴區間為 [-.235, -.069]，區間未包含 0，且 Sobel 檢定亦達顯著水準（Z = -3.42, p < .001）。此結果證實認知負荷在生成式AI工具使用與深層學習成效之間具有顯著之負向中介效果，假說 H3 獲得支持。',
      analysis: '完整包含點估計值、Bootstrapping 95% 信賴區間與顯著性檢定指標，標準學術寫作範例。'
    }
  },
  {
    chapterNumber: 5,
    chapterCode: 'Ch5',
    title: '第五章 結論與建議 (Conclusion & Discussion)',
    subTitle: '昇華研究價值：學術對話、實務貢獻、研究限制與未來展望',
    estimatedPages: '10 ~ 20 頁',
    coreObjective: '跳脫純數據層次，對研究發現進行深度學術解讀，為學界提供理論洞見，為業界提供具體行動指南。',
    sections: [
      {
        title: '5.1 研究結論 (Summary of Findings)',
        purpose: '簡明扼要總結本論文對各項研究問題的解答。',
        essentialElements: ['呼應第一章之研究問題與目的', '精華摘要主要實證發現'],
        advisorTips: ['結論文字要高階提煉，不要把第四章的統計數字原封不動重寫一遍。'],
        sentenceStarters: [
          {
            label: '結論引導句',
            examples: ['本研究旨在探討...，透過實證調查與嚴謹統計檢定，歸納出以下三項核心結論：第一，...']
          }
        ],
        pitfallsToAvoid: ['結論超出了實證資料所能推論的範圍（Over-generalization）。']
      },
      {
        title: '5.2 理論與學術貢獻 (Theoretical Contributions)',
        purpose: '說明本研究對既有文獻與學術理論之推進價值。',
        essentialElements: ['拓展了何種既有理論的應用邊界', '釐清了過去文獻爭議之因果機制', '提出了新穎的整合模型或情境視角'],
        advisorTips: ['至少列出 3 點具體理論貢獻，每一點皆須引用第2章回顧之文獻進行對照說明。'],
        sentenceStarters: [
          {
            label: '理論貢獻說明',
            examples: [
              '首先，本研究之主要理論貢獻在於拓展了 [理論名稱] 在 [新興情境] 的應用範疇。過去學者 (e.g., Kim, 2021) 多著重於...，本研究則進一步證實了...，深化了對該機制的理解。',
              'This study contributes to the literature in three distinct ways. First, we extend...'
            ]
          }
        ],
        pitfallsToAvoid: ['寫得空泛（例如：「本研究貢獻很大，提供了豐富的理論參考」）。']
      },
      {
        title: '5.3 實務與管理意涵 (Practical & Managerial Implications)',
        purpose: '針對產業界、教育界或政策制定者提出具體可落地的行動方針。',
        essentialElements: ['針對不同利害關係人之具體建議', '可實施的策略步驟與注意事項'],
        advisorTips: ['實務建議必須從「研究數據」自然推導出來，切忌憑空想像。'],
        sentenceStarters: [
          {
            label: '實務建議陳述',
            examples: ['基於實證結果中「[變數A] 對 [變數B] 具有高度影響」之發現，本研究為實務管理者提供以下具體行動建議：(1) 在導入AI系統初期，機構應設立...']
          }
        ],
        pitfallsToAvoid: ['給出放諸四海皆準的廢話（例如「建議加強溝通、提高品質」）。']
      },
      {
        title: '5.4 研究限制與未來研究方向 (Limitations & Future Research)',
        purpose: '客觀坦承本研究之侷限性，並為後續研究者指引探討方向。',
        essentialElements: ['方法論限制（樣本規模、橫斷面設計限制）', '未納入之潛在調節變數', '後續縱貫面研究（Longitudinal study）或實驗設計建議'],
        advisorTips: ['研究限制要寫得專業，展現對研究設計邊界的清醒認知。'],
        sentenceStarters: [
          {
            label: '限制與展望',
            examples: [
              '儘管本研究在研究設計上力求嚴謹，仍存在若干研究限制，並可做為未來後續研究之參考方向：\n首先，本研究受限於時間與資源，採用橫斷面（Cross-sectional）問卷調查法，難以完全確證變數間之動態因果關係。未來研究可考慮採用縱貫面追蹤調查或準實驗設計...'
            ]
          }
        ],
        pitfallsToAvoid: ['把嚴重的研究瑕疵當作限制輕描淡寫。']
      }
    ],
    exemplarSnippet: {
      title: '理論貢獻與實務意涵優秀示範',
      content: '在理論意涵方面，本研究之核心貢獻在於突破了過去將AI工具視為單純效率增強器（Efficiency booster）的單向思維，首度將「人機互動認知負荷」納入學習成效模型中，實證揭示了過度依賴AI可能產生的認知鈍化效應，從而為認知負荷理論在智慧教育時代的延伸提供了微觀實證支持。\n在實務管理方面，研究結果提醒教育主管機關與大學授課教師：在推廣生成式AI教學時，不應僅追求工具操作之普及，更應配套導入「思辨引導提示詞框架（Critical Prompting Scaffolding）」，強制要求學生在獲得AI產出後進行二次驗證與反思，以阻斷認知負荷過載所導致的學習成效滑落。',
      analysis: '文字兼具理論深度與實務洞察，條理清晰、論述極具學術穿透力。'
    }
  }
];

export const DEFAULT_EXEMPLAR_THESES: ExemplarThesis[] = [
  {
    id: 'exemplar-1',
    title: '生成式 AI 協作環境下知識工作者之科技焦慮、認知重構與創新工作行為研究',
    author: '林雅婷 博士',
    degree: '博士論文',
    year: 2024,
    field: '管理資訊系統 / 組織行為',
    methodologyType: '量化研究',
    awardOrHonor: '獲選全國優良博士學位論文獎、SSCI頂級期刊（MIS Quarterly）收錄改寫',
    abstract: '本研究旨在探討生成式人工智慧（GenAI）技術導入對知識工作者之心理衝擊與行為模式。基於交易壓力理論（Transactional Theory of Stress）與工作要求-資源模型（JD-R Model），本研究構建了一個包含挑戰性/威脅性評價、科技焦慮、認知重構與創新工作行為的結構方程模型。透過針對高科技與金融產業 412 位知識工作者的兩階段配對問卷調查，研究發現：AI 效能感顯著調節了工作者對技術威脅的認知評價；進一步而言，具備高認知重構能力之員工能將技術焦慮轉化為創新的驅動力。研究結果為企業推動人機協同轉型提供了重要之理論模型與介入策略。',
    researchQuestions: [
      'RQ1: 生成式AI的技術特徵如何影響知識工作者的威脅性評價與挑戰性評價？',
      'RQ2: 認知重構（Cognitive Reframing）在科技焦慮與創新工作行為之間扮演何種中介/調節角色？',
      'RQ3: 組織支援與個人AI素養如何調節上述關係路徑？'
    ],
    frameworkSummary: '自變數: AI技術不確定性 / 技術步調 | 仲介變數: 威脅評價 vs 挑戰評價 -> 科技焦慮 | 調節變數: 認知重構 / AI自我效能感 | 依變數: 創新工作行為 (IWB)',
    chapters: [
      {
        chapterTitle: '第一章 緒論亮點解析',
        highlight: '精準切入產業轉型痛點與理論盲區',
        advisorComment: '作者在前言成功引用 2023-2024 最新世界經濟論壇數據與多篇 top MIS 期刊，開門見山點出「技術焦慮未被充分探討」之理論缺口，文字節奏極佳。',
        sampleExcerpt: '面對生成式AI帶來的生產力革命，業界多聚焦於產出倍增之紅利，然而微觀層面上個體所承受的「角色模糊」與「存在性焦慮」已悄然形成新形態的組織風險...'
      },
      {
        chapterTitle: '第二章 文獻與假說推導亮點',
        highlight: '雙重路徑（威脅 vs 挑戰）理論推導細膩',
        advisorComment: '將古典壓力理論成功與現代 GenAI 情境結合，中介機制層層遞進，每條假說皆有清晰的認知黑盒子解釋。',
        sampleExcerpt: '依據 Lazarus 與 Folkman (1984) 之認知評價理論，壓力源本身並非必然產生負面結果，關鍵在於個體之初級評價（Primary Appraisal）...'
      },
      {
        chapterTitle: '第三章 研究方法亮點',
        highlight: '兩階段時間延遲（Time-lagged）問卷設計降低 CMV',
        advisorComment: '自變數與依變數相隔 4 週施測，並施測標記變數法（Marker Variable Technique），方法論無懈可擊。',
        sampleExcerpt: '為有效抑制共同方法變異（CMV），本研究採兩階段時間分離設計（Time-lagged design），T1 階段施測自變數與個人特質，T2 階段施測中介變數與創新行為...'
      },
      {
        chapterTitle: '第四章 結果分析亮點',
        highlight: 'SmartPLS 4 測量模型與結構模型嚴謹呈現',
        advisorComment: 'HTMT 矩陣全部低於 0.85，中介調節檢驗包含 Johnson-Neyman 顯著區間圖，圖表製作堪稱典範。',
        sampleExcerpt: 'Bootstrapping 5000 次抽樣顯示，認知重構之調節中介指數（Index of Moderated Mediation）達顯著水準（Index = .082, 95% CI [.021, .156]）...'
      },
      {
        chapterTitle: '第五章 結論與討論亮點',
        highlight: '理論貢獻提煉出「人機協同認知調適模型」',
        advisorComment: '實務建議並非空泛喊話，而是針對 HR 培訓設計出「三階段 AI 心理賦能工作坊流程」，極具產學價值。',
        sampleExcerpt: '本研究從理論層面拓寬了資訊系統領域對「負面技術心理學」之理解邊界，證實適度的技術張力經由認知重組能反向激發主動適應性行為...'
      }
    ],
    keyTakeaways: [
      '緒論務必以權威實證數據為錨點，確立 Research Gap',
      '量化研究盡量採用多時間點（Time-lagged）設計以強化因果推論力',
      '第五章實務意涵應具備可操作之 SOP 或架構圖'
    ],
    downloadableTemplateOutline: '1. 緒論 (背景 -> 痛點 -> Gap -> 目的 -> RQ)\n2. 文獻探討 (古典理論 -> 核心構念 -> 假說推導 H1~H6)\n3. 研究方法 (架構圖 -> 抽樣程序 -> 操作型定義 -> 分析步驟)\n4. 結果分析 (描述統計 -> 測量模型信效度 -> 結構方程路徑檢定)\n5. 結論與討論 (主要結論 -> 理論貢獻 -> 實務建議 -> 限制與未來方向)'
  },
  {
    id: 'exemplar-2',
    title: '智慧製造轉型中傳統中小企業之動態能力演化：多個案比較研究',
    author: '陳俊宏 碩士',
    degree: '碩士論文',
    year: 2023,
    field: '科技管理 / 策略管理',
    methodologyType: '質性研究',
    awardOrHonor: '榮獲台灣管理學會優秀碩士論文特優獎',
    abstract: '本研究採取質性多個案研究法（Multiple Case Study），深入探討四家台灣傳統精密機械與扣件製造中小企業在資源匱乏情境下，如何藉由微觀基礎（Microfoundations）逐步建構「感測、掌握與轉型」之數位動態能力。研究歷時 18 個月，蒐集超過 28 位高階主管、工程師與現場師傅之半結構式深度訪談資料（共計 34 萬字逐字稿），並輔以工廠現場觀察與內部文檔三角檢證（Triangulation）。研究歸納出「漸進式外掛升級」與「社群式知識轉譯」兩大轉型路徑模型。',
    researchQuestions: [
      'RQ1: 資源受限之傳統中小企業如何突破認知慣性啟動數位轉型？',
      'RQ2: 現場師傅隱性經驗如何透過數位工具轉化為組織顯性能力？'
    ],
    frameworkSummary: '多個案比較分析 (Case A, B, C, D) -> 扎根理論三級編碼 (開放編碼、主軸編碼、核心編碼) -> 跨個案模式比對 (Cross-case synthesis)',
    chapters: [
      {
        chapterTitle: '第一章 緒論',
        highlight: '突出台灣中小企業隱形冠軍之獨特實務脈絡',
        advisorComment: '作者將國際文獻中多聚焦大企業轉型的限制點出，強調中小企業特殊情境，極富學術價值。',
        sampleExcerpt: '既有數位轉型文獻多取材自歐美跨國巨擘（如西門子、奇異），然而佔台灣企業總數 98% 之傳統中小企業，面臨著截然不同的資源約束與老師傅隱性知識斷層...'
      },
      {
        chapterTitle: '第二章 文獻探討',
        highlight: '動態能力微觀基礎理論脈絡清晰',
        advisorComment: '文獻探討緊扣 Teece 的動態能力框架，並融入知識創造理論（SECI 模型）。',
        sampleExcerpt: '動態能力之建立並非抽象架構，而是深植於組織日常運作之微觀常規（Micro-routines）與管理決策啟發式規則（Heuristics）...'
      },
      {
        chapterTitle: '第三章 研究方法',
        highlight: '質性研究嚴謹度（Trustworthiness）檢核表完整',
        advisorComment: '詳細記載研究者角色、編碼者間信度（Inter-coder reliability）、成員檢核（Member checking）與資料三角檢驗過程。',
        sampleExcerpt: '為確保質性研究之可信度（Credibility）與可轉移性（Transferability），本研究採取 Lincoln & Guba (1985) 之嚴謹度架構...'
      },
      {
        chapterTitle: '第四章 個案分析與跨個案比較',
        highlight: '編碼表格與引文證據鏈（Chain of Evidence）豐富',
        advisorComment: '跨個案比較矩陣製作精美，理論概念與質性受訪者原話對照極為生動扎實。',
        sampleExcerpt: '「那時候老師傅根本不願意碰平板，說機器聽聲音就知道好壞...直到我們把聲紋圖譜化展示給他看...」（受訪者 B-02）'
      },
      {
        chapterTitle: '第五章 結論與理論意涵',
        highlight: '提出「情境化數位能力演化四階段模型」',
        advisorComment: '提煉出具有普適解釋力的理論模型圖，獲得口試委員一致滿分讚譽。',
        sampleExcerpt: '本研究跳脫「技術決定論」之迷思，證實傳統製造業之數位轉型本質上是「社會-技術系統（Socio-Technical System）」之協同再造...'
      }
    ],
    keyTakeaways: [
      '質性研究最忌只有主觀心得，必須展示嚴格的編碼架構與三角檢證數據鏈',
      '跨個案分析應採用清晰的對比矩陣呈現異同點',
      '結論章節應收斂出高度抽象化的概念模型'
    ],
    downloadableTemplateOutline: '1. 緒論 (實務情境脈絡 -> 既有文獻大企業偏誤 -> 研究問題)\n2. 文獻探討 (動態能力視角 -> 組織知識轉移 -> 情境特徵)\n3. 研究方法 (多個案設計 -> 個案選取標準 -> 資料蒐集與編碼程序 -> 嚴謹度標準)\n4. 個案內分析與跨個案綜整 (各個案歷程 -> 跨個案編碼對照 -> 模式比對)\n5. 結論與意涵 (演化模型 -> 理論貢獻 -> 政策與管理建議 -> 限制)'
  },
  {
    id: 'exemplar-3',
    title: '基於混合方法之虛擬實境（VR）沉浸式醫學解剖教學成效與認知負荷評估',
    author: '張偉哲 碩士',
    degree: '碩士論文',
    year: 2024,
    field: '數位學習 / 醫學教育',
    methodologyType: '混合研究',
    awardOrHonor: '優秀碩士學位論文獎，成果發表於 Computers & Education (SSCI Q1)',
    abstract: '本研究採用解釋性循序混合方法設計（Explanatory Sequential Mixed Methods Design, QUAN → qual）。第一階段量化實驗針對 120 位醫學系二年級學生進行準實驗研究，比較 VR 沉浸式組與傳統 2D 圖譜組在解剖空間理解力與認知負荷（眼動追蹤指標與主觀量表）之差異；第二階段質性訪談針對 16 位不同表現之受試者進行放聲思考（Think-Aloud）與半結構式訪談，以深層解釋量化數據中「空間能力較低者在 VR 環境中反而產生認知過載」之反直覺現象。',
    researchQuestions: [
      'QUAN-RQ: VR 沉浸式教學與傳統圖譜教學在醫學解剖測驗分數與眼動注視時間上有何顯著差異？',
      'QUAL-RQ: 空間能力高低不同之學生在操作 VR 介面時，其認知歷程與挫折感來源為何？',
      'MIX-RQ: 質性認知訪談如何深化解釋量化實驗中發現的調節效應？'
    ],
    frameworkSummary: 'Phase 1: 量化準實驗 (N=120, Eye-tracking + Post-test) --> Phase 2: 質性深度訪談 (N=16, Think-aloud) --> Phase 3: 混合數據整合 (Joint Display Matrix)',
    chapters: [
      {
        chapterTitle: '緒論與研究設計',
        highlight: '明確定義混合研究方法之必要性（Why Mixed Methods?）',
        advisorComment: '清楚論證為何純量化無法解釋認知死角、純質性無法檢驗成效，混合方法為最佳解。',
        sampleExcerpt: '單純量化測驗分數僅能呈現「結果（What happened）」，卻無法洞悉學生在虛擬三維空間中的「思維導航策略（How they processed）」...'
      },
      {
        chapterTitle: '方法論章節',
        highlight: 'Creswell 經典混合研究流程圖與整合矩陣（Joint Display）',
        advisorComment: '方法論寫作堪稱混合研究教科書級別，量化與質性銜接點清晰無瑕。',
        sampleExcerpt: '本研究依循 Creswell & Plano Clark (2018) 準則，將第一階段量化離群值（Outliers）作為第二階段質性抽樣之主要依據...'
      }
    ],
    keyTakeaways: [
      '混合研究必須撰寫專門的混合研究問題（Mixed RQ），而非只是量化+質性兩份報告拼湊',
      '採用 Joint Display 表格將數值與質性引文並列對照分析'
    ],
    downloadableTemplateOutline: '1. 緒論 (混合研究必要性 -> 醫學教育問題)\n2. 文獻探討 (沉浸式科技 -> 空間認知與認知負荷)\n3. 混合研究方法 (循序設計流程 -> 量化實驗設計 -> 質性訪談與眼動方案 -> 整合分析架構)\n4. 研究結果 (量化實驗結果 -> 質性主題分析 -> 整合 Joint Display 剖析)\n5. 討論與建議 (認知調適架構 -> 教學設計指南 -> 研究限制)'
  },
  {
    id: 'exemplar-4',
    title: '基於大型語言模型與檢索增強生成（RAG）之智慧法律合約審查系統架構設計與實證評估',
    author: '黃彥博 碩士',
    degree: '碩士論文',
    year: 2024,
    field: '資訊工程 / 人工智慧應用',
    methodologyType: '系統/工程開發',
    awardOrHonor: '產學合作頂尖成果，已申請發明專利並於 IEEE 研討會發表',
    abstract: '針對現行法律合約人工審查耗時且易遺漏高風險條款之問題，本論文設計並實作一套結合領域知識圖譜（Legal Knowledge Graph）與多階段檢索增強生成（RAG）之智慧合約風險診斷系統「LexiGuard」。論文提出以自適應語義分塊（Adaptive Semantic Chunking）與混合重排序（Hybrid Reranking）演算法優化條款檢索精準度，並設計階層式自我反思驗證機制以抑制 LLM 幻覺。經 500 份真實商業採購合約實測，本系統在關鍵風險條款辨識之 F1-score 達 93.4%，審查耗時降低 78.5%。',
    researchQuestions: [
      'RQ1: 如何設計專屬法律條款之階層式分塊與向量檢索機制，以克服長文本上下文遺忘？',
      'RQ2: 結合知識圖譜與自我反思機制能否有效將法規引用之幻覺率降至 2% 以下？'
    ],
    frameworkSummary: '系統架構設計 (資料前處理 -> 向量檢索+知識圖譜 -> LLM 推理引擎 -> 驗證反思層 -> 前端互動介面) -> 實驗評估 (基準模型對比, 消融實驗, 真實律師盲測評估)',
    chapters: [
      {
        chapterTitle: '系統架構與演算法設計',
        highlight: '系統模組圖與演算法偽代碼（Pseudocode）極其規範',
        advisorComment: '工程類論文的典範：從問題定義、模組職責、數據流向圖到評估指標定義一應俱全。',
        sampleExcerpt: '系統架構如圖 3-2 所示，包含條款結構化解析器、混合向量檢索器與反思校驗器三大子系統...'
      },
      {
        chapterTitle: '實驗結果與消融實驗（Ablation Study）',
        highlight: '嚴謹的消融實驗證實各模組之獨立貢獻',
        advisorComment: '不僅跟 Baseline 比，還把 Knowledge Graph 與 Reranker 分別拿掉測試，徹底證明演算法設計之有效性。',
        sampleExcerpt: '如表 4-4 消融實驗所示，移除知識圖譜檢索模組後，合約交叉引用條款之辨識精確率自 94.2% 顯著滑落至 81.6% (p < .01)...'
      }
    ],
    keyTakeaways: [
      '工程與系統開發論文必須包含清晰的系統架構圖與數據流圖',
      '實驗章節除了與既有 Baseline 對比外，強烈建議設計消融實驗（Ablation Study）證明各設計模組之貢獻'
    ],
    downloadableTemplateOutline: '1. 緒論 (產業痛點 -> 技術挑戰 -> 核心貢獻)\n2. 相關技術與文獻 (LLM、RAG、法律文本分析技術)\n3. 系統架構與演算法設計 (總體架構 -> 資料流程 -> 核心演算法 -> 介面設計)\n4. 系統實作與實驗評估 (實驗設定 -> 性能評估 -> 消融實驗 -> 專家使用者評估)\n5. 結論與展望 (成果總結 -> 技術限制 -> 未來演進方向)'
  }
];

export const DEFAULT_FORMAT_SPECS: FormatSpec[] = [
  {
    id: 'apa7',
    standardName: 'APA 7th Edition (社會科學/管理/教育領域)',
    description: '美國心理學會第七版格式，廣泛應用於心理、教育、商管、傳播與社會科學領域。',
    fontRules: {
      zh: '標楷體 或 微軟正黑體 (12 pt)',
      en: 'Times New Roman (12 pt) 或 Calibri (11 pt)',
      titleSize: '章標題 18-20 pt 粗體置中；節標題 14-16 pt 粗體靠左',
      bodySize: '12 pt 正體',
      lineHeight: '固定行高 1.5 倍行距 或 雙倍行距 (Double space)'
    },
    margins: '上 2.54 cm (1 inch)、下 2.54 cm、左 3.0 cm (裝訂邊可 3.5 cm)、右 2.54 cm',
    figureTableRules: {
      tableTitlePosition: '表格標題置於表格「上方」，靠左對齊，表號粗體，表名斜體（中文可正體）。表格為三線表。',
      figureTitlePosition: '圖片標題置於圖片「上方」（APA 7th 新規），靠左對齊，圖號粗體，圖名斜體。',
      noteFormat: '附註置於圖表「下方」，靠左對齊，字體 10 pt。'
    },
    citationRules: {
      inTextChinese: '一位作者：(林雅婷，2023) 或 林雅婷 (2023)；兩位作者：(張偉哲、李明華，2024)；三位以上：(陳俊宏等人，2023)。',
      inTextEnglish: 'One author: (Smith, 2020); Two authors: (Smith & Jones, 2021); Three or more: (Smith et al., 2022).',
      multipleAuthors: '文末參考文獻最多可列出 20 位作者姓名。'
    },
    referenceTemplates: [
      {
        type: '中文期刊論文 (Journal Article)',
        template: '作者（出版年份）。論文篇名。*期刊名稱*，*卷數*（期數），起訖頁碼。https://doi.org/xxxx',
        sample: '林雅婷、張偉哲（2024）。生成式AI協作下之科技焦慮與創新工作行為。*資訊管理學報*，*31*（2），145-178。https://doi.org/10.6283/JIMS.202406_31(2).0003'
      },
      {
        type: '英文期刊論文 (English Journal Article)',
        template: 'Author, A. A., & Author, B. B. (Year). Title of article. *Title of Periodical*, *Volume*(Issue), Pages. https://doi.org/xxxx',
        sample: 'Venkatesh, V., Thong, J. Y., & Xu, X. (2012). Consumer acceptance and use of information technology: Extending the unified theory of acceptance and use of technology. *MIS Quarterly*, *36*(1), 157-178. https://doi.org/10.2307/41410412'
      },
      {
        type: '學位論文 (Dissertation/Thesis)',
        template: '作者（年份）。*論文名稱*〔未出版之碩/博士論文〕。學校名稱研究所名稱。',
        sample: '陳俊宏（2023）。*傳統中小企業之數位動態能力演化：多個案比較研究*〔未出版之碩士論文〕。國立臺灣大學科技管理研究所。'
      }
    ]
  },
  {
    id: 'ieee',
    standardName: 'IEEE 格式 (電機/資訊/工程領域)',
    description: '國際電機電子工程師學會格式，廣泛應用於資工、電機、通訊、生醫工程與理工科技學位論文。',
    fontRules: {
      zh: '標楷體 或 微軟正黑體 (12 pt)',
      en: 'Times New Roman (10-12 pt)',
      titleSize: '章標題 16 pt 大寫置中；小節標題 12 pt 斜體靠左',
      bodySize: '12 pt (學位論文單欄 1.5 倍行距；研討會採雙欄 10 pt)',
      lineHeight: '固定行高 1.5 倍行距'
    },
    margins: '上下左右各 2.54 cm，左側裝訂邊留 3.0 cm',
    figureTableRules: {
      tableTitlePosition: 'TABLE I (大寫置中於上方)，下一行接表格名稱 (小寫置中)。',
      figureTitlePosition: 'Fig. 1. (置於圖片「下方」置中)，後接圖片說明文字。',
      noteFormat: '附註置於表格下方或圖說內。'
    },
    citationRules: {
      inTextChinese: '採用數字方括號引用，例如：依據文獻 [1] 之研究... 或 許多研究指出 [2], [4]-[6]...',
      inTextEnglish: 'Sequential numbering in square brackets: as shown by [1] or several studies [2], [4]–[7]...',
      multipleAuthors: '在內文中若提及作者名字，三位以上寫為 Smith et al. [3]。'
    },
    referenceTemplates: [
      {
        type: '期刊論文 (Journal Article)',
        template: '[編號] J. K. Author, "Name of paper," *Abbrev. Title of Periodical*, vol. x, no. x, pp. xxx-xxx, Month, Year, doi: xxxx.',
        sample: '[1] Y. B. Huang and W. C. Lin, "Legal contract risk diagnosis using multi-stage retrieval-augmented generation," *IEEE Trans. Knowl. Data Eng.*, vol. 36, no. 4, pp. 1820-1833, Apr. 2024, doi: 10.1109/TKDE.2024.1234567.'
      },
      {
        type: '會議論文 (Conference Proceedings)',
        template: '[編號] J. K. Author, "Title of paper," in *Abbrev. Title of Conf.*, City of Conf., Abbrev. State (if given), Year, pp. xxx-xxx.',
        sample: '[2] J. Smith and R. Doe, "Real-time anomaly detection in smart manufacturing," in *Proc. IEEE Int. Conf. Robot. Autom. (ICRA)*, London, UK, 2023, pp. 450-456.'
      }
    ]
  }
];

export const DEFAULT_DEFENSE_QUESTIONS: DefenseQuestion[] = [
  {
    id: 'def-1',
    category: 'motivation',
    categoryLabel: '研究動機與價值',
    question: '這個研究題目過去已經有很多人做過了，你的研究跟前人相比，最本質的「創新點（Novelty）」到底在哪裡？',
    committeeIntent: '口試委員想檢驗學生是否清楚自己的研究邊界與增量貢獻（Incremental Contribution），避免學生只是炒冷飯做無意義的重複。',
    responseStrategy: '三步答辯法：\n1. 肯定前人成果：感謝委員提問，確實前人在 [構念A與B] 上已有豐富奠基。\n2. 點出前人未解情境：然而，前人多聚焦於 [情境X]，在 [新興情境Y / 某中介機制] 上尚未有深入探討。\n3. 具體指出本論文貢獻：本研究正是補足了這塊空白，實證發現了...。',
    trapToAvoid: '切忌批評前人研究很爛很粗糙，也不要含糊說「因為時間點不同所以不一樣」。'
  },
  {
    id: 'def-2',
    category: 'methodology',
    categoryLabel: '研究方法與抽樣',
    question: '你的問卷只回收了 300 份，而且採用便利抽樣/網路發放，你如何證明你的研究結論具有代表性（Generalizability）？',
    committeeIntent: '檢驗研究的外部效度（External Validity）與抽樣偏差控制措施。',
    responseStrategy: '應對策略：\n1. 說明母體特徵匹配度：我們在正式施測前進行了嚴格的受試者篩選條件（Filter Questions），並檢驗樣本之人口統計分佈與官方產業母體分佈無顯著差異（卡方適配度檢定 p > .05）。\n2. 強調內部效度優先：在理論驗證型研究中，優先確保內部因果關係之純淨度。\n3. 誠實歸入限制：並在第五章明確指出該情境限制，建議後續研究跨領域驗證。',
    trapToAvoid: '切忌硬拗「我的樣本涵蓋全台灣各行各業所以一定準確」，這會暴露對抽樣統計的不懂。'
  },
  {
    id: 'def-3',
    category: 'literature',
    categoryLabel: '理論基礎與假說',
    question: '你用了理論A來解釋假說H1，又用了理論B來解釋假說H2，這兩個理論的底層假設不會互相衝突嗎？為什麼不統一用一個理論？',
    committeeIntent: '檢驗理論整合的合理性（Theoretical Integration），看學生是否只是隨意湊拼名詞。',
    responseStrategy: '應對策略：\n1. 闡明理論互補性：說明理論A專注於微觀心理認知層次，理論B專注於組織情境要求層次，兩者在邏輯上為「要求-資源（JD-R）」之互補架構。\n2. 引用權威文獻：列出國際頂級期刊近期整合此二理論之先例（如 Smith, 2022），加強論點支撐。',
    trapToAvoid: '回答「因為老師叫我用這兩個」或「因為找不到別的理論」。'
  },
  {
    id: 'def-4',
    category: 'contribution',
    categoryLabel: '實務與應用意涵',
    question: '如果今天一家企業按照你第五章的建議去做，真的能看到產能或績效提升嗎？你的建議有沒有考慮過執行成本？',
    committeeIntent: '檢驗研究的落地價值與學生對產業實務運作的成熟度。',
    responseStrategy: '應對策略：\n1. 分階段實施建議：說明本研究建議採取「三階段漸進式導入」，初期以低成本之流程優化為主。\n2. 結合具體數據：強調本研究數據顯示 [變數X] 對績效的標準化效果值高達 .42，代表投資此維度的邊際效益最高。',
    trapToAvoid: '給出不切實際的保證（如「保證績效翻倍」）或完全答不出來。'
  },
  {
    id: 'def-5',
    category: 'limitation',
    categoryLabel: '研究限制與因果推論',
    question: '你的研究採用橫斷面問卷調查，如何證明自變數與依變數之間具有真正的因果關係，而不是逆向因果（Reverse Causality）？',
    committeeIntent: '考驗對因果推論三大條件（時間順序、相關性、排除替代解釋）的理解深度。',
    responseStrategy: '應對策略：\n1. 理論邏輯先驗性：從理論機制論述自變數具有時間與邏輯上的先驗發生順序。\n2. 統計控制措施：在模型中放入控制變數，並檢驗競爭模型（Competing Models）。\n3. 誠實歸納限制：承認橫斷面限制，並在未來研究建議採用時間序列追蹤或實驗法。',
    trapToAvoid: '宣稱「問卷統計做出來 p < .001 所以絕對是因果關係」。'
  }
];
