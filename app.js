const ABILITIES = [
  { key: "professional", label: "专业能力" },
  { key: "communication", label: "沟通能力" },
  { key: "resilience", label: "抗压能力" },
  { key: "clarity", label: "职业清晰度" },
  { key: "network", label: "人脉资源" },
  { key: "offer", label: "Offer 成功率" },
];

const STAGES = [
  ["home", "首页"],
  ["profile", "角色创建"],
  ["jobs", "岗位选择"],
  ["quiz", "职业测评"],
  ["ability", "适配画像"],
  ["prep", "求职准备"],
  ["prepReview", "选择复盘"],
  ["interview", "AI 面试"],
  ["offer", "Offer 判定"],
  ["seekerReport", "求职者报告"],
];

const initialState = {
  screen: "home",
  profile: {},
  quizIndex: 0,
  answers: [],
  abilities: null,
  selectedJobId: null,
  prepIndex: 0,
  prepChoices: [],
  interviewRound: 0,
  interviewAnswers: [],
  interviewPending: false,
  pendingInterviewAnswer: "",
  offerResult: null,
  cozeLastError: "",
};

const jobs = [
  {
    id: "java",
    name: "Java 开发",
    intro: "参与后端业务系统、接口服务和数据库设计，适合逻辑严谨、喜欢工程实现的学生。",
    requirements: "熟悉 Java 基础、Spring Boot、MySQL；有课程设计、实习或项目经验优先。",
    skills: ["Java", "Spring Boot", "MySQL", "接口设计"],
    path: "初级开发 -> 后端工程师 -> 高级工程师 -> 技术负责人",
    fit: { professional: 1.3, resilience: 1.1, communication: 0.8, clarity: 1 },
    questions: [
      "请用 1 分钟介绍一下自己，并说明你为什么投递 Java 开发岗位。",
      "如果让你设计一个登录接口，你会考虑哪些安全和性能问题？",
      "请挑一个你做过的项目，说明你的具体职责、技术难点和结果。",
      "如果线上服务突然响应变慢，但你暂时定位不到原因，你会怎么处理？",
      "你未来 1-3 年希望在后端开发方向形成什么核心竞争力？",
    ],
  },
  {
    id: "data",
    name: "数据分析",
    intro: "通过数据发现业务问题、验证策略效果并输出决策建议，适合逻辑清晰且关注业务的人。",
    requirements: "熟悉 SQL、Excel 或 Python；理解指标体系，有数据分析项目经验优先。",
    skills: ["SQL", "Python", "指标体系", "数据可视化"],
    path: "数据分析助理 -> 数据分析师 -> 业务分析专家 -> 数据产品/管理岗",
    fit: { professional: 1.15, clarity: 1.2, communication: 1, resilience: 0.9 },
    questions: [
      "请介绍你自己，并说明为什么想做数据分析。",
      "如果一个活动曝光很高但转化很低，你会从哪些数据角度分析？",
      "请讲一个你用数据解决问题的经历，重点说明指标、方法和结论。",
      "如果你的分析结论和业务同学判断相反，你会怎么沟通？",
      "你希望未来成为偏业务的数据分析师，还是偏技术的数据分析师？为什么？",
    ],
  },
  {
    id: "product",
    name: "产品运营",
    intro: "围绕用户增长、产品体验和活动转化开展工作，适合善于沟通和执行复盘的学生。",
    requirements: "具备用户思维、活动策划和基础数据分析能力；有校园运营或产品项目经验优先。",
    skills: ["用户运营", "活动策划", "数据复盘", "需求理解"],
    path: "运营专员 -> 产品运营 -> 运营负责人 -> 产品/业务管理岗",
    fit: { communication: 1.2, clarity: 1.1, network: 1.05, professional: 0.9 },
    questions: [
      "请介绍你自己，并说明你对产品运营岗位的理解。",
      "如果要提升一个新功能的使用率，你会设计什么运营动作？",
      "请讲一个你策划或参与过的活动，说明目标、执行和复盘结果。",
      "如果活动上线后数据不达预期，团队压力很大，你会怎么处理？",
      "你未来希望在运营方向沉淀哪类能力？",
    ],
  },
  {
    id: "hr",
    name: "HR 管培生",
    intro: "参与招聘、培训、员工关系和组织管理，适合愿意理解人、组织和业务的学生。",
    requirements: "沟通表达好，具备责任心和组织协调能力；人力资源、心理学、管理类背景优先。",
    skills: ["招聘面试", "培训组织", "沟通协调", "员工关系"],
    path: "HR 管培生 -> HRBP/招聘专员 -> HR 经理 -> 组织发展负责人",
    fit: { communication: 1.3, network: 1.15, clarity: 1.05, resilience: 1 },
    questions: [
      "请介绍你自己，并说明你为什么选择 HR 管培生。",
      "你认为一次有效的校园招聘应该重点关注哪些环节？",
      "请讲一个你协调多人合作的经历，说明冲突和解决方式。",
      "如果候选人临时爽约，业务部门又急需用人，你会怎么处理？",
      "你怎么看 HR 在企业中的价值？",
    ],
  },
  {
    id: "marketing",
    name: "市场营销",
    intro: "负责市场调研、品牌推广和营销活动，适合创意表达强、愿意面对结果压力的人。",
    requirements: "具备市场洞察、内容表达和活动执行能力；有营销策划或社媒运营经验优先。",
    skills: ["市场调研", "品牌推广", "活动策划", "数字营销"],
    path: "市场专员 -> 营销策划 -> 品牌经理 -> 市场负责人",
    fit: { communication: 1.18, resilience: 1.1, clarity: 1, network: 1 },
    questions: [
      "请介绍你自己，并说明你为什么想做市场营销。",
      "如果要推广一款面向大学生的新产品，你会怎么制定营销方案？",
      "请讲一个你参与过的宣传、策划或推广经历。",
      "如果投放效果低于预期，预算又有限，你会如何调整？",
      "你认为市场岗位最需要长期训练的能力是什么？",
    ],
  },
  {
    id: "media",
    name: "新媒体运营",
    intro: "负责内容策划、账号运营和数据复盘，适合有网感、表达能力强且能持续产出的人。",
    requirements: "具备文字表达、内容策划和基础数据分析能力；有账号运营或短视频经验优先。",
    skills: ["内容策划", "账号运营", "短视频", "数据复盘"],
    path: "新媒体运营 -> 内容运营 -> 运营负责人 -> 品牌/增长负责人",
    fit: { communication: 1.15, professional: 0.95, network: 1.05, resilience: 1 },
    questions: [
      "请介绍你自己，并说明你对新媒体运营的理解。",
      "如果一个账号连续 2 周数据下滑，你会从哪些方面排查？",
      "请讲一个你做过或分析过的内容案例，说明为什么有效。",
      "如果热点来了但与品牌调性不完全匹配，你会不会追？为什么？",
      "你希望未来成为内容型运营还是增长型运营？",
    ],
  },
  {
    id: "frontend",
    name: "前端开发",
    intro: "负责网页和交互界面开发，连接设计、产品和后端服务，适合关注体验且动手能力强的学生。",
    requirements: "熟悉 HTML、CSS、JavaScript；了解 Vue 或 React；有网页项目或小程序项目经验优先。",
    skills: ["JavaScript", "React/Vue", "页面交互", "工程化"],
    path: "前端开发助理 -> 前端工程师 -> 高级前端 -> 前端架构/体验技术负责人",
    fit: { professional: 1.25, communication: 0.95, clarity: 1.05, resilience: 1 },
    questions: [
      "请介绍你自己，并说明为什么想做前端开发。",
      "你如何理解一个好用的网页交互？会从哪些方面优化体验？",
      "请讲一个你做过的前端项目，说明你负责的页面、技术和难点。",
      "如果页面在不同浏览器表现不一致，你会怎么排查？",
      "你未来希望往业务前端、工程化还是全栈方向发展？",
    ],
  },
  {
    id: "aiProduct",
    name: "AI 产品助理",
    intro: "围绕 AI 应用场景做需求分析、原型设计和效果评估，适合懂用户、懂业务且愿意学习 AI 的学生。",
    requirements: "具备产品思维、原型表达和基础 AI 工具使用能力；有 AI 应用或产品策划项目优先。",
    skills: ["需求分析", "AI 工具", "原型设计", "效果评估"],
    path: "AI 产品助理 -> 产品经理 -> AI 产品经理 -> 产品负责人",
    fit: { clarity: 1.25, communication: 1.15, professional: 1, network: 0.9 },
    questions: [
      "请介绍你自己，并说明为什么想做 AI 产品助理。",
      "如果要做一个 AI 简历优化功能，你会如何定义核心需求？",
      "请讲一个你设计过的产品或工具，说明目标用户和关键流程。",
      "如果 AI 输出不稳定，用户反馈不好，你会怎么推动优化？",
      "你如何看待 AI 产品和传统产品经理能力要求的差异？",
    ],
  },
  {
    id: "qa",
    name: "软件测试",
    intro: "负责发现系统问题、设计测试用例和保障交付质量，适合细心、逻辑清晰、质量意识强的学生。",
    requirements: "了解测试流程、用例设计和缺陷管理；熟悉基础 SQL、接口测试或自动化测试者优先。",
    skills: ["测试用例", "缺陷管理", "接口测试", "质量意识"],
    path: "测试助理 -> 测试工程师 -> 自动化测试 -> 测试负责人/质量专家",
    fit: { professional: 1.1, resilience: 1.15, clarity: 1.1, communication: 0.95 },
    questions: [
      "请介绍你自己，并说明为什么选择软件测试岗位。",
      "如果要测试一个登录功能，你会设计哪些测试场景？",
      "请讲一个你发现并推动解决问题的经历。",
      "如果研发认为你提的 Bug 不是问题，你会怎么沟通？",
      "你未来希望往功能测试、自动化测试还是质量管理发展？",
    ],
  },
  {
    id: "finance",
    name: "财务助理",
    intro: "参与费用核算、数据整理、报表支持和财务流程执行，适合细致、规范意识强的学生。",
    requirements: "财会、金融、经济类专业优先；熟悉 Excel，了解基础会计知识，有相关实习优先。",
    skills: ["Excel", "费用核算", "财务报表", "规范意识"],
    path: "财务助理 -> 会计/财务专员 -> 财务主管 -> 财务经理",
    fit: { professional: 1.15, clarity: 1.15, resilience: 1.05, communication: 0.9 },
    questions: [
      "请介绍你自己，并说明为什么选择财务助理岗位。",
      "你如何保证数据录入和费用核算的准确性？",
      "请讲一个你处理细致数据或表格任务的经历。",
      "如果发现报销材料不规范，但对方很着急，你会怎么处理？",
      "你未来希望在财务方向形成什么专业能力？",
    ],
  },
  {
    id: "ecommerce",
    name: "电商运营",
    intro: "负责商品、活动、流量和转化数据，适合关注用户消费行为、执行力强的学生。",
    requirements: "具备活动策划、数据分析和平台规则学习能力；有店铺运营、直播或内容带货经验优先。",
    skills: ["商品运营", "活动策划", "流量转化", "数据复盘"],
    path: "电商运营助理 -> 店铺运营 -> 类目运营 -> 电商负责人",
    fit: { communication: 1.1, professional: 1, clarity: 1.1, resilience: 1.1 },
    questions: [
      "请介绍你自己，并说明为什么想做电商运营。",
      "如果一个商品点击高但转化低，你会从哪些方面分析？",
      "请讲一个你做过的活动、社群或销售转化经历。",
      "如果大促期间库存、客服和投放同时出问题，你会怎么排优先级？",
      "你未来希望往店铺运营、内容电商还是用户增长方向发展？",
    ],
  },
  {
    id: "design",
    name: "视觉设计",
    intro: "负责视觉物料、界面风格和品牌表达，适合审美好、表达清楚且能理解业务目标的学生。",
    requirements: "设计、视觉传达、数字媒体相关专业优先；熟悉 Figma、PS 或 AI，有作品集优先。",
    skills: ["视觉表达", "Figma", "品牌设计", "作品集"],
    path: "设计助理 -> 视觉设计师 -> 资深设计师 -> 设计负责人",
    fit: { professional: 1.1, communication: 1.05, clarity: 1, resilience: 1 },
    questions: [
      "请介绍你自己，并说明为什么选择视觉设计岗位。",
      "你如何判断一张设计稿是否真正服务业务目标？",
      "请讲一个作品集中的项目，说明你的设计思路和修改过程。",
      "如果业务方不断改需求，你会怎么沟通和推进？",
      "你未来希望往品牌设计、UI 设计还是创意视觉方向发展？",
    ],
  },
];

