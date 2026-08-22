import os
import sys
import base64
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
Image.MAX_IMAGE_PIXELS = None

BASE_DIR = r"D:\T&TVina\VEC_2026_2\mockup"
V2_SOURCE_DIR = os.path.join(BASE_DIR, "textures", "V2")
TEXTURE_DIR = os.path.join(BASE_DIR, "textures")

# 1. Map Figma V2 files to target texture names
v2_mappings = [
    {
        "id": "v2_backwall",
        "src": os.path.join(V2_SOURCE_DIR, "vec2026_backwall_full_3000x2500mm 4.png"),
        "dest": os.path.join(TEXTURE_DIR, "v2_backwall.png"),
        "max_w": 2048
    },
    {
        "id": "v2_sidewall",
        "src": os.path.join(V2_SOURCE_DIR, "vec2026_sidewall_full_3000x2500mm 4.png"),
        "dest": os.path.join(TEXTURE_DIR, "v2_sidewall.png"),
        "max_w": 2048
    },
    {
        "id": "v2_valance_front",
        "src": os.path.join(V2_SOURCE_DIR, "vec2026_valance_front_2950x400mm 3.png"),
        "dest": os.path.join(TEXTURE_DIR, "v2_valance_front.png"),
        "max_w": 2048
    },
    {
        "id": "v2_valance_side",
        "src": os.path.join(V2_SOURCE_DIR, "vec2026_valance_side_2950x400mm 4.png"),
        "dest": os.path.join(TEXTURE_DIR, "v2_valance_side.png"),
        "max_w": 2048
    }
]

print("=== [1/2] OPTIMIZING FIGMA V2 PNG TEXTURES (LANCZOS 2048px) ===")
for item in v2_mappings:
    src_file = item["src"]
    dest_file = item["dest"]
    max_w = item["max_w"]
    
    if not os.path.exists(src_file):
        print(f"Warning: Source file not found: {src_file}")
        continue
        
    orig_size_mb = os.path.getsize(src_file) / (1024 * 1024)
    with Image.open(src_file) as im:
        w, h = im.size
        scale = max_w / float(w)
        new_w = int(w * scale)
        new_h = int(h * scale)
        
        # High quality downsampling
        resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
        resized.save(dest_file, format="PNG", optimize=True)
        
    new_size_mb = os.path.getsize(dest_file) / (1024 * 1024)
    print(f"[OK] {os.path.basename(dest_file)}: {w}x{h} ({orig_size_mb:.1f}MB) -> {new_w}x{new_h} ({new_size_mb:.2f}MB)")

print("\n=== [2/2] GENERATING BASE64 DATA SCRIPT (textures_data.js) ===")

all_texture_files = [
    ("v2_backwall", os.path.join(TEXTURE_DIR, "v2_backwall.png")),
    ("v2_sidewall", os.path.join(TEXTURE_DIR, "v2_sidewall.png")),
    ("v2_valance_front", os.path.join(TEXTURE_DIR, "v2_valance_front.png")),
    ("v2_valance_side", os.path.join(TEXTURE_DIR, "v2_valance_side.png")),
    ("v1_backwall", os.path.join(TEXTURE_DIR, "v1_backwall.png")),
    ("v1_sidewall", os.path.join(TEXTURE_DIR, "v1_sidewall.png")),
    ("v1_valance_front", os.path.join(TEXTURE_DIR, "v1_valance_front.png")),
    ("v1_valance_side", os.path.join(TEXTURE_DIR, "v1_valance_side.png")),
    ("root_backdrop", os.path.join(TEXTURE_DIR, "root_backdrop.png")),
    ("root_valance", os.path.join(TEXTURE_DIR, "root_valance.png")),
]

js_path = os.path.join(BASE_DIR, "textures_data.js")
with open(js_path, "w", encoding="utf-8") as f:
    f.write("// Auto-generated optimized Base64 texture payload for 100% offline & fast WebGL loading\n")
    f.write("window.TEXTURE_DATA = {\n")
    for key, path in all_texture_files:
        if os.path.exists(path):
            with open(path, "rb") as img_f:
                b64_str = base64.b64encode(img_f.read()).decode("utf-8")
                f.write(f'  "{key}": "data:image/png;base64,{b64_str}",\n')
                print(f"  + Added {key} ({os.path.getsize(path) // 1024} KB)")
    f.write("};\n")

print(f"\n[SUCCESS] Generated textures_data.js: {os.path.getsize(js_path) / (1024 * 1024):.2f} MB")
