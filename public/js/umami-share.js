(function (global) {
  const cacheKeyPrefix = 'umami-share-cache-';
  const cacheTTL = 3600000;
  const memory = new Map();
  const shareBaseCache = new Map();
  const sharePromiseCache = new Map();
  function safeGetItem(key) {
    try {
      return global.localStorage.getItem(key);
    } catch {
      return memory.get(key) || null;
    }
  }
  function safeSetItem(key, value) {
    try {
      global.localStorage.setItem(key, value);
    } catch {
      memory.set(key, value);
    }
  }
  function safeRemoveItem(key) {
    try {
      global.localStorage.removeItem(key);
    } catch {
      memory.delete(key);
    }
  }
  function normalizeBaseUrl(baseUrl) {
    return String(baseUrl || '').replace(/\/+$/, '');
  }
  async function discoverShareBase(baseUrl, shareId) {
    const base = normalizeBaseUrl(baseUrl);
    const cacheKey = `${base}::${shareId}`;
    if (shareBaseCache.has(cacheKey)) return shareBaseCache.get(cacheKey);
    if (base.includes('/analytics/')) {
      shareBaseCache.set(cacheKey, base);
      return base;
    }

    const regionCandidates = [
      `${base}/analytics/us`,
      `${base}/analytics/eu`,
      `${base}/analytics/ap`,
      `${base}/analytics/sg`,
      `${base}/analytics/au`,
      `${base}/analytics/ca`
    ];
    const isCloud = /(^|\/\/)cloud\.umami\.is(\/|$)/i.test(base) || /(^|\/\/)api\.umami\.is(\/|$)/i.test(base);
    const candidates = isCloud ? [...regionCandidates, base] : [base, ...regionCandidates];

    for (const candidate of candidates) {
      try {
        const res = await fetch(`${candidate}/api/share/${shareId}`);
        if (!res.ok) continue;
        const data = await safeReadJson(res);
        if (data && data.websiteId && data.token) {
          shareBaseCache.set(cacheKey, candidate);
          return candidate;
        }
      } catch {
      }
    }

    shareBaseCache.set(cacheKey, base);
    return base;
  }
  async function safeReadJson(res) {
    const contentType = (res.headers && res.headers.get && res.headers.get('content-type')) || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text().catch(() => '');
      const hint = text && text.toLowerCase().includes('login') ? 'Share is not public (login required)' : 'Unexpected response (not JSON)';
      throw new Error(hint);
    }
    return await res.json();
  }
  async function fetchShareData(baseUrl, shareId) {
    const base = normalizeBaseUrl(baseUrl);
    const key = cacheKeyPrefix + base + ':' + shareId;
    const cached = safeGetItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheTTL) {
          return parsed.value;
        }
      } catch {
        safeRemoveItem(key);
      }
    }
    const effectiveBase = await discoverShareBase(base, shareId);
    try {
      const res = await fetch(`${effectiveBase}/api/share/${shareId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch Umami share data: ' + res.status);
      }
      const data = await safeReadJson(res);
      safeSetItem(key, JSON.stringify({ timestamp: Date.now(), value: data }));
      return data;
    } catch (e) {
      throw e;
    }
  }
  global.getUmamiShareData = function (baseUrl, shareId) {
    const base = normalizeBaseUrl(baseUrl);
    const pkey = `${base}::${shareId}`;
    if (sharePromiseCache.has(pkey)) return sharePromiseCache.get(pkey);
    const p = fetchShareData(base, shareId).catch((err) => {
      sharePromiseCache.delete(pkey);
      throw err;
    });
    sharePromiseCache.set(pkey, p);
    return p;
  };
  global.clearUmamiShareCache = function (shareId) {
    const prefix = cacheKeyPrefix;
    try {
      const len = global.localStorage ? global.localStorage.length : 0;
      for (let i = len - 1; i >= 0; i--) {
        const k = global.localStorage.key(i);
        if (k && k.startsWith(prefix) && k.includes(':' + shareId)) {
          safeRemoveItem(k);
        }
      }
    } catch {
    }
    safeRemoveItem('umami-share-cache');
    for (const k of Array.from(sharePromiseCache.keys())) {
      if (k.endsWith('::' + shareId)) sharePromiseCache.delete(k);
    }
    for (const k of Array.from(shareBaseCache.keys())) {
      if (k.endsWith('::' + shareId)) shareBaseCache.delete(k);
    }
  };
  global.fetchUmamiStats = async function (baseUrl, shareId, queryParams) {
    async function doFetch(isRetry = false) {
      const base = normalizeBaseUrl(baseUrl);
      const effectiveBase = await discoverShareBase(base, shareId);
      const { websiteId, token } = await global.getUmamiShareData(effectiveBase, shareId);
      const currentTimestamp = Date.now();
      const params = new URLSearchParams({
        startAt: 0,
        endAt: currentTimestamp,
        timezone: 'Asia/Shanghai',
        compare: false,
        ...queryParams
      });
      const statsUrl = `${effectiveBase}/api/websites/${websiteId}/stats?${params.toString()}`;
      const res = await fetch(statsUrl, {
        headers: {
          'x-umami-share-token': token
        }
      });
      if (!res.ok) {
        if (res.status === 401 && !isRetry) {
          global.clearUmamiShareCache(shareId);
          return doFetch(true);
        }
        throw new Error('Failed to fetch Umami stats: ' + res.status);
      }
      return await safeReadJson(res);
    }
    return doFetch();
  };

  global.fetchUmamiMetricsExpanded = async function (baseUrl, shareId, queryParams) {
    async function doFetch(isRetry = false) {
      const base = normalizeBaseUrl(baseUrl);
      const effectiveBase = await discoverShareBase(base, shareId);
      const { websiteId, token } = await global.getUmamiShareData(effectiveBase, shareId);
      const currentTimestamp = Date.now();
      const params = new URLSearchParams({
        startAt: 0,
        endAt: currentTimestamp,
        type: 'path',
        timezone: 'Asia/Shanghai',
        ...queryParams
      });
      const url = `${effectiveBase}/api/websites/${websiteId}/metrics/expanded?${params.toString()}`;
      const res = await fetch(url, {
        headers: {
          'x-umami-share-token': token
        }
      });
      if (!res.ok) {
        if (res.status === 401 && !isRetry) {
          global.clearUmamiShareCache(shareId);
          return doFetch(true);
        }
        throw new Error('Failed to fetch Umami metrics: ' + res.status);
      }
      return await safeReadJson(res);
    }
    return doFetch();
  };
})(window);