const questions = [
  q("职业兴趣", "你更喜欢哪类任务？", [
    o("拆解复杂问题并找到稳定解法", { professional: 3, clarity: 1 }),
    o("与人沟通，推动事情向前", { communication: 3, network: 1 }),
    o("在压力下完成关键交付", { resilience: 3, offer: 1 }),
    o("探索多个方向后再决定", { clarity: 1, network: 1 }),
  ]),
  q("职业兴趣", "面对一个新项目，你最想负责哪部分？", [
    o("技术实现或方案设计", { professional: 3 }),
    o("需求沟通和资源协调", { communication: 3 }),
    o("数据分析和复盘总结", { clarity: 2, professional: 1 }),
    o("对外合作和用户触达", { network: 3 }),
  ]),
  q("职业兴趣", "你更愿意把业余时间投入到：", [
    o("学习专业技能", { professional: 3 }),
    o("参加社团、活动或行业交流", { network: 3 }),
    o("梳理职业规划和目标公司", { clarity: 3 }),
    o("运动放松，保持状态", { resilience: 3 }),
  ]),
  q("职业兴趣", "以下哪种工作反馈最让你有成就感？", [
    o("系统稳定上线或方案落地", { professional: 2, offer: 1 }),
    o("别人认可你的表达和协调", { communication: 2, network: 1 }),
    o("在高压情况下扛住结果", { resilience: 3 }),
    o("职业目标越来越明确", { clarity: 3 }),
  ]),
  q("职业兴趣", "你更偏好的工作节奏是：", [
    o("规则明确，持续打磨专业深度", { professional: 2, resilience: 1 }),
    o("变化较快，能接触很多人和事", { communication: 2, network: 1 }),
    o("目标清晰，用结果说话", { clarity: 2, offer: 1 }),
    o("压力适中，稳步成长", { resilience: 2 }),
  ]),
  q("职业兴趣", "选择实习时，你最看重：", [
    o("岗位和专业匹配度", { professional: 2, clarity: 2 }),
    o("团队氛围和导师资源", { network: 2, communication: 1 }),
    o("公司平台和转正机会", { offer: 3 }),
    o("挑战强度和成长速度", { resilience: 2, professional: 1 }),
  ]),
  q("职业性格", "团队意见不一致时，你通常会：", [
    o("先听完各方观点，再提出折中方案", { communication: 3 }),
    o("坚持自己认为正确的方案", { professional: 1, resilience: 1 }),
    o("整理事实和数据帮助大家判断", { clarity: 2, professional: 1 }),
    o("找负责人快速拍板", { resilience: 1, communication: 1 }),
  ]),
  q("职业性格", "突然接到紧急任务时，你会：", [
    o("先拆解优先级，再安排执行", { clarity: 3, resilience: 1 }),
    o("立刻开始做，边做边调整", { resilience: 3 }),
    o("先确认需求，避免方向错误", { communication: 2, clarity: 1 }),
    o("主动找人协作，提高效率", { network: 2, communication: 1 }),
  ]),
  q("职业性格", "如果面试中被追问到不会的问题，你会：", [
    o("承认不足，并说明自己的学习思路", { resilience: 2, communication: 2 }),
    o("尝试从相关经历迁移回答", { professional: 1, clarity: 2 }),
    o("直接说不会，等待下一题", { resilience: 1 }),
    o("模糊带过，避免暴露短板", { offer: -3, communication: -1 }),
  ]),
  q("职业性格", "你做决定时更依赖：", [
    o("事实、数据和明确标准", { professional: 2, clarity: 2 }),
    o("他人的建议和资源信息", { network: 2, communication: 1 }),
    o("直觉和现场判断", { resilience: 2 }),
    o("长期目标是否一致", { clarity: 3 }),
  ]),
  q("职业性格", "面对失败投递，你更可能：", [
    o("复盘简历和岗位匹配问题", { clarity: 3, offer: 1 }),
    o("继续投递更多岗位", { resilience: 2 }),
    o("找学长或老师咨询", { network: 2, communication: 1 }),
    o("暂时回避，不想面对", { resilience: -2, offer: -2 }),
  ]),
  q("职业性格", "你在小组项目中的常见角色是：", [
    o("负责核心产出", { professional: 2 }),
    o("协调分工和进度", { communication: 3 }),
    o("检查风险和质量", { resilience: 2, clarity: 1 }),
    o("链接资源和外部信息", { network: 3 }),
  ]),
  q("职业性格", "当任务要求不清楚时，你会：", [
    o("主动追问目标和验收标准", { communication: 2, clarity: 2 }),
    o("先按自己的理解推进", { resilience: 1 }),
    o("查找类似案例参考", { professional: 1, clarity: 2 }),
    o("等别人先行动再跟进", { offer: -2, clarity: -1 }),
  ]),
  q("职业性格", "你对竞争压力的感受是：", [
    o("能激发我更认真准备", { resilience: 3, offer: 1 }),
    o("会焦虑，但能用计划缓解", { clarity: 2, resilience: 1 }),
    o("更愿意找同伴一起准备", { network: 2, communication: 1 }),
    o("压力太大时容易放弃", { resilience: -2, offer: -2 }),
  ]),
  q("职业性格", "收到批评反馈后，你通常会：", [
    o("记录问题并安排改进", { clarity: 2, resilience: 2 }),
    o("先解释自己的原因", { communication: -1, resilience: 1 }),
    o("主动追问具体改进方向", { communication: 2, professional: 1 }),
    o("情绪受影响很久", { resilience: -2 }),
  ]),
  q("职业能力倾向", "你认为求职中最该提前准备的是：", [
    o("岗位所需技能和项目案例", { professional: 3, offer: 1 }),
    o("自我介绍和表达结构", { communication: 3 }),
    o("目标行业和公司信息", { clarity: 3 }),
    o("内推和求职信息渠道", { network: 3 }),
  ]),
  q("职业能力倾向", "如果工作出现失误，你会：", [
    o("主动承担责任并提出补救方案", { resilience: 3, communication: 1 }),
    o("先分析原因，再向上级同步", { clarity: 2, professional: 1 }),
    o("找同伴一起想办法", { network: 1, communication: 1 }),
    o("尽量不让别人发现", { offer: -4, communication: -2 }),
  ]),
  q("职业能力倾向", "你最擅长把哪类内容说清楚？", [
    o("技术方案或专业概念", { professional: 2, communication: 1 }),
    o("用户需求和业务目标", { communication: 2, clarity: 1 }),
    o("数据结果和结论建议", { professional: 1, clarity: 2 }),
    o("团队资源和合作安排", { network: 2, communication: 1 }),
  ]),
  q("职业能力倾向", "准备面试时，你会优先：", [
    o("梳理 STAR 项目故事", { communication: 2, offer: 1 }),
    o("补齐岗位技能短板", { professional: 3 }),
    o("研究公司业务和岗位 JD", { clarity: 3 }),
    o("寻找内推或经验贴", { network: 2, offer: 1 }),
  ]),
  q("职业能力倾向", "你更容易在哪类任务中表现好？", [
    o("需要专业深度的任务", { professional: 3 }),
    o("需要跨部门沟通的任务", { communication: 3 }),
    o("需要临场应变的任务", { resilience: 3 }),
    o("需要长期规划的任务", { clarity: 3 }),
  ]),
  q("职业能力倾向", "如果要快速熟悉一个行业，你会：", [
    o("看报告和公开资料", { clarity: 2, professional: 1 }),
    o("访谈从业者", { network: 2, communication: 1 }),
    o("做一个小项目实践", { professional: 2, resilience: 1 }),
    o("关注招聘 JD 总结要求", { offer: 2, clarity: 1 }),
  ]),
  q("职业能力倾向", "你的简历最需要强化的是：", [
    o("项目结果量化", { professional: 2, offer: 1 }),
    o("表达结构清晰", { communication: 2 }),
    o("岗位方向聚焦", { clarity: 2, offer: 1 }),
    o("资源和推荐渠道", { network: 2 }),
  ]),
  q("职业能力倾向", "当你需要说服别人时，你更常用：", [
    o("数据和案例", { professional: 1, clarity: 2 }),
    o("共情和换位思考", { communication: 3 }),
    o("目标和收益拆解", { clarity: 2, offer: 1 }),
    o("关系和信任基础", { network: 3 }),
  ]),
  q("职业能力倾向", "你认为自己当前求职最大的短板是：", [
    o("专业技能不够扎实", { professional: 1, clarity: 1 }),
    o("表达和面试经验不足", { communication: 1, offer: 1 }),
    o("容易焦虑或被拒后低落", { resilience: 1 }),
    o("目标不够聚焦", { clarity: 1 }),
  ]),
  q("职业价值观", "选择第一份工作时，你最看重：", [
    o("成长空间", { clarity: 3 }),
    o("薪资待遇", { offer: 2, clarity: 1 }),
    o("团队氛围", { communication: 1, network: 1 }),
    o("稳定性", { resilience: 2 }),
  ]),
  q("职业价值观", "未来 3 年，你更希望自己：", [
    o("成为某个方向的专业骨干", { professional: 3 }),
    o("能独立负责项目和沟通", { communication: 2, clarity: 1 }),
    o("获得更好的平台和机会", { offer: 2, network: 1 }),
    o("找到稳定适合自己的节奏", { resilience: 2, clarity: 1 }),
  ]),
  q("职业价值观", "如果高薪岗位和兴趣岗位冲突，你会：", [
    o("优先选择成长和兴趣", { clarity: 3 }),
    o("优先选择高薪，后续再调整", { offer: 2 }),
    o("评估长期发展后再决定", { clarity: 2, professional: 1 }),
    o("咨询更多前辈意见", { network: 2 }),
  ]),
  q("职业价值观", "你更认同哪句话？", [
    o("能力越硬，机会越稳", { professional: 3 }),
    o("表达清楚，机会才会被看见", { communication: 3 }),
    o("方向对了，努力才有效", { clarity: 3 }),
    o("状态扛得住，才能走得远", { resilience: 3 }),
  ]),
  q("职业价值观", "你希望公司最能提供：", [
    o("专业导师和清晰培养", { professional: 1, clarity: 2 }),
    o("开放协作的团队环境", { communication: 2, network: 1 }),
    o("有挑战的业务机会", { resilience: 2, offer: 1 }),
    o("稳定透明的发展路径", { clarity: 2, resilience: 1 }),
  ]),
  q("职业价值观", "你对求职成功的定义更接近：", [
    o("进入目标岗位并持续成长", { clarity: 3, offer: 1 }),
    o("拿到薪资和平台都不错的 Offer", { offer: 3 }),
    o("找到适合自己性格和节奏的工作", { resilience: 2, clarity: 1 }),
    o("认识更多行业资源和机会", { network: 3 }),
  ]),
];

