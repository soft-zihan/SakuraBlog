export function useRouting() {
  const updateUrl = (path: string | null) => {
    try {
      const url = new URL(window.location.href);
      if (path) {
        url.searchParams.set('path', path);
        url.searchParams.delete('lab');
        url.searchParams.delete('tab');
      } else {
        url.searchParams.delete('path');
      }
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.error("Failed to update URL", e);
    }
  };

  const updateLabUrl = (tab?: string) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lab', 'dashboard');
      if (tab) url.searchParams.set('tab', tab);
      else url.searchParams.delete('tab');
      url.searchParams.delete('path');
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.error('Failed to update lab URL', e);
    }
  };

  return {
    updateUrl,
    updateLabUrl
  };
}
