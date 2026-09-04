import { DesignTemplate } from '../types';

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'heritage-ancestral',
    name: 'Kỷ Niệm Gia Đình Thân Yêu',
    tagline: 'Tông nâu ấm áp hoài niệm, lưu giữ những khoảnh khắc sum vầy của cả gia đình',
    category: 'family',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSohbxRs9aojG0mPmzHCkQmh6ytHLOezO12v0TqDaTvimR3AZPsHcQxz71UfomoofixMJhvdUCmO0hW65cCQ6cf3Jr8Gr6qHpr_gjdMtFEuj2tBiK22vvBFzDFOnV654cOmIGqGVJvy3lQEJFKx-rLBoDKjSk5qilgSAM51mLbxtspC5DCIdBEoBS1i6xtL8itFSyT9nY8Vr68fKRw_2ID9zATrgKsdgNcxE-3gUdPJ11JUFhB6Nh1',
    woodBase: 'walnut',
    layoutStyle: 'museum-border',
    colorFilter: 'sepia',
    fontFamily: 'serif',
    description: 'Thiết kế trang nhã với viền tinh tế, màu ảnh ấm áp sâu lắng. Thích hợp cho các dịp sum họp gia đình, mừng thọ ông bà cha mẹ và lưu giữ khoảnh khắc sum vầy.',
    idealFor: 'Quà biếu Cha Mẹ, mừng thọ ông bà, kỷ niệm ngày cưới và họp mặt gia đình',
    accentColor: '#d4af37',
    previewTags: ['Gia đình', 'Ấm áp', 'Gỗ Walnut', 'Viền trang nhã'],
    monthsData: [
      {
        monthNumber: 1,
        title: 'Tháng 01',
        theme: 'Cội Nguồn Đoàn Viên',
        quote: 'Gia đình hòa thuận, vạn sự bình an, hạnh phúc đong đầy mỗi ngày.',
        arVideoTitle: 'BỮA CƠM SUM HỌP & CHÚC THỌ ĐẦU XUÂN',
        arVideoDuration: '03:45'
      },
      {
        monthNumber: 2,
        title: 'Tháng 02',
        theme: 'Mùa Xuân Bát Ngát',
        quote: 'Nụ cười con cháu là đóa hoa xuân rực rỡ nhất trong nhà.',
        arVideoTitle: 'SUM HỌP ĐẠI GIA ĐÌNH BỐN THẾ HỆ',
        arVideoDuration: '04:20'
      },
      {
        monthNumber: 5,
        title: 'Tháng 05',
        theme: 'Tri Ân Đấng Sinh Thành',
        quote: 'Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra.',
        arVideoTitle: 'KỶ NIỆM 50 NĂM NGÀY CƯỚI CỦA CHA MẸ',
        arVideoDuration: '05:10'
      }
    ]
  },
  {
    id: 'botanical-zen',
    name: 'Wabi-Sabi Tĩnh Tại & Thảo Mộc',
    tagline: 'Sắc xanh mộc mạc an nhiên, đưa hơi thở thiên nhiên vào không gian sống',
    category: 'botanical',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvgteLPvaWeb57To4IojREj32HFeapHBKFVqW2WXmsSZKUd6mTzQort_CEVKZt-058YBBEkAAwJX2AFzCG0niMxPZmHEGXdND0vGbtltUJOwMnAWPDV3_eR_WkX1iB3QvJJQxTySNpwzMJHuB836q7gp5HMdSvcgt4oq8bdt6plmq7kq2MEOJZgqrxYVjUc3-weijnrWjRdFZTrJ-6Pjj9sjakIEsbVaC4i5ZHjb6b2__67ekjXjHr',
    woodBase: 'oak',
    layoutStyle: 'polar-split',
    colorFilter: 'botanical',
    fontFamily: 'sans',
    description: 'Lấy cảm hứng từ triết lý Wabi-Sabi Nhật Bản, tôn vinh vẻ đẹp tĩnh tại và thanh lọc tâm trí. Giấy mỹ thuật xốp mịn kết hợp cùng đế gỗ Sồi Bắc Âu sáng ấm.',
    idealFor: 'Bàn làm việc sáng tạo, phòng trà, quà tặng thiền định và chữa lành',
    accentColor: '#8a9a86',
    previewTags: ['Zen', 'Tự nhiên', 'Gỗ Sồi Trắng', 'Tối giản'],
    monthsData: [
      {
        monthNumber: 1,
        title: 'Tháng 01',
        theme: 'Tĩnh Lặng Khởi Sinh',
        quote: 'Một chén trà sớm, một hơi thở an lành đón vạn điều mới.',
        arVideoTitle: 'TIẾNG CHUÔNG CHÙA TRONG SƯƠNG SỚM',
        arVideoDuration: '02:50'
      },
      {
        monthNumber: 3,
        title: 'Tháng 03',
        theme: 'Chồi Non Vươn Mình',
        quote: 'Cứ nhẹ nhàng buông xuống, cuộc đời tự khắc nở hoa.',
        arVideoTitle: 'RỪNG TRE BẠCH MÃ VÀ TIẾNG SUỐI CHẢY',
        arVideoDuration: '03:15'
      }
    ]
  },
  {
    id: 'haute-horlogerie',
    name: 'Haute Horlogerie Titan Monolith',
    tagline: 'Phong cách chế tác đồng hồ Thụy Sĩ, đen tuyền nguyên khối sắc lạnh',
    category: 'minimal',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIzonWICY5MxTO9rO-5FO7sMbx4oP4ZNRisHPXvamQx2oxaLw39IHaat_sNRI-34e2uxhiSDMluNTtSM9cxRBeGAOv2fYJ4PchROagI8ys9soVKxHu9GTibsCM6IVD4dcaF5df8PpVxnujM_zgKhEKWJxPBqKfMbNPdIru5nRF3j0BrR4oCU3pv5qF4QhFhkKZv1ots-PnLVStbGrvxgn4P5zpI1T8mGB-dzNy8dzjA_d3VoY1yM54',
    woodBase: 'ebony',
    layoutStyle: 'minimal-fullbleed',
    colorFilter: 'noir',
    fontFamily: 'mono',
    description: 'Định hình đẳng cấp của sự chuẩn xác. Tông màu than chì than mờ kết hợp cùng đế gỗ Mun chải cạnh titan xước. Từng mốc ngày được xử lý sắc nét như mặt số chronograph.',
    idealFor: 'Văn phòng C-Level, kiến trúc sư, tín đồ phong cách tối giản cao cấp',
    accentColor: '#bbcac1',
    previewTags: ['Monochrome', 'Titanium', 'Gỗ Mun', 'Chronograph'],
    monthsData: [
      {
        monthNumber: 1,
        title: 'Tháng 01',
        theme: 'Precision Horizon',
        quote: 'Time is the ultimate currency of the disciplined mind.',
        arVideoTitle: 'SWISS TOURBILLON ESCAPEMENT AT WORK 4K',
        arVideoDuration: '01:50'
      }
    ]
  },
  {
    id: 'mon-amour',
    name: 'Mon Amour Uyên Ương Kỷ Niệm',
    tagline: 'Ấm áp sắc hoàng hôn champagne, ghi dấu 12 mốc tình yêu son sắt',
    category: 'romance',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5fJ_dMwmndoFCcRLwf4ImildqnixkmIRy1n08pyNmcHy_-LjRUlqKIZgJlgC6VsbIIJP6cden-2bjIFxTweNFaYNXeY6HnQtVwDfuusvdN0l0HnwwHR0eEi9fJM29PbfB_Ek5jy0dkzA6uxFhtgpFU3gT2QB2f3ggKUCadGvQ17rmTEwCpIUkuMpFfwI1mGYyq8aYXUPe-pkXTSLPQinp5B9T4I8n0yFRPGKZWyw42Chkz94zV4j2',
    woodBase: 'oak',
    layoutStyle: 'museum-border',
    colorFilter: 'sunset',
    fontFamily: 'serif',
    description: 'Dành riêng cho đôi uyên ương muốn biến 12 tháng thành cuốn hồi ức tình yêu sống động. Từng trang lịch ẩn chứa video ngày đính hôn, đám cưới hoặc chuyến trăng mật ngọt ngào.',
    idealFor: 'Quà cưới, kỷ niệm 1 năm - 5 năm - 10 năm tình yêu, quà Valentine cao cấp',
    accentColor: '#e0a98b',
    previewTags: ['Tình yêu', 'Kỷ niệm cưới', 'Hoàng hôn', 'Video ẩn'],
    monthsData: [
      {
        monthNumber: 2,
        title: 'Tháng 02',
        theme: 'Khoảnh Khắc Hẹn Ước',
        quote: 'Cảm ơn em đã bước vào thế giới của anh và biến mọi điều trở nên diệu kỳ.',
        arVideoTitle: 'LỜI NÓI YÊU DƯỚI HOÀNG HÔN ĐÀ LẠT',
        arVideoDuration: '04:15'
      },
      {
        monthNumber: 10,
        title: 'Tháng 10',
        theme: 'Ngày Ta Chung Đôi',
        quote: 'Trăm năm một chữ đồng, cùng nhau đi qua mọi phong ba.',
        arVideoTitle: 'THƯỚC PHIM HÔN LỄ TRÀO NƯỚC MẮT',
        arVideoDuration: '06:00'
      }
    ]
  },
  {
    id: 'executive-c-suite',
    name: 'Executive Ngoại Giao & Doanh Nghiệp',
    tagline: 'Uy tín ngoại giao vững chắc, khắc họa dấu ấn thương hiệu tinh hoa',
    category: 'executive',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA51_sj7Y2pUGepOXq71lh6rq8zuldTW6g-AndzPb1oMk1F3k2NhXkZl5lr8BpPoulUmfjzLu1s7ncMWGuBJkRwYUWdKaV9a2q4x5KcwBwO2ov2t2N9iDxmqUWFzMyO0tehHMBoc2rHgjKYXPiIDkQ-IWRL_zjqPlXPUsgjJa5zOHzGYGpWrNtpB8CXId1XscJj4PmqMZUvyKaNENEVrB11bsidrnzQW950APWElsEMR1CEgGfRJcRN',
    woodBase: 'walnut',
    layoutStyle: 'polar-split',
    colorFilter: 'none',
    fontFamily: 'serif',
    description: 'Chuẩn mực quà tặng ngoại giao cao cấp cho đối tác chiến lược và ban lãnh đạo. Tích hợp video thông điệp truyền cảm hứng từ Chủ tịch Hội đồng Quản trị qua WebAR.',
    idealFor: 'Quà tặng VIP Tết, tri ân cổ đông, quà kỷ niệm thành lập tập đoàn',
    accentColor: '#3949ab',
    previewTags: ['Ngoại giao', 'B2B VIP', 'Gỗ Walnut', 'Khắc logo'],
    monthsData: [
      {
        monthNumber: 1,
        title: 'Tháng 01',
        theme: 'Khát Vọng Tiên Phong',
        quote: 'Tầm nhìn dẫn lối hành động, chữ tín tạo dựng cơ đồ trường tồn.',
        arVideoTitle: 'THÔNG ĐIỆP CHỦ TỊCH: VẬN HỘI THẬP KỶ MỚI',
        arVideoDuration: '02:30'
      }
    ]
  },
  {
    id: 'cyber-phygital',
    name: 'Cyber Phygital & WebAR Hologram',
    tagline: 'Đột phá tương lai số, tương tác 3D WebAR trực tiếp sống động',
    category: 'cyber',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7JpK0QF3C4XYFe9sn7qwDkCU4z6N3GOQNIgPdEAKlJTBfoN2IpXgsp0LkqJTxGj_EH_GQv-OXcIKmqDbSVZ7k1hoB4J5PMx0dD5BdnNvZ-WSh8qU6-9Gz32LYLD8O5P3av4WRXwInV9NYk_d9NuQwVPJsQdLqnfjqL81P5TxgGLheiQKfLDTQVRmt7Du8k_NuX7gBqb5sBzVnynPhuL4OEGbRLhGQ3b_aErb7eRx0A8DKSKyZqoJZ',
    woodBase: 'ebony',
    layoutStyle: 'gallery-square',
    colorFilter: 'none',
    fontFamily: 'mono',
    description: 'Thiết kế tối ưu hóa cho điểm neo nhận diện quang học WebAR với độ chính xác 99.9%. Hiệu ứng tương phản mạnh mẽ đưa thế giới số bước ra đời thực một cách kỳ diệu.',
    idealFor: 'Nhà sáng tạo nội dung, công nghệ, studio nghệ thuật, game và crypto',
    accentColor: '#00e5ff',
    previewTags: ['WebAR 60FPS', 'Công nghệ', 'Gỗ Mun', 'Điểm neo quang học'],
    monthsData: [
      {
        monthNumber: 1,
        title: 'Tháng 01',
        theme: 'Quantum Dimension',
        quote: 'Reality is merely an illusion, albeit a very persistent one.',
        arVideoTitle: '3D SPATIAL PARTICLES GENERATIVE ART',
        arVideoDuration: '02:15'
      }
    ]
  }
];