function getActiveQuestions() {
  const job = getJob();
  if (!job) return questions;
  return [...questions.slice(0, 20), ...jobSpecificQuestions(job)];
}

function jobSpecificQuestions(job) {
  const [skillA, skillB, skillC] = job.skills;
  return [
    q("岗位适配", `如果你投递「${job.name}」，你最想在简历中突出哪类证据？`, [
      o(`与 ${skillA} 相关的项目成果`, { professional: 3, offer: 1 }),
      o("沟通协作和推动过程", { communication: 3 }),
      o("对岗位职责的理解和规划", { clarity: 3 }),
      o("认识相关从业者或内推资源", { network: 3 }),
    ]),
    q("岗位适配", `面对「${job.name}」的专业问题，你通常会如何准备？`, [
      o(`系统复习 ${skillA}、${skillB} 等核心技能`, { professional: 3 }),
      o("整理 2 个可以讲清楚的项目案例", { communication: 2, offer: 1 }),
      o("研究岗位 JD 和公司业务", { clarity: 3 }),
      o("找学长学姐做模拟面试", { network: 2, communication: 1 }),
    ]),
    q("岗位适配", `如果面试官追问你「为什么适合 ${job.name}」，你会重点说：`, [
      o(`我掌握 ${skillA}，并做过相关练习或项目`, { professional: 3, offer: 1 }),
      o("我的经历和岗位职责有清晰对应", { clarity: 3 }),
      o("我能快速沟通需求并推动落地", { communication: 3 }),
      o("我能承受岗位节奏和结果压力", { resilience: 3 }),
    ]),
    q("岗位适配", `你认为「${job.name}」最容易暴露短板的环节是：`, [
      o(`专业细节，比如 ${skillA} 或 ${skillB}`, { professional: 1, clarity: 1 }),
      o("表达不具体，讲不清项目贡献", { communication: 1, offer: 1 }),
      o("不了解岗位真实工作内容", { clarity: 1 }),
      o("被连续追问后容易紧张", { resilience: 1 }),
    ]),
    q("岗位适配", `如果你只有一周准备「${job.name}」面试，你会优先：`, [
      o(`补一个能展示 ${skillA} 的小作品或案例`, { professional: 3, offer: 1 }),
      o("把经历改写成 STAR 结构", { communication: 3 }),
      o("拆解 5 个真实 JD，总结高频要求", { clarity: 3 }),
      o("约同学进行两轮模拟面试", { resilience: 1, communication: 2 }),
    ]),
    q("岗位适配", `当「${job.name}」岗位要求和你的经历不完全匹配时，你会：`, [
      o("找可迁移能力，把经历重新组织", { clarity: 3, communication: 1 }),
      o(`快速补齐 ${skillC || skillA} 相关基础`, { professional: 3 }),
      o("主动咨询有经验的人确认差距", { network: 2, clarity: 1 }),
      o("继续投递，不额外准备", { offer: -3, clarity: -1 }),
    ]),
    q("岗位适配", `你更希望通过「${job.name}」积累什么？`, [
      o(`更扎实的 ${skillA} 专业能力`, { professional: 3 }),
      o("更清楚的业务和岗位判断", { clarity: 3 }),
      o("更成熟的表达和协作能力", { communication: 3 }),
      o("更强的抗压和结果意识", { resilience: 3 }),
    ]),
    q("岗位适配", `如果入职「${job.name}」后第一个任务不熟悉，你会：`, [
      o("先拆目标，再查资料补齐基础", { clarity: 2, professional: 1 }),
      o("主动向导师确认标准和优先级", { communication: 2, clarity: 1 }),
      o("先做一个最小可行版本再迭代", { resilience: 2, professional: 1 }),
      o("等别人安排更明确后再开始", { offer: -2, clarity: -1 }),
    ]),
    q("岗位适配", `对于「${job.name}」的职业发展，你现在的状态更接近：`, [
      o("方向明确，知道下一步补什么", { clarity: 3, offer: 1 }),
      o("有兴趣，但还在了解真实工作", { clarity: 1, professional: 1 }),
      o("更看重是否有机会和资源", { network: 2, offer: 1 }),
      o("还没想清楚，只是先试试", { clarity: -2, offer: -1 }),
    ]),
    q("岗位适配", `你认为自己冲刺「${job.name}」最该提升的是：`, [
      o(`${skillA}、${skillB} 等硬技能`, { professional: 2 }),
      o("把经历讲清楚的表达能力", { communication: 2 }),
      o("对岗位和行业的判断", { clarity: 2 }),
      o("面对失败和追问的稳定性", { resilience: 2 }),
    ]),
  ];
}

