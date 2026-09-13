import { ThesisStep } from '../types';

export const PHASE_1_STEPS: ThesisStep[] = [
  {
    id: 'p1-1',
    phase: 1,
    stepNumber: 1,
    globalIndex: 1,
    title: '閱讀文獻找題目',
    category: 'topic',
    categoryLabel: '題目探索',
    importantReminders: ['大量研讀期刊', '尋找研究缺口 (Research Gap)'],
    description: '從國內外關鍵文獻中梳理學術脈絡，鎖定具有實務價值與學術原創性的研究問題，並與崔老師討論聚焦。',
    recommendedDuration: '約 1~2 個月',
    actionItems: [
      '檢索近 3~5 年國內外權威期刊論文',
      '撰寫文獻筆記矩陣 (研究方法、樣本、變項關係、限制)',
      '彙整 2~3 個候選研究主題構想與崔老師進行初擬討論'
    ]
  },
  {
    id: 'p1-2',
    phase: 1,
    stepNumber: 2,
    globalIndex: 2,
    title: '題目確定送審查',
    category: 'review',
    categoryLabel: '題目審查',
    importantReminders: ['指導教授核可簽名', '依所辦時程提交題目審查申請表'],
    description: '確定具體研究題目與研究架構雛形，填寫系所論文題目指導教授同意書與論文題目申請表，送交所辦公室審查備查。',
    recommendedDuration: '約 1 週',
    actionItems: [
      '定稿中英文論文題目（字句精確、符合學術規範）',
      '請崔老師簽署題目指導同意書',
      '提交所辦審查表單並確認行政收件完成'
    ]
  },
  {
    id: 'p1-3',
    phase: 1,
    stepNumber: 3,
    globalIndex: 3,
    title: '完成論文1和3章',
    category: 'writing',
    categoryLabel: '核心章節撰寫',
    importantReminders: ['第1章：研究動機與目的', '第3章：研究方法與設計'],
    description: '優先完成第一章（緒論：研究背景、動機、研究目的與待答問題）及第三章（研究方法：架構、假設、對象、工具、分析方法），確立論文骨幹。',
    recommendedDuration: '約 1.5~2 個月',
    actionItems: [
      '第一章：精煉動機、提出具說服力的研究問題 (Research Questions)',
      '第三章：明確繪製研究架構圖，詳細定義變項之操作型定義',
      '整理初步問卷題項或實驗流程設計供崔老師審核'
    ]
  },
  {
    id: 'p1-4',
    phase: 1,
    stepNumber: 4,
    globalIndex: 4,
    title: '完成1-3章準備計畫口試',
    category: 'writing',
    categoryLabel: '初稿整合',
    importantReminders: ['補齊第2章文獻探討', '格式排版符合APA 7th', '審閱定稿'],
    description: '整合第二章完整文獻探討與理論假說推導，完成第一至三章論文計畫初稿（Proposal Draft），送請崔老師進行總體審閱修訂。',
    recommendedDuration: '約 3~4 週',
    actionItems: [
      '補齊第二章文獻探討：理論基礎、構念脈絡、假說推導邏輯',
      '完整檢查內文引註與文獻清單（APA 7th 一致性）',
      '取得崔老師同意舉行計畫口試之許可'
    ]
  },
  {
    id: 'p1-5',
    phase: 1,
    stepNumber: 5,
    globalIndex: 5,
    title: '聯絡口試委員時間',
    category: 'oral',
    categoryLabel: '口試籌劃',
    importantReminders: ['確認所外及所內委員名單', '協調大家共同可行時段'],
    description: '依崔老師建議之口試委員名單（含校外與校內委員），主動以禮貌之書信/電話詢問口試意願，並調查可配合出席之日期與時段區間。',
    recommendedDuration: '約 1~2 週',
    actionItems: [
      '擬定合適的口試委員邀請信件草稿（向崔老師核可後寄發）',
      '調查委員方便的時間（建議提供多個具體半天時段供選擇）',
      '確認全體委員共同可行之口試日期與時間'
    ]
  },
  {
    id: 'p1-6',
    phase: 1,
    stepNumber: 6,
    globalIndex: 6,
    title: '口試三周前 (送所辦申請)',
    category: 'admin',
    categoryLabel: '行政申請',
    importantReminders: ['⚠️ 口試三周前法定截止', '送所辦申請學位計畫口試手續'],
    description: '務必在預定口試日「整整三週以前」，備齊口試申請書、指導教授推薦函及計畫初稿，至所辦公室完成正式行政登錄手續。',
    recommendedDuration: '口試日前 21 天',
    actionItems: [
      '填寫所辦「學位論文計畫口試申請表」',
      '檢附崔老師簽章推薦函與論文計畫初稿',
      '確認所辦完成收件並核發口試相關公文備查'
    ]
  },
  {
    id: 'p1-7',
    phase: 1,
    stepNumber: 7,
    globalIndex: 7,
    title: '登記教室 再次聯絡口試委員, 確認時間地點 以及口試當日的餐飲、交通',
    category: 'oral',
    categoryLabel: '場地與後勤',
    importantReminders: ['登記研討室/投影設備', '確認當日交通方式與停車', '備妥茶點/午餐飲品'],
    description: '借妥所內研討教室並確認投影設備與簡報筆，再次聯絡每位委員確認精準時間與交通方式（是否開車、搭高鐵），妥善安排口試當日餐飲點心。',
    recommendedDuration: '口試日前 14~18 天',
    actionItems: [
      '向系所辦公室或場地管理系統正式登記借用口試教室',
      '確認每位委員當天交通方式（開車需申請校園通行、高鐵是否需接駁）',
      '規劃委員茶水點心、水果盒或便當餐飲預定'
    ]
  },
  {
    id: 'p1-8',
    phase: 1,
    stepNumber: 8,
    globalIndex: 8,
    title: '口試兩周前寄送論文計畫給口試委員(敬請書)，所辦處理相關事項(申請停車證)',
    category: 'oral',
    categoryLabel: '寄送本與公文',
    importantReminders: ['⚠️ 附敬請書(邀請函)', '送達紙本/電子論文計畫', '至所辦申請校外委員停車證'],
    description: '嚴格遵守學術禮儀，於口試整整兩週前將論文計畫裝訂本，連同正式敬請書專函送達口試委員手中；同時至所辦領取校外委員停車證。',
    recommendedDuration: '口試日前 14 天',
    actionItems: [
      '印製裝訂精美論文計畫書）',
      '撰寫敬請書（註明口試日期、時間、教室、委員名單）',
      '向所辦公室申請校外委員校園停車證'
    ]
  },
  {
    id: 'p1-9',
    phase: 1,
    stepNumber: 9,
    globalIndex: 9,
    title: '口試前兩日提醒口試委員時間地點(留下你的手機號碼)',
    category: 'oral',
    categoryLabel: '前哨提醒',
    importantReminders: ['⚠️ 留下你的手機號碼與聯絡方式', '附上教室位置、停車指引'],
    description: '於口試前兩天寄發溫馨提醒 Email，再次載明時間、大樓棟別、教室房號、校園地圖及當日指引，並務必留下學生本人手機號碼以便即時聯繫。',
    recommendedDuration: '口試日前 2 天',
    actionItems: [
      '發送提醒郵件與簡訊：「老師您好，提醒您後天○月○日○時為論文計畫口試...」',
      '清楚附上您的手機號碼：「如有任何突發交通狀況，請隨時致電學生手機 09XX-XXX-XXX」',
      '確認口試當天評分表、紀錄表、收據簽收單已向所辦領妥'
    ]
  },
  {
    id: 'p1-10',
    phase: 1,
    stepNumber: 10,
    globalIndex: 10,
    title: '論文計畫口試',
    category: 'oral',
    categoryLabel: '實戰口試',
    importantReminders: ['提前 40 分鐘場佈測試投影設備', '20分鐘精準簡報', '逐字/詳細記錄委員意見'],
    description: '正式舉行計畫口試。提前開門開空調、測試投影機與麥克風，精準掌握簡報節奏，針對委員建議虛心聆聽並詳實記錄每一條修改方向。',
    recommendedDuration: '當天（約 1.5~2 小時）',
    actionItems: [
      '提早 40 分鐘抵達教室佈置、擺放桌牌、水杯、評審表與簽收單據',
      '進行 15~20 分鐘簡報',
      '請同學或本人詳細筆記委員所有指正與修改要求'
    ]
  },
  {
    id: 'p1-11',
    phase: 1,
    stepNumber: 11,
    globalIndex: 11,
    title: '論文計畫計畫修正',
    category: 'revision',
    categoryLabel: '審查後修正',
    importantReminders: ['製作計畫口試意見修正對照表'],
    description: '口試結束後，條列委員所有修改意見，修改內容，請崔老師審閱。',
    recommendedDuration: '口試後 1~2 週',
    actionItems: [
      '整理口試意見逐條對照清單（委員意見 vs. 修正說明及頁碼）',
      '依據意見修訂第1~3章內容，呈請崔老師複審確認',
      '完成所辦計畫口試成績及修正意見核備程序'
    ]
  }
];