// Curated stock photo alternatives for user self-designing
export const CURATED_PHOTO_LIBRARY = [
  {
    category: 'Gia đình & Sum họp',
    photos: [
      {
        title: 'Bữa cơm sum vầy',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIzonWICY5MxTO9rO-5FO7sMbx4oP4ZNRisHPXvamQx2oxaLw39IHaat_sNRI-34e2uxhiSDMluNTtSM9cxRBeGAOv2fYJ4PchROagI8ys9soVKxHu9GTibsCM6IVD4dcaF5df8PpVxnujM_zgKhEKWJxPBqKfMbNPdIru5nRF3j0BrR4oCU3pv5qF4QhFhkKZv1ots-PnLVStbGrvxgn4P5zpI1T8mGB-dzNy8dzjA_d3VoY1yM54'
      },
      {
        title: 'Nụ cười mừng thọ',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSohbxRs9aojG0mPmzHCkQmh6ytHLOezO12v0TqDaTvimR3AZPsHcQxz71UfomoofixMJhvdUCmO0hW65cCQ6cf3Jr8Gr6qHpr_gjdMtFEuj2tBiK22vvBFzDFOnV654cOmIGqGVJvy3lQEJFKx-rLBoDKjSk5qilgSAM51mLbxtspC5DCIdBEoBS1i6xtL8itFSyT9nY8Vr68fKRw_2ID9zATrgKsdgNcxE-3gUdPJ11JUFhB6Nh1'
      }
    ]
  },
  {
    category: 'Thiên nhiên & Phong cảnh',
    photos: [
      {
        title: 'Đà Lạt sương sớm',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5fJ_dMwmndoFCcRLwf4ImildqnixkmIRy1n08pyNmcHy_-LjRUlqKIZgJlgC6VsbIIJP6cden-2bjIFxTweNFaYNXeY6HnQtVwDfuusvdN0l0HnwwHR0eEi9fJM29PbfB_Ek5jy0dkzA6uxFhtgpFU3gT2QB2f3ggKUCadGvQ17rmTEwCpIUkuMpFfwI1mGYyq8aYXUPe-pkXTSLPQinp5B9T4I8n0yFRPGKZWyw42Chkz94zV4j2'
      },
      {
        title: 'Rừng nguyên sinh an tĩnh',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvgteLPvaWeb57To4IojREj32HFeapHBKFVqW2WXmsSZKUd6mTzQort_CEVKZt-058YBBEkAAwJX2AFzCG0niMxPZmHEGXdND0vGbtltUJOwMnAWPDV3_eR_WkX1iB3QvJJQxTySNpwzMJHuB836q7gp5HMdSvcgt4oq8bdt6plmq7kq2MEOJZgqrxYVjUc3-weijnrWjRdFZTrJ-6Pjj9sjakIEsbVaC4i5ZHjb6b2__67ekjXjHr'
      },
      {
        title: 'Biển khơi Phú Quốc',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7JpK0QF3C4XYFe9sn7qwDkCU4z6N3GOQNIgPdEAKlJTBfoN2IpXgsp0LkqJTxGj_EH_GQv-OXcIKmqDbSVZ7k1hoB4J5PMx0dD5BdnNvZ-WSh8qU6-9Gz32LYLD8O5P3av4WRXwInV9NYk_d9NuQwVPJsQdLqnfjqL81P5TxgGLheiQKfLDTQVRmt7Du8k_NuX7gBqb5sBzVnynPhuL4OEGbRLhGQ3b_aErb7eRx0A8DKSKyZqoJZ'
      }
    ]
  },
  {
    category: 'Kiến trúc & Tối giản',
    photos: [
      {
        title: 'Bình minh Hồ Tây',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA51_sj7Y2pUGepOXq71lh6rq8zuldTW6g-AndzPb1oMk1F3k2NhXkZl5lr8BpPoulUmfjzLu1s7ncMWGuBJkRwYUWdKaV9a2q4x5KcwBwO2ov2t2N9iDxmqUWFzMyO0tehHMBoc2rHgjKYXPiIDkQ-IWRL_zjqPlXPUsgjJa5zOHzGYGpWrNtpB8CXId1XscJj4PmqMZUvyKaNENEVrB11bsidrnzQW950APWElsEMR1CEgGfRJcRN'
      },
      {
        title: 'Phố cổ thu vàng',
        url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2dOO4hMG98-j35ZHbdhglaeNCMZ4KGumJcoPb8RItz_moNFhZzE6CeY_5_Su973XHQGOB-yaeSn_nAuFUR0wJGyB5JwduvXjP2l6oOMopXRdJCQlog0frkVZA3CSXlABM6mDtjSxWamGmir4ILDPKX6NhQfDA9Bvp1DsS9B4jQ0Ud_Vo-teG-1Lo_XpLZ-505NLGYG3gHBWJ2M7B7PaeqiGJgEmFExdIjUJXPyuhwGpKrc-aSvZSB'
      }
    ]
  }
];

