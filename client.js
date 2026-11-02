/**
 * Background image: a frame-wide surface layer plus the Plugins settings page
 * that owns its image, opacity and blur. The layer paints behind the whole
 * application; the host theme tokens keep every control's layout untouched.
 */
window.__ModuleLoader__.load({
  id: '@asukaq01/dsh-background-image',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'settings.backgroundImage';
    const PKG = '@asukaq01/dsh-background-image';
    const ROW_ID = 'background-image';
    const IMAGE_KEY = 'dsh.background-image.image.v1';
    const SETTINGS_KEY = 'dsh.background-image.settings.v1';
    const STYLE_MARK = 'dsh-background-image:layer';
    const DEFAULT_OPACITY = 55;
    const DEFAULT_BLUR = 14;
    const MAX_IMAGE_CHARS = 1500000;

    const zh = {
      tab: '背景图',
      title: '背景图',
      intro: '为界面添加一张自定义背景图。只改变外观，不改变任何控件的位置和尺寸。',
      summary: '自定义界面背景图，可调不透明度与虚化程度。',
      choose: '选择图片',
      replace: '更换图片',
      remove: '移除背景',
      processing: '正在处理…',
      emptyTitle: '还没有背景图',
      emptyHint: '点击「选择图片」，或把图片拖到这里。支持 JPG、PNG、WebP、GIF。',
      opacity: '背景不透明度',
      blur: '虚化程度',
      sliderHint: '不透明度 0% 完全隐藏、100% 完全显示；虚化让背景更柔和。',
      hint: '图片会自动压缩并保存在本机浏览器中，不会上传到服务器。',
      savedNote: '已保存在本机 · {size}',
      previewLabel: '当前背景图预览',
      invalidImage: '无法读取这张图片，请换一张试试。',
      storageError: '图片太大，无法保存到本机存储。请换一张更小的图片。'
    };

    const en = {
      tab: 'Background',
      title: 'Background image',
      intro: 'Add a custom image behind the interface. Only the appearance changes; no control moves or resizes.',
      summary: 'Custom UI background image with adjustable opacity and blur.',
      choose: 'Choose image',
      replace: 'Replace image',
      remove: 'Remove',
      processing: 'Processing…',
      emptyTitle: 'No background image yet',
      emptyHint: 'Click “Choose image” or drop a file here. JPG, PNG, WebP and GIF are supported.',
      opacity: 'Background opacity',
      blur: 'Blur',
      sliderHint: 'Opacity 0% hides the image and 100% shows it fully; blur softens it.',
      hint: 'The image is compressed and stored in this browser only; it is never uploaded.',
      savedNote: 'Saved locally · {size}',
      previewLabel: 'Current background preview',
      invalidImage: 'This image could not be read. Try another file.',
      storageError: 'The image is too large for local storage. Try a smaller file.'
    };

    const CSS = `
html.dshbg-on {
  background-color: #ffffff;
}
html.dshbg-on:has(body[data-ds-dark-theme]) {
  background-color: #151517;
}
html.dshbg-on body::before {
  content: "";
  position: fixed;
  inset: -180px;
  z-index: -1;
  pointer-events: none;
  background-color: rgb(var(--dshbg-canvas-rgb, 255 255 255));
  background-image:
    linear-gradient(
      rgb(var(--dshbg-veil-rgb, 255 255 255) / var(--dshbg-veil-alpha, 0.6)),
      rgb(var(--dshbg-veil-rgb, 255 255 255) / var(--dshbg-veil-alpha, 0.6))
    ),
    var(--dshbg-image, none);
  background-position: center, center;
  background-size: cover, cover;
  background-repeat: no-repeat, no-repeat;
  filter: blur(var(--dshbg-blur, 0px));
  transform: translateZ(0);
}
html.dshbg-on body {
  --dshbg-canvas-rgb: 255 255 255;
  --dshbg-veil-rgb: 255 255 255;
}
html.dshbg-on body[data-ds-dark-theme] {
  --dshbg-canvas-rgb: 21 21 23;
  --dshbg-veil-rgb: 21 21 23;
}
.dshbg-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 760px;
  color: var(--dsw-alias-label-primary);
}
.dshbg-title {
  margin: 0;
  font-size: 15px;
  line-height: 23px;
  font-weight: 600;
}
.dshbg-desc {
  margin: 4px 0 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 13px;
  line-height: 20px;
}
.dshbg-card {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: .5px solid var(--dsw-alias-settings-card-stroke, var(--dsw-alias-border-l3));
  border-radius: var(--dsw-radius-xl, 16px);
  background: var(--dsw-alias-settings-card-fill, var(--dsw-alias-bg-layer-1));
}
.dshbg-preview {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 16 / 7;
  min-height: 120px;
  overflow: hidden;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-lg, 12px);
  background: var(--dsw-alias-bg-layer-2);
}
.dshbg-preview[data-empty="true"] {
  display: grid;
  place-items: center;
  border-style: dashed;
  border-color: var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
}
.dshbg-preview[data-dragging="true"] {
  border-color: var(--dsw-alias-brand-primary);
}
.dshbg-previewImage {
  position: absolute;
  inset: -24px;
  background-position: center;
  background-size: cover;
}
.dshbg-previewVeil {
  position: absolute;
  inset: 0;
  background: rgb(var(--dshbg-veil-rgb, 255 255 255) / var(--dshbg-veil-alpha, .6));
}
.dshbg-previewBadge {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 80%, transparent);
  backdrop-filter: blur(6px);
  font-size: 12px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}
.dshbg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 16px;
  text-align: center;
}
.dshbg-emptyTitle {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
  font-weight: 500;
}
.dshbg-emptyHint {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  max-width: 420px;
}
.dshbg-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.dshbg-button {
  box-sizing: border-box;
  height: 32px;
  padding: 0 12px;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: var(--dsw-radius-sm, 8px);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
}
.dshbg-button:hover:not(:disabled) {
  background: var(--dsw-alias-interactive-bg-hover, var(--dsw-alias-bg-layer-2));
}
.dshbg-button:focus-visible {
  outline: var(--dsw-focus-ring-width, 2px) solid var(--dsw-focus-ring-color, var(--dsw-alias-brand-primary));
  outline-offset: 1px;
}
.dshbg-button[data-kind="primary"] {
  border-color: transparent;
  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary));
  color: var(--dsw-alias-label-primary-inverted, #fff);
}
.dshbg-button[data-kind="primary"]:hover:not(:disabled) {
  background: var(--dsw-alias-button-primary-hover, var(--dsw-alias-brand-primary));
}
.dshbg-button:disabled {
  opacity: .5;
  cursor: default;
}
.dshbg-file {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
.dshbg-controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dshbg-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 6px 12px;
}
.dshbg-controlLabel {
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
  line-height: 20px;
}
.dshbg-controlValue {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}
.dshbg-range {
  grid-column: 1 / -1;
  width: 100%;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}
.dshbg-range:disabled {
  cursor: default;
  opacity: .45;
}
.dshbg-note {
  margin: 0;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dshbg-error {
  margin: 0;
  color: var(--dsw-alias-state-error-primary);
  font-size: 12px;
  line-height: 18px;
}
`;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function readStorage(key) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    }

    function writeStorage(key, value) {
      window.localStorage.setItem(key, value);
    }

    function dropStorage(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* A blocked storage backend leaves the in-memory state in charge. */
      }
    }

    function normalizeSettings(raw) {
      const source = raw && typeof raw === 'object' ? raw : {};
      const opacity = typeof source.opacity === 'number' && Number.isFinite(source.opacity)
        ? clamp(Math.round(source.opacity), 0, 100)
        : DEFAULT_OPACITY;
      const blur = typeof source.blur === 'number' && Number.isFinite(source.blur)
        ? clamp(Math.round(source.blur), 0, 40)
        : DEFAULT_BLUR;
      return { opacity, blur };
    }

    function loadImageRecord() {
      const raw = readStorage(IMAGE_KEY);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.data !== 'string' || !parsed.data.startsWith('data:image/')) return null;
        return {
          data: parsed.data,
          width: Number(parsed.width) > 0 ? Math.round(Number(parsed.width)) : 0,
          height: Number(parsed.height) > 0 ? Math.round(Number(parsed.height)) : 0,
          bytes: Number(parsed.bytes) > 0 ? Math.round(Number(parsed.bytes)) : 0
        };
      } catch {
        return null;
      }
    }

    function loadSettings() {
      const raw = readStorage(SETTINGS_KEY);
      if (!raw) return normalizeSettings(null);
      try {
        return normalizeSettings(JSON.parse(raw));
      } catch {
        return normalizeSettings(null);
      }
    }

    /** Map the opacity control onto the theme-coloured veil over the photo. */
    function veilAlpha(opacity) {
      return 1 - 0.8 * (clamp(opacity, 0, 100) / 100);
    }

    function formatBytes(bytes) {
      if (!Number.isFinite(bytes) || bytes <= 0) return '';
      if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function createStore() {
      let state = { ...loadSettings(), image: loadImageRecord() };
      const listeners = new Set();
      const emit = () => {
        for (const listener of [...listeners]) {
          try {
            listener();
          } catch {
            /* One broken subscriber must not stop the layer from following. */
          }
        }
      };
      return {
        get() {
          return state;
        },
        subscribe(listener) {
          listeners.add(listener);
          return () => {
            listeners.delete(listener);
          };
        },
        setSettings(patch) {
          const next = normalizeSettings({ ...state, ...patch });
          state = { ...state, opacity: next.opacity, blur: next.blur };
          try {
            writeStorage(SETTINGS_KEY, JSON.stringify({ opacity: next.opacity, blur: next.blur }));
          } catch {
            /* The visual change still applies for this session. */
          }
          emit();
        },
        setImage(record) {
          try {
            writeStorage(IMAGE_KEY, JSON.stringify(record));
          } catch {
            const error = new Error('storage');
            error.code = 'storage';
            throw error;
          }
          state = { ...state, image: record };
          emit();
        },
        clearImage() {
          dropStorage(IMAGE_KEY);
          state = { ...state, image: null };
          emit();
        }
      };
    }

    function loadImageElement(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('decode'));
        };
        image.src = url;
      });
    }

    function canvasDataUrl(canvas, quality) {
      let data = canvas.toDataURL('image/webp', quality);
      if (!data.startsWith('data:image/webp')) data = canvas.toDataURL('image/jpeg', quality);
      return data;
    }

    /** Downscale and re-encode an uploaded file until it fits the local store. */
    async function prepareImage(file) {
      if (!file || typeof file.type !== 'string' || !file.type.startsWith('image/')) {
        throw new Error('type');
      }
      const image = await loadImageElement(file);
      let width = image.naturalWidth || image.width || 0;
      let height = image.naturalHeight || image.height || 0;
      if (width <= 0 || height <= 0) {
        width = 1600;
        height = 900;
      }

      const attempts = [
        { max: 2560, quality: 0.86 },
        { max: 1920, quality: 0.82 },
        { max: 1440, quality: 0.78 }
      ];
      let record = null;
      for (const attempt of attempts) {
        const scale = Math.min(1, attempt.max / Math.max(width, height));
        const canvasWidth = Math.max(1, Math.round(width * scale));
        const canvasHeight = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('canvas');
        context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        const data = canvasDataUrl(canvas, attempt.quality);
        const base64 = data.slice(data.indexOf(',') + 1);
        record = {
          data,
          width: canvasWidth,
          height: canvasHeight,
          bytes: Math.round((base64.length * 3) / 4)
        };
        if (data.length <= MAX_IMAGE_CHARS) break;
      }
      if (!record || !record.data) throw new Error('encode');
      return record;
    }

    /** Resolve the initial surface, the settings page, and the row page. */
    function apply(ctx) {
      const t = ctx.locale.bind(NS);
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'background image: dictionaries');

      const store = createStore();

      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {};
        const root = document.documentElement;
        const style = document.createElement('style');
        style.dataset.plugin = PKG;
        style.dataset.dshBackgroundImage = STYLE_MARK;
        style.textContent = CSS;
        document.head.appendChild(style);

        let tokenDispose = null;
        const sync = () => {
          const snapshot = store.get();
          if (snapshot.image && snapshot.image.data) {
            root.classList.add('dshbg-on');
            root.style.setProperty('--dshbg-image', `url("${snapshot.image.data}")`);
            root.style.setProperty('--dshbg-blur', `${snapshot.blur}px`);
            root.style.setProperty('--dshbg-veil-alpha', String(veilAlpha(snapshot.opacity)));
            if (!tokenDispose) {
              tokenDispose = ctx.theme.overrideTokens(PKG, {
                '--dsw-alias-bg-base': { light: 'transparent', dark: 'transparent' },
                '--dsw-specific-sidebar-fill': { light: 'transparent', dark: 'transparent' }
              });
            }
          } else {
            root.classList.remove('dshbg-on');
            root.style.removeProperty('--dshbg-image');
            root.style.removeProperty('--dshbg-blur');
            root.style.removeProperty('--dshbg-veil-alpha');
            if (tokenDispose) {
              tokenDispose();
              tokenDispose = null;
            }
          }
        };

        sync();
        const unsubscribe = store.subscribe(sync);

        return () => {
          unsubscribe();
          if (tokenDispose) tokenDispose();
          root.classList.remove('dshbg-on');
          root.style.removeProperty('--dshbg-image');
          root.style.removeProperty('--dshbg-blur');
          root.style.removeProperty('--dshbg-veil-alpha');
          style.remove();
        };
      }, 'background image: surface layer');

      function useSnapshot() {
        const [snapshot, setSnapshot] = React.useState(store.get);
        React.useEffect(() => store.subscribe(() => setSnapshot(store.get())), []);
        return snapshot;
      }

      function RangeControl(props) {
        return h('div', { className: 'dshbg-control' },
          h('label', { className: 'dshbg-controlLabel', htmlFor: props.id }, props.label),
          h('span', { className: 'dshbg-controlValue' }, props.value),
          h('input', {
            id: props.id,
            className: 'dshbg-range',
            type: 'range',
            min: props.min,
            max: props.max,
            step: props.step,
            value: props.current,
            disabled: props.disabled,
            onChange: (event) => props.onChange(Number(event.target.value))
          })
        );
      }

      function BackgroundForm(props) {
        const translate = props.t || t;
        const snapshot = useSnapshot();
        const [busy, setBusy] = React.useState(false);
        const [error, setError] = React.useState(null);
        const [dragging, setDragging] = React.useState(false);
        const inputRef = React.useRef(null);

        const handleFiles = async (fileList) => {
          const file = fileList && fileList[0];
          if (!file) return;
          setError(null);
          setBusy(true);
          try {
            const record = await prepareImage(file);
            store.setImage(record);
          } catch (failure) {
            setError(failure && failure.code === 'storage' ? translate('storageError') : translate('invalidImage'));
          } finally {
            setBusy(false);
          }
        };

        const onPick = (event) => {
          const file = event.target.files && event.target.files[0];
          event.target.value = '';
          if (file) handleFiles([file]);
        };

        const onDrop = (event) => {
          event.preventDefault();
          setDragging(false);
          if (event.dataTransfer && event.dataTransfer.files) handleFiles(event.dataTransfer.files);
        };

        const preview = snapshot.image
          ? [
            h('div', {
              key: 'image',
              className: 'dshbg-previewImage',
              style: {
                backgroundImage: `url("${snapshot.image.data}")`,
                filter: `blur(${Math.min(snapshot.blur, 24)}px)`
              }
            }),
            h('div', { key: 'veil', className: 'dshbg-previewVeil' }),
            snapshot.image.width > 0 && snapshot.image.height > 0
              ? h('span', { key: 'badge', className: 'dshbg-previewBadge' }, `${snapshot.image.width} × ${snapshot.image.height}`)
              : null
          ]
          : h('div', { className: 'dshbg-empty' },
            h('span', { className: 'dshbg-emptyTitle' }, translate('emptyTitle')),
            h('span', { className: 'dshbg-emptyHint' }, translate('emptyHint'))
          );

        return h('div', { className: 'dshbg-card' },
          h('div', {
            className: 'dshbg-preview',
            'data-empty': snapshot.image ? 'false' : 'true',
            'data-dragging': dragging ? 'true' : 'false',
            'aria-label': translate('previewLabel'),
            onDragOver: (event) => {
              event.preventDefault();
              if (!dragging) setDragging(true);
            },
            onDragLeave: (event) => {
              event.preventDefault();
              const related = event.relatedTarget;
              if (!(related instanceof Node) || !event.currentTarget.contains(related)) setDragging(false);
            },
            onDrop
          }, preview),
          h('div', { className: 'dshbg-actions' },
            h('input', {
              ref: inputRef,
              className: 'dshbg-file',
              type: 'file',
              accept: 'image/*',
              tabIndex: -1,
              'aria-hidden': true,
              onChange: onPick
            }),
            h('button', {
              type: 'button',
              className: 'dshbg-button',
              'data-kind': 'primary',
              disabled: busy,
              onClick: () => {
                if (inputRef.current) inputRef.current.click();
              }
            }, busy ? translate('processing') : snapshot.image ? translate('replace') : translate('choose')),
            snapshot.image
              ? h('button', {
                type: 'button',
                className: 'dshbg-button',
                disabled: busy,
                onClick: () => {
                  setError(null);
                  store.clearImage();
                }
              }, translate('remove'))
              : null
          ),
          error ? h('p', { className: 'dshbg-error', role: 'alert' }, error) : null,
          h('div', { className: 'dshbg-controls' },
            h(RangeControl, {
              id: 'dshbg-opacity',
              label: translate('opacity'),
              value: `${snapshot.opacity}%`,
              min: 0,
              max: 100,
              step: 1,
              current: snapshot.opacity,
              disabled: !snapshot.image,
              onChange: (value) => store.setSettings({ opacity: value })
            }),
            h(RangeControl, {
              id: 'dshbg-blur',
              label: translate('blur'),
              value: `${snapshot.blur} px`,
              min: 0,
              max: 40,
              step: 1,
              current: snapshot.blur,
              disabled: !snapshot.image,
              onChange: (value) => store.setSettings({ blur: value })
            })
          ),
          h('p', { className: 'dshbg-note' }, translate('sliderHint')),
          h('p', { className: 'dshbg-note' }, translate('hint')),
          snapshot.image && snapshot.image.bytes > 0
            ? h('p', { className: 'dshbg-note' }, translate('savedNote', { size: formatBytes(snapshot.image.bytes) }))
            : null
        );
      }

      function BackgroundTabPage(props) {
        const translate = props.t || t;
        return h('div', { className: 'dshbg-page' },
          h('div', null,
            h('h3', { className: 'dshbg-title' }, translate('title')),
            h('p', { className: 'dshbg-desc' }, translate('intro'))
          ),
          h(BackgroundForm, { t: translate })
        );
      }

      function BackgroundRowPage(props) {
        const translate = props.t || t;
        if (props.view === 'summary') return translate('summary');
        return h('div', { className: 'dshbg-page' },
          h(BackgroundForm, { t: translate })
        );
      }

      ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
        name: 'settings.plugins.tab',
        id: ROW_ID,
        order: 30,
        label: () => t('tab'),
        locale: NS
      }, BackgroundTabPage));

      ctx.slots.inject('plugins.row.config', () => ctx.slots.register({
        name: 'plugins.row.config',
        key: `${PKG}#${ROW_ID}`,
        locale: NS
      }, BackgroundRowPage));
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply
    };
  }
});
