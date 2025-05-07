export const ApiRoutes = {
  launch: 'launch',
  getMarqueeList: 'marquee/list/get',
  getGameFavorite: 'game/favorite/get',
  getLuckyEggGift: 'lucky/egg/gift/get',
  playerLogin: 'player/login',
  playerLogout: 'player/logout',
  playerRegister: 'player/register',

  // nav-bar組件
  getMenuNotify: 'menu/notify/get',
  // lamp-ball組件
  getDailyLoginList: 'daily/login/list/get',
  refillDailyLogin: 'daily/login/refill',
  getDailyLoginGift: 'daily/login/gift/get',
  // purse組件
  getPlayerBalance: 'player/balance/get',
  // games組件
  getGameLobbyLayout: 'game/lobby/layout/get',
  getGameLobbyList: 'game/lobby/list/get',
  GameFavoriteUpdate: 'game/favorite/update',
  gameLaunch: 'game/launch',
  gameDemoLaunch: 'game/demo/launch',
  // event(task)組件
  getTaskList: 'task/list/get',
  receiveTaskGift: 'task/gift/receive',
  getTaskRecord: 'task/record/get',
  // game-record組件
  withdrawRecordPreview: 'withdraw/record/preview',
  // personal組件
  getPlayerProfiles: 'player/profiles/get',
  playerProfilesUpdate: 'player/profiles/update',
  editPlayerProfilesPhone: 'player/profiles/phone/edit',
  getSnsVerification: 'sns/verification/get',
  playerVerifyGet: 'player/verify/get',
  playerProfilesPasswordEdit: 'player/profiles/password/edit',
  playerProfilesPasswordReset: 'player/profiles/password/reset',
  // shopping組件
  getShoppingMallLayout: 'shoppingMall/layout/get',
  getShoppingMallList: 'shoppingMall/list/get',
  buyShoppingMallGoods: 'shoppingMall/goods/buy',

  // 確認真的用不到可以刪掉
  // getPlayerPhoneVerify: 'player/phone/verify/get',
  // playerPhoneBind: 'player/phone/bind',
  // playerEmailBind: 'player/email/bind',
};
