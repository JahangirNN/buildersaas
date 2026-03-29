/**
 * Editor Injection Script
 * Injected into template preview iframes when in editor mode.
 * Enables click-to-select inline editing with postMessage communication.
 */
export function getEditorInjectionScript(): string {
  return `
<style>
  [data-field] {
    cursor: pointer !important;
    transition: outline 0.15s, box-shadow 0.15s !important;
    position: relative !important;
  }
  [data-field]:hover {
    outline: 2px dashed rgba(59,130,246,0.5) !important;
    outline-offset: 4px !important;
  }
  [data-field].sf-active {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 4px !important;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.15) !important;
  }
  [data-field].sf-active::before {
    content: attr(data-field-label) !important;
    position: absolute !important;
    top: -22px !important;
    left: 0 !important;
    background: #3b82f6 !important;
    color: #fff !important;
    font-size: 10px !important;
    font-weight: 700 !important;
    padding: 2px 8px !important;
    border-radius: 4px 4px 0 0 !important;
    font-family: system-ui, sans-serif !important;
    pointer-events: none !important;
    z-index: 99999 !important;
    white-space: nowrap !important;
    letter-spacing: 0.5px !important;
    text-transform: uppercase !important;
  }
</style>
<script>
(function() {
  // Only activate in editor context (inside iframe)
  if (window === window.top) return;

  let activeEl = null;

  const FIELD_LABELS = {
    'HERO_HEADLINE': 'Hero Headline',
    'SUB_HEADLINE': 'Sub Headline',
    'ABOUT_SECTION': 'About Section',
    'CTA_PRIMARY_TEXT': 'Primary Button',
    'CTA_SECONDARY_TEXT': 'Secondary Button',
    'CTA_NAV_TEXT': 'Nav Button',
    'name': 'Business Name',
  };

  function getLabel(field) {
    if (FIELD_LABELS[field]) return FIELD_LABELS[field];
    
    // Handle indexed products: PRODUCT_0_NAME -> Product 1 Name
    if (field.startsWith('PRODUCT_')) {
      const parts = field.split('_');
      const idx = parseInt(parts[1]) + 1;
      const key = parts[parts.length - 1].toLowerCase();
      const keyLabel = key.charAt(0).toUpperCase() + key.slice(1);
      return 'Product ' + idx + ' ' + keyLabel;
    }

    // Generic formatting: HERO_BG_IMAGE -> Hero Bg Image
    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  function discoverFields() {
    const fields = [];
    document.querySelectorAll('[data-field]').forEach(el => {
      const field = el.getAttribute('data-field');
      const isImage = el.tagName === 'IMG' || field.includes('IMAGE') || field.includes('LOGO');
      fields.push({
        id: field,
        label: getLabel(field),
        type: isImage ? 'image' : 'text',
        value: isImage ? el.src : el.innerText.trim()
      });
    });
    window.parent.postMessage({ type: 'sf-discover-fields', fields }, '*');
  }

  function clearActive() {
    if (activeEl) {
      activeEl.classList.remove('sf-active');
      activeEl.removeAttribute('contenteditable');
      activeEl.removeAttribute('data-field-label');
    }
    activeEl = null;
  }

  // Initial discovery
  setTimeout(discoverFields, 500);

  // Click handler for data-field elements
  document.addEventListener('click', function(e) {
    const target = e.target.closest('[data-field]');
    if (!target) {
      clearActive();
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    clearActive();

    const field = target.getAttribute('data-field');
    const isImage = target.tagName === 'IMG' || field.includes('IMAGE') || field.includes('LOGO');

    activeEl = target;
    activeEl.classList.add('sf-active');
    
    if (!isImage) {
      activeEl.setAttribute('contenteditable', 'true');
      activeEl.focus();
    }

    // Add floating label
    target.setAttribute('data-field-label', getLabel(field));
    target.style.position = target.style.position || 'relative';

    // Notify parent
    window.parent.postMessage({
      type: 'sf-field-select',
      field: field,
      value: isImage ? target.src : target.innerText.trim()
    }, '*');
  }, true);

  // On blur / input, send updated value to parent
  document.addEventListener('input', function(e) {
    if (activeEl && activeEl.getAttribute('contenteditable') === 'true') {
      const field = activeEl.getAttribute('data-field');
      window.parent.postMessage({
        type: 'sf-field-update',
        field: field,
        value: activeEl.innerText.trim()
      }, '*');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      clearActive();
      return;
    }
    
    // Prevent Enter from creating new lines in single-line fields
    if (e.key === 'Enter' && activeEl) {
      const field = activeEl.getAttribute('data-field');
      if (field !== 'HERO_HEADLINE' && field !== 'ABOUT_SECTION') {
        e.preventDefault();
        activeEl.blur();
        clearActive();
        return;
      }
    }

    // Isolate Deletion to prevent erasing neighbor elements natively 
    if ((e.key === 'Backspace' || e.key === 'Delete') && activeEl) {
      if (activeEl.innerText.trim().length <= 1) {
        e.preventDefault();
        activeEl.innerText = '\u200B'; // Zero-width space to keep the node alive but look empty
        
        // Let the parent know it's empty
        const field = activeEl.getAttribute('data-field');
        window.parent.postMessage({
          type: 'sf-field-update',
          field: field,
          value: ''
        }, '*');
      }
    }
  });

  // Listen for value updates from parent editor
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'sf-set-field') {
      const fieldName = e.data.field;
      
      const isImageField = fieldName.includes('IMAGE') || fieldName.includes('LOGO');
      // CRITICAL FIX: Do NOT update the DOM element if the user is actively typing inside it!
      // Updating innerHTML/textContent destroys the Native Selection/Caret placement.
      // However, we MUST allow updates if the field is an image, because users upload via the sidebar while the image is active.
      if (!isImageField && activeEl && activeEl.getAttribute('data-field') === fieldName) {
        return; 
      }

      const el = document.querySelector('[data-field="' + fieldName + '"]');
      if (el) {
        const isImg = el.tagName === 'IMG';
        const img = isImg ? el : el.querySelector('img');
        
        if (img) {
          img.src = e.data.value;
          if (e.data.value) {
            img.style.display = 'block';
            // If we're updating a child img, hide other placeholder elements in the container
            if (!isImg) {
              Array.from(el.children).forEach(child => {
                if (child !== img) child.style.display = 'none';
              });
            }
          }
        } else if (isImageField) {
          // Fallback: Create image if it doesn't exist and we have a value
          if (e.data.value) {
            const newImg = document.createElement('img');
            newImg.src = e.data.value;
            newImg.style.width = '100%';
            newImg.style.height = '100%';
            newImg.style.objectFit = 'cover';
            el.innerHTML = '';
            el.appendChild(newImg);
          }
        } else if (fieldName === 'HERO_HEADLINE') {
          el.innerHTML = e.data.value.replace(/\\\\n/g, '<br>');
        } else {
          el.textContent = e.data.value;
        }
      }
    }
  });
})();
</script>`;
}