export const PHASE_2_STEPS: ThesisStep[] = [
  {
    id: 'p2-1',
    phase: 2,
    stepNumber: 1,
    globalIndex: 12,
    title: '開始蒐集資料(須先進行同意書)',
    category: 'data',
    categoryLabel: '倫理與蒐集',
    importantReminders: ['⚠️ 須先進行受試者/研究倫理同意書', '落實學術倫理規範'],
    description: '進入第二階段首要之務：在正式發放問卷、進行深度訪談或教學實驗前，務必備妥並簽署受試者知情同意書（IRB/研究倫理審查），確保資料合法合規。',
    recommendedDuration: '約 1~2 個月',
    actionItems: [
      '確認受試者知情同意書格式（說明研究目的、匿名性、資料保存與退出權益）',
      '依抽樣設計發放問卷或排定質性訪談日程',
      '進行問卷預試（Pre-test）信效度檢定或訪談大綱前導測試'
    ]
  },
  {
    id: 'p2-2',
    phase: 2,
    stepNumber: 2,
    globalIndex: 13,
    title: '分析資料',
    category: 'data',
    categoryLabel: '實證分析',
    importantReminders: ['數據清洗與極端值剔除', '嚴謹統計檢定/編碼分析'],
    description: '進行量化統計分析（描述性統計、因素分析、信度、迴歸）或質性文本逐字稿主題編碼分析，產出核心統計圖表。',
    recommendedDuration: '約 3~4 週',
    actionItems: [
      '資料編碼、除錯、反向題轉換與極端值檢驗',
      '執行假說檢定（t檢定、ANOVA、結構方程模型或質性三角交叉檢驗）',
      '繪製標準 APA 圖表）'
    ]
  },
  {
    id: 'p2-3',
    phase: 2,
    stepNumber: 3,
    globalIndex: 14,
    title: '投稿小論文',
    category: 'publication',
    categoryLabel: '小論文發表',
    importantReminders: ['符合系所畢業發表門檻', '崔老師為第二作者'],
    description: '依系所修業規章要求，將階段性研究成果濃縮改寫為研討會論文或期刊小論文，經崔老師指導潤飾後正式投稿發表，滿足畢業發表指標。',
    recommendedDuration: '約 3~4 週',
    actionItems: [
      '將核心研究發現濃縮為 6~10 頁研討會格式或期刊精簡論文',
      '經崔老師確認作者排序與內容後進行線上投稿',
      '追蹤審查進度並取得正式接受函 (Acceptance Letter)'
    ]
  },
  {
    id: 'p2-4',
    phase: 2,
    stepNumber: 4,
    globalIndex: 15,
    title: '完成第4-5章',
    category: 'writing',
    categoryLabel: '分析與討論',
    importantReminders: ['第4章：研究結果與發現', '第5章：結論與討論/建議'],
    description: '撰寫第四章（研究結果：客觀陳述統計與實證數據）與第五章（討論與建議：理論意涵、實務貢獻、研究限制與未來研究建議）。',
    recommendedDuration: '約 1~1.5 個月',
    actionItems: [
      '第四章：客觀、條理分明地呈現數據，避免主觀臆測推論',
      '第五章：對照第二章文獻',
      '撰寫建議與後續研究者的具體方向'
    ]
  },
  {
    id: 'p2-5',
    phase: 2,
    stepNumber: 5,
    globalIndex: 16,
    title: '完成1-5章',
    category: 'writing',
    categoryLabel: '全書初稿定稿',
    importantReminders: ['中英文摘要定稿', '全書格式排版統一', '崔老師全書審閱'],
    description: '整合第1章至第5章所有內容，補齊中英文摘要、參考文獻、附錄問卷與訪談大綱，完成整本學位論文初稿，由崔老師進行全面把關指導。',
    recommendedDuration: '約 2~3 週',
    actionItems: [
      '撰寫中英文摘要（背景、目的、方法、發現、貢獻）',
      '統一全書字型（中文標楷體、英文Times New Roman）與行距',
      '提交完整裝訂初稿請崔老師全面審閱批改'
    ]
  },
  {
    id: 'p2-6',
    phase: 2,
    stepNumber: 6,
    globalIndex: 17,
    title: '小論文送所辦審查',
    category: 'admin',
    categoryLabel: '畢業資格核可',
    importantReminders: ['附小論文全文及接受函/發表證明', '所辦畢業門檻初審'],
    description: '檢附已發表的學術小論文抽印本/全文，以及主辦單位開立之接受證明，送交所辦公室進行畢業門檻發表資格審查，取得正式口試資格。',
    recommendedDuration: '約 1 週',
    actionItems: [
      '填妥所辦「研究生學術論文發表點數/資格審查表」',
      '檢附小論文全文、議程表或刊登證明',
      '確認系所所務審查核准通過'
    ]
  },
  {
    id: 'p2-7',
    phase: 2,
    stepNumber: 7,
    globalIndex: 18,
    title: '聯絡口試委員口試時間',
    category: 'oral',
    categoryLabel: '學位口試協調',
    importantReminders: ['正式學位口試委員名單', '協調每位委員最佳時段'],
    description: '向崔老師確認正式學位口試委員名單（通常為3位或5位，含校外委員比例規定），再次逐一向委員接洽協調口試日期與時段。',
    recommendedDuration: '約 1~2 週',
    actionItems: [
      '確認符合校外委員人數與資格',
      '發信/電話禮貌接洽各位委員，匯總彼此都能出席的時間區間',
      '向崔老師回報並敲定最終學位口試日期'
    ]
  },
  {
    id: 'p2-8',
    phase: 2,
    stepNumber: 8,
    globalIndex: 19,
    title: '論文比對',
    category: 'review',
    categoryLabel: '原創性比對',
    importantReminders: ['Turnitin 比對系統', '相似度指數須低於系所標準 (如 < 15%~20%)'],
    description: '上傳論文至學校官方論文原創性比對系統（如 Turnitin），排除引言與參考文獻後產出比對報告，確保相似度符合系所嚴格標準並請崔老師簽章。',
    recommendedDuration: '約 2~3 天',
    actionItems: [
      '依學校規範設定比對參數（排除引述、參考文獻、小於字數等）',
      '下載完整論文原創性檢核報告 (Originality Report)',
      '相似度指數過高部分務必進行學術重寫與引註補全，呈請崔老師簽核'
    ]
  },
  {
    id: 'p2-9',
    phase: 2,
    stepNumber: 9,
    globalIndex: 20,
    title: '口試三周前 (送所辦申請)',
    category: 'admin',
    categoryLabel: '正式口試行政',
    importantReminders: ['⚠️ 學位口試三周前送件', '附論文初稿、比對報告、發表證明'],
    description: '嚴格在口試整整三週前，將學位考試申請書、指導教授推薦函、論文比對檢核單、歷年成績單與論文初稿提交所辦，完成正式校級考試核備。',
    recommendedDuration: '口試日前 21 天',
    actionItems: [
      '至校務行政系統填寫學位口試登錄，列印申請表由崔老師簽名',
      '檢附論文比對合格證明、小論文發表核准單及成績單',
      '送所辦審查並送教務處核發正式委員聘函與口試費清冊'
    ]
  },
  {
    id: 'p2-10',
    phase: 2,
    stepNumber: 10,
    globalIndex: 21,
    title: '登記教室 再次聯絡口試委員, 確認時間地點 以及口試當日的餐飲、交通',
    category: 'oral',
    categoryLabel: '場地與後勤確認',
    importantReminders: ['借用正式學位考試教室', '確認委員交通接送與車號', '訂購口試點心餐盒'],
    description: '登記借用教室或研討室，向口試委員確認當天行程細節（是否自行開車、車號多少以利進出）、安排餐盒水果與飲品。',
    recommendedDuration: '口試日前 14~18 天',
    actionItems: [
      '借用口試教室',
      '向委員確認抵達方式與大約時間，提供校園平面圖及大樓出入口指引',
      '預約口試當日茶水與偏好餐飲'
    ]
  },
  {
    id: 'p2-11',
    phase: 2,
    stepNumber: 22,
    globalIndex: 22,
    title: '口試兩周前寄送論文計畫給口試委員(敬請書)，所辦處理相關事項(申請停車證)',
    category: 'oral',
    categoryLabel: '學位本送達',
    importantReminders: ['⚠️ 附正式敬請書(邀請函)', '送達學位論文初稿', '申請校外委員停車證'],
    description: '於口試整整兩週以前，將完整的學位論文印製本，連同誠摯的口試敬請書送至每位委員手邊，並自所辦領妥校外委員停車證以妥善寄發或保管。',
    recommendedDuration: '口試日前 14 天',
    actionItems: [
      '印刷膠裝學位論文審查本，核對每位委員的寄送地址或專人親送',
      '附上敬請書，寫明口試時間教室',
      '向所辦領取校園停車證'
    ]
  },
  {
    id: 'p2-12',
    phase: 2,
    stepNumber: 23,
    globalIndex: 23,
    title: '口試前兩日提醒口試委員時間地點(留下你的手機號碼)',
    category: 'oral',
    categoryLabel: '關鍵最後提醒',
    importantReminders: ['⚠️ 附上學生本人手機號碼', '再次確認教室房號、停車與當日流程'],
    description: '口試前兩天以電子郵件與手機短訊向委員送出最終提醒，附上校門通行須知、教室房號與路線指引，並明確註明學生即時聯絡電話。',
    recommendedDuration: '口試日前 2 天',
    actionItems: [
      '發出簡明周到之最終提醒：「各位委員老師好，再次提醒後天○點舉行學位口試...」',
      '載明學生本人行動電話：「學生手機 09XX-XXX-XXX，抵達校園若需指引請隨時致電」',
      '領取正式口試評分卷、學位考試總評表、審定書 (口試通過簽名單)、口試指導費領據'
    ]
  },
  {
    id: 'p2-13',
    phase: 2,
    stepNumber: 24,
    globalIndex: 24,
    title: '論文口試',
    category: 'oral',
    categoryLabel: '學位口試實戰',
    importantReminders: ['提前 40 分鐘場地備戰', '沉著自信簡報 20~25 分鐘', '口試審定書簽名保管'],
    description: '正式學位論文答辯！',
    recommendedDuration: '當天（約 1.5~2.5 小時）',
    actionItems: [
      '提早抵達開啟教室，擺放口試審定書、個別評分單、評審費簽收單與茶水點心',
      '依序進行論文成果簡報',
      '詳細記錄全體委員所提修改要求，妥善收回委員親筆簽名之「論文審定書」'
    ]
  },
  {
    id: 'p2-14',
    phase: 2,
    stepNumber: 25,
    globalIndex: 25,
    title: '論文修正',
    category: 'revision',
    categoryLabel: '修訂對照表',
    importantReminders: ['條列完整委員意見修改對照表', '逐條修改全書內文', '崔老師逐項審閱'],
    description: '根據口試現場所有委員之寶貴意見，撰寫詳實之「口試意見修改對照表」。',
    recommendedDuration: '口試後 2~4 週',
    actionItems: [
      '將每位委員之所有建議整理為詳細的「口試建議與修正對照清單」',
      '修訂文字、數據表格、格式排版與英文摘要',
      '向崔老師報告修正成果並取得最終版審閱簽核許可'
    ]
  },
  {
    id: 'p2-15',
    phase: 2,
    stepNumber: 26,
    globalIndex: 26,
    title: '論文再次比對',
    category: 'review',
    categoryLabel: '最終原創性查核',
    importantReminders: ['修正後完整全文重新送比對', '下載最終合格報告由崔老師簽署'],
    description: '將全面修正後之論文最終定稿全文，再次上傳至論文比對系統確認相似度指數符合標準，列印出最終原創性報告請崔老師正式簽署完成。',
    recommendedDuration: '約 2~3 天',
    actionItems: [
      '上傳最終修訂定稿進行 Turnitin 原創性比對',
      '確認總相似度與各段落引註皆完全合規',
      '列印出最終版比對報告封面，由崔老師簽名核准'
    ]
  },
  {
    id: 'p2-16',
    phase: 2,
    stepNumber: 27,
    globalIndex: 27,
    title: '恭喜畢業',
    category: 'graduation',
    categoryLabel: '離校與授學位',
    importantReminders: ['國家圖書館與學校圖書館論文建檔上傳', '精裝本/平裝本送印', '辦理離校手續領取畢業證書'],
    description: '恭喜您圓滿完成學業！將論文電子全文上傳至國家圖書館博碩士論文知識加值系統與校內圖書館，完成印製裝訂繳交，順利領取碩博士學位證書！',
    recommendedDuration: '畢業離校期間',
    actionItems: [
      '至博碩士論文系統建檔並上傳 PDF 電子全文，取得圖書館審核通過授權書',
      '印製論文精裝本與平裝本（依所辦與圖書館繳交冊數印製，內含審定書正本）',
      '完成各關卡離校手續簽章，至教務處註冊組領取碩博士學位證書，邁向璀璨前程！'
    ]
  }
];