const prepEvents = [
  {
    title: "简历投递",
    text: "你的目标岗位已经确定，简历篇幅有限，你决定重点突出哪部分？",
    options: [
      choice("项目经历", "用项目结果证明岗位能力。", { professional: 5, offer: 4 }, { communication: -2 }),
      choice("实习经历", "突出真实工作场景和执行经验。", { professional: 3, communication: 2, offer: 5 }, { clarity: -2 }),
      choice("技能证书", "强调可验证的基础能力。", { professional: 4, offer: 2 }, { communication: -2, clarity: -1 }),
      choice("校园活动", "展示组织协调和主动性。", { communication: 4, network: 2 }, { professional: -3 }),
    ],
  },
  {
    title: "求职渠道",
    text: "你准备通过哪个渠道投递这家公司？",
    options: [
      choice("招聘平台", "覆盖面广，适合批量发现机会。", { offer: 4 }, { clarity: -2 }),
      choice("校招官网", "流程正规，岗位信息完整。", { clarity: 3, offer: 3 }, { network: -2 }),
      choice("学长学姐内推", "提升简历被看见的概率。", { network: 8, offer: 5 }, { professional: -2 }),
      choice("线下宣讲会", "能更直接了解公司和岗位。", { communication: 3, clarity: 3 }, { resilience: -2 }),
    ],
  },
  {
    title: "公司类型",
    text: "你面前有几种不同类型的机会，你会优先选择？",
    options: [
      choice("大厂校招", "难度高，但平台和成长资源更强。", { professional: 3, resilience: 4, offer: 1 }, { offer: -3 }),
      choice("创业公司", "机会多，边界宽，对主动性要求高。", { resilience: 3, communication: 2, clarity: 2 }, { network: -2 }),
      choice("国企央企", "流程规范，稳定性更强。", { clarity: 3, resilience: 2 }, { professional: -2 }),
      choice("成长型中小企业", "难度适中，更容易拿到实践机会。", { professional: 2, offer: 4 }, { network: -2 }),
    ],
  },
  {
    title: "面试准备",
    text: "距离面试还有两天，你最优先做什么？",
    options: [
      choice("刷岗位题", "补齐专业知识和常见问题。", { professional: 6 }, { communication: -2 }),
      choice("模拟面试", "提前适应问答压力和表达节奏。", { communication: 6, resilience: 4 }, { professional: -2 }),
      choice("修改简历", "让经历更贴合岗位要求。", { clarity: 5, offer: 4 }, { resilience: -2 }),
      choice("了解公司业务", "让回答更具体，减少空泛表达。", { clarity: 5, communication: 2 }, { professional: -2 }),
    ],
  },
  {
    title: "求职压力",
    text: "你连续投递多个岗位没有回复，情绪开始波动，你会怎么做？",
    options: [
      choice("继续海投", "增加投递数量，但可能忽略匹配问题。", { resilience: 2 }, { clarity: -3, offer: -3 }),
      choice("复盘岗位匹配度", "重新检查 JD、简历和目标方向。", { clarity: 6, offer: 5 }, { resilience: -2 }),
      choice("找老师或学长咨询", "借助外部视角修正策略。", { network: 4, communication: 2, offer: 2 }, { professional: -2 }),
      choice("暂时放弃该方向", "短期缓解压力，但会影响本轮求职。", { resilience: 2 }, { clarity: -4, offer: -6 }),
    ],
  },
];

let state = normalizeState(loadState());
let speechRecognition = null;
let speechRecording = false;

function clone(value) {
  return typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

function q(category, text, options) {
  return { category, text, options };
}

function o(label, effect) {
  return { label, effect };
}

function choice(title, desc, positiveEffect, negativeEffect = {}, reasons = {}) {
  const effect = { ...positiveEffect };
  Object.entries(negativeEffect).forEach(([key, value]) => {
    effect[key] = (effect[key] || 0) + value;
  });
  return { title, desc, positiveEffect, negativeEffect, reasons, effect };
}

function saveState() {
  safeSet("career-sim-state", JSON.stringify(state));
}

function loadState() {
  try {
    return { ...initialState, ...JSON.parse(safeGet("career-sim-state") || "{}") };
  } catch {
    return clone(initialState);
  }
}

function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Some file:// browser contexts disable localStorage. The game can still run without persistence.
  }
}

function normalizeState(nextState) {
  nextState = { ...nextState, interviewPending: false, pendingInterviewAnswer: "" };
  const needsJob = ["quiz", "ability", "prep", "prepReview", "interview", "offer", "seekerReport"];
  if (needsJob.includes(nextState.screen) && !nextState.selectedJobId) {
    return { ...nextState, screen: nextState.profile?.nickname ? "jobs" : "profile" };
  }
  if (nextState.abilities) {
    return { ...nextState, abilities: enforceAbilityBounds(nextState.abilities) };
  }
  return nextState;
}

function resetGame() {
  state = clone(initialState);
  saveState();
  render();
}

function setScreen(screen) {
  state.screen = screen;
  saveState();
  render();
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getJob() {
  return jobs.find((job) => job.id === state.selectedJobId);
}

function abilityAverage(abilities = state.abilities) {
  if (!abilities) return 0;
  return Math.round(ABILITIES.reduce((sum, a) => sum + abilities[a.key], 0) / ABILITIES.length);
}

function applyEffects(base, effects) {
  const next = { ...base };
  Object.entries(effects).forEach(([key, value]) => {
    next[key] = clamp((next[key] ?? 50) + value);
  });
  return next;
}

function calculateAbilities() {
  let score = {
    professional: 42,
    communication: 42,
    resilience: 42,
    clarity: 42,
    network: 42,
    offer: 42,
  };

  state.answers.forEach((answerIndex, idx) => {
    const answer = getActiveQuestions()[idx].options[answerIndex];
    if (answer) score = applyEffects(score, multiplyEffect(answer.effect, 3.2));
  });

  const profileBoost = {};
  if ((state.profile.major || "").includes("计算机")) profileBoost.professional = 4;
  if ((state.profile.stage || "").includes("应届")) profileBoost.offer = 2;
  if (state.profile.city) profileBoost.clarity = 2;

  score = applyEffects(score, profileBoost);
  score.offer = clamp(score.offer * 0.55 + abilityAverage(score) * 0.45);
  return normalizeAbilities(score);
}

function normalizeAbilities(raw) {
  const mean = ABILITIES.reduce((sum, ability) => sum + raw[ability.key], 0) / ABILITIES.length;
  const normalized = {};
  ABILITIES.forEach((ability) => {
    normalized[ability.key] = clamp(60 + (raw[ability.key] - mean) * 0.8, 40, 80);
  });
  return normalized;
}

function enforceAbilityBounds(abilities, min = 40, max = 80) {
  const bounded = { ...abilities };
  ABILITIES.forEach((ability) => {
    bounded[ability.key] = clamp(bounded[ability.key] ?? min, min, max);
  });
  return bounded;
}

function multiplyEffect(effect, times) {
  return Object.fromEntries(Object.entries(effect).map(([key, value]) => [key, value * times]));
}

function summarizeEffects(effect) {
  return Object.entries(effect)
    .filter(([, value]) => value !== 0)
    .map(([key, value]) => `${abilityLabel(key)} ${value > 0 ? "+" : ""}${value}`)
    .join("，");
}

function effectBadges(option) {
  const positive = Object.entries(option.positiveEffect || {})
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `<span class="effect-badge positive">${abilityLabel(key)} +${value}</span>`)
    .join("");
  const negative = Object.entries(option.negativeEffect || {})
    .filter(([, value]) => value < 0)
    .map(([key, value]) => `<span class="effect-badge negative">${abilityLabel(key)} ${value}</span>`)
    .join("");
  return `<div class="effect-list">${positive}${negative}</div>`;
}

function effectReasonList(option) {
  const items = [
    ...Object.entries(option.positiveEffect || {}).map(([key, value]) => ({
      key,
      value,
      type: "positive",
      reason: option.reasons?.[key] || defaultEffectReason(key, value, option.title),
    })),
    ...Object.entries(option.negativeEffect || {}).map(([key, value]) => ({
      key,
      value,
      type: "negative",
      reason: option.reasons?.[key] || defaultEffectReason(key, value, option.title),
    })),
  ];
  return `<ul class="effect-reasons">${items
    .map(
      (item) =>
        `<li class="${item.type}"><strong>${abilityLabel(item.key)} ${item.value > 0 ? "+" : ""}${item.value}：</strong>${item.reason}</li>`,
    )
    .join("")}</ul>`;
}

function defaultEffectReason(key, value, choiceTitle) {
  const positive = value > 0;
  const positiveMap = {
    professional: `${choiceTitle}能提供更直接的岗位能力证据。`,
    communication: `${choiceTitle}更容易体现表达、协作和沟通意识。`,
    resilience: `${choiceTitle}能训练面对压力和不确定性的稳定性。`,
    clarity: `${choiceTitle}有助于明确岗位目标和准备方向。`,
    network: `${choiceTitle}能增加外部信息和求职资源。`,
    offer: `${choiceTitle}能提高简历被看见或面试通过的概率。`,
  };
  const negativeMap = {
    professional: `${choiceTitle}对专业能力的直接证明相对不足。`,
    communication: `${choiceTitle}可能减少表达和面试沟通训练。`,
    resilience: `${choiceTitle}可能降低对真实压力场景的适应。`,
    clarity: `${choiceTitle}容易让求职方向或岗位匹配不够聚焦。`,
    network: `${choiceTitle}对外部资源和信息渠道帮助有限。`,
    offer: `${choiceTitle}可能降低本轮求职成功率。`,
  };
  return positive ? positiveMap[key] : negativeMap[key];
}

function abilityLabel(key) {
  return ABILITIES.find((a) => a.key === key)?.label || key;
}

function totalPrepScore() {
  if (!state.prepChoices.length) return 60;
  let score = 60;
  state.prepChoices.forEach((choiceIndex, idx) => {
    const opt = prepEvents[idx].options[choiceIndex];
    if (opt) score += Object.values(opt.effect).reduce((sum, value) => sum + value, 0);
  });
  return clamp(score);
}

function currentAbilities() {
  let abilities = enforceAbilityBounds(state.abilities || calculateAbilities());
  state.prepChoices.forEach((choiceIndex, idx) => {
    const opt = prepEvents[idx].options[choiceIndex];
    if (opt) abilities = enforceAbilityBounds(applyEffects(abilities, opt.effect));
  });
  return abilities;
}

function calculateJobFit() {
  const job = getJob();
  const abilities = currentAbilities();
  if (!job) return 60;
  let weighted = 0;
  let totalWeight = 0;
  Object.entries(job.fit).forEach(([key, weight]) => {
    weighted += abilities[key] * weight;
    totalWeight += weight;
  });
  return clamp(weighted / totalWeight);
}

function scoreInterviewAnswer(answer, round) {
  return interviewScoreDetail(answer, round).score;
}

