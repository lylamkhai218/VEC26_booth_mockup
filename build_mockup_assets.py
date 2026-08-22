import os
import sys
import subprocess
import base64
import time

sys.stdout.reconfigure(encoding='utf-8')

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE_DIR = r"D:\T&TVina\VEC_2026_2"
MOCKUP_DIR = os.path.join(BASE_DIR, "mockup")
TEXTURE_DIR = os.path.join(MOCKUP_DIR, "textures")

os.makedirs(TEXTURE_DIR, exist_ok=True)

svg_tasks = [
    # V2 Visual First (Newest)
    {
        "id": "v2_backwall",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "V2_NEW_VISUAL_FIRST", "vec2026_backwall_full_3000x2500mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v2_backwall.png"),
        "width": 3000,
        "height": 2500
    },
    {
        "id": "v2_sidewall",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "V2_NEW_VISUAL_FIRST", "vec2026_sidewall_full_3000x2500mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v2_sidewall.png"),
        "width": 3000,
        "height": 2500
    },
    {
        "id": "v2_valance_front",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "V2_NEW_VISUAL_FIRST", "vec2026_valance_front_2950x400mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v2_valance_front.png"),
        "width": 2950,
        "height": 400
    },
    {
        "id": "v2_valance_side",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "V2_NEW_VISUAL_FIRST", "vec2026_valance_side_2950x400mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v2_valance_side.png"),
        "width": 2950,
        "height": 400
    },
    # V1 Production Standard
    {
        "id": "v1_backwall",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "vec2026_backwall_full_3000x2500mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v1_backwall.png"),
        "width": 3000,
        "height": 2500
    },
    {
        "id": "v1_sidewall",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "vec2026_sidewall_full_3000x2500mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v1_sidewall.png"),
        "width": 3000,
        "height": 2500
    },
    {
        "id": "v1_valance_front",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "vec2026_valance_front_2950x400mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v1_valance_front.png"),
        "width": 2950,
        "height": 400
    },
    {
        "id": "v1_valance_side",
        "src": os.path.join(BASE_DIR, "04_PRODUCTION_SVG", "vec2026_valance_side_2950x400mm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "v1_valance_side.png"),
        "width": 2950,
        "height": 400
    },
    # Root Classic
    {
        "id": "root_backdrop",
        "src": os.path.join(BASE_DIR, "Murrplastik_Backdrop_295x210cm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "root_backdrop.png"),
        "width": 2950,
        "height": 2100
    },
    {
        "id": "root_valance",
        "src": os.path.join(BASE_DIR, "Murrplastik_Valance_295x40cm.svg"),
        "dest": os.path.join(TEXTURE_DIR, "root_valance.png"),
        "width": 2950,
        "height": 400
    }
]

print("Rendering high-res PNG textures via Headless Edge...")
for item in svg_tasks:
    src_file = item["src"]
    dest_file = item["dest"]
    w = item["width"]
    h = item["height"]
    
    if not os.path.exists(src_file):
        print(f"Skipping missing file: {src_file}")
        continue

    # Scale so max dimension is 2048
    scale = 2048 / max(w, h)
    render_w = int(w * scale)
    render_h = int(h * scale)

    temp_html = os.path.join(TEXTURE_DIR, "_temp_render.html")
    with open(src_file, "r", encoding="utf-8") as f:
        svg_content = f.read()

    html_content = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{ background: #ffffff; width: {render_w}px; height: {render_h}px; overflow: hidden; }}
  svg {{ width: 100%; height: 100%; display: block; }}
</style>
</head>
<body>
{svg_content}
</body>
</html>"""
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    cmd = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--window-size={render_w},{render_h}",
        f"--screenshot={dest_file}",
        temp_html
    ]
    
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"[OK] Rendered: {os.path.basename(dest_file)} ({render_w}x{render_h})")

if os.path.exists(temp_html):
    os.remove(temp_html)

print("Building textures_data.js with Base64 for 100% CORS-free offline execution...")
js_output = os.path.join(MOCKUP_DIR, "textures_data.js")

with open(js_output, "w", encoding="utf-8") as js_f:
    js_f.write("// Auto-generated base64 texture cache for offline & local file:// support\n")
    js_f.write("window.TEXTURE_DATA = {\n")
    for item in svg_tasks:
        dest_file = item["dest"]
        if os.path.exists(dest_file):
            with open(dest_file, "rb") as img_f:
                b64_data = base64.b64encode(img_f.read()).decode("utf-8")
                js_f.write(f'  "{item["id"]}": "data:image/png;base64,{b64_data}",\n')
    js_f.write("};\n")

print(f"[SUCCESS] Generated {js_output} ({os.path.getsize(js_output) // 1024} KB)")