export const ALL_THESIS_STEPS = [...PHASE_1_STEPS, ...PHASE_2_STEPS];

/**
 * 依據崔老師論文進度控管指導規範：
 * 若登錄在步驟數字較大的地方，前面所有步驟就當作全數完成。
 * 例如：登錄在第 4 步，則第 1 至 3 步就當作都已完成。
 */
export function ensurePrecedingStepsCompleted(completedStepIds: string[] = [], currentStepNumber?: number): string[] {
  let maxGlobalIndex = currentStepNumber || 0;

  for (const stepId of completedStepIds) {
    const found = ALL_THESIS_STEPS.find(s => s.id === stepId);
    if (found && found.globalIndex > maxGlobalIndex) {
      maxGlobalIndex = found.globalIndex;
    }
  }

  if (maxGlobalIndex <= 0) {
    return completedStepIds;
  }

  // 取得 1 至 maxGlobalIndex 的所有步驟 ID
  const allIdsUpToMax = ALL_THESIS_STEPS
    .filter(s => s.globalIndex <= maxGlobalIndex)
    .map(s => s.id);

  // 去重並依數線順序排列
  const idSet = new Set([...allIdsUpToMax, ...completedStepIds]);
  return ALL_THESIS_STEPS.filter(s => idSet.has(s.id)).map(s => s.id);
}