function interviewScoreDetail(answer, round) {
  const job = getJob();
  const abilities = currentAbilities();
  const lower = answer.toLowerCase();
  const length = answer.trim().length;
  const hasStructure = /首先|其次|最后|第一|第二|第三|背景|任务|行动|结果|因为|所以|例如|比如|复盘/.test(answer);
  const hasEvidence = /项目|实习|负责|参与|数据|指标|用户|业务|结果|提升|降低|完成|上线|复盘|\d/.test(answer);
  const hasMindset = /学习|沟通|协作|负责|主动|调整|改进|复盘|目标|计划|压力|解决/.test(answer);
  const skillHits = (job?.skills || []).filter((skill) => lower.includes(skill.toLowerCase()) || answer.includes(skill)).length;
  const quality = answerQualityFlags(answer, job, round, { hasEvidence, hasMindset, skillHits });

  const completeness = clamp(42 + Math.min(38, Math.floor(length / 4)) + (length >= 80 ? 10 : 0));
  const structure = clamp(46 + (hasStructure ? 34 : 8) + (answer.includes("。") || answer.includes("\n") ? 8 : 0));
  const evidence = clamp(42 + (hasEvidence ? 28 : 6) + Math.min(18, skillHits * 6));
  const jobFit = clamp(44 + skillHits * 10 + (answer.includes(job?.name || "") ? 8 : 0) + jobFitAbilityBonus(round, abilities));
  const mindset = clamp(46 + (hasMindset ? 26 : 8) + mindsetAbilityBonus(round, abilities));

  const rubric = interviewRubric(round);
  let score = clamp(
    completeness * rubric.weights.completeness +
      structure * rubric.weights.structure +
      evidence * rubric.weights.evidence +
      jobFit * rubric.weights.jobFit +
      mindset * rubric.weights.mindset,
  );

  if (quality.invalid) score = Math.min(score, 28);
  else if (quality.offTopic) score = Math.min(score, 42);
  else if (length < 24) score = Math.min(score, 52);
  else if (!hasEvidence && [0, 2, 3].includes(round)) score = Math.min(score, 64);
  else if (!hasStructure && length < 70) score = Math.min(score, 68);

  return {
    score,
    rubric: rubric.name,
    dimensions: {
      completeness,
      structure,
      evidence,
      jobFit,
      mindset,
    },
  };
}

function interviewRubric(round) {
  const rubrics = [
    {
      name: "自我介绍",
      weights: { completeness: 0.2, structure: 0.25, evidence: 0.2, jobFit: 0.2, mindset: 0.15 },
    },
    {
      name: "岗位理解",
      weights: { completeness: 0.15, structure: 0.2, evidence: 0.15, jobFit: 0.35, mindset: 0.15 },
    },
    {
      name: "项目经历追问",
      weights: { completeness: 0.15, structure: 0.2, evidence: 0.35, jobFit: 0.2, mindset: 0.1 },
    },
    {
      name: "压力面试",
      weights: { completeness: 0.15, structure: 0.2, evidence: 0.15, jobFit: 0.1, mindset: 0.4 },
    },
    {
      name: "职业规划",
      weights: { completeness: 0.18, structure: 0.2, evidence: 0.12, jobFit: 0.25, mindset: 0.25 },
    },
  ];
  return rubrics[round] || rubrics[0];
}

function answerQualityFlags(answer, job, round, context) {
  const trimmed = answer.trim();
  const compact = trimmed.replace(/\s/g, "");
  const hasChinese = /[\u4e00-\u9fa5]/.test(trimmed);
  const repeatedChars = /(.)\1{5,}/.test(compact);
  const mostlySymbolOrNumber =
    compact.length > 0 && compact.replace(/[0-9a-zA-Z\u4e00-\u9fa5]/g, "").length / compact.length > 0.45;
  const mostlyDigits = compact.length > 0 && compact.replace(/\d/g, "").length / compact.length < 0.35;
  const refusal = /不知道|不会|没有想过|随便|无所谓|不清楚|不知道怎么说|没什么/.test(trimmed);

  const jobTerms = [
    job?.name,
    ...(job?.skills || []),
    "岗位",
    "求职",
    "面试",
    "专业",
    "课程",
    "项目",
    "实习",
    "社团",
    "经历",
    "负责",
    "沟通",
    "协作",
    "团队",
    "业务",
    "用户",
    "数据",
    "产品",
    "开发",
    "运营",
    "市场",
    "招聘",
    "目标",
    "规划",
    "学习",
    "复盘",
  ].filter(Boolean);
  const hasJobTerm = jobTerms.some((term) => trimmed.includes(term));
  const hasEnoughSignal = context.hasEvidence || context.hasMindset || context.skillHits > 0 || hasJobTerm;

  return {
    invalid: compact.length < 8 || !hasChinese || repeatedChars || mostlyDigits || mostlySymbolOrNumber,
    offTopic: compact.length < 18 || refusal || !hasEnoughSignal,
  };
}

function jobFitAbilityBonus(round, abilities) {
  if (round === 1) return abilities.clarity * 0.12 + abilities.professional * 0.08;
  if (round === 2) return abilities.professional * 0.12;
  return abilities.offer * 0.08 + abilities.clarity * 0.06;
}

function mindsetAbilityBonus(round, abilities) {
  if (round === 3) return abilities.resilience * 0.22 + abilities.communication * 0.08;
  if (round === 4) return abilities.clarity * 0.16 + abilities.resilience * 0.08;
  return abilities.communication * 0.1 + abilities.resilience * 0.06;
}

function interviewFeedback(answer, round, score) {
  const strong = score >= 82;
  const ok = score >= 70;
  const weak = score < 60;
  const roundTips = [
    "自我介绍要把专业背景、关键经历和岗位动机连起来。",
    "岗位理解需要结合岗位职责，不要只说兴趣。",
    "项目追问更看重你的具体职责、方法和结果。",
    "压力题重点看复盘能力、责任意识和沟通方式。",
    "职业规划要体现方向感，也要和目标岗位一致。",
  ];
  if (strong) {
    return `这一轮回答比较完整，能看到你对问题的理解和岗位关联。建议继续补充量化结果，让表达更有说服力。${roundTips[round]}`;
  }
  if (ok) {
    return `这一轮基本达标，但回答还可以更具体。建议加入真实案例，并按照“背景、行动、结果”的结构展开。${roundTips[round]}`;
  }
  if (weak) {
    return `这一轮风险较明显，回答偏短或缺少岗位证据。建议先明确结论，再用一个具体经历支撑。${roundTips[round]}`;
  }
  return `这一轮有一定思路，但表达还不够聚焦。建议减少泛泛表态，补充你做过什么、如何做、结果怎样。${roundTips[round]}`;
}

async function getAgentInterviewFeedback(answer, round, detail) {
  try {
    if (window.location.protocol === "file:") {
      return { feedback: "", error: "当前是 file:// 打开，Coze 需要通过 http://localhost:3000 调用。" };
    }
    const job = getJob();
    const response = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobName: job?.name,
        roundName: detail.rubric,
        question: job?.questions?.[round],
        answer,
        scoreLabel: scoreLabel(detail.score),
        dimensions: detail.dimensions,
        userId: state.profile.nickname || "career-sim-user",
      }),
    });
    if (!response.ok) return { feedback: "", error: `本地接口请求失败：${response.status}` };
    const data = await response.json();
    if (data.fallback) {
      return { feedback: "", error: data.error || "Coze 未返回可用反馈，已切换本地模拟。" };
    }
    if (!data.feedback) {
      return { feedback: "", error: "Coze 返回为空，已切换本地模拟。" };
    }
    return { feedback: data.feedback, error: "" };
  } catch (error) {
    return { feedback: "", error: error.message || "Coze 调用失败，已切换本地模拟。" };
  }
}

function calculateOffer() {
  const abilities = currentAbilities();
  const abilityScore = abilityAverage(abilities);
  const prepScore = totalPrepScore();
  const interviewScore = state.interviewAnswers.length
    ? Math.round(state.interviewAnswers.reduce((sum, item) => sum + item.score, 0) / state.interviewAnswers.length)
    : 0;
  const jobFit = calculateJobFit();
  const total = clamp(abilityScore * 0.3 + prepScore * 0.25 + interviewScore * 0.35 + jobFit * 0.1);
  let level = "暂不通过";
  let type = "danger";
  let advice = "当前准备度不足，建议先复盘岗位匹配、简历证据和面试表达，再重新训练。";
  if (total >= 85) {
    level = "强烈推荐录用";
    type = "success";
    advice = "岗位准备充分，表达和匹配度都较成熟，具备较强录用竞争力。";
  } else if (total >= 70) {
    level = "建议录用";
    type = "success";
    advice = "整体达到岗位要求，但仍需要加强部分表达证据和岗位深度。";
  } else if (total >= 55) {
    level = "待提升";
    type = "warn";
    advice = "具备一定基础，但岗位适配或面试表达还不稳定，建议针对短板训练。";
  }
  return { total, level, type, passed: total >= 70, advice, abilityScore, prepScore, interviewScore, jobFit };
}

function scoreLabel(score) {
  if (score >= 85) return "优秀";
  if (score >= 70) return "达标";
  if (score >= 55) return "待提升";
  return "风险较高";
}

function updateHistory() {
  const result = state.offerResult || calculateOffer();
  const history = JSON.parse(safeGet("career-sim-history") || "[]");
  history.unshift({
    date: new Date().toLocaleString("zh-CN"),
    name: state.profile.nickname || "匿名用户",
    job: getJob()?.name,
    score: result.total,
    level: result.level,
  });
  safeSet("career-sim-history", JSON.stringify(history.slice(0, 8)));
  const best = JSON.parse(safeGet("career-sim-best") || "null");
  if (!best || result.total > best.score) {
    safeSet("career-sim-best", JSON.stringify({ score: result.total, job: getJob()?.name, level: result.level }));
  }
}
function appFrame(content) {
  const activeIndex = Math.max(0, STAGES.findIndex(([key]) => key === state.screen));
  const showHud = !["home"].includes(state.screen);
  return `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">AI</div>
          <div>
            <h1 class="brand-title">AI面试模拟器</h1>
            <p class="brand-subtitle">AI 面试训练与职业能力评估系统</p>
          </div>
        </div>
        <button class="btn ghost" data-action="reset">重新开始</button>
      </header>
      <nav class="progress-strip">
        ${STAGES.map(([key, label], idx) => `<span class="step-pill ${idx === activeIndex ? "active" : ""}">${label}</span>`).join("")}
      </nav>
      ${showHud ? gameHud() : ""}
      <main class="screen">${content}</main>
    </div>
  `;
}

