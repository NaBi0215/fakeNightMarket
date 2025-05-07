export const NightMarketConfig = {
  // 路由
  projectRoute: 'lobby/nightMarket/',

  // 個人主頁大頭照
  personalImgUrl:
    'https://multi-cdn.cg11pro.com/resource/prism/front/gameLobby/ui/personal.png',

  // 熱門遊戲預設
  selectedGameCategory: 'popular',

  // 商城預設
  selectedCategory: 'coins',

  // 遊戲中英文翻譯
  classMapping: {
    slot: '老虎機',
    mini: '小遊戲',
    popular: '熱門遊戲',
    newest: '最新遊戲',
    others: '其他',
  } as { [key: string]: string },
};
