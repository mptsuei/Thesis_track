import React, { useState } from 'react';
import { 
  BookOpen, 
  AlertCircle, 
  Clock, 
  FileText, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Copy, 
  Check, 
  Heart, 
  Sparkles, 
  Car, 
  Navigation, 
  Phone, 
  Coffee, 
  Download,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  BookmarkCheck
} from 'lucide-react';

interface Props {
  onGoToNumberLine?: () => void;
}

export const GraduateStudentMustRead: React.FC<Props> = ({ onGoToNumberLine }) => {
  const [activeSubTab, setActiveSubTab] = useState<'advisor_guide' | 'senior_experience' | 'faq_guidelines' | 'invitation_letters' | 'ppt_templates'>('advisor_guide');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const letter1 = `XXX 教授您好：
    冒昧打擾，我是國立臺北教育大學 課程與教學傳播科技研究所 教育傳播與科技碩士班X年級學生XXX，我的論文指導教授是崔夢萍教授。
 經由指導教授推薦，想誠摯的敬邀老師擔任我的論文計畫口試委員。

我的論文題目如下：
【請填寫您的論文題目】

論文摘要如下：(不高過5行，不寫摘要也可以) 
【請填寫5行以內論文摘要】

誠摯地懇請您擔任我的論文計畫口試委員給予指導。
若蒙教授同意擔任我的口試委員，麻煩請教授在以下您方便前來口試的時間打V：

口試可行時間調查：
[  ] 上午 10:00 - 12:00
[  ] 下午 13:30 - 15:30
[  ] 下午 15:30 - 17:30
[  ] 其他可行時間：(         ) 年 月 日 時間

感謝您撥冗閱讀，靜候您的回覆，謝謝老師。
敬頌 教安

學生 XXX 敬上
聯絡電話：
E-mail：`;

  const letter2 = `崔教授您好： 
 
    我是國立臺北教育大學課程與教學傳播科技研究所學生─郭OO同學，目前在本所OOO教授的指導下撰寫博士論文，論文的題目為 “XXXXX”。素仰您在研究有極深之造詣與學養，非常希望能邀請您擔任我的論文計畫口試委員，不知教授您能否願意蒞校撥冗指導。  
 
若您方便擔任口試委員，論文計畫發表的時間預計會從明年的1/9(一)~1/13(五)當中挑選一日，以下為時間調查表，想麻煩您在方便的時間打勾，在我彙整五位委員的可行時間後，再通知您最後的確切時間及口試地點。 
 
期待您的回信 
                                                                         OOO研究所 博士生 XXX 敬上 
 
可以出席的時間請打✓ 
[ ] 1/9(一) 上午 10:00-12:00      [ ] 1/9(一) 下午 13:30-17:30
[ ] 1/10(二) 上午 10:00-12:00     [ ] 1/10(二) 下午 13:30-17:30
[ ] 1/11(三) 上午 10:00-12:00     [ ] 1/11(三) 下午 13:30-17:30
[ ] 1/12(四) 上午 10:00-12:00     [ ] 1/12(四) 下午 13:30-17:30
[ ] 1/13(五) 上午 10:00-12:00     [ ] 1/13(五) 下午 13:30-17:30

◎註：如果教授您時間上方便的話，麻煩在「多個」可出席的時間打勾，以利彙整出共同的時間，非常感謝！`;

  const letter3 = `XXX 教授好：

學生 XXX 口試資料如下：

時間：【 年 月 日 (星期 ) 00:00 - 00:00】
地點：國立臺北教育大學
教室：【 樓 教室】

口試委員名單：
XXX 教授  【服務學校與單位職稱】
崔夢萍 教授  國立臺北教育大學 課程與教學傳播科技研究所

題目：【論文題目名稱】

另外還想請問一下：
教授對飲料、餐點上有特別要求或忌諱嗎（葷食、素食，冷熱飲、有無咖啡因等）？

口試當日是否開車來本校？（若開車前來，學生將事先向所辦助教申請免費停車證）

感謝老師撥冗指導！

學生 XXX 敬上
手機電話：【09XX-XXX-XXX】`;

  const letter4 = `崔教授 您好: 
 
非常感謝您能於百忙之中撥空擔任我的博士論文計畫書口試委員，至為感激。以下是關於口試當天的相關事項: 

一、論文題目： 
學生出題教學策略在非數學領域的學業成就表現：系統性文獻回顧與後設分析研究 

二、研究生：XXX
三、指導教授：XXX 教授
四、口試委員： 
(1)國立臺灣科技大學-數位學習與教育研究所：XXX 教授 
(2)國立臺北教育大學-課程與教學傳播科技研究所：XXX 教授 
(3)亞洲大學-XX系：XXX 教授 
(4)致理科技大學-XX系：XXX 教授
五、口試時間：  年  月   日(星期   )時間
六、口試地點：XX大學XX樓X樓 XXX教室
七、紙本論文寄出時間：約在X年X月X日(星期  )前會以限時信件寄至教授服務的系辦或所辦 

八、交通資訊： 
◎方法1：搭高鐵前往本校 
(1)至高鐵台南站→台南火車站 
由高鐵台南站二樓轉乘通廊前往台鐵沙崙站搭乘台鐵區間車，約30分鐘一班車，大約20分鐘可到達台南火車站。再由臺南火車站「後站出口」出發，步行約15分鐘到達本校力行校區XX大樓。 
 
◎方法2：搭台鐵前往本校 
(1)搭乘至台鐵台南站 
由臺南火車站「後站出口」出發，沿大學路步行約5分鐘，左側可看見成大光復校區門口，接續花費10分鐘步行穿越光復校區和小東路，即可到達位於力行校區的XX大樓。 
 
◎方法3：開車前往本校(若教授您選擇開車前來，請事先告訴我，我再聯繫所辦) 
(1)南下: 沿國道一號南下 → 下大灣交流道右轉 → 沿小東路直走即可抵達本校。【自國道三號南下者，轉國道8號（西向），可接國道一號（南向）】 
(2)北上: 沿國道一號北上 → 下仁德交流道左轉 → 沿東門路(西向)往台南市區直走 → 遇林森路或長榮路右轉(北向)，即可抵達本校。【自國道三號北上者，轉86號快速道路（西向），可接國道一號（南向）】 
 
以上若有任何問題，請不吝與我聯繫 

恭請教安 
學生：XX 敬上 
連絡電話：XXXXXX 
E-mail: XXXXXX`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-100/90 via-sky-100/80 to-blue-200/90 rounded-3xl p-6 sm:p-8 text-blue-950 border border-blue-300/80 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 text-blue-900/10 pointer-events-none translate-x-12 -translate-y-6">
          <BookOpen className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-300 text-blue-900 text-xs font-semibold mb-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>國立臺北教育大學 • 課程與教學傳播科技研究所</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-blue-950 mb-2">
            崔老師論文指導研究生必讀
          </h1>
          <p className="text-sm text-blue-900/85 leading-relaxed">
            By Mengping Tsuei 
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-blue-200/80">
          <button
            onClick={() => setActiveSubTab('advisor_guide')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'advisor_guide'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/90 text-blue-900 hover:bg-white hover:text-blue-950 border border-blue-200/90 shadow-2xs'
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeSubTab === 'advisor_guide' ? 'text-white' : 'text-blue-700'}`} />
            <span>崔老師指導規範 (1-23項及注意事項)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('senior_experience')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'senior_experience'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/90 text-blue-900 hover:bg-white hover:text-blue-950 border border-blue-200/90 shadow-2xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeSubTab === 'senior_experience' ? 'text-rose-200' : 'text-rose-600'}`} />
            <span>過來人的辛酸血淚 (Chiaoman Lu)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('faq_guidelines')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'faq_guidelines'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/90 text-blue-900 hover:bg-white hover:text-blue-950 border border-blue-200/90 shadow-2xs'
            }`}
          >
            <FileText className={`w-4 h-4 ${activeSubTab === 'faq_guidelines' ? 'text-white' : 'text-blue-700'}`} />
            <span>論文撰寫常見問題與指引 (2019/11)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('invitation_letters')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'invitation_letters'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/90 text-blue-900 hover:bg-white hover:text-blue-950 border border-blue-200/90 shadow-2xs'
            }`}
          >
            <Mail className={`w-4 h-4 ${activeSubTab === 'invitation_letters' ? 'text-white' : 'text-blue-700'}`} />
            <span>口委邀請信與公文信件範本</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ppt_templates')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2 ${
              activeSubTab === 'ppt_templates'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white/90 text-blue-900 hover:bg-white hover:text-blue-950 border border-blue-200/90 shadow-2xs'
            }`}
          >
            <Download className={`w-4 h-4 ${activeSubTab === 'ppt_templates' ? 'text-white' : 'text-blue-700'}`} />
            <span>口試 PPT 範本 (Google Drive)</span>
          </button>
        </div>
      </div>

      {/* Tab 1: 崔老師指導規範 (1-23項及注意事項) */}
      {activeSubTab === 'advisor_guide' && (
        <div className="space-y-6">
          {/* Core Philosophy */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-2 text-blue-800 font-bold text-base mb-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>一、論文研究的學術歷程核心精神</span>
            </div>
            <p className="text-stone-700 leading-relaxed text-sm bg-stone-50 p-4 rounded-xl border border-stone-200 font-medium">
              論文研究是研究所學術訓練歷程項目之一，除了包含論文寫作與執行之外，尚須包含各項學術研究參與活動，例如同學論文報告分享會議，參與學術研討會議，相關研討會議報告與分享、投稿等階段，同學尚須牢記在心。
            </p>
          </div>

          {/* 1-23 項指導過程必須注意事項 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
                <span className="w-2.5 h-6 bg-blue-700 rounded-full inline-block"></span>
                <span>二、論文計畫指導過程必須注意的事項</span>
              </h2>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                  ⏳ 1-8 項：大約需 3 個月以上
                </span>
                <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-900 border border-sky-200 font-semibold">
                  ⏳ 第 9 項修正：1 個月內完成
                </span>
                <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-900 border border-purple-200 font-semibold">
                  ⏳ 10-16 項：大約需 6 個月以上
                </span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 font-semibold">
                  ⏳ 17-23 項：研討會投稿與口試離校
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-stone-700">
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">1</span>
                  <span>研究題目確認</span>
                </div>
                <ul className="text-xs space-y-1.5 text-stone-600 list-disc list-inside">
                  <li>論文計畫題目必須經由閱讀而來，而非憑空想像。</li>
                  <li>盡量從老師指導過的學生論文之資訊融入教學類別中再加以延伸，或進行系統發展。討論時必須有所依據（藉由同學討論或與老師討論）。</li>
                  <li>題目必須要有創新之處，不能只有換學科或年級，但用別人已做過的相同策略。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">2</span>
                  <span>大量閱讀文獻階段</span>
                </div>
                <p className="text-xs text-stone-600">
                  大量閱讀文獻才能產生好的題目。每次討論時，都必須思考你的研究問題是什麼，研究目的為何？必須具體而能落實。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">3</span>
                  <span>文獻分析（定期與指導教授個別討論）</span>
                </div>
                <p className="text-xs text-stone-600">
                  含蒐集、閱讀、評論、啟示。文獻的來源不是只有碩博士論文，請從學術期刊中蒐集。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">4-5</span>
                  <span>決定文獻架構與文獻撰寫</span>
                </div>
                <p className="text-xs text-stone-600">
                  文獻撰寫必須用你的話去整理文獻的支持，切勿片段或整段複製，或寫與主題無關的內容。<strong className="text-rose-700">碩博士論文引用請勿超過 15 篇！</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2 md:col-span-2">
                <div className="font-bold text-rose-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-bold">6</span>
                  <span>再確認研究目的、問題與方法（嚴肅叮嚀）</span>
                </div>
                <div className="text-xs text-rose-950 space-y-1.5 leading-relaxed">
                  <p>• 上述來回修改需要時間，決定口試日期是依照你的論文計劃完整度決定。</p>
                  <p className="font-bold text-rose-800">• 請勿先決定何時要進行實驗，在不完整的論文計畫內容下，告訴老師你已經和～約好何時進行，這是不完整的計畫，與不負責任的行為！</p>
                  <p>• 需要自己問問：你寫的論文是否有執行價值？論文撰寫付出多少？</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">7</span>
                  <span>發展或選用研究工具</span>
                </div>
                <p className="text-xs text-stone-600">
                  如果必須作信效度，請盡量在論文計畫口試前做完。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="font-bold text-amber-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">8</span>
                  <span>決定計畫口試委員（必須謹慎處理程序）</span>
                </div>
                <ul className="text-xs text-amber-950 space-y-1 list-decimal list-inside">
                  <li>先詢問意願，說明是崔老師學生、題目、簡單摘要。</li>
                  <li>每次詢問先問老師的時間、再問口試委員時間，過程一定要回報老師或副本 e-mail。</li>
                  <li>地點安排、送交論文記得先問送哪裡（指導教授與自己各留一本）。</li>
                  <li>送交資料附上邀請信/說明與所長簽名敬請書。</li>
                  <li>若近用餐時間需詢問葷素忌諱與飲品（冷熱/咖啡因）；校外老師詢問是否開車以申請免費停車證。</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">9</span>
                  <span>修正論文計畫</span>
                </div>
                <p className="text-xs text-stone-600">
                  論文計畫是你和口試委員的契約，必須按照建議修正，經過老師同意才能進行下一步驟。1 個月內修正完畢，通常在寒暑假，老師不一定隨時 standby。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                <div className="font-bold text-rose-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 text-xs flex items-center justify-center font-bold">10</span>
                  <span>完成資料蒐集和分析（切記勿失聯）</span>
                </div>
                <p className="text-xs text-rose-950">
                  隨時回報進度，帶原始資料給老師看，拍下實驗進行照片。<strong className="text-rose-800">切記：勿論文計畫口試完畢就不見蹤影，直到資料分析好才出現說本學期要畢業，這是老師十分不開心的行為！</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 space-y-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">11-16</span>
                  <span>結果分析、討論與前後主體資料</span>
                </div>
                <p className="text-xs text-stone-600">
                  確定結果分析 ➔ 結果分析與討論（回顧文獻印證） ➔ 擬訂結論建議綱目 ➔ 再次修正 1-3 章 ➔ 完成目次、參考書目、附錄 ➔ 撰寫中英文摘要。
                </p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
                <div className="font-bold text-sky-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 text-xs flex items-center justify-center font-bold">17</span>
                  <span>投稿研討會小論文（畢業前要件）</span>
                </div>
                <div className="text-xs text-sky-950 space-y-1">
                  <p>• 分析資料完畢同時尋找研討會，與老師商量並批改（所上規定老師共同發表）。</p>
                  <p>• 發表後影印或複製檔案給老師留存。</p>
                  <p>• <strong>重要截稿期</strong>：TAECT 12月舉行（截稿約9-10月）；竹教大與中華大教科研討會（截稿約3-4月）；GCCCE全球華人學習科技（截稿約12-1月）。</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 space-y-2 md:col-span-2">
                <div className="font-bold text-blue-900 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">18-23</span>
                  <span>學位口試、修訂、離校與期刊投稿</span>
                </div>
                <div className="text-xs text-stone-700 space-y-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2.5 rounded-lg bg-white border border-blue-200 font-medium">
                    <div>📌 論文比對：需一週</div>
                    <div>📌 所上申請：需三週</div>
                    <div>📌 寄口試委員：需口試前兩週</div>
                  </div>
                  <p>19. 擇定口試委員和口試時間 ➔ 20. 完成口試稿修訂 ➔ 21. 進行學位口試 ➔ 22. 修正論文（1個月內完成）與辦理離校 ➔ 23. 論文投稿：研究訓練不是做完論文就結束，有機會投稿期刊是必經歷程。</p>
                </div>
              </div>
            </div>
          </div>

          {/* 三、注意事項 1-15 項 */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2 border-b border-stone-100 pb-3">
              <span className="w-2.5 h-6 bg-amber-600 rounded-full inline-block"></span>
              <span>三、注意事項（請好好記得）</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-stone-700">
              {[
                { num: 1, text: "記住這是妳（你）的論文，自己要對研究整個歷程負責，不可假手他人。" },
                { num: 2, text: "格式務必自行檢查，亂七八糟的排版，無法批改。" },
                { num: 3, text: "真的不懂地方要問到懂，自己先思考，再找書籍、資料，最後再問老師。" },
                { num: 4, text: "需要老師修改的文件，請事先找同事、家人、朋友先閱讀一次，至少印出來自己修正一次以上。並在討論前1-2週寄給老師，否則無法批改。" },
                { num: 5, text: "每次修正或老師批改，都必須保留前2-3次的資料，並帶來討論。" },
                { num: 6, text: "請老師修正的文件，不要裝訂，用夾子釘在左上方即可，易於老師翻閱與修正。" },
                { num: 7, text: "不是每週都需要來找老師，最密集也是2週一次，除非有簡單的問題。文獻資料必須仔細閱讀，需要時間沈澱，絕對不是補漏洞，老師說一項就只補一項。" },
                { num: 8, text: "不要e-mail檔案給老師，就直接問何時能來meeting，應先問自己多久沒有交進度了？需預留1-2週批改時間，忙時需等更久。" },
                { num: 9, text: "小組討論論文會議中，要討論的資料在場每個人都要有一份（包括老師）。注意別人的問題，因為也可能是你的問題，研究生問題大同小異。" },
                { num: 10, text: "APA格式好好記住自行檢查，亂七八糟的APA顯示碩士基本功訓練很差（若不確定請至市北教大圖書館網站下載，圖表格式按照APA規定）。" },
                { num: 11, text: "寫作基本邏輯技巧（概念由大到小、標題化等），先參考寫作書籍。" },
                { num: 12, text: "每次老師講過須修正的地方，要思考為什麼？邏輯關係正確嗎？合理嗎？不懂是正常的，多想、多思考。" },
                { num: 13, text: "老師修改的字或符號，多看就會懂，請謹記在心，勿連續造成同樣錯誤。" },
                { num: 14, text: "統計要自己先看看學長姊論文是否有可參考的，找本統計書籍來看，先跑出統計結果再來找老師討論。" },
                { num: 15, text: "論文結果呈現要精簡、格式要對，千萬不要從excel或SPSS直接貼上！以學長姊論文為範本，精簡文字與表格。" }
              ].map(item => (
                <div key={item.num} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 flex space-x-2.5 items-start">
                  <span className="w-5 h-5 rounded-md bg-stone-200 text-stone-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.num}
                  </span>
                  <p className="leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs font-semibold text-center mt-3">
              ❝ 論文是一個有結構的文字撰述，需要精簡文字，前後邏輯要連貫，絕非短期趕出來的作業！ ❞
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 過來人的辛酸血淚 (Chiaoman Lu) */}
      {activeSubTab === 'senior_experience' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                ❤️
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">崔老師論文指導研究生必讀之過來人的辛酸血淚</h2>
                <p className="text-xs text-stone-500">By Chiaoman Lu 學姐經驗傾囊相授</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* 一、計畫口試進行前 */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <h3 className="font-bold text-stone-900 flex items-center space-x-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>一、計畫口試進行前</span>
                </h3>
                <ul className="text-xs text-stone-700 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>初著手時，可借閱書籍（如：簡易版的論文寫作手冊）以了解論文的撰寫結構（至少不會被老師罵這麼慘）。</li>
                  <li>請借閱多本由崔老師指導的學長姐論文，多看、多比較就會知道自己的問題在哪。</li>
                  <li><strong className="text-rose-700">若論文題目已確定，請即刻、馬上先送出論文題目審查申請書（P000）</strong>供教傳小組審查，並非等到快要口試時，才想到還沒送審。</li>
                  <li>研究工具的採用，若是採用他人設計的量表，請找到第一作者。</li>
                  <li>若有使用研究工具（施測量表、考卷等），請一定要在口試前做好信效度分析（不要重複再問這個問題，會被罵），借閱學長姐論文，再不懂才詢問老師。</li>
                  <li>修正過的檔案，請使用紅字做註記，以便老師知道你此次修正哪裡。</li>
                  <li>與老師面談時，請印兩份檔案，老師一份，自己一份，以供討論。</li>
                  <li>若口試委員遲遲沒有回信，可撥打該師研究室分機號碼。</li>
                  <li>口試之簡報檔，請事先寄給老師檢視，頁數為 25-30 頁。</li>
                </ul>
              </div>

              {/* 二至四、口試後與學位考試 */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs text-stone-700">
                  <h3 className="font-bold text-amber-900 flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    <span>二、計畫口試結束後</span>
                  </h3>
                  <p className="leading-relaxed">
                    實驗過程中，請持續與老師聯繫，千萬不要因為害怕就不敢與老師聯繫，老師會更生氣。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs text-stone-700">
                  <h3 className="font-bold text-blue-900 flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    <span>三、學位考試前</span>
                  </h3>
                  <p className="leading-relaxed">
                    1. 在進行學位考試之流程前，請先經過論文比對系統（需一週），比對檔案需包含一至五章、文獻等，通過後才安排口試時間。<br />
                    2. 本次寄給口委之裝訂論文檔，需包含中、英摘要。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 text-xs text-stone-700">
                  <h3 className="font-bold text-purple-900 flex items-center space-x-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span>四、學位考試後</span>
                  </h3>
                  <p className="leading-relaxed">
                    1. 請開始修正你的論文，事先與老師討論修正處，寄給老師。<strong className="text-purple-950 font-bold">老師開金口說可以跑離校時，代表你放下重擔了</strong>，並可於此時開始撰寫謝誌（謝誌不須寄給老師審查）。<br />
                    2. 最終版本請印一本平裝版給老師，口試委員除有特殊要求，否則不用寄送。
                  </p>
                </div>
              </div>

              {/* 五、重要經驗談 */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <h3 className="font-bold text-blue-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>五、重要經驗談（心法）</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-stone-700">
                  <div className="p-3 bg-white rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-900 mb-1">1. 主動聯繫自我監督</p>
                    <p>整個撰寫過程，請主動與老師聯繫，主動問問題，不要因為心虛就消失，老師很忙，請自行監督自己。</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-900 mb-1">2. 及時回信與回報</p>
                    <p>信件往來當收到信時請一定要回覆，若需要時間準備也請先回覆收到信，而非過了一天以上才回。</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-900 mb-1">3. 外部聯繫信件附件</p>
                    <p>若有與外界單位、口委聯繫的信件，請務必附件或副本給老師。</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-blue-100">
                    <p className="font-bold text-blue-900 mb-1">4. 電晶體眼睛檢查格式</p>
                    <p>版面配置、大標小標、字型大小、APA格式請依規定，老師的眼睛是電晶體做的，請放大你的感官檢查再檢查。</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-blue-100 sm:col-span-2">
                    <p className="font-bold text-blue-900 mb-1">5. 身心愉悅健康最重要</p>
                    <p>身心請保持愉悅的狀態，寫得開心，健康最重要！</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 論文撰寫常見問題與寫作指引 */}
      {activeSubTab === 'faq_guidelines' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">論文撰寫常見問題與寫作指引</h2>
              <p className="text-xs text-stone-500">Mengping Tsuei 2019/11</p>
            </div>

            {/* Q1 */}
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200">
              <h3 className="font-bold text-amber-900 text-sm mb-1">1. 我何時能畢業？</h3>
              <p className="text-xs text-amber-950 leading-relaxed">
                進度要問你自己，不是老師能決定，若要趕畢業，平時就需要撰寫，論文是要放在架子上一輩子，自己要斟酌內容的品質，畢竟這是你的論文。
              </p>
            </div>

            {/* Q2 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">2. 論文格式問題（所網有格式檔案，請下載套用）</h3>
              <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                <li>中英文題目第一行字數長於第二行。</li>
                <li>整本論文中文字體依照所辦規定，英文字體、數字請務必要用 <span className="font-bold text-stone-900">Times New Roman</span>。</li>
                <li>圖表呈現一定在文字的下方，按照章節編號排列，表格不可跨頁排列。</li>
                <li>標題文字請勿單獨放在一頁最下一行，否則就要換行。</li>
                <li>頁碼要距離頁最下方的公分數，請自己先量好，或找幾本論文來對對看。</li>
                <li>參考文獻排列請按照中英文排列，不需要再寫「中文文獻」、「英文文獻」標題。</li>
                <li>圖片與表格盡量不要跨頁，最好在整頁裡面。</li>
              </ul>
            </div>

            {/* Q3 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 text-sm">3. 論文內容撰寫注意事項與統計檢定參考</h3>
              <ul className="text-xs text-stone-700 space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>段落長度限制</strong>：各段落文字勿超過 12 行，段落文字太長，顯示沒有重點整理，令人閱讀困難。</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>圖表規定</strong>：圖不可直接從 EXCEL 沒有修改就放上來，要用黑白呈現，不可有背景底線。統計圖呈現方式請用細線，右上角放圖例，excel圖內不需要標題，圖的標題放在word裡面。</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>表格標題</strong>：表格的標題是指下方文字的內容而非右邊內容，表格不可有直線（三線表標準）。</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>系統圖</strong>：只放重要的畫面，圖內若有需要說明的，請在圖上標示號碼，然後在圖的標題加註編號說明文字（請看佳禾論文第四章學生作品結果）。</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>教學流程對照表</strong>：實驗教學一定要把實驗組與對照組教學流程放在第三章對照表（請參考叔鎮或政宏的論文）。</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-bold text-blue-800 shrink-0">•</span>
                  <span><strong>文獻數量</strong>：參考文獻碩博士論文請勿超過 15 個，盡量參考期刊論文。</span>
                </li>
              </ul>

              {/* 統計考驗參考文獻與超連結 */}
              <div className="pt-3 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">共變數分析 (ANCOVA)</p>
                  <p className="text-stone-500 mb-2">有實施前後測、兩組或兩組以上。若違反回歸同質性請參考怡嬋論文。</p>
                  <a
                    href="https://drive.google.com/drive/folders/1L7kF-KIQ01MyT5EPWM4LSBQvxx-Eqrlf?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-800 font-semibold"
                  >
                    <span>張益瑞、崔夢萍(2014) Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">t 考驗結果 (t-test)</p>
                  <p className="text-stone-500 mb-2">兩組只有後測或一次測驗。</p>
                  <a
                    href="https://www.airitilibrary.com/Publication/alDetailedMesh?DocID=23083026-201306-201308220001-201308220001-17-36"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-800 font-semibold"
                  >
                    <span>侯政宏、崔夢萍(2013) 華藝連結</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">無母數考驗 (Nonparametric)</p>
                  <p className="text-stone-500 mb-2">班級人數不到30人，若差距太大，且只有後測無前測時使用。</p>
                  <a
                    href="https://drive.google.com/drive/folders/1L7kF-KIQ01MyT5EPWM4LSBQvxx-Eqrlf?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-700 hover:text-blue-800 font-semibold"
                  >
                    <span>陳柏升論文範本 Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 口委邀請信與公文信件範本 */}
      {activeSubTab === 'invitation_letters' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900">口試委員邀請信與公文信件參考範本</h2>
              <p className="text-xs text-stone-500">
                依崔老師規定：詢問前請先詢問老師時間、再問口試委員時間，並務必回報或副本 e-mail 給崔老師。點擊右上角按鈕即可一鍵複製套用。
              </p>
            </div>

            {/* 信件 1 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                <div className="font-bold text-stone-800 text-xs sm:text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>範本一：碩士論文計畫口試委員邀請信（初次意願與時間調查）</span>
                </div>
                <button
                  onClick={() => copyToClipboard(letter1, 'letter1')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center space-x-1 transition-all"
                >
                  {copiedId === 'letter1' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700">已複製內容</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製範本</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-700 bg-white whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {letter1}
              </pre>
            </div>

            {/* 信件 2 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                <div className="font-bold text-stone-800 text-xs sm:text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>範本二：博士論文計畫口試邀請信（多日多時段調查勾選表）</span>
                </div>
                <button
                  onClick={() => copyToClipboard(letter2, 'letter2')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center space-x-1 transition-all"
                >
                  {copiedId === 'letter2' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700">已複製內容</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製範本</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-700 bg-white whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {letter2}
              </pre>
            </div>

            {/* 信件 3 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                <div className="font-bold text-stone-800 text-xs sm:text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  <span>範本三：第二封給口試委員信件（確定時間地點、餐點忌諱、免費停車證申請）</span>
                </div>
                <button
                  onClick={() => copyToClipboard(letter3, 'letter3')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center space-x-1 transition-all"
                >
                  {copiedId === 'letter3' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700">已複製內容</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製範本</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-700 bg-white whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {letter3}
              </pre>
            </div>

            {/* 信件 4 */}
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                <div className="font-bold text-stone-800 text-xs sm:text-sm flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                  <span>範本四：博士論文口試邀請函與詳細交通指引（高鐵、台鐵、國道路線）</span>
                </div>
                <button
                  onClick={() => copyToClipboard(letter4, 'letter4')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 flex items-center space-x-1 transition-all"
                >
                  {copiedId === 'letter4' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-blue-700">已複製內容</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>複製範本</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-700 bg-white whitespace-pre-wrap leading-relaxed overflow-x-auto">
                {letter4}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: 口試 PPT 範本 (Google Drive) */}
      {activeSubTab === 'ppt_templates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h2 className="text-lg font-bold text-stone-900">論文計畫口試與學位考試 PPT 簡報範本</h2>
              <p className="text-xs text-stone-500">
                口試之簡報檔請事先寄給崔老師檢視確認。以下為崔老師認可之學長姐標準口試簡報範本連結。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proposal PPT */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-xs font-bold">
                      第一階段
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      論文計畫口試 PPT 範本（前三章）
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    標準頁數規範為 <strong>25 - 30 頁</strong>。涵蓋研究動機目的、文獻探討核心架構、研究方法與實驗設計、預期進度。
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1_3eq32GFmmwFl79ZWL3cWqWmZAoIPqoh/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <span>開啟 Google Drive 計畫口試 PPT 範本</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Final Defense PPT 1 */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-700 text-white text-xs font-bold">
                      第二階段
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      Final 學位口試論文簡報範本（版本一）
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    標準頁數規範為 <strong>30 - 35 頁</strong>。精簡報告 1-3 章，著重第 4 章結果分析印證與第 5 章結論、具體教學建議。
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1FJ8Vjk3Trv6MI_pyiVQZYDQGEKNo1L2o/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <span>開啟 Google Drive Final 簡報範本 1</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Final Defense PPT 2 */}
              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 flex flex-col justify-between space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-md bg-purple-700 text-white text-xs font-bold">
                      第二階段
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                      Final 學位口試論文簡報範本（版本二）
                    </h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    備用參考範例，適合系統開發或不同教學策略類型的研究架構呈現。
                  </p>
                </div>
                <a
                  href="https://drive.google.com/file/d/1P8kY7AIb7g95efPmFFJD6VDcKt4DPi_2/view?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-semibold flex items-center justify-center space-x-2 shadow-xs transition-all"
                >
                  <span>開啟 Google Drive Final 簡報範本 2</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
