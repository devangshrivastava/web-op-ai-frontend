import os
import json
from bs4 import BeautifulSoup

# Configuration
ROOT_DIR = os.getcwd()
PAGES_DIR = ROOT_DIR
COMPONENTS_DIR = ROOT_DIR
OUTPUT_FILE = os.path.join(ROOT_DIR, 'spec.json')

spec = {"pages": {}}

def process_html(file_path, url_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f, 'html.parser')
    
    # Determine page ID (fallback to URL path)
    meta = soup.find('meta', attrs={'name': 'page-id'})
    page_id = meta['content'] if meta and 'content' in meta.attrs else url_path

    components = {}
    # Find all elements with a data-type attribute
    for el in soup.find_all(attrs={"data-type": True}):
        el_id = el.get('id')
        if not el_id:
            continue
        
        comp_type = el['data-type']
        actions = [a.strip() for a in el.get('data-actions', '').split(',') if a.strip()]

        comp = {
            "type": comp_type,
            "actions": actions
        }
        # Optional: data-options
        if el.has_attr('data-options'):
            options = [o.strip() for o in el['data-options'].split(',') if o.strip()]
            comp["options"] = options
        
        # Optional: data-validations
        if el.has_attr('data-validations'):
            validations = [v.strip() for v in el['data-validations'].split(',') if v.strip()]
            comp["validations"] = validations
        
        components[el_id] = comp

    spec["pages"][url_path] = {
        "url": url_path,
        "components": components
    }

# Process root index.html
process_html(os.path.join(ROOT_DIR, 'index.html'), '/index.html')

# Process navbar (components/navbar.html)
process_html(os.path.join(COMPONENTS_DIR, 'navbar.html'), '/navbar.html')

# Process all pages in /pages directory
for filename in os.listdir(PAGES_DIR):
    if filename.endswith('.html'):
        file_path = os.path.join(PAGES_DIR, filename)
        url_path = f'/{filename}'
        process_html(file_path, url_path)

# Write to spec.json
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(spec, f, indent=2)

print(f"✅ Generated spec at {OUTPUT_FILE}")
