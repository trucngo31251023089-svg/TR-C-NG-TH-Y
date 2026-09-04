import { CalendarMonth, MemoryPost, OrderTicket } from '../types';

export const CALENDAR_MONTHS: CalendarMonth[] = [
  {
    monthNumber: 1,
    title: 'Tháng 01',
    theme: 'Khởi Sắc Đầu Năm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA51_sj7Y2pUGepOXq71lh6rq8zuldTW6g-AndzPb1oMk1F3k2NhXkZl5lr8BpPoulUmfjzLu1s7ncMWGuBJkRwYUWdKaV9a2q4x5KcwBwO2ov2t2N9iDxmqUWFzMyO0tehHMBoc2rHgjKYXPiIDkQ-IWRL_zjqPlXPUsgjJa5zOHzGYGpWrNtpB8CXId1XscJj4PmqMZUvyKaNENEVrB11bsidrnzQW950APWElsEMR1CEgGfRJcRN',
    arAccuracy: 99.4,
    arVideoTitle: 'BÌNH MINH HỒ TÂY - KHÁT VỌNG NIÊN MỚI',
    arVideoDuration: '03:15',
    audioActive: true,
    letterAuthor: 'Vũ Hoàng Mai Anh',
    letterSnippet: 'Nhìn lại hành trình 25 năm từ xưởng cơ khí đầu tiên đến biểu tượng hôm nay, em luôn biết ơn sự dẫn dắt kiên định của Anh Cả...'
  },
  {
    monthNumber: 2,
    title: 'Tháng 02',
    theme: 'Xuân Đoàn Viên',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIzonWICY5MxTO9rO-5FO7sMbx4oP4ZNRisHPXvamQx2oxaLw39IHaat_sNRI-34e2uxhiSDMluNTtSM9cxRBeGAOv2fYJ4PchROagI8ys9soVKxHu9GTibsCM6IVD4dcaF5df8PpVxnujM_zgKhEKWJxPBqKfMbNPdIru5nRF3j0BrR4oCU3pv5qF4QhFhkKZv1ots-PnLVStbGrvxgn4P5zpI1T8mGB-dzNy8dzjA_d3VoY1yM54',
    arAccuracy: 99.6,
    arVideoTitle: 'TIỆC TRÀ TẤT NIÊN GIA TỘC HOÀNG VŨ',
    arVideoDuration: '04:10',
    audioActive: true,
    letterAuthor: 'Bác Hai Hoàng Trọng',
    letterSnippet: 'Tết năm nay đại gia đình sum họp đủ 4 thế hệ, cội nguồn vững chắc để các cháu vươn xa.'
  },
  {
    monthNumber: 3,
    title: 'Tháng 03',
    theme: 'Mầm Xanh Vững Chắc',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvgteLPvaWeb57To4IojREj32HFeapHBKFVqW2WXmsSZKUd6mTzQort_CEVKZt-058YBBEkAAwJX2AFzCG0niMxPZmHEGXdND0vGbtltUJOwMnAWPDV3_eR_WkX1iB3QvJJQxTySNpwzMJHuB836q7gp5HMdSvcgt4oq8bdt6plmq7kq2MEOJZgqrxYVjUc3-weijnrWjRdFZTrJ-6Pjj9sjakIEsbVaC4i5ZHjb6b2__67ekjXjHr',
    arAccuracy: 99.9,
    arVideoTitle: 'RỪNG NGUYÊN SINH CÚC PHƯƠNG KỶ NIỆM',
    arVideoDuration: '02:55',
    audioActive: true,
    letterAuthor: 'Lê Thảo My',
    letterSnippet: 'Những tán lá non vươn mình trong sương sớm như ý chí quật cường của thế hệ trẻ.'
  },
  {
    monthNumber: 4,
    title: 'Tháng 04',
    theme: 'Đại Lễ & Kỷ Niệm',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSohbxRs9aojG0mPmzHCkQmh6ytHLOezO12v0TqDaTvimR3AZPsHcQxz71UfomoofixMJhvdUCmO0hW65cCQ6cf3Jr8Gr6qHpr_gjdMtFEuj2tBiK22vvBFzDFOnV654cOmIGqGVJvy3lQEJFKx-rLBoDKjSk5qilgSAM51mLbxtspC5DCIdBEoBS1i6xtL8itFSyT9nY8Vr68fKRw_2ID9zATrgKsdgNcxE-3gUdPJ11JUFhB6Nh1',
    arAccuracy: 98.9,
    arVideoTitle: 'BÁCH NIÊN GIA PHẢ & LỄ DÂNG HƯƠNG',
    arVideoDuration: '04:10',
    audioActive: true,
    letterAuthor: 'Hoàng Minh Quân',
    letterSnippet: 'Con kính chúc Bác luôn minh mẫn, an tĩnh và giữ trọn ngọn lửa đam mê...'
  },
  {
    monthNumber: 5,
    title: 'Tháng 05',
    theme: 'Đà Lạt 2024',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5fJ_dMwmndoFCcRLwf4ImildqnixkmIRy1n08pyNmcHy_-LjRUlqKIZgJlgC6VsbIIJP6cden-2bjIFxTweNFaYNXeY6HnQtVwDfuusvdN0l0HnwwHR0eEi9fJM29PbfB_Ek5jy0dkzA6uxFhtgpFU3gT2QB2f3ggKUCadGvQ17rmTEwCpIUkuMpFfwI1mGYyq8aYXUPe-pkXTSLPQinp5B9T4I8n0yFRPGKZWyw42Chkz94zV4j2',
    arAccuracy: 99.8,
    arVideoTitle: 'KHOÁNG ĐẠT ĐÀ LẠT - 2024',
    arVideoDuration: '04:20',
    audioActive: true,
    letterAuthor: 'M & K',
    letterSnippet: 'Gửi gia đình thân yêu, kỷ niệm 10 năm hành trình tại thung lũng... Từng ngọn đồi sương mai vẫn vẹn nguyên ấm áp như ngày đầu tiên chúng ta đặt chân tới.'
  },
  {
    monthNumber: 6,
    title: 'Tháng 06',
    theme: 'Hạ Hồng Viên Mãn',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7JpK0QF3C4XYFe9sn7qwDkCU4z6N3GOQNIgPdEAKlJTBfoN2IpXgsp0LkqJTxGj_EH_GQv-OXcIKmqDbSVZ7k1hoB4J5PMx0dD5BdnNvZ-WSh8qU6-9Gz32LYLD8O5P3av4WRXwInV9NYk_d9NuQwVPJsQdLqnfjqL81P5TxgGLheiQKfLDTQVRmt7Du8k_NuX7gBqb5sBzVnynPhuL4OEGbRLhGQ3b_aErb7eRx0A8DKSKyZqoJZ',
    arAccuracy: 99.7,
    arVideoTitle: 'HÀNH TRÌNH BIỂN PHÚ QUỐC HOÀNG HÔN',
    arVideoDuration: '03:40',
    audioActive: true,
    letterAuthor: 'Gia đình nhỏ Tuấn & Hà',
    letterSnippet: 'Tiếng sóng biển rì rào hòa cùng tiếng cười của bé Bơ trong chuyến đi biển đầu đời.'
  },
  {
    monthNumber: 7,
    title: 'Tháng 07',
    theme: 'Biển Xanh Sâu Lắng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZOxgyGfYerczQIHtCgFougznVHp2IWOrCQj-Og2N7nnBhbN-UsxjjlIKp6jiPS2sRXWZgbVUFqc-c2xjjd-3-4m9usgZq20-Q3r0wzt6vK-8jB3AOIUBthx2uRezXQZyxL8TbuhRGkQdc1GkqlzhSgGTYVfarXH0WifbSCSdhE1gV_7PuNdaXFTr_EWxEe4rkvVA7XNx6L9aCinvkDxoAxtY1mSiCvj0IuPIVfWnr3_Ho4WytM6aE',
    arAccuracy: 99.5,
    arVideoTitle: 'HỘI NGỘ BẠN CŨ NHA TRANG TRƯỜNG KỶ',
    arVideoDuration: '02:40',
    audioActive: false,
    letterAuthor: 'TS. Nguyễn Đăng Khoa',
    letterSnippet: 'Bốn mươi năm tình bạn như một cái chớp mắt, trân trọng từng phút giây hạnh ngộ.'
  },
  {
    monthNumber: 8,
    title: 'Tháng 08',
    theme: 'Thu Về Ấm Áp',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2dOO4hMG98-j35ZHbdhglaeNCMZ4KGumJcoPb8RItz_moNFhZzE6CeY_5_Su973XHQGOB-yaeSn_nAuFUR0wJGyB5JwduvXjP2l6oOMopXRdJCQlog0frkVZA3CSXlABM6mDtjSxWamGmir4ILDPKX6NhQfDA9Bvp1DsS9B4jQ0Ud_Vo-teG-1Lo_XpLZ-505NLGYG3gHBWJ2M7B7PaeqiGJgEmFExdIjUJXPyuhwGpKrc-aSvZSB',
    arAccuracy: 99.2,
    arVideoTitle: 'HƯƠNG CỐM HÀ NỘI & PHỐ CỔ CHIỀU THU',
    arVideoDuration: '03:10',
    audioActive: true,
    letterAuthor: 'Chị Mai Lan',
    letterSnippet: 'Mùi hoa sữa đầu mùa và chén trà sen ấm nóng giữa lòng phố cổ thanh bình.'
  },
  {
    monthNumber: 9,
    title: 'Tháng 09',
    theme: 'Sinh Nhật Chủ Tịch',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMNBbZX5_vi2EG0nHNH9FWx4CxzA45p7jGSDRqfvw1RikkVyIATIzfKagCjLrTkVDeC7kVwpS7k8HP9vEcC5EY50cI3baSE4Go6JlHQBdozjhuPVE9ETDFWYR8d7pikqntaWeS5cSKeLxvUkgkYRUus-ku-a3FrzkSYO7A97n7W2qx-FWTADQlEpZVML6YGB_vzLQY-PERtT3BnPhUzgifWZyJvADqRBkakxRShgvYNk3guAbHNp6O',
    arAccuracy: 99.8,
    arVideoTitle: 'CHÚC THỌ 65 TUỔI HỒ GENEVA THỤY SĨ',
    arVideoDuration: '05:00',
    audioActive: true,
    letterAuthor: 'GS. Đặng Tuấn Thành',
    letterSnippet: 'Tặng Anh bài thơ cảm tác trong lần hội ngộ tại hồ Geneva. Chúc người bạn tri kỷ tuổi 65 tâm cảnh thanh lương...'
  },
  {
    monthNumber: 10,
    title: 'Tháng 10',
    theme: 'Khởi Công Dự Án',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDX1DInEw6PbI9IKThiRviLLvupeSPfpVEjGkxFE53c3VjjYjIrhDsNWLb1BO_g6m8XO2XZzv1rFwGm7W0MTpVpSac5pEGZT0c7Nw0BkllSZtEX9uZjiSC7gDRenmVpbigmD-SG9SSdBYpENQ4_7YS2qatOrNyXWOqCwjw-3EQD1P0xIP4qCZvkyze2hmT4sBvBBCU6vay5gpukhuIVVklap6kH4IvenBIKH-LJH-tm8wvkxtO5t5s',
    arAccuracy: 99.3,
    arVideoTitle: 'ĐẶT VIÊN ĐÁ ĐẦU TIÊN TÒA THÁP DI SẢN',
    arVideoDuration: '03:30',
    audioActive: true,
    letterAuthor: 'Ban Điều Hành Dự Án',
    letterSnippet: 'Một dấu mốc kiến trúc mới ghi dấu ấn của tập đoàn trên bầu trời thủ đô.'
  },
  {
    monthNumber: 11,
    title: 'Tháng 11',
    theme: 'Đêm Hội Tri Ân',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlbnslZWw2Leq5wnOo12lOOnR2JhYMg8kiwCPGQQGBQeK8NN87mhrYy6Rl52B5X8wfs1UWRfis-UlF09GZ8mJelnda3T71rtzRaMdE7HPUElgqmQBai9rgli248wPkK4vpU9UC727ZCIA2Er7r0-qYIHFIbfcFB63nzV82C4qAxG98ez9V9iL9UXEUhPZZdgRC0pgPnYwJSzV48iVtErMlMQOSX10yxKCaauzez28x-IkbvebL_haN',
    arAccuracy: 99.6,
    arVideoTitle: 'DẠ TIỆC TƠ TẰM & KHẮC TÊN TRI ÂN',
    arVideoDuration: '04:15',
    audioActive: true,
    letterAuthor: 'Nguyễn Hoàng Bảo Long',
    letterSnippet: 'Kính tặng Người Cha kính yêu, ngọn hải đăng soi sáng từng bước đi của chúng con.'
  },
  {
    monthNumber: 12,
    title: 'Tháng 12',
    theme: 'Đoàn Tụ Huy Hoàng',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8lHOeNQ9g87caPr6QZTkT2SKgbWRDZNNVtBSpwfsIXqiDoHb8gjcanCOey_I0hqjQMjunj_G2HlOTTOFVxHHfzgpA9t1xyuGbou7u9otdC7o65j7LFdeapZ3GJKGhzmy24azAWUPOdu8pfUL59N8mSDRMBwEFCVFJrNSQiL70uUMOEtjAaRM38GDaegpZrX_loXkmnXg3m5fe3lAHX2ttaIeOPquUjcEDVZfYAIcMaBs5olokP2UE',
    arAccuracy: 99.9,
    arVideoTitle: 'GIA ĐÌNH ĐÓN CHÀO NĂM MỚI 2025',
    arVideoDuration: '04:50',
    audioActive: true,
    letterAuthor: 'Đại Gia Đình Hoàng Vũ',
    letterSnippet: '365 ngày khép lại trọn vẹn, mở ra chương mới với phúc lộc an khang và vạn sự viên thành.'
  }
];

