export interface BankInfo {
  id: string;
  name: string;
  shortName: string;
  bin: string;
  logo: string;
}

export const VIETNAM_BANKS: BankInfo[] = [
  {
    id: 'TCB',
    name: 'Ngân hàng TMCP Kỹ Thương Việt Nam',
    shortName: 'Techcombank',
    bin: '970407',
    logo: 'https://api.vietqr.io/img/TCB.png'
  },
  {
    id: 'VCB',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    shortName: 'Vietcombank',
    bin: '970436',
    logo: 'https://api.vietqr.io/img/VCB.png'
  },
  {
    id: 'MB',
    name: 'Ngân hàng TMCP Quân Đội',
    shortName: 'MBBank',
    bin: '970422',
    logo: 'https://api.vietqr.io/img/MB.png'
  },
  {
    id: 'ACB',
    name: 'Ngân hàng TMCP Á Châu',
    shortName: 'ACB',
    bin: '970416',
    logo: 'https://api.vietqr.io/img/ACB.png'
  },
  {
    id: 'TPB',
    name: 'Ngân hàng TMCP Tiên Phong',
    shortName: 'TPBank',
    bin: '970423',
    logo: 'https://api.vietqr.io/img/TPB.png'
  },
  {
    id: 'VPB',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    shortName: 'VPBank',
    bin: '970432',
    logo: 'https://api.vietqr.io/img/VPB.png'
  },
  {
    id: 'BIDV',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    shortName: 'BIDV',
    bin: '970418',
    logo: 'https://api.vietqr.io/img/BIDV.png'
  },
  {
    id: 'CTG',
    name: 'Ngân hàng TMCP Công Thương Việt Nam',
    shortName: 'VietinBank',
    bin: '970415',
    logo: 'https://api.vietqr.io/img/ICB.png'
  },
  {
    id: 'VIB',
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
    shortName: 'VIB',
    bin: '970441',
    logo: 'https://api.vietqr.io/img/VIB.png'
  },
  {
    id: 'STB',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    shortName: 'Sacombank',
    bin: '970403',
    logo: 'https://api.vietqr.io/img/STB.png'
  },
  {
    id: 'OCB',
    name: 'Ngân hàng TMCP Phương Đông',
    shortName: 'OCB',
    bin: '970448',
    logo: 'https://api.vietqr.io/img/OCB.png'
  },
  {
    id: 'HDB',
    name: 'Ngân hàng TMCP Phát triển TP.HCM',
    shortName: 'HDBank',
    bin: '970437',
    logo: 'https://api.vietqr.io/img/HDB.png'
  }
];

export interface BankAccountConfig {
  bankId: string;
  bankName: string;
  bin: string;
  accountNumber: string;
  accountName: string;
}

export const DEFAULT_BANK_ACCOUNT: BankAccountConfig = {
  bankId: 'TCB',
  bankName: 'Techcombank',
  bin: '970407',
  accountNumber: '190388298888',
  accountName: 'CTCP XUONG CHE TAC LUMICAL'
};

export const generateVietQrUrl = (
  binOrBankId: string,
  accountNumber: string,
  amount: number,
  orderCode: string,
  accountName: string
): string => {
  // Format standard VietQR NAPAS 247 quick link
  const cleanAcc = accountNumber.replace(/\s+/g, '');
  const cleanName = encodeURIComponent(accountName.trim());
  const cleanCode = encodeURIComponent(orderCode.trim());
  return `https://img.vietqr.io/image/${binOrBankId}-${cleanAcc}-compact2.png?amount=${amount}&addInfo=${cleanCode}&accountName=${cleanName}`;
};