function gameHud() {
  const job = getJob();
  const chapter = Math.max(1, STAGES.findIndex(([key]) => key === state.screen));
  return `
    <section class="game-hud">
      <div class="hud-player">
        <div class="avatar">${(state.profile.nickname || "玩").slice(0, 1)}</div>
        <div>
          <strong>${state.profile.nickname || "未命名用户"}</strong>
          <span>${state.profile.stage || "待设定"} · ${state.profile.major || "未选择专业"}</span>
        </div>
      </div>
      <div class="hud-stats">
        <span>第 ${chapter} 章</span>
        <span>目标：${job?.name || "待选择"}</span>
      </div>
    </section>
  `;
}

function renderHome() {
  const best = JSON.parse(safeGet("career-sim-best") || "null");
  const history = JSON.parse(safeGet("career-sim-history") || "[]");
  return appFrame(`
    <section class="hero">
      <div class="hero-main">
        <p class="eyebrow">基于 AI Agent 的大学生职业能力训练模拟系统</p>
        <h1>开启你的 AI 面试训练之旅</h1>
        <p class="hero-copy">选择目标岗位，完成岗位适配测评与求职准备，进入 AI 模拟面试，最终生成一份可复盘的职业成长报告。</p>
        <div class="cta-row">
          <button class="btn primary" data-action="start">开始模拟面试</button>
          ${state.screen !== "home" ? `<button class="btn ghost" data-action="continue">继续上次进度</button>` : ""}
        </div>
      </div>
      <aside class="hero-visual">
        <div class="mock-terminal">
          <div class="terminal-line"><span>训练流程</span><strong>8 个环节</strong></div>
          <div class="terminal-line"><span>岗位适配</span><strong>30 道题</strong></div>
          <div class="terminal-line"><span>目标岗位</span><strong>${jobs.length} 个方向</strong></div>
          <div class="terminal-line"><span>AI 面试</span><strong>5 轮问答</strong></div>
          <div class="terminal-line"><span>最终输出</span><strong>成长报告</strong></div>
          <div class="terminal-line"><span>历史最好</span><strong class="terminal-score">${best ? best.level : "暂无"}</strong></div>
        </div>
      </aside>
    </section>
    ${
      history.length
        ? `<section class="content"><h2>最近训练记录</h2><div class="grid three">${history
            .slice(0, 3)
            .map((item) => `<div class="card"><strong>${item.name}</strong><p class="muted">${item.job} · ${item.date}</p><div class="score-big">${scoreLabel(item.score)}</div><p>${item.level}</p></div>`)
            .join("")}</div></section>`
        : ""
    }
  `);
}

function renderProfile() {
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 1 章", "创建你的求职档案", "先确定身份、专业和目标城市，本次训练的报告都会记录这份档案。")}
      <div class="page-head">
        <div>
          <h2>角色创建</h2>
          <p>先填写基础求职信息，后续测评、岗位选择和成长报告都会围绕这份档案展开。</p>
        </div>
      </div>
      <form id="profile-form" class="grid two">
        ${field("nickname", "昵称", "例如：小林")}
        ${selectField("stage", "当前阶段", ["大二", "大三", "大四", "研一", "研二", "研三", "博士在读", "应届生", "毕业一年内"])}
        ${field("major", "专业", "例如：计算机科学与技术")}
        ${field("city", "目标城市", "例如：杭州")}
        ${field("industry", "期望行业", "例如：互联网 / 金融 / 制造")}
        ${selectField("status", "求职状态", ["刚开始准备", "已经投递", "收到面试", "多次受挫", "冲刺 Offer"])}
      </form>
      <div class="footer-actions">
        <button class="btn primary" data-action="saveProfile">创建档案并选择目标岗位</button>
      </div>
    </section>
  `);
}

function field(name, label, placeholder) {
  const value = state.profile[name] || "";
  return `<div class="field"><label for="${name}">${label}</label><input id="${name}" name="${name}" value="${escapeHtml(value)}" placeholder="${placeholder}" /></div>`;
}

function selectField(name, label, options) {
  const value = state.profile[name] || options[0];
  return `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options
    .map((item) => `<option ${item === value ? "selected" : ""}>${item}</option>`)
    .join("")}</select></div>`;
}

function renderQuiz() {
  const activeQuestions = getActiveQuestions();
  const question = activeQuestions[state.quizIndex];
  const selected = state.answers[state.quizIndex];
  const progress = Math.round(((state.quizIndex + 1) / activeQuestions.length) * 100);
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 3 章", "岗位适配测试", "30 道题会生成你的六项能力画像，确定本次训练起点。")}
      <div class="question-layout">
        <div>
          <div class="page-head">
            <div>
          <h2>岗位适配测试</h2>
          <p>${getJob()?.name || "目标岗位"} · ${question.category} · 第 ${state.quizIndex + 1} / ${activeQuestions.length} 题</p>
            </div>
          </div>
          <h3 class="question-title">${question.text}</h3>
          <div class="option-list">
            ${question.options
              .map(
                (option, idx) => `
                  <button class="option-btn ${selected === idx ? "selected" : ""}" data-action="answer" data-index="${idx}">
                    ${String.fromCharCode(65 + idx)}. ${option.label}
                  </button>
                `,
              )
              .join("")}
          </div>
          <div class="footer-actions">
            <button class="btn ghost" data-action="prevQuestion" ${state.quizIndex === 0 ? "disabled" : ""}>上一题</button>
            <button class="btn primary" data-action="nextQuestion" ${selected === undefined ? "disabled" : ""}>${state.quizIndex === activeQuestions.length - 1 ? "生成能力画像" : "下一题"}</button>
          </div>
        </div>
        <aside class="card soft">
          <h3>测试进度</h3>
          <div class="meter" style="--value: ${progress}%"><span></span></div>
          <p class="muted">已完成 ${state.answers.filter((item) => item !== undefined).length} 道题。前 20 题建立基础画像，后 10 题围绕「${getJob()?.name}」判断岗位适配。</p>
          <p class="small-note">这是正式面试训练前的画像生成阶段，数值会影响后续准备建议和面试结果。</p>
        </aside>
      </div>
    </section>
  `);
}

function renderAbility() {
  const abilities = enforceAbilityBounds(state.abilities || calculateAbilities());
  state.abilities = abilities;
  saveState();
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 4 章", "生成岗位适配画像", "这是你的初始数值面板，后续选择会继续改变它。")}
      <div class="page-head">
        <div>
          <h2>岗位适配画像</h2>
          <p>系统根据目标岗位和 30 道测评题生成你的岗位适配画像，帮助你判断当前优势和后续训练重点。</p>
        </div>
        <button class="btn primary" data-action="goPrep">进入求职准备</button>
      </div>
      <div class="report-grid">
        <div class="card">
          <h3>六项能力</h3>
          ${abilityList(abilities)}
        </div>
        <div class="card">
          <h3>能力雷达图</h3>
          <div class="radar-wrap">${radarSvg(abilities)}</div>
        </div>
      </div>
      <section class="report-section card soft">
        <h3>初步建议</h3>
        <p>${initialAdvice(abilities)}</p>
      </section>
    </section>
  `);
}

function renderJobs() {
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 2 章", "选择目标岗位", "先选目标，再测适配。这样后续每一步都有明确方向。")}
      <div class="page-head">
        <div>
          <h2>选择目标岗位</h2>
          <p>先决定你的目标岗位。后续测评、求职准备、面试问题和评分标准都会围绕这个目标展开。</p>
        </div>
      </div>
      <div class="grid three">
        ${jobs
          .map(
            (job) => `
            <article class="card job-card ${state.selectedJobId === job.id ? "selected" : ""}" data-action="selectJob" data-id="${job.id}">
              <h3>${job.name}</h3>
              <p class="muted">${job.intro}</p>
              <p><strong>应届生要求：</strong>${job.requirements}</p>
              <div class="tag-row">${job.skills.map((skill) => `<span class="tag">${skill}</span>`).join("")}</div>
            </article>
          `,
          )
          .join("")}
      </div>
      <div class="footer-actions">
        <button class="btn primary" data-action="goQuiz" ${!state.selectedJobId ? "disabled" : ""}>进入岗位适配测试</button>
      </div>
    </section>
  `);
}

function renderPrep() {
  const event = prepEvents[state.prepIndex];
  const selected = state.prepChoices[state.prepIndex];
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 5 章", "求职准备", "完成五个关键求职选择，系统会在结束后统一复盘你的路线影响。")}
      <div class="question-layout">
        <div>
          <div class="page-head">
            <div>
          <h2>求职准备</h2>
          <p>${event.title} · 第 ${state.prepIndex + 1} / ${prepEvents.length} 个事件</p>
            </div>
          </div>
          <h3 class="question-title">${event.text}</h3>
          <div class="grid two">
            ${event.options
              .map(
                (option, idx) => `
                  <article class="card choice-card ${selected === idx ? "selected" : ""}" data-action="selectPrep" data-index="${idx}">
                    <h3>${option.title}</h3>
                    <p class="muted">${option.desc}</p>
                  </article>
                `,
              )
              .join("")}
          </div>
          <div class="footer-actions">
            <button class="btn ghost" data-action="prevPrep" ${state.prepIndex === 0 ? "disabled" : ""}>上一步</button>
            <button class="btn primary" data-action="nextPrep" ${selected === undefined ? "disabled" : ""}>${state.prepIndex === prepEvents.length - 1 ? "查看选择复盘" : "继续"}</button>
          </div>
        </div>
        <aside class="card">
          <h3>当前能力</h3>
          ${abilityList(currentAbilities())}
        </aside>
      </div>
    </section>
  `);
}

function renderPrepReview() {
  const abilities = currentAbilities();
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 6 章", "求职路线复盘", "系统汇总你在五个求职事件中的选择，展示收益、代价和当前能力偏向。")}
      <div class="page-head">
        <div>
          <h2>求职路线复盘</h2>
          <p>你已经完成五个求职准备选择。下面是本轮路线对能力结构的影响。</p>
        </div>
        <button class="btn primary" data-action="goInterview">进入 AI 面试</button>
      </div>
      <div class="prep-review-layout">
        <section class="prep-review-title">
          <h3>五次选择影响</h3>
        </section>
        ${prepEffectSummary(0, 2)}
        <aside class="card prep-ability-card">
          <h3>当前能力偏向</h3>
          ${abilityList(abilities)}
          <p class="small-note">${abilityBiasSummary(abilities)}</p>
        </aside>
        ${prepEffectSummary(2, 5)}
      </div>
    </section>
  `);
}