export const CURRENT_ORDER: OrderTicket = {
  id: '#LUMI-8829-VN',
  customerName: 'Bùi Hoàng Nam',
  membershipLevel: 'Atelier Membership Elite • Khắc Laser Chữ Ký',
  editionName: 'Gỗ Óc Chó Walnut Bắc Mỹ',
  woodBase: 'Khối đế phay CNC nguyên khối sáp ong organic',
  finishDetail: 'Tỷ trọng: 680g • Kèm khay cắm bút titan',
  dimensions: '16 x 24 cm (Khổ đứng Portrait)',
  paperStock: 'Eramo 300gsm Cotton Archival Ý',
  bleed: '2.0 mm (Đường cấn chính xác)',
  coating: '27µ Bopp (Mờ quang học chống lóa)',
  cmykDeltaE: 'Delta E < 0.84 (Chuẩn Bảo Tàng FOGRA39)',
  price: 1850000,
  timestamp: '14:28:05 — 24/10/2025',
  status: 'Đang chuẩn bị in'
};

export const MEMORY_POSTS: MemoryPost[] = [
  {
    id: 'mem-1',
    author: 'Vũ Hoàng Mai Anh',
    role: 'Phó Chủ Tịch Tập Đoàn • Em Gái',
    month: 1,
    monthTitle: 'THÁNG 01',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTOGQ3RLqqvtCrfAWyD3g6_MNOKZQyvHuXVy4rlM7a8fD7dxf24kRL19ZqP7Jg4cUm8kAC8WKK4aMfsI8YpAKzug6ZQTg-OcUQVimdJThZoh_37SsHE6rFw1zjkE4I8wq8PqeOUHq_CF5PdF_tJp-zpuKMaSj8oituBvHhMGSPt_pmSeEpD8SppRenJl0blzNdPm8lP0dt7A15JsD5svAHMqWQ3fF99V96oerBojeVgzh0rkrLlhtP',
    quote: '“Nhìn lại hành trình 25 năm từ xưởng cơ khí đầu tiên đến biểu tượng vươn tầm quốc tế hôm nay, em luôn biết ơn sự dẫn dắt kiên định và tấm lòng bao dung của Anh Cả đối với cả đại gia đình...”',
    mediaType: 'audio',
    mediaMeta: '02:14 Audio',
    timestamp: 'Hôm qua, 18:42',
    e2eeVerified: true
  },
  {
    id: 'mem-2',
    author: 'Hoàng Minh Quân',
    role: 'Đại diện Thế Hệ Kế Thừa Gen Z',
    month: 4,
    monthTitle: 'THÁNG 04',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDzfQQrX1fCpbmFRZgz2gUv2vExBJjfFDLI35qYYWTACip6XcvvrCutRR2JQ3726FoB2NgWeo4BUcA_YJEn3cycrZGP7lQcHR_npOnlXE8kXi4BehIRhG06_5c8wBMGb1b90LPPv-xSA5pfMTMlA8SfaKGMUa6v09s3oh8QWzdrQl4sQ_rMa7hMYq6MY8c1-msmk_jb-n06B-d3zz2lrZqBl_FwhGYrMXBhiCSwIHQKY98Qt4V6HYa',
    quote: '“Con kính chúc Bác luôn minh mẫn, an tĩnh và giữ trọn ngọn lửa đam mê. Thước phim ngắn này là lời chúc chân thành từ toàn bộ các cháu tại London gửi về Bác và đại gia đình...”',
    mediaType: 'video',
    mediaMeta: 'Video 4K (04:10)',
    timestamp: '22/12/2024',
    e2eeVerified: true
  },
  {
    id: 'mem-3',
    author: 'GS. Đặng Tuấn Thành',
    role: 'Viện Hàn Lâm • Bạn Thâm Giao',
    month: 9,
    monthTitle: 'THÁNG 09',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDu-5mt3vItH9cH5I5R2lUdVmlm1Jw_p5IZ7j1XO4kQd_QS41dgdhCiqL8H5fFCe8TSZkqcxyas61ZEtSRdk5wIHvqdwHg_yGYzjEzfP0jR2mHsv2EVFhbabuz7Tlbprs-W4tEDHQghRA1iBYNYn24ARKjkG7SP-sg6e4hAPOy6I8CwMvMj1BOdnkmNtkDLj_ZzzZ8f_vnPWNQLjUsqKJbC2I-sCAhiCD3PdI9jInKYNhMagaXVTR_U',
    quote: '“Tặng Anh bài thơ cảm tác trong lần hội ngộ tại hồ Geneva. Chúc người bạn tri kỷ tuổi 65 tâm cảnh thanh lương, thân tâm thường an lạc như tùng bách giữa non ngàn.”',
    mediaType: 'text',
    mediaMeta: 'Bút Ký Sưu Tập',
    timestamp: '21/12/2024',
    e2eeVerified: true
  }
];

export const BRAND_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1WZRQDG9ZPkq0Y0getKNy_q0SZPBBpg3s_hc8BZ8u6sofVkKPTVy5bIzrF-cSgT5jzKwuck7xjuvVqbe3kb1NawJlHFpaClRzKF6TtuKm8XVpOspE0dVnnmzscjX-BKFaxCSYjqpFJ6hePqmwvynlAw1RRTHnegdsYsRsm3eoNDQXs7qbEWhHqjEUp3_c54DWJP2fDwSfRiLunYpmGnwkglhj17szWUwyyx-o-YS63TqVQMahIGkqW_CQ';
export const USER_AVATAR_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1XIaJ7YWEYvnDtL6BfZAydnHZ_7LAw2yP6rdwJh3fLwG8hFmtYV80rOZa2LPN42TwX4ioBeRvp3ok9xMZ92-yMXgKlf-d_c1atQl6lXTvAe4hXtJTBYY3CYzdzoz8LpS_vPby8BhvLexRQFfXjgu-IBk0wDPqN1oHdqFhPouW1cMnWg2il1YT5OYcA2_o9fSulcn7Sc3ujRuZ6qOsmtqnDyKIqEa1njqW5O23ar7X4hzKiUGVOTgf4F8fw';