// AI Quick Suggestions Prompts
export const AI_SUGGESTION_PROMPTS = [
  {
    label: 'Quà mừng thọ 80 tuổi Ông Bà',
    templateId: 'heritage-ancestral',
    aiAdvice: 'Với dịp mừng thọ, chất liệu gỗ Walnut ấm áp kết hợp cùng tông ảnh ấm sepia sẽ mang lại cảm giác thân thương, gắn kết. Bạn có thể đính kèm lời chúc mừng thọ từ con cháu và các video sum họp gia đình ngày Tết.'
  },
  {
    label: 'Kỷ niệm 5 năm ngày cưới lãng mạn',
    templateId: 'mon-amour',
    aiAdvice: 'Chọn phong cách Mon Amour với màu hoàng hôn ngọt ngào, bố cục khung viền bảo tàng sang trọng. Khối đế gỗ Sồi trắng thanh lịch, khắc laser ngày hẹn ước đầu tiên và đính kèm 12 video ngắn từng chuyến đi của hai bạn.'
  },
  {
    label: 'Bàn làm việc tối giản & Thiền định',
    templateId: 'botanical-zen',
    aiAdvice: 'Mẫu Botanical Wabi-Sabi với gam xanh thảo mộc mát dịu, bố cục chia đôi tinh giản và chất liệu giấy mỹ thuật hạt mịn Eramo giúp hạ nhiệt căng thẳng trong không gian làm việc mỗi ngày.'
  },
  {
    label: 'Quà biếu Đối tác C-Suite cuối năm',
    templateId: 'executive-c-suite',
    aiAdvice: 'Phong cách Executive C-Suite thể hiện tầm nhìn và sự tín nhiệm tuyệt đối. Gỗ Walnut phay CNC dập chìm logo công ty, kết hợp clip WebAR lời chúc năm mới từ Tổng Giám Đốc tạo ấn tượng ngoại giao sâu sắc.'
  },
  {
    label: 'Bộ sưu tập công nghệ WebAR độc lạ',
    templateId: 'cyber-phygital',
    aiAdvice: 'Chọn Cyber Phygital với độ tương phản cao, tối ưu 842 điểm neo quang học trên máy in Heidelberg FOGRA39 giúp người xem quét WebAR 60FPS ngay tức thì với hiệu ứng thị giác mãn nhãn.'
  }
];