function renderInterview() {
  const job = getJob();
  const round = state.interviewRound;
  const done = round >= 5;
  const currentQuestion = job?.questions[round];
  const pending = Boolean(state.interviewPending);
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 6 章", "AI 模拟面试", "完成 5 轮结构化面试，系统会根据回答质量生成评价。")}
      <div class="page-head">
        <div>
          <h2>模拟面试：AI 面试官</h2>
          <p>${job?.name} 结构化面试 · ${done ? "已完成" : `第 ${round + 1} / 5 轮`}</p>
        </div>
      </div>
      <div class="chat-layout">
        <div class="chat-panel">
          <div class="chat-header"><strong>AI 面试官</strong><span>${job?.name}</span></div>
          <div class="messages">
            ${state.interviewAnswers
              .map(
                (item, idx) => `
                  <div class="message ai">${job.questions[idx]}</div>
                  <div class="message user">${escapeHtml(item.answer)}</div>
                  <div class="message system">本轮评价：${scoreLabel(item.score)}。${item.feedback}<div class="source-note">反馈来源：${item.feedbackSource || "本地模拟"}${item.feedbackError ? ` · ${item.feedbackError}` : ""}</div>${interviewDimensionHtml(item)}</div>
                `,
              )
              .join("")}
            ${
              done
                ? `<div class="message system">5 轮面试已结束。系统将根据测评、求职准备和面试表现计算 Offer 结果。</div>`
                : `<div class="message ai">${currentQuestion}</div>${
                    pending
                      ? `<div class="message user">${escapeHtml(state.pendingInterviewAnswer)}</div><div class="message system loading-message"><span class="loading-spinner"></span>AI 面试官正在分析你的回答，请稍等...</div>`
                      : ""
                  }`
            }
          </div>
          <div class="chat-input">
            ${
              done
                ? `<button class="btn primary" data-action="finishInterview">查看 Offer 结果</button>`
                : `<div class="field"><textarea id="interview-answer" placeholder="请输入你的回答，建议包含背景、行动和结果。" ${pending ? "disabled" : ""}>${pending ? escapeHtml(state.pendingInterviewAnswer) : ""}</textarea></div><div class="voice-row"><button class="btn ghost" id="voice-btn" data-action="voiceInterview" type="button" ${pending ? "disabled" : ""}>开始语音输入</button><button class="btn primary" data-action="submitInterview" ${pending ? "disabled" : ""}>${pending ? `<span class="btn-spinner"></span>等待反馈` : "提交回答"}</button><span class="voice-status" id="voice-status">${pending ? "AI 分析中" : "未录音"}</span></div><p class="small-note">${pending ? "正在调用 AI 面试官，请不要重复提交。" : "语音输入依赖浏览器支持。点击开始后说话，再点击结束录音。"}</p>`
            }
          </div>
        </div>
        <aside class="card">
          <h3>面试评分说明</h3>
          <ul class="list">
            <li>AI 负责提问和点评。</li>
            <li>系统按回答完整、表达结构、经历证据、岗位贴合、应对心态五项评价。</li>
            <li>不同轮次权重不同：项目追问更看重经历证据，压力题更看重应对心态。</li>
          </ul>
          <div class="report-section">
            <h3>当前能力</h3>
            ${abilityList(currentAbilities())}
          </div>
        </aside>
      </div>
    </section>
  `);
}

function renderOffer() {
  const result = state.offerResult || calculateOffer();
  state.offerResult = result;
  saveState();
  return appFrame(`
    <section class="content">
      ${chapterBanner("第 7 章", "Offer 结果判定", "系统根据测评、求职选择、面试表现和岗位匹配度给出本次训练结果。")}
      <div class="result-banner ${result.type}">
        <div>
          <h2>结果判定：Offer 建议</h2>
          <p>系统不会只看一个分数，而是结合基础画像、求职策略、面试表达和岗位适配给出录用建议。</p>
        </div>
        <div class="result-score">
          <span>求职准备度</span>
          <strong>${result.total}</strong>
          <em>${scoreLabel(result.total)}</em>
        </div>
      </div>
      <div class="grid two report-section">
        <div class="card"><h3>录用建议</h3><p class="score-big">${result.level}</p><p class="muted">${result.advice}</p></div>
        <div class="card"><h3>准备度拆解</h3>${scoreBreakdown(result)}</div>
      </div>
      <section class="card soft report-section">
        <h3>下一步</h3>
        <p>不管是否通过，你都会获得完整成长报告。报告会解释为什么得到这个结果，并给出下一轮求职训练建议。</p>
      </section>
      <div class="footer-actions">
        <button class="btn primary" data-action="goSeekerReport">查看职业成长报告</button>
      </div>
    </section>
  `);
}

function renderSeekerReport() {
  const result = state.offerResult || calculateOffer();
  const abilities = currentAbilities();
  return appFrame(`
    <section class="content" id="report-content">
      ${chapterBanner("通关复盘", "职业成长报告", "无论是否通过面试，都会获得求职者视角的完整复盘。")}
      <div class="page-head">
        <div>
          <h2>职业成长报告</h2>
          <p>${state.profile.nickname || "用户"} · ${getJob()?.name} · ${new Date().toLocaleDateString("zh-CN")}</p>
        </div>
        <div class="score-big">${scoreLabel(result.total)}</div>
      </div>
      <div class="result-banner ${result.type}">
        <div>
          <h2>${result.level}</h2>
          <p>${seekerConclusion(result)}</p>
        </div>
      </div>
      <div class="report-grid report-section">
        <div class="card">
          <h3>六项能力</h3>
          ${abilityList(abilities)}
        </div>
        <div class="card">
          <h3>能力雷达图</h3>
          <div class="radar-wrap">${radarSvg(abilities)}</div>
        </div>
      </div>
      <div class="grid two report-section">
        <section class="card">
          <h3>求职准备复盘</h3>
          <div class="timeline">${prepSummary()}</div>
        </section>
        <section class="card">
          <h3>AI 面试表现</h3>
          <div class="timeline">${interviewSummary()}</div>
        </section>
      </div>
      <div class="grid two report-section">
        <section class="card soft">
          <h3>优势分析</h3>
          <ul class="list">${strengths(abilities).map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
        <section class="card soft">
          <h3>短板与建议</h3>
          <ul class="list">${weaknesses(abilities, result).map((item) => `<li>${item}</li>`).join("")}</ul>
        </section>
      </div>
      <div class="footer-actions">
        <button class="btn ghost" data-action="print">打印 / 导出 PDF</button>
        <button class="btn ghost" data-action="copyReport">复制报告摘要</button>
        <button class="btn danger" data-action="reset">重新训练</button>
      </div>
    </section>
  `);
}

function chapterBanner(kicker, title, desc) {
  return `
    <div class="chapter-banner">
      <span>${kicker}</span>
      <div>
        <strong>${title}</strong>
        <p>${desc}</p>
      </div>
    </div>
  `;
}

function abilityList(abilities, list = ABILITIES) {
  return `<div class="ability-list">${list
    .map(
      (ability) => `
      <div class="ability-row">
        <span>${ability.label}</span>
        <div class="meter" style="--value: ${clamp(abilities[ability.key])}%"><span></span></div>
        <strong>${clamp(abilities[ability.key])}</strong>
      </div>
    `,
    )
    .join("")}</div>`;
}

function radarSvg(abilities) {
  const size = 260;
  const center = size / 2;
  const radius = 92;
  const points = ABILITIES.map((ability, idx) => {
    const angle = (Math.PI * 2 * idx) / ABILITIES.length - Math.PI / 2;
    const r = radius * (abilities[ability.key] / 100);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  });
  const axis = ABILITIES.map((ability, idx) => {
    const angle = (Math.PI * 2 * idx) / ABILITIES.length - Math.PI / 2;
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    const tx = center + Math.cos(angle) * (radius + 28);
    const ty = center + Math.sin(angle) * (radius + 28);
    return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="#d8e0ee"/><text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="#667085">${ability.label}</text>`;
  }).join("");
  const rings = [0.33, 0.66, 1]
    .map((scale) => {
      const ringPoints = ABILITIES.map((_, idx) => {
        const angle = (Math.PI * 2 * idx) / ABILITIES.length - Math.PI / 2;
        return `${center + Math.cos(angle) * radius * scale},${center + Math.sin(angle) * radius * scale}`;
      }).join(" ");
      return `<polygon points="${ringPoints}" fill="none" stroke="#e5ecf6"/>`;
    })
    .join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="能力雷达图">${rings}${axis}<polygon points="${points.map((p) => p.join(",")).join(" ")}" fill="rgba(37,99,235,.22)" stroke="#2563eb" stroke-width="2"/></svg>`;
}

function scoreBreakdown(result) {
  return abilityList(
    {
      ability: result.abilityScore,
      prep: result.prepScore,
      interview: result.interviewScore,
      fit: result.jobFit,
    },
    [
      { key: "ability", label: "基础画像" },
      { key: "prep", label: "求职策略" },
      { key: "interview", label: "表达表现" },
      { key: "fit", label: "岗位适配" },
    ],
  );
}

function interviewDimensionHtml(item) {
  if (!item.dimensions) return "";
  const labels = {
    completeness: "回答完整",
    structure: "表达结构",
    evidence: "经历证据",
    jobFit: "岗位贴合",
    mindset: "应对心态",
  };
  return `<div class="mini-scores">${Object.entries(item.dimensions)
    .map(([key, value]) => `<span>${labels[key]}：${scoreLabel(value)}</span>`)
    .join("")}</div>`;
}

function initialAdvice(abilities) {
  const strongest = [...ABILITIES].sort((a, b) => abilities[b.key] - abilities[a.key])[0];
  const weakest = [...ABILITIES].sort((a, b) => abilities[a.key] - abilities[b.key])[0];
  return `你的 ${strongest.label} 当前较突出，可以作为求职表达中的优势；${weakest.label} 是后续训练重点。建议在岗位选择后，通过求职准备和模拟面试继续修正能力结构。`;
}

function seekerConclusion(result) {
  return result.advice;
}

function prepSummary() {
  return prepEvents
    .map((event, idx) => {
      const opt = event.options[state.prepChoices[idx]];
      return `<div class="timeline-item"><strong>${event.title}：</strong>${opt?.title || "未选择"}<p class="muted">${opt?.desc || ""}</p></div>`;
    })
    .join("");
}

function prepEffectSummary(start = 0, end = prepEvents.length) {
  return prepEvents
    .slice(start, end)
    .map((event, idx) => {
      const realIndex = start + idx;
      const opt = event.options[state.prepChoices[realIndex]];
      return `<article class="prep-review-card prep-review-card-${realIndex + 1}"><strong>${event.title}：${opt?.title || "未选择"}</strong><p class="muted">${opt?.desc || ""}</p>${opt ? effectBadges(opt) + effectReasonList(opt) : ""}</article>`;
    })
    .join("");
}

function abilityBiasSummary(abilities) {
  const sorted = [...ABILITIES].sort((a, b) => abilities[b.key] - abilities[a.key]);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  return `当前最突出的能力是「${strongest.label}」，需要重点补足的是「${weakest.label}」。后续 AI 面试会重点检验你是否能用具体经历证明这些能力。`;
}

function interviewSummary() {
  return state.interviewAnswers
    .map((item, idx) => `<div class="timeline-item"><strong>第 ${idx + 1} 轮 ${item.rubric || "面试"}：${scoreLabel(item.score)}</strong><p>${item.feedback}</p>${interviewDimensionHtml(item)}</div>`)
    .join("");
}

function strengths(abilities) {
  return [...ABILITIES]
    .sort((a, b) => abilities[b.key] - abilities[a.key])
    .slice(0, 3)
    .map((ability) => `${ability.label}达到 ${abilities[ability.key]} 分，可作为求职叙事中的主要优势。`);
}

function weaknesses(abilities, result) {
  const advice = [...ABILITIES]
    .sort((a, b) => abilities[a.key] - abilities[b.key])
    .slice(0, 2)
    .map((ability) => `${ability.label}相对偏弱，建议用更具体的经历、训练或资源补足。`);
  if (result.interviewScore < 70) advice.push("面试回答建议采用 STAR 法则，减少空泛表达，增加可量化结果。");
  if (result.jobFit < 70) advice.push("岗位匹配度仍需提升，建议重新检查目标岗位 JD 与个人经历之间的证据链。");
  return advice;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function copyReportText() {
  const result = state.offerResult || calculateOffer();
  const text = `《职业成长报告》\n姓名：${state.profile.nickname || "用户"}\n目标岗位：${getJob()?.name}\n录用建议：${result.level}\n准备度等级：${scoreLabel(result.total)}\n核心建议：${seekerConclusion(result)}`;
  navigator.clipboard?.writeText(text);
  alert("报告摘要已复制。");
}

function toggleSpeechInput(targetId) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("当前浏览器不支持语音输入，可以继续使用文字输入。");
    return;
  }
  const target = document.querySelector(`#${targetId}`);
  if (!target) return;

  if (speechRecording && speechRecognition) {
    speechRecording = false;
    speechRecognition.stop();
    setVoiceStatus(false, "已结束录音");
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.lang = "zh-CN";
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.maxAlternatives = 1;
  speechRecording = true;
  setVoiceStatus(true, "正在录音，请说话...");

  speechRecognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const text = event.results[i][0]?.transcript || "";
      if (event.results[i].isFinal) finalText += text;
      else interimText += text;
    }
    if (finalText) {
      target.value = target.value ? `${target.value}${finalText}` : finalText;
    }
    if (interimText) setVoiceStatus(true, `正在识别：${interimText}`);
  };
  speechRecognition.onerror = () => {
    speechRecording = false;
    setVoiceStatus(false, "语音输入失败，请检查麦克风权限");
  };
  speechRecognition.onend = () => {
    if (speechRecording) {
      speechRecording = false;
      setVoiceStatus(false, "录音已自动结束");
    }
  };
  speechRecognition.start();
}

