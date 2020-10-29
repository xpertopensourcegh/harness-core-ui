export default {
  duration: 'Duration: ',

  humanizeDuration: (w: number, d: number, h: number, m: number, s: number) => {
    // Note: when doing translation, map below keys. For example:
    // vi_VN: const map = { tuan: w, ngay: d, gio: h, phut: m, giay: s}
    // 1w 3d 5h 30m 15s (en_US) -> 1tuan 3ngay 5gio 30phut 15giay (vi_VN)
    const map = { w, d, h, m, s }
    return Object.keys(map)
      .filter(key => map[key as keyof typeof map])
      .map(key => `${map[key as keyof typeof map]}${key}`)
      .join(' ')
  }
}
