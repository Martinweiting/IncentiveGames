/* player.js — Martin's World 共用玩家模組
 * 暱稱存於 localStorage('mc_nickname')
 * 餘額存於 localStorage('mc_chips_<暱稱>')，每人獨立
 */
const MC = (() => {
  const NICK_KEY = 'mc_nickname';
  const balKey   = n => 'mc_chips_' + n;

  function getNickname() { return localStorage.getItem(NICK_KEY) || ''; }
  function setNickname(name) { localStorage.setItem(NICK_KEY, name.trim()); }

  function loadBalance() {
    const nick = getNickname();
    if (!nick) return 1000;
    const v = +localStorage.getItem(balKey(nick));
    return v > 0 ? v : 1000;
  }

  function saveBalance(n) {
    const nick = getNickname();
    if (!nick) return;
    localStorage.setItem(balKey(nick), Math.max(0, Math.round(n)));
  }

  return { getNickname, setNickname, loadBalance, saveBalance };
})();