function setVoiceStatus(active, text) {
  const button = document.querySelector("#voice-btn");
  const status = document.querySelector("#voice-status");
  if (button) {
    button.textContent = active ? "结束语音输入" : "开始语音输入";
    button.classList.toggle("recording", active);
  }
  if (status) {
    status.textContent = text;
    status.classList.toggle("recording", active);
  }
}

async function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "reset") return resetGame();
  if (action === "start") return setScreen("profile");
  if (action === "continue") return render();
  if (action === "saveProfile") {
    const form = document.querySelector("#profile-form");
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.nickname || !data.major || !data.city || !data.industry) {
      alert("请先补全角色信息。");
      return;
    }
    state.profile = data;
    state.screen = "jobs";
    saveState();
    return render();
  }
  if (action === "answer") {
    state.answers[state.quizIndex] = Number(target.dataset.index);
    saveState();
    return render();
  }
  if (action === "prevQuestion") {
    state.quizIndex = Math.max(0, state.quizIndex - 1);
    saveState();
    return render();
  }
  if (action === "nextQuestion") {
    if (state.answers[state.quizIndex] === undefined) return;
    if (state.quizIndex === getActiveQuestions().length - 1) {
      state.abilities = calculateAbilities();
      state.screen = "ability";
    } else {
      state.quizIndex += 1;
    }
    saveState();
    return render();
  }
  if (action === "goQuiz") return setScreen("quiz");
  if (action === "selectJob") {
    const changed = state.selectedJobId !== target.dataset.id;
    state.selectedJobId = target.dataset.id;
    if (changed) {
      state.quizIndex = 0;
      state.answers = [];
      state.abilities = null;
      state.prepIndex = 0;
      state.prepChoices = [];
      state.interviewRound = 0;
      state.interviewAnswers = [];
      state.offerResult = null;
    }
    saveState();
    return render();
  }
  if (action === "goPrep") return setScreen("prep");
  if (action === "selectPrep") {
    state.prepChoices[state.prepIndex] = Number(target.dataset.index);
    saveState();
    return render();
  }
  if (action === "prevPrep") {
    state.prepIndex = Math.max(0, state.prepIndex - 1);
    saveState();
    return render();
  }
  if (action === "nextPrep") {
    if (state.prepChoices[state.prepIndex] === undefined) return;
    if (state.prepIndex === prepEvents.length - 1) {
      state.screen = "prepReview";
    } else {
      state.prepIndex += 1;
    }
    saveState();
    return render();
  }
  if (action === "submitInterview") {
    if (state.interviewPending) return;
    const answer = document.querySelector("#interview-answer")?.value.trim();
    if (!answer || answer.length < 8) {
      alert("回答至少输入 8 个字，方便系统评分。");
      return;
    }
    const roundAtSubmit = state.interviewRound;
    state.interviewPending = true;
    state.pendingInterviewAnswer = answer;
    saveState();
    render();

    const detail = interviewScoreDetail(answer, roundAtSubmit);
    const localFeedback = interviewFeedback(answer, roundAtSubmit, detail.score);
    const agentResult = await getAgentInterviewFeedback(answer, roundAtSubmit, detail);
    const agentFeedback = agentResult.feedback;
    state.cozeLastError = agentResult.error || "";
    state.interviewAnswers.push({
      answer,
      score: detail.score,
      rubric: detail.rubric,
      dimensions: detail.dimensions,
      feedback: agentFeedback || localFeedback,
      feedbackSource: agentFeedback ? "Coze Agent" : "本地模拟",
      feedbackError: agentFeedback ? "" : state.cozeLastError,
    });
    state.interviewRound = roundAtSubmit + 1;
    state.interviewPending = false;
    state.pendingInterviewAnswer = "";
    saveState();
    return render();
  }
  if (action === "voiceInterview") {
    if (state.interviewPending) return;
    return toggleSpeechInput("interview-answer");
  }
  if (action === "goInterview") return setScreen("interview");
  if (action === "finishInterview") {
    state.offerResult = calculateOffer();
    updateHistory();
    state.screen = "offer";
    saveState();
    return render();
  }
  if (action === "goSeekerReport") return setScreen("seekerReport");
  if (action === "print") return window.print();
  if (action === "copyReport") return copyReportText();
}

function render() {
  const app = document.querySelector("#app");
  const renderers = {
    home: renderHome,
    profile: renderProfile,
    quiz: renderQuiz,
    ability: renderAbility,
    jobs: renderJobs,
    prep: renderPrep,
    prepReview: renderPrepReview,
    interview: renderInterview,
    offer: renderOffer,
    seekerReport: renderSeekerReport,
  };
  app.innerHTML = (renderers[state.screen] || renderHome)();
}

document.addEventListener("click", handleClick);
render();
